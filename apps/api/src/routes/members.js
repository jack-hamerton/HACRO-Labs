import express from 'express';
import rateLimit from 'express-rate-limit';
import pb, { authPb, authenticateSuperuser } from '../utils/pocketbaseClient.js';
import membersPassword from './membersPassword.js';
import logger from '../utils/logger.js';
import { generateToken } from '../utils/adminUtils.js';
import { verifyMemberToken } from '../middleware/memberAuth.js';

const router = express.Router();

const memberLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later.' },
});

 

                      

                                                              

 
router.post('/login', memberLoginLimiter, async (req, res) => {
  const { email, identity, password } = req.body;
  const loginField = identity ?? email;
  const rawIdentity = String(loginField || '').trim();

  

  if (!rawIdentity || !password) {
    return res.status(400).json({
      error: 'Email/phone and password are required',
    });
  }

  const normalizedIdentity = rawIdentity.replace(/\s+/g, '');
  const isPhone = /^\+?[0-9]{9,15}$/.test(normalizedIdentity);
  const loginIdentity = isPhone ? normalizedIdentity.replace(/^\+/, '') : normalizedIdentity;

  

  let authData;
  try {
    if (isPhone) {
      const members = await authPb.collection('members').getFullList({
        filter: `phone = "${loginIdentity}"`,
      });
      if (members.length === 1 && members[0].email) {
        authData = await authPb.collection('members').authWithPassword(members[0].email, password);
      } else {
        throw new Error('No matching member for phone login');
      }
    } else {
      authData = await authPb.collection('members').authWithPassword(loginIdentity, password);
    }
  } catch (error) {
    logger.warn(`Failed member login attempt for ${rawIdentity}:`, error.message);
    return res.status(401).json({
      error: 'Invalid email/phone or password',
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