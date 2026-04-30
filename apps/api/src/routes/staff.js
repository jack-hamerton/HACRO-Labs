import express from 'express';
import pb, { authenticateSuperuser } from '../utils/pocketbaseClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await authenticateSuperuser();

    const staffRecords = await pb.collection('staff_members').getFullList({ sort: 'priority' });

    const staff = staffRecords.map((record) => ({
      id: record.id,
      name: record.name || 'Unnamed Team Member',
      role: record.role || 'Staff',
      position: record.company_position || record.position || record.role || 'Staff',
      bio: record.bio || '',
      photo: record.photo?.[0]?.url || null,
      socialLinks: {
        linkedin: record.linkedin || '',
        twitter: record.twitter || '',
        instagram: record.instagram || '',
        facebook: record.facebook || '',
        website: record.website || '',
      },
    }));

    res.json({ staff });
  } catch (error) {
    console.error('Failed to load staff members:', error);
    res.status(500).json({ error: 'Unable to load staff members' });
  }
});

export default router;
