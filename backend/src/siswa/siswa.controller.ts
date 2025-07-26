import { Controller, Get, Post, Put, Delete, Body, Param, Query, Patch } from '@nestjs/common';
import { SiswaService } from './siswa.service';

@Controller('siswa')
export class SiswaController {
  constructor(private readonly siswaService: SiswaService) {}

  @Get()
  getAllStudents() {
    return this.siswaService.findAll();
  }

  @Get('stats')
  getStudentStats() {
    return this.siswaService.getStats();
  }

  @Get(':id')
  getStudentById(@Param('id') id: string) {
    return this.siswaService.findOne(+id);
  }

  @Post()
  createStudent(@Body() createStudentDto: any) {
    return this.siswaService.create(createStudentDto);
  }

  @Patch(':id')
  updateStudent(@Param('id') id: string, @Body() updateStudentDto: any) {
    return this.siswaService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  async deleteStudent(@Param('id') id: string) {
    return this.siswaService.deleteStudent(parseInt(id));
  }
} 