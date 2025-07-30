import React, { useEffect, useState } from "react";
import { Table, Spin, message, Input } from "antd";
import axios from "../api/axios"; // Ensure axios is imported correctly

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("/api/bookings");
        const unique = {};
        res.data.forEach((b) => {
          if (b.name && b.mobile) {
            const key = b.name + b.mobile;
            if (!unique[key]) {
              unique[key] = { name: b.name, phone: b.mobile };
            }
          }
        });
        const customerList = Object.values(unique);
        setCustomers(customerList);
        setFilteredCustomers(customerList);
      } catch (err) {
        message.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);
    const filtered = customers.filter(
      (cust) =>
        cust.name.toLowerCase().includes(text) ||
        cust.phone.toLowerCase().includes(text)
    );
    setFilteredCustomers(filtered);
  };

  return (
    <div className="flex-1 rounded-lg p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold dark:text-white">Customers</h2>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search by name or phone..."
          value={searchText}
          onChange={handleSearch}
          className="w-full max-w-md"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spin />
          </div>
        ) : (
          <Table
            dataSource={filteredCustomers}
            rowKey={(row) => row.name + row.phone}
            columns={[
              { title: "Name", dataIndex: "name" },
              { title: "Phone Number", dataIndex: "phone" },
            ]}
            pagination={{ pageSize: 10 }}
          />
        )}
      </div>
    </div>
  );
};

export default Customers;
