import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function createTestMember() {
  try {
    // Authenticate as superuser
    await pb.admins.authWithPassword('hamertonotieno99@gmail.com', 'E75p6p5!');
    console.log('✅ Authenticated as superuser');

    // First, check if member exists
    const existingMembers = await pb.collection('members').getFullList({
      filter: `email = "testmember@hacrolabs.com"`,
    });

    if (existingMembers.length > 0) {
      console.log('🔄 Member already exists, updating password...');
      const memberId = existingMembers[0].id;
      
      // Update password
      await pb.collection('members').update(memberId, {
        password: 'TestMember@123456',
        passwordConfirm: 'TestMember@123456',
      });
      console.log('✅ Member password updated');
    } else {
      console.log('📝 Creating new member account...');
      
      // Create new member with all required fields
      const newMember = await pb.collection('members').create({
        email: 'testmember@hacrolabs.com',
        password: 'TestMember@123456',
        passwordConfirm: 'TestMember@123456',
        first_name: 'Test',
        last_name: 'Member',
        phone: '254712345678',
        location: 'Nairobi, Kenya',
        category: 'Individual',
        age: 28,
      });
      
      console.log('✅ Member account created');
      console.log('Member ID:', newMember.id);
    }

    console.log('\n✅ Setup complete!');
    console.log('\n📋 Test Credentials:');
    console.log('═══════════════════════════════════════');
    console.log('👤 MEMBER LOGIN');
    console.log('Email:    testmember@hacrolabs.com');
    console.log('Password: TestMember@123456');
    console.log('═══════════════════════════════════════');
    console.log('🔐 ADMIN LOGIN');
    console.log('Email:    admin@hacrolabs.com');
    console.log('Password: Admin@123456');
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    if (error.response) {
      console.error('Details:', error.response.data);
    }
  }
}

createTestMember();
