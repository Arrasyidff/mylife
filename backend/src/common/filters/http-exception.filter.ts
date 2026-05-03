import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '../../../generated/prisma/runtime/library';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      const message =
        typeof res === 'string' ? res : (res as any).message ?? exception.message;
      return response.status(status).json({ data: null, errors: message });
    }

    if (exception instanceof ZodError) {
      const messages = exception.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
      return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        data: null,
        errors: messages,
      });
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      const { code, meta } = exception;

      if (code === 'P2002') {
        const fields = (meta?.target as string[])?.join(', ') ?? 'field';
        return response.status(HttpStatus.CONFLICT).json({
          data: null,
          errors: `${fields} sudah digunakan`,
        });
      }

      if (code === 'P2025') {
        return response.status(HttpStatus.NOT_FOUND).json({
          data: null,
          errors: 'Data tidak ditemukan',
        });
      }

      if (code === 'P2003') {
        return response.status(HttpStatus.BAD_REQUEST).json({
          data: null,
          errors: 'Relasi data tidak valid',
        });
      }

      if (code === 'P2014') {
        return response.status(HttpStatus.BAD_REQUEST).json({
          data: null,
          errors: 'Relasi data tidak boleh dihapus',
        });
      }

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        errors: `Database error: ${code}`,
      });
    }

    if (exception instanceof PrismaClientValidationError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        errors: 'Data tidak valid',
      });
    }

    console.error('Unhandled exception:', exception);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      data: null,
      errors: 'Terjadi kesalahan pada server',
    });
  }
}
