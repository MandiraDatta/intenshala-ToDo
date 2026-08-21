import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { UpdateProjectPositionDto } from './dto/update-project-position.dto';
import { Prisma } from '@prisma/client';
import { ProjectStatus, Priority } from '../common/enums';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(workspaceId: string, createdById: string, dto: CreateProjectDto) {
    let validUserId = createdById;
    if (validUserId) {
      const userExists = await this.prisma.user.findUnique({ where: { id: validUserId } });
      if (!userExists) validUserId = undefined as any;
    }
    if (!validUserId) {
      const firstMember = await this.prisma.workspaceMember.findFirst({ where: { workspaceId } });
      if (firstMember) {
        validUserId = firstMember.userId;
      } else {
        let firstUser = await this.prisma.user.findFirst();
        if (!firstUser) {
          firstUser = await this.prisma.user.create({
            data: {
              email: 'admin@pyramid.local',
              passwordHash: 'dummy-password-hash',
              fullName: 'Admin',
              username: 'admin',
            },
          });
        }
        validUserId = firstUser.id;
      }
    }

    let targetWorkspaceId = workspaceId;
    const wsExists = await this.prisma.workspace.findUnique({ where: { id: targetWorkspaceId } });
    if (!wsExists) {
      let firstWs = await this.prisma.workspace.findFirst();
      if (!firstWs) {
        firstWs = await this.prisma.workspace.create({
          data: {
            name: 'Default Workspace',
            slug: `default-workspace-${Date.now()}`,
          },
        });
      }
      targetWorkspaceId = firstWs.id;
    }

    let reporterId = dto.reporterId || validUserId;
    if (reporterId) {
      const reporterExists = await this.prisma.user.findUnique({ where: { id: reporterId } });
      if (!reporterExists) reporterId = validUserId;
    }

    const created = await this.prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          workspaceId: targetWorkspaceId,
          createdById: validUserId,
          name: dto.name.trim(),
          description: dto.description?.trim(),
          status: dto.status || ProjectStatus.PLANNED,
          priority: dto.priority || Priority.NONE,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
          reporterId: reporterId || validUserId,
          teamId: dto.teamId || null,
        },
      });

      if (dto.memberIds && dto.memberIds.length > 0) {
        const validMembers = await tx.user.findMany({
          where: { id: { in: dto.memberIds } },
          select: { id: true },
        });
        if (validMembers.length > 0) {
          await tx.projectMember.createMany({
            data: validMembers.map((m) => ({
              projectId: project.id,
              userId: m.id,
            })),
          });
        }
      }

      if (dto.labelIds && dto.labelIds.length > 0) {
        const validLabels = await tx.label.findMany({
          where: { id: { in: dto.labelIds } },
          select: { id: true },
        });
        if (validLabels.length > 0) {
          await tx.projectLabel.createMany({
            data: validLabels.map((l) => ({
              projectId: project.id,
              labelId: l.id,
            })),
          });
        }
      }

      return project;
    });

    return this.findOne(targetWorkspaceId, created.id);
  }

  async findAll(workspaceId: string, query: ProjectQueryDto, requesterId?: string, requesterRole?: string) {
    const { page = 1, limit = 20, search, status, priority, memberId, teamId, labelId, reporterId, dueDate, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: Prisma.ProjectWhereInput = {
      workspaceId,
      deletedAt: null,
    };

    // RBAC: Members can only see projects they are explicitly added to (or assigned a task in)
    if (requesterRole === 'MEMBER' && requesterId) {
      where.AND = [
        {
          OR: [
            { members: { some: { userId: requesterId } } },
            { tasks: { some: { members: { some: { userId: requesterId } } } } },
          ],
        },
      ];
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (status) {
      const statuses = status.split(',') as ProjectStatus[];
      where.status = { in: statuses };
    }

    if (priority) {
      const priorities = priority.split(',') as Priority[];
      where.priority = { in: priorities };
    }

    if (teamId) {
      where.teamId = teamId;
    }

    if (reporterId) {
      where.reporterId = reporterId;
    }

    if (memberId) {
      where.members = {
        some: { userId: memberId },
      };
    }

    if (labelId) {
      where.labels = {
        some: { labelId },
      };
    }

    if (dueDate) {
      const now = new Date();
      if (dueDate === 'today') {
        const start = new Date(now.setHours(0, 0, 0, 0));
        const end = new Date(now.setHours(23, 59, 59, 999));
        where.dueDate = { gte: start, lte: end };
      } else if (dueDate === 'overdue') {
        where.dueDate = { lt: new Date() };
      }
    }

    const skip = (page - 1) * limit;

    const [total, projects] = await Promise.all([
      this.prisma.project.count({ where }),
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          reporter: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
          team: { select: { id: true, name: true } },
          members: {
            include: {
              user: { select: { id: true, email: true, fullName: true, username: true, avatarUrl: true } },
            },
          },
          tasks: {
            where: { deletedAt: null },
            include: {
              members: {
                include: {
                  user: { select: { id: true, email: true, fullName: true, username: true, avatarUrl: true } },
                },
              },
            },
          },
          labels: {
            include: {
              label: { select: { id: true, name: true, color: true } },
            },
          },
          _count: { select: { tasks: true } },
        },
      }),
    ]);

    const formatted = projects.map((p) => {
      // Direct project members
      const directMembers = (p.members || []).map((m) => m?.user).filter(Boolean)
        .map((u) => ({ ...u, source: 'project' as const }));

      // Task-sourced members (anyone assigned to any task in this project)
      const taskMembers = (p.tasks || []).flatMap((t) =>
        (t.members || []).map((m) => m?.user).filter(Boolean)
          .map((u) => ({ ...u, source: 'task' as const }))
      );

      // Merge and deduplicate by user ID; direct membership takes precedence
      const seenIds = new Set<string>();
      const allMembers = [...directMembers, ...taskMembers].filter((u) => {
        if (!u || seenIds.has(u.id)) return false;
        seenIds.add(u.id);
        return true;
      });

      return {
        id: p.id,
        workspaceId: p.workspaceId,
        name: p.name,
        description: p.description,
        status: p.status,
        priority: p.priority,
        dueDate: p.dueDate,
        position: p.position,
        reporter: p.reporter || null,
        team: p.team || null,
        members: allMembers,
        labels: (p.labels || []).map((l) => l?.label).filter(Boolean),
        taskCount: p._count?.tasks || 0,
      };
    });

    return {
      data: formatted,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(workspaceId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, workspaceId, deletedAt: null },
      include: {
        reporter: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
        team: { select: { id: true, name: true } },
        members: {
          include: {
            user: { select: { id: true, email: true, fullName: true, username: true, avatarUrl: true } },
          },
        },
        tasks: {
          where: { deletedAt: null },
          include: {
            members: {
              include: {
                user: { select: { id: true, email: true, fullName: true, username: true, avatarUrl: true } },
              },
            },
          },
        },
        labels: {
          include: {
            label: { select: { id: true, name: true, color: true } },
          },
        },
        _count: { select: { tasks: true } },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    // Direct project members
    const directMembers = (project.members || []).map((m) => m?.user).filter(Boolean)
      .map((u) => ({ ...u, source: 'project' as const }));

    // Task-sourced members (anyone assigned to any task in this project)
    const taskMembers = (project.tasks || []).flatMap((t) =>
      (t.members || []).map((m) => m?.user).filter(Boolean)
        .map((u) => ({ ...u, source: 'task' as const }))
    );

    // Merge and deduplicate by user ID; direct membership takes precedence
    const seenIds = new Set<string>();
    const allMembers = [...directMembers, ...taskMembers].filter((u) => {
      if (!u || seenIds.has(u.id)) return false;
      seenIds.add(u.id);
      return true;
    });

    return {
      id: project.id,
      workspaceId: project.workspaceId,
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      dueDate: project.dueDate,
      position: project.position,
      reporter: project.reporter || null,
      team: project.team || null,
      members: allMembers,
      labels: (project.labels || []).map((l) => l?.label).filter(Boolean),
      taskCount: project._count?.tasks || 0,
    };
  }

  async getFilterOptions(workspaceId: string) {
    const [members, teams, labels] = await Promise.all([
      this.prisma.workspaceMember.findMany({
        where: { workspaceId },
        include: {
          user: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
        },
      }),
      this.prisma.team.findMany({
        where: { workspaceId },
        select: { id: true, name: true },
      }),
      this.prisma.label.findMany({
        where: { workspaceId },
        select: { id: true, name: true, color: true },
      }),
    ]);

    const formattedMembers = members.map((m) => ({
      id: m.user.id,
      name: m.user.fullName || m.user.username,
      avatarUrl: m.user.avatarUrl,
    }));

    return {
      statuses: Object.values(ProjectStatus),
      priorities: Object.values(Priority),
      members: formattedMembers,
      teams,
      labels,
      reporters: formattedMembers,
    };
  }

  async update(workspaceId: string, projectId: string, dto: UpdateProjectDto) {
    await this.findOne(workspaceId, projectId);

    await this.prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id: projectId },
        data: {
          ...(dto.name && { name: dto.name.trim() }),
          ...(dto.description !== undefined && { description: dto.description?.trim() }),
          ...(dto.status && { status: dto.status }),
          ...(dto.priority && { priority: dto.priority }),
          ...(dto.dueDate !== undefined && { dueDate: dto.dueDate ? new Date(dto.dueDate) : null }),
          ...(dto.reporterId !== undefined && { reporterId: dto.reporterId }),
          ...(dto.teamId !== undefined && { teamId: dto.teamId }),
        },
      });

      if (dto.memberIds !== undefined) {
        await tx.projectMember.deleteMany({ where: { projectId } });
        if (dto.memberIds.length > 0) {
          await tx.projectMember.createMany({
            data: dto.memberIds.map((userId) => ({ projectId, userId })),
          });
        }
      }

      if (dto.labelIds !== undefined) {
        await tx.projectLabel.deleteMany({ where: { projectId } });
        if (dto.labelIds.length > 0) {
          await tx.projectLabel.createMany({
            data: dto.labelIds.map((labelId) => ({ projectId, labelId })),
          });
        }
      }
    });

    return this.findOne(workspaceId, projectId);
  }

  async updateStatus(workspaceId: string, projectId: string, dto: UpdateProjectStatusDto) {
    await this.findOne(workspaceId, projectId);
    return this.prisma.project.update({
      where: { id: projectId },
      data: { status: dto.status },
    });
  }

  async updatePosition(workspaceId: string, projectId: string, dto: UpdateProjectPositionDto) {
    await this.findOne(workspaceId, projectId);
    return this.prisma.project.update({
      where: { id: projectId },
      data: { position: dto.position },
    });
  }

  async remove(workspaceId: string, projectId: string) {
    await this.findOne(workspaceId, projectId);
    return this.prisma.project.update({
      where: { id: projectId },
      data: { deletedAt: new Date() },
    });
  }
}
