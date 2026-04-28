import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { TransactionValidation } from './transaction.validation';
import {
  CreateTransactionRequest,
  TransactionListRequest,
  TransactionListResponse,
  TransactionResponse,
  UpdateTransactionRequest,
} from '../model/transaction.model';
import { TransactionType, User } from '../generated/prisma';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
  ) {}

  private toResponse(transaction: any): TransactionResponse {
    return {
      id: transaction.id,
      recorder: transaction.recorder,
      category: transaction.category,
      merchant: transaction.merchant,
      account_id: transaction.account_id,
      account: transaction.account ?? null,
      to_account_id: transaction.to_account_id,
      to_account: transaction.to_account ?? null,
      amount: transaction.amount.toString(),
      date: transaction.date,
      type: transaction.type,
      note: transaction.note,
      transfer_group: transaction.transfer_group,
      created_at: transaction.created_at,
      updated_at: transaction.updated_at,
    };
  }

  private readonly includeAccounts = {
    account: { select: { name: true, color: true, glyph: true } },
    to_account: { select: { name: true, color: true, glyph: true } },
  };

  async list(
    user: Omit<User, 'password'>,
    query: TransactionListRequest,
  ): Promise<TransactionListResponse> {
    const data = this.validationService.validate(TransactionValidation.LIST, query);

    const where: any = {};

    if (data.account_id) {
      const account = await this.prismaService.account.findFirst({
        where: { id: data.account_id, user_id: user.id },
      });
      if (!account) {
        throw new HttpException('Rekening tidak ditemukan', HttpStatus.NOT_FOUND);
      }
      where.OR = [{ account_id: data.account_id }, { to_account_id: data.account_id }];
    } else {
      const accounts = await this.prismaService.account.findMany({
        where: { user_id: user.id },
        select: { id: true },
      });
      where.account_id = { in: accounts.map((a) => a.id) };
    }

    if (data.type) where.type = data.type;
    if (data.recorder) where.recorder = data.recorder;
    if (data.category) where.category = { contains: data.category, mode: 'insensitive' };
    if (data.date_from || data.date_to) {
      where.date = {
        ...(data.date_from && { gte: data.date_from }),
        ...(data.date_to && { lte: data.date_to }),
      };
    }

    const page = data.page ?? 1;
    const limit = data.limit ?? 20;

    const [total, transactions] = await Promise.all([
      this.prismaService.transaction.count({ where }),
      this.prismaService.transaction.findMany({
        where,
        include: this.includeAccounts,
        orderBy: [{ date: 'desc' }, { created_at: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      transactions: transactions.map((t) => this.toResponse(t)),
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async create(
    user: Omit<User, 'password'>,
    request: CreateTransactionRequest,
  ): Promise<TransactionResponse> {
    const data = this.validationService.validate(TransactionValidation.CREATE, request);

    const account = await this.prismaService.account.findUnique({
      where: { id: data.account_id },
    });
    if (!account || account.user_id !== user.id) {
      throw new HttpException('Rekening tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    if (data.type === TransactionType.TRANSFER) {
      const toAccount = await this.prismaService.account.findUnique({
        where: { id: data.to_account_id },
      });
      if (!toAccount || toAccount.user_id !== user.id) {
        throw new HttpException('Rekening tujuan tidak ditemukan', HttpStatus.NOT_FOUND);
      }
    }

    const amount = Number(data.amount);
    const transferGroup = data.type === TransactionType.TRANSFER ? uuidv4() : null;

    const ops: any[] = [
      this.prismaService.transaction.create({
        data: {
          recorder: data.recorder,
          category: data.category,
          merchant: data.merchant,
          account_id: data.account_id,
          to_account_id: data.to_account_id ?? null,
          amount: data.amount,
          date: data.date,
          type: data.type,
          note: data.note ?? null,
          transfer_group: transferGroup,
        },
        include: this.includeAccounts,
      }),
    ];

    if (data.type === TransactionType.INCOME) {
      ops.push(
        this.prismaService.account.update({
          where: { id: data.account_id },
          data: { balance: { increment: amount } },
        }),
      );
    } else if (data.type === TransactionType.EXPENSE) {
      ops.push(
        this.prismaService.account.update({
          where: { id: data.account_id },
          data: { balance: { decrement: amount } },
        }),
      );
    } else if (data.type === TransactionType.TRANSFER) {
      ops.push(
        this.prismaService.account.update({
          where: { id: data.account_id },
          data: { balance: { decrement: amount } },
        }),
        this.prismaService.account.update({
          where: { id: data.to_account_id },
          data: { balance: { increment: amount } },
        }),
      );
    }

    ops.push(
      this.prismaService.activityLog.create({
        data: {
          user_id: user.id,
          user_name: user.full_name,
          action: `Tambah Transaksi: ${data.merchant} (${data.type})`,
          module: 'Transaksi',
        },
      }),
    );

    const [transaction] = await this.prismaService.$transaction(ops);
    return this.toResponse(transaction);
  }

  async get(user: Omit<User, 'password'>, transactionId: number): Promise<TransactionResponse> {
    const transaction = await this.prismaService.transaction.findUnique({
      where: { id: transactionId },
      include: this.includeAccounts,
    });

    if (!transaction) {
      throw new HttpException('Transaksi tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    const account = await this.prismaService.account.findUnique({
      where: { id: transaction.account_id },
    });
    if (!account || account.user_id !== user.id) {
      throw new HttpException('Transaksi tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    return this.toResponse(transaction);
  }

  async update(
    user: Omit<User, 'password'>,
    transactionId: number,
    request: UpdateTransactionRequest,
  ): Promise<TransactionResponse> {
    const data = this.validationService.validate(TransactionValidation.UPDATE, request);

    const existing = await this.prismaService.transaction.findUnique({
      where: { id: transactionId },
    });
    if (!existing) {
      throw new HttpException('Transaksi tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    const existingAccount = await this.prismaService.account.findUnique({
      where: { id: existing.account_id },
    });
    if (!existingAccount || existingAccount.user_id !== user.id) {
      throw new HttpException('Transaksi tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    if (data.account_id && data.account_id !== existing.account_id) {
      const newAccount = await this.prismaService.account.findUnique({
        where: { id: data.account_id },
      });
      if (!newAccount || newAccount.user_id !== user.id) {
        throw new HttpException('Rekening tidak ditemukan', HttpStatus.NOT_FOUND);
      }
    }

    const newType = data.type ?? existing.type;
    const newAccountId = data.account_id ?? existing.account_id;
    const newToAccountId =
      data.to_account_id !== undefined ? data.to_account_id : existing.to_account_id;
    const newAmount = data.amount ?? Number(existing.amount);

    if (newType === TransactionType.TRANSFER) {
      if (!newToAccountId) {
        throw new HttpException(
          'Rekening tujuan wajib diisi untuk transfer',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (newToAccountId === newAccountId) {
        throw new HttpException(
          'Rekening tujuan tidak boleh sama dengan rekening sumber',
          HttpStatus.BAD_REQUEST,
        );
      }
      const toAccount = await this.prismaService.account.findUnique({
        where: { id: newToAccountId },
      });
      if (!toAccount || toAccount.user_id !== user.id) {
        throw new HttpException('Rekening tujuan tidak ditemukan', HttpStatus.NOT_FOUND);
      }
    }

    const oldAmount = Number(existing.amount);
    const ops: any[] = [];

    // Reverse old balance effect
    if (existing.type === TransactionType.INCOME) {
      ops.push(
        this.prismaService.account.update({
          where: { id: existing.account_id },
          data: { balance: { decrement: oldAmount } },
        }),
      );
    } else if (existing.type === TransactionType.EXPENSE) {
      ops.push(
        this.prismaService.account.update({
          where: { id: existing.account_id },
          data: { balance: { increment: oldAmount } },
        }),
      );
    } else if (existing.type === TransactionType.TRANSFER && existing.to_account_id) {
      ops.push(
        this.prismaService.account.update({
          where: { id: existing.account_id },
          data: { balance: { increment: oldAmount } },
        }),
        this.prismaService.account.update({
          where: { id: existing.to_account_id },
          data: { balance: { decrement: oldAmount } },
        }),
      );
    }

    // Apply new balance effect
    if (newType === TransactionType.INCOME) {
      ops.push(
        this.prismaService.account.update({
          where: { id: newAccountId },
          data: { balance: { increment: newAmount } },
        }),
      );
    } else if (newType === TransactionType.EXPENSE) {
      ops.push(
        this.prismaService.account.update({
          where: { id: newAccountId },
          data: { balance: { decrement: newAmount } },
        }),
      );
    } else if (newType === TransactionType.TRANSFER && newToAccountId) {
      ops.push(
        this.prismaService.account.update({
          where: { id: newAccountId },
          data: { balance: { decrement: newAmount } },
        }),
        this.prismaService.account.update({
          where: { id: newToAccountId },
          data: { balance: { increment: newAmount } },
        }),
      );
    }

    const updatedTransactionOp = this.prismaService.transaction.update({
      where: { id: transactionId },
      data: {
        ...(data.recorder !== undefined && { recorder: data.recorder }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.merchant !== undefined && { merchant: data.merchant }),
        ...(data.account_id !== undefined && { account_id: data.account_id }),
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.date !== undefined && { date: data.date }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.note !== undefined && { note: data.note }),
        to_account_id:
          newType === TransactionType.TRANSFER ? (newToAccountId ?? null) : null,
        transfer_group:
          newType === TransactionType.TRANSFER
            ? (existing.transfer_group ?? uuidv4())
            : null,
      },
      include: this.includeAccounts,
    });

    const txUpdateIndex = ops.length;
    ops.push(updatedTransactionOp);

    ops.push(
      this.prismaService.activityLog.create({
        data: {
          user_id: user.id,
          user_name: user.full_name,
          action: `Update Transaksi: ${data.merchant ?? existing.merchant} (${newType})`,
          module: 'Transaksi',
        },
      }),
    );

    const results = await this.prismaService.$transaction(ops);
    return this.toResponse(results[txUpdateIndex]);
  }

  async remove(user: Omit<User, 'password'>, transactionId: number): Promise<void> {
    const existing = await this.prismaService.transaction.findUnique({
      where: { id: transactionId },
    });
    if (!existing) {
      throw new HttpException('Transaksi tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    const account = await this.prismaService.account.findUnique({
      where: { id: existing.account_id },
    });
    if (!account || account.user_id !== user.id) {
      throw new HttpException('Transaksi tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    const oldAmount = Number(existing.amount);
    const ops: any[] = [];

    if (existing.type === TransactionType.INCOME) {
      ops.push(
        this.prismaService.account.update({
          where: { id: existing.account_id },
          data: { balance: { decrement: oldAmount } },
        }),
      );
    } else if (existing.type === TransactionType.EXPENSE) {
      ops.push(
        this.prismaService.account.update({
          where: { id: existing.account_id },
          data: { balance: { increment: oldAmount } },
        }),
      );
    } else if (existing.type === TransactionType.TRANSFER && existing.to_account_id) {
      ops.push(
        this.prismaService.account.update({
          where: { id: existing.account_id },
          data: { balance: { increment: oldAmount } },
        }),
        this.prismaService.account.update({
          where: { id: existing.to_account_id },
          data: { balance: { decrement: oldAmount } },
        }),
      );
    }

    ops.push(
      this.prismaService.transaction.delete({ where: { id: transactionId } }),
      this.prismaService.activityLog.create({
        data: {
          user_id: user.id,
          user_name: user.full_name,
          action: `Hapus Transaksi: ${existing.merchant} (${existing.type})`,
          module: 'Transaksi',
        },
      }),
    );

    await this.prismaService.$transaction(ops);
  }
}
