const baseUrl = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const email = process.env.POCKETBASE_ADMIN_EMAIL || 'admin@example.com';
const password = process.env.POCKETBASE_ADMIN_PASSWORD || 'Admin123!';

async function request(path, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = text;
  try { data = JSON.parse(text); } catch {}
  if (!res.ok) {
    throw new Error(`${method} ${path} failed ${res.status}: ${text}`);
  }
  return data;
}

async function authenticate() {
  const res = await request('/api/collections/_superusers/auth-with-password', 'POST', {
    identity: email,
    password,
  });
  return res.token;
}

async function getCollectionByName(token, name) {
  const res = await request('/api/collections?perPage=200', 'GET', null, token);
  return res.items.find((item) => item.name === name);
}

async function patchCollection(token, collectionId, body) {
  return request(`/api/collections/${collectionId}`, 'PATCH', body, token);
}

(async () => {
  console.log('Authenticating...');
  const token = await authenticate();

  const members = await getCollectionByName(token, 'members');
  const groups = await getCollectionByName(token, 'groups');
  const groupMembers = await getCollectionByName(token, 'group_members');
  const savings = await getCollectionByName(token, 'savings');

  if (!members || !groups || !groupMembers || !savings) {
    throw new Error('Required collections are missing');
  }

  console.log('Patching group_members schema...');
  await patchCollection(token, groupMembers.id, {
    fields: [
      {
        name: 'group_id',
        type: 'relation',
        required: true,
        system: false,
        collectionId: groups.id,
        cascadeDelete: false,
        minSelect: 1,
        maxSelect: 1,
      },
      {
        name: 'member_id',
        type: 'relation',
        required: true,
        system: false,
        collectionId: members.id,
        cascadeDelete: false,
        minSelect: 1,
        maxSelect: 1,
      },
      {
        name: 'joined_date',
        type: 'date',
        required: false,
        system: false,
      },
    ],
  });
  console.log('group_members schema patched');

  console.log('Patching savings schema...');
  await patchCollection(token, savings.id, {
    fields: [
      {
        name: 'member_id',
        type: 'relation',
        required: true,
        system: false,
        collectionId: members.id,
        cascadeDelete: false,
        minSelect: 1,
        maxSelect: 1,
      },
      {
        name: 'group_id',
        type: 'relation',
        required: true,
        system: false,
        collectionId: groups.id,
        cascadeDelete: false,
        minSelect: 1,
        maxSelect: 1,
      },
      {
        name: 'amount',
        type: 'number',
        required: false,
        system: false,
        min: 0,
        max: null,
        noDecimal: false,
      },
      {
        name: 'total_savings',
        type: 'number',
        required: false,
        system: false,
        min: 0,
        max: null,
        noDecimal: false,
      },
      {
        name: 'date',
        type: 'date',
        required: false,
        system: false,
      },
      {
        name: 'last_contribution_date',
        type: 'date',
        required: false,
        system: false,
      },
      {
        name: 'description',
        type: 'text',
        required: false,
        system: false,
        min: null,
        max: null,
        pattern: '',
      },
      {
        name: 'held_collateral',
        type: 'number',
        required: false,
        system: false,
        min: 0,
        max: null,
        noDecimal: false,
      },
    ],
  });
  console.log('savings schema patched');

  const patchedGroupMembers = await getCollectionByName(token, 'group_members');
  const patchedSavings = await getCollectionByName(token, 'savings');
  console.log('group_members fields:', patchedGroupMembers.fields.map(f => f.name).join(', '));
  console.log('savings fields:', patchedSavings.fields.map(f => f.name).join(', '));

  console.log('Schema repair complete.');
})();
