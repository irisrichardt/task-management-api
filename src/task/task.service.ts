import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindAllParameters, TaskDto, TaskStatusEnum } from './task.dto';
import { TaskEntity } from '../db/entities/task.entity';
import {  Repository, FindOptionsWhere, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskService {
  // eslint-disable-next-line prettier/prettier
  private tasks: TaskDto[] = [];

  constructor(
    // eslint-disable-next-line prettier/prettier
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) { }

  async create(task: TaskDto): Promise<TaskDto> {
    const taskToSave: TaskEntity = {
      title: task.title,
      description: task.description,
      status: task.status,
      expirationDate: task.expirationDate,
    }

    const createdTask = await this.taskRepository.save(taskToSave);
    return this.mapEntityToDto(createdTask);
  }


  async findById(id: string): Promise<TaskDto> {
    const foundTask = await this.taskRepository.findOne({ where: { id } })

    if (!foundTask) {
      throw new HttpException(
        `Task with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.mapEntityToDto(foundTask);
  }

  async findAll(params: FindAllParameters): Promise<TaskDto[]> {
    const searchPrams: FindOptionsWhere<TaskEntity> = {}

    if (params.title) {
      searchPrams.title = Like(`%${params.title}%`);
    }

    if (params.status) {
      searchPrams.status = Like(`%${params.status}%`);
    }

    const tasksFound = await this.taskRepository.find({
      where: searchPrams
    });


    return tasksFound.map(taskEntity => this.mapEntityToDto(taskEntity));
  }

  async update(id: string, task: TaskDto): Promise<TaskDto> {
    const foundTask = await this.taskRepository.findOne({ where: { id } });

    if (!foundTask) {
      throw new HttpException(
        `Task with id '${id}' not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Atualiza a tarefa com os novos valores
    await this.taskRepository.update(id, this.mapDtoToEntity(task));

    // Busca a tarefa atualizada para retornar
    const updatedTask = await this.taskRepository.findOne({ where: { id } });

    if (!updatedTask) {
      throw new HttpException(
        `Task with id '${id}' not found after update`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.mapEntityToDto(updatedTask);
  }

  async remove(id: string) {

    const result = await this.taskRepository.delete(id)

    if (!result.affected) {
      throw new HttpException(
        `Task with id '${id}' not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private mapEntityToDto(taskEntity: TaskEntity): TaskDto {
    return {
      id: taskEntity.id,
      title: taskEntity.title,
      description: taskEntity.description,
      status: TaskStatusEnum[taskEntity.status],
      expirationDate: taskEntity.expirationDate,

    }
  }

  private mapDtoToEntity(taskDto: TaskDto): Partial<TaskEntity> {
    return {
      title: taskDto.title,
      description: taskDto.description,
      status: taskDto.status.toString(),
      expirationDate: taskDto.expirationDate,
    }
  }
}
