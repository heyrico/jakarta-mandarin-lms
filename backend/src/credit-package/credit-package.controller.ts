import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('credit-packages')
export class CreditPackageController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getAllCreditPackages() {
    try {
      const packages = await this.prisma.creditPackage.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });
      return packages;
    } catch (error) {
      throw new Error('Gagal mengambil data paket kredit');
    }
  }

  @Get(':id')
  async getCreditPackageById(@Param('id') id: string) {
    try {
      const packageData = await this.prisma.creditPackage.findUnique({
        where: { id: parseInt(id) },
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
      
      if (!packageData) {
        throw new Error('Paket kredit tidak ditemukan');
      }
      
      return packageData;
    } catch (error) {
      throw new Error('Gagal mengambil data paket kredit');
    }
  }

  @Post()
  async createCreditPackage(@Body() data: {
    name: string;
    description?: string;
    price: number;
    creditHours: number;
    packageType: 'SATUAN' | 'BUNDLE';
  }) {
    try {
      const newPackage = await this.prisma.creditPackage.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          creditHours: data.creditHours,
          packageType: data.packageType,
          isActive: true
        }
      });
      
      return {
        message: 'Paket kredit berhasil dibuat',
        data: newPackage
      };
    } catch (error) {
      throw new Error('Gagal membuat paket kredit');
    }
  }

  @Put(':id')
  async updateCreditPackage(
    @Param('id') id: string,
    @Body() data: {
      name?: string;
      description?: string;
      price?: number;
      creditHours?: number;
      packageType?: 'SATUAN' | 'BUNDLE';
      isActive?: boolean;
    }
  ) {
    try {
      const updatedPackage = await this.prisma.creditPackage.update({
        where: { id: parseInt(id) },
        data: data
      });
      
      return {
        message: 'Paket kredit berhasil diupdate',
        data: updatedPackage
      };
    } catch (error) {
      throw new Error('Gagal mengupdate paket kredit');
    }
  }

  @Delete(':id')
  async deleteCreditPackage(@Param('id') id: string) {
    try {
      // Soft delete - set isActive to false
      await this.prisma.creditPackage.update({
        where: { id: parseInt(id) },
        data: { isActive: false }
      });
      
      return {
        message: 'Paket kredit berhasil dihapus'
      };
    } catch (error) {
      throw new Error('Gagal menghapus paket kredit');
    }
  }

  @Get('stats/overview')
  async getCreditPackageStats() {
    try {
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
    } catch (error) {
      throw new Error('Gagal mengambil statistik paket kredit');
    }
  }
} 