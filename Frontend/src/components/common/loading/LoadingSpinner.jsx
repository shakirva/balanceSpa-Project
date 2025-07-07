import React from "react";
import { ScaleLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50">
      <ScaleLoader color="#121212" />
    </div>
  );
};

export default LoadingSpinner;
