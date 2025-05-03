import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { LinkedInProfile } from './types';

@Injectable()
export class LinkedinRepository {
  logger: any;
  private profileCache = new Map<string, LinkedInProfile>();

  constructor(private readonly httpService: HttpService) {
    console.log('HttpService baseURL:', this.httpService.axiosRef.defaults.baseURL);
  }

  private pickMedium(pics?: { url: string; width: number; height: number }[]): string {
    if (!pics || pics.length === 0) return '';

    // Prefer medium size (180–320 width)
    const medium = pics.find((p) => p.width >= 180 && p.width <= 320);
    if (medium?.url) return medium.url;

    // Fallback to largest available
    const sorted = [...pics].sort((a, b) => b.width - a.width);
    return sorted[0]?.url ?? '';
  }


  async getUserProfile(url: string): Promise<LinkedInProfile & { profilePicture: string }> {
    if (this.profileCache.has(url)) {
      return this.profileCache.get(url)! as LinkedInProfile & { profilePicture: string };
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
    try {
      const { data } = await this.httpService.axiosRef.get<{
        data: { items: any[] };
      }>('/similar-profiles', { params: { url: linkedinUrl } });

      return data.data.items.slice(0, max).map((it) => ({
        fullName: `${it.firstName ?? ''} ${it.lastName ?? ''}`.trim(),
        username: it.username ?? '',
        headline: it.headline ?? '',
        profileURL: `https://www.linkedin.com/in/${it.username ?? ''}`,
        profilePicture: this.pickMedium(it.profilePictures),
      }));
    } catch (error: any) {
      const message =
        error?.response?.data?.error ??
        error?.response?.data?.message ??
        error?.message ??
        'Unknown error';
      const statusCode = error?.response?.status ?? 'No status';
      const errorStack = error?.stack ?? 'No stack trace';

      console.error(`[getSimilarProfiles] Failed to fetch similar profiles`);
      console.error(`→ URL: ${linkedinUrl}`);
      console.error(`→ Status: ${statusCode}`);
      console.error(`→ Message: ${message}`);
      console.error(`→ Stack: ${errorStack}`);

      if (this.logger) {
        this.logger.error(`[getSimilarProfiles] ${message}`);
      }

      return;
    }
  }
}
