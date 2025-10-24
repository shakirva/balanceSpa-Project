
import React, { useState } from "react";
import { Modal, Form, Input, Upload, Button, message, Card } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import axios from '../api/axios';

const { TextArea } = Input;

const AddCategoryForm = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(null); // can be image or video
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  const [mediaFile, setMediaFile] = useState(null); // store the actual File object
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name_en', values.name);
      formData.append('name_ar', values.name); // You may want to add a separate field for Arabic name
      formData.append('order', values.order || 0);
      formData.append('description', values.description || '');
      if (mediaFile && mediaType) {
        formData.append(mediaType === 'video' ? 'video' : 'image', mediaFile);
      }

      // Use your backend endpoint for category creation
      await axios.post('/api/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      message.success("Category added successfully!");
      onSuccess();
      handleReset();
    } catch (error) {
      message.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  setMediaUrl(null);
  setMediaType(null);
    onCancel();
  };

  const handleMediaChange = (info) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      const file = info.file.originFileObj;
      const type = file.type.startsWith('video') ? 'video' : 'image';
      setMediaType(type);
      setMediaFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setMediaUrl(null);
    setMediaType(null);
    setMediaFile(null);
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

        {/* Media Upload (Image or Video) */}
  <Form.Item label="Upload Image or Video (optional)">
          <div className="space-y-4">
            {mediaUrl ? (
              <div className="relative">
                {mediaType === 'image' ? (
                  <img
                    src={mediaUrl}
                    alt="Category preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                ) : (
                  <video
                    src={mediaUrl}
                    controls
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                )}
                <Button
                  type="text"
                  danger
                  size="small"
                  onClick={removeMedia}
                  className="absolute -top-2 -right-2 bg-white rounded-full shadow-md"
                >
                  ×
                </Button>
              </div>
            ) : (
              <Upload
                accept="image/*,video/*"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleMediaChange}
              >
                <Button icon={<UploadOutlined />}>Choose Image or Video</Button>
              </Upload>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              You can upload an image (JPG, PNG, etc.) or a video (MP4, WEBM, MOV). Only one file allowed.
            </p>
          </div>
        </Form.Item>

        {/* Display Order */}
        <Form.Item label="Display Order" name="order" rules={[{ required: true, message: 'Please enter display order' }]}>
          <Input type="number" min={0} placeholder="Order (lower comes first)" />
        </Form.Item>

        {/* Preview Card */}
        {form.getFieldValue('name') && (
          <Card size="small" className="mb-4 bg-gray-50 dark:bg-gray-800">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview
            </h4>
            <div className="flex items-center gap-3">
              {mediaUrl ? (
                mediaType === 'image' ? (
                  <img
                    src={mediaUrl}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-full border"
                  />
                ) : (
                  <video
                    src={mediaUrl}
                    className="w-12 h-12 object-cover rounded-full border"
                    controls
                  />
                )
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