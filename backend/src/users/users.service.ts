import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        username: true,
        title: true,
        avatarUrl: true,
        theme: true,
        colorMode: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (dto.username) {
      const usernameLower = dto.username.toLowerCase().trim();
      const existing = await this.prisma.user.findFirst({
        where: {
          username: usernameLower,
          NOT: { id: userId },
        },
      });

      if (existing) {
        throw new ConflictException('Username is already in use by another account.');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.fullName !== undefined && { fullName: dto.fullName.trim() }),
        ...(dto.title !== undefined && { title: dto.title.trim() }),
        ...(dto.username !== undefined && { username: dto.username.toLowerCase().trim() }),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        username: true,
        title: true,
        avatarUrl: true,
        theme: true,
        colorMode: true,
      },
    });

    return updated;
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.theme && { theme: dto.theme }),
        ...(dto.colorMode && { colorMode: dto.colorMode }),
      },
      select: {
        id: true,
        theme: true,
        colorMode: true,
      },
    });

    return updated;
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: {
        id: true,
        avatarUrl: true,
      },
    });
  }
}
