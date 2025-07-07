import React, { useState } from "react";
import { Table, Button, Modal, Input, message, Select, Form, Space, Upload } from "antd";
import { PlusOutlined, UploadOutlined, EditOutlined } from "@ant-design/icons";

const { Option } = Select;

const initialCategories = [
  {
    id: 1,
    name: "Massage",
    image: null,
    treatments: [
      { id: 1, name: "Thai Massage", description: "A type of full body massage...", image: null, prices: [{ duration: "60 min", price: 220 }, { duration: "90 min", price: 250 }, { duration: "2 hrs", price: 300 }] },
      { id: 2, name: "Sport Massage", description: "A type of massage designed...", image: null, prices: [{ duration: "60 min", price: 140 }, { duration: "90 min", price: 185 }, { duration: "120 min", price: 230 }] },
    ],
  },
  {
    id: 2,
    name: "Facial",
    image: null,
    treatments: [
      { id: 1, name: "Classic Facial", description: "Classic facial treatment...", image: null, prices: [{ duration: "45 min", price: 90 }] },
    ],
  },
  {
    id: 3,
    name: "Bath & Body",
    image: null,
    treatments: [],
  },
];

export default function Treatments() {
  const [categories, setCategories] = useState(initialCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);

  // For modal fields
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [priceFields, setPriceFields] = useState([{ duration: '', price: '' }]);
  const [treatmentImage, setTreatmentImage] = useState(null);

  // Open modal for adding treatment
  const openModal = () => {
    setIsEditing(false);
    setEditingTreatment(null);
    setModalOpen(true);
    setSelectedCategoryId(null);
    setPriceFields([{ duration: '', price: '' }]);
    setTreatmentImage(null);
    form.resetFields();
  };

  // Open modal for editing treatment
  const openEditModal = (categoryId, treatment) => {
    setIsEditing(true);
    setEditingTreatment(treatment);
    setModalOpen(true);
    setSelectedCategoryId(categoryId);
    setPriceFields(treatment.prices);
    setTreatmentImage(treatment.image);
    form.setFieldsValue({
      name: treatment.name,
      description: treatment.description,
    });
  };

  // Add treatment to category
  const handleAddTreatment = () => {
    form.validateFields().then(values => {
      if (!selectedCategoryId) {
        message.error("Please select a service category");
        return;
      }
      if (priceFields.some(f => !f.duration || !f.price)) {
        message.error("Please fill all price fields");
        return;
      }
      setCategories(prev => prev.map(cat =>
        cat.id === selectedCategoryId
          ? {
              ...cat,
              treatments: [
                ...cat.treatments,
                {
                  id: Date.now(),
                  name: values.name,
                  description: values.description,
                  image: treatmentImage,
                  prices: priceFields.map(f => ({ ...f, price: Number(f.price) })),
                },
              ],
            }
          : cat
      ));
      setModalOpen(false);
      setPriceFields([{ duration: '', price: '' }]);
      setTreatmentImage(null);
      form.resetFields();
      message.success("Treatment added!");
    });
  };

  // Edit treatment
  const handleEditTreatment = () => {
    form.validateFields().then(values => {
      if (!selectedCategoryId) {
        message.error("Please select a service category");
        return;
      }
      if (priceFields.some(f => !f.duration || !f.price)) {
        message.error("Please fill all price fields");
        return;
      }
      setCategories(prev => prev.map(cat =>
        cat.id === selectedCategoryId
          ? {
              ...cat,
              treatments: cat.treatments.map(treatment =>
                treatment.id === editingTreatment.id
                  ? {
                      ...treatment,
                      name: values.name,
                      description: values.description,
                      image: treatmentImage,
                      prices: priceFields.map(f => ({ ...f, price: Number(f.price) })),
                    }
                  : treatment
              ),
            }
          : cat
      ));
      setModalOpen(false);
      setIsEditing(false);
      setEditingTreatment(null);
      setPriceFields([{ duration: '', price: '' }]);
      setTreatmentImage(null);
      form.resetFields();
      message.success("Treatment updated!");
    });
  };

  // Add/remove price fields
  const addPriceField = () => setPriceFields([...priceFields, { duration: '', price: '' }]);
  const removePriceField = (idx) => setPriceFields(priceFields.filter((_, i) => i !== idx));
  const updatePriceField = (idx, key, value) => {
    setPriceFields(priceFields.map((f, i) => i === idx ? { ...f, [key]: value } : f));
  };

  // Image upload handler
  const handleImageChange = (info) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTreatmentImage(e.target.result);
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };
  const removeImage = () => setTreatmentImage(null);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Treatment Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-[#18181b] text-white px-4 font-semibold py-5"
          onClick={openModal}
        >
          Add Treatment
        </Button>
      </div>
      <Table
        dataSource={categories}
        rowKey="id"
        pagination={false}
        expandable={{
          expandedRowRender: (category) => (
            <div>
              <Table
                dataSource={category.treatments}
                rowKey="id"
                pagination={false}
                columns={[
                  {
                    title: "Image",
                    dataIndex: "image",
                    render: (img) => img ? (
                      <img src={img} alt="treatment" className="w-16 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">?</div>
                    ),
                  },
                  { title: "Name", dataIndex: "name" },
                  { title: "Description", dataIndex: "description" },
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
                    render: (_, record) => (
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(category.id, record)}
                      >
                        Edit
                      </Button>
                    ),
                  },
                ]}
              />
            </div>
          ),
        }}
        columns={[
          {
          
            dataIndex: "name",
            render: (text, record) => (
              <div className="flex items-center gap-3">
                {record.image ? (
                  <img src={record.image} alt={text} className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">?</div>
                )}
                <span className="font-semibold">{text}</span>
              </div>
            ),
          },
        ]}
      />

      {/* Add/Edit Treatment Modal */}
      <Modal
  title={isEditing ? "Edit Treatment" : "Add Treatment"}
  open={modalOpen}
  onCancel={() => {
    setModalOpen(false);
    setIsEditing(false);
    setEditingTreatment(null);
  }}
  onOk={isEditing ? handleEditTreatment : handleAddTreatment}
  okText={isEditing ? "Save" : "Add"}
  width={800}
>
  <Form form={form} layout="vertical" className="grid grid-cols-2 gap-2 ">
    {/* Category Selection */}
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

    {/* Treatment Name in English */}
    <Form.Item
      name="name_en"
      label="Treatment Name (English)"
      rules={[{ required: true, message: "Please enter treatment name in English" }]}
    >
      <Input placeholder="e.g. Thai Massage" />
    </Form.Item>

    {/* Treatment Name in Arabic */}
    <Form.Item
      name="name_ar"
      label="Treatment Name (Arabic)"
      rules={[{ required: true, message: "يرجى إدخال اسم العلاج بالعربية" }]}
    >
      <Input placeholder="أدخل اسم العلاج" style={{ direction: 'rtl' }} />
    </Form.Item>

    {/* Description in English */}
    <Form.Item
      name="description_en"
      label="Description (English)"
      rules={[{ required: true, message: "Please enter description in English" }]}
    >
      <Input.TextArea rows={2} placeholder="Description of the treatment" />
    </Form.Item>

    {/* Description in Arabic */}
    <Form.Item
      name="description_ar"
      label="Description (Arabic)"
      rules={[{ required: true, message: "يرجى إدخال وصف العلاج" }]}
    >
      <Input.TextArea rows={2} placeholder="وصف العلاج" style={{ direction: 'rtl' }} />
    </Form.Item>

    {/* Treatment Image */}
    <Form.Item label="Treatment Image (Optional)">
      <div className="space-y-2">
        {treatmentImage ? (
          <div className="relative">
            <img
              src={treatmentImage}
              alt="Treatment preview"
              className="w-24 h-16 object-cover rounded border"
            />
            <Button
              type="text"
              danger
              size="small"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-white rounded-full shadow-md"
            >
              ×
            </Button>
          </div>
        ) : (
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleImageChange}
          >
            <div className="w-24 h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded flex flex-col items-center justify-center hover:border-blue-500 transition-colors">
              <UploadOutlined className="text-xl text-gray-400 mb-1" />
              <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Upload Image
              </span>
            </div>
          </Upload>
        )}
      </div>
    </Form.Item>

    {/* Hour-based Pricing Fields */}
    <Form.Item label="Hour-based Prices">
      <Space direction="vertical" style={{ width: '100%' }}>
        {priceFields.map((field, idx) => (
          <Space key={idx} style={{ display: 'flex' }} align="baseline">
            <Input
              placeholder="Duration (e.g. 60 min)"
              value={field.duration}
              onChange={(e) => updatePriceField(idx, 'duration', e.target.value)}
            />
            <Input
              placeholder="Price"
              type="number"
              value={field.price}
              onChange={(e) => updatePriceField(idx, 'price', e.target.value)}
              min={0}
              max={9999}
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