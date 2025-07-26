import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Tag,
  Popconfirm,
  Tooltip,
  Card,
  Row,
  Col,
  Divider,
  Space,
  Typography,
  Checkbox,
  InputNumber,
  List,
  Avatar,
  Badge,
  Tabs
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  LinkOutlined,
  BookOutlined,
  CarOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Text, Title } = Typography;
const { TabPane } = Tabs;

export default function InvoicePage() {
  const [invoices, setInvoices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [showAddOnModal, setShowAddOnModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
    totalAmount: 0
  });

  // Add On Data
  const addOnBooks = [
    {
      id: 'book1',
      name: 'Buku HSK 1 Standard Course',
      price: 150000,
      category: 'book',
      description: 'Buku pelajaran resmi HSK 1 dengan CD audio',
      image: '📚',
      stock: 25
    },
    {
      id: 'book2',
      name: 'Workbook HSK 1',
      price: 85000,
      category: 'book',
      description: 'Buku latihan soal HSK 1',
      image: '📝',
      stock: 30
    },
    {
      id: 'book3',
      name: 'Buku Mandarin untuk Pemula',
      price: 120000,
      category: 'book',
      description: 'Buku dasar Mandarin dengan ilustrasi',
      image: '📖',
      stock: 20
    },
    {
      id: 'book4',
      name: 'Kamus Mandarin-Indonesia',
      price: 200000,
      category: 'book',
      description: 'Kamus lengkap Mandarin ke Indonesia',
      image: '📖',
      stock: 15
    }
  ];

  const addOnTransportation = [
    {
      id: 'transport1',
      name: 'Antar Jemput 1 Bulan',
      price: 500000,
      category: 'transportation',
      description: 'Antar jemput dari rumah ke kelas (1 bulan)',
      image: '🚗',
      duration: '1 bulan'
    },
    {
      id: 'transport2',
      name: 'Antar Jemput 3 Bulan',
      price: 1400000,
      category: 'transportation',
      description: 'Antar jemput dari rumah ke kelas (3 bulan)',
      image: '🚗',
      duration: '3 bulan'
    },
    {
      id: 'transport3',
      name: 'Antar Jemput 6 Bulan',
      price: 2500000,
      category: 'transportation',
      description: 'Antar jemput dari rumah ke kelas (6 bulan)',
      image: '🚗',
      duration: '6 bulan'
    },
    {
      id: 'transport4',
      name: 'Antar Jemput 1 Tahun',
      price: 4500000,
      category: 'transportation',
      description: 'Antar jemput dari rumah ke kelas (1 tahun)',
      image: '🚗',
      duration: '1 tahun'
    }
  ];

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('http://localhost:3000/invoice');
        if (response.ok) {
          const data = await response.json();
          setInvoices(data);
        } else {
          setInvoices([]);
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setInvoices([]);
      }
    };

    fetchInvoices();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/invoice/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setStats({
            total: 0,
            paid: 0,
            pending: 0,
            overdue: 0,
            totalAmount: 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          total: 0,
          paid: 0,
          pending: 0,
          overdue: 0,
          totalAmount: 0
        });
      }
    };

    fetchStats();
  }, []);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();

      // Calculate total with add-ons
      const baseAmount = values.amount || 0;
      const addOnTotal = selectedAddOns.reduce((sum, addon) => sum + (addon.price * addon.quantity), 0);
      const totalAmount = baseAmount + addOnTotal;

      // Prepare items array
      const items = [
        { name: values.description, quantity: 1, price: baseAmount }
      ];

      // Add selected add-ons to items
      selectedAddOns.forEach(addon => {
        items.push({
          name: `${addon.name} (Add On)`,
          quantity: addon.quantity,
          price: addon.price
        });
      });

      const response = await fetch('http://localhost:3000/finance/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: values.studentId || null,
          studentName: values.studentName,
          studentAvatar: values.studentName.split(' ').map(n => n[0]).join('').toUpperCase(),
          amount: totalAmount,
          dueDate: values.dueDate.format('YYYY-MM-DD'),
          description: values.description,
          items: items,
          addOns: selectedAddOns
        }),
      });

      if (response.ok) {
        message.success('Invoice dengan Add On berhasil ditambah!');
        setModalOpen(false);
        setSelectedAddOns([]);
        form.resetFields();
        fetchInvoices();
      } else {
        message.error('Gagal menambah invoice');
      }
    } catch (error) {
      console.error('Error adding invoice:', error);
      message.error('Gagal menambah invoice');
    }
  };

  const addToCart = (addon) => {
    const existing = selectedAddOns.find(item => item.id === addon.id);
    if (existing) {
      setSelectedAddOns(selectedAddOns.map(item =>
        item.id === addon.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedAddOns([...selectedAddOns, { ...addon, quantity: 1 }]);
    }
    message.success(`${addon.name} ditambahkan ke keranjang!`);
  };

  const removeFromCart = (addonId) => {
    setSelectedAddOns(selectedAddOns.filter(item => item.id !== addonId));
    message.info('Item dihapus dari keranjang');
  };

  const updateQuantity = (addonId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(addonId);
    } else {
      setSelectedAddOns(selectedAddOns.map(item =>
        item.id === addonId ? { ...item, quantity } : item
      ));
    }
  };

  const getTotalAddOnPrice = () => {
    return selectedAddOns.reduce((sum, addon) => sum + (addon.price * addon.quantity), 0);
  };

  const columns = [
    { title: 'No', dataIndex: 'id', key: 'id' },
    { title: 'Invoice No', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
    { title: 'Nama Siswa', dataIndex: 'studentName', key: 'studentName' },
    { title: 'Deskripsi', dataIndex: 'description', key: 'description' },
    { title: 'Tanggal', dataIndex: 'createdAt', key: 'createdAt', render: d => d ? new Date(d).toLocaleDateString() : '-' },
    { title: 'Jatuh Tempo', dataIndex: 'dueDate', key: 'dueDate', render: d => d ? new Date(d).toLocaleDateString() : '-' },
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
      render: (v, record) => {
        const baseAmount = v || 0;
        const addOnAmount = record.addOns ? record.addOns.reduce((sum, addon) => sum + (addon.price * addon.quantity), 0) : 0;
        const total = baseAmount + addOnAmount;
        return (
          <div>
            <div><b>Rp {total.toLocaleString()}</b></div>
            {addOnAmount > 0 && (
              <div style={{ fontSize: '12px', color: '#666' }}>
                + Add On: Rp {addOnAmount.toLocaleString()}
              </div>
            )}
          </div>
        );
      }
    },
    {
      title: 'Add On',
      dataIndex: 'addOns',
      key: 'addOns',
      render: (addOns) => {
        if (!addOns || addOns.length === 0) return '-';
        return (
          <div>
            {addOns.map((addon, index) => (
              <Tag key={index} color={addon.category === 'book' ? 'blue' : 'green'}>
                {addon.image} {addon.name} (x{addon.quantity})
              </Tag>
            ))}
          </div>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: s => {
        const color = s === 'paid' ? 'green' : s === 'pending' ? 'orange' : 'red';
        const text = s === 'paid' ? 'LUNAS' : s === 'pending' ? 'PENDING' : 'OVERDUE';
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: 'Aksi',
      key: 'aksi',
      render: (_, invoice) => (
        <>
          <Button
            icon={<LinkOutlined />}
            size="small"
            onClick={async () => {
              try {
                const res = await fetch(`http://localhost:3000/finance/invoices/${invoice.id}/payment-link`, { method: 'POST' });
                const data = await res.json();
                if (data.success) {
                  message.success('Payment link berhasil dibuat!');
                  window.open(data.paymentLink, '_blank');
                } else {
                  message.error('Gagal membuat payment link');
                }
              } catch (error) {
                console.error('Error creating payment link:', error);
                message.error('Gagal membuat payment link');
              }
            }}
            disabled={!!invoice.paymentLink}
            style={{ marginRight: 8 }}
          >
            {invoice.paymentLink ? 'Link Tersedia' : 'Generate Link'}
          </Button>
          {invoice.paymentLink && (
            <Tooltip title="Buka Payment Link">
              <a href={invoice.paymentLink} target="_blank" rel="noopener noreferrer">
                <Button icon={<LinkOutlined />} size="small" />
              </a>
            </Tooltip>
          )}
          <Button
            size="small"
            onClick={async () => {
              // Fetch jurnal terkait invoice (misal: by description)
              const res = await fetch(`http://localhost:3000/journals?desc=Invoice%20#${invoice.id}`);
              const data = await res.json();
              // Tampilkan modal dengan data jurnal
              // (implementasi modal detail jurnal sesuai kebutuhan)
            }}
          >
            Lihat Jurnal
          </Button>
          <Popconfirm
            title="Batalkan invoice ini?"
            onConfirm={async () => {
              try {
                await fetch(`http://localhost:3000/finance/invoices/${invoice.id}`, { method: 'DELETE' });
                message.success('Invoice dibatalkan!');
                fetchInvoices();
              } catch (error) {
                console.error('Error deleting invoice:', error);
                message.error('Gagal membatalkan invoice');
              }
            }}
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px #0001' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>📋 Daftar Invoice</Title>
          <Text type="secondary">Kelola invoice dengan Add On buku dan transportasi</Text>
        </div>
        <Space>
          <Button
            type="default"
            icon={<ShoppingCartOutlined />}
            onClick={() => setShowAddOnModal(true)}
          >
            Lihat Add On
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setSelectedAddOns([]);
              setModalOpen(true);
            }}
          >
            Tambah Invoice
          </Button>
        </Space>
      </div>

      <Table columns={columns} dataSource={invoices || []} rowKey="id" pagination={{ pageSize: 8 }} />

      {/* Add Invoice Modal */}
      <Modal
        title="Tambah Invoice dengan Add On"
        open={modalOpen}
        onOk={handleAdd}
        onCancel={() => setModalOpen(false)}
        okText="Tambah Invoice"
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="studentName" label="Nama Siswa" rules={[{ required: true }]}>
                <Input placeholder="Masukkan nama siswa" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dueDate" label="Jatuh Tempo" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Deskripsi Paket" rules={[{ required: true }]}>
            <Input placeholder="Contoh: Paket Mandarin Basic 10 Sesi" />
          </Form.Item>

          <Form.Item name="amount" label="Harga Paket (Rp)" rules={[{ required: true }]}>
            <InputNumber
              style={{ width: '100%' }}
              placeholder="2500000"
              formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\Rp\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Divider>Add On Items</Divider>

          <div style={{ marginBottom: 16 }}>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => setShowAddOnModal(true)}
              style={{ width: '100%' }}
            >
              Pilih Add On
            </Button>
          </div>

          {selectedAddOns.length > 0 && (
            <Card size="small" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text strong>Keranjang Add On:</Text>
                <Badge count={selectedAddOns.length} />
              </div>
              <List
                size="small"
                dataSource={selectedAddOns}
                renderItem={(addon) => (
                  <List.Item
                    actions={[
                      <InputNumber
                        size="small"
                        min={1}
                        value={addon.quantity}
                        onChange={(value) => updateQuantity(addon.id, value)}
                        style={{ width: 80 }}
                      />,
                      <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeFromCart(addon.id)}
                      />
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={addon.image} />}
                      title={addon.name}
                      description={`Rp ${addon.price.toLocaleString()} x ${addon.quantity}`}
                    />
                  </List.Item>
                )}
              />
              <Divider style={{ margin: '12px 0' }} />
              <div style={{ textAlign: 'right' }}>
                <Text strong>Total Add On: Rp {getTotalAddOnPrice().toLocaleString()}</Text>
              </div>
            </Card>
          )}

          <Divider />

          <div style={{ textAlign: 'right', padding: '16px', background: '#f5f5f5', borderRadius: 8 }}>
            <div style={{ marginBottom: 8 }}>
              <Text>Harga Paket: Rp {(form.getFieldValue('amount') || 0).toLocaleString()}</Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text>Total Add On: Rp {getTotalAddOnPrice().toLocaleString()}</Text>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div>
              <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                Total: Rp {((form.getFieldValue('amount') || 0) + getTotalAddOnPrice()).toLocaleString()}
              </Title>
            </div>
          </div>
        </Form>
      </Modal>

      {/* Add On Selection Modal */}
      <Modal
        title="Pilih Add On"
        open={showAddOnModal}
        onCancel={() => setShowAddOnModal(false)}
        footer={null}
        width={1000}
      >
        <Tabs defaultActiveKey="books">
          <TabPane tab={<span><BookOutlined />Buku Pelajaran</span>} key="books">
            <Row gutter={[16, 16]}>
              {addOnBooks.map(book => (
                <Col span={12} key={book.id}>
                  <Card
                    hoverable
                    actions={[
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => addToCart(book)}
                      >
                        Tambah ke Keranjang
                      </Button>
                    ]}
                  >
                    <Card.Meta
                      avatar={<Avatar size={48} icon={book.image} />}
                      title={book.name}
                      description={
                        <div>
                          <div>{book.description}</div>
                          <div style={{ marginTop: 8 }}>
                            <Text strong style={{ color: '#1890ff' }}>
                              Rp {book.price.toLocaleString()}
                            </Text>
                          </div>
                          <div style={{ marginTop: 4 }}>
                            <Text type="secondary">Stok: {book.stock}</Text>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>

          <TabPane tab={<span><CarOutlined />Transportasi</span>} key="transportation">
            <Row gutter={[16, 16]}>
              {addOnTransportation.map(transport => (
                <Col span={12} key={transport.id}>
                  <Card
                    hoverable
                    actions={[
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => addToCart(transport)}
                      >
                        Tambah ke Keranjang
                      </Button>
                    ]}
                  >
                    <Card.Meta
                      avatar={<Avatar size={48} icon={transport.image} />}
                      title={transport.name}
                      description={
                        <div>
                          <div>{transport.description}</div>
                          <div style={{ marginTop: 8 }}>
                            <Text strong style={{ color: '#1890ff' }}>
                              Rp {transport.price.toLocaleString()}
                            </Text>
                          </div>
                          <div style={{ marginTop: 4 }}>
                            <Text type="secondary">Durasi: {transport.duration}</Text>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}
