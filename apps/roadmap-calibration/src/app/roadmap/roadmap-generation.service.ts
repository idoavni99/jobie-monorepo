import {
  LinkedInProfile,
  LinkedinRepository,
  SimilarProfile,
} from '@jobie/linkedin/index';
import { OpenAIRepository } from '@jobie/openai';
import { CareerVector, RoadmapMilestone, TRoadmap } from '@jobie/roadmap/types';
import { Roadmap, RoadmapService } from '@jobie/roadmap/nestjs';
import { User, UsersRepository } from '@jobie/users/nestjs';
import { EnrichedProfileUpdateData, TUser } from '@jobie/users/types';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import fuzzball from 'fuzzball';
import { firstValueFrom } from 'rxjs';
import { randomUUID } from 'node:crypto';
import { HttpService } from '@nestjs/axios';
import { SuggestedRoadmap } from './types/suggested-roadmap.type';

@Injectable()
export class RoadmapGenerationService {
  private suggestionsByUserId = new Map<string, SimilarProfile[]>();
  private roadmapsByUserAndUrl = new Map<string, SuggestedRoadmap>();

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

  async getSimilarProfileDataFromUser(
    userId: string
  ): Promise<Pick<User, 'goalJob' | 'aspirationalLinkedinUrl' | 'location'>> {
    const payload = await this.usersRepository.findById(userId, {
      aspirationalLinkedinUrl: 1,
      goalJob: 1,
      location: 1,
    });

    if (!payload) throw new NotFoundException('User not found');

    return payload;
  }
  async suggestSimilarProfiles(userId: string, maxResults: number) {
    if (this.suggestionsByUserId.has(userId))
      return { profiles: this.suggestionsByUserId.get(userId) };

    const { aspirationalLinkedinUrl, goalJob, location } =
      await this.getSimilarProfileDataFromUser(userId);
    const profiles =
      (await this.linkedinRepository.getSimilarProfiles(
        goalJob ?? '',
        location ?? '',
        aspirationalLinkedinUrl,
        aspirationalLinkedinUrl ? maxResults : maxResults + 1
      )) || [];

    if (aspirationalLinkedinUrl) {
      const targetProfile = await this.linkedinRepository.getUserProfile(
        aspirationalLinkedinUrl
      );
      const parsedTarget = {
        fullName: `${targetProfile.firstName ?? ''} ${
          targetProfile.lastName ?? ''
        }`.trim(),
        headline: targetProfile.headline ?? '',
        profileURL: aspirationalLinkedinUrl,
        profilePicture: targetProfile.profilePicture ?? '',
      };

      profiles.unshift(parsedTarget);
    }

    this.suggestionsByUserId.set(userId, profiles);

    return {
      profiles,
    };
  }

  clearUserCache(userId: string) {
    this.suggestionsByUserId.delete(userId);
    for (const key in this.roadmapsByUserAndUrl.keys()) {
      if (key.startsWith(userId)) {
        this.roadmapsByUserAndUrl.delete(key);
      }
    }
  }


  async regenerateRoadmap(roadmap: Roadmap, user: TUser, enrichedProfile: EnrichedProfileUpdateData) {
    // check if14 days passed since  last update.
    const updateAt = new Date(roadmap.updatedAt);
    //await this.usersRepository.findById
    const now = new Date();
    console.log('enrichedProfile', enrichedProfile);
    const diffInDays = Math.floor(
      (now.getTime() - updateAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffInDays > 14 ) {  // Req. 2

      // Req. 5.2 generate new roadmap with existing roadmap.milestones using add-google-integrations
      if(!enrichedProfile.aspirationalLinkedinUrl){
        console.log('roadmap.enrichedProfile', enrichedProfile);
        throw new BadRequestException("missing aspiration linkedin profile");
      }
        const regeneratedRoadmap = await this.buildRoadmapNoAI(user, enrichedProfile.aspirationalLinkedinUrl, roadmap);
        regeneratedRoadmap.roadmap.userId = user._id;
        console.log('regenerating', regeneratedRoadmap.roadmap);
        
        await this.roadmapService.deleteUserRoadmap(user._id);
        //const savedRoadmap = await this.roadmapService.insertRoadmap(regeneratedRoadmap.roadmap as TRoadmap);

        //const initialMilestones = savedRoadmap.milestones.slice(0, 3);
        // await firstValueFrom(
        //   this.httpService.post('/initialGenerate', initialMilestones)
        // );

        const completedSkills:string[] = []
        const completedMilestones = roadmap.milestones.filter(milestones => milestones.status === 'completed');
    
        if(!user.skills){
          user.skills = []
        }
        for(const milestone of completedMilestones) {
          for(const skill of milestone.skills){
            user.skills?.push(skill);
          }
        };
        user.isRoadmapGenerated = false;
        await this.usersRepository.update(user._id, user) ;       
     
    }
    
    
    throw new BadRequestException("cannot generate roadmap before 14 daysafter last ")
  }


  // create roadmap without AI
async buildRoadmapNoAI(
    user: TUser,
    targetUrl: string,
    oldRoadmap: Roadmap
  ): Promise<SuggestedRoadmap> {


    // deep copy
    const milestones: RoadmapMilestone[] = oldRoadmap.milestones.map( milestone =>{
      return {
        ...milestone, skills:[...milestone.skills]
      }
    })
    console.log('copying milestones', milestones);
    
    const completeRoadmap = {
      roadmap: {
        userId: user._id,
        goalJob: user.goalJob ?? '',
        milestones,
        isApproved: false,
      },
      motivationLine: ' your motivation ',  //TODO how to create motivationLine without AI
    };
    this.roadmapsByUserAndUrl.set(`${user._id}-${targetUrl}`, completeRoadmap);
    return completeRoadmap;
  }  


  async buildRoadmap(
    user: TUser,
    targetUrl: string
  ): Promise<SuggestedRoadmap> {
    if (this.roadmapsByUserAndUrl.has(`${user._id}-${targetUrl}`))
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.roadmapsByUserAndUrl.get(`${user._id}-${targetUrl}`)!;

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

    const prompt = `
    The user is currently working as "${
      userVector.headline
    }" and aims to transition to "${targetVector.headline}"

    ${this.buildUserDataSection(user)}
  
    ${this.buildVectorComparisonSection(userVector, targetVector)}

    ${this.createInstructionSection()}
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

    const completeRoadmap = {
      roadmap: {
        userId: user._id,
        goalJob: user.goalJob ?? '',
        milestones,
        isApproved: false,
      },
      motivationLine: motivation_line,
    };
    this.roadmapsByUserAndUrl.set(`${user._id}-${targetUrl}`, completeRoadmap);
    return completeRoadmap;
  }

private buildUserDataSection(user: TUser) {
    return `.
  They are based in ${user.location} and Their career goal is: "${user.goalJob}".
  
  Here is their bio, I want you to tailor the roadmap to them uniquely: 
  "${user.bio}"`;
  }

  private buildVectorComparisonSection(
    userVector: CareerVector,
    targetVector: CareerVector
  ) {
    const gap = this.compareVectors(userVector, targetVector);
    const userPositionsText = this.combinePositions(userVector.positions);

    const targetPositionsText = this.combinePositions(targetVector.positions);
    const userEducationText = this.combineEducations(userVector.educations);

    const targetEducationText = this.combineEducations(targetVector.educations);

    return ` 
  Currently, they possess these skills: ${userVector.skills.join(', ')}.
  Their unique skills compared to the target: ${gap.unique_skills.join(', ')}.
  However, they are missing the following skills to achieve their target: ${gap.missing_skills.join(
    ', '
  )}. 
  Some of this missing skills are not relevant, E.g. learning Angular when you know React,
  I want you to ensure that you disregard cases of such kind.
  
  The user has the following education: ${userEducationText}.
  The target profile has the following education: ${targetEducationText}.
  Do not suggest doing another degree if the user already has one.

  They have held these positions: ${userPositionsText}.
  The target profile has held these positions: ${targetPositionsText}.`;
  }

private createInstructionSection() {
    return `
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
  }`;
  }

  private combinePositions(positions: CareerVector['positions']) {
    return positions
      .map(
        (p) =>
          `${p.title} (${p.startDate?.slice(0, 10)} – ${p.endDate?.slice(
            0,
            10
          )})`
      )
      .join('; ');
  }

  private combineEducations(educations: CareerVector['educations']) {
    return educations
      .map(
        (ed) =>
          `${ed.degreeName} in ${ed.fieldOfStudy} (${ed.startDate?.slice(
            0,
            10
          )} – ${ed.endDate?.slice(0, 10)})`
      )
      .join('; ');
  }  
}