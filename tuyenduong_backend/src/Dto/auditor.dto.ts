import { ApiProperty } from '@nestjs/swagger';
// import {
//   IsString,
//   IsNotEmpty,
//   MaxLength,
//   IsInt,
// } from 'class-validator';

export class AuditorDto {
  @ApiProperty()
  examerId?: number;

  @ApiProperty()
  userId?: number;

  @ApiProperty()
  achievementId?: number;

  @ApiProperty()
  criterias?: Array<any>;
}

export class Auditors {
  @ApiProperty()
  value: number;

  @ApiProperty()
  label: string;
}

export class ManageAuditorDto {
  @ApiProperty()
  isFinal: boolean;

  @ApiProperty()
  auditor: Auditors[];
}
