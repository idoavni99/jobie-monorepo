import { GoogleGenAI, GoogleGenAIOptions } from '@google/genai';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OpenAIRepository {
  private readonly openai: GoogleGenAI;
  private readonly logger = new Logger(OpenAIRepository.name);

  constructor(@Inject('GIVEN_OPENAI_CONFIG') config: GoogleGenAIOptions) {
    this.openai = new GoogleGenAI(config);
  }

  async requestPrompt(initializationPrompt: string, contentPrompt: string) {
    const result = await this.openai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'model',
          parts: [
            {
              text: initializationPrompt,
            },
          ],
        },
        { role: 'user', parts: [{ text: contentPrompt }] },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    this.logger.log(result);

    return result.text ?? '';
  }

  async requestPromptJSON<T>(
    initializationPrompt: string,
    contentPrompt: string
  ) {
    const textResult = await this.requestPrompt(
      initializationPrompt,
      contentPrompt
    );
    const parsedResult = this.safeJSON(textResult) as T;
    return parsedResult;
  }

  private safeJSON(text: string) {
    try {
      return JSON.parse(text);
    } catch {
      return {};
    }
  }
}
