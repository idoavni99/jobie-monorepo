import { LinkedinRepository } from '@jobie/linkedin';
import { UsersRepository } from '@jobie/users/nestjs';
import { Injectable } from '@nestjs/common';
import { EnrichUserProfileDto } from '../dto/enrich-user-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly linkedinRepository: LinkedinRepository,
  ) { }

  async enrichUserProfile(userId: string, data: EnrichUserProfileDto) {
    // 1. Save the initial profile info provided in the setup form
    const updatedUser = await this.usersRepository.update(userId, data);

    // 2. Enrich with LinkedIn profile data if linkedinProfileUrl is provided
    if (updatedUser?.linkedinProfileUrl) {
      try {
        const linkedinProfile = await this.linkedinRepository.getUserProfile(updatedUser.linkedinProfileUrl);

        // Build extracted fields
        const linkedinFullName = `${linkedinProfile.firstName ?? ''} ${linkedinProfile.lastName ?? ''}`.trim();
        const linkedinHeadline = linkedinProfile.headline ?? '';
        const linkedinLocation = linkedinProfile.geo?.full ?? '';
        const linkedinProfilePictureUrl = linkedinProfile.profilePictures?.[0]?.url ?? '';
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
        await this.usersRepository.update(userId, {
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
        // Allow the profile enrichment process to continue
      }
    }

    return updatedUser;
  }

}
