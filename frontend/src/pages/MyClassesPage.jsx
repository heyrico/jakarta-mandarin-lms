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
  Empty
} from 'antd';
import {
  BookOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import './MyClassesPage.css';

const { Title, Text } = Typography;

const MyClassesPage = () => {
  const [loading, setLoading] = useState(false);
  const [myClasses, setMyClasses] = useState([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    activeClasses: 0,
    completedClasses: 0,
    averageProgress: 0,
    nextClass: null
  });

  useEffect(() => {
    const fetchMyClasses = async () => {
      try {
        const response = await fetch('http://localhost:3000/kelas/my-classes');
        if (response.ok) {
          const data = await response.json();
          setMyClasses(data);
        } else {
          setMyClasses([]);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        setMyClasses([]);
      }
    };

    fetchMyClasses();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/student/classes-stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setStats({
            totalClasses: 0,
            activeClasses: 0,
            completedClasses: 0,
            totalCredits: 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          totalClasses: 0,
          activeClasses: 0,
          completedClasses: 0,
          totalCredits: 0
        });
      }
    };

    fetchStats();
  }, []);

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#52c41a';
    if (progress >= 60) return '#faad14';
    return '#ff4d4f';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'green' : 'default';
  };

  const columns = [
    {
      title: 'Kelas',
      key: 'class',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
            {record.name}
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginTop: 4 }}>
            <BookOutlined /> {record.level}
          </div>
          <div style={{ fontSize: '12px', color: '#999', marginTop: 2 }}>
            {record.description}
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
      title: 'Jadwal',
      key: 'schedule',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>
            <CalendarOutlined /> {record.schedule}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
            <ClockCircleOutlined /> {record.time}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <EnvironmentOutlined /> {record.location}
          </div>
        </div>
      ),
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_, record) => (
        <div>
          <Progress 
            percent={record.progress} 
            size="small" 
            strokeColor={getProgressColor(record.progress)}
            format={percent => `${percent}%`}
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
            {record.progress >= 80 ? 'Hampir Selesai' : 
             record.progress >= 60 ? 'Sedang Berjalan' : 'Baru Mulai'}
          </div>
        </div>
      ),
    },
    {
      title: 'Kelas Berikutnya',
      key: 'nextClass',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>
            {new Date(record.nextClass).toLocaleDateString('id-ID')}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {new Date(record.nextClass).toLocaleDateString('id-ID', { weekday: 'long' })}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)}>
          {record.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
        </Tag>
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
              console.log('View class details:', record.name);
              alert(`Melihat detail kelas: ${record.name}`);
            }}
          >
            Detail
          </Button>
          <Button 
            type="link" 
            size="small"
            onClick={() => {
              console.log('View class materials:', record.name);
              alert(`Melihat materi kelas: ${record.name}`);
            }}
          >
            Materi
          </Button>
          <Button 
            type="link" 
            size="small"
            onClick={() => {
              console.log('View class schedule:', record.name);
              alert(`Melihat jadwal kelas: ${record.name}`);
            }}
          >
            Jadwal
          </Button>
        </Space>
      ),
    }
  ];

  return (
    <div className="my-classes-page">
      <div className="page-header">
        <Title level={2}>
          <BookOutlined style={{ marginRight: 8, color: '#8B5CF6' }} />
          Kelas Saya
        </Title>
        <Text type="secondary">
          Kelola dan monitor kelas yang Anda ikuti di Jakarta Mandarin
        </Text>
      </div>

      {/* Statistik */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Total Kelas"
              value={stats.totalClasses}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#8B5CF6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Kelas Aktif"
              value={stats.activeClasses}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Kelas Selesai"
              value={stats.completedClasses}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Rata-rata Progress"
              value={stats.averageProgress}
              prefix={<Progress />}
              valueStyle={{ color: '#1890ff' }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Kelas Berikutnya"
              value={stats.nextClass ? new Date(stats.nextClass).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
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
              console.log('View all schedules clicked');
              alert('Melihat jadwal semua kelas...');
            }}
          >
            Lihat Jadwal Semua Kelas
          </Button>
          <Button 
            icon={<BookOutlined />}
            onClick={() => {
              console.log('View all materials clicked');
              alert('Melihat materi semua kelas...');
            }}
          >
            Lihat Materi Semua Kelas
          </Button>
          <Button 
            icon={<TrophyOutlined />}
            onClick={() => {
              console.log('View progress report clicked');
              alert('Melihat laporan progress...');
            }}
          >
            Laporan Progress
          </Button>
        </Space>
      </Card>

      {/* Daftar Kelas */}
      <Card 
        title={
          <span>
            <BookOutlined style={{ marginRight: 8, color: '#8B5CF6' }} />
            Daftar Kelas Saya
          </span>
        }
        className="classes-table-card"
      >
        {myClasses.length > 0 ? (
          <Table
            columns={columns}
            dataSource={myClasses}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} kelas`
            }}
            scroll={{ x: 1200 }}
            rowKey="id"
          />
        ) : (
          <Empty
            description="Belum ada kelas yang diikuti"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => {
              console.log('Register for class clicked');
              alert('Mendaftar kelas baru...');
            }}>
              Daftar Kelas Baru
            </Button>
          </Empty>
        )}
      </Card>
    </div>
  );
};

export default MyClassesPage; 