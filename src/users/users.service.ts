import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindAllParameters, UserDto } from './user.dto';
import { hashSync as bcryptHashSync } from 'bcrypt';
import { UserEntity } from '../db/entities/user.entity';
import {  Repository, FindOptionsWhere, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    // eslint-disable-next-line prettier/prettier
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(newUser: UserDto): Promise<UserDto> {
    const userAlreadyRegistered = await this.findByUserName(newUser.username);

    if (userAlreadyRegistered) {
      throw new ConflictException(
        `User '${newUser.username}' already registered`,
      );
    }

    const userToSave = new UserEntity();
    userToSave.username = newUser.username;
    userToSave.passwordHash = bcryptHashSync(newUser.password, 10);
    userToSave.name = newUser.name;
    userToSave.birthDate = newUser.birthDate;
    userToSave.gender = newUser.gender;
    userToSave.email = newUser.email;

    const createdUser = await this.usersRepository.save(userToSave);

    return this.mapEntityToDto(createdUser);
  }

  async findById(id: string): Promise<UserDto> {
    const foundUser = await this.usersRepository.findOne({ where: { id } })

    if (!foundUser) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.mapEntityToDto(foundUser);
  }

  async findAll(params: FindAllParameters): Promise<UserDto[]> {
    const searchPrams: FindOptionsWhere<UserEntity> = {}

    if (params.username) {
      searchPrams.username = Like(`%${params.username}%`);
    }

    if (params.name) {
      searchPrams.name = Like(`%${params.name}%`);
    }

    const usersFound = await this.usersRepository.find({
      where: searchPrams
    });


    return usersFound.map(userEntity => this.mapEntityToDto(userEntity));
  }

  async findByUserName(username: string): Promise<UserDto | null> {
    const userFound = await this.usersRepository.findOne({
      where: { username },
    });

    if (!userFound) {
      return null;
    }

    return {
      id: userFound.id,
      username: userFound.username,
      password: userFound.passwordHash,
      name: userFound.name,
      birthDate: userFound.birthDate,
      gender: userFound.gender,
      email: userFound.email,
    };
  }

  async update(id: string, user: UserDto): Promise<UserDto> {
    const foundUser = await this.usersRepository.findOne({ where: { id } });

    if (!foundUser) {
      throw new HttpException(
        `User with id '${id}' not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const userEntity = this.mapDtoToEntity(user);

    // Atualiza a usuário com os novos valores
    await this.usersRepository.update(id, userEntity);

    // Busca a usuário atualizada para retornar
    const updatedUser = await this.usersRepository.findOne({ where: { id } });

    if (!updatedUser) {
      throw new HttpException(
        `User with id '${id}' not found after update`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.mapEntityToDto(updatedUser);
  }



  async remove(id: string) {

    const result = await this.usersRepository.delete(id)

    if (!result.affected) {
      throw new HttpException(
        `Task with id '${id}' not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private mapEntityToDto(userEntity: UserEntity): UserDto {
    const userDto = new UserDto();
    userDto.id = userEntity.id;
    userDto.username = userEntity.username;
    userDto.password = userEntity.passwordHash;
    userDto.name = userEntity.name;
    userDto.birthDate = userEntity.birthDate;
    userDto.gender = userEntity.gender;
    userDto.email = userEntity.email;

    return userDto;
  };

  private mapDtoToEntity(userDto: UserDto): Partial<UserEntity> {
    return {
      username: userDto.username,
      name: userDto.name,
      birthDate: userDto.birthDate,
      gender: userDto.gender,
      email: userDto.email,
    }
  }
}
