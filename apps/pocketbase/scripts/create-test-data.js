const baseUrl = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const superEmail = process.env.POCKETBASE_SUPERUSER_EMAIL || 'admin@example.com';
const superPass = process.env.POCKETBASE_SUPERUSER_PASSWORD || 'Admin123!';

async function fetchJson(url, opts = {}){
  const res = await fetch(url, opts);
  const txt = await res.text();
  let data;
  try { data = JSON.parse(txt); } catch { data = txt; }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${txt}`);
  return data;
}

async function main(){
  console.log('Authenticating as superuser...');
  const auth = await fetchJson(`${baseUrl}/api/collections/_superusers/auth-with-password`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: superEmail, password: superPass })
  });
  const token = auth.token;
  console.log('Got token');

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  // Ensure group exists
  const groupName = 'Nyalenda B Group';
  console.log('Looking for group by name...');
  let groups = await fetchJson(`${baseUrl}/api/collections/groups/records?filter=${encodeURIComponent(`group_name = "${groupName}"`)}`, { headers });
  let groupId;
  if (groups?.totalItems > 0) {
    groupId = groups.items[0].id;
    console.log('Found existing group', groupId);
  } else {
    console.log('Creating group...');
    const created = await fetchJson(`${baseUrl}/api/collections/groups/records`, { method: 'POST', headers, body: JSON.stringify({ group_name: groupName, region: 'Kisumu', member_count: 1, description: 'Test group' }) });
    groupId = created.id;
    console.log('Created group', groupId);
  }

  // Create member
  const email = 'member@example.com';
  const password = 'Member@123456';
  const phoneLocal = '0757838028';
  const phoneIntl = '254757838028';
  console.log('Creating member record...');

  // check existing
  const existing = await fetchJson(`${baseUrl}/api/collections/members/records?filter=${encodeURIComponent(`email = "${email}"`)}`, { headers }).catch(()=>({ totalItems:0 }));
  let memberId;
  if (existing && existing.totalItems > 0) {
    memberId = existing.items[0].id;
    console.log('Member already exists', memberId);
    try {
      console.log('Deleting existing member to recreate with correct details...');
      await fetchJson(`${baseUrl}/api/collections/members/records/${memberId}`, { method: 'DELETE', headers });
      console.log('Deleted existing member');
      memberId = null;
      // recreate member
      const payload = {
        email,
        password,
        passwordConfirm: password,
        first_name: 'Test',
        last_name: 'Member',
        phone: phoneLocal,
        location: 'kisumu county, kisumu central, Nyalenda B, western',
        verified: true,
      };
      const m = await fetchJson(`${baseUrl}/api/collections/members/records`, { method: 'POST', headers, body: JSON.stringify(payload) });
      memberId = m.id;
      console.log('Recreated member', memberId);
    } catch (e) {
      console.warn('Failed to delete or recreate existing member, will attempt to update instead:', e.message || e);
    }
  } else {
    const payload = {
      email,
      password,
      passwordConfirm: password,
      first_name: 'Test',
      last_name: 'Member',
      phone: phoneLocal,
      location: 'kisumu county, kisumu central, Nyalenda B, western',
      verified: true
    };
    const m = await fetchJson(`${baseUrl}/api/collections/members/records`, { method: 'POST', headers, body: JSON.stringify(payload) });
    memberId = m.id;
    console.log('Created member', memberId);
  }

  // Ensure group_members link
  console.log('Ensuring group_members entry...');
  const gmCheck = await fetchJson(`${baseUrl}/api/collections/group_members/records?filter=${encodeURIComponent(`group_id = "${groupId}" && member_id = "${memberId}"`)}`, { headers }).catch(()=>({ totalItems:0 }));
  if (!(gmCheck && gmCheck.totalItems > 0)){
    await fetchJson(`${baseUrl}/api/collections/group_members/records`, { method: 'POST', headers, body: JSON.stringify({ group_id: groupId, member_id: memberId, joined_date: new Date().toISOString() }) });
    console.log('Created group_members link');
  } else console.log('Group membership already exists');

  // add savings sample
  console.log('Creating sample savings record...');
  await fetchJson(`${baseUrl}/api/collections/savings/records`, { method: 'POST', headers, body: JSON.stringify({ member_id: memberId, amount: 1000, total_savings: 1000, description: 'Seed deposit' }) }).catch(e=>console.warn('Savings create may exist', e.message));

  console.log('Test data provisioning complete. Verifying member login via API...');
  // call local API members login
  const apiLogin = await fetchJson('http://localhost:3001/api/members/login', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ email, password }) }).catch(e=>({ error:e.message }));
  console.log('API login result:', apiLogin?.token ? 'OK' : apiLogin);

  // verify phone login
  const apiPhoneLogin = await fetchJson('http://localhost:3001/api/members/login', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ email: phoneLocal, password }) }).catch(e=>({ error:e.message }));
  console.log('Phone login result:', apiPhoneLogin?.token ? 'OK' : apiPhoneLogin);

  console.log('Done');
}

main().catch(err=>{ console.error('Error', err); process.exit(1); });
