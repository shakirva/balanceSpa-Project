import { X } from 'lucide-react';
import ImageHotspot from './ImageHotspot';
import bodyFront from '../assets/body-forward.png';
import bodyBack from '../assets/body-backward.png';

// Coordinates for both views with updated labels
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

const BodySelection = ({ selectedParts, setSelectedParts, language = 'en' }) => {
  const removePart = (partId) => {
    setSelectedParts(selectedParts.filter(id => id !== partId));
  };

  // Translation for UI elements
  const translations = {
    frontView: language === 'ar' ? 'الواجهة الأمامية' : 'Front View',
    backView: language === 'ar' ? 'الواجهة الخلفية' : 'Back View',
    selectedAreas: language === 'ar' ? 'المناطق المحددة' : 'Selected Areas',
    clickToSelect: language === 'ar' ? 'انقر على مناطق الجسم لتحديدها' : 'Click on body areas to select',
    areasWillAppear: language === 'ar' ? '(ستظهر المناطق هنا)' : '(Areas will appear here)'
  };

  return (
    <div
      className={`space-y-6 w-full ${language === 'ar' ? 'rtl' : 'ltr'}`}
      style={{ fontFamily: language === 'ar' ? "'Segoe UI', 'Tahoma', 'Arial', 'sans-serif'" : undefined }}
    >
      {/* Body Views */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
        style={{ maxWidth: 900, margin: '0 auto', width: '100%' }}
      >
        {/* Front View */}
        <div className="bg-white/5 p-2 md:p-4 rounded-xl border border-white/10 flex flex-col items-center">
          <h3 className="text-center font-medium mb-2 text-white/80">
            {translations.frontView}
          </h3>
          <div
            className="relative"
            style={{
              width: '100%',
              maxWidth: 320,
              minWidth: 180,
              aspectRatio: '5/7',
              height: 'auto',
              margin: '0 auto',
              direction: language === 'ar' ? 'rtl' : 'ltr',
            }}
          >
            <ImageHotspot
              src={bodyFront}
              hotspots={BODY_PARTS.front}
              selected={selectedParts}
              onChange={setSelectedParts}
              selectedColor="rgba(74, 222, 128, 0.6)"
              selectedPattern="polka"
            />
          </div>
        </div>

        {/* Back View */}
        <div className="bg-white/5 p-2 md:p-4 rounded-xl border border-white/10 flex flex-col items-center">
          <h3 className="text-center font-medium mb-2 text-white/80">
            {translations.backView}
          </h3>
          <div
            className="relative"
            style={{
              width: '100%',
              maxWidth: 320,
              minWidth: 180,
              aspectRatio: '5/7',
              height: 'auto',
              margin: '0 auto',
              direction: language === 'ar' ? 'rtl' : 'ltr',
            }}
          >
            <ImageHotspot
              src={bodyBack}
              hotspots={BODY_PARTS.back}
              selected={selectedParts}
              onChange={setSelectedParts}
              selectedColor="rgba(74, 222, 128, 0.6)"
              selectedPattern="polka"
            />
          </div>
        </div>
      </div>

      {/* Selected Areas */}
      <div className="p-4 rounded-xl border border-white/10 bg-zinc-900/50">
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          {translations.selectedAreas}
          <span className="text-xs ml-auto text-green-400">
            {selectedParts.length} {language === 'ar' ? 'محدد' : 'selected'}
          </span>
        </h4>

        {selectedParts.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {selectedParts.map(partId => {
              const allParts = [...BODY_PARTS.front, ...BODY_PARTS.back];
              const part = allParts.find(p => p.id === partId);
              return (
                <div
                  key={partId}
                  className="bg-green-900/30 text-green-100 px-3 py-2 rounded-lg text-sm flex items-center gap-2 group border border-green-800/50 hover:bg-green-900/50 transition-colors"
                  style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
                >
                  {part?.label || partId}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePart(partId);
                    }}
                    className="opacity-70 hover:opacity-100 transition-opacity text-green-300 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4 text-white/50">
            <p>{translations.clickToSelect}</p>
            <p className="text-xs mt-1">{translations.areasWillAppear}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodySelection;