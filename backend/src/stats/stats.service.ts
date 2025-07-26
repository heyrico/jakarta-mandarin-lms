import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getOverviewStats() {
    const [totalSiswa, totalGuru, totalKelas, totalFinance] = await Promise.all([
      this.prisma.user.count({ 
        where: { 
          role: { name: 'SISWA' } 
        } 
      }),
      this.prisma.user.count({ 
        where: { 
          role: { name: 'GURU' } 
        } 
      }),
      this.prisma.kelas.count(),
      this.prisma.invoice.aggregate({
        _sum: {
          amount: true
        }
      })
    ]);

    return {
      totalSiswa,
      totalGuru,
      totalKelas,
      totalFinance: totalFinance._sum.amount || 0
    };
  }
}