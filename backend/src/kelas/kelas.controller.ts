import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { KelasService } from './kelas.service';

@Controller('kelas')
export class KelasController {
  constructor(private readonly kelasService: KelasService) {}

  @Get()
  async getAllClasses() {
    return this.kelasService.getAllClasses();
  }

  @Get('stats')
  getKelasStats() {
    return this.kelasService.getKelasStats();
  }

  @Get(':id')
  async getClassById(@Param('id') id: string) {
    return this.kelasService.getClassById(parseInt(id));
  }

  @Post()
  async createClass(@Body() createClassDto: any) {
    return this.kelasService.createClass(createClassDto);
  }

  @Put(':id')
  async updateClass(@Param('id') id: string, @Body() updateClassDto: any) {
    return this.kelasService.updateClass(parseInt(id), updateClassDto);
  }

  @Delete(':id')
  async deleteClass(@Param('id') id: string) {
    return this.kelasService.deleteClass(parseInt(id));
  }
} 