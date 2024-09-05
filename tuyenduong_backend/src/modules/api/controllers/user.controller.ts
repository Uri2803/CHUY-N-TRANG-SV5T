import { UserDepartmentDto, UserDto } from './../../../Dto/user.dto';
import { ContactInfo } from './../../../models/Achievement/contactInfo.entity';
import { ResultService } from './../services/result.service';
import { User } from 'src/models/Achievement/user.entity';
import { AuthenticationService } from './../services/authentication.service';
import { UsersService } from './../services/users.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ManagerDto } from 'src/Dto/manager.dto';
import JwtRefreshGuard from '../guard/jwt-refresh.guard';
import JwtAuthenticationGuard from '../guard/jwt-authentication.guard';
import { SubmissionService } from '../services/submission.service';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/enum';
import { AchievementService } from '../services/achievement.service';

interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('Người dùng')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private usersService: UsersService,
    private authenticationService: AuthenticationService,
    private submissionService: SubmissionService,
    private achiService: AchievementService,
    private resultService: ResultService,
  ) {}

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie =
      await this.authenticationService.getCookieWithJwtAccessToken(request.user.id);

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    const listAchi = await this.achiService.getListAchievementAuditorByUserId(request.user.id);
    return {...request.user, "auditors": listAchi};
  }

  @UseGuards(JwtRefreshGuard)
  @Get('verifyLoginUser')
  verify() {
    return 'Hello!';
  }

  @UseGuards(JwtRefreshGuard)
  @Get('filter')
  @ApiResponse({
    status: 200,
    description: 'Return a list of user',
  })
  async getQuery(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('except') except: string,
  ) {
    try {
      if (page || limit) {
        return await this.usersService.getQuery(page, limit, search, except);
      }
      const data = await this.usersService.getAll();

      return { data: data, count: data.length };
    } catch (error) {
      return {
        data: [],
        count: 0,
      };
    }
  }

  @UseGuards(JwtRefreshGuard)
  @Get('filterMemberUnit/:codeDepartment/:achievementId')
  @ApiResponse({
    status: 200,
    description: 'Trả về thành viên đơn vị của 1 khoa theo 1 danh hiệu',
  })
  async getUserMemberUnit(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Param('achievementId') id: string,
    @Param('codeDepartment') code: string,
  ) {
    try {
      const { data: dataUsers, count } = await this.usersService.getUserUnit(
        page,
        limit,
        search,
        code,
      );
      const data = await Promise.all(
        dataUsers.map(async (user) => {
          const response = await this.submissionService.get(user.id, +id);
          return {
            ...user,
            isSubmission: response ? true : false,
          };
        }),
      );

      return { data, count };
    } catch (error) {
      //console.log(error);
      return {
        data: [],
        count: 0,
      };
    }
  }

  @UseGuards(JwtRefreshGuard)
  @Get('filterAll')
  @ApiResponse({
    status: 200,
    description: 'Return a list of user',
  })
  async getQueryUser(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('userRole') userRole: Role,
  ) {
    try {
      if (page || limit)
        return await this.usersService.getQueryUser(
          page,
          limit,
          search,
          userRole,
        );

      const data = await this.usersService.getAll();

      return { data: data, count: data.length };
    } catch (error) {
      //console.log(error);
      return {
        data: [],
        count: 0,
      };
    }
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('result-achievement')
  async resultAchievement(@Req() request: RequestWithUser) {
    const submission = await this.submissionService.getUserSubmission(
      +request.user.id,
    );

    // const subId = submission.map((sub) => sub.achievement.id);
    // const listSubIdUnique = subId.filter(
    //   (sub, index, self) => self.indexOf(sub) === index,
    // );
    //console.log('listSubIdUnique: ', listSubIdUnique);
    const result = await this.resultService.getResultFinal(+request.user.id);
    //console.log('result: ', result);

    // return listSubIdUnique.map((sub) => {
    //   const answer = result.find((res) => res.id === sub);
    //   if (answer) {
    //     return {
    //       ...answer,
    //       isResult: true,
    //     };
    //   }
    //   return {
    //     id: sub,
    //     result: false,
    //     isResult: false,
    //   };
    // });
    return result
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
    request.res.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookiesForLogOut(),
    );
  }

  @Post('info')
  @UseGuards(JwtAuthenticationGuard)
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin của người dùng',
  })
  async getInfo(@Body() data: { token: string }) {
    return await this.authenticationService.getUserFromAuthenticationToken(
      data.token,
    );
  }

  @Get('contact-info/:userId')
  @UseGuards(JwtAuthenticationGuard)
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin liên lạc của người dùng',
  })
  async getContactInfo(@Param('userId') id: string) {
    const data = await this.usersService.getContactinfo(parseInt(id));
    if (data.length > 0) {
      const result = data[0];
      delete result.user;
      return { ...result, userid: id };
    } else {
      return null;
    }
  }

  @Get('userDY/:userId')
  @UseGuards(JwtAuthenticationGuard)
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin liên lạc của người dùng',
  })
  async getUserWithDY(@Param('userId') id: string) {
    const data = await this.usersService.getUserWithDY(parseInt(id));
    if (data.length > 0 && data[0].department !== null) {
      return {
        department: data[0].department,
      };
    } else {
      return null;
    }
  }

  // @UseGuards(JwtAuthenticationGuard)
  // @Post('infoSV')
  // async createInfoSV(
  //   @Req() request: RequestWithUser,
  //   @Body() data: ContactInfo,
  // ) {
  //   return await this.usersService.createSV(request.user.id, data);
  // }

  @UseGuards(JwtAuthenticationGuard)
  @Put('updateUser')
  async updateInfoUser(@Body() data: { user: User; info: ContactInfo }) {
    return await this.usersService.updateInfo(data.user, data.info);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() data: UserDto) {
    try {
      //console.log(data.email, data.role);
      return await this.usersService.create(data.email, data.role);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post("/department")
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createUserForDepartment(@Body() data: UserDepartmentDto) {
    try {
      return await this.usersService.createUserForDepartment(data.email, data.role, +data.department);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'trả về thông tin người dùng đã được cập nhật',
  })
  @ApiResponse({
    status: 400,
    description: 'không truyền đủ tham số theo yêu cầu',
  })
  async updateManager(@Param('id') id: string, @Body() managerDto: ManagerDto) {
    try {
      const user = await this.usersService.update(+id, managerDto);
      // user.currentHashedRefreshToken = undefined;
      return user;
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.code, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('/allowUpdate/:id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin người dùng đã được cập nhật',
  })
  @ApiResponse({
    status: 400,
    description: 'không truyền đủ tham số theo yêu cầu',
  })
  async allowUpdate(@Param('id') id: string) {
    try {
      //console.log(id);
      const user = await this.usersService.allowUpdate(+id);
      // user.currentHashedRefreshToken = undefined;
      return user;
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.code, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin người dùng',
  })
  async get(@Param('id') id: string) {
    return await this.usersService.getById(+id);
  }

  @Get('/departments/:id')
  @UseGuards(JwtAuthenticationGuard)
  @Roles(Role.DEPARTMENT)
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách thông tin người dùng với Department Id',
  })
  async getUserByDepartment(@Param('id') id: string) {
    return await this.usersService.getUserByDepartment(+id);
  }

  @Get('mssv/:mssv')
  @UseGuards(JwtAuthenticationGuard)
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin người dùng',
  })
  async getParams(@Param('mssv') mssv: string) {
    return await this.usersService.getByMssv(mssv);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard, UseGuards)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin người dùng',
  })
  async getAll(
    @Query('search') search: string,
    @Query('except') except: string,
  ) {
    if (search !== undefined) {
      return await this.usersService.getAll(search);
    }
    if (except !== undefined) {
      return await this.usersService.getAll(undefined, except);
    }
    return await this.usersService.getAll();
  }

  // @Post()
  // @HttpCode(201)
  // @ApiResponse({
  //   status: 201,
  //   description:
  //     'Successfully adding a new achievement, return the achievement added',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Bad request for course information (duplicate code, ...)',
  // })
  // async addCourse(@Body() achievementDto: AchievementDto) {
  //   try {
  //     return await this.achievementService.add(achievementDto);
  //   } catch (error: any) {
  //     console.log(error.message);
  //     throw new HttpException(error.code, HttpStatus.BAD_REQUEST);
  //   }
  // }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description:
      'Successfully deleting a user, return the number of affected objects in affected field',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request for course information (not found id, duplicate code, ...)',
  })
  async deleteUser(@Param('id') id: string) {
    try {
      const result = await this.usersService.delete(+id);
      return { affected: result.affected };
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.code, HttpStatus.BAD_REQUEST);
    }
  }
}
