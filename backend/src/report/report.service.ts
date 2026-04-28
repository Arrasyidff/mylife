import { Injectable } from '@nestjs/common';
import { FamilyMember, TransactionType, User } from '../../generated/prisma';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { ReportValidation } from './report.validation';
import {
  CategoryStat,
  ChartDataPoint,
  MonthlyComparisonResponse,
  MonthlyComparisonRequest,
  MonthRow,
  ReportSummaryRequest,
  ReportSummaryResponse,
} from '../model/report.model';

const MONTH_SHORT_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const DAY_SHORT_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

@Injectable()
export class ReportService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
  ) {}

  private async getUserAccountIds(userId: string): Promise<string[]> {
    const accounts = await this.prismaService.account.findMany({
      where: { user_id: userId },
      select: { id: true },
    });
    return accounts.map((a) => a.id);
  }

  private getDateRange(
    period: 'WEEKLY' | 'MONTHLY' | 'YEARLY',
    year?: number,
    month?: number,
  ): { from: Date; to: Date; totalDays: number } {
    const now = new Date();

    if (period === 'WEEKLY') {
      const from = new Date(now);
      from.setDate(now.getDate() - 6);
      from.setHours(0, 0, 0, 0);
      const to = new Date(now);
      to.setHours(23, 59, 59, 999);
      return { from, to, totalDays: 7 };
    }

    if (period === 'MONTHLY') {
      const y = year!;
      const m = month! - 1; // 0-indexed
      const from = new Date(y, m, 1, 0, 0, 0, 0);
      const daysInMonth = new Date(y, m + 1, 0).getDate();
      const isCurrentMonth = y === now.getFullYear() && m === now.getMonth();
      const lastDay = isCurrentMonth ? now.getDate() : daysInMonth;
      const to = new Date(y, m, lastDay, 23, 59, 59, 999);
      const totalDays = isCurrentMonth ? now.getDate() : daysInMonth;
      return { from, to, totalDays };
    }

    // YEARLY
    const y = year!;
    const from = new Date(y, 0, 1, 0, 0, 0, 0);
    const isCurrentYear = y === now.getFullYear();
    const to = isCurrentYear
      ? new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
      : new Date(y, 11, 31, 23, 59, 59, 999);
    const totalDays = isCurrentYear
      ? Math.floor((to.getTime() - from.getTime()) / 86_400_000) + 1
      : 365;
    return { from, to, totalDays };
  }

  async summary(
    user: Omit<User, 'password'>,
    request: ReportSummaryRequest,
  ): Promise<ReportSummaryResponse> {
    const data = this.validationService.validate(ReportValidation.SUMMARY, request);
    const accountIds = await this.getUserAccountIds(user.id);

    if (accountIds.length === 0) {
      return this.emptyResponse(data.period, data.year, data.month);
    }

    const { from, to, totalDays } = this.getDateRange(data.period, data.year, data.month);

    const transactions = await this.prismaService.transaction.findMany({
      where: {
        account_id: { in: accountIds },
        type: { in: [TransactionType.INCOME, TransactionType.EXPENSE] },
        date: { gte: from, lte: to },
      },
      select: {
        id: true,
        recorder: true,
        category: true,
        merchant: true,
        amount: true,
        date: true,
        type: true,
      },
      orderBy: { date: 'asc' },
    });

    const expenses = transactions.filter((t) => t.type === TransactionType.EXPENSE);
    const incomes = transactions.filter((t) => t.type === TransactionType.INCOME);

    const totalExpense = expenses.reduce((s, t) => s + Number(t.amount), 0);
    const totalIncome = incomes.reduce((s, t) => s + Number(t.amount), 0);
    const net = totalIncome - totalExpense;
    const avgDailyExpense = totalDays > 0 ? totalExpense / totalDays : 0;

    // Days without spending
    const daysWithSpending = new Set(
      expenses.map((t) => t.date.toISOString().split('T')[0]),
    ).size;
    const daysWithoutSpending = totalDays - daysWithSpending;

    // By recorder
    const suamiExpense = expenses
      .filter((t) => t.recorder === FamilyMember.SUAMI)
      .reduce((s, t) => s + Number(t.amount), 0);
    const istriExpense = expenses
      .filter((t) => t.recorder === FamilyMember.ISTRI)
      .reduce((s, t) => s + Number(t.amount), 0);

    // Category breakdown
    const catMap = new Map<string, { total: number; suami: number; istri: number }>();
    for (const t of expenses) {
      const entry = catMap.get(t.category) ?? { total: 0, suami: 0, istri: 0 };
      entry.total += Number(t.amount);
      if (t.recorder === FamilyMember.SUAMI) entry.suami += Number(t.amount);
      else entry.istri += Number(t.amount);
      catMap.set(t.category, entry);
    }

    const categories: CategoryStat[] = Array.from(catMap.entries())
      .sort((a, b) => b[1].total - a[1].total)
      .map(([category, v]) => ({
        category,
        total: v.total.toFixed(2),
        suami: v.suami.toFixed(2),
        istri: v.istri.toFixed(2),
      }));

    const topCategory = categories[0]
      ? { category: categories[0].category, total: categories[0].total }
      : null;

    // Biggest expense transaction
    const biggest = expenses.reduce<(typeof expenses)[0] | null>((max, t) =>
      max === null || Number(t.amount) > Number(max.amount) ? t : max, null);

    const biggestTransaction = biggest
      ? {
          id: biggest.id,
          merchant: biggest.merchant,
          amount: Number(biggest.amount).toFixed(2),
          date: biggest.date,
          category: biggest.category,
        }
      : null;

    // Chart data
    const chartData = this.buildChartData(data.period, from, to, expenses, data.year, data.month);

    return {
      date_from: from,
      date_to: to,
      total_income: totalIncome.toFixed(2),
      total_expense: totalExpense.toFixed(2),
      net: net.toFixed(2),
      avg_daily_expense: avgDailyExpense.toFixed(2),
      total_days: totalDays,
      days_without_spending: Math.max(0, daysWithoutSpending),
      by_recorder: {
        SUAMI: suamiExpense.toFixed(2),
        ISTRI: istriExpense.toFixed(2),
      },
      top_category: topCategory,
      biggest_transaction: biggestTransaction,
      categories,
      chart_data: chartData,
    };
  }

  private buildChartData(
    period: 'WEEKLY' | 'MONTHLY' | 'YEARLY',
    from: Date,
    to: Date,
    expenses: { recorder: FamilyMember; amount: any; date: Date }[],
    year?: number,
    month?: number,
  ): ChartDataPoint[] {
    if (period === 'WEEKLY') {
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(from);
        date.setDate(from.getDate() + i);
        const dayStr = date.toISOString().split('T')[0];
        const dayTx = expenses.filter((t) => t.date.toISOString().split('T')[0] === dayStr);
        const key = `${DAY_SHORT_ID[date.getDay()]} ${date.getDate()}`;
        return {
          key,
          suami: dayTx
            .filter((t) => t.recorder === FamilyMember.SUAMI)
            .reduce((s, t) => s + Number(t.amount), 0),
          istri: dayTx
            .filter((t) => t.recorder === FamilyMember.ISTRI)
            .reduce((s, t) => s + Number(t.amount), 0),
        };
      });
    }

    if (period === 'MONTHLY') {
      const y = year!;
      const m = month! - 1;
      const daysInMonth = new Date(y, m + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dayTx = expenses.filter((t) => {
          const d = t.date;
          return d.getFullYear() === y && d.getMonth() === m && d.getDate() === day;
        });
        return {
          key: String(day),
          suami: dayTx
            .filter((t) => t.recorder === FamilyMember.SUAMI)
            .reduce((s, t) => s + Number(t.amount), 0),
          istri: dayTx
            .filter((t) => t.recorder === FamilyMember.ISTRI)
            .reduce((s, t) => s + Number(t.amount), 0),
        };
      });
    }

    // YEARLY — group by month
    return Array.from({ length: 12 }, (_, i) => {
      const monthTx = expenses.filter((t) => t.date.getMonth() === i);
      return {
        key: MONTH_SHORT_ID[i],
        suami: monthTx
          .filter((t) => t.recorder === FamilyMember.SUAMI)
          .reduce((s, t) => s + Number(t.amount), 0),
        istri: monthTx
          .filter((t) => t.recorder === FamilyMember.ISTRI)
          .reduce((s, t) => s + Number(t.amount), 0),
      };
    });
  }

  private emptyResponse(
    period: 'WEEKLY' | 'MONTHLY' | 'YEARLY',
    year?: number,
    month?: number,
  ): ReportSummaryResponse {
    const now = new Date();
    const y = year ?? now.getFullYear();
    const m = month ? month - 1 : now.getMonth();
    const { from, to, totalDays } = this.getDateRange(period, y, m + 1);
    return {
      date_from: from,
      date_to: to,
      total_income: '0.00',
      total_expense: '0.00',
      net: '0.00',
      avg_daily_expense: '0.00',
      total_days: totalDays,
      days_without_spending: totalDays,
      by_recorder: { SUAMI: '0.00', ISTRI: '0.00' },
      top_category: null,
      biggest_transaction: null,
      categories: [],
      chart_data: [],
    };
  }

  async monthlyComparison(
    user: Omit<User, 'password'>,
    request: MonthlyComparisonRequest,
  ): Promise<MonthlyComparisonResponse> {
    const data = this.validationService.validate(ReportValidation.MONTHLY_COMPARISON, request);
    const accountIds = await this.getUserAccountIds(user.id);

    const now = new Date();
    const endYear = data.year ?? now.getFullYear();
    const endMonth = data.month ?? now.getMonth() + 1; // 1-indexed
    const count = data.months ?? 3;

    // Build list of (year, month) pairs going back `count` months
    const periods: { year: number; month: number }[] = [];
    let y = endYear;
    let m = endMonth;
    for (let i = 0; i < count; i++) {
      periods.unshift({ year: y, month: m });
      m--;
      if (m === 0) { m = 12; y--; }
    }

    if (accountIds.length === 0) {
      return {
        months: periods.map(({ year, month }) => ({
          year,
          month,
          label: `${MONTH_SHORT_ID[month - 1]} ${year}`,
          income: '0.00',
          expense: '0.00',
          net: '0.00',
          savings_rate: 0,
        })),
      };
    }

    const months: MonthRow[] = await Promise.all(
      periods.map(async ({ year, month }) => {
        const from = new Date(year, month - 1, 1, 0, 0, 0, 0);
        const isCurrentMonth = year === now.getFullYear() && month - 1 === now.getMonth();
        const daysInMonth = new Date(year, month, 0).getDate();
        const lastDay = isCurrentMonth ? now.getDate() : daysInMonth;
        const to = new Date(year, month - 1, lastDay, 23, 59, 59, 999);

        const [incomeAgg, expenseAgg] = await Promise.all([
          this.prismaService.transaction.aggregate({
            where: {
              account_id: { in: accountIds },
              type: TransactionType.INCOME,
              date: { gte: from, lte: to },
            },
            _sum: { amount: true },
          }),
          this.prismaService.transaction.aggregate({
            where: {
              account_id: { in: accountIds },
              type: TransactionType.EXPENSE,
              date: { gte: from, lte: to },
            },
            _sum: { amount: true },
          }),
        ]);

        const income = Number(incomeAgg._sum.amount ?? 0);
        const expense = Number(expenseAgg._sum.amount ?? 0);
        const net = income - expense;
        const savingsRate = income > 0 ? Math.round((net / income) * 100) : 0;

        return {
          year,
          month,
          label: `${MONTH_SHORT_ID[month - 1]} ${year}`,
          income: income.toFixed(2),
          expense: expense.toFixed(2),
          net: net.toFixed(2),
          savings_rate: savingsRate,
        };
      }),
    );

    return { months };
  }
}
