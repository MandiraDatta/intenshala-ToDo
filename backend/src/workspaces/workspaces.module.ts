import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { WorkspaceMemberGuard } from './guards/workspace-member.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  controllers: [WorkspacesController],
  providers: [WorkspacesService, WorkspaceMemberGuard, RolesGuard],
  exports: [WorkspacesService, WorkspaceMemberGuard, RolesGuard],
})
export class WorkspacesModule {}
