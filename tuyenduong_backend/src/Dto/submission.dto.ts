import { ApiProperty } from '@nestjs/swagger';

export class SubmissionDto {
  @ApiProperty({ required: false })
  id: string;

  @ApiProperty({ required: false })
  userId: number;

  @ApiProperty({ required: false })
  achievementId: number;

  @ApiProperty({ required: false })
  criteriaID: string;

  @ApiProperty()
  file: string;

  @ApiProperty()
  studentComment: string;

  @ApiProperty()
  studentSelect: string;

  @ApiProperty({ required: false })
  point: number;

  @ApiProperty()
  binary: boolean;

  @ApiProperty({ required: false })
  description: string;
}
