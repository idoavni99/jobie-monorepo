import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LinkedInProfile } from './types';

@Injectable()
export class LinkedinRepository {
  private profileCache = new Map<string, LinkedInProfile>();
  private logger = new Logger(LinkedinRepository.constructor.name);

  constructor(private readonly httpService: HttpService) {
    this.logger.log(
      'HttpService baseURL:',
      this.httpService.axiosRef.defaults.baseURL
    );
  }

  private pickMedium(
    pics?: { url: string; width: number; height: number }[]
  ): string {
    if (!pics || pics.length === 0) return '';

    // Prefer medium size (180–320 width)
    const medium = pics.find((p) => p.width >= 180 && p.width <= 320);
    if (medium?.url) return medium.url;

    // Fallback to largest available
    const sorted = pics.toSorted((a, b) => b.width - a.width);
    return sorted[0]?.url ?? '';
  }

  async getUserProfile(
    url: string
  ): Promise<LinkedInProfile & { profilePicture: string }> {
    if (this.profileCache.has(url)) {
      return this.profileCache.get(url) as LinkedInProfile & {
        profilePicture: string;
      };
    }

    const response = await this.httpService.axiosRef.get<LinkedInProfile>(
      '/get-profile-data-by-url',
      { params: { url } }
    );

    const profile = response.data;

    const profilePicture = this.pickMedium(profile.profilePictures);
    const result = {
      ...profile,
      profilePicture,
    };

    this.profileCache.set(url, result);
    return result;
  }

  async getSimilarProfiles(linkedinUrl: string, max = 4) {
    const {
      data: {
        data: { items },
      },
    } = await this.httpService.axiosRef.get<{
      data: { items: any[] };
    }>('/similar-profiles', { params: { url: linkedinUrl } });

    if (!items) throw new NotFoundException('Data not found');

    return items.slice(0, max).map((it) => ({
      fullName: `${it.firstName ?? ''} ${it.lastName ?? ''}`.trim(),
      username: it.username ?? '',
      headline: it.headline ?? '',
      profileURL: `https://www.linkedin.com/in/${it.username ?? ''}`,
      profilePicture: this.pickMedium(it.profilePictures),
    }));
  }
}
