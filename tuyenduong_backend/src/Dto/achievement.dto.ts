import { TypeOb } from './../common/enum';
import { ApiProperty } from '@nestjs/swagger';
import { Criteria } from '../models/Achievement/criteria.entity';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsInt,
  IsDate,
  IsEmpty,
} from 'class-validator';

export class AchievementDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150, {
    message: 'vui lòng nhập ít hơn $constraint1 ký tự',
  })
  name: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsEmpty()
  softCriteria?: number;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  type?: TypeOb;

  @ApiProperty({ required: false })
  @IsDate()
  startAt: Date;

  @ApiProperty({ required: false })
  @IsDate()
  endSubmitAt: Date;

  @ApiProperty({ required: false })
  @IsDate()
  endAt: Date;

  @ApiProperty({ required: false })
  children?: Array<Criteria>;
}
