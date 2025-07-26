import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, CreateUsersDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('bulk')
  createBulk(@Body() createUsersDto: CreateUsersDto) {
    return this.userService.createBulk(createUsersDto);
  }

  @Get()
  findAll(@Query('role') role?: string, @Query('isActive') isActive?: boolean) {
    return this.userService.findAll(role, isActive);
  }

  @Get('stats')
  getStats() {
    return this.userService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
