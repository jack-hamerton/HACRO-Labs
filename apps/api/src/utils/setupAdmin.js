import pb, { authenticateSuperuser } from './pocketbaseClient.js';
import logger from './logger.js';

export async function setupAdminCredentials() {
  const superAdminEmail = process.env.POCKETBASE_SUPERUSER_EMAIL || process.env.POCKETBASE_ADMIN_EMAIL || 'hamertonotieno99@gmail.com';
  const superAdminPassword = process.env.POCKETBASE_SUPERUSER_PASSWORD || process.env.POCKETBASE_ADMIN_PASSWORD || 'E75p6p5!';

  const superAdminData = {
    email: superAdminEmail,
    password: superAdminPassword,
    passwordConfirm: superAdminPassword,
    first_name: 'Jack',
    last_name: 'Hamerton',
    verified: true,
  };

  try {
    let superuserAuthenticated = false;

    // Wait for PocketBase to be reachable before attempting admin auth/create
    const maxRetries = 12;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await pb.admins.authWithPassword(superAdminEmail, superAdminPassword);
        logger.info(`Authenticated existing superuser: ${superAdminEmail}`);
        superuserAuthenticated = true;
        break;
      } catch (authError) {
        const msg = (authError && (authError.message || authError.toString())) || '';
        // Connection refused or network error: retry
        if (/ECONNREFUSED|connect .* 127.0.0.1:8090|Failed to fetch|fetch failed/i.test(msg) || (authError && authError.cause && authError.cause.code === 'ECONNREFUSED')) {
          logger.warn(`PocketBase unreachable (attempt ${attempt}/${maxRetries}), retrying in 1s...`);
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }

        // Other auth error (invalid creds) - break to try create flow
        logger.warn(`Superuser auth failed for ${superAdminEmail}, attempting creation...`, authError.message || authError);
        break;
      }
    }

    if (!superuserAuthenticated) {
      try {
        await pb.admins.create({
          email: superAdminEmail,
          password: superAdminPassword,
          passwordConfirm: superAdminPassword,
        });
        logger.info(`Created PocketBase superuser: ${superAdminEmail}`);
        await pb.admins.authWithPassword(superAdminEmail, superAdminPassword);
        superuserAuthenticated = true;
      } catch (superuserError) {
        logger.warn('Failed to create superuser via pb.admins.create, trying _superusers collection...', superuserError.message || superuserError);
        try {
          await pb.collection('_superusers').create({
            email: superAdminEmail,
            password: superAdminPassword,
            passwordConfirm: superAdminPassword,
          });
          logger.info(`Created PocketBase superuser via _superusers: ${superAdminEmail}`);
          await pb.admins.authWithPassword(superAdminEmail, superAdminPassword);
          superuserAuthenticated = true;
        } catch (createError) {
          logger.error(`Unable to create or authenticate PocketBase superuser ${superAdminEmail}:`, createError.message || createError);
        }
      }
    }

    try {
      const existing = await pb.collection('pbc_admins_auth').getFullList({
        filter: `email = "${superAdminEmail}"`,
      });

      if (existing.length > 0) {
        try {
          await pb.collection('pbc_admins_auth').update(existing[0].id, superAdminData);
          logger.info(`Updated super admin record for: ${superAdminEmail}`);
        } catch (updateError) {
          logger.warn(`Update failed for pbc_admins_auth record, attempting delete+create fallback:`, updateError.message || updateError);
          try {
            await pb.collection('pbc_admins_auth').delete(existing[0].id);
            await pb.collection('pbc_admins_auth').create(superAdminData);
            logger.info(`Recreated super admin record via delete+create: ${superAdminEmail}`);
          } catch (recreateError) {
            logger.error(`Failed to recreate pbc_admins_auth record for ${superAdminEmail}:`, recreateError.message || recreateError);
          }
        }
      } else {
        await pb.collection('pbc_admins_auth').create(superAdminData);
        logger.info(`Created super admin record: ${superAdminEmail}`);
      }
    } catch (error) {
      logger.error(`Failed to set up pbc_admins_auth super admin ${superAdminEmail}:`, error.message || error);
    }
  } catch (error) {
    logger.error('Failed to set up admin credentials:', error);
  }
}

/**
 * Create a test member for testing
 */
export async function setupTestMember() {
  try {
    await authenticateSuperuser();

    const testMember = {
      email: 'member@example.com',
      password: 'Member@123456',
      first_name: 'John',
      last_name: 'Doe',
      phone: '254700123456',
      age: 30,
      location: 'Nairobi',
      category: 'Individual',
    };

    try {
      // Check if member exists
      const existing = await pb.collection('members').getFullList({
        filter: `email = "${testMember.email}"`,
      });

      if (existing.length > 0) {
        logger.info(`Test member already exists: ${testMember.email}`);
      } else {
        await pb.collection('members').create(testMember);
        logger.info(`Created test member: ${testMember.email}`);
      }
    } catch (error) {
      logger.error(`Failed to set up test member:`, error.message);
    }
  } catch (error) {
    logger.error('Failed to set up test member:', error);
  }
}
