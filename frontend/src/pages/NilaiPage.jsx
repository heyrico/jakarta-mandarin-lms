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
  Rate,
  Tabs
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
  StarOutlined,
  FileTextOutlined,
  SearchOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import './NilaiPage.css';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const NilaiPage = () => {
  const [grades, setGrades] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({
    totalGrades: 0,
    averageScore: 0,
    excellentCount: 0,
    goodCount: 0,
    averageCount: 0,
    needImprovementCount: 0
  });

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch('http://localhost:3000/nilai');
        if (response.ok) {
          const data = await response.json();
          setGrades(data);
        } else {
          setGrades([]);
        }
      } catch (error) {
        console.error('Error fetching grades:', error);
        setGrades([]);
      }
    };

    fetchGrades();
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
      const response = await fetch('http://localhost:3000/nilai/stats');
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalGrades: data.totalAssignments || 0,
          averageScore: data.averageScore || 0,
          excellentCount: data.gradeDistribution?.A || 0,
          goodCount: (data.gradeDistribution?.['A-'] || 0) + (data.gradeDistribution?.['B+'] || 0),
          averageCount: data.gradeDistribution?.['C+'] || 0,
          needImprovementCount: 0
        });
      } else {
        setStats({
          totalGrades: 0,
          averageScore: 0,
          excellentCount: 0,
          goodCount: 0,
          averageCount: 0,
          needImprovementCount: 0
        });
      }
    } catch (error) {
      setStats({
        totalGrades: 0,
        averageScore: 0,
        excellentCount: 0,
        goodCount: 0,
        averageCount: 0,
        needImprovementCount: 0
      });
    }
  };

  const handleAddGrade = () => {
    setEditingGrade(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditGrade = (record) => {
    setEditingGrade(record);
    setModalVisible(true);
    
    form.setFieldsValue({
      classId: record.classId,
      studentId: record.studentId,
      assignmentType: record.assignmentType,
      title: record.title,
      score: record.score,
      maxScore: record.maxScore,
      date: record.date,
      teacher: record.teacher,
      feedback: record.feedback,
      category: record.category
    });
  };

  const handleDeleteGrade = (id) => {
    Modal.confirm({
      title: 'Hapus Nilai',
      content: 'Apakah Anda yakin ingin menghapus nilai ini?',
      okText: 'Ya',
      cancelText: 'Tidak',
      onOk: () => {
        setGrades(grades.filter(g => g.id !== id));
        message.success('Nilai berhasil dihapus');
      }
    });
  };

  const handleSubmit = async (values) => {
    try {
      const { classId, studentId, assignmentType, title, score, maxScore, date, teacher, feedback, category } = values;
      
      const percentage = Math.round((score / maxScore) * 100);
      const grade = getGradeFromScore(percentage);
      
      const student = students.find(s => s.id === studentId);
      const className = classes.find(c => c.id === classId)?.name;
      
      const gradeData = {
        id: editingGrade ? editingGrade.id : Date.now(),
        classId,
        className,
        studentId,
        studentName: student?.name,
        studentAvatar: student?.avatar,
        assignmentType,
        title,
        score,
        maxScore,
        percentage,
        grade,
        date,
        teacher,
        feedback,
        category
      };

      if (editingGrade) {
        // Update existing grade
        setGrades(grades.map(g => 
          g.id === editingGrade.id ? gradeData : g
        ));
        message.success('Nilai berhasil diperbarui');
      } else {
        // Add new grade
        setGrades([...grades, gradeData]);
        message.success('Nilai berhasil ditambahkan');
      }
      
      setModalVisible(false);
      form.resetFields();
      setEditingGrade(null);
    } catch (error) {
      message.error('Terjadi kesalahan');
    }
  };

  const getGradeFromScore = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 85) return 'A-';
    if (percentage >= 80) return 'B+';
    if (percentage >= 75) return 'B';
    if (percentage >= 70) return 'B-';
    if (percentage >= 65) return 'C+';
    if (percentage >= 60) return 'C';
    if (percentage >= 55) return 'C-';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'gold';
      case 'A-': return 'gold';
      case 'B+': return 'green';
      case 'B': return 'green';
      case 'B-': return 'green';
      case 'C+': return 'blue';
      case 'C': return 'blue';
      case 'C-': return 'orange';
      case 'D': return 'orange';
      case 'F': return 'red';
      default: return 'default';
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return '#52c41a';
    if (percentage >= 80) return '#1890ff';
    if (percentage >= 70) return '#faad14';
    return '#ff4d4f';
  };

  const getAssignmentTypeColor = (type) => {
    switch (type) {
      case 'Quiz': return 'blue';
      case 'Test': return 'purple';
      case 'Assignment': return 'green';
      case 'Final Exam': return 'red';
      default: return 'default';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Speaking': return 'green';
      case 'Writing': return 'blue';
      case 'Reading': return 'purple';
      case 'Listening': return 'orange';
      case 'Comprehensive': return 'red';
      default: return 'default';
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
            <div style={{ fontSize: '12px', color: '#666' }}>{record.className}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Tugas',
      key: 'assignment',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>{record.title}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <Tag color={getAssignmentTypeColor(record.assignmentType)} size="small">
              {record.assignmentType}
            </Tag>
            <Tag color={getCategoryColor(record.category)} size="small">
              {record.category}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Nilai',
      key: 'score',
      render: (_, record) => (
        <div>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '16px',
            color: getScoreColor(record.percentage)
          }}>
            {record.score}/{record.maxScore}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.percentage}% - {record.grade}
          </div>
        </div>
      ),
    },
    {
      title: 'Grade',
      key: 'grade',
      render: (_, record) => (
        <Tag color={getGradeColor(record.grade)} style={{ fontSize: '14px', fontWeight: 'bold' }}>
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
            {record.teacher}
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
              onClick={() => handleEditGrade(record)}
            />
          </Tooltip>
          <Tooltip title="Hapus">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDeleteGrade(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const getStudentAverageGrade = (studentId) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return 0;
    
    const totalPercentage = studentGrades.reduce((sum, grade) => sum + grade.percentage, 0);
    return Math.round(totalPercentage / studentGrades.length);
  };

  const studentPerformanceColumns = [
    {
      title: 'Siswa',
      key: 'student',
      render: (_, record) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#8B5CF6' }}>
            {record.avatar}
          </Avatar>
          <span style={{ fontWeight: '500' }}>{record.name}</span>
        </Space>
      ),
    },
    {
      title: 'Kelas',
      key: 'class',
      render: (_, record) => (
        <span>{classes.find(c => c.id === record.classId)?.name}</span>
      ),
    },
    {
      title: 'Rata-rata Nilai',
      key: 'average',
      render: (_, record) => {
        const average = getStudentAverageGrade(record.id);
        return (
          <div>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '16px',
              color: getScoreColor(average)
            }}>
              {average}%
            </div>
            <Progress 
              percent={average} 
              size="small" 
              strokeColor={getScoreColor(average)}
              showInfo={false}
            />
          </div>
        );
      },
    },
    {
      title: 'Grade',
      key: 'grade',
      render: (_, record) => {
        const average = getStudentAverageGrade(record.id);
        const grade = getGradeFromScore(average);
        return (
          <Tag color={getGradeColor(grade)} style={{ fontSize: '14px', fontWeight: 'bold' }}>
            {grade}
          </Tag>
        );
      },
    },
    {
      title: 'Total Tugas',
      key: 'total',
      render: (_, record) => (
        <span>{grades.filter(g => g.studentId === record.id).length} tugas</span>
      ),
    },
  ];

  return (
    <div className="nilai-container">
      <div className="nilai-header">
        <h1>Sistem Nilai</h1>
        <p>Kelola penilaian siswa Jakarta Mandarin</p>
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
              value={stats.averageScore}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Excellent (A)"
              value={stats.excellentCount}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Good (B)"
              value={stats.goodCount}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Average (C)"
              value={stats.averageCount}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="stat-card">
            <Statistic
              title="Need Improvement"
              value={stats.needImprovementCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Card className="tabs-card">
        <Tabs defaultActiveKey="grades" size="large">
          <TabPane 
            tab={
              <span>
                <FileTextOutlined />
                Daftar Nilai
              </span>
            } 
            key="grades"
          >
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAddGrade}
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  border: 'none'
                }}
              >
                Tambah Nilai
              </Button>
            </div>
            
            <Table
              columns={columns}
              dataSource={grades}
              loading={loading}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} dari ${total} nilai`
              }}
            />
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <BarChartOutlined />
                Performa Siswa
              </span>
            } 
            key="performance"
          >
            <Table
              columns={studentPerformanceColumns}
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
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <LineChartOutlined />
                Grafik & Analisis
              </span>
            } 
            key="analytics"
          >
            <div style={{ 
              height: 300, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#bbb',
              background: '#f8fafc',
              borderRadius: 8
            }}>
              <div style={{ textAlign: 'center' }}>
                <BarChartOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>Grafik dan analisis nilai akan tampil di sini</div>
                <div style={{ fontSize: '12px', marginTop: 8 }}>
                  Fitur grafik akan segera hadir!
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal Form */}
      <Modal
        title={editingGrade ? 'Edit Nilai' : 'Tambah Nilai Baru'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingGrade(null);
          form.resetFields();
        }}
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
                name="classId"
                label="Kelas"
                rules={[{ required: true, message: 'Kelas harus dipilih!' }]}
              >
                <Select placeholder="Pilih kelas">
                  {classes.map(cls => (
                    <Option key={cls.id} value={cls.id}>
                      {cls.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="studentId"
                label="Siswa"
                rules={[{ required: true, message: 'Siswa harus dipilih!' }]}
              >
                <Select placeholder="Pilih siswa">
                  {students.map(student => (
                    <Option key={student.id} value={student.id}>
                      {student.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="assignmentType"
                label="Jenis Tugas"
                rules={[{ required: true, message: 'Jenis tugas harus dipilih!' }]}
              >
                <Select placeholder="Pilih jenis tugas">
                  <Option value="Quiz">Quiz</Option>
                  <Option value="Test">Test</Option>
                  <Option value="Assignment">Assignment</Option>
                  <Option value="Final Exam">Final Exam</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Kategori"
                rules={[{ required: true, message: 'Kategori harus dipilih!' }]}
              >
                <Select placeholder="Pilih kategori">
                  <Option value="Speaking">Speaking</Option>
                  <Option value="Writing">Writing</Option>
                  <Option value="Reading">Reading</Option>
                  <Option value="Listening">Listening</Option>
                  <Option value="Comprehensive">Comprehensive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="title"
            label="Judul Tugas"
            rules={[{ required: true, message: 'Judul tugas harus diisi!' }]}
          >
            <Input placeholder="Contoh: Quiz Pinyin Dasar" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="score"
                label="Nilai"
                rules={[{ required: true, message: 'Nilai harus diisi!' }]}
              >
                <InputNumber 
                  min={0} 
                  max={100} 
                  style={{ width: '100%' }} 
                  placeholder="Contoh: 85"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxScore"
                label="Nilai Maksimal"
                rules={[{ required: true, message: 'Nilai maksimal harus diisi!' }]}
              >
                <InputNumber 
                  min={1} 
                  max={100} 
                  style={{ width: '100%' }} 
                  placeholder="Contoh: 100"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Tanggal"
                rules={[{ required: true, message: 'Tanggal harus diisi!' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="teacher"
                label="Guru"
                rules={[{ required: true, message: 'Guru harus diisi!' }]}
              >
                <Input placeholder="Nama guru" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="feedback"
            label="Feedback"
          >
            <TextArea 
              rows={3} 
              placeholder="Feedback untuk siswa (opsional)"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingGrade(null);
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
                {editingGrade ? 'Update' : 'Simpan'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NilaiPage; 