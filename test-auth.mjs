import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function test() {
  try {
    console.log('Testing admin authentication...');
    
    // Try authenticating with testadmin
    try {
      const result = await pb.collection('admins').authWithPassword('testadmin@example.com', 'Admin@12345');
      console.log('✅ testadmin@example.com authentication SUCCESS');
      console.log('Token:', result.token.substring(0, 20) + '...');
    } catch (error) {
      console.error('❌ testadmin@example.com failed:', error.message);
    }

    // Try authenticating with hamertonotieno99
    try {
      const result = await pb.collection('admins').authWithPassword('hamertonotieno99@gmail.com', 'E75p6p5!');
      console.log('✅ hamertonotieno99@gmail.com authentication SUCCESS');
      console.log('Token:', result.token.substring(0, 20) + '...');
    } catch (error) {
      console.error('❌ hamertonotieno99@gmail.com failed:', error.message);
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

test();
