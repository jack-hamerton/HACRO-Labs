import PocketBase from 'pocketbase';

const baseUrl = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const SUPERUSER_EMAIL = process.env.POCKETBASE_SUPERUSER_EMAIL || process.env.POCKETBASE_ADMIN_EMAIL;
const SUPERUSER_PASSWORD = process.env.POCKETBASE_SUPERUSER_PASSWORD || process.env.POCKETBASE_ADMIN_PASSWORD;

const pb = new PocketBase(baseUrl);
const authPb = new PocketBase(baseUrl);

// Function to authenticate superuser when needed
export const authenticateSuperuser = async () => {
  if (SUPERUSER_EMAIL && SUPERUSER_PASSWORD) {
    const needsAuth = !pb.authStore.isValid || !pb.authStore.isSuperuser;
    if (needsAuth) {
      try {
        await pb.admins.authWithPassword(SUPERUSER_EMAIL, SUPERUSER_PASSWORD);
        console.log('Superuser authenticated successfully');
      } catch (error) {
        console.error('PocketBase superuser authentication failed:', error.message || error);
      }
    }
  } else {
    console.warn('POCKETBASE_SUPERUSER_EMAIL / POCKETBASE_ADMIN_EMAIL and POCKETBASE_SUPERUSER_PASSWORD / POCKETBASE_ADMIN_PASSWORD are required for privileged PocketBase operations.');
  }
};

export default pb;
export { authPb, SUPERUSER_EMAIL, SUPERUSER_PASSWORD };
