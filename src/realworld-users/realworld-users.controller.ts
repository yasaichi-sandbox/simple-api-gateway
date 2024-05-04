import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RealworldUsersService } from './realworld-users.service.ts';

@Controller('realworld/users')
export class RealworldUsersController {
  constructor(private readonly realworldUsersService: RealworldUsersService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.realworldUsersService.findOne(id);
  }
}
