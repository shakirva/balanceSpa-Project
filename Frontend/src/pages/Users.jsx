import React, { useState } from "react";
import { Table, Button, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";

// Dummy admin users data
const initialUsers = [
  {
    id: 1,
    name: "Alice Smith",
    email: "alice.smith@email.com",
    phone: "+1 (555) 111-2222",
    role: "Admin",
  },
  {
    id: 2,
    name: "Bob Johnson",
    email: "bob.johnson@email.com",
    phone: "+1 (555) 333-4444",
    role: "Admin",
  },
  {
    id: 3,
    name: "Carol Lee",
    email: "carol.lee@email.com",
    phone: "+1 (555) 555-6666",
    role: "Admin",
  },
];

export default function Users() {
  const [users] = useState(initialUsers);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Admin Users</h2>
        <Button type="primary" icon={<PlusOutlined />} className="bg-[#18181b] text-white px-4 font-semibold" disabled>
          Add User
        </Button>
      </div>
      <Table
        dataSource={users}
        rowKey="id"
        pagination={false}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
          },
          {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
          },
          {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role) => <Tag color="blue">{role}</Tag>,
          },
        ]}
      />
    </div>
  );
} 