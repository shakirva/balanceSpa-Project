import React, { createContext, useState } from "react";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  const [selectedFood, setSelectedFood] = useState([]);

  return (
    <BookingContext.Provider value={{
      selectedServices, setSelectedServices,
      selectedTreatments, setSelectedTreatments,
      selectedFood, setSelectedFood
    }}>
      {children}
    </BookingContext.Provider>
  );
};
