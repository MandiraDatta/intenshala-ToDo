import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateViewPreferenceDto } from './dto/update-view-preference.dto';
import { EntityType, ViewType } from '../common/enums';

@Injectable()
export class PreferencesService {
  constructor(private prisma: PrismaService) {}

  async getPreference(userId: string, workspaceId: string, entityType: EntityType) {
    const pref = await this.prisma.userViewPreference.findUnique({
      where: {
        userId_workspaceId_entityType: {
          userId,
          workspaceId,
          entityType,
        },
      },
    });

    if (!pref) {
      return {
        entityType,
        viewType: ViewType.LIST,
        visibleFields: ['priority', 'members', 'dueDate', 'status', 'teams', 'labels', 'reporter'],
      };
    }

    let parsedFields = ['priority', 'members', 'dueDate', 'status', 'teams', 'labels', 'reporter'];
    try {
      if (pref.visibleFields) {
        parsedFields = JSON.parse(pref.visibleFields);
      }
    } catch {}

    return {
      ...pref,
      visibleFields: parsedFields,
    };
  }

  async updatePreference(userId: string, workspaceId: string, dto: UpdateViewPreferenceDto) {
    const fieldsStr = dto.visibleFields
      ? JSON.stringify(dto.visibleFields)
      : JSON.stringify(['priority', 'members', 'dueDate', 'status', 'teams', 'labels', 'reporter']);

    const res = await this.prisma.userViewPreference.upsert({
      where: {
        userId_workspaceId_entityType: {
          userId,
          workspaceId,
          entityType: dto.entityType,
        },
      },
      create: {
        userId,
        workspaceId,
        entityType: dto.entityType,
        viewType: dto.viewType || ViewType.LIST,
        visibleFields: fieldsStr,
      },
      update: {
        ...(dto.viewType && { viewType: dto.viewType }),
        ...(dto.visibleFields && { visibleFields: fieldsStr }),
      },
    });

    let parsedFields = ['priority', 'members', 'dueDate', 'status', 'teams', 'labels', 'reporter'];
    try {
      if (res.visibleFields) {
        parsedFields = JSON.parse(res.visibleFields);
      }
    } catch {}

    return {
      ...res,
      visibleFields: parsedFields,
    };
  }
}
