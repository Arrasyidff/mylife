import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { WebResponse } from '../model/web.model';
import {
  BudgetResponse,
  CreateBudgetRequest,
  UpdateBudgetRequest,
} from '../model/budget.model';
import { User } from '../generated/prisma';

@Controller('api/budgets')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  async list(
    @CurrentUser() user: Omit<User, 'password'>,
  ): Promise<WebResponse<BudgetResponse[]>> {
    const result = await this.budgetService.list(user);
    return { data: result };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: Omit<User, 'password'>,
    @Body() body: CreateBudgetRequest,
  ): Promise<WebResponse<BudgetResponse>> {
    const result = await this.budgetService.create(user, body);
    return { data: result };
  }

  @Get(':id')
  async get(
    @CurrentUser() user: Omit<User, 'password'>,
    @Param('id') id: string,
  ): Promise<WebResponse<BudgetResponse>> {
    const result = await this.budgetService.get(user, id);
    return { data: result };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentUser() user: Omit<User, 'password'>,
    @Param('id') id: string,
    @Body() body: UpdateBudgetRequest,
  ): Promise<WebResponse<BudgetResponse>> {
    const result = await this.budgetService.update(user, id, body);
    return { data: result };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @CurrentUser() user: Omit<User, 'password'>,
    @Param('id') id: string,
  ): Promise<WebResponse<string>> {
    await this.budgetService.remove(user, id);
    return { data: 'OK' };
  }
}
