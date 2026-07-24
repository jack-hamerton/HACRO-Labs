import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PB_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'Admin123!';
const LOCAL_SCHEMA_PATH = path.resolve(__dirname, '..', 'schema-live.json');
const hooksDir = path.resolve(__dirname, '..', 'pb_hooks');


async function authenticate() {
  const response = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASSWORD })
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(`PocketBase auth failed: ${body?.message || response.statusText}`);
  }
  return body.token;
}

async function fetchLiveSchema() {
  const token = await authenticate();
  const response = await fetch(`${PB_URL}/api/collections?perPage=200`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to fetch live collections: ${body?.message || response.statusText}`);
  }
  return body.items || [];
}

function loadJson(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(text.replace(/^\uFEFF/, ''));
}

function listHookFiles() {
  return fs.readdirSync(hooksDir).filter((f) => f.endsWith('.pb.js'));
}

function readHook(fileName) {
  return fs.readFileSync(path.join(hooksDir, fileName), 'utf8');
}

function parseCollections(code) {
  const names = new Set();
  const collectionRegex = /\$app\.(?:findRecordsByFilter|findRecordById)\(\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = collectionRegex.exec(code)) !== null) {
    names.add(m[1]);
  }
  const newRecordRegex = /new Record\(\s*['"]([^'"]+)['"]/g;
  while ((m = newRecordRegex.exec(code)) !== null) {
    names.add(m[1]);
  }
  const hookTargetRegex = /\),\s*['"]([^'"]+)['"]\s*\)/g;
  while ((m = hookTargetRegex.exec(code)) !== null) {
    names.add(m[1]);
  }
  return Array.from(names).sort();
}

function parseFieldAccesses(code) {
  const fields = new Set();
  // Match .get('fieldName') and .set('fieldName', ...)
  const getSetRegex = /\.(?:get|set)\(\s*['"]([^'"]+)['"]\s*[,)]/g;
  let m;
  while ((m = getSetRegex.exec(code)) !== null) {
    const field = m[1];
    if (field && /^[a-zA-Z0-9_]+$/.test(field)) {
      fields.add(field);
    }
  }
  return Array.from(fields).sort();
}

function parseFilterFields(code) {
  const fields = new Set();
  // Extract fields from filter expressions like findRecordsByFilter(..., 'status = "active"')
  const filterRegex = /findRecordsByFilter\s*\(\s*['"][^'"]*['"]\s*,\s*['"]([^'"]*)['"]/g;
  let m;
  while ((m = filterRegex.exec(code)) !== null) {
    const filterExpr = m[1];
    // Extract field names before operators: status = 'active', member_id != '', etc.
    const fieldMatches = filterExpr.match(/([a-zA-Z0-9_]+)\s*(?:!=|>=|<=|=|>|<)/g) || [];
    fieldMatches.forEach((fm) => {
      const field = fm.replace(/\s*(?:!=|>=|<=|=|>|<).*/, '').trim();
      if (field && /^[a-zA-Z0-9_]+$/.test(field)) {
        fields.add(field);
      }
    });
  }
  return Array.from(fields).sort();
}

function normalizeFieldName(name) {
  return name.trim();
}

async function run() {
  try {
    const schema = await fetchLiveSchema();
    const liveCollections = {};
    schema.forEach((col) => {
      liveCollections[col.name] = {
        id: col.id,
        type: col.type,
        fields: col.fields.map((f) => f.name),
        fieldSet: new Set(col.fields.map((f) => f.name)),
      };
    });

    const hookFiles = listHookFiles();
    const summary = [];
    const allReferencedCollections = new Set();
    const builtInFields = new Set(['id', 'created', 'updated']);

    hookFiles.forEach((file) => {
      const code = readHook(file);
      const collections = parseCollections(code);
      const getFields = parseFieldAccesses(code);
      const filterFields = parseFilterFields(code);
      const referencedFields = new Set([...getFields, ...filterFields].map(normalizeFieldName));
      collections.forEach((col) => allReferencedCollections.add(col));
      summary.push({ file, collections, getFields, filterFields: Array.from(filterFields).sort(), referencedFields: Array.from(referencedFields).sort() });
    });

    const missingCollections = Array.from(allReferencedCollections).filter((col) => !liveCollections[col]);
    console.log('=== PocketBase Runtime Validation ===');
    console.log(`Live collection count: ${Object.keys(liveCollections).length}`);
    console.log(`Hook-referenced collection count: ${allReferencedCollections.size}`);
    console.log('Missing collections:', missingCollections.length ? missingCollections.join(', ') : 'None');
    console.log('');

    const collectionProblems = [];
    summary.forEach((entry) => {
      entry.collections.forEach((col) => {
        if (!liveCollections[col]) return;
        const fields = entry.referencedFields.filter((field) => !builtInFields.has(field));
        const missing = fields.filter((field) => !liveCollections[col].fieldSet.has(field));
        if (missing.length) {
          collectionProblems.push({ file: entry.file, collection: col, missing: Array.from(new Set(missing)).sort(), liveFields: liveCollections[col].fields.sort() });
        }
      });
    });

    if (collectionProblems.length === 0) {
      console.log('✓ All hook field references found in live schema!');
    } else {
      console.log('Missing fields by collection:');
      collectionProblems.forEach((problem) => {
        console.log(`\nFile: ${problem.file}`);
        console.log(` Collection: ${problem.collection}`);
        console.log(` Missing fields: ${problem.missing.join(', ')}`);
        console.log(` Schema fields: ${problem.liveFields.join(', ')}`);
      });
    }

    console.log('\n=== Detailed hook reference summary ===');
    summary.forEach((entry) => {
      console.log(`\nHook: ${entry.file}`);
      console.log(` Collections referenced: ${entry.collections.join(', ') || 'None'}`);
      console.log(` .get fields: ${entry.getFields.join(', ') || 'None'}`);
      console.log(` Filter fields: ${entry.filterFields.join(', ') || 'None'}`);
    });
  } catch (error) {
    console.error('Validation error:', error.message);
    process.exit(1);
  }
}

run();
