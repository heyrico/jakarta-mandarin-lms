import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Button, Space, Typography, Spin, Progress, Avatar } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  BookOutlined, 
  DollarOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import './DashboardPage.css';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    students: 0,
    teachers: 0,
    staff: 0,
    totalClasses: 0,
    totalInvoices: 0,
    pendingInvoices: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topStudents, setTopStudents] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats from backend
      const [userStats, classesResponse, invoicesResponse] = await Promise.all([
        fetch('http://localhost:3000/user/stats'),
        fetch('http://localhost:3000/kelas'),
        fetch('http://localhost:3000/invoice')
      ]);

      if (userStats.ok) {
        const userData = await userStats.json();
        setStats(prev => ({
          ...prev,
          ...userData
        }));
      }

      if (classesResponse.ok) {
        const classesData = await classesResponse.json();
        setStats(prev => ({
          ...prev,
          totalClasses: classesData.length
        }));
      }

      if (invoicesResponse.ok) {
        const invoicesData = await invoicesResponse.json();
        const pendingInvoices = invoicesData.filter(inv => inv.status === 'pending');
        setStats(prev => ({
          ...prev,
          totalInvoices: invoicesData.length,
          pendingInvoices: pendingInvoices.length
        }));
        setRecentInvoices(invoicesData.slice(0, 5));
      }

      // Fetch recent users
      const usersResponse = await fetch('http://localhost:3000/user?isActive=true');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setRecentUsers(usersData.slice(0, 5));
      }

      // Set empty data for activities and top students
      setRecentActivities([]);
      setTopStudents([]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to empty data
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        students: 0,
        teachers: 0,
        staff: 0,
        totalClasses: 0,
        totalInvoices: 0,
        pendingInvoices: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'enrollment': return <UserOutlined style={{ color: '#52c41a' }} />;
      case 'payment': return <DollarOutlined style={{ color: '#1890ff' }} />;
      case 'attendance': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'grade': return <TrophyOutlined style={{ color: '#faad14' }} />;
      default: return <ExclamationCircleOutlined />; // Changed from ClockCircleOutlined
    }
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'enrollment':
        return `${activity.student} mendaftar ke kelas ${activity.class}`;
      case 'payment':
        return `${activity.student} membayar Rp ${activity.amount?.toLocaleString()}`;
      case 'attendance':
        return `${activity.student} hadir di kelas ${activity.class}`;
      case 'grade':
        return `${activity.student} mendapat nilai ${activity.score} di ${activity.class}`;
      default:
        return 'Aktivitas baru';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'excellent': return 'gold';
      case 'good': return 'green';
      case 'average': return 'blue';
      case 'poor': return 'red';
      default: return 'default';
    }
  };

  // Define table columns
  const recentActivitiesColumns = [
    {
      title: 'Aktivitas',
      key: 'activity',
      render: (_, record) => (
        <Space>
          {getActivityIcon(record.type)}
          <span>{getActivityText(record)}</span>
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.status === 'success' ? 'green' : record.status === 'pending' ? 'orange' : 'blue'}>
          {record.status}
        </Tag>
      ),
    },
    {
      title: 'Waktu',
      key: 'time',
      render: (_, record) => <Text type="secondary">{record.time}</Text>,
    },
  ];

  const topStudentsColumns = [
    {
      title: 'Siswa',
      key: 'name',
      render: (_, record) => (
        <Space>
          <div style={{ 
            width: 32, 
            height: 32, 
            borderRadius: '50%', 
            backgroundColor: record.color || '#1890ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {record.avatar}
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.class}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Kehadiran',
      key: 'attendance',
      render: (_, record) => <Text>{record.attendance}%</Text>,
    },
    {
      title: 'Nilai Rata-rata',
      key: 'averageScore',
      render: (_, record) => <Text>{record.averageScore}</Text>,
    },
    {
      title: 'Level',
      key: 'level',
      render: (_, record) => (
        <Tag color={getLevelColor(record.level)}>
          {record.level}
        </Tag>
      ),
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard Jakarta Mandarin</h1>
        <p>Selamat datang kembali! Berikut adalah ringkasan aktivitas hari ini.</p>
      </div>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card className="action-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, color: '#1e293b' }}>Quick Actions</h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
                  Akses cepat ke fitur-fitur utama
                </p>
              </div>
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => window.location.href = '/pendaftaran'}
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    border: 'none'
                  }}
                >
                  Daftar Siswa
                </Button>
                <Button 
                  icon={<UserAddOutlined />} 
                  onClick={() => window.location.href = '/siswa'}
                >
                  Kelola Siswa
                </Button>
                <Button 
                  icon={<BookOutlined />} 
                  onClick={() => window.location.href = '/kelas'}
                >
                  Kelola Kelas
                </Button>
                <Button 
                  icon={<DollarOutlined />} 
                  onClick={() => window.location.href = '/finance'}
                >
                  Keuangan
                </Button>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Statistik Utama */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Siswa"
              value={stats.totalStudents}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#8B5CF6' }}
            />
            <div className="stat-subtitle">+12 bulan ini</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Kelas Aktif"
              value={stats.totalClasses}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#EC4899' }}
            />
            <div className="stat-subtitle">{stats.activeStudents} siswa aktif</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Pendapatan Bulan Ini"
              value={stats.thisMonthRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#10B981' }}
              formatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`}
            />
            <div className="stat-subtitle">+15% dari bulan lalu</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Tingkat Kehadiran"
              value={stats.attendanceRate}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#F59E0B' }}
              suffix="%"
            />
            <div className="stat-subtitle">Rata-rata global</div>
          </Card>
        </Col>
      </Row>

      {/* Progress & Quick Stats */}
      <Row gutter={[16, 16]} className="progress-row">
        <Col xs={24} lg={12}>
          <Card title="Progress Pembayaran" className="progress-card">
            <div className="progress-item">
              <div className="progress-label">
                <span>Pembayaran Lunas</span>
                <span>142/156</span>
              </div>
              <Progress percent={91} strokeColor="#52c41a" />
            </div>
            <div className="progress-item">
              <div className="progress-label">
                <span>Menunggu Pembayaran</span>
                <span>8/156</span>
              </div>
              <Progress percent={5} strokeColor="#faad14" />
            </div>
            <div className="progress-item">
              <div className="progress-label">
                <span>Terlambat</span>
                <span>6/156</span>
              </div>
              <Progress percent={4} strokeColor="#ff4d4f" />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Statistik Kelas" className="progress-card">
            <div className="progress-item">
              <div className="progress-label">
                <span>Kelas Berjalan</span>
                <span>18/24</span>
              </div>
              <Progress percent={75} strokeColor="#1890ff" />
            </div>
            <div className="progress-item">
              <div className="progress-label">
                <span>Kelas Selesai</span>
                <span>6/24</span>
              </div>
              <Progress percent={25} strokeColor="#52c41a" />
            </div>
            <div className="progress-item">
              <div className="progress-label">
                <span>Kelas Baru</span>
                <span>3/24</span>
              </div>
              <Progress percent={12} strokeColor="#722ed1" />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tabel Aktivitas & Top Students */}
      <Row gutter={[16, 16]} className="tables-row">
        <Col xs={24} lg={12}>
          <Card title="Aktivitas Terbaru" className="table-card">
            <Table
              dataSource={recentActivities || []}
              columns={recentActivitiesColumns}
              pagination={false}
              size="small"
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Siswa Terbaik" className="table-card">
            <Table
              dataSource={topStudents || []}
              columns={topStudentsColumns}
              pagination={false}
              size="small"
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
} 