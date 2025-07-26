import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationTypeDto, UpdateConversationTypeDto } from './dto/conversation-types.dto';

@Injectable()
export class ConversationTypesService {
  constructor(private prisma: PrismaService) {}

  async create(createConversationTypeDto: CreateConversationTypeDto) {
    // Check if conversation type name already exists
    const existingType = await this.prisma.conversationType.findUnique({
      where: { name: createConversationTypeDto.name }
    });

    if (existingType) {
      throw new BadRequestException(`Conversation type with name '${createConversationTypeDto.name}' already exists`);
    }

    return this.prisma.conversationType.create({
      data: createConversationTypeDto
    });
  }

  async findAll() {
    return this.prisma.conversationType.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async findOne(id: number) {
    const conversationType = await this.prisma.conversationType.findUnique({
      where: { id }
    });

    if (!conversationType) {
      throw new NotFoundException(`Conversation type with ID ${id} not found`);
    }

    return conversationType;
  }

  async update(id: number, updateConversationTypeDto: UpdateConversationTypeDto) {
    // Check if conversation type exists
    const existingType = await this.prisma.conversationType.findUnique({
      where: { id }
    });

    if (!existingType) {
      throw new NotFoundException(`Conversation type with ID ${id} not found`);
    }

    // Prevent updating system types
    if (existingType.isSystem) {
      throw new BadRequestException('System conversation types cannot be modified');
    }

    // Check if new name conflicts with existing type
    if (updateConversationTypeDto.name && updateConversationTypeDto.name !== existingType.name) {
      const nameConflict = await this.prisma.conversationType.findUnique({
        where: { name: updateConversationTypeDto.name }
      });

      if (nameConflict) {
        throw new BadRequestException(`Conversation type with name '${updateConversationTypeDto.name}' already exists`);
      }
    }

    return this.prisma.conversationType.update({
      where: { id },
      data: updateConversationTypeDto
    });
  }

  async remove(id: number) {
    // Check if conversation type exists
    const conversationType = await this.prisma.conversationType.findUnique({
      where: { id }
    });

    if (!conversationType) {
      throw new NotFoundException(`Conversation type with ID ${id} not found`);
    }

    // Prevent deleting system types
    if (conversationType.isSystem) {
      throw new BadRequestException('System conversation types cannot be deleted');
    }

    return this.prisma.conversationType.delete({
      where: { id }
    });
  }
} 