import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(): Promise<TeamDto[]> {
    const teams = await this.teamRepository.find();
    return teams.map(team => this.mapEntityToDto(team));
  }

  async findById(id: string): Promise<TeamDto> {
    const team = await this.teamRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return this.mapEntityToDto(team);
  }

  async update(id: string, team: TeamDto): Promise<TeamDto> {
    const teamToUpdate = await this.teamRepository.findOne({ where: { id } }); // Convertendo id para number
    if (!teamToUpdate) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    teamToUpdate.name = team.name;
    await this.teamRepository.save(teamToUpdate);

    return this.mapEntityToDto(teamToUpdate);
  }

  async delete(id: string): Promise<void> {
    const result = await this.teamRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
  }

  private mapEntityToDto(teamEntity: TeamEntity): TeamDto {
    const teamDto = new TeamDto();
    teamDto.id = teamEntity.id;
    teamDto.name = teamEntity.name;
    return teamDto;
  }
}
