const baseUrl = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const superEmail = process.env.POCKETBASE_SUPERUSER_EMAIL || 'admin@example.com';
const superPass = process.env.POCKETBASE_SUPERUSER_PASSWORD || 'Admin123!';
const allowedPhone = '0757838028';
const keepEmail = 'member@example.com';

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${text}`);
  }
  return data;
}

async function main() {
  console.log('Authenticating as superuser...');
  const auth = await fetchJson(`${baseUrl}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: superEmail, password: superPass }),
  });
  const token = auth.token;
  console.log('Superuser authenticated');

  const filter = encodeURIComponent(`(phone = "${allowedPhone}" || phone = "+${allowedPhone}" || phone = "254${allowedPhone.slice(1)}")`);
  const url = `${baseUrl}/api/collections/members/records?perPage=100&filter=${filter}`;
  const list = await fetchJson(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const members = list.items || [];
  console.log(`Found ${members.length} member(s) with phone ${allowedPhone}`);

  if (members.length === 0) {
    console.log('No duplicates to clean.');
    return;
  }

  const keep = members.find((m) => m.email === keepEmail);
  if (!keep) {
    throw new Error(`Primary member ${keepEmail} not found among phone matches.`);
  }

  const toDelete = members.filter((m) => m.id !== keep.id);
  for (const member of toDelete) {
    console.log('Deleting duplicate member', member.email, member.id);
    await fetchJson(`${baseUrl}/api/collections/members/records/${member.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  console.log('Ensuring primary member phone is correct and unique...');
  await fetchJson(`${baseUrl}/api/collections/members/records/${keep.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ phone: allowedPhone }),
  });
  console.log('Clean up complete. Primary member:', keep.email, keep.id);
}

main().catch((err) => {
  console.error('Cleanup failed:', err.message || err);
  process.exit(1);
});
