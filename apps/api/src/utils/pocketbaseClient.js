import PocketBase from 'pocketbase';

const baseUrl = process.env.POCKETBASE_URL || 'http://localhost:8090';

const pb = new PocketBase(baseUrl);
const authPb = new PocketBase(baseUrl);

// Function to authenticate superuser when needed
export const authenticateSuperuser = async () => {
  if (process.env.POCKETBASE_SUPERUSER_EMAIL && process.env.POCKETBASE_SUPERUSER_PASSWORD) {
    if (!pb.authStore.isValid) {
      try {
        await pb.admins.authWithPassword(
          process.env.POCKETBASE_SUPERUSER_EMAIL,
          process.env.POCKETBASE_SUPERUSER_PASSWORD
        );
        console.log('Superuser authenticated successfully');
      } catch (error) {
        console.error('PocketBase superuser authentication failed:', error.message || error);
      }
    }
  } else {
    console.warn('POCKETBASE_SUPERUSER_EMAIL and POCKETBASE_SUPERUSER_PASSWORD are required for privileged PocketBase operations.');
  }
};

export default pb;
export { authPb };
