import { Controller, Get, Param } from '@nestjs/common';
import { EffectiveUsersService } from './effective-users.service.ts';

@Controller('effective/users')
export class EffectiveUsersController {
  constructor(private readonly effectiveUsersService: EffectiveUsersService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.effectiveUsersService.findOneWithLatestPosts(id);
  }
}
