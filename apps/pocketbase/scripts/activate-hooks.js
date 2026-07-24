#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PB_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'Admin123!';

async function auth() {
  const res = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASSWORD })
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Auth failed: ${body?.message}`);
  return body.token;
}

async function getColl(tok, name) {
  try {
    const res = await fetch(`${PB_URL}/api/collections`, {
      headers: { Authorization: `Bearer ${tok}` }
    });
    const body = await res.json();
    return body.items?.find(c => c.name === name);
  } catch (e) {
    return null;
  }
}

async function patch(tok, id, fields) {
  const res = await fetch(`${PB_URL}/api/collections/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` },
    body: JSON.stringify({ fields })
  });
  const body = await res.json();
  if (!res.ok) {
    console.log(`   Error:`, body?.message || res.statusText);
    return false;
  }
  return true;
}

async function main() {
  try {
    console.log('Activating PocketBase hooks by populating collection schemas...\n');
    
    const tok = await auth();
    console.log('✓ Authenticated\n');

    const specs = [
      {
        name: 'notifications',
        fields: [
          { name: 'member_id', type: 'text' },
          { name: 'type', type: 'text' },
          { name: 'title', type: 'text' },
          { name: 'message', type: 'text' },
          { name: 'status', type: 'text' },
          { name: 'read_status', type: 'bool' }
        ]
      },
      {
        name: 'contributions_history',
        fields: [
          { name: 'member_id', type: 'text' },
          { name: 'group_id', type: 'text' },
          { name: 'type', type: 'text' },
          { name: 'amount', type: 'number' },
          { name: 'date', type: 'date' },
          { name: 'description', type: 'text' },
          { name: 'balance', type: 'number' }
        ]
      },
      {
        name: 'loan_guarantors',
        fields: [
          { name: 'loan_id', type: 'text' },
          { name: 'member_id', type: 'text' },
          { name: 'collateral_amount', type: 'number' },
          { name: 'status', type: 'text' },
          { name: 'guarantor_id', type: 'text' },
          { name: 'guarantorStatus', type: 'text' },
          { name: 'loan_type', type: 'text' }
        ]
      },
      {
        name: 'loan_approvals',
        fields: [
          { name: 'loan_id', type: 'text' },
          { name: 'member_id', type: 'text' },
          { name: 'approved', type: 'bool' },
          { name: 'vote_type', type: 'text' },
          { name: 'collateral_amount', type: 'number' },
          { name: 'loan_type', type: 'text' }
        ]
      },
      {
        name: 'loans',
        fields: [
          { name: 'member_id', type: 'text' },
          { name: 'group_id', type: 'text' },
          { name: 'amount', type: 'number' },
          { name: 'balance', type: 'number' },
          { name: 'interest_rate', type: 'number' },
          { name: 'loan_type', type: 'text' },
          { name: 'status', type: 'text' },
          { name: 'repayment_period', type: 'number' },
          { name: 'disbursement_date', type: 'date' },
          { name: 'date', type: 'date' },
          { name: 'collateral_amount', type: 'number' },
          { name: 'guarantor_id', type: 'text' }
        ]
      },
      {
        name: 'savings',
        fields: [
          { name: 'balance', type: 'number' },
          { name: 'total_savings', type: 'number' }
        ]
      },
      {
        name: 'payments',
        fields: [
          { name: 'member_id', type: 'text' },
          { name: 'amount', type: 'number' },
          { name: 'payment_type', type: 'text' },
          { name: 'payment_status', type: 'text' },
          { name: 'payment_id', type: 'text' }
        ]
      },
      {
        name: 'penalties',
        fields: [
          { name: 'loan_id', type: 'text' },
          { name: 'member_id', type: 'text' },
          { name: 'amount', type: 'number' },
          { name: 'balance', type: 'number' },
          { name: 'reason', type: 'text' },
          { name: 'date', type: 'date' }
        ]
      },
      {
        name: 'fraud_alerts',
        fields: [
          { name: 'member_id', type: 'text' },
          { name: 'amount', type: 'number' },
          { name: 'payment_type', type: 'text' },
          { name: 'severity', type: 'text' },
          { name: 'detected_at', type: 'date' },
          { name: 'first_name', type: 'text' },
          { name: 'last_name', type: 'text' },
          { name: 'payment_id', type: 'text' }
        ]
      },
      {
        name: 'company_transactions',
        fields: [
          { name: 'member_id', type: 'text' },
          { name: 'amount', type: 'number' },
          { name: 'transaction_type', type: 'text' },
          { name: 'payment_id', type: 'text' },
          { name: 'payment_status', type: 'text' },
          { name: 'first_name', type: 'text' },
          { name: 'last_name', type: 'text' },
          { name: 'date', type: 'date' }
        ]
      }
    ];

    for (const spec of specs) {
      const coll = await getColl(tok, spec.name);
      if (!coll) {
        console.log(`⚠ ${spec.name} not found`);
        continue;
      }

      const existing = new Set((coll.fields || []).map(f => f.name));
      const toAdd = spec.fields.filter(f => !existing.has(f.name));
      
      if (toAdd.length === 0) {
        console.log(`✓ ${spec.name}: all fields present`);
        continue;
      }

      const allFields = [
        ...(coll.fields || []),
        ...toAdd.map(f => ({
          name: f.name,
          type: f.type,
          required: false
        }))
      ];

      const ok = await patch(tok, coll.id, allFields);
      if (ok) {
        console.log(`✓ ${spec.name}: +${toAdd.length} fields`);
      }
    }

    console.log('\n✓ Hook schema activation complete!');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
