import { ConfigType, registerAs } from '@nestjs/config';
export const linkedinConfig = registerAs('openai', () => {
  const apiKey = process.env['LINKEDIN_API_KEY'];
  if (!apiKey) throw new Error('LINKEDIN_API_KEY is not defined');
  return {
    apiKey,
    baseURL:
      process.env['LINKEDIN_HOST'] ??
      `https://linkedin-data-api.p.rapidapi.com`,
  };
});

export type LinkedinConfig = ConfigType<typeof linkedinConfig>;
export const LINKEDIN_PROVIDER_KEY = linkedinConfig.KEY;
