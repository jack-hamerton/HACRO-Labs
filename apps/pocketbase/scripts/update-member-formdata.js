#!/usr/bin/env node
(async () => {
  try {
    const base = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
    const superEmail = process.env.POCKETBASE_SUPERUSER_EMAIL || 'admin@example.com';
    const superPass = process.env.POCKETBASE_SUPERUSER_PASSWORD || 'Admin123!';
    const fetchFn = globalThis.fetch || (await import('node-fetch')).default;

    const authRes = await fetchFn(base + '/api/collections/_superusers/auth-with-password', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identity: superEmail, password: superPass })
    });
    const auth = await authRes.json();
    const token = auth.token;

    // find member id
    const q = encodeURIComponent('email = "member@example.com"');
    const membersRes = await fetchFn(base + '/api/collections/members/records?filter=' + q, { headers: { Authorization: `Bearer ${token}` } });
    const members = await membersRes.json();
    if (!members || !members.items || members.items.length === 0) {
      console.error('Member not found');
      process.exit(1);
    }
    const member = members.items[0];
    console.log('Found member id', member.id);

    const fd = new FormData();
    fd.append('_method', 'PATCH');
    fd.append('first_name', 'Test');
    fd.append('last_name', 'Member');
    fd.append('phone', '0757838028');
    fd.append('location', 'kisumu county, kisumu central, Nyalenda B, western');

    const updateRes = await fetchFn(base + `/api/collections/members/records/${member.id}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
    const txt = await updateRes.text();
    console.log('update status', updateRes.status, txt);
  } catch (e) {
    console.error('error', e);
    process.exit(1);
  }
})();
