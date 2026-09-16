// 📁 backend/controllers/productController.js
import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';

// GET all products (optionally filtered by category_id)
export const getProducts = async (req, res) => {
  try {
    const { category_id } = req.query;
    let query = "SELECT * FROM products";
    let params = [];
    if (category_id) {
      query += " WHERE category_id = ?";
      params.push(category_id);
    }
    query += " ORDER BY `order` ASC, id DESC";
    const [rows] = await pool.query(query, params);
    rows.forEach(row => {
      if (row.image_url && row.image_url.startsWith('/uploads/')) {
        row.image_url = row.image_url.replace('/uploads/', '/pdf-assets/');
      }
    });
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    res.status(500).json({ error: "Failed to fetch products", details: err.message });
  }
};

// POST: Add new product
export const addProduct = async (req, res) => {
  try {
    const { name_en, name_ar, description_en, description_ar, price, category_id, order = 0 } = req.body;
    const image_url = req.file ? `/pdf-assets/${req.file.filename}` : null;

    if (!name_en || !category_id) {
      return res.status(400).json({ error: "Name and category are required" });
    }

    const [catRows] = await pool.query("SELECT id FROM service_categories WHERE id = ?", [category_id]);
    if (catRows.length === 0) {
      return res.status(400).json({ error: "Invalid category_id. Category does not exist." });
    }

    const query = "INSERT INTO products (name_en, name_ar, description_en, description_ar, price, category_id, image_url, `order`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const [result] = await pool.execute(query, [
      name_en,
      name_ar || null,
      description_en || null,
      description_ar || null,
      price || null,
      category_id,
      image_url,
      order,
    ]);

    res.status(201).json({ message: "Product added", id: result.insertId, image_url });
  } catch (err) {
    console.error("❌ Error inserting product:", err.message);
    res.status(500).json({ error: "Failed to insert product", details: err.message });
  }
};

// PUT: Update product
export const updateProduct = async (req, res) => {
  try {
    const { name_en, name_ar, description_en, description_ar, price, category_id, order } = req.body;
    const { id } = req.params;

    let image_url = null;
    if (req.file) {
      image_url = `/pdf-assets/${req.file.filename}`;
      const [oldData] = await pool.query("SELECT image_url FROM products WHERE id = ?", [id]);
      const oldPath = oldData[0]?.image_url;
      if (oldPath) fs.unlink(path.join("public/pdf-assets", path.basename(oldPath)), () => {});
    }

    if (category_id) {
      const [catRows] = await pool.query("SELECT id FROM service_categories WHERE id = ?", [category_id]);
      if (catRows.length === 0) {
        return res.status(400).json({ error: "Invalid category_id. Category does not exist." });
      }
    }

    const query = image_url
      ? "UPDATE products SET name_en = ?, name_ar = ?, description_en = ?, description_ar = ?, price = ?, category_id = ?, image_url = ?, `order` = ? WHERE id = ?"
      : "UPDATE products SET name_en = ?, name_ar = ?, description_en = ?, description_ar = ?, price = ?, category_id = ?, `order` = ? WHERE id = ?";

    const values = image_url
      ? [name_en, name_ar || null, description_en || null, description_ar || null, price || null, category_id, image_url, order, id]
      : [name_en, name_ar || null, description_en || null, description_ar || null, price || null, category_id, order, id];

    await pool.execute(query, values);
    res.json({ message: "Product updated" });
  } catch (err) {
    console.error("❌ Error updating product:", err.message);
    res.status(500).json({ error: "Failed to update product", details: err.message });
  }
};

// DELETE product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [oldData] = await pool.query("SELECT image_url FROM products WHERE id = ?", [id]);
    const oldPath = oldData[0]?.image_url;

    await pool.execute("DELETE FROM products WHERE id = ?", [id]);
    if (oldPath) fs.unlink(path.join("public/pdf-assets", path.basename(oldPath)), () => {});

    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("❌ Error deleting product:", err.message);
    res.status(500).json({ error: "Failed to delete product", details: err.message });
  }
};
