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
        <div className='flex gap-2'>
        <button
           onClick={() => setShowModal(true)}
          className=" border border-[#fff] flex gap-1 text-white hover:bg-blue-700 text-black rounded-full px-6 py-3 shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <span>{selectedLanguage === 'ar' ? 'مستخدم حالي' : 'Existing User'}</span>
        </button>
        <button
            onClick={() =>
              navigate('/booking', {
                state: {
                  language: selectedLanguage,
                },
              })
            }
          className="bg-white flex gap-1 hover:bg-blue-700 text-black rounded-full px-6 py-3 shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <span>{selectedLanguage === 'ar' ? 'مستخدم حالي' : 'Register Now'}</span>
        </button>
          
        </div>
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
