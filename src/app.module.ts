import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.modules';
import { AssetsModule } from './modules/assets/assets.module';
import { AuthModule } from './modules/auth/auth.module';
import { LedgerModule } from './modules/ledger/ledger.module';
import { User } from './modules/users/user.entity';
import { Asset } from './modules/assets/asset.entity';
import { LedgerEntry } from './modules/ledger/ledger.entity';
import { IntelligenceModule } from './modules/intelligence/intelligence.model';

@Module({
  imports: [
    // 1. Load Environment Variables dynamically
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, 
    }),

    // 2. Configure Database based on the active Environment
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const env = config.get('NODE_ENV') || 'development';
        
        // Strict Safety Rules
        const isProd = env === 'production';
        const isDemo = env === 'demo';
        
        // Only Development allows auto-schema updates. 
        // Prod/Demo/Test require Migration scripts (Safety First).
        const canSync = env === 'development'; 

        console.log(`[SYSTEM_INIT] Enigma Core launching in: ${env.toUpperCase()} MODE`);
        console.log(`[DB_CONNECTION] Target Database: ${config.get('DB_NAME')}`);

        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: parseInt(config.get<string>('DB_PORT') ?? '5432', 10),
          username: config.get('DB_USER'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_NAME'),
          entities: [User, Asset, LedgerEntry],
          synchronize: canSync, 
          // Logging helps debug Dev/Test, but keep Prod clean
          logging: !isProd, 
          ssl: isProd ? { rejectUnauthorized: false } : false, // Often required for Cloud DBs
        };
      },
    }),

    AuthModule,
    UsersModule,
    AssetsModule,
    LedgerModule,
    IntelligenceModule
  ],
})
export class AppModule {}