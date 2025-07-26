import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permissions.dto';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    // Check if permission name already exists
    const existingPermission = await this.prisma.permission.findUnique({
      where: { name: createPermissionDto.name }
    });

    if (existingPermission) {
      throw new BadRequestException(`Permission with name '${createPermissionDto.name}' already exists`);
    }

    return this.prisma.permission.create({
      data: createPermissionDto
    });
  }

  async findAll() {
    return this.prisma.permission.findMany({
      include: {
        _count: {
          select: {
            roles: true
          }
        }
      },
      orderBy: [
        { module: 'asc' },
        { name: 'asc' }
      ]
    });
  }

  async findByModule(module: string) {
    return this.prisma.permission.findMany({
      where: { module },
      orderBy: { name: 'asc' }
    });
  }

  async findOne(id: number) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    return permission;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    // Check if permission exists
    const existingPermission = await this.prisma.permission.findUnique({
      where: { id }
    });

    if (!existingPermission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    // Check if new name conflicts with existing permission
    if (updatePermissionDto.name && updatePermissionDto.name !== existingPermission.name) {
      const nameConflict = await this.prisma.permission.findUnique({
        where: { name: updatePermissionDto.name }
      });

      if (nameConflict) {
        throw new BadRequestException(`Permission with name '${updatePermissionDto.name}' already exists`);
      }
    }

    return this.prisma.permission.update({
      where: { id },
      data: updatePermissionDto
    });
  }

  async remove(id: number) {
    // Check if permission exists
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            roles: true
          }
        }
      }
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    // Check if permission is assigned to any roles
    if (permission._count.roles > 0) {
      throw new BadRequestException(`Cannot delete permission. It is assigned to ${permission._count.roles} role(s)`);
    }

    return this.prisma.permission.delete({
      where: { id }
    });
  }

  async getModules() {
    const modules = await this.prisma.permission.findMany({
      select: { module: true },
      distinct: ['module']
    });

    return modules.map(m => m.module).sort();
  }
} 