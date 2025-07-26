import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async getAllInvoices() {
    try {
      // Since we don't have invoice table yet, return mock data
      console.log('Returning mock invoices data');
      return [
        {
          id: 1,
          invoiceNumber: 'INV-2024-001',
          studentId: 1,
          studentName: 'Sarah Chen',
          studentAvatar: 'SC',
          amount: 2500000,
          status: 'paid',
          dueDate: '2024-01-31',
          paidDate: '2024-01-25',
          paymentMethod: 'Bank Transfer',
          description: 'Paket Mandarin Basic 10 Sesi',
          items: [
            { name: 'Mandarin Basic Course', quantity: 1, price: 2500000 }
          ],
          paymentLink: 'https://app.midtrans.com/snap/v2/vtweb/abc123',
          createdAt: '2024-01-15',
          updatedAt: '2024-01-25'
        },
        {
          id: 2,
          invoiceNumber: 'INV-2024-002',
          studentId: 2,
          studentName: 'Budi Santoso',
          studentAvatar: 'BS',
          amount: 3000000,
          status: 'pending',
          dueDate: '2024-02-15',
          paidDate: null,
          paymentMethod: null,
          description: 'Paket Mandarin Intermediate 12 Sesi',
          items: [
            { name: 'Mandarin Intermediate Course', quantity: 1, price: 3000000 }
          ],
          paymentLink: 'https://app.midtrans.com/snap/v2/vtweb/def456',
          createdAt: '2024-01-20',
          updatedAt: '2024-01-20'
        },
        {
          id: 3,
          invoiceNumber: 'INV-2024-003',
          studentId: 3,
          studentName: 'Lisa Wang',
          studentAvatar: 'LW',
          amount: 1800000,
          status: 'overdue',
          dueDate: '2024-01-10',
          paidDate: null,
          paymentMethod: null,
          description: 'Paket Mandarin Basic 8 Sesi',
          items: [
            { name: 'Mandarin Basic Course', quantity: 1, price: 1800000 }
          ],
          paymentLink: 'https://app.midtrans.com/snap/v2/vtweb/ghi789',
          createdAt: '2024-01-05',
          updatedAt: '2024-01-05'
        },
        {
          id: 4,
          invoiceNumber: 'INV-2024-004',
          studentId: 1,
          studentName: 'Sarah Chen',
          studentAvatar: 'SC',
          amount: 1500000,
          status: 'paid',
          dueDate: '2024-02-28',
          paidDate: '2024-02-20',
          paymentMethod: 'Credit Card',
          description: 'Paket Mandarin Advanced 6 Sesi',
          items: [
            { name: 'Mandarin Advanced Course', quantity: 1, price: 1500000 }
          ],
          paymentLink: 'https://app.midtrans.com/snap/v2/vtweb/jkl012',
          createdAt: '2024-02-01',
          updatedAt: '2024-02-20'
        },
        {
          id: 5,
          invoiceNumber: 'INV-2024-005',
          studentId: 2,
          studentName: 'Budi Santoso',
          studentAvatar: 'BS',
          amount: 2000000,
          status: 'pending',
          dueDate: '2024-03-15',
          paidDate: null,
          paymentMethod: null,
          description: 'Paket Mandarin Conversation 8 Sesi',
          items: [
            { name: 'Mandarin Conversation Course', quantity: 1, price: 2000000 }
          ],
          paymentLink: 'https://app.midtrans.com/snap/v2/vtweb/mno345',
          createdAt: '2024-02-15',
          updatedAt: '2024-02-15'
        }
      ];
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
  }

  async getInvoiceStats() {
    try {
      // Mock invoice statistics
      return {
        totalInvoices: 5,
        totalAmount: 10800000,
        paidAmount: 4000000,
        pendingAmount: 5000000,
        overdueAmount: 1800000,
        paidCount: 2,
        pendingCount: 2,
        overdueCount: 1,
        thisMonthInvoices: 3,
        thisMonthRevenue: 4000000,
        lastMonthRevenue: 3000000
      };
    } catch (error) {
      console.error('Error fetching invoice stats:', error);
      return {
        totalInvoices: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        overdueAmount: 0,
        paidCount: 0,
        pendingCount: 0,
        overdueCount: 0,
        thisMonthInvoices: 0,
        thisMonthRevenue: 0,
        lastMonthRevenue: 0
      };
    }
  }

  async getInvoiceById(id: number) {
    try {
      const invoices = await this.getAllInvoices();
      return invoices.find(invoice => invoice.id === id);
    } catch (error) {
      console.error('Error fetching invoice by id:', error);
      return null;
    }
  }

  async createInvoice(createInvoiceDto: any) {
    try {
      // Mock create invoice
      const newInvoice = {
        id: Math.floor(Math.random() * 1000) + 1,
        invoiceNumber: `INV-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        studentId: createInvoiceDto.studentId,
        studentName: createInvoiceDto.studentName,
        studentAvatar: createInvoiceDto.studentAvatar,
        amount: createInvoiceDto.amount,
        status: 'pending',
        dueDate: createInvoiceDto.dueDate,
        paidDate: null,
        paymentMethod: null,
        description: createInvoiceDto.description,
        items: createInvoiceDto.items,
        paymentLink: null,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      return newInvoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  async updateInvoice(id: number, updateInvoiceDto: any) {
    try {
      // Mock update invoice
      const updatedInvoice = {
        id: id,
        invoiceNumber: updateInvoiceDto.invoiceNumber,
        studentId: updateInvoiceDto.studentId,
        studentName: updateInvoiceDto.studentName,
        studentAvatar: updateInvoiceDto.studentAvatar,
        amount: updateInvoiceDto.amount,
        status: updateInvoiceDto.status,
        dueDate: updateInvoiceDto.dueDate,
        paidDate: updateInvoiceDto.paidDate,
        paymentMethod: updateInvoiceDto.paymentMethod,
        description: updateInvoiceDto.description,
        items: updateInvoiceDto.items,
        paymentLink: updateInvoiceDto.paymentLink,
        createdAt: updateInvoiceDto.createdAt,
        updatedAt: new Date().toISOString().split('T')[0]
      };

      return updatedInvoice;
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  }

  async deleteInvoice(id: number) {
    try {
      // Mock delete invoice
      return { success: true, message: 'Invoice deleted successfully' };
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }

  async createPaymentLink(id: number) {
    try {
      // Mock Midtrans payment link generation
      const paymentLink = `https://app.midtrans.com/snap/v2/vtweb/${Math.random().toString(36).substring(2, 15)}`;
      
      return {
        success: true,
        paymentLink: paymentLink,
        message: 'Payment link generated successfully'
      };
    } catch (error) {
      console.error('Error creating payment link:', error);
      throw error;
    }
  }

  async getAllPayments() {
    try {
      // Mock payments data
      return [
        {
          id: 1,
          invoiceId: 1,
          invoiceNumber: 'INV-2024-001',
          amount: 2500000,
          paymentMethod: 'Bank Transfer',
          status: 'completed',
          transactionId: 'TXN-001',
          paymentDate: '2024-01-25',
          studentName: 'Sarah Chen',
          description: 'Paket Mandarin Basic 10 Sesi'
        },
        {
          id: 2,
          invoiceId: 4,
          invoiceNumber: 'INV-2024-004',
          amount: 1500000,
          paymentMethod: 'Credit Card',
          status: 'completed',
          transactionId: 'TXN-002',
          paymentDate: '2024-02-20',
          studentName: 'Sarah Chen',
          description: 'Paket Mandarin Advanced 6 Sesi'
        }
      ];
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  }

  async getPaymentStats() {
    try {
      // Mock payment statistics
      return {
        totalPayments: 2,
        totalAmount: 4000000,
        thisMonthPayments: 1,
        thisMonthAmount: 1500000,
        lastMonthPayments: 1,
        lastMonthAmount: 2500000,
        paymentMethods: {
          'Bank Transfer': 1,
          'Credit Card': 1
        }
      };
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      return {
        totalPayments: 0,
        totalAmount: 0,
        thisMonthPayments: 0,
        thisMonthAmount: 0,
        lastMonthPayments: 0,
        lastMonthAmount: 0,
        paymentMethods: {}
      };
    }
  }

  async getPaymentById(id: number) {
    try {
      const payments = await this.getAllPayments();
      return payments.find(payment => payment.id === id);
    } catch (error) {
      console.error('Error fetching payment by id:', error);
      return null;
    }
  }

  async createPayment(createPaymentDto: any) {
    try {
      // Mock create payment
      const newPayment = {
        id: Math.floor(Math.random() * 1000) + 1,
        invoiceId: createPaymentDto.invoiceId,
        invoiceNumber: createPaymentDto.invoiceNumber,
        amount: createPaymentDto.amount,
        paymentMethod: createPaymentDto.paymentMethod,
        status: 'completed',
        transactionId: `TXN-${Math.floor(Math.random() * 1000)}`,
        paymentDate: new Date().toISOString().split('T')[0],
        studentName: createPaymentDto.studentName,
        description: createPaymentDto.description
      };

      return newPayment;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  async updatePayment(id: number, updatePaymentDto: any) {
    try {
      // Mock update payment
      const updatedPayment = {
        id: id,
        invoiceId: updatePaymentDto.invoiceId,
        invoiceNumber: updatePaymentDto.invoiceNumber,
        amount: updatePaymentDto.amount,
        paymentMethod: updatePaymentDto.paymentMethod,
        status: updatePaymentDto.status,
        transactionId: updatePaymentDto.transactionId,
        paymentDate: updatePaymentDto.paymentDate,
        studentName: updatePaymentDto.studentName,
        description: updatePaymentDto.description
      };

      return updatedPayment;
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  }

  async getRevenueReport(query: any) {
    try {
      // Mock revenue report
      return {
        period: query.period || 'monthly',
        data: [
          { month: 'Jan 2024', revenue: 2500000, invoices: 2 },
          { month: 'Feb 2024', revenue: 1500000, invoices: 1 },
          { month: 'Mar 2024', revenue: 0, invoices: 0 }
        ],
        totalRevenue: 4000000,
        totalInvoices: 3,
        averageRevenue: 1333333.33
      };
    } catch (error) {
      console.error('Error generating revenue report:', error);
      throw error;
    }
  }

  async getOutstandingReport() {
    try {
      // Mock outstanding report
      const invoices = await this.getAllInvoices();
      const outstanding = invoices.filter(inv => inv.status === 'pending');
      
      return {
        totalOutstanding: outstanding.length,
        totalAmount: outstanding.reduce((sum, inv) => sum + inv.amount, 0),
        invoices: outstanding
      };
    } catch (error) {
      console.error('Error generating outstanding report:', error);
      throw error;
    }
  }

  async getOverdueReport() {
    try {
      // Mock overdue report
      const invoices = await this.getAllInvoices();
      const overdue = invoices.filter(inv => inv.status === 'overdue');
      
      return {
        totalOverdue: overdue.length,
        totalAmount: overdue.reduce((sum, inv) => sum + inv.amount, 0),
        invoices: overdue
      };
    } catch (error) {
      console.error('Error generating overdue report:', error);
      throw error;
    }
  }

  async handleMidtransWebhook(webhookData: any) {
    try {
      // Mock Midtrans webhook handling
      console.log('Received Midtrans webhook:', webhookData);
      
      return {
        success: true,
        message: 'Webhook processed successfully',
        orderId: webhookData.order_id,
        status: webhookData.transaction_status
      };
    } catch (error) {
      console.error('Error handling Midtrans webhook:', error);
      throw error;
    }
  }
} 