import pb, { authenticateSuperuser } from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

/**
 * Middleware to verify admin token from Authorization header
 * Sets req.adminId and req.adminRole on success
 */
export async function verifyAdminToken(req, res, next) {
  const authHeader = req.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Missing or invalid Authorization header',
    });
  }

  const token = authHeader.substring(7);

  // Authenticate as superuser to read collections
  await authenticateSuperuser();

  // Find session by token
  const sessions = await pb.collection('admin_sessions').getFullList({
    filter: `token = "${token}"`,
  });

  if (sessions.length === 0) {
    return res.status(401).json({
      error: 'Invalid or expired token',
    });
  }

  const session = sessions[0];

  // Check if session is expired
  if (new Date(session.expires_date) < new Date()) {
    await pb.collection('admin_sessions').delete(session.id);
    return res.status(401).json({
      error: 'Token has expired',
    });
  }

  // Get admin details - try both collection names
  let admin;
  try {
    admin = await pb.collection('admins').getOne(session.admin_id);
  } catch (err) {
    try {
      admin = await pb.collection('pbc_admins_auth').getOne(session.admin_id);
    } catch (err2) {
      return res.status(404).json({
        error: 'Admin not found',
      });
    }
  }

  // Check if admin is active - handle missing field
  if (admin.is_active === false) {
    return res.status(403).json({
      error: 'Admin account is inactive',
    });
  }

  // Set admin info on request
  req.adminId = admin.id;
  req.adminRole = admin.role || 'admin';
  req.adminEmail = admin.email;
  req.admin = admin;

  next();
}

/**
 * Middleware to require super_admin role
 * Must be used after verifyAdminToken
 */
export function requireSuperAdmin(req, res, next) {
  if (req.adminRole !== 'super_admin') {
    logger.warn(`Unauthorized access attempt by ${req.adminEmail} (role: ${req.adminRole})`);
    return res.status(403).json({
      error: 'This action requires super_admin role',
    });
  }

  next();
}

export default {
  verifyAdminToken,
  requireSuperAdmin,
};
