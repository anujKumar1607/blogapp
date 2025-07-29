// 1. Wait for MongoDB to be fully ready
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
await sleep(5000);

// 2. Create admin user if not exists
try {
  db.getSiblingDB('admin').createUser({
    user: "root",
    pwd: "example",
    roles: ["root"]
  });
  print('✅ Admin user created');
} catch (e) {
  print('ℹ️ Admin user already exists');
}

// 3. Authenticate as admin
db.getSiblingDB('admin').auth('root', 'example');

// 4. Create service users with VERBOSE error handling
function createServiceUser(dbName, username, password) {
  try {
    db.getSiblingDB(dbName).createUser({
      user: username,
      pwd: password,
      roles: [{ role: "readWrite", db: dbName }]
    });
    print(`✅ Created ${username} user in ${dbName}`);
    return true;
  } catch (e) {
    print(`❌ Error creating ${username} in ${dbName}: ${e.message}`);
    return false;
  }
}

// 5. Create all users with verification
const usersCreated = [
  createServiceUser('user-service', 'user-service', 'user-password'),
  createServiceUser('content-service', 'content-service', 'content-password')
];

// 6. Final verification
if (usersCreated.every(Boolean)) {
  print('\n🔍 User Verification:');
  printjson({
    admin: db.getSiblingDB('admin').getUsers(),
    userService: db.getSiblingDB('user-service').getUsers(),
    contentService: db.getSiblingDB('content-service').getUsers()
  });
} else {
  print('\n🔥 Some users failed to create!');
  print('Check MongoDB logs for details');
  quit(1);
}