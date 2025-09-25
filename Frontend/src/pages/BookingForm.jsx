import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTranslations } from '../utils/translations';
import BodySelection from '@components/BodySelection';
import SignaturePad from 'react-signature-pad-wrapper';
import axiosInstance from '../api/axios'; // Correct import path for axiosInstance

import { useRef } from 'react';
import { generateAppointmentPDF } from '@utils/pdfGenerator';
import axios from '../api/axios';

function SuccessModal({ onClose, language }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#1f2937',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
        minWidth: '320px',
        color: '#fff'
      }}>
        <h2 style={{ marginBottom: '10px' }}>{language === 'ar' ? 'تم الحجز بنجاح!' : 'Booking Successful!'}</h2>
        <p>{language === 'ar' ? 'تم إرسال الاستشارة بنجاح.' : 'Your consultation has been submitted successfully.'}</p>
      </div>
    </div>
  );
}

const BookingForm = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedServiceQS = params.get('service') || params.get('services');
    // Removed duplicate declarations of query param variables
    const selectedTreatmentQS = params.get('treatment') || params.get('treatments');
    const selectedFoodsQS = params.get('food');
    const selectedLanguageQS = params.get('lang');
    const selectedLanguage = selectedLanguageQS || location.state?.language || 'en';
    const translations = getTranslations(selectedLanguage).booking;
    const selectedFoodsArr = selectedFoodsQS ? selectedFoodsQS.split(',').map(f => f.trim()).filter(Boolean) : [];
  // Support multi-select for services and treatments
  const selectedServicesArr = selectedServiceQS ? selectedServiceQS.split(',').map(s => s.trim()).filter(Boolean) : [];
  const selectedTreatmentsArr = selectedTreatmentQS ? selectedTreatmentQS.split(',').map(t => t.trim()).filter(Boolean) : [];
  const [foodsList, setFoodsList] = useState([]);

  // Fetch all foods for name mapping
  useEffect(() => {
    axios.get('/api/food-beverages')
      .then(res => setFoodsList(Array.isArray(res.data) ? res.data : []))
      .catch(() => setFoodsList([]));
  }, []);
  // Removed duplicate declarations of query param variables

const [formData, setFormData] = useState({
    date: '',
    name: '',
    time: '',
    nationality: '',
    mobile: '',
    knowFrom: [],   
    socialMedia: [],
    healthConditions: [],
    implants: '',
    implantDetails: '',
    pressure: '',
    skinType: '',
    otherConcerns: '',
    promotional: false,
    signature: '',
    selectedBodyParts: [],
    selectedServices: selectedServicesArr,
    selectedTreatments: selectedTreatmentsArr,
    selectedFoods: selectedFoodsArr,
    selectedDuration: '',
    selectedPrice: ''
});

  // Pre-fill foods on mount (if needed for future dynamic updates)
  useEffect(() => {
    if (selectedFoodsArr.length > 0) {
      setFormData(prev => ({ ...prev, selectedFoods: selectedFoodsArr }));
    }
  }, []);


  const [categories, setCategories] = useState([]);
  const [treatments, setTreatments] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);




  // Fetch categories (services) and auto-select if query param exists
  useEffect(() => {
    axios.get('/api/categories')
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => console.error('Failed to fetch services:', err));
  }, []);

  // Set selectedService in formData after categories are loaded
  useEffect(() => {
    if (categories.length > 0 && selectedServicesArr.length > 0) {
      setFormData(prev => ({ ...prev, selectedServices: selectedServicesArr }));
    }
  }, [categories, selectedServicesArr]);

  // Fetch treatments when a category is selected and auto-select if query param exists
  useEffect(() => {
    if (formData.selectedServices && formData.selectedServices.length > 0) {
      // Fetch treatments for all selected services
      Promise.all(formData.selectedServices.map(serviceId =>
        axios.get(`/api/treatments?category_id=${serviceId}`)
      )).then(responses => {
        // Flatten all treatments arrays
        let allTreatments = [];
        responses.forEach(res => {
          let treatmentsArr = Array.isArray(res.data) ? res.data : [];
          if (Array.isArray(res.data) && res.data.length > 0 && res.data[0].treatments) {
            treatmentsArr = res.data[0].treatments;
          }
          allTreatments = allTreatments.concat(treatmentsArr);
        });
        setTreatments(allTreatments);
        // Reset selectedTreatments if they are not in the new treatments list
        setFormData(prev => ({
          ...prev,
          selectedTreatments: prev.selectedTreatments.filter(tid => allTreatments.some(t => String(t.id) === String(tid)))
        }));
      }).catch(err => {
        setTreatments([]);
        setFormData(prev => ({ ...prev, selectedTreatments: [] }));
        console.error('Failed to fetch treatments:', err);
      });
    } else {
      setTreatments([]);
      setFormData(prev => ({ ...prev, selectedTreatments: [] }));
    }
  }, [formData.selectedServices]);

  // Set selectedTreatment in formData after treatments are loaded
  useEffect(() => {
    if (treatments.length > 0 && selectedTreatmentsArr.length > 0) {
      setFormData(prev => ({ ...prev, selectedTreatments: selectedTreatmentsArr }));
    }
  }, [treatments, selectedTreatmentsArr]);

  

  const navigate = useNavigate();
  const handleBodyPartSelection = (newSelectedParts) => {
    setFormData(prev => ({
      ...prev,
      selectedBodyParts: newSelectedParts
    }));
  };

  const toggleCheckbox = (key, value) => {
    setFormData(prev => {
      const list = prev[key];
      return {
        ...prev,
        [key]: list.includes(value)
          ? list.filter(v => v !== value)
          : [...list, value]
      };
    });
  };

  

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


const sigPadRef = useRef();
const dateInputRef = useRef();

const handleSubmit = async (e) => {
  e.preventDefault();

  let signatureDataUrl = '';
  if (sigPadRef.current) {
    signatureDataUrl = sigPadRef.current.toDataURL();
  }

  const pdfData = {
    ...formData,
    signature: signatureDataUrl,
    language: selectedLanguage,
  };

  const pdfBlob = await generateAppointmentPDF(pdfData);

  const form = new FormData();
  Object.entries(pdfData).forEach(([key, value]) => {
    form.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
  });
  form.append('pdf', pdfBlob, 'consultation.pdf');

  try {
    await axiosInstance.post('/api/bookings/create', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    // Instead of navigating, show modal
    setIsModalOpen(true);
  } catch (err) {
    alert('Failed to submit booking');
    console.error(err);
  }
};

// Only clear the pad on clear button
const handleClearSignature = () => {
  if (sigPadRef.current) {
    sigPadRef.current.clear();
  }
};

  const checkboxClass = (isActive) =>
    `flex items-center gap-2 px-4 py-2 rounded-full border transition text-sm font-medium cursor-pointer ${
      isActive
        ? 'bg-green-600 text-white border-green-600'
        : 'bg-zinc-800 text-white border-zinc-600 hover:bg-zinc-700'
    }`;

  const radioClass = (isActive) =>
    `px-4 py-2 rounded-full border transition text-sm font-medium cursor-pointer ${
      isActive
        ? 'bg-green-600 text-white border-green-600'
        : 'bg-zinc-800 text-white border-zinc-600 hover:bg-zinc-700'
    }`;

  // Options data that changes based on language
  const durationOptions = [
    { label: '60 min', duration: 60, price: 220 },
    { label: '90 min', duration: 90, price: 250 },
    { label: '2 hrs', duration: 120, price: 300 },
  ];
  
  const formOptions = {
    knowFrom: selectedLanguage === 'ar' ? 
      ['صديق', 'الإنترنت', 'آخر'] : 
      ['Friend', 'Online', 'Other'],
    
    socialMedia: selectedLanguage === 'ar' ? 
      ['فيسبوك', 'سناب شات', 'إنستغرام', 'خرائط جوجل'] : 
      ['Facebook', 'Snapchat', 'Instagram', 'Google Map'],
    
    healthConditions: selectedLanguage === 'ar' ? 
      [
        'سرطان', 'سكري', 'ضغط دم مرتفع/منخفض', 'أمراض قلب/كلى',
        'هربس', 'حمى', 'قدم رياضي', 'أمراض جلدية',
        'أي عملية جراحية (حديثة أو سابقة)', 'حساسية من منتجات'
      ] : 
      [
        'Cancer', 'Diabetes', 'High / Low Blood pressure', 'Heart / Kidney disease',
        'Herpes', 'Fever', 'Athletes Foot', 'Skin diseases',
        'Any operation (recent or past)', 'Product Allergies'
      ],
    
    pressureOptions: selectedLanguage === 'ar' ? 
      ['خفيف/ناعم', 'متوسط', 'قوي/عميق'] : 
      ['Soft/Light', 'Medium', 'Strong / Deep'],
    
    skinTypeOptions: selectedLanguage === 'ar' ? 
      ['عادي', 'حساس', 'جاف', 'دهني', 'مختلط'] : 
      ['Normal', 'Sensitive', 'Dry', 'Oil', 'Combination'],
    
    yesNoOptions: selectedLanguage === 'ar' ? ['نعم', 'لا'] : ['yes', 'no']
  };

  return (
    <div className={`min-h-screen bg-black ${selectedLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="bg-black py-4 px-6 border-b border-zinc-800 re">
        <h1 className="text-2xl font-bold text-center mb-2 text-white">
          {getTranslations(selectedLanguage).common.title}
        </h1>
        <p className="text-sm text-gray-400 text-center">
          {getTranslations(selectedLanguage).common.subtitle}
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
      </div>

      <div className="px-6 py-10 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-zinc-900 p-6 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-zinc-900 p-6 border border-zinc-700 rounded-lg shadow-lg">
                  <div className="space-y-4">
                  <div>
                      <label className="block font-semibold mb-2">{translations.labels.mobile}</label>
                      <input
                        type="text"
                        name="mobile"
                        onChange={handleChange}
                        className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">{translations.labels.customerName}</label>
                      <input
                        type="text"
                        name="name"
                        onChange={handleChange}
                        className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white"
                      />
                    </div>
                  {/* Selected Services Heading */}
                  <div className="mb-2">
                    <h2 className="font-bold text-white text-lg mb-2 tracking-wide">{selectedLanguage === 'ar' ? 'الخدمات المختارة' : 'Selected Services'}</h2>
                    <div className="text-base text-white mb-2">
                      {formData.selectedServices && formData.selectedServices.length > 0 ? (
                        formData.selectedServices.map((serviceId, idx) => {
                          const selectedCat = categories.find(cat => String(cat.id) === String(serviceId));
                          return (
                            <span key={serviceId + idx} className="mr-2">
                              {selectedCat ? (selectedLanguage === 'ar' ? selectedCat.name_ar : selectedCat.name_en) : serviceId}
                            </span>
                          );
                        })
                      ) : (
                        <span>{selectedLanguage === 'ar' ? 'لا توجد خدمة مختارة' : 'No service selected'}</span>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-2">{selectedLanguage === 'ar' ? 'اختر الخدمات' : 'Select Services'}</label>
                    <select
                      name="selectedServices"
                      value={formData.selectedServices}
                      onChange={e => {
                        const options = Array.from(e.target.selectedOptions, opt => opt.value);
                        setFormData(prev => ({ ...prev, selectedServices: options }));
                      }}
                      className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white"
                      multiple
                      style={{ minHeight: '48px', fontSize: '1rem' }}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {selectedLanguage === 'ar' ? cat.name_ar : cat.name_en}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Selected Treatments Heading */}
                  <div className="mb-2">
                    <h2 className="font-bold text-white text-lg mb-2 tracking-wide">{selectedLanguage === 'ar' ? 'العلاجات المختارة' : 'Selected Treatments'}</h2>
                    <div className="text-base text-white mb-2">
                      {formData.selectedTreatments && formData.selectedTreatments.length > 0 ? (
                        formData.selectedTreatments.map((treatId, idx) => {
                          const selectedTreat = treatments.find(treat => String(treat.id) === String(treatId));
                          return (
                            <span key={treatId + idx} className="mr-2">
                              {selectedTreat ? (selectedLanguage === 'ar' ? selectedTreat.name_ar : selectedTreat.name_en) : treatId}
                            </span>
                          );
                        })
                      ) : (
                        <span>{selectedLanguage === 'ar' ? 'لا يوجد علاج مختار' : 'No treatment selected'}</span>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-2">{selectedLanguage === 'ar' ? 'اختر العلاجات' : 'Select Treatments'}</label>
                    <select
                      name="selectedTreatments"
                      value={formData.selectedTreatments}
                      onChange={e => {
                        const options = Array.from(e.target.selectedOptions, opt => opt.value);
                        setFormData(prev => ({ ...prev, selectedTreatments: options }));
                      }}
                      className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white"
                      multiple
                      disabled={!formData.selectedServices || treatments.length === 0}
                      style={{ minHeight: '48px', fontSize: '1rem' }}
                    >
                      {treatments.map((treat) => (
                        <option key={treat.id} value={treat.id}>
                          {selectedLanguage === 'ar' ? treat.name_ar : treat.name_en}
                        </option>
                      ))}
                    </select>
                  </div>
 <div className="mb-4">
   <label className="block font-semibold mb-2">{selectedLanguage === 'ar' ? 'اختر الأطعمة والمشروبات' : 'Select Foods & Beverages'}</label>
   <select
     name="selectedFoods"
     value={formData.selectedFoods}
     onChange={e => {
       const options = Array.from(e.target.selectedOptions, opt => opt.value);
       setFormData(prev => ({ ...prev, selectedFoods: options }));
     }}
     className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white"
     multiple
     style={{ minHeight: '48px', fontSize: '1rem' }}
   >
     {foodsList.map(food => (
       <option key={food.id} value={food.id}>
         {selectedLanguage === 'ar' ? food.name_ar : food.name}
       </option>
     ))}
   </select>
 </div>

                  <div>
                  <label className="block font-semibold mb-2">
                    {selectedLanguage === 'ar' ? 'اختر المدة' : 'Select Duration'}
                  </label>
                  <select
                    name="selectedDuration"
                    onChange={(e) => {
                      const selected = durationOptions.find(
                        (option) => option.duration.toString() === e.target.value
                      );
                      if (selected) {
                        setFormData((prev) => ({
                          ...prev,
                          selectedDuration: selected.label,
                          selectedPrice: selected.price
                        }));
                      }
                    }}
                    className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white"
                  >
                    <option value="">{selectedLanguage === 'ar' ? 'اختر المدة' : 'Select Duration'}</option>
                    {durationOptions.map((option) => (
                      <option key={option.label} value={option.duration}>
                        {option.label} - {option.price} Qr
                      </option>
                    ))}
                  </select>

                  {/* {formData.selectedDuration && (
                    <div className="mt-2 text-sm text-gray-300">
                      {selectedLanguage === 'ar' ? 'المدة المختارة:' : 'Selected Duration:'} {formData.selectedDuration} <br />
                      {selectedLanguage === 'ar' ? 'السعر:' : 'Price:'} {formData.selectedPrice} Qr
                    </div>
                  )} */}
                </div>



                

                    <div>
                      <label className="block font-semibold mb-2">{translations.labels.date}</label>
                      <div
                        className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white cursor-pointer"
                        onClick={() => dateInputRef.current && dateInputRef.current.showPicker && dateInputRef.current.showPicker()}
                        style={{ position: 'relative' }}
                      >
                        <input
                          type="date"
                          name="date"
                          ref={dateInputRef}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleChange}
                        />
                        <span className="pointer-events-none select-none">
                          {formData.date || (selectedLanguage === 'ar' ? 'اختر التاريخ' : 'Select date')}
                        </span>
                      </div>
                    </div>

                    {/* <div>
                    <label className="block font-semibold mb-2">Start Time</label>
                    <input
                      type="time"
                      name="time"
                      className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white"
                      onChange={handleChange}
                    />
                  </div> */}

                  

                   
                    <div>
                      <label className="block font-semibold mb-2">{translations.labels.nationality}</label>
                      <input
                        type="text"
                        name="nationality"
                        onChange={handleChange}
                        className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white"
                      />
                    </div>
                   
                  </div>
                </div>

                <div className="bg-zinc-900 p-6 border border-zinc-700 rounded-lg shadow-lg">
                  <p className="font-semibold mb-4">{translations.labels.knowFrom}</p>
                  <div className="flex flex-wrap gap-3">
                    {formOptions.knowFrom.map(option => {
                      const isChecked = formData.knowFrom.includes(option);
                      return (
                        <label key={option} className={checkboxClass(isChecked)}>
                          <input
                            type="checkbox"
                            onChange={() => toggleCheckbox('knowFrom', option)}
                            checked={isChecked}
                            className="hidden"
                          />
                          {isChecked && <span className="text-xs"><svg width="14" height="14" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <path d="M22 4 12 14.01l-3-3"></path>
                          </svg></span>}
                          {option}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-zinc-900 p-6 border border-zinc-700 rounded-lg shadow-lg">
                  <p className="font-semibold mb-4">{translations.labels.socialMedia}</p>
                  <div className="flex flex-wrap gap-3">
                    {formOptions.socialMedia.map(option => {
                      const isChecked = formData.socialMedia.includes(option);
                      return (
                        <label key={option} className={checkboxClass(isChecked)}>
                          <input
                            type="checkbox"
                            onChange={() => toggleCheckbox('socialMedia', option)}
                            checked={isChecked}
                            className="hidden"
                          />
                          {isChecked && <span className="text-lg"><svg width="14" height="14" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <path d="M22 4 12 14.01l-3-3"></path>
                          </svg></span>}
                          {option}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-zinc-900 p-6 border border-zinc-700 rounded-lg shadow-lg">
                  <p className="font-semibold mb-4">{translations.labels.healthConditions}</p>
                  <div className="flex flex-wrap gap-3">
                    {formOptions.healthConditions.map(option => {
                      const isChecked = formData.healthConditions.includes(option);
                      return (
                        <label key={option} className={checkboxClass(isChecked)}>
                          <input
                            type="checkbox"
                            onChange={() => toggleCheckbox('healthConditions', option)}
                            checked={isChecked}
                            className="hidden"
                          />
                          {isChecked && <span className="text-lg"><svg width="14" height="14" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <path d="M22 4 12 14.01l-3-3"></path>
                          </svg></span>}
                          {option}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-700">
                  <p className="font-semibold mb-4">{translations.labels.implants}</p>
                  <div className="flex gap-3">
                    {formOptions.yesNoOptions.map(option => (
                      <label key={option} className={radioClass(formData.implants === option)}>
                        <input
                          type="radio"
                          name="implants"
                          value={option}
                          onChange={handleChange}
                          checked={formData.implants === option}
                          className="hidden"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  {formData.implants === formOptions.yesNoOptions[0] && (
                    <input
                      type="text"
                      name="implantDetails"
                      placeholder={selectedLanguage === 'ar' ? "يرجى تقديم التفاصيل" : "Please provide detail"}
                      onChange={handleChange}
                      className="w-full bg-zinc-800 border border-zinc-700 mt-4 p-2 rounded text-white"
                    />
                  )}
                </div>

                <div className="bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-700">
                  <h1 className="font-bold mb-3">
                    {selectedLanguage === 'ar' ? 'للمساج فقط' : 'For Massage Only'}
                  </h1>
                  <p className="font-semibold mb-4">
                    {selectedLanguage === 'ar' ? 
                      'ما نوع ضغط المساج الذي تفضله؟' : 
                      'What type of massage pressure would you like?'}
                  </p>
                  <div className="flex gap-3">
                    {formOptions.pressureOptions.map(option => (
                      <label key={option} className={radioClass(formData.pressure === option)}>
                        <input
                          type="radio"
                          name="pressure"
                          value={option}
                          onChange={handleChange}
                          checked={formData.pressure === option}
                          className="hidden"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-700 mb-4">
                  <h2 className="font-bold mb-3">
                    {selectedLanguage === 'ar' ? 'حدد مناطق العلاج:' : 'Select Areas for Treatment:'}
                  </h2>
                  <div className="min-h-[400px]">
                    <BodySelection
                      selectedParts={formData.selectedBodyParts}
                      setSelectedParts={handleBodyPartSelection}
                      language={selectedLanguage}
                    />
                  </div>
                </div>

                <div className="bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-700 mb-4">
                  <h2 className="font-bold mb-3">
                    {selectedLanguage === 'ar' ? 'لعلاج الوجه فقط:' : 'For Facial Treatment Only:'}
                  </h2>
                  <p className="font-semibold mb-4">
                    {selectedLanguage === 'ar' ? 
                      'ما هو نوع بشرتك؟' : 
                      'What is your skin type?'}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {formOptions.skinTypeOptions.map(option => (
                      <label key={option} className={radioClass(formData.skinType === option)}>
                        <input
                          type="radio"
                          name="skinType"
                          value={option}
                          onChange={handleChange}
                          checked={formData.skinType === option}
                          className="hidden"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-700 mb-4">
                  <p className="font-semibold mb-4">{translations.labels.otherConcerns}</p>
                  <textarea
                    name="otherConcerns"
                    rows={3}
                    className="w-full bg-zinc-800 border border-zinc-700 mt-1 p-2 rounded text-white"
                    onChange={handleChange}
                  />
                </div>

                <div className="text-lg border border-zinc-700 p-3 mb-4 rounded bg-zinc-800">
                  <strong className="text-red-500">
                    {selectedLanguage === 'ar' ? 'ملاحظة:' : 'NOTE:'}
                  </strong> 
                  {selectedLanguage === 'ar' ? 
                    ' السلوك الجنسي محظور بموجب القانون ولن يتم التسامح معه من قبل الإدارة والسلطات.' : 
                    ' Sexual behavior is prohibited by law and will not be tolerated by the management and the Authority.'}
                </div>

                <div className="text-sm border border-zinc-700 p-3 rounded bg-zinc-800 mb-4">
                  {selectedLanguage === 'ar' ? 
                    'لقد قرأت الموقع أدناه وفهمت المحتويات والشروط المذكورة أعلاه. أوافق على أن المنتجع الصحي غير مسؤول عن أي حالة ناتجة عن العلاج.' : 
                    'The undersigned has read and understood the above contents and terms. The undersigned represent that the information provided is true and accurate and understands the importance of alerting the staff to any medical conditions or concern. The spa reserves the right to refuse treatment. I agree that either the spa, not its employee or management shall be liable or responsible for aggravation of any existing conditions as a result of my treatment. I am voluntarily undertaking this treatment.'}
                </div>

                <label className="block mb-4">
                  <input
                    type="checkbox"
                    name="promotional"
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {translations.labels.promotional}
                </label>

                
{isModalOpen && (
  <SuccessModal onClose={() => {
    setIsModalOpen(false);
    navigate('/');
  }} language={selectedLanguage} />
)}



                <div className="mt-4">
                  <label className="block font-semibold mb-2">{translations.labels.signature}</label>
                  <div className="border border-zinc-700 rounded bg-white">
                  <SignaturePad
                      ref={sigPadRef}
                      options={{
                        minWidth: 1,
                        maxWidth: 2.5,
                        penColor: "black",
                        backgroundColor: "white"
                      }}
                      canvasProps={{
                        width: 500,
                        height: 200,
                        className: "signatureCanvas w-full"
                      }}
                    />

                  </div>
                  <div className="flex justify-between mt-2">
                    <button
                      type="button"
                      onClick={handleClearSignature}
                      className="bg-zinc-700 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      {selectedLanguage === 'ar' ? 'مسح' : 'Clear'}
                    </button>
                  </div>
               </div>

               

                <button
                  type="submit"
                  className="mt-6 w-full bg-white text-black py-2 rounded-md font-medium transition"
                >
                  {selectedLanguage === 'ar' ? 'إرسال الاستشارة' : 'Submit Consultation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;