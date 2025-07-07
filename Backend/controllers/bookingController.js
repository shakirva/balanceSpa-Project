// 📁 backend/controllers/bookingController.js
import db from '../config/db.js';
import { generatePDF } from '../utils/pdfUtils.js';
import fs from 'fs';

export const createBooking = async (req, res) => {
  try {
    const formData = req.body;
    const pdfPath = await generatePDF(formData);

    const result = await db.query(
      `INSERT INTO bookings (
        date, name, time, nationality, mobile,
        knowFrom, socialMedia, healthConditions,
        implants, implantDetails, pressure,
        skinType, otherConcerns, promotional,
        selectedBodyParts, selectedService,
        selectedTreatment, selectedDuration,
        selectedPrice, signature, pdfPath
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        formData.date,
        formData.name,
        formData.time,
        formData.nationality,
        formData.mobile,
        JSON.stringify(formData.knowFrom),
        JSON.stringify(formData.socialMedia),
        JSON.stringify(formData.healthConditions),
        formData.implants,
        formData.implantDetails,
        formData.pressure,
        formData.skinType,
        formData.otherConcerns,
        formData.promotional,
        JSON.stringify(formData.selectedBodyParts),
        formData.selectedService,
        formData.selectedTreatment,
        formData.selectedDuration,
        formData.selectedPrice,
        formData.signature,
        pdfPath
      ]
    );

    res.status(200).json({ message: 'Booking saved', id: result[0].insertId });
  } catch (err) {
    console.error('Booking Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id, name, mobile, date, time, 
        selectedService, selectedDuration, selectedPrice 
      FROM bookings ORDER BY id DESC
    `);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Fetch Bookings Error:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};
export const getBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Fetch Booking Error:', err);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};