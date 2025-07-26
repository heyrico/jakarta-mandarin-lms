import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { FinanceService } from './finance.service';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('invoices')
  async getAllInvoices() {
    return this.financeService.getAllInvoices();
  }

  @Get('invoices/stats')
  async getInvoiceStats() {
    return this.financeService.getInvoiceStats();
  }

  @Get('invoices/:id')
  async getInvoiceById(@Param('id') id: string) {
    return this.financeService.getInvoiceById(parseInt(id));
  }

  @Post('invoices')
  async createInvoice(@Body() createInvoiceDto: any) {
    return this.financeService.createInvoice(createInvoiceDto);
  }

  @Put('invoices/:id')
  async updateInvoice(@Param('id') id: string, @Body() updateInvoiceDto: any) {
    return this.financeService.updateInvoice(parseInt(id), updateInvoiceDto);
  }

  @Delete('invoices/:id')
  async deleteInvoice(@Param('id') id: string) {
    return this.financeService.deleteInvoice(parseInt(id));
  }

  @Post('invoices/:id/payment-link')
  async createPaymentLink(@Param('id') id: string) {
    return this.financeService.createPaymentLink(parseInt(id));
  }

  @Get('payments')
  async getAllPayments() {
    return this.financeService.getAllPayments();
  }

  @Get('payments/stats')
  async getPaymentStats() {
    return this.financeService.getPaymentStats();
  }

  @Get('payments/:id')
  async getPaymentById(@Param('id') id: string) {
    return this.financeService.getPaymentById(parseInt(id));
  }

  @Post('payments')
  async createPayment(@Body() createPaymentDto: any) {
    return this.financeService.createPayment(createPaymentDto);
  }

  @Put('payments/:id')
  async updatePayment(@Param('id') id: string, @Body() updatePaymentDto: any) {
    return this.financeService.updatePayment(parseInt(id), updatePaymentDto);
  }

  @Get('reports/revenue')
  async getRevenueReport(@Query() query: any) {
    return this.financeService.getRevenueReport(query);
  }

  @Get('reports/outstanding')
  async getOutstandingReport() {
    return this.financeService.getOutstandingReport();
  }

  @Get('reports/overdue')
  async getOverdueReport() {
    return this.financeService.getOverdueReport();
  }

  @Post('webhook/midtrans')
  async handleMidtransWebhook(@Body() webhookData: any) {
    return this.financeService.handleMidtransWebhook(webhookData);
  }
} 