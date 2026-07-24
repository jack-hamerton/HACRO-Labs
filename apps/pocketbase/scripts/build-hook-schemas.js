import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PB_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'Admin123!';

async function authenticate() {
  const response = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASSWORD })
  });
  const body = await response.json();
  if (!response.ok) throw new Error(`Auth failed: ${body?.message}`);
  return body.token;
}

async function request(method, endpoint, token, payload = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };
  if (payload) options.body = JSON.stringify(payload);
  
  const response = await fetch(`${PB_URL}${endpoint}`, options);
  const body = await response.json();
  if (!response.ok) {
    console.error(`${method} ${endpoint} failed:`, body);
    throw new Error(`${method} ${endpoint} failed: ${body?.message || response.statusText}`);
  }
  return body;
}

async function getCollection(token, name) {
  try {
    const collections = await request('GET', '/api/collections?perPage=200', token);
    return collections.items.find(c => c.name === name);
  } catch (e) {
    return null;
  }
}

function normalizePayload(data) {
  const payload = { ...data };
  if (payload.schema && !payload.fields) {
    payload.fields = payload.schema;
    delete payload.schema;
  }
  
  if (Array.isArray(payload.fields)) {
    payload.fields = payload.fields.map((f) => {
      const normalized = { ...f };
      if (normalized.type === 'relation' && normalized.options) {
        if (normalized.options.collectionId) normalized.collectionId = normalized.options.collectionId;
        if (normalized.options.cascadeDelete !== undefined) normalized.cascadeDelete = normalized.options.cascadeDelete;
        if (normalized.options.minSelect !== undefined) normalized.minSelect = normalized.options.minSelect;
        if (normalized.options.maxSelect !== undefined) normalized.maxSelect = normalized.options.maxSelect;
        const remaining = { ...normalized.options };
        delete remaining.collectionId;
        delete remaining.cascadeDelete;
        delete remaining.minSelect;
        delete remaining.maxSelect;
        if (Object.keys(remaining).length > 0) {
          normalized.options = remaining;
        } else {
          delete normalized.options;
        }
      }
      return normalized;
    });
  }
  return payload;
}

async function updateCollectionFields(token, collectionName, fieldsToAdd) {
  const collection = await getCollection(token, collectionName);
  if (!collection) {
    console.log(`  ⚠ Collection not found: ${collectionName}`);
    return;
  }

  const existingNames = new Set((collection.fields || []).map(f => f.name));
  const newFields = fieldsToAdd.filter(f => !existingNames.has(f.name));
  
  if (newFields.length === 0) {
    console.log(`  ✓ ${collectionName} already has all fields`);
    return;
  }

  const allFields = [...(collection.fields || []), ...newFields];
  const payload = normalizePayload({ fields: allFields });
  
  await request('PATCH', `/api/collections/${collection.id}`, token, payload);
  console.log(`  ✓ ${collectionName}: added ${newFields.length} fields`);
}

async function main() {
  console.log('Building PocketBase collections to support all hooks...\n');
  
  const token = await authenticate();
  console.log('Authenticated\n');

  const membersCol = await getCollection(token, 'members');
  const groupsCol = await getCollection(token, 'groups');
  const loansCol = await getCollection(token, 'loans');
  const savingsCol = await getCollection(token, 'savings');

  console.log('Updating collections with required fields:\n');

  await updateCollectionFields(token, 'notifications', [
    { name: 'member_id', type: 'relation', required: false, collectionId: membersCol?.id, cascadeDelete: true, minSelect: 1, maxSelect: 1 },
    { name: 'type', type: 'select', required: false, options: { values: ['loan_request', 'vote', 'approval', 'disbursement', 'repayment_due', 'penalty', 'message', 'system'] } },
    { name: 'title', type: 'text', required: false },
    { name: 'message', type: 'text', required: false },
    { name: 'status', type: 'select', required: false, options: { values: ['pending', 'sent', 'read', 'failed'] } },
    { name: 'read_status', type: 'bool', required: false }
  ]);

  await updateCollectionFields(token, 'contributions_history', [
    { name: 'member_id', type: 'relation', required: false, collectionId: membersCol?.id, cascadeDelete: true, minSelect: 1, maxSelect: 1 },
    { name: 'group_id', type: 'relation', required: false, collectionId: groupsCol?.id, cascadeDelete: true, minSelect: 1, maxSelect: 1 },
    { name: 'type', type: 'select', required: false, options: { values: ['savings', 'loan_disbursement', 'loan_repayment', 'interest_earned', 'penalty', 'bonus'] } },
    { name: 'amount', type: 'number', required: false },
    { name: 'date', type: 'date', required: false },
    { name: 'description', type: 'text', required: false },
    { name: 'balance', type: 'number', required: false }
  ]);

  await updateCollectionFields(token, 'loan_guarantors', [
    { name: 'loan_id', type: 'relation', required: false, collectionId: loansCol?.id, cascadeDelete: true, minSelect: 1, maxSelect: 1 },
    { name: 'member_id', type: 'relation', required: false, collectionId: membersCol?.id, cascadeDelete: true, minSelect: 1, maxSelect: 1 },
    { name: 'collateral_amount', type: 'number', required: false },
    { name: 'status', type: 'select', required: false, options: { values: ['pending', 'confirmed', 'released', 'acknowledged', 'approved', 'active'] } },
    { name: 'guarantor_id', type: 'text', required: false },
    { name: 'guarantorStatus', type: 'text', required: false },
    { name: 'loan_type', type: 'text', required: false }
  ]);

  await updateCollectionFields(token, 'loan_approvals', [
    { name: 'loan_id', type: 'relation', required: false, collectionId: loansCol?.id, cascadeDelete: true, minSelect: 1, maxSelect: 1 },
    { name: 'member_id', type: 'relation', required: false, collectionId: membersCol?.id, cascadeDelete: true, minSelect: 1, maxSelect: 1 },
    { name: 'approved', type: 'bool', required: false },
    { name: 'vote_type', type: 'select', required: false, options: { values: ['approval', 'guarantor_confirmation'] } },
    { name: 'collateral_amount', type: 'number', required: false },
    { name: 'loan_type', type: 'text', required: false }
  ]);

  await updateCollectionFields(token, 'loans', [
    { name: 'member_id', type: 'relation', required: false, collectionId: membersCol?.id, cascadeDelete: true, minSelect: 1, maxSelect: 1 },
    { name: 'group_id', type: 'relation', required: false, collectionId: groupsCol?.id, cascadeDelete: true, minSelect: 1, maxSelect: 1 },
    { name: 'amount', type: 'number', required: false },
    { name: 'balance', type: 'number', required: false },
    { name: 'interest_rate', type: 'number', required: false },
    { name: 'loan_type', type: 'select', required: false, options: { values: ['IL', 'GIL'] } },
    { name: 'status', type: 'select', required: false, options: { values: ['pending', 'approved', 'active', 'partially_paid', 'fully_paid', 'rejected', 'defaulted'] } },
    { name: 'repayment_period', type: 'number', required: false },
    { name: 'disbursement_date', type: 'date', required: false },
    { name: 'date', type: 'date', required: false },
    { name: 'collateral_amount', type: 'number', required: false },
    { name: 'guarantor_id', type: 'text', required: false }
  ]);

  await updateCollectionFields(token, 'savings', [
    { name: 'group_id', type: 'relation', required: false, collectionId: groupsCol?.id, cascadeDelete: true, minSelect: 1, maxSelect: 1 },
    { name: 'balance', type: 'number', required: false },
    { name: 'total_savings', type: 'number', required: false }
  ]);

  await updateCollectionFields(token, 'group_members', [
    { name: 'status', type: 'select', required: false, options: { values: ['active', 'inactive', 'suspended'] } }
  ]);

  await updateCollectionFields(token, 'payments', [
    { name: 'member_id', type: 'relation', required: false, collectionId: membersCol?.id, cascadeDelete: true, minSelect: 1, maxSelect: 1 },
    { name: 'amount', type: 'number', required: false },
    { name: 'payment_type', type: 'select', required: false, options: { values: ['registration', 'insurance', 'loan_repayment', 'savings', 'other'] } },
    { name: 'payment_status', type: 'select', required: false, options: { values: ['pending', 'completed', 'failed'] } },
    { name: 'payment_id', type: 'text', required: false }
  ]);

  await updateCollectionFields(token, 'penalties', [
    { name: 'loan_id', type: 'relation', required: false, collectionId: loansCol?.id, cascadeDelete: true, minSelect: 1, maxSelect: 1 },
    { name: 'member_id', type: 'relation', required: false, collectionId: membersCol?.id, cascadeDelete: true, minSelect: 1, maxSelect: 1 },
    { name: 'amount', type: 'number', required: false },
    { name: 'balance', type: 'number', required: false },
    { name: 'reason', type: 'text', required: false },
    { name: 'date', type: 'date', required: false }
  ]);

  await updateCollectionFields(token, 'fraud_alerts', [
    { name: 'member_id', type: 'relation', required: false, collectionId: membersCol?.id, cascadeDelete: true, minSelect: 1, maxSelect: 1 },
    { name: 'amount', type: 'number', required: false },
    { name: 'payment_type', type: 'text', required: false },
    { name: 'severity', type: 'select', required: false, options: { values: ['low', 'medium', 'high', 'critical'] } },
    { name: 'detected_at', type: 'date', required: false },
    { name: 'first_name', type: 'text', required: false },
    { name: 'last_name', type: 'text', required: false },
    { name: 'payment_id', type: 'text', required: false }
  ]);

  await updateCollectionFields(token, 'company_transactions', [
    { name: 'member_id', type: 'relation', required: false, collectionId: membersCol?.id, cascadeDelete: true, minSelect: 1, maxSelect: 1 },
    { name: 'amount', type: 'number', required: false },
    { name: 'transaction_type', type: 'text', required: false },
    { name: 'payment_id', type: 'text', required: false },
    { name: 'payment_status', type: 'select', required: false, options: { values: ['pending', 'completed', 'failed'] } },
    { name: 'first_name', type: 'text', required: false },
    { name: 'last_name', type: 'text', required: false },
    { name: 'date', type: 'date', required: false }
  ]);

  console.log('\n✓ Collection schema build complete!');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
