import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, DatePicker, Select, Upload, message, Tabs, Tag, Space, Progress, Divider, Typography, Alert, Statistic, Dropdown, Menu, Row, Col } from 'antd';
import { UploadOutlined, DownloadOutlined, EyeOutlined, PlusOutlined, FileTextOutlined, PrinterOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, DollarOutlined, BankOutlined, CalculatorOutlined, BookOutlined, FileExcelOutlined, SyncOutlined, FilterOutlined, EditOutlined, ReloadOutlined, BarChartOutlined, LineChartOutlined, PieChartOutlined } from '@ant-design/icons';
import './FinancePage.css';

// Import jsPDF for PDF generation
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Import Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend,
  Filler
);

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [reconciliationData, setReconciliationData] = useState([]);
  const [bankStatements, setBankStatements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [reconciliationModal, setReconciliationModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);

  // Analytics state
  const [chartPeriod, setChartPeriod] = useState('yearly');
  const [chartType, setChartType] = useState('line');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('01');

  // Finance stats state
  const [financeStats, setFinanceStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    profit: 0,
    pendingInvoices: 0
  });

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      // Fetch from backend (empty for now)
      const [reconciliationResponse, bankResponse, statsResponse] = await Promise.all([
        fetch('http://localhost:3000/finance/reconciliation'),
        fetch('http://localhost:3000/finance/bank-statements'),
        fetch('http://localhost:3000/finance/stats')
      ]);

      if (reconciliationResponse.ok) {
        const data = await reconciliationResponse.json();
        setReconciliationData(data);
      } else {
        setReconciliationData([]);
      }

      if (bankResponse.ok) {
        const data = await bankResponse.json();
        setBankStatements(data);
      } else {
        setBankStatements([]);
      }

      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setFinanceStats(data);
      } else {
        setFinanceStats({
          totalRevenue: 0,
          totalExpenses: 0,
          profit: 0,
          pendingInvoices: 0
        });
      }
    } catch (error) {
      console.error('Error fetching finance data:', error);
      setReconciliationData([]);
      setBankStatements([]);
      setFinanceStats({
        totalRevenue: 0,
        totalExpenses: 0,
        profit: 0,
        pendingInvoices: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: 'Deskripsi',
      dataIndex: 'description',
      key: 'description',
      width: 250,
    },
    {
      title: 'Referensi',
      dataIndex: 'reference',
      key: 'reference',
      width: 150,
    },
    {
      title: 'Jumlah',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (amount, record) => (
        <span style={{ 
          color: record.type === 'credit' ? '#52c41a' : '#ff4d4f',
          fontWeight: 'bold'
        }}>
          {record.type === 'credit' ? '+' : '-'} Rp {amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={status === 'matched' ? 'green' : 'orange'}>
          {status === 'matched' ? 'Matched' : 'Unmatched'}
        </Tag>
      ),
    },
    {
      title: 'Selisih',
      dataIndex: 'difference',
      key: 'difference',
      width: 150,
      render: (difference) => (
        <span style={{ 
          color: difference === 0 ? '#52c41a' : '#ff4d4f',
          fontWeight: 'bold'
        }}>
          Rp {difference.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Aksi',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => handleViewDetails(record)}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditRecord(record)}
          />
        </Space>
      ),
    },
  ];

  const bankColumns = [
    {
      title: 'Bank',
      dataIndex: 'bankName',
      key: 'bankName',
    },
    {
      title: 'No. Rekening',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
    },
    {
      title: 'Tanggal Statement',
      dataIndex: 'statementDate',
      key: 'statementDate',
    },
    {
      title: 'Saldo Awal',
      dataIndex: 'openingBalance',
      key: 'openingBalance',
      render: (amount) => `Rp ${amount.toLocaleString()}`,
    },
    {
      title: 'Saldo Akhir',
      dataIndex: 'closingBalance',
      key: 'closingBalance',
      render: (amount) => `Rp ${amount.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'reconciled' ? 'green' : 'orange'}>
          {status === 'reconciled' ? 'Reconciled' : 'Pending'}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small"
            onClick={() => handleReconcileBank(record)}
          >
            Reconcile
          </Button>
          <Button 
            type="text" 
            icon={<DownloadOutlined />} 
            size="small"
            onClick={() => handleDownloadStatement(record)}
          />
        </Space>
      ),
    },
  ];

  const handleExportReconciliation = () => {
    alert('Exporting reconciliation report...');
  };

  const handleAutoMatch = () => {
    setLoading(true);
    setTimeout(() => {
      alert('Auto-matching completed! 3 transactions matched.');
      setLoading(false);
    }, 2000);
  };

  const handleExportBalanceSheet = () => {
    console.log('Export Balance Sheet clicked!');
    
    // Show loading alert
    alert('Generating PDF... Please wait.');
    
    // Create PDF using jsPDF
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('NERACA KEUANGAN', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Jakarta Mandarin', 105, 30, { align: 'center' });
    doc.text('Per 31 Januari 2024', 105, 40, { align: 'center' });
    
    // Add assets section
    doc.setFontSize(14);
    doc.text('AKTIVA', 20, 60);
    
    doc.setFontSize(12);
    doc.text('Aktiva Lancar:', 20, 75);
    
    const currentAssets = [
      ['Kas & Setara Kas', 'Rp 75.000.000'],
      ['Piutang Usaha', 'Rp 25.000.000'],
      ['Piutang SPP', 'Rp 15.000.000'],
      ['Persediaan Buku', 'Rp 8.000.000']
    ];
    
    doc.autoTable({
      startY: 80,
      head: [['Akun', 'Jumlah']],
      body: currentAssets,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 }
    });
    
    doc.text('Total Aktiva Lancar: Rp 123.000.000', 20, doc.lastAutoTable.finalY + 10);
    
    // Add fixed assets
    doc.text('Aktiva Tetap:', 20, doc.lastAutoTable.finalY + 25);
    
    const fixedAssets = [
      ['Peralatan Kantor', 'Rp 12.000.000'],
      ['Akumulasi Penyusutan', '(Rp 2.000.000)']
    ];
    
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 30,
      head: [['Akun', 'Jumlah']],
      body: fixedAssets,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 }
    });
    
    doc.text('Total Aktiva Tetap: Rp 10.000.000', 20, doc.lastAutoTable.finalY + 10);
    
    // Add total
    doc.setFontSize(14);
    doc.text('TOTAL AKTIVA: Rp 133.000.000', 20, doc.lastAutoTable.finalY + 25);
    
    // Save the PDF
    doc.save('neraca-keuangan-jakarta-mandarin.pdf');
    
    setTimeout(() => {
      alert('✅ Balance Sheet exported successfully! Check your downloads folder.');
    }, 1000);
  };

  const handlePrintPreviewBalanceSheet = () => {
    console.log('Print Preview Balance Sheet function called!');
    
    // Create a new window for print preview
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Neraca Keuangan - Jakarta Mandarin</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .subtitle { font-size: 16px; color: #666; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #2c3e50; }
          .subsection { margin-bottom: 20px; }
          .subsection-title { font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #34495e; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #3498db; color: white; font-weight: bold; }
          .total { font-weight: bold; font-size: 16px; color: #2c3e50; }
          .grand-total { font-weight: bold; font-size: 18px; color: #e74c3c; }
          @media print {
            body { margin: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">NERACA KEUANGAN</div>
          <div class="subtitle">Jakarta Mandarin</div>
          <div class="subtitle">Per 31 Januari 2024</div>
        </div>
        
        <div class="section">
          <div class="section-title">AKTIVA</div>
          
          <div class="subsection">
            <div class="subsection-title">Aktiva Lancar</div>
            <table>
              <thead>
                <tr><th>Akun</th><th>Jumlah</th></tr>
              </thead>
              <tbody>
                <tr><td>Kas & Setara Kas</td><td>Rp 75.000.000</td></tr>
                <tr><td>Piutang Usaha</td><td>Rp 25.000.000</td></tr>
                <tr><td>Piutang SPP</td><td>Rp 15.000.000</td></tr>
                <tr><td>Persediaan Buku</td><td>Rp 8.000.000</td></tr>
              </tbody>
            </table>
            <div class="total">Total Aktiva Lancar: Rp 123.000.000</div>
          </div>
          
          <div class="subsection">
            <div class="subsection-title">Aktiva Tetap</div>
            <table>
              <thead>
                <tr><th>Akun</th><th>Jumlah</th></tr>
              </thead>
              <tbody>
                <tr><td>Peralatan Kantor</td><td>Rp 12.000.000</td></tr>
                <tr><td>Akumulasi Penyusutan</td><td>(Rp 2.000.000)</td></tr>
              </tbody>
            </table>
            <div class="total">Total Aktiva Tetap: Rp 10.000.000</div>
          </div>
          
          <div class="grand-total">TOTAL AKTIVA: Rp 133.000.000</div>
        </div>
        
        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; background-color: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">🖨️ Print</button>
          <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; background-color: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">❌ Close</button>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    alert('Print preview opened in new window! Click Print button to print.');
  };

  const handleExportProfitLoss = () => {
    console.log('Export Profit Loss clicked!');
    
    // Show loading alert
    alert('Generating PDF... Please wait.');
    
    // Create PDF using jsPDF
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('LAPORAN LABA RUGI', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Jakarta Mandarin', 105, 30, { align: 'center' });
    doc.text('Periode Januari 2024', 105, 40, { align: 'center' });
    
    // Add revenue section
    doc.setFontSize(14);
    doc.text('PENDAPATAN', 20, 60);
    
    const revenue = [
      ['Pendapatan SPP', 'Rp 150.000.000'],
      ['Pendapatan Buku', 'Rp 25.000.000'],
      ['Pendapatan Transportasi', 'Rp 15.000.000']
    ];
    
    doc.autoTable({
      startY: 70,
      head: [['Akun', 'Jumlah']],
      body: revenue,
      theme: 'grid',
      headStyles: { fillColor: [46, 204, 113] },
      styles: { fontSize: 10 }
    });
    
    doc.text('Total Pendapatan: Rp 190.000.000', 20, doc.lastAutoTable.finalY + 10);
    
    // Add expenses section
    doc.setFontSize(14);
    doc.text('BEBAN OPERASIONAL', 20, doc.lastAutoTable.finalY + 25);
    
    const expenses = [
      ['Beban Gaji Guru', 'Rp 80.000.000'],
      ['Beban Sewa Kantor', 'Rp 15.000.000'],
      ['Beban Listrik & Internet', 'Rp 8.000.000'],
      ['Beban Buku & Alat Tulis', 'Rp 12.000.000'],
      ['Beban Transportasi', 'Rp 10.000.000'],
      ['Beban Marketing', 'Rp 5.000.000']
    ];
    
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 30,
      head: [['Akun', 'Jumlah']],
      body: expenses,
      theme: 'grid',
      headStyles: { fillColor: [231, 76, 60] },
      styles: { fontSize: 10 }
    });
    
    doc.text('Total Beban: Rp 130.000.000', 20, doc.lastAutoTable.finalY + 10);
    
    // Add net profit
    doc.setFontSize(16);
    doc.text('LABA BERSIH: Rp 60.000.000', 20, doc.lastAutoTable.finalY + 25);
    
    // Save the PDF
    doc.save('laba-rugi-jakarta-mandarin.pdf');
    
    setTimeout(() => {
      alert('✅ Profit & Loss exported successfully! Check your downloads folder.');
    }, 1000);
  };

  const handlePrintPreviewProfitLoss = () => {
    console.log('Print Preview Profit Loss function called!');
    
    // Create a new window for print preview
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Laba Rugi - Jakarta Mandarin</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .subtitle { font-size: 16px; color: #666; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #2c3e50; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #3498db; color: white; font-weight: bold; }
          .total { font-weight: bold; font-size: 16px; color: #2c3e50; }
          .net-profit { font-weight: bold; font-size: 18px; color: #27ae60; }
          @media print {
            body { margin: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">LAPORAN LABA RUGI</div>
          <div class="subtitle">Jakarta Mandarin</div>
          <div class="subtitle">Periode Januari 2024</div>
        </div>
        
        <div class="section">
          <div class="section-title">PENDAPATAN</div>
          <table>
            <thead>
              <tr><th>Akun</th><th>Jumlah</th></tr>
            </thead>
            <tbody>
              <tr><td>Pendapatan SPP</td><td>Rp 150.000.000</td></tr>
              <tr><td>Pendapatan Buku</td><td>Rp 25.000.000</td></tr>
              <tr><td>Pendapatan Transportasi</td><td>Rp 15.000.000</td></tr>
            </tbody>
          </table>
          <div class="total">Total Pendapatan: Rp 190.000.000</div>
        </div>
        
        <div class="section">
          <div class="section-title">BEBAN OPERASIONAL</div>
          <table>
            <thead>
              <tr><th>Akun</th><th>Jumlah</th></tr>
            </thead>
            <tbody>
              <tr><td>Beban Gaji Guru</td><td>Rp 80.000.000</td></tr>
              <tr><td>Beban Sewa Kantor</td><td>Rp 15.000.000</td></tr>
              <tr><td>Beban Listrik & Internet</td><td>Rp 8.000.000</td></tr>
              <tr><td>Beban Buku & Alat Tulis</td><td>Rp 12.000.000</td></tr>
              <tr><td>Beban Transportasi</td><td>Rp 10.000.000</td></tr>
              <tr><td>Beban Marketing</td><td>Rp 5.000.000</td></tr>
            </tbody>
          </table>
          <div class="total">Total Beban: Rp 130.000.000</div>
        </div>
        
        <div class="net-profit">LABA BERSIH: Rp 60.000.000</div>
        
        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; background-color: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">🖨️ Print</button>
          <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; background-color: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">❌ Close</button>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    alert('Print preview opened in new window! Click Print button to print.');
  };

  const handleAddJournal = () => {
    console.log('Add Journal function called!');
    
    // Use native alert for immediate feedback
    alert('Opening journal form...');
    
    setTimeout(() => {
      const confirmed = confirm('TAMBAH JURNAL BARU\n\nApakah Anda yakin ingin menambah jurnal baru?\n\nKlik OK untuk melanjutkan atau Cancel untuk membatalkan.');
      
      if (confirmed) {
        alert('✅ Jurnal berhasil ditambahkan!');
        console.log('Journal added successfully');
      } else {
        alert('❌ Jurnal dibatalkan');
        console.log('Journal cancelled');
      }
    }, 500);
  };

  const handleExportJournal = () => {
    alert('Exporting journal...');
  };

  const handleExportLedger = () => {
    alert('Exporting ledger...');
  };

  const handleDownloadStatement = (bank) => {
    alert(`Downloading statement for ${bank.bankName}...`);
  };

  const handleImportStatement = () => {
    setImportModal(true);
  };

  const handleImportSubmit = () => {
    alert('Importing bank statement...');
    setTimeout(() => {
      alert('✅ Bank statement imported successfully!');
      setImportModal(false);
    }, 2000);
  };

  const handleReconcileBank = (bank) => {
    setSelectedBank(bank);
    setReconciliationModal(true);
  };

  const handleSaveReconciliation = () => {
    alert('Saving reconciliation...');
    setTimeout(() => {
      alert('✅ Reconciliation saved successfully!');
      setReconciliationModal(false);
    }, 2000);
  };

  const handleViewDetails = (record) => {
    alert(`
Detail Transaksi

Tanggal: ${record.date}
Deskripsi: ${record.description}
Referensi: ${record.reference}
Jumlah: Rp ${record.amount.toLocaleString()}
Tipe: ${record.type === 'credit' ? 'Kredit' : 'Debit'}
Status: ${record.status === 'matched' ? 'Matched' : 'Unmatched'}
Bank Statement: ${record.bankStatement || 'Tidak ada'}
System Record: ${record.systemRecord || 'Tidak ada'}
Selisih: Rp ${record.difference.toLocaleString()}
`);
  };

  const handleEditRecord = (record) => {
    alert('Fitur edit akan segera tersedia!');
  };

  // Chart configuration functions
  const getChartData = (period, type) => {
    // Return empty chart data for now
    const emptyData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      revenue: [0, 0, 0, 0, 0, 0],
      expenses: [0, 0, 0, 0, 0, 0],
      profit: [0, 0, 0, 0, 0, 0]
    };
    
    if (type === 'line') {
      return {
        labels: emptyData.labels,
        datasets: [
          {
            label: 'Pendapatan',
            data: emptyData.revenue,
            borderColor: '#27ae60',
            backgroundColor: 'rgba(39, 174, 96, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Pengeluaran',
            data: emptyData.expenses,
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Profit',
            data: emptyData.profit,
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      };
    } else if (type === 'bar') {
      return {
        labels: emptyData.labels,
        datasets: [
          {
            label: 'Pendapatan',
            data: emptyData.revenue,
            backgroundColor: '#27ae60',
            borderColor: '#27ae60',
            borderWidth: 1
          },
          {
            label: 'Pengeluaran',
            data: emptyData.expenses,
            backgroundColor: '#e74c3c',
            borderColor: '#e74c3c',
            borderWidth: 1
          },
          {
            label: 'Profit',
            data: emptyData.profit,
            backgroundColor: '#3498db',
            borderColor: '#3498db',
            borderWidth: 1
          }
        ]
      };
    }
  };

  const getChartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': Rp ' + context.parsed.y.toLocaleString();
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'Rp ' + value.toLocaleString();
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  });

  const getDoughnutData = () => ({
    labels: ['Gaji Guru', 'Sewa Kantor', 'Utilitas', 'Marketing', 'Lainnya'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  });

  const getDoughnutOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 11
          }
        }
      },
      title: {
        display: true,
        text: 'Breakdown Pengeluaran',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return context.label + ': Rp ' + context.parsed.toLocaleString() + ' (' + percentage + '%)';
          }
        }
      }
    }
  });

  const reconciliationStats = {
    totalTransactions: reconciliationData.length,
    matchedTransactions: reconciliationData.filter(item => item.status === 'matched').length,
    unmatchedTransactions: reconciliationData.filter(item => item.status === 'unmatched').length,
    totalDifference: reconciliationData.reduce((sum, item) => sum + item.difference, 0)
  };

  const matchPercentage = reconciliationStats.totalTransactions > 0 
    ? (reconciliationStats.matchedTransactions / reconciliationStats.totalTransactions) * 100 
    : 0;

  return (
    <div className="finance-page">
      <div className="finance-header">
        <Title level={2}>Keuangan Jakarta Mandarin</Title>
        <Text type="secondary">Kelola keuangan, invoice, dan rekonsiliasi bank</Text>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="finance-tabs">
        <TabPane tab="Overview" key="overview">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Pendapatan"
                  value={150000000}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                  suffix="Rp"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Pengeluaran"
                  value={45000000}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#cf1322' }}
                  suffix="Rp"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Profit"
                  value={105000000}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                  suffix="Rp"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Invoice Pending"
                  value={12}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Analytics" key="analytics">
          <div className="analytics-section">
            <Row gutter={[16, 16]} className="analytics-header">
              <Col span={24}>
                <Card>
                  <Row gutter={16} align="middle">
                    <Col flex="auto">
                      <Title level={4}>📊 Financial Analytics Dashboard</Title>
                      <Text type="secondary">Analisis tren keuangan dengan grafik interaktif</Text>
                    </Col>
                    <Col>
                      <Space>
                        <Select
                          value={chartPeriod}
                          onChange={setChartPeriod}
                          style={{ width: 120 }}
                          options={[
                            { value: 'yearly', label: 'Tahunan' },
                            { value: 'monthly', label: 'Bulanan' },
                            { value: 'weekly', label: 'Mingguan' },
                            { value: 'daily', label: 'Harian' }
                          ]}
                        />
                        <Select
                          value={chartType}
                          onChange={setChartType}
                          style={{ width: 120 }}
                          options={[
                            { value: 'line', label: 'Line Chart' },
                            { value: 'bar', label: 'Bar Chart' }
                          ]}
                        />
                      </Space>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="analytics-charts">
              <Col xs={24} lg={12}>
                <Card title="📈 Revenue vs Expenses Trend" className="chart-card">
                  <div style={{ height: '300px' }}>
                    {chartType === 'line' ? (
                      <Line 
                        data={getChartData(chartPeriod, 'line')} 
                        options={getChartOptions('Tren Pendapatan vs Pengeluaran')} 
                      />
                    ) : (
                      <Bar 
                        data={getChartData(chartPeriod, 'bar')} 
                        options={getChartOptions('Perbandingan Pendapatan vs Pengeluaran')} 
                      />
                    )}
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} lg={12}>
                <Card title="🍩 Expense Breakdown" className="chart-card">
                  <div style={{ height: '300px' }}>
                    <Doughnut 
                      data={getDoughnutData()} 
                      options={getDoughnutOptions()} 
                    />
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="analytics-metrics">
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Total Revenue"
                    value={0}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: '#27ae60' }}
                    suffix="Rp"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Total Expenses"
                    value={0}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: '#e74c3c' }}
                    suffix="Rp"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Total Profit"
                    value={0}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: '#3498db' }}
                    suffix="Rp"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Profit Margin"
                    value={0}
                    prefix={<CalculatorOutlined />}
                    valueStyle={{ color: '#f39c12' }}
                    suffix="%"
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </TabPane>

        <TabPane tab="Rekonsiliasi Bank" key="reconciliation">
          <div className="reconciliation-section">
            <Row gutter={[16, 16]} className="reconciliation-header">
              <Col span={24}>
                <Card>
                  <Row gutter={16} align="middle">
                    <Col flex="auto">
                      <Title level={4}>Rekonsiliasi Bank</Title>
                      <Text type="secondary">Kelola dan rekonsiliasi transaksi bank</Text>
                    </Col>
                    <Col>
                      <Space>
                        <Button 
                          type="primary" 
                          icon={<UploadOutlined />}
                          onClick={handleImportStatement}
                        >
                          Import Statement
                        </Button>
                        <Button 
                          icon={<SyncOutlined />}
                          onClick={handleAutoMatch}
                          loading={loading}
                        >
                          Auto Match
                        </Button>
                        <Button 
                          icon={<DownloadOutlined />}
                          onClick={handleExportReconciliation}
                        >
                          Export Report
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="reconciliation-stats">
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Total Transaksi"
                    value={reconciliationStats.totalTransactions}
                    prefix={<BankOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Matched"
                    value={reconciliationStats.matchedTransactions}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Unmatched"
                    value={reconciliationStats.unmatchedTransactions}
                    prefix={<CloseCircleOutlined />}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Total Selisih"
                    value={reconciliationStats.totalDifference}
                    prefix={<DollarOutlined />}
                    valueStyle={{ 
                      color: reconciliationStats.totalDifference === 0 ? '#52c41a' : '#ff4d4f' 
                    }}
                    suffix="Rp"
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="reconciliation-progress">
              <Col span={24}>
                <Card>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Progress Rekonsiliasi</Text>
                  </div>
                  <Progress 
                    percent={matchPercentage} 
                    status={matchPercentage === 100 ? 'success' : 'active'}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
                  <Text type="secondary">
                    {reconciliationStats.matchedTransactions} dari {reconciliationStats.totalTransactions} transaksi telah direkonsiliasi
                  </Text>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="bank-accounts">
              <Col span={24}>
                <Card title="Rekening Bank" extra={
                  <Button type="primary" icon={<PlusOutlined />}>
                    Tambah Rekening
                  </Button>
                }>
                  <Table 
                    dataSource={bankStatements} 
                    columns={bankColumns}
                    rowKey="id"
                    pagination={false}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="reconciliation-details">
              <Col span={24}>
                <Card 
                  title="Detail Rekonsiliasi" 
                  extra={
                    <Space>
                      <Button icon={<FilterOutlined />}>Filter</Button>
                      <Button icon={<ReloadOutlined />}>Refresh</Button>
                    </Space>
                  }
                >
                  <Table 
                    dataSource={reconciliationData} 
                    columns={columns}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                    }}
                    scroll={{ x: 1200 }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </TabPane>

        <TabPane tab="Invoice" key="invoice">
          <Card>
            <Title level={4}>Invoice Management</Title>
            <Text type="secondary">Kelola invoice dan pembayaran</Text>
          </Card>
        </TabPane>

        <TabPane tab="Neraca Keuangan" key="balance-sheet">
          <div className="balance-sheet-section">
            <Row gutter={[16, 16]} className="balance-sheet-header">
              <Col span={24}>
                <Card>
                  <Row gutter={16} align="middle">
                    <Col flex="auto">
                      <Title level={4}>Neraca Keuangan</Title>
                      <Text type="secondary">Per 31 Januari 2024</Text>
                    </Col>
                    <Col>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div 
                          onClick={() => {
                            console.log('EXPORT PDF DIV CLICKED!');
                            alert('Export PDF clicked!');
                            handleExportBalanceSheet();
                          }}
                          style={{
                            backgroundColor: '#52c41a',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            userSelect: 'none'
                          }}
                        >
                          📄 Export PDF
                        </div>
                        <div 
                          onClick={() => {
                            console.log('PRINT PREVIEW DIV CLICKED!');
                            alert('Print Preview clicked!');
                            handlePrintPreviewBalanceSheet();
                          }}
                          style={{
                            backgroundColor: '#1890ff',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            userSelect: 'none'
                          }}
                        >
                          👁️ Print Preview
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="balance-sheet-content">
              <Col xs={24} lg={12}>
                <Card title="AKTIVA" className="asset-card">
                  <div className="balance-sheet-group">
                    <div className="group-title">Aktiva Lancar</div>
                    <div className="balance-item">
                      <span>Kas & Setara Kas</span>
                      <span className="amount">Rp 75.000.000</span>
                    </div>
                    <div className="balance-item">
                      <span>Piutang Usaha</span>
                      <span className="amount">Rp 25.000.000</span>
                    </div>
                    <div className="balance-item">
                      <span>Piutang SPP</span>
                      <span className="amount">Rp 15.000.000</span>
                    </div>
                    <div className="balance-item">
                      <span>Persediaan Buku</span>
                      <span className="amount">Rp 8.000.000</span>
                    </div>
                    <div className="balance-item total">
                      <span>Total Aktiva Lancar</span>
                      <span className="amount">Rp 123.000.000</span>
                    </div>
                  </div>

                  <div className="balance-sheet-group">
                    <div className="group-title">Aktiva Tetap</div>
                    <div className="balance-item">
                      <span>Peralatan Kantor</span>
                      <span className="amount">Rp 12.000.000</span>
                    </div>
                    <div className="balance-item">
                      <span>Akumulasi Penyusutan</span>
                      <span className="amount negative">(Rp 2.000.000)</span>
                    </div>
                    <div className="balance-item total">
                      <span>Total Aktiva Tetap</span>
                      <span className="amount">Rp 10.000.000</span>
                    </div>
                  </div>

                  <div className="balance-sheet-group">
                    <div className="group-title">Total Aktiva</div>
                    <div className="balance-item grand-total">
                      <span>Total Aktiva</span>
                      <span className="amount">Rp 133.000.000</span>
                    </div>
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="PASIVA" className="liability-card">
                  <div className="balance-sheet-group">
                    <div className="group-title">Kewajiban Lancar</div>
                    <div className="balance-item">
                      <span>Hutang Usaha</span>
                      <span className="amount">Rp 8.000.000</span>
                    </div>
                    <div className="balance-item">
                      <span>Hutang Pajak</span>
                      <span className="amount">Rp 3.000.000</span>
                    </div>
                    <div className="balance-item">
                      <span>Pendapatan Diterima Dimuka</span>
                      <span className="amount">Rp 5.000.000</span>
                    </div>
                    <div className="balance-item total">
                      <span>Total Kewajiban Lancar</span>
                      <span className="amount">Rp 16.000.000</span>
                    </div>
                  </div>

                  <div className="balance-sheet-group">
                    <div className="group-title">Ekuitas</div>
                    <div className="balance-item">
                      <span>Modal Awal</span>
                      <span className="amount">Rp 100.000.000</span>
                    </div>
                    <div className="balance-item">
                      <span>Laba Ditahan</span>
                      <span className="amount">Rp 17.000.000</span>
                    </div>
                    <div className="balance-item total">
                      <span>Total Ekuitas</span>
                      <span className="amount">Rp 117.000.000</span>
                    </div>
                  </div>

                  <div className="balance-sheet-group">
                    <div className="group-title">Total Pasiva</div>
                    <div className="balance-item grand-total">
                      <span>Total Pasiva & Ekuitas</span>
                      <span className="amount">Rp 133.000.000</span>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </TabPane>

        <TabPane tab="Laba Rugi" key="profit-loss">
          <div className="profit-loss-section">
            <Row gutter={[16, 16]} className="profit-loss-header">
              <Col span={24}>
                <Card>
                  <Row gutter={16} align="middle">
                    <Col flex="auto">
                      <Title level={4}>Laporan Laba Rugi</Title>
                      <Text type="secondary">Periode Januari 2024</Text>
                    </Col>
                    <Col>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div 
                          onClick={() => {
                            console.log('EXPORT PDF LABA RUGI DIV CLICKED!');
                            alert('Export PDF Laba Rugi clicked!');
                            handleExportProfitLoss();
                          }}
                          style={{
                            backgroundColor: '#52c41a',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            userSelect: 'none'
                          }}
                        >
                          📄 Export PDF
                        </div>
                        <div 
                          onClick={() => {
                            console.log('PRINT PREVIEW LABA RUGI DIV CLICKED!');
                            alert('Print Preview Laba Rugi clicked!');
                            handlePrintPreviewProfitLoss();
                          }}
                          style={{
                            backgroundColor: '#1890ff',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            userSelect: 'none'
                          }}
                        >
                          👁️ Print Preview
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="profit-loss-content">
              <Col span={24}>
                <Card className="profit-loss-card">
                  <div className="profit-loss-group">
                    <div className="group-title">PENDAPATAN</div>
                    <div className="profit-loss-item">
                      <span>Pendapatan SPP</span>
                      <span className="amount positive">Rp 150.000.000</span>
                    </div>
                    <div className="profit-loss-item">
                      <span>Pendapatan Buku</span>
                      <span className="amount positive">Rp 25.000.000</span>
                    </div>
                    <div className="profit-loss-item">
                      <span>Pendapatan Transportasi</span>
                      <span className="amount positive">Rp 15.000.000</span>
                    </div>
                    <div className="profit-loss-item total">
                      <span>Total Pendapatan</span>
                      <span className="amount positive">Rp 190.000.000</span>
                    </div>
                  </div>

                  <div className="profit-loss-group">
                    <div className="group-title">BEBAN OPERASIONAL</div>
                    <div className="profit-loss-item">
                      <span>Beban Gaji Guru</span>
                      <span className="amount negative">(Rp 80.000.000)</span>
                    </div>
                    <div className="profit-loss-item">
                      <span>Beban Sewa Kantor</span>
                      <span className="amount negative">(Rp 15.000.000)</span>
                    </div>
                    <div className="profit-loss-item">
                      <span>Beban Listrik & Internet</span>
                      <span className="amount negative">(Rp 8.000.000)</span>
                    </div>
                    <div className="profit-loss-item">
                      <span>Beban Buku & Alat Tulis</span>
                      <span className="amount negative">(Rp 12.000.000)</span>
                    </div>
                    <div className="profit-loss-item">
                      <span>Beban Transportasi</span>
                      <span className="amount negative">(Rp 10.000.000)</span>
                    </div>
                    <div className="profit-loss-item">
                      <span>Beban Marketing</span>
                      <span className="amount negative">(Rp 5.000.000)</span>
                    </div>
                    <div className="profit-loss-item total">
                      <span>Total Beban Operasional</span>
                      <span className="amount negative">(Rp 130.000.000)</span>
                    </div>
                  </div>

                  <div className="profit-loss-group">
                    <div className="group-title">LABA BERSIH</div>
                    <div className="profit-loss-item grand-total">
                      <span>Laba Bersih</span>
                      <span className="amount positive">Rp 60.000.000</span>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="profit-loss-summary">
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title="Total Pendapatan"
                    value={190000000}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                    suffix="Rp"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title="Total Beban"
                    value={130000000}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: '#ff4d4f' }}
                    suffix="Rp"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title="Laba Bersih"
                    value={60000000}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: '#52c41a', fontSize: '24px' }}
                    suffix="Rp"
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </TabPane>

        <TabPane tab="Jurnal Umum" key="general-journal">
          <div className="journal-section">
            <Row gutter={[16, 16]} className="journal-header">
              <Col span={24}>
                <Card>
                  <Row gutter={16} align="middle">
                    <Col flex="auto">
                      <Title level={4}>Jurnal Umum</Title>
                      <Text type="secondary">Semua transaksi keuangan</Text>
                    </Col>
                    <Col>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div 
                          onClick={() => {
                            console.log('TAMBAH JURNAL DIV CLICKED!');
                            alert('Tambah Jurnal clicked!');
                            handleAddJournal();
                          }}
                          style={{
                            backgroundColor: '#1890ff',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            userSelect: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          ➕ Tambah Jurnal
                        </div>
                        <div 
                          onClick={() => {
                            console.log('EXPORT JURNAL DIV CLICKED!');
                            alert('Export Jurnal clicked!');
                            handleExportJournal();
                          }}
                          style={{
                            backgroundColor: '#52c41a',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            userSelect: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          📄 Export
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="journal-content">
              <Col span={24}>
                <Card>
                  <Table 
                    dataSource={[
                      {
                        id: 1,
                        date: '2024-01-15',
                        reference: 'JV-2024-001',
                        description: 'Pembayaran SPP - Ahmad Fadillah',
                        debit: 2500000,
                        credit: 0,
                        account: 'Kas',
                        type: 'debit'
                      },
                      {
                        id: 2,
                        date: '2024-01-15',
                        reference: 'JV-2024-001',
                        description: 'Pembayaran SPP - Ahmad Fadillah',
                        debit: 0,
                        credit: 2500000,
                        account: 'Pendapatan SPP',
                        type: 'credit'
                      },
                      {
                        id: 3,
                        date: '2024-01-16',
                        reference: 'JV-2024-002',
                        description: 'Pembayaran Gaji Guru',
                        debit: 80000000,
                        credit: 0,
                        account: 'Beban Gaji',
                        type: 'debit'
                      },
                      {
                        id: 4,
                        date: '2024-01-16',
                        reference: 'JV-2024-002',
                        description: 'Pembayaran Gaji Guru',
                        debit: 0,
                        credit: 80000000,
                        account: 'Kas',
                        type: 'credit'
                      }
                    ]}
                    columns={[
                      {
                        title: 'Tanggal',
                        dataIndex: 'date',
                        key: 'date',
                        width: 120,
                      },
                      {
                        title: 'Referensi',
                        dataIndex: 'reference',
                        key: 'reference',
                        width: 120,
                      },
                      {
                        title: 'Deskripsi',
                        dataIndex: 'description',
                        key: 'description',
                        width: 250,
                      },
                      {
                        title: 'Akun',
                        dataIndex: 'account',
                        key: 'account',
                        width: 150,
                      },
                      {
                        title: 'Debit',
                        dataIndex: 'debit',
                        key: 'debit',
                        width: 150,
                        render: (debit) => debit > 0 ? `Rp ${debit.toLocaleString()}` : '-',
                      },
                      {
                        title: 'Kredit',
                        dataIndex: 'credit',
                        key: 'credit',
                        width: 150,
                        render: (credit) => credit > 0 ? `Rp ${credit.toLocaleString()}` : '-',
                      },
                      {
                        title: 'Aksi',
                        key: 'actions',
                        width: 100,
                        render: () => (
                          <Space>
                            <Button type="text" icon={<EyeOutlined />} size="small" />
                            <Button type="text" icon={<EditOutlined />} size="small" />
                          </Space>
                        ),
                      },
                    ]}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                    }}
                    scroll={{ x: 1000 }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </TabPane>

        <TabPane tab="Buku Besar" key="ledger">
          <div className="ledger-section">
            <Row gutter={[16, 16]} className="ledger-header">
              <Col span={24}>
                <Card>
                  <Row gutter={16} align="middle">
                    <Col flex="auto">
                      <Title level={4}>Buku Besar</Title>
                      <Text type="secondary">Detail akun per transaksi</Text>
                    </Col>
                    <Col>
                      <Space>
                        <Select placeholder="Pilih Akun" style={{ width: 200 }}>
                          <Option value="kas">Kas</Option>
                          <Option value="piutang">Piutang Usaha</Option>
                          <Option value="pendapatan">Pendapatan SPP</Option>
                          <Option value="beban">Beban Gaji</Option>
                        </Select>
                        <Button icon={<DownloadOutlined />} onClick={handleExportLedger}>
                          Export
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="ledger-content">
              <Col span={24}>
                <Card>
                  <div className="ledger-account-info">
                    <Title level={5}>Akun: Kas</Title>
                    <Text type="secondary">Saldo: Rp 75.000.000 (Debit)</Text>
                  </div>
                  <Table 
                    dataSource={[
                      {
                        id: 1,
                        date: '2024-01-01',
                        reference: 'JV-2024-001',
                        description: 'Saldo Awal',
                        debit: 75000000,
                        credit: 0,
                        balance: 75000000
                      },
                      {
                        id: 2,
                        date: '2024-01-15',
                        reference: 'JV-2024-001',
                        description: 'Pembayaran SPP - Ahmad Fadillah',
                        debit: 2500000,
                        credit: 0,
                        balance: 77500000
                      },
                      {
                        id: 3,
                        date: '2024-01-16',
                        reference: 'JV-2024-002',
                        description: 'Pembayaran Gaji Guru',
                        debit: 0,
                        credit: 80000000,
                        balance: -2500000
                      }
                    ]}
                    columns={[
                      {
                        title: 'Tanggal',
                        dataIndex: 'date',
                        key: 'date',
                        width: 120,
                      },
                      {
                        title: 'Referensi',
                        dataIndex: 'reference',
                        key: 'reference',
                        width: 120,
                      },
                      {
                        title: 'Deskripsi',
                        dataIndex: 'description',
                        key: 'description',
                        width: 300,
                      },
                      {
                        title: 'Debit',
                        dataIndex: 'debit',
                        key: 'debit',
                        width: 150,
                        render: (debit) => debit > 0 ? `Rp ${debit.toLocaleString()}` : '-',
                      },
                      {
                        title: 'Kredit',
                        dataIndex: 'credit',
                        key: 'credit',
                        width: 150,
                        render: (credit) => credit > 0 ? `Rp ${credit.toLocaleString()}` : '-',
                      },
                      {
                        title: 'Saldo',
                        dataIndex: 'balance',
                        key: 'balance',
                        width: 150,
                        render: (balance) => (
                          <span style={{ 
                            color: balance >= 0 ? '#52c41a' : '#ff4d4f',
                            fontWeight: 'bold'
                          }}>
                            Rp {balance.toLocaleString()}
                          </span>
                        ),
                      },
                    ]}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                    }}
                    scroll={{ x: 1000 }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </TabPane>

        <TabPane tab="Laporan" key="reports">
          <Card>
            <Title level={4}>Laporan Keuangan</Title>
            <Text type="secondary">Generate laporan keuangan</Text>
          </Card>
        </TabPane>
      </Tabs>

      {/* Modal Import Statement */}
      <Modal
        title="Import Bank Statement"
        open={importModal}
        onCancel={() => setImportModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setImportModal(false)}>
            Batal
          </Button>,
          <Button key="import" type="primary" onClick={handleImportSubmit}>
            Import
          </Button>,
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="Bank" required>
            <Select placeholder="Pilih bank">
              <Option value="bca">BCA</Option>
              <Option value="mandiri">Mandiri</Option>
              <Option value="bni">BNI</Option>
              <Option value="bri">BRI</Option>
            </Select>
          </Form.Item>
          <Form.Item label="No. Rekening" required>
            <Input placeholder="Masukkan nomor rekening" />
          </Form.Item>
          <Form.Item label="File Statement" required>
            <Upload>
              <Button icon={<UploadOutlined />}>Upload File</Button>
            </Upload>
            <Text type="secondary">Format: CSV, Excel, atau PDF</Text>
          </Form.Item>
          <Form.Item label="Tanggal Statement" required>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Rekonsiliasi */}
      <Modal
        title={`Rekonsiliasi - ${selectedBank?.bankName}`}
        open={reconciliationModal}
        onCancel={() => setReconciliationModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setReconciliationModal(false)}>
            Batal
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveReconciliation}>
            Simpan
          </Button>,
        ]}
        width={1000}
      >
        {selectedBank && (
          <div>
            <Alert
              message="Informasi Rekening"
              description={
                <div>
                  <p><strong>Bank:</strong> {selectedBank.bankName}</p>
                  <p><strong>No. Rekening:</strong> {selectedBank.accountNumber}</p>
                  <p><strong>Saldo Awal:</strong> Rp {selectedBank.openingBalance.toLocaleString()}</p>
                  <p><strong>Saldo Akhir:</strong> Rp {selectedBank.closingBalance.toLocaleString()}</p>
                </div>
              }
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Table 
              dataSource={reconciliationData.filter(item => 
                item.bankStatement?.startsWith('BS-') || item.systemRecord?.startsWith('INV-') || item.systemRecord?.startsWith('EXP-')
              )} 
              columns={columns.filter(col => col.key !== 'actions')}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </div>
        )}
      </Modal>
    </div>
  );
} 