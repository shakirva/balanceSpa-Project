import React, { useEffect } from "react";
import welcomeVideo from "../assets/welcome.mp4";

const InactivityVideoOverlay = ({ onClose }) => {
  useEffect(() => {
    const handleUserActivity = () => {
      if (onClose) onClose();
    };
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);
    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
    };
  }, [onClose]);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "#000",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <video
        src={welcomeVideo}
        autoPlay
        loop
        muted
        playsInline
        style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
      />
    </div>
  );
};

export default InactivityVideoOverlay;
