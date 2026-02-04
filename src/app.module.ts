import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './modules/users/user.entity';
import { Asset } from './modules/assets/asset.entity';
import { LedgerEntry } from './modules/ledger/ledger.entity';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.modules';
import { AssetsModule } from './modules/assets/assets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Database Connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USER || 'enigma',
      password: process.env.DB_PASSWORD || 'secure_password',
      database: 'enigma_core',
      entities: [User, Asset, LedgerEntry],
      synchronize: true, // Set to false in Production!
    }),
    AuthModule,
    UsersModule,
    AssetsModule
  ],
})
export class AppModule {}