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
  Timeline,
  Steps,
  notification,
  Popconfirm,
  Drawer,
  DatePicker,
  TimePicker
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
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  SettingOutlined,
  BellOutlined,
  FileTextOutlined,
  MailOutlined,
  PhoneOutlined,
  SendOutlined,
  CheckOutlined,
  CloseOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  FireOutlined,
  RocketOutlined
} from '@ant-design/icons';
import './AutoBillingPage.css';

const { Option } = Select;
const { TextArea } = Input;
const { Text, Title } = Typography;
const { TabPane } = Tabs;
const { Step } = Steps;
const { RangePicker } = DatePicker;

const AutoBillingPage = () => {
  const [students, setStudents] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({
    totalStudents: 0,
    lowBalanceStudents: 0,
    autoBillingEnabled: true,
    totalAutoBills: 0,
    pendingBills: 0,
    successfulBills: 0
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
    const fetchBillingHistory = async () => {
      try {
        const response = await fetch('http://localhost:3000/auto-billing/history');
        if (response.ok) {
          const data = await response.json();
          setBillingHistory(data);
        } else {
          setBillingHistory([]);
        }
      } catch (error) {
        console.error('Error fetching billing history:', error);
        setBillingHistory([]);
      }
    };

    fetchBillingHistory();
  }, []);

  const fetchStats = async () => {
    try {
      setStats({
        totalStudents: 5,
        lowBalanceStudents: 2,
        autoBillingEnabled: true,
        totalAutoBills: 12,
        pendingBills: 1,
        successfulBills: 11
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleViewStudent = (record) => {
    setSelectedStudent(record);
    setDetailModalVisible(true);
  };

  const handleManualBilling = (studentId) => {
    Modal.confirm({
      title: 'Manual Billing',
      content: 'Apakah Anda yakin ingin melakukan billing manual?',
      okText: 'Ya, Bill',
      cancelText: 'Batal',
      onOk: () => {
        setStudents(students.map(student => 
          student.id === studentId 
            ? { ...student, autoBillingStatus: 'PENDING' }
            : student
        ));
        message.success('Manual billing berhasil diproses!');
        
        // Simulasi auto billing success
        setTimeout(() => {
          setStudents(students.map(student => 
            student.id === studentId 
              ? { ...student, autoBillingStatus: 'ACTIVE', currentBalance: student.currentBalance + 50 }
              : student
          ));
          notification.success({
            message: 'Auto Billing Berhasil!',
            description: 'Invoice telah dikirim ke siswa.',
            duration: 5
          });
        }, 2000);
      }
    });
  };

  const handleToggleAutoBilling = (studentId, enabled) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, autoBillingStatus: enabled ? 'ACTIVE' : 'DISABLED' }
        : student
    ));
    message.success(`Auto billing ${enabled ? 'diaktifkan' : 'dinonaktifkan'} untuk siswa ini`);
  };

  const handleProcessPendingBills = () => {
    Modal.confirm({
      title: 'Proses Semua Pending Bills',
      content: 'Apakah Anda yakin ingin memproses semua billing yang pending?',
      okText: 'Ya, Proses',
      cancelText: 'Batal',
      onOk: () => {
        setStudents(students.map(student => 
          student.autoBillingStatus === 'PENDING' 
            ? { ...student, autoBillingStatus: 'ACTIVE' }
            : student
        ));
        message.success('Semua pending bills berhasil diproses!');
      }
    });
  };

  const handleExportReport = () => {
    const headers = ['Nama Siswa', 'Email', 'Paket', 'Saldo Saat Ini', 'Status Auto Billing', 'Jumlah Billing', 'Siklus Billing'];
    const csvData = students.map(student => [
      student.name,
      student.email,
      student.packageName,
      `${student.currentBalance} jam`,
      student.autoBillingStatus === 'ACTIVE' ? 'Aktif' : 
      student.autoBillingStatus === 'PENDING' ? 'Pending' : 
      student.autoBillingStatus === 'LOW_BALANCE' ? 'Saldo Menipis' : 'Nonaktif',
      `Rp ${student.billingAmount.toLocaleString()}`,
      student.billingCycle === 'MONTHLY' ? 'Bulanan' : 'Sekali Bayar'
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
    a.download = `auto-billing-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    message.success('Report Excel berhasil di-export!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'PENDING': return 'orange';
      case 'LOW_BALANCE': return 'red';
      case 'DISABLED': return 'gray';
      default: return 'default';
    }
  };

  const getBillingStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS': return 'green';
      case 'PENDING': return 'orange';
      case 'FAILED': return 'red';
      default: return 'default';
    }
  };

  const getBillingStatusIcon = (status) => {
    switch (status) {
      case 'SUCCESS': return <CheckCircleOutlined />;
      case 'PENDING': return <ClockCircleOutlined />;
      case 'FAILED': return <CloseCircleOutlined />;
      default: return <InfoCircleOutlined />;
    }
  };

  const studentColumns = [
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
      title: 'Paket & Saldo',
      key: 'package',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#8B5CF6' }}>
            {record.packageName}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
            Tipe: {record.packageType}
          </div>
          <div style={{ marginTop: 8 }}>
            <Tag color={record.currentBalance < record.lowBalanceThreshold ? "red" : "green"}>
              Saldo: {record.currentBalance} jam
            </Tag>
            {record.currentBalance < record.lowBalanceThreshold && (
              <Tag color="orange" style={{ marginLeft: 4 }}>
                <WarningOutlined /> Saldo Menipis!
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Auto Billing',
      key: 'billing',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 8 }}>
            <Tag color={getStatusColor(record.autoBillingStatus)}>
              {record.autoBillingStatus === 'ACTIVE' ? 'Aktif' : 
               record.autoBillingStatus === 'PENDING' ? 'Pending' : 
               record.autoBillingStatus === 'LOW_BALANCE' ? 'Saldo Menipis' : 'Nonaktif'}
            </Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Rp {record.billingAmount.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.billingCycle === 'MONTHLY' ? 'Bulanan' : 'Sekali Bayar'}
          </div>
          {record.nextBillingDate && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              Next: {record.nextBillingDate}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Aksi',
      key: 'actions',
      render: (_, record) => (
        <Space direction="vertical" size="small">
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
          
          {record.autoBillingStatus === 'LOW_BALANCE' && (
            <Tooltip title="Manual Billing">
              <Button 
                type="default" 
                size="small"
                icon={<ThunderboltOutlined />} 
                onClick={() => handleManualBilling(record.id)}
                style={{ color: '#F59E0B', borderColor: '#F59E0B' }}
              />
            </Tooltip>
          )}
          
          <Tooltip title={record.autoBillingStatus === 'DISABLED' ? 'Aktifkan Auto Billing' : 'Nonaktifkan Auto Billing'}>
            <Switch 
              checked={record.autoBillingStatus !== 'DISABLED'}
              onChange={(checked) => handleToggleAutoBilling(record.id, checked)}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const historyColumns = [
    {
      title: 'Siswa',
      key: 'student',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{record.studentName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.packageName}</div>
        </div>
      ),
    },
    {
      title: 'Invoice',
      key: 'invoice',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#8B5CF6' }}>
            {record.invoiceNumber}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Rp {record.amount.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      title: 'Tanggal',
      key: 'date',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '14px' }}>{record.date}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.method === 'AUTO' ? 'Auto Billing' : 'Manual'}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={getBillingStatusColor(record.status)} icon={getBillingStatusIcon(record.status)}>
          {record.status === 'SUCCESS' ? 'Berhasil' : 
           record.status === 'PENDING' ? 'Pending' : 'Gagal'}
        </Tag>
      ),
    },
  ];

  return (
    <div className="auto-billing-container">
      <div className="auto-billing-header">
        <h1>Auto Billing System</h1>
        <p>Sistem penagihan otomatis Jakarta Mandarin</p>
      </div>

      {/* Alert */}
      <Alert
        message="Sistem Auto Billing Jakarta Mandarin"
        description="Sistem akan otomatis menagih siswa dengan paket 'Bundle' ketika saldo menipis. Admin dapat mengatur billing cycle dan threshold."
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        style={{ marginBottom: 24 }}
        action={
          <Switch 
            checked={stats.autoBillingEnabled} 
            onChange={(checked) => {
              setStats({...stats, autoBillingEnabled: checked});
              message.success(`Auto billing ${checked ? 'diaktifkan' : 'dinonaktifkan'} secara global`);
            }}
            checkedChildren="Aktif"
            unCheckedChildren="Nonaktif"
          />
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
              title="Total Auto Bills"
              value={stats.totalAutoBills}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#EC4899' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Pending Bills"
              value={stats.pendingBills}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#F59E0B' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Berhasil"
              value={stats.successfulBills}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#10B981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Auto Billing"
              value={stats.autoBillingEnabled ? 'Aktif' : 'Nonaktif'}
              prefix={<SettingOutlined />}
              valueStyle={{ color: stats.autoBillingEnabled ? '#10B981' : '#EF4444' }}
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
                  Kelola sistem penagihan otomatis
                </p>
              </div>
              <Space>
                <Button 
                  type="primary" 
                  icon={<ThunderboltOutlined />} 
                  size="large"
                  onClick={handleProcessPendingBills}
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    border: 'none'
                  }}
                >
                  Proses Pending Bills
                </Button>
                <Button 
                  type="default" 
                  icon={<MailOutlined />} 
                  size="large"
                  onClick={() => message.info('Kirim reminder billing')}
                >
                  Kirim Reminder
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

      {/* Tabs */}
      <Card className="tabs-card">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Daftar Siswa" key="1">
            <div style={{ marginBottom: 16 }}>
              <Input.Search
                placeholder="Cari siswa..."
                style={{ width: 300 }}
                onSearch={(value) => message.info(`Mencari: ${value}`)}
              />
            </div>
            <Table
              columns={studentColumns}
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
          </TabPane>
          
          <TabPane tab="Riwayat Billing" key="2">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <RangePicker 
                  placeholder={['Tanggal Mulai', 'Tanggal Akhir']}
                  onChange={(dates) => message.info('Filter tanggal diterapkan')}
                />
                <Select
                  placeholder="Filter Status"
                  style={{ width: 150 }}
                  onChange={(value) => message.info(`Filter status: ${value}`)}
                >
                  <Option value="all">Semua Status</Option>
                  <Option value="success">Berhasil</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="failed">Gagal</Option>
                </Select>
              </Space>
            </div>
            <Table
              columns={historyColumns}
              dataSource={billingHistory}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} dari ${total} transaksi`
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal Detail Siswa */}
      <Modal
        title="Detail Auto Billing Siswa"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Tutup
          </Button>
        ]}
        width={800}
      >
        {selectedStudent && (
          <div style={{ padding: '16px 0' }}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Informasi Siswa" key="1">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card title="Data Siswa" size="small">
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Nama">{selectedStudent.name}</Descriptions.Item>
                        <Descriptions.Item label="Email">{selectedStudent.email}</Descriptions.Item>
                        <Descriptions.Item label="Telepon">{selectedStudent.phone}</Descriptions.Item>
                        <Descriptions.Item label="Paket">{selectedStudent.packageName}</Descriptions.Item>
                        <Descriptions.Item label="Tipe Paket">{selectedStudent.packageType}</Descriptions.Item>
                        <Descriptions.Item label="Saldo Saat Ini">
                          <Tag color={selectedStudent.currentBalance < selectedStudent.lowBalanceThreshold ? 'red' : 'green'}>
                            {selectedStudent.currentBalance} jam
                          </Tag>
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="Konfigurasi Billing" size="small">
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Status Auto Billing">
                          <Tag color={getStatusColor(selectedStudent.autoBillingStatus)}>
                            {selectedStudent.autoBillingStatus === 'ACTIVE' ? 'Aktif' : 
                             selectedStudent.autoBillingStatus === 'PENDING' ? 'Pending' : 
                             selectedStudent.autoBillingStatus === 'LOW_BALANCE' ? 'Saldo Menipis' : 'Nonaktif'}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Jumlah Billing">
                          Rp {selectedStudent.billingAmount.toLocaleString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Siklus Billing">
                          {selectedStudent.billingCycle === 'MONTHLY' ? 'Bulanan' : 'Sekali Bayar'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Threshold Saldo">
                          {selectedStudent.lowBalanceThreshold} jam
                        </Descriptions.Item>
                        <Descriptions.Item label="Billing Terakhir">
                          {selectedStudent.lastBillingDate}
                        </Descriptions.Item>
                        {selectedStudent.nextBillingDate && (
                          <Descriptions.Item label="Billing Berikutnya">
                            {selectedStudent.nextBillingDate}
                          </Descriptions.Item>
                        )}
                      </Descriptions>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              
              <TabPane tab="Riwayat Billing" key="2">
                <Timeline>
                  {selectedStudent.billingHistory.map((bill, index) => (
                    <Timeline.Item 
                      key={index}
                      color={bill.status === 'SUCCESS' ? 'green' : 
                             bill.status === 'PENDING' ? 'orange' : 'red'}
                      dot={bill.status === 'SUCCESS' ? <CheckCircleOutlined /> : 
                           bill.status === 'PENDING' ? <ClockCircleOutlined /> : <CloseCircleOutlined />}
                    >
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                          Rp {bill.amount.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          Tanggal: {bill.date}
                        </div>
                        <div style={{ marginTop: 4 }}>
                          <Tag color={getBillingStatusColor(bill.status)}>
                            {bill.status === 'SUCCESS' ? 'Berhasil' : 
                             bill.status === 'PENDING' ? 'Pending' : 'Gagal'}
                          </Tag>
                        </div>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </TabPane>
              
              <TabPane tab="Pengaturan Billing" key="3">
                <Form layout="vertical">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Jumlah Billing">
                        <InputNumber
                          style={{ width: '100%' }}
                          value={selectedStudent.billingAmount}
                          formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/Rp\s?|(,*)/g, '')}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Siklus Billing">
                        <Select value={selectedStudent.billingCycle}>
                          <Option value="MONTHLY">Bulanan</Option>
                          <Option value="WEEKLY">Mingguan</Option>
                          <Option value="ONE_TIME">Sekali Bayar</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Threshold Saldo Menipis">
                        <InputNumber
                          style={{ width: '100%' }}
                          value={selectedStudent.lowBalanceThreshold}
                          min={1}
                          max={100}
                          addonAfter="jam"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Status Auto Billing">
                        <Switch 
                          checked={selectedStudent.autoBillingStatus !== 'DISABLED'}
                          onChange={(checked) => {
                            setSelectedStudent({
                              ...selectedStudent, 
                              autoBillingStatus: checked ? 'ACTIVE' : 'DISABLED'
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item>
                    <Button type="primary" onClick={() => message.success('Pengaturan berhasil disimpan!')}>
                      Simpan Pengaturan
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AutoBillingPage; 