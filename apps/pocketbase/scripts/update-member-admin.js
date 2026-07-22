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
    if (!token) throw new Error('superuser auth failed');

    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    const email = 'member@example.com';
    const q = encodeURIComponent(`email = "${email}"`);
    const listRes = await fetch(base + '/api/collections/members/records?filter=' + q, { headers });
    const list = await listRes.json();
    if (!list || !list.items || list.items.length === 0) {
      console.error('Member not found');
      process.exit(1);
    }
    const member = list.items[0];
    console.log('Found member', member.id, 'current phone:', member.phone);

    const payload = {
      first_name: 'Test',
      last_name: 'Member',
      phone: '0757838028',
      location: 'kisumu county, kisumu central, Nyalenda B, western',
      verified: true,
      password: 'Member@123456',
      passwordConfirm: 'Member@123456'
    };

    const updateRes = await fetch(base + `/api/collections/members/records/${member.id}`, { method: 'PATCH', headers, body: JSON.stringify(payload) });
    const txt = await updateRes.text();
    console.log('update status', updateRes.status, txt);
  } catch (e) {
    console.error('error', e);
    process.exit(1);
  }
})();
