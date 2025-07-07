import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

// Dummy data for customers
const initialCustomers = [
  {
    id: 1,
    name: "Sarah Johnson",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@email.com",
  },
  {
    id: 2,
    name: "Michael Chen",
    phone: "+1 (555) 234-5678",
    email: "michael.chen@email.com",
    
  },
  {
    id: 3,
    name: "Lisa Thompson",
    phone: "+1 (555) 345-6789",
    email: "lisa.thompson@email.com",
  
  },
];

const Customers = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    setNewCustomer({ name: "", phone: "", email: "", });
  };

  const handleInputChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  const handleAddCustomer = () => {
    if (!newCustomer.name.trim() || !newCustomer.phone.trim()) {
      message.error("Name and phone number are required");
      return;
    }
    setCustomers([
      ...customers,
      {
        id: Date.now(),
        name: newCustomer.name,
        phone: newCustomer.phone,
        email: newCustomer.email,
      },
    ]);
    message.success("Customer added successfully");
    setIsModalOpen(false);
    setNewCustomer({ name: "", phone: "", email: "", });
  };

  return (
    <div className="flex-1 rounded-lg p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold dark:text-white">Customers</h2>
        <Button type="primary" className="bg-[#18181b] text-white px-4 py-5 font-semibold" icon={<PlusOutlined />} onClick={showModal}>
          Add Customer
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Phone Number
              </th>
            
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{customer.phone}</td>
            
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Customer Modal */}
      <Modal
        title="Add New Customer"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleAddCustomer}
        okText="Add"
      >
        <div className="space-y-4">
          <Input
            name="name"
            placeholder="Full Name"
            value={newCustomer.name}
            onChange={handleInputChange}
            maxLength={32}
          />
          <Input
            name="phone"
            placeholder="Phone Number"
            value={newCustomer.phone}
            onChange={handleInputChange}
            maxLength={20}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Customers; 