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
  TimePicker, 
  Tag, 
  Space, 
  Avatar, 
  Tooltip, 
  message,
  Row,
  Col,
  Statistic,
  Progress,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UserOutlined,
  BookOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  TeamOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import './KelasPage.css';

const { Option } = Select;
const { TextArea } = Input;

const KelasPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({
    totalClasses: 0,
    activeClasses: 0,
    completedClasses: 0,
    totalStudents: 0,
    averageAttendance: 0
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/kelas/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setStats({
            total: 0,
            active: 0,
            inactive: 0,
            totalStudents: 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          total: 0,
          active: 0,
          inactive: 0,
          totalStudents: 0
        });
      }
    };

    fetchStats();
  }, []);

  const handleAddClass = () => {
    setEditingClass(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditClass = (record) => {
    setEditingClass(record);
    form.setFieldsValue({
      name: record.name,
      level: record.level,
      teacher: record.teacher,
      schedule: record.schedule,
      time: record.time,
      startDate: record.startDate,
      endDate: record.endDate,
      maxStudents: record.maxStudents,
      location: record.location,
      description: record.description,
      status: record.status
    });
    setModalVisible(true);
  };

  const handleDeleteClass = (id) => {
    Modal.confirm({
      title: 'Hapus Kelas',
      content: 'Apakah Anda yakin ingin menghapus kelas ini?',
      okText: 'Ya',
      cancelText: 'Tidak',
      onOk: () => {
        setClasses(classes.filter(c => c.id !== id));
        message.success('Kelas berhasil dihapus');
      }
    });
  };

  const handleSubmit = async (values) => {
    try {
      if (editingClass) {
        // Update existing class
        setClasses(classes.map(c => 
          c.id === editingClass.id 
            ? { ...c, ...values }
            : c
        ));
        message.success('Kelas berhasil diperbarui');
      } else {
        // Add new class
        const newClass = {
          id: Date.now(),
          ...values,
          currentStudents: 0,
          attendance: 0,
          progress: 0
        };
        setClasses([...classes, newClass]);
        message.success('Kelas berhasil ditambahkan');
      }
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Terjadi kesalahan');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'upcoming': return 'blue';
      case 'completed': return 'gray';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Basic': return 'blue';
      case 'Intermediate': return 'orange';
      case 'Advanced': return 'purple';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Kelas',
      key: 'class',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{record.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.location}</div>
        </div>
      ),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level) => (
        <Tag color={getLevelColor(level)}>{level}</Tag>
      ),
    },
    {
      title: 'Guru',
      key: 'teacher',
      render: (_, record) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#8B5CF6' }}>
            {record.teacherAvatar}
          </Avatar>
          <span>{record.teacher}</span>
        </Space>
      ),
    },
    {
      title: 'Jadwal',
      key: 'schedule',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>{record.schedule}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.time}</div>
        </div>
      ),
    },
    {
      title: 'Siswa',
      key: 'students',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>
            {record.currentStudents}/{record.maxStudents}
          </div>
          <Progress 
            percent={Math.round((record.currentStudents / record.maxStudents) * 100)} 
            size="small" 
            strokeColor="#52c41a"
            showInfo={false}
          />
        </div>
      ),
    },
    {
      title: 'Kehadiran',
      key: 'attendance',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>{record.attendance}%</div>
          <Progress 
            percent={record.attendance} 
            size="small" 
            strokeColor="#1890ff"
            showInfo={false}
          />
        </div>
      ),
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>{record.progress}%</div>
          <Progress 
            percent={record.progress} 
            size="small" 
            strokeColor="#722ed1"
            showInfo={false}
          />
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ textTransform: 'capitalize' }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Lihat Detail">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => message.info('Fitur detail akan segera hadir!')}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditClass(record)}
            />
          </Tooltip>
          <Tooltip title="Hapus">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDeleteClass(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="kelas-container">
      <div className="kelas-header">
        <h1>Manajemen Kelas</h1>
        <p>Kelola semua kelas pembelajaran Jakarta Mandarin</p>
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
              prefix={<TeamOutlined />}
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
              title="Total Siswa"
              value={stats.totalStudents}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Rata-rata Kehadiran"
              value={stats.averageAttendance}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#10B981' }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Tabel Kelas */}
      <Card 
        title="Daftar Kelas" 
        className="table-card"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddClass}
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              border: 'none'
            }}
          >
            Tambah Kelas
          </Button>
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

      {/* Modal Form */}
      <Modal
        title={editingClass ? 'Edit Kelas' : 'Tambah Kelas Baru'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Nama Kelas"
                rules={[{ required: true, message: 'Nama kelas harus diisi!' }]}
              >
                <Input placeholder="Contoh: Mandarin Basic A" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="level"
                label="Level"
                rules={[{ required: true, message: 'Level harus dipilih!' }]}
              >
                <Select placeholder="Pilih level">
                  <Option value="Basic">Basic</Option>
                  <Option value="Intermediate">Intermediate</Option>
                  <Option value="Advanced">Advanced</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="teacher"
                label="Guru"
                rules={[{ required: true, message: 'Guru harus diisi!' }]}
              >
                <Input placeholder="Nama guru" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label="Lokasi"
                rules={[{ required: true, message: 'Lokasi harus diisi!' }]}
              >
                <Input placeholder="Contoh: Jakarta Pusat" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="schedule"
                label="Jadwal"
                rules={[{ required: true, message: 'Jadwal harus diisi!' }]}
              >
                <Input placeholder="Contoh: Senin & Rabu" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="time"
                label="Waktu"
                rules={[{ required: true, message: 'Waktu harus diisi!' }]}
              >
                <Input placeholder="Contoh: 19:00 - 20:30" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Tanggal Mulai"
                rules={[{ required: true, message: 'Tanggal mulai harus diisi!' }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="Tanggal Selesai"
                rules={[{ required: true, message: 'Tanggal selesai harus diisi!' }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="maxStudents"
                label="Maksimal Siswa"
                rules={[{ required: true, message: 'Maksimal siswa harus diisi!' }]}
              >
                <Input type="number" placeholder="Contoh: 15" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Status harus dipilih!' }]}
              >
                <Select placeholder="Pilih status">
                  <Option value="active">Aktif</Option>
                  <Option value="upcoming">Akan Datang</Option>
                  <Option value="completed">Selesai</Option>
                  <Option value="cancelled">Dibatalkan</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Deskripsi"
            rules={[{ required: true, message: 'Deskripsi harus diisi!' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Deskripsi kelas dan materi yang akan dipelajari"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Batal
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  border: 'none'
                }}
              >
                {editingClass ? 'Update' : 'Simpan'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KelasPage; 