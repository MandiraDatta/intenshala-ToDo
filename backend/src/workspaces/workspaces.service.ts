import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { Role } from '../common/enums';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async getUserWorkspaces(userId: string) {
    const memberships = await this.prisma.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: {
          include: {
            _count: {
              select: { members: true },
            },
          },
        },
      },
    });

    return memberships.map((m) => ({
      id: m.workspace.id,
      name: m.workspace.name,
      slug: m.workspace.slug,
      avatarUrl: m.workspace.avatarUrl,
      role: m.role,
      memberCount: m.workspace._count.members,
      isOwner: m.role === Role.OWNER,
    }));
  }

  async createWorkspace(userId: string, dto: CreateWorkspaceDto) {
    const slugBase = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${slugBase}-${Date.now().toString().slice(-4)}`;

    return this.prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: dto.name.trim(),
          slug,
        },
      });

      const membership = await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId,
          role: Role.OWNER,
        },
      });

      return {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        role: membership.role,
        isOwner: true,
      };
    });
  }

  async getWorkspaceById(workspaceId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        _count: {
          select: { members: true, projects: true, tasks: true },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found.');
    }

    return workspace;
  }

  async leaveWorkspace(workspaceId: string, userId: string) {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId, userId },
      },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found.');
    }

    if (membership.role === Role.OWNER) {
      const ownerCount = await this.prisma.workspaceMember.count({
        where: {
          workspaceId,
          role: Role.OWNER,
        },
      });

      if (ownerCount <= 1) {
        throw new BadRequestException('Cannot leave workspace as sole Owner. Reassign ownership first.');
      }
    }

    await this.prisma.workspaceMember.delete({
      where: { id: membership.id },
    });

    return { message: 'Successfully left workspace.' };
  }

  async getMembers(workspaceId: string, search?: string) {
    const where: any = { workspaceId };
    if (search) {
      where.user = {
        OR: [
          { fullName: { contains: search } },
          { username: { contains: search } },
          { email: { contains: search } },
        ],
      };
    }

    const members = await this.prisma.workspaceMember.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            username: true,
            title: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return members.map((m) => ({
      id: m.id,
      userId: m.user.id,
      role: m.role,
      fullName: m.user.fullName,
      username: m.user.username,
      email: m.user.email,
      title: m.user.title,
      avatarUrl: m.user.avatarUrl,
    }));
  }

  async addMember(workspaceId: string, dto: AddMemberDto) {
    const existing = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId, userId: dto.userId },
      },
    });

    if (existing) {
      throw new BadRequestException('User is already a member of this workspace.');
    }

    return this.prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: dto.userId,
        role: dto.role,
      },
    });
  }

  async updateMemberRole(workspaceId: string, memberId: string, dto: UpdateMemberRoleDto) {
    const member = await this.prisma.workspaceMember.findFirst({
      where: { id: memberId, workspaceId },
    });

    if (!member) {
      throw new NotFoundException('Member not found in workspace.');
    }

    return this.prisma.workspaceMember.update({
      where: { id: memberId },
      data: { role: dto.role },
    });
  }

  async removeMember(workspaceId: string, memberId: string) {
    const member = await this.prisma.workspaceMember.findFirst({
      where: { id: memberId, workspaceId },
    });

    if (!member) {
      throw new NotFoundException('Member not found in workspace.');
    }

    if (member.role === Role.OWNER) {
      const ownerCount = await this.prisma.workspaceMember.count({
        where: { workspaceId, role: Role.OWNER },
      });

      if (ownerCount <= 1) {
        throw new BadRequestException('Cannot remove the sole owner of a workspace.');
      }
    }

    return this.prisma.workspaceMember.delete({
      where: { id: memberId },
    });
  }
}
