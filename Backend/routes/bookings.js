import express from "express";
import fs from "fs";
import path from "path";
import db from "../db.js"; // Adjust to your DB connection

const router = express.Router();

// Endpoint to create a new booking
router.post("/", async (req, res) => {
  try {
    const bookingData = req.body;
    // Insert bookingData into bookings table
    const [result] = await db.query("INSERT INTO bookings SET ?", [bookingData]);
    res.status(201).json({ success: true, bookingId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Booking failed" });
  }
});

// Endpoint to save booking form image
router.post("/booking-image", async (req, res) => {
  try {
    const { image, bookingId } = req.body;
    if (!image || !bookingId) return res.status(400).json({ error: "Missing data" });

    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

    const fileName = `${bookingId}_booking.png`;
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, base64Data, "base64");

    // Save file name to booking record in DB
    await db.query("UPDATE bookings SET bookingImagePath = ? WHERE id = ?", [fileName, bookingId]);

    res.json({ success: true, url: `/uploads/${fileName}` });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;