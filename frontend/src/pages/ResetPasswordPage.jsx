import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import jakartaMandarinLogo from '../assets/TEXT-LOGO-JM-NEW.png';
import './LoginPage.css';

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Link reset password telah dikirim ke email Anda! 📧');
        console.log('Reset Token:', data.resetToken); // For testing only
        
        // Redirect ke login setelah 2 detik
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        message.error(data.message || 'Terjadi kesalahan!');
      }
      
    } catch (error) {
      console.error('Reset password error:', error);
      message.error('Terjadi kesalahan! Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
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
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'float 20s infinite linear',
        zIndex: 1
      }} />
      
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: 100,
        height: 100,
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        animation: 'pulse 3s infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '5%',
        width: 80,
        height: 80,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '50%',
        animation: 'pulse 4s infinite'
      }} />

      {/* Back to Login Button */}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'white',
          fontSize: 16,
          fontWeight: 600,
          zIndex: 10,
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 8,
          backdropFilter: 'blur(10px)'
        }}
        onClick={() => window.location.href = '/login'}
      >
        Kembali ke Login
      </Button>

      <Card 
        className="login-card"
        style={{
          width: 450,
          borderRadius: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          border: 'none',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.95)',
          position: 'relative',
          zIndex: 2,
          overflow: 'hidden'
        }}
      >
        {/* Card Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)'
        }} />
        
        <div style={{ textAlign: 'center', marginBottom: 40, padding: '20px 0' }}>
          <div style={{
            position: 'relative',
            marginBottom: 24
          }}>
            <img 
              src={jakartaMandarinLogo} 
              alt="Jakarta Mandarin Logo" 
              style={{ 
                width: 180, 
                height: 'auto', 
                filter: 'drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3))'
              }}
            />
            {/* Glow Effect */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 200,
              height: 50,
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
              borderRadius: '50%',
              zIndex: -1
            }} />
          </div>
          
          <h2 style={{ 
            color: '#8B5CF6', 
            margin: 0, 
            fontSize: 24,
            fontWeight: 800,
            textShadow: '0 2px 4px rgba(139, 92, 246, 0.2)'
          }}>
            🔑 Reset Password
          </h2>
          <p style={{ 
            color: '#666', 
            margin: '12px 0 0 0',
            fontSize: 14,
            fontWeight: 500
          }}>
            Masukkan email Anda untuk menerima link reset password
          </p>
        </div>

        <Form
          name="reset-password"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Email wajib diisi!' },
              { type: 'email', message: 'Format email tidak valid!' }
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#8B5CF6' }} />}
              placeholder="Masukkan email Anda"
              style={{ 
                borderRadius: 12,
                height: 50,
                fontSize: 16,
                border: '2px solid #f0f0f0',
                transition: 'all 0.3s ease'
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: '100%',
                height: 56,
                borderRadius: 12,
                background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)',
                border: 'none',
                fontWeight: 700,
                fontSize: 16,
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? '🔄 Mengirim Email...' : '📧 Kirim Link Reset'}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: 24,
          padding: '16px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
          borderRadius: 12,
          border: '1px solid rgba(139, 92, 246, 0.1)'
        }}>
          <p style={{ 
            color: '#8B5CF6', 
            fontSize: 12,
            fontWeight: 600,
            margin: 0
          }}>
            💡 Link reset password akan dikirim ke email Anda dalam beberapa menit
          </p>
        </div>
      </Card>
    </div>
  );
} 