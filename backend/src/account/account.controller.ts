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
  Query,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { WebResponse } from '../model/web.model';
import {
  AccountListResponse,
  AccountResponse,
  CreateAccountRequest,
  UpdateAccountRequest,
} from '../model/account.model';
import { User } from '../generated/prisma';

@Controller('api/accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async list(
    @CurrentUser() user: Omit<User, 'password'>,
    @Query('include_hidden') includeHidden?: string,
  ): Promise<WebResponse<AccountListResponse>> {
    const result = await this.accountService.list(user, includeHidden === 'true');
    return { data: result };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: Omit<User, 'password'>,
    @Body() body: CreateAccountRequest,
  ): Promise<WebResponse<AccountResponse>> {
    const result = await this.accountService.create(user, body);
    return { data: result };
  }

  @Get(':id')
  async get(
    @CurrentUser() user: Omit<User, 'password'>,
    @Param('id') id: string,
  ): Promise<WebResponse<AccountResponse>> {
    const result = await this.accountService.get(user, id);
    return { data: result };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentUser() user: Omit<User, 'password'>,
    @Param('id') id: string,
    @Body() body: UpdateAccountRequest,
  ): Promise<WebResponse<AccountResponse>> {
    const result = await this.accountService.update(user, id, body);
    return { data: result };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @CurrentUser() user: Omit<User, 'password'>,
    @Param('id') id: string,
  ): Promise<WebResponse<string>> {
    await this.accountService.remove(user, id);
    return { data: 'OK' };
  }
}
