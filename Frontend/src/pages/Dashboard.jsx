import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pagination } from "antd";

const dummyProducts = [
  {
    _id: "1",
    name: "Aromatherapy Oil",
    price: 499,
    cost: 250,
    category: { name: "Wellness" },
    quantity: 10,
    imageUrl: "https://via.placeholder.com/300x200?text=Product+1",
    rating: 4.5,
  },
  {
    _id: "2",
    name: "Herbal Shampoo",
    price: 299,
    cost: 120,
    category: { name: "Hair Care" },
    quantity: 20,
    imageUrl: "https://via.placeholder.com/300x200?text=Product+2",
    rating: 4.2,
  },
  {
    _id: "3",
    name: "Spa Facial Kit",
    price: 799,
    cost: 400,
    category: { name: "Skin Care" },
    quantity: 15,
    imageUrl: "https://via.placeholder.com/300x200?text=Product+3",
    rating: 4.7,
  },
  {
    _id: "4",
    name: "Massage Lotion",
    price: 399,
    cost: 200,
    category: { name: "Body Care" },
    quantity: 8,
    imageUrl: "https://via.placeholder.com/300x200?text=Product+4",
    rating: 4.4,
  },
];

const dummyCategories = [
  { _id: "", name: "All" },
  { _id: "Wellness", name: "Wellness" },
  { _id: "Hair Care", name: "Hair Care" },
  { _id: "Skin Care", name: "Skin Care" },
  { _id: "Body Care", name: "Body Care" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  const limit = 8;

  const filteredProducts = dummyProducts.filter((product) => {
    const matchCategory = category ? product.category.name === category : true;
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * limit,
    page * limit
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (catName) => {
    setCategory(catName);
    setPage(1);
  };

  const handlePageChange = (newPage) => setPage(newPage);

  return (
    <div className="flex-1 rounded-lg p-4 overflow-y-auto">

  
    </div>
  );
};

export default Dashboard;
