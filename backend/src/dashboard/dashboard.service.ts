import { Injectable } from '@nestjs/common';
import { BudgetPeriod, TransactionType, User } from '../../generated/prisma';
import { PrismaService } from '../common/prisma.service';
import {
  DashboardAccountItem,
  DashboardBudgetItem,
  DashboardMonthlySummary,
  DashboardResponse,
  DashboardTopCategory,
  DashboardTransactionItem,
} from '../model/dashboard.model';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

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
      if (from > now) from.setFullYear(from.getFullYear() - 1);
      const to = new Date(from);
      to.setFullYear(to.getFullYear() + 1);
      return { from, to };
    }

    // MONTHLY
    const from = new Date(now.getFullYear(), now.getMonth(), start.getDate());
    if (from > now) from.setMonth(from.getMonth() - 1);
    const to = new Date(from);
    to.setMonth(to.getMonth() + 1);
    return { from, to };
  }

  async summary(user: Omit<User, 'password'>): Promise<DashboardResponse> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const monthStart = new Date(year, month, 1, 0, 0, 0, 0);
    const monthEnd = new Date(year, month, now.getDate(), 23, 59, 59, 999);

    const [accounts, budgets] = await Promise.all([
      this.prismaService.account.findMany({
        where: { user_id: user.id, hidden: false },
        orderBy: [{ type: 'asc' }, { name: 'asc' }],
      }),
      this.prismaService.budget.findMany({
        where: { user_id: user.id },
        orderBy: [{ period: 'asc' }, { name: 'asc' }],
      }),
    ]);

    const accountIds = accounts.map((a) => a.id);

    const allAccountIds = await this.prismaService.account
      .findMany({ where: { user_id: user.id }, select: { id: true } })
      .then((rows) => rows.map((r) => r.id));

    const [incomeAgg, expenseAgg, recentTx] = await Promise.all([
      this.prismaService.transaction.aggregate({
        where: {
          account_id: { in: allAccountIds },
          type: TransactionType.INCOME,
          date: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      }),
      this.prismaService.transaction.aggregate({
        where: {
          account_id: { in: allAccountIds },
          type: TransactionType.EXPENSE,
          date: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      }),
      this.prismaService.transaction.findMany({
        where: { account_id: { in: allAccountIds } },
        orderBy: [{ date: 'desc' }, { id: 'desc' }],
        take: 5,
        include: { account: { select: { name: true } } },
      }),
    ]);

    // Monthly expense category breakdown for top categories
    const monthlyExpenses = await this.prismaService.transaction.findMany({
      where: {
        account_id: { in: allAccountIds },
        type: TransactionType.EXPENSE,
        date: { gte: monthStart, lte: monthEnd },
      },
      select: { category: true, amount: true },
    });

    const totalExpense = Number(expenseAgg._sum.amount ?? 0);
    const totalIncome = Number(incomeAgg._sum.amount ?? 0);
    const net = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.round((net / totalIncome) * 100) : 0;

    const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0);

    // Build top categories
    const catMap = new Map<string, number>();
    for (const tx of monthlyExpenses) {
      catMap.set(tx.category, (catMap.get(tx.category) ?? 0) + Number(tx.amount));
    }
    const topCategories: DashboardTopCategory[] = Array.from(catMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, total]) => ({
        category,
        total: total.toFixed(2),
        percentage: totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0,
      }));

    // Build budget overview
    const budgetOverview: DashboardBudgetItem[] = await Promise.all(
      budgets.map(async (b) => {
        const { from, to } = this.getCurrentPeriodRange(b.start_date, b.period);
        const spentAgg = await this.prismaService.transaction.aggregate({
          where: {
            account_id: { in: allAccountIds },
            category: b.category,
            type: TransactionType.EXPENSE,
            date: { gte: from, lt: to },
          },
          _sum: { amount: true },
        });
        const spent = Number(spentAgg._sum.amount ?? 0);
        const total = Number(b.total);
        const remaining = Math.max(0, total - spent);
        const percentageUsed = total > 0 ? Math.min(100, Math.round((spent / total) * 100)) : 0;

        return {
          id: b.id,
          name: b.name,
          category: b.category,
          total: total.toFixed(2),
          spent: spent.toFixed(2),
          remaining: remaining.toFixed(2),
          percentage_used: percentageUsed,
          period: b.period,
        };
      }),
    );

    const accountItems: DashboardAccountItem[] = accounts.map((a) => ({
      id: a.id,
      name: a.name,
      subtitle: a.subtitle,
      balance: Number(a.balance).toFixed(2),
      color: a.color,
      glyph: a.glyph,
      type: a.type,
    }));

    const recentTransactions: DashboardTransactionItem[] = recentTx.map((tx) => ({
      id: tx.id,
      recorder: tx.recorder,
      category: tx.category,
      merchant: tx.merchant,
      amount: Number(tx.amount).toFixed(2),
      date: tx.date,
      type: tx.type,
      note: tx.note,
      account_name: tx.account.name,
    }));

    return {
      total_balance: totalBalance.toFixed(2),
      total_accounts: accounts.length,
      monthly_summary: {
        year,
        month: month + 1,
        total_income: totalIncome.toFixed(2),
        total_expense: totalExpense.toFixed(2),
        net: net.toFixed(2),
        savings_rate: savingsRate,
      },
      accounts: accountItems,
      recent_transactions: recentTransactions,
      budget_overview: budgetOverview,
      top_categories: topCategories,
    };
  }
}
