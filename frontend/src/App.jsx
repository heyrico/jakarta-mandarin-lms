import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Row, Col, Button, Avatar, Dropdown, List, Badge } from 'antd';
import jakartaMandarinLogo from './assets/TEXT-LOGO-JM-NEW.png';
import './App.css';
import {
  UserOutlined,
  DashboardOutlined,
  BookOutlined,
  TeamOutlined,
  SettingOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  UsergroupAddOutlined,
  FileTextOutlined,
  SolutionOutlined,
  TrophyOutlined,
  WalletOutlined,
  PlayCircleOutlined,
  ThunderboltOutlined,
  MessageOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import UserPage from './pages/UserPage';
import FinancePage from './pages/FinancePage';
import InvoicePage from './pages/InvoicePage';
import DashboardPage from './pages/DashboardPage';
import KelasPage from './pages/KelasPage';
import SiswaPage from './pages/SiswaPage';
import AbsensiPage from './pages/AbsensiPage';
import NilaiPage from './pages/NilaiPage';
import PendaftaranPage from './pages/PendaftaranPage';
import PaymentReminderPage from './pages/PaymentReminderPage';
import GuruDashboardPage from './pages/GuruDashboardPage';
import CreditPackagePage from './pages/CreditPackagePage';
import StudentCreditPage from './pages/StudentCreditPage';
import AutoCreditDeductionPage from './pages/AutoCreditDeductionPage';
import AutoBillingPage from './pages/AutoBillingPage';
import ChatSystemPage from './pages/ChatSystemPage';
import AddOnManagementPage from './pages/AddOnManagementPage';
import TeacherEvaluationPage from './pages/TeacherEvaluationPage';
import SEADashboardPage from './pages/SEADashboardPage';
import SSCDashboardPage from './pages/SSCDashboardPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import MyClassesPage from './pages/MyClassesPage';
import MyGradesPage from './pages/MyGradesPage';
import MyAttendancePage from './pages/MyAttendancePage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SettingsPage from './pages/SettingsPage';
import MasterAdminPage from './pages/MasterAdminPage';
// import halaman lain jika ada

// ScrollToTop Component
function ScrollToTop() {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Only scroll if we're not already at the top
    const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    
    if (currentScroll > 100) { // Only scroll if we're more than 100px from top
      setIsLoading(true);
      
      // Add loading class to body for visual feedback
      document.body.classList.add('page-transitioning');
      
      // Show loading indicator
      const loadingBar = document.createElement('div');
      loadingBar.className = 'route-loading';
      document.body.appendChild(loadingBar);
      
      // Simple smooth scroll to top
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
      
      // Remove loading elements after scroll completes
      const removeLoading = () => {
        document.body.classList.remove('page-transitioning');
        if (loadingBar.parentNode) {
          loadingBar.parentNode.removeChild(loadingBar);
        }
        setIsLoading(false);
      };
      
      // Listen for scroll end
      const handleScroll = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop === 0) {
          setTimeout(removeLoading, 200);
          window.removeEventListener('scroll', handleScroll);
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      
      // Fallback: remove loading after 1 second
      const timeoutId = setTimeout(() => {
        removeLoading();
        window.removeEventListener('scroll', handleScroll);
      }, 1000);
      
      return () => {
        clearTimeout(timeoutId);
        removeLoading();
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [pathname]);

  return null;
}

const { Header, Sider, Content } = Layout;

const getMenuItems = (userRole) => {
  if (userRole === 'GURU') {
    return [
      {
        key: 'guru-dashboard',
        icon: <DashboardOutlined />, 
        label: 'Dashboard Guru',
      },
      { type: 'divider' },
      {
        type: 'group',
        label: 'AKADEMIK',
        children: [
          { key: 'absensi', icon: <CheckCircleOutlined />, label: 'Absensi' },
          { key: 'nilai', icon: <TrophyOutlined />, label: 'Nilai' },
        ],
      },
      { type: 'divider' },
      {
        type: 'group',
        label: 'KOMUNIKASI',
        children: [
          { key: 'chat-system', icon: <MessageOutlined />, label: 'Chat System' },
        ],
      },
      { type: 'divider' },
      { key: 'setting', icon: <SettingOutlined />, label: 'Pengaturan' },
    ];
  }

  if (userRole === 'SISWA') {
    return [
      {
        key: 'student-dashboard',
        icon: <DashboardOutlined />, 
        label: 'Dashboard Siswa',
      },
      { type: 'divider' },
      {
        type: 'group',
        label: 'AKADEMIK',
        children: [
          { key: 'my-classes', icon: <BookOutlined />, label: 'Kelas Saya' },
          { key: 'my-grades', icon: <TrophyOutlined />, label: 'Nilai Saya' },
          { key: 'my-attendance', icon: <CheckCircleOutlined />, label: 'Absensi Saya' },
        ],
      },
      { type: 'divider' },
      {
        type: 'group',
        label: 'KOMUNIKASI',
        children: [
          { key: 'chat-system', icon: <MessageOutlined />, label: 'Chat System' },
        ],
      },
      { type: 'divider' },
      { key: 'setting', icon: <SettingOutlined />, label: 'Pengaturan' },
    ];
  }

  if (userRole === 'FINANCE') {
    return [
      {
        key: 'finance-dashboard',
        icon: <DashboardOutlined />, 
        label: 'Dashboard Finance',
      },
      { type: 'divider' },
      {
        type: 'group',
        label: 'KEUANGAN',
        children: [
          { key: 'finance', icon: <DollarOutlined />, label: 'Keuangan' },
          { key: 'invoices', icon: <FileTextOutlined />, label: 'Invoice' },
          { key: 'add-ons', icon: <ShoppingCartOutlined />, label: 'Add On' },
          { key: 'payment-reminder', icon: <ExclamationCircleOutlined />, label: 'Payment Reminder' },
          { key: 'credit-packages', icon: <WalletOutlined />, label: 'Paket Kredit' },
          { key: 'student-credits', icon: <WalletOutlined />, label: 'Saldo Kredit Siswa' },
        ],
      },
      { type: 'divider' },
      { key: 'setting', icon: <SettingOutlined />, label: 'Pengaturan' },
    ];
  }

  if (userRole === 'SEA') {
    return [
      {
        key: 'sea-dashboard',
        icon: <DashboardOutlined />, 
        label: 'Dashboard SEA',
      },
      { type: 'divider' },
      {
        type: 'group',
        label: 'AKADEMIK',
        children: [
          { key: 'siswa', icon: <TeamOutlined />, label: 'Siswa' },
          { key: 'pendaftaran', icon: <SolutionOutlined />, label: 'Pendaftaran' },
          { key: 'absensi', icon: <CheckCircleOutlined />, label: 'Absensi' },
        ],
      },
      { type: 'divider' },
      {
        type: 'group',
        label: 'KEUANGAN',
        children: [
          { key: 'invoices', icon: <FileTextOutlined />, label: 'Invoice' },
          { key: 'add-ons', icon: <ShoppingCartOutlined />, label: 'Add On' },
          { key: 'payment-reminder', icon: <ExclamationCircleOutlined />, label: 'Payment Reminder' },
        ],
      },
      { type: 'divider' },
      { key: 'setting', icon: <SettingOutlined />, label: 'Pengaturan' },
    ];
  }

  if (userRole === 'SSC') {
    return [
      {
        key: 'ssc-dashboard',
        icon: <DashboardOutlined />, 
        label: 'Dashboard SSC',
      },
      { type: 'divider' },
      {
        type: 'group',
        label: 'AKADEMIK',
        children: [
          { key: 'siswa', icon: <TeamOutlined />, label: 'Siswa' },
          { key: 'pendaftaran', icon: <SolutionOutlined />, label: 'Pendaftaran' },
          { key: 'absensi', icon: <CheckCircleOutlined />, label: 'Absensi' },
          { key: 'nilai', icon: <TrophyOutlined />, label: 'Nilai' },
        ],
      },
      { type: 'divider' },
      {
        type: 'group',
        label: 'KOMUNIKASI',
        children: [
          { key: 'chat-system', icon: <MessageOutlined />, label: 'Chat System' },
        ],
      },
      { type: 'divider' },
      { key: 'setting', icon: <SettingOutlined />, label: 'Pengaturan' },
    ];
  }

  // SUPER_ADMIN - Full access
  return [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />, 
      label: 'Dashboard',
    },
    { type: 'divider' },
    {
      type: 'group',
      label: 'AKADEMIK',
      children: [
        { key: 'kelas', icon: <BookOutlined />, label: 'Kelas' },
        { key: 'siswa', icon: <TeamOutlined />, label: 'Siswa' },
        { key: 'pendaftaran', icon: <SolutionOutlined />, label: 'Pendaftaran' },
        { key: 'absensi', icon: <CheckCircleOutlined />, label: 'Absensi' },
        { key: 'nilai', icon: <TrophyOutlined />, label: 'Nilai' },
        { key: 'teacher-evaluation', icon: <StarOutlined />, label: 'Evaluasi Guru' },
      ],
    },
    { type: 'divider' },
    {
      type: 'group',
      label: 'KEUANGAN',
      children: [
        { key: 'finance', icon: <DollarOutlined />, label: 'Keuangan' },
        { key: 'invoices', icon: <FileTextOutlined />, label: 'Invoice' },
        { key: 'add-ons', icon: <ShoppingCartOutlined />, label: 'Add On' },
        { key: 'payment-reminder', icon: <ExclamationCircleOutlined />, label: 'Payment Reminder' },
        { key: 'credit-packages', icon: <WalletOutlined />, label: 'Paket Kredit' },
        { key: 'student-credits', icon: <WalletOutlined />, label: 'Saldo Kredit Siswa' },
        { key: 'auto-deduction', icon: <PlayCircleOutlined />, label: 'Auto Credit Deduction' },
        { key: 'auto-billing', icon: <ThunderboltOutlined />, label: 'Auto Billing System' },
      ],
    },
    { type: 'divider' },
    {
      type: 'group',
      label: 'SISTEM',
      children: [
        { key: 'user', icon: <UserOutlined />, label: 'User Management' },
        { key: 'chat-system', icon: <MessageOutlined />, label: 'Chat System' },
        { key: 'setting', icon: <SettingOutlined />, label: 'Pengaturan' },
      ],
    },
  ];
};

const userMenu = {
  items: [
    {
      key: 'profile',
      label: '👤 Profile Saya',
      icon: <UserOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '🚪 Logout',
      icon: <LogoutOutlined />,
      onClick: () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userInfo');
        // Redirect ke login page
        window.location.href = '/login';
      }
    }
  ]
};

const todoList = [
  {
    title: '2 Invoice belum lunas',
    icon: <FileTextOutlined style={{ color: '#ef4444' }} />,
    color: '#ef4444',
    action: 'Lihat Invoice',
  },
  {
    title: '1 Kelas perlu jadwal ulang',
    icon: <CalendarOutlined style={{ color: '#f59e42' }} />,
    color: '#f59e42',
    action: 'Atur Jadwal',
  },
  {
    title: '1 Siswa belum absen',
    icon: <UsergroupAddOutlined style={{ color: '#8B5CF6' }} />,
    color: '#8B5CF6',
    action: 'Cek Absensi',
  },
];

function App() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // Check if user is logged in
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'ADMIN';

  // If not logged in and not on auth pages, redirect to login page
  if (!token && !['/login', '/reset-password'].includes(window.location.pathname)) {
    window.location.href = '/login';
    return null;
  }

  // If on login or reset password page, don't show sidebar
  if (window.location.pathname === '/login' || window.location.pathname === '/reset-password') {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    );
  }

  // If user is GURU, show guru dashboard
  if (userRole === 'GURU' && window.location.pathname === '/') {
    return <GuruDashboardPage />;
  }

  // If user is SISWA, show student dashboard
  if (userRole === 'SISWA' && window.location.pathname === '/') {
    return <StudentDashboardPage />;
  }

  const [stats, setStats] = useState({
    totalSiswa: 0,
    kelasAktif: 0,
    totalGuru: 0,
    totalFinance: 0,
    invoicePending: 0,
  });
  
  useEffect(() => {
    fetch('http://localhost:3000/stats/overview')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(error => {
        console.warn('Failed to fetch stats, using fallback data:', error);
        // Fallback to mock data if backend is not available
        setStats({
          totalSiswa: 156,
          kelasAktif: 24,
          totalGuru: 8,
          totalFinance: 125000000,
          invoicePending: 8,
        });
      });
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  let selectedKey = 'dashboard';
  
  // Update selected key based on current path
  if (location.pathname === '/') selectedKey = 'dashboard';
  if (location.pathname === '/guru-dashboard') selectedKey = 'guru-dashboard';
  if (location.pathname === '/sea-dashboard') selectedKey = 'sea-dashboard';
  if (location.pathname === '/ssc-dashboard') selectedKey = 'ssc-dashboard';
  if (location.pathname === '/finance-dashboard') selectedKey = 'finance-dashboard';
  if (location.pathname === '/student-dashboard') selectedKey = 'student-dashboard';
  if (location.pathname.startsWith('/user')) selectedKey = 'user';
  if (location.pathname.startsWith('/finance')) selectedKey = 'finance';
  if (location.pathname.startsWith('/invoices')) selectedKey = 'invoices';
  if (location.pathname.startsWith('/kelas')) selectedKey = 'kelas';
  if (location.pathname.startsWith('/siswa')) selectedKey = 'siswa';
  if (location.pathname.startsWith('/pendaftaran')) selectedKey = 'pendaftaran';
  if (location.pathname.startsWith('/absensi')) selectedKey = 'absensi';
  if (location.pathname.startsWith('/nilai')) selectedKey = 'nilai';
  if (location.pathname.startsWith('/payment-reminder')) selectedKey = 'payment-reminder';
  if (location.pathname.startsWith('/credit-packages')) selectedKey = 'credit-packages';
  if (location.pathname.startsWith('/student-credits')) selectedKey = 'student-credits';
  if (location.pathname.startsWith('/auto-deduction')) selectedKey = 'auto-deduction';
  if (location.pathname.startsWith('/auto-billing')) selectedKey = 'auto-billing';
  if (location.pathname.startsWith('/chat-system')) selectedKey = 'chat-system';
  if (location.pathname.startsWith('/add-ons')) selectedKey = 'add-ons';
  if (location.pathname.startsWith('/teacher-evaluation')) selectedKey = 'teacher-evaluation';
  if (location.pathname.startsWith('/my-classes')) selectedKey = 'my-classes';
  if (location.pathname.startsWith('/my-grades')) selectedKey = 'my-grades';
  if (location.pathname.startsWith('/my-attendance')) selectedKey = 'my-attendance';
  if (location.pathname.startsWith('/setting')) selectedKey = 'setting';
  if (location.pathname.startsWith('/master-admin')) selectedKey = 'master-admin';
  // Tambahkan else if untuk menu lain jika perlu

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f6fa' }}>
      <Sider width={250} style={{
        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
        minHeight: '100vh',
      }}>
        <div style={{ padding: '20px 16px', paddingBottom: 0 }}>
          {/* Logo Jakarta Mandarin */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginBottom: 24,
            padding: '8px 0'
          }}>
            <img 
              src={jakartaMandarinLogo} 
              alt="Jakarta Mandarin Logo" 
              style={{ 
                width: 160, 
                height: 'auto', 
                maxWidth: '100%',
                objectFit: 'contain'
              }} 
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Avatar size={48} style={{ background: '#EC4899', fontWeight: 700 }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'Su'}
            </Avatar>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
                {user.name || 'Super Admin'}
              </div>
              <div style={{ color: '#c7d2fe', fontSize: 13 }}>
                {user.role || 'Super Admin'}
              </div>
            </div>
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ 
            background: 'transparent', 
            fontWeight: 500, 
            fontSize: 14, 
            borderRight: 0,
            padding: '0 8px'
          }}
          items={getMenuItems(userRole)}
          onClick={({ key }) => {
            if (key === 'dashboard') navigate('/');
            if (key === 'guru-dashboard') navigate('/guru-dashboard');
            if (key === 'sea-dashboard') navigate('/sea-dashboard');
            if (key === 'ssc-dashboard') navigate('/ssc-dashboard');
            if (key === 'finance-dashboard') navigate('/finance-dashboard');
            if (key === 'student-dashboard') navigate('/student-dashboard');
            if (key === 'user') navigate('/user');
            if (key === 'finance') navigate('/finance');
            if (key === 'invoices') navigate('/invoices');
            if (key === 'kelas') navigate('/kelas');
            if (key === 'siswa') navigate('/siswa');
            if (key === 'absensi') navigate('/absensi');
            if (key === 'nilai') navigate('/nilai');
            if (key === 'pendaftaran') navigate('/pendaftaran');
            if (key === 'payment-reminder') navigate('/payment-reminder');
            if (key === 'credit-packages') navigate('/credit-packages');
            if (key === 'student-credits') navigate('/student-credits');
            if (key === 'auto-deduction') navigate('/auto-deduction');
            if (key === 'auto-billing') navigate('/auto-billing');
            if (key === 'chat-system') navigate('/chat-system');
            if (key === 'add-ons') navigate('/add-ons');
            if (key === 'teacher-evaluation') navigate('/teacher-evaluation');
            if (key === 'my-classes') navigate('/my-classes');
            if (key === 'my-grades') navigate('/my-grades');
            if (key === 'my-attendance') navigate('/my-attendance');
            if (key === 'setting') navigate('/setting');
            if (key === 'master-admin') navigate('/master-admin');
            // tambahkan routing lain sesuai key
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px #00000010', minHeight: 64 }}>
          <div style={{ fontWeight: 700, fontSize: 22 }}>Dashboard</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ color: '#888', fontSize: 15 }}>{today}</div>
            <Dropdown menu={userMenu} placement="bottomRight">
              <div style={{ cursor: 'pointer', color: '#8B5CF6', fontWeight: 700 }}>
                {user.name || 'Super Admin'} ▾
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ padding: '32px 0', minHeight: 'calc(100vh - 64px)', background: '#f5f6fa' }}>
          <ScrollToTop />
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<DashboardPage />} />
              <Route path="/user" element={<UserPage />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/invoices" element={<InvoicePage />} />
              <Route path="/kelas" element={<KelasPage />} />
              <Route path="/siswa" element={<SiswaPage />} />
              <Route path="/absensi" element={<AbsensiPage />} />
              <Route path="/nilai" element={<NilaiPage />} />
              <Route path="/pendaftaran" element={<PendaftaranPage />} />
              <Route path="/payment-reminder" element={<PaymentReminderPage />} />
              <Route path="/credit-packages" element={<CreditPackagePage />} />
              <Route path="/student-credits" element={<StudentCreditPage />} />
              <Route path="/auto-deduction" element={<AutoCreditDeductionPage />} />
              <Route path="/auto-billing" element={<AutoBillingPage />} />
              <Route path="/chat-system" element={<ChatSystemPage />} />
              <Route path="/add-ons" element={<AddOnManagementPage />} />
              <Route path="/teacher-evaluation" element={<TeacherEvaluationPage />} />
              <Route path="/guru-dashboard" element={<GuruDashboardPage />} />
              <Route path="/sea-dashboard" element={<SEADashboardPage />} />
              <Route path="/ssc-dashboard" element={<SSCDashboardPage />} />
              <Route path="/student-dashboard" element={<StudentDashboardPage />} />
              <Route path="/my-classes" element={<MyClassesPage />} />
              <Route path="/my-grades" element={<MyGradesPage />} />
              <Route path="/my-attendance" element={<MyAttendancePage />} />
              <Route path="/setting" element={<SettingsPage />} />
              <Route path="/master-admin" element={<MasterAdminPage />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;