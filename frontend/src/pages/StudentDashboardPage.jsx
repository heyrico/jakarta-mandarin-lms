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
  List,
  Typography,
  Calendar,
  Badge,
  Divider,
  Alert
} from 'antd';
import {
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  StarOutlined,
  TeamOutlined,
  FileTextOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import './StudentDashboardPage.css';

const { Title, Text } = Typography;

const StudentDashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [myClasses, setMyClasses] = useState([]);
  const [myGrades, setMyGrades] = useState([]);
  const [myAttendance, setMyAttendance] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    averageGrade: 0,
    attendanceRate: 0,
    creditsRemaining: 0,
    nextClass: null,
    pendingAssignments: 0
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Fetch student info from backend
        const response = await fetch('http://localhost:3000/user/profile');
        if (response.ok) {
          const data = await response.json();
          setStudentInfo(data);
        } else {
          setStudentInfo({
            name: 'Student Name',
            email: 'student@example.com',
            role: 'SISWA',
            joinDate: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error fetching student info:', error);
        setStudentInfo({
          name: 'Student Name',
          email: 'student@example.com',
          role: 'SISWA',
          joinDate: new Date().toISOString()
        });
      }
    };

    fetchStudentData();
  }, []);

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
    const fetchMyGrades = async () => {
      try {
        const response = await fetch('http://localhost:3000/nilai/my-grades');
        if (response.ok) {
          const data = await response.json();
          setMyGrades(data);
        } else {
          setMyGrades([]);
        }
      } catch (error) {
        console.error('Error fetching grades:', error);
        setMyGrades([]);
      }
    };

    fetchMyGrades();
  }, []);

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
    const fetchUpcomingClasses = async () => {
      try {
        const response = await fetch('http://localhost:3000/kelas/upcoming');
        if (response.ok) {
          const data = await response.json();
          setUpcomingClasses(data);
        } else {
          setUpcomingClasses([]);
        }
      } catch (error) {
        console.error('Error fetching upcoming classes:', error);
        setUpcomingClasses([]);
      }
    };

    fetchUpcomingClasses();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/student/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setStats({
            totalClasses: 0,
            averageGrade: 0,
            attendanceRate: 0,
            completedAssignments: 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          totalClasses: 0,
          averageGrade: 0,
          attendanceRate: 0,
          completedAssignments: 0
        });
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    console.log('Student logout button clicked');
    const confirmed = confirm('Apakah Anda yakin ingin logout?');
    if (confirmed) {
      console.log('Student confirmed logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userInfo');
      alert('Logout berhasil!');
      window.location.href = '/login';
    } else {
      console.log('Student cancelled logout');
    }
  };

  const getGradeColor = (score) => {
    if (score >= 90) return '#52c41a';
    if (score >= 80) return '#faad14';
    if (score >= 70) return '#1890ff';
    return '#ff4d4f';
  };

  const getAttendanceColor = (status) => {
    return status === 'present' ? '#52c41a' : '#ff4d4f';
  };

  const classColumns = [
    {
      title: 'Kelas',
      key: 'class',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{record.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <UserOutlined /> {record.teacher}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <CalendarOutlined /> {record.schedule} {record.time}
          </div>
        </div>
      ),
    },
    {
      title: 'Lokasi',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_, record) => (
        <div>
          <Progress 
            percent={record.progress} 
            size="small" 
            strokeColor={record.progress >= 80 ? '#52c41a' : record.progress >= 60 ? '#faad14' : '#ff4d4f'}
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
            {record.progress}% selesai
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
        <Tag color={record.status === 'active' ? 'green' : 'default'}>
          {record.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
        </Tag>
      ),
    }
  ];

  const gradeColumns = [
    {
      title: 'Kelas',
      dataIndex: 'class',
      key: 'class',
    },
    {
      title: 'Tugas',
      dataIndex: 'assignment',
      key: 'assignment',
    },
    {
      title: 'Nilai',
      key: 'score',
      render: (_, record) => (
        <div>
          <Text strong style={{ color: getGradeColor(record.score), fontSize: '16px' }}>
            {record.score}/{record.maxScore}
          </Text>
        </div>
      ),
    },
    {
      title: 'Tanggal',
      key: 'date',
      render: (_, record) => (
        <div>{new Date(record.date).toLocaleDateString('id-ID')}</div>
      ),
    },
    {
      title: 'Feedback',
      dataIndex: 'feedback',
      key: 'feedback',
      render: (text) => (
        <div style={{ maxWidth: 200, fontSize: '12px' }}>
          {text}
        </div>
      ),
    }
  ];

  if (!studentInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="student-dashboard">
      <div className="student-dashboard-header">
        <div className="header-content">
          <div className="student-info">
            <Avatar size={64} style={{ backgroundColor: '#8B5CF6' }}>
              {studentInfo.avatar}
            </Avatar>
            <div className="student-details">
              <h1>Selamat Datang, {studentInfo.name}! 👨‍🎓</h1>
              <p>Siswa Jakarta Mandarin</p>
              <div className="student-stats">
                <Tag color="purple">Level: {studentInfo.level}</Tag>
                <Tag color="blue">Bergabung {new Date(studentInfo.joinDate).toLocaleDateString('id-ID')}</Tag>
                <Tag color="green">Kredit: {studentInfo.usedCredits}/{studentInfo.totalCredits}</Tag>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <Button 
              type="default" 
              icon={<SettingOutlined />}
              onClick={() => {
                console.log('Student settings button clicked');
                alert('Fitur pengaturan akan segera hadir!');
              }}
            >
              Pengaturan
            </Button>
            <Button 
              type="primary" 
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: 'none'
              }}
            >
              Logout
            </Button>
          </div>
        </div>
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
              title="Rata-rata Nilai"
              value={stats.averageGrade}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#10B981' }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Kehadiran"
              value={stats.attendanceRate}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Kredit Tersisa"
              value={stats.creditsRemaining}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Tugas Pending"
              value={stats.pendingAssignments}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Kelas Berikutnya"
              value={stats.nextClass ? new Date(stats.nextClass).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="quick-actions-card">
        <Title level={4}>
          <BellOutlined style={{ marginRight: 8 }} />
          Aksi Cepat
        </Title>
        <Space wrap>
          <Button 
            type="primary" 
            icon={<BookOutlined />} 
            onClick={() => {
              console.log('View classes button clicked');
              alert('Membuka halaman kelas saya...');
            }}
          >
            Lihat Kelas Saya
          </Button>
          <Button 
            icon={<TrophyOutlined />}
            onClick={() => {
              console.log('View grades button clicked');
              alert('Membuka halaman nilai saya...');
            }}
          >
            Lihat Nilai Saya
          </Button>
          <Button 
            icon={<CheckCircleOutlined />}
            onClick={() => {
              console.log('View attendance button clicked');
              alert('Membuka halaman absensi saya...');
            }}
          >
            Lihat Absensi Saya
          </Button>
          <Button 
            icon={<CalendarOutlined />}
            onClick={() => {
              console.log('View schedule button clicked');
              alert('Membuka jadwal kelas...');
            }}
          >
            Jadwal Kelas
          </Button>
        </Space>
      </Card>

      <Row gutter={[16, 16]} className="content-row">
        {/* Kelas Saya */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span>
                <BookOutlined style={{ marginRight: 8, color: '#8B5CF6' }} />
                Kelas Saya
              </span>
            }
            className="table-card"
            extra={
              <Button type="link" size="small">
                Lihat Semua
              </Button>
            }
          >
            <Table
              columns={classColumns}
              dataSource={myClasses}
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>

        {/* Nilai Terbaru */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span>
                <TrophyOutlined style={{ marginRight: 8, color: '#10B981' }} />
                Nilai Terbaru
              </span>
            }
            className="table-card"
            extra={
              <Button type="link" size="small">
                Lihat Semua
              </Button>
            }
          >
            <Table
              columns={gradeColumns}
              dataSource={myGrades}
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Kelas Mendatang */}
      <Card 
        title={
          <span>
            <CalendarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            Kelas Mendatang
          </span>
        }
        className="upcoming-classes-card"
      >
        <List
          itemLayout="horizontal"
          dataSource={upcomingClasses}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button type="link" size="small">Detail</Button>,
                <Button type="link" size="small">Reminder</Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar style={{ backgroundColor: '#1890ff' }}>
                    <CalendarOutlined />
                  </Avatar>
                }
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{item.class}</span>
                    <Tag color="blue">{item.topic}</Tag>
                  </div>
                }
                description={
                  <div>
                    <div><strong>Guru:</strong> {item.teacher}</div>
                    <div><strong>Tanggal:</strong> {new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div><strong>Waktu:</strong> {item.time}</div>
                    <div><strong>Lokasi:</strong> {item.location}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default StudentDashboardPage; 