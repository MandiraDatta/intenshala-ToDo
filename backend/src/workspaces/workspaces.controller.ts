import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { CurrentUser } from '../common/decorators/user.decorator';
import { WorkspaceMemberGuard } from './guards/workspace-member.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Get()
  getUserWorkspaces(@CurrentUser('id') userId: string) {
    return this.workspacesService.getUserWorkspaces(userId);
  }

  @Post()
  createWorkspace(@CurrentUser('id') userId: string, @Body() dto: CreateWorkspaceDto) {
    return this.workspacesService.createWorkspace(userId, dto);
  }

  @Get(':workspaceId')
  @UseGuards(WorkspaceMemberGuard)
  getWorkspace(@Param('workspaceId') workspaceId: string) {
    return this.workspacesService.getWorkspaceById(workspaceId);
  }

  @Post(':workspaceId/leave')
  @UseGuards(WorkspaceMemberGuard)
  leaveWorkspace(@Param('workspaceId') workspaceId: string, @CurrentUser('id') userId: string) {
    return this.workspacesService.leaveWorkspace(workspaceId, userId);
  }

  @Get(':workspaceId/members')
  @UseGuards(WorkspaceMemberGuard)
  getMembers(@Param('workspaceId') workspaceId: string, @Query('q') search?: string) {
    return this.workspacesService.getMembers(workspaceId, search);
  }

  @Post(':workspaceId/members')
  @UseGuards(WorkspaceMemberGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  addMember(@Param('workspaceId') workspaceId: string, @Body() dto: AddMemberDto) {
    return this.workspacesService.addMember(workspaceId, dto);
  }

  @Patch(':workspaceId/members/:memberId')
  @UseGuards(WorkspaceMemberGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  updateMemberRole(
    @Param('workspaceId') workspaceId: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.workspacesService.updateMemberRole(workspaceId, memberId, dto);
  }

  @Delete(':workspaceId/members/:memberId')
  @UseGuards(WorkspaceMemberGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  removeMember(@Param('workspaceId') workspaceId: string, @Param('memberId') memberId: string) {
    return this.workspacesService.removeMember(workspaceId, memberId);
  }
}
