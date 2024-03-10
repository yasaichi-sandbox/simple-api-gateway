import { Controller, Get, Param } from '@nestjs/common';
import { SimpleUsersService } from './simple-users.service.ts';

@Controller('simple/users')
export class SimpleUsersController {
  constructor(private readonly simpleUsersService: SimpleUsersService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.simpleUsersService.findOneWithLatestPosts(id);
  }
}
