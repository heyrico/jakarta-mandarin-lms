import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { AbsensiService } from './absensi.service';

@Controller('absensi')
export class AbsensiController {
  constructor(private readonly absensiService: AbsensiService) {}

  @Get()
  async getAllAttendance() {
    return this.absensiService.getAllAttendance();
  }

  @Get('stats')
  async getAttendanceStats() {
    return this.absensiService.getAttendanceStats();
  }

  @Get('class/:classId')
  async getAttendanceByClass(@Param('classId') classId: string) {
    return this.absensiService.getAttendanceByClass(parseInt(classId));
  }

  @Get('student/:studentId')
  async getAttendanceByStudent(@Param('studentId') studentId: string) {
    return this.absensiService.getAttendanceByStudent(parseInt(studentId));
  }

  @Post()
  async createAttendance(@Body() createAttendanceDto: any) {
    return this.absensiService.createAttendance(createAttendanceDto);
  }

  @Put(':id')
  async updateAttendance(@Param('id') id: string, @Body() updateAttendanceDto: any) {
    return this.absensiService.updateAttendance(parseInt(id), updateAttendanceDto);
  }

  @Delete(':id')
  async deleteAttendance(@Param('id') id: string) {
    return this.absensiService.deleteAttendance(parseInt(id));
  }

  @Post('bulk')
  async createBulkAttendance(@Body() bulkAttendanceDto: any) {
    return this.absensiService.createBulkAttendance(bulkAttendanceDto);
  }
} 