import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  InputNumber,
  message,
  Select,
  Form,
  Space,
  Upload,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "../api/axios";
import { getMediaUrl } from "../utils/media";

const { Option } = Select;

export default function ProductAdmin() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((res) => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => message.error("Failed to load categories"));
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      message.error("Failed to load products");
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openModal = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setModalOpen(true);
    setSelectedCategoryId(null);
    setProductImage(null);
    setOrder(0);
    form.resetFields();
  };

  const openEditModal = (product) => {
    setIsEditing(true);
    setEditingProduct(product);
    setModalOpen(true);
    setSelectedCategoryId(product.category_id);
    setProductImage(product.image_url || null);
    setOrder(product.order || 0);
    form.setFieldsValue({
      name_en: product.name_en,
      name_ar: product.name_ar,
      description_en: product.description_en,
      description_ar: product.description_ar,
      price: product.price,
    });
  };

  const handleCancel = () => {
    setModalOpen(false);
    setIsEditing(false);
    setEditingProduct(null);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedCategoryId) return message.error("Please select a service category");

      const formData = new FormData();
      formData.append("name_en", values.name_en ?? "");
      formData.append("name_ar", values.name_ar ?? "");
      formData.append("description_en", values.description_en ?? "");
      formData.append("description_ar", values.description_ar ?? "");
      formData.append("price", values.price ?? "");
      formData.append("category_id", selectedCategoryId ?? "");
      formData.append("order", order ?? 0);

      if (productImage && typeof productImage !== "string") {
        formData.append("image", productImage);
      }

      setLoading(true);
      if (isEditing) {
        await axios.put(`/api/products/${editingProduct.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Product updated");
      } else {
        await axios.post("/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Product added");
      }

      fetchProducts();
      handleCancel();
    } catch (err) {
      console.error("Save failed:", err);
      message.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      message.success("Product deleted");
      fetchProducts();
    } catch {
      message.error("Delete failed");
    }
  };

  const categoryName = (catId) => {
    const cat = categories.find((c) => String(c.id) === String(catId));
    return cat ? cat.name_en : "-";
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Product Management</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
          Add Product
        </Button>
      </div>

      <Table
        dataSource={products.sort((a, b) => (a.order || 0) - (b.order || 0))}
        rowKey="id"
        pagination={{ pageSize: 8 }}
        columns={[
          {
            title: "Image",
            dataIndex: "image_url",
            render: (img) =>
              img ? (
                <img src={getMediaUrl(img)} alt="product" className="w-16 h-12 object-cover rounded" />
              ) : (
                <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">?</div>
              ),
          },
          { title: "Name", dataIndex: "name_en" },
          {
            title: "Service Category",
            dataIndex: "category_id",
            render: (catId) => categoryName(catId),
          },
          { title: "Description", dataIndex: "description_en" },
          {
            title: "Price",
            dataIndex: "price",
            render: (price) => (price != null ? `${price} QR` : "-"),
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, product) => (
              <Space>
                <Button type="link" icon={<EditOutlined />} onClick={() => openEditModal(product)}>
                  Edit
                </Button>
                <Popconfirm
                  title="Delete product?"
                  onConfirm={() => deleteProduct(product.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" icon={<DeleteOutlined />} danger>
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={isEditing ? "Edit Product" : "Add Product"}
        open={modalOpen}
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={loading}
        okText={isEditing ? "Save" : "Add"}
        width={700}
      >
        <Form form={form} layout="vertical" className="grid grid-cols-2 gap-2">
          <Form.Item label="Service Category" required className="col-span-2">
            <Select
              placeholder="Select category"
              value={selectedCategoryId}
              onChange={setSelectedCategoryId}
            >
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name_en}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="name_en" label="Product Name (English)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name_ar" label="Product Name (Arabic)">
            <Input style={{ direction: "rtl" }} />
          </Form.Item>
          <Form.Item name="description_en" label="Description (English)">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="description_ar" label="Description (Arabic)">
            <Input.TextArea rows={2} style={{ direction: "rtl" }} />
          </Form.Item>

          <Form.Item name="price" label="Price (QR)">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Display Order">
            <Input
              type="number"
              min={0}
              max={999}
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              placeholder="Order (lower comes first)"
            />
          </Form.Item>

          <Form.Item label="Product Image" className="col-span-2">
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={(file) => {
                setProductImage(file);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
            {productImage && (
              <img
                src={typeof productImage === "string" ? getMediaUrl(productImage) : URL.createObjectURL(productImage)}
                alt="Preview"
                className="mt-2 w-24 h-16 object-cover rounded border"
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
