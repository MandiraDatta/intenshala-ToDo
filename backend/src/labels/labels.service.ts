import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';

@Injectable()
export class LabelsService {
  constructor(private prisma: PrismaService) {}

  getLabels(workspaceId: string) {
    return this.prisma.label.findMany({
      where: { workspaceId },
      orderBy: { name: 'asc' },
    });
  }

  async createLabel(workspaceId: string, dto: CreateLabelDto) {
    const existing = await this.prisma.label.findUnique({
      where: {
        workspaceId_name: { workspaceId, name: dto.name.trim() },
      },
    });

    if (existing) {
      throw new ConflictException('Label with this name already exists in workspace.');
    }

    return this.prisma.label.create({
      data: {
        workspaceId,
        name: dto.name.trim(),
        color: dto.color.trim(),
      },
    });
  }

  async updateLabel(workspaceId: string, labelId: string, dto: UpdateLabelDto) {
    const label = await this.prisma.label.findFirst({
      where: { id: labelId, workspaceId },
    });

    if (!label) {
      throw new NotFoundException('Label not found in workspace.');
    }

    return this.prisma.label.update({
      where: { id: labelId },
      data: {
        ...(dto.name && { name: dto.name.trim() }),
        ...(dto.color && { color: dto.color.trim() }),
      },
    });
  }

  async deleteLabel(workspaceId: string, labelId: string) {
    const label = await this.prisma.label.findFirst({
      where: { id: labelId, workspaceId },
    });

    if (!label) {
      throw new NotFoundException('Label not found in workspace.');
    }

    return this.prisma.label.delete({
      where: { id: labelId },
    });
  }
}
