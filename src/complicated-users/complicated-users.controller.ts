import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ComplicatedUsersService } from './complicated-users.service.ts';

@Controller('complicated/users')
export class ComplicatedUsersController {
  constructor(
    private readonly complicatedUsersService: ComplicatedUsersService,
  ) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.complicatedUsersService.findOne(id);
  }
}
