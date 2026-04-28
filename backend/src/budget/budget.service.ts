import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BudgetPeriod, TransactionType, User } from '../generated/prisma';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { BudgetValidation } from './budget.validation';
import {
  BudgetResponse,
  CreateBudgetRequest,
  UpdateBudgetRequest,
} from '../model/budget.model';

@Injectable()
export class BudgetService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
  ) {}

  private getCurrentPeriodRange(
    startDate: Date,
    period: BudgetPeriod,
  ): { from: Date; to: Date } {
    const now = new Date();
    const start = new Date(startDate);

    if (period === BudgetPeriod.WEEKLY) {
      const startDayOfWeek = start.getDay();
      const currentDayOfWeek = now.getDay();
      const diff = (currentDayOfWeek - startDayOfWeek + 7) % 7;
      const from = new Date(now);
      from.setDate(now.getDate() - diff);
      from.setHours(0, 0, 0, 0);
      const to = new Date(from);
      to.setDate(from.getDate() + 7);
      return { from, to };
    }

    if (period === BudgetPeriod.YEARLY) {
      const from = new Date(now.getFullYear(), start.getMonth(), start.getDate());
      if (from > now) {
        from.setFullYear(from.getFullYear() - 1);
      }
      const to = new Date(from);
      to.setFullYear(to.getFullYear() + 1);
      return { from, to };
    }

    // MONTHLY
    const from = new Date(now.getFullYear(), now.getMonth(), start.getDate());
    if (from > now) {
      from.setMonth(from.getMonth() - 1);
    }
    const to = new Date(from);
    to.setMonth(to.getMonth() + 1);
    return { from, to };
  }

  private async calculateSpent(
    accountIds: string[],
    category: string,
    from: Date,
    to: Date,
  ): Promise<number> {
    const result = await this.prismaService.transaction.aggregate({
      where: {
        account_id: { in: accountIds },
        category,
        type: TransactionType.EXPENSE,
        date: { gte: from, lt: to },
      },
      _sum: { amount: true },
    });

    return Number(result._sum.amount ?? 0);
  }

  private async toResponse(
    budget: any,
    accountIds: string[],
  ): Promise<BudgetResponse> {
    const { from, to } = this.getCurrentPeriodRange(budget.start_date, budget.period);
    const spent = await this.calculateSpent(accountIds, budget.category, from, to);
    const total = Number(budget.total);
    const remaining = Math.max(0, total - spent);

    return {
      id: budget.id,
      user_id: budget.user_id,
      name: budget.name,
      category: budget.category,
      total: total.toFixed(2),
      period: budget.period,
      carry_over: budget.carry_over,
      start_date: budget.start_date,
      spent: spent.toFixed(2),
      remaining: remaining.toFixed(2),
      created_at: budget.created_at,
      updated_at: budget.updated_at,
    };
  }

  private async getUserAccountIds(userId: string): Promise<string[]> {
    const accounts = await this.prismaService.account.findMany({
      where: { user_id: userId },
      select: { id: true },
    });
    return accounts.map((a) => a.id);
  }

  async list(user: Omit<User, 'password'>): Promise<BudgetResponse[]> {
    const [budgets, accountIds] = await Promise.all([
      this.prismaService.budget.findMany({
        where: { user_id: user.id },
        orderBy: [{ period: 'asc' }, { name: 'asc' }],
      }),
      this.getUserAccountIds(user.id),
    ]);

    return Promise.all(budgets.map((b) => this.toResponse(b, accountIds)));
  }

  async create(
    user: Omit<User, 'password'>,
    request: CreateBudgetRequest,
  ): Promise<BudgetResponse> {
    const data = this.validationService.validate(BudgetValidation.CREATE, request);

    const accountIds = await this.getUserAccountIds(user.id);

    const [budget] = await this.prismaService.$transaction([
      this.prismaService.budget.create({
        data: {
          user_id: user.id,
          name: data.name,
          category: data.category,
          total: data.total,
          period: data.period,
          carry_over: data.carry_over,
          start_date: new Date(data.start_date),
        },
      }),
      this.prismaService.activityLog.create({
        data: {
          user_id: user.id,
          user_name: user.full_name,
          action: `Tambah Anggaran: ${data.name}`,
          module: 'Anggaran',
        },
      }),
    ]);

    return this.toResponse(budget, accountIds);
  }

  async get(user: Omit<User, 'password'>, budgetId: string): Promise<BudgetResponse> {
    const budget = await this.prismaService.budget.findUnique({
      where: { id: budgetId },
    });

    if (!budget || budget.user_id !== user.id) {
      throw new HttpException('Anggaran tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    const accountIds = await this.getUserAccountIds(user.id);
    return this.toResponse(budget, accountIds);
  }

  async update(
    user: Omit<User, 'password'>,
    budgetId: string,
    request: UpdateBudgetRequest,
  ): Promise<BudgetResponse> {
    const data = this.validationService.validate(BudgetValidation.UPDATE, request);

    const existing = await this.prismaService.budget.findUnique({
      where: { id: budgetId },
    });

    if (!existing || existing.user_id !== user.id) {
      throw new HttpException('Anggaran tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    const accountIds = await this.getUserAccountIds(user.id);

    const [budget] = await this.prismaService.$transaction([
      this.prismaService.budget.update({
        where: { id: budgetId },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.category !== undefined && { category: data.category }),
          ...(data.total !== undefined && { total: data.total }),
          ...(data.period !== undefined && { period: data.period }),
          ...(data.carry_over !== undefined && { carry_over: data.carry_over }),
          ...(data.start_date !== undefined && { start_date: new Date(data.start_date) }),
        },
      }),
      this.prismaService.activityLog.create({
        data: {
          user_id: user.id,
          user_name: user.full_name,
          action: `Update Anggaran: ${existing.name}`,
          module: 'Anggaran',
        },
      }),
    ]);

    return this.toResponse(budget, accountIds);
  }

  async remove(user: Omit<User, 'password'>, budgetId: string): Promise<void> {
    const existing = await this.prismaService.budget.findUnique({
      where: { id: budgetId },
    });

    if (!existing || existing.user_id !== user.id) {
      throw new HttpException('Anggaran tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    await this.prismaService.$transaction([
      this.prismaService.budget.delete({ where: { id: budgetId } }),
      this.prismaService.activityLog.create({
        data: {
          user_id: user.id,
          user_name: user.full_name,
          action: `Hapus Anggaran: ${existing.name}`,
          module: 'Anggaran',
        },
      }),
    ]);
  }
}
