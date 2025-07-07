// Placeholder for utils/tokenUtils.js// utils/tokenUtils.js
import jwt from 'jsonwebtoken';

export const generateToken = (admin) => {
  return jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};
