import { UsersRepository } from '@jobie/users/nestjs';
import { Injectable } from '@nestjs/common';
import { EnrichUserProfileDto } from '../dto/enrich-user-profile.dto';
@Injectable()
export class ProfileService {
  constructor(private readonly usersRepository: UsersRepository) {}

  enrichUserProfile(userId: string, data: EnrichUserProfileDto) {
    return this.usersRepository.update(userId, data);
  }
}
