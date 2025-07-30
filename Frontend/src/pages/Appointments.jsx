import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [editedNotes, setEditedNotes] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [viewNote, setViewNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    const filtered = appointments.filter(appt =>
      appt.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.selectedService?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAppointments(filtered);
    setCurrentPage(1); // Reset to first page on new search
  }, [searchTerm, appointments]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings');
      const data = Array.isArray(res.data) ? res.data : [];
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  };

  const saveNote = async (id) => {
    if (!editedNotes[id]?.trim()) return;
    setIsSaving(true);
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}/note`, {
        doctor_note: editedNotes[id],
      });

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, doctor_note: editedNotes[id] } : appt
        )
      );

      setEditedNotes((prev) => ({ ...prev, [id]: '' }));
    } catch (err) {
      console.error('Failed to update doctor note:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const displayedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>Appointments</h2>

      <input
        type="text"
        placeholder="Search by customer or service"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: '10px',
          marginBottom: '20px',
          width: '100%',
          maxWidth: '400px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
        }}
      />

      <div style={{ overflowX: 'auto' }}>
        <table style={{ minWidth: '100%', backgroundColor: '#fff', borderCollapse: 'collapse', border: '1px solid #d1d5db' }}>
          <thead style={{ backgroundColor: '#f3f4f6' }}>
            <tr>
              <th style={thStyle}>Customer</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Service</th>
              <th style={thStyle}>PDF</th>
              <th style={thStyle}>Doctor Notes</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedAppointments.length > 0 ? (
              displayedAppointments.map((appointment) => {
                const { id, name, date, time, selectedService, pdfPath, doctor_note } = appointment;
                const noteValue = editedNotes[id] ?? doctor_note ?? '';
                const isButtonDisabled = !noteValue.trim() || isSaving;

                return (
                  <tr key={id} style={{ backgroundColor: '#fff' }}>
                    <td style={tdStyle}>{name || 'N/A'}</td>
                    <td style={tdStyle}>{date || 'N/A'}</td>
                    <td style={tdStyle}>{time || 'N/A'}</td>
                    <td style={tdStyle}>{selectedService || 'N/A'}</td>
                    <td style={tdStyle}>
                      {pdfPath ? (
                        <a
                          href={`http://localhost:5000${pdfPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#2563eb', textDecoration: 'underline' }}
                        >
                          View PDF
                        </a>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>N/A</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      {doctor_note && !editedNotes[id] && (
                        <button
                          onClick={() => setViewNote(doctor_note)}
                          style={{
                            backgroundColor: '#4f46e5',
                            color: '#fff',
                            padding: '6px 10px',
                            fontSize: '13px',
                            border: 'none',
                            borderRadius: '5px',
                            marginBottom: '8px',
                            cursor: 'pointer',
                            display: 'block',
                          }}
                        >
                          View Note
                        </button>
                      )}
                      <textarea
                        value={noteValue}
                        onChange={(e) =>
                          setEditedNotes((prev) => ({ ...prev, [id]: e.target.value }))
                        }
                        placeholder="Enter doctor notes..."
                        style={{
                          width: '100%',
                          border: '1px solid #d1d5db',
                          padding: '8px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          resize: 'none',
                        }}
                        rows={2}
                      />
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => saveNote(id)}
                        disabled={isButtonDisabled}
                        style={{
                          backgroundColor: isButtonDisabled ? '#e5e7eb' : '#10b981',
                          color: isButtonDisabled ? '#6b7280' : '#fff',
                          padding: '8px 16px',
                          fontSize: '14px',
                          fontWeight: '600',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                          transition: 'background 0.3s ease',
                        }}
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              style={{
                fontWeight: currentPage === idx + 1 ? 'bold' : 'normal',
              }}
            >
              {idx + 1}
            </button>
          ))}
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}

      {viewNote && (
        <div style={modalBackdrop}>
          <div style={modalBox}>
            <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>Doctor Note</h3>
            <p style={{ whiteSpace: 'pre-wrap', color: '#111827' }}>{viewNote}</p>
            <button
              onClick={() => setViewNote(null)}
              style={{
                marginTop: '16px',
                backgroundColor: '#ef4444',
                color: '#fff',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const thStyle = {
  border: '1px solid #d1d5db',
  padding: '12px',
  textAlign: 'left',
  fontWeight: '600',
  backgroundColor: '#f9fafb',
};

const tdStyle = {
  border: '1px solid #d1d5db',
  padding: '12px',
  verticalAlign: 'top',
};

const modalBackdrop = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalBox = {
  backgroundColor: '#fff',
  padding: '24px',
  borderRadius: '8px',
  maxWidth: '500px',
  width: '90%',
  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
};

export default Appointments;

