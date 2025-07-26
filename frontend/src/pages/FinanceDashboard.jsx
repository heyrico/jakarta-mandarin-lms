import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Modal, Form, Input, Select, DatePicker, message, Row, Col, Popconfirm, Tabs, Segmented, Checkbox } from 'antd';
import { PlusOutlined, DollarOutlined, FileTextOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

export default function FinanceDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [journals, setJournals] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [accountForm] = Form.useForm();

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [includePPN, setIncludePPN] = useState(false);

  // Fetch accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('http://localhost:3000/account');
        if (response.ok) {
          const data = await response.json();
          setAccounts(data);
        } else {
          setAccounts([]);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setAccounts([]);
      }
    };

    fetchAccounts();
  }, []);

  // Fetch journals
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await fetch('http://localhost:3000/journal');
        if (response.ok) {
          const data = await response.json();
          setJournals(data);
        } else {
          setJournals([]);
        }
      } catch (error) {
        console.error('Error fetching journals:', error);
        setJournals([]);
      }
    };

    fetchJournals();
  }, []);

  // Add Journal
  const handleAddJournal = async () => {
    const values = await form.validateFields();
    const entries = [
      { accountId: values.accountId, debit: parseFloat(values.debit || 0), credit: parseFloat(values.credit || 0) }
    ];
    if (includePPN) {
      // Cari akun PPN Keluaran
      const ppnAccount = accounts.find(a => a.name.toLowerCase().includes('ppn keluaran'));
      if (ppnAccount) {
        const ppnValue = Math.round((parseFloat(values.debit || 0) + parseFloat(values.credit || 0)) * 0.11);
        entries.push({
          accountId: ppnAccount.id,
          debit: 0,
          credit: ppnValue
        });
      }
    }
    await fetch('http://localhost:3000/journals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: values.date,
        description: values.description,
        entries: entries
      }),
    });
    message.success('Jurnal ditambah!');
    setModalOpen(false);
    fetchJournals();
  };

  // Tambah/Edit Akun
  const handleAccountOk = async () => {
    const values = await accountForm.validateFields();
    if (editingAccount) {
      await fetch(`http://localhost:3000/accounts/${editingAccount.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      message.success('Akun diupdate!');
    } else {
      await fetch('http://localhost:3000/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      message.success('Akun ditambah!');
    }
    setAccountModalOpen(false);
    setEditingAccount(null);
    fetchAccounts();
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    accountForm.setFieldsValue(account);
    setAccountModalOpen(true);
  };

  const handleDeleteAccount = async (id) => {
    await fetch(`http://localhost:3000/accounts/${id}`, { method: 'DELETE' });
    message.success('Akun dihapus!');
    fetchAccounts();
  };

  const accountColumns = [
    { title: 'Kode', dataIndex: 'code', key: 'code' },
    { title: 'Nama Akun', dataIndex: 'name', key: 'name' },
            { title: 'Tipe', dataIndex: 'type', key: 'type', render: t => <Tag color="purple">{t}</Tag> },
    { title: 'Saldo', dataIndex: 'balance', key: 'balance', render: v => <b>Rp {v.toLocaleString()}</b> },
    {
      title: 'Aksi',
      key: 'aksi',
      render: (_, account) => (
        <>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEditAccount(account)} style={{ marginRight: 8 }} />
          <Popconfirm title="Yakin hapus akun ini?" onConfirm={() => handleDeleteAccount(account.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  const journalColumns = [
    { title: 'Tanggal', dataIndex: 'date', key: 'date', render: d => new Date(d).toLocaleDateString() },
    { title: 'Deskripsi', dataIndex: 'description', key: 'description' },
    {
      title: 'Akun',
      key: 'akun',
      render: (_, j) => j.entries.map(e => <div key={e.id}>{e.Account?.name || e.accountId}</div>)
    },
    {
      title: 'Debit',
      key: 'debit',
      render: (_, j) => j.entries.map(e => <div key={e.id}>{e.debit ? `Rp ${e.debit.toLocaleString()}` : '-'}</div>)
    },
    {
      title: 'Kredit',
      key: 'kredit',
      render: (_, j) => j.entries.map(e => <div key={e.id}>{e.credit ? `Rp ${e.credit.toLocaleString()}` : '-'}</div>)
    },
  ];

  const totalAsset = accounts.filter(a => a.type === 'ASSET').reduce((a, b) => a + b.balance, 0);
  const totalLiability = accounts.filter(a => a.type === 'LIABILITY').reduce((a, b) => a + b.balance, 0);
  const totalEquity = accounts.filter(a => a.type === 'EQUITY').reduce((a, b) => a + b.balance, 0);
  const totalIncome = accounts.filter(a => a.type === 'INCOME').reduce((a, b) => a + b.balance, 0);
  const totalExpense = accounts.filter(a => a.type === 'EXPENSE').reduce((a, b) => a + b.balance, 0);
  const profit = totalIncome - totalExpense;

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px #0001' }}>
      <Segmented
        options={[
          { label: 'Dashboard', value: 'Dashboard' },
          { label: 'Neraca', value: 'Neraca' },
          { label: 'Laba Rugi', value: 'Laba Rugi' },
          { label: 'Laporan Pajak', value: 'Pajak' },
        ]}
        value={activeTab}
        onChange={setActiveTab}
        style={{ marginBottom: 32 }}
      />
      {activeTab === 'Dashboard' && (
        <>
          <h2 style={{ marginBottom: 24 }}>Finance Dashboard</h2>
          <Card bordered={false} style={{ borderRadius: 12, marginBottom: 32 }}>
            <DollarOutlined style={{ fontSize: 32, color: '#22c55e' }} />
            <div style={{ fontWeight: 700, fontSize: 22, marginTop: 8 }}>
              Rp {accounts.reduce((a, b) => a + b.balance, 0).toLocaleString()}
            </div>
            <div>Total Saldo Akun</div>
          </Card>
          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <h3>Daftar Akun</h3>
            </Col>
            <Col>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingAccount(null); accountForm.resetFields(); setAccountModalOpen(true); }}>
                Tambah Akun
              </Button>
            </Col>
          </Row>
          <Table columns={accountColumns} dataSource={accounts} rowKey="id" pagination={false} style={{ marginBottom: 32 }} />
          <Modal
            title={editingAccount ? 'Edit Akun' : 'Tambah Akun'}
            open={accountModalOpen}
            onOk={handleAccountOk}
            onCancel={() => { setAccountModalOpen(false); setEditingAccount(null); }}
            okText={editingAccount ? 'Update' : 'Tambah'}
          >
            <Form form={accountForm} layout="vertical">
              <Form.Item name="code" label="Kode Akun" rules={[{ required: true, message: 'Kode wajib diisi' }]}> <Input /> </Form.Item>
              <Form.Item name="name" label="Nama Akun" rules={[{ required: true, message: 'Nama wajib diisi' }]}> <Input /> </Form.Item>
              <Form.Item name="type" label="Tipe Akun" rules={[{ required: true, message: 'Tipe wajib diisi' }]}> <Select> <Select.Option value="ASSET">ASSET</Select.Option> <Select.Option value="LIABILITY">LIABILITY</Select.Option> <Select.Option value="EQUITY">EQUITY</Select.Option> <Select.Option value="INCOME">INCOME</Select.Option> <Select.Option value="EXPENSE">EXPENSE</Select.Option> </Select> </Form.Item>
              <Form.Item name="balance" label="Saldo Awal" rules={[{ required: true, message: 'Saldo wajib diisi' }]}> <Input type="number" /> </Form.Item>
            </Form>
          </Modal>
          <h3>Jurnal Umum</h3>
          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col></Col>
            <Col>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
                Tambah Jurnal
              </Button>
            </Col>
          </Row>
          <Table columns={journalColumns} dataSource={journals} rowKey="id" pagination={false} />
          <Modal
            title="Tambah Jurnal"
            open={modalOpen}
            onOk={handleAddJournal}
            onCancel={() => setModalOpen(false)}
            okText="Tambah"
          >
            <Form form={form} layout="vertical">
              <Form.Item name="date" label="Tanggal" rules={[{ required: true }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
              <Form.Item name="description" label="Deskripsi" rules={[{ required: true }]}> <Input /> </Form.Item>
              <Form.Item name="accountId" label="Akun" rules={[{ required: true }]}> <Select> {accounts.map(a => (<Select.Option key={a.id} value={a.id}>{a.code} - {a.name}</Select.Option>))} </Select> </Form.Item>
              <Form.Item name="debit" label="Debit"> <Input type="number" /> </Form.Item>
              <Form.Item name="credit" label="Kredit"> <Input type="number" /> </Form.Item>
              <Form.Item>
                <Checkbox checked={includePPN} onChange={e => setIncludePPN(e.target.checked)}>
                  Kena PPN 11%
                </Checkbox>
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
      {activeTab === 'Neraca' && (
        <div>
          <h2 style={{ marginBottom: 24 }}>Neraca (Balance Sheet)</h2>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center', background: '#e0f7fa' }}>
                <DollarOutlined style={{ fontSize: 32, color: '#22c55e' }} />
                <div style={{ fontWeight: 700, fontSize: 22, color: '#22c55e', marginTop: 8 }}>
                  Rp {totalAsset.toLocaleString()}
                </div>
                <div>Aset</div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center', background: '#fffbe7' }}>
                <FileTextOutlined style={{ fontSize: 32, color: '#f59e42' }} />
                <div style={{ fontWeight: 700, fontSize: 22, color: '#f59e42', marginTop: 8 }}>
                  Rp {totalLiability.toLocaleString()}
                </div>
                <div>Liabilitas</div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center', background: '#ede7f6' }}>
                <FileTextOutlined style={{ fontSize: 32, color: '#7c3aed' }} />
                <div style={{ fontWeight: 700, fontSize: 22, color: '#7c3aed', marginTop: 8 }}>
                  Rp {totalEquity.toLocaleString()}
                </div>
                <div>Ekuitas</div>
              </Card>
            </Col>
          </Row>
          <p style={{ marginTop: 32, color: '#888', textAlign: 'center' }}>
            <b>Aset = Liabilitas + Ekuitas</b>
          </p>
        </div>
      )}
      {activeTab === 'Laba Rugi' && (
        <div>
          <h2 style={{ marginBottom: 24 }}>Laba Rugi (Profit & Loss)</h2>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center', background: '#e0f7fa' }}>
                <DollarOutlined style={{ fontSize: 32, color: '#22c55e' }} />
                <div style={{ fontWeight: 700, fontSize: 22, color: '#22c55e', marginTop: 8 }}>
                  Rp {totalIncome.toLocaleString()}
                </div>
                <div>Pendapatan</div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center', background: '#fffbe7' }}>
                <FileTextOutlined style={{ fontSize: 32, color: '#f59e42' }} />
                <div style={{ fontWeight: 700, fontSize: 22, color: '#f59e42', marginTop: 8 }}>
                  Rp {totalExpense.toLocaleString()}
                </div>
                <div>Biaya</div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center', background: profit >= 0 ? '#e0f7fa' : '#ffebee' }}>
                <DollarOutlined style={{ fontSize: 32, color: profit >= 0 ? '#22c55e' : '#ef4444' }} />
                <div style={{ fontWeight: 700, fontSize: 22, color: profit >= 0 ? '#22c55e' : '#ef4444', marginTop: 8 }}>
                  Rp {profit.toLocaleString()}
                </div>
                <div>{profit >= 0 ? 'Laba' : 'Rugi'}</div>
              </Card>
            </Col>
          </Row>
        </div>
      )}
      {activeTab === 'Pajak' && (
        <div>
          <h2 style={{ marginBottom: 24 }}>Laporan Pajak (PPN Keluaran)</h2>
          <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center', background: '#fffbe7', marginBottom: 24 }}>
            <FileTextOutlined style={{ fontSize: 32, color: '#ef4444' }} />
            <div style={{ fontWeight: 700, fontSize: 22, color: '#ef4444', marginTop: 8 }}>
              Rp {accounts.filter(a => a.name.toLowerCase().includes('ppn keluaran')).reduce((a, b) => a + b.balance, 0).toLocaleString()}
            </div>
            <div>Total PPN Keluaran</div>
          </Card>
          <p style={{ color: '#888', textAlign: 'center' }}>
            Rekap transaksi kena PPN untuk pelaporan pajak.
          </p>
        </div>
      )}
    </div>
  );
}