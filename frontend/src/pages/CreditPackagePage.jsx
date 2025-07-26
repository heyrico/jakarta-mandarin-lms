import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Tag, 
  Space, 
  Avatar, 
  Tooltip, 
  message,
  Row,
  Col,
  Statistic,
  Progress,
  Badge,
  Divider,
  Alert,
  Typography,
  Switch
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  SearchOutlined,
  CalendarOutlined,
  TeamOutlined,
  TrophyOutlined,
  ExclamationCircleOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import './CreditPackagePage.css';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const CreditPackagePage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({
    totalPackages: 0,
    totalSales: 0,
    totalRevenue: 0,
    activePackages: 0,
    popularPackage: null
  });

  useEffect(() => {
    const fetchCreditPackages = async () => {
      try {
        const response = await fetch('http://localhost:3000/credit-package');
        if (response.ok) {
          const data = await response.json();
          setPackages(data);
        } else {
          setPackages([]);
        }
      } catch (error) {
        console.error('Error fetching credit packages:', error);
        setPackages([]);
      }
    };

    fetchCreditPackages();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch stats from backend
      const response = await fetch('http://localhost:3000/credit/packages/stats');
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalPackages: data.totalPackages || 0,
          totalSales: data.totalSales || 0,
          totalRevenue: data.totalRevenue || 0,
          activePackages: data.activePackages || 0,
          popularPackage: data.mostPopular || 'Tidak ada'
        });
      } else {
        setStats({
          totalPackages: 0,
          totalSales: 0,
          totalRevenue: 0,
          activePackages: 0,
          popularPackage: 'Tidak ada'
        });
      }
    } catch (error) {
      setStats({
        totalPackages: 0,
        totalSales: 0,
        totalRevenue: 0,
        activePackages: 0,
        popularPackage: 'Tidak ada'
      });
    }
  };

  const handleAddPackage = () => {
    setModalVisible(true);
    form.resetFields();
  };

  const handleEditPackage = (record) => {
    setEditingPackage(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      price: record.price,
      creditHours: record.creditHours,
      packageType: record.packageType,
      isActive: record.isActive
    });
    setModalVisible(true);
  };

  const handleViewPackage = (record) => {
    setSelectedPackage(record);
    setDetailModalVisible(true);
  };

  const handleDeletePackage = (id) => {
    Modal.confirm({
      title: 'Hapus Paket Kredit',
      content: 'Apakah Anda yakin ingin menghapus paket kredit ini?',
      okText: 'Ya',
      cancelText: 'Tidak',
      onOk: () => {
        setPackages(packages.filter(pkg => pkg.id !== id));
        message.success('Paket kredit berhasil dihapus');
      }
    });
  };

  const handleSubmit = async (values) => {
    try {
      if (editingPackage) {
        // Update existing package
        setPackages(packages.map(pkg => 
          pkg.id === editingPackage.id 
            ? { ...pkg, ...values, updatedAt: new Date().toISOString().split('T')[0] }
            : pkg
        ));
        message.success('Paket kredit berhasil diupdate');
      } else {
        // Create new package
        const newPackage = {
          id: packages.length + 1,
          ...values,
          totalSales: 0,
          totalRevenue: 0,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        setPackages([newPackage, ...packages]);
        message.success('Paket kredit berhasil dibuat');
      }
      
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Terjadi kesalahan!');
    }
  };

  const handleExportReport = () => {
    // Simulasi export report ke Excel (CSV format)
    const headers = ['Nama Paket', 'Harga', 'Jam Kredit', 'Tipe Paket', 'Total Penjualan', 'Tanggal Dibuat'];
    const csvData = packages.map(pkg => [
      pkg.name,
      `Rp ${pkg.price.toLocaleString()}`,
      pkg.creditHours,
      pkg.packageType,
      pkg.totalSales,
      pkg.createdAt
    ]);
    
    // Gabungkan headers dan data
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    // Download file CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credit-packages-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    message.success('Report Excel berhasil di-export!');
  };

  const getPackageTypeColor = (type) => {
    switch (type) {
      case 'BUNDLE': return 'green';
      case 'SATUAN': return 'blue';
      default: return 'default';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'green' : 'red';
  };

  const getStatusIcon = (isActive) => {
    return isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />;
  };

  const columns = [
    {
      title: 'Paket Kredit',
      key: 'package',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{record.name}</div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
            {record.description}
          </div>
          <div style={{ marginTop: 8 }}>
            <Tag color={getPackageTypeColor(record.packageType)}>
              {record.packageType === 'BUNDLE' ? 'Bundle' : 'Satuan'}
            </Tag>
            <Tag color={getStatusColor(record.isActive)} icon={getStatusIcon(record.isActive)}>
              {record.isActive ? 'Aktif' : 'Tidak Aktif'}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Harga & Jam',
      key: 'price',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#10B981' }}>
            Rp {record.price.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
            <ClockCircleOutlined /> {record.creditHours} jam kredit
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Rp {(record.price / record.creditHours).toLocaleString()}/jam
          </div>
        </div>
      ),
    },
    {
      title: 'Penjualan',
      key: 'sales',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
            {record.totalSales} paket terjual
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
            Total: Rp {record.totalRevenue.toLocaleString()}
          </div>
          <Progress 
            percent={Math.round((record.totalSales / 30) * 100)} 
            size="small" 
            strokeColor="#8B5CF6"
            showInfo={false}
          />
        </div>
      ),
    },
    {
      title: 'Tanggal',
      key: 'date',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Dibuat: {new Date(record.createdAt).toLocaleDateString('id-ID')}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Update: {new Date(record.updatedAt).toLocaleDateString('id-ID')}
          </div>
        </div>
      ),
    },
    {
      title: 'Aksi',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Paket">
            <Button 
              type="primary" 
              size="small"
              icon={<EditOutlined />} 
              onClick={() => handleEditPackage(record)}
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                border: 'none'
              }}
            />
          </Tooltip>
                     <Tooltip title="Lihat Detail">
             <Button 
               type="default" 
               size="small"
               icon={<EyeOutlined />} 
               onClick={() => handleViewPackage(record)}
             />
           </Tooltip>
          <Tooltip title="Hapus Paket">
            <Button 
              type="text" 
              size="small"
              icon={<DeleteOutlined />} 
              danger
              onClick={() => handleDeletePackage(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="credit-package-container">
      <div className="credit-package-header">
        <h1>Manajemen Paket Kredit</h1>
        <p>Kelola paket kredit Jakarta Mandarin - Sistem Dompet Digital</p>
      </div>

      {/* Alert */}
      <Alert
        message="Sistem Kredit Jakarta Mandarin"
        description="Paket Bundle akan otomatis membuat tagihan baru saat saldo siswa menipis. Paket Satuan tidak ada penagihan otomatis."
        type="info"
        showIcon
        icon={<ExclamationCircleOutlined />}
        style={{ marginBottom: 24 }}
        action={
          <Button size="small" type="primary">
            Pelajari Lebih Lanjut
          </Button>
        }
      />

      {/* Statistik */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Total Paket"
              value={stats.totalPackages}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#8B5CF6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Paket Aktif"
              value={stats.activePackages}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#10B981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Total Penjualan"
              value={stats.totalSales}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#F59E0B' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#10B981' }}
              formatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Paket Terpopuler"
              value={stats.popularPackage}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#EC4899' }}
              formatter={(value) => value?.split(' ')[2] || '-'}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card className="action-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, color: '#1e293b' }}>Aksi Cepat</h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
                  Buat dan kelola paket kredit untuk sistem dompet digital siswa
                </p>
              </div>
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  size="large"
                  onClick={handleAddPackage}
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    border: 'none'
                  }}
                >
                  Tambah Paket
                </Button>
                <Button 
                  type="default" 
                  icon={<FileTextOutlined />} 
                  size="large"
                  onClick={handleExportReport}
                >
                  Export Report
                </Button>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tabel Paket Kredit */}
      <Card 
        title="Daftar Paket Kredit" 
        className="table-card"
        extra={
          <Input.Search
            placeholder="Cari paket kredit"
            style={{ width: 250 }}
            onSearch={(value) => message.info(`Mencari: ${value}`)}
          />
        }
      >
        <Table
          columns={columns}
          dataSource={packages}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} dari ${total} paket`
          }}
        />
      </Card>

      {/* Modal Form */}
      <Modal
        title={editingPackage ? 'Edit Paket Kredit' : 'Tambah Paket Kredit'}
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => setModalVisible(false)}
        okText={editingPackage ? 'Update' : 'Tambah'}
        cancelText="Batal"
        width={600}
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSubmit}
          initialValues={{
            packageType: 'SATUAN',
            isActive: true
          }}
        >
          <Form.Item 
            name="name" 
            label="Nama Paket" 
            rules={[{ required: true, message: 'Nama paket wajib diisi' }]}
          >
            <Input placeholder="Contoh: Paket 20 Jam Private" />
          </Form.Item>
          
          <Form.Item 
            name="description" 
            label="Deskripsi"
          >
            <TextArea 
              rows={3} 
              placeholder="Deskripsi paket kredit..."
            />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="price" 
                label="Harga (Rp)" 
                rules={[{ required: true, message: 'Harga wajib diisi' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="5000000"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="creditHours" 
                label="Jumlah Jam" 
                rules={[{ required: true, message: 'Jumlah jam wajib diisi' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="20"
                  min={1}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item 
            name="packageType" 
            label="Tipe Paket" 
            rules={[{ required: true, message: 'Tipe paket wajib dipilih' }]}
          >
            <Select placeholder="Pilih tipe paket">
              <Option value="SATUAN">Satuan (Tidak ada penagihan otomatis)</Option>
              <Option value="BUNDLE">Bundle (Penagihan otomatis saat saldo menipis)</Option>
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="isActive" 
            label="Status Aktif"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="Aktif" 
              unCheckedChildren="Tidak Aktif" 
            />
          </Form.Item>
                 </Form>
       </Modal>

       {/* Modal Detail Paket */}
       <Modal
         title="Detail Paket Kredit"
         open={detailModalVisible}
         onCancel={() => setDetailModalVisible(false)}
         footer={[
           <Button key="close" onClick={() => setDetailModalVisible(false)}>
             Tutup
           </Button>,
           <Button 
             key="edit" 
             type="primary"
             onClick={() => {
               setDetailModalVisible(false);
               handleEditPackage(selectedPackage);
             }}
             style={{
               background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
               border: 'none'
             }}
           >
             Edit Paket
           </Button>
         ]}
         width={600}
       >
         {selectedPackage && (
           <div style={{ padding: '16px 0' }}>
             <Row gutter={[16, 16]}>
               <Col span={24}>
                 <Card 
                   title="Informasi Paket" 
                   size="small"
                   style={{ marginBottom: 16 }}
                 >
                   <Row gutter={[16, 8]}>
                     <Col span={12}>
                       <Text strong>Nama Paket:</Text>
                       <br />
                       <Text>{selectedPackage.name}</Text>
                     </Col>
                     <Col span={12}>
                       <Text strong>Status:</Text>
                       <br />
                       <Tag color={selectedPackage.isActive ? 'green' : 'red'}>
                         {selectedPackage.isActive ? 'Aktif' : 'Tidak Aktif'}
                       </Tag>
                     </Col>
                     <Col span={24}>
                       <Text strong>Deskripsi:</Text>
                       <br />
                       <Text>{selectedPackage.description}</Text>
                     </Col>
                   </Row>
                 </Card>
               </Col>
               
               <Col span={12}>
                 <Card title="Harga & Jam" size="small">
                   <Statistic
                     title="Harga Paket"
                     value={selectedPackage.price}
                     prefix="Rp "
                     valueStyle={{ color: '#10B981', fontSize: '18px' }}
                     formatter={(value) => value.toLocaleString()}
                   />
                   <Divider />
                   <Statistic
                     title="Jam Kredit"
                     value={selectedPackage.creditHours}
                     suffix=" jam"
                     valueStyle={{ color: '#8B5CF6', fontSize: '16px' }}
                   />
                   <Divider />
                   <Statistic
                     title="Harga per Jam"
                     value={selectedPackage.price / selectedPackage.creditHours}
                     prefix="Rp "
                     valueStyle={{ color: '#F59E0B', fontSize: '14px' }}
                     formatter={(value) => Math.round(value).toLocaleString()}
                   />
                 </Card>
               </Col>
               
               <Col span={12}>
                 <Card title="Tipe Paket" size="small">
                   <Tag 
                     color={selectedPackage.packageType === 'BUNDLE' ? 'green' : 'blue'}
                     style={{ fontSize: '14px', padding: '8px 12px' }}
                   >
                     {selectedPackage.packageType === 'BUNDLE' ? 'Bundle' : 'Satuan'}
                   </Tag>
                   <Divider />
                   <Text strong>Karakteristik:</Text>
                   <br />
                   <Text>
                     {selectedPackage.packageType === 'BUNDLE' 
                       ? '• Penagihan otomatis saat saldo menipis\n• Cocok untuk siswa regular'
                       : '• Tidak ada penagihan otomatis\n• Cocok untuk siswa trial/private'
                     }
                   </Text>
                 </Card>
               </Col>
               
               <Col span={12}>
                 <Card title="Statistik Penjualan" size="small">
                   <Statistic
                     title="Total Terjual"
                     value={selectedPackage.totalSales}
                     suffix=" paket"
                     valueStyle={{ color: '#8B5CF6' }}
                   />
                   <Divider />
                   <Statistic
                     title="Total Revenue"
                     value={selectedPackage.totalRevenue}
                     prefix="Rp "
                     valueStyle={{ color: '#10B981' }}
                     formatter={(value) => (value / 1000000).toFixed(1) + 'M'}
                   />
                   <Divider />
                   <Progress 
                     percent={Math.round((selectedPackage.totalSales / 30) * 100)} 
                     strokeColor="#8B5CF6"
                     format={(percent) => `${percent}% dari target`}
                   />
                 </Card>
               </Col>
               
               <Col span={12}>
                 <Card title="Tanggal" size="small">
                   <Row gutter={[8, 8]}>
                     <Col span={24}>
                       <Text strong>Dibuat:</Text>
                       <br />
                       <Text>{new Date(selectedPackage.createdAt).toLocaleDateString('id-ID', {
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric'
                       })}</Text>
                     </Col>
                     <Col span={24}>
                       <Text strong>Update Terakhir:</Text>
                       <br />
                       <Text>{new Date(selectedPackage.updatedAt).toLocaleDateString('id-ID', {
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric'
                       })}</Text>
                     </Col>
                   </Row>
                 </Card>
               </Col>
             </Row>
           </div>
         )}
       </Modal>
     </div>
   );
 };

export default CreditPackagePage; 