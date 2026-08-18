import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { WorkspaceMemberGuard } from '../workspaces/guards/workspace-member.guard';

@Controller('workspaces/:workspaceId/labels')
@UseGuards(WorkspaceMemberGuard)
export class LabelsController {
  constructor(private labelsService: LabelsService) {}

  @Get()
  getLabels(@Param('workspaceId') workspaceId: string) {
    return this.labelsService.getLabels(workspaceId);
  }

  @Post()
  createLabel(@Param('workspaceId') workspaceId: string, @Body() dto: CreateLabelDto) {
    return this.labelsService.createLabel(workspaceId, dto);
  }

  @Patch(':labelId')
  updateLabel(
    @Param('workspaceId') workspaceId: string,
    @Param('labelId') labelId: string,
    @Body() dto: UpdateLabelDto,
  ) {
    return this.labelsService.updateLabel(workspaceId, labelId, dto);
  }

  @Delete(':labelId')
  deleteLabel(@Param('workspaceId') workspaceId: string, @Param('labelId') labelId: string) {
    return this.labelsService.deleteLabel(workspaceId, labelId);
  }
}
