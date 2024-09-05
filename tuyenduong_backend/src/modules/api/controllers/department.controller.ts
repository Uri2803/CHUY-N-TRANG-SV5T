import { DepartmentService } from './../services/department.service';
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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DepartmentDto } from 'src/Dto/department.dto';
import JwtAuthenticationGuard from '../guard/jwt-authentication.guard';
import { Role } from 'src/common/enum';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from '../guard/roles.guard';

@ApiTags('Khoa')
@Controller('department')
@UseGuards(JwtAuthenticationGuard)
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách Khoa',
  })
  async get(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    try {
      if (page || limit) {
        return await this.departmentService.get(page, limit, search);
      }
      return await this.departmentService.getAll();
    } catch (error) {
      throw new HttpException(
        { statusCode: error.code, message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Khởi tạo thành công và trả về Khoa',
  })
  @ApiResponse({
    status: 400,
    description: 'Yêu cầu không hợp lệ',
  })
  async add(@Body() data: DepartmentDto) {
    try {
      return await this.departmentService.addDepartment(data);
    } catch (error: any) {
      if (error.status === 400) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Post('list')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Khởi tạo thành công và trả về  Khoa',
  })
  @ApiResponse({
    status: 400,
    description: 'Yêu cầu không hợp lệ',
  })
  async addList(@Body() data: DepartmentDto[]) {
    try {
      return await this.departmentService.addDepartmentList(data);
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(
        { statusCode: error.code, message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Cập nhập lại thông tin đơn vị tương ứng',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request for course information (not found id, duplicate code, ...)',
  })
  async update(@Param('id') id: string, @Body() departmentDto: DepartmentDto) {
    try {
      return await this.departmentService.update(+id, departmentDto);
    } catch (error: any) {
      if (error.status === 400) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
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
      const result = await this.departmentService.delete(+id);
      return { affected: result.affected };
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(
        { statusCode: error.code, message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
