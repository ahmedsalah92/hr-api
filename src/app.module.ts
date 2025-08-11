import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig, { AppEnvSchema } from './config/app.config';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { HealthController } from './presentation/v1/health/health.controller';
import { CorrelationIdMiddleware } from './common/logging/correlation-id.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: AppEnvSchema,
    }),
    PrismaModule,
  ],
  controllers: [HealthController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
