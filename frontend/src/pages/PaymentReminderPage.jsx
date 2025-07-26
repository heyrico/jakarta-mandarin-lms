import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
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
  InputNumber,
  Alert,
  Timeline,
  List,
  Typography
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UserOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  SearchOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  ExclamationCircleOutlined,
  BellOutlined,
  SendOutlined,
  WarningOutlined
} from '@ant-design/icons';
import './PaymentReminderPage.css';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const PaymentReminderPage = () => {
  const [reminders, setReminders] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({
    totalOverdue: 0,
    totalReminders: 0,
    totalPaid: 0,
    totalRevenue: 0,
    thisMonthReminders: 0
  });

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await fetch('http://localhost:3000/payment-reminder');
        if (response.ok) {
          const data = await response.json();
          setReminders(data);
        } else {
          setReminders([]);
        }
      } catch (error) {
        console.error('Error fetching reminders:', error);
        setReminders([]);
      }
    };

    fetchReminders();
  }, []);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await fetch('http://localhost:3000/enrollment');
        if (response.ok) {
          const data = await response.json();
          setEnrollments(data);
        } else {
          setEnrollments([]);
        }
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        setEnrollments([]);
      }
    };

    fetchEnrollments();
  }, []);

  const fetchStats = async () => {
    try {
      setStats({
        totalOverdue: 2,
        totalReminders: 15,
        totalPaid: 8,
        totalRevenue: 12500000,
        thisMonthReminders: 7
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSendReminder = (record) => {
    Modal.confirm({
      title: 'Kirim Reminder',
      content: `Kirim reminder pembayaran ke ${record.studentName}?`,
      okText: 'Ya',
      cancelText: 'Tidak',
      onOk: () => {
        // Simulasi kirim reminder
        message.success(`Reminder berhasil dikirim ke ${record.studentName}`);
        
        // Update reminder count
        setReminders(reminders.map(r => 
          r.id === record.id 
            ? { ...r, reminderCount: r.reminderCount + 1, lastReminderSent: new Date().toISOString().split('T')[0] }
            : r
        ));
      }
    });
  };

  const handleMarkAsPaid = (record) => {
    Modal.confirm({
      title: 'Tandai Sebagai Lunas',
      content: `Tandai pembayaran ${record.studentName} sebagai lunas?`,
      okText: 'Ya',
      cancelText: 'Tidak',
      onOk: () => {
        // Simulasi update status
        setReminders(reminders.map(r => 
          r.id === record.id 
            ? { ...r, status: 'completed', reminderType: 'paid', remainingAmount: 0 }
            : r
        ));
        message.success(`Pembayaran ${record.studentName} berhasil ditandai sebagai lunas`);
      }
    });
  };

  const handleExportReport = () => {
    const headers = ['Nama Siswa', 'Nomor Invoice', 'Jumlah', 'Tanggal Jatuh Tempo', 'Status', 'Reminder Terakhir'];
    const csvData = reminders.map(reminder => [
      reminder.studentName,
      reminder.invoiceNumber,
      `Rp ${reminder.amount.toLocaleString()}`,
      reminder.dueDate,
      reminder.status === 'OVERDUE' ? 'Terlambat' : 
      reminder.status === 'SENT' ? 'Terkirim' : 'Pending',
      reminder.lastReminder
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
    a.download = `payment-reminder-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    message.success('Report Excel berhasil di-export!');
  };

  const getReminderTypeColor = (type) => {
    switch (type) {
      case 'overdue': return 'orange';
      case 'critical': return 'red';
      case 'upcoming': return 'blue';
      case 'paid': return 'green';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'urgent': return 'red';
      case 'warning': return 'blue';
      case 'completed': return 'green';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'urgent': return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'warning': return <WarningOutlined style={{ color: '#1890ff' }} />;
      case 'completed': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      default: return <ClockCircleOutlined />;
    }
  };

  const columns = [
    {
      title: 'Siswa',
      key: 'student',
      render: (_, record) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#8B5CF6' }}>
            {record.studentAvatar}
          </Avatar>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{record.studentName}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <MailOutlined /> {record.email}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <PhoneOutlined /> {record.phone}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Kelas & Pembayaran',
      key: 'payment',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>{record.className}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Total: Rp {record.totalFee.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Dibayar: Rp {record.paidAmount.toLocaleString()}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: record.remainingAmount > 0 ? '#ff4d4f' : '#52c41a',
            fontWeight: '600'
          }}>
            Sisa: Rp {record.remainingAmount.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      title: 'Jatuh Tempo',
      key: 'dueDate',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>
            {new Date(record.dueDate).toLocaleDateString('id-ID')}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: record.daysOverdue > 0 ? '#ff4d4f' : record.daysOverdue < 0 ? '#1890ff' : '#faad14'
          }}>
            {record.daysOverdue > 0 
              ? `${record.daysOverdue} hari terlambat`
              : record.daysOverdue < 0 
                ? `${Math.abs(record.daysOverdue)} hari lagi`
                : 'Hari ini'
            }
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tag color={getReminderTypeColor(record.reminderType)} icon={getStatusIcon(record.status)}>
            {record.reminderType === 'overdue' ? 'Terlambat' : 
             record.reminderType === 'critical' ? 'Kritis' : 
             record.reminderType === 'upcoming' ? 'Akan Datang' : 'Lunas'}
          </Tag>
          <Tag color={getStatusColor(record.status)}>
            {record.status === 'pending' ? 'Menunggu' : 
             record.status === 'urgent' ? 'Urgent' : 
             record.status === 'warning' ? 'Peringatan' : 'Selesai'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Reminder',
      key: 'reminder',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Terakhir: {record.lastReminderSent ? new Date(record.lastReminderSent).toLocaleDateString('id-ID') : '-'}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Jumlah: {record.reminderCount}x
          </div>
          {record.nextReminderDate && (
            <div style={{ fontSize: '12px', color: '#1890ff' }}>
              Next: {new Date(record.nextReminderDate).toLocaleDateString('id-ID')}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Aksi',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Kirim Reminder">
            <Button 
              type="primary" 
              size="small"
              icon={<SendOutlined />} 
              onClick={() => handleSendReminder(record)}
              disabled={record.status === 'completed'}
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                border: 'none'
              }}
            >
              Kirim
            </Button>
          </Tooltip>
          <Tooltip title="Tandai Lunas">
            <Button 
              type="default" 
              size="small"
              icon={<CheckCircleOutlined />} 
              onClick={() => handleMarkAsPaid(record)}
              disabled={record.status === 'completed'}
            >
              Lunas
            </Button>
          </Tooltip>
          <Tooltip title="Lihat Detail">
            <Button 
              type="text" 
              size="small"
              icon={<EyeOutlined />} 
              onClick={() => message.info('Fitur detail akan segera hadir!')}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="payment-reminder-container">
      <div className="payment-reminder-header">
        <h1>Sistem Reminder Pembayaran</h1>
        <p>Kelola reminder pembayaran siswa Jakarta Mandarin</p>
      </div>

      {/* Alert */}
      <Alert
        message="Pembayaran Terlambat"
        description="Ada 2 siswa dengan pembayaran terlambat yang memerlukan tindakan segera."
        type="warning"
        showIcon
        icon={<ExclamationCircleOutlined />}
        style={{ marginBottom: 24 }}
        action={
          <Button size="small" type="primary" danger>
            Lihat Detail
          </Button>
        }
      />

      {/* Statistik */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Pembayaran Terlambat"
              value={stats.totalOverdue}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Total Reminder"
              value={stats.totalReminders}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#8B5CF6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Sudah Dibayar"
              value={stats.totalPaid}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
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
              title="Reminder Bulan Ini"
              value={stats.thisMonthReminders}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
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
                  Kirim reminder otomatis untuk pembayaran yang terlambat
                </p>
              </div>
              <Space>
                <Button 
                  type="primary" 
                  icon={<SendOutlined />} 
                  size="large"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    border: 'none'
                  }}
                >
                  Kirim Semua Reminder
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

      {/* Tabel Reminder */}
      <Card 
        title="Daftar Reminder Pembayaran" 
        className="table-card"
        extra={
          <Input.Search
            placeholder="Cari siswa atau kelas"
            style={{ width: 250 }}
            onSearch={(value) => message.info(`Mencari: ${value}`)}
          />
        }
      >
        <Table
          columns={columns}
          dataSource={reminders}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} dari ${total} reminder`
          }}
        />
      </Card>

      {/* Timeline Reminder */}
      <Card title="Timeline Reminder" className="timeline-card" style={{ marginTop: 24 }}>
        <Timeline>
          <Timeline.Item color="red">
            <div>
              <Text strong>Lisa Wang - ADVANCE - Adults Regular</Text>
              <br />
              <Text type="secondary">Reminder ke-4 dikirim - 23 Jan 2024</Text>
              <br />
              <Text type="danger">13 hari terlambat - Rp 3.300.000</Text>
            </div>
          </Timeline.Item>
          <Timeline.Item color="orange">
            <div>
              <Text strong>Budi Santoso - INTERMEDIATE - Adults Regular</Text>
              <br />
              <Text type="secondary">Reminder ke-2 dikirim - 20 Jan 2024</Text>
              <br />
              <Text type="warning">5 hari terlambat - Rp 1.450.000</Text>
            </div>
          </Timeline.Item>
          <Timeline.Item color="green">
            <div>
              <Text strong>Ahmad Rizki - BISNIS 1 - Business Mandarin</Text>
              <br />
              <Text type="secondary">Pembayaran lunas - 20 Jan 2024</Text>
              <br />
              <Text type="success">Tepat waktu - Rp 2.900.000</Text>
            </div>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <div>
              <Text strong>Diana Putri - KIDS 1 - Children Course</Text>
              <br />
              <Text type="secondary">Reminder pertama akan dikirim - 5 Feb 2024</Text>
              <br />
              <Text type="primary">5 hari lagi - Rp 1.100.000</Text>
            </div>
          </Timeline.Item>
        </Timeline>
      </Card>
    </div>
  );
};

export default PaymentReminderPage; 