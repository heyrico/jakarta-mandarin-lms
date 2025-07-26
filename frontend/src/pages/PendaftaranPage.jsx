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
  Steps,
  Descriptions,
  Alert
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UserOutlined,
  BookOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  SearchOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import './PendaftaranPage.css';

const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const PendaftaranPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({
    totalEnrollments: 0,
    pendingEnrollments: 0,
    approvedEnrollments: 0,
    rejectedEnrollments: 0,
    totalRevenue: 0,
    thisMonthEnrollments: 0
  });
  const [students, setStudents] = useState([]);
  const [isNewStudent, setIsNewStudent] = useState(false);

  useEffect(() => {
    fetchEnrollments();
    fetchClasses();
    fetchStats();
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

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      // Fetch from backend (empty for now)
      const response = await fetch('http://localhost:3000/enrollment');
      if (response.ok) {
        const data = await response.json();
        setEnrollments(data);
      } else {
        setEnrollments([]);
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      // Fetch from backend (empty for now)
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

  const fetchStats = async () => {
    try {
      // Fetch from backend (empty for now)
      const response = await fetch('http://localhost:3000/enrollment/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setStats({
          totalEnrollments: 0,
          pendingEnrollments: 0,
          approvedEnrollments: 0,
          rejectedEnrollments: 0,
          totalRevenue: 0,
          thisMonthEnrollments: 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalEnrollments: 0,
        pendingEnrollments: 0,
        approvedEnrollments: 0,
        rejectedEnrollments: 0,
        totalRevenue: 0,
        thisMonthEnrollments: 0
      });
    }
  };

  const handleAddEnrollment = () => {
    setEditingEnrollment(null);
    form.resetFields();
    setIsNewStudent(false); // Reset for new enrollment
    setModalVisible(true);
  };

  const handleEditEnrollment = (record) => {
    setEditingEnrollment(record);
    setModalVisible(true);
    
    form.setFieldsValue({
      studentName: record.studentName,
      email: record.email,
      phone: record.phone,
      classId: record.classId,
      enrollmentDate: record.enrollmentDate,
      startDate: record.startDate,
      endDate: record.endDate,
      totalFee: record.totalFee,
      paidAmount: record.paidAmount,
      status: record.status,
      paymentStatus: record.paymentStatus,
      notes: record.notes
    });
    setIsNewStudent(false); // Ensure it's false when editing
  };

  const handleDeleteEnrollment = (id) => {
    Modal.confirm({
      title: 'Hapus Pendaftaran',
      content: 'Apakah Anda yakin ingin menghapus pendaftaran ini?',
      okText: 'Ya',
      cancelText: 'Tidak',
      onOk: () => {
        setEnrollments(enrollments.filter(e => e.id !== id));
        message.success('Pendaftaran berhasil dihapus');
      }
    });
  };

  const handleSubmit = async (values) => {
    try {
      const { 
        studentName, email, phone, classId, enrollmentDate, startDate, endDate, 
        totalFee, paidAmount, status, paymentStatus, notes
      } = values;
      
      const selectedClass = classes.find(c => c.id === classId);
      const remainingAmount = totalFee - paidAmount;
      
      const enrollmentData = {
        id: editingEnrollment ? editingEnrollment.id : Date.now(),
        studentName,
        studentAvatar: studentName.split(' ').map(n => n[0]).join('').toUpperCase(),
        email,
        phone,
        className: selectedClass?.name,
        classId,
        enrollmentDate,
        startDate,
        endDate,
        totalFee,
        paidAmount,
        remainingAmount,
        status,
        paymentStatus,
        notes,
        level: selectedClass?.name.includes('Basic') ? 'Basic' : 
               selectedClass?.name.includes('Intermediate') ? 'Intermediate' : 'Advanced',
        schedule: 'Akan diatur sesuai kelas'
      };

      if (editingEnrollment) {
        // Update existing enrollment
        setEnrollments(enrollments.map(e => 
          e.id === editingEnrollment.id ? enrollmentData : e
        ));
        message.success('Pendaftaran berhasil diperbarui');
      } else {
        // Add new enrollment
        setEnrollments([...enrollments, enrollmentData]);
        message.success('Pendaftaran berhasil ditambahkan');
      }
      
      setModalVisible(false);
      form.resetFields();
      setEditingEnrollment(null);
    } catch (error) {
      message.error('Terjadi kesalahan');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'green';
      case 'pending': return 'orange';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'green';
      case 'partial': return 'orange';
      case 'unpaid': return 'red';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'pending': return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'rejected': return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'partial': return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'unpaid': return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default: return <ClockCircleOutlined />;
    }
  };

  const columns = [
    {
      title: 'Siswa',
      key: 'student',
      render: (_, record) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#8B5CF6' }}>
            {record.studentAvatar}
          </Avatar>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{record.studentName}</div>
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
      title: 'Kelas',
      key: 'class',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>{record.className}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <CalendarOutlined /> {record.schedule}
          </div>
          <Tag color="blue" size="small">{record.level}</Tag>
        </div>
      ),
    },
    {
      title: 'Pembayaran',
      key: 'payment',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>
            Rp {record.totalFee.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Dibayar: Rp {record.paidAmount.toLocaleString()}
          </div>
          {record.remainingAmount > 0 && (
            <div style={{ fontSize: '12px', color: '#ff4d4f' }}>
              Sisa: Rp {record.remainingAmount.toLocaleString()}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Status Pendaftaran',
      key: 'status',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tag color={getStatusColor(record.status)} icon={getStatusIcon(record.status)}>
            {record.status === 'approved' ? 'Disetujui' : 
             record.status === 'pending' ? 'Menunggu' : 'Ditolak'}
          </Tag>
          <Tag color={getPaymentStatusColor(record.paymentStatus)} icon={getPaymentStatusIcon(record.paymentStatus)}>
            {record.paymentStatus === 'paid' ? 'Lunas' : 
             record.paymentStatus === 'partial' ? 'DP' : 'Belum Bayar'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Tanggal',
      key: 'dates',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Daftar: {new Date(record.enrollmentDate).toLocaleDateString('id-ID')}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Mulai: {new Date(record.startDate).toLocaleDateString('id-ID')}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Selesai: {new Date(record.endDate).toLocaleDateString('id-ID')}
          </div>
        </div>
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
              onClick={() => handleEditEnrollment(record)}
            />
          </Tooltip>
          <Tooltip title="Hapus">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDeleteEnrollment(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="pendaftaran-container">
      <div className="pendaftaran-header">
        <h1>Sistem Pendaftaran</h1>
        <p>Kelola pendaftaran siswa Jakarta Mandarin</p>
      </div>

      {/* Statistik */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Total Pendaftaran"
              value={stats.totalEnrollments}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#8B5CF6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Menunggu Approval"
              value={stats.pendingEnrollments}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Disetujui"
              value={stats.approvedEnrollments}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Ditolak"
              value={stats.rejectedEnrollments}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#10B981' }}
              formatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Pendaftaran Bulan Ini"
              value={stats.thisMonthEnrollments}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card className="action-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, color: '#1e293b' }}>Pendaftaran Baru</h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
                  Daftarkan siswa baru ke kelas Jakarta Mandarin
                </p>
              </div>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAddEnrollment}
                size="large"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  border: 'none'
                }}
              >
                Daftarkan Siswa
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tabel Pendaftaran */}
      <Card 
        title="Daftar Pendaftaran" 
        className="table-card"
        extra={
          <Input.Search
            placeholder="Cari siswa atau kelas"
            style={{ width: 250 }}
            onSearch={(value) => message.info(`Mencari: ${value}`)}
          />
        }
      >
        <Table
          columns={columns}
          dataSource={enrollments}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} dari ${total} pendaftaran`
          }}
        />
      </Card>

      {/* Modal Form */}
      <Modal
        title={editingEnrollment ? 'Edit Pendaftaran' : 'Pendaftaran Baru'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingEnrollment(null);
          form.resetFields();
          setIsNewStudent(false); // Reset for new enrollment
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="studentId"
                label="Pilih Siswa"
                rules={[{ required: true, message: 'Siswa harus dipilih!' }]}
              >
                <Select 
                  placeholder="Cari siswa existing atau pilih 'Siswa Baru'"
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={(value) => {
                    if (value === 'new') {
                      setIsNewStudent(true);
                      form.setFieldsValue({ studentName: '', email: '', phone: '' });
                    } else {
                      setIsNewStudent(false);
                      const selectedStudent = students.find(s => s.id === value);
                      if (selectedStudent) {
                        form.setFieldsValue({
                          studentName: selectedStudent.name,
                          email: selectedStudent.email,
                          phone: selectedStudent.phone || ''
                        });
                      }
                    }
                  }}
                >
                  <Option value="new" style={{ color: '#1890ff', fontWeight: 'bold' }}>
                    ➕ Siswa Baru
                  </Option>
                  {students.map(student => (
                    <Option key={student.id} value={student.id}>
                      {student.name} - {student.email}
                    </Option>
                  ))}
                </Select>
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
                <Input 
                  placeholder="Contoh: sarah.chen@email.com" 
                  disabled={!isNewStudent}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="studentName"
                label="Nama Siswa"
                rules={[{ required: true, message: 'Nama siswa harus diisi!' }]}
              >
                <Input 
                  placeholder="Contoh: Sarah Chen" 
                  disabled={!isNewStudent}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Nomor Telepon"
                rules={[{ required: true, message: 'Nomor telepon harus diisi!' }]}
              >
                <Input 
                  placeholder="Contoh: +62 812-3456-7890" 
                  disabled={!isNewStudent}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="classId"
                label="Kelas"
                rules={[{ required: true, message: 'Kelas harus dipilih!' }]}
              >
                <Select placeholder="Pilih kelas">
                  {classes.map(cls => (
                    <Option key={cls.id} value={cls.id}>
                      {cls.name} - Rp {cls.fee.toLocaleString()}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="enrollmentDate"
                label="Tanggal Pendaftaran"
                rules={[{ required: true, message: 'Tanggal pendaftaran harus diisi!' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="startDate"
                label="Tanggal Mulai"
                rules={[{ required: true, message: 'Tanggal mulai harus diisi!' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="endDate"
                label="Tanggal Selesai"
                rules={[{ required: true, message: 'Tanggal selesai harus diisi!' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="totalFee"
                label="Total Biaya"
                rules={[{ required: true, message: 'Total biaya harus diisi!' }]}
              >
                <InputNumber 
                  min={0} 
                  style={{ width: '100%' }} 
                  placeholder="Contoh: 2500000"
                  formatter={(value) => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\Rp\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="paidAmount"
                label="Jumlah Dibayar"
                rules={[{ required: true, message: 'Jumlah dibayar harus diisi!' }]}
              >
                <InputNumber 
                  min={0} 
                  style={{ width: '100%' }} 
                  placeholder="Contoh: 2500000"
                  formatter={(value) => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\Rp\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Status Pendaftaran"
                rules={[{ required: true, message: 'Status harus dipilih!' }]}
              >
                <Select placeholder="Pilih status">
                  <Option value="pending">Menunggu</Option>
                  <Option value="approved">Disetujui</Option>
                  <Option value="rejected">Ditolak</Option>
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
              placeholder="Catatan tambahan tentang pendaftaran (opsional)"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingEnrollment(null);
                form.resetFields();
                setIsNewStudent(false); // Reset for new enrollment
              }}>
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
                {editingEnrollment ? 'Update' : 'Simpan'} Pendaftaran
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PendaftaranPage; 