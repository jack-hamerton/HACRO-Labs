import express from 'express';
import { authPb } from '../utils/pocketbaseClient.js';

const router = express.Router();

// Request password reset for member
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    await authPb.collection('members').requestPasswordReset(email);
    return res.json({ ok: true, message: 'If the email exists, a reset link was sent.' });
  } catch (err) {
    // don't reveal existence
    return res.json({ ok: true, message: 'If the email exists, a reset link was sent.' });
  }
});

// Confirm password reset
router.post('/reset-password', async (req, res) => {
  const { token, password, passwordConfirm } = req.body;
  try {
    await authPb.collection('members').confirmPasswordReset(token, password, passwordConfirm);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).json({ ok: false, error: 'Invalid token or password' });
  }
});

export default router;
