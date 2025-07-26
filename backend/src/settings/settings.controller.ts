import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto, UpdateSettingDto, BulkUpdateSettingDto } from './dto/settings.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getAllSettings(@Query('category') category?: string) {
    return this.settingsService.getAllSettings(category);
  }

  @Get('category/:category')
  async getSettingsByCategory(@Param('category') category: string) {
    return this.settingsService.getSettingsByCategory(category);
  }

  @Get(':key')
  async getSetting(@Param('key') key: string) {
    return this.settingsService.getSetting(key);
  }

  @Post()
  async createSetting(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.createSetting(createSettingDto);
  }

  @Put(':key')
  async updateSetting(@Param('key') key: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.updateSetting(key, updateSettingDto);
  }

  @Delete(':key')
  async deleteSetting(@Param('key') key: string) {
    return this.settingsService.deleteSetting(key);
  }

  @Post('bulk')
  async updateBulkSettings(@Body() settings: BulkUpdateSettingDto[]) {
    return this.settingsService.updateBulkSettings(settings);
  }

  @Get('export/config')
  async exportConfig() {
    return this.settingsService.exportConfig();
  }
} 