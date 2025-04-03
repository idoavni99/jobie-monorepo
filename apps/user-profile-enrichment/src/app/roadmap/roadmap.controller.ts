import { AuthorizedRequest } from '@jobie/auth-core';
import { Roadmap } from '@jobie/roadmap-calibration';
import {
    Controller,
    Get,
    Post,
    Req,
    UnauthorizedException
} from '@nestjs/common';
import { RoadmapGenerationService } from './roadmap-generation.service';
import { RoadmapService } from './roadmap.service';

@Controller('roadmap')
export class RoadmapController {
    constructor(
        private readonly roadmapService: RoadmapService,
        private readonly roadmapGenerationService: RoadmapGenerationService,
    ) { }

    @Post('generate')
    async generate(@Req() request: AuthorizedRequest): Promise<Roadmap> {
        if (!request.user?._id || !request.user.linkedinProfileUrl || !request.user.aspirationalLinkedinUrl) {
            throw new UnauthorizedException('Missing user profile data');
        }

        const roadmapTitles = await this.roadmapGenerationService.generateSummarizedRoadmap(request.user._id);


        return this.roadmapService.generateInitialRoadmap(request.user._id, roadmapTitles);
    }

    @Post('approve')
    async approve(@Req() request: AuthorizedRequest): Promise<Roadmap | null> {
        if (!request.user?._id) throw new UnauthorizedException('User not found in request');
        return this.roadmapService.approveRoadmap(request.user._id);
    }

    @Get()
    async get(@Req() request: AuthorizedRequest): Promise<Roadmap | null> {
        if (!request.user?._id) throw new UnauthorizedException('User not found in request');
        return this.roadmapService.getRoadmapByUserId(request.user._id);
    }
}
