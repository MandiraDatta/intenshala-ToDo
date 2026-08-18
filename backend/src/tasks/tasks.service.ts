import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskPositionDto } from './dto/update-task-position.dto';
import { Prisma } from '@prisma/client';
import { TaskStatus, Priority } from '../common/enums';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(workspaceId: string, createdById: string, dto: CreateTaskDto) {
    const created = await this.prisma.$transaction(async (tx) => {
      const task = await tx.task.create({
        data: {
          workspaceId,
          createdById,
          title: dto.title.trim(),
          description: dto.description?.trim(),
          projectId: dto.projectId || null,
          status: dto.status || TaskStatus.TODO,
          priority: dto.priority || Priority.NONE,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
          reporterId: dto.reporterId || createdById,
          teamId: dto.teamId || null,
        },
      });

      if (dto.memberIds && dto.memberIds.length > 0) {
        await tx.taskMember.createMany({
          data: dto.memberIds.map((userId) => ({
            taskId: task.id,
            userId,
          })),
        });
      }

      if (dto.labelIds && dto.labelIds.length > 0) {
        await tx.taskLabel.createMany({
          data: dto.labelIds.map((labelId) => ({
            taskId: task.id,
            labelId,
          })),
        });
      }

      return task;
    });

    return this.findOne(workspaceId, created.id);
  }

  async findAll(workspaceId: string, query: TaskQueryDto) {
    const { page = 1, limit = 50, search, projectId, status, priority, memberId, teamId, labelId, reporterId, dueDate, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: Prisma.TaskWhereInput = {
      workspaceId,
      deletedAt: null,
    };

    if (projectId) {
      where.projectId = projectId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (status) {
      const statuses = status.split(',') as TaskStatus[];
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

    const [total, tasks] = await Promise.all([
      this.prisma.task.count({ where }),
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          project: { select: { id: true, name: true } },
          reporter: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
          team: { select: { id: true, name: true } },
          members: {
            include: {
              user: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
            },
          },
          labels: {
            include: {
              label: { select: { id: true, name: true, color: true } },
            },
          },
        },
      }),
    ]);

    const formatted = tasks.map((t) => ({
      id: t.id,
      workspaceId: t.workspaceId,
      projectId: t.projectId,
      project: t.project,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate,
      position: t.position,
      completedAt: t.completedAt,
      reporter: t.reporter,
      team: t.team,
      members: t.members.map((m) => m.user),
      labels: t.labels.map((l) => l.label),
    }));

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

  async findOne(workspaceId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, workspaceId, deletedAt: null },
      include: {
        project: { select: { id: true, name: true } },
        reporter: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
        team: { select: { id: true, name: true } },
        members: {
          include: {
            user: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
          },
        },
        labels: {
          include: {
            label: { select: { id: true, name: true, color: true } },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found.');
    }

    return {
      id: task.id,
      workspaceId: task.workspaceId,
      projectId: task.projectId,
      project: task.project,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      position: task.position,
      completedAt: task.completedAt,
      reporter: task.reporter,
      team: task.team,
      members: task.members.map((m) => m.user),
      labels: task.labels.map((l) => l.label),
    };
  }

  async update(workspaceId: string, taskId: string, dto: UpdateTaskDto) {
    await this.findOne(workspaceId, taskId);

    await this.prisma.$transaction(async (tx) => {
      const updateData: any = {
        ...(dto.title && { title: dto.title.trim() }),
        ...(dto.description !== undefined && { description: dto.description?.trim() }),
        ...(dto.projectId !== undefined && { projectId: dto.projectId }),
        ...(dto.priority && { priority: dto.priority }),
        ...(dto.dueDate !== undefined && { dueDate: dto.dueDate ? new Date(dto.dueDate) : null }),
        ...(dto.reporterId !== undefined && { reporterId: dto.reporterId }),
        ...(dto.teamId !== undefined && { teamId: dto.teamId }),
      };

      if (dto.status) {
        updateData.status = dto.status;
        if (dto.status === TaskStatus.COMPLETED) {
          updateData.completedAt = new Date();
        } else {
          updateData.completedAt = null;
        }
      }

      await tx.task.update({
        where: { id: taskId },
        data: updateData,
      });

      if (dto.memberIds !== undefined) {
        await tx.taskMember.deleteMany({ where: { taskId } });
        if (dto.memberIds.length > 0) {
          await tx.taskMember.createMany({
            data: dto.memberIds.map((userId) => ({ taskId, userId })),
          });
        }
      }

      if (dto.labelIds !== undefined) {
        await tx.taskLabel.deleteMany({ where: { taskId } });
        if (dto.labelIds.length > 0) {
          await tx.taskLabel.createMany({
            data: dto.labelIds.map((labelId) => ({ taskId, labelId })),
          });
        }
      }
    });

    return this.findOne(workspaceId, taskId);
  }

  async updateStatus(workspaceId: string, taskId: string, dto: UpdateTaskStatusDto) {
    await this.findOne(workspaceId, taskId);
    const completedAt = dto.status === TaskStatus.COMPLETED ? new Date() : null;

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        status: dto.status,
        completedAt,
      },
    });
  }

  async updatePosition(workspaceId: string, taskId: string, dto: UpdateTaskPositionDto) {
    await this.findOne(workspaceId, taskId);
    return this.prisma.task.update({
      where: { id: taskId },
      data: { position: dto.position },
    });
  }

  async remove(workspaceId: string, taskId: string) {
    await this.findOne(workspaceId, taskId);
    return this.prisma.task.update({
      where: { id: taskId },
      data: { deletedAt: new Date() },
    });
  }
}
