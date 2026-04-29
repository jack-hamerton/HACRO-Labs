import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { generateToken, generatePassword, validatePassword } from '../utils/adminUtils.js';
import { verifyAdminToken, requireSuperAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

/**
 * POST /admin/login
 * Authenticate admin with email and password
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

  const attempts = await pb.collection('admin_login_attempts').getFullList({
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

  // Attempt authentication
  let authData;
  try {
    authData = await pb.collection('pbc_admins_auth').authWithPassword(email, password);
  } catch (error) {
    logger.warn(`Failed login attempt for ${email}:`, error.message);

    // Increment failed attempts (disabled for development)
    /*
    // Increment failed attempts
    if (attempts.length > 0) {
      await pb.collection('admin_login_attempts').update(attempts[0].id, {
        attempt_count: attempts[0].attempt_count + 1,
      });
    } else {
      await pb.collection('admin_login_attempts').create({
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
    await pb.collection('admin_login_attempts').delete(attempts[0].id);
  }
  */

  // Generate session token
  const token = generateToken();
  const expiresDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('user-agent') || 'unknown';

  // Create session
  await pb.collection('admin_sessions').create({
    admin_id: authData.record.id,
    token,
    expires_date: expiresDate.toISOString(),
    ip_address: ipAddress,
    user_agent: userAgent,
  });

  // Update last login
  await pb.collection('pbc_admins_auth').update(authData.record.id, {
    last_login: now.toISOString(),
  });

  // Log activity
  await pb.collection('admin_activity_log').create({
    admin_id: authData.record.id,
    action: 'login',
    ip_address: ipAddress,
    user_agent: userAgent,
  });

  logger.info(`Admin logged in: ${email}`);

  res.json({
    token,
    admin: {
      id: authData.record.id,
      email: authData.record.email,
      full_name: authData.record.full_name,
      role: authData.record.role,
    },
  });
});

/**
 * POST /admin/logout
 * Logout admin and delete session
 */
router.post('/logout', verifyAdminToken, async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      error: 'Token is required',
    });
  }

  // Find and delete session
  const sessions = await pb.collection('admin_sessions').getFullList({
    filter: `token = "${token}"`,
  });

  if (sessions.length > 0) {
    const adminId = sessions[0].admin_id;
    await pb.collection('admin_sessions').delete(sessions[0].id);

    // Log activity
    await pb.collection('admin_activity_log').create({
      admin_id: adminId,
      action: 'logout',
      ip_address: req.ip || req.connection.remoteAddress || 'unknown',
      user_agent: req.get('user-agent') || 'unknown',
    });

    logger.info(`Admin logged out: ${adminId}`);
  }

  res.json({ success: true });
});

/**
 * POST /admin/register
 * Register new admin (super-admin only)
 */
router.post('/register', verifyAdminToken, requireSuperAdmin, async (req, res) => {
  const { full_name, email, role } = req.body;

  // Validate input
  if (!full_name || !email || !role) {
    return res.status(400).json({
      error: 'full_name, email, and role are required',
    });
  }

  // Validate role
  const validRoles = ['super_admin', 'admin', 'moderator'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      error: `Role must be one of: ${validRoles.join(', ')}`,
    });
  }

  // Check if email already exists
  const existingAdmins = await pb.collection('pbc_admins_auth').getFullList({
    filter: `email = "${email}"`,
  });

  if (existingAdmins.length > 0) {
    return res.status(400).json({
      error: 'Email already exists',
    });
  }

  // Generate temporary password
  const temporaryPassword = generatePassword();

  // Create admin
  const newAdmin = await pb.collection('pbc_admins_auth').create({
    email,
    password: temporaryPassword,
    passwordConfirm: temporaryPassword,
    full_name,
    role,
    is_active: true,
  });

  // Log activity
  await pb.collection('admin_activity_log').create({
    admin_id: req.adminId,
    action: 'admin_added',
    details: `Added new admin: ${email} with role: ${role}`,
    ip_address: req.ip || req.connection.remoteAddress || 'unknown',
    user_agent: req.get('user-agent') || 'unknown',
  });

  logger.info(`New admin registered: ${email} by ${req.adminId}`);

  // Note: Email sending is handled by PocketBase hooks
  // The temporary password should be sent via PocketBase email hook

  res.json({
    admin: {
      id: newAdmin.id,
      email: newAdmin.email,
      full_name: newAdmin.full_name,
      role: newAdmin.role,
    },
    temporaryPassword,
  });
});

/**
 * POST /admin/change-password
 * Change admin password
 */
router.post('/change-password', verifyAdminToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validate input
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      error: 'currentPassword and newPassword are required',
    });
  }

  // Validate new password
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.valid) {
    return res.status(400).json({
      error: passwordValidation.message,
    });
  }

  // Get admin record
  const admin = await pb.collection('pbc_admins_auth').getOne(req.adminId);

  // Verify current password
  try {
    await pb.collection('pbc_admins_auth').authWithPassword(admin.email, currentPassword);
  } catch (error) {
    logger.warn(`Failed password change attempt for ${admin.email}`);
    return res.status(401).json({
      error: 'Current password is incorrect',
    });
  }

  // Update password
  await pb.collection('pbc_admins_auth').update(req.adminId, {
    password: newPassword,
    passwordConfirm: newPassword,
  });

  // Log activity
  await pb.collection('admin_activity_log').create({
    admin_id: req.adminId,
    action: 'password_changed',
    ip_address: req.ip || req.connection.remoteAddress || 'unknown',
    user_agent: req.get('user-agent') || 'unknown',
  });

  logger.info(`Password changed for admin: ${admin.email}`);

  res.json({ success: true });
});

/**
 * GET /admin/profile
 * Get current admin profile
 */
router.get('/profile', verifyAdminToken, async (req, res) => {
  const admin = await pb.collection('pbc_admins_auth').getOne(req.adminId);

  res.json({
    id: admin.id,
    email: admin.email,
    full_name: admin.full_name,
    role: admin.role,
    phone: admin.phone || null,
    created_date: admin.created,
    last_login: admin.last_login || null,
    is_active: admin.is_active,
  });
});

/**
 * PUT /admin/profile
 * Update current admin profile
 */
router.put('/profile', verifyAdminToken, async (req, res) => {
  const { full_name, phone } = req.body;

  // Validate input
  if (!full_name && !phone) {
    return res.status(400).json({
      error: 'At least one field (full_name or phone) is required',
    });
  }

  const updateData = {};
  if (full_name) updateData.full_name = full_name;
  if (phone) updateData.phone = phone;

  // Update admin
  const updatedAdmin = await pb.collection('pbc_admins_auth').update(req.adminId, updateData);

  // Log activity
  await pb.collection('admin_activity_log').create({
    admin_id: req.adminId,
    action: 'admin_updated',
    details: 'Updated own profile',
    ip_address: req.ip || req.connection.remoteAddress || 'unknown',
    user_agent: req.get('user-agent') || 'unknown',
  });

  logger.info(`Admin profile updated: ${req.adminId}`);

  res.json({
    id: updatedAdmin.id,
    email: updatedAdmin.email,
    full_name: updatedAdmin.full_name,
    role: updatedAdmin.role,
    phone: updatedAdmin.phone || null,
    created_date: updatedAdmin.created,
    last_login: updatedAdmin.last_login || null,
    is_active: updatedAdmin.is_active,
  });
});

/**
 * GET /admin/activity-log
 * Get admin activity log with filters
 */
router.get('/activity-log', verifyAdminToken, async (req, res) => {
  const { page = 1, limit = 20, action, startDate, endDate, adminId, search } = req.query;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
  const offset = (pageNum - 1) * limitNum;

  // Build filter
  const filters = [];

  if (action) {
    filters.push(`action = "${action}"`);
  }

  if (adminId) {
    filters.push(`admin_id = "${adminId}"`);
  }

  if (startDate) {
    filters.push(`created_date >= "${startDate}"`);
  }

  if (endDate) {
    filters.push(`created_date <= "${endDate}"`);
  }

  if (search) {
    filters.push(`(details ~ "${search}" || ip_address ~ "${search}")`);
  }

  const filterString = filters.length > 0 ? filters.join(' && ') : '';

  // Fetch records
  const records = await pb.collection('admin_activity_log').getFullList({
    filter: filterString,
    sort: '-created_date',
    skip: offset,
    take: limitNum,
  });

  // Get total count
  const allRecords = await pb.collection('admin_activity_log').getFullList({
    filter: filterString,
  });

  res.json({
    records: records.map((record) => ({
      id: record.id,
      admin_id: record.admin_id,
      action: record.action,
      details: record.details || null,
      ip_address: record.ip_address,
      user_agent: record.user_agent,
      created_date: record.created,
    })),
    total: allRecords.length,
    page: pageNum,
    limit: limitNum,
  });
});

/**
 * GET /admin/login-history
 * Get login history for current admin
 */
router.get('/login-history', verifyAdminToken, async (req, res) => {
  const sessions = await pb.collection('admin_sessions').getFullList({
    filter: `admin_id = "${req.adminId}"`,
    sort: '-created_date',
  });

  res.json({
    sessions: sessions.map((session) => ({
      created_date: session.created,
      ip_address: session.ip_address,
      user_agent: session.user_agent,
      expires_date: session.expires_date,
    })),
  });
});

/**
 * PUT /admin/:adminId
 * Update admin (super-admin only)
 */
router.put('/:adminId', verifyAdminToken, requireSuperAdmin, async (req, res) => {
  const { adminId } = req.params;
  const { full_name, email, role, is_active } = req.body;

  // Validate input
  if (!full_name && !email && !role && is_active === undefined) {
    return res.status(400).json({
      error: 'At least one field is required',
    });
  }

  // Validate role if provided
  if (role) {
    const validRoles = ['super_admin', 'admin', 'moderator'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: `Role must be one of: ${validRoles.join(', ')}`,
      });
    }
  }

  // Check if email already exists (if changing email)
  if (email) {
    const existingAdmins = await pb.collection('pbc_admins_auth').getFullList({
      filter: `email = "${email}" && id != "${adminId}"`,
    });

    if (existingAdmins.length > 0) {
      return res.status(400).json({
        error: 'Email already exists',
      });
    }
  }

  const updateData = {};
  if (full_name) updateData.full_name = full_name;
  if (email) updateData.email = email;
  if (role) updateData.role = role;
  if (is_active !== undefined) updateData.is_active = is_active;

  // Update admin
  const updatedAdmin = await pb.collection('pbc_admins_auth').update(adminId, updateData);

  // Log activity
  await pb.collection('admin_activity_log').create({
    admin_id: req.adminId,
    action: 'admin_updated',
    details: `Updated admin: ${adminId}`,
    ip_address: req.ip || req.connection.remoteAddress || 'unknown',
    user_agent: req.get('user-agent') || 'unknown',
  });

  logger.info(`Admin updated: ${adminId} by ${req.adminId}`);

  res.json({
    id: updatedAdmin.id,
    email: updatedAdmin.email,
    full_name: updatedAdmin.full_name,
    role: updatedAdmin.role,
    is_active: updatedAdmin.is_active,
  });
});

/**
 * DELETE /admin/:adminId
 * Delete admin (super-admin only)
 */
router.delete('/:adminId', verifyAdminToken, requireSuperAdmin, async (req, res) => {
  const { adminId } = req.params;

  // Prevent deleting self
  if (adminId === req.adminId) {
    return res.status(400).json({
      error: 'Cannot delete your own admin account',
    });
  }

  // Get admin before deletion for logging
  const admin = await pb.collection('pbc_admins_auth').getOne(adminId);

  // Delete all sessions for this admin
  const sessions = await pb.collection('admin_sessions').getFullList({
    filter: `admin_id = "${adminId}"`,
  });

  for (const session of sessions) {
    await pb.collection('admin_sessions').delete(session.id);
  }

  // Delete admin
  await pb.collection('pbc_admins_auth').delete(adminId);

  // Log activity
  await pb.collection('admin_activity_log').create({
    admin_id: req.adminId,
    action: 'admin_deleted',
    details: `Deleted admin: ${admin.email}`,
    ip_address: req.ip || req.connection.remoteAddress || 'unknown',
    user_agent: req.get('user-agent') || 'unknown',
  });

  logger.info(`Admin deleted: ${adminId} by ${req.adminId}`);

  res.json({ success: true });
});

/**
 * POST /admin/forgot-password
 * Request password reset
 */
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: 'Email is required',
    });
  }

  // Find admin by email
  const admins = await pb.collection('pbc_admins_auth').getFullList({
    filter: `email = "${email}"`,
  });

  if (admins.length === 0) {
    // Don't reveal if email exists
    return res.json({
      message: 'If an account with this email exists, a password reset link has been sent',
    });
  }

  const admin = admins[0];

  // Generate reset token
  const resetToken = generateToken();
  const expiresDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Create password reset record
  await pb.collection('admin_password_resets').create({
    admin_id: admin.id,
    token: resetToken,
    expires_date: expiresDate.toISOString(),
  });

  logger.info(`Password reset requested for: ${email}`);

  // Note: Email sending is handled by PocketBase hooks
  // The reset link should be sent via PocketBase email hook

  res.json({
    message: 'If an account with this email exists, a password reset link has been sent',
  });
});

/**
 * POST /admin/reset-password
 * Reset password with token
 */
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      error: 'Token and newPassword are required',
    });
  }

  // Validate new password
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.valid) {
    return res.status(400).json({
      error: passwordValidation.message,
    });
  }

  // Find reset token
  const resetRecords = await pb.collection('admin_password_resets').getFullList({
    filter: `token = "${token}"`,
  });

  if (resetRecords.length === 0) {
    return res.status(400).json({
      error: 'Invalid or expired reset token',
    });
  }

  const resetRecord = resetRecords[0];

  // Check if token is expired
  if (new Date(resetRecord.expires_date) < new Date()) {
    await pb.collection('admin_password_resets').delete(resetRecord.id);
    return res.status(400).json({
      error: 'Reset token has expired',
    });
  }

  const adminId = resetRecord.admin_id;

  // Update password
  await pb.collection('pbc_admins_auth').update(adminId, {
    password: newPassword,
    passwordConfirm: newPassword,
  });

  // Delete reset token
  await pb.collection('admin_password_resets').delete(resetRecord.id);

  // Log activity
  await pb.collection('admin_activity_log').create({
    admin_id: adminId,
    action: 'password_changed',
    details: 'Password reset via forgot-password',
  });

  logger.info(`Password reset completed for admin: ${adminId}`);

  res.json({ success: true });
});

/**
 * GET /admin/company-accounts
 * Get company financial overview (admin only)
 */
router.get('/company-accounts', verifyAdminToken, async (req, res) => {
  try {
    // Get all company transactions (assuming we have a company_transactions collection)
    // If not, we'll aggregate from various sources
    let companyTransactions = [];
    try {
      companyTransactions = await pb.collection('company_transactions').getFullList({
        sort: '-date',
        $autoCancel: false
      });
    } catch (error) {
      // If collection doesn't exist, we'll aggregate from other sources
      console.log('company_transactions collection not found, aggregating from other sources');
    }

    // Aggregate registration fees
    const registrationPayments = await pb.collection('payments').getFullList({
      filter: 'payment_type = "registration" && payment_status = "completed"',
      $autoCancel: false
    });

    // Aggregate insurance fees
    const insurancePayments = await pb.collection('payments').getFullList({
      filter: 'payment_type = "insurance" && payment_status = "completed"',
      $autoCancel: false
    });

    // Aggregate interest bonuses distributed to company
    const companyInterestRecords = await pb.collection('contributions_history').getFullList({
      filter: 'type = "company_interest_bonus"',
      $autoCancel: false
    });

    // Calculate totals
    const registrationTotal = registrationPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const insuranceTotal = insurancePayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const interestTotal = companyInterestRecords.reduce((sum, r) => sum + (r.amount || 0), 0);

    // Get member transaction summary
    const allMembers = await pb.collection('members').getFullList({ $autoCancel: false });
    const memberSummaries = [];

    for (const member of allMembers) {
      const memberId = member.id;

      // Total savings contributions
      const savingsContributions = await pb.collection('contributions_history').getFullList({
        filter: `member_id = "${memberId}" && type = "savings_contribution"`,
        $autoCancel: false
      });
      const totalSavings = savingsContributions.reduce((sum, c) => sum + (c.amount || 0), 0);

      // Total loan repayments
      const loanRepayments = await pb.collection('loan_repayments').getFullList({
        filter: `member_id = "${memberId}"`,
        $autoCancel: false
      });
      const totalRepayments = loanRepayments.reduce((sum, r) => sum + (r.amount || 0), 0);

      // Total insurance payments
      const insurancePayments = await pb.collection('payments').getFullList({
        filter: `member_id = "${memberId}" && payment_type = "insurance" && payment_status = "completed"`,
        $autoCancel: false
      });
      const totalInsurance = insurancePayments.reduce((sum, p) => sum + (p.amount || 0), 0);

      memberSummaries.push({
        member_id: memberId,
        member_name: `${member.first_name} ${member.last_name}`,
        total_savings: totalSavings,
        total_repayments: totalRepayments,
        total_insurance: totalInsurance,
        total_contributions: totalSavings + totalRepayments + totalInsurance
      });
    }

    // Calculate overall totals
    const totalRevenue = registrationTotal + insuranceTotal + interestTotal;
    const totalMemberContributions = memberSummaries.reduce((sum, m) => sum + m.total_contributions, 0);

    res.json({
      company_overview: {
        total_revenue: totalRevenue,
        registration_fees: registrationTotal,
        insurance_fees: insuranceTotal,
        interest_bonuses: interestTotal,
        total_member_contributions: totalMemberContributions,
        net_position: totalRevenue - totalMemberContributions // This might be negative as expected
      },
      recent_transactions: companyTransactions.slice(0, 50).map(t => ({
        id: t.id,
        type: t.transaction_type,
        amount: t.amount,
        description: t.description,
        member_id: t.member_id,
        date: t.date
      })),
      member_summaries: memberSummaries,
      transaction_breakdown: {
        by_type: {
          registration: registrationPayments.length,
          insurance: insurancePayments.length,
          interest: companyInterestRecords.length
        },
        by_month: {} // Could be enhanced to show monthly breakdown
      }
    });

  } catch (error) {
    console.error('Error fetching company accounts:', error);
    res.status(500).json({
      error: 'Failed to fetch company accounts data'
    });
  }
});

export default router;
