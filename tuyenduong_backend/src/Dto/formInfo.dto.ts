import { ApiProperty } from '@nestjs/swagger';

export class CriteriaDto {
  @ApiProperty({ required: false })
  id?: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  mssv: number;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  nation: string;

  @ApiProperty()
  religion: string;

  @ApiProperty()
  birthday: Date;

  @ApiProperty()
  CMND: number;

  @ApiProperty()
  homeTown: string;

  @ApiProperty()
  resident: string;

  @ApiProperty()
  phone: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  department: string;

  @ApiProperty()
  dateAtUnion: Date;

  @ApiProperty()
  placeUnion: string;

  @ApiProperty()
  dateAtCommunistParty: Date;

  @ApiProperty()
  placeCommunistParty: string;
}
