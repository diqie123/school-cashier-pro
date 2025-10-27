const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'server', 'data', 'db.json');
const usersToUpdate = [
    { username: 'admin', password: 'Admin@2024' },
    { username: 'manager', password: 'Manager@2024' },
    { username: 'kasir', password: 'Kasir@2024' }
];

fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading db.json:', err);
        return;
    }

    try {
        const db = JSON.parse(data);
        let updated = false;

        usersToUpdate.forEach(userToUpdate => {
            const userIndex = db.users.findIndex(u => u.username === userToUpdate.username);
            if (userIndex !== -1) {
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(userToUpdate.password, salt);
                db.users[userIndex].password = hashedPassword;
                console.log(`Password for ${userToUpdate.username} has been updated.`);
                updated = true;
            }
        });

        if (updated) {
            fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Error writing to db.json:', err);
                } else {
                    console.log('db.json has been updated successfully.');
                }
            });
        }

    } catch (parseErr) {
        console.error('Error parsing db.json:', parseErr);
    }
});