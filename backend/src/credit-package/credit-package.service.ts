import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CreditPackageService {
  constructor(private prisma: PrismaService) {}

  async createCreditPackage(data: {
    name: string;
    description?: string;
    price: number;
    creditHours: number;
    packageType: 'SATUAN' | 'BUNDLE';
  }) {
    return this.prisma.creditPackage.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        creditHours: data.creditHours,
        packageType: data.packageType,
        isActive: true
      }
    });
  }

  async getAllCreditPackages() {
    return this.prisma.creditPackage.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getCreditPackageById(id: number) {
    return this.prisma.creditPackage.findUnique({
      where: { id },
      include: {
        studentCredits: {
          include: {
            user: true,
            transactions: {
              orderBy: { createdAt: 'desc' },
              take: 10
            }
          }
        }
      }
    });
  }

  async updateCreditPackage(id: number, data: {
    name?: string;
    description?: string;
    price?: number;
    creditHours?: number;
    packageType?: 'SATUAN' | 'BUNDLE';
    isActive?: boolean;
  }) {
    return this.prisma.creditPackage.update({
      where: { id },
      data
    });
  }

  async deleteCreditPackage(id: number) {
    return this.prisma.creditPackage.update({
      where: { id },
      data: { isActive: false }
    });
  }

  async getCreditPackageStats() {
    const totalPackages = await this.prisma.creditPackage.count({
      where: { isActive: true }
    });
    
    const totalSales = await this.prisma.studentCredit.count({
      where: { status: 'ACTIVE' }
    });
    
    const totalRevenue = await this.prisma.studentCredit.aggregate({
      where: { status: 'ACTIVE' },
      _sum: {
        totalHours: true
      }
    });
    
    const popularPackages = await this.prisma.creditPackage.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { studentCredits: true }
        }
      },
      orderBy: {
        studentCredits: {
          _count: 'desc'
        }
      },
      take: 5
    });
    
    return {
      totalPackages,
      totalSales,
      totalRevenue: totalRevenue._sum.totalHours || 0,
      popularPackages
    };
  }
} 