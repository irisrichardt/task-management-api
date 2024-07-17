import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from '../db/entities/team.entity';
import { UserEntity } from '../db/entities/user.entity';
import { TeamDto } from './team.dto';

@Injectable()
export class TeamService {
  constructor(
    // eslint-disable-next-line prettier/prettier
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(team: TeamDto): Promise<TeamDto> {
    const teamToSave = new TeamEntity();
    teamToSave.name = team.name;

    const createdTeam = await this.teamRepository.save(teamToSave);
    return this.mapEntityToDto(createdTeam);
  }

  async findAll(): Promise<TeamDto[]> {
    const teams = await this.teamRepository.find({ relations: ['members'] });
    return teams.map(team => this.mapEntityToDto(team));
  }

  async findById(id: string): Promise<TeamDto> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['members'], // Inclua os membros na busca
    });
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return this.mapEntityToDto(team);
  }

  async update(id: string, team: TeamDto): Promise<TeamDto> {
    const teamToUpdate = await this.teamRepository.findOne({ where: { id } });
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

  async addMemberToTeam(teamId: string, userId: string): Promise<TeamEntity> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
      relations: ['members'],
    });

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (team && user) {
      team.members.push(user);
      return this.teamRepository.save(team);
    }

    throw new Error('Team or User not found');
  }

  async removeMemberFromTeam(teamId: string, userId: string): Promise<TeamDto> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
      relations: ['members'],
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Remove o usuário da lista de membros da equipe
    team.members = team.members.filter(member => member.id !== userId);

    // Salva a equipe atualizada no banco de dados
    await this.teamRepository.save(team);

    // Retorna a equipe atualizada
    return this.mapEntityToDto(team);
  }

  private mapEntityToDto(teamEntity: TeamEntity): TeamDto {
    const teamDto = new TeamDto();
    teamDto.id = teamEntity.id;
    teamDto.name = teamEntity.name;
    teamDto.members = teamEntity.members?.map(member => ({
      id: member.id,
      username: member.username,
    }));
    return teamDto;
  }
}
