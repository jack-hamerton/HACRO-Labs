import express from 'express';
import { authPb, pb, authenticateSuperuser } from '../utils/pocketbaseClient.js';
import { generateToken } from '../utils/adminUtils.js';

const router = express.Router();

const OTP_TTL_MS = 30 * 60 * 1000;
const MAX_OTP_REQUESTS = 3;
const BLOCK_DURATION_MS = 24 * 60 * 60 * 1000;

const otpStore = new Map();

const normalizePhone = (value = '') => {
  const digits = `${value}`.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 9 && digits.startsWith('7')) return `254${digits}`;
  if (digits.length === 10 && digits.startsWith('0')) return `254${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith('254')) return digits;
  return digits;
};

const phoneFilter = (phone) => {
  const normalized = normalizePhone(phone);
  const variants = new Set();

  if (normalized) {
    variants.add(normalized);
    variants.add(`0${normalized.slice(3)}`);
    variants.add(`+${normalized}`);
    variants.add(`${normalized}`);
  }

  return Array.from(variants)
    .map((value) => `phone = "${value}"`)
    .join(' || ');
};

const createOtpCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendSms = async (phone, message) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_FROM_PHONE;
  const toPhone = phone.startsWith('+') ? phone : `+${phone}`;

  if (accountSid && authToken && fromPhone) {
    const body = new URLSearchParams({ From: fromPhone, To: toPhone, Body: message });
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`SMS provider error: ${res.status} ${errorText}`);
    }

    return res.json();
  }

  console.info(`[OTP] Send to ${toPhone}: ${message}`);
  return null;
};

const findMemberByPhone = async (phone) => {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) return null;

  await authenticateSuperuser();
  const filter = phoneFilter(normalizedPhone);
  const members = await pb.collection('members').getList(1, 1, { filter });
  return members.items?.[0] || null;
};

router.post('/request-otp', async (req, res) => {
  const { phone } = req.body;
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone) {
    return res.status(400).json({ ok: false, error: 'Phone number is required' });
  }

  const member = await findMemberByPhone(normalizedPhone);
  if (!member) {
    return res.json({ ok: true, message: 'If the phone exists, an OTP has been sent.' });
  }

  const now = Date.now();
  const existing = otpStore.get(member.id) || {
    memberId: member.id,
    phone: member.phone,
    firstRequestedAt: now,
    resendCount: 0,
    blockedUntil: null,
    verified: false,
    resetToken: null,
  };

  if (existing.blockedUntil && now < existing.blockedUntil) {
    return res.status(429).json({ ok: false, error: 'Maximum OTP requests reached. Please try again after 24 hours.' });
  }

  if (existing.resendCount >= MAX_OTP_REQUESTS) {
    if (now - existing.firstRequestedAt < BLOCK_DURATION_MS) {
      existing.blockedUntil = existing.firstRequestedAt + BLOCK_DURATION_MS;
      otpStore.set(member.id, existing);
      return res.status(429).json({ ok: false, error: 'Maximum OTP requests reached. Please try again after 24 hours.' });
    }

    existing.resendCount = 0;
    existing.firstRequestedAt = now;
    existing.blockedUntil = null;
  }

  const code = createOtpCode();
  existing.code = code;
  existing.expiresAt = now + OTP_TTL_MS;
  existing.resendCount += 1;
  existing.lastSentAt = now;
  existing.verified = false;
  existing.resetToken = null;
  existing.tokenExpiresAt = null;
  otpStore.set(member.id, existing);

  const message = `Your HACRO password reset code is ${code}. It expires in 30 minutes.`;
  try {
    await sendSms(member.phone, message);
  } catch (error) {
    console.warn('Unable to send OTP via SMS:', error.message || error);
  }

  return res.json({
    ok: true,
    message: 'OTP sent to your registered phone number.',
    resendCount: existing.resendCount,
    expiresAt: existing.expiresAt,
    maxResends: MAX_OTP_REQUESTS,
  });
});

router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone || !otp) {
    return res.status(400).json({ ok: false, error: 'Phone and OTP are required' });
  }

  const member = await findMemberByPhone(normalizedPhone);
  if (!member) {
    return res.status(400).json({ ok: false, error: 'Invalid phone or OTP' });
  }

  const store = otpStore.get(member.id);
  if (!store || !store.code || !store.expiresAt || store.expiresAt < Date.now()) {
    return res.status(400).json({ ok: false, error: 'OTP has expired. Request a new code.' });
  }

  if (store.code !== `${otp}`.trim()) {
    return res.status(400).json({ ok: false, error: 'Invalid OTP code' });
  }

  const resetToken = generateToken();
  store.verified = true;
  store.code = null;
  store.resetToken = resetToken;
  store.tokenExpiresAt = Date.now() + OTP_TTL_MS;
  otpStore.set(member.id, store);

  return res.json({ ok: true, resetToken, expiresAt: store.tokenExpiresAt });
});

router.post('/reset-password-with-otp', async (req, res) => {
  const { token, password, passwordConfirm } = req.body;

  if (!token || !password || !passwordConfirm) {
    return res.status(400).json({ ok: false, error: 'Reset token, password and passwordConfirm are required' });
  }

  const store = Array.from(otpStore.values()).find((entry) => entry.resetToken === token);
  if (!store || !store.verified || !store.tokenExpiresAt || store.tokenExpiresAt < Date.now()) {
    return res.status(400).json({ ok: false, error: 'Invalid or expired reset token' });
  }

  try {
    await authenticateSuperuser();
    await pb.collection('members').update(store.memberId, {
      password,
      passwordConfirm,
    });
    otpStore.delete(store.memberId);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).json({ ok: false, error: 'Failed to reset password' });
  }
});

export default router;
