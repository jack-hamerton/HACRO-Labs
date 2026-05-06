import pb, { authenticateSuperuser } from './pocketbaseClient.js';
import logger from './logger.js';

/**
 * Create or update admin credentials
 * Run this once to set up initial admin accounts
 */
export async function setupAdminCredentials() {
  try {
    await authenticateSuperuser();

    // Create or update test admin
    const testAdmins = [
      {
        email: 'admin@hacrolabs.com',
        password: 'Admin@123456',
        full_name: 'System Administrator',
        role: 'super_admin',
      },
      {
        email: 'hamertonotieno99@gmail.com',
        password: 'E75p6p5!',
        full_name: 'Jack Hamerton',
        role: 'super_admin',
      }
    ];

    for (const adminData of testAdmins) {
      try {
        // Check if admin exists
        const existing = await pb.collection('admins').getFullList({
          filter: `email = "${adminData.email}"`,
        });

        if (existing.length > 0) {
          // Update password
          await pb.collection('admins').update(existing[0].id, {
            password: adminData.password,
            passwordConfirm: adminData.password,
            full_name: adminData.full_name,
            role: adminData.role,
          });
          logger.info(`Updated admin password for: ${adminData.email}`);
        } else {
          // Create new admin
          await pb.collection('admins').create({
            email: adminData.email,
            password: adminData.password,
            passwordConfirm: adminData.password,
            full_name: adminData.full_name,
            role: adminData.role,
          });
          logger.info(`Created admin: ${adminData.email}`);
        }
      } catch (error) {
        logger.error(`Failed to set up admin ${adminData.email}:`, error.message);
      }
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
