import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('accounts')
export class AccountController {
  constructor(private prisma: PrismaService) {}

  @Get()
  findAll() {
    return this.prisma.account.findMany();
  }

  @Post()
  create(@Body() data: any) {
    return this.prisma.account.create({ data });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.prisma.account.update({ where: { id: Number(id) }, data });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prisma.account.delete({ where: { id: Number(id) } });
  }
}