import { LinkedInProfile, LinkedinRepository } from '@jobie/linkedin';
import { OpenAIRepository } from '@jobie/openai';
import { Roadmap } from '@jobie/roadmap/nestjs';
import { CareerVector, MilestoneWithSkills } from '@jobie/roadmap/types';
import { UsersRepository } from '@jobie/users/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import fuzzball from 'fuzzball';

@Injectable()
export class RoadmapGenerationService {
  constructor(
    private readonly openAiRepository: OpenAIRepository,
    private readonly usersRepository: UsersRepository,
    private readonly linkedinRepository: LinkedinRepository
  ) {}

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

  async generateSummarizedRoadmap(userId: string): Promise<Partial<Roadmap>> {
    const user = await this.usersRepository.findById(userId);
    if (!user || !user.linkedinProfileUrl || !user.aspirationalLinkedinUrl) {
      throw new NotFoundException('User or LinkedIn URLs not available');
    }

    const [userProfileRaw, targetProfileRaw] = await Promise.all([
      this.linkedinRepository.getUserProfile(user.linkedinProfileUrl),
      this.linkedinRepository.getUserProfile(user.aspirationalLinkedinUrl),
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

    const { roadmap_steps: steps } =
      (await this.openAiRepository.requestPromptJSON(
        'You are a career coach helping users plan career transitions',
        prompt
      )) as {
        roadmap_steps: MilestoneWithSkills[];
      };

    const milestoneTitles = steps.map((step) => step.milestone_name);
    const milestonesWithSkills = steps.map((step) => ({
      milestone_name: step.milestone_name,
      skills: step.skills ?? [],
    }));

    return {
      userId,
      goalJob: user.goalJob ?? '',
      summarizedMilestones: milestoneTitles,
      milestonesWithSkills,
      milestoneIds: [],
      isApproved: false,
    };
  }
}
