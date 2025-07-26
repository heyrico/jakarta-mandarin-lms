import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { SettingsModule } from './settings/settings.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ConversationTypesModule } from './conversation-types/conversation-types.module';

@Module({
  imports: [
    PrismaModule, 
    UserModule, 
    SettingsModule,
    RolesModule,
    PermissionsModule,
    ConversationTypesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
