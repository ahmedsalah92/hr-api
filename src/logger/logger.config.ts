import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import TransportStream from 'winston-transport';

const { combine, timestamp, errors, splat, json } = winston.format;

// Build a typed array of transports
const transports: TransportStream[] = [
  // Always log to console
  new winston.transports.Console(),
];

// In production, add a file transport with size-based rotation
if (process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: process.env.LOG_FILE_PATH ?? 'logs/app.log',
      maxsize: parseInt(process.env.LOG_FILE_MAX_SIZE ?? '5242880', 10), // default 5MB
      maxFiles: parseInt(process.env.LOG_FILE_MAX_FILES ?? '5', 10), // keep 5 files
      level: process.env.FILE_LOG_LEVEL ?? 'info',
    }),
  );
}

export const winstonOptions: winston.LoggerOptions = {
  level: process.env.LOG_LEVEL ?? 'info',

  // JSON in prod; Nest-like pretty output in dev
  format:
    process.env.NODE_ENV === 'production'
      ? combine(timestamp(), errors({ stack: true }), splat(), json())
      : combine(
          timestamp(),
          errors({ stack: true }),
          splat(),
          nestWinstonModuleUtilities.format.nestLike(),
        ),

  transports,

  // Capture uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: process.env.EXCEPTIONS_LOG_FILE ?? 'logs/exceptions.log',
    }),
  ],

  // Capture unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: process.env.REJECTIONS_LOG_FILE ?? 'logs/rejections.log',
    }),
  ],

  exitOnError: false,
};
