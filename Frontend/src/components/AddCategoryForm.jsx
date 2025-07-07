import React, { useState } from "react";
import { Modal, Form, Input, Upload, Button, message, Card } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const AddCategoryForm = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const categoryData = {
        id: Date.now(),
        name: values.name,
        description: values.description || "",
        image: imageUrl,
        servicesCount: 0,
        createdAt: new Date().toISOString(),
      };

      console.log('New Category:', categoryData);
      message.success("Category added successfully!");
      onSuccess(categoryData);
      handleReset();
    } catch (error) {
      message.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setImageUrl(null);
    onCancel();
  };

  const handleImageChange = (info) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      // Use local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const removeImage = () => {
    setImageUrl(null);
  };

  return (
    <Modal
      title="Add New Category"
      open={visible}
      onCancel={handleReset}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        {/* Category Name */}
        <Form.Item
          name="name"
          label="Category Name"
          rules={[
            { required: true, message: "Please enter category name" },
            { max: 50, message: "Category name cannot exceed 50 characters" }
          ]}
        >
          <Input
            placeholder="Enter category name (e.g., Massage, Facial, Bath & Body)"
            maxLength={50}
            showCount
          />
        </Form.Item>

        {/* Description */}
        <Form.Item
          name="description"
          label="Description"
          rules={[
            { max: 200, message: "Description cannot exceed 200 characters" }
          ]}
        >
          <TextArea
            placeholder="Describe what services this category includes..."
            rows={3}
            maxLength={200}
            showCount
          />
        </Form.Item>

        {/* Image Upload */}
        <Form.Item label="Category Image (Optional)">
          <div className="space-y-4">
            {imageUrl ? (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Category preview"
                  className="w-32 h-32 object-cover rounded-lg border"
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
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 transition-colors">
                  <UploadOutlined className="text-2xl text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Upload Image
                  </span>
                </div>
              </Upload>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Recommended size: 300x300px. Max file size: 2MB.
            </p>
          </div>
        </Form.Item>

        {/* Preview Card */}
        {form.getFieldValue('name') && (
          <Card size="small" className="mb-4 bg-gray-50 dark:bg-gray-800">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview
            </h4>
            <div className="flex items-center gap-3">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded-full border"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400 text-lg">?</span>
                </div>
              )}
              <div>
                <p className="font-medium dark:text-white">
                  {form.getFieldValue('name') || 'Category Name'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {form.getFieldValue('description') || 'No description'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={handleReset}>
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            className="bg-[#18181b] text-white"
          >
            Add Category
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddCategoryForm; 