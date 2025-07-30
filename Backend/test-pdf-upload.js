import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

// Test script to verify PDF upload functionality
async function testPDFUpload() {
  try {
    console.log('🧪 Testing PDF upload functionality...');

    // Create a simple test PDF content (this would normally be a real PDF)
    const testPDFContent = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Test PDF) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000206 00000 n\ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n298\n%%EOF');

    // Create FormData
    const form = new FormData();
    
    // Add booking data
    form.append('date', '2025-07-20');
    form.append('name', 'Test Customer');
    form.append('time', '14:30');
    form.append('nationality', 'Test Nation');
    form.append('mobile', '+123456789');
    form.append('selectedService', 'Massage');
    form.append('selectedTreatment', 'Swedish Massage');
    form.append('selectedDuration', '60 min');
    form.append('selectedPrice', '220');
    form.append('signature', 'data:image/png;base64,test');
    
    // Add PDF file
    form.append('pdf', testPDFContent, {
      filename: 'test-consultation.pdf',
      contentType: 'application/pdf'
    });

    console.log('📤 Sending test booking with PDF...');

    // Send to backend
    const response = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      body: form,
      headers: {
        ...form.getHeaders()
      }
    });

    const result = await response.text();
    
    if (response.ok) {
      console.log('✅ Test successful!');
      console.log('📋 Response:', result);
      
      // Test fetching bookings
      console.log('\n🔍 Testing fetch bookings...');
      const fetchResponse = await fetch('http://localhost:5000/api/bookings');
      const bookings = await fetchResponse.json();
      
      console.log(`📊 Found ${bookings.length} bookings`);
      const latestBooking = bookings[0];
      if (latestBooking && latestBooking.pdfPath) {
        console.log(`📄 Latest booking has PDF: ${latestBooking.pdfPath}`);
        console.log(`🔗 PDF URL: http://localhost:5000${latestBooking.pdfPath}`);
      }
    } else {
      console.log('❌ Test failed!');
      console.log('📋 Error:', result);
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
console.log('🚀 Starting PDF upload test...');
testPDFUpload();
