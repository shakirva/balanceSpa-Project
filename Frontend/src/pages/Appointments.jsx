// 📁 frontend/pages/Appointments.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination } from 'antd';
import {
  FaPhone, FaSearch, FaRegEdit, FaRegFilePdf
} from 'react-icons/fa';
import { FaRegTrashCan } from "react-icons/fa6";
import { generateAppointmentPDF } from '@utils/pdfGenerator';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [generatingPDF, setGeneratingPDF] = useState(null);

  const limit = 10;

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings');
      setAppointments(res.data);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  };

  const filteredAppointments = appointments.filter(appt =>
    appt.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appt.mobile?.includes(searchTerm) ||
    appt.selectedService?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedAppointments = filteredAppointments.slice(
    (page - 1) * limit,
    page * limit
  );

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const formatTime = (timeStr) => {
    const [hour, min] = timeStr.split(':');
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:${min} ${ampm}`;
  };

  const handleGeneratePDF = async (appointment) => {
    try {
      setGeneratingPDF(appointment._id);
      await generateAppointmentPDF(appointment);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF.');
    } finally {
      setGeneratingPDF(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Appointments</h2>

      {/* Search Bar */}
      <div className="mb-4 flex gap-2 items-center">
        <FaSearch />
        <input
          type="text"
          placeholder="Search by name, phone, or service..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Appointments Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Customer</th>
              <th className="p-3 border">Service</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Time</th>
              <th className="p-3 border">Duration</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAppointments.map((appointment) => (
              <tr key={appointment._id} className="hover:bg-gray-50">
                <td className="p-3 border">
                  {appointment.name}
                  <br />
                  <span className="text-sm text-gray-500">
                    <FaPhone className="inline mr-1" /> {appointment.mobile}
                  </span>
                </td>
                <td className="p-3 border">{appointment.selectedService}</td>
                <td className="p-3 border">{formatDate(appointment.date)}</td>
                <td className="p-3 border">{formatTime(appointment.time)}</td>
                <td className="p-3 border">{appointment.selectedDuration}</td>
                <td className="p-3 border">{appointment.selectedPrice} Qr</td>
                <td className="p-3 border">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGeneratePDF(appointment)}
                      disabled={generatingPDF === appointment._id}
                      title="Generate PDF"
                    >
                      <FaRegFilePdf />
                    </button>
                    <button title="Edit (future)">
                      <FaRegEdit />
                    </button>
                    <button title="Delete (future)">
                      <FaRegTrashCan />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        className="mt-4"
        current={page}
        pageSize={limit}
        total={filteredAppointments.length}
        onChange={(page) => setPage(page)}
      />
    </div>
  );
};

export default Appointments;
