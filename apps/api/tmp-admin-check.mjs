import pb,{authenticateSuperuser} from './src/utils/pocketbaseClient.js';
await authenticateSuperuser();
const recs = await pb.collection('pbc_admins_auth').getFullList({filter:"email = 'admin@hacrolabs.com'"});
console.log(JSON.stringify(recs,null,2));
