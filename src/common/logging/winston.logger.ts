import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';

export const createWinstonLogger = () =>
  WinstonModule.createLogger({
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp(),
          format.errors({ stack: true }),
          format.json(),
        ),
      }),
    ],
  });
