import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, CreateUsersDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Find role by name if role is provided as string
    let roleId: number | null = null;
    if (createUserDto.role) {
      const role = await this.prisma.role.findUnique({
        where: { name: createUserDto.role }
      });
      if (role) {
        roleId = role.id;
      }
    }

    const { role, ...userData } = createUserDto;

    return this.prisma.user.create({
      data: {
        ...userData,
        roleId
      },
      include: {
        role: true
      }
    });
  }

  async createBulk(createUsersDto: CreateUsersDto) {
    const users: any[] = [];
    
    for (const userDto of createUsersDto.users) {
      // Find role by name if role is provided as string
      let roleId: number | null = null;
      if (userDto.role) {
        const role = await this.prisma.role.findUnique({
          where: { name: userDto.role }
        });
        if (role) {
          roleId = role.id;
        }
      }

      const { role, ...userData } = userDto;

      const user = await this.prisma.user.create({
        data: {
          ...userData,
          roleId
        },
        include: {
          role: true
        }
      });
      
      users.push(user);
    }

    return users;
  }

  async findAll(role?: string, isActive?: boolean) {
    const where: any = {};
    
    if (role) {
      where.role = { name: role };
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return this.prisma.user.findMany({
      where,
      include: {
        role: true
      }
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true
      }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Find role by name if role is provided as string
    let roleId: number | undefined = undefined;
    if (updateUserDto.role) {
      const role = await this.prisma.role.findUnique({
        where: { name: updateUserDto.role }
      });
      if (role) {
        roleId = role.id;
      }
    }

    const { role, ...userData } = updateUserDto;
    const updateData: any = { ...userData };
    
    if (roleId !== undefined) {
      updateData.roleId = roleId;
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        role: true
      }
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id }
    });
  }

  async getStats() {
    const [totalUsers, siswaCount, guruCount, adminCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ 
        where: { 
          role: { name: 'SISWA' } 
        } 
      }),
      this.prisma.user.count({ 
        where: { 
          role: { name: 'GURU' } 
        } 
      }),
      this.prisma.user.count({ 
        where: { 
          role: { 
            name: { in: ['SSC', 'SEA', 'ADMIN'] } 
          } 
        } 
      })
    ]);

    return {
      totalUsers,
      siswaCount,
      guruCount,
      adminCount
    };
  }
}