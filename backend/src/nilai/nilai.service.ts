import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NilaiService {
  constructor(private prisma: PrismaService) {}

  async getAllGrades() {
    try {
      // Since we don't have grades table yet, return mock data
      console.log('Returning mock grades data');
      return [
        {
          id: 1,
          classId: 1,
          className: 'Mandarin Basic',
          studentId: 1,
          studentName: 'Sarah Chen',
          studentAvatar: 'SC',
          subject: 'Speaking',
          assignment: 'Conversation Practice',
          score: 85,
          maxScore: 100,
          grade: 'B+',
          percentage: 85,
          feedback: 'Sangat baik dalam pronunciation, perlu latihan lebih untuk fluency',
          teacherName: 'Li Wei',
          submittedDate: '2024-01-15',
          dueDate: '2024-01-14',
          status: 'submitted'
        },
        {
          id: 2,
          classId: 1,
          className: 'Mandarin Basic',
          studentId: 1,
          studentName: 'Sarah Chen',
          studentAvatar: 'SC',
          subject: 'Writing',
          assignment: 'Character Writing',
          score: 92,
          maxScore: 100,
          grade: 'A-',
          percentage: 92,
          feedback: 'Karakter ditulis dengan sangat rapi dan benar',
          teacherName: 'Li Wei',
          submittedDate: '2024-01-16',
          dueDate: '2024-01-15',
          status: 'submitted'
        },
        {
          id: 3,
          classId: 1,
          className: 'Mandarin Basic',
          studentId: 2,
          studentName: 'Budi Santoso',
          studentAvatar: 'BS',
          subject: 'Speaking',
          assignment: 'Conversation Practice',
          score: 78,
          maxScore: 100,
          grade: 'C+',
          percentage: 78,
          feedback: 'Perlu latihan lebih untuk pronunciation yang benar',
          teacherName: 'Li Wei',
          submittedDate: '2024-01-15',
          dueDate: '2024-01-14',
          status: 'submitted'
        },
        {
          id: 4,
          classId: 2,
          className: 'Mandarin Intermediate',
          studentId: 1,
          studentName: 'Sarah Chen',
          studentAvatar: 'SC',
          subject: 'Grammar',
          assignment: 'Grammar Test',
          score: 88,
          maxScore: 100,
          grade: 'B+',
          percentage: 88,
          feedback: 'Pemahaman grammar sangat baik, sedikit kesalahan dalam penggunaan',
          teacherName: 'Chen Ming',
          submittedDate: '2024-01-17',
          dueDate: '2024-01-16',
          status: 'submitted'
        },
        {
          id: 5,
          classId: 2,
          className: 'Mandarin Intermediate',
          studentId: 2,
          studentName: 'Budi Santoso',
          studentAvatar: 'BS',
          subject: 'Grammar',
          assignment: 'Grammar Test',
          score: 95,
          maxScore: 100,
          grade: 'A',
          percentage: 95,
          feedback: 'Excellent! Grammar sangat dikuasai dengan baik',
          teacherName: 'Chen Ming',
          submittedDate: '2024-01-17',
          dueDate: '2024-01-16',
          status: 'submitted'
        }
      ];
    } catch (error) {
      console.error('Error fetching grades:', error);
      return [];
    }
  }

  async getGradeStats() {
    try {
      // Mock grade statistics
      return {
        totalAssignments: 5,
        averageScore: 87.6,
        highestScore: 95,
        lowestScore: 78,
        gradeDistribution: {
          A: 1,
          'A-': 1,
          'B+': 2,
          'C+': 1
        },
        subjects: ['Speaking', 'Writing', 'Grammar'],
        thisMonthAssignments: 3,
        lastMonthAssignments: 2
      };
    } catch (error) {
      console.error('Error fetching grade stats:', error);
      return {
        totalAssignments: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        gradeDistribution: {},
        subjects: [],
        thisMonthAssignments: 0,
        lastMonthAssignments: 0
      };
    }
  }

  async getGradesByClass(classId: number) {
    try {
      // Mock grades by class
      const mockGrades = [
        {
          id: 1,
          classId: classId,
          className: 'Mandarin Basic',
          studentId: 1,
          studentName: 'Sarah Chen',
          studentAvatar: 'SC',
          subject: 'Speaking',
          assignment: 'Conversation Practice',
          score: 85,
          maxScore: 100,
          grade: 'B+',
          percentage: 85,
          feedback: 'Sangat baik dalam pronunciation, perlu latihan lebih untuk fluency',
          teacherName: 'Li Wei',
          submittedDate: '2024-01-15',
          dueDate: '2024-01-14',
          status: 'submitted'
        },
        {
          id: 2,
          classId: classId,
          className: 'Mandarin Basic',
          studentId: 1,
          studentName: 'Sarah Chen',
          studentAvatar: 'SC',
          subject: 'Writing',
          assignment: 'Character Writing',
          score: 92,
          maxScore: 100,
          grade: 'A-',
          percentage: 92,
          feedback: 'Karakter ditulis dengan sangat rapi dan benar',
          teacherName: 'Li Wei',
          submittedDate: '2024-01-16',
          dueDate: '2024-01-15',
          status: 'submitted'
        }
      ];

      return mockGrades.filter(grade => grade.classId === classId);
    } catch (error) {
      console.error('Error fetching grades by class:', error);
      return [];
    }
  }

  async getGradesByStudent(studentId: number) {
    try {
      // Mock grades by student
      const mockGrades = [
        {
          id: 1,
          classId: 1,
          className: 'Mandarin Basic',
          studentId: studentId,
          studentName: 'Sarah Chen',
          studentAvatar: 'SC',
          subject: 'Speaking',
          assignment: 'Conversation Practice',
          score: 85,
          maxScore: 100,
          grade: 'B+',
          percentage: 85,
          feedback: 'Sangat baik dalam pronunciation, perlu latihan lebih untuk fluency',
          teacherName: 'Li Wei',
          submittedDate: '2024-01-15',
          dueDate: '2024-01-14',
          status: 'submitted'
        },
        {
          id: 4,
          classId: 2,
          className: 'Mandarin Intermediate',
          studentId: studentId,
          studentName: 'Sarah Chen',
          studentAvatar: 'SC',
          subject: 'Grammar',
          assignment: 'Grammar Test',
          score: 88,
          maxScore: 100,
          grade: 'B+',
          percentage: 88,
          feedback: 'Pemahaman grammar sangat baik, sedikit kesalahan dalam penggunaan',
          teacherName: 'Chen Ming',
          submittedDate: '2024-01-17',
          dueDate: '2024-01-16',
          status: 'submitted'
        }
      ];

      return mockGrades.filter(grade => grade.studentId === studentId);
    } catch (error) {
      console.error('Error fetching grades by student:', error);
      return [];
    }
  }

  async createGrade(createGradeDto: any) {
    try {
      // Mock create grade
      const newGrade = {
        id: Math.floor(Math.random() * 1000) + 1,
        classId: createGradeDto.classId,
        className: createGradeDto.className,
        studentId: createGradeDto.studentId,
        studentName: createGradeDto.studentName,
        studentAvatar: createGradeDto.studentAvatar,
        subject: createGradeDto.subject,
        assignment: createGradeDto.assignment,
        score: createGradeDto.score,
        maxScore: createGradeDto.maxScore,
        grade: createGradeDto.grade,
        percentage: createGradeDto.percentage,
        feedback: createGradeDto.feedback,
        teacherName: createGradeDto.teacherName,
        submittedDate: createGradeDto.submittedDate,
        dueDate: createGradeDto.dueDate,
        status: createGradeDto.status
      };

      return newGrade;
    } catch (error) {
      console.error('Error creating grade:', error);
      throw error;
    }
  }

  async updateGrade(id: number, updateGradeDto: any) {
    try {
      // Mock update grade
      const updatedGrade = {
        id: id,
        classId: updateGradeDto.classId,
        className: updateGradeDto.className,
        studentId: updateGradeDto.studentId,
        studentName: updateGradeDto.studentName,
        studentAvatar: updateGradeDto.studentAvatar,
        subject: updateGradeDto.subject,
        assignment: updateGradeDto.assignment,
        score: updateGradeDto.score,
        maxScore: updateGradeDto.maxScore,
        grade: updateGradeDto.grade,
        percentage: updateGradeDto.percentage,
        feedback: updateGradeDto.feedback,
        teacherName: updateGradeDto.teacherName,
        submittedDate: updateGradeDto.submittedDate,
        dueDate: updateGradeDto.dueDate,
        status: updateGradeDto.status
      };

      return updatedGrade;
    } catch (error) {
      console.error('Error updating grade:', error);
      throw error;
    }
  }

  async deleteGrade(id: number) {
    try {
      // Mock delete grade
      return { success: true, message: 'Grade deleted successfully' };
    } catch (error) {
      console.error('Error deleting grade:', error);
      throw error;
    }
  }

  async createBulkGrades(bulkGradeDto: any) {
    try {
      // Mock bulk create grades
      const createdGrades = bulkGradeDto.grades.map((grade: any, index: number) => ({
        id: Math.floor(Math.random() * 1000) + index + 1,
        classId: grade.classId,
        className: grade.className,
        studentId: grade.studentId,
        studentName: grade.studentName,
        studentAvatar: grade.studentAvatar,
        subject: grade.subject,
        assignment: grade.assignment,
        score: grade.score,
        maxScore: grade.maxScore,
        grade: grade.grade,
        percentage: grade.percentage,
        feedback: grade.feedback,
        teacherName: grade.teacherName,
        submittedDate: grade.submittedDate,
        dueDate: grade.dueDate,
        status: grade.status
      }));

      return {
        success: true,
        message: `${createdGrades.length} grades created successfully`,
        data: createdGrades
      };
    } catch (error) {
      console.error('Error creating bulk grades:', error);
      throw error;
    }
  }

  async getStudentReport(studentId: number) {
    try {
      // Mock student report
      const studentGrades = await this.getGradesByStudent(studentId);
      
      const totalScore = studentGrades.reduce((sum, grade) => sum + grade.score, 0);
      const totalMaxScore = studentGrades.reduce((sum, grade) => sum + grade.maxScore, 0);
      const averageScore = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;

      return {
        studentId: studentId,
        studentName: studentGrades[0]?.studentName || 'Unknown Student',
        totalAssignments: studentGrades.length,
        averageScore: Math.round(averageScore * 100) / 100,
        highestScore: Math.max(...studentGrades.map(g => g.score)),
        lowestScore: Math.min(...studentGrades.map(g => g.score)),
        gradeDistribution: studentGrades.reduce((acc, grade) => {
          acc[grade.grade] = (acc[grade.grade] || 0) + 1;
          return acc;
        }, {}),
        subjects: [...new Set(studentGrades.map(g => g.subject))],
        recentGrades: studentGrades.slice(-5),
        improvement: 'Good progress in speaking skills'
      };
    } catch (error) {
      console.error('Error generating student report:', error);
      throw error;
    }
  }
} 