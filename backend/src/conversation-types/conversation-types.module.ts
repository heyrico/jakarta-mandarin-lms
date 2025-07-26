import { Module } from '@nestjs/common';
import { ConversationTypesService } from './conversation-types.service';
import { ConversationTypesController } from './conversation-types.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConversationTypesController],
  providers: [ConversationTypesService],
  exports: [ConversationTypesService],
})
export class ConversationTypesModule {} 