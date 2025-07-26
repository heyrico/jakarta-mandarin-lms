import { Module } from '@nestjs/common';
import { CreditPackageController } from './credit-package.controller';
import { CreditPackageService } from './credit-package.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CreditPackageController],
  providers: [CreditPackageService, PrismaService],
  exports: [CreditPackageService],
})
export class CreditPackageModule {} 