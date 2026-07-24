const baseUrl = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const email = process.env.POCKETBASE_ADMIN_EMAIL || 'admin@example.com';
const password = process.env.POCKETBASE_ADMIN_PASSWORD || 'Admin123!';

async function authenticate() {
  const res = await fetch(`${baseUrl}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: email, password })
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body?.message || 'Authentication failed');
  }
  return body.token;
}

async function getCollections(token) {
  const res = await fetch(`${baseUrl}/api/collections?perPage=200`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to list collections');
  return data.items || [];
}

function normalizeCollectionPayload(collection) {
  const payload = { ...collection };
  if (payload.schema && !payload.fields) {
    payload.fields = payload.schema;
    delete payload.schema;
  }
  return payload;
}

async function createCollection(token, collection) {
  const res = await fetch(`${baseUrl}/api/collections`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(normalizeCollectionPayload(collection))
  });
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`Create ${collection.name} failed: ${body}`);
  }
  return body;
}

async function updateCollection(token, collectionId, collection) {
  const res = await fetch(`${baseUrl}/api/collections/${collectionId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(normalizeCollectionPayload(collection))
  });
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`Update ${collection.name || collectionId} failed: ${body}`);
  }
}

function mergeMissingFields(existing, definition) {
  if (existing.type === 'auth') return null;
  if (!['admin_sessions', 'member_sessions', 'admin_activity_log'].includes(existing.name)) return null;
  const existingNames = new Set((existing.fields || []).map((field) => field.name));
  const missingFields = (definition.schema || [])
    .filter((field) => !existingNames.has(field.name))
    .map((field) => ({
      id: `${field.type}_${field.name}_${Date.now()}`.slice(0, 30),
      name: field.name,
      type: field.type,
      required: Boolean(field.required),
      presentable: false,
      system: false,
      hidden: false,
      options: field.options || {},
    }));
  if (missingFields.length === 0) return null;
  return {
    fields: [...(existing.fields || []), ...missingFields]
  };
}

const definitions = [
  {
    name: 'members',
    type: 'auth',
    schema: [
      { name: 'first_name', type: 'text' },
      { name: 'last_name', type: 'text' },
      { name: 'middle_name', type: 'text' },
      { name: 'phone', type: 'text' },
      { name: 'age', type: 'number' },
      { name: 'location', type: 'text' },
      { name: 'category', type: 'text' },
      { name: 'spouse_kin_name', type: 'text' },
      { name: 'member_number', type: 'text' },
      { name: 'last_login', type: 'date' },
      { name: 'profile_picture', type: 'file', options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/jpeg', 'image/png', 'image/gif'], thumbs: [] } }
    ],
    options: { allowEmailAuth: true, allowUsernameAuth: false, minPasswordLength: 8, requireEmail: true }
  },
  {
    name: 'pbc_admins_auth',
    type: 'auth',
    schema: [
      { name: 'full_name', type: 'text' },
      { name: 'role', type: 'select', options: { values: ['admin', 'super_admin', 'moderator'] } },
      { name: 'is_active', type: 'bool' },
      { name: 'phone', type: 'text' },
      { name: 'payment_amount', type: 'number' }
    ],
    options: { allowEmailAuth: true, allowUsernameAuth: false, minPasswordLength: 8, requireEmail: true }
  },
  {
    name: 'groups',
    type: 'base',
    schema: [
      { name: 'group_name', type: 'text' },
      { name: 'region', type: 'text' },
      { name: 'member_count', type: 'number' },
      { name: 'description', type: 'text' }
    ]
  },
  {
    name: 'group_members',
    type: 'base',
    schema: [
      { name: 'group_id', type: 'text' },
      { name: 'member_id', type: 'text' },
      { name: 'joined_date', type: 'date' }
    ]
  },
  {
    name: 'loans',
    type: 'base',
    schema: [
      { name: 'member_id', type: 'text' },
      { name: 'amount', type: 'number' },
      { name: 'balance', type: 'number' },
      { name: 'status', type: 'select', options: { values: ['pending', 'active', 'approved', 'rejected', 'completed', 'defaulted'] } },
      { name: 'loan_type', type: 'select', options: { values: ['IL', 'GIL'] } },
      { name: 'repayment_start_date', type: 'date' },
      { name: 'grace_period_end_date', type: 'date' },
      { name: 'repayment_period', type: 'select', options: { values: ['2_months', '4_months', '6_months'] } },
      { name: 'interest_rate', type: 'number' }
    ]
  },
  {
    name: 'loan_repayments',
    type: 'base',
    schema: [
      { name: 'loan_id', type: 'text' },
      { name: 'member_id', type: 'text' },
      { name: 'amount', type: 'number' },
      { name: 'payment_date', type: 'date' }
    ]
  },
  {
    name: 'savings',
    type: 'base',
    schema: [
      { name: 'member_id', type: 'text' },
      { name: 'amount', type: 'number' },
      { name: 'total_savings', type: 'number' },
      { name: 'description', type: 'text' }
    ]
  },
  {
    name: 'savings_contributions',
    type: 'base',
    schema: [
      { name: 'member_id', type: 'text' },
      { name: 'amount', type: 'number' },
      { name: 'contribution_date', type: 'date' }
    ]
  },
  {
    name: 'contributions_history',
    type: 'base',
    schema: [
      { name: 'member_id', type: 'text' },
      { name: 'type', type: 'text' },
      { name: 'amount', type: 'number' },
      { name: 'description', type: 'text' }
    ]
  },
  {
    name: 'payments',
    type: 'base',
    schema: [
      { name: 'member_id', type: 'text' },
      { name: 'amount', type: 'number' },
      { name: 'payment_date', type: 'date' },
      { name: 'mpesa_reference', type: 'text' },
      { name: 'checkout_request_id', type: 'text' },
      { name: 'payment_status', type: 'text' }
    ]
  },
  {
    name: 'staff_members',
    type: 'base',
    schema: [
      { name: 'full_name', type: 'text' },
      { name: 'role', type: 'text' },
      { name: 'company_position', type: 'text' },
      { name: 'priority', type: 'number' },
      { name: 'image_url', type: 'text' }
    ]
  },
  {
    name: 'admin_sessions',
    type: 'base',
    schema: [
      { name: 'admin_id', type: 'text' },
      { name: 'token', type: 'text' },
      { name: 'expires_date', type: 'date' },
      { name: 'ip_address', type: 'text' },
      { name: 'user_agent', type: 'text' }
    ]
  },
  {
    name: 'member_sessions',
    type: 'base',
    schema: [
      { name: 'member_id', type: 'text' },
      { name: 'token', type: 'text' },
      { name: 'expires_date', type: 'date' },
      { name: 'ip_address', type: 'text' },
      { name: 'user_agent', type: 'text' }
    ]
  },
  {
    name: 'admin_activity_log',
    type: 'base',
    schema: [
      { name: 'admin_id', type: 'text' },
      { name: 'action', type: 'text' },
      { name: 'details', type: 'text' },
      { name: 'ip_address', type: 'text' },
      { name: 'user_agent', type: 'text' }
    ]
  },
  {
    name: 'conferences',
    type: 'base',
    schema: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'text' },
      { name: 'group', type: 'text' }
    ]
  },
  {
    name: 'conference_memberships',
    type: 'base',
    schema: [
      { name: 'conference', type: 'text' },
      { name: 'member', type: 'text' }
    ]
  },
  {
    name: 'conference_messages',
    type: 'base',
    schema: [
      { name: 'conference', type: 'text' },
      { name: 'member', type: 'text' },
      { name: 'message', type: 'text' }
    ]
  },
  {
    name: 'conference_voice_notes',
    type: 'base',
    schema: [
      { name: 'conference', type: 'text' },
      { name: 'member', type: 'text' },
      { name: 'file', type: 'file', options: { maxSelect: 1, maxSize: 10485760, mimeTypes: ['audio/*'], thumbs: [] } }
    ]
  },
  {
    name: 'conference_reactions',
    type: 'base',
    schema: [
      { name: 'conference', type: 'text' },
      { name: 'member', type: 'text' },
      { name: 'reaction', type: 'text' }
    ]
  },
  {
    name: 'breakout_rooms',
    type: 'base',
    schema: [
      { name: 'conference', type: 'text' },
      { name: 'name', type: 'text' }
    ]
  },
  {
    name: 'migrations',
    type: 'base',
    schema: [
      { name: 'migration_name', type: 'text' },
      { name: 'status', type: 'select', options: { values: ['pending', 'running', 'completed', 'failed'] } },
      { name: 'metadata', type: 'json' }
    ]
  },
  {
    name: 'loan_approvals',
    type: 'base',
    schema: [
      { name: 'loan_id', type: 'text' }, { name: 'member_id', type: 'text' },
      { name: 'approver_id', type: 'text' }, { name: 'approved', type: 'bool' },
      { name: 'status', type: 'text' }, { name: 'comments', type: 'text' }
    ]
  },
  {
    name: 'loan_guarantors',
    type: 'base',
    schema: [
      { name: 'loan_id', type: 'text' }, { name: 'guarantor_id', type: 'text' },
      { name: 'member_id', type: 'text' }, { name: 'status', type: 'text' },
      { name: 'amount', type: 'number' }
    ]
  },
  {
    name: 'penalties',
    type: 'base',
    schema: [
      { name: 'loan_id', type: 'text' }, { name: 'member_id', type: 'text' },
      { name: 'amount', type: 'number' }, { name: 'status', type: 'text' },
      { name: 'reason', type: 'text' }, { name: 'due_date', type: 'date' }
    ]
  },
  {
    name: 'withdrawals',
    type: 'base',
    schema: [
      { name: 'member_id', type: 'text' }, { name: 'amount', type: 'number' },
      { name: 'status', type: 'text' }, { name: 'phone', type: 'text' },
      { name: 'notes', type: 'text' }, { name: 'processed_by', type: 'text' }
    ]
  },
  {
    name: 'notifications',
    type: 'base',
    schema: [
      { name: 'member_id', type: 'text' }, { name: 'title', type: 'text' },
      { name: 'message', type: 'text' }, { name: 'read_status', type: 'bool' },
      { name: 'type', type: 'text' }
    ]
  },
  {
    name: 'messages',
    type: 'base',
    schema: [
      { name: 'member_id', type: 'text' }, { name: 'group_id', type: 'text' },
      { name: 'sender', type: 'text' }, { name: 'message', type: 'text' },
      { name: 'content', type: 'text' }, { name: 'reply_to', type: 'text' },
      { name: 'pinned', type: 'bool' }
    ]
  },
  {
    name: 'member_messages',
    type: 'base',
    schema: [
      { name: 'member_id', type: 'text' }, { name: 'group_id', type: 'text' },
      { name: 'sender_id', type: 'text' }, { name: 'content', type: 'text' },
      { name: 'message', type: 'text' }, { name: 'reply_to', type: 'text' }
    ]
  },
  {
    name: 'admin_messages',
    type: 'base',
    schema: [
      { name: 'sender', type: 'text' }, { name: 'content', type: 'text' },
      { name: 'message', type: 'text' }, { name: 'reply_to', type: 'text' }
    ]
  },
  {
    name: 'achievements',
    type: 'base',
    schema: [
      { name: 'member_id', type: 'text' }, { name: 'title', type: 'text' },
      { name: 'description', type: 'text' }, { name: 'icon', type: 'text' }
    ]
  },
  {
    name: 'bonuses',
    type: 'base',
    schema: [
      { name: 'member_id', type: 'text' }, { name: 'amount', type: 'number' },
      { name: 'reason', type: 'text' }, { name: 'status', type: 'text' }
    ]
  },
  {
    name: 'tasks',
    type: 'base',
    schema: [
      { name: 'title', type: 'text' }, { name: 'description', type: 'text' },
      { name: 'status', type: 'text' }, { name: 'progress', type: 'number' },
      { name: 'order', type: 'number' }, { name: 'assigned_to', type: 'text' }
    ]
  },
  {
    name: 'newsletters',
    type: 'base',
    schema: [
      { name: 'title', type: 'text' }, { name: 'content', type: 'text' },
      { name: 'excerpt', type: 'text' }, { name: 'status', type: 'text' },
      { name: 'published_date', type: 'date' }, { name: 'category', type: 'text' },
      { name: 'featured_image', type: 'file', options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'], thumbs: [] } }
    ]
  },
  {
    name: 'donations',
    type: 'base',
    schema: [
      { name: 'donor_name', type: 'text' }, { name: 'email', type: 'text' },
      { name: 'amount', type: 'number' }, { name: 'purpose', type: 'text' },
      { name: 'status', type: 'text' }, { name: 'mpesa_reference', type: 'text' }
    ]
  },
  {
    name: 'company_transactions',
    type: 'base',
    schema: [
      { name: 'type', type: 'text' }, { name: 'amount', type: 'number' },
      { name: 'description', type: 'text' }, { name: 'reference', type: 'text' },
      { name: 'status', type: 'text' }
    ]
  },
  {
    name: 'fraud_alerts',
    type: 'base',
    schema: [
      { name: 'member_id', type: 'text' }, { name: 'alert_type', type: 'text' },
      { name: 'description', type: 'text' }, { name: 'status', type: 'text' },
      { name: 'severity', type: 'text' }
    ]
  }
];

async function main() {
  const token = await authenticate();
  const existing = await getCollections(token);
  const existingByName = new Map(existing.flatMap((collection) => [
    [collection.name, collection],
    [collection.id, collection],
  ]));

  for (const definition of definitions) {
    const current = existingByName.get(definition.name);
    if (current) {
      const update = mergeMissingFields(current, definition);
      if (update) {
        await updateCollection(token, current.id, update);
        console.log(`✓ updated ${definition.name} fields`);
      } else {
        console.log(`✓ ${definition.name} already exists`);
      }
      continue;
    }
    await createCollection(token, definition);
    console.log(`✓ created ${definition.name}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
