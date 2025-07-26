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
  Divider,
  Badge
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BookOutlined,
  CalendarOutlined,
  StarOutlined,
  HeartOutlined
} from '@ant-design/icons';
import './SSCDashboardPage.css';

const { Title, Text } = Typography;

const SSCDashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    atRiskStudents: 0,
    retentionRate: 0,
    avgProgress: 0
  });

  useEffect(() => {
    const fetchSSCData = async () => {
      try {
        const response = await fetch('http://localhost:3000/ssc/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setStats({
            totalStudents: 0,
            atRiskStudents: 0,
            retentionRate: 0,
            avgProgress: 0
          });
        }
      } catch (error) {
        console.error('Error fetching SSC stats:', error);
        setStats({
          totalStudents: 0,
          atRiskStudents: 0,
          retentionRate: 0,
          avgProgress: 0
        });
      }
    };

    fetchSSCData();
  }, []);

  // Data siswa berisiko
  const atRiskStudentsData = [
    {
      key: '1',
      name: 'Sarah Chen',
      class: 'Kelas Mandarin Intermediate',
      riskLevel: 'Tinggi',
      lastAttendance: '2024-01-15',
      progress: 45,
      intervention: 'Konseling & Remedial'
    },
    {
      key: '2',
      name: 'Michael Wong',
      class: 'Kelas Mandarin Beginner',
      riskLevel: 'Sedang',
      lastAttendance: '2024-01-14',
      progress: 62,
      intervention: 'Tutor Tambahan'
    },
    {
      key: '3',
      name: 'Lisa Tan',
      class: 'Kelas Mandarin Advanced',
      riskLevel: 'Tinggi',
      lastAttendance: '2024-01-10',
      progress: 38,
      intervention: 'Konseling & Remedial'
    },
    {
      key: '4',
      name: 'David Liu',
      class: 'Kelas Mandarin Intermediate',
      riskLevel: 'Sedang',
      lastAttendance: '2024-01-13',
      progress: 55,
      intervention: 'Tutor Tambahan'
    },
    {
      key: '5',
      name: 'Emma Zhang',
      class: 'Kelas Mandarin Beginner',
      riskLevel: 'Rendah',
      lastAttendance: '2024-01-12',
      progress: 72,
      intervention: 'Monitoring'
    }
  ];

  // Data progress siswa
  const studentProgressData = [
    {
      key: '1',
      name: 'Alexandra Wang',
      class: 'Kelas Mandarin Advanced',
      attendance: 95,
      homework: 88,
      participation: 92,
      overall: 91.7
    },
    {
      key: '2',
      name: 'Benjamin Lim',
      class: 'Kelas Mandarin Intermediate',
      attendance: 87,
      homework: 85,
      participation: 90,
      overall: 87.3
    },
    {
      key: '3',
      name: 'Claire Tan',
      class: 'Kelas Mandarin Beginner',
      attendance: 92,
      homework: 90,
      participation: 85,
      overall: 89.0
    },
    {
      key: '4',
      name: 'Daniel Chen',
      class: 'Kelas Mandarin Advanced',
      attendance: 78,
      homework: 82,
      participation: 80,
      overall: 80.0
    },
    {
      key: '5',
      name: 'Fiona Wong',
      class: 'Kelas Mandarin Intermediate',
      attendance: 96,
      homework: 94,
      participation: 95,
      overall: 95.0
    }
  ];

  // Data intervensi terbaru
  const recentInterventions = [
    {
      id: 1,
      student: 'Sarah Chen',
      type: 'Konseling Akademik',
      date: '2024-01-15',
      status: 'Selesai',
      notes: 'Siswa menunjukkan peningkatan motivasi setelah sesi konseling'
    },
    {
      id: 2,
      student: 'Michael Wong',
      type: 'Tutor Tambahan',
      date: '2024-01-14',
      status: 'Berlangsung',
      notes: 'Sesi tutor tambahan untuk memperkuat dasar grammar'
    },
    {
      id: 3,
      student: 'Lisa Tan',
      type: 'Konseling Akademik',
      date: '2024-01-12',
      status: 'Dijadwalkan',
      notes: 'Konseling untuk mengatasi masalah kepercayaan diri'
    },
    {
      id: 4,
      student: 'David Liu',
      type: 'Remedial Class',
      date: '2024-01-11',
      status: 'Selesai',
      notes: 'Kelas remedial untuk topik yang tertinggal'
    }
  ];

  // Kolom untuk tabel siswa berisiko
  const atRiskColumns = [
    {
      title: 'Nama Siswa',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
          {text}
        </div>
      )
    },
    {
      title: 'Kelas',
      dataIndex: 'class',
      key: 'class'
    },
    {
      title: 'Level Risiko',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (level) => {
        let color = 'green';
        if (level === 'Tinggi') color = 'red';
        else if (level === 'Sedang') color = 'orange';
        return <Tag color={color}>{level}</Tag>;
      }
    },
    {
      title: 'Kehadiran Terakhir',
      dataIndex: 'lastAttendance',
      key: 'lastAttendance'
    },
    {
      title: 'Progress (%)',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <Progress 
          percent={progress} 
          size="small" 
          status={progress < 50 ? 'exception' : progress < 70 ? 'active' : 'success'}
        />
      )
    },
    {
      title: 'Intervensi',
      dataIndex: 'intervention',
      key: 'intervention',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small">Detail</Button>
          <Button size="small">Intervensi</Button>
        </Space>
      )
    }
  ];

  // Kolom untuk tabel progress siswa
  const progressColumns = [
    {
      title: 'Nama Siswa',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
          {text}
        </div>
      )
    },
    {
      title: 'Kelas',
      dataIndex: 'class',
      key: 'class'
    },
    {
      title: 'Kehadiran (%)',
      dataIndex: 'attendance',
      key: 'attendance',
      render: (value) => <Progress percent={value} size="small" />
    },
    {
      title: 'Tugas (%)',
      dataIndex: 'homework',
      key: 'homework',
      render: (value) => <Progress percent={value} size="small" />
    },
    {
      title: 'Partisipasi (%)',
      dataIndex: 'participation',
      key: 'participation',
      render: (value) => <Progress percent={value} size="small" />
    },
    {
      title: 'Overall (%)',
      dataIndex: 'overall',
      key: 'overall',
      render: (value) => (
        <div>
          <Text strong style={{ color: value >= 90 ? '#52c41a' : value >= 80 ? '#1890ff' : '#faad14' }}>
            {value}%
          </Text>
        </div>
      )
    }
  ];

  const handleViewDetails = (studentId) => {
    console.log('View details for student:', studentId);
    // Implementasi untuk melihat detail siswa
  };

  const handleScheduleIntervention = (studentId) => {
    console.log('Schedule intervention for student:', studentId);
    // Implementasi untuk menjadwalkan intervensi
  };

  const handleGenerateReport = () => {
    console.log('Generating student success report...');
    // Implementasi untuk generate laporan
  };

  return (
    <div className="ssc-dashboard">
      <div className="ssc-dashboard-header">
        <Title level={2}>
          <TeamOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          Student Success Coordinator Dashboard
        </Title>
        <Text type="secondary">
          Monitoring dan pengembangan kesuksesan siswa Jakarta Mandarin
        </Text>
      </div>

      {/* Statistik Utama */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Siswa"
              value={stats.totalStudents}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Siswa Berisiko"
              value={stats.atRiskStudents}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
              suffix={
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  ({((stats.atRiskStudents / stats.totalStudents) * 100).toFixed(1)}%)
                </Text>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Retention Rate"
              value={stats.retentionRate}
              prefix={<RiseOutlined />}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Rata-rata Progress"
              value={stats.avgProgress}
              prefix={<TrophyOutlined />}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="quick-actions-card">
        <Title level={4}>
          <ClockCircleOutlined style={{ marginRight: 8 }} />
          Aksi Cepat
        </Title>
        <Space wrap>
          <Button type="primary" icon={<BookOutlined />} onClick={handleGenerateReport}>
            Generate Laporan
          </Button>
          <Button icon={<CalendarOutlined />}>
            Jadwalkan Konseling
          </Button>
          <Button icon={<TeamOutlined />}>
            Review Siswa Berisiko
          </Button>
          <Button icon={<StarOutlined />}>
            Evaluasi Program
          </Button>
        </Space>
      </Card>

      <Row gutter={[16, 16]} className="content-row">
        {/* Tabel Siswa Berisiko */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span>
                <ExclamationCircleOutlined style={{ marginRight: 8, color: '#ff4d4f' }} />
                Siswa Berisiko
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
              columns={atRiskColumns}
              dataSource={atRiskStudentsData}
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>

        {/* Tabel Progress Siswa */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span>
                <RiseOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                Progress Siswa
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
              columns={progressColumns}
              dataSource={studentProgressData}
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Intervensi Terbaru */}
      <Card 
        title={
          <span>
            <HeartOutlined style={{ marginRight: 8, color: '#eb2f96' }} />
            Intervensi Terbaru
          </span>
        }
        className="interventions-card"
      >
        <List
          itemLayout="horizontal"
          dataSource={recentInterventions}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button type="link" size="small">Detail</Button>,
                <Button type="link" size="small">Update</Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Badge 
                    status={
                      item.status === 'Selesai' ? 'success' : 
                      item.status === 'Berlangsung' ? 'processing' : 'default'
                    }
                  >
                    <Avatar icon={<UserOutlined />} />
                  </Badge>
                }
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{item.student}</span>
                    <Tag color={
                      item.status === 'Selesai' ? 'green' : 
                      item.status === 'Berlangsung' ? 'blue' : 'orange'
                    }>
                      {item.status}
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <div><strong>{item.type}</strong> - {item.date}</div>
                    <div style={{ marginTop: 4, color: '#666' }}>{item.notes}</div>
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

export default SSCDashboardPage; 