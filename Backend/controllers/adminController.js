// Placeholder for controllers/adminController.js// controllers/adminController.js
import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/tokenUtils.js';

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [admins] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (admins.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = admins[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    delete admin.password;

    res.json({
      admin,
      token: generateToken(admin),
    });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error });
  }
};
