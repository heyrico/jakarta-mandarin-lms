import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsString()
  module: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  module?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 