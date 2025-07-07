import React, { useState } from "react";
import { Modal, Form, Input, Select, DatePicker, TimePicker, Button, message, Card, Tag } from "antd";
import { PlusOutlined, UserOutlined, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

// Dummy data
const initialCategories = [
  {
    id: 1,
    name: "Massage",
    treatments: [
      { id: 1, name: "Swedish Massage", duration: "60 min", price: 120 },
      { id: 2, name: "Deep Tissue Massage", duration: "90 min", price: 150 },
      { id: 3, name: "Hot Stone Massage", duration: "75 min", price: 140 },
    ],
  },
  {
    id: 2,
    name: "Facial",
    treatments: [
      { id: 1, name: "Classic Facial", duration: "45 min", price: 90 },
      { id: 2, name: "Anti-Aging Facial", duration: "60 min", price: 120 },
    ],
  },
  {
    id: 3,
    name: "Bath & Body",
    treatments: [
      { id: 1, name: "Body Scrub", duration: "45 min", price: 80 },
      { id: 2, name: "Aromatherapy Bath", duration: "60 min", price: 100 },
    ],
  },
];

const initialCustomers = [
  { id: 1, name: "Sarah Johnson", phone: "+1 (555) 123-4567", email: "sarah.johnson@email.com" },
  { id: 2, name: "Michael Chen", phone: "+1 (555) 234-5678", email: "michael.chen@email.com" },
  { id: 3, name: "Lisa Thompson", phone: "+1 (555) 345-6789", email: "lisa.thompson@email.com" },
];

const initialTherapists = [
  { id: 1, name: "Emma Wilson", specialties: ["Massage", "Facial"] },
  { id: 2, name: "David Rodriguez", specialties: ["Massage", "Bath & Body"] },
  { id: 3, name: "Maria Garcia", specialties: ["Facial", "Bath & Body"] },
  { id: 4, name: "Sophie Kim", specialties: ["Massage"] },
];

const NewAppointmentForm = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [treatmentModalVisible, setTreatmentModalVisible] = useState(false);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  
  // Form data states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // New item states
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newTreatment, setNewTreatment] = useState({ name: "", duration: "", price: "" });
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "" });

  const handleSubmit = async (values) => {
    if (!selectedCustomer || !selectedCategory || !selectedTreatment || !selectedTherapist || !selectedDate || !selectedTime) {
      message.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const appointmentData = {
        id: Date.now(),
        customer: selectedCustomer,
        category: selectedCategory,
        treatment: selectedTreatment,
        therapist: selectedTherapist,
        date: selectedDate.format('YYYY-MM-DD'),
        time: selectedTime.format('HH:mm'),
        notes: values.notes || "",
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };

      console.log('New Appointment:', appointmentData);
      message.success("Appointment created successfully!");
      onSuccess(appointmentData);
      handleReset();
    } catch (error) {
      message.error("Failed to create appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setSelectedCategory(null);
    setSelectedTreatment(null);
    setSelectedCustomer(null);
    setSelectedTherapist(null);
    setSelectedDate(null);
    setSelectedTime(null);
    onCancel();
  };

  // Category Modal Handlers
  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      message.error("Category name is required");
      return;
    }
    // Add category logic here
    message.success("Category added successfully");
    setCategoryModalVisible(false);
    setNewCategory({ name: "", description: "" });
  };

  // Treatment Modal Handlers
  const handleAddTreatment = () => {
    if (!newTreatment.name.trim() || !newTreatment.duration.trim() || !newTreatment.price.trim()) {
      message.error("All fields are required");
      return;
    }
    // Add treatment logic here
    message.success("Treatment added successfully");
    setTreatmentModalVisible(false);
    setNewTreatment({ name: "", duration: "", price: "" });
  };

  // Customer Modal Handlers
  const handleAddCustomer = () => {
    if (!newCustomer.name.trim() || !newCustomer.phone.trim()) {
      message.error("Name and phone are required");
      return;
    }
    // Add customer logic here
    message.success("Customer added successfully");
    setCustomerModalVisible(false);
    setNewCustomer({ name: "", phone: "", email: "" });
  };

  return (
    <>
      <Modal
        title="New Appointment"
        open={visible}
        onCancel={handleReset}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          {/* Customer Selection */}
          <Card size="small" className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-lg font-medium dark:text-white">Customer</h4>
              <Button 
                type="dashed" 
                icon={<PlusOutlined />} 
                onClick={() => setCustomerModalVisible(true)}
                size="small"
              >
                Add New Customer
              </Button>
            </div>
            
            {selectedCustomer ? (
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium dark:text-white">{selectedCustomer.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCustomer.phone}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCustomer.email}</p>
                  </div>
                  <Button 
                    type="link" 
                    size="small" 
                    onClick={() => setSelectedCustomer(null)}
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : (
              <Select
                placeholder="Select or search customer"
                showSearch
                optionFilterProp="children"
                className="w-full"
                onSelect={(value) => {
                  const customer = initialCustomers.find(c => c.id === value);
                  setSelectedCustomer(customer);
                }}
              >
                {initialCustomers.map(customer => (
                  <Option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </Option>
                ))}
              </Select>
            )}
          </Card>

          {/* Service Selection */}
          <Card size="small" className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-lg font-medium dark:text-white">Service</h4>
              <Button 
                type="dashed" 
                icon={<PlusOutlined />} 
                onClick={() => setCategoryModalVisible(true)}
                size="small"
              >
                Add Category
              </Button>
            </div>
            
            <div className="space-y-3">
              {/* Category Selection */}
              {selectedCategory ? (
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium dark:text-white">{selectedCategory.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCategory.description}</p>
                    </div>
                    <Button 
                      type="link" 
                      size="small" 
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedTreatment(null);
                      }}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              ) : (
                <Select
                  placeholder="Select category"
                  className="w-full"
                  onSelect={(value) => {
                    const category = initialCategories.find(c => c.id === value);
                    setSelectedCategory(category);
                  }}
                >
                  {initialCategories.map(category => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              )}

              {/* Treatment Selection */}
              {selectedCategory && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium dark:text-white">Treatment</span>
                    <Button 
                      type="dashed" 
                      icon={<PlusOutlined />} 
                      onClick={() => setTreatmentModalVisible(true)}
                      size="small"
                    >
                      Add Treatment
                    </Button>
                  </div>
                  
                  {selectedTreatment ? (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium dark:text-white">{selectedTreatment.name}</p>
                          <div className="flex gap-2 mt-1">
                            <Tag color="blue">{selectedTreatment.duration}</Tag>
                            <Tag color="green">${selectedTreatment.price}</Tag>
                          </div>
                        </div>
                        <Button 
                          type="link" 
                          size="small" 
                          onClick={() => setSelectedTreatment(null)}
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Select
                      placeholder="Select treatment"
                      className="w-full"
                      onSelect={(value) => {
                        const treatment = selectedCategory.treatments.find(t => t.id === value);
                        setSelectedTreatment(treatment);
                      }}
                    >
                      {selectedCategory.treatments.map(treatment => (
                        <Option key={treatment.id} value={treatment.id}>
                          {treatment.name} - {treatment.duration} - ${treatment.price}
                        </Option>
                      ))}
                    </Select>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Date & Time Selection */}
          <Card size="small" className="mb-4">
            <h4 className="text-lg font-medium dark:text-white mb-3">Schedule</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium dark:text-white mb-2">Date</label>
                <DatePicker
                  className="w-full"
                  placeholder="Select date"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-white mb-2">Time</label>
                <TimePicker
                  className="w-full"
                  placeholder="Select time"
                  value={selectedTime}
                  onChange={setSelectedTime}
                  format="HH:mm"
                  minuteStep={15}
                />
              </div>
            </div>
          </Card>

       

          {/* Notes */}
          <Form.Item name="notes" label="Notes (Optional)">
            <TextArea
              rows={3}
              placeholder="Any special requirements or notes..."
              maxLength={200}
            />
          </Form.Item>

          {/* Submit Button */}
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
              Create Appointment
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Add Category Modal */}
      <Modal
        title="Add New Category"
        open={categoryModalVisible}
        onCancel={() => setCategoryModalVisible(false)}
        onOk={handleAddCategory}
        okText="Add"
      >
        <div className="space-y-4">
          <Input
            placeholder="Category Name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            maxLength={32}
          />
          <TextArea
            placeholder="Description"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
            maxLength={120}
            rows={3}
          />
        </div>
      </Modal>

      {/* Add Treatment Modal */}
      <Modal
        title="Add New Treatment"
        open={treatmentModalVisible}
        onCancel={() => setTreatmentModalVisible(false)}
        onOk={handleAddTreatment}
        okText="Add"
      >
        <div className="space-y-4">
          <Input
            placeholder="Treatment Name"
            value={newTreatment.name}
            onChange={(e) => setNewTreatment({ ...newTreatment, name: e.target.value })}
            maxLength={40}
          />
          <Input
            placeholder="Duration (e.g. 60 min)"
            value={newTreatment.duration}
            onChange={(e) => setNewTreatment({ ...newTreatment, duration: e.target.value })}
            maxLength={20}
          />
          <Input
            placeholder="Price"
            type="number"
            value={newTreatment.price}
            onChange={(e) => setNewTreatment({ ...newTreatment, price: e.target.value })}
            min={0}
            max={9999}
          />
        </div>
      </Modal>

      {/* Add Customer Modal */}
      <Modal
        title="Add New Customer"
        open={customerModalVisible}
        onCancel={() => setCustomerModalVisible(false)}
        onOk={handleAddCustomer}
        okText="Add"
      >
        <div className="space-y-4">
          <Input
            placeholder="Full Name"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            maxLength={32}
          />
          <Input
            placeholder="Phone Number"
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
            maxLength={20}
          />
          <Input
            placeholder="Email (optional)"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
            maxLength={40}
          />
        </div>
      </Modal>
    </>
  );
};

export default NewAppointmentForm; 