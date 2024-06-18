import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { TeamEntity } from './team.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar', name: 'password_hash' })
  passwordHash: string;

  @Column()
  name: string;

  @Column({ type: 'date', name: 'birth_date' })
  birthDate: Date;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'] })
  gender: 'male' | 'female' | 'other';

  @Column()
  email: string;

  @ManyToMany(() => TeamEntity, (team) => team.members)
  teams: TeamEntity[];
}
