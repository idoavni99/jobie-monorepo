import { UsersRepository } from '@jobie/users/nestjs';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import fuzzball from 'fuzzball';
import { OpenAI } from 'openai';
import { safeJSON } from 'openai/core';
import { MilestoneWithSkills } from '../types';
import { CareerVector } from '../types/career-vector.type';
import { LinkedInProfile } from '../types/linkedin-profile.type';
import {
  ROADMAP_CALIBRATION_CONFIG_KEY,
  RoadmapCalibartionConfig,
} from './config';
import { RoadmapRepository } from './roadmap.repository';

@Injectable()
export class RoadmapGenerationService {
  private readonly logger = new Logger(RoadmapGenerationService.name);
  private readonly openai: OpenAI;
  private readonly rapidApiKey: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(ROADMAP_CALIBRATION_CONFIG_KEY)
    private readonly calibrationConfig: RoadmapCalibartionConfig,
    private readonly usersRepository: UsersRepository,
    private readonly roadmapRepository: RoadmapRepository
  ) {
    this.rapidApiKey =
      this.calibrationConfig.rapidApiKey ??
      (() => {
        throw new Error('RAPIDAPI_KEY not set');
      })();
    this.openai = new OpenAI({
      apiKey: this.calibrationConfig.openAiApiKey,
    });
  }

  private async fetchLinkedInProfile(url: string) {
    const response = await this.httpService.axiosRef.get<LinkedInProfile>(
      '/get-profile-data-by-url',
      {
        params: { url },
      }
    );

    return response.data;
  }

  private buildCareerVector(profile: LinkedInProfile): CareerVector {
    return {
      name: `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`,
      headline: profile?.headline ?? '',
      location: profile?.location?.full ?? '',
      positions:
        profile?.position?.map((pos) => ({
          title: pos?.title ?? '',
          companyName: pos?.companyName ?? '',
          startDate: new Date(pos?.start?.year)?.toISOString() || '',
          endDate: new Date(pos?.end?.year)?.toISOString() || 'Present',
        })) ?? [],
      educations:
        profile?.educations?.map((edu) => ({
          schoolName: edu?.schoolName ?? '',
          degreeName: edu?.degree ?? '',
          fieldOfStudy: edu?.fieldOfStudy ?? '',
          startDate: new Date(edu?.start?.year)?.toISOString() || '',
          endDate: new Date(edu?.end?.year)?.toISOString() || '',
        })) ?? [],
      skills: profile?.skills?.map((s) => s.name) ?? [],
    };
  }

  private compareVectors(
    userVector: CareerVector,
    targetVector: CareerVector,
    threshold = 80
  ) {
    const userSkills = [...new Set(userVector.skills)];
    const targetSkills = [...new Set(targetVector.skills)];

    const missingSkills = targetSkills.filter((skill) => {
      const [, score] =
        fuzzball.extract(skill, userSkills, { scorer: fuzzball.ratio })[0] ??
        [];
      return score < threshold;
    });

    const uniqueSkills = userSkills.filter((skill) => {
      const [, score] =
        fuzzball.extract(skill, targetSkills, { scorer: fuzzball.ratio })[0] ??
        [];
      return score < threshold;
    });

    return {
      missing_skills: missingSkills,
      unique_skills: uniqueSkills,
      experience_gap:
        (targetVector.positions?.length ?? 0) -
        (userVector.positions?.length ?? 0),
    };
  }

  async generateSummarizedRoadmap(userId: string): Promise<string[]> {
    const user = await this.usersRepository.findById(userId);
    if (!user || !user.linkedinProfileUrl || !user.aspirationalLinkedinUrl) {
      throw new NotFoundException('User or LinkedIn URLs not available');
    }

    const [userProfileRaw, targetProfileRaw] = await Promise.all([
      this.fetchLinkedInProfile(user.linkedinProfileUrl),
      this.fetchLinkedInProfile(user.aspirationalLinkedinUrl),
    ]);

    const userVector = this.buildCareerVector(userProfileRaw);
    const targetVector = this.buildCareerVector(targetProfileRaw);
    const gap = this.compareVectors(userVector, targetVector);

    const prompt = `
The user is currently working as "${
      userVector.headline
    }" and aims to transition to "${targetVector.headline}".
They are based in ${user.location} and have the following background: "${
      user.bio
    }". Their career goal is: "${user.goalJob}".

Currently, they possess these skills: ${userVector.skills.join(', ')}.
Their unique skills compared to the target: ${gap.unique_skills.join(', ')}.
However, they are missing the following skills to achieve their target: ${gap.missing_skills.join(
      ', '
    )}.

Generate a summarized career roadmap to help them transition.
Each milestone should have a short name (3–5 words max) and include a small list of skills
(each skill should be recognizable by LinkedIn and industry-standard).

Format response as JSON with:
{
  "roadmap_steps": [
    { "milestone_name": "short name", "skills": ["skill1", "skill2"] },
    ...
  ]
}
`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content:
            'You are a career coach helping users plan career transitions.',
        },
        { role: 'user', content: prompt },
      ],
    });

    let content = response.choices?.[0]?.message?.content?.trim() ?? '';
    if (content.startsWith('```json')) content = content.slice(7);
    if (content.endsWith('```')) content = content.slice(0, -3);

    const { roadmap_steps: steps } = (safeJSON(content) ?? {
      roadmap_steps: [],
    }) as { roadmap_steps: MilestoneWithSkills[] };

    const milestoneTitles = steps.map((step) => step.milestone_name);
    const milestonesWithSkills = steps.map((step) => ({
      milestone_name: step.milestone_name,
      skills: step.skills ?? [],
    }));

    // Clear old roadmap before saving new one
    await this.roadmapRepository.deleteByUserId(userId);

    await this.roadmapRepository.create({
      userId,
      goalJob: user.goalJob,
      summarizedMilestones: milestoneTitles,
      milestonesWithSkills,
      milestoneIds: [],
      isApproved: false,
    });

    return milestoneTitles;
  }
}
