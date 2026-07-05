import PocketBase from 'pocketbase';

const baseUrl = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const SUPERUSER_EMAIL = process.env.POCKETBASE_SUPERUSER_EMAIL || process.env.POCKETBASE_ADMIN_EMAIL || 'hamertonotieno99@gmail.com';
const SUPERUSER_PASSWORD = process.env.POCKETBASE_SUPERUSER_PASSWORD || process.env.POCKETBASE_ADMIN_PASSWORD || 'E75p6p5!';

const pb = new PocketBase(baseUrl);
const authPb = new PocketBase(baseUrl);

const CI = process.env.CI === 'true' || process.env.CI === '1';
const waitEnabledEnv = process.env.POCKETBASE_WAIT_ENABLED;
const waitDisabledEnv = process.env.POCKETBASE_WAIT_DISABLED;
const pocketBaseWaitEnabled =
  waitDisabledEnv !== 'true' &&
  waitDisabledEnv !== '1' &&
  (waitEnabledEnv === 'true' || waitEnabledEnv === '1' || !CI);

const waitTimeoutMs = Number(process.env.POCKETBASE_WAIT_TIMEOUT_MS || 30000);
const waitIntervalMs = Number(process.env.POCKETBASE_WAIT_INTERVAL_MS || 500);
const waitVerbose = process.env.POCKETBASE_WAIT_VERBOSE === 'true' || process.env.POCKETBASE_WAIT_VERBOSE === '1';

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
        try {
          await pb.admins.authWithPassword(SUPERUSER_EMAIL, SUPERUSER_PASSWORD);
        } catch (retryError) {
          console.error('PocketBase superuser authentication retry failed:', retryError.message || retryError);
        }
      }
    }
  } else {
    console.warn('POCKETBASE_SUPERUSER_EMAIL / POCKETBASE_ADMIN_EMAIL and POCKETBASE_SUPERUSER_PASSWORD / POCKETBASE_ADMIN_PASSWORD are required for privileged PocketBase operations.');
  }
};

export default pb;
export { authPb, SUPERUSER_EMAIL, SUPERUSER_PASSWORD };

// Wait until PocketBase is reachable (polling)
export async function waitForPocketBase({ timeoutMs = waitTimeoutMs, intervalMs = waitIntervalMs } = {}) {
  if (!pocketBaseWaitEnabled) {
    console.info(`PocketBase wait disabled (CI=${CI}, POCKETBASE_WAIT_ENABLED=${waitEnabledEnv}, POCKETBASE_WAIT_DISABLED=${waitDisabledEnv})`);
    return true;
  }

  console.info(`Waiting for PocketBase at ${baseUrl} for up to ${timeoutMs}ms...`);
  const start = Date.now();
  let attempt = 0;
  while (Date.now() - start < timeoutMs) {
    attempt += 1;
    try {
      const res = await fetch(baseUrl + '/api');
      if (res && (res.ok || res.status === 200 || res.status === 404)) {
        console.info(`PocketBase is reachable after ${attempt} attempt(s)`);
        return true;
      }
      if (waitVerbose) {
        console.info(`PocketBase check attempt ${attempt}: status ${res.status}`);
      }
    } catch (err) {
      if (waitVerbose) {
        console.info(`PocketBase check attempt ${attempt} failed:`, err.message || err);
      }
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`Timed out waiting for PocketBase at ${baseUrl} after ${timeoutMs}ms`);
}
