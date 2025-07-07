import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTranslations } from '../utils/translations';
import morocconBath from '@assets/moroccon-bath.png';
import treatmentService from '@assets/treatment-service.png';
import beautyService from '@assets/beauty-service.png';

const Services = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedLanguage = location.state?.language || 'en';
  const translations = getTranslations(selectedLanguage);
  const initialMobile = location.state?.mobile || '';

  const [formData, setFormData] = useState({ mobile: initialMobile });
  const [showModal, setShowModal] = useState(false);
  const [mobileInput, setMobileInput] = useState('');

  const imageMap = {
    'moroccon-bath.png': morocconBath,
    'treatment-service.png': treatmentService,
    'beauty-service.png': beautyService
  };

  const handleBookingSubmit = () => {
    if (!mobileInput) {
      alert('Please enter a mobile number');
      return;
    }

    navigate('/booking', {
      state: {
        language: selectedLanguage,
        mobile: mobileInput
      }
    });
  };

  const handleCategorySelect = (category) => {
    if (!category?.id) return;

    navigate('/brochure', {
      state: {
        language: selectedLanguage,
        category: category.id
      },
    });
  };

  if (!translations?.services) {
    return <div>Loading services...</div>;
  }

  return (
    <div className={`min-h-screen relative ${selectedLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="bg-black py-4 px-6 border-b border-zinc-800 relative">
        <h1 className="text-2xl font-bold text-center mb-2 text-white">
          {translations.common?.title || 'Balance Spa'}
        </h1>
        <p className="text-sm text-gray-400 text-center">
          {translations.common?.subtitle || 'Luxury Wellness Experience'}
        </p>

        {/* Back Button */}
        <div className={`absolute top-8 ${selectedLanguage === 'ar' ? 'right-8' : 'left-8'}`}>
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-blue-400 transition flex gap-1"
            aria-label="Go back"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>{selectedLanguage === 'ar' ? 'الرجوع' : 'Back'}</span>
          </button>
        </div>

        {/* Existing User Button */}
        <div className={`absolute top-6 ${selectedLanguage === 'ar' ? 'left-8' : 'right-8'}`}>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white flex gap-1 hover:bg-blue-700 text-black rounded-full px-4 py-3 shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <svg width="24" height="24" fill="#000000" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M7.75 7.5a4.25 4.25 0 1 1 8.5 0 4.25 4.25 0 0 1-8.5 0ZM12 4.75a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 0 0 0-5.5Z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M8 14.75A2.25 2.25 0 0 0 5.75 17v1.188c0 .018.013.034.031.037 4.119.672 8.32.672 12.438 0a.037.037 0 0 0 .031-.037V17A2.25 2.25 0 0 0 16 14.75h-.34a.253.253 0 0 0-.079.012l-.865.283a8.751 8.751 0 0 1-5.432 0l-.866-.283a.252.252 0 0 0-.077-.012H8ZM4.25 17A3.75 3.75 0 0 1 8 13.25h.34c.185 0 .369.03.544.086l.866.283a7.251 7.251 0 0 0 4.5 0l.866-.283c.175-.057.359-.086.543-.086H16A3.75 3.75 0 0 1 19.75 17v1.188c0 .754-.546 1.396-1.29 1.517a40.095 40.095 0 0 1-12.92 0 1.537 1.537 0 0 1-1.29-1.517V17Z" clipRule="evenodd" />
            </svg>
            <span>{selectedLanguage === 'ar' ? 'مستخدم حالي' : 'Existing User'}</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="w-full bg-black text-white p-10 flex flex-col h-screen overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 overflow-y-auto max-h-[calc(100vh-280px)] pr-2">
          {translations.services.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category)}
              className="bg-zinc-900 rounded-xl p-3 text-left transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`View ${category.title} services`}
            >
              <div className="aspect-video rounded-lg overflow-hidden mb-3">
                <img
                  src={imageMap[category.image] || morocconBath}
                  alt={category.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = morocconBath;
                  }}
                />
              </div>
              <h3 className="text-lg font-semibold mb-1">{category.title}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#18181b] rounded-lg p-6 w-full max-w-sm text-black shadow-xl">
            <h2 className="text-md text-white font-semibold mb-4">
              {selectedLanguage === 'ar' ? 'أدخل رقم الجوال' : 'Enter Mobile Number'}
            </h2>
            <input
              type="tel"
              value={mobileInput}
              onChange={(e) => setMobileInput(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white rounded mb-4"
              placeholder={selectedLanguage === 'ar' ? 'رقم الجوال' : 'Mobile Number'}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-zinc-700 text-white px-3 py-1 rounded"
              >
                {selectedLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleBookingSubmit}
                className="px-4 py-2 bg-white text-black rounded hover:bg-blue-700"
              >
                {selectedLanguage === 'ar' ? 'إرسال' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
