import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  AuthChangePasswordRequest,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthUserResponse,
} from '../model/auth.model';
import { AuthValidation } from './auth.validation';
import { User } from '../generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
    private readonly jwtService: JwtService,
  ) {}

  async login(request: AuthLoginRequest): Promise<AuthLoginResponse> {
    const data = this.validationService.validate(AuthValidation.LOGIN, request);

    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { username: data.username },
    });

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Username atau password salah', HttpStatus.UNAUTHORIZED);
    }

    const access_token = await this.jwtService.signAsync({
      userId: user.id,
      username: user.username,
    });

    await this.prismaService.activityLog.create({
      data: {
        user_id: user.id,
        user_name: user.full_name,
        action: `Login: ${user.username}`,
        module: 'Auth',
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return { access_token, user: userWithoutPassword as AuthUserResponse };
  }

  async me(userId: string): Promise<AuthUserResponse> {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id: userId },
      omit: { password: true },
    });

    return user as AuthUserResponse;
  }

  async changePassword(
    currentUser: Omit<User, 'password'>,
    request: AuthChangePasswordRequest,
  ): Promise<void> {
    const data = this.validationService.validate(AuthValidation.CHANGE_PASSWORD, request);

    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id: currentUser.id },
    });

    const isOldPasswordValid = await bcrypt.compare(data.old_password, user.password);
    if (!isOldPasswordValid) {
      throw new HttpException('Password lama tidak sesuai', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(data.new_password, 10);

    await this.prismaService.$transaction([
      this.prismaService.user.update({
        where: { id: currentUser.id },
        data: { password: hashedPassword },
      }),
      this.prismaService.activityLog.create({
        data: {
          user_id: currentUser.id,
          user_name: currentUser.full_name,
          action: `Ubah Password: ${currentUser.username}`,
          module: 'Auth',
        },
      }),
    ]);
  }
}
