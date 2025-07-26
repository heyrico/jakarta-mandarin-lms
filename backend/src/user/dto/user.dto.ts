import { IsString, IsOptional, IsBoolean, IsDateString, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  parentName?: string;

  @IsOptional()
  @IsString()
  parentPhone?: string;

  @IsOptional()
  @IsString()
  school?: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  parentName?: string;

  @IsOptional()
  @IsString()
  parentPhone?: string;

  @IsOptional()
  @IsString()
  school?: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateUsersDto {
  @IsArray()
  users: CreateUserDto[];
} 