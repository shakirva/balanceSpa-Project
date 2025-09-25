// 📁 backend/controllers/treatmentController.js
import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';
// import { Treatment } from '../models/treatmentModel.js'; // No model needed, using raw SQL

// GET all treatments (ordered)
export const getTreatments = async (req, res) => {
  try {
    const { category_id } = req.query;
    let query = "SELECT * FROM treatments";
    let params = [];
    if (category_id) {
      query += " WHERE category_id = ?";
      params.push(category_id);
    }
    query += " ORDER BY `order` ASC, id DESC";
    const [rows] = await pool.query(query, params);
    // Ensure prices is always an array
    rows.forEach(row => {
      if (row.prices == null) row.prices = [];
      else if (typeof row.prices === 'string') {
        try {
          row.prices = JSON.parse(row.prices);
        } catch {
          row.prices = [];
        }
      }
    });
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching treatments:", err.message);
    res.status(500).json({ error: "Failed to fetch treatments", details: err.message });
  }
};

// POST: Add new treatment
export const addTreatment = async (req, res) => {
  try {
    const { name_en, name_ar, category_id, prices, order = 0 } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name_en || !category_id) return res.status(400).json({ error: "Name and category are required" });

    // Check if category_id exists in service_categories
    const [catRows] = await pool.query("SELECT id FROM service_categories WHERE id = ?", [category_id]);
    if (catRows.length === 0) {
      return res.status(400).json({ error: "Invalid category_id. Category does not exist." });
    }

    // Parse prices if it's a string, else set to null
    let pricesValue = null;
    if (prices !== undefined) {
      pricesValue = typeof prices === 'string' ? prices : JSON.stringify(prices);
    }

    const query = "INSERT INTO treatments (name_en, name_ar, category_id, prices, image_url, `order`) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await pool.execute(query, [name_en, name_ar, category_id, pricesValue, image_url, order]);

    res.status(201).json({ message: "Treatment added", id: result.insertId, image_url });
  } catch (err) {
    console.error("❌ Error inserting treatment:", err.message);
    res.status(500).json({ error: "Failed to insert treatment", details: err.message });
  }
};

// PUT: Update treatment
export const updateTreatment = async (req, res) => {
  try {
    const { name_en, name_ar, prices, order } = req.body;
    const { id } = req.params;

    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
      const [oldData] = await pool.query("SELECT image_url FROM treatments WHERE id = ?", [id]);
      const oldPath = oldData[0]?.image_url;
      if (oldPath) fs.unlink(path.join("uploads", path.basename(oldPath)), () => {});
    }

    // Parse prices if it's a string, else set to null
    let pricesValue = null;
    if (prices !== undefined) {
      pricesValue = typeof prices === 'string' ? prices : JSON.stringify(prices);
    }

    const query = image_url
      ? "UPDATE treatments SET name_en = ?, name_ar = ?, prices = ?, image_url = ?, `order` = ? WHERE id = ?"
      : "UPDATE treatments SET name_en = ?, name_ar = ?, prices = ?, `order` = ? WHERE id = ?";

    const values = image_url ? [name_en, name_ar, pricesValue, image_url, order, id] : [name_en, name_ar, pricesValue, order, id];

    await pool.execute(query, values);
    res.json({ message: "Treatment updated" });
  } catch (err) {
    console.error("❌ Error updating treatment:", err.message);
    res.status(500).json({ error: "Failed to update treatment", details: err.message });
  }
};

// DELETE treatment
export const deleteTreatment = async (req, res) => {
  try {
    const { id } = req.params;
    const [oldData] = await pool.query("SELECT image_url FROM treatments WHERE id = ?", [id]);
    const oldPath = oldData[0]?.image_url;

    await pool.execute("DELETE FROM treatments WHERE id = ?", [id]);
    if (oldPath) fs.unlink(path.join("uploads", path.basename(oldPath)), () => {});

    res.json({ message: "Treatment deleted" });
  } catch (err) {
    console.error("❌ Error deleting treatment:", err.message);
    res.status(500).json({ error: "Failed to delete treatment", details: err.message });
  }
};

