import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { SetrService } from './setr.service';
import { AuthService } from './auth.service'; // <--- Make sure this is imported
import { JwtStrategy } from './jwt.strategy'; // <--- Make sure this is imported

import { LedgerModule } from '../ledger/ledger.module';
import { UsersModule } from '../users/users.modules';

@Module({
  imports: [
    UsersModule,
    LedgerModule,
    PassportModule,
    // This configures the "Session Key" creator
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'ENIGMA_SUPER_SECRET_KEY_2026',
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    SetrService, 
    AuthService, // <--- THIS WAS MISSING
    JwtStrategy  // <--- THIS WAS MISSING
  ],
  exports: [SetrService, AuthService]
})
export class AuthModule {}