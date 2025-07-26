import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Progress,
  Button,
  Space,
  Avatar,
  Typography,
  Alert,
  Empty,
  Select,
  DatePicker
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  BookOutlined,
  ExclamationCircleOutlined,
  SearchOutlined
} from '@ant-design/icons';
import './MyAttendancePage.css';

const { Title, Text } = Typography;
const { Option } = Select;

const MyAttendancePage = () => {
  const [loading, setLoading] = useState(false);
  const [myAttendance, setMyAttendance] = useState([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalPresent: 0,
    totalLate: 0,
    totalAbsent: 0,
    averageAttendance: 0,
    attendanceRate: 0
  });

  useEffect(() => {
    const fetchMyAttendance = async () => {
      try {
        const response = await fetch('http://localhost:3000/absensi/my-attendance');
        if (response.ok) {
          const data = await response.json();
          setMyAttendance(data);
        } else {
          setMyAttendance([]);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
        setMyAttendance([]);
      }
    };

    fetchMyAttendance();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/student/attendance-stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setStats({
            totalSessions: 0,
            presentSessions: 0,
            absentSessions: 0,
            attendanceRate: 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          totalSessions: 0,
          presentSessions: 0,
          absentSessions: 0,
          attendanceRate: 0
        });
      }
    };

    fetchStats();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'green';
      case 'late': return 'orange';
      case 'absent': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'present': return 'Hadir';
      case 'late': return 'Terlambat';
      case 'absent': return 'Tidak Hadir';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircleOutlined />;
      case 'late': return <ClockCircleOutlined />;
      case 'absent': return <CloseCircleOutlined />;
      default: return null;
    }
  };

  const columns = [
    {
      title: 'Kelas',
      key: 'class',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
            {record.class}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: 2 }}>
            <BookOutlined /> {record.location}
          </div>
        </div>
      ),
    },
    {
      title: 'Tanggal & Waktu',
      key: 'datetime',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>
            <CalendarOutlined /> {new Date(record.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
            <ClockCircleOutlined /> {record.time}
          </div>
        </div>
      ),
    },
    {
      title: 'Guru',
      key: 'teacher',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar size={32} style={{ backgroundColor: '#8B5CF6' }}>
            {record.teacher.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <div>
            <div style={{ fontWeight: '500' }}>{record.teacher}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <UserOutlined /> Guru
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag 
          color={getStatusColor(record.status)} 
          icon={getStatusIcon(record.status)}
          style={{ fontWeight: '600' }}
        >
          {getStatusText(record.status)}
        </Tag>
      ),
    },
    {
      title: 'Catatan',
      dataIndex: 'notes',
      key: 'notes',
      render: (text) => (
        <div style={{ maxWidth: 200, fontSize: '12px', lineHeight: '1.4' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            onClick={() => {
              console.log('View attendance details:', record.class);
              alert(`Melihat detail absensi: ${record.class}`);
            }}
          >
            Detail
          </Button>
          <Button 
            type="link" 
            size="small"
            onClick={() => {
              console.log('Download certificate:', record.class);
              alert(`Download sertifikat kehadiran: ${record.class}`);
            }}
          >
            Sertifikat
          </Button>
        </Space>
      ),
    }
  ];

  return (
    <div className="my-attendance-page">
      <div className="page-header">
        <Title level={2}>
          <CheckCircleOutlined style={{ marginRight: 8, color: '#8B5CF6' }} />
          Absensi Saya
        </Title>
        <Text type="secondary">
          Monitor dan kelola kehadiran Anda di kelas Jakarta Mandarin
        </Text>
      </div>

      {/* Statistik */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Total Sesi"
              value={stats.totalSessions}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#8B5CF6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Hadir"
              value={stats.totalPresent}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Terlambat"
              value={stats.totalLate}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Tidak Hadir"
              value={stats.totalAbsent}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Rata-rata Kehadiran"
              value={stats.averageAttendance}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#10B981' }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Tingkat Kehadiran"
              value={stats.attendanceRate}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="quick-actions-card">
        <Title level={4}>
          <ExclamationCircleOutlined style={{ marginRight: 8 }} />
          Aksi Cepat
        </Title>
        <Space wrap>
          <Button 
            type="primary" 
            icon={<CalendarOutlined />}
            onClick={() => {
              console.log('View attendance calendar clicked');
              alert('Melihat kalender kehadiran...');
            }}
          >
            Kalender Kehadiran
          </Button>
          <Button 
            icon={<CheckCircleOutlined />}
            onClick={() => {
              console.log('Download attendance report clicked');
              alert('Download laporan kehadiran...');
            }}
          >
            Download Laporan
          </Button>
          <Button 
            icon={<ExclamationCircleOutlined />}
            onClick={() => {
              console.log('View attendance policy clicked');
              alert('Melihat kebijakan kehadiran...');
            }}
          >
            Kebijakan Kehadiran
          </Button>
        </Space>
      </Card>

      {/* Filter Section */}
      <Card className="filter-card">
        <Title level={4}>
          <SearchOutlined style={{ marginRight: 8 }} />
          Filter & Pencarian
        </Title>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <div>
              <Text strong>Kelas:</Text>
              <Select
                placeholder="Pilih kelas"
                style={{ width: '100%', marginTop: 8 }}
                allowClear
              >
                <Option value="all">Semua Kelas</Option>
                <Option value="mandarin-intermediate">Mandarin Intermediate - Regular</Option>
                <Option value="hsk-preparation">HSK Preparation Course</Option>
                <Option value="business-chinese">Business Chinese</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div>
              <Text strong>Status:</Text>
              <Select
                placeholder="Pilih status"
                style={{ width: '100%', marginTop: 8 }}
                allowClear
              >
                <Option value="all">Semua Status</Option>
                <Option value="present">Hadir</Option>
                <Option value="late">Terlambat</Option>
                <Option value="absent">Tidak Hadir</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div>
              <Text strong>Periode:</Text>
              <DatePicker.RangePicker
                style={{ width: '100%', marginTop: 8 }}
                placeholder={['Dari Tanggal', 'Sampai Tanggal']}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Riwayat Absensi */}
      <Card 
        title={
          <span>
            <CheckCircleOutlined style={{ marginRight: 8, color: '#8B5CF6' }} />
            Riwayat Absensi
          </span>
        }
        className="attendance-table-card"
      >
        {myAttendance.length > 0 ? (
          <Table
            columns={columns}
            dataSource={myAttendance}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} sesi`
            }}
            scroll={{ x: 1200 }}
            rowKey="id"
          />
        ) : (
          <Empty
            description="Belum ada data kehadiran"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => {
              console.log('Check attendance clicked');
              alert('Memeriksa kehadiran...');
            }}>
              Periksa Kehadiran
            </Button>
          </Empty>
        )}
      </Card>

      {/* Attendance Summary */}
      <Row gutter={[16, 16]} className="summary-row">
        <Col xs={24} lg={12}>
          <Card className="summary-card">
            <Title level={4}>Ringkasan Kehadiran Bulan Ini</Title>
            <div style={{ padding: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span>Hadir</span>
                <span style={{ color: '#52c41a', fontWeight: '600' }}>4 sesi</span>
              </div>
              <Progress percent={66.7} strokeColor="#52c41a" showInfo={false} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, marginTop: 20 }}>
                <span>Terlambat</span>
                <span style={{ color: '#faad14', fontWeight: '600' }}>1 sesi</span>
              </div>
              <Progress percent={16.7} strokeColor="#faad14" showInfo={false} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, marginTop: 20 }}>
                <span>Tidak Hadir</span>
                <span style={{ color: '#ff4d4f', fontWeight: '600' }}>1 sesi</span>
              </div>
              <Progress percent={16.7} strokeColor="#ff4d4f" showInfo={false} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card className="summary-card">
            <Title level={4}>Performa Kehadiran</Title>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#8B5CF6', marginBottom: 16 }}>
                {stats.attendanceRate}%
              </div>
              <Text type="secondary">Tingkat Kehadiran Keseluruhan</Text>
              <div style={{ marginTop: 24 }}>
                <Tag color="green" style={{ fontSize: '14px', padding: '8px 16px' }}>
                  <CheckCircleOutlined /> Kehadiran Baik
                </Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MyAttendancePage; 