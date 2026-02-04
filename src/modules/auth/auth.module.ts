import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { SetrService } from './setr.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.modules'; // Note: check filename 'users.modules'
import { LedgerModule } from '../ledger/ledger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    LedgerModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        // FIX: Must match JwtStrategy logic exactly!
        secret: config.get<string>('JWT_SECRET') || 'ENIGMA_SUPER_SECRET_KEY_2026',
        signOptions: { expiresIn: '12h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [SetrService, AuthService, JwtStrategy],
  exports: [SetrService, AuthService]
})
export class AuthModule {}