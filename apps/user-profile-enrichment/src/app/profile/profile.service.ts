import { LinkedinRepository } from '@jobie/linkedin/linkedin.repository';
import { UsersRepository } from '@jobie/users/nestjs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EnrichUserProfileUpdateDto } from '../dto/enrich-user-profile-update.dto';
import { EnrichUserProfileDto } from '../dto/enrich-user-profile.dto';
@Injectable()
export class ProfileService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly linkedinRepository: LinkedinRepository
  ) {}

  async deleteUser(userId: string) {
    return this.usersRepository.delete(userId);
  }

  async enrichUserProfile(userId: string, data: EnrichUserProfileDto) {
    try {
      const linkedinProfile = await this.linkedinRepository.getUserProfile(
        data.linkedinProfileUrl
      );

      // Build extracted fields
      const linkedinFullName = `${linkedinProfile.firstName ?? ''} ${
        linkedinProfile.lastName ?? ''
      }`.trim();
      const linkedinHeadline = linkedinProfile.headline ?? '';
      const linkedinLocation = linkedinProfile.geo?.full ?? '';
      const linkedinProfilePictureUrl =
        linkedinProfile.profilePictures?.[0]?.url ?? '';
      const skills = linkedinProfile.skills?.map((s) => s.name) ?? [];

      const linkedinPositions =
        linkedinProfile.position?.map((pos) => ({
          title: pos?.title ?? '',
          companyName: pos?.companyName ?? '',
          startDate: pos?.start?.year?.toString() ?? '',
          endDate: pos?.end?.year?.toString() ?? '',
        })) ?? [];

      const linkedinEducations =
        linkedinProfile.educations?.map((edu) => ({
          schoolName: edu?.schoolName ?? '',
          degreeName: edu?.degree ?? '',
          fieldOfStudy: edu?.fieldOfStudy ?? '',
          startDate: edu?.start?.year ? edu.start.year.toString() : '',
          endDate: edu?.end?.year ? edu.end.year.toString() : '',
        })) ?? [];

      // Save LinkedIn data to the user
      return this.usersRepository.update(userId, {
        ...data,
        linkedinFullName,
        linkedinHeadline,
        linkedinLocation,
        linkedinProfilePictureUrl,
        skills,
        linkedinPositions,
        linkedinEducations,
      });
    } catch (error) {
      console.error('Failed to enrich user with LinkedIn profile:', error);
      throw new InternalServerErrorException(
        'Something went wrong with the enrichment'
      );
    }
  }
  async updateEnrichUserProfile(
    userId: string,
    data: EnrichUserProfileUpdateDto
  ) {
    return this.usersRepository.update(userId, data);
  }
}
