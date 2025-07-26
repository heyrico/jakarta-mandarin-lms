import React, { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Button, Switch, Select, message, Divider, Typography, Space, Alert, Spin } from 'antd';
import { 
  SettingOutlined, 
  UserOutlined, 
  SecurityScanOutlined, 
  BellOutlined, 
  DatabaseOutlined,
  GlobalOutlined,
  MailOutlined,
  KeyOutlined,
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import './SettingsPage.css';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Option } = Select;

const SettingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({});
  const [form] = Form.useForm();

  // Load settings from backend
  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/settings');
      if (response.ok) {
        const data = await response.json();
        const settingsObj = {};
        data.forEach(setting => {
          settingsObj[setting.key] = setting.value;
        });
        setSettings(settingsObj);
        form.setFieldsValue(settingsObj);
      } else {
        message.error('Gagal memuat pengaturan');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      message.error('Gagal memuat pengaturan');
    } finally {
      setLoading(false);
    }
  };

  // Save settings to backend
  const saveSettings = async (values, category) => {
    setSaving(true);
    try {
      const settingsToUpdate = Object.keys(values).map(key => ({
        key,
        value: values[key],
        category
      }));

      const response = await fetch('http://localhost:3000/settings/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsToUpdate)
      });

      if (response.ok) {
        message.success('Pengaturan berhasil disimpan!');
        await loadSettings(); // Reload settings
      } else {
        message.error('Gagal menyimpan pengaturan');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      message.error('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveGeneral = async (values) => {
    await saveSettings(values, 'general');
  };

  const handleSaveEmail = async (values) => {
    await saveSettings(values, 'email');
  };

  const handleSaveNotifications = async (values) => {
    await saveSettings(values, 'notifications');
  };

  const handleSaveSecurity = async (values) => {
    await saveSettings(values, 'security');
  };

  const handleTestEmail = async () => {
    try {
      const response = await fetch('http://localhost:3000/settings/test-email', {
        method: 'POST'
      });
      if (response.ok) {
        message.success('Test email berhasil dikirim!');
      } else {
        message.error('Gagal mengirim test email');
      }
    } catch (error) {
      message.error('Gagal mengirim test email');
    }
  };

  const handleBackupDatabase = async () => {
    try {
      const response = await fetch('http://localhost:3000/settings/backup', {
        method: 'POST'
      });
      if (response.ok) {
        message.success('Backup database berhasil!');
      } else {
        message.error('Gagal backup database');
      }
    } catch (error) {
      message.error('Gagal backup database');
    }
  };

  const handleClearCache = () => {
    localStorage.clear();
    message.success('Cache berhasil dibersihkan!');
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Memuat pengaturan...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>
          <SettingOutlined style={{ marginRight: 8 }} />
          Pengaturan Sistem
        </Title>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={loadSettings}
          loading={loading}
        >
          Refresh
        </Button>
      </div>
      
      <Card className="settings-card">
        <Tabs defaultActiveKey="general">
          <TabPane 
            tab={
              <span>
                <GlobalOutlined />
                Umum
              </span>
            } 
            key="general"
          >
            <Form layout="vertical" onFinish={handleSaveGeneral} form={form}>
              <Form.Item label="Nama Sekolah" name="school_name">
                <Input placeholder="Jakarta Mandarin" />
              </Form.Item>
              
              <Form.Item label="Alamat" name="school_address">
                <Input.TextArea rows={3} placeholder="Jl. Sudirman No. 123, Jakarta" />
              </Form.Item>
              
              <Form.Item label="Telepon" name="school_phone">
                <Input placeholder="+62 21 1234 5678" />
              </Form.Item>
              
              <Form.Item label="Email" name="school_email">
                <Input placeholder="info@jakartamandarin.com" />
              </Form.Item>
              
              <Form.Item label="Website" name="school_website">
                <Input placeholder="https://jakartamandarin.com" />
              </Form.Item>
              
              <Form.Item label="Zona Waktu" name="timezone">
                <Select defaultValue="Asia/Jakarta">
                  <Option value="Asia/Jakarta">Asia/Jakarta (WIB)</Option>
                  <Option value="Asia/Makassar">Asia/Makassar (WITA)</Option>
                  <Option value="Asia/Jayapura">Asia/Jayapura (WIT)</Option>
                </Select>
              </Form.Item>
              
              <Form.Item label="Bahasa" name="language">
                <Select defaultValue="id">
                  <Option value="id">Bahasa Indonesia</Option>
                  <Option value="en">English</Option>
                  <Option value="zh">中文</Option>
                </Select>
              </Form.Item>
              
              <Button type="primary" htmlType="submit" loading={saving} icon={<SaveOutlined />}>
                Simpan Pengaturan
              </Button>
            </Form>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <MailOutlined />
                Email
              </span>
            } 
            key="email"
          >
            <Form layout="vertical" onFinish={handleSaveEmail} form={form}>
              <Alert
                message="Konfigurasi Email"
                description="Pengaturan untuk notifikasi email otomatis"
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
              />
              
              <Form.Item label="SMTP Host" name="smtp_host">
                <Input placeholder="smtp.gmail.com" />
              </Form.Item>
              
              <Form.Item label="SMTP Port" name="smtp_port">
                <Input placeholder="587" />
              </Form.Item>
              
              <Form.Item label="Email Pengirim" name="sender_email">
                <Input placeholder="noreply@jakartamandarin.com" />
              </Form.Item>
              
              <Form.Item label="Password" name="sender_password">
                <Input.Password placeholder="Password email" />
              </Form.Item>
              
              <Space>
                <Button type="primary" htmlType="submit" loading={saving} icon={<SaveOutlined />}>
                  Simpan Konfigurasi
                </Button>
                <Button onClick={handleTestEmail}>
                  Test Email
                </Button>
              </Space>
            </Form>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <BellOutlined />
                Notifikasi
              </span>
            } 
            key="notifications"
          >
            <Form layout="vertical" onFinish={handleSaveNotifications} form={form}>
              <Form.Item label="Notifikasi Email" name="email_notifications" valuePropName="checked">
                <Switch />
              </Form.Item>
              
              <Form.Item label="Notifikasi WhatsApp" name="whatsapp_notifications" valuePropName="checked">
                <Switch />
              </Form.Item>
              
              <Form.Item label="Notifikasi SMS" name="sms_notifications" valuePropName="checked">
                <Switch />
              </Form.Item>
              
              <Form.Item label="Reminder Pembayaran" name="payment_reminders" valuePropName="checked">
                <Switch />
              </Form.Item>
              
              <Form.Item label="Notifikasi Absensi" name="attendance_notifications" valuePropName="checked">
                <Switch />
              </Form.Item>
              
              <Form.Item label="Notifikasi Nilai" name="grade_notifications" valuePropName="checked">
                <Switch />
              </Form.Item>
              
              <Button type="primary" htmlType="submit" loading={saving} icon={<SaveOutlined />}>
                Simpan Pengaturan
              </Button>
            </Form>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <SecurityScanOutlined />
                Keamanan
              </span>
            } 
            key="security"
          >
            <Form layout="vertical" onFinish={handleSaveSecurity} form={form}>
              <Form.Item label="Password Minimum Length" name="min_password_length">
                <Input placeholder="8" />
              </Form.Item>
              
              <Form.Item label="Require Special Characters" name="require_special_chars" valuePropName="checked">
                <Switch />
              </Form.Item>
              
              <Form.Item label="Session Timeout (minutes)" name="session_timeout">
                <Input placeholder="30" />
              </Form.Item>
              
              <Form.Item label="Two-Factor Authentication" name="two_factor_auth" valuePropName="checked">
                <Switch />
              </Form.Item>
              
              <Form.Item label="Login Attempts Limit" name="max_login_attempts">
                <Input placeholder="5" />
              </Form.Item>
              
              <Button type="primary" htmlType="submit" loading={saving} icon={<SaveOutlined />}>
                Simpan Pengaturan
              </Button>
            </Form>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <DatabaseOutlined />
                Database
              </span>
            } 
            key="database"
          >
            <div>
              <Alert
                message="Pengaturan Database"
                description="Kelola backup dan maintenance database"
                type="warning"
                showIcon
                style={{ marginBottom: 24 }}
              />
              
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button type="primary" onClick={handleBackupDatabase}>
                  Backup Database
                </Button>
                
                <Button onClick={handleClearCache}>
                  Clear Cache
                </Button>
                
                <Divider />
                
                <Text strong>Informasi Database:</Text>
                <Text>Host: localhost</Text>
                <Text>Database: dbjmcur</Text>
                <Text>Status: Connected</Text>
              </Space>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SettingsPage; 