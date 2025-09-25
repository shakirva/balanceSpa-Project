import React, { useEffect, useState } from "react";
import LanguageSelection from "./LanguageSelection";
import axios from "../api/axios"; // ✅ Using shared axios instance

const DisplayLanding = () => {
  const [showLanguage, setShowLanguage] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    let objectUrl = null;

    const fetchVideo = async () => {
      try {
        const res = await axios.get("/api/settings/get-video", {
          responseType: "blob",
        });

        objectUrl = URL.createObjectURL(res.data);
        setVideoUrl(objectUrl);
      } catch (err) {
        console.error("Error loading video:", err);
        setVideoUrl(null);
      }
    };

    fetchVideo();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl); // ✅ Cleanup
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-black">
      {!showLanguage && videoUrl && (
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-screen object-cover"
          onClick={() => setShowLanguage(true)}
          style={{ cursor: "pointer" }}
        />
      )}

      {showLanguage && (
        <div className="absolute inset-0 flex items-center w-full justify-center bg-black z-10">
          <LanguageSelection />
        </div>
      )}
    </div>
  );
};

export default DisplayLanding;
