import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { WorkspaceMemberGuard } from '../workspaces/guards/workspace-member.guard';

@Controller('workspaces/:workspaceId/teams')
@UseGuards(WorkspaceMemberGuard)
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Get()
  getTeams(@Param('workspaceId') workspaceId: string) {
    return this.teamsService.getTeams(workspaceId);
  }

  @Post()
  createTeam(@Param('workspaceId') workspaceId: string, @Body() dto: CreateTeamDto) {
    return this.teamsService.createTeam(workspaceId, dto);
  }

  @Patch(':teamId')
  updateTeam(
    @Param('workspaceId') workspaceId: string,
    @Param('teamId') teamId: string,
    @Body() dto: UpdateTeamDto,
  ) {
    return this.teamsService.updateTeam(workspaceId, teamId, dto);
  }

  @Delete(':teamId')
  deleteTeam(@Param('workspaceId') workspaceId: string, @Param('teamId') teamId: string) {
    return this.teamsService.deleteTeam(workspaceId, teamId);
  }
}
