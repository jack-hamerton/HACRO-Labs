import { Router } from 'express';
import pb, { authenticateSuperuser } from '../utils/pocketbaseClient.js';

const router = Router();



router.post('/', async (req, res, next) => {
  try {
    await authenticateSuperuser();
    const { title, description, group } = req.body;
    const record = await pb.collection('conferences').create({ title, description, group });
    res.json({ success: true, record });
  } catch (err) {
    next(err);
  }
});



router.post('/:id/members', async (req, res, next) => {
  try {
    await authenticateSuperuser();
    const conferenceId = req.params.id;
    const { memberId } = req.body;
    const rec = await pb.collection('conference_memberships').create({ conference: conferenceId, member: memberId });
    res.json({ success: true, record: rec });
  } catch (err) {
    next(err);
  }
});



router.get('/:id/members/:memberId', async (req, res, next) => {
  try {
    const { id, memberId } = req.params;
    const list = await pb.collection('conference_memberships').getList(1, 50, { filter: `conference = "${id}" && member = "${memberId}"` });
    res.json({ member: memberId, conference: id, isMember: list && list.items && list.items.length > 0 });
  } catch (err) {
    next(err);
  }
});

export default router;
