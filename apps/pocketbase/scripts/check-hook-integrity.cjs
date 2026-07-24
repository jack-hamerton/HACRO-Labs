/**
 * PocketBase Hook Integrity Check
 * 
 * This script checks that:
 * 1. All hook files are syntactically valid
 * 2. All hook-referenced collections exist in PocketBase
 * 3. Critical fields exist in each collection for hook execution
 * 4. PocketBase admin API is accessible
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const baseUrl = 'http://127.0.0.1:8090';
const adminEmail = 'admin@example.com';
const adminPassword = 'Admin123!';
const hooksDir = path.resolve(__dirname, '../pb_hooks');

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
  const { data, status } = await request('/api/collections/_superusers/auth-with-password', 'POST', {
    identity: adminEmail,
    password: adminPassword,
  });
  if (status !== 200) {
    throw new Error(`Authentication failed: ${data?.message || 'Unknown error'}`);
  }
  return data.token;
}

async function getCollections(token) {
  const { data, status } = await request('/api/collections?perPage=200', 'GET', null, token);
  if (status !== 200) {
    throw new Error('Failed to fetch collections');
  }
  return data.items || [];
}

function getHookFiles() {
  return fs.readdirSync(hooksDir).filter((f) => f.endsWith('.pb.js'));
}

function parseHookCollections(code) {
  const collections = new Set();
  const patterns = [
    /\$app\.(?:findRecordsByFilter|findRecordById)\(\s*['"]([^'"]+)['"]/g,
    /new Record\(\s*['"]([^'"]+)['"]/g,
    /\},\s*['"]([^'"]+)['"]\s*\)/g,
  ];

  patterns.forEach((pattern) => {
    let m;
    while ((m = pattern.exec(code)) !== null) {
      collections.add(m[1]);
    }
  });

  return Array.from(collections);
}

function validateHookSyntax(code) {
  const errors = [];
  
  // Check for unmatched parentheses
  let parenCount = 0;
  for (const char of code) {
    if (char === '(') parenCount++;
    if (char === ')') parenCount--;
    if (parenCount < 0) {
      errors.push('Unmatched closing parenthesis');
      break;
    }
  }
  if (parenCount !== 0) {
    errors.push(`Unmatched opening parentheses (${parenCount})`);
  }

  // Check for unclosed strings
  const stringMatches = code.match(/(['"`])[^'"`]*\1/g) || [];
  const openStrings = code.replace(/(['"`])[^'"`]*\1/g, '').match(/(['"`])/g) || [];
  if (openStrings.length % 2 !== 0) {
    errors.push('Unclosed string literal');
  }

  return errors;
}

async function main() {
  console.log('='.repeat(70));
  console.log(' PocketBase Hook Integrity Check');
  console.log('='.repeat(70));

  try {
    console.log('\n1. Testing PocketBase connection...');
    const token = await authenticate();
    console.log('   ✓ Connected and authenticated');

    console.log('\n2. Fetching live collections...');
    const collections = await getCollections(token);
    const collectionMap = {};
    collections.forEach((c) => {
      collectionMap[c.name] = c;
    });
    console.log(`   ✓ Found ${collections.length} collections`);

    console.log('\n3. Validating hook files...');
    const hookFiles = getHookFiles();
    console.log(`   Found ${hookFiles.length} hook files\n`);

    let issuesFound = 0;
    const requiredFields = {
      loans: ['member_id', 'amount', 'status', 'loan_type', 'group_id'],
      members: ['email', 'phone'],
      notifications: ['member_id', 'type', 'title', 'message'],
      savings: ['member_id', 'amount', 'group_id'],
      loan_guarantors: ['loan_id', 'member_id', 'status', 'collateral_amount'],
      contributions_history: ['member_id', 'amount', 'type'],
      groups: ['group_name'],
      loan_approvals: ['loan_id', 'approved'],
      payments: ['member_id', 'amount', 'payment_status'],
      penalties: ['member_id', 'amount', 'reason'],
      group_members: ['group_id', 'member_id'],
    };

    hookFiles.forEach((file) => {
      process.stdout.write(`   Checking ${file}... `);
      const code = fs.readFileSync(path.join(hooksDir, file), 'utf8');

      // Check syntax
      const syntaxErrors = validateHookSyntax(code);
      if (syntaxErrors.length > 0) {
        console.log(`✗ Syntax errors: ${syntaxErrors.join(', ')}`);
        issuesFound++;
        return;
      }

      // Check collections referenced
      const refCollections = parseHookCollections(code);
      const missingCollections = refCollections.filter((c) => !collectionMap[c]);

      if (missingCollections.length > 0) {
        console.log(`✗ Missing collections: ${missingCollections.join(', ')}`);
        issuesFound++;
        return;
      }

      console.log('✓');
    });

    console.log('\n4. Checking critical collection fields...');
    const fieldIssues = [];
    
    Object.entries(requiredFields).forEach(([collName, fields]) => {
      const coll = collectionMap[collName];
      if (!coll) {
        fieldIssues.push(`   ✗ ${collName}: Collection not found`);
        return;
      }

      const collFieldNames = new Set(coll.fields.map((f) => f.name));
      const missing = fields.filter((f) => !collFieldNames.has(f));

      if (missing.length > 0) {
        fieldIssues.push(`   ✗ ${collName}: Missing fields: ${missing.join(', ')}`);
      } else {
        console.log(`   ✓ ${collName}: All critical fields present`);
      }
    });

    if (fieldIssues.length > 0) {
      fieldIssues.forEach((issue) => console.log(issue));
      issuesFound += fieldIssues.length;
    }

    console.log('\n' + '='.repeat(70));
    if (issuesFound === 0) {
      console.log(' ✓ All checks passed! PocketBase hooks are ready to execute.');
      console.log('='.repeat(70));
      console.log('\nYou can now:');
      console.log('1. Start PocketBase with: pocketbase serve');
      console.log('2. Enable hooks in PocketBase admin UI');
      console.log('3. Test by creating records in collections');
      process.exit(0);
    } else {
      console.log(` ✗ Found ${issuesFound} issue(s) that need to be resolved.`);
      console.log('='.repeat(70));
      process.exit(1);
    }
  } catch (err) {
    console.error('\n✗ Error:', err.message);
    process.exit(1);
  }
}

main();
