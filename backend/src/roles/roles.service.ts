import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto, AssignPermissionsDto } from './dto/roles.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    // Check if role name already exists
    const existingRole = await this.prisma.role.findUnique({
      where: { name: createRoleDto.name }
    });

    if (existingRole) {
      throw new BadRequestException(`Role with name '${createRoleDto.name}' already exists`);
    }

    return this.prisma.role.create({
      data: createRoleDto,
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });
  }

  async findAll() {
    return this.prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true
          }
        },
        _count: {
          select: {
            users: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
  }

  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true
          }
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    // Check if role exists
    const existingRole = await this.prisma.role.findUnique({
      where: { id }
    });

    if (!existingRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Prevent updating system roles
    if (existingRole.isSystem) {
      throw new BadRequestException('System roles cannot be modified');
    }

    // Check if new name conflicts with existing role
    if (updateRoleDto.name && updateRoleDto.name !== existingRole.name) {
      const nameConflict = await this.prisma.role.findUnique({
        where: { name: updateRoleDto.name }
      });

      if (nameConflict) {
        throw new BadRequestException(`Role with name '${updateRoleDto.name}' already exists`);
      }
    }

    return this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });
  }

  async remove(id: number) {
    // Check if role exists
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Prevent deleting system roles
    if (role.isSystem) {
      throw new BadRequestException('System roles cannot be deleted');
    }

    // Check if role has users
    if (role._count.users > 0) {
      throw new BadRequestException(`Cannot delete role. ${role._count.users} user(s) are assigned to this role`);
    }

    // Delete role permissions first, then role
    await this.prisma.rolePermission.deleteMany({
      where: { roleId: id }
    });

    return this.prisma.role.delete({
      where: { id }
    });
  }

  async assignPermissions(id: number, assignPermissionsDto: AssignPermissionsDto) {
    // Check if role exists
    const role = await this.prisma.role.findUnique({
      where: { id }
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Check if permissions exist
    const permissions = await this.prisma.permission.findMany({
      where: {
        id: {
          in: assignPermissionsDto.permissionIds
        }
      }
    });

    if (permissions.length !== assignPermissionsDto.permissionIds.length) {
      throw new BadRequestException('Some permissions not found');
    }

    // Remove existing permissions
    await this.prisma.rolePermission.deleteMany({
      where: { roleId: id }
    });

    // Assign new permissions
    const rolePermissions = assignPermissionsDto.permissionIds.map(permissionId => ({
      roleId: id,
      permissionId
    }));

    await this.prisma.rolePermission.createMany({
      data: rolePermissions
    });

    return this.findOne(id);
  }

  async getRolePermissions(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role.permissions.map(rp => rp.permission);
  }
} 