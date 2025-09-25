
// ✅ Delete a booking
export const deleteBooking = async (req, res) => {
  const { id } = req.params;
  try {
    // Optionally, delete associated PDF file from disk here if needed
    await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('❌ Delete Booking Error:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};
// 📁 controllers/bookingController.js
import path from 'path';
import pool from '../config/db.js';

// ✅ Create a new booking
export const createBooking = async (req, res) => {
  try {
    const {
      name,
      date,
      time,
      nationality,
      mobile,
      knowFrom,
      socialMedia,
      healthConditions,
      implants,
      implantDetails,
      pressure,
      skinType,
      otherConcerns,
      promotional,
      selectedBodyParts,
      selectedService,
      selectedTreatment,
      selectedDuration,
      selectedPrice,
      signature,
    } = req.body;

    const pdfFile = req.file;
    if (!pdfFile) {
      return res.status(400).json({ error: 'PDF file is missing' });
    }

    // ✅ Convert boolean to integer (MySQL-safe)
    const promoValue = promotional === true || promotional === 'true' ? 1 : 0;

    // ✅ Construct public PDF path (for frontend access)
    const publicPath = `/pdfs/${pdfFile.filename}`;

    const [result] = await pool.query(
      `INSERT INTO bookings (
        name, date, time, nationality, mobile, knowFrom, socialMedia,
        healthConditions, implants, implantDetails, pressure, skinType,
        otherConcerns, promotional, selectedBodyParts, selectedService,
        selectedTreatment, selectedDuration, selectedPrice, signature, pdfPath
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        date,
        time,
        nationality,
        mobile,
        knowFrom,
        socialMedia,
        healthConditions,
        implants,
        implantDetails,
        pressure,
        skinType,
        otherConcerns,
        promoValue,
        selectedBodyParts,
        selectedService,
        selectedTreatment,
        selectedDuration,
        selectedPrice,
        signature,
        publicPath,
      ]
    );

    res.status(201).json({
      message: 'Booking created successfully',
      bookingId: result.insertId,
      pdfPath: publicPath,
    });
  } catch (error) {
    console.error('❌ Create Booking Error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// ✅ Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('❌ Get Bookings Error:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};


export const updateAppointmentNotes = async (req, res) => {
  const { id } = req.params;
  const { doctor_note } = req.body;

  if (!doctor_note || doctor_note.trim() === '') {
    return res.status(400).json({ error: 'Doctor note cannot be empty.' });
  }

  try {
    // 1. Update main booking
    await pool.query(
      'UPDATE bookings SET doctor_note = ? WHERE id = ?',
      [doctor_note, id]
    );

    // 2. Insert into note logs
    await pool.query(
      'INSERT INTO note_logs (booking_id, notes) VALUES (?, ?)',
      [id, doctor_note]
    );

    res.status(200).json({ message: 'Note updated and logged successfully' });
  } catch (err) {
    console.error('Error updating notes:', err);
    res.status(500).json({ error: 'Failed to update doctor note' });
  }
};




export const getAllUpdatedNotes = async (req, res) => {
  try {
    const [logs] = await pool.query(`
      SELECT nl.id, nl.booking_id, b.name AS customer_name, nl.notes, nl.updated_at
      FROM note_logs nl
      JOIN bookings b ON nl.booking_id = b.id
      ORDER BY nl.updated_at DESC
    `);

    res.status(200).json(logs);
  } catch (err) {
    console.error('Error fetching note logs:', err);
    res.status(500).json({ error: 'Failed to fetch note logs' });
  }
};
