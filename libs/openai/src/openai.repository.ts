import { Injectable } from '@nestjs/common';
import { ClientOptions, OpenAI } from 'openai';
import { safeJSON } from 'openai/core';

@Injectable()
export class OpenAIRepository {
  private readonly openai: OpenAI;

  constructor(
    apiKey: string,
    extraOptions: Omit<ClientOptions, 'apiKey' | 'baseURL'> = {}
  ) {
    this.openai = new OpenAI({
      apiKey,
      ...extraOptions,
    });
  }

  async requestPrompt(initializationPrompt: string, contentPrompt: string) {
    const result = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: initializationPrompt,
        },
        { role: 'user', content: contentPrompt },
      ],
    });

    const content = result.choices?.[0]?.message?.content?.trim() ?? '';

    if (content.startsWith('```json')) return content.slice(7);
    if (content.endsWith('```')) return content.slice(0, -3);
    return content;
  }

  async requestPromptJSON<T>(
    initializationPrompt: string,
    contentPrompt: string
  ) {
    return safeJSON(
      await this.requestPrompt(initializationPrompt, contentPrompt)
    ) as T;
  }
}
