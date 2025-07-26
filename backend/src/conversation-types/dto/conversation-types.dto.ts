import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateConversationTypeDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  maxParticipants?: number;

  @IsOptional()
  @IsBoolean()
  allowFileUpload?: boolean;

  @IsOptional()
  @IsBoolean()
  allowEditMessage?: boolean;

  @IsOptional()
  @IsBoolean()
  allowDeleteMessage?: boolean;
}

export class UpdateConversationTypeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  maxParticipants?: number;

  @IsOptional()
  @IsBoolean()
  allowFileUpload?: boolean;

  @IsOptional()
  @IsBoolean()
  allowEditMessage?: boolean;

  @IsOptional()
  @IsBoolean()
  allowDeleteMessage?: boolean;
} 