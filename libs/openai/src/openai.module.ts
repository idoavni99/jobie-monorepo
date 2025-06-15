import { GoogleGenAIOptions } from '@google/genai';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  OPENAI_PROVIDER_KEY,
  OpenAIConfig,
  openAIConfig,
} from './openai.config';
import { OpenAIRepository } from './openai.repository';

@Module({})
export class OpenAIModule {
  static register(options: GoogleGenAIOptions = {}): DynamicModule {
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
        OpenAIRepository,
      ],
      exports: [OpenAIRepository],
    };
  }
}
