import { Router } from 'express';
import pb, { authenticateSuperuser } from '../utils/pocketbaseClient.js';
import { verifyAdminToken } from '../middleware/adminAuth.js';
import logger from '../utils/logger.js';

const router = Router();
const permissionsOf = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return [];
  try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : []; }
  catch { return value.split(',').map((item) => item.trim()).filter(Boolean); }
};
const canManageHub = (req) => req.adminRole === 'super_admin' || req.adminRole === 'admin' || permissionsOf(req.admin?.permissions).includes('manage_hub');

router.get('/pending', verifyAdminToken, async (req, res) => {
  if (!canManageHub(req)) return res.status(403).json({ error: 'Hub verification permission required.' });
  try {
    await authenticateSuperuser();
    const [areas, stakeholders] = await Promise.all([
      pb.collection('hub_areas').getFullList({ filter: 'verified = false', sort: '-created', $autoCancel: false }),
      pb.collection('hub_stakeholders').getFullList({ filter: 'verified = false', sort: '-created', expand: 'area_id', $autoCancel: false }),
    ]);
    return res.json({ areas, stakeholders });
  } catch (error) {
    logger.error('Failed to load pending Hub reviews:', error?.response?.message || error.message || error);
    return res.status(error?.status || 500).json({ error: error?.response?.message || 'Unable to load pending Hub reviews.' });
  }
});

router.patch('/areas/:id/verification', verifyAdminToken, async (req, res) => {
  if (!canManageHub(req)) return res.status(403).json({ error: 'Hub verification permission required.' });
  const { verified } = req.body || {};
  if (typeof verified !== 'boolean') return res.status(400).json({ error: 'verified must be a boolean.' });
  try {
    await authenticateSuperuser();
    const area = await pb.collection('hub_areas').update(req.params.id, { verified }, { $autoCancel: false });
    return res.json({ area });
  } catch (error) {
    logger.error('Hub area verification failed:', error?.response?.message || error.message || error);
    return res.status(error?.status || 400).json({ error: error?.response?.message || 'Unable to update area verification.' });
  }
});

router.patch('/stakeholders/:id/verification', verifyAdminToken, async (req, res) => {
  if (!canManageHub(req)) return res.status(403).json({ error: 'Hub verification permission required.' });
  const { verified } = req.body || {};
  if (typeof verified !== 'boolean') return res.status(400).json({ error: 'verified must be a boolean.' });
  try {
    await authenticateSuperuser();
    const stakeholder = await pb.collection('hub_stakeholders').update(req.params.id, { verified }, { $autoCancel: false });
    return res.json({ stakeholder });
  } catch (error) {
    logger.error('Hub stakeholder verification failed:', error?.response?.message || error.message || error);
    return res.status(error?.status || 400).json({ error: error?.response?.message || 'Unable to update stakeholder verification.' });
  }
});

export default router;
