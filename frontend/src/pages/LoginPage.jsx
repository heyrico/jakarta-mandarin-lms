import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Select, Divider, Typography, Space, Tag } from 'antd';
import { UserOutlined, LockOutlined, InfoCircleOutlined } from '@ant-design/icons';
import jakartaMandarinLogo from '../assets/TEXT-LOGO-JM-NEW.png';
import './LoginPage.css';

const { Option } = Select;
const { Text, Title } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  // Real Users Data from Backend
  const realUsers = [
    {
      id: 0,
      name: 'Developer',
      email: 'dev@jakartamandarin.com',
      password: 'dev123',
      role: 'DEVELOPER',
      description: 'Developer access (hidden)',
      avatar: 'DEV',
      color: '#000000',
      hidden: true
    }
  ];

  const onFinish = async (values) => {
    console.log('onFinish called with values:', values);
    setLoading(true);
    
    try {
      // Try real API first
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Real API login successful:', data);
        
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        message.success('Login berhasil!');
        window.location.href = '/dashboard';
      } else {
        // Fallback to mock login with real users
        const realUser = realUsers.find(user => 
          user.email === values.email && user.password === values.password
        );

        if (realUser) {
          console.log('Using real user login...', realUser);
          const mockUser = {
            id: realUser.id,
            name: realUser.name,
            email: realUser.email,
            role: realUser.role,
            avatar: realUser.avatar,
            color: realUser.color
          };
          
          localStorage.setItem('token', `mock-token-${realUser.id}`);
          localStorage.setItem('user', JSON.stringify(mockUser));
          
          message.success('Login berhasil!');
          window.location.href = '/dashboard';
        } else {
          message.error('Email atau password salah!');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback to mock login
      const realUser = realUsers.find(user => 
        user.email === values.email && user.password === values.password
      );

      if (realUser) {
        console.log('Using real user login (fallback)...', realUser);
        const mockUser = {
          id: realUser.id,
          name: realUser.name,
          email: realUser.email,
          role: realUser.role,
          avatar: realUser.avatar,
          color: realUser.color
        };
        
        localStorage.setItem('token', `mock-token-${realUser.id}`);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        message.success('Login berhasil!');
        window.location.href = '/dashboard';
      } else {
        message.error('Email atau password salah!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (user) => {
    setSelectedUser(user);
    // Use Form.setFieldsValue to properly fill the form
    form.setFieldsValue({
      email: user.email,
      password: user.password
    });
    message.info(`Form diisi dengan ${user.name} (${user.role})`);
  };

  const getRoleColor = (role) => {
    const colors = {
      'SUPER_ADMIN': '#f5222d',
      'SEA': '#1890ff',
      'SSC': '#52c41a',
      'FINANCE': '#faad14',
      'GURU': '#722ed1',
      'SISWA': '#13c2c2'
    };
    return colors[role] || '#666';
  };

  const getRoleLabel = (role) => {
    const labels = {
      'DEVELOPER': 'Developer',
      'ADMIN': 'Administrator',
      'SEA': 'Sales Executive Admin',
      'SSC': 'Student Service Center',
      'FINANCE': 'Finance Admin',
      'GURU': 'Guru',
      'SISWA': 'Siswa'
    };
    return labels[role] || role;
  };

  return (
    <div 
      className="login-container"
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
        margin: 0
      }}
    >
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        zIndex: 1
      }} />
      <div style={{
        position: 'absolute',
        bottom: -50,
        left: -50,
        width: 150,
        height: 150,
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        zIndex: 1
      }} />

      <div style={{
        display: 'flex',
        gap: 40,
        maxWidth: 1200,
        width: '100%',
        zIndex: 2
      }}>
        {/* Login Form */}
        <Card 
          style={{ 
            width: 400, 
            borderRadius: 16, 
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <img 
              src={jakartaMandarinLogo} 
              alt="Jakarta Mandarin Logo" 
              style={{ 
                width: 200, 
                height: 'auto', 
                marginBottom: 16 
              }} 
            />
            <Title level={3} style={{ margin: 0, color: '#333' }}>
              Selamat Datang
            </Title>
            <Text type="secondary">
              Login ke sistem Jakarta Mandarin
            </Text>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            form={form}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Email wajib diisi!' },
                { type: 'email', message: 'Format email tidak valid!' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                name="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Password wajib diisi!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                name="password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  width: '100%',
                  height: 48,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  border: 'none',
                  fontSize: 16,
                  fontWeight: 600
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Form.Item>
          </Form>

          <Divider>Atau</Divider>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <InfoCircleOutlined /> Gunakan dummy users di sebelah kanan untuk testing
            </Text>
          </div>
        </Card>

        {/* Dummy Users Panel */}
        <Card 
          style={{ 
            width: 400, 
            borderRadius: 16, 
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            maxHeight: '80vh',
            overflow: 'auto'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={4} style={{ margin: 0, color: '#333' }}>
              🧪 Dummy Users untuk Testing
            </Title>
            <Text type="secondary">
              Klik user untuk auto-fill login form
            </Text>
          </div>

          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {realUsers.filter(user => !user.hidden).map((user) => (
              <Card
                key={user.id}
                size="small"
                hoverable
                onClick={() => handleQuickLogin(user)}
                style={{
                  cursor: 'pointer',
                  border: selectedUser?.id === user.id ? `2px solid ${user.color}` : '1px solid #f0f0f0',
                  borderRadius: 8
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: user.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 14
                    }}
                  >
                    {user.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                      {user.email}
                    </div>
                    <Tag color={user.color} style={{ fontSize: 10 }}>
                      {getRoleLabel(user.role)}
                    </Tag>
                  </div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {user.description}
                  </Text>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Text code style={{ fontSize: 10 }}>
                    Pass: {user.password}
                  </Text>
                </div>
              </Card>
            ))}
          </Space>

          <Divider />

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              💡 Tips: Klik user untuk auto-fill, lalu klik Login
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
} 