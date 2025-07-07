import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateAppointmentPDF = async (formData) => {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  document.body.appendChild(container);

  const root = createRoot(container);


  await new Promise(resolve => setTimeout(resolve, 100)); // wait for render

  const canvas = await html2canvas(container, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save(`booking-form-${formData.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);

  document.body.removeChild(container);
};
