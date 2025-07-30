// controllers/adminController.js
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/tokenUtils.js';

export const loginAdmin = async (req, res) => {
  console.log("✅ loginAdmin route hit");

  const { email, password } = req.body;

  try {
    // ✅ Use pool instead of undefined db
    const [admins] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);

    if (admins.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = admins[0];

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Remove password before sending response
    delete admin.password;

    res.json({
      admin,
      token: generateToken(admin),
    });

  } catch (error) {
    console.error('❌ Login error:', error.stack);
    res.status(500).json({ message: 'Login error', error: error.message });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT email FROM admins');

    const admins = rows.map((admin) => ({
      email: admin.email,
      role: 'admin', // hardcoded default role
    }));

    res.json(admins);

  } catch (err) {
    console.error('❌ Error fetching admins:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};
