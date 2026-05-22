// Test script to verify authentication
const API_URL = 'http://localhost:3001';

async function testAdminLogin() {
  console.log('\n🔐 Testing Admin Login...');
  console.log('Email: admin@hacrolabs.com');
  console.log('Password: Admin@123456');
  
  try {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@hacrolabs.com',
        password: 'Admin@123456'
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Admin Login Successful!');
      console.log('Token:', data.token);
      console.log('Admin:', data.admin);
      return data.token;
    } else {
      console.log('❌ Admin Login Failed:');
      console.log('Error:', data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Admin Login Error:', error.message);
    return null;
  }
}

async function testMemberLogin() {
  console.log('\n🔐 Testing Member Login...');
  console.log('Email: member@example.com');
  console.log('Password: Member@123456');
  
  try {
    const response = await fetch(`${API_URL}/members/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'member@example.com',
        password: 'Member@123456'
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Member Login Successful!');
      console.log('Token:', data.token);
      console.log('Member:', data.member);
      return data.token;
    } else {
      console.log('❌ Member Login Failed:');
      console.log('Error:', data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Member Login Error:', error.message);
    return null;
  }
}

async function testAdminProfile(token) {
  console.log('\n📋 Testing Admin Profile Access...');
  
  try {
    const response = await fetch(`${API_URL}/admin/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Admin Profile Retrieved!');
      console.log('Profile:', data);
    } else {
      console.log('❌ Profile Access Failed:');
      console.log('Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Profile Access Error:', error.message);
  }
}

async function testMemberProfile(token) {
  console.log('\n📋 Testing Member Profile Access...');
  
  try {
    const response = await fetch(`${API_URL}/members/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Member Profile Retrieved!');
      console.log('Profile:', data);
    } else {
      console.log('❌ Profile Access Failed:');
      console.log('Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Profile Access Error:', error.message);
  }
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('🚀 Starting Authentication Tests');
  console.log('='.repeat(60));

  const adminToken = await testAdminLogin();
  const memberToken = await testMemberLogin();

  if (adminToken) {
    await testAdminProfile(adminToken);
  }

  if (memberToken) {
    await testMemberProfile(memberToken);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Tests Complete!');
  console.log('='.repeat(60));
}

runTests().catch(error => console.error('Test error:', error));
