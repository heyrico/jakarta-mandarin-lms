import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class SiswaService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      where: { 
        role: { name: 'SISWA' } 
      },
      include: {
        role: true
      }
    });
  }

  async findActive() {
    return this.prisma.user.findMany({
      where: { 
        role: { name: 'SISWA' },
        isActive: true
      },
      include: {
        role: true
      }
    });
  }

  async findInactive() {
    return this.prisma.user.findMany({
      where: { 
        role: { name: 'SISWA' },
        isActive: false
      },
      include: {
        role: true
      }
    });
  }

  async findOne(id: number) {
    const siswa = await this.prisma.user.findFirst({
      where: { 
        id, 
        role: { name: 'SISWA' } 
      },
      include: {
        role: true
      }
    });

    if (!siswa) {
      throw new NotFoundException(`Siswa with ID ${id} not found`);
    }

    return siswa;
  }

  async create(createSiswaDto: any) {
    // Find SISWA role
    const siswaRole = await this.prisma.role.findUnique({
      where: { name: 'SISWA' }
    });

    if (!siswaRole) {
      throw new Error('SISWA role not found');
    }

    return this.prisma.user.create({
      data: {
        ...createSiswaDto,
        roleId: siswaRole.id
      },
      include: {
        role: true
      }
    });
  }

  async update(id: number, updateSiswaDto: any) {
    const siswa = await this.findOne(id);
    
    return this.prisma.user.update({
      where: { id },
      data: updateSiswaDto,
      include: {
        role: true
      }
    });
  }

  async deleteStudent(id: number) {
    try {
      await this.prisma.user.delete({
        where: { id }
      });

      return { success: true, message: 'Student deleted successfully' };
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }

  async getStats() {
    const [totalSiswa, activeSiswa, inactiveSiswa] = await Promise.all([
      this.prisma.user.count({
        where: { 
          role: { name: 'SISWA' } 
        }
      }),
      this.prisma.user.count({
        where: { 
          role: { name: 'SISWA' },
          isActive: true
        }
      }),
      this.prisma.user.count({
        where: { 
          role: { name: 'SISWA' },
          isActive: false
        }
      })
    ]);

    return {
      totalSiswa,
      activeSiswa,
      inactiveSiswa
    };
  }

  private generateAvatar(name: string): string {
    // Generate avatar initials from name
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
} 