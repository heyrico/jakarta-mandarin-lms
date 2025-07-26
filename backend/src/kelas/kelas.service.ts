import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KelasService {
  constructor(private prisma: PrismaService) {}

  async getAllClasses() {
    try {
      const classes = await this.prisma.kelas.findMany({
        orderBy: { createdAt: 'desc' }
      });

      // Transform data to match frontend expectations
      return classes.map(kelas => ({
        id: kelas.id,
        name: kelas.name,
        teacher: kelas.teacher,
        schedule: kelas.schedule,
        startDate: kelas.startDate,
        endDate: kelas.endDate,
        maxStudents: kelas.maxStudents,
        currentStudents: 0, // Will be calculated from enrollment data
        status: this.getStatusFromDates(kelas.startDate, kelas.endDate),
        location: 'Jakarta Pusat', // Default location
        description: `${kelas.name} - Kelas Mandarin`,
        attendance: 85, // Mock attendance rate
        progress: this.calculateProgress(kelas.startDate, kelas.endDate),
        fee: 2900000, // Default fee
        packageMeetings: 16 // Default meetings
      }));
    } catch (error) {
      console.error('Error fetching classes:', error);
      return [];
    }
  }

  async getKelasStats() {
    const [totalKelas, activeKelas, totalSiswa] = await Promise.all([
      this.prisma.kelas.count(),
      this.prisma.kelas.count({
        where: {
          endDate: {
            gte: new Date()
          }
        }
      }),
      this.prisma.user.count({ 
        where: { 
          role: { name: 'SISWA' } 
        } 
      })
    ]);

    return {
      totalKelas,
      activeKelas,
      totalSiswa
    };
  }

  async getClassById(id: number) {
    try {
      const kelas = await this.prisma.kelas.findUnique({
        where: { id }
      });

      if (!kelas) {
        throw new Error('Class not found');
      }

      return {
        id: kelas.id,
        name: kelas.name,
        teacher: kelas.teacher,
        schedule: kelas.schedule,
        startDate: kelas.startDate,
        endDate: kelas.endDate,
        maxStudents: kelas.maxStudents,
        currentStudents: 0,
        status: this.getStatusFromDates(kelas.startDate, kelas.endDate),
        location: 'Jakarta Pusat',
        description: `${kelas.name} - Kelas Mandarin`,
        attendance: 85,
        progress: this.calculateProgress(kelas.startDate, kelas.endDate),
        fee: 2900000,
        packageMeetings: 16
      };
    } catch (error) {
      console.error('Error fetching class by ID:', error);
      throw error;
    }
  }

  async createClass(createClassDto: any) {
    try {
      const kelas = await this.prisma.kelas.create({
        data: {
          name: createClassDto.name,
          teacher: createClassDto.teacher,
          schedule: createClassDto.schedule,
          startDate: new Date(createClassDto.startDate),
          endDate: new Date(createClassDto.endDate),
          maxStudents: parseInt(createClassDto.maxStudents)
        }
      });

      return this.getClassById(kelas.id);
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  }

  async updateClass(id: number, updateClassDto: any) {
    try {
      const kelas = await this.prisma.kelas.update({
        where: { id },
        data: {
          name: updateClassDto.name,
          teacher: updateClassDto.teacher,
          schedule: updateClassDto.schedule,
          startDate: new Date(updateClassDto.startDate),
          endDate: new Date(updateClassDto.endDate),
          maxStudents: parseInt(updateClassDto.maxStudents)
        }
      });

      return this.getClassById(kelas.id);
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  }

  async deleteClass(id: number) {
    try {
      await this.prisma.kelas.delete({
        where: { id }
      });

      return { success: true, message: 'Class deleted successfully' };
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  }

  private getStatusFromDates(startDate: Date, endDate: Date): string {
    const now = new Date();
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'completed';
    return 'active';
  }

  private calculateProgress(startDate: Date, endDate: Date): number {
    const now = new Date();
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    
    if (elapsed <= 0) return 0;
    if (elapsed >= totalDuration) return 100;
    
    return Math.round((elapsed / totalDuration) * 100);
  }
} 