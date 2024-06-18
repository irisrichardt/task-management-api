import { Controller, Post, Body } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamDto } from './team.dto';

@Controller('teams')
export class TeamController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly teamService: TeamService) {}

  @Post()
  async createTeam(@Body() newTeam: TeamDto): Promise<TeamDto> {
    return this.teamService.create(newTeam);
  }
}
