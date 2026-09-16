import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { getMediaUrl } from "../utils/media";

// Inline placeholder (no network dependency) — /default-treatment.jpg referenced
// elsewhere in this app doesn't actually exist in Frontend/public.
const NO_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%2327272a'/%3E%3Ccircle cx='150' cy='110' r='24' fill='%233f3f46'/%3E%3Cpath d='M120 210l55-65 42 48 36-42 60 72z' fill='%233f3f46'/%3E%3C/svg%3E";

const Product = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const lang = params.get("lang") || "en";
  const servicesParam = params.get("services");
  const treatments = params.get("treatments");
  const durations = params.get("durations");
  const firstSelectedServiceId = servicesParam ? servicesParam.split(",")[0]?.trim() : null;

  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get("/api/categories"),
          axios.get("/api/products"),
        ]);
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setAllProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Show every service as a tab, regardless of what the customer selected earlier
  const tabCategories = categories;

  useEffect(() => {
    if (!activeTab && tabCategories.length > 0) {
      const preselected = tabCategories.find((cat) => String(cat.id) === firstSelectedServiceId);
      setActiveTab(String((preselected || tabCategories[0]).id));
    }
  }, [tabCategories, activeTab, firstSelectedServiceId]);

  const visibleProducts = useMemo(() => {
    if (!activeTab) return [];
    return allProducts.filter((p) => String(p.category_id) === activeTab);
  }, [allProducts, activeTab]);

  const toggleProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const goToFacility = () => {
    const query = new URLSearchParams({ lang });
    if (servicesParam) query.set("services", servicesParam);
    if (treatments) query.set("treatments", treatments);
    if (durations) query.set("durations", durations);
    if (selectedProducts.length > 0) query.set("products", selectedProducts.join(","));
    navigate(`/facility?${query.toString()}`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="py-4 px-6 border-b border-zinc-800 relative">
        <h1 className="text-2xl font-bold text-center mb-2">
          {lang === "ar" ? "المنتجات" : "Products"}
        </h1>
        <p className="text-sm text-gray-400 text-center">
          {lang === "ar" ? "تصفح المنتجات المتعلقة بخدماتك" : "Browse products for your selected services"}
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

      {/* Service Tabs */}
      {tabCategories.length > 0 && (
        <div className="overflow-x-auto whitespace-nowrap px-6 py-4 bg-[#121212] border-b border-zinc-800">
          {tabCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(String(cat.id))}
              className={`inline-block px-4 py-2 text-sm font-medium rounded-full mx-1 transition-all duration-300 transform hover:scale-105
                ${activeTab === String(cat.id) ? "bg-white text-black shadow-md" : "bg-zinc-800 text-white hover:bg-zinc-700 hover:shadow-md"}`}
            >
              {lang === "ar" ? cat.name_ar : cat.name_en}
            </button>
          ))}
        </div>
      )}

      {/* Product Grid */}
      <div className="flex-1 p-6 container mx-auto w-full">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : visibleProducts.length === 0 ? (
          <p className="text-center text-gray-400 py-20 text-lg">
            {lang === "ar" ? "لا توجد منتجات متاحة لهذه الخدمة." : "No products available for this service."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProducts.map((product) => {
              const isSelected = selectedProducts.includes(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => toggleProduct(product.id)}
                  className={`bg-zinc-900 rounded-xl overflow-hidden shadow hover:bg-zinc-800 transition-all duration-300 cursor-pointer border relative ${
                    isSelected ? "border-blue-500 ring-2 ring-blue-500" : "border-gray-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleProduct(product.id)}
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute top-3 ${lang === "ar" ? "left-3" : "right-3"} w-5 h-5 accent-blue-500 cursor-pointer z-10`}
                  />
                  <img
                    src={product.image_url ? getMediaUrl(product.image_url, NO_IMAGE) : NO_IMAGE}
                    alt={lang === "ar" ? product.name_ar : product.name_en}
                    className="w-full h-48 object-cover bg-zinc-800"
                    onError={(e) => {
                      if (e.target.dataset.failed) return;
                      e.target.dataset.failed = "true";
                      e.target.src = NO_IMAGE;
                    }}
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {lang === "ar" ? product.name_ar : product.name_en}
                      </h3>
                      {product.price != null && (
                        <span className="text-sm font-semibold text-[#ababab] whitespace-nowrap">
                          {product.price} {lang === "ar" ? "ريال" : "QR"}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300">
                      {lang === "ar" ? product.description_ar : product.description_en}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-center pb-10">
        <button
          onClick={goToFacility}
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
  );
};

export default Product;
