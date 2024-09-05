import { ApiProperty } from '@nestjs/swagger';
import { CriteriaSign, CriteriaType } from 'src/common/enum';

export class CriteriaDto {
  @ApiProperty({ required: false })
  id?: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isCriteria: boolean;

  @ApiProperty({ required: false })
  method: string;

  @ApiProperty({ required: false })
  note: string;

  @ApiProperty({ required: false })
  valueListString: string;

  @ApiProperty({ required: false })
  content: string;

  @ApiProperty({ required: false })
  evidence: boolean;

  @ApiProperty({ required: false })
  comment: boolean;

  @ApiProperty({ enum: CriteriaType, required: false })
  type?: CriteriaType;

  @ApiProperty({ enum: CriteriaSign, required: false })
  lowerSign: CriteriaSign;

  @ApiProperty({ enum: CriteriaSign, required: false })
  upperSign: CriteriaSign;

  @ApiProperty({ required: false })
  point: number;

  @ApiProperty({ required: false })
  lowerPoint: number;

  @ApiProperty({ required: false })
  upperPoint: number;

  @ApiProperty({ required: false })
  soft?: number;

  @ApiProperty({ required: true })
  children: Array<CriteriaDto>;
}
