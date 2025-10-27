const fs = require('fs').promises;
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'data', 'db.json');

async function addUser() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    const db = JSON.parse(data);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);

    const newUser = {
      id: `user-${db.users.length + 1}`,
      username: 'testuser',
      password: hashedPassword,
      nama: 'Test User',
      role: 'kasir',
    };

    db.users.push(newUser);

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
    console.log('User "testuser" added successfully.');
  } catch (error) {
    console.error('Error adding user:', error);
  }
}

addUser();