// 📁 backend/controllers/categoryController.js
import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';

// ✅ GET all categories
export const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM service_categories ORDER BY id DESC");
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching categories:", err.message);
    res.status(500).json({ error: "Failed to fetch categories", details: err.message });
  }
};

// ✅ POST: Add new category
export const addCategory = async (req, res) => {
  try {
    const { name_en, name_ar } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name_en) return res.status(400).json({ error: "English name is required" });

    const query = "INSERT INTO service_categories (name_en, name_ar, image_url) VALUES (?, ?, ?)";
    const [result] = await pool.execute(query, [name_en, name_ar, image_url]);

    res.status(201).json({ message: "Category added", id: result.insertId, image_url });
  } catch (err) {
    console.error("❌ Error inserting category:", err.message);
    res.status(500).json({ error: "Failed to insert category", details: err.message });
  }
};

// ✅ PUT: Update category
export const updateCategory = async (req, res) => {
  try {
    const { name_en, name_ar } = req.body;
    const { id } = req.params;

    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
      const [oldData] = await pool.query("SELECT image_url FROM service_categories WHERE id = ?", [id]);
      const oldPath = oldData[0]?.image_url;
      if (oldPath) fs.unlink(path.join("uploads", path.basename(oldPath)), () => {});
    }

    const query = image_url
      ? "UPDATE service_categories SET name_en = ?, name_ar = ?, image_url = ? WHERE id = ?"
      : "UPDATE service_categories SET name_en = ?, name_ar = ? WHERE id = ?";

    const values = image_url ? [name_en, name_ar, image_url, id] : [name_en, name_ar, id];

    await pool.execute(query, values);
    res.json({ message: "Category updated" });
  } catch (err) {
    console.error("❌ Error updating:", err.message);
    res.status(500).json({ error: "Failed to update category", details: err.message });
  }
};

// ✅ DELETE category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const [oldData] = await pool.query("SELECT image_url FROM service_categories WHERE id = ?", [id]);
    const oldPath = oldData[0]?.image_url;

    await pool.execute("DELETE FROM service_categories WHERE id = ?", [id]);
    if (oldPath) fs.unlink(path.join("uploads", path.basename(oldPath)), () => {});

    res.json({ message: "Category deleted" });
  } catch (err) {
    console.error("❌ Error deleting:", err.message);
    res.status(500).json({ error: "Failed to delete category", details: err.message });
  }
};
