import React, { useEffect, useState } from "react";
import { Table, Button, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin", {
          withCredentials: true,
        });

        const formattedData = res.data.map((admin) => ({
          id: admin.id,
          email: admin.email,
          role: "Admin", // static role
        }));

        setUsers(formattedData);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, []);

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
            title: "Email",
            dataIndex: "email",
            key: "email",
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
