import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskPositionDto } from './dto/update-task-position.dto';
import { WorkspaceMemberGuard } from '../workspaces/guards/workspace-member.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('workspaces/:workspaceId/tasks')
@UseGuards(WorkspaceMemberGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  create(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create(workspaceId, userId, dto);
  }

  @Get()
  findAll(
    @Param('workspaceId') workspaceId: string,
    @Query() query: TaskQueryDto,
    @Request() req: any,
  ) {
    const requesterId: string = req.user?.id;
    const requesterRole: string = req.workspaceMember?.role;
    return this.tasksService.findAll(workspaceId, query, requesterId, requesterRole);
  }

  @Get(':taskId')
  findOne(@Param('workspaceId') workspaceId: string, @Param('taskId') taskId: string) {
    return this.tasksService.findOne(workspaceId, taskId);
  }

  @Patch(':taskId')
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(workspaceId, taskId, dto);
  }

  @Patch(':taskId/status')
  updateStatus(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskStatusDto,
  ) {
    return this.tasksService.updateStatus(workspaceId, taskId, dto);
  }

  @Patch(':taskId/position')
  updatePosition(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskPositionDto,
  ) {
    return this.tasksService.updatePosition(workspaceId, taskId, dto);
  }

  @Delete(':taskId')
  remove(@Param('workspaceId') workspaceId: string, @Param('taskId') taskId: string) {
    return this.tasksService.remove(workspaceId, taskId);
  }
}
