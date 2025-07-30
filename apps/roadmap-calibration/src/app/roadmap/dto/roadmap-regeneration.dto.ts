import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class RoadmapRegenerationDto {
  @ApiProperty({
    description: 'The goal job of the user',
    example: 'Software Engineer',
  })
  @IsOptional()
  @IsString()
  goalJob?: string;

  @ApiProperty({
    description: 'The URL of the aspirational LinkedIn profile',
    example: 'https://www.linkedin.com/in/john-doe',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  aspirationalLinkedinUrl: string;
}
