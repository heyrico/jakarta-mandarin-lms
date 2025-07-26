import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConversationTypesService } from './conversation-types.service';
import { CreateConversationTypeDto, UpdateConversationTypeDto } from './dto/conversation-types.dto';

@Controller('conversation-types')
export class ConversationTypesController {
  constructor(private readonly conversationTypesService: ConversationTypesService) {}

  @Post()
  create(@Body() createConversationTypeDto: CreateConversationTypeDto) {
    return this.conversationTypesService.create(createConversationTypeDto);
  }

  @Get()
  findAll() {
    return this.conversationTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConversationTypeDto: UpdateConversationTypeDto) {
    return this.conversationTypesService.update(+id, updateConversationTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationTypesService.remove(+id);
  }
} 