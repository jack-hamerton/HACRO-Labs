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
  console.log('Authenticating...');
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

async function patchCollection(token, id, payload) {
  const { status, data } = await request(`/api/collections/${id}`, 'PATCH', payload, token);
  if (status !== 200) {
    console.error(`PATCH failed for ${id}:`, data);
    throw new Error(`Collection patch failed: ${JSON.stringify(data)}`);
  }
  return data;
}

async function addFieldsToCollection(token, id, existingFields, newFields) {
  const toAdd = newFields.filter((f) => !existingFields.find((e) => e.name === f.name));
  if (toAdd.length === 0) return [];

  const merged = [...existingFields, ...toAdd];
  await patchCollection(token, id, { fields: merged });
  return toAdd;
}

async function main() {
  try {
    const token = await authenticate();
    const collections = await getCollections(token);

    const collMap = {};
    collections.forEach((c) => {
      collMap[c.name] = c;
    });

    // Define fields each collection actually needs based on hook analysis
    const fieldsNeeded = {
      members: [
        { name: 'phone_number', type: 'text', required: false },
      ],
      notifications: [
        { name: 'group_id', type: 'relation', required: false, collectionId: collMap.groups?.id || '', cascadeDelete: false, minSelect: 0, maxSelect: 1 },
      ],
      group_members: [
        { name: 'status', type: 'text', required: false },
      ],
      loan_guarantors: [
        { name: 'loan_type', type: 'select', required: false, values: ['IL', 'GIL'] },
      ],
      contributions_history: [
        { name: 'collateral_amount', type: 'number', required: false },
        { name: 'disbursement_date', type: 'date', required: false },
        { name: 'guarantor_id', type: 'text', required: false },
        { name: 'interest_rate', type: 'number', required: false },
        { name: 'loan_id', type: 'text', required: false },
        { name: 'loan_type', type: 'select', required: false, values: ['IL', 'GIL'] },
        { name: 'phone', type: 'text', required: false },
        { name: 'phone_number', type: 'text', required: false },
        { name: 'total_savings', type: 'number', required: false },
      ],
      payments: [
        { name: 'alert_type', type: 'text', required: false },
        { name: 'payment_id', type: 'text', required: false },
      ],
      penalties: [
        { name: 'balance', type: 'number', required: false },
        { name: 'group_id', type: 'text', required: false },
      ],
      loans: [
        { name: 'message', type: 'text', required: false },
      ],
      fraud_alerts: [
        { name: 'alert_type', type: 'text', required: false },
        { name: 'amount', type: 'number', required: false },
        { name: 'description', type: 'text', required: false },
        { name: 'detected_at', type: 'date', required: false },
        { name: 'member_id', type: 'relation', required: false, collectionId: collMap.members?.id || '', cascadeDelete: false, minSelect: 0, maxSelect: 1 },
        { name: 'payment_id', type: 'text', required: false },
        { name: 'payment_type', type: 'text', required: false },
        { name: 'severity', type: 'select', required: false, values: ['low', 'medium', 'high'] },
      ],
    };

    console.log('\nAdding missing fields to collections...\n');

    for (const [collName, fieldsToAdd] of Object.entries(fieldsNeeded)) {
      const coll = collMap[collName];
      if (!coll) {
        console.log(`⚠ ${collName} not found`);
        continue;
      }

      const added = await addFieldsToCollection(token, coll.id, coll.fields, fieldsToAdd);
      if (added.length > 0) {
        console.log(`✓ ${collName}: Added ${added.map((f) => f.name).join(', ')}`);
      } else {
        console.log(`✓ ${collName}: No new fields needed`);
      }
    }

    console.log('\nAll fields added successfully!');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
