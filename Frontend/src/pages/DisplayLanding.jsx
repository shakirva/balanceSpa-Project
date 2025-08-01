import React, { useEffect, useState } from 'react';
import LanguageSelection from './LanguageSelection';
import axios from '../api/axios';

const DisplayLanding = () => {
  const [showLanguage, setShowLanguage] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/settings/get-video', { responseType: 'blob' })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        setVideoUrl(url);
      });
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
          style={{ cursor: 'pointer' }}
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
