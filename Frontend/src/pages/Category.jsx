import React, { useState } from "react";
import { Modal, Input, Button, Upload, message } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";

// Dummy data for categories
const initialCategories = [
  {
    id: 1,
    name: "Massage",
    description: "Relaxing body massage services",
    image: null,
    servicesCount: 5,
  },
  {
    id: 2,
    name: "Facial",
    description: "Facial treatments for glowing skin",
    image: null,
    servicesCount: 3,
  },
  {
    id: 3,
    name: "Bath & Body",
    description: "Body scrubs, wraps, and baths",
    image: null,
    servicesCount: 2,
  },
];

const ServiceCategory = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [uploading, setUploading] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    setNewCategory({ name: "", description: "", image: null });
  };

  const handleInputChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleImageChange = (info) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      // Use local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewCategory((prev) => ({ ...prev, image: e.target.result }));
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      message.error("Category name is required");
      return;
    }
    setCategories([
      ...categories,
      {
        id: Date.now(),
        name: newCategory.name,
        description: newCategory.description,
        image: newCategory.image,
        servicesCount: 0,
      },
    ]);
    message.success("Category added successfully");
    setIsModalOpen(false);
    setNewCategory({ name: "", description: "", image: null });
  };

  return (
    <div className="flex-1 rounded-lg p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold dark:text-white">Services</h2>
        <Button type="primary" className="bg-[#18181b] text-white px-4 py-5 font-semibold" icon={<PlusOutlined />} onClick={showModal}>
          Add Service
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Services
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="h-12 w-12 object-cover rounded-full border" />
                  ) : (
                    <div className="h-12 w-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-400">
                      <span className="text-lg">?</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{cat.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cat.servicesCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
      <Modal
  title="Add New Service"
  open={isModalOpen}
  onCancel={handleCancel}
  onOk={handleAddCategory}
  okText="Add"
  confirmLoading={uploading}
>
  <div className="space-y-4">
    {/* Service Name in English */}
    <div>
      <label className="block font-semibold mb-2">Service Name (English)</label>
      <Input
        name="name_en"
        placeholder="Enter service name in English"
        value={newCategory.name_en}
        onChange={handleInputChange}
        maxLength={32}
        className="mb-3"
      />
    </div>

    {/* Service Name in Arabic */}
    <div>
      <label className="block font-semibold mb-2">Service Name (Arabic)</label>
      <Input
        name="name_ar"
        placeholder="أدخل اسم الخدمة بالعربية"
        value={newCategory.name_ar}
        onChange={handleInputChange}
        maxLength={32}
        className="mb-3"
        style={{ direction: 'rtl' }}
      />
    </div>

    {/* Upload Image */}
    <div>
      <label className="block font-semibold mb-2">Upload Image (optional)</label>
      <Upload
        accept="image/*"
        showUploadList={false}
        beforeUpload={() => false}
        onChange={handleImageChange}
      >
        <Button icon={<UploadOutlined />}>Choose Image</Button>
      </Upload>

      {newCategory.image && (
        <img
          src={newCategory.image}
          alt="Preview"
          className="h-16 w-16 object-cover rounded-full border mt-2"
        />
      )}
    </div>
  </div>
</Modal>

    </div>
  );
};

export default ServiceCategory; 