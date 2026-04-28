import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { HealthController } from './health/health.controller';

@Module({
  imports: [CommonModule, AuthModule, AccountModule, TransactionModule],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'api/auth/login', method: RequestMethod.POST },
        { path: 'api/health', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
