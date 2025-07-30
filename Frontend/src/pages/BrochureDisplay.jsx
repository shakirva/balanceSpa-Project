import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getTranslations } from '../utils/translations';

const BrochureDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedCategory = new URLSearchParams(location.search).get('category');
  const selectedLanguage = new URLSearchParams(location.search).get('lang') || 'en';

  const translations = getTranslations(selectedLanguage);
  const [categories, setCategories] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mobileInput, setMobileInput] = useState('');

  useEffect(() => {
    // Fetch all categories
    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      navigate('/', { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        const [catRes, treatRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/categories/${selectedCategory}`),
          axios.get(`http://localhost:5000/api/treatments?category_id=${selectedCategory}`)
        ]);

        setCategory(catRes.data);
        const flatTreatments = treatRes.data.flatMap(c => c.treatments || []);
        setTreatments(flatTreatments);
      } catch (err) {
        console.error('Error loading brochure data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, navigate]);

  const handleBookingClick = () => {
    if (!mobileInput) {
      alert('Please enter a mobile number');
      return;
    }
    navigate('/booking', {
      state: { language: selectedLanguage, mobile: mobileInput }
    });
  };

  const goToCategory = (id) => {
    navigate(`/brochure?category=${id}&lang=${selectedLanguage}`);
  };

  return (
    <div className={`min-h-screen bg-black text-white ${selectedLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Top Header */}
      <div className="bg-black py-4 px-6 border-b border-zinc-800 relative">
        <h1 className="text-2xl font-bold text-center text-white">
          {translations.common?.title}
        </h1>
        <p className="text-sm text-gray-400 text-center">{translations.common?.subtitle}</p>

        {/* Back Button */}
        <div className={`absolute top-8 ${selectedLanguage === 'ar' ? 'right-8' : 'left-8'}`}>
          <button onClick={() => navigate(-1)} className="text-white hover:text-blue-400 flex gap-1">
            <svg width="24" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>{selectedLanguage === 'ar' ? 'الرجوع' : 'Back'}</span>
          </button>
        </div>

        {/* Booking Buttons */}
        <div className={`absolute top-6 ${selectedLanguage === 'ar' ? 'left-8' : 'right-8'}`}>
          <div className="flex gap-2">
            {/* <button onClick={() => setShowModal(true)} className="border border-white px-6 py-3 rounded-full hover:bg-blue-700">
              {selectedLanguage === 'ar' ? 'مستخدم حالي' : 'Existing User'}
            </button> */}
            <button onClick={() => navigate('/booking', { state: { language: selectedLanguage } })} className="bg-white text-black px-6 py-3 rounded-full hover:bg-blue-700">
              {selectedLanguage === 'ar' ? 'تسجيل الآن' : 'Register Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="overflow-x-auto whitespace-nowrap px-6 py-4 bg-[#121212] border-b border-zinc-800">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => goToCategory(cat.id)}
            className={`inline-block px-4 py-2 text-sm font-medium rounded-full mx-1 transition 
              ${String(cat.id) === selectedCategory ? 'bg-white text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
          >
            {selectedLanguage === 'ar' ? cat.name_ar : cat.name_en}
          </button>
        ))}
      </div>

      {/* Treatments Section */}
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4 capitalize">
          {selectedLanguage === 'ar' ? category?.name_ar : category?.name_en}
        </h2>

        {loading ? (
          <p className="text-gray-400">Loading treatments...</p>
        ) : treatments.length === 0 ? (
          <p className="text-red-500">No treatments found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {treatments.map((treatment) => (
              <div
                key={treatment.id}
                className="bg-zinc-900 rounded-xl overflow-hidden shadow hover:bg-zinc-800 hover:scale-[1.01] transition-transform cursor-pointer"
                onClick={() =>
                  navigate('/booking', {
                    state: { language: selectedLanguage, treatment },
                  })
                }
              >
                <img
                  src={`http://localhost:5000${treatment.image_url}`}
                  alt={treatment.name_en}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-treatment.jpg';
                  }}
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">
                    {selectedLanguage === 'ar' ? treatment.name_ar : treatment.name_en}
                  </h3>
                  <p className="text-sm text-gray-300 mb-3">
                    {selectedLanguage === 'ar' ? treatment.description_ar : treatment.description_en}
                  </p>
                  <ul className="space-y-2">
                    {treatment.prices.map((price, idx) => (
                      <li key={idx} className="flex justify-between border-b border-gray-700 pb-1">
                        <span>{price.duration}</span>
                        <span className="text-[#ababab]">{price.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Existing User */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#18181b] rounded-lg p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-md text-white font-semibold mb-4">
              {selectedLanguage === 'ar' ? 'أدخل رقم الجوال' : 'Enter Mobile Number'}
            </h2>
            <input
              type="tel"
              value={mobileInput}
              onChange={(e) => setMobileInput(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white mb-4"
              placeholder={selectedLanguage === 'ar' ? 'رقم الجوال' : 'Mobile Number'}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-zinc-700 text-white rounded">
                {selectedLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button onClick={handleBookingClick} className="px-4 py-2 bg-white text-black rounded hover:bg-blue-700">
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
