import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma';
import { Pool } from 'pg';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool, { schema: 'mylife' });

    super({
      adapter,
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
    });
  }

  async onModuleInit() {
    (this.$on as any)('query', (e: any) => {
      this.logger.debug(`Query: ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms`);
    });
    (this.$on as any)('info', (e: any) => {
      this.logger.log(e.message);
    });
    (this.$on as any)('warn', (e: any) => {
      this.logger.warn(e.message);
    });
    (this.$on as any)('error', (e: any) => {
      this.logger.error(e.message);
    });

    await this.$connect();
  }
}
