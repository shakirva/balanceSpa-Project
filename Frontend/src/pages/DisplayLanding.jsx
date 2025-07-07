import React, { useState } from 'react';
import LanguageSelection from './LanguageSelection';
import welcomeVideo from '@assets/welcome.mp4';

const DisplayLanding = () => {
  const [showLanguage, setShowLanguage] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* Video background */}
      {!showLanguage && (
        <video
          src={welcomeVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-screen object-cover"
          onClick={() => setShowLanguage(true)}
          style={{ cursor: 'pointer' }}
        />
      )}

      {/* Overlay for language selection */}
      {showLanguage && (
        <div className="absolute inset-0 flex items-center w-full justify-center bg-black z-10">
          <LanguageSelection />
        </div>
      )}

      {/* Optional: Overlay text or logo before click */}
      {!showLanguage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-5 pointer-events-none">
          {/* You can add a logo or welcome text here if desired */}
        </div>
      )}
    </div>
  );
};

export default DisplayLanding; 