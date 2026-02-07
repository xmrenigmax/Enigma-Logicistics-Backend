import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet'; // <--- The adapter

import { UsersModule } from './modules/users/users.modules'; // Note: Ensure filename matches
import { AssetsModule } from './modules/assets/assets.module';
import { AuthModule } from './modules/auth/auth.module';
import { LedgerModule } from './modules/ledger/ledger.module';
import { IntelligenceModule } from './modules/intelligence/intelligence.module';
import { BookingsModule } from './modules/bookings/bookings.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './modules/users/user.entity';
import { Asset } from './modules/assets/asset.entity';
import { LedgerEntry } from './modules/ledger/ledger.entity';
import { Reservation } from './modules/bookings/reservation.entity';
import { GenesisSeed } from './common/seeds/genesis.seed';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    
    // REDIS CONFIGURATION (Works with v5 + redis-yet)
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.DB_HOST || 'localhost',
            port: 6379,
          },
          ttl: 30 * 1000, // 30 seconds (milliseconds)
        }),
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const env = config.get('NODE_ENV') || 'development';
        const isProd = env === 'production';
        const canSync = env === 'development'; 

        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: parseInt(config.get('DB_PORT') ?? '5432', 10),
          username: config.get('DB_USER'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_NAME'),
          entities: [User, Asset, LedgerEntry, Reservation],
          synchronize: canSync,
          logging: !isProd,
        };
      },
    }),
    AuthModule,
    UsersModule,
    AssetsModule,
    LedgerModule,
    IntelligenceModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService, GenesisSeed],
})
export class AppModule {}
