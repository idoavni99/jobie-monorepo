import { EnrichedProfileData } from '@jobie/users/types';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
export class EnrichUserProfileDto
  implements
    Omit<
      EnrichedProfileData,
      'skills' | 'experienceSummary' | 'linkedinHeadline'
    >
{
  linkedinHeadline: string;
  @ApiProperty({
    name: 'goalJob',
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  goalJob: string;

  @ApiProperty({
    name: 'location',
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  location: string;

  @ApiProperty({
    name: 'education',
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  education: string;

  @ApiProperty({
    name: 'bio',
    type: String,
    required: true,
  })
  @Expose()
  @IsString()
  @MaxLength(150)
  bio: string;

  @ApiProperty({
    name: 'linkedinProfileUrl',
    type: String,
    required: true,
  })
  @Expose()
  @IsUrl()
  @MaxLength(150)
  linkedinProfileUrl: string;

  @ApiProperty({
    name: 'aspirationalLinkedinUrl',
    type: String,
  })
  @Expose()
  @IsUrl()
  @IsOptional()
  @MaxLength(150)
  aspirationalLinkedinUrl?: string;
}
