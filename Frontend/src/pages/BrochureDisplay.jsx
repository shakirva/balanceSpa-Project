import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTranslations } from '../utils/translations';

// Import all images
import morocconBath from '@assets/moroccon-bath.png';
import treatmentService from '@assets/treatment-service.png';
import beautyService from '@assets/beauty-service.png';
import thaiMassage from '@assets/thai-massage.png';

const BrochureDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedLanguage = location.state?.language || 'en';
  const selectedCategory = location.state?.category;
  const [showModal, setShowModal] = useState(false);
  const [mobileInput, setMobileInput] = useState('');
  useEffect(() => {
    if (!selectedLanguage || !selectedCategory) {
      navigate('/', { replace: true });
    }
  }, [selectedLanguage, selectedCategory, navigate]);

  const translations = getTranslations(selectedLanguage);

  // Create a mapping of service IDs to their images
  const serviceImages = {
    moroccan: morocconBath,
    treatment: treatmentService,
    beauty: beautyService
  };

  // Get the current category title
  const currentCategory = translations.services.find(
    service => service.id === selectedCategory
  );

  // Get treatments for the selected category
  const filteredTreatments = translations.treatments.filter(
    treatment => treatment.category === selectedCategory
  );

  const handleBookingClick = () => {
    navigate('/booking-form', {
      state: { language: selectedLanguage }
    });
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

  return (
    <div className={`min-h-screen bg-black ${selectedLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="bg-black py-4 px-6 border-b border-zinc-800 relative">
        <h1 className="text-2xl font-bold text-center mb-2 text-white">
          {translations.common.title}
        </h1>
        <p className="text-sm text-gray-400 text-center">
          {translations.common.subtitle}
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

      {/* Floating Action Button */}
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

      <div className="container mx-auto p-10">
        <h1 className="text-2xl font-bold text-white text-left mb-4 capitalize">
          {currentCategory?.title || selectedCategory}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTreatments.map((treatment, index) => (
            <div key={index} className="bg-zinc-900 rounded-xl p-3 overflow-hidden text-white shadow-lg cursor-pointer" onClick={() =>
                    navigate('/booking', { state: { language: selectedLanguage } })
                  }>
              <img
                src={treatment.image === 'thai-massage.png' ? thaiMassage : serviceImages[selectedCategory]}
                alt={treatment.title}
                className="w-full h-52 object-cover rounded-lg"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{treatment.title}</h2>
                <p className="text-sm text-gray-300 mb-4">{treatment.description}</p>
                <ul className="mb-4 space-y-2">
                  {treatment.pricing.map((item, i) => (
                    <li key={i} className="flex justify-between border-b border-gray-700 pb-1">
                      <span>{item.duration}</span>
                      <span className="text-[#ababab]">{item.price}</span>
                    </li>
                  ))}
                </ul>
               
              </div>
            </div>
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

export default BrochureDisplay;