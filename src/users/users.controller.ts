import { Body, Controller, Param, Post, Get, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto, FindAllParameters, UserRouteParameters } from './user.dto';

@Controller('users')
export class UsersController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() user: UserDto) {
    return this.usersService.create(user);
  }

  @Get( )
  async findAll(@Query() params: FindAllParameters): Promise<UserDto[]> {
    return this.usersService.findAll(params);
  }

  @Delete('/:id')
  remove(@Param() params: UserRouteParameters) {
    return this.usersService.remove(params.id);
  }

}
