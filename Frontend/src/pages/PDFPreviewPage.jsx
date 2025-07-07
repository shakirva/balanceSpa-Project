import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import bodyFront from '../assets/body-forward.png';
import bodyBack from '../assets/body-backward.png';

const PDFPreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;

  useEffect(() => {
    if (!formData) {
      navigate('/booking-form');
    }
  }, [formData, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate('/booking-form');
  };

  if (!formData) {
    return null;
  }

  // Body parts data for visualization
  const BODY_PARTS = {
    front: [
      { id: 'head_front', x: 50, y: 12, label: 'Head' },
      { id: 'neck_front', x: 50, y: 20, label: 'Neck' },
      { id: 'left_shoulder', x: 35, y: 25, label: 'Left Shoulder' },
      { id: 'right_shoulder', x: 63, y: 25, label: 'Right Shoulder' },
      { id: 'chest', x: 50, y: 30, label: 'Chest' },
      { id: 'abdomen', x: 50, y: 45, label: 'Abdomen' },
      { id: 'left_arm_front', x: 30, y: 35, label: 'Left Arm' },
      { id: 'right_arm_front', x: 70, y: 35, label: 'Right Arm' },
      { id: 'left_wrist', x: 30, y: 50, label: 'Left Wrist' },
      { id: 'right_wrist', x: 70, y: 50, label: 'Right Wrist' },
      { id: 'left_leg_front', x: 40, y: 62, label: 'Left Thigh' },
      { id: 'right_leg_front', x: 60, y: 62, label: 'Right Thigh' },
      { id: 'left_foot', x: 40, y: 78, label: 'Left Leg' },
      { id: 'right_foot', x: 60, y: 78, label: 'Right Leg' }
    ],
    back: [
      { id: 'head_back', x: 50, y: 12, label: 'Head' },
      { id: 'neck_back', x: 50, y: 20, label: 'Neck' },
      { id: 'left_back_shoulders', x: 35, y: 25, label: 'Left Back Shoulders' },
      { id: 'right_back_shoulders', x: 63, y: 25, label: 'Right Back Shoulders' },
      { id: 'left_back_wrist', x: 30, y: 50, label: 'Left Back Wrist' },
      { id: 'right_back_wrist', x: 70, y: 50, label: 'Right Back Wrist' },
      { id: 'upper_back', x: 50, y: 30, label: 'Upper Back' },
      { id: 'lower_back', x: 50, y: 45, label: 'Lower Back' },
      { id: 'left_back_thigh', x: 40, y: 60, label: 'Left Back Thigh' },
      { id: 'Right_back_thigh', x: 60, y: 60, label: 'Right Back Thigh' },
      { id: 'left_arm_back', x: 30, y: 35, label: 'Left Back Arm' },
      { id: 'right_arm_back', x: 70, y: 35, label: 'Right Back Arm' },
      { id: 'left_leg_back', x: 40, y: 75, label: 'Left Back Leg' },
      { id: 'right_leg_back', x: 60, y: 75, label: 'Right Back Leg' }
    ]
  };

  // Get body part labels for selected parts
  const getSelectedPartLabels = () => {
    if (!formData.selectedBodyParts || formData.selectedBodyParts.length === 0) {
      return [];
    }
    
    const allParts = [...BODY_PARTS.front, ...BODY_PARTS.back];
    return formData.selectedBodyParts.map(partId => {
      const part = allParts.find(p => p.id === partId);
      return part?.label || partId;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Print Header - Only visible on screen */}
      <div className="print:hidden bg-white shadow-sm border-b p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={handleBack}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            ← Back to Form
          </button>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="bg-black text-white px-6 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print PDF
            </button>
          </div>
        </div>
      </div>

      {/* PDF Content - Optimized for single page */}
      <div
        className="max-w-7xl mx-auto bg-white shadow-lg my-8 print:shadow-none print:my-0 print:max-w-none print:w-full"
        style={{
          fontFamily: 'Arial, sans-serif',
          height: '297mm',
          width: '210mm',
          maxHeight: '297mm',
          maxWidth: '210mm',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        <div className="p-6 print:p-4 w-full">
          {/* Header */}
          <div className="text-center mb-4 print:mb-3 border-b pb-3 print:pb-2">
            <h1 className="text-2xl print:text-xl font-bold text-gray-800 mb-1">Balance SPA - Booking Form</h1>
            <p className="text-sm print:text-xs text-gray-600">Consultation & Appointment Details</p>
            
          
          </div>

          {/* Two Column Layout - Robust for print */}
          <div className="flex flex-row w-full print:w-full gap-4 print:gap-2">
            {/* Left Column - Personal Details */}
            <div className="space-y-3 print:space-y-2 w-1/2 print:w-1/2" style={{ breakInside: 'avoid' }}>
              {/* Customer Details */}
              <div className=" p-3 print:p-2 rounded print:rounded-none">
                <h2 className="text-md print:text-base font-bold text-gray-800 mb-2 print:mb-1 border-b pb-1">Customer</h2>
                <div className="flex flex-row text-sm print:text-xs mb-1">
                  <div className="font-bold w-32 text-left pr-2">Name:</div>
                  <div className="flex-1 text-left">{formData.name || 'N/A'}</div>
                </div>
                <div className="flex flex-row text-sm print:text-xs mb-1">
                  <div className="font-bold w-32 text-left pr-2">Phone:</div>
                  <div className="flex-1 text-left">{formData.mobile || 'N/A'}</div>
                </div>
                <div className="flex flex-row text-sm print:text-xs mb-1">
                  <div className="font-bold w-32 text-left pr-2">Nationality:</div>
                  <div className="flex-1 text-left">{formData.nationality || 'N/A'}</div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className=" p-3 print:p-2 rounded print:rounded-none">
                <h2 className="text-md print:text-base font-bold text-gray-800 mb-2 print:mb-1 border-b pb-1">Appointment Details</h2>
                <div className="flex flex-row text-sm print:text-xs mb-1">
                  <div className="font-bold w-32 text-left pr-2">Date:</div>
                  <div className="flex-1 text-left">{formData.date || 'N/A'}</div>
                </div>
                <div className="flex flex-row text-sm print:text-xs mb-1">
                  <div className="font-bold w-32 text-left pr-2">Time:</div>
                  <div className="flex-1 text-left">{formData.time || 'N/A'}</div>
                </div>
                <div className="flex flex-row text-sm print:text-xs mb-1">
                  <div className="font-bold w-32 text-left pr-2">Service:</div>
                  <div className="flex-1 text-left">{formData.selectedService || 'N/A'}</div>
                </div>
                <div className="flex flex-row text-sm print:text-xs mb-1">
                  <div className="font-bold w-32 text-left pr-2">Treatment:</div>
                  <div className="flex-1 text-left">{formData.selectedTreatment || 'N/A'}</div>
                </div>
                <div className="flex flex-row text-sm print:text-xs mb-1">
                  <div className="font-bold w-32 text-left pr-2">Duration:</div>
                  <div className="flex-1 text-left">{formData.selectedDuration || 'N/A'}</div>
                </div>
                <div className="flex flex-row text-sm print:text-xs mb-1">
                  <div className="font-bold w-32 text-left pr-2">Price:</div>
                  <div className="flex-1 text-left">{formData.selectedPrice ? `${formData.selectedPrice} Qr` : 'N/A'}</div>
                </div>
              </div>

              {/* How did you know about us? */}
              <div className=" p-3 print:p-2 rounded print:rounded-none">
                <h2 className="text-md print:text-base font-bold text-gray-800 mb-2 print:mb-1 border-b pb-1">How did you know about us?</h2>
                <div className="text-sm print:text-xs">
                  {formData.knowFrom && formData.knowFrom.length > 0 ? formData.knowFrom.join(', ') : 'N/A'}
                </div>
              </div>

              {/* Social Media */}
              <div className=" p-3 print:p-2 rounded print:rounded-none">
                <h2 className="text-md print:text-base font-bold text-gray-800 mb-2 print:mb-1 border-b pb-1">Social Media</h2>
                <div className="text-sm print:text-xs">
                  {formData.socialMedia && formData.socialMedia.length > 0 ? formData.socialMedia.join(', ') : 'N/A'}
                </div>
              </div>

              {/* Health Information */}
              <div className=" p-3 print:p-2 rounded print:rounded-none">
                <h2 className="text-md print:text-base font-bold text-gray-800 mb-2 print:mb-1 border-b pb-1">Health Information</h2>
                <div className="flex flex-row text-sm print:text-xs mb-1">
                  <div className="font-bold w-32 text-left pr-2">Health Conditions:</div>
                  <div className="flex-1 text-left">{formData.healthConditions && formData.healthConditions.length > 0 ? formData.healthConditions.join(', ') : 'N/A'}</div>
                </div>
                <div className="flex flex-row text-sm print:text-xs mb-1">
                  <div className="font-bold w-32 text-left pr-2">Implants:</div>
                  <div className="flex-1 text-left">{formData.implants || 'N/A'}
                    {formData.implants && formData.implants.toLowerCase() === 'yes' && (
                      <span> ({formData.implantDetails || 'No details provided'})</span>
                    )}</div>
                </div>
                <div className="flex flex-row text-sm print:text-xs mb-1">
                  <div className="font-bold w-32 text-left pr-2">Massage Pressure:</div>
                  <div className="flex-1 text-left">{formData.pressure || 'N/A'}</div>
                </div>
              </div>


           
            </div>

            {/* Right Column - Body Selection Visualization */}
            <div className="space-y-3 print:space-y-2 w-1/2 print:w-1/2" style={{ breakInside: 'avoid' }}>
              

              {/* Body Visualization - Compact */}
              <div className=" p-3 print:p-2 rounded print:rounded-none">
                <h2 className="text-md print:text-base font-bold text-gray-800 mb-2 print:mb-1 border-b pb-1">Body Areas</h2>
                
                <div className="grid grid-cols-2 gap-2">
                  {/* Front View */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1 text-center text-sm">Front View</h3>
                    <div className="relative mx-auto bg-white rounded overflow-hidden w-full max-w-[180px] print:max-w-[180px] h-auto" style={{ aspectRatio: '5/7' }}>
                      <img 
                        src={bodyFront} 
                        alt="Body Front" 
                        className="w-full h-auto object-contain" 
                      />
                      {BODY_PARTS.front.map(({ id, x, y, label }) => (
                        <div
                          key={id}
                          className={`absolute w-2 h-2 rounded-full border transition-all
                            ${formData.selectedBodyParts?.includes(id) 
                              ? 'bg-green-500 border-white shadow scale-125' 
                              : 'bg-gray-400/50 border-gray-600'}`}
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                          title={label}
                        >
                          {formData.selectedBodyParts?.includes(id) && (
                            <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Back View */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1 text-center text-sm">Back View</h3>
                    <div className="relative mx-auto bg-white rounded overflow-hidden w-full max-w-[180px] print:max-w-[180px] h-auto" style={{ aspectRatio: '5/7' }}>
                      <img 
                        src={bodyBack} 
                        alt="Body Back" 
                        className="w-full h-auto object-contain" 
                      />
                      {BODY_PARTS.back.map(({ id, x, y, label }) => (
                        <div
                          key={id}
                          className={`absolute w-2 h-2 rounded-full border transition-all
                            ${formData.selectedBodyParts?.includes(id) 
                              ? 'bg-green-500 border-white shadow scale-125' 
                              : 'bg-gray-400/50 border-gray-600'}`}
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                          title={label}
                        >
                          {formData.selectedBodyParts?.includes(id) && (
                            <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Selected Body Parts List */}
              <div className=" p-3 print:p-2 rounded print:rounded-none">
                <h2 className="text-md print:text-base font-bold text-gray-800 mb-2 print:mb-1 border-b pb-1">Selected Body Parts</h2>
                <div className="bg-white p-2 rounded">
                  {getSelectedPartLabels().length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {getSelectedPartLabels().map((label, index) => (
                        <span 
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm">No body parts selected</p>
                  )}
                </div>
              </div>

                 {/* Skin Type */}
                 <div className="p-3 print:p-2 rounded print:rounded-none">
                    <h2 className="text-md print:text-base font-bold text-gray-800 mb-2 print:mb-1 border-b pb-1">Skin Type</h2>
                    <div className="text-sm print:text-xs">
                      {formData.skinType || 'N/A'}
                    </div>
                  </div>

                   {/* Other Concerns */}
              <div className=" p-3 print:p-2 rounded print:rounded-none">
                <h2 className="text-md print:text-base font-bold text-gray-800 mb-2 print:mb-1 border-b pb-1">Other Concerns</h2>
                <div className="text-sm print:text-xs">
                  {formData.otherConcerns || 'N/A'}
                </div>
              </div>


                     {/* Notes */}
              <div className="p-3 print:p-2 rounded print:rounded-none">
                <h2 className="text-md print:text-base font-bold text-gray-800 mb-2 print:mb-1 border-b pb-1">Notes</h2>
                <div className="text-sm print:text-xs">
                  {formData.notes || formData.otherConcerns || 'N/A'}
                </div>
              </div>

              
              {/* Signature */}
              <div className=" p-3 print:p-2 rounded print:rounded-none">
                <h2 className="text-md print:text-base font-bold text-gray-800 mb-2 print:mb-1 border-b pb-1">Customer Signature</h2>
                {formData.signature ? (
                  <div className="border border-gray-300 p-2 rounded bg-white">
                    <img 
                      src={formData.signature} 
                      alt="Customer Signature" 
                      style={{ maxWidth: '200px', maxHeight: '80px' }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm">No signature provided</p>
                )}
              </div>


              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t text-center text-gray-600 text-xs">
            <p>This form was generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
            <p className="mt-1">Balance SPA - Consultation Form</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewPage; 