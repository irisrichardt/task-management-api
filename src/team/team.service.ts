import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from '../db/entities/team.entity';
import { TeamDto } from './team.dto';

@Injectable()
export class TeamService {
  constructor(
    // eslint-disable-next-line prettier/prettier
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
  ) {}

  async create(team: TeamDto): Promise<TeamDto> {
    const teamToSave = new TeamEntity();
    teamToSave.name = team.name;

    const createdTeam = await this.teamRepository.save(teamToSave);
    return this.mapEntityToDto(createdTeam);
  }

  private mapEntityToDto(teamEntity: TeamEntity): TeamDto {
    const teamDto = new TeamDto();
    teamDto.id = teamEntity.id;
    teamDto.name = teamEntity.name;
    return teamDto;
  }
}
