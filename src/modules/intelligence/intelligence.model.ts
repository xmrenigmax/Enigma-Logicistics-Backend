import { Module } from '@nestjs/common';
import { IntelligenceService } from './intelligence.service';
import { IntelligenceController } from './Intelligence.controller'; 
import { AssetsModule } from '../assets/assets.module';
import { LedgerModule } from '../ledger/ledger.module';

@Module({
  imports: [
    AssetsModule, 
    LedgerModule
  ],
  controllers: [IntelligenceController],
  providers: [IntelligenceService],
  exports: [IntelligenceService]
})
export class IntelligenceModule {}