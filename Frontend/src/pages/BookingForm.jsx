// 📁 frontend/pages/BookingForm.jsx
import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTranslations } from '../utils/translations';
import BodySelection from '@components/BodySelection';
import SignaturePad from 'react-signature-canvas';
import axios from 'axios';

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sigPadRef = useRef();
  const selectedLanguage = location.state?.language || 'en';
  const translations = getTranslations(selectedLanguage).booking;

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
    selectedBodyParts: [],
    selectedService: '',
    selectedTreatment: '',
    selectedDuration: '',
    selectedPrice: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleCheckbox = (key, value) => {
    setFormData(prev => {
      const current = prev[key];
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value]
      };
    });
  };

  const handleBodyPartSelection = (selectedParts) => {
    setFormData(prev => ({
      ...prev,
      selectedBodyParts: selectedParts
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const signatureDataUrl = sigPadRef.current?.isEmpty()
      ? ''
      : sigPadRef.current.getTrimmedCanvas().toDataURL('image/png');

    const payload = {
      ...formData,
      signature: signatureDataUrl,
      language: selectedLanguage
    };

    try {
      await axios.post('http://localhost:5000/api/bookings', payload);
      alert('Booking submitted successfully!');
      navigate('/thank-you');
    } catch (error) {
      console.error('Booking submission failed:', error);
      alert('Submission failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-zinc-900 text-white max-w-3xl mx-auto rounded-lg shadow-lg">
      {/* Example Inputs */}
      <input type="text" name="name" placeholder="Name" onChange={handleChange} className="block w-full mb-4 p-2 rounded bg-zinc-800 border border-zinc-600" />
      <input type="text" name="mobile" placeholder="Mobile" onChange={handleChange} className="block w-full mb-4 p-2 rounded bg-zinc-800 border border-zinc-600" />
      <input type="date" name="date" onChange={handleChange} className="block w-full mb-4 p-2 rounded bg-zinc-800 border border-zinc-600" />
      <input type="time" name="time" onChange={handleChange} className="block w-full mb-4 p-2 rounded bg-zinc-800 border border-zinc-600" />
      <textarea name="otherConcerns" placeholder="Other Concerns" onChange={handleChange} className="block w-full mb-4 p-2 rounded bg-zinc-800 border border-zinc-600"></textarea>

      {/* Signature Pad */}
      <label className="block mb-2 font-semibold">Signature:</label>
      <div className="bg-white p-2 rounded mb-4">
        <SignaturePad
          ref={sigPadRef}
          canvasProps={{ width: 500, height: 200, className: 'signatureCanvas w-full' }}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-4 w-full bg-white text-black py-2 rounded-md font-medium transition hover:bg-gray-200"
      >
        {selectedLanguage === 'ar' ? 'إرسال الاستشارة' : 'Submit Consultation'}
      </button>
    </form>
  );
};

export default BookingForm;
