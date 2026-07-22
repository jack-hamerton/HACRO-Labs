#!/usr/bin/env node
import PocketBase from 'pocketbase';

async function main() {
  const base = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
  const adminEmail = process.env.POCKETBASE_SUPERUSER_EMAIL || 'admin@example.com';
  const adminPass = process.env.POCKETBASE_SUPERUSER_PASSWORD || 'Admin123!';

  const pb = new PocketBase(base);
  await pb.admins.authWithPassword(adminEmail, adminPass);

  const email = 'member@example.com';
  const password = 'Member@123456';
  const phoneLocal = '0757838028';
  const location = 'kisumu county, kisumu central, Nyalenda B, western';

  const members = await pb.collection('members').getFullList({ filter: `email = "${email}"` });
  if (!members || members.length === 0) {
    console.error('Member not found');
    process.exit(1);
  }
  const member = members[0];
  console.log('Found member', member.id);

  await pb.collection('members').update(member.id, {
    first_name: 'Test',
    last_name: 'Member',
    phone: phoneLocal,
    location,
    verified: true,
    password,
    passwordConfirm: password,
  });

  const updated = await pb.collection('members').getOne(member.id);
  console.log('Updated member:', { id: updated.id, email: updated.email, phone: updated.phone, first_name: updated.first_name, last_name: updated.last_name, location: updated.location });
}

main().catch((e) => { console.error(e); process.exit(1); });
