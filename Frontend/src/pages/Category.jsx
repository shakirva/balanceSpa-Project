import React, { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Button,
  Upload,
  message,
  Popconfirm,
  Table,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/categories";

const ServiceCategory = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({
    name_en: "",
    name_ar: "",
    image: null,
    imageFile: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_BASE);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load categories");
    }
  };

  const openModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setForm({
        name_en: cat.name_en,
        name_ar: cat.name_ar,
        image: cat.image_url
          ? `http://localhost:5000${cat.image_url}`
          : null,
        imageFile: null,
      });
    } else {
      setEditingCategory(null);
      setForm({ name_en: "", name_ar: "", image: null, imageFile: null });
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setForm({ name_en: "", name_ar: "", image: null, imageFile: null });
    setEditingCategory(null);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name_en.trim()) {
      message.error("English name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name_en", form.name_en);
    formData.append("name_ar", form.name_ar);
    if (form.imageFile) {
      formData.append("image", form.imageFile);
    }

    try {
      setLoading(true);
      if (editingCategory) {
        await axios.put(`${API_BASE}/${editingCategory.id}`, formData);
        message.success("Category updated");
      } else {
        await axios.post(API_BASE, formData);
        message.success("Category added");
      }
      fetchCategories();
      handleCancel();
    } catch (err) {
      console.error(err);
      message.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      message.success("Category deleted");
      fetchCategories();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete category");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image_url",
      render: (image_url) =>
        image_url ? (
          <img
            src={`http://localhost:5000${image_url}`}
            alt="Service"
            className="h-12 w-12 object-cover rounded-full border"
          />
        ) : (
          <div className="h-12 w-12 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full">
            ?
          </div>
        ),
    },
    {
      title: "Name (EN / AR)",
      render: (_, cat) => (
        <div>
          <div className="font-medium">{cat.name_en}</div>
          <div className="text-sm text-gray-500">{cat.name_ar}</div>
        </div>
      ),
    },
    {
      title: "Actions",
      render: (_, cat) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => openModal(cat)} />
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => handleDelete(cat.id)}
          >
            <Button danger icon={<DeleteOutlined />} className="ml-2" />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Service Categories</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
        >
          Add Category
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
      />

      <Modal
        title={editingCategory ? "Edit Service" : "Add New Service"}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={loading}
        okText={editingCategory ? "Update" : "Add"}
      >
        <div className="space-y-4">
          <div>
            <label>Service Name (English)</label>
            <Input
              name="name_en"
              value={form.name_en}
              onChange={handleInputChange}
              maxLength={32}
            />
          </div>
          <div>
            <label>Service Name (Arabic)</label>
            <Input
              name="name_ar"
              value={form.name_ar}
              onChange={handleInputChange}
              style={{ direction: "rtl" }}
              maxLength={32}
            />
          </div>
          <div>
            <label>Upload Image (optional)</label>
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={(file) => {
                setForm((prev) => ({
                  ...prev,
                  image: URL.createObjectURL(file),
                  imageFile: file,
                }));
                return false; // Prevent auto-upload
              }}
            >
              <Button icon={<UploadOutlined />}>Choose Image</Button>
            </Upload>
            {form.image && (
              <img
                src={form.image}
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
