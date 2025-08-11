import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    if (process.env['SKIP_DB_CONNECT'] === '1') return;
    await this.$connect();
  }

  enableShutdownHooks(app: INestApplication): void {
    // Cast to the overload that supports the 'beforeExit' event to satisfy Prisma's narrowed typings
    (this.$on as (event: 'beforeExit', cb: () => void) => void)(
      'beforeExit',
      () => {
        void app.close();
      },
    );
  }
}
