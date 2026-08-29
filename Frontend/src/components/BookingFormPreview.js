import React, { useRef } from "react";
import html2canvas from "html2canvas";
import axiosInstance from "../api/axios";
import { getMediaUrl } from "../utils/media";

const BookingFormPreview = ({ bookingData, bookingId }) => {
  const previewRef = useRef(null);

  const handleSaveImage = async () => {
    const canvas = await html2canvas(previewRef.current);
    const imageData = canvas.toDataURL("image/png");
    await axiosInstance.post("/api/bookings/booking-image", {
      image: imageData,
      bookingId,
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
      {bookingData.bookingImagePath && (
        <img
          src={getMediaUrl(bookingData.bookingImagePath)}
          alt="Booking Output"
          style={{ width: 300 }}
        />
      )}
    </div>
  );
};

export default BookingFormPreview;