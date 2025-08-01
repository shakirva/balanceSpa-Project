import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getTranslations } from '../utils/translations';

const Services = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract language and mobile from query string
  const queryParams = new URLSearchParams(location.search);
  const selectedLanguage = queryParams.get('lang') || 'en';
  const initialMobile = queryParams.get('mobile') || '';

  const translations = getTranslations(selectedLanguage);

  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mobileInput, setMobileInput] = useState(initialMobile);
  const [loading, setLoading] = useState(true);

  // Fetch service categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Submit mobile number for existing user
  const handleBookingSubmit = () => {
    if (!mobileInput.trim()) {
      alert('Please enter a mobile number');
      return;
    }
    navigate(`/booking?lang=${selectedLanguage}&mobile=${mobileInput}`);
  };

  // Navigate to brochure page
  const handleCategorySelect = (categoryId) => {
    navigate(`/brochure?category=${categoryId}&lang=${selectedLanguage}`);
  };

  return (
    <div className={`min-h-screen bg-black text-white ${selectedLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="py-4 px-6 border-b border-zinc-800 relative">
        <h1 className="text-2xl font-bold text-center mb-2">
          {translations.common?.title || 'Balance Spa'}
        </h1>
        <p className="text-sm text-gray-400 text-center">
          {translations.common?.subtitle || 'Luxury Wellness Experience'}
        </p>

        {/* Back Button */}
        <div className={`absolute top-8 ${selectedLanguage === 'ar' ? 'right-8' : 'left-8'}`}>
          <button onClick={() => navigate(-1)} className="text-white hover:text-blue-400 flex gap-1 items-center">
            <svg width="24" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>{selectedLanguage === 'ar' ? 'الرجوع' : 'Back'}</span>
          </button>
        </div>

        {/* Auth Buttons */}
        <div className={`absolute top-6 ${selectedLanguage === 'ar' ? 'left-8' : 'right-8'}`}>
          <div className="flex gap-2">
            {/* <button
              onClick={() => setShowModal(true)}
              className="border border-white text-white px-6 py-3 rounded-full shadow hover:bg-blue-700"
            >
              {selectedLanguage === 'ar' ? 'مستخدم حالي' : 'Existing User'}
            </button> */}
            <button
              onClick={() => navigate(`/booking?lang=${selectedLanguage}`)}
              className="bg-white text-black px-6 py-3 rounded-full shadow hover:bg-blue-700"
            >
              {selectedLanguage === 'ar' ? 'تسجيل الآن' : 'Register Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="p-6 flex flex-col h-screen overflow-hidden">
        {loading ? (
          <p className="text-center text-gray-400">Loading services...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 overflow-y-auto max-h-[calc(100vh-280px)] pr-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="bg-zinc-900 rounded-xl p-3 text-left transition hover:bg-zinc-800"
              >
                <div className="aspect-video rounded-lg overflow-hidden mb-3">
                  <img
                    src={`http://localhost:5000${category.image_url}`}
                    alt={category.name_en}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold">
                  {selectedLanguage === 'ar' ? category.name_ar : category.name_en}
                </h3>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#18181b] rounded-lg p-6 w-full max-w-sm text-white shadow-xl">
            <h2 className="text-md font-semibold mb-4">
              {selectedLanguage === 'ar' ? 'أدخل رقم الجوال' : 'Enter Mobile Number'}
            </h2>
            <input
              type="tel"
              value={mobileInput}
              onChange={(e) => setMobileInput(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg mb-4"
              placeholder={selectedLanguage === 'ar' ? 'رقم الجوال' : 'Mobile Number'}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-3 py-1 bg-zinc-700 rounded">
                {selectedLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button onClick={handleBookingSubmit} className="px-3 py-1 bg-white text-black rounded hover:bg-blue-700">
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
