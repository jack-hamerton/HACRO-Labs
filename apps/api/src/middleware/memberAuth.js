import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

/**
 * Middleware to verify member token from Authorization header
 * Sets req.memberId and req.member on success
 */
export async function verifyMemberToken(req, res, next) {
  const authHeader = req.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Missing or invalid Authorization header',
    });
  }

  const token = authHeader.substring(7);

  // Find session by token
  const sessions = await pb.collection('member_sessions').getFullList({
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
    await pb.collection('member_sessions').delete(session.id);
    return res.status(401).json({
      error: 'Token has expired',
    });
  }

  // Get member details
  const member = await pb.collection('members').getOne(session.member_id);

  // Set member info on request
  req.memberId = member.id;
  req.member = member;

  next();
}

export default {
  verifyMemberToken,
};