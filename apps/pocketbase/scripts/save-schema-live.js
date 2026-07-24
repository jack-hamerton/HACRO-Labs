import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PB_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'Admin123!';


async function run() {
  try {
    const authRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    });

    const authBody = await authRes.json();
    if (!authRes.ok) throw new Error(`Auth failed: ${authBody?.message}`);

    const collectionsRes = await fetch(`${PB_URL}/api/collections?perPage=200`, {
      headers: { Authorization: `Bearer ${authBody.token}` }
    });

    const collectionsBody = await collectionsRes.json();
    if (!collectionsRes.ok) throw new Error(`Fetch failed: ${collectionsBody?.message}`);

    const schemaPath = path.resolve(__dirname, '..', 'schema-live.json');
    fs.writeFileSync(schemaPath, JSON.stringify(collectionsBody.items || [], null, 2));
    console.log(`Saved ${(collectionsBody.items || []).length} collections to ${schemaPath}`);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

run();
