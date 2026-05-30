import pb, { authenticateSuperuser } from './pocketbaseClient.js';
import logger from './logger.js';

/**
 * Create or update admin credentials
 * Run this once to set up initial admin accounts
 */
export async function setupAdminCredentials() {
  try {
    await authenticateSuperuser();

    const superAdminEmail = 'hamertonotieno99@gmail.com';
    const superAdminPassword = 'E75p6p5!';
    const superAdminData = {
      email: superAdminEmail,
      password: superAdminPassword,
      passwordConfirm: superAdminPassword,
      full_name: 'Jack Hamerton',
      role: 'super_admin',
    };

    try {
      const existing = await pb.collection('pbc_admins_auth').getFullList({
        filter: `email = "${superAdminEmail}"`,
      });

      if (existing.length > 0) {
        await pb.collection('pbc_admins_auth').update(existing[0].id, superAdminData);
        logger.info(`Updated admin password for: ${superAdminEmail}`);
      } else {
        await pb.collection('pbc_admins_auth').create(superAdminData);
        logger.info(`Created admin: ${superAdminEmail}`);
      }
    } catch (error) {
      logger.error(`Failed to set up admin ${superAdminEmail}:`, error.message);
    }

    try {
      const allAdmins = await pb.collection('pbc_admins_auth').getFullList({ $autoCancel: false });
      const adminsToRemove = allAdmins.filter((admin) => admin.email !== superAdminEmail);
      for (const admin of adminsToRemove) {
        await pb.collection('pbc_admins_auth').delete(admin.id);
        logger.info(`Removed extra admin: ${admin.email}`);
      }
    } catch (error) {
      logger.error('Failed to remove extra admin records:', error.message);
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
