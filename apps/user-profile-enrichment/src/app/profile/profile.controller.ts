import { AuthUser } from '@jobie/auth-core';
import { TUser } from '@jobie/users/types';
import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { EnrichUserProfileUpdateDto } from '../dto/enrich-user-profile-update.dto';
import { EnrichUserProfileDto } from '../dto/enrich-user-profile.dto';
import { ProfileService } from './profile.service';

@Controller('')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('')
  enrichUserProfile(
    @AuthUser() user: TUser,
    @Body() data: EnrichUserProfileDto
  ) {
    return this.profileService.enrichUserProfile(user._id, data);
  }

  @Put('')
  updateUserProfile(
    @AuthUser() user: TUser,
    @Body() data: EnrichUserProfileUpdateDto
  ) {
    return this.profileService.updateEnrichUserProfile(user._id, data);
  }

  @Delete()
  deleteUser(@AuthUser() user: TUser) {
    return this.profileService.deleteUser(user._id);
  }
}
