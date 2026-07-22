#!/usr/bin/env node
(async () => {
  try {
    const base = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
    const authRes = await fetch(base + '/api/collections/_superusers/auth-with-password', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identity: 'admin@example.com', password: 'Admin123!' })
    });
    const auth = await authRes.json();
    const token = auth.token;
    if (!token) { console.error('no token', auth); process.exit(1); }
    const filter = '(phone = "0757838028" || phone = "0757838028")';
    const url = base + '/api/collections/members/records?filter=' + encodeURIComponent(filter);
    console.log('query url', url);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    console.log('status', res.status);
    console.log(await res.text());
  } catch (e) {
    console.error('error', e);
  }
})();
