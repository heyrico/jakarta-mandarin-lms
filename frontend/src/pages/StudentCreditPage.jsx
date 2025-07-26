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
  Switch,
  Tabs,
  Descriptions,
  List,
  Timeline
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
  UserOutlined,
  SearchOutlined,
  CalendarOutlined,
  TeamOutlined,
  TrophyOutlined,
  ExclamationCircleOutlined,
  WalletOutlined,
  HistoryOutlined,
  ReloadOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  CreditCardOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import './StudentCreditPage.css';

const { Option } = Select;
const { TextArea } = Input;
const { Text, Title } = Typography;
const { TabPane } = Tabs;

const StudentCreditPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCredits: 0,
    totalCreditHours: 0,
    lowBalanceStudents: 0,
    expiredCredits: 0
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:3000/user?role=SISWA');
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        } else {
          setStudents([]);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents([]);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchCreditPackages = async () => {
      try {
        const response = await fetch('http://localhost:3000/credit-package');
        if (response.ok) {
          const data = await response.json();
          setCreditPackages(data);
        } else {
          setCreditPackages([]);
        }
      } catch (error) {
        console.error('Error fetching credit packages:', error);
        setCreditPackages([]);
      }
    };

    fetchCreditPackages();
  }, []);

  useEffect(() => {
    const fetchStudentCredits = async () => {
      try {
        const response = await fetch('http://localhost:3000/student-credit');
        if (response.ok) {
          const data = await response.json();
          setStudentCredits(data);
        } else {
          setStudentCredits([]);
        }
      } catch (error) {
        console.error('Error fetching student credits:', error);
        setStudentCredits([]);
      }
    };

    fetchStudentCredits();
  }, []);

  const fetchStats = async () => {
    try {
      setStats({
        totalStudents: 4,
        activeCredits: 3,
        totalCreditHours: 195,
        lowBalanceStudents: 1,
        expiredCredits: 1
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleViewStudent = (record) => {
    setSelectedStudent(record);
    setDetailModalVisible(true);
  };

  const handleAdjustCredit = (studentId) => {
    Modal.confirm({
      title: 'Adjust Credit Siswa',
      content: 'Apakah Anda yakin ingin menyesuaikan kredit siswa ini?',
      okText: 'Ya, Adjust',
      cancelText: 'Batal',
      onOk: () => {
        message.success('Kredit siswa berhasil disesuaikan!');
      }
    });
  };

  const handleSubmitAdjustment = (values) => {
    console.log('Adjustment values:', values);
    message.success('Penyesuaian saldo berhasil disimpan!');
    setModalVisible(false);
    form.resetFields();
  };

  const handleExportReport = () => {
    // Simulasi export report ke Excel (CSV format)
    const headers = ['Nama Siswa', 'Email', 'Telepon', 'Saldo Tersisa (Jam)', 'Total Kredit (Jam)', 'Status', 'Pembelian Terakhir'];
    const csvData = students.map(student => [
      student.name,
      student.email,
      student.phone,
      student.remainingHours,
      student.totalCreditHours,
      student.status === 'LOW_BALANCE' ? 'Saldo Menipis' : 
      student.status === 'EXPIRED' ? 'Kadaluarsa' : 'Aktif',
      student.lastPurchase
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
    a.download = `student-credits-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    message.success('Report Excel berhasil di-export!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'LOW_BALANCE': return 'orange';
      case 'EXPIRED': return 'red';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircleOutlined />;
      case 'LOW_BALANCE': return <WarningOutlined />;
      case 'EXPIRED': return <CloseCircleOutlined />;
      default: return <InfoCircleOutlined />;
    }
  };

  const columns = [
    {
      title: 'Siswa',
      key: 'student',
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar size={40} icon={<UserOutlined />} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{record.name}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{record.phone}</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Saldo Kredit',
      key: 'credit',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#10B981' }}>
            {record.remainingHours} jam tersisa
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
            Total: {record.totalCreditHours} jam
          </div>
          <Progress 
            percent={Math.round((record.remainingHours / record.totalCreditHours) * 100)} 
            size="small" 
            strokeColor={record.remainingHours < 5 ? "#F59E0B" : "#8B5CF6"}
            showInfo={false}
          />
        </div>
      ),
    },
    {
      title: 'Paket Aktif',
      key: 'packages',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
            {record.activePackages} paket aktif
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
            Total: {record.totalPackages} paket
          </div>
          <div style={{ marginTop: 8 }}>
            {record.packages.filter(p => p.status === 'ACTIVE').map(pkg => (
              <Tag key={pkg.id} color="blue" style={{ marginBottom: 4 }}>
                {pkg.name} ({pkg.remaining} jam)
              </Tag>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Status & Total',
      key: 'status',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 8 }}>
            <Tag color={getStatusColor(record.status)} icon={getStatusIcon(record.status)}>
              {record.status === 'LOW_BALANCE' ? 'Saldo Menipis' : 
               record.status === 'EXPIRED' ? 'Kadaluarsa' : 'Aktif'}
            </Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Total: Rp {record.totalSpent.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Terakhir: {new Date(record.lastPurchase).toLocaleDateString('id-ID')}
          </div>
        </div>
      ),
    },
    {
      title: 'Aksi',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Lihat Detail">
            <Button 
              type="primary" 
              size="small"
              icon={<EyeOutlined />} 
              onClick={() => handleViewStudent(record)}
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                border: 'none'
              }}
            />
          </Tooltip>
          <Tooltip title="Sesuaikan Saldo">
            <Button 
              type="default" 
              size="small"
              icon={<EditOutlined />} 
              onClick={() => handleAdjustCredit(record.id)}
            />
          </Tooltip>
          <Tooltip title="Refresh Data">
            <Button 
              type="text" 
              size="small"
              icon={<ReloadOutlined />} 
              onClick={() => message.info('Data diperbarui')}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="student-credit-container">
      <div className="student-credit-header">
        <h1>Manajemen Kredit Siswa</h1>
        <p>Kelola saldo kredit dan mutasi rekening siswa Jakarta Mandarin</p>
      </div>

      {/* Alert */}
      <Alert
        message="Sistem Dompet Digital Jakarta Mandarin"
        description="Saldo menipis akan otomatis membuat tagihan baru untuk paket BUNDLE. Admin dapat menyesuaikan saldo secara manual."
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
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
              title="Total Siswa"
              value={stats.totalStudents}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#8B5CF6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Kredit Aktif"
              value={stats.activeCredits}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#10B981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Total Jam Kredit"
              value={stats.totalCreditHours}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#F59E0B' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Saldo Menipis"
              value={stats.lowBalanceStudents}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#F59E0B' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Kredit Expired"
              value={stats.expiredCredits}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#EF4444' }}
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
                  Kelola saldo kredit dan mutasi rekening siswa
                </p>
              </div>
              <Space>
                <Button 
                  type="primary" 
                  icon={<WalletOutlined />} 
                  size="large"
                  onClick={() => handleAdjustCredit(1)}
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    border: 'none'
                  }}
                >
                  Adjust Credit
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

      {/* Tabel Siswa */}
      <Card 
        title="Daftar Siswa dengan Kredit" 
        className="table-card"
        extra={
          <Input.Search
            placeholder="Cari siswa..."
            style={{ width: 250 }}
            onSearch={(value) => message.info(`Mencari: ${value}`)}
          />
        }
      >
        <Table
          columns={columns}
          dataSource={students}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} dari ${total} siswa`
          }}
        />
      </Card>

      {/* Modal Penyesuaian Saldo */}
      <Modal
        title="Sesuaikan Saldo Kredit"
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => setModalVisible(false)}
        okText="Sesuaikan"
        cancelText="Batal"
        width={500}
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSubmitAdjustment}
        >
          <Form.Item 
            name="studentName" 
            label="Nama Siswa"
          >
            <Input disabled />
          </Form.Item>
          
          <Form.Item 
            name="currentHours" 
            label="Saldo Saat Ini (Jam)"
          >
            <InputNumber 
              style={{ width: '100%' }} 
              disabled
            />
          </Form.Item>
          
          <Form.Item 
            name="adjustmentHours" 
            label="Penyesuaian (Jam)"
            rules={[{ required: true, message: 'Jumlah penyesuaian wajib diisi' }]}
          >
            <InputNumber 
              style={{ width: '100%' }} 
              placeholder="+5 atau -2"
            />
          </Form.Item>
          
          <Form.Item 
            name="reason" 
            label="Alasan Penyesuaian"
            rules={[{ required: true, message: 'Alasan wajib diisi' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Contoh: Kompensasi kelas yang dibatalkan, bonus loyalitas, dll."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Detail Siswa */}
      <Modal
        title="Detail Kredit Siswa"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Tutup
          </Button>,
          <Button 
            key="adjust" 
            type="primary"
            onClick={() => {
              setDetailModalVisible(false);
              handleAdjustCredit(selectedStudent.id);
            }}
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              border: 'none'
            }}
          >
            Sesuaikan Saldo
          </Button>
        ]}
        width={800}
      >
        {selectedStudent && (
          <div style={{ padding: '16px 0' }}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Informasi Umum" key="1">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card title="Data Siswa" size="small">
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Nama">{selectedStudent.name}</Descriptions.Item>
                        <Descriptions.Item label="Email">{selectedStudent.email}</Descriptions.Item>
                        <Descriptions.Item label="Telepon">{selectedStudent.phone}</Descriptions.Item>
                        <Descriptions.Item label="Status">
                          <Tag color={getStatusColor(selectedStudent.status)} icon={getStatusIcon(selectedStudent.status)}>
                            {selectedStudent.status === 'LOW_BALANCE' ? 'Saldo Menipis' : 
                             selectedStudent.status === 'EXPIRED' ? 'Kadaluarsa' : 'Aktif'}
                          </Tag>
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="Ringkasan Kredit" size="small">
                      <Statistic
                        title="Saldo Tersisa"
                        value={selectedStudent.remainingHours}
                        suffix=" jam"
                        valueStyle={{ color: '#10B981', fontSize: '24px' }}
                      />
                      <Divider />
                      <Statistic
                        title="Total Pembelian"
                        value={selectedStudent.totalSpent}
                        prefix="Rp "
                        valueStyle={{ color: '#8B5CF6', fontSize: '18px' }}
                        formatter={(value) => value.toLocaleString()}
                      />
                      <Divider />
                      <Statistic
                        title="Paket Aktif"
                        value={selectedStudent.activePackages}
                        suffix={` dari ${selectedStudent.totalPackages}`}
                        valueStyle={{ color: '#F59E0B', fontSize: '16px' }}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              
              <TabPane tab="Paket Kredit" key="2">
                <List
                  dataSource={selectedStudent.packages}
                  renderItem={pkg => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{pkg.name}</span>
                            <Tag color={pkg.status === 'ACTIVE' ? 'green' : pkg.status === 'EXPIRED' ? 'red' : 'default'}>
                              {pkg.status === 'ACTIVE' ? 'Aktif' : pkg.status === 'EXPIRED' ? 'Kadaluarsa' : 'Selesai'}
                            </Tag>
                          </div>
                        }
                        description={
                          <div>
                            <div>Sisa: {pkg.remaining} jam</div>
                            <div>Expired: {new Date(pkg.expiry).toLocaleDateString('id-ID')}</div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </TabPane>
              
              <TabPane tab="Riwayat Transaksi" key="3">
                <Timeline>
                  {selectedStudent.transactions.map(trans => (
                    <Timeline.Item 
                      key={trans.id}
                      color={
                        trans.type === 'PURCHASE' ? 'green' : 
                        trans.type === 'DEDUCTION' ? 'red' : 
                        trans.type === 'ADJUSTMENT' ? 'blue' : 'gray'
                      }
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{trans.description}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {new Date(trans.date).toLocaleDateString('id-ID')}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ 
                            fontWeight: 'bold', 
                            color: trans.hours > 0 ? '#10B981' : '#EF4444',
                            fontSize: '16px'
                          }}>
                            {trans.hours > 0 ? '+' : ''}{trans.hours} jam
                          </div>
                          {trans.amount > 0 && (
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              Rp {trans.amount.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </TabPane>
            </Tabs>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentCreditPage; 