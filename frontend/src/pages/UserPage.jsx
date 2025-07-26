import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Popconfirm, message, Tabs, Segmented } from 'antd';
import { UserAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const roleColors = {
  SISWA: 'purple',
  GURU: 'green',
  ADMIN: 'magenta',
  FINANCE: 'orange',
};

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/user');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      // Pastikan data adalah array
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Gagal load data users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/user/${id}`, { method: 'DELETE' });
    message.success('User dihapus!');
    fetchUsers();
  };

  const handleOk = async () => {
    try {
    const values = await form.validateFields();
      console.log('Form values:', values);
      
    if (editingUser) {
        const response = await fetch(`http://localhost:3000/user/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal update user');
        }
        
      message.success('User diupdate!');
    } else {
        const response = await fetch('http://localhost:3000/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal tambah user');
        }
        
      message.success('User ditambah!');
    }
      
    setModalOpen(false);
    fetchUsers();
    } catch (error) {
      console.error('Error:', error);
      message.error(error.message || 'Terjadi kesalahan!');
    }
  };

  const columns = [
    { title: 'Nama', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color={roleColors[role] || 'default'}>{role}</Tag>,
      filters: [
        { text: 'SISWA', value: 'SISWA' },
        { text: 'GURU', value: 'GURU' },
        { text: 'ADMIN', value: 'ADMIN' },
        { text: 'FINANCE', value: 'FINANCE' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Aksi',
      key: 'aksi',
      render: (_, user) => (
        <>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(user)} style={{ marginRight: 8 }} />
          <Popconfirm title="Yakin hapus user ini?" onConfirm={() => handleDelete(user.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px #0001' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Manajemen User</h2>
        <Button type="primary" icon={<UserAddOutlined />} onClick={handleAdd}>
          Tambah User
        </Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={users || []} 
        rowKey="id" 
        pagination={{ pageSize: 8 }}
        loading={loading}
      />
      <Modal
        title={editingUser ? 'Edit User' : 'Tambah User'}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        okText={editingUser ? 'Update' : 'Tambah'}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Nama" rules={[{ required: true, message: 'Nama wajib diisi' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email wajib diisi' }]}>
            <Input />
          </Form.Item>
          <Form.Item 
            name="password" 
            label="Password" 
            rules={[
              { required: !editingUser, message: 'Password wajib diisi untuk user baru' },
              { min: 6, message: 'Password minimal 6 karakter' }
            ]}
          >
            <Input.Password placeholder={editingUser ? "Kosongkan jika tidak ingin mengubah password" : "Masukkan password"} />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Role wajib diisi' }]}>
            <Select>
              <Select.Option value="SISWA">SISWA</Select.Option>
              <Select.Option value="GURU">GURU</Select.Option>
              <Select.Option value="ADMIN">ADMIN</Select.Option>
              <Select.Option value="FINANCE">FINANCE</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}