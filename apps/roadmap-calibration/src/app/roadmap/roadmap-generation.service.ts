import { LinkedInProfile, LinkedinRepository } from '@jobie/linkedin';
import { OpenAIRepository } from '@jobie/openai';
//import { Roadmap } from '@jobie/roadmap/nestjs/roadmap.schema';
import { Roadmap, RoadmapService } from '@jobie/roadmap/nestjs';
import { HttpService } from '@nestjs/axios';
import { CareerVector, RoadmapMilestone, TRoadmap } from '@jobie/roadmap/types';
import { UsersRepository } from '@jobie/users/nestjs';
import { TUser } from '@jobie/users/types';
import { Injectable } from '@nestjs/common';
import fuzzball from 'fuzzball';
import { randomUUID } from 'node:crypto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RoadmapGenerationService {
  constructor(
    private readonly openAiRepository: OpenAIRepository,
    private readonly usersRepository: UsersRepository,
    private readonly linkedinRepository: LinkedinRepository,
    private readonly roadmapService: RoadmapService,
    private readonly httpService: HttpService
  ) { }

  private buildCareerVector(profile: LinkedInProfile): CareerVector {
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
    };
  }

  async getAspirationalUrlFromUser(
    userId: string
  ): Promise<string | undefined> {
    const user = await this.usersRepository.findById(userId, {
      aspirationalLinkedinUrl: 1,
    });
    return user?.aspirationalLinkedinUrl ?? undefined;
  }

  async suggestSimilarProfiles(targetUrl: string, maxResults: number) {
    const targetProfile = await this.linkedinRepository.getUserProfile(
      targetUrl
    );
    const similar = await this.linkedinRepository.getSimilarProfiles(
      targetUrl,
      maxResults
    );

    const parsedTarget = {
      fullName: `${targetProfile.firstName ?? ''} ${targetProfile.lastName ?? ''
        }`.trim(),
      headline: targetProfile.headline ?? '',
      profileURL: targetUrl,
      profilePicture: targetProfile.profilePicture ?? '',
    };

    return {
      profiles: [parsedTarget, ...(similar ?? [])],
    };
  }


  async regenerateRoadmap(roadmap: Roadmap, user: TUser): Promise<Roadmap> {
    // check if14 days passed since  last update.
    const updateAt = new Date(roadmap.updatedAt);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - updateAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffInDays > 14 && user.aspirationalLinkedinUrl) {

      
        const regeneratedRoadmap = await this.buildRoadmap(user, user.aspirationalLinkedinUrl);
        regeneratedRoadmap.roadmap.userId = user._id;
        console.log('regenerating', regeneratedRoadmap.roadmap);
        
        const savedRoadmap = await this.roadmapService.insertRoadmap(regeneratedRoadmap.roadmap as TRoadmap);

        const initialMilestones = savedRoadmap.milestones.slice(0, 3);
        await firstValueFrom(
          this.httpService.post('/initialGenerate', initialMilestones)
        );
        return savedRoadmap;
     
    }
    
    throw new Error("cannot generate roadmap before 14 daysafter last ")
  }
  async buildRoadmap(
    user: TUser,
    targetUrl: string
  ): Promise<{
    roadmap: Partial<TRoadmap>;
    motivationLine?: string;
  }> {
    //not saving the roadmap here, so the milestones are created only after the approval of the roadmap
    if (!targetUrl) {
      console.warn(
        '[buildRoadmap] Missing targetUrl — cannot generate roadmap'
      );
      throw new Error(
        'Missing target LinkedIn URL. Please select a target profile before generating a roadmap.'
      );
    }

    const targetProfileRaw = await this.linkedinRepository.getUserProfile(
      targetUrl
    );
    const targetVector = this.buildCareerVector(targetProfileRaw);
    const userVector: CareerVector = {
      name: user.linkedinFullName ?? '',
      headline: user.linkedinHeadline ?? '',
      location: user.linkedinLocation ?? '',
      positions: user.linkedinPositions ?? [],
      educations: user.linkedinEducations ?? [],
      skills: user.skills ?? [],
    };

    const gap = this.compareVectors(userVector, targetVector);
    const userPositionsText = userVector.positions
      .map(
        (p) =>
          `${p.title} (${p.startDate?.slice(0, 10)} – ${p.endDate?.slice(
            0,
            10
          )})`
      )
      .join('; ');

    const targetPositionsText = targetVector.positions
      .map(
        (p) =>
          `${p.title} (${p.startDate?.slice(0, 10)} – ${p.endDate?.slice(
            0,
            10
          )})`
      )
      .join('; ');
    const userEducationText = userVector.educations
      .map(
        (ed) =>
          `${ed.degreeName} in ${ed.fieldOfStudy} (${ed.startDate?.slice(
            0,
            10
          )} – ${ed.endDate?.slice(0, 10)})`
      )
      .join('; ');

    const targetEducationText = targetVector.educations
      .map(
        (ed) =>
          `${ed.degreeName} in ${ed.fieldOfStudy} (${ed.startDate?.slice(
            0,
            10
          )} – ${ed.endDate?.slice(0, 10)})`
      )
      .join('; ');

    const prompt = `
  The user is currently working as "${userVector.headline
      }" and aims to transition to "${targetVector.headline}".
  They are based in ${user.location} and have the following background: "${user.bio
      }".
  Their career goal is: "${user.goalJob}".
  
  Currently, they possess these skills: ${userVector.skills.join(', ')}.
  Their unique skills compared to the target: ${gap.unique_skills.join(', ')}.
  However, they are missing the following skills to achieve their target: ${gap.missing_skills.join(
        ', '
      )}.
  
  The user has the following education: ${userEducationText} ${user.education}.
  The target profile has the following education: ${targetEducationText}.
  Do not suggest doing another degree if the user already has one.

  They have held these positions: ${userPositionsText}.
  The target profile has held these positions: ${targetPositionsText}.
  
  1. Generate a summarized career roadmap to help them transition.
  Each milestone should have a short name (3–5 words max) and include a small list of skills
  (each skill should be recognizable by LinkedIn and industry-standard).
  If you can, do 10 milestones.
  Be specific, no general names and skils. 
  Put more focus on the recent positions of the target as tha main goal since it defines his expertise better
  2.Also generate one sentence that speaks directly to the user and explains why they should choose this roadmap over others. Be specific: clearly connect the user’s actual current skills and experience to the role the target person has. Make it clear how this roadmap builds on what the user already has and what it helps them develop. Do not flatter or generalize. Be realistic, insightful, and grounded — speak like a mentor. Do not mention specific companies, titles, or make promises. The tone should be confident and personal, not vague or salesy.
  Format response as JSON with:
  {
    "roadmap_steps": [
      { "milestone_name": "short name", "skills": ["skill1", "skill2"] },
      ...
    ],
    "motivation_line": "One sentence that encourages the user to follow this path."
  }
  `;

    const { roadmap_steps: steps, motivation_line } =
      ((await this.openAiRepository.requestPromptJSON(
        'You are a career coach helping users plan career transitions',
        prompt
      )) ?? {}) as {
        roadmap_steps: { milestone_name: string; skills: string[] }[];
        motivation_line?: string;
      };

    const milestones = steps.map<RoadmapMilestone>((step, index) => ({
      _id: randomUUID(),
      milestoneName: step.milestone_name,
      skills: step.skills ?? [],
      status: index < 3 ? 'active' : 'summary',
    }));

    return {
      roadmap: {
        userId: user._id,
        goalJob: user.goalJob ?? '',
        milestones,
        isApproved: false,
      },
      motivationLine: motivation_line,
    };
  }


  //   async generateSummarizedRoadmap(userId: string): Promise<TRoadmap> {
  //     const user = await this.usersRepository.findById(userId);
  //     if (!user || !user.linkedinProfileUrl || !user.aspirationalLinkedinUrl) {
  //       throw new NotFoundException('User or LinkedIn URLs not available');
  //     }

  //     const [userProfileRaw, targetProfileRaw] = await Promise.all([
  //       this.linkedinRepository.getUserProfile(user.linkedinProfileUrl),
  //       this.linkedinRepository.getUserProfile(user.aspirationalLinkedinUrl),
  //     ]);

  //     const userVector = this.buildCareerVector(userProfileRaw);
  //     const targetVector = this.buildCareerVector(targetProfileRaw);
  //     const gap = this.compareVectors(userVector, targetVector);

  //     const prompt = `
  // The user is currently working as "${userVector.headline
  //       }" and aims to transition to "${targetVector.headline}".
  // They are based in ${user.location} and have the following background: "${user.bio
  //       }". Their career goal is: "${user.goalJob}".

  // Currently, they possess these skills: ${userVector.skills.join(', ')}.
  // Their unique skills compared to the target: ${gap.unique_skills.join(', ')}.
  // However, they are missing the following skills to achieve their target: ${gap.missing_skills.join(
  //         ', '
  //       )}.

  // Generate a summarized career roadmap to help them transition.
  // Each milestone should have a short name (3–5 words max) and include a small list of skills
  // (each skill should be recognizable by LinkedIn and industry-standard).

  // Format response as JSON with:
  // {
  //   "roadmap_steps": [
  //     { "milestoneName": "short name", "skills": ["skill1", "skill2"] },
  //     ...
  //   ]
  // }
  // `;
  //     // generate roadmap steps using OpenAI

  //     const response = await this.openAiRepository.requestPromptJSON<{
  //       roadmap_steps: Partial<RoadmapMilestone>[];
  //     }>('You are a career coach helping users plan career transitions', prompt);

  //     const steps = response?.roadmap_steps ?? [];

  //     // add IDs and status to each milestone

  //     const milestones = steps.map((step, index) => ({
  //       _id: crypto.randomUUID(),
  //       milestoneName: step.milestoneName,
  //       skills: step.skills ?? [],
  //       status: index < 3 ? 'active' : 'summary',
  //     })) as RoadmapMilestone[];

  //     return {
  //       userId,
  //       goalJob: user.goalJob ?? '',
  //       milestones,
  //       isApproved: false,
  //     };
  //   }
}
