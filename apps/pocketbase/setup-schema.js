/**
 * PocketBase Schema Migration for IL & GIL Loan System
 * Alternative: Use PocketBase Admin UI at http://localhost:8090/_/
 * 
 * Manual steps if API fails:
 * 1. Go to http://localhost:8090/_/
 * 2. Follow the collection update steps below
 */

const PB_URL = process.env.POCKETBASE_URL || 'http://localhost:8090';

async function makeRequest(method, endpoint, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${PB_URL}${endpoint}`, options);
    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

async function testConnection() {
  console.log('\n🔌 Testing PocketBase connection...');
  const result = await makeRequest('GET', '/api/collections');
  
  if (result.ok) {
    console.log('✅ Connected to PocketBase at', PB_URL);
    console.log(`   Found ${result.data.items?.length || 0} collections\n`);
    return true;
  } else {
    console.error('❌ Cannot connect to PocketBase at', PB_URL);
    console.error('   Make sure PocketBase is running: pocketbase serve\n');
    return false;
  }
}

async function getCollections() {
  const result = await makeRequest('GET', '/api/collections');
  if (result.ok && result.data.items) {
    return result.data.items;
  }
  return [];
}

async function showCollections() {
  const collections = await getCollections();
  console.log('📋 Available Collections:');
  collections.forEach(c => {
    console.log(`   • ${c.name} (${c.schema?.length || 0} fields)`);
  });
  return collections;
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 PocketBase Schema Migration Helper');
  console.log('='.repeat(70));

  const connected = await testConnection();
  
  if (!connected) {
    console.log('⚠️  Manual Setup Required');
    console.log('\nUpdate PocketBase Schema via Admin UI:');
    console.log('1. Open: http://localhost:8090/_/');
    console.log('2. Login with your admin credentials');
    console.log('\n📝 Collections to Update:');
    console.log('\n--- LOANS Collection ---');
    console.log('Add these fields:');
    console.log('  • loan_type (select: IL, GIL)');
    console.log('  • grace_period_end_date (date)');
    console.log('  • repayment_start_date (date)');
    console.log('\n--- LOAN_APPROVALS Collection ---');
    console.log('Add these fields:');
    console.log('  • vote_type (select: approval, guarantor_confirmation)');
    console.log('  • collateral_amount (number)');
    console.log('\n--- SAVINGS Collection ---');
    console.log('Add this field:');
    console.log('  • held_collateral (number)');
    console.log('\n--- NEW: LOAN_GUARANTORS Collection ---');
    console.log('Create new collection with these fields:');
    console.log('  • loan_id (relation → loans)');
    console.log('  • member_id (relation → members)');
    console.log('  • collateral_amount (number, required)');
    console.log('  • status (select: pending_approval, confirmed, released)');
    console.log('\n' + '='.repeat(70) + '\n');
    return;
  }

  const collections = await showCollections();
  
  console.log('\n' + '='.repeat(70));
  console.log('📝 Schema Update Instructions');
  console.log('='.repeat(70));
  
  console.log('\n✅ PocketBase is running. Now update collections:');
  console.log('\n🔗 Admin UI: http://localhost:8090/_/');
  console.log('\n📋 Required Changes:\n');
  
  // Check each collection
  const loans = collections.find(c => c.name === 'loans');
  if (loans) {
    const existingFields = loans.schema.map(f => f.name);
    const newFields = ['loan_type', 'grace_period_end_date', 'repayment_start_date'];
    const missingFields = newFields.filter(f => !existingFields.includes(f));
    
    console.log('LOANS collection:');
    if (missingFields.length > 0) {
      console.log('  ⚠️  Missing fields:', missingFields.join(', '));
      console.log('  → Add these fields in Admin UI');
    } else {
      console.log('  ✅ All required fields exist');
    }
  }

  const approvals = collections.find(c => c.name === 'loan_approvals');
  if (approvals) {
    const existingFields = approvals.schema.map(f => f.name);
    const newFields = ['vote_type', 'collateral_amount'];
    const missingFields = newFields.filter(f => !existingFields.includes(f));
    
    console.log('\nLOAN_APPROVALS collection:');
    if (missingFields.length > 0) {
      console.log('  ⚠️  Missing fields:', missingFields.join(', '));
      console.log('  → Add these fields in Admin UI');
    } else {
      console.log('  ✅ All required fields exist');
    }
  }

  const savings = collections.find(c => c.name === 'savings');
  if (savings) {
    const existingFields = savings.schema.map(f => f.name);
    const hasField = existingFields.includes('held_collateral');
    
    console.log('\nSAVINGS collection:');
    if (!hasField) {
      console.log('  ⚠️  Missing field: held_collateral');
      console.log('  → Add this field in Admin UI');
    } else {
      console.log('  ✅ held_collateral field exists');
    }
  }

  const guarantors = collections.find(c => c.name === 'loan_guarantors');
  console.log('\nLOAN_GUARANTORS collection:');
  if (!guarantors) {
    console.log('  ⚠️  Collection does not exist');
    console.log('  → Create in Admin UI with these fields:');
    console.log('     • loan_id (relation → loans)');
    console.log('     • member_id (relation → members)');
    console.log('     • collateral_amount (number)');
    console.log('     • status (select: pending_approval, confirmed, released)');
  } else {
    console.log('  ✅ Collection already exists');
  }

  console.log('\n' + '='.repeat(70));
  console.log('🌐 Admin UI Steps:');
  console.log('='.repeat(70));
  console.log('1. Visit http://localhost:8090/_/');
  console.log('2. Click on each collection and add missing fields');
  console.log('3. For select fields, add the specified options');
  console.log('4. Create loan_guarantors collection with specified fields');
  console.log('5. Save all changes');
  console.log('\n');
}

main().catch(console.error);

