import pb, { authenticateSuperuser } from './src/utils/pocketbaseClient.js';

try {
  await authenticateSuperuser();
  console.log('authStoreValid', pb.authStore.isValid);
  console.log('isSuperuser', pb.authStore.isSuperuser);
  const result = await pb.collection('pbc_admins_auth').getFullList({ $autoCancel: false });
  console.log('count', result.length);
} catch (err) {
  console.error(err.message || err);
  console.error(JSON.stringify(err.response?.data || err.data || {}, null, 2));
  process.exit(1);
}
