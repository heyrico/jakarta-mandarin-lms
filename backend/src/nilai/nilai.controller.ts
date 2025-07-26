import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { NilaiService } from './nilai.service';

@Controller('nilai')
export class NilaiController {
  constructor(private readonly nilaiService: NilaiService) {}

  @Get()
  async getAllGrades() {
    return this.nilaiService.getAllGrades();
  }

  @Get('stats')
  async getGradeStats() {
    return this.nilaiService.getGradeStats();
  }

  @Get('class/:classId')
  async getGradesByClass(@Param('classId') classId: string) {
    return this.nilaiService.getGradesByClass(parseInt(classId));
  }

  @Get('student/:studentId')
  async getGradesByStudent(@Param('studentId') studentId: string) {
    return this.nilaiService.getGradesByStudent(parseInt(studentId));
  }

  @Post()
  async createGrade(@Body() createGradeDto: any) {
    return this.nilaiService.createGrade(createGradeDto);
  }

  @Put(':id')
  async updateGrade(@Param('id') id: string, @Body() updateGradeDto: any) {
    return this.nilaiService.updateGrade(parseInt(id), updateGradeDto);
  }

  @Delete(':id')
  async deleteGrade(@Param('id') id: string) {
    return this.nilaiService.deleteGrade(parseInt(id));
  }

  @Post('bulk')
  async createBulkGrades(@Body() bulkGradeDto: any) {
    return this.nilaiService.createBulkGrades(bulkGradeDto);
  }

  @Get('report/:studentId')
  async getStudentReport(@Param('studentId') studentId: string) {
    return this.nilaiService.getStudentReport(parseInt(studentId));
  }
} 