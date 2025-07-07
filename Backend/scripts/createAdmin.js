// scripts/createAdmin.js
import db from '../config/db.js';
import bcrypt from 'bcryptjs';

const createAdmin = async () => {
  const email = 'admin@email.com';
  const password = 'admin123'; // change if needed

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await db.query(
      'INSERT INTO admins (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    console.log('Admin user created successfully');
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
