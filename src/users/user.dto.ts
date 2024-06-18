import {
  IsOptional,
  IsUUID,
} from 'class-validator';

export class UserDto {
  @IsUUID()
  @IsOptional()
  id: string;
  username: string;
  password: string;
  name: string;
  birthDate: Date;
  gender: 'male' | 'female' | 'other';
  email: string;
}

export interface CreateUserResponse {
  id: string;
  // eslint-disable-next-line prettier/prettier
  username;
}

export interface FindAllParameters {
  username: string;
  name: string;
}

export class UserRouteParameters {
  @IsUUID()
  id: string;
}
