import db from '../config/db.js';

export const getAllCustomers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, phone, email FROM customers ORDER BY id DESC');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Fetch Customers Error:', err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

export const addCustomer = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }
    const [result] = await db.query('INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)', [name, phone, email || null]);
    res.status(201).json({ message: 'Customer added', id: result.insertId });
  } catch (err) {
    console.error('Add Customer Error:', err);
    res.status(500).json({ error: 'Failed to add customer' });
  }
};
