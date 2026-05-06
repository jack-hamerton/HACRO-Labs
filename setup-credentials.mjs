// Quick setup script to create test credentials
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function setup() {
  try {
    // Authenticate as superuser
    await pb.admins.authWithPassword('hamertonotieno99@gmail.com', 'E75p6p5!');
    console.log('✅ Authenticated as superuser');

    // Create/update admin account
    try {
      const admins = await pb.collection('admins').getFullList({
        filter: `email = "admin@hacrolabs.com"`,
      });

      if (admins.length > 0) {
        await pb.collection('admins').update(admins[0].id, {
          password: 'Admin@123456',
          passwordConfirm: 'Admin@123456',
        });
        console.log('✅ Updated admin credentials');
      } else {
        await pb.collection('admins').create({
          email: 'admin@hacrolabs.com',
          password: 'Admin@123456',
          passwordConfirm: 'Admin@123456',
          full_name: 'System Administrator',
          role: 'super_admin',
        });
        console.log('✅ Created admin account');
      }
    } catch (error) {
      console.error('❌ Admin setup error:', error.message);
    }

    // Create/update member account
    try {
      const members = await pb.collection('members').getFullList({
        filter: `email = "member@example.com"`,
      });

      if (members.length > 0) {
        await pb.collection('members').update(members[0].id, {
          password: 'Member@123456',
          passwordConfirm: 'Member@123456',
        });
        console.log('✅ Updated member credentials');
      } else {
        await pb.collection('members').create({
          email: 'member@example.com',
          password: 'Member@123456',
          passwordConfirm: 'Member@123456',
          first_name: 'John',
          last_name: 'Doe',
          phone: '254700123456',
          age: 30,
          location: 'Nairobi',
          category: 'Individual',
        });
        console.log('✅ Created member account');
      }
    } catch (error) {
      console.error('❌ Member setup error:', error.message);
    }

    console.log('\n✅ Setup complete!');
    console.log('\nTest Credentials:');
    console.log('Admin: admin@hacrolabs.com / Admin@123456');
    console.log('Member: member@example.com / Member@123456');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

setup();
