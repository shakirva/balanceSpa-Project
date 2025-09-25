import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance, { BASE_URL } from '../api/axios';
import { getTranslations } from '../utils/translations';

const BrochureDisplay = () => {
  // Multi-select treatments and checkout
  const [selectedTreatments, setSelectedTreatments] = useState([]);

  const handleSelect = (id) => {
    setSelectedTreatments(prev =>
      prev.includes(id)
        ? prev.filter(tid => tid !== id)
        : [...prev, id]
    );
  };

  const handleCheckout = () => {
    if (selectedTreatments.length === 0) {
      alert('Please select at least one treatment');
      return;
    }
    // Pass selected services and treatments to FoodBeverages page
    navigate(`/food-beverages?lang=${selectedLanguage}&services=${selectedServices.join(",")}&treatments=${selectedTreatments.join(",")}`);
  };
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const selectedCategory = params.get('category');
  const selectedLanguage = params.get('lang') || 'en';
  const selectedServices = params.get('services')?.split(',').map(id => id.trim()).filter(Boolean) || [];
  const selectedTreatmentsQS = params.get('treatments')?.split(',').map(id => id.trim()).filter(Boolean) || [];

  const translations = getTranslations(selectedLanguage);
  const [categories, setCategories] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mobileInput, setMobileInput] = useState('');

  useEffect(() => {
    // Fetch all categories
    axiosInstance.get('/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  useEffect(() => {
    // If multiple services are selected, show all their treatments
    if (selectedServices.length > 0) {
      const fetchData = async () => {
        try {
          // Fetch all categories for tabs
          const catRes = await axiosInstance.get('/api/categories');
          setCategories(catRes.data);
          // Fetch all treatments for selected services
          const treatRes = await axiosInstance.get('/api/treatments');
          const filteredTreatments = treatRes.data.filter(t => selectedServices.includes(String(t.category_id)));
          setTreatments(filteredTreatments);
        } catch (err) {
          console.error('Error loading brochure data:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
      return;
    }
    // Fallback: single category
    if (!selectedCategory) {
      navigate('/', { replace: true });
      return;
    }
    const fetchData = async () => {
      try {
        const [catRes, treatRes] = await Promise.all([
          axiosInstance.get(`/api/categories/${selectedCategory}`),
          axiosInstance.get(`/api/treatments?category_id=${selectedCategory}`)
        ]);
        setCategory(catRes.data);
        setTreatments(treatRes.data);
      } catch (err) {
        console.error('Error loading brochure data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, selectedServices, navigate]);

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
              ${selectedServices.includes(String(cat.id)) ? 'bg-blue-600 text-white border-2 border-blue-400' : (String(cat.id) === selectedCategory ? 'bg-white text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700')}`}
          >
            {selectedLanguage === 'ar' ? cat.name_ar : cat.name_en}
          </button>
        ))}
      </div>

      {/* Treatments Section */}
      <div className="container mx-auto p-6">
        {selectedServices.length === 0 && (
          <h2 className="text-2xl font-semibold mb-4 capitalize">
            {selectedLanguage === 'ar' ? category?.name_ar : category?.name_en}
          </h2>
        )}
        {loading ? (
          <p className="text-gray-400">Loading treatments...</p>
        ) : treatments.length === 0 ? (
          <p className="text-red-500">No treatments found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {treatments.map((treatment) => (
                <div
                  key={treatment.id}
                  className="bg-zinc-900 rounded-xl overflow-hidden shadow hover:bg-zinc-800 hover:scale-[1.01] transition-transform cursor-pointer border border-gray-800 relative"
                  onClick={() => handleSelect(treatment.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedTreatments.includes(treatment.id) || selectedTreatmentsQS.includes(String(treatment.id))}
                    onChange={() => handleSelect(treatment.id)}
                    className="absolute top-4 right-4 w-5 h-5 accent-blue-500 cursor-pointer z-10"
                    onClick={e => e.stopPropagation()}
                  />
                  <img
                    src={`${BASE_URL}${treatment.image_url}`}
                    alt={treatment.name_en}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-treatment.jpg';
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2 text-white">
                      {selectedLanguage === 'ar' ? treatment.name_ar : treatment.name_en}
                    </h3>
                    <p className="text-sm text-gray-300 mb-3">
                      {selectedLanguage === 'ar' ? treatment.description_ar : treatment.description_en}
                    </p>
                    <ul className="space-y-2">
                      {treatment.prices.map((price, idx) => (
                        <li key={idx} className="flex justify-between border-b border-gray-700 pb-1">
                          <span>{price.duration}</span>
                          <span className="text-[#ababab]">{price.price} {selectedLanguage === 'ar' ? 'ريال' : 'QR'}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <button
                onClick={handleCheckout}
                className="bg-white text-black px-8 py-3 rounded-full shadow hover:bg-gray-100 text-lg font-semibold flex items-center gap-2 border border-gray-300"
              >
                {selectedLanguage === 'ar' ? 'الدفع' : 'Checkout'}
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </>
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
