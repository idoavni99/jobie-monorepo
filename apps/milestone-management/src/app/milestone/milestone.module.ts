import { MilestoneModule } from '@jobie/milestone/nestjs';
import { OpenAIModule } from '@jobie/openai';
import { Module } from '@nestjs/common';
import { MilestoneGenerationService } from './milestone-generation.service';
import { MilestoneController } from './milestone.controller';
@Module({
  imports: [MilestoneModule, OpenAIModule.register()],
  controllers: [MilestoneController],
  providers: [MilestoneGenerationService],
})
export class MilestoneManagementModule {}
