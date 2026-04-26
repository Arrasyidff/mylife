import { Controller, Get } from '@nestjs/common';
import { WebResponse } from '../model/web.model';

@Controller('api/health')
export class HealthController {
  @Get()
  check(): WebResponse<{ status: string }> {
    return { data: { status: 'ok' } };
  }
}
