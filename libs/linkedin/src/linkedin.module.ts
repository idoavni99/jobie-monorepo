import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LinkedinConfig, linkedinConfig } from './linkedin.config';
import { LinkedinRepository } from './linkedin.repository';

@Module({})
export class LinkedinModule {
  static register(): DynamicModule {
    return {
      module: LinkedinModule,
      imports: [
        HttpModule.registerAsync({
          imports: [ConfigModule.forFeature(linkedinConfig)],
          useFactory: (config: LinkedinConfig) => ({
            baseURL: config.baseURL || 'https://linkedin-api8.p.rapidapi.com', // fallback 
            headers: {
              'x-rapidapi-host': 'linkedin-api8.p.rapidapi.com',
              'x-rapidapi-key': config.apiKey,
            },
          }),
          inject: [linkedinConfig.KEY],
        }),
      ],
      providers: [LinkedinRepository],
      exports: [LinkedinRepository],
    };
  }
}
