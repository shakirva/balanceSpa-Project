import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // if using React Router

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // for redirect after login

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        message.success("Login successful!");
        localStorage.setItem("adminToken", data.token);

        // redirect to dashboard
        navigate("/appointment"); // change route as per your app
      } else {
        message.error(data.message || "Login failed");
      }
    } catch (error) {
      message.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
        <Form
          name="admin_login"
          layout="vertical"
          onFinish={handleLogin}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              className="py-3"
              placeholder="admin@email.com"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              className="py-3"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-[#18181b] py-5 text-white font-semibold"
            >
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}