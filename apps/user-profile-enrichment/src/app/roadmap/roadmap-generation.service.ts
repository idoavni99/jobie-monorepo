import { RoadmapRepository } from '@jobie/roadmap-calibration';
import { UsersRepository } from '@jobie/users/nestjs';
import { User } from '@jobie/users/nestjs/users.schema';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fuzzball from 'fuzzball';
import { OpenAI } from 'openai';

@Injectable()
export class RoadmapGenerationService {
    private readonly logger = new Logger(RoadmapGenerationService.name);
    private readonly openai: OpenAI;
    private readonly rapidApiKey: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly usersRepository: UsersRepository,
        private readonly roadmapRepository: RoadmapRepository
    ) {
        this.rapidApiKey =
            this.configService.get<string>('RAPIDAPI_KEY') ??
            (() => {
                throw new Error('RAPIDAPI_KEY not set');
            })();
        this.openai = new OpenAI({
            apiKey: this.configService.get<string>('OPENAI_API_KEY'),
        });
    }

    private async fetchLinkedInProfile(url: string) {
        const headers = {
            'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com',
            'x-rapidapi-key': this.rapidApiKey,
        };
        const response = await this.httpService.axiosRef.get(
            'https://linkedin-data-api.p.rapidapi.com/get-profile-data-by-url',
            {
                headers,
                params: { url },
            }
        );

        return response.data;
    }

    private buildCareerVector(profile: any) {
        return {
            name: `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`,
            headline: profile?.headline ?? '',
            location: profile?.location?.full ?? '',
            positions:
                profile?.position?.map((pos: any) => ({
                    title: pos?.title ?? '',
                    companyName: pos?.companyName ?? '',
                    startDate: pos?.start?.year ?? '',
                    endDate: pos?.end?.year ?? 'Present',
                })) ?? [],
            educations:
                profile?.educations?.map((edu: any) => ({
                    schoolName: edu?.schoolName ?? '',
                    degreeName: edu?.degree ?? '',
                    fieldOfStudy: edu?.fieldOfStudy ?? '',
                    startDate: edu?.start?.year ?? '',
                    endDate: edu?.end?.year ?? '',
                })) ?? [],
            skills: profile?.skills?.map((s: any) => s.name) ?? [],
        };
    }

    private compareVectors(userVector: any, targetVector: any, threshold = 80) {
        const userSkills = [...new Set(userVector.skills)];
        const targetSkills = [...new Set(targetVector.skills)];

        const missingSkills = targetSkills.filter((skill) => {
            const [match, score] =
                fuzzball.extract(skill, userSkills, { scorer: fuzzball.ratio })[0] ?? [];
            return score < threshold;
        });

        const uniqueSkills = userSkills.filter((skill) => {
            const [match, score] =
                fuzzball.extract(skill, targetSkills, { scorer: fuzzball.ratio })[0] ?? [];
            return score < threshold;
        });

        return {
            missing_skills: missingSkills,
            unique_skills: uniqueSkills,
            experience_gap:
                (targetVector.positions?.length ?? 0) - (userVector.positions?.length ?? 0),
        };
    }

    async generateSummarizedRoadmap(userId: string): Promise<string[]> {
        const user: User | undefined = await this.usersRepository.findById(userId);
        if (!user || !user.linkedinProfileUrl || !user.aspirationalLinkedinUrl) {
            throw new Error('User or LinkedIn URLs not available');
        }

        const userProfileRaw = await this.fetchLinkedInProfile(user.linkedinProfileUrl);
        const targetProfileRaw = await this.fetchLinkedInProfile(user.aspirationalLinkedinUrl);

        const userVector = this.buildCareerVector(userProfileRaw);
        const targetVector = this.buildCareerVector(targetProfileRaw);
        const gap = this.compareVectors(userVector, targetVector);

        // Save extracted info to user
        await this.usersRepository.update(userId, {
            skills: userVector.skills,
            linkedinHeadline: userVector.headline,
            experienceSummary: userVector.positions.map((p: any) => ({
                title: p.title,
                companyName: p.companyName,
            })),
        });

        const prompt = `
The user is currently working as "${userVector.headline}" and aims to transition to "${targetVector.headline}".
They are based in ${user.location} and have the following background: "${user.bio}". Their career goal is: "${user.goalJob}".

Currently, they possess these skills: ${userVector.skills.join(', ')}.
Their unique skills compared to the target: ${gap.unique_skills.join(', ')}.
However, they are missing the following skills to achieve their target: ${gap.missing_skills.join(', ')}.

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
                    content: 'You are a career coach helping users plan career transitions.',
                },
                { role: 'user', content: prompt },
            ],
        });

        let content = response.choices?.[0]?.message?.content?.trim() ?? '';
        if (content.startsWith('```json')) content = content.slice(7);
        if (content.endsWith('```')) content = content.slice(0, -3);

        let parsed;
        try {
            parsed = JSON.parse(content);
        } catch (error) {
            this.logger.error('Failed to parse roadmap JSON', error);
            throw new Error('Invalid roadmap JSON');
        }

        const steps = parsed.roadmap_steps ?? [];

        const milestoneTitles = steps.map((step: any) => step.milestone_name);
        await this.roadmapRepository.create({
            userId,
            goalJob: user.goalJob,
            summarizedMilestones: milestoneTitles,
            milestoneIds: [],
            isApproved: false,
        });

        return milestoneTitles;
    }
}
