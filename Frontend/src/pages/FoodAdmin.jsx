import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Upload, message, Table, Popconfirm, Form } from "antd";
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "../api/axios";

const FoodAdmin = () => {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ name: "", name_ar: "", description: "", description_ar: "", image: null, imageFile: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("/api/food-beverages");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      message.error("Failed to load items");
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setForm({
        name: item.name,
        name_ar: item.name_ar || "",
        description: item.description,
        description_ar: item.description_ar || "",
        image: item.image_url ? axios.defaults.baseURL + item.image_url : null,
        imageFile: null,
      });
    } else {
      setForm({ name: "", name_ar: "", description: "", description_ar: "", image: null, imageFile: null });
      setEditingItem(null);
    }
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setForm({ name: "", description: "", image: null, imageFile: null });
    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      message.error("Name is required");
      return;
    }
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("name_ar", form.name_ar);
    formData.append("description", form.description);
    formData.append("description_ar", form.description_ar);
    if (form.imageFile) {
      formData.append("image", form.imageFile);
    }
    try {
      setLoading(true);
      if (editingItem) {
        await axios.put(`/api/food-beverages/${editingItem.id}`, formData);
        message.success("Item updated successfully");
      } else {
        await axios.post("/api/food-beverages", formData);
        message.success("Item added successfully");
      }
      fetchItems();
      handleCancel();
    } catch (err) {
      message.error("Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/food-beverages/${id}`);
      message.success("Item deleted successfully");
      fetchItems();
    } catch (err) {
      message.error("Failed to delete item");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image_url",
      render: (image_url) =>
        image_url ? (
          <img
            src={axios.defaults.baseURL + image_url}
            alt="Food"
            className="h-12 w-12 object-cover rounded-full border"
          />
        ) : (
          <div className="h-12 w-12 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full">
            ?
          </div>
        ),
    },
    {
      title: "Name (EN)",
      dataIndex: "name",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Name (AR)",
      dataIndex: "name_ar",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Description (EN)",
      dataIndex: "description",
    },
    {
      title: "Description (AR)",
      dataIndex: "description_ar",
    },
    {
      title: "Actions",
      render: (_, item) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => openModal(item)} />
          <Popconfirm
            title="Are you sure you want to delete this item?"
            onConfirm={() => handleDelete(item.id)}
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
    <div className="min-h-screen p-6 bg-white text-black">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Food & Beverages Admin</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          Add Item
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={Array.isArray(items) ? items : []}
        rowKey="id"
        pagination={{ pageSize: 6 }}
        bordered
        className="mb-8"
      />
      <Modal
        title={editingItem ? "Edit Item" : "Add New Item"}
        open={modalOpen}
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={loading}
        okText={editingItem ? "Update" : "Add"}
      >
        <Form layout="vertical">
          <Form.Item label="Item Name (English)" required>
            <Input name="name" value={form.name} onChange={handleInputChange} maxLength={32} />
          </Form.Item>
          <Form.Item label="Item Name (Arabic)" required>
            <Input name="name_ar" value={form.name_ar} onChange={handleInputChange} maxLength={32} />
          </Form.Item>
          <Form.Item label="Description (English)">
            <Input name="description" value={form.description} onChange={handleInputChange} maxLength={128} />
          </Form.Item>
          <Form.Item label="Description (Arabic)">
            <Input name="description_ar" value={form.description_ar} onChange={handleInputChange} maxLength={128} />
          </Form.Item>
          <Form.Item label="Upload Image (optional)">
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={(file) => {
                setForm((prev) => ({ ...prev, image: URL.createObjectURL(file), imageFile: file }));
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Choose Image</Button>
            </Upload>
            {form.image && (
              <img src={form.image} alt="Preview" className="h-16 w-16 object-cover rounded-full border mt-2" />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FoodAdmin;
