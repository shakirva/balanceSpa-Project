// 📁 backend/controllers/treatmentController.js
import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';

// ✅ GET treatments grouped by category
// 📁 backend/controllers/treatmentController.js
export const getTreatments = async (req, res) => {
  try {
    const { category_id } = req.query;

    let categories = [];

    if (category_id) {
      const [catRows] = await pool.query(
        `SELECT id, name_en AS name, image_url AS image FROM service_categories WHERE id = ?`,
        [category_id]
      );
      categories = catRows;
    } else {
      const [catRows] = await pool.query(
        `SELECT id, name_en AS name, image_url AS image FROM service_categories`
      );
      categories = catRows;
    }

    for (let category of categories) {
      const [treatments] = await pool.query(
        `SELECT * FROM treatments WHERE category_id = ?`,
        [category.id]
      );

      for (let treatment of treatments) {
        const [prices] = await pool.query(
          `SELECT duration, price FROM treatment_prices WHERE treatment_id = ?`,
          [treatment.id]
        );
        treatment.prices = prices;
      }

      category.treatments = treatments;
    }

    res.status(200).json(categories);
  } catch (err) {
    console.error("❌ Error fetching treatments:", err);
    res.status(500).json({ error: 'Failed to fetch treatments' });
  }
};

// ✅ POST treatment
export const addTreatment = async (req, res) => {
  try {
    console.log('addTreatment req.body:', req.body);
    console.log('addTreatment req.file:', req.file);
    const {
      category_id, name_en, name_ar, description_en, description_ar, prices
    } = req.body;

    if (!category_id || !name_en || !name_ar || !description_en || !description_ar || !prices) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let priceData;
    try {
      priceData = JSON.parse(prices);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid prices format', details: e.message });
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await pool.query(
      `INSERT INTO treatments (category_id, name_en, name_ar, description_en, description_ar, image_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [category_id, name_en, name_ar, description_en, description_ar, image_url]
    );

    const treatmentId = result.insertId;

    for (let p of priceData) {
      await pool.query(
        `INSERT INTO treatment_prices (treatment_id, duration, price) VALUES (?, ?, ?)` ,
        [treatmentId, p.duration, p.price]
      );
    }

    res.status(201).json({ message: 'Treatment added', id: treatmentId });
  } catch (err) {
    console.error("❌ Error adding treatment:", err);
    res.status(500).json({ error: 'Failed to add treatment', details: err.message });
  }
};

// ✅ PUT treatment
export const updateTreatment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      category_id, name_en, name_ar, description_en, description_ar, prices
    } = req.body;

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (image_url) {
      await pool.query(
        `UPDATE treatments SET category_id=?, name_en=?, name_ar=?, description_en=?, description_ar=?, image_url=? WHERE id=?`,
        [category_id, name_en, name_ar, description_en, description_ar, image_url, id]
      );
    } else {
      await pool.query(
        `UPDATE treatments SET category_id=?, name_en=?, name_ar=?, description_en=?, description_ar=? WHERE id=?`,
        [category_id, name_en, name_ar, description_en, description_ar, id]
      );
    }

    await pool.query(`DELETE FROM treatment_prices WHERE treatment_id = ?`, [id]);

    const priceData = JSON.parse(prices);
    for (let p of priceData) {
      await pool.query(
        `INSERT INTO treatment_prices (treatment_id, duration, price) VALUES (?, ?, ?)`,
        [id, p.duration, p.price]
      );
    }

    res.status(200).json({ message: 'Treatment updated successfully' });
  } catch (err) {
    console.error("❌ Error updating treatment:", err);
    res.status(500).json({ error: 'Failed to update treatment', details: err.message });
  }
};

// ✅ DELETE treatment
export const deleteTreatment = async (req, res) => {
  try {
    const { id } = req.params;
    const [[treatment]] = await pool.query(`SELECT image_url FROM treatments WHERE id=?`, [id]);

    await pool.query(`DELETE FROM treatment_prices WHERE treatment_id=?`, [id]);
    await pool.query(`DELETE FROM treatments WHERE id=?`, [id]);

    if (treatment?.image_url) {
      const imagePath = path.join('public', treatment.image_url);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    res.status(200).json({ message: 'Treatment deleted' });
  } catch (err) {
    console.error("❌ Error deleting treatment:", err);
    res.status(500).json({ error: 'Failed to delete treatment', details: err.message });
  }
};
