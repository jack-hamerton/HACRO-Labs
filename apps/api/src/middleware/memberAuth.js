import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

 

                                                              

                                              

 
export async function verifyMemberToken(req, res, next) {
  const authHeader = req.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Missing or invalid Authorization header',
    });
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    return res.status(401).json({
      error: 'Missing or invalid token',
    });
  }

  

  const sessions = await pb.collection('member_sessions').getFullList({
    filter: `token = "${token}"`,
  });

  if (sessions.length === 0) {
    return res.status(401).json({
      error: 'Invalid or expired token',
    });
  }

  const session = sessions[0];

  

  if (new Date(session.expires_date) < new Date()) {
    await pb.collection('member_sessions').delete(session.id);
    return res.status(401).json({
      error: 'Token has expired',
    });
  }

  

  const member = await pb.collection('members').getOne(session.member_id);

  

  req.memberId = member.id;
  req.member = member;

  next();
}

export default {
  verifyMemberToken,
};