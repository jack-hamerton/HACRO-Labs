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
  const result = await request('/api/collections/_superusers/auth-with-password', 'POST', {
    identity: email,
    password,
  });
  return result.token;
}

async function getCollectionByName(token, name) {
  const result = await request('/api/collections?perPage=200', 'GET', null, token);
  return result.items.find((item) => item.name === name);
}

async function deleteCollection(token, collectionId) {
  return request(`/api/collections/${collectionId}`, 'DELETE', null, token);
}

async function createCollection(token, collection) {
  return request('/api/collections', 'POST', collection, token);
}

(async () => {
  console.log('Authenticating with PocketBase...');
  const token = await authenticate();

  const members = await getCollectionByName(token, 'members');
  const groups = await getCollectionByName(token, 'groups');
  if (!members || !groups) {
    throw new Error('members or groups collection not found');
  }

  const existingGroupMembers = await getCollectionByName(token, 'group_members');
  if (existingGroupMembers) {
    console.log('Deleting existing group_members collection:', existingGroupMembers.id);
    await deleteCollection(token, existingGroupMembers.id);
  }

  const existingSavings = await getCollectionByName(token, 'savings');
  if (existingSavings) {
    console.log('Deleting existing savings collection:', existingSavings.id);
    await deleteCollection(token, existingSavings.id);
  }

  console.log('Creating group_members collection...');
  const groupMembers = await createCollection(token, {
    name: 'group_members',
    type: 'base',
    fields: [
      {
        name: 'group_id',
        type: 'relation',
        required: true,
        collectionId: groups.id,
        cascadeDelete: false,
        minSelect: 1,
        maxSelect: 1,
      },
      {
        name: 'member_id',
        type: 'relation',
        required: true,
        collectionId: members.id,
        cascadeDelete: false,
        minSelect: 1,
        maxSelect: 1,
      },
      {
        name: 'joined_date',
        type: 'date',
        required: false,
      },
    ],
  });
  console.log('Created group_members', groupMembers.id);

  console.log('Creating savings collection...');
  const savings = await createCollection(token, {
    name: 'savings',
    type: 'base',
    fields: [
      {
        name: 'member_id',
        type: 'relation',
        required: true,
        collectionId: members.id,
        cascadeDelete: false,
        minSelect: 1,
        maxSelect: 1,
      },
      {
        name: 'group_id',
        type: 'relation',
        required: true,
        collectionId: groups.id,
        cascadeDelete: false,
        minSelect: 1,
        maxSelect: 1,
      },
      {
        name: 'amount',
        type: 'number',
        required: false,
        min: 0,
        max: null,
        noDecimal: false,
      },
      {
        name: 'total_savings',
        type: 'number',
        required: false,
        min: 0,
        max: null,
        noDecimal: false,
      },
      {
        name: 'date',
        type: 'date',
        required: false,
      },
      {
        name: 'last_contribution_date',
        type: 'date',
        required: false,
      },
      {
        name: 'description',
        type: 'text',
        required: false,
        min: null,
        max: null,
        pattern: '',
      },
      {
        name: 'held_collateral',
        type: 'number',
        required: false,
        min: 0,
        max: null,
        noDecimal: false,
      },
    ],
  });
  console.log('Created savings', savings.id);

  console.log('Verification: fetching new collections...');
  const refreshedGroupMembers = await getCollectionByName(token, 'group_members');
  const refreshedSavings = await getCollectionByName(token, 'savings');
  console.log('group_members fields:', refreshedGroupMembers.fields.map((f) => f.name).join(', '));
  console.log('savings fields:', refreshedSavings.fields.map((f) => f.name).join(', '));
})();
