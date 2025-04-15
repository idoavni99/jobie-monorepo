import { ConfigType, registerAs } from '@nestjs/config';
export const openAIConfig = registerAs('openai', () => {
  const apiKey = process.env['OPENAI_API_KEY'];
  if (!apiKey) throw new Error('OPENAI_API_KEY is not defined');
  return {
    apiKey,
    baseURL: process.env['OPENAI_BASE_URL'],
  };
});

export type OpenAIConfig = ConfigType<typeof openAIConfig>;
export const OPENAI_PROVIDER_KEY = openAIConfig.KEY;
