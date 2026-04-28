import { Controller, Get } from '@nestjs/common';
import { User } from '../../generated/prisma';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { WebResponse } from '../model/web.model';
import { DashboardResponse } from '../model/dashboard.model';
import { DashboardService } from './dashboard.service';

@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async summary(
    @CurrentUser() user: Omit<User, 'password'>,
  ): Promise<WebResponse<DashboardResponse>> {
    const result = await this.dashboardService.summary(user);
    return { data: result };
  }
}
