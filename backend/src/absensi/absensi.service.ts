import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AbsensiService {
  constructor(private prisma: PrismaService) {}

  async getAllAttendance() {
    try {
      // Since we don't have attendance table yet, return mock data
      console.log('Returning mock attendance data');
      return [
        {
          id: 1,
          classId: 1,
          className: 'Mandarin Basic',
          studentId: 1,
          studentName: 'Sarah Chen',
          studentAvatar: 'SC',
          date: '2024-01-15',
          time: '19:00',
          status: 'present',
          notes: 'Hadir tepat waktu',
          teacherName: 'Li Wei',
          location: 'Jakarta Pusat'
        },
        {
          id: 2,
          classId: 1,
          className: 'Mandarin Basic',
          studentId: 2,
          studentName: 'Budi Santoso',
          studentAvatar: 'BS',
          date: '2024-01-15',
          time: '19:00',
          status: 'present',
          notes: 'Hadir tepat waktu',
          teacherName: 'Li Wei',
          location: 'Jakarta Pusat'
        },
        {
          id: 3,
          classId: 1,
          className: 'Mandarin Basic',
          studentId: 3,
          studentName: 'Lisa Wang',
          studentAvatar: 'LW',
          date: '2024-01-15',
          time: '19:00',
          status: 'late',
          notes: 'Terlambat 10 menit',
          teacherName: 'Li Wei',
          location: 'Jakarta Pusat'
        },
        {
          id: 4,
          classId: 2,
          className: 'Mandarin Intermediate',
          studentId: 1,
          studentName: 'Sarah Chen',
          studentAvatar: 'SC',
          date: '2024-01-16',
          time: '20:00',
          status: 'present',
          notes: 'Hadir tepat waktu',
          teacherName: 'Chen Ming',
          location: 'Jakarta Selatan'
        },
        {
          id: 5,
          classId: 2,
          className: 'Mandarin Intermediate',
          studentId: 2,
          studentName: 'Budi Santoso',
          studentAvatar: 'BS',
          date: '2024-01-16',
          time: '20:00',
          status: 'absent',
          notes: 'Sakit',
          teacherName: 'Chen Ming',
          location: 'Jakarta Selatan'
        }
      ];
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
  }

  async getAttendanceStats() {
    try {
      // Mock attendance statistics
      return {
        totalAttendance: 5,
        presentCount: 3,
        absentCount: 1,
        lateCount: 1,
        attendanceRate: 80,
        averageAttendance: 87,
        thisWeekAttendance: 4,
        lastWeekAttendance: 3
      };
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
      return {
        totalAttendance: 0,
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        attendanceRate: 0,
        averageAttendance: 0,
        thisWeekAttendance: 0,
        lastWeekAttendance: 0
      };
    }
  }

  async getAttendanceByClass(classId: number) {
    try {
      // Mock attendance by class
      const mockAttendance = [
        {
          id: 1,
          classId: classId,
          className: 'Mandarin Basic',
          studentId: 1,
          studentName: 'Sarah Chen',
          studentAvatar: 'SC',
          date: '2024-01-15',
          time: '19:00',
          status: 'present',
          notes: 'Hadir tepat waktu',
          teacherName: 'Li Wei',
          location: 'Jakarta Pusat'
        },
        {
          id: 2,
          classId: classId,
          className: 'Mandarin Basic',
          studentId: 2,
          studentName: 'Budi Santoso',
          studentAvatar: 'BS',
          date: '2024-01-15',
          time: '19:00',
          status: 'present',
          notes: 'Hadir tepat waktu',
          teacherName: 'Li Wei',
          location: 'Jakarta Pusat'
        }
      ];

      return mockAttendance.filter(att => att.classId === classId);
    } catch (error) {
      console.error('Error fetching attendance by class:', error);
      return [];
    }
  }

  async getAttendanceByStudent(studentId: number) {
    try {
      // Mock attendance by student
      const mockAttendance = [
        {
          id: 1,
          classId: 1,
          className: 'Mandarin Basic',
          studentId: studentId,
          studentName: 'Sarah Chen',
          studentAvatar: 'SC',
          date: '2024-01-15',
          time: '19:00',
          status: 'present',
          notes: 'Hadir tepat waktu',
          teacherName: 'Li Wei',
          location: 'Jakarta Pusat'
        },
        {
          id: 4,
          classId: 2,
          className: 'Mandarin Intermediate',
          studentId: studentId,
          studentName: 'Sarah Chen',
          studentAvatar: 'SC',
          date: '2024-01-16',
          time: '20:00',
          status: 'present',
          notes: 'Hadir tepat waktu',
          teacherName: 'Chen Ming',
          location: 'Jakarta Selatan'
        }
      ];

      return mockAttendance.filter(att => att.studentId === studentId);
    } catch (error) {
      console.error('Error fetching attendance by student:', error);
      return [];
    }
  }

  async createAttendance(createAttendanceDto: any) {
    try {
      // Mock create attendance
      const newAttendance = {
        id: Math.floor(Math.random() * 1000) + 1,
        classId: createAttendanceDto.classId,
        className: createAttendanceDto.className,
        studentId: createAttendanceDto.studentId,
        studentName: createAttendanceDto.studentName,
        studentAvatar: createAttendanceDto.studentAvatar,
        date: createAttendanceDto.date,
        time: createAttendanceDto.time,
        status: createAttendanceDto.status,
        notes: createAttendanceDto.notes,
        teacherName: createAttendanceDto.teacherName,
        location: createAttendanceDto.location
      };

      return newAttendance;
    } catch (error) {
      console.error('Error creating attendance:', error);
      throw error;
    }
  }

  async updateAttendance(id: number, updateAttendanceDto: any) {
    try {
      // Mock update attendance
      const updatedAttendance = {
        id: id,
        classId: updateAttendanceDto.classId,
        className: updateAttendanceDto.className,
        studentId: updateAttendanceDto.studentId,
        studentName: updateAttendanceDto.studentName,
        studentAvatar: updateAttendanceDto.studentAvatar,
        date: updateAttendanceDto.date,
        time: updateAttendanceDto.time,
        status: updateAttendanceDto.status,
        notes: updateAttendanceDto.notes,
        teacherName: updateAttendanceDto.teacherName,
        location: updateAttendanceDto.location
      };

      return updatedAttendance;
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  }

  async deleteAttendance(id: number) {
    try {
      // Mock delete attendance
      return { success: true, message: 'Attendance deleted successfully' };
    } catch (error) {
      console.error('Error deleting attendance:', error);
      throw error;
    }
  }

  async createBulkAttendance(bulkAttendanceDto: any) {
    try {
      // Mock bulk create attendance
      const createdAttendance = bulkAttendanceDto.attendance.map((att: any, index: number) => ({
        id: Math.floor(Math.random() * 1000) + index + 1,
        classId: att.classId,
        className: att.className,
        studentId: att.studentId,
        studentName: att.studentName,
        studentAvatar: att.studentAvatar,
        date: att.date,
        time: att.time,
        status: att.status,
        notes: att.notes,
        teacherName: att.teacherName,
        location: att.location
      }));

      return {
        success: true,
        message: `${createdAttendance.length} attendance records created successfully`,
        data: createdAttendance
      };
    } catch (error) {
      console.error('Error creating bulk attendance:', error);
      throw error;
    }
  }
} 