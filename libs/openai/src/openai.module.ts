import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientOptions } from 'openai';
import {
  OPENAI_PROVIDER_KEY,
  OpenAIConfig,
  openAIConfig,
} from './openai.config';
import { OpenAIRepository } from './openai.repository';

@Module({})
export class OpenAIModule {
  static register(options: ClientOptions = {}): DynamicModule {
    return {
      module: OpenAIModule,
      imports: [ConfigModule.forFeature(openAIConfig)],
      providers: [
        {
          inject: [OPENAI_PROVIDER_KEY],
          useFactory: (config: OpenAIConfig) => ({
            ...config,
            ...options,
          }),
          provide: 'GIVEN_OPENAI_CONFIG',
        },
        {
          provide: OpenAIRepository,
          inject: [{ token: 'GIVEN_OPENAI_CONFIG', optional: false }],
          useFactory: (config: ClientOptions) =>
            new OpenAIRepository(config.apiKey as string, config),
        },
      ],
      exports: [OpenAIRepository],
    };
  }
}
