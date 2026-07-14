const PocketBase = require('pocketbase');

(async function(){
  try{
    const baseUrl = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
    const SUPERUSER_EMAIL = process.env.POCKETBASE_SUPERUSER_EMAIL || process.env.POCKETBASE_ADMIN_EMAIL || 'hamertonotieno99@gmail.com';
    const SUPERUSER_PASSWORD = process.env.POCKETBASE_SUPERUSER_PASSWORD || process.env.POCKETBASE_ADMIN_PASSWORD || 'E75p6p5!';
    const pb = new PocketBase(baseUrl);
    console.log('Connecting to PocketBase at', baseUrl);
    try{
      await pb.admins.authWithPassword(SUPERUSER_EMAIL, SUPERUSER_PASSWORD);
      console.log('Authenticated as superuser:', SUPERUSER_EMAIL);
    }catch(e){
      console.warn('Superuser auth failed:', e.message || e);
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

    // show first 5 payments
    try{
      const payments = await pb.collection('payments').getFullList({ perPage: 10, $autoCancel:false });
      console.log('Sample payments:', payments.slice(0,5).map(p=>({id:p.id, amount:p.amount, type:p.payment_type, status:p.payment_status}).slice?payments:payments));
    }catch(e){console.log('payments sample error', e.message||e);}

    process.exit(0);
  }catch(e){
    console.error('Diagnostic failed:', e.message||e);
    process.exit(1);
  }
})();