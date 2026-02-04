import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { LedgerModule } from '../ledger/ledger.module';
import { IntelligenceModule } from '../intelligence/intelligence.model';


@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    LedgerModule,
    IntelligenceModule
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService]
})
export class BookingsModule {}