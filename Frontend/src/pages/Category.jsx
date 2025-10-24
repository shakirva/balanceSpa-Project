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
import axios from "../api/axios"; // ✅ use our axios instance

const ServiceCategory = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({
    name_en: "",
    name_ar: "",
  media: null,
  mediaFile: null,
    order: 0, // Add order field
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories"); // ✅ no need for full URL
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load categories from the server");
    }
  };

  const openModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setForm({
        name_en: cat.name_en,
        name_ar: cat.name_ar,
        image: cat.image_url ? axios.defaults.baseURL + cat.image_url : null,
        imageFile: null,
        order: cat.order || 0, // Set order value
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
  setForm({ name_en: "", name_ar: "", media: null, mediaFile: null, order: 0 });
    setEditingCategory(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "order" ? Number(value) : value });
  };

  const handleSubmit = async () => {
    if (!form.name_en.trim()) {
      message.error("English name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name_en", form.name_en);
    formData.append("name_ar", form.name_ar);
    formData.append("order", form.order); // Add order to formData
    if (form.mediaFile) {
      const isVideo = form.mediaFile.type.startsWith('video');
      formData.append(isVideo ? "video" : "image", form.mediaFile);
    }

    try {
      setLoading(true);
      if (editingCategory) {
        await axios.put(`/api/categories/${editingCategory.id}`, formData);
        message.success("Category updated successfully");
      } else {
        await axios.post("/api/categories", formData);
        message.success("Category added successfully");
      }
      fetchCategories();
      handleCancel();
    } catch (err) {
      console.error(err);
      message.error("Failed to save category. Please check your server logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      message.success("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete category");
    }
  };

  const columns = [
    {
      title: "Media",
      dataIndex: "image_url",
      render: (image_url, record) => {
        if (!image_url) {
          return (
            <div className="h-12 w-12 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full">
              ?
            </div>
          );
        }
        // Try to detect if it's a video by extension
        const url = axios.defaults.baseURL + image_url;
        const isVideo = /\.(mp4|webm|ogg)$/i.test(url);
        if (isVideo) {
          return (
            <video
              src={url}
              controls
              style={{
                height: '3rem',
                width: '3rem',
                objectFit: 'cover',
                borderRadius: '9999px', // rounded-full
                border: '1px solid #e5e7eb', // Tailwind border-gray-200
                background: '#f3f4f6', // Tailwind bg-gray-100
                display: 'block',
              }}
            />
          );
        }
        return (
          <img
            src={url}
            alt="Service"
            className="h-12 w-12 object-cover rounded-full border"
          />
        );
      },
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
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(cat.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} className="ml-2" />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white min-h-screen">
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
            <label>Display Order</label>
            <Input
              name="order"
              type="number"
              value={form.order}
              onChange={handleInputChange}
              min={0}
              max={999}
              placeholder="Order (lower comes first)"
            />
          </div>
          <div>
            <label>Upload Image or Video (optional)</label>
            <Upload
              accept="image/*,video/*"
              showUploadList={false}
              beforeUpload={(file) => {
                setForm((prev) => ({
                  ...prev,
                  media: URL.createObjectURL(file),
                  mediaFile: file,
                }));
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Choose Image or Video</Button>
            </Upload>
            {form.media && (
              form.mediaFile && form.mediaFile.type.startsWith('video') ? (
                <video
                  src={form.media}
                  controls
                  className="h-16 w-16 object-cover rounded-full border mt-2"
                />
              ) : (
                <img
                  src={form.media}
                  alt="Preview"
                  className="h-16 w-16 object-cover rounded-full border mt-2"
                />
              )
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ServiceCategory;
