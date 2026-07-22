#!/usr/bin/env node
(async () => {
  try {
    const base = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
    const superEmail = process.env.POCKETBASE_SUPERUSER_EMAIL || 'admin@example.com';
    const superPass = process.env.POCKETBASE_SUPERUSER_PASSWORD || 'Admin123!';

    const authRes = await fetch(base + '/api/collections/_superusers/auth-with-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: superEmail, password: superPass }),
    });
    const auth = await authRes.json();
    if (!auth.token) {
      console.error('Superuser auth failed', auth);
      process.exit(1);
    }
    const token = auth.token;

    const q = encodeURIComponent('email = "member@example.com"');
    const membersRes = await fetch(base + '/api/collections/members/records?filter=' + q, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const members = await membersRes.json();
    console.log(JSON.stringify(members, null, 2));
  } catch (e) {
    console.error('Error fetching member:', e);
    process.exit(1);
  }
})();
