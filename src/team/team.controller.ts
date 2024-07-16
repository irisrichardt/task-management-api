import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamDto, TeamRouteParameters  } from './team.dto';

@Controller('teams')
export class TeamController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async findAll(): Promise<TeamDto[]> {
    return this.teamService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<TeamDto> {
    return this.teamService.findById(id);
  }

  @Post()
  async create(@Body() team: TeamDto): Promise<TeamDto> {
    return this.teamService.create(team);
  }

  @Put(':id')
  async update(@Param() params: TeamRouteParameters, @Body() team: TeamDto): Promise<TeamDto> {
    await this.teamService.update(params.id, team);
    return this.teamService.findById(params.id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.teamService.delete(id);
  }
}
