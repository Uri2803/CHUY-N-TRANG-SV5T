import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CriteriaService } from '../services/criteria.service';
import { AchievementService } from '../services/achievement.service';
import { CriteriaDto } from 'src/Dto/criteria.dto';
import { Role } from 'src/common/enum';
import { Roles } from 'src/common/roles.decorator';
import JwtAuthenticationGuard from '../guard/jwt-authentication.guard';
import { RolesGuard } from '../guard/roles.guard';

interface SaveCritSendType {
  list: CriteriaDto[];
  deletedID: string[];
}
@ApiTags('Tiêu chí')
@Controller('criteria')
// @UseGuards(JwtAuthenticationGuard)
export class CriteriaController {
  constructor(
    private criteriaService: CriteriaService,
    private achievementService: AchievementService,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Return a list of criteria',
  })
  async getList() {
    return await this.criteriaService.getAll();
  }

  @Get('department/:id')
  @ApiResponse({
    status: 200,
    description: 'Return a list of criteria',
  })
  async getDepartment(@Param('id') id: string) {
    return await this.criteriaService.getDepartment(+id);
  }

  @Post('department/:id')
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Thêm tiêu chí',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async addCriteria(
    @Body() criteriaDto: SaveCritSendType,
    @Param('id') id: string,
  ) {
    try {
      //const criteriaList = await this.criteriaService.add(criteriaDto);
      // await this.achievementService.delete(+id);
      // const criteriaList = await this.criteriaService.add(criteriaDto.list);
      // await this.achievementService.addChildCriteria(+id, criteriaList);
      // return criteriaList;
      //await this.achievementService.addChildCriteria(+id, criteriaList);

      const achievement = await this.achievementService.getOne(+id);
      if (achievement.criterias.length !== 0) {
        await Promise.all(
          criteriaDto.deletedID.map(async (id) => {
            await this.criteriaService.deleteExist(id);
          }),
        );
      }

      const criteriaList = await this.criteriaService.add(criteriaDto.list);
      await this.achievementService.addChildCriteria(+id, criteriaList);
      return criteriaList;
      // console.log('--->', criteriaDto);
      // console.log('achievement ->', achievement);
      // return [];
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.code, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/one')
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description:
      'Successfully adding a new criteria, return the criteria added',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request for course information (duplicate code, ...)',
  })
  async add(@Body() criteriaDto: CriteriaDto) {
    try {
      return await this.criteriaService.addOne(criteriaDto);
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description:
      'Successfully deleting a course, return the number of affected objects in affected field',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request for course information (not found id, duplicate code, ...)',
  })
  async update(@Body() criteriaDto: any, @Param('id') id: string) {
    try {
      // await this.achievementService.delete(+id);
      // const criteriaList = await this.criteriaService.add(criteriaDto);
      // await this.achievementService.addChildCriteria(+id, criteriaList);
      // return criteriaList;
      return criteriaDto;
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.code, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description:
      'Successfully deleting a course, return the number of affected objects in affected field',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request for course information (not found id, duplicate code, ...)',
  })
  async delete(@Param('id') id: string) {
    try {
      const result = await this.criteriaService.delete(id);
      return { affected: result.affected };
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.code, HttpStatus.BAD_REQUEST);
    }
  }
}
