import { EnrichedProfileUpdateData } from '@jobie/users/types';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
export class EnrichUserProfileUpdateDto
  implements
    Omit<
    EnrichedProfileUpdateData,
      'skills' | 'experienceSummary' | 'linkedinHeadline'
    >
{
  linkedinHeadline: string;
  @ApiProperty({
    name: 'goalJob',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  goalJob?: string;

  @ApiProperty({
    name: 'location',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  location?: string;

  @ApiProperty({
    name: 'education',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  education?: string;

  @ApiProperty({
    name: 'bio',
    type: String,
    required: false,
  })
  @Expose()
  @IsString()
  @IsOptional()
  @MaxLength(150)
  bio?: string;

  @ApiProperty({
    name: 'linkedinProfileUrl',
    type: String,
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsUrl()
  @MaxLength(150)
  linkedinProfileUrl?: string;

  @ApiProperty({
    name: 'aspirationalLinkedinUrl',
    type: String,
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsUrl()
  @MaxLength(150)
  aspirationalLinkedinUrl?: string;
}
