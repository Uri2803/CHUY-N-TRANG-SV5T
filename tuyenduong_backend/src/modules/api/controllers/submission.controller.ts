import { User } from './../../../models/Achievement/user.entity';
import { Role } from './../../../common/enum';
import { Roles } from './../../../common/roles.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResultService } from '../services/result.service';
import { UsersService } from '../services/users.service';
import { PythonShell } from 'python-shell'

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { SubmissionService } from '../services/submission.service';
import { SubmissionDto } from 'src/Dto/submission.dto';
import { diskStorage } from 'multer';
// import { file_v1 } from 'googleapis';
import * as fs from 'fs';
import {
  editFileName,
  imageFileFilter,
} from '../../../utils/fileUploadHandler';
import JwtAuthenticationGuard from '../guard/jwt-authentication.guard';
import { RolesGuard } from '../guard/roles.guard';
import { AchievementService } from '../services/achievement.service';
interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('Trả lời cho 1 tiêu chí')
@UseGuards(JwtAuthenticationGuard)
@Controller('submission')
export class SubmissionController {
  constructor(
    private submissionService: SubmissionService,
    private resultService: ResultService,
    private achievementService: AchievementService,
    private userService: UsersService,
  ) {}

  @Get('/:achievement/:auditor')
  @Roles(Role.MANAGER, Role.PARTICIPANT, Role.DEPARTMENT)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Trả về ds người nộp danh hiệu và kết quả họ được chấm chưa',
  })
  async getSubmissionExamer(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Param('achievement') achievementId: string,
    @Param('auditor') auditorId: string,
    @Req() request: RequestWithUser,
  ) {
    try {
      var { count, examers } =
        await this.submissionService.getSubmissionExamer(
          parseInt(achievementId),
          page,
          limit,
          search,
        );
        const dataAchievement = await this.achievementService.getOne(
          +achievementId
        );
      const data = await Promise.all(
        examers.map(async (examer: any) => {
          const isExamer = await this.resultService.getExamer(
            +achievementId,
            examer.user_id,
            request.user.id ,
          );
          return {
            id: examer.user_id,
            name: examer.user_name,
            surName: examer.user_surName,
            mssv: examer.user_mssv,
            email: examer.user_email,
            department: examer.department,
            isResult: isExamer
              ? isExamer.result
              : 'none',
          };
        }),
      );
      return {
        count,
        data,
      };
    } catch (error) {
      console.log(error.message);
    }
  }

  @Get('/final/:achievement/:auditor')
  @Roles(Role.MANAGER, Role.PARTICIPANT, Role.DEPARTMENT)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Trả về ds người nộp danh hiệu và kết quả họ được chấm chưa',
  })
  async getFinalSubmissionExamer(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Param('achievement') achievementId: string,
    @Param('auditor') auditorId: string,
    @Req() request: RequestWithUser,
  ) {
    try {
      var { count, examers } =
        await this.submissionService.getSubmissionExamer(
          parseInt(achievementId),
          page,
          limit,
          search,
        );
        const dataAchievement = await this.achievementService.getOne(
          +achievementId
        );
      const data = await Promise.all(
        examers.map(async (examer: any) => {
          const isExamer = await this.resultService.getExamer(
            +achievementId,
            examer.user_id,
            dataAchievement.auditorFinal && dataAchievement.auditorFinal.id
          );
          return {
            id: examer.user_id,
            name: examer.user_name,
            surName: examer.user_surName,
            mssv: examer.user_mssv,
            email: examer.user_email,
            department: examer.department,
            isResult: isExamer
              ? isExamer.result
              : 'none',
          };
        }),
      );
      return {
        count,
        data,
      };
    } catch (error) {
      console.log(error.message);
    }
  }

  @Get('department/:achievement/:auditor')
  @Roles(Role.MANAGER, Role.PARTICIPANT, Role.DEPARTMENT)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Trả về ds người nộp danh hiệu và kết quả họ được chấm chưa',
  })
  async getDepartmentSubmissionExamer(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Param('achievement') achievementId: string,
    @Param('auditor') auditorId: string,
    @Req() request: RequestWithUser,
  ) {
    try {
      var { count, examers } =
        await this.submissionService.getSubmissionExamer(
          parseInt(achievementId),
          page,
          limit,
          search,
        );
      const data = await Promise.all(
        examers.map(async (examer: any) => {
          const isExamer = await this.resultService.getExamer(
            +achievementId,
            examer.user_id,
            +auditorId === -999 ? request.user.id : +auditorId,
          );
          return {
            id: examer.user_id,
            name: examer.user_name,
            surName: examer.user_surName,
            mssv: examer.user_mssv,
            email: examer.user_email,
            department: examer.department,
            isResult: isExamer
              ? isExamer.result
              : 'none',
          };
        }),
      );
      return {
        count,
        data,
      };
    } catch (error) {
      console.log(error.message);
    }
  }

  @Get('all/:departmentId')
  @ApiResponse({
    status: 200,
    description: 'Return a list of submission',
  })
  async getSubmission(@Param('departmentId') departmentId: string) {
    try {
      return await this.submissionService.getSubmission(parseInt(departmentId));
    } catch (error) {
      console.error(error.message);
    }
  }

  @Get('result/:achievement/:examer')
  @ApiResponse({
    status: 200,
    description:
      'Trả về xem 1 nộp được tất cả người trong hội đồng chấm như thế nào',
  })
  async getResult(
    @Param('achievement') achievementId: string,
    @Param('examer') examerId: string,
    @Req() request: RequestWithUser,
  ) {
    try {
      const isExist = await this.achievementService.checkAuditorFinal(
        +achievementId,
        [{ value: request.user?.id, label: request.user?.email }],
      );
      if (!isExist) return [];
      const result = await this.resultService.getResult(
        +achievementId,
        +examerId,
      );
      return result.map((res) => ({
        final: res.final,
        result: res.result,
        id: res.auditor.id,
        name: res.auditor.name,
        surName: res.auditor.surName,
        email: res.auditor.email,
      }));
    } catch (error) {
      console.error(error.message);
    }
  }

  @Get('/participant-get/:departmentId/:userId')
  @ApiResponse({
    status: 200,
    description: 'Return a list of submission',
  })
  async getList(
    @Param('departmentId') departmentId: string,
    @Param('userId') userId: string,
  ) {
    return await this.submissionService.getAll(
      parseInt(departmentId),
      parseInt(userId),
    );
  }

  @Post("achievements/:id/verified-user")
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DEPARTMENT)
  async verifyUser(@Param('id') id: string, @Body() data: {id: string}) {
    try {
      return await this.submissionService.verifyUser(+id, +data.id);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put("achievements/:id/verified-user")
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DEPARTMENT)
  async unVerifyUser(@Param('id') id: string, @Body() data: {id: string}) {
    try {
      return await this.submissionService.unVerifyUser(+id, +data.id);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/:departmentId/:userId')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Successfully adding a submission',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request for submission',
  })
  async addSubmission(
    @Body() submissionDto: SubmissionDto[],
    // @Param('departmentId') departmentId: string,
    // @Param('userId') userId: string,
  ) {
    try {
      return await this.submissionService.add(submissionDto);
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.code, HttpStatus.BAD_REQUEST);
    }
  }
  @Post('upload/:userId/:achievementId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          //console.log(req.params);
          const path = `./public/usersubmits/${req.params.userId}/${req.params.achievementId}`;
          fs.mkdirSync(path, { recursive: true });
          callback(null, path);
        },
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
      limits: { fieldSize: 1 * 1024 * 1024 },
    }),
  )
  async uploadFile(@UploadedFile() file) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    //console.log(file);
    return response;
  }

  @Post('uploadfiles/:userId/:achievementId')
  @UseInterceptors(
    FilesInterceptor('file', 50, {
      storage: diskStorage({
        destination: (req, file, callback) => {
          //console.log(req.params);
          const path = `./public/usersubmits/${req.params.userId}/${req.params.achievementId}`;
          fs.mkdirSync(path, { recursive: true });
          callback(null, path);
        },
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
      limits: { fieldSize: 1 * 1024 * 1024 },
    }),
  )
  async uploadFiles(@UploadedFiles() file) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    //console.log(file);
    return response;
  }

  @Get('download/:userId/:achievementId/:fileName')
  async serveFile(
    @Param('userId') userId,
    @Param('achievementId') achievementId,
    @Param('fileName') fileName,
    @Res() res,
  ): Promise<any> {
    //console.log('Received request to download file: ' + fileName);
    res.sendFile(fileName, {
      root: `./public/usersubmits/${userId}/${achievementId}/`,
    });
  }

  @Post('/:userId/:achievementId/:fileName/compare')
  async compareFile(
    @Param('userId') userId,
    @Param('achievementId') achievementId,
    @Param('fileName') fileName,
    @Body() data: {text: string},
  ): Promise<any> {
    try {
      let results = await PythonShell.run('ocr-bhd/main.py', {
        args: [
          `./public/usersubmits/${userId}/${achievementId}/${fileName}`,
          data.text,
        ]
      });
      return results[0]
    } catch (error: any) {
      console.log(error)
      throw new HttpException(error.code, HttpStatus.BAD_REQUEST);
    }
    
  }
}
