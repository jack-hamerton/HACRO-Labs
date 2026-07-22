#!/usr/bin/env node
(async () => {
  try {
    const base = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
    const superEmail = process.env.POCKETBASE_SUPERUSER_EMAIL || 'admin@example.com';
    const superPass = process.env.POCKETBASE_SUPERUSER_PASSWORD || 'Admin123!';

    const authRes = await fetch(base + '/api/collections/_superusers/auth-with-password', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identity: superEmail, password: superPass })
    });
    const auth = await authRes.json();
    const token = auth.token;
    console.log('got token');

    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    const payload = {
      email: 'member+debug@example.com',
      password: 'Member@123456',
      passwordConfirm: 'Member@123456',
      first_name: 'Debug',
      last_name: 'Member',
      phone: '0757838028',
      location: 'kisumu county, kisumu central, Nyalenda B, western',
      verified: true
    };

    const res = await fetch(base + '/api/collections/members/records', { method: 'POST', headers, body: JSON.stringify(payload) });
    const txt = await res.text();
    console.log('status', res.status);
    try { console.log(JSON.parse(txt)); } catch { console.log(txt); }
  } catch (e) {
    console.error('create debug error', e);
  }
})();
