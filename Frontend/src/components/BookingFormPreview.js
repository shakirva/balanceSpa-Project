import React, { useRef } from "react";
import html2canvas from "html2canvas";

const BookingFormPreview = ({ bookingData, bookingId }) => {
  const previewRef = useRef(null);

  const handleSaveImage = async () => {
    const canvas = await html2canvas(previewRef.current);
    const imageData = canvas.toDataURL("image/png");
    await fetch("http://localhost:5000/api/bookings/booking-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageData, bookingId }),
    });
    alert("Booking image saved!");
  };

  return (
    <div>
      <div ref={previewRef} style={{ background: "#fff", padding: 24 }}>
        {/* Render your booking form preview here */}
        <h2>BALANCE SPA</h2>
        <div>Date: {bookingData.date}</div>
        <div>Name: {bookingData.name}</div>
        {/* ...other fields... */}
        <img src="/assets/body-shape.png" alt="Body" style={{ width: 120 }} />
        {/* ...body marks, etc... */}
      </div>
      <button onClick={handleSaveImage}>Save as Image</button>
      <img
        src={`http://localhost:5000/uploads/${bookingData.bookingImagePath}`}
        alt="Booking Output"
        style={{ width: 300 }}
      />
    </div>
  );
};

export default BookingFormPreview;