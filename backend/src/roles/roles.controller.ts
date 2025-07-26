import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto, AssignPermissionsDto } from './dto/roles.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }

  @Post(':id/permissions')
  assignPermissions(@Param('id') id: string, @Body() assignPermissionsDto: AssignPermissionsDto) {
    return this.rolesService.assignPermissions(+id, assignPermissionsDto);
  }

  @Get(':id/permissions')
  getRolePermissions(@Param('id') id: string) {
    return this.rolesService.getRolePermissions(+id);
  }
} 