import { Body, Controller, Get, Param, Post, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { FindAllParameters, TaskDto, TaskRouteParameters } from './task.dto';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() task: TaskDto): Promise<TaskDto> {
   return await this.taskService.create(task);
  }

  @Get('/:id')
  async findById(@Param('id') id:string): Promise<TaskDto> {
    return this.taskService.findById(id);
  }

  @Get( )
  async findAll(@Query() params: FindAllParameters): Promise<TaskDto[]> {
    return this.taskService.findAll(params);
  }

  @Put('/:id')
  async update(@Param() params: TaskRouteParameters, @Body() task: TaskDto) {
    await this.taskService.update(params.id, task);
    return this.taskService.findById(params.id);
  }

  @Delete('/:id')
  remove(@Param() params: TaskRouteParameters) {
    return this.taskService.remove(params.id);
  }

}
