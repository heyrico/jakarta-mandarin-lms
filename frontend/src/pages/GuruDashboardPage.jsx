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
  List,
  Typography,
  Tabs,
  Calendar,
  Descriptions
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UserOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  SearchOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  TrophyOutlined,
  ScheduleOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import './GuruDashboardPage.css';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const GuruDashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [myClasses, setMyClasses] = useState([]);
  const [myStudents, setMyStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [gradeRecords, setGradeRecords] = useState([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    averageAttendance: 0,
    averageGrade: 0,
    todayClasses: 0,
    pendingGrades: 0
  });

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await fetch('http://localhost:3000/user/profile');
        if (response.ok) {
          const data = await response.json();
          setTeacherInfo(data);
        } else {
          setTeacherInfo({
            name: 'Teacher Name',
            email: 'teacher@example.com',
            role: 'GURU',
            joinDate: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error fetching teacher info:', error);
        setTeacherInfo({
          name: 'Teacher Name',
          email: 'teacher@example.com',
          role: 'GURU',
          joinDate: new Date().toISOString()
        });
      }
    };

    fetchTeacherData();
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
    const fetchMyStudents = async () => {
      try {
        const response = await fetch('http://localhost:3000/user?role=SISWA');
        if (response.ok) {
          const data = await response.json();
          setMyStudents(data);
        } else {
          setMyStudents([]);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        setMyStudents([]);
      }
    };

    fetchMyStudents();
  }, []);

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const response = await fetch('http://localhost:3000/absensi');
        if (response.ok) {
          const data = await response.json();
          setAttendanceRecords(data);
        } else {
          setAttendanceRecords([]);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
        setAttendanceRecords([]);
      }
    };

    fetchAttendanceRecords();
  }, []);

  useEffect(() => {
    const fetchGradeRecords = async () => {
      try {
        const response = await fetch('http://localhost:3000/nilai');
        if (response.ok) {
          const data = await response.json();
          setGradeRecords(data);
        } else {
          setGradeRecords([]);
        }
      } catch (error) {
        console.error('Error fetching grades:', error);
        setGradeRecords([]);
      }
    };

    fetchGradeRecords();
  }, []);

  const handleLogout = () => {
    console.log('Logout button clicked');
    const confirmed = confirm('Apakah Anda yakin ingin logout?');
    if (confirmed) {
      console.log('User confirmed logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userInfo');
      alert('Logout berhasil!');
      window.location.href = '/login';
    } else {
      console.log('User cancelled logout');
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return '#52c41a';
    if (percentage >= 80) return '#faad14';
    return '#ff4d4f';
  };

  const getGradeColor = (score) => {
    if (score >= 90) return '#52c41a';
    if (score >= 80) return '#faad14';
    if (score >= 70) return '#1890ff';
    return '#ff4d4f';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'completed': return 'blue';
      default: return 'default';
    }
  };

  const classColumns = [
    {
      title: 'Kelas',
      key: 'class',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{record.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Level: {record.level}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <ScheduleOutlined /> {record.schedule} {record.time}
          </div>
        </div>
      ),
    },
    {
      title: 'Lokasi & Siswa',
      key: 'location',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>{record.location}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <TeamOutlined /> {record.totalStudents} siswa
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Pertemuan: {record.currentMeeting}/{record.totalMeetings}
          </div>
        </div>
      ),
    },
    {
      title: 'Kehadiran',
      key: 'attendance',
      render: (_, record) => (
        <div>
          <Progress 
            percent={record.attendance} 
            size="small" 
            strokeColor={getAttendanceColor(record.attendance)}
            format={(percent) => `${percent}%`}
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
            Rata-rata kehadiran
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
      title: 'Aksi',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              border: 'none'
            }}
            onClick={() => {
              console.log('Absensi button clicked for:', record.name);
              alert(`Mengelola absensi untuk ${record.name}`);
            }}
          >
            Absensi
          </Button>
          <Button 
            type="default" 
            size="small"
            onClick={() => {
              console.log('Nilai button clicked for:', record.name);
              alert(`Mengelola nilai untuk ${record.name}`);
            }}
          >
            Nilai
          </Button>
        </Space>
      ),
    },
  ];

  const studentColumns = [
    {
      title: 'Siswa',
      key: 'student',
      render: (_, record) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#8B5CF6' }}>
            {record.avatar}
          </Avatar>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{record.name}</div>
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
      title: 'Kelas & Level',
      key: 'class',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>{record.className}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Level: {record.level}
          </div>
          <Tag color={getStatusColor(record.status)}>
            {record.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Kehadiran',
      key: 'attendance',
      render: (_, record) => (
        <div>
          <Progress 
            percent={record.attendance} 
            size="small" 
            strokeColor={getAttendanceColor(record.attendance)}
            format={(percent) => `${percent}%`}
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
            Terakhir: {new Date(record.lastAttendance).toLocaleDateString('id-ID')}
          </div>
        </div>
      ),
    },
    {
      title: 'Nilai Rata-rata',
      key: 'grade',
      render: (_, record) => (
        <div>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '16px',
            color: getGradeColor(record.averageGrade)
          }}>
            {record.averageGrade}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            dari 100
          </div>
        </div>
      ),
    },
    {
      title: 'Kontak Darurat',
      key: 'emergency',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.emergencyContact}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.emergencyPhone}
          </div>
        </div>
      ),
    },
    {
      title: 'Aksi',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              border: 'none'
            }}
            onClick={() => {
              console.log('Detail button clicked for:', record.name);
              alert(`Melihat detail ${record.name}`);
            }}
          >
            Detail
          </Button>
          <Button 
            type="default" 
            size="small"
            onClick={() => {
              console.log('Pesan button clicked for:', record.name);
              alert(`Mengirim pesan ke ${record.name}`);
            }}
          >
            Pesan
          </Button>
        </Space>
      ),
    },
  ];

  if (!teacherInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="guru-dashboard-container">
      {/* Header */}
      <div className="guru-dashboard-header">
        <div className="header-content">
          <div className="teacher-info">
            <Avatar size={64} style={{ backgroundColor: '#8B5CF6' }}>
              {teacherInfo.avatar}
            </Avatar>
            <div className="teacher-details">
              <h1>Selamat Datang, {teacherInfo.name}! 👨‍🏫</h1>
              <p>Guru Mandarin Jakarta Mandarin</p>
              <div className="teacher-stats">
                <Tag color="purple">{teacherInfo.specialization}</Tag>
                <Tag color="blue">{teacherInfo.experience} pengalaman</Tag>
                <Tag color="green">Bergabung {new Date(teacherInfo.joinDate).toLocaleDateString('id-ID')}</Tag>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <Button 
              type="default" 
              icon={<SettingOutlined />}
              onClick={() => {
                console.log('Pengaturan button clicked');
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
              title="Total Siswa"
              value={stats.totalStudents}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#10B981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Rata-rata Kehadiran"
              value={stats.averageAttendance}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Rata-rata Nilai"
              value={stats.averageGrade}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Kelas Hari Ini"
              value={stats.todayClasses}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Nilai Pending"
              value={stats.pendingGrades}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#ec4899' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabs Content */}
      <Card className="main-content-card">
        <Tabs 
          defaultActiveKey="classes" 
          size="large"
          items={[
            {
              key: 'classes',
              label: 'Kelas Saya',
              children: (
                <Table
                  columns={classColumns}
                  dataSource={myClasses}
                  loading={loading}
                  rowKey="id"
                  pagination={false}
                />
              )
            },
            {
              key: 'students',
              label: 'Siswa Saya',
              children: (
                <Table
                  columns={studentColumns}
                  dataSource={myStudents}
                  loading={loading}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true
                  }}
                />
              )
            },
            {
              key: 'attendance',
              label: 'Absensi Terbaru',
              children: (
                <List
                  dataSource={attendanceRecords}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar style={{ backgroundColor: '#52c41a' }}>
                            <CheckCircleOutlined />
                          </Avatar>
                        }
                        title={`${item.studentName} - ${item.className}`}
                        description={
                          <div>
                            <div>Tanggal: {new Date(item.date).toLocaleDateString('id-ID')}</div>
                            <div>Status: 
                              <Tag color={item.status === 'present' ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                                {item.status === 'present' ? 'Hadir' : 'Tidak Hadir'}
                              </Tag>
                            </div>
                            <div style={{ marginTop: 4, fontStyle: 'italic', color: '#666' }}>
                              "{item.notes}"
                            </div>
                          </div>
                        }
                      />
                      <Tag color={getStatusColor(item.status)}>
                        {item.status === 'completed' ? 'Selesai' : 'Pending'}
                      </Tag>
                    </List.Item>
                  )}
                />
              )
            },
            {
              key: 'grades',
              label: 'Nilai Terbaru',
              children: (
                <List
                  dataSource={gradeRecords}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar style={{ backgroundColor: '#8B5CF6' }}>
                            <TrophyOutlined />
                          </Avatar>
                        }
                        title={`${item.studentName} - ${item.assignment}`}
                        description={
                          <div>
                            <div>Kelas: {item.className}</div>
                            <div>Tanggal: {new Date(item.date).toLocaleDateString('id-ID')}</div>
                            <div style={{ marginTop: 4 }}>
                              <Text strong style={{ color: getGradeColor(item.score) }}>
                                Nilai: {item.score}/{item.maxScore}
                              </Text>
                            </div>
                            <div style={{ marginTop: 4, fontStyle: 'italic', color: '#666' }}>
                              "{item.feedback}"
                            </div>
                          </div>
                        }
                      />
                      <Button 
                        type="text" 
                        icon={<EditOutlined />}
                        onClick={() => {
                          console.log('Edit nilai button clicked');
                          alert('Fitur edit nilai akan segera hadir!');
                        }}
                      >
                        Edit
                      </Button>
                    </List.Item>
                  )}
                />
              )
            }
          ]}
        />
      </Card>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card className="action-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, color: '#1e293b' }}>Aksi Cepat</h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
                  Kelola absensi dan nilai siswa dengan mudah
                </p>
              </div>
              <Space>
                <Button 
                  type="primary" 
                  icon={<CheckCircleOutlined />} 
                  size="large"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    border: 'none'
                  }}
                  onClick={() => {
                    console.log('Input Absensi button clicked');
                    alert('Membuka halaman input absensi...');
                    setTimeout(() => {
                      alert('Fitur input absensi akan segera hadir!');
                    }, 1000);
                  }}
                >
                  Input Absensi Hari Ini
                </Button>
                <Button 
                  type="default" 
                  icon={<TrophyOutlined />} 
                  size="large"
                  onClick={() => {
                    console.log('Input Nilai button clicked');
                    alert('Membuka halaman input nilai...');
                    setTimeout(() => {
                      alert('Fitur input nilai akan segera hadir!');
                    }, 1000);
                  }}
                >
                  Input Nilai
                </Button>
                <Button 
                  type="default" 
                  icon={<CalendarOutlined />} 
                  size="large"
                  onClick={() => {
                    console.log('Jadwal Kelas button clicked');
                    alert('Membuka jadwal kelas...');
                    setTimeout(() => {
                      alert('Fitur jadwal kelas akan segera hadir!');
                    }, 1000);
                  }}
                >
                  Jadwal Kelas
                </Button>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GuruDashboardPage; 