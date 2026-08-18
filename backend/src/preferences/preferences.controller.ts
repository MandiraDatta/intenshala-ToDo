import { Controller, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { UpdateViewPreferenceDto } from './dto/update-view-preference.dto';
import { WorkspaceMemberGuard } from '../workspaces/guards/workspace-member.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { EntityType } from '../common/enums';

@Controller('workspaces/:workspaceId/view-preferences')
@UseGuards(WorkspaceMemberGuard)
export class PreferencesController {
  constructor(private preferencesService: PreferencesService) {}

  @Get()
  getPreference(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser('id') userId: string,
    @Query('entityType') entityType: EntityType = EntityType.PROJECT,
  ) {
    return this.preferencesService.getPreference(userId, workspaceId, entityType);
  }

  @Put()
  updatePreference(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateViewPreferenceDto,
  ) {
    return this.preferencesService.updatePreference(userId, workspaceId, dto);
  }
}
