import express from 'express';
import rateLimit from 'express-rate-limit';
import pb, { authPb, authenticateSuperuser, POCKETBASE_URL } from '../utils/pocketbaseClient.js';
import membersPassword from './membersPassword.js';
import logger from '../utils/logger.js';
import { generateToken } from '../utils/adminUtils.js';
import { verifyMemberToken } from '../middleware/memberAuth.js';

const router = express.Router();

const memberLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 8 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later.' },
});

const memberRegistrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 5 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many registration attempts. Please try again later.' },
});

router.post('/register', memberRegistrationLimiter, async (req, res) => {
  const {
    first_name, middle_name, last_name, age, category, field_officer,
    email, phone, password, location, hub_area, group_action, group_id, group_name,
  } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedPhone = String(phone || '').replace(/\D/g, '');
  const normalizedAge = Number(age);
  const normalizedLocation = String(location || '').trim();

  if (!first_name || !last_name || !normalizedEmail || !normalizedPhone || !password || !normalizedLocation || !field_officer || !category) {
    return res.status(400).json({ error: 'Complete all required registration fields.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return res.status(400).json({ error: 'Enter a valid email address.' });
  if (String(password).length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  if (!Number.isInteger(normalizedAge) || normalizedAge < 18 || normalizedAge > 120) return res.status(400).json({ error: 'Members must be at least 18 years old.' });
  if (!['join', 'create'].includes(group_action)) return res.status(400).json({ error: 'Choose a group to join or provide a new group name.' });
  if (group_action === 'join' && !group_id) return res.status(400).json({ error: 'Select a group to join.' });
  if (group_action === 'create' && !String(group_name || '').trim()) return res.status(400).json({ error: 'Enter a name for your new group.' });

  try {
    await authenticateSuperuser();
    if (!pb.authStore.isValid) return res.status(503).json({ error: 'Registration service is unavailable.' });

    const duplicateEmail = await pb.collection('members').getFirstListItem(`email = "${normalizedEmail.replaceAll('"', '\\"')}"`, { $autoCancel: false }).catch(() => null);
    if (duplicateEmail) return res.status(409).json({ error: 'An account with this email already exists. Please sign in instead.' });

    const member = await pb.collection('members').create({
      first_name: String(first_name).trim(),
      middle_name: String(middle_name || '').trim(),
      last_name: String(last_name).trim(),
      age: normalizedAge,
      category: String(category).trim(),
      field_officer: String(field_officer).trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      location: normalizedLocation,
      hub_area: String(hub_area || normalizedLocation).trim(),
      password: String(password),
      passwordConfirm: String(password),
    }, { $autoCancel: false });

    try {
      let group;
      if (group_action === 'create') {
        group = await pb.collection('groups').create({
          group_name: String(group_name).trim(),
          region: normalizedLocation,
          field_officer: String(field_officer).trim(),
          description: `Community group created by ${String(first_name).trim()} ${String(last_name).trim()} during registration`,
        }, { $autoCancel: false });
      } else {
        group = await pb.collection('groups').getOne(String(group_id), { $autoCancel: false });
        if (String(group.region || '').toLowerCase() !== normalizedLocation.toLowerCase()) {
          throw new Error('The selected group does not match your registration location.');
        }
      }

      await pb.collection('group_members').create({
        group_id: group.id,
        member_id: member.id,
        joined_date: new Date().toISOString(),
      }, { $autoCancel: false });

      try {
        const areaLocation = String(hub_area || normalizedLocation).trim();
        const existingArea = await pb.collection('hub_areas').getFirstListItem(`location = "${areaLocation.replaceAll('"', '\\"')}"`, { $autoCancel: false }).catch(() => null);
        if (!existingArea) {
          const parts = areaLocation.split(',').map((part) => part.trim()).filter(Boolean);
          await pb.collection('hub_areas').create({
            owner: member.id,
            name: parts[0] || areaLocation,
            location: areaLocation,
            labor_market_notes: '',
            sectors: [],
            verified: false,
          }, { $autoCancel: false });
        }
      } catch (areaError) {
        logger.warn('Could not queue registration area for verification:', areaError?.response?.message || areaError.message || areaError);
      }

      return res.status(201).json({ member, group, registration_fee: 0, payment_required: false });
    } catch (groupError) {
      await pb.collection('members').delete(member.id, { $autoCancel: false }).catch((cleanupError) => {
        logger.error('Failed to clean up incomplete registration:', cleanupError?.message || cleanupError);
      });
      throw groupError;
    }
  } catch (error) {
    logger.error('Member registration failed:', error?.response?.message || error.message || error);
    return res.status(400).json({ error: error?.response?.message || error.message || 'Registration could not be completed.' });
  }
});

 

                      

                                                              

 
router.post('/login', memberLoginLimiter, async (req, res) => {
  const { email, identity, password } = req.body;
  const loginField = identity ?? email;
  const rawIdentity = String(loginField || '').trim();

  

  if (!rawIdentity || !password) {
    return res.status(400).json({
      error: 'Email and password are required',
    });
  }

  const normalizedIdentity = rawIdentity.replace(/\s+/g, '');
  const isPhone = /^\+?[0-9]{9,15}$/.test(normalizedIdentity);
  const loginIdentity = isPhone ? normalizedIdentity.replace(/^\+/, '') : normalizedIdentity;

  

  let authData;
  try {
    if (isPhone) {
      const localPhone = loginIdentity.startsWith('254') ? `0${loginIdentity.slice(3)}` : loginIdentity;
      // Authenticate as superuser via admin endpoint and query members over HTTP (reliable)
      const adminEmail = process.env.POCKETBASE_SUPERUSER_EMAIL || process.env.POCKETBASE_ADMIN_EMAIL || 'admin@example.com';
      const adminPass = process.env.POCKETBASE_SUPERUSER_PASSWORD || process.env.POCKETBASE_ADMIN_PASSWORD || 'Admin123!';
      const authRes = await fetch(`${POCKETBASE_URL}/api/collections/_superusers/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: adminEmail, password: adminPass }),
      });
      const authJson = await authRes.json();
      const token = authJson.token;
      const filter = encodeURIComponent(`(phone = "${loginIdentity}" || phone = "${localPhone}")`);
      const membersRes = await fetch(`${POCKETBASE_URL}/api/collections/members/records?filter=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const membersJson = await membersRes.json();
      const members = membersJson?.items || [];
      if (members.length >= 1 && members[0].email) {
        // Use direct HTTP call to PocketBase auth endpoint to avoid SDK client auth state issues
        const resp = await fetch(`${POCKETBASE_URL}/api/collections/members/auth-with-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identity: members[0].email, password }),
        });
        if (!resp.ok) throw new Error(`PocketBase auth failed: HTTP ${resp.status}`);
        authData = await resp.json();
      } else {
        throw new Error('No matching member for phone login');
      }
    } else {
      authData = await authPb.collection('members').authWithPassword(loginIdentity, password);
    }
  } catch (error) {
    logger.warn(`Failed member login attempt for ${rawIdentity}:`, error.message);
    return res.status(401).json({
      error: 'Invalid email or password',
    });
  }

  

  

                         

                                                                     



                                                                             

                                                                                                

     



                        

                                                              

                                                                      

                                 

                                                                                                     

       

   

  

  const now = new Date();

  

  

                                              

                            

                                                                        

   

  

  

  const token = generateToken();
  const expiresDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('user-agent') || 'unknown';

  

  await authenticateSuperuser();

  

  await pb.collection('member_sessions').create({
    member_id: authData.record.id,
    token,
    expires_date: expiresDate.toISOString(),
    ip_address: ipAddress,
    user_agent: userAgent,
  });

  

  try {
    await pb.collection('members').update(authData.record.id, {
      last_login: now.toISOString(),
    });
  } catch (error) {
    logger.warn(`Could not update last_login for member ${authData.record.id}:`, error.response?.message || error.message || error);
  }

  

  await pb.collection('admin_activity_log').create({
    admin_id: null, 

    action: 'member_login',
    details: `Member ${authData.record.email} logged in`,
    ip_address: ipAddress,
    user_agent: userAgent,
  });

  logger.info(`Member logged in: ${email}`);

  res.json({
    token,
    member: {
      id: authData.record.id,
      email: authData.record.email,
      first_name: authData.record.first_name,
      last_name: authData.record.last_name,
      full_name: `${authData.record.first_name || ''} ${authData.record.last_name || ''}`.trim() || 'Member',
      phone: authData.record.phone,
      member_number: authData.record.member_number,
    },
  });
});

 

                       

                                   

 
router.post('/logout', verifyMemberToken, async (req, res) => {
  

  await authenticateSuperuser();

  

  const sessions = await pb.collection('member_sessions').getFullList({
    filter: `member_id = "${req.memberId}"`,
  });

  if (sessions.length > 0) {
    await pb.collection('member_sessions').delete(sessions[0].id);

    

    await pb.collection('admin_activity_log').create({
      admin_id: null,
      action: 'member_logout',
      details: `Member ${req.member.email} logged out`,
      ip_address: req.ip || req.connection.remoteAddress || 'unknown',
      user_agent: req.get('user-agent') || 'unknown',
    });

    logger.info(`Member logged out: ${req.member.email}`);
  }

  res.json({ success: true });
});

 

                       

                             

 
router.get('/profile', verifyMemberToken, async (req, res) => {
  try {
    const member = req.member;

    res.json({
      id: member.id,
      email: member.email,
      first_name: member.first_name,
      last_name: member.last_name,
      full_name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Member',
      phone: member.phone,
      member_number: member.member_number,
      created: member.created,
      updated: member.updated,
    });
  } catch (error) {
    logger.error('Profile fetch error:', error);
    res.status(500).json({
      error: 'Something went wrong',
    });
  }
});

export default router;



router.use('/password', membersPassword);