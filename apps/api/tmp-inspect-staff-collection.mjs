import pb from './src/utils/pocketbaseClient.js';

try {
  await pb.admins.authWithPassword('hamertonotieno99@gmail.com', 'E75p6p5!');
  const col = await pb.collections.getOne('staff_members');
  console.log(JSON.stringify({
    id: col.id,
    name: col.name,
    listRule: col.listRule,
    viewRule: col.viewRule,
    createRule: col.createRule,
    updateRule: col.updateRule,
    deleteRule: col.deleteRule,
  }, null, 2));
} catch (err) {
  console.error(err.message || err);
  console.error(JSON.stringify(err.response?.data || err.data || {}, null, 2));
  process.exit(1);
}
