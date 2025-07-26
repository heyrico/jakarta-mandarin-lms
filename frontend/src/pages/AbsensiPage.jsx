import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
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
  Calendar,
  List,
  Divider,
  Switch,
  Input
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
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  FileTextOutlined,
  SearchOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import './AbsensiPage.css';

// Set locale to Indonesian
dayjs.locale('id');

const { Option } = Select;
const { Search } = Input;

const AbsensiPage = () => {
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [form] = Form.useForm();
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalStudents: 0,
    averageAttendance: 0,
    presentToday: 0,
    absentToday: 0
  });

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch('http://localhost:3000/absensi');
        if (response.ok) {
          const data = await response.json();
          setAttendance(data);
        } else {
          setAttendance([]);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
        setAttendance([]);
      }
    };

    fetchAttendance();
  }, []);

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

  const fetchStats = async () => {
    try {
      // Fetch stats from backend
      const response = await fetch('http://localhost:3000/absensi/stats');
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalSessions: data.totalAttendance || 0,
          totalStudents: data.totalStudents || 0,
          averageAttendance: data.averageAttendance || 0,
          presentToday: data.presentCount || 0,
          absentToday: data.absentCount || 0
        });
      } else {
        setStats({
          totalSessions: 0,
          totalStudents: 0,
          averageAttendance: 0,
          presentToday: 0,
          absentToday: 0
        });
      }
    } catch (error) {
      setStats({
        totalSessions: 0,
        totalStudents: 0,
        averageAttendance: 0,
        presentToday: 0,
        absentToday: 0
      });
    }
  };

  const handleTakeAttendance = (classId) => {
    const selectedClassData = classes.find(c => c.id === classId);
    const classStudents = students.filter(s => s.classId === classId);
    
    setSelectedClass(selectedClassData);
    setModalVisible(true);
    
    // Pre-fill form with current students
    const initialStudents = classStudents.map(student => ({
      id: student.id,
      name: student.name,
      avatar: student.avatar,
      status: 'present',
      time: '',
      notes: ''
    }));
    
    form.setFieldsValue({
      classId: classId,
      date: selectedDate,
      students: initialStudents
    });
  };

  const handleEditAttendance = (record) => {
    setEditingAttendance(record);
    setSelectedClass(classes.find(c => c.id === record.classId));
    setModalVisible(true);
    
    form.setFieldsValue({
      classId: record.classId,
      date: dayjs(record.date),
      students: record.students
    });
  };

  const handleDeleteAttendance = (id) => {
    Modal.confirm({
      title: 'Hapus Absensi',
      content: 'Apakah Anda yakin ingin menghapus data absensi ini?',
      okText: 'Ya',
      cancelText: 'Tidak',
      onOk: () => {
        setAttendance(attendance.filter(a => a.id !== id));
        message.success('Data absensi berhasil dihapus');
      }
    });
  };

  const handleSubmit = async (values) => {
    try {
      const { classId, date, students } = values;
      const className = classes.find(c => c.id === classId)?.name;
      
      const presentCount = students.filter(s => s.status === 'present').length;
      const lateCount = students.filter(s => s.status === 'late').length;
      const absentCount = students.filter(s => s.status === 'absent').length;
      const totalStudents = students.length;
      const attendanceRate = Math.round(((presentCount + lateCount) / totalStudents) * 100);
      
      const attendanceData = {
        id: editingAttendance ? editingAttendance.id : Date.now(),
        classId,
        className,
        date,
        students,
        totalStudents,
        presentCount,
        lateCount,
        absentCount,
        attendanceRate
      };

      if (editingAttendance) {
        // Update existing attendance
        setAttendance(attendance.map(a => 
          a.id === editingAttendance.id ? attendanceData : a
        ));
        message.success('Data absensi berhasil diperbarui');
      } else {
        // Add new attendance
        setAttendance([...attendance, attendanceData]);
        message.success('Absensi berhasil disimpan');
      }
      
      setModalVisible(false);
      form.resetFields();
      setEditingAttendance(null);
    } catch (error) {
      message.error('Terjadi kesalahan');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'green';
      case 'late': return 'orange';
      case 'absent': return 'red';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'late': return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'absent': return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default: return <MinusCircleOutlined />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'present': return 'Hadir';
      case 'late': return 'Terlambat';
      case 'absent': return 'Tidak Hadir';
      default: return 'Belum Diisi';
    }
  };

  const columns = [
    {
      title: 'Kelas',
      key: 'class',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{record.className}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {dayjs(record.date).format('dddd, DD MMMM YYYY')}
          </div>
        </div>
      ),
    },
    {
      title: 'Total Siswa',
      key: 'totalStudents',
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{record.totalStudents}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>siswa</div>
        </div>
      ),
    },
    {
      title: 'Kehadiran',
      key: 'attendance',
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
            <Tag color="green">{record.presentCount} Hadir</Tag>
            <Tag color="orange">{record.lateCount} Terlambat</Tag>
            <Tag color="red">{record.absentCount} Tidak Hadir</Tag>
          </div>
          <Progress 
            percent={record.attendanceRate} 
            size="small" 
            strokeColor="#52c41a"
            format={(percent) => `${percent}%`}
          />
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag 
          color={record.attendanceRate >= 80 ? 'green' : record.attendanceRate >= 60 ? 'orange' : 'red'}
          style={{ fontWeight: '600' }}
        >
          {record.attendanceRate >= 80 ? 'Baik' : record.attendanceRate >= 60 ? 'Cukup' : 'Perlu Perhatian'}
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
              onClick={() => handleEditAttendance(record)}
            />
          </Tooltip>
          <Tooltip title="Hapus">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDeleteAttendance(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const studentColumns = [
    {
      title: 'Siswa',
      key: 'student',
      render: (_, record, index) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#8B5CF6' }}>
            {record.avatar}
          </Avatar>
          <span style={{ fontWeight: '500' }}>{record.name}</span>
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record, index) => (
        <Form.Item
          name={['students', index, 'status']}
          style={{ margin: 0 }}
        >
          <Select size="small" style={{ width: 120 }}>
            <Option value="present">Hadir</Option>
            <Option value="late">Terlambat</Option>
            <Option value="absent">Tidak Hadir</Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      title: 'Waktu',
      key: 'time',
      render: (_, record, index) => (
        <Form.Item
          name={['students', index, 'time']}
          style={{ margin: 0 }}
        >
          <Input 
            size="small" 
            placeholder="19:00" 
            style={{ width: 80 }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Catatan',
      key: 'notes',
      render: (_, record, index) => (
        <Form.Item
          name={['students', index, 'notes']}
          style={{ margin: 0 }}
        >
          <Input 
            size="small" 
            placeholder="Catatan (opsional)" 
            style={{ width: 150 }}
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <div className="absensi-container">
      <div className="absensi-header">
        <h1>Sistem Absensi</h1>
        <p>Kelola kehadiran siswa Jakarta Mandarin</p>
      </div>

      {/* Statistik */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Total Sesi"
              value={stats.totalSessions}
              prefix={<CalendarOutlined />}
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
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Rata-rata Kehadiran"
              value={stats.averageAttendance}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Hadir Hari Ini"
              value={stats.presentToday}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#10B981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Tidak Hadir Hari Ini"
              value={stats.absentToday}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
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
                <h3 style={{ margin: 0, color: '#1e293b' }}>Ambil Absensi</h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
                  Pilih kelas untuk mengambil absensi hari ini
                </p>
              </div>
              <Space>
                <Select 
                  placeholder="Pilih Kelas" 
                  style={{ width: 200 }}
                  onChange={setSelectedClass}
                >
                  {classes.map(cls => (
                    <Option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.teacher}
                    </Option>
                  ))}
                </Select>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => selectedClass && handleTakeAttendance(selectedClass)}
                  disabled={!selectedClass}
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    border: 'none'
                  }}
                >
                  Ambil Absensi
                </Button>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tabel Absensi */}
      <Card 
        title="Riwayat Absensi" 
        className="table-card"
        extra={
          <Search
            placeholder="Cari kelas atau tanggal"
            style={{ width: 250 }}
            onSearch={(value) => message.info(`Mencari: ${value}`)}
          />
        }
      >
        <Table
          columns={columns}
          dataSource={attendance}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} dari ${total} sesi`
          }}
        />
      </Card>

      {/* Modal Form */}
      <Modal
        title={`${editingAttendance ? 'Edit' : 'Ambil'} Absensi - ${selectedClass?.name}`}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingAttendance(null);
          form.resetFields();
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
                name="classId"
                label="Kelas"
                rules={[{ required: true, message: 'Kelas harus dipilih!' }]}
              >
                <Select placeholder="Pilih kelas" disabled={!!editingAttendance}>
                  {classes.map(cls => (
                    <Option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.teacher}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Tanggal"
                rules={[{ required: true, message: 'Tanggal harus diisi!' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="YYYY-MM-DD"
                  disabled={!!editingAttendance}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Daftar Siswa</Divider>

          <Table
            columns={studentColumns}
            dataSource={students.filter(s => s.classId === (selectedClass?.id || form.getFieldValue('classId')))}
            rowKey="id"
            pagination={false}
            size="small"
            className="student-attendance-table"
          />

          <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingAttendance(null);
                form.resetFields();
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
                {editingAttendance ? 'Update' : 'Simpan'} Absensi
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AbsensiPage; 