import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';
import { AuthenticationService } from './authentication.service';
import User from '../../../models/Achievement/user.entity';

@Injectable()
export class GoogleAuthenticationService {
  oauthClient: Auth.OAuth2Client;
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly authenticationService: AuthenticationService,
  ) {
    const clientID = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });

    return userInfoResponse.data;
  }

  async getCookiesForUser(user: User) {
    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(user.id);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    return {
      accessTokenCookie,
      refreshTokenCookie,
    };
  }

  async handleRegisteredUser(user: User, isFirstTimeLogin: boolean) {
    //chỗ này sử lý sau nếu phân quyền người dùng khi người đó chưa đăng nhập
    // if (!user.isRegisteredWithGoogle) {
    //   throw new UnauthorizedException();
    // }
    //Nếu là sinh viên đã đăng kí => user.isRegisteredWithGoogle == true
    //Nếu là giảng viên đã đăng kí => user.isRegisteredWithGoogle == false
    const { accessTokenCookie, refreshTokenCookie } =
      await this.getCookiesForUser(user);

    return {
      accessTokenCookie,
      refreshTokenCookie,
      user,
      isFirstTimeLogin: isFirstTimeLogin,
    };
  }

  async registerUser(token: string, email: string) {
    try {
      const userData = await this.getUserData(token);
      const Uname = userData.name;

      const user = await this.usersService.createWithGoogle(email, Uname);

      return this.handleRegisteredUser(user, false);
    } catch (error) {
      // console.log(error);
      throw new error();
    }
  }

  async authenticate(token: string) {
    const tokenInfo = await this.oauthClient.getTokenInfo(token);
    const email = tokenInfo.email;

    try {
      const user = await this.usersService.getByEmail(email);
      // console.log('test response user:', user);
      if (user.isRegisteredWithGoogle) {
        return this.handleRegisteredUser(user, false);
      } else {
        if (user.name !== null) {
          // console.log('Teacher login: ', user.mssv);
          return this.handleRegisteredUser(user, false);
        } else {
          //console.log('Teacher first time login:', user.mssv);
          return this.handleRegisteredUser(user, true);
        }
      }
    } catch (error) {
      if (error.status !== 404) {
        console.log('search for user when login error', error.message);
        throw new error();
      }
      //Nếu trong db chưa có user => user == null
      const { accessTokenCookie, refreshTokenCookie, user, isFirstTimeLogin } =
        await this.registerUser(token, email);
      //first time login student
      return {
        accessTokenCookie: accessTokenCookie,
        refreshTokenCookie: refreshTokenCookie,
        user: user,
        isFirstTimeLogin: true,
      };
    }
  }
  async registerStudent(token: string) {
    try {
      const tokenInfo = await this.oauthClient.getTokenInfo(token);

      const email = tokenInfo.email;
      return this.registerUser(token, email);
    } catch (err: any) {
      console.log('Error when creating user: ', err.message);
    }
  }
  async registerTeacher(token: string) {
    try {
      const userData = await this.getUserData(token);
      const Uname = userData.name;
      const tokenInfo = await this.oauthClient.getTokenInfo(token);
      const email = tokenInfo.email;
      const user = await this.usersService.getByEmail(email);
      return { ...user, name: Uname };
    } catch (err: any) {
      console.log('Error when creating lecturer:', err.message);
    }
  }
}
