import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { WorkspaceMemberGuard } from '../workspaces/guards/workspace-member.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller()
export class InvitesController {
  constructor(private invitesService: InvitesService) {}

  @Post('workspaces/:workspaceId/invites')
  @UseGuards(WorkspaceMemberGuard)
  createInvite(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser('id') inviterId: string,
    @Body() dto: CreateInviteDto,
  ) {
    return this.invitesService.createInvite(workspaceId, inviterId, dto);
  }

  @Public()
  @Get('invites/:token')
  getInvite(@Param('token') token: string) {
    return this.invitesService.getInviteByToken(token);
  }

  @Post('invites/accept')
  acceptInvite(
    @CurrentUser('id') userId: string,
    @Body() dto: AcceptInviteDto,
  ) {
    return this.invitesService.acceptInvite(userId, dto.token);
  }

  @Get('workspaces/:workspaceId/members')
  @UseGuards(WorkspaceMemberGuard)
  getWorkspaceMembers(@Param('workspaceId') workspaceId: string) {
    return this.invitesService.getWorkspaceMembers(workspaceId);
  }
}
