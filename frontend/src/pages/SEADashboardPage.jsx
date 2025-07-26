import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Tag, Progress, Typography, Space, Avatar, List, Timeline } from 'antd';
import {
  UserOutlined,
  DollarOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
  CalendarOutlined,
  MessageOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function SEADashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 156,
    newRegistrations: 12,
    pendingInvoices: 8,
    totalRevenue: 125000000,
    conversionRate: 78
  });

  const [recentStudents, setRecentStudents] = useState([
    {
      id: 1,
      name: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      status: 'active',
      registrationDate: '2024-01-20',
      package: 'HSK 1 Basic',
      avatar: 'B'
    },
    {
      id: 2,
      name: 'Sari Dewi',
      email: 'sari.dewi@email.com',
      status: 'pending',
      registrationDate: '2024-01-19',
      package: 'HSK 2 Intermediate',
      avatar: 'S'
    },
    {
      id: 3,
      name: 'Ahmad Rizki',
      email: 'ahmad.rizki@email.com',
      status: 'active',
      registrationDate: '2024-01-18',
      package: 'HSK 4 Advanced',
      avatar: 'A'
    }
  ]);

  const [pendingInvoices, setPendingInvoices] = useState([
    {
      id: 1,
      studentName: 'Budi Santoso',
      amount: 2500000,
      dueDate: '2024-01-25',
      status: 'pending',
      description: 'Paket HSK 1 Basic'
    },
    {
      id: 2,
      studentName: 'Sari Dewi',
      amount: 3000000,
      dueDate: '2024-01-28',
      status: 'overdue',
      description: 'Paket HSK 2 Intermediate'
    },
    {
      id: 3,
      studentName: 'Ahmad Rizki',
      amount: 4000000,
      dueDate: '2024-01-30',
      status: 'pending',
      description: 'Paket HSK 4 Advanced'
    }
  ]);

  const columns = [
    {
      title: 'Siswa',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar size={32} style={{ background: '#1890ff' }}>
            {record.avatar}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>{name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.email}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status === 'active' ? 'Aktif' : 'Pending'}
        </Tag>
      )
    },
    {
      title: 'Paket',
      dataIndex: 'package',
      key: 'package'
    },
    {
      title: 'Tanggal Daftar',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      render: (date) => new Date(date).toLocaleDateString()
    }
  ];

  const invoiceColumns = [
    {
      title: 'Siswa',
      dataIndex: 'studentName',
      key: 'studentName'
    },
    {
      title: 'Deskripsi',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Jumlah',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `Rp ${amount.toLocaleString()}`
    },
    {
      title: 'Jatuh Tempo',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'pending' ? 'orange' : 'red'}>
          {status === 'pending' ? 'Pending' : 'Overdue'}
        </Tag>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>📊 Dashboard SEA (Sales Executive Admin)</Title>
        <Text type="secondary">Kelola siswa, pendaftaran, dan invoice</Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Siswa"
              value={stats.totalStudents}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Pendaftaran Baru"
              value={stats.newRegistrations}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Invoice Pending"
              value={stats.pendingInvoices}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#722ed1' }}
              formatter={(value) => `Rp ${(value / 1000000).toFixed(0)}M`}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Conversion Rate"
              value={stats.conversionRate}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#52c41a' }}>
                {Math.round((stats.newRegistrations / stats.totalStudents) * 100)}%
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>Growth Rate</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Recent Students */}
        <Col span={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <UserOutlined />
                <span>Siswa Terbaru</span>
              </div>
            }
            extra={<Button type="link">Lihat Semua</Button>}
          >
            <Table
              columns={columns}
              dataSource={recentStudents}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Pending Invoices */}
        <Col span={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileTextOutlined />
                <span>Invoice Pending</span>
              </div>
            }
            extra={<Button type="link">Lihat Semua</Button>}
          >
            <Table
              columns={invoiceColumns}
              dataSource={pendingInvoices}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        {/* Quick Actions */}
        <Col span={12}>
          <Card title="🚀 Quick Actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" icon={<UserOutlined />} block>
                Tambah Siswa Baru
              </Button>
              <Button icon={<FileTextOutlined />} block>
                Buat Invoice
              </Button>
              <Button icon={<ShoppingCartOutlined />} block>
                Kelola Add On
              </Button>
              <Button icon={<ExclamationCircleOutlined />} block>
                Kirim Payment Reminder
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Recent Activities */}
        <Col span={12}>
          <Card title="📅 Recent Activities">
            <Timeline size="small">
              <Timeline.Item color="green">
                <div>
                  <div style={{ fontWeight: 600 }}>Siswa baru mendaftar</div>
                  <div style={{ fontSize: 12, color: '#666' }}>Budi Santoso - HSK 1 Basic</div>
                  <div style={{ fontSize: 11, color: '#999' }}>2 jam yang lalu</div>
                </div>
              </Timeline.Item>
              <Timeline.Item color="blue">
                <div>
                  <div style={{ fontWeight: 600 }}>Invoice dibuat</div>
                  <div style={{ fontSize: 12, color: '#666' }}>Sari Dewi - Rp 3.000.000</div>
                  <div style={{ fontSize: 11, color: '#999' }}>4 jam yang lalu</div>
                </div>
              </Timeline.Item>
              <Timeline.Item color="orange">
                <div>
                  <div style={{ fontWeight: 600 }}>Payment reminder dikirim</div>
                  <div style={{ fontSize: 12, color: '#666' }}>Ahmad Rizki - Invoice #123</div>
                  <div style={{ fontSize: 11, color: '#999' }}>6 jam yang lalu</div>
                </div>
              </Timeline.Item>
              <Timeline.Item color="green">
                <div>
                  <div style={{ fontWeight: 600 }}>Pembayaran diterima</div>
                  <div style={{ fontSize: 12, color: '#666' }}>Diana Putri - Rp 2.500.000</div>
                  <div style={{ fontSize: 11, color: '#999' }}>1 hari yang lalu</div>
                </div>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
      </Row>
    </div>
  );
} 