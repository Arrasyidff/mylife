import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { WebResponse } from '../model/web.model';
import {
  CreateTransactionRequest,
  TransactionListRequest,
  TransactionListResponse,
  TransactionResponse,
  UpdateTransactionRequest,
} from '../model/transaction.model';
import { User } from '../../generated/prisma';

@Controller('api/transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async list(
    @CurrentUser() user: Omit<User, 'password'>,
    @Query() query: TransactionListRequest,
  ): Promise<WebResponse<TransactionListResponse>> {
    const result = await this.transactionService.list(user, query);
    return { data: result };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: Omit<User, 'password'>,
    @Body() body: CreateTransactionRequest,
  ): Promise<WebResponse<TransactionResponse>> {
    const result = await this.transactionService.create(user, body);
    return { data: result };
  }

  @Get(':id')
  async get(
    @CurrentUser() user: Omit<User, 'password'>,
    @Param('id') id: string,
  ): Promise<WebResponse<TransactionResponse>> {
    const transactionId = parseInt(id, 10);
    if (isNaN(transactionId)) {
      throw new HttpException('ID transaksi tidak valid', HttpStatus.BAD_REQUEST);
    }
    const result = await this.transactionService.get(user, transactionId);
    return { data: result };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentUser() user: Omit<User, 'password'>,
    @Param('id') id: string,
    @Body() body: UpdateTransactionRequest,
  ): Promise<WebResponse<TransactionResponse>> {
    const transactionId = parseInt(id, 10);
    if (isNaN(transactionId)) {
      throw new HttpException('ID transaksi tidak valid', HttpStatus.BAD_REQUEST);
    }
    const result = await this.transactionService.update(user, transactionId, body);
    return { data: result };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @CurrentUser() user: Omit<User, 'password'>,
    @Param('id') id: string,
  ): Promise<WebResponse<string>> {
    const transactionId = parseInt(id, 10);
    if (isNaN(transactionId)) {
      throw new HttpException('ID transaksi tidak valid', HttpStatus.BAD_REQUEST);
    }
    await this.transactionService.remove(user, transactionId);
    return { data: 'OK' };
  }
}
