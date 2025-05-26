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
            baseURL: config.baseURL,
            headers: {
              'x-rapidapi-host': new URL(config.baseURL).host,
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
