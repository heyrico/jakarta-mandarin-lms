import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Tabs, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Switch, 
  Select, 
  message, 
  Popconfirm, 
  Tag, 
  Space, 
  Typography,
  Row,
  Col,
  Statistic,
  Alert,
  Divider,
  Tooltip,
  Badge
} from 'antd';
import {
  UserOutlined,
  SafetyCertificateOutlined,
  MessageOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  TeamOutlined,
  KeyOutlined,
  DatabaseOutlined,
  AuditOutlined
} from '@ant-design/icons';
import './MasterAdminPage.css';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Option } = Select;

const MasterAdminPage = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  // Data states
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [conversationTypes, setConversationTypes] = useState([]);
  const [modules, setModules] = useState([]);
  const [stats, setStats] = useState({});

  // Load data based on active tab
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'roles':
          await loadRoles();
          break;
        case 'permissions':
          await loadPermissions();
          break;
        case 'conversation-types':
          await loadConversationTypes();
          break;
        case 'system':
          await loadSystemStats();
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      message.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    const response = await fetch('http://localhost:3000/roles');
    if (response.ok) {
      const data = await response.json();
      setRoles(data);
    }
  };

  const loadPermissions = async () => {
    const [permissionsRes, modulesRes] = await Promise.all([
      fetch('http://localhost:3000/permissions'),
      fetch('http://localhost:3000/permissions/modules')
    ]);
    
    if (permissionsRes.ok && modulesRes.ok) {
      const [permissionsData, modulesData] = await Promise.all([
        permissionsRes.json(),
        modulesRes.json()
      ]);
      setPermissions(permissionsData);
      setModules(modulesData);
    }
  };

  const loadConversationTypes = async () => {
    const response = await fetch('http://localhost:3000/conversation-types');
    if (response.ok) {
      const data = await response.json();
      setConversationTypes(data);
    }
  };

  const loadSystemStats = async () => {
    // Mock stats for now
    setStats({
      totalUsers: 156,
      totalRoles: 5,
      totalPermissions: 24,
      totalConversationTypes: 4,
      activeUsers: 142,
      systemRoles: 3,
      customRoles: 2
    });
  };

  // Modal handlers
  const showModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setModalVisible(true);
    
    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingItem) {
        await updateItem(values);
      } else {
        await createItem(values);
      }
      
      setModalVisible(false);
      form.resetFields();
      loadData();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  // CRUD operations
  const createItem = async (values) => {
    try {
      const endpoint = getEndpoint();
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        message.success(`${getItemName()} berhasil dibuat!`);
      } else {
        throw new Error('Failed to create');
      }
    } catch (error) {
      message.error(`Gagal membuat ${getItemName()}`);
    }
  };

  const updateItem = async (values) => {
    try {
      const endpoint = `${getEndpoint()}/${editingItem.id}`;
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        message.success(`${getItemName()} berhasil diperbarui!`);
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      message.error(`Gagal memperbarui ${getItemName()}`);
    }
  };

  const deleteItem = async (id) => {
    try {
      const endpoint = `${getEndpoint()}/${id}`;
      const response = await fetch(endpoint, {
        method: 'DELETE'
      });

      if (response.ok) {
        message.success(`${getItemName()} berhasil dihapus!`);
        loadData();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      message.error(`Gagal menghapus ${getItemName()}`);
    }
  };

  // Helper functions
  const getEndpoint = () => {
    switch (activeTab) {
      case 'roles': return 'http://localhost:3000/roles';
      case 'permissions': return 'http://localhost:3000/permissions';
      case 'conversation-types': return 'http://localhost:3000/conversation-types';
      default: return '';
    }
  };

  const getItemName = () => {
    switch (activeTab) {
      case 'roles': return 'Role';
      case 'permissions': return 'Permission';
      case 'conversation-types': return 'Tipe Percakapan';
      default: return 'Item';
    }
  };

  // Table columns
  const getColumns = () => {
    const baseColumns = [
      {
        title: 'Aksi',
        key: 'actions',
        width: 120,
        render: (_, record) => (
          <Space>
            <Tooltip title="Edit">
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => showModal(activeTab, record)}
                disabled={record.isSystem}
              />
            </Tooltip>
            <Tooltip title="Hapus">
              <Popconfirm
                title={`Yakin ingin menghapus ${getItemName()} ini?`}
                onConfirm={() => deleteItem(record.id)}
                okText="Ya"
                cancelText="Tidak"
              >
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  disabled={record.isSystem}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        )
      }
    ];

    switch (activeTab) {
      case 'roles':
        return [
          {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
              <Space>
                <Text strong>{text}</Text>
                {record.isSystem && <Tag color="blue" icon={<LockOutlined />}>System</Tag>}
              </Space>
            )
          },
          {
            title: 'Display Name',
            dataIndex: 'displayName',
            key: 'displayName'
          },
          {
            title: 'Deskripsi',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
          },
          {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (active) => (
              <Tag color={active ? 'green' : 'red'}>
                {active ? 'Aktif' : 'Nonaktif'}
              </Tag>
            )
          },
          {
            title: 'Users',
            dataIndex: '_count',
            key: 'users',
            render: (count) => (
              <Badge count={count?.users || 0} showZero />
            )
          },
          ...baseColumns
        ];

      case 'permissions':
        return [
          {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name'
          },
          {
            title: 'Display Name',
            dataIndex: 'displayName',
            key: 'displayName'
          },
          {
            title: 'Module',
            dataIndex: 'module',
            key: 'module',
            render: (module) => (
              <Tag color="purple">{module}</Tag>
            )
          },
          {
            title: 'Deskripsi',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
          },
          {
            title: 'Roles',
            dataIndex: '_count',
            key: 'roles',
            render: (count) => (
              <Badge count={count?.roles || 0} showZero />
            )
          },
          ...baseColumns
        ];

      case 'conversation-types':
        return [
          {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
              <Space>
                <Text strong>{text}</Text>
                {record.isSystem && <Tag color="blue" icon={<LockOutlined />}>System</Tag>}
              </Space>
            )
          },
          {
            title: 'Display Name',
            dataIndex: 'displayName',
            key: 'displayName'
          },
          {
            title: 'Max Participants',
            dataIndex: 'maxParticipants',
            key: 'maxParticipants',
            render: (max) => max ? max : 'Unlimited'
          },
          {
            title: 'File Upload',
            dataIndex: 'allowFileUpload',
            key: 'allowFileUpload',
            render: (allow) => (
              <Tag color={allow ? 'green' : 'red'}>
                {allow ? 'Ya' : 'Tidak'}
              </Tag>
            )
          },
          {
            title: 'Edit Message',
            dataIndex: 'allowEditMessage',
            key: 'allowEditMessage',
            render: (allow) => (
              <Tag color={allow ? 'green' : 'red'}>
                {allow ? 'Ya' : 'Tidak'}
              </Tag>
            )
          },
          ...baseColumns
        ];

      default:
        return [];
    }
  };

  // Form fields
  const getFormFields = () => {
    switch (activeTab) {
      case 'roles':
        return (
          <>
            <Form.Item
              name="name"
              label="Nama Role"
              rules={[{ required: true, message: 'Nama role wajib diisi!' }]}
            >
              <Input placeholder="ADMIN, GURU, SISWA" />
            </Form.Item>
            <Form.Item
              name="displayName"
              label="Display Name"
              rules={[{ required: true, message: 'Display name wajib diisi!' }]}
            >
              <Input placeholder="Administrator, Guru, Siswa" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Deskripsi"
            >
              <Input.TextArea rows={3} placeholder="Deskripsi role..." />
            </Form.Item>
            <Form.Item
              name="isActive"
              label="Status Aktif"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </>
        );

      case 'permissions':
        return (
          <>
            <Form.Item
              name="name"
              label="Nama Permission"
              rules={[{ required: true, message: 'Nama permission wajib diisi!' }]}
            >
              <Input placeholder="user.create, user.read" />
            </Form.Item>
            <Form.Item
              name="displayName"
              label="Display Name"
              rules={[{ required: true, message: 'Display name wajib diisi!' }]}
            >
              <Input placeholder="Create User, Read User" />
            </Form.Item>
            <Form.Item
              name="module"
              label="Module"
              rules={[{ required: true, message: 'Module wajib dipilih!' }]}
            >
              <Select placeholder="Pilih module">
                {modules.map(module => (
                  <Option key={module} value={module}>{module}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="description"
              label="Deskripsi"
            >
              <Input.TextArea rows={3} placeholder="Deskripsi permission..." />
            </Form.Item>
            <Form.Item
              name="isActive"
              label="Status Aktif"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </>
        );

      case 'conversation-types':
        return (
          <>
            <Form.Item
              name="name"
              label="Nama Tipe"
              rules={[{ required: true, message: 'Nama tipe wajib diisi!' }]}
            >
              <Input placeholder="private, group, announcement" />
            </Form.Item>
            <Form.Item
              name="displayName"
              label="Display Name"
              rules={[{ required: true, message: 'Display name wajib diisi!' }]}
            >
              <Input placeholder="Private Chat, Group Chat" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Deskripsi"
            >
              <Input.TextArea rows={3} placeholder="Deskripsi tipe percakapan..." />
            </Form.Item>
            <Form.Item
              name="maxParticipants"
              label="Maksimal Peserta"
            >
              <Input type="number" placeholder="Kosongkan untuk unlimited" />
            </Form.Item>
            <Form.Item
              name="allowFileUpload"
              label="Izinkan Upload File"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="allowEditMessage"
              label="Izinkan Edit Pesan"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="allowDeleteMessage"
              label="Izinkan Hapus Pesan"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="isActive"
              label="Status Aktif"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </>
        );

      default:
        return null;
    }
  };

  // Get current data
  const getCurrentData = () => {
    switch (activeTab) {
      case 'roles': return roles;
      case 'permissions': return permissions;
      case 'conversation-types': return conversationTypes;
      default: return [];
    }
  };

  return (
    <div className="master-admin-page">
      <Card title="Master Admin Panel" className="master-admin-card">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane 
            tab={
              <span>
                <TeamOutlined />
                Role Management
              </span>
            } 
            key="roles"
          >
            <div className="tab-content">
              <div className="tab-header">
                <Title level={4}>Manajemen Role</Title>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => showModal('roles')}
                >
                  Tambah Role
                </Button>
              </div>
              
              <Alert
                message="Role Management"
                description="Kelola role dan permission untuk user. System role tidak dapat dihapus atau dimodifikasi."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Table
                columns={getColumns()}
                dataSource={getCurrentData()}
                loading={loading}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} dari ${total} item`
                }}
              />
            </div>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <KeyOutlined />
                Permission Management
              </span>
            } 
            key="permissions"
          >
            <div className="tab-content">
              <div className="tab-header">
                <Title level={4}>Manajemen Permission</Title>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => showModal('permissions')}
                >
                  Tambah Permission
                </Button>
              </div>
              
              <Alert
                message="Permission Management"
                description="Kelola permission untuk role. Permission yang sudah di-assign ke role tidak dapat dihapus."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Table
                columns={getColumns()}
                dataSource={getCurrentData()}
                loading={loading}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} dari ${total} item`
                }}
              />
            </div>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <MessageOutlined />
                Conversation Types
              </span>
            } 
            key="conversation-types"
          >
            <div className="tab-content">
              <div className="tab-header">
                <Title level={4}>Manajemen Tipe Percakapan</Title>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => showModal('conversation-types')}
                >
                  Tambah Tipe
                </Button>
              </div>
              
              <Alert
                message="Conversation Type Management"
                description="Kelola tipe percakapan untuk chat system. System type tidak dapat dihapus."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Table
                columns={getColumns()}
                dataSource={getCurrentData()}
                loading={loading}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} dari ${total} item`
                }}
              />
            </div>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <DatabaseOutlined />
                System Overview
              </span>
            } 
            key="system"
          >
            <div className="tab-content">
              <Title level={4}>System Overview</Title>
              
              <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Total Users"
                      value={stats.totalUsers}
                      prefix={<UserOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Total Roles"
                      value={stats.totalRoles}
                      prefix={<TeamOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Total Permissions"
                      value={stats.totalPermissions}
                      prefix={<KeyOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Conversation Types"
                      value={stats.totalConversationTypes}
                      prefix={<MessageOutlined />}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Card title="Role Distribution">
                    <Statistic
                      title="System Roles"
                      value={stats.systemRoles}
                      prefix={<LockOutlined />}
                    />
                    <Divider />
                    <Statistic
                      title="Custom Roles"
                      value={stats.customRoles}
                      prefix={<UnlockOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="User Activity">
                    <Statistic
                      title="Active Users"
                      value={stats.activeUsers}
                      prefix={<UserOutlined />}
                    />
                    <Divider />
                    <Statistic
                      title="Inactive Users"
                      value={(stats.totalUsers || 0) - (stats.activeUsers || 0)}
                      prefix={<UserOutlined />}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal for Create/Edit */}
      <Modal
        title={`${editingItem ? 'Edit' : 'Tambah'} ${getItemName()}`}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText={editingItem ? 'Update' : 'Create'}
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
        >
          {getFormFields()}
        </Form>
      </Modal>
    </div>
  );
};

export default MasterAdminPage; 