// 📁 utils/pdfUtils.js
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export const generatePDF = async (formData) => {
  return new Promise((resolve, reject) => {
    const filename = `booking_${Date.now()}.pdf`;
    const pdfDir = path.join('pdfs');
    const pdfPath = path.join(pdfDir, filename);

    fs.mkdirSync(pdfDir, { recursive: true });

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    doc.fontSize(16).text('Booking Form Summary', { underline: true });
    doc.moveDown();

    for (const [key, value] of Object.entries(formData)) {
      doc.fontSize(12).text(`${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`);
    }

    doc.end();

    stream.on('finish', () => resolve(pdfPath));
    stream.on('error', (err) => reject(err));
  });
};
