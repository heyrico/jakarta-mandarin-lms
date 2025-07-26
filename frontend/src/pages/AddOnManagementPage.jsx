import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Tag,
  Popconfirm,
  Card,
  Row,
  Col,
  Space,
  Typography,
  Switch,
  Upload,
  Avatar,
  Divider,
  Alert,
  Tabs,
  Badge,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  CarOutlined,
  UploadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Text, Title } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

export default function AddOnManagementPage() {
  const [addOns, setAddOns] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddOn, setEditingAddOn] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAddOns = async () => {
      try {
        const response = await fetch('http://localhost:3000/addon');
        if (response.ok) {
          const data = await response.json();
          setAddOns(data);
        } else {
          setAddOns([]);
        }
      } catch (error) {
        console.error('Error fetching add-ons:', error);
        setAddOns([]);
      }
    };

    fetchAddOns();
  }, []);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const newAddOn = {
        id: editingAddOn ? editingAddOn.id : `addon_${Date.now()}`,
        ...values,
        isActive: values.isActive !== undefined ? values.isActive : true,
        createdAt: editingAddOn ? editingAddOn.createdAt : new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      if (editingAddOn) {
        // Update existing add-on
        const updatedAddOns = addOns.map(item => 
          item.id === editingAddOn.id ? newAddOn : item
        );
        setAddOns(updatedAddOns);
        message.success('Add On berhasil diupdate!');
      } else {
        // Add new add-on
        const updatedAddOns = [...addOns, newAddOn];
        setAddOns(updatedAddOns);
        message.success('Add On berhasil ditambah!');
      }

      setModalOpen(false);
      setEditingAddOn(null);
      form.resetFields();
    } catch (error) {
      console.error('Error saving add-on:', error);
      message.error('Gagal menyimpan Add On');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (addOn) => {
    setEditingAddOn(addOn);
    form.setFieldsValue({
      name: addOn.name,
      price: addOn.price,
      category: addOn.category,
      description: addOn.description,
      image: addOn.image,
      stock: addOn.stock,
      duration: addOn.duration,
      isActive: addOn.isActive
    });
    setModalOpen(true);
  };

  const handleDelete = (addOnId) => {
    const updatedAddOns = addOns.filter(item => item.id !== addOnId);
    setAddOns(updatedAddOns);
    message.success('Add On berhasil dihapus!');
  };

  const handleToggleStatus = (addOnId) => {
    const updatedAddOns = addOns.map(item => 
      item.id === addOnId ? { ...item, isActive: !item.isActive } : item
    );
    setAddOns(updatedAddOns);
    message.success('Status Add On berhasil diubah!');
  };

  const getCategoryIcon = (category) => {
    return category === 'book' ? <BookOutlined /> : <CarOutlined />;
  };

  const getCategoryColor = (category) => {
    return category === 'book' ? 'blue' : 'green';
  };

  const getCategoryText = (category) => {
    return category === 'book' ? 'Buku' : 'Transportasi';
  };

  const columns = [
    {
      title: 'Info',
      key: 'info',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar size={48} icon={record.image} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{record.name}</div>
            <div style={{ color: '#666', fontSize: 12 }}>{record.description}</div>
            <div style={{ marginTop: 4 }}>
              <Tag color={getCategoryColor(record.category)} icon={getCategoryIcon(record.category)}>
                {getCategoryText(record.category)}
              </Tag>
              {record.duration && (
                <Tag color="orange">Durasi: {record.duration}</Tag>
              )}
            </div>
          </div>
        </div>
      ),
      width: 300
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: '#1890ff', fontSize: 16 }}>
            Rp {price.toLocaleString()}
          </div>
        </div>
      ),
      width: 120
    },
    {
      title: 'Stok/Durasi',
      key: 'stock',
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          {record.category === 'book' ? (
            <div>
              <div style={{ fontWeight: 600 }}>{record.stock}</div>
              <div style={{ fontSize: 12, color: '#666' }}>Stok</div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: 600 }}>{record.duration}</div>
              <div style={{ fontSize: 12, color: '#666' }}>Durasi</div>
            </div>
          )}
        </div>
      ),
      width: 100
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive, record) => (
        <div style={{ textAlign: 'center' }}>
          <Switch
            checked={isActive}
            onChange={() => handleToggleStatus(record.id)}
            checkedChildren={<EyeOutlined />}
            unCheckedChildren={<EyeInvisibleOutlined />}
          />
          <div style={{ marginTop: 4 }}>
            <Tag color={isActive ? 'green' : 'red'}>
              {isActive ? 'Aktif' : 'Nonaktif'}
            </Tag>
          </div>
        </div>
      ),
      width: 100
    },
    {
      title: 'Update Terakhir',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12 }}>{new Date(date).toLocaleDateString()}</div>
        </div>
      ),
      width: 120
    },
    {
      title: 'Aksi',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Add On">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Hapus Add On ini?"
            description="Add On yang dihapus tidak bisa dikembalikan"
            onConfirm={() => handleDelete(record.id)}
            okText="Ya, Hapus"
            cancelText="Batal"
          >
            <Tooltip title="Hapus Add On">
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
      width: 120
    }
  ];

  const bookAddOns = addOns.filter(item => item.category === 'book');
  const transportAddOns = addOns.filter(item => item.category === 'transportation');

  const stats = {
    total: addOns.length,
    books: bookAddOns.length,
    transport: transportAddOns.length,
    active: addOns.filter(item => item.isActive).length,
    inactive: addOns.filter(item => !item.isActive).length
  };

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px #0001' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>🛠️ Manajemen Add On</Title>
          <Text type="secondary">Kelola Add On buku dan transportasi</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingAddOn(null);
            form.resetFields();
            setModalOpen(true);
          }}
        >
          Tambah Add On
        </Button>
      </div>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1890ff' }}>{stats.total}</div>
              <div style={{ fontSize: 12, color: '#666' }}>Total Add On</div>
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#52c41a' }}>{stats.active}</div>
              <div style={{ fontSize: 12, color: '#666' }}>Aktif</div>
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#faad14' }}>{stats.books}</div>
              <div style={{ fontSize: 12, color: '#666' }}>Buku</div>
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#13c2c2' }}>{stats.transport}</div>
              <div style={{ fontSize: 12, color: '#666' }}>Transport</div>
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#f5222d' }}>{stats.inactive}</div>
              <div style={{ fontSize: 12, color: '#666' }}>Nonaktif</div>
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#722ed1' }}>
                Rp {addOns.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>Total Nilai</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="all">
        <TabPane tab={`Semua (${addOns.length})`} key="all">
          <Table
            columns={columns}
            dataSource={addOns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            loading={loading}
          />
        </TabPane>
        <TabPane tab={`Buku (${bookAddOns.length})`} key="books">
          <Table
            columns={columns}
            dataSource={bookAddOns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            loading={loading}
          />
        </TabPane>
        <TabPane tab={`Transportasi (${transportAddOns.length})`} key="transportation">
          <Table
            columns={columns}
            dataSource={transportAddOns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            loading={loading}
          />
        </TabPane>
      </Tabs>

      {/* Add/Edit Modal */}
      <Modal
        title={editingAddOn ? 'Edit Add On' : 'Tambah Add On Baru'}
        open={modalOpen}
        onOk={handleAdd}
        onCancel={() => {
          setModalOpen(false);
          setEditingAddOn(null);
          form.resetFields();
        }}
        okText={editingAddOn ? 'Update' : 'Tambah'}
        width={600}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Nama Add On"
                rules={[{ required: true, message: 'Nama Add On wajib diisi!' }]}
              >
                <Input placeholder="Contoh: Buku HSK 1 Standard Course" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Kategori"
                rules={[{ required: true, message: 'Kategori wajib dipilih!' }]}
              >
                <Select placeholder="Pilih kategori">
                  <Option value="book">📚 Buku Pelajaran</Option>
                  <Option value="transportation">🚗 Transportasi</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Deskripsi"
            rules={[{ required: true, message: 'Deskripsi wajib diisi!' }]}
          >
            <TextArea
              rows={3}
              placeholder="Deskripsi detail tentang Add On ini..."
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Harga (Rp)"
                rules={[{ required: true, message: 'Harga wajib diisi!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="150000"
                  formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\Rp\s?|(,*)/g, '')}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="image"
                label="Emoji/Icon"
                rules={[{ required: true, message: 'Icon wajib diisi!' }]}
              >
                <Input placeholder="📚" maxLength={2} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isActive"
                label="Status"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Aktif"
                  unCheckedChildren="Nonaktif"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.category !== currentValues.category}
          >
            {({ getFieldValue }) => {
              const category = getFieldValue('category');
              return category === 'book' ? (
                <Form.Item
                  name="stock"
                  label="Stok"
                  rules={[{ required: true, message: 'Stok wajib diisi!' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="25"
                    min={0}
                  />
                </Form.Item>
              ) : category === 'transportation' ? (
                <Form.Item
                  name="duration"
                  label="Durasi"
                  rules={[{ required: true, message: 'Durasi wajib diisi!' }]}
                >
                  <Input placeholder="Contoh: 1 bulan, 3 bulan, 6 bulan, 1 tahun" />
                </Form.Item>
              ) : null;
            }}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 