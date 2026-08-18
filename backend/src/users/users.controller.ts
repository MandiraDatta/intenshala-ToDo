import { Controller, Get, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('me')
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Patch('me/preferences')
  updatePreferences(@CurrentUser('id') userId: string, @Body() dto: UpdatePreferencesDto) {
    return this.usersService.updatePreferences(userId, dto);
  }

  @Patch('me/avatar')
  updateAvatar(@CurrentUser('id') userId: string, @Body('avatarUrl') avatarUrl: string) {
    return this.usersService.updateAvatar(userId, avatarUrl);
  }
}
