import { ConfigType, registerAs } from '@nestjs/config';

export const roadmapCalibrationConfig = registerAs(
  'roadmap-calibration',
  () => ({
    rapidApiKey: process.env.RAPIDAPI_KEY,
    openAiApiKey: process.env.OPENAI_API_KEY,
    linkedinRapidApiHost:
      process.env.LINKEDIN_RAPIDAPI_HOST ?? 'linkedin-data-api.p.rapidapi.com',
  })
);
export type RoadmapCalibartionConfig = ConfigType<
  typeof roadmapCalibrationConfig
>;
export const ROADMAP_CALIBRATION_CONFIG_KEY = roadmapCalibrationConfig.KEY;
