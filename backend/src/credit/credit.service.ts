import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CreditService {
  constructor(private prisma: PrismaService) {}

  // ===== CREDIT PACKAGES =====
  async getAllPackages() {
    try {
      console.log('Returning mock credit packages data');
      return [
        {
          id: 1,
          name: 'Paket Mandarin Basic 10 Sesi',
          description: 'Paket dasar untuk pemula, 10 sesi belajar',
          price: 2500000,
          creditHours: 10,
          packageType: 'SATUAN',
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: 2,
          name: 'Paket Mandarin Intermediate 12 Sesi',
          description: 'Paket menengah untuk level intermediate, 12 sesi belajar',
          price: 3000000,
          creditHours: 12,
          packageType: 'SATUAN',
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: 3,
          name: 'Paket Mandarin Advanced 8 Sesi',
          description: 'Paket lanjutan untuk level advanced, 8 sesi belajar',
          price: 2000000,
          creditHours: 8,
          packageType: 'SATUAN',
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: 4,
          name: 'Paket Mandarin Bundle 20 Sesi',
          description: 'Paket bundle hemat, 20 sesi belajar dengan diskon',
          price: 4500000,
          creditHours: 20,
          packageType: 'BUNDLE',
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: 5,
          name: 'Paket Mandarin Premium 30 Sesi',
          description: 'Paket premium lengkap, 30 sesi belajar',
          price: 6000000,
          creditHours: 30,
          packageType: 'BUNDLE',
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        }
      ];
    } catch (error) {
      console.error('Error fetching credit packages:', error);
      return [];
    }
  }

  async getPackageStats() {
    try {
      return {
        totalPackages: 5,
        activePackages: 5,
        satuanPackages: 3,
        bundlePackages: 2,
        totalRevenue: 18000000,
        averagePrice: 3600000,
        mostPopular: 'Paket Mandarin Basic 10 Sesi'
      };
    } catch (error) {
      console.error('Error fetching package stats:', error);
      return {
        totalPackages: 0,
        activePackages: 0,
        satuanPackages: 0,
        bundlePackages: 0,
        totalRevenue: 0,
        averagePrice: 0,
        mostPopular: ''
      };
    }
  }

  async getPackageById(id: number) {
    try {
      const packages = await this.getAllPackages();
      return packages.find(pkg => pkg.id === id);
    } catch (error) {
      console.error('Error fetching package by id:', error);
      return null;
    }
  }

  async createPackage(createPackageDto: any) {
    try {
      const newPackage = {
        id: Math.floor(Math.random() * 1000) + 1,
        name: createPackageDto.name,
        description: createPackageDto.description,
        price: createPackageDto.price,
        creditHours: createPackageDto.creditHours,
        packageType: createPackageDto.packageType,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      return newPackage;
    } catch (error) {
      console.error('Error creating package:', error);
      throw error;
    }
  }

  async updatePackage(id: number, updatePackageDto: any) {
    try {
      const updatedPackage = {
        id: id,
        name: updatePackageDto.name,
        description: updatePackageDto.description,
        price: updatePackageDto.price,
        creditHours: updatePackageDto.creditHours,
        packageType: updatePackageDto.packageType,
        isActive: updatePackageDto.isActive,
        createdAt: updatePackageDto.createdAt,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      return updatedPackage;
    } catch (error) {
      console.error('Error updating package:', error);
      throw error;
    }
  }

  async deletePackage(id: number) {
    try {
      return { success: true, message: 'Package deleted successfully' };
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  }

  // ===== STUDENT CREDITS =====
  async getAllStudentCredits() {
    try {
      console.log('Returning mock student credits data');
      return [
        {
          id: 1,
          userId: 1,
          studentName: 'Sarah Chen',
          studentAvatar: 'SC',
          creditPackageId: 1,
          packageName: 'Paket Mandarin Basic 10 Sesi',
          remainingHours: 7.5,
          totalHours: 10,
          status: 'ACTIVE',
          purchaseDate: '2024-01-15',
          expiryDate: '2024-04-15',
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: 2,
          userId: 2,
          studentName: 'Budi Santoso',
          studentAvatar: 'BS',
          creditPackageId: 4,
          packageName: 'Paket Mandarin Bundle 20 Sesi',
          remainingHours: 3.0,
          totalHours: 20,
          status: 'ACTIVE',
          purchaseDate: '2024-01-20',
          expiryDate: '2024-07-20',
          createdAt: '2024-01-20',
          updatedAt: '2024-01-20'
        },
        {
          id: 3,
          userId: 3,
          studentName: 'Lisa Wang',
          studentAvatar: 'LW',
          creditPackageId: 2,
          packageName: 'Paket Mandarin Intermediate 12 Sesi',
          remainingHours: 0.0,
          totalHours: 12,
          status: 'COMPLETED',
          purchaseDate: '2024-01-10',
          expiryDate: '2024-04-10',
          createdAt: '2024-01-10',
          updatedAt: '2024-01-10'
        },
        {
          id: 4,
          userId: 1,
          studentName: 'Sarah Chen',
          studentAvatar: 'SC',
          creditPackageId: 3,
          packageName: 'Paket Mandarin Advanced 8 Sesi',
          remainingHours: 8.0,
          totalHours: 8,
          status: 'ACTIVE',
          purchaseDate: '2024-02-01',
          expiryDate: '2024-05-01',
          createdAt: '2024-02-01',
          updatedAt: '2024-02-01'
        },
        {
          id: 5,
          userId: 2,
          studentName: 'Budi Santoso',
          studentAvatar: 'BS',
          creditPackageId: 5,
          packageName: 'Paket Mandarin Premium 30 Sesi',
          remainingHours: 25.0,
          totalHours: 30,
          status: 'ACTIVE',
          purchaseDate: '2024-02-15',
          expiryDate: '2024-08-15',
          createdAt: '2024-02-15',
          updatedAt: '2024-02-15'
        }
      ];
    } catch (error) {
      console.error('Error fetching student credits:', error);
      return [];
    }
  }

  async getStudentCreditStats() {
    try {
      return {
        totalCredits: 5,
        activeCredits: 4,
        completedCredits: 1,
        totalHours: 80,
        remainingHours: 43.5,
        usedHours: 36.5,
        lowCreditStudents: 1,
        expiringCredits: 2
      };
    } catch (error) {
      console.error('Error fetching student credit stats:', error);
      return {
        totalCredits: 0,
        activeCredits: 0,
        completedCredits: 0,
        totalHours: 0,
        remainingHours: 0,
        usedHours: 0,
        lowCreditStudents: 0,
        expiringCredits: 0
      };
    }
  }

  async getStudentCreditById(id: number) {
    try {
      const credits = await this.getAllStudentCredits();
      return credits.find(credit => credit.id === id);
    } catch (error) {
      console.error('Error fetching student credit by id:', error);
      return null;
    }
  }

  async getStudentCreditsByStudent(studentId: number) {
    try {
      const credits = await this.getAllStudentCredits();
      return credits.filter(credit => credit.userId === studentId);
    } catch (error) {
      console.error('Error fetching student credits by student:', error);
      return [];
    }
  }

  async createStudentCredit(createStudentCreditDto: any) {
    try {
      const newStudentCredit = {
        id: Math.floor(Math.random() * 1000) + 1,
        userId: createStudentCreditDto.userId,
        studentName: createStudentCreditDto.studentName,
        studentAvatar: createStudentCreditDto.studentAvatar,
        creditPackageId: createStudentCreditDto.creditPackageId,
        packageName: createStudentCreditDto.packageName,
        remainingHours: createStudentCreditDto.creditHours,
        totalHours: createStudentCreditDto.creditHours,
        status: 'ACTIVE',
        purchaseDate: new Date().toISOString().split('T')[0],
        expiryDate: createStudentCreditDto.expiryDate,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      return newStudentCredit;
    } catch (error) {
      console.error('Error creating student credit:', error);
      throw error;
    }
  }

  async updateStudentCredit(id: number, updateStudentCreditDto: any) {
    try {
      const updatedStudentCredit = {
        id: id,
        userId: updateStudentCreditDto.userId,
        studentName: updateStudentCreditDto.studentName,
        studentAvatar: updateStudentCreditDto.studentAvatar,
        creditPackageId: updateStudentCreditDto.creditPackageId,
        packageName: updateStudentCreditDto.packageName,
        remainingHours: updateStudentCreditDto.remainingHours,
        totalHours: updateStudentCreditDto.totalHours,
        status: updateStudentCreditDto.status,
        purchaseDate: updateStudentCreditDto.purchaseDate,
        expiryDate: updateStudentCreditDto.expiryDate,
        createdAt: updateStudentCreditDto.createdAt,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      return updatedStudentCredit;
    } catch (error) {
      console.error('Error updating student credit:', error);
      throw error;
    }
  }

  async deleteStudentCredit(id: number) {
    try {
      return { success: true, message: 'Student credit deleted successfully' };
    } catch (error) {
      console.error('Error deleting student credit:', error);
      throw error;
    }
  }

  // ===== CREDIT TRANSACTIONS =====
  async getAllTransactions() {
    try {
      console.log('Returning mock credit transactions data');
      return [
        {
          id: 1,
          studentCreditId: 1,
          studentName: 'Sarah Chen',
          transactionType: 'PURCHASE',
          hours: 10,
          description: 'Pembelian Paket Mandarin Basic 10 Sesi',
          referenceId: 'INV-2024-001',
          referenceType: 'INVOICE',
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          studentCreditId: 1,
          studentName: 'Sarah Chen',
          transactionType: 'DEDUCTION',
          hours: -2.5,
          description: 'Penggunaan untuk kelas Mandarin Basic #1',
          referenceId: 'CLASS-001',
          referenceType: 'CLASS',
          createdAt: '2024-01-20'
        },
        {
          id: 3,
          studentCreditId: 2,
          studentName: 'Budi Santoso',
          transactionType: 'PURCHASE',
          hours: 20,
          description: 'Pembelian Paket Mandarin Bundle 20 Sesi',
          referenceId: 'INV-2024-002',
          referenceType: 'INVOICE',
          createdAt: '2024-01-20'
        },
        {
          id: 4,
          studentCreditId: 2,
          studentName: 'Budi Santoso',
          transactionType: 'DEDUCTION',
          hours: -17.0,
          description: 'Penggunaan untuk 17 sesi kelas',
          referenceId: 'CLASS-002',
          referenceType: 'CLASS',
          createdAt: '2024-02-15'
        },
        {
          id: 5,
          studentCreditId: 1,
          studentName: 'Sarah Chen',
          transactionType: 'ADJUSTMENT',
          hours: 1.0,
          description: 'Penyesuaian kredit oleh admin',
          referenceId: 'ADJ-001',
          referenceType: 'ADMIN',
          createdAt: '2024-02-20'
        }
      ];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  async getTransactionsByStudent(studentId: number) {
    try {
      const transactions = await this.getAllTransactions();
      return transactions.filter(txn => {
        // Mock filter by student name
        const studentNames = ['Sarah Chen', 'Budi Santoso', 'Lisa Wang'];
        return studentNames[studentId - 1] === txn.studentName;
      });
    } catch (error) {
      console.error('Error fetching transactions by student:', error);
      return [];
    }
  }

  async createTransaction(createTransactionDto: any) {
    try {
      const newTransaction = {
        id: Math.floor(Math.random() * 1000) + 1,
        studentCreditId: createTransactionDto.studentCreditId,
        studentName: createTransactionDto.studentName,
        transactionType: createTransactionDto.transactionType,
        hours: createTransactionDto.hours,
        description: createTransactionDto.description,
        referenceId: createTransactionDto.referenceId,
        referenceType: createTransactionDto.referenceType,
        createdAt: new Date().toISOString().split('T')[0]
      };
      return newTransaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  // ===== AUTO DEDUCTION =====
  async processAutoDeduction(deductionDto: any) {
    try {
      // Mock auto deduction process
      const deduction = {
        id: Math.floor(Math.random() * 1000) + 1,
        studentId: deductionDto.studentId,
        studentName: deductionDto.studentName,
        classId: deductionDto.classId,
        className: deductionDto.className,
        hoursDeducted: deductionDto.hoursDeducted,
        remainingHours: deductionDto.remainingHours,
        status: 'SUCCESS',
        processedAt: new Date().toISOString().split('T')[0]
      };
      return deduction;
    } catch (error) {
      console.error('Error processing auto deduction:', error);
      throw error;
    }
  }

  async getAutoDeductionHistory() {
    try {
      return [
        {
          id: 1,
          studentId: 1,
          studentName: 'Sarah Chen',
          classId: 1,
          className: 'Mandarin Basic',
          hoursDeducted: 2.5,
          remainingHours: 7.5,
          status: 'SUCCESS',
          processedAt: '2024-01-20'
        },
        {
          id: 2,
          studentId: 2,
          studentName: 'Budi Santoso',
          classId: 2,
          className: 'Mandarin Intermediate',
          hoursDeducted: 2.0,
          remainingHours: 18.0,
          status: 'SUCCESS',
          processedAt: '2024-01-25'
        }
      ];
    } catch (error) {
      console.error('Error fetching auto deduction history:', error);
      return [];
    }
  }

  // ===== AUTO BILLING =====
  async processAutoBilling(billingDto: any) {
    try {
      // Mock auto billing process for BUNDLE packages
      const billing = {
        id: Math.floor(Math.random() * 1000) + 1,
        studentId: billingDto.studentId,
        studentName: billingDto.studentName,
        packageId: billingDto.packageId,
        packageName: billingDto.packageName,
        amount: billingDto.amount,
        invoiceNumber: `INV-AUTO-${Math.floor(Math.random() * 1000)}`,
        status: 'CREATED',
        processedAt: new Date().toISOString().split('T')[0]
      };
      return billing;
    } catch (error) {
      console.error('Error processing auto billing:', error);
      throw error;
    }
  }

  async getAutoBillingHistory() {
    try {
      return [
        {
          id: 1,
          studentId: 2,
          studentName: 'Budi Santoso',
          packageId: 4,
          packageName: 'Paket Mandarin Bundle 20 Sesi',
          amount: 4500000,
          invoiceNumber: 'INV-AUTO-001',
          status: 'CREATED',
          processedAt: '2024-02-15'
        }
      ];
    } catch (error) {
      console.error('Error fetching auto billing history:', error);
      return [];
    }
  }

  // ===== CREDIT ADJUSTMENTS =====
  async createCreditAdjustment(adjustmentDto: any) {
    try {
      const adjustment = {
        id: Math.floor(Math.random() * 1000) + 1,
        studentId: adjustmentDto.studentId,
        studentName: adjustmentDto.studentName,
        adjustmentType: adjustmentDto.adjustmentType,
        hours: adjustmentDto.hours,
        reason: adjustmentDto.reason,
        adminName: adjustmentDto.adminName,
        status: 'APPROVED',
        createdAt: new Date().toISOString().split('T')[0]
      };
      return adjustment;
    } catch (error) {
      console.error('Error creating credit adjustment:', error);
      throw error;
    }
  }

  async getAdjustmentHistory() {
    try {
      return [
        {
          id: 1,
          studentId: 1,
          studentName: 'Sarah Chen',
          adjustmentType: 'ADD',
          hours: 1.0,
          reason: 'Kompensasi kelas yang dibatalkan',
          adminName: 'Admin JM',
          status: 'APPROVED',
          createdAt: '2024-02-20'
        }
      ];
    } catch (error) {
      console.error('Error fetching adjustment history:', error);
      return [];
    }
  }

  // ===== REPORTS =====
  async getCreditOverview() {
    try {
      return {
        totalStudents: 3,
        totalCredits: 5,
        totalHours: 80,
        remainingHours: 43.5,
        usedHours: 36.5,
        averageUsage: 73.1,
        lowCreditStudents: 1,
        expiringCredits: 2,
        revenue: 18000000
      };
    } catch (error) {
      console.error('Error generating credit overview:', error);
      throw error;
    }
  }

  async getLowCreditStudents() {
    try {
      const credits = await this.getAllStudentCredits();
      return credits.filter(credit => credit.remainingHours <= 5 && credit.status === 'ACTIVE');
    } catch (error) {
      console.error('Error fetching low credit students:', error);
      return [];
    }
  }

  async getExpiringCredits() {
    try {
      const credits = await this.getAllStudentCredits();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      return credits.filter(credit => {
        if (!credit.expiryDate) return false;
        const expiryDate = new Date(credit.expiryDate);
        return expiryDate <= thirtyDaysFromNow && credit.status === 'ACTIVE';
      });
    } catch (error) {
      console.error('Error fetching expiring credits:', error);
      return [];
    }
  }
} 