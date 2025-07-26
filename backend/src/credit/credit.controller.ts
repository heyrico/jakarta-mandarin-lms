import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CreditService } from './credit.service';

@Controller('credit')
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  // Credit Packages
  @Get('packages')
  async getAllPackages() {
    return this.creditService.getAllPackages();
  }

  @Get('packages/stats')
  async getPackageStats() {
    return this.creditService.getPackageStats();
  }

  @Get('packages/:id')
  async getPackageById(@Param('id') id: string) {
    return this.creditService.getPackageById(parseInt(id));
  }

  @Post('packages')
  async createPackage(@Body() createPackageDto: any) {
    return this.creditService.createPackage(createPackageDto);
  }

  @Put('packages/:id')
  async updatePackage(@Param('id') id: string, @Body() updatePackageDto: any) {
    return this.creditService.updatePackage(parseInt(id), updatePackageDto);
  }

  @Delete('packages/:id')
  async deletePackage(@Param('id') id: string) {
    return this.creditService.deletePackage(parseInt(id));
  }

  // Student Credits
  @Get('student-credits')
  async getAllStudentCredits() {
    return this.creditService.getAllStudentCredits();
  }

  @Get('student-credits/stats')
  async getStudentCreditStats() {
    return this.creditService.getStudentCreditStats();
  }

  @Get('student-credits/:id')
  async getStudentCreditById(@Param('id') id: string) {
    return this.creditService.getStudentCreditById(parseInt(id));
  }

  @Get('student-credits/student/:studentId')
  async getStudentCreditsByStudent(@Param('studentId') studentId: string) {
    return this.creditService.getStudentCreditsByStudent(parseInt(studentId));
  }

  @Post('student-credits')
  async createStudentCredit(@Body() createStudentCreditDto: any) {
    return this.creditService.createStudentCredit(createStudentCreditDto);
  }

  @Put('student-credits/:id')
  async updateStudentCredit(@Param('id') id: string, @Body() updateStudentCreditDto: any) {
    return this.creditService.updateStudentCredit(parseInt(id), updateStudentCreditDto);
  }

  @Delete('student-credits/:id')
  async deleteStudentCredit(@Param('id') id: string) {
    return this.creditService.deleteStudentCredit(parseInt(id));
  }

  // Credit Transactions
  @Get('transactions')
  async getAllTransactions() {
    return this.creditService.getAllTransactions();
  }

  @Get('transactions/student/:studentId')
  async getTransactionsByStudent(@Param('studentId') studentId: string) {
    return this.creditService.getTransactionsByStudent(parseInt(studentId));
  }

  @Post('transactions')
  async createTransaction(@Body() createTransactionDto: any) {
    return this.creditService.createTransaction(createTransactionDto);
  }

  // Auto Deduction
  @Post('auto-deduction')
  async processAutoDeduction(@Body() deductionDto: any) {
    return this.creditService.processAutoDeduction(deductionDto);
  }

  @Get('auto-deduction/history')
  async getAutoDeductionHistory() {
    return this.creditService.getAutoDeductionHistory();
  }

  // Auto Billing
  @Post('auto-billing')
  async processAutoBilling(@Body() billingDto: any) {
    return this.creditService.processAutoBilling(billingDto);
  }

  @Get('auto-billing/history')
  async getAutoBillingHistory() {
    return this.creditService.getAutoBillingHistory();
  }

  // Credit Adjustments
  @Post('adjustments')
  async createCreditAdjustment(@Body() adjustmentDto: any) {
    return this.creditService.createCreditAdjustment(adjustmentDto);
  }

  @Get('adjustments/history')
  async getAdjustmentHistory() {
    return this.creditService.getAdjustmentHistory();
  }

  // Reports
  @Get('reports/overview')
  async getCreditOverview() {
    return this.creditService.getCreditOverview();
  }

  @Get('reports/low-credits')
  async getLowCreditStudents() {
    return this.creditService.getLowCreditStudents();
  }

  @Get('reports/expiring')
  async getExpiringCredits() {
    return this.creditService.getExpiringCredits();
  }
} 