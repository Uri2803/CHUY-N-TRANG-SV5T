import {
  Controller,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  Body,
  Req,
} from '@nestjs/common';
import TokenVerificationDto from 'src/Dto/tokenVerification.dto';
import { GoogleAuthenticationService } from '../services/googleAuthentication.service';
import { Request } from 'express';
import { UsersService } from '../services/users.service';
import { Role } from 'src/common/enum';

@Controller('google-authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async authenticate(
    @Body() tokenData: TokenVerificationDto,
    @Req() request: Request,
  ) {
    const tokenInfo =
      await this.googleAuthenticationService.oauthClient.getTokenInfo(
        tokenData.token,
      );
    const email = tokenInfo.email;
    const countRow = (await this.usersService.countRow()).length;
    if (countRow === 0) {
      const admin_email = process.env.ADMIN_EMAIL;
      if (email === admin_email) {
        const theAcient = await this.usersService.createAdminWithGoogle(
          email,
          'Admin',
        );
        const { accessTokenCookie, refreshTokenCookie } =
          await this.googleAuthenticationService.getCookiesForUser(theAcient);
        await this.usersService.createInfoTeacher(theAcient, null);
        request.res.setHeader('Set-Cookie', [
          accessTokenCookie,
          refreshTokenCookie,
        ]);
        return { user: theAcient, isFirstTimeLogin: true };
      } else {
        return 'Hệ thống chưa sẵn sàng';
      }
    } else {
      const checkDeleted = await this.usersService.findDeletedWithEmail(email);
      if (checkDeleted.length > 0) {
        if (checkDeleted[0].deletedAt !== null) {
          return { user: null, isFirstTimeLogin: false };
        }
      }
      let userExist = false;
      try {
        await this.usersService.getByEmail(email);
        userExist = true;
      } catch (error: any) {
        userExist = false;
      }
      const extension = email.split('@');
      try {
        const {
          accessTokenCookie,
          refreshTokenCookie,
          user,
          isFirstTimeLogin,
        } = await this.googleAuthenticationService.authenticate(
          tokenData.token,
        );
        request.res.setHeader('Set-Cookie', [
          accessTokenCookie,
          refreshTokenCookie,
        ]);
        if (!isFirstTimeLogin) {
          return { user: user, isFirstTimeLogin: isFirstTimeLogin };
        } else {
          if (user.role === Role.PARTICIPANT) {
            if (!user.hasContactInfo) {
              await this.usersService.createInfoSV(user, null);
            }
            return { user: user, isFirstTimeLogin: isFirstTimeLogin };
          } else {
            if (!user.hasContactInfo) {
              await this.usersService.createInfoTeacher(user, null);
            }

            return { user: user, isFirstTimeLogin: isFirstTimeLogin };
          }
        }
      } catch (error: any) {
        return { user: null, isFirstTimeLogin: true };
      }
    }
  }
}
