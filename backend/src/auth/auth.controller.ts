import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { WebResponse } from '../model/web.model';
import {
  AuthChangePasswordRequest,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthUserResponse,
} from '../model/auth.model';
import { User } from '../generated/prisma';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: AuthLoginRequest): Promise<WebResponse<AuthLoginResponse>> {
    const result = await this.authService.login(body);
    return { data: result };
  }

  @Get('me')
  async me(@CurrentUser() user: Omit<User, 'password'>): Promise<WebResponse<AuthUserResponse>> {
    const result = await this.authService.me(user.id);
    return { data: result };
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user: Omit<User, 'password'>,
    @Body() body: AuthChangePasswordRequest,
  ): Promise<WebResponse<string>> {
    await this.authService.changePassword(user, body);
    return { data: 'OK' };
  }
}
