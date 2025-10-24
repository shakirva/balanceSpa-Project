import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
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
import { useLocation } from "react-router-dom";

const { Option } = Select;

export default function Treatments() {
  const [categories, setCategories] = useState([]);
  const [filteredTreatments, setFilteredTreatments] = useState([]);
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [priceFields, setPriceFields] = useState([{ duration: "", price: "" }]);
  const [treatmentMedia, setTreatmentMedia] = useState(null); // can be image or video
  const [treatmentMediaType, setTreatmentMediaType] = useState(null); // 'image' or 'video'
  const [order, setOrder] = useState(0); // <-- Add order state

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories', err);
        message.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  // Memoize fetchTreatments to avoid re-creation on every render
  // Guard to prevent duplicate requests for the same query
  const lastQueryRef = React.useRef("");
  const fetchTreatments = useCallback(async (serviceIds) => {
    console.log("fetchTreatments called with:", serviceIds);
    const queryKey = JSON.stringify(serviceIds);
    if (lastQueryRef.current === queryKey) {
      console.log("Duplicate query, skipping fetch.");
      return;
    }
    lastQueryRef.current = queryKey;
    try {
      const res = await axios.get("/api/treatments");
      const validTreatments = Array.isArray(res.data)
        ? res.data.filter(t => t.category_id && t.name_en)
        : [];
      if (serviceIds.length > 0) {
        setFilteredTreatments(validTreatments.filter(t => serviceIds.includes(Number(t.category_id))));
      } else {
        setFilteredTreatments(validTreatments);
      }
    } catch (err) {
      console.error("Failed to load treatments", err);
      message.error("Failed to load treatments");
    }
  }, []);

  useEffect(() => {
    console.log("useEffect triggered for Treatments, location.search:", location.search);
    const params = new URLSearchParams(location.search);
    const ids = params.get("services")?.split(",").map(Number).filter(Boolean) || [];
    fetchTreatments(ids);
    // Only run when location.search changes (query string changes)
  }, [location.search, fetchTreatments]);

  // ...existing code...

  const openModal = () => {
    setIsEditing(false);
    setEditingTreatment(null);
    setModalOpen(true);
    setSelectedCategoryId(null);
    setPriceFields([{ duration: "", price: "" }]);
  setTreatmentMedia(null);
  setTreatmentMediaType(null);
    setOrder(0); // <-- Reset order
    form.resetFields();
  };

  const openEditModal = (categoryId, treatment) => {
    setIsEditing(true);
    setEditingTreatment(treatment);
    setModalOpen(true);
    setSelectedCategoryId(categoryId);
    setPriceFields(treatment.prices);
    if (treatment.media_url) {
      setTreatmentMedia(treatment.media_url);
      setTreatmentMediaType(treatment.media_type || (treatment.media_url.endsWith('.mp4') ? 'video' : 'image'));
    } else {
      setTreatmentMedia(null);
      setTreatmentMediaType(null);
    }
    setOrder(treatment.order || 0); // <-- Set order value
    form.setFieldsValue({
      name_en: treatment.name_en,
      name_ar: treatment.name_ar,
      description_en: treatment.description_en,
      description_ar: treatment.description_ar,
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedCategoryId) return message.error("Please select a category");
      if (priceFields.some((f) => !f.duration || !f.price))
        return message.error("Fill all price fields");

      const formData = new FormData();
      formData.append("name_en", values.name_en ?? "");
      formData.append("name_ar", values.name_ar ?? "");
      formData.append("description_en", values.description_en ?? "");
      formData.append("description_ar", values.description_ar ?? "");
      formData.append("category_id", selectedCategoryId ?? "");
      formData.append("prices", JSON.stringify(priceFields ?? []));
      formData.append("order", order ?? 0);

      if (treatmentMedia && typeof treatmentMedia !== "string") {
        formData.append(
          treatmentMediaType === 'video' ? "video" : "image",
          treatmentMedia
        );
      } else {
        formData.append("image", null); // Always send image, even if null
        formData.append("video", null);
      }

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (isEditing) {
        await axios.put(
          `/api/treatments/${editingTreatment.id}`,
          formData,
          config
        );
        message.success("Treatment updated");
      } else {
        await axios.post("/api/treatments", formData, config);
        message.success("Treatment added");
      }

  fetchTreatments([]); // Refresh treatments
      setModalOpen(false);
    } catch (err) {
      console.error("Upload failed:", err);
      message.error("Failed to save treatment");
    }
  };

  const deleteTreatment = async (id) => {
    try {
      await axios.delete(`/api/treatments/${id}`);
      message.success("Treatment deleted");
  fetchTreatments([]); // Refresh treatments
    } catch {
      message.error("Delete failed");
    }
  };

  const addPriceField = () =>
    setPriceFields([...priceFields, { duration: "", price: "" }]);

  const removePriceField = (idx) =>
    setPriceFields(priceFields.filter((_, i) => i !== idx));

  const updatePriceField = (idx, key, value) =>
    setPriceFields(
      priceFields.map((f, i) =>
        i === idx ? { ...f, [key]: value } : f
      )
    );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Treatment Management</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
          Add Treatment
        </Button>
      </div>
      {/* Clean Table block, single columns array */}
      <Table
        dataSource={filteredTreatments.sort((a, b) => (a.order || 0) - (b.order || 0))}
        rowKey="id"
        pagination={false}
        columns={[
          {
            title: "Image",
            dataIndex: "image_url",
            render: (img) => img ? (
              <img
                src={`https://balancespa.net${img}`}
                alt="treatment"
                className="w-16 h-12 object-cover rounded"
              />
            ) : (
              <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">?</div>
            )
          },
          {
            title: "Name",
            dataIndex: "name_en"
          },
          {
            title: "Category",
            dataIndex: "category_id",
            render: (catId) => catId || "-"
          },
          {
            title: "Description",
            dataIndex: "description_en"
          },
          {
            title: "Prices",
            dataIndex: "prices",
            render: (prices) => (
              <ul>
                {Array.isArray(prices) && prices.map((p, idx) => (
                  <li key={idx}>{p.duration}: {p.price} Qr</li>
                ))}
              </ul>
            )
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, treatment) => (
              <Space>
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => openEditModal(treatment.category_id, treatment)}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Delete treatment?"
                  onConfirm={() => deleteTreatment(treatment.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" icon={<DeleteOutlined />} danger>
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            )
          }
        ]}
      />
      <Modal
        title={isEditing ? "Edit Treatment" : "Add Treatment"}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setIsEditing(false);
          setEditingTreatment(null);
        }}
        onOk={handleSubmit}
        okText={isEditing ? "Save" : "Add"}
        width={800}
      >
        <Form form={form} layout="vertical" className="grid grid-cols-2 gap-2">
          <Form.Item label="Service Category" required>
            <Select
              placeholder="Select category"
              value={selectedCategoryId}
              onChange={setSelectedCategoryId}
              disabled={isEditing}
            >
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name_en}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="name_en" label="Treatment Name (English)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name_ar" label="Treatment Name (Arabic)" rules={[{ required: true }]}>
            <Input style={{ direction: "rtl" }} />
          </Form.Item>
          <Form.Item name="description_en" label="Description (English)" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="description_ar" label="Description (Arabic)" rules={[{ required: true }]}>
            <Input.TextArea rows={2} style={{ direction: "rtl" }} />
          </Form.Item>

          <Form.Item label="Display Order">
            <Input
              type="number"
              min={0}
              max={999}
              value={order}
              onChange={e => setOrder(Number(e.target.value))}
              placeholder="Order (lower comes first)"
            />
          </Form.Item>

          <Form.Item label="Treatment Image/Video (Optional)">
            <Upload
              accept="image/*,video/*"
              showUploadList={false}
              beforeUpload={(file) => {
                setTreatmentMedia(file);
                setTreatmentMediaType(file.type.startsWith('video') ? 'video' : 'image');
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Select Image or Video</Button>
            </Upload>
            {treatmentMedia && (
              treatmentMediaType === 'image' ? (
                <img
                  src={
                    typeof treatmentMedia === "string"
                      ? `https://balancespa.net${treatmentMedia}`
                      : URL.createObjectURL(treatmentMedia)
                  }
                  alt="Preview"
                  className="mt-2 w-24 h-16 object-cover rounded border"
                />
              ) : (
                <video
                  src={
                    typeof treatmentMedia === "string"
                      ? `https://balancespa.net${treatmentMedia}`
                      : URL.createObjectURL(treatmentMedia)
                  }
                  className="mt-2 w-24 h-16 object-cover rounded border"
                  controls
                />
              )
            )}
          </Form.Item>

          <Form.Item label="Hour-based Prices" className="col-span-2">
            <Space direction="vertical" style={{ width: "100%" }}>
              {priceFields.map((field, idx) => (
                <Space key={idx} align="baseline">
                  <Input
                    placeholder="Duration (e.g. 60 min)"
                    value={field.duration}
                    onChange={(e) => updatePriceField(idx, "duration", e.target.value)}
                  />
                  <Input
                    placeholder="Price"
                    type="number"
                    value={field.price}
                    onChange={(e) => updatePriceField(idx, "price", e.target.value)}
                  />
                  {priceFields.length > 1 && (
                    <Button danger type="text" onClick={() => removePriceField(idx)}>
                      Remove
                    </Button>
                  )}
                </Space>
              ))}
              <Button type="dashed" onClick={addPriceField} icon={<PlusOutlined />}>
                Add Price
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
