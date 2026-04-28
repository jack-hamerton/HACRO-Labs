/**
 * PocketBase Schema Migration for IL & GIL Loan System
 * 
 * Set environment variables:
 * POCKETBASE_ADMIN_EMAIL=your-admin-email
 * POCKETBASE_ADMIN_PASSWORD=your-admin-password
 * 
 * Or edit the script with your credentials
 */

const PB_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'hamertonotieno99@gmail.com'; // Change this
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'E75p6p5!'; // Change this
const ADMIN_TOKEN = process.env.POCKETBASE_ADMIN_TOKEN || null;

let authToken = ADMIN_TOKEN;

async function authenticate() {
  console.log('\n🔐 Authenticating with PocketBase...');
  if (ADMIN_TOKEN) {
    console.log('✅ Using provided admin token for authentication');
    return true;
  }

  const result = await makeRequest('POST', '/api/admins/auth-with-password', {
    identity: ADMIN_EMAIL,
    password: ADMIN_PASSWORD
  });

  if (result.ok && result.data.token) {
    authToken = result.data.token;
    console.log('✅ Authenticated successfully');
    return true;
  } else {
    console.error('❌ Authentication failed:', result.data?.message || result.error);
    console.log('   Make sure PocketBase is running and admin credentials are correct');
    console.log('   Set POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD environment variables');
    return false;
  }
}

async function makeRequest(method, endpoint, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (authToken) {
    options.headers['Authorization'] = `Bearer ${authToken}`;
  }

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
  }

  if (result.status === 401 || result.status === 403) {
    console.log('✅ PocketBase is reachable at', PB_URL, '(admin auth required)');
    return true;
  }

  console.error('❌ Cannot connect to PocketBase at', PB_URL);
  if (result.status) {
    console.error(`   HTTP ${result.status} - ${JSON.stringify(result.data)}`);
  }
  console.error('   Make sure PocketBase is running: pocketbase serve\n');
  return false;
}

async function getCollectionByName(name) {
  const result = await makeRequest('GET', '/api/collections');
  if (result.ok && result.data.items) {
    return result.data.items.find(c => c.name === name);
  }
  return null;
}

async function updateCollection(collectionId, updates) {
  const result = await makeRequest('PATCH', `/api/collections/${collectionId}`, updates);
  if (result.ok) {
    console.log(`✅ Updated collection: ${updates.name || collectionId}`);
    return true;
  } else {
    console.error(`❌ Failed to update collection:`, result.data ? JSON.stringify(result.data) : result.error);
    return false;
  }
}

async function createCollection(collectionData) {
  const result = await makeRequest('POST', '/api/collections', collectionData);
  if (result.ok) {
    console.log(`✅ Created collection: ${collectionData.name}`);
    return true;
  } else {
    console.error(`❌ Failed to create collection:`, result.data?.message || result.error);
    return false;
  }
}

async function getCollections() {
  const result = await makeRequest('GET', '/api/collections');
  return result.ok ? result.data.items || [] : [];
}

async function createCollectionIfMissing(collectionData) {
  const existing = await getCollectionByName(collectionData.name);
  if (existing) {
    console.log(`✅ ${collectionData.name} already exists`);
    return existing;
  }

  const result = await makeRequest('POST', '/api/collections', collectionData);
  if (result.ok) {
    console.log(`✅ Created collection: ${collectionData.name}`);
    return result.data;
  }

  console.error(`❌ Failed to create collection: ${collectionData.name}`, result.data ? JSON.stringify(result.data) : result.error);
  return null;
}

async function ensureRelationField(collection, fieldName, targetCollectionId) {
  const field = collection.schema.find(f => f.name === fieldName && f.type === 'relation');
  if (!field || !field.options) return false;

  if (field.options.collectionId !== targetCollectionId) {
    field.options.collectionId = targetCollectionId;
    return true;
  }
  return false;
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 PocketBase Schema Migration for IL & GIL Loan System');
  console.log('='.repeat(70));

  const connected = await testConnection();
  if (!connected) {
    console.log('❌ Cannot connect to PocketBase. Make sure it\'s running.');
    return;
  }

  const authenticated = await authenticate();
  if (!authenticated) {
    console.log('❌ Authentication failed. Cannot proceed with migration.');
    return;
  }

  console.log('\n🔄 Starting schema migration...\n');

  const membersCollection = await createCollectionIfMissing({
    name: 'members',
    type: 'auth',
    schema: [
      { name: 'first_name', type: 'text', required: true },
      { name: 'last_name', type: 'text', required: true },
      { name: 'phone', type: 'text', required: true },
      { name: 'location', type: 'text', required: false },
      { name: 'category', type: 'text', required: false },
      { name: 'spouse_kin_name', type: 'text', required: false },
      { name: 'age', type: 'number', required: false },
      {
        name: 'profile_picture',
        type: 'file',
        required: false,
        options: {
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
          thumbs: []
        }
      }
    ],
    options: {
      allowEmailAuth: true,
      allowUsernameAuth: false,
      minPasswordLength: 8,
      requireEmail: true
    }
  });

  const adminsCollection = await createCollectionIfMissing({
    name: 'admins',
    type: 'auth',
    schema: [
      { name: 'full_name', type: 'text', required: true },
      { name: 'role', type: 'select', required: true, options: { values: ['admin', 'super_admin'] } },
      { name: 'is_active', type: 'bool', required: true, options: { trueLabel: 'Active', falseLabel: 'Inactive' } }
    ],
    options: {
      allowEmailAuth: true,
      allowUsernameAuth: false,
      minPasswordLength: 8,
      requireEmail: true
    }
  });

  const groupsCollection = await createCollectionIfMissing({
    name: 'groups',
    type: 'base',
    schema: [
      { name: 'group_name', type: 'text', required: true },
      { name: 'region', type: 'text', required: false },
      { name: 'member_count', type: 'number', required: false },
      { name: 'description', type: 'text', required: false }
    ]
  });

  const groupMembersCollection = await createCollectionIfMissing({
    name: 'group_members',
    type: 'base',
    schema: [
      {
        name: 'group_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: groupsCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      {
        name: 'member_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: membersCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      { name: 'joined_date', type: 'date', required: false }
    ]
  });

  const loansCollection = await createCollectionIfMissing({
    name: 'loans',
    type: 'base',
    schema: [
      {
        name: 'member_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: membersCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      {
        name: 'group_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: groupsCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      { name: 'amount', type: 'number', required: true },
      { name: 'interest_rate', type: 'number', required: true },
      { name: 'repayment_period', type: 'number', required: true },
      { name: 'loan_type', type: 'select', required: true, options: { values: ['IL', 'GIL'] } },
      { name: 'status', type: 'select', required: true, options: { values: ['pending', 'approved', 'active', 'partially_paid', 'fully_paid', 'rejected'] } },
      { name: 'created_date', type: 'date', required: true },
      { name: 'purpose', type: 'text', required: false },
      { name: 'grace_period_end_date', type: 'date', required: false },
      { name: 'repayment_start_date', type: 'date', required: false },
      { name: 'disbursement_date', type: 'date', required: false }
    ]
  });

  const loanApprovalsCollection = await createCollectionIfMissing({
    name: 'loan_approvals',
    type: 'base',
    schema: [
      {
        name: 'loan_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: loansCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      {
        name: 'member_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: membersCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      { name: 'approved', type: 'bool', required: false },
      { name: 'vote_type', type: 'select', required: true, options: { values: ['approval', 'guarantor_confirmation'] } },
      { name: 'collateral_amount', type: 'number', required: false },
      { name: 'vote_date', type: 'date', required: false }
    ]
  });

  const savingsCollection = await createCollectionIfMissing({
    name: 'savings',
    type: 'base',
    schema: [
      {
        name: 'member_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: membersCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      {
        name: 'group_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: groupsCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      { name: 'amount', type: 'number', required: true },
      { name: 'date', type: 'date', required: true },
      { name: 'description', type: 'text', required: false },
      { name: 'held_collateral', type: 'number', required: false }
    ]
  });

  const paymentsCollection = await createCollectionIfMissing({
    name: 'payments',
    type: 'base',
    schema: [
      {
        name: 'member_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: membersCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      { name: 'amount', type: 'number', required: true },
      { name: 'payment_date', type: 'date', required: true },
      { name: 'mpesa_reference', type: 'text', required: false },
      { name: 'checkout_request_id', type: 'text', required: false },
      { name: 'payment_status', type: 'select', required: true, options: { values: ['pending', 'completed', 'failed'] } },
      {
        name: 'acknowledgment_file',
        type: 'file',
        required: false,
        options: {
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
          thumbs: []
        }
      }
    ]
  });

  const loanRepaymentsCollection = await createCollectionIfMissing({
    name: 'loan_repayments',
    type: 'base',
    schema: [
      {
        name: 'loan_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: loansCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      {
        name: 'member_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: membersCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      { name: 'amount', type: 'number', required: true },
      { name: 'date', type: 'date', required: true },
      { name: 'installment_number', type: 'number', required: false }
    ]
  });

  const contributionsHistoryCollection = await createCollectionIfMissing({
    name: 'contributions_history',
    type: 'base',
    schema: [
      {
        name: 'member_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: membersCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      {
        name: 'group_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: groupsCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      { name: 'type', type: 'select', required: true, options: { values: ['savings', 'loan_disbursement', 'loan_repayment'] } },
      { name: 'amount', type: 'number', required: true },
      { name: 'date', type: 'date', required: true },
      { name: 'description', type: 'text', required: false },
      { name: 'balance', type: 'number', required: false }
    ]
  });

  const penaltiesCollection = await createCollectionIfMissing({
    name: 'penalties',
    type: 'base',
    schema: [
      {
        name: 'loan_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: loansCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      {
        name: 'member_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: membersCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      { name: 'amount', type: 'number', required: true },
      { name: 'date_applied', type: 'date', required: true },
      { name: 'reason', type: 'text', required: false },
      { name: 'waived', type: 'bool', required: false },
      {
        name: 'waived_by',
        type: 'relation',
        required: false,
        options: {
          collectionId: adminsCollection?.id || '',
          cascadeDelete: false,
          minSelect: 1,
          maxSelect: 1
        }
      },
      { name: 'waived_reason', type: 'text', required: false }
    ]
  });

  const notificationsCollection = await createCollectionIfMissing({
    name: 'notifications',
    type: 'base',
    schema: [
      {
        name: 'member_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: membersCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      { name: 'type', type: 'select', required: true, options: { values: ['loan_request', 'vote', 'approval', 'disbursement', 'repayment_due', 'penalty', 'message'] } },
      { name: 'title', type: 'text', required: true },
      { name: 'message', type: 'text', required: true },
      { name: 'read_status', type: 'bool', required: false }
    ]
  });

  const messagesCollection = await createCollectionIfMissing({
    name: 'messages',
    type: 'base',
    schema: [
      {
        name: 'group_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: groupsCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      {
        name: 'member_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: membersCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      { name: 'message_content', type: 'text', required: true },
      { name: 'pinned', type: 'bool', required: false }
    ]
  });

  const achievementsCollection = await createCollectionIfMissing({
    name: 'achievements',
    type: 'base',
    schema: [
      {
        name: 'member_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: membersCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      { name: 'title', type: 'text', required: true },
      { name: 'description', type: 'text', required: false },
      { name: 'date', type: 'date', required: true }
    ]
  });

  const bonusesCollection = await createCollectionIfMissing({
    name: 'bonuses',
    type: 'base',
    schema: [
      {
        name: 'member_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: membersCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      { name: 'bonus_type', type: 'text', required: true },
      { name: 'amount', type: 'number', required: true },
      { name: 'created', type: 'date', required: true }
    ]
  });

  if (loansCollection) {
    const existingFields = loansCollection.schema.map(f => f.name);
    const newFields = [
      { name: 'member_id', type: 'relation', required: true, options: { collectionId: membersCollection?.id || '', cascadeDelete: true, minSelect: 1, maxSelect: 1 } },
      { name: 'group_id', type: 'relation', required: true, options: { collectionId: groupsCollection?.id || '', cascadeDelete: true, minSelect: 1, maxSelect: 1 } },
      { name: 'amount', type: 'number', required: true },
      { name: 'interest_rate', type: 'number', required: true },
      { name: 'repayment_period', type: 'number', required: true },
      { name: 'loan_type', type: 'select', required: true, options: { values: ['IL', 'GIL'] } },
      { name: 'status', type: 'select', required: true, options: { values: ['pending', 'approved', 'active', 'partially_paid', 'fully_paid', 'rejected'] } },
      { name: 'created_date', type: 'date', required: true },
      { name: 'purpose', type: 'text', required: false },
      { name: 'grace_period_end_date', type: 'date', required: false },
      { name: 'repayment_start_date', type: 'date', required: false },
      { name: 'disbursement_date', type: 'date', required: false }
    ];

    const fieldsToAdd = newFields.filter(f => !existingFields.includes(f.name));
    if (fieldsToAdd.length > 0) {
      loansCollection.schema.push(...fieldsToAdd);
      await updateCollection(loansCollection.id, { schema: loansCollection.schema });
    } else {
      console.log('✅ Loans collection already up to date');
    }
  } else {
    console.log('⚠️  Loans collection not found');
  }

  if (loanApprovalsCollection) {
    const approvalsCollection = loanApprovalsCollection;
    const existingFields = approvalsCollection.schema.map(f => f.name);
    const newFields = [
      { name: 'approved', type: 'bool', required: false },
      { name: 'vote_type', type: 'select', required: true, options: { values: ['approval', 'guarantor_confirmation'] } },
      { name: 'collateral_amount', type: 'number', required: false },
      { name: 'vote_date', type: 'date', required: false }
    ];

    const fieldsToAdd = newFields.filter(f => !existingFields.includes(f.name));
    if (fieldsToAdd.length > 0) {
      approvalsCollection.schema.push(...fieldsToAdd);
      await updateCollection(approvalsCollection.id, { schema: approvalsCollection.schema });
    } else {
      console.log('✅ Loan approvals collection already up to date');
    }

    if (membersCollection) {
      let hasChange = false;
      hasChange = await ensureRelationField(approvalsCollection, 'member_id', membersCollection.id) || hasChange;
      hasChange = await ensureRelationField(approvalsCollection, 'loan_id', loansCollection?.id || '') || hasChange;
      if (hasChange) {
        await updateCollection(approvalsCollection.id, { schema: approvalsCollection.schema });
      }
    }
  } else {
    console.log('⚠️  Loan approvals collection not found');
  }

  if (savingsCollection) {
    const existingFields = savingsCollection.schema.map(f => f.name);
    const newFields = [
      { name: 'member_id', type: 'relation', required: true, options: { collectionId: membersCollection?.id || '', cascadeDelete: true, minSelect: 1, maxSelect: 1 } },
      { name: 'group_id', type: 'relation', required: true, options: { collectionId: groupsCollection?.id || '', cascadeDelete: true, minSelect: 1, maxSelect: 1 } },
      { name: 'amount', type: 'number', required: true },
      { name: 'date', type: 'date', required: true },
      { name: 'description', type: 'text', required: false },
      { name: 'held_collateral', type: 'number', required: false }
    ];

    const fieldsToAdd = newFields.filter(f => !existingFields.includes(f.name));
    if (fieldsToAdd.length > 0) {
      savingsCollection.schema.push(...fieldsToAdd);
      await updateCollection(savingsCollection.id, { schema: savingsCollection.schema });
    } else {
      console.log('✅ Savings collection already up to date');
    }
  } else {
    console.log('⚠️  Savings collection not found');
  }

  const guarantorsCollection = await getCollectionByName('loan_guarantors');
  if (guarantorsCollection) {
    const existingFields = guarantorsCollection.schema.map(f => f.name);
    const newFields = [
      {
        name: 'loan_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: loansCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      {
        name: 'member_id',
        type: 'relation',
        required: true,
        options: {
          collectionId: membersCollection?.id || '',
          cascadeDelete: true,
          minSelect: 1,
          maxSelect: 1
        }
      },
      { name: 'collateral_amount', type: 'number', required: true },
      { name: 'status', type: 'select', required: true, options: { values: ['pending_approval', 'confirmed', 'released'] } }
    ];

    const fieldsToAdd = newFields.filter(f => !existingFields.includes(f.name));
    if (fieldsToAdd.length > 0) {
      guarantorsCollection.schema.push(...fieldsToAdd);
      await updateCollection(guarantorsCollection.id, { schema: guarantorsCollection.schema });
    }

    if (membersCollection) {
      let hasChange = false;
      hasChange = await ensureRelationField(guarantorsCollection, 'member_id', membersCollection.id) || hasChange;
      hasChange = await ensureRelationField(guarantorsCollection, 'loan_id', loansCollection?.id || '') || hasChange;
      if (hasChange) {
        await updateCollection(guarantorsCollection.id, { schema: guarantorsCollection.schema });
      }
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('🎉 Schema migration completed!');
  console.log('='.repeat(70));
  console.log('You can now use the IL & GIL loan system.');
  console.log('Make sure to update your frontend and backend hooks accordingly.');
}

main().catch(console.error);

