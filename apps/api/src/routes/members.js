import express from 'express';
import pb, { authPb, authenticateSuperuser } from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { generateToken } from '../utils/adminUtils.js';
import { verifyMemberToken } from '../middleware/memberAuth.js';

const router = express.Router();

/**
 * POST /members/login
 * Authenticate member with email and password
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required',
    });
  }

  // Check rate limiting (disabled for development)
  /*
  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

  const attempts = await pb.collection('member_login_attempts').getFullList({
    filter: `email = "${email}" && created_date > "${fifteenMinutesAgo.toISOString()}"`,
  });

  // Check if locked out
  if (attempts.length > 0 && attempts[0].attempt_count >= 5) {
    logger.warn(`Login attempt for locked account: ${email}`);
    return res.status(429).json({
      error: 'Account locked due to too many failed login attempts. Please try again in 15 minutes.',
    });
  }
  */

  const now = new Date();

  // Attempt authentication
  let authData;
  try {
    authData = await authPb.collection('members').authWithPassword(email, password);
  } catch (error) {
    logger.warn(`Failed login attempt for ${email}:`, error.message);

    // Increment failed attempts (disabled for development)
    /*
    // Increment failed attempts
    if (attempts.length > 0) {
      await pb.collection('member_login_attempts').update(attempts[0].id, {
        attempt_count: attempts[0].attempt_count + 1,
      });
    } else {
      await pb.collection('member_login_attempts').create({
        email,
        attempt_count: 1,
      });
    }
    */

    return res.status(401).json({
      error: 'Invalid email or password',
    });
  }

  // Clear failed attempts on successful login (disabled for development)
  /*
  // Clear failed attempts on successful login
  if (attempts.length > 0) {
    await pb.collection('member_login_attempts').delete(attempts[0].id);
  }
  */

  // Generate session token
  const token = generateToken();
  const expiresDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('user-agent') || 'unknown';

  // Authenticate superuser for privileged operations
  await authenticateSuperuser();

  // Create session
  await pb.collection('member_sessions').create({
    member_id: authData.record.id,
    token,
    expires_date: expiresDate.toISOString(),
    ip_address: ipAddress,
    user_agent: userAgent,
  });

  // Update last login if the field exists
  try {
    await pb.collection('members').update(authData.record.id, {
      last_login: now.toISOString(),
    });
  } catch (error) {
    logger.warn(`Could not update last_login for member ${authData.record.id}:`, error.response?.message || error.message || error);
  }

  // Log activity
  await pb.collection('admin_activity_log').create({
    admin_id: null, // No admin ID for member login
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

/**
 * POST /members/logout
 * Logout member and delete session
 */
router.post('/logout', verifyMemberToken, async (req, res) => {
  // Authenticate superuser for privileged operations
  await authenticateSuperuser();

  // Find and delete session
  const sessions = await pb.collection('member_sessions').getFullList({
    filter: `member_id = "${req.memberId}"`,
  });

  if (sessions.length > 0) {
    await pb.collection('member_sessions').delete(sessions[0].id);

    // Log activity
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

/**
 * GET /members/profile
 * Get current member profile
 */
router.get('/profile', async (req, res) => {
  try {
    if (!pb.authStore.isValid) {
      return res.status(401).json({
        error: 'Not authenticated',
      });
    }

    const member = pb.authStore.model;

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