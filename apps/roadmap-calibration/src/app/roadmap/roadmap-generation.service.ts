import { LinkedInProfile, LinkedinRepository } from '@jobie/linkedin';
import { OpenAIRepository } from '@jobie/openai';
import { Roadmap } from '@jobie/roadmap/nestjs';
import { CareerVector, MilestoneWithSkills } from '@jobie/roadmap/types';
import { UsersRepository } from '@jobie/users/nestjs';
import { TUser } from '@jobie/users/types';
import { Injectable } from '@nestjs/common';
import fuzzball from 'fuzzball';

@Injectable()
export class RoadmapGenerationService {
  constructor(
    private readonly openAiRepository: OpenAIRepository,
    private readonly usersRepository: UsersRepository,
    private readonly linkedinRepository: LinkedinRepository,
  ) { }

  private buildCareerVector(profile: LinkedInProfile): CareerVector {
    console.log('[buildCareerVector] Received profile:', profile);
    return {
      name: `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`,
      headline: profile?.headline ?? '',
      location: profile?.geo?.full ?? '',
      positions:
        profile?.position?.map((pos) => ({
          title: pos?.title ?? '',
          companyName: pos?.companyName ?? '',
          startDate: pos?.start?.year?.toString() ?? '',
          endDate: pos?.end?.year?.toString() ?? '',
        })) ?? [],
      educations:
        profile?.educations?.map((edu) => ({
          schoolName: edu?.schoolName ?? '',
          degreeName: edu?.degree ?? '',
          fieldOfStudy: edu?.fieldOfStudy ?? '',
          startDate: edu?.start?.year ? edu.start.year.toString() : '',
          endDate: edu?.end?.year ? edu.end.year.toString() : '',
        })) ?? [],
      skills: profile?.skills?.map((s) => s.name) ?? [],
    };
  }

  private compareVectors(userVector: CareerVector, targetVector: CareerVector, threshold = 80) {
    console.log('[compareVectors] Comparing vectors...');
    const userSkills = [...new Set(userVector.skills)];
    const targetSkills = [...new Set(targetVector.skills)];

    const missingSkills = targetSkills.filter((skill) => {
      const [, score] =
        fuzzball.extract(skill, userSkills, { scorer: fuzzball.ratio })[0] ?? [];
      return score < threshold;
    });

    const uniqueSkills = userSkills.filter((skill) => {
      const [, score] =
        fuzzball.extract(skill, targetSkills, { scorer: fuzzball.ratio })[0] ?? [];
      return score < threshold;
    });

    console.log('[compareVectors] missingSkills:', missingSkills);
    console.log('[compareVectors] uniqueSkills:', uniqueSkills);

    return {
      missing_skills: missingSkills,
      unique_skills: uniqueSkills,
    };
  }

  async getAspirationalUrlFromUser(userId: string): Promise<string | undefined> {
    const user = await this.usersRepository.findById(userId, {
      aspirationalLinkedinUrl: 1,
    });
    return user?.aspirationalLinkedinUrl ?? undefined;
  }

  async suggestSimilarProfiles(targetUrl: string, maxResults: number) {
    console.log('[suggestSimilarProfiles] Fetching target profile for:', targetUrl);
    const targetProfile = await this.linkedinRepository.getUserProfile(targetUrl);
    console.log('[suggestSimilarProfiles] Target profile fetched:', targetProfile);

    console.log('[suggestSimilarProfiles] Fetching similar profiles...');
    const similar = await this.linkedinRepository.getSimilarProfiles(targetUrl, maxResults);

    if (similar) {
      console.log('[suggestSimilarProfiles] Similar profiles fetched');
    } else {
      console.warn('[suggestSimilarProfiles] Failed to fetch similar profiles');
    }

    const parsedTarget = {
      fullName: `${targetProfile.firstName ?? ''} ${targetProfile.lastName ?? ''}`.trim(),
      headline: targetProfile.headline ?? '',
      profileURL: targetUrl,
      profilePicture: targetProfile.profilePicture ?? '',
    };

    return {
      profiles: [parsedTarget, ...(similar ?? [])],
    };
  }


  async buildRoadmap(user: TUser, targetUrl: string): Promise<Partial<Roadmap>> {
    if (!targetUrl) {
      console.warn('[buildRoadmap] Missing targetUrl — cannot generate roadmap');
      throw new Error('Missing target LinkedIn URL. Please select a target profile before generating a roadmap.');
    }

    console.log('[buildRoadmap] Fetching user and target LinkedIn profiles...');
    // const [userProfileRaw, targetProfileRaw] = await Promise.all([
    //   this.linkedinRepository.getUserProfile(user.linkedinProfileUrl),
    //   this.linkedinRepository.getUserProfile(targetUrl),
    // ]);
    // console.log('[buildRoadmap] userProfileRaw:', userProfileRaw);
    // console.log('[buildRoadmap] targetProfileRaw:', targetProfileRaw);

    const targetProfileRaw = await this.linkedinRepository.getUserProfile(targetUrl);
    const targetVector = this.buildCareerVector(targetProfileRaw);
    const userVector: CareerVector = {
      name: user.linkedinFullName ?? '',
      headline: user.linkedinHeadline ?? '',
      location: user.linkedinLocation ?? '',
      positions: user.linkedinPositions ?? [],
      educations: user.linkedinEducations ?? [],
      skills: user.skills ?? [],
    };
    // console.log('[buildRoadmap] uservector:', userVector);
    // console.log('[buildRoadmap] targetvectoe:', targetVector);

    const gap = this.compareVectors(userVector, targetVector);
    const userPositionsText = userVector.positions.map(
      (p) => `${p.title} (${p.startDate?.slice(0, 10)} – ${p.endDate?.slice(0, 10)})`
    ).join('; ');

    const targetPositionsText = targetVector.positions.map(
      (p) => `${p.title} (${p.startDate?.slice(0, 10)} – ${p.endDate?.slice(0, 10)})`
    ).join('; ');
    const userEducationText = userVector.educations.map(
      (ed) => `${ed.degreeName} in ${ed.fieldOfStudy} (${ed.startDate?.slice(0, 10)} – ${ed.endDate?.slice(0, 10)})`
    ).join('; ');

    const targetEducationText = targetVector.educations.map(
      (ed) => `${ed.degreeName} in ${ed.fieldOfStudy} (${ed.startDate?.slice(0, 10)} – ${ed.endDate?.slice(0, 10)})`
    ).join('; ');


    const prompt = `
  The user is currently working as "${userVector.headline}" and aims to transition to "${targetVector.headline}".
  They are based in ${user.location} and have the following background: "${user.bio}".
  Their career goal is: "${user.goalJob}".
  
  Currently, they possess these skills: ${userVector.skills.join(', ')}.
  Their unique skills compared to the target: ${gap.unique_skills.join(', ')}.
  However, they are missing the following skills to achieve their target: ${gap.missing_skills.join(', ')}.
  
  The user has the following education: ${userEducationText} ${user.education}.
  The target profile has the following education: ${targetEducationText}.
  Do not suggest doing another degree if the user already has one.

  They have held these positions: ${userPositionsText}.
  The target profile has held these positions: ${targetPositionsText}.
  
  Generate a summarized career roadmap to help them transition.
  Each milestone should have a short name (3–5 words max) and include a small list of skills
  (each skill should be recognizable by LinkedIn and industry-standard).
  If you can, do 10 milestones.
  Be specific, no general names and skils. 
  Put more focus on the recent positions of the target as tha main goal since it defines his expertise better
  Format response as JSON with:
  {
    "roadmap_steps": [
      { "milestone_name": "short name", "skills": ["skill1", "skill2"] },
      ...
    ]
  }
  `;

    console.log('[buildRoadmap] Sending prompt to OpenAI...');
    const { roadmap_steps: steps } =
      ((await this.openAiRepository.requestPromptJSON(
        'You are a career coach helping users plan career transitions',
        prompt
      )) ?? {}) as {
        roadmap_steps: MilestoneWithSkills[];
      };

    console.log('[buildRoadmap] Received steps:', steps);

    const milestoneTitles = steps.map((step) => step.milestone_name);
    const milestonesWithSkills = steps.map((step) => ({
      milestone_name: step.milestone_name,
      skills: step.skills ?? [],
    }));

    console.log('[buildRoadmap] Final roadmap object ready');

    return {
      userId: user._id,
      goalJob: user.goalJob ?? '',
      summarizedMilestones: milestoneTitles,
      milestonesWithSkills,
      milestoneIds: [],
      isApproved: false,
    };
  }
}
