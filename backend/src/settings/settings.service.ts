import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSettingDto, UpdateSettingDto, BulkUpdateSettingDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getAllSettings(category?: string) {
    const where = category ? { category, isActive: true } : { isActive: true };
    return this.prisma.settings.findMany({
      where,
      orderBy: { category: 'asc' }
    });
  }

  async getSettingsByCategory(category: string) {
    return this.prisma.settings.findMany({
      where: { category, isActive: true },
      orderBy: { key: 'asc' }
    });
  }

  async getSetting(key: string) {
    return this.prisma.settings.findUnique({
      where: { key }
    });
  }

  async createSetting(createSettingDto: CreateSettingDto) {
    return this.prisma.settings.create({
      data: createSettingDto
    });
  }

  async updateSetting(key: string, updateSettingDto: UpdateSettingDto) {
    return this.prisma.settings.upsert({
      where: { key },
      update: updateSettingDto,
      create: { 
        key, 
        value: updateSettingDto.value || '',
        category: updateSettingDto.category || 'general',
        description: updateSettingDto.description,
        isActive: updateSettingDto.isActive !== undefined ? updateSettingDto.isActive : true
      }
    });
  }

  async deleteSetting(key: string) {
    return this.prisma.settings.update({
      where: { key },
      data: { isActive: false }
    });
  }

  async updateBulkSettings(settings: BulkUpdateSettingDto[]) {
    const updates = settings.map(setting => 
      this.prisma.settings.upsert({
        where: { key: setting.key },
        update: { 
          value: setting.value,
          category: setting.category,
          description: setting.description,
          isActive: setting.isActive
        },
        create: {
          key: setting.key,
          value: setting.value || '',
          category: setting.category || 'general',
          description: setting.description,
          isActive: setting.isActive !== undefined ? setting.isActive : true
        }
      })
    );

    return this.prisma.$transaction(updates);
  }

  async exportConfig() {
    const settings = await this.getAllSettings();
    const config = {};
    
    settings.forEach(setting => {
      config[setting.key] = setting.value;
    });

    return config;
  }

  // Helper methods for common settings
  async getSchoolInfo() {
    const settings = await this.prisma.settings.findMany({
      where: {
        category: 'general',
        isActive: true
      }
    });

    const schoolInfo = {};
    settings.forEach(setting => {
      schoolInfo[setting.key] = setting.value;
    });

    return schoolInfo;
  }

  async getEmailConfig() {
    const settings = await this.prisma.settings.findMany({
      where: {
        category: 'email',
        isActive: true
      }
    });

    const emailConfig = {};
    settings.forEach(setting => {
      emailConfig[setting.key] = setting.value;
    });

    return emailConfig;
  }
} 