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
  Tabs
} from 'antd';
import {
  TrophyOutlined,
  FileTextOutlined,
  StarOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BookOutlined
} from '@ant-design/icons';
import './MyGradesPage.css';

const { Title, Text } = Typography;

const MyGradesPage = () => {
  const [loading, setLoading] = useState(false);
  const [myGrades, setMyGrades] = useState([]);
  const [stats, setStats] = useState({
    totalGrades: 0,
    averageGrade: 0,
    excellent: 0,
    good: 0,
    average: 0,
    needImprovement: 0
  });

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
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/student/grades-stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setStats({
            averageGrade: 0,
            totalAssignments: 0,
            highestGrade: 0,
            lowestGrade: 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          averageGrade: 0,
          totalAssignments: 0,
          highestGrade: 0,
          lowestGrade: 0
        });
      }
    };

    fetchStats();
  }, []);

  const getGradeColor = (score) => {
    if (score >= 90) return '#52c41a';
    if (score >= 80) return '#faad14';
    if (score >= 70) return '#1890ff';
    return '#ff4d4f';
  };

  const getGradeTagColor = (grade) => {
    if (grade.startsWith('A')) return 'green';
    if (grade.startsWith('B')) return 'blue';
    if (grade.startsWith('C')) return 'orange';
    return 'red';
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
            <BookOutlined /> {record.type}
          </div>
        </div>
      ),
    },
    {
      title: 'Tugas',
      dataIndex: 'assignment',
      key: 'assignment',
      render: (text) => (
        <div style={{ fontWeight: '500' }}>{text}</div>
      ),
    },
    {
      title: 'Nilai',
      key: 'score',
      render: (_, record) => (
        <div>
          <Text strong style={{ color: getGradeColor(record.score), fontSize: '16px' }}>
            {record.score}/{record.maxScore}
          </Text>
          <div style={{ fontSize: '12px', color: '#666', marginTop: 2 }}>
            ({record.score}% - {record.grade})
          </div>
        </div>
      ),
    },
    {
      title: 'Grade',
      key: 'grade',
      render: (_, record) => (
        <Tag color={getGradeTagColor(record.grade)} style={{ fontWeight: '600' }}>
          {record.grade}
        </Tag>
      ),
    },
    {
      title: 'Tanggal',
      key: 'date',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>
            {new Date(record.date).toLocaleDateString('id-ID')}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <UserOutlined /> {record.teacher}
          </div>
        </div>
      ),
    },
    {
      title: 'Feedback',
      dataIndex: 'feedback',
      key: 'feedback',
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
              console.log('View grade details:', record.assignment);
              alert(`Melihat detail nilai: ${record.assignment}`);
            }}
          >
            Detail
          </Button>
          <Button 
            type="link" 
            size="small"
            onClick={() => {
              console.log('Download certificate:', record.assignment);
              alert(`Download sertifikat: ${record.assignment}`);
            }}
          >
            Sertifikat
          </Button>
        </Space>
      ),
    }
  ];

  const performanceData = [
    { type: 'Speaking', score: 86.5 },
    { type: 'Writing', score: 78.0 },
    { type: 'Grammar', score: 92.0 },
    { type: 'Reading', score: 88.0 },
    { type: 'Listening', score: 85.0 }
  ];

  const PerformanceChart = () => (
    <div style={{ padding: '20px 0' }}>
      {performanceData.map((item, index) => (
        <div key={index} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: '500' }}>{item.type}</span>
            <span style={{ color: getGradeColor(item.score) }}>{item.score}%</span>
          </div>
          <Progress 
            percent={item.score} 
            strokeColor={getGradeColor(item.score)}
            showInfo={false}
            size="small"
          />
        </div>
      ))}
    </div>
  );

  const tabItems = [
    {
      key: 'grade-list',
      label: 'Daftar Nilai',
      children: (
        <div>
          {myGrades.length > 0 ? (
            <Table
              columns={columns}
              dataSource={myGrades}
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} nilai`
              }}
              scroll={{ x: 1200 }}
              rowKey="id"
            />
          ) : (
            <Empty
              description="Belum ada nilai yang tersedia"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      )
    },
    {
      key: 'performance',
      label: 'Performa Siswa',
      children: (
        <Card className="performance-card">
          <Title level={4}>Analisis Performa per Kategori</Title>
          <PerformanceChart />
        </Card>
      )
    },
    {
      key: 'analysis',
      label: 'Grafik & Analisis',
      children: (
        <Card className="analysis-card">
          <Title level={4}>Analisis Trend Nilai</Title>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text type="secondary">Grafik analisis trend nilai akan ditampilkan di sini</Text>
            <br />
            <Button 
              type="primary" 
              style={{ marginTop: 16 }}
              onClick={() => {
                console.log('Generate analysis report clicked');
                alert('Membuat laporan analisis nilai...');
              }}
            >
              Generate Laporan
            </Button>
          </div>
        </Card>
      )
    }
  ];

  return (
    <div className="my-grades-page">
      <div className="page-header">
        <Title level={2}>
          <TrophyOutlined style={{ marginRight: 8, color: '#8B5CF6' }} />
          Nilai Saya
        </Title>
        <Text type="secondary">
          Monitor dan analisis nilai pembelajaran Anda di Jakarta Mandarin
        </Text>
      </div>

      {/* Statistik */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Total Nilai"
              value={stats.totalGrades}
              prefix={<FileTextOutlined />}
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
              title="Excellent (A)"
              value={stats.excellent}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Good (B)"
              value={stats.good}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Average (C)"
              value={stats.average}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Need Improvement"
              value={stats.needImprovement}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
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
            icon={<FileTextOutlined />}
            onClick={() => {
              console.log('Download all grades clicked');
              alert('Download semua nilai...');
            }}
          >
            Download Semua Nilai
          </Button>
          <Button 
            icon={<TrophyOutlined />}
            onClick={() => {
              console.log('View certificates clicked');
              alert('Melihat semua sertifikat...');
            }}
          >
            Lihat Sertifikat
          </Button>
          <Button 
            icon={<StarOutlined />}
            onClick={() => {
              console.log('View achievements clicked');
              alert('Melihat pencapaian...');
            }}
          >
            Pencapaian Saya
          </Button>
        </Space>
      </Card>

      {/* Tabs Content */}
      <Card className="tabs-card">
        <Tabs
          defaultActiveKey="grade-list"
          size="large"
          items={tabItems}
          className="grades-tabs"
        />
      </Card>
    </div>
  );
};

export default MyGradesPage; 