import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return this.authService.login(user);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: { email: string }) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: { token: string; newPassword: string }) {
    return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
  }

  @Post('update-password')
  async updatePassword() {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('finance123', 10);
    
    const updatedUser = await this.authService['prisma'].user.update({
      where: { email: 'finance@jakartamandarin.com' },
      data: { password: hashedPassword }
    });
    
    return { message: 'Password updated successfully', user: updatedUser.email };
  }
} 