import FoodBeverage from '../models/foodBeverageModel.js';
import path from 'path';
import fs from 'fs';

const getAll = async (req, res) => {
  try {
    const [rows] = await FoodBeverage.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await FoodBeverage.getById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
};

const create = async (req, res) => {
  try {
    const { name, name_ar, description, description_ar } = req.body;
    let image_url = null;
    if (req.file) {
      image_url = '/pdf-assets/' + req.file.filename;
    }
    const data = { name, name_ar, description, description_ar, image_url };
    await FoodBeverage.create(data);
    res.status(201).json({ message: 'Item created' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item' });
  }
};

const update = async (req, res) => {
  try {
    const { name, name_ar, description, description_ar } = req.body;
    let image_url = req.body.image_url;
    if (req.file) {
      image_url = '/pdf-assets/' + req.file.filename;
    }
    const data = { name, name_ar, description, description_ar, image_url };
    await FoodBeverage.update(req.params.id, data);
    res.json({ message: 'Item updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
};

const deleteItem = async (req, res) => {
  try {
    await FoodBeverage.delete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  delete: deleteItem
};
