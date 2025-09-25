import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from '../assets/logo1.png';
import bodyFrontImg from '../assets/body-forward.png';
import bodyBackImg from '../assets/body-backward.png';

const BODY_IMG_WIDTH = 180;
const BODY_IMG_HEIGHT = 252;

// Dot positions in percentages (matching PDFPreviewPage.jsx)
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

const getSelectedPartLabels = (selectedBodyParts) => {
  const allParts = [...BODY_PARTS.front, ...BODY_PARTS.back];
  return selectedBodyParts.map(partId => {
    const part = allParts.find(p => p.id === partId);
    return part?.label || partId;
  });
};

const renderBodySVG = (side, selectedIds) => {
  const parts = BODY_PARTS[side];
  return `
    <div style="position:relative;width:${BODY_IMG_WIDTH}px;height:${BODY_IMG_HEIGHT}px;display:inline-block;background:#222;border-radius:8px;border:3px solid #111;">
      <img src="${side === 'front' ? bodyFrontImg : bodyBackImg}" width="${BODY_IMG_WIDTH}" height="${BODY_IMG_HEIGHT}" style="display:block;object-fit:contain;filter:contrast(3) grayscale(1) brightness(1);background:#222;" />
      ${parts.map(({ id, x, y }) => {
        const isSelected = selectedIds.includes(id);
        return `
          <div style="
            position:absolute;
            left:${x}%;
            top:${y}%;
            width:18px;
            height:18px;
            border-radius:50%;
            background:${isSelected ? '#fff' : 'rgba(120,120,120,0.15)'};
            border:2px solid #111;
            box-shadow:${isSelected ? '0 0 8px #fff' : 'none'};
            transform:translate(-50%,-50%);
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:12px;
            color:#222;
            font-weight:bold;
          ">
            ${isSelected ? '<span style="display:block;width:14px;height:14px;background:#fff;border-radius:50%;border:2px solid #ef4444;"></span>' : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
};

export const generateAppointmentPDF = async (formData) => {
  const selectedFront = formData.selectedBodyParts?.filter(id => BODY_PARTS.front.some(p => p.id === id)) || [];
  const selectedBack = formData.selectedBodyParts?.filter(id => BODY_PARTS.back.some(p => p.id === id)) || [];

  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "1100px";
  container.style.minHeight = "1600px";
  container.style.background = "#fff";
  container.style.fontFamily = "'Assistant', Arial, sans-serif";
  container.style.fontSize = "16px";
  container.style.color = "#222";
  container.style.borderRadius = "18px";

  document.body.appendChild(container);

  container.innerHTML = `
    <style>
      .pdf-main { display: flex; gap: 32px; padding: 48px 48px 12px 48px; background: #fff; border-radius: 18px; min-height: 1273px; }
      .col { flex: 1; background: #fff; border-radius: 16px; padding: 32px; margin-bottom: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.05);}
      .section-title { font-size: 18px; font-weight: bold; margin-bottom: 18px; color: #222; }
      .label { font-weight: 600; margin-bottom: 4px; color: #444; }
      .value { margin-bottom: 12px; color: #222; }
      .line { height: 1px; background: #eee; margin: 16px 0; }
      .body-images { display: flex; gap: 32px; justify-content: center; align-items: flex-start; margin-bottom: 8px; }
      .selected-parts-list { color:#222; padding:8px 0 0 0; border-radius:8px; margin-bottom:8px; font-size:14px; }
      .notes { margin-top:0; color:#b91c1c; font-weight:bold; text-align:center; }
      .terms { margin-top:0; color:#444; font-size:14px; text-align:center; line-height:1.7; }
    </style>
    <div class="pdf-main">
      <div class="col">
        <div class="section-title">Personal Details</div>
        <div class="label">Name</div><div class="value">${formData.name || 'N/A'}</div>
        <div class="label">Phone</div><div class="value">${formData.mobile || 'N/A'}</div>
        <div class="label">Nationality</div><div class="value">${formData.nationality || 'N/A'}</div>
        <div class="label">Service</div><div class="value">${formData.selectedService || 'N/A'}</div>
        <div class="label">Treatment</div><div class="value">${formData.selectedTreatment || 'N/A'}</div>
        <div class="line"></div>
        <div class="section-title">How did you know about us?</div>
        <div class="label">Source</div><div class="value">${Array.isArray(formData.knowFrom) ? formData.knowFrom.join(', ') : 'N/A'}</div>
        <div class="label">Social Media</div><div class="value">${Array.isArray(formData.socialMedia) ? formData.socialMedia.join(', ') : 'N/A'}</div>
        <div class="line"></div>
        <div class="section-title">Customer Health Condition</div>
        <div class="label">Health Conditions</div><div class="value">${Array.isArray(formData.healthConditions) ? formData.healthConditions.join(', ') : 'N/A'}</div>
        <div class="label">Implants</div><div class="value">${formData.implants || 'N/A'}</div>
        ${formData.implants && formData.implants.toLowerCase() === 'yes' ? `<div class="label">Implant Details</div><div class="value">${formData.implantDetails || 'No details provided'}</div>` : ""}
        <div class="line"></div>
        <div class="section-title">For Massage Only</div>
        <div class="label">Massage Pressure</div><div class="value">${formData.pressure || 'N/A'}</div>
      </div>
      <div class="col">
        <div class="section-title">Selected Body Parts</div>
        <div class="body-images">
          ${renderBodySVG('front', selectedFront)}
          ${renderBodySVG('back', selectedBack)}
        </div>
        <div class="selected-parts-list">
          ${getSelectedPartLabels(formData.selectedBodyParts).map(label => `<span style="color:#1e40af;padding:4px 10px;border-radius:12px;margin-right:4px;display:inline-block;">${label}</span>`).join('')}
        </div>
        <div class="line"></div>
        <div class="section-title">Skin Type</div>
        <div class="label">Skin Type</div><div class="value">${formData.skinType || 'N/A'}</div>
        <div class="label">Other Concerns</div><div class="value">${formData.otherConcerns || 'N/A'}</div>
        <div class="line"></div>
        <div class="section-title">Customer Signature</div>
        <div class="value">
          ${formData.signature ? `<img src="${formData.signature}" style="width:150px;height:60px;border-radius:6px;border:1px solid #ccc;object-fit:contain;" />` : "No signature provided"}
        </div>
        <div style="margin-top:32px; text-align:right;">
          <div class="notes" style="color:#b91c1c; font-weight:bold; text-align:right; font-size:15px; margin-bottom:8px;">Notes: Sexual behavior is prohibited by law and will not be tolerated by the management and the Authority.</div>
          <div class="terms" style="color:#444; font-size:14px; text-align:right; line-height:1.7; max-width:600px; margin-left:auto;">The undersigned has read and understood the above contents and terms. The undersigned represent that the information provided is true and accurate and understands the importance of alerting the staff to any medical conditions or concern. The spa reserves the right to refuse treatment. I agree that either the spa, not its employee or management shall be liable or responsible for aggravation of any existing conditions as a result of my treatment. I am voluntarily undertaking this treatment.</div>
        </div>
      </div>
    </div>
  `;

  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    logging: false
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [1100, 1600]
  });

  pdf.addImage(imgData, "PNG", 0, 0, 1100, 1600);
  document.body.removeChild(container);

  return pdf.output("blob");
};
