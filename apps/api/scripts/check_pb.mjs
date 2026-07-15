import PocketBase from 'pocketbase';

(async function(){
  try{
    const baseUrl = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
    const SUPERUSER_EMAIL = process.env.POCKETBASE_SUPERUSER_EMAIL || process.env.POCKETBASE_ADMIN_EMAIL;
    const SUPERUSER_PASSWORD = process.env.POCKETBASE_SUPERUSER_PASSWORD || process.env.POCKETBASE_ADMIN_PASSWORD;
    const ADMIN_TOKEN = process.env.POCKETBASE_ADMIN_TOKEN;
    const pb = new PocketBase(baseUrl);
    console.log('Connecting to PocketBase at', baseUrl);

    if (ADMIN_TOKEN) {
      pb.authStore.save(ADMIN_TOKEN, null);
      console.log('Authenticated using admin token');
    } else if (SUPERUSER_EMAIL && SUPERUSER_PASSWORD) {
      try{
        await pb.admins.authWithPassword(SUPERUSER_EMAIL, SUPERUSER_PASSWORD);
        console.log('Authenticated as superuser:', SUPERUSER_EMAIL);
      }catch(e){
        console.warn('Superuser auth failed:', e.message || e);
      }
    } else {
      console.error('No credentials supplied. Set POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD or POCKETBASE_ADMIN_TOKEN.');
      process.exit(1);
    }

    const cols = ['company_transactions','payments','donations','contributions_history','loans','pbc_admins_auth','members','admin_sessions'];
    for(const c of cols){
      try{
        const list = await pb.collection(c).getFullList({ $autoCancel: false });
        console.log(`${c}: ${Array.isArray(list)?list.length:0}`);
      }catch(err){
        console.log(`${c}: error (${err.message || err})`);
      }
    }

    process.exit(0);
  }catch(e){
    console.error('Diagnostic failed:', e.message||e);
    process.exit(1);
  }
})();