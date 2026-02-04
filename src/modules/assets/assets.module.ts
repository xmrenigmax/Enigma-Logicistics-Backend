import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './asset.entity';
import { AssetsService } from './asset.service';
import { LedgerModule } from '../ledger/ledger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset]),
    LedgerModule
  ],
  providers: [AssetsService],
  exports: [AssetsService]
})
export class AssetsModule {}