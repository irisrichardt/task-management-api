import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from '../db/entities/team.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity]), UsersModule],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
