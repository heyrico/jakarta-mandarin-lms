import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Card,
  Row,
  Col,
  Space,
  Typography,
  Rate,
  Progress,
  Tag,
  Avatar,
  Statistic,
  Divider,
  Tabs,
  List,
  Tooltip,
  Badge,
  Alert,
  Timeline
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  StarOutlined,
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  MessageOutlined,
  CalendarOutlined,
  BarChartOutlined,
  TeamOutlined,
  SmileOutlined,
  MehOutlined,
  FrownOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Text, Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

export default function TeacherEvaluationPage() {
  const [evaluations, setEvaluations] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvaluations();
    fetchTeachers();
    fetchStudents();
  }, []);

  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      // Fetch from backend (empty for now)
      const response = await fetch('http://localhost:3000/evaluation');
      if (response.ok) {
        const data = await response.json();
        setEvaluations(data);
      } else {
        setEvaluations([]);
      }
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      setEvaluations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      // Fetch from backend (empty for now)
      const response = await fetch('http://localhost:3000/user?role=GURU');
      if (response.ok) {
        const data = await response.json();
        setTeachers(data);
      } else {
        setTeachers([]);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setTeachers([]);
    }
  };

  const fetchStudents = async () => {
    try {
      // Fetch from backend (empty for now)
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

  const handleAddEvaluation = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const newEvaluation = {
        id: evaluations.length + 1,
        teacherId: values.teacherId,
        teacherName: teachers.find(t => t.id === values.teacherId)?.name || '',
        studentId: values.studentId,
        studentName: students.find(s => s.id === values.studentId)?.name || '',
        evaluationDate: values.evaluationDate.format('YYYY-MM-DD'),
        period: values.period,
        teachingQuality: values.teachingQuality,
        communication: values.communication,
        patience: values.patience,
        explanation: values.explanation,
        encouragement: values.encouragement,
        overallRating: (
          values.teachingQuality + 
          values.communication + 
          values.patience + 
          values.explanation + 
          values.encouragement
        ) / 5,
        comments: values.comments,
        suggestions: values.suggestions,
        status: 'completed'
      };

      setEvaluations([...evaluations, newEvaluation]);
      message.success('Evaluasi guru berhasil ditambah!');
      setModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Error adding evaluation:', error);
      message.error('Gagal menambah evaluasi');
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#52c41a';
    if (rating >= 4.0) return '#1890ff';
    if (rating >= 3.5) return '#faad14';
    return '#f5222d';
  };

  const getRatingIcon = (rating) => {
    if (rating >= 4.5) return <SmileOutlined />;
    if (rating >= 4.0) return <SmileOutlined />;
    if (rating >= 3.5) return <MehOutlined />;
    return <FrownOutlined />;
  };

  const getStatusColor = (status) => {
    return status === 'completed' ? 'green' : 'orange';
  };

  const columns = [
    {
      title: 'Guru & Siswa',
      key: 'teacherStudent',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div>
            <Avatar size={48} style={{ background: '#1890ff' }}>
              {record.teacherName.split(' ').pop().charAt(0)}
            </Avatar>
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{record.teacherName}</div>
            <div style={{ fontSize: 12, color: '#666' }}>
              Dievaluasi oleh: {record.studentName}
            </div>
            <div style={{ fontSize: 12, color: '#666' }}>
              Periode: {record.period}
            </div>
          </div>
        </div>
      ),
      width: 250
    },
    {
      title: 'Rating Keseluruhan',
      dataIndex: 'overallRating',
      key: 'overallRating',
      render: (rating) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: getRatingColor(rating) }}>
            {rating.toFixed(1)}
          </div>
          <Rate disabled defaultValue={rating} style={{ fontSize: 12 }} />
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            {getRatingIcon(rating)} {rating >= 4.5 ? 'Excellent' : rating >= 4.0 ? 'Good' : rating >= 3.5 ? 'Average' : 'Needs Improvement'}
          </div>
        </div>
      ),
      width: 150
    },
    {
      title: 'Detail Rating',
      key: 'detailRating',
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>Kualitas Mengajar: <Rate disabled defaultValue={record.teachingQuality} style={{ fontSize: 10 }} /></div>
          <div>Komunikasi: <Rate disabled defaultValue={record.communication} style={{ fontSize: 10 }} /></div>
          <div>Kesabaran: <Rate disabled defaultValue={record.patience} style={{ fontSize: 10 }} /></div>
          <div>Penjelasan: <Rate disabled defaultValue={record.explanation} style={{ fontSize: 10 }} /></div>
          <div>Motivasi: <Rate disabled defaultValue={record.encouragement} style={{ fontSize: 10 }} /></div>
        </div>
      ),
      width: 200
    },
    {
      title: 'Tanggal Evaluasi',
      dataIndex: 'evaluationDate',
      key: 'evaluationDate',
      render: (date) => (
        <div style={{ textAlign: 'center' }}>
          <div>{new Date(date).toLocaleDateString()}</div>
          <Tag color={getStatusColor('completed')}>Selesai</Tag>
        </div>
      ),
      width: 120
    },
    {
      title: 'Aksi',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Lihat Detail">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => {
                setSelectedEvaluation(record);
                setViewModalOpen(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
      width: 100
    }
  ];

  const teacherColumns = [
    {
      title: 'Guru',
      key: 'teacher',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar size={48} style={{ background: '#1890ff' }}>
            {record.avatar}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>
              {record.specialization} • {record.experience}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Statistik',
      key: 'stats',
      render: (_, record) => (
        <div>
          <div>Kelas: {record.totalClasses}</div>
          <div>Siswa: {record.totalStudents}</div>
          <div>Evaluasi: {evaluations.filter(e => e.teacherId === record.id).length}</div>
        </div>
      )
    },
    {
      title: 'Rating',
      dataIndex: 'averageRating',
      key: 'averageRating',
      render: (rating) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: getRatingColor(rating) }}>
            {rating.toFixed(1)}
          </div>
          <Rate disabled defaultValue={rating} style={{ fontSize: 12 }} />
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Aktif' : 'Nonaktif'}
        </Tag>
      )
    },
    {
      title: 'Aksi',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => {
            form.setFieldsValue({
              teacherId: record.id,
              period: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            });
            setModalOpen(true);
          }}
        >
          Evaluasi
        </Button>
      )
    }
  ];

  const stats = {
    totalTeachers: teachers.length,
    activeTeachers: teachers.filter(t => t.status === 'active').length,
    averageRating: teachers.reduce((sum, t) => sum + t.averageRating, 0) / teachers.length,
    totalEvaluations: evaluations.length,
    thisMonthEvaluations: evaluations.filter(e => 
      new Date(e.evaluationDate).getMonth() === new Date().getMonth()
    ).length
  };

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px #0001' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>⭐ Evaluasi Guru oleh Siswa</Title>
          <Text type="secondary">Sistem penilaian guru berdasarkan feedback siswa</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setModalOpen(true);
          }}
        >
          Tambah Evaluasi
        </Button>
      </div>

      <Alert
        message="Sistem Evaluasi Guru"
        description="Siswa dapat memberikan evaluasi terhadap guru yang mengajar mereka. Evaluasi ini bersifat anonim dan digunakan untuk meningkatkan kualitas pengajaran."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="Total Guru"
              value={stats.totalTeachers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="Guru Aktif"
              value={stats.activeTeachers}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="Rating Rata-rata"
              value={stats.averageRating.toFixed(1)}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="Total Evaluasi"
              value={stats.totalEvaluations}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="Evaluasi Bulan Ini"
              value={stats.thisMonthEvaluations}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic
              title="Tingkat Kepuasan"
              value={((stats.averageRating / 5) * 100).toFixed(0)}
              suffix="%"
              prefix={<SmileOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="evaluations">
        <TabPane tab={`Evaluasi Siswa (${evaluations.length})`} key="evaluations">
          <Table
            columns={columns}
            dataSource={evaluations}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            loading={loading}
          />
        </TabPane>
        <TabPane tab={`Daftar Guru (${teachers.length})`} key="teachers">
          <Table
            columns={teacherColumns}
            dataSource={teachers}
            rowKey="id"
            pagination={{ pageSize: 8 }}
          />
        </TabPane>
      </Tabs>

      {/* Add Evaluation Modal */}
      <Modal
        title="Tambah Evaluasi Guru oleh Siswa"
        open={modalOpen}
        onOk={handleAddEvaluation}
        onCancel={() => setModalOpen(false)}
        okText="Simpan Evaluasi"
        width={800}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="teacherId"
                label="Pilih Guru"
                rules={[{ required: true, message: 'Guru wajib dipilih!' }]}
              >
                <Select placeholder="Pilih guru yang akan dievaluasi">
                  {teachers.map(teacher => (
                    <Option key={teacher.id} value={teacher.id}>
                      {teacher.name} - {teacher.specialization}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="studentId"
                label="Pilih Siswa"
                rules={[{ required: true, message: 'Siswa wajib dipilih!' }]}
              >
                <Select placeholder="Pilih siswa yang memberikan evaluasi">
                  {students.map(student => (
                    <Option key={student.id} value={student.id}>
                      {student.name} - {student.class}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="period"
                label="Periode Evaluasi"
                rules={[{ required: true, message: 'Periode wajib diisi!' }]}
              >
                <Input placeholder="Contoh: Januari 2024" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="evaluationDate"
                label="Tanggal Evaluasi"
                rules={[{ required: true, message: 'Tanggal evaluasi wajib diisi!' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Kriteria Penilaian</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="teachingQuality"
                label="Kualitas Mengajar"
                rules={[{ required: true, message: 'Rating wajib diisi!' }]}
              >
                <Rate />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="communication"
                label="Komunikasi"
                rules={[{ required: true, message: 'Rating wajib diisi!' }]}
              >
                <Rate />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="patience"
                label="Kesabaran"
                rules={[{ required: true, message: 'Rating wajib diisi!' }]}
              >
                <Rate />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="explanation"
                label="Kejelasan Penjelasan"
                rules={[{ required: true, message: 'Rating wajib diisi!' }]}
              >
                <Rate />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="encouragement"
                label="Motivasi & Dorongan"
                rules={[{ required: true, message: 'Rating wajib diisi!' }]}
              >
                <Rate />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Feedback Siswa</Divider>

          <Form.Item
            name="comments"
            label="Komentar Positif"
            rules={[{ required: true, message: 'Komentar wajib diisi!' }]}
          >
            <TextArea
              rows={3}
              placeholder="Apa yang paling disukai dari cara mengajar guru ini?"
            />
          </Form.Item>

          <Form.Item
            name="suggestions"
            label="Saran Perbaikan"
            rules={[{ required: true, message: 'Saran wajib diisi!' }]}
          >
            <TextArea
              rows={3}
              placeholder="Apa yang bisa diperbaiki dari cara mengajar guru ini?"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Evaluation Modal */}
      <Modal
        title="Detail Evaluasi Guru"
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        width={800}
      >
        {selectedEvaluation && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <Avatar size={64} style={{ background: '#1890ff' }}>
                {selectedEvaluation.teacherName.split(' ').pop().charAt(0)}
              </Avatar>
              <div>
                <Title level={3} style={{ margin: 0 }}>{selectedEvaluation.teacherName}</Title>
                <Text type="secondary">Dievaluasi oleh: {selectedEvaluation.studentName}</Text>
                <div style={{ marginTop: 8 }}>
                  <Rate disabled defaultValue={selectedEvaluation.overallRating} />
                  <Text style={{ marginLeft: 8, fontSize: 18, fontWeight: 700, color: getRatingColor(selectedEvaluation.overallRating) }}>
                    {selectedEvaluation.overallRating.toFixed(1)}
                  </Text>
                </div>
              </div>
            </div>

            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Card size="small" title="Kriteria Penilaian">
                  <div style={{ marginBottom: 8 }}>
                    <Text>Kualitas Mengajar:</Text>
                    <Rate disabled defaultValue={selectedEvaluation.teachingQuality} style={{ marginLeft: 8 }} />
                    <Text style={{ marginLeft: 8 }}>{selectedEvaluation.teachingQuality}</Text>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Text>Komunikasi:</Text>
                    <Rate disabled defaultValue={selectedEvaluation.communication} style={{ marginLeft: 8 }} />
                    <Text style={{ marginLeft: 8 }}>{selectedEvaluation.communication}</Text>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Text>Kesabaran:</Text>
                    <Rate disabled defaultValue={selectedEvaluation.patience} style={{ marginLeft: 8 }} />
                    <Text style={{ marginLeft: 8 }}>{selectedEvaluation.patience}</Text>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Text>Kejelasan Penjelasan:</Text>
                    <Rate disabled defaultValue={selectedEvaluation.explanation} style={{ marginLeft: 8 }} />
                    <Text style={{ marginLeft: 8 }}>{selectedEvaluation.explanation}</Text>
                  </div>
                  <div>
                    <Text>Motivasi & Dorongan:</Text>
                    <Rate disabled defaultValue={selectedEvaluation.encouragement} style={{ marginLeft: 8 }} />
                    <Text style={{ marginLeft: 8 }}>{selectedEvaluation.encouragement}</Text>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="Informasi Evaluasi">
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Siswa:</Text> {selectedEvaluation.studentName}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Tanggal:</Text> {new Date(selectedEvaluation.evaluationDate).toLocaleDateString()}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Periode:</Text> {selectedEvaluation.period}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Status:</Text> 
                    <Tag color="green" style={{ marginLeft: 8 }}>Selesai</Tag>
                  </div>
                </Card>
              </Col>
            </Row>

            <Card size="small" title="Komentar Positif" style={{ marginBottom: 24 }}>
              <Paragraph>{selectedEvaluation.comments}</Paragraph>
            </Card>

            <Card size="small" title="Saran Perbaikan">
              <Paragraph>{selectedEvaluation.suggestions}</Paragraph>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
} 