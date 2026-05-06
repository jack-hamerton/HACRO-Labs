import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function setup() {
  try {
    // Authenticate as superuser first
    await pb.admins.authWithPassword('hamertonotieno99@gmail.com', 'E75p6p5!');
    console.log('✅ Authenticated as superuser');

    // Create/update member account
    try {
      const members = await pb.collection('members').getFullList({
        filter: `email = "testmember@example.com"`,
      });

      if (members.length > 0) {
        await pb.collection('members').update(members[0].id, {
          password: 'Member@12345',
          passwordConfirm: 'Member@12345',
        });
        console.log('✅ Updated member credentials');
      } else {
        await pb.collection('members').create({
          email: 'testmember@example.com',
          password: 'Member@12345',
          passwordConfirm: 'Member@12345',
          first_name: 'Test',
          last_name: 'Member',
          phone: '254700123456',
          age: 25,
          location: 'Nairobi',
          category: 'Individual',
        });
        console.log('✅ Created member account');
      }
    } catch (error) {
      console.error('❌ Member setup error:', error.message);
    }

    console.log('\n✅ Setup complete!');
    console.log('Test Credentials:');
    console.log('Member: testmember@example.com / Member@12345');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

setup();
