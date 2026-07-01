import pb, { authenticateSuperuser } from './pocketbaseClient.js';
import logger from './logger.js';

/**
 * Create or update admin credentials
 * Run this once to set up initial admin accounts
 */
export async function setupAdminCredentials() {
  const superAdminEmail = process.env.POCKETBASE_SUPERUSER_EMAIL || process.env.POCKETBASE_ADMIN_EMAIL || 'hamertonotieno99@gmail.com';
  const superAdminPassword = process.env.POCKETBASE_SUPERUSER_PASSWORD || process.env.POCKETBASE_ADMIN_PASSWORD || 'E75p6p5!';

  const superAdminData = {
    email: superAdminEmail,
    password: superAdminPassword,
    passwordConfirm: superAdminPassword,
    full_name: 'Jack Hamerton',
    role: 'super_admin',
    is_active: true,
  };

  try {
    let superuserAuthenticated = false;
    try {
      await pb.admins.authWithPassword(superAdminEmail, superAdminPassword);
      logger.info(`Authenticated existing superuser: ${superAdminEmail}`);
      superuserAuthenticated = true;
    } catch (authError) {
      logger.warn(`Superuser auth failed for ${superAdminEmail}, attempting creation...`, authError.message || authError);
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
        await pb.collection('pbc_admins_auth').update(existing[0].id, superAdminData);
        logger.info(`Updated super admin record for: ${superAdminEmail}`);
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
