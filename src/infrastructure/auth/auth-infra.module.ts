import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { AUTH_INFRA_PROVIDERS } from './auth-infra.providers';

@Module({
  imports: [PrismaModule],
  providers: [...AUTH_INFRA_PROVIDERS],
  exports: [...AUTH_INFRA_PROVIDERS],
})
export class AuthInfraModule {}
