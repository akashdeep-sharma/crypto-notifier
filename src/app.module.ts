// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { PriceModule } from './price/price.module';
import { AlertModule } from './alert/alert.module';
import { SwapModule } from './swap/swap.module';
import { EmailModule } from './email/email.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('database.url'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Be cautious with this in production
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    PriceModule,
    AlertModule,
    SwapModule,
    EmailModule,
    AlertModule,
  ],
})
export class AppModule {}
