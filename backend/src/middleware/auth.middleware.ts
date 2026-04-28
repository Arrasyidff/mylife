import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../common/prisma.service';
import { User } from '../generated/prisma';

export interface AuthRequest extends Request {
  user?: Omit<User, 'password'>;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}

  async use(req: AuthRequest, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException('Token tidak ditemukan', HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.slice(7);
    let payload: { userId: string; username: string };

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        username: string;
      };
    } catch {
      throw new HttpException('Token tidak valid atau sudah kadaluarsa', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: payload.userId },
      omit: { password: true },
    });

    if (!user) {
      throw new HttpException('Pengguna tidak ditemukan', HttpStatus.UNAUTHORIZED);
    }

    if (user.status === 'INACTIVE') {
      throw new HttpException('Akun tidak aktif', HttpStatus.FORBIDDEN);
    }

    req.user = user;
    next();
  }
}
