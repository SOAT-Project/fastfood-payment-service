import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [],
      synchronize: true,
    }),
    WinstonModule.forRoot({
      transports: [
        new transports.Console({
          level: 'info',
          format: format.combine(
            format((info) => {
              info.level = info.level.toUpperCase();
              return info;
            })(),
            format.json(),
            format.colorize({ all: true }),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(
              ({ timestamp, level, message }) =>
                `[${timestamp}] ${level}: ${message}`,
            ),
          ),
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
