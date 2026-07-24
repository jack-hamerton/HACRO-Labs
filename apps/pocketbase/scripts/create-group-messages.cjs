const http = require('http');

const baseUrl = 'http://127.0.0.1:8090';
const adminEmail = 'admin@example.com';
const adminPassword = 'Admin123!';

function request(endpoint, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(baseUrl + endpoint);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function authenticate() {
  const { data } = await request('/api/collections/_superusers/auth-with-password', 'POST', {
    identity: adminEmail,
    password: adminPassword,
  });
  return data.token;
}

async function getCollection(token, name) {
  const { data } = await request('/api/collections?perPage=200', 'GET', null, token);
  return data.items.find((c) => c.name === name);
}

async function getCollections(token) {
  const { data } = await request('/api/collections?perPage=200', 'GET', null, token);
  return data.items;
}

async function createCollection(token, payload) {
  const { status, data } = await request('/api/collections', 'POST', payload, token);
  if (status !== 200) {
    throw new Error(`Create failed: ${JSON.stringify(data)}`);
  }
  return data;
}

async function main() {
  try {
    const token = await authenticate();
    const collections = await getCollections(token);
    const collMap = {};
    collections.forEach((c) => {
      collMap[c.name] = c;
    });

    console.log('Creating group_messages collection...');

    const groupMessages = await createCollection(token, {
      name: 'group_messages',
      type: 'base',
      fields: [
        {
          name: 'group_id',
          type: 'relation',
          required: true,
          collectionId: collMap.groups?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1,
        },
        {
          name: 'member_id',
          type: 'relation',
          required: true,
          collectionId: collMap.members?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1,
        },
        {
          name: 'content',
          type: 'text',
          required: true,
        },
        {
          name: 'sender_id',
          type: 'relation',
          required: false,
          collectionId: collMap.members?.id || '',
          cascadeDelete: false,
          minSelect: 0,
          maxSelect: 1,
        },
        {
          name: 'type',
          type: 'select',
          required: false,
          values: ['message', 'system', 'announcement'],
        },
        {
          name: 'gm',
          type: 'text',
          required: false,
        },
      ],
    });

    console.log('✓ group_messages collection created successfully');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
