import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { LinkedInProfile, SimilarProfile } from './types';

@Injectable()
export class LinkedinRepository {
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

    return result;
  }

  async getSimilarProfiles(
    goalJob: string,
    location: string,
    linkedinUrl?: string,
    max = 4
  ) {
    const items = linkedinUrl
      ? await this.getSimilarProfilesByUrl(linkedinUrl)
      : await this.getSimilarProfilesByGoalJob(goalJob, location);

    if (!items) throw new NotFoundException('Data not found');

    return items.slice(0, max).map((it) => ({
      fullName:
        'fullName' in it
          ? it.fullName
          : `${it.firstName ?? ''} ${it.lastName ?? ''}`.trim(),
      headline: it.headline,
      profileURL:
        'profileURL' in it
          ? it.profileURL
          : `https://www.linkedin.com/in/${it.username ?? ''}`,
      profilePicture:
        'profilePicture' in it
          ? it.profilePicture
          : this.pickMedium(it.profilePictures),
    }));
  }

  private async getSimilarProfilesByUrl(url: string) {
    const {
      data: {
        data: { items },
      },
    } = await this.httpService.axiosRef.get<{
      data: {
        items: (Pick<SimilarProfile, 'headline'> & {
          username: string;
          firstName: string;
          lastName: string;
          profilePictures: { url: string; width: number; height: number }[];
        })[];
      };
    }>('/similar-profiles', { params: { url } });

    return items;
  }

  private async getSimilarProfilesByGoalJob(goalJob: string, location: string) {
    const geoId = await this.getGeoIdByLocation(location);
    const { data } = await this.httpService.axiosRef.get<{
      data: { items: SimilarProfile[] };
    }>('/search-people', {
      params: { keywordTitle: goalJob, geo: geoId, keywords: goalJob },
    });

    const results = data.data.items;
    if (results?.length < 5) {
      const extraSuggestions = await this.getSimilarProfilesByUrl(
        results[0].profileURL
      );
      return [...results, ...extraSuggestions.slice(0, 5 - results.length)];
    }

    return results;
  }

  private async getGeoIdByLocation(location: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<{ data: { items: { id: string }[] } }>(
        '/search-locations',
        { params: { keyword: location } }
      )
    );

    return data.data.items?.[0]?.id?.split(':')?.pop();
  }
}
