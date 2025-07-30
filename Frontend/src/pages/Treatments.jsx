import React, { useEffect, useState } from "react";
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

const { Option } = Select;

export default function Treatments() {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [priceFields, setPriceFields] = useState([{ duration: "", price: "" }]);
  const [treatmentImage, setTreatmentImage] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/treatments");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch {
      message.error("Failed to load categories");
    }
  };

  const openModal = () => {
    setIsEditing(false);
    setEditingTreatment(null);
    setModalOpen(true);
    setSelectedCategoryId(null);
    setPriceFields([{ duration: "", price: "" }]);
    setTreatmentImage(null);
    form.resetFields();
  };

  const openEditModal = (categoryId, treatment) => {
    setIsEditing(true);
    setEditingTreatment(treatment);
    setModalOpen(true);
    setSelectedCategoryId(categoryId);
    setPriceFields(treatment.prices);
    setTreatmentImage(treatment.image_url || null);
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
      formData.append("name_en", values.name_en);
      formData.append("name_ar", values.name_ar);
      formData.append("description_en", values.description_en);
      formData.append("description_ar", values.description_ar);
      formData.append("category_id", selectedCategoryId);
      formData.append("prices", JSON.stringify(priceFields));

      if (treatmentImage && typeof treatmentImage !== "string") {
        formData.append("image", treatmentImage);
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

      fetchCategories();
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
      fetchCategories();
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

      <Table
        dataSource={categories}
        rowKey="id"
        pagination={false}
        expandable={{
          expandedRowRender: (category) => (
            <Table
              dataSource={category.treatments}
              rowKey="id"
              pagination={false}
              columns={[
                {
                  title: "Image",
                  dataIndex: "image_url",
                  render: (img) =>
                    img ? (
                      <img
                        src={`http://localhost:5000${img}`}
                        alt="treatment"
                        className="w-16 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">?</div>
                    ),
                },
                { title: "Name", dataIndex: "name_en" },
                { title: "Description", dataIndex: "description_en" },
                {
                  title: "Prices",
                  dataIndex: "prices",
                  render: (prices) => (
                    <ul>
                      {prices.map((p, idx) => (
                        <li key={idx}>{p.duration}: {p.price} Qr</li>
                      ))}
                    </ul>
                  ),
                },
                {
                  title: "Actions",
                  key: "actions",
                  render: (_, treatment) => (
                    <Space>
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(category.id, treatment)}
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
                  ),
                },
              ]}
            />
          ),
        }}
        columns={[
          {
            dataIndex: "name",
            render: (text, record) => (
              <div className="flex items-center gap-3">
                {record.image ? (
                  <img
                    src={`http://localhost:5000${record.image}`}
                    alt={text}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">?</div>
                )}
                <span className="font-semibold">{record.name}</span>
              </div>
            ),
          },
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
                  {cat.name}
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

          <Form.Item label="Treatment Image (Optional)">
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={(file) => {
                setTreatmentImage(file); // ✅ Capture File
                return false; // Prevent auto-upload
              }}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>

            {treatmentImage && (
              <img
                src={
                  typeof treatmentImage === "string"
                    ? `http://localhost:5000${treatmentImage}`
                    : URL.createObjectURL(treatmentImage)
                }
                alt="Preview"
                className="mt-2 w-24 h-16 object-cover rounded border"
              />
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
