import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class GenerateMilestoneDto {
  @ApiProperty({
    description: 'Unique ID for the milestone',
    example: '7b80fe4a-5316-41c5-b3ec-91b511cc3f7c',
  })
  @Expose()
  @IsString()
  _id: string;

  @ApiProperty({
    description: 'User ID associated with the milestone',
    example: 'user-abc123',
  })
  @Expose()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Name of the milestone',
    example: 'Master JavaScript Frameworks',
  })
  @Expose()
  @IsString()
  milestone_name: string;

  @ApiProperty({
    description: 'List of required skills',
    example: ['TypeScript', 'Next.js', 'Redux.js'],
    type: [String],
  })
  @Expose()
  @IsArray()
  @IsString({ each: true })
  skills: string[];
}
