import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { WebResponse } from '../model/web.model';
import {
  MonthlyComparisonRequest,
  MonthlyComparisonResponse,
  ReportSummaryRequest,
  ReportSummaryResponse,
} from '../model/report.model';
import { User } from '../generated/prisma';

@Controller('api/reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('summary')
  async summary(
    @CurrentUser() user: Omit<User, 'password'>,
    @Query() query: ReportSummaryRequest,
  ): Promise<WebResponse<ReportSummaryResponse>> {
    const result = await this.reportService.summary(user, query);
    return { data: result };
  }

  @Get('monthly-comparison')
  async monthlyComparison(
    @CurrentUser() user: Omit<User, 'password'>,
    @Query() query: MonthlyComparisonRequest,
  ): Promise<WebResponse<MonthlyComparisonResponse>> {
    const result = await this.reportService.monthlyComparison(user, query);
    return { data: result };
  }
}
