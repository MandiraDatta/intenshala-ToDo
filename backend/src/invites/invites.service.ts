import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class InvitesService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async createInvite(workspaceId: string, inviterId: string, dto: CreateInviteDto) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found.');
    }

    const inviter = await this.prisma.user.findUnique({
      where: { id: inviterId },
    });

    const targetEmail = dto.email.trim().toLowerCase();

    // Allow sending invite email to existing users so they can accept task/workspace invitation

    // Generate token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    // Save invite to DB
    const invite = await this.prisma.workspaceInvite.create({
      data: {
        workspaceId,
        invitedById: inviterId,
        email: targetEmail,
        role: dto.role || 'MEMBER',
        taskId: dto.taskId || null,
        projectId: dto.projectId || null,
        token,
        expiresAt,
        status: 'PENDING',
      } as any,
    });

    // Send email via Resend
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const inviteLink = `${baseUrl}/invite/accept?token=${token}`;

    const mailResult = await this.mailService.sendWorkspaceInvite({
      toEmail: targetEmail,
      inviterName: inviter?.fullName || inviter?.username || 'Workspace Owner',
      workspaceName: workspace.name,
      inviteLink,
    });

    return {
      message: 'Invitation sent successfully.',
      inviteId: invite.id,
      email: invite.email,
      inviteLink,
      mailResult,
    };
  }

  async getInviteByToken(token: string) {
    const invite = await this.prisma.workspaceInvite.findUnique({
      where: { token },
      include: {
        workspace: { select: { id: true, name: true, avatarUrl: true } },
        invitedBy: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
      },
    });

    if (!invite) {
      throw new NotFoundException('Invitation not found or invalid token.');
    }

    if (invite.status !== 'PENDING') {
      throw new BadRequestException(`Invitation has already been ${invite.status.toLowerCase()}.`);
    }

    if (invite.expiresAt < new Date()) {
      await this.prisma.workspaceInvite.update({
        where: { id: invite.id },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('Invitation has expired.');
    }

    return invite;
  }

  async acceptInvite(userId: string, token: string) {
    const invite = await this.getInviteByToken(token);
    const targetInvite = invite as any;

    // Upsert membership for user in workspace
    const membership = await this.prisma.workspaceMember.upsert({
      where: {
        workspaceId_userId: {
          workspaceId: invite.workspaceId,
          userId,
        },
      },
      create: {
        workspaceId: invite.workspaceId,
        userId,
        role: invite.role,
      },
      update: {
        role: invite.role,
      },
      include: {
        workspace: true,
      },
    });

    // If invite was for a specific task, assign user to task_members
    if (targetInvite.taskId) {
      await this.prisma.taskMember.upsert({
        where: {
          taskId_userId: {
            taskId: targetInvite.taskId,
            userId,
          },
        },
        create: {
          taskId: targetInvite.taskId,
          userId,
        },
        update: {},
      }).catch(() => {});
    }

    // If invite was for a specific project, assign user to project_members
    if (targetInvite.projectId) {
      await this.prisma.projectMember.upsert({
        where: {
          projectId_userId: {
            projectId: targetInvite.projectId,
            userId,
          },
        },
        create: {
          projectId: targetInvite.projectId,
          userId,
        },
        update: {},
      }).catch(() => {});
    }

    // Mark invite accepted
    await this.prisma.workspaceInvite.update({
      where: { id: invite.id },
      data: { status: 'ACCEPTED' },
    });

    return {
      message: 'Invitation accepted successfully.',
      workspace: membership.workspace,
    };
  }

  async getWorkspaceMembers(workspaceId: string) {
    const members = await this.prisma.workspaceMember.findMany({
      where: { workspaceId },
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
    });

    return members.map((m) => ({
      id: m.id,
      userId: m.userId,
      role: m.role,
      fullName: m.user.fullName || m.user.username,
      username: m.user.username,
      email: m.user.email,
      title: m.user.title,
      avatarUrl: m.user.avatarUrl,
    }));
  }
}
