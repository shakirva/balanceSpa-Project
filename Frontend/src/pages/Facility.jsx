import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MATTERPORT_URL = "https://my.matterport.com/show/?m=N7vsiehnUVx";

const Facility = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const lang = params.get("lang") || "en";
  const services = params.get("services");
  const treatments = params.get("treatments");
  const durations = params.get("durations");
  const products = params.get("products");

  const goToFood = () => {
    const query = new URLSearchParams({ lang });
    if (services) query.set("services", services);
    if (treatments) query.set("treatments", treatments);
    if (durations) query.set("durations", durations);
    if (products) query.set("products", products);
    navigate(`/food-beverages?${query.toString()}`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="py-4 px-6 border-b border-zinc-800 relative">
        <h1 className="text-2xl font-bold text-center mb-2">
          {lang === "ar" ? "المرفق" : "Facility"}
        </h1>
        <p className="text-sm text-gray-400 text-center">
          {lang === "ar" ? "جولة افتراضية" : "Take a virtual tour"}
        </p>

        {/* Back Button */}
        <div className={`absolute top-8 ${lang === "ar" ? "right-8" : "left-8"}`}>
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-blue-400 flex gap-1 items-center"
          >
            <svg
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className={lang === "ar" ? "rotate-180" : ""}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>{lang === "ar" ? "الرجوع" : "Back"}</span>
          </button>
        </div>
      </div>

      {/* Virtual Tour */}
      <div className="flex-1 flex flex-col items-center p-6">
        <div className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-lg">
          <iframe
            src={MATTERPORT_URL}
            title="Matterport Virtual Tour"
            className="w-full h-full border-0"
            allowFullScreen
            allow="xr-spatial-tracking"
          />
        </div>

        <div className="mt-10">
          <button
            onClick={goToFood}
            className="bg-white text-black px-8 py-3 rounded-full shadow hover:bg-gray-100 text-lg font-semibold flex items-center gap-2 border border-gray-300"
          >
            {lang === "ar" ? "التالي" : "Continue"}
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className={lang === "ar" ? "rotate-180" : ""}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Facility;
