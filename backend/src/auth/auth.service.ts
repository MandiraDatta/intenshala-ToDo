import { Injectable, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enums';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const emailLower = dto.email.toLowerCase().trim();
    const usernameLower = dto.username.toLowerCase().trim();

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: emailLower }, { username: usernameLower }],
      },
    });

    if (existingUser) {
      if (existingUser.email === emailLower) {
        throw new ConflictException('Email address is already in use.');
      }
      throw new ConflictException('Username is already taken.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: emailLower,
          username: usernameLower,
          fullName: dto.fullName || dto.username,
          passwordHash,
        },
      });

      // Create default personal workspace
      const slug = `${usernameLower}-workspace-${Date.now().toString().slice(-4)}`;
      const workspace = await tx.workspace.create({
        data: {
          name: `${dto.fullName || dto.username}'s Workspace`,
          slug,
        },
      });

      // Create OWNER membership
      await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId: createdUser.id,
          role: Role.OWNER,
        },
      });

      return createdUser;
    });

    const tokens = this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        title: user.title,
        avatarUrl: user.avatarUrl,
        theme: user.theme,
        colorMode: user.colorMode,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const emailLower = dto.email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Update lastLoginAt
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        title: user.title,
        avatarUrl: user.avatarUrl,
        theme: user.theme,
        colorMode: user.colorMode,
      },
      ...tokens,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production-2026',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user.id, user.email);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const secret = process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production-2026';

    const accessToken = this.jwtService.sign(payload, {
      secret,
      expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '1d') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret,
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
    });

    return { accessToken, refreshToken };
  }
}
