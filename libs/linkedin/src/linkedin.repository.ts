import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { LinkedInProfile } from './types';

@Injectable()
export class LinkedinRepository {
  constructor(private readonly httpService: HttpService) {}

  async getUserProfile(url: string) {
    const response = await this.httpService.axiosRef.get<LinkedInProfile>(
      '/get-profile-data-by-url',
      {
        params: { url },
      }
    );

    return response.data;
  }
}
