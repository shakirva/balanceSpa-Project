import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@assets/logo.png';

const LanguageSelection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const navigate = useNavigate();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'عربية' },
  ];

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    // ✅ Navigate with query param, not state
    navigate(`/menu?lang=${languageCode}`);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
      <div className="flex flex-col items-center w-full max-w-lg mx-auto">
        {/* Logo */}
        <img src={logo} alt="Balance Logo" className="w-48" />
        <h1 className="text-white text-3xl font-bold mb-4 -mt-6">BALANCE SPA</h1>
        <h2 className="mb-6 text-center text-md text-[#9CA3AF]">Select Your Language</h2>

        <div className="flex justify-center gap-4 w-full flex-wrap">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-6 px-6 rounded-lg shadow-lg flex flex-col items-center transition-transform duration-300 hover:scale-105 w-[180px] h-[180px] border ${
                selectedLanguage === language.code ? 'border-white' : 'border-zinc-700'
              }`}
            >
              {/* Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="white"
                className="mb-2"
              >
                <g clipPath="url(#clip0_31_33)">
                  <mask id="mask0_31_33" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
                    <path d="M0 0H48V48H0V0Z" fill="white" />
                  </mask>
                  <g mask="url(#mask0_31_33)">
                    <path
                      d="M32.2969 15C30.9375 6.62812 27.7312 0.75 24 0.75C20.2688 0.75 17.0625 6.62812 15.7031 15H32.2969ZM15 24C15 26.0813 15.1125 28.0781 15.3094 30H32.6813C32.8781 28.0781 32.9906 26.0813 32.9906 24C32.9906 21.9187 32.8781 19.9219 32.6813 18H15.3094C15.1125 19.9219 15 21.9188 15 24ZM45.4406 15C42.7594 8.63437 37.3313 3.7125 30.6281 1.725C32.9156 4.89375 34.4906 9.66562 35.3156 15H45.4406ZM17.3625 1.725C10.6687 3.7125 5.23125 8.63437 2.55937 15H12.6844C13.5 9.66562 15.075 4.89375 17.3625 1.725ZM46.4437 18H35.6906C35.8875 19.9688 36 21.9844 36 24C36 26.0156 35.8875 28.0312 35.6906 30H46.4344C46.95 28.0781 47.2406 26.0813 47.2406 24C47.2406 21.9187 46.95 19.9219 46.4437 18ZM12 24C12 21.9844 12.1125 19.9688 12.3094 18H1.55625C1.05 19.9219 0.75 21.9188 0.75 24C0.75 26.0813 1.05 28.0781 1.55625 30H12.3C12.1125 28.0312 12 26.0156 12 24ZM15.7031 33C17.0625 41.3719 20.2687 47.25 24 47.25C27.7312 47.25 30.9375 41.3719 32.2969 33H15.7031ZM30.6375 46.275C37.3312 44.2875 42.7687 39.3656 45.45 33H35.325C34.5 38.3344 32.925 43.1063 30.6375 46.275ZM2.55937 33C5.24062 39.3656 10.6688 44.2875 17.3719 46.275C15.0844 43.1063 13.5094 38.3344 12.6844 33H2.55937Z"
                      fill="white"
                    />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_31_33">
                    <rect width="48" height="48" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              {/* Language Name */}
              <span className="text-2xl">{language.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
