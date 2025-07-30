import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generateAppointmentPDF = async (formData) => {
  const renderRow = (label, value) => `
    <tr>
      <td class="label">${label}</td>
      <td class="value">${value || "N/A"}</td>
    </tr>
  `;

  const formatArray = (arr) =>
    Array.isArray(arr) && arr.length > 0 ? arr.join(", ") : "N/A";

  const signatureImage = formData.signature
    ? `<img src="${formData.signature}" style="width:150px;height:60px;border-radius:6px;border:1px solid #ccc;" />`
    : "N/A";

  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "794px";
  container.style.minHeight = "1123px";
  container.style.padding = "24px";
  container.style.background = "#f8f9fb";
  container.style.fontFamily = "Segoe UI, sans-serif";
  container.style.fontSize = "13px";
  container.style.color = "#333";
  container.style.borderRadius = "10px";

  document.body.appendChild(container);

  container.innerHTML = `
    <style>
      h2 {
        text-align: center;
        color: #2c3e50;
        margin-bottom: 24px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      }
      thead th {
        background: #4a90e2;
        color: #fff;
        text-align: left;
        padding: 10px;
        font-size: 14px;
      }
      .label {
        background: #f0f4f8;
        padding: 10px;
        font-weight: 600;
        width: 35%;
        border-bottom: 1px solid #e0e0e0;
      }
      .value {
        padding: 10px;
        border-bottom: 1px solid #e0e0e0;
      }
      td img {
        margin-top: 10px;
      }
    </style>

    <h2>📝 Customer Consultation Summary</h2>

    ${generateSection("Basic Information", [
      renderRow("Name", formData.name),
      renderRow("Mobile", formData.mobile),
      renderRow("Nationality", formData.nationality),
      renderRow("Date", formData.date),
      renderRow("Start Time", formData.time),
    ])}

    ${generateSection("Service Details", [
      renderRow("Service", formData.selectedService),
      renderRow("Treatment", formData.selectedTreatment),
      renderRow("Duration", formData.selectedDuration),
      renderRow("Price", `${formData.selectedPrice} Qr`),
    ])}

    ${generateSection("Referral Info", [
      renderRow("How did you know about us?", formatArray(formData.knowFrom)),
      renderRow("Social Media", formatArray(formData.socialMedia)),
    ])}

    ${generateSection("Medical History", [
      renderRow("Health Conditions", formatArray(formData.healthConditions)),
      renderRow("Do you have implants?", formData.implants || "N/A"),
      formData.implants === "yes"
        ? renderRow("Implant Details", formData.implantDetails)
        : "",
    ])}

    ${generateSection("Massage & Facial", [
      renderRow("Massage Pressure", formData.pressure),
      renderRow("Skin Type", formData.skinType),
      renderRow("Other Concerns", formData.otherConcerns),
    ])}

    ${generateSection("Body Area Selections", [
      `<tr><td class="value" colspan="2">${formatArray(formData.selectedBodyParts)}</td></tr>`,
    ])}

    ${generateSection("Consent & Signature", [
      `<tr><td class="value" colspan="2">Wants Promotional Material: <strong>${
        formData.promotional ? "Yes" : "No"
      }</strong></td></tr>`,
      `<tr><td class="value" colspan="2">Signature:<br/>${signatureImage}</td></tr>`,
    ])}
  `;

  function generateSection(title, rows) {
    return `
      <table>
        <thead><tr><th colspan="2">${title}</th></tr></thead>
        <tbody>${rows.join("")}</tbody>
      </table>
    `;
  }

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Scale canvas image to fit exactly one page
    const ratio = Math.min(
      pageWidth / canvas.width,
      pageHeight / canvas.height
    );

    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

    const blob = pdf.output("blob");
    const file = new File([blob], `consultation_${Date.now()}.pdf`, {
      type: "application/pdf",
    });

    return file;
  } finally {
    document.body.removeChild(container);
  }
};
