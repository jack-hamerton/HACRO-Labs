import express from 'express';
import fs from 'fs';
import path from 'path';
import rateLimit from 'express-rate-limit';
import pb, { authPb, authenticateSuperuser, SUPERUSER_EMAIL, SUPERUSER_PASSWORD } from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { generateToken, generatePassword, validatePassword } from '../utils/adminUtils.js';
import { verifyAdminToken, requireSuperAdmin } from '../middleware/adminAuth.js';

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later.' },
});

const router = express.Router();
const logFile = path.resolve(path.join(process.cwd(), 'logs', 'api.log'));
function appendLog(...parts) { try { fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${parts.join(' ')}\n`); } catch (e) {} }

 

                    

                                             

 
router.post('/login', authRateLimiter, async (req, res) => {
  const { email, password } = req.body;

  

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required',
    });
  }

  

  

                         

                                                                     



                                                                            

                                                                                        

     



                        

                                                              

                                                              

                                 

                                                                                                     

       

   

  

  const now = new Date();

  

  let authData;
  try {
    authData = await authPb.collection('pbc_admins_auth').authWithPassword(email, password);
  } catch (error) {
    logger.warn(`Failed login attempt for ${email}:`, error.message);
    appendLog('[ADMIN LOGIN ERROR]', 'email=', email, 'error=', error.stack || error.message || error);
    console.error('[ADMIN LOGIN ERROR]', error);

    

    if (email === SUPERUSER_EMAIL && SUPERUSER_PASSWORD) {
      try {
        const superuserAuth = await authPb.collection('_superusers').authWithPassword(email, password);
        await authenticateSuperuser();

        const existingAdmins = await pb.collection('pbc_admins_auth').getFullList({
          filter: `email = "${email}"`,
          $autoCancel: false,
        });

        let adminRecord;
        if (existingAdmins.length > 0) {
          adminRecord = existingAdmins[0];
          try {
            await pb.collection('pbc_admins_auth').update(adminRecord.id, {
              password,
              passwordConfirm: password,
            });
          } catch (updateError) {
            logger.warn(`Could not update pbc_admins_auth password for ${email}:`, updateError.message || updateError);
          }
        } else {
          await authenticateSuperuser();
          adminRecord = await pb.collection('pbc_admins_auth').create({
            email,
            password,
            passwordConfirm: password,
            full_name: 'Super Admin',
            role: 'super_admin',
            verified: true,
          });
        }

        authData = {
          token: superuserAuth.token,
          record: {
            ...adminRecord,
            collectionName: 'pbc_admins_auth',
          },
        };
      } catch (adminFallbackError) {
        logger.warn(`Superuser fallback auth failed for ${email}:`, adminFallbackError.message || adminFallbackError);
        return res.status(401).json({
          error: 'Invalid email or password',
        });
      }
    } else {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }
  }

  

  

                                              

                            

                                                                       

   

  

  

  const token = generateToken();
  const expiresDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('user-agent') || 'unknown';

  

  let createdSession = false;
  if (SUPERUSER_EMAIL && SUPERUSER_PASSWORD) {
    try {
      await authenticateSuperuser();
      await pb.collection('admin_sessions').create({
        admin_id: authData.record.id,
        token,
        expires_date: expiresDate.toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent,
      });
      createdSession = true;
    } catch (error) {
      logger.warn('Skipping admin session creation:', error.message || error);
    }
  } else {
    logger.warn('POCKETBASE_SUPERUSER_EMAIL / POCKETBASE_ADMIN_EMAIL and POCKETBASE_SUPERUSER_PASSWORD / POCKETBASE_ADMIN_PASSWORD not configured; skipping admin session creation.');
  }

  

  try {
    await pb.collection('pbc_admins_auth').update(authData.record.id, {
      last_login: now.toISOString(),
    });
  } catch (error) {
    logger.warn(`Could not update last_login for admin ${authData.record.id}:`, error.response?.message || error.message || error);
  }

  

  try {
    await pb.collection('admin_activity_log').create({
      admin_id: authData.record.id,
      action: 'login',
      details: `Admin logged in from ${ipAddress}`,
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  } catch (error) {
    logger.warn('Failed to write admin login activity log:', error.message || error);
  }

  logger.info(`Admin logged in: ${email}`);

  const responseToken = createdSession ? token : authData.token;

  const normalizedRole = authData.record.role === 'admin' ? 'super_admin' : authData.record.role || 'super_admin';

  res.json({
    token: responseToken,
    admin: {
      id: authData.record.id,
      email: authData.record.email,
      full_name: authData.record.full_name || `${authData.record.first_name || ''} ${authData.record.last_name || ''}`.trim() || authData.record.email,
      role: normalizedRole,
    },
  });
});

 

                     

                                  

 
router.post('/logout', verifyAdminToken, async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      error: 'Token is required',
    });
  }

  if (SUPERUSER_EMAIL && SUPERUSER_PASSWORD) {
    try {
      await authenticateSuperuser();
      const sessions = await pb.collection('admin_sessions').getFullList({
        filter: `token = "${token}"`,
      });

      if (sessions.length > 0) {
        const adminId = sessions[0].admin_id;
        await pb.collection('admin_sessions').delete(sessions[0].id);

        

        try {
          await pb.collection('admin_activity_log').create({
            admin_id: adminId,
            action: 'logout',
            details: 'Admin logged out',
            ip_address: req.ip || req.connection.remoteAddress || 'unknown',
            user_agent: req.get('user-agent') || 'unknown',
          });
        } catch (err) {
          logger.warn('Failed to write admin logout activity log:', err.message || err);
        }

        logger.info(`Admin logged out: ${adminId}`);
      }
    } catch (error) {
      logger.warn('Skipping admin session deletion during logout:', error.message || error);
    }
  } else {
    logger.warn('POCKETBASE_SUPERUSER_EMAIL / POCKETBASE_ADMIN_EMAIL and POCKETBASE_SUPERUSER_PASSWORD / POCKETBASE_ADMIN_PASSWORD not configured; skipping session cleanup on logout.');
  }

  res.json({ success: true });
});

 

             

                                 

 
router.get('/', verifyAdminToken, requireSuperAdmin, async (req, res) => {
  const admins = await pb.collection('pbc_admins_auth').getFullList({
    sort: '-created',
    $autoCancel: false,
  });

  res.json({
    admins: admins.map((admin) => ({
      id: admin.id,
      email: admin.email,
      full_name: admin.full_name,
      role: admin.role,
      is_active: admin.is_active,
      phone: admin.phone || null,
      payment_amount: admin.payment_amount || null,
      permissions: admin.permissions || [],
      created: admin.created,
    })),
  });
});

 

                       

                                        

 
router.post('/register', verifyAdminToken, requireSuperAdmin, async (req, res) => {
  const { full_name, email, role, password, is_active, permissions, phone, payment_amount } = req.body;

  

  if (!full_name || !email || !role) {
    return res.status(400).json({
      error: 'full_name, email, and role are required',
    });
  }

  

  let assignedRole = role;
  try {
    const staffMembers = await pb.collection('staff_members').getFullList({
      filter: `email = "${email}"`,
      $autoCancel: false
    });
    if (staffMembers.length > 0) {
      assignedRole = 'super_admin';
    }
  } catch (error) {
    

  }

  

  const validRoles = ['super_admin', 'admin', 'moderator'];
  if (!validRoles.includes(assignedRole)) {
    return res.status(400).json({
      error: `Role must be one of: ${validRoles.join(', ')}`,
    });
  }

  

  const existingAdmins = await pb.collection('pbc_admins_auth').getFullList({
    filter: `email = "${email}"`,
  });

  if (existingAdmins.length > 0) {
    return res.status(400).json({
      error: 'Email already exists',
    });
  }

  

  const temporaryPassword = password || generatePassword();

  const createData = {
    email,
    password: temporaryPassword,
    passwordConfirm: temporaryPassword,
    full_name,
    role: assignedRole,
    is_active: is_active !== undefined ? is_active : true,
  };

  if (phone) {
    createData.phone = phone;
  }

  const parsedPayout = Number(payment_amount);
  if (!Number.isNaN(parsedPayout) && parsedPayout > 0) {
    createData.payment_amount = parsedPayout;
  } else if (assignedRole === 'super_admin') {
    createData.payment_amount = 30000;
  }

  if (permissions !== undefined) {
    createData.permissions = typeof permissions === 'string' ? permissions : JSON.stringify(permissions);
  }

  

  const newAdmin = await pb.collection('pbc_admins_auth').create(createData);

  

  await pb.collection('admin_activity_log').create({
    admin_id: req.adminId,
    action: 'admin_added',
    details: `Added new admin: ${email} with role: ${assignedRole}`,
    ip_address: req.ip || req.connection.remoteAddress || 'unknown',
    user_agent: req.get('user-agent') || 'unknown',
  });

  logger.info(`New admin registered: ${email} by ${req.adminId}`);

  

  


  res.json({
    admin: {
      id: newAdmin.id,
      email: newAdmin.email,
      full_name: newAdmin.full_name,
      role: newAdmin.role,
    },
    ...(password ? {} : { temporaryPassword }),
  });
});

 

                              

                        

 
router.post('/change-password', verifyAdminToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      error: 'currentPassword and newPassword are required',
    });
  }

  

  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.valid) {
    return res.status(400).json({
      error: passwordValidation.message,
    });
  }

  

  const admin = await pb.collection('pbc_admins_auth').getOne(req.adminId);

  

  try {
    await authPb.collection('pbc_admins_auth').authWithPassword(admin.email, currentPassword);
  } catch (error) {
    logger.warn(`Failed password change attempt for ${admin.email}`);
    return res.status(401).json({
      error: 'Current password is incorrect',
    });
  }

  

  await pb.collection('pbc_admins_auth').update(req.adminId, {
    password: newPassword,
    passwordConfirm: newPassword,
  });

  

  await pb.collection('admin_activity_log').create({
    admin_id: req.adminId,
    action: 'password_changed',
    ip_address: req.ip || req.connection.remoteAddress || 'unknown',
    user_agent: req.get('user-agent') || 'unknown',
  });

  logger.info(`Password changed for admin: ${admin.email}`);

  res.json({ success: true });
});

 

                     

                            

 
router.get('/profile', verifyAdminToken, async (req, res) => {
  const admin = await pb.collection('pbc_admins_auth').getOne(req.adminId);

  const normalizedRole = admin.role === 'admin' ? 'super_admin' : admin.role || 'admin';

  res.json({
    id: admin.id,
    email: admin.email,
    full_name: admin.full_name || `${admin.first_name || ''} ${admin.last_name || ''}`.trim() || admin.email,
    role: normalizedRole,
    phone: admin.phone || null,
    created_date: admin.created,
    last_login: admin.last_login || null,
    is_active: admin.is_active,
  });
});

 

                     

                               

 
router.put('/profile', verifyAdminToken, async (req, res) => {
  const { full_name, phone } = req.body;

  

  if (!full_name && !phone) {
    return res.status(400).json({
      error: 'At least one field (full_name or phone) is required',
    });
  }

  const updateData = {};
  if (full_name) updateData.full_name = full_name;
  if (phone) updateData.phone = phone;

  

  const updatedAdmin = await pb.collection('pbc_admins_auth').update(req.adminId, updateData);

  

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

 

                          

                                      

 
router.get('/activity-log', verifyAdminToken, async (req, res) => {
  const { page = 1, limit = 20, action, startDate, endDate, adminId, search } = req.query;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
  const offset = (pageNum - 1) * limitNum;

  

  const filters = [];

  if (action) {
    filters.push(`action = "${action}"`);
  }

  if (adminId) {
    filters.push(`admin_id = "${adminId}"`);
  }

  if (startDate) {
    filters.push(`created >= "${startDate}"`);
  }

  if (endDate) {
    filters.push(`created <= "${endDate}"`);
  }

  if (search) {
    filters.push(`(details ~ "${search}" || ip_address ~ "${search}")`);
  }

  const filterString = filters.length > 0 ? filters.join(' && ') : '';

  

  const records = await pb.collection('admin_activity_log').getFullList({
    filter: filterString,
    sort: '-created_date',
    skip: offset,
    take: limitNum,
  });

  

  const allRecords = await pb.collection('admin_activity_log').getFullList({
    filter: filterString,
  });

  res.json({
    records: records.map((record) => ({
      id: record.id,
      admin_id: record.admin_id,
      action: record.action,
      description: record.details || record.description || null,
      details: record.details || record.description || null,
      ip_address: record.ip_address,
      user_agent: record.user_agent,
      timestamp: record.created,
      created_date: record.created,
    })),
    total: allRecords.length,
    page: pageNum,
    limit: limitNum,
  });
});

 

                           

                                      

 
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

 

                      

                                  

 
router.put('/:adminId', verifyAdminToken, requireSuperAdmin, async (req, res) => {
  const { adminId } = req.params;
  const { full_name, email, role, is_active, password, permissions, phone, payment_amount } = req.body;

  

  if (!full_name && !email && !role && is_active === undefined && phone === undefined && payment_amount === undefined) {
    return res.status(400).json({
      error: 'At least one field is required',
    });
  }

  

  if (role) {
    const validRoles = ['super_admin', 'admin', 'moderator'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: `Role must be one of: ${validRoles.join(', ')}`,
      });
    }
  }

  

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
  if (phone !== undefined) updateData.phone = phone;
  if (payment_amount !== undefined) {
    const parsedPayout = Number(payment_amount);
    updateData.payment_amount = Number.isNaN(parsedPayout) ? 0 : parsedPayout;
  }
  if (password) {
    updateData.password = password;
    updateData.passwordConfirm = password;
  }
  if (permissions !== undefined) {
    updateData.permissions = typeof permissions === 'string' ? permissions : JSON.stringify(permissions);
  }

  

  const updatedAdmin = await pb.collection('pbc_admins_auth').update(adminId, updateData);

  

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

 

                         

                                  

 
router.delete('/:adminId', verifyAdminToken, requireSuperAdmin, async (req, res) => {
  const { adminId } = req.params;

  

  if (adminId === req.adminId) {
    return res.status(400).json({
      error: 'Cannot delete your own admin account',
    });
  }

  

  const admin = await pb.collection('pbc_admins_auth').getOne(adminId);

  

  const sessions = await pb.collection('admin_sessions').getFullList({
    filter: `admin_id = "${adminId}"`,
  });

  for (const session of sessions) {
    await pb.collection('admin_sessions').delete(session.id);
  }

  

  await pb.collection('pbc_admins_auth').delete(adminId);

  

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

 

                              

                         

 
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: 'Email is required',
    });
  }

  

  const admins = await pb.collection('pbc_admins_auth').getFullList({
    filter: `email = "${email}"`,
  });

  if (admins.length === 0) {
    

    return res.json({
      message: 'If an account with this email exists, a password reset link has been sent',
    });
  }

  const admin = admins[0];

  

  const resetToken = generateToken();
  const expiresDate = new Date(Date.now() + 60 * 60 * 1000); 


  

  await pb.collection('admin_password_resets').create({
    admin_id: admin.id,
    token: resetToken,
    expires_date: expiresDate.toISOString(),
  });

  logger.info(`Password reset requested for: ${email}`);

  

  


  res.json({
    message: 'If an account with this email exists, a password reset link has been sent',
  });
});

 

                             

                            

 
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      error: 'Token and newPassword are required',
    });
  }

  

  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.valid) {
    return res.status(400).json({
      error: passwordValidation.message,
    });
  }

  

  const resetRecords = await pb.collection('admin_password_resets').getFullList({
    filter: `token = "${token}"`,
  });

  if (resetRecords.length === 0) {
    return res.status(400).json({
      error: 'Invalid or expired reset token',
    });
  }

  const resetRecord = resetRecords[0];

  

  if (new Date(resetRecord.expires_date) < new Date()) {
    await pb.collection('admin_password_resets').delete(resetRecord.id);
    return res.status(400).json({
      error: 'Reset token has expired',
    });
  }

  const adminId = resetRecord.admin_id;

  

  await pb.collection('pbc_admins_auth').update(adminId, {
    password: newPassword,
    passwordConfirm: newPassword,
  });

  

  await pb.collection('admin_password_resets').delete(resetRecord.id);

  

  await pb.collection('admin_activity_log').create({
    admin_id: adminId,
    action: 'password_changed',
    details: 'Password reset via forgot-password',
  });

  logger.info(`Password reset completed for admin: ${adminId}`);

  res.json({ success: true });
});

 

                              

                                              

 
router.get('/company-accounts', verifyAdminToken, async (req, res) => {
  try {
    let companyTransactions = [];
    try {
      companyTransactions = await pb.collection('company_transactions').getFullList({
        sort: '-date',
        $autoCancel: false
      });
    } catch (error) {
      console.log('company_transactions collection not found, aggregating from other sources');
    }

    const registrationPayments = await pb.collection('payments').getFullList({
      filter: '(payment_type = "registration" || payment_type = "registration_installment") && payment_status = "completed"',
      $autoCancel: false
    });

    const insurancePayments = await pb.collection('payments').getFullList({
      filter: 'payment_type = "insurance" && payment_status = "completed"',
      $autoCancel: false
    });

    const completedDonations = await pb.collection('donations').getFullList({
      filter: 'payment_status = "completed"',
      $autoCancel: false
    });

    const loanRecords = await pb.collection('loans').getFullList({ $autoCancel: false });
    const companyInterestRecords = await pb.collection('contributions_history').getFullList({
      filter: 'type = "company_interest_bonus"',
      $autoCancel: false
    });
    const allAdmins = await pb.collection('pbc_admins_auth').getFullList({ $autoCancel: false });

    const registrationTotal = registrationPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const insuranceTotal = insurancePayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const donationTotal = completedDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const interestTotal = companyInterestRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
    const loanPrincipalTotal = loanRecords.reduce((sum, l) => sum + (l.amount || 0), 0);

    const adminPayouts = allAdmins.map((admin) => {
      const rawAmount = Number(admin.payment_amount);
      const defaultAmount = admin.role === 'super_admin' ? 30000 : 0;
      const payment_amount = Number.isFinite(rawAmount) && rawAmount > 0 ? rawAmount : defaultAmount;
      return {
        id: admin.id,
        full_name: admin.full_name || `${admin.first_name || ''} ${admin.last_name || ''}`.trim() || admin.email,
        email: admin.email,
        phone: admin.phone || null,
        role: admin.role,
        is_active: admin.is_active !== false,
        payment_amount,
      };
    });

    const activeAdminPayouts = adminPayouts.filter((admin) => admin.is_active);
    const totalAdminPayouts = activeAdminPayouts.reduce((sum, admin) => sum + admin.payment_amount, 0);
    const rentPayment = 15000;
    const totalRevenue = registrationTotal + insuranceTotal + interestTotal;
    const totalIncome = totalRevenue + donationTotal;
    const totalExpenses = totalAdminPayouts + rentPayment;
    const companyRemaining = totalIncome - totalExpenses;
    const adminPayoutDue = companyRemaining < 0 ? Math.abs(companyRemaining) : 0;

    const allMembers = await pb.collection('members').getFullList({ $autoCancel: false });
    const memberSummaries = [];

    for (const member of allMembers) {
      const memberId = member.id;

      const savingsContributions = await pb.collection('contributions_history').getFullList({
        filter: `member_id = "${memberId}" && type = "savings_contribution"`,
        $autoCancel: false
      });
      const totalSavings = savingsContributions.reduce((sum, c) => sum + (c.amount || 0), 0);

      const loanRepayments = await pb.collection('loan_repayments').getFullList({
        filter: `member_id = "${memberId}"`,
        $autoCancel: false
      });
      const totalRepayments = loanRepayments.reduce((sum, r) => sum + (r.amount || 0), 0);

      const memberInsurancePayments = await pb.collection('payments').getFullList({
        filter: `member_id = "${memberId}" && payment_type = "insurance" && payment_status = "completed"`,
        $autoCancel: false
      });
      const totalInsurance = memberInsurancePayments.reduce((sum, p) => sum + (p.amount || 0), 0);

      memberSummaries.push({
        member_id: memberId,
        member_name: `${member.first_name} ${member.last_name}`,
        total_savings: totalSavings,
        total_repayments: totalRepayments,
        total_insurance: totalInsurance,
        total_contributions: totalSavings + totalRepayments + totalInsurance
      });
    }

    const totalMemberContributions = memberSummaries.reduce((sum, m) => sum + m.total_contributions, 0);

    const recentTransactions = companyTransactions && companyTransactions.length > 0
      ? companyTransactions.slice(0, 50).map((t) => ({
          id: t.id,
          type: t.transaction_type,
          amount: t.amount,
          description: t.description,
          member_id: t.member_id,
          date: t.date
        }))
      : [
          ...registrationPayments.map((p) => ({
            id: `registration-${p.id}`,
            type: 'registration',
            amount: p.amount,
            description: p.payment_type === 'registration_installment' ? 'Registration installment' : 'Registration fee',
            member_id: p.member_id,
            date: p.payment_date || p.created || null,
          })),
          ...insurancePayments.map((p) => ({
            id: `insurance-${p.id}`,
            type: 'insurance_fee',
            amount: p.amount,
            description: 'Insurance fee',
            member_id: p.member_id,
            date: p.payment_date || p.created || null,
          })),
          ...completedDonations.map((d) => ({
            id: `donation-${d.id}`,
            type: 'donation',
            amount: d.amount,
            description: d.purpose || 'Donation',
            member_id: d.donor_phone || null,
            date: d.payment_date || d.created || null,
          })),
        ]
          .filter((tx) => tx.date)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 50);

    res.json({
      company_overview: {
        total_revenue: totalRevenue,
        registration_fees: registrationTotal,
        insurance_fees: insuranceTotal,
        donation_total: donationTotal,
        interest_bonuses: interestTotal,
        loan_principal_total: loanPrincipalTotal,
        total_income: totalIncome,
        total_expenses: totalExpenses,
        admin_payouts: totalAdminPayouts,
        rent_payment: rentPayment,
        admin_payout_due: adminPayoutDue,
        company_remaining: companyRemaining,
        total_member_contributions: totalMemberContributions,
        net_position: companyRemaining
      },
      recent_transactions: recentTransactions,
      admin_payouts: adminPayouts,
      member_summaries: memberSummaries,
      transaction_breakdown: {
        by_type: {
          registration: registrationPayments.length,
          insurance: insurancePayments.length,
          donations: completedDonations.length,
          interest: companyInterestRecords.length,
        },
        by_month: {}
      }
    });

  } catch (error) {
    console.error('Error fetching company accounts:', error);
    res.status(500).json({
      error: 'Failed to fetch company accounts data'
    });
  }
});

 

                            

                                                  

                                                     

 
router.get('/members/search', verifyAdminToken, async (req, res) => {
  try {
    const { q, limit = 50 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        error: 'Search query required'
      });
    }

    const searchTerm = q.trim().toLowerCase();

    

    const members = await pb.collection('members').getFullList({
      $autoCancel: false
    });

    

    const filteredMembers = members.filter(member => {
      const firstName = (member.first_name || '').toLowerCase();
      const lastName = (member.last_name || '').toLowerCase();
      const email = (member.email || '').toLowerCase();
      const phone = (member.phone_number || '').toLowerCase();
      const id = member.id.toLowerCase();

      return firstName.includes(searchTerm) || 
             lastName.includes(searchTerm) || 
             email.includes(searchTerm) || 
             phone.includes(searchTerm) || 
             id.includes(searchTerm);
    }).slice(0, limit);

    

    const membersWithGroups = await Promise.all(
      filteredMembers.map(async (member) => {
        try {
          const groupMembers = await pb.collection('group_members').getFirstListItem(
            `member_id="${member.id}"`,
            { $autoCancel: false }
          );
          return {
            ...member,
            group_id: groupMembers.group_id,
            group_name: groupMembers.expand?.group_id?.name || 'N/A'
          };
        } catch {
          return {
            ...member,
            group_id: null,
            group_name: 'Unassigned'
          };
        }
      })
    );

    res.json({
      total: filteredMembers.length,
      members: membersWithGroups.map(m => ({
        id: m.id,
        first_name: m.first_name,
        last_name: m.last_name,
        email: m.email,
        phone_number: m.phone_number,
        group_id: m.group_id,
        group_name: m.group_name,
        created: m.created
      }))
    });

  } catch (error) {
    logger.error('Member search error:', error);
    res.status(500).json({
      error: 'Failed to search members'
    });
  }
});

 

                                       

                                                                                

 
router.get('/members/:memberId/summary', verifyAdminToken, async (req, res) => {
  try {
    const { memberId } = req.params;

    

    const member = await pb.collection('members').getOne(memberId, { $autoCancel: false });

    

    let groupInfo = null;
    try {
      const groupMember = await pb.collection('group_members').getFirstListItem(
        `member_id="${memberId}"`,
        { expand: 'group_id', $autoCancel: false }
      );
      groupInfo = groupMember.expand?.group_id || null;
    } catch (e) {
      

    }

    

    const savings = await pb.collection('savings').getFullList({
      filter: `member_id="${memberId}"`,
      sort: '-date',
      $autoCancel: false
    });

    const totalSavings = savings.reduce((sum, s) => sum + s.amount, 0);

    

    const loans = await pb.collection('loans').getFullList({
      filter: `member_id="${memberId}"`,
      sort: '-created',
      $autoCancel: false
    });

    const loansSummary = loans.map(loan => ({
      id: loan.id,
      amount: loan.amount,
      status: loan.status,
      created: loan.created,
      interest_rate: loan.interest_rate,
      repayment_period: loan.repayment_period
    }));

    const totalLoansBorrowed = loans.reduce((sum, l) => sum + l.amount, 0);

    

    const repayments = await pb.collection('loan_repayments').getFullList({
      filter: `member_id="${memberId}"`,
      sort: '-date',
      $autoCancel: false
    });

    const totalRepaid = repayments.reduce((sum, r) => sum + r.amount, 0);

    

    const payments = await pb.collection('payments').getFullList({
      filter: `member_id="${memberId}"`,
      sort: '-payment_date',
      $autoCancel: false
    });

    

    const contributionHistory = await pb.collection('contributions_history').getFullList({
      filter: `member_id="${memberId}"`,
      sort: '-date',
      $autoCancel: false
    });

    const paymentsSummary = {
      total_payments: payments.length,
      by_type: {},
      recent: payments.slice(0, 20).map(p => ({
        id: p.id,
        type: p.payment_type,
        amount: p.amount,
        status: p.payment_status,
        date: p.payment_date,
        reference: p.mpesa_reference
      }))
    };

    

    payments.forEach(p => {
      if (!paymentsSummary.by_type[p.payment_type]) {
        paymentsSummary.by_type[p.payment_type] = { count: 0, total: 0 };
      }
      paymentsSummary.by_type[p.payment_type].count++;
      if (p.payment_status === 'completed') {
        paymentsSummary.by_type[p.payment_type].total += p.amount;
      }
    });

    

    let donationsSummary = { total_donated: 0, donations: [] };
    try {
      const donations = await pb.collection('donations').getFullList({
        filter: `donor_phone="${member.phone_number}"`,
        sort: '-created',
        $autoCancel: false
      });
      donationsSummary = {
        total_donated: donations
          .filter(d => d.payment_status === 'completed')
          .reduce((sum, d) => sum + d.amount, 0),
        donations: donations.slice(0, 10).map(d => ({
          id: d.id,
          amount: d.amount,
          purpose: d.purpose,
          status: d.payment_status,
          date: d.payment_date
        }))
      };
    } catch (e) {
      

    }

    res.json({
      member: {
        id: member.id,
        first_name: member.first_name,
        last_name: member.last_name,
        email: member.email,
        phone_number: member.phone_number,
        location: member.location,
        profile_picture: member.profile_picture,
        created: member.created,
        group: groupInfo ? { id: groupInfo.id, name: groupInfo.name } : null
      },
      savings: {
        total_saved: totalSavings,
        contribution_count: savings.length,
        recent_contributions: savings.slice(0, 20)
      },
      loans: {
        total_borrowed: totalLoansBorrowed,
        active_loans: loans.filter(l => l.status === 'active').length,
        completed_loans: loans.filter(l => l.status === 'completed').length,
        loans: loansSummary,
        total_repaid: totalRepaid,
        recent_repayments: repayments.slice(0, 10)
      },
      payments: paymentsSummary,
      contributions: {
        total_records: contributionHistory.length,
        recent: contributionHistory.slice(0, 20)
      },
      donations: donationsSummary,
      summary: {
        account_status: 'active',
        member_since: member.created,
        total_savings: totalSavings,
        total_borrowed: totalLoansBorrowed,
        total_repaid: totalRepaid,
        outstanding_balance: Math.max(0, totalLoansBorrowed - totalRepaid),
        total_contributed: contributionHistory.reduce((sum, c) => sum + c.amount, 0),
        total_donations: donationsSummary.total_donated
      }
    });

  } catch (error) {
    logger.error('Member summary error:', error);
    if (error.statusCode === 404) {
      return res.status(404).json({
        error: 'Member not found'
      });
    }
    res.status(500).json({
      error: 'Failed to fetch member summary'
    });
  }
});

export default router;
