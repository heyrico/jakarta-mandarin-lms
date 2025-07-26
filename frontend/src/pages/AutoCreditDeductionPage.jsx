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
  notification
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
  FileTextOutlined
} from '@ant-design/icons';
import './AutoCreditDeductionPage.css';

const { Option } = Select;
const { TextArea } = Input;
const { Text, Title } = Typography;
const { TabPane } = Tabs;
const { Step } = Steps;

const AutoCreditDeductionPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({
    totalClasses: 0,
    completedClasses: 0,
    pendingDeductions: 0,
    totalDeductions: 0,
    autoDeductionEnabled: true
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:3000/kelas');
        if (response.ok) {
          const data = await response.json();
          setClasses(data);
        } else {
          setClasses([]);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        setClasses([]);
      }
    };

    fetchClasses();
  }, []);

  const fetchStats = async () => {
    try {
      setStats({
        totalClasses: 4,
        completedClasses: 2,
        pendingDeductions: 1,
        totalDeductions: 16,
        autoDeductionEnabled: true
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleViewClass = (record) => {
    setSelectedClass(record);
    setDetailModalVisible(true);
  };

  const handleFinalizeAttendance = (classId) => {
    Modal.confirm({
      title: 'Finalisasi Absensi',
      content: 'Apakah Anda yakin ingin finalisasi absensi? Kredit akan otomatis terpotong.',
      okText: 'Ya, Finalisasi',
      cancelText: 'Batal',
      onOk: () => {
        setClasses(classes.map(cls => 
          cls.id === classId 
            ? { ...cls, attendanceFinalized: true, deductionStatus: 'PENDING' }
            : cls
        ));
        message.success('Absensi berhasil difinalisasi! Kredit akan terpotong otomatis.');
        
        // Simulasi auto deduction
        setTimeout(() => {
          setClasses(classes.map(cls => 
            cls.id === classId 
              ? { ...cls, deductionStatus: 'COMPLETED' }
              : cls
          ));
          notification.success({
            message: 'Auto Deduction Berhasil!',
            description: 'Kredit siswa telah terpotong otomatis sesuai jam kelas.',
            duration: 5
          });
        }, 2000);
      }
    });
  };

  const handleManualDeduction = (classId) => {
    Modal.confirm({
      title: 'Deduction Manual',
      content: 'Apakah Anda yakin ingin melakukan deduction manual?',
      okText: 'Ya, Deduct',
      cancelText: 'Batal',
      onOk: () => {
        setClasses(classes.map(cls => 
          cls.id === classId 
            ? { ...cls, deductionStatus: 'COMPLETED' }
            : cls
        ));
        message.success('Deduction manual berhasil dilakukan!');
      }
    });
  };

  const handleCancelDeduction = (classId) => {
    Modal.confirm({
      title: 'Batalkan Deduction',
      content: 'Apakah Anda yakin ingin membatalkan deduction?',
      okText: 'Ya, Batalkan',
      cancelText: 'Tidak',
      onOk: () => {
        setClasses(classes.map(cls => 
          cls.id === classId 
            ? { ...cls, deductionStatus: 'CANCELLED' }
            : cls
        ));
        message.success('Deduction berhasil dibatalkan!');
      }
    });
  };

  const handleExportReport = () => {
    const headers = ['Nama Kelas', 'Guru', 'Jadwal', 'Tanggal', 'Status', 'Deduction Status', 'Total Deduction'];
    const csvData = classes.map(cls => [
      cls.name,
      cls.teacher,
      cls.schedule,
      cls.date,
      cls.status === 'COMPLETED' ? 'Selesai' : 
      cls.status === 'SCHEDULED' ? 'Terjadwal' : 'Dibatalkan',
      cls.deductionStatus === 'COMPLETED' ? 'Selesai' : 
      cls.deductionStatus === 'PENDING' ? 'Menunggu' : 
      cls.deductionStatus === 'CANCELLED' ? 'Dibatalkan' : 'Belum Siap',
      cls.totalDeduction
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
    a.download = `auto-deduction-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    message.success('Report Excel berhasil di-export!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'green';
      case 'SCHEDULED': return 'blue';
      case 'CANCELLED': return 'red';
      default: return 'default';
    }
  };

  const getDeductionStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'green';
      case 'PENDING': return 'orange';
      case 'CANCELLED': return 'red';
      case 'NOT_READY': return 'gray';
      default: return 'default';
    }
  };

  const getDeductionStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircleOutlined />;
      case 'PENDING': return <ClockCircleOutlined />;
      case 'CANCELLED': return <CloseCircleOutlined />;
      case 'NOT_READY': return <PauseCircleOutlined />;
      default: return <InfoCircleOutlined />;
    }
  };

  const columns = [
    {
      title: 'Kelas',
      key: 'class',
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar size={40} icon={<TeamOutlined />} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{record.name}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{record.teacher}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{record.schedule}</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Siswa & Kredit',
      key: 'students',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
            {record.students.length} siswa
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
            Total deduction: {record.totalDeduction} jam
          </div>
          <div style={{ marginTop: 8 }}>
            {record.students.map(student => (
              <Tag key={student.id} color={student.remainingHours < 5 ? "orange" : "blue"} style={{ marginBottom: 4 }}>
                {student.name} ({student.remainingHours} jam)
              </Tag>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Status Kelas',
      key: 'status',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 8 }}>
            <Tag color={getStatusColor(record.status)}>
              {record.status === 'COMPLETED' ? 'Selesai' : 
               record.status === 'SCHEDULED' ? 'Terjadwal' : 'Dibatalkan'}
            </Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.date}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Absensi: {record.attendanceFinalized ? 'Final' : 'Belum Final'}
          </div>
        </div>
      ),
    },
    {
      title: 'Auto Deduction',
      key: 'deduction',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 8 }}>
            <Tag color={getDeductionStatusColor(record.deductionStatus)} icon={getDeductionStatusIcon(record.deductionStatus)}>
              {record.deductionStatus === 'COMPLETED' ? 'Selesai' : 
               record.deductionStatus === 'PENDING' ? 'Menunggu' : 
               record.deductionStatus === 'CANCELLED' ? 'Dibatalkan' : 'Belum Siap'}
            </Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.deductionStatus === 'COMPLETED' ? 'Kredit terpotong otomatis' :
             record.deductionStatus === 'PENDING' ? 'Menunggu finalisasi' :
             record.deductionStatus === 'NOT_READY' ? 'Kelas belum selesai' : 'Dibatalkan admin'}
          </div>
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
              onClick={() => handleViewClass(record)}
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                border: 'none'
              }}
            />
          </Tooltip>
          
          {record.status === 'COMPLETED' && !record.attendanceFinalized && (
            <Tooltip title="Finalisasi Absensi">
              <Button 
                type="default" 
                size="small"
                icon={<CheckCircleOutlined />} 
                onClick={() => handleFinalizeAttendance(record.id)}
                style={{ color: '#10B981', borderColor: '#10B981' }}
              />
            </Tooltip>
          )}
          
          {record.deductionStatus === 'PENDING' && (
            <Tooltip title="Deduction Manual">
              <Button 
                type="default" 
                size="small"
                icon={<PlayCircleOutlined />} 
                onClick={() => handleManualDeduction(record.id)}
                style={{ color: '#F59E0B', borderColor: '#F59E0B' }}
              />
            </Tooltip>
          )}
          
          {record.deductionStatus === 'PENDING' && (
            <Tooltip title="Batalkan Deduction">
              <Button 
                type="text" 
                size="small"
                icon={<StopOutlined />} 
                danger
                onClick={() => handleCancelDeduction(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="auto-credit-deduction-container">
      <div className="auto-credit-deduction-header">
        <h1>Auto Credit Deduction</h1>
        <p>Sistem pemotongan kredit otomatis Jakarta Mandarin</p>
      </div>

      {/* Alert */}
      <Alert
        message="Sistem Auto Deduction Jakarta Mandarin"
        description="Kredit akan otomatis terpotong ketika guru finalisasi absensi. Admin dapat melakukan deduction manual atau membatalkan deduction."
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        style={{ marginBottom: 24 }}
        action={
          <Switch 
            checked={stats.autoDeductionEnabled} 
            onChange={(checked) => {
              setStats({...stats, autoDeductionEnabled: checked});
              message.success(`Auto deduction ${checked ? 'diaktifkan' : 'dinonaktifkan'}`);
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
              title="Total Kelas"
              value={stats.totalClasses}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#8B5CF6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Kelas Selesai"
              value={stats.completedClasses}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#10B981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Pending Deduction"
              value={stats.pendingDeductions}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#F59E0B' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Total Deduction"
              value={stats.totalDeductions}
              prefix={<WalletOutlined />}
              valueStyle={{ color: '#EC4899' }}
              suffix=" jam"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Auto Deduction"
              value={stats.autoDeductionEnabled ? 'Aktif' : 'Nonaktif'}
              prefix={<SettingOutlined />}
              valueStyle={{ color: stats.autoDeductionEnabled ? '#10B981' : '#EF4444' }}
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
                  Kelola sistem pemotongan kredit otomatis
                </p>
              </div>
              <Space>
                <Button 
                  type="primary" 
                  icon={<BellOutlined />} 
                  size="large"
                  onClick={() => message.info('Notifikasi deduction aktif')}
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    border: 'none'
                  }}
                >
                  Test Notifikasi
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

      {/* Tabel Kelas */}
      <Card 
        title="Daftar Kelas dengan Auto Deduction" 
        className="table-card"
        extra={
          <Input.Search
            placeholder="Cari kelas..."
            style={{ width: 250 }}
            onSearch={(value) => message.info(`Mencari: ${value}`)}
          />
        }
      >
        <Table
          columns={columns}
          dataSource={classes}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} dari ${total} kelas`
          }}
        />
      </Card>

      {/* Modal Detail Kelas */}
      <Modal
        title="Detail Auto Deduction Kelas"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Tutup
          </Button>
        ]}
        width={800}
      >
        {selectedClass && (
          <div style={{ padding: '16px 0' }}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Informasi Kelas" key="1">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card title="Data Kelas" size="small">
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Nama Kelas">{selectedClass.name}</Descriptions.Item>
                        <Descriptions.Item label="Guru">{selectedClass.teacher}</Descriptions.Item>
                        <Descriptions.Item label="Jadwal">{selectedClass.schedule}</Descriptions.Item>
                        <Descriptions.Item label="Tanggal">{selectedClass.date}</Descriptions.Item>
                        <Descriptions.Item label="Status">
                          <Tag color={getStatusColor(selectedClass.status)}>
                            {selectedClass.status === 'COMPLETED' ? 'Selesai' : 
                             selectedClass.status === 'SCHEDULED' ? 'Terjadwal' : 'Dibatalkan'}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Deduction Status">
                          <Tag color={getDeductionStatusColor(selectedClass.deductionStatus)} icon={getDeductionStatusIcon(selectedClass.deductionStatus)}>
                            {selectedClass.deductionStatus === 'COMPLETED' ? 'Selesai' : 
                             selectedClass.deductionStatus === 'PENDING' ? 'Menunggu' : 
                             selectedClass.deductionStatus === 'CANCELLED' ? 'Dibatalkan' : 'Belum Siap'}
                          </Tag>
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="Ringkasan Deduction" size="small">
                      <Statistic
                        title="Total Siswa"
                        value={selectedClass.students.length}
                        suffix=" siswa"
                        valueStyle={{ color: '#8B5CF6', fontSize: '24px' }}
                      />
                      <Divider />
                      <Statistic
                        title="Total Deduction"
                        value={selectedClass.totalDeduction}
                        suffix=" jam"
                        valueStyle={{ color: '#EC4899', fontSize: '18px' }}
                      />
                      <Divider />
                      <Statistic
                        title="Status Absensi"
                        value={selectedClass.attendanceFinalized ? 'Final' : 'Belum Final'}
                        valueStyle={{ 
                          color: selectedClass.attendanceFinalized ? '#10B981' : '#F59E0B', 
                          fontSize: '16px' 
                        }}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              
              <TabPane tab="Daftar Siswa" key="2">
                <List
                  dataSource={selectedClass.students}
                  renderItem={student => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{student.name}</span>
                            <Tag color={student.remainingHours < 5 ? 'orange' : 'green'}>
                              {student.remainingHours} jam tersisa
                            </Tag>
                          </div>
                        }
                        description={
                          <div>
                            <div>Deduction: {student.willDeduct} jam</div>
                            <div>Saldo setelah deduction: {student.remainingHours - student.willDeduct} jam</div>
                            {student.remainingHours - student.willDeduct < 5 && (
                              <Alert 
                                message="Saldo akan menipis!" 
                                type="warning" 
                                showIcon 
                                style={{ marginTop: 8 }}
                              />
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </TabPane>
              
              <TabPane tab="Proses Deduction" key="3">
                <Steps direction="vertical" current={selectedClass.deductionStatus === 'COMPLETED' ? 3 : 
                                                      selectedClass.deductionStatus === 'PENDING' ? 2 : 
                                                      selectedClass.attendanceFinalized ? 1 : 0}>
                  <Step 
                    title="Kelas Selesai" 
                    description="Guru menyelesaikan kelas"
                    status={selectedClass.status === 'COMPLETED' ? 'finish' : 'wait'}
                  />
                  <Step 
                    title="Finalisasi Absensi" 
                    description="Guru finalisasi absensi siswa"
                    status={selectedClass.attendanceFinalized ? 'finish' : 'wait'}
                  />
                  <Step 
                    title="Auto Deduction" 
                    description="Sistem memotong kredit otomatis"
                    status={selectedClass.deductionStatus === 'COMPLETED' ? 'finish' : 
                            selectedClass.deductionStatus === 'PENDING' ? 'process' : 'wait'}
                  />
                  <Step 
                    title="Selesai" 
                    description="Deduction berhasil dilakukan"
                    status={selectedClass.deductionStatus === 'COMPLETED' ? 'finish' : 'wait'}
                  />
                </Steps>
                
                {selectedClass.deductionStatus === 'PENDING' && (
                  <Alert
                    message="Deduction Pending"
                    description="Kredit siap untuk dipotong. Klik tombol 'Deduction Manual' untuk memproses."
                    type="warning"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                )}
              </TabPane>
            </Tabs>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AutoCreditDeductionPage; 