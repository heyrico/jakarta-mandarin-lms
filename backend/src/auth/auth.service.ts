import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    
    if (user) {
      // Check if password is hashed or plain text
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        // Password is hashed, use bcrypt
        if (await bcrypt.compare(password, user.password)) {
          const { password: _, ...result } = user;
          return result;
        }
      } else {
        // Password is plain text, compare directly
        if (user.password === password) {
          const { password: _, ...result } = user;
          return result;
        }
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async forgotPassword(email: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      throw new UnauthorizedException('Email tidak ditemukan');
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = this.jwtService.sign(
      { email, type: 'reset' },
      { expiresIn: '1h' }
    );

    // In a real app, you would send email here
    // For now, we'll just return the token
    return {
      message: 'Reset password link telah dikirim ke email Anda',
      resetToken: resetToken, // In production, don't return this
      email: email
    };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      // Verify token
      const payload = this.jwtService.verify(token);
      
      if (payload.type !== 'reset') {
        throw new UnauthorizedException('Invalid reset token');
      }

      // Hash new password
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user password
      await this.prisma.user.update({
        where: { email: payload.email },
        data: { password: hashedPassword }
      });

      return { message: 'Password berhasil direset' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }
} 