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
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

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

async function main() {
  try {
    const token = await authenticate();
    const collections = await getCollections(token);

    // Map collection names to IDs
    const collMap = {};
    collections.forEach((c) => {
      collMap[c.name] = c;
    });

    // Repair notifications collection
    if (collMap.notifications) {
      console.log('\nRepairing notifications...');
      await patchCollection(token, collMap.notifications.id, {
        fields: [
          { name: 'member_id', type: 'relation', required: true, collectionId: collMap.members?.id || '', cascadeDelete: false, minSelect: 1, maxSelect: 1 },
          { name: 'type', type: 'select', required: true, values: ['loan_request', 'vote', 'approval', 'disbursement', 'repayment_due', 'penalty', 'message'] },
          { name: 'title', type: 'text', required: true },
          { name: 'message', type: 'text', required: true },
          { name: 'read_status', type: 'bool', required: false },
          { name: 'status', type: 'text', required: false },
        ],
      });
      console.log('notifications repaired');
    }

    // Repair contributions_history collection
    if (collMap.contributions_history) {
      console.log('Repairing contributions_history...');
      await patchCollection(token, collMap.contributions_history.id, {
        fields: [
          { name: 'member_id', type: 'relation', required: true, collectionId: collMap.members?.id || '', cascadeDelete: false, minSelect: 1, maxSelect: 1 },
          { name: 'group_id', type: 'relation', required: false, collectionId: collMap.groups?.id || '', cascadeDelete: false, minSelect: 0, maxSelect: 1 },
          { name: 'type', type: 'select', required: false, values: ['savings', 'loan_disbursement', 'loan_repayment', 'bonus', 'interest_earned', 'penalty'] },
          { name: 'amount', type: 'number', required: false },
          { name: 'date', type: 'date', required: false },
          { name: 'description', type: 'text', required: false },
          { name: 'balance', type: 'number', required: false },
        ],
      });
      console.log('contributions_history repaired');
    }

    // Repair loan_guarantors collection
    if (collMap.loan_guarantors) {
      console.log('Repairing loan_guarantors...');
      await patchCollection(token, collMap.loan_guarantors.id, {
        fields: [
          { name: 'loan_id', type: 'relation', required: true, collectionId: collMap.loans?.id || '', cascadeDelete: false, minSelect: 1, maxSelect: 1 },
          { name: 'member_id', type: 'relation', required: true, collectionId: collMap.members?.id || '', cascadeDelete: false, minSelect: 1, maxSelect: 1 },
          { name: 'collateral_amount', type: 'number', required: false },
          { name: 'status', type: 'select', required: false, values: ['pending_approval', 'confirmed', 'released', 'acknowledged', 'approved', 'active'] },
          { name: 'amount', type: 'number', required: false },
          { name: 'role', type: 'text', required: false },
          { name: 'guarantor_id', type: 'text', required: false },
        ],
      });
      console.log('loan_guarantors repaired');
    }

    // Repair loan_approvals collection
    if (collMap.loan_approvals) {
      console.log('Repairing loan_approvals...');
      await patchCollection(token, collMap.loan_approvals.id, {
        fields: [
          { name: 'loan_id', type: 'relation', required: true, collectionId: collMap.loans?.id || '', cascadeDelete: false, minSelect: 1, maxSelect: 1 },
          { name: 'member_id', type: 'relation', required: false, collectionId: collMap.members?.id || '', cascadeDelete: false, minSelect: 0, maxSelect: 1 },
          { name: 'approved', type: 'bool', required: false },
          { name: 'vote_type', type: 'select', required: false, values: ['approval', 'guarantor_confirmation'] },
          { name: 'loan_type', type: 'text', required: false },
          { name: 'voted', type: 'bool', required: false },
        ],
      });
      console.log('loan_approvals repaired');
    }

    // Repair loans collection
    if (collMap.loans) {
      console.log('Repairing loans...');
      await patchCollection(token, collMap.loans.id, {
        fields: [
          { name: 'member_id', type: 'relation', required: true, collectionId: collMap.members?.id || '', cascadeDelete: false, minSelect: 1, maxSelect: 1 },
          { name: 'group_id', type: 'relation', required: false, collectionId: collMap.groups?.id || '', cascadeDelete: false, minSelect: 0, maxSelect: 1 },
          { name: 'amount', type: 'number', required: false },
          { name: 'status', type: 'select', required: false, values: ['pending', 'approved', 'active', 'partially_paid', 'fully_paid', 'rejected', 'defaulted'] },
          { name: 'loan_type', type: 'select', required: false, values: ['IL', 'GIL'] },
          { name: 'interest_rate', type: 'number', required: false },
          { name: 'repayment_period', type: 'number', required: false },
          { name: 'balance', type: 'number', required: false },
          { name: 'collateral_amount', type: 'number', required: false },
          { name: 'disbursement_date', type: 'date', required: false },
          { name: 'repayment_start_date', type: 'date', required: false },
          { name: 'grace_period_end_date', type: 'date', required: false },
          { name: 'guarantor_id', type: 'text', required: false },
          { name: 'loan_id', type: 'text', required: false },
          { name: 'total_savings', type: 'number', required: false },
        ],
      });
      console.log('loans repaired');
    }

    // Repair payments collection
    if (collMap.payments) {
      console.log('Repairing payments...');
      await patchCollection(token, collMap.payments.id, {
        fields: [
          { name: 'member_id', type: 'relation', required: false, collectionId: collMap.members?.id || '', cascadeDelete: false, minSelect: 0, maxSelect: 1 },
          { name: 'amount', type: 'number', required: false },
          { name: 'payment_type', type: 'select', required: false, values: ['registration', 'insurance', 'loan_repayment', 'other'] },
          { name: 'payment_status', type: 'select', required: false, values: ['pending', 'completed', 'failed'] },
          { name: 'payment_date', type: 'date', required: false },
          { name: 'first_name', type: 'text', required: false },
          { name: 'last_name', type: 'text', required: false },
        ],
      });
      console.log('payments repaired');
    }

    // Repair penalties collection
    if (collMap.penalties) {
      console.log('Repairing penalties...');
      await patchCollection(token, collMap.penalties.id, {
        fields: [
          { name: 'loan_id', type: 'relation', required: false, collectionId: collMap.loans?.id || '', cascadeDelete: false, minSelect: 0, maxSelect: 1 },
          { name: 'member_id', type: 'relation', required: false, collectionId: collMap.members?.id || '', cascadeDelete: false, minSelect: 0, maxSelect: 1 },
          { name: 'amount', type: 'number', required: false },
          { name: 'date_applied', type: 'date', required: false },
          { name: 'date', type: 'date', required: false },
          { name: 'reason', type: 'text', required: false },
          { name: 'waived', type: 'bool', required: false },
          { name: 'balance', type: 'number', required: false },
          { name: 'group_id', type: 'text', required: false },
        ],
      });
      console.log('penalties repaired');
    }

    console.log('\nAll collections repaired successfully!');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
