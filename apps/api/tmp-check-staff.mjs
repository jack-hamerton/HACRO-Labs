import pb from './src/utils/pocketbaseClient.js';

try {
  await pb.collection('staff_members').getFullList({ $autoCancel: false });
  console.log('staff_ok');
} catch (err) {
  console.error(err.message || err);
  console.error(JSON.stringify(err.response?.data || err.data || {}, null, 2));
  process.exit(1);
}
