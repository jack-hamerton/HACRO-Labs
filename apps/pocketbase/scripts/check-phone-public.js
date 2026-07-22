#!/usr/bin/env node
(async () => {
  try {
    const base = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
    const filter = '(phone = "0757838028" || phone = "0757838028")';
    const url = base + '/api/collections/members/records?filter=' + encodeURIComponent(filter);
    const res = await fetch(url);
    console.log('status', res.status);
    const txt = await res.text();
    console.log(txt);
  } catch (e) {
    console.error('error', e);
  }
})();
