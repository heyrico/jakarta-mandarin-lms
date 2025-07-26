import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('journals')
export class JournalController {
  constructor(private prisma: PrismaService) {}

  @Get()
  findAll() {
    return this.prisma.journal.findMany({
      include: { entries: true }
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prisma.journal.findUnique({ where: { id: Number(id) }, include: { entries: true } });
  }

  @Post()
  async create(@Body() data: any) {
    // Temporarily disabled due to schema mismatch
    throw new Error('Journal creation temporarily disabled');
    
    // data: { date, description, entries: [{accountId, debit, credit}] }
    // return this.prisma.journal.create({
    //   data: {
    //     date: new Date(data.date),
    //     description: data.description,
    //     total: data.total || 0,
    //     entries: {
    //       create: data.entries,
    //     },
    //   },
    //   include: { entries: true },
    // });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prisma.journal.delete({ where: { id: Number(id) } });
  }
}