import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  getTeams(workspaceId: string) {
    return this.prisma.team.findMany({
      where: { workspaceId },
      orderBy: { name: 'asc' },
    });
  }

  async createTeam(workspaceId: string, dto: CreateTeamDto) {
    const existing = await this.prisma.team.findUnique({
      where: {
        workspaceId_name: { workspaceId, name: dto.name.trim() },
      },
    });

    if (existing) {
      throw new ConflictException('Team with this name already exists in workspace.');
    }

    return this.prisma.team.create({
      data: {
        workspaceId,
        name: dto.name.trim(),
        description: dto.description?.trim(),
      },
    });
  }

  async updateTeam(workspaceId: string, teamId: string, dto: UpdateTeamDto) {
    const team = await this.prisma.team.findFirst({
      where: { id: teamId, workspaceId },
    });

    if (!team) {
      throw new NotFoundException('Team not found in workspace.');
    }

    return this.prisma.team.update({
      where: { id: teamId },
      data: {
        ...(dto.name && { name: dto.name.trim() }),
        ...(dto.description !== undefined && { description: dto.description?.trim() }),
      },
    });
  }

  async deleteTeam(workspaceId: string, teamId: string) {
    const team = await this.prisma.team.findFirst({
      where: { id: teamId, workspaceId },
    });

    if (!team) {
      throw new NotFoundException('Team not found in workspace.');
    }

    return this.prisma.team.delete({
      where: { id: teamId },
    });
  }
}
