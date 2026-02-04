import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SetrService } from './setr.service';
import { UsersModule } from '../users/users.modules';
import { LedgerModule } from '../ledger/ledger.module';

@Module({
  imports: [
    UsersModule,
    LedgerModule
  ],
  controllers: [AuthController],
  providers: [SetrService],
  exports: [SetrService]
})
export class AuthModule {}