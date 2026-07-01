import pb, {
  authenticateSuperuser,
  SUPERUSER_EMAIL,
  SUPERUSER_PASSWORD,
} from '../utils/pocketbaseClient.js';
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

  const token = authHeader.substring(7).trim();

  const getActiveAdmin = (admin) => {
    if (!admin || !admin.id) return null;
    if (admin.is_active === false) return null;
    return admin;
  };

  const tryDirectAdminToken = async () => {
    try {
      pb.authStore.save(token, null);
      const authData = await pb.collection('pbc_admins_auth').authRefresh({ autoRefresh: false });
      const admin = getActiveAdmin(authData?.record || pb.authStore.model);
      if (admin) {
        return admin;
      }
    } catch (error) {
      // Direct admin token validation failed, fallback to session lookup.
    }
    return null;
  };

  const tryAdminSession = async () => {
    if (!SUPERUSER_EMAIL || !SUPERUSER_PASSWORD) {
      return null;
    }

    await authenticateSuperuser();

    const sessions = await pb.collection('admin_sessions').getFullList({
      filter: `token = "${token}"`,
    });

    if (sessions.length === 0) {
      return null;
    }

    const session = sessions[0];
    if (new Date(session.expires_date) < new Date()) {
      try {
        await pb.collection('admin_sessions').delete(session.id);
      } catch (err) {
        logger.warn('Failed to delete expired admin session:', err.message || err);
      }
      return null;
    }

    try {
      let admin = await pb.collection('pbc_admins_auth').getOne(session.admin_id);
      return getActiveAdmin(admin);
    } catch (err) {
      try {
        const admin = await pb.collection('admins').getOne(session.admin_id);
        return getActiveAdmin(admin);
      } catch (err2) {
        return null;
      }
    }
  };

  try {
    let admin = await tryDirectAdminToken();

    if (!admin) {
      admin = await tryAdminSession();
    }

    if (!admin) {
      return res.status(401).json({
        error: 'Invalid or expired token',
      });
    }

    req.adminId = admin.id;
    const normalizedRole = admin.role === 'admin' ? 'super_admin' : admin.role || 'admin';
    req.adminRole = normalizedRole;
    req.adminEmail = admin.email;
    req.admin = { ...admin, role: normalizedRole };

    next();
  } catch (err) {
    logger.error('Admin verification error:', err.message || err);
    return res.status(401).json({
      error: 'Invalid or expired token',
    });
  }
}

/**
 * Middleware to require super_admin role
 * Must be used after verifyAdminToken
 */
export function requireSuperAdmin(req, res, next) {
  if (req.adminRole !== 'super_admin' && req.adminRole !== 'admin') {
    logger.warn(`Unauthorized access attempt by ${req.adminEmail} (role: ${req.adminRole})`);
    return res.status(403).json({
      error: 'This action requires super_admin privileges',
    });
  }

  next();
}

export default {
  verifyAdminToken,
  requireSuperAdmin,
};
