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
  Divider
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
  TrophyOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  DownloadOutlined,
  UploadOutlined
} from '@ant-design/icons';
import './SiswaPage.css';

const { Option } = Select;
const { TextArea } = Input;

const SiswaPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    newStudents: 0,
    averageAttendance: 0,
    totalClasses: 0
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:3000/user?role=SISWA');
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        } else {
          setStudents([]);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents([]);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/user/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setStats({
            total: 0,
            active: 0,
            inactive: 0,
            newThisMonth: 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          total: 0,
          active: 0,
          inactive: 0,
          newThisMonth: 0
        });
      }
    };

    fetchStats();
  }, []);

  const handleAddStudent = () => {
    setEditingStudent(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditStudent = (record) => {
    setEditingStudent(record);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      phone: record.phone,
      birthDate: record.birthDate,
      address: record.address,
      level: record.level,
      currentClass: record.currentClass,
      status: record.status,
      emergencyContact: record.emergencyContact,
      emergencyPhone: record.emergencyPhone,
      notes: record.notes
    });
    setModalVisible(true);
  };

  const handleDeleteStudent = (id) => {
    Modal.confirm({
      title: 'Hapus Siswa',
      content: 'Apakah Anda yakin ingin menghapus siswa ini?',
      okText: 'Ya',
      cancelText: 'Tidak',
      onOk: () => {
        setStudents(students.filter(s => s.id !== id));
        message.success('Siswa berhasil dihapus');
      }
    });
  };

  const handleSubmit = async (values) => {
    try {
      if (editingStudent) {
        // Update existing student
        setStudents(students.map(s => 
          s.id === editingStudent.id 
            ? { ...s, ...values }
            : s
        ));
        message.success('Data siswa berhasil diperbarui');
      } else {
        // Add new student
        const newStudent = {
          id: Date.now(),
          ...values,
          avatar: values.name.split(' ').map(n => n[0]).join('').toUpperCase(),
          joinDate: new Date().toISOString().split('T')[0],
          attendance: 0,
          averageScore: 0
        };
        setStudents([...students, newStudent]);
        message.success('Siswa berhasil ditambahkan');
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
      case 'inactive': return 'red';
      case 'graduated': return 'blue';
      case 'suspended': return 'orange';
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

  const getScoreColor = (score) => {
    if (score >= 90) return '#52c41a';
    if (score >= 80) return '#1890ff';
    if (score >= 70) return '#faad14';
    return '#ff4d4f';
  };

  const columns = [
    {
      title: 'Siswa',
      key: 'student',
      render: (_, record) => (
        <Space>
          <Avatar size="large" style={{ backgroundColor: '#8B5CF6' }}>
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
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level) => (
        <Tag color={getLevelColor(level)}>{level}</Tag>
      ),
    },
    {
      title: 'Kelas Saat Ini',
      key: 'currentClass',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>{record.currentClass}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Bergabung: {new Date(record.joinDate).toLocaleDateString('id-ID')}
          </div>
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
            strokeColor="#52c41a"
            showInfo={false}
          />
        </div>
      ),
    },
    {
      title: 'Nilai Rata-rata',
      key: 'averageScore',
      render: (_, record) => (
        <div>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '16px',
            color: getScoreColor(record.averageScore)
          }}>
            {record.averageScore}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.averageScore >= 90 ? 'Excellent' : 
             record.averageScore >= 80 ? 'Good' : 
             record.averageScore >= 70 ? 'Average' : 'Need Improvement'}
          </div>
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
              onClick={() => handleEditStudent(record)}
            />
          </Tooltip>
          <Tooltip title="Hapus">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDeleteStudent(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="siswa-container">
      <div className="siswa-header">
        <h1>Manajemen Siswa</h1>
        <p>Kelola data siswa Jakarta Mandarin</p>
      </div>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card className="action-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, color: '#1e293b' }}>Kelola Siswa</h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
                  Tambah, edit, dan kelola data siswa Jakarta Mandarin
                </p>
              </div>
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={handleAddStudent}
                  size="large"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    border: 'none'
                  }}
                >
                  Tambah Siswa
                </Button>
                <Button 
                  icon={<DownloadOutlined />} 
                  onClick={() => message.info('Export data siswa')}
                >
                  Export Data
                </Button>
                <Button 
                  icon={<UploadOutlined />} 
                  onClick={() => message.info('Import data siswa')}
                >
                  Import Data
                </Button>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Statistik */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Total Siswa"
              value={stats.totalStudents}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#8B5CF6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Siswa Aktif"
              value={stats.activeStudents}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Siswa Baru"
              value={stats.newStudents}
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
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Total Kelas"
              value={stats.totalClasses}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabel Siswa */}
      <Card 
        title="Daftar Siswa" 
        className="table-card"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddStudent}
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              border: 'none'
            }}
          >
            Tambah Siswa
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={students}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} dari ${total} siswa`
          }}
        />
      </Card>

      {/* Modal Form */}
      <Modal
        title={editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
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
                label="Nama Lengkap"
                rules={[{ required: true, message: 'Nama harus diisi!' }]}
              >
                <Input placeholder="Contoh: Sarah Chen" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Email harus diisi!' },
                  { type: 'email', message: 'Format email tidak valid!' }
                ]}
              >
                <Input placeholder="Contoh: sarah.chen@email.com" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Nomor Telepon"
                rules={[{ required: true, message: 'Nomor telepon harus diisi!' }]}
              >
                <Input placeholder="Contoh: +62 812-3456-7890" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="birthDate"
                label="Tanggal Lahir"
                rules={[{ required: true, message: 'Tanggal lahir harus diisi!' }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Alamat"
            rules={[{ required: true, message: 'Alamat harus diisi!' }]}
          >
            <TextArea rows={2} placeholder="Alamat lengkap" />
          </Form.Item>

          <Row gutter={16}>
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
            <Col span={12}>
              <Form.Item
                name="currentClass"
                label="Kelas Saat Ini"
                rules={[{ required: true, message: 'Kelas harus diisi!' }]}
              >
                <Input placeholder="Contoh: Mandarin Basic A" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="emergencyContact"
                label="Kontak Darurat"
                rules={[{ required: true, message: 'Kontak darurat harus diisi!' }]}
              >
                <Input placeholder="Contoh: Budi Chen (Ayah)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="emergencyPhone"
                label="Telepon Darurat"
                rules={[{ required: true, message: 'Telepon darurat harus diisi!' }]}
              >
                <Input placeholder="Contoh: +62 812-3456-7891" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Status harus dipilih!' }]}
              >
                <Select placeholder="Pilih status">
                  <Option value="active">Aktif</Option>
                  <Option value="inactive">Tidak Aktif</Option>
                  <Option value="graduated">Lulus</Option>
                  <Option value="suspended">Ditangguhkan</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="notes"
            label="Catatan"
          >
            <TextArea 
              rows={3} 
              placeholder="Catatan tambahan tentang siswa (opsional)"
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
                {editingStudent ? 'Update' : 'Simpan'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SiswaPage; 