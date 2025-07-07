import React from 'react';
import { FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaNotesMedical, FaSignature } from 'react-icons/fa';

const BookingFormPDF = ({ appointmentData }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="pdf-container" style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: 'white',
      color: 'black'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        borderBottom: '2px solid #333', 
        paddingBottom: '20px',
        marginBottom: '30px'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          color: '#333', 
          margin: '0 0 10px 0',
          fontWeight: 'bold'
        }}>
          Balance SPA - Booking Form
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#666', 
          margin: '0'
        }}>
          Customer Appointment Details
        </p>
      </div>

      {/* Appointment Information */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          color: '#333', 
          borderBottom: '1px solid #ddd',
          paddingBottom: '10px',
          marginBottom: '20px'
        }}>
          Appointment Details
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Appointment Date:</strong> {formatDate(appointmentData.date)}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Appointment Time:</strong> {formatTime(appointmentData.time)}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Service:</strong> {appointmentData.service}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Duration:</strong> {appointmentData.duration}
            </p>
          </div>
          <div>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Therapist:</strong> {appointmentData.therapist}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Price:</strong> ${appointmentData.price}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Status:</strong> 
              <span style={{ 
                padding: '2px 8px', 
                borderRadius: '12px', 
                fontSize: '12px',
                fontWeight: 'bold',
                backgroundColor: appointmentData.status === 'confirmed' ? '#d4edda' : 
                                appointmentData.status === 'pending' ? '#fff3cd' :
                                appointmentData.status === 'completed' ? '#cce5ff' : '#f8d7da',
                color: appointmentData.status === 'confirmed' ? '#155724' :
                       appointmentData.status === 'pending' ? '#856404' :
                       appointmentData.status === 'completed' ? '#004085' : '#721c24'
              }}>
                {appointmentData.status.charAt(0).toUpperCase() + appointmentData.status.slice(1)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          color: '#333', 
          borderBottom: '1px solid #ddd',
          paddingBottom: '10px',
          marginBottom: '20px'
        }}>
          Customer Information
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Full Name:</strong> {appointmentData.customerName}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Phone Number:</strong> {appointmentData.phone}
            </p>
          </div>
          <div>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Email Address:</strong> {appointmentData.email}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Booking Date:</strong> {formatDate(appointmentData.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      {appointmentData.notes && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ 
            fontSize: '20px', 
            color: '#333', 
            borderBottom: '1px solid #ddd',
            paddingBottom: '10px',
            marginBottom: '20px'
          }}>
            Special Notes & Requirements
          </h2>
          
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '5px',
            border: '1px solid #dee2e6'
          }}>
            <p style={{ 
              margin: '0', 
              fontSize: '14px', 
              lineHeight: '1.6',
              color: '#333'
            }}>
              {appointmentData.notes}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ 
        marginTop: '40px', 
        paddingTop: '20px', 
        borderTop: '2px solid #333',
        textAlign: 'center'
      }}>
        <p style={{ 
          fontSize: '12px', 
          color: '#666', 
          margin: '5px 0'
        }}>
          This document was generated on {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        <p style={{ 
          fontSize: '12px', 
          color: '#666', 
          margin: '5px 0'
        }}>
          Balance SPA - Professional Spa Services
        </p>
      </div>
    </div>
  );
};

export default BookingFormPDF; 