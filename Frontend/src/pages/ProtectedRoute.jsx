// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// Check if admin is authenticated (e.g. using localStorage token)
const isAuthenticated = () => {
  const token = localStorage.getItem("adminToken");
  return !!token;
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
