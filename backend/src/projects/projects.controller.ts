import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { UpdateProjectPositionDto } from './dto/update-project-position.dto';
import { WorkspaceMemberGuard } from '../workspaces/guards/workspace-member.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('workspaces/:workspaceId/projects')
@UseGuards(WorkspaceMemberGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  create(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectsService.create(workspaceId, userId, dto);
  }

  @Get()
  findAll(
    @Param('workspaceId') workspaceId: string,
    @Query() query: ProjectQueryDto,
    @Request() req: any,
  ) {
    const requesterId: string = req.user?.id;
    const requesterRole: string = req.workspaceMember?.role;
    return this.projectsService.findAll(workspaceId, query, requesterId, requesterRole);
  }

  @Get('filters')
  getFilters(@Param('workspaceId') workspaceId: string) {
    return this.projectsService.getFilterOptions(workspaceId);
  }

  @Get(':projectId')
  findOne(@Param('workspaceId') workspaceId: string, @Param('projectId') projectId: string) {
    return this.projectsService.findOne(workspaceId, projectId);
  }

  @Patch(':projectId')
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(workspaceId, projectId, dto);
  }

  @Patch(':projectId/status')
  updateStatus(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Body() dto: UpdateProjectStatusDto,
  ) {
    return this.projectsService.updateStatus(workspaceId, projectId, dto);
  }

  @Patch(':projectId/position')
  updatePosition(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Body() dto: UpdateProjectPositionDto,
  ) {
    return this.projectsService.updatePosition(workspaceId, projectId, dto);
  }

  @Delete(':projectId')
  remove(@Param('workspaceId') workspaceId: string, @Param('projectId') projectId: string) {
    return this.projectsService.remove(workspaceId, projectId);
  }
}
