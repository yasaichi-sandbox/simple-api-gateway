import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { NaiveUsersService } from './naive-users.service.ts';

@Controller('naive/users')
export class NaiveUsersController {
  constructor(private readonly simpleUsersService: NaiveUsersService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.simpleUsersService.findOne(id);
  }
}
