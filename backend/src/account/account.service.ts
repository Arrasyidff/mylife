import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { AccountValidation } from './account.validation';
import {
  AccountListResponse,
  AccountResponse,
  CreateAccountRequest,
  UpdateAccountRequest,
} from '../model/account.model';
import { User } from '../generated/prisma';

@Injectable()
export class AccountService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
  ) {}

  private toResponse(account: any): AccountResponse {
    return {
      id: account.id,
      user_id: account.user_id,
      name: account.name,
      subtitle: account.subtitle,
      balance: account.balance.toString(),
      color: account.color,
      glyph: account.glyph,
      type: account.type,
      account_number: account.account_number,
      hidden: account.hidden,
      created_at: account.created_at,
      updated_at: account.updated_at,
    };
  }

  async list(
    user: Omit<User, 'password'>,
    includeHidden: boolean,
  ): Promise<AccountListResponse> {
    const accounts = await this.prismaService.account.findMany({
      where: {
        user_id: user.id,
        ...(includeHidden ? {} : { hidden: false }),
      },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });

    const visibleAccounts = accounts.filter((a) => !a.hidden);
    const totalBalance = visibleAccounts.reduce(
      (sum, a) => sum + Number(a.balance),
      0,
    );

    return {
      accounts: accounts.map((a) => this.toResponse(a)),
      total_balance: totalBalance.toFixed(2),
    };
  }

  async create(
    user: Omit<User, 'password'>,
    request: CreateAccountRequest,
  ): Promise<AccountResponse> {
    const data = this.validationService.validate(AccountValidation.CREATE, request);

    const [account] = await this.prismaService.$transaction([
      this.prismaService.account.create({
        data: {
          user_id: user.id,
          name: data.name,
          subtitle: data.subtitle ?? null,
          balance: data.balance,
          color: data.color,
          glyph: data.glyph,
          type: data.type,
          account_number: data.account_number ?? null,
          hidden: data.hidden,
        },
      }),
      this.prismaService.activityLog.create({
        data: {
          user_id: user.id,
          user_name: user.full_name,
          action: `Tambah Rekening: ${data.name}`,
          module: 'Rekening',
        },
      }),
    ]);

    return this.toResponse(account);
  }

  async get(user: Omit<User, 'password'>, accountId: string): Promise<AccountResponse> {
    const account = await this.prismaService.account.findUnique({
      where: { id: accountId },
    });

    if (!account || account.user_id !== user.id) {
      throw new HttpException('Rekening tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    return this.toResponse(account);
  }

  async update(
    user: Omit<User, 'password'>,
    accountId: string,
    request: UpdateAccountRequest,
  ): Promise<AccountResponse> {
    const data = this.validationService.validate(AccountValidation.UPDATE, request);

    const existing = await this.prismaService.account.findUnique({
      where: { id: accountId },
    });

    if (!existing || existing.user_id !== user.id) {
      throw new HttpException('Rekening tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    const [account] = await this.prismaService.$transaction([
      this.prismaService.account.update({
        where: { id: accountId },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.subtitle !== undefined && { subtitle: data.subtitle }),
          ...(data.balance !== undefined && { balance: data.balance }),
          ...(data.color !== undefined && { color: data.color }),
          ...(data.glyph !== undefined && { glyph: data.glyph }),
          ...(data.type !== undefined && { type: data.type }),
          ...(data.account_number !== undefined && { account_number: data.account_number }),
          ...(data.hidden !== undefined && { hidden: data.hidden }),
        },
      }),
      this.prismaService.activityLog.create({
        data: {
          user_id: user.id,
          user_name: user.full_name,
          action: `Update Rekening: ${existing.name}`,
          module: 'Rekening',
        },
      }),
    ]);

    return this.toResponse(account);
  }

  async remove(user: Omit<User, 'password'>, accountId: string): Promise<void> {
    const existing = await this.prismaService.account.findUnique({
      where: { id: accountId },
    });

    if (!existing || existing.user_id !== user.id) {
      throw new HttpException('Rekening tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    await this.prismaService.$transaction([
      this.prismaService.account.delete({ where: { id: accountId } }),
      this.prismaService.activityLog.create({
        data: {
          user_id: user.id,
          user_name: user.full_name,
          action: `Hapus Rekening: ${existing.name}`,
          module: 'Rekening',
        },
      }),
    ]);
  }
}
