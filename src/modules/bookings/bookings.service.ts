import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, And } from 'typeorm';
import { Reservation, BookingStatus } from './reservation.entity';
import { LedgerService } from '../ledger/ledger.service';
import { IntelligenceService } from '../intelligence/intelligence.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Reservation)
    private repo: Repository<Reservation>,
    private ledgerService: LedgerService,
    private intelligenceService: IntelligenceService
  ) {}

  // 1. CREATE RESERVATION (The Oracle Killer)
  async createReservation(data: Partial<Reservation>) {
    // Inventory Check: "Is this room actually free?"
    const conflict = await this.repo.findOne({
      where: {
        roomAssetId: data.roomAssetId,
        status: BookingStatus.CONFIRMED,
        startDate: LessThanOrEqual(data.endDate!),
        endDate: MoreThanOrEqual(data.startDate!)
      }
    });

    if (conflict) {
      throw new ConflictException('INVENTORY_CLASH: Room is already booked for these dates.');
    }

    const reservation = this.repo.create({
      ...data,
      status: BookingStatus.CONFIRMED
    });

    const saved = await this.repo.save(reservation);

    // Immutable Log
    await this.ledgerService.recordEntry({
      actorId: data.guestId,
      action: 'RESERVATION_CREATED',
      context: { reservationId: saved.id, room: data.roomAssetId }
    });

    return saved;
  }

  // 2. CHECK-IN (The Autonomous Trigger)
  async checkInGuest(bookingId: string) {
    const reservation = await this.repo.findOne({ where: { id: bookingId } });

    if (!reservation) {
      throw new NotFoundException('BOOKING_NOT_FOUND');
    }

    if (reservation.status === BookingStatus.CHECKED_IN) {
      return { message: 'Guest already resident.' };
    }

    // Update Status
    reservation.status = BookingStatus.CHECKED_IN;
    await this.repo.save(reservation);

    // TRIGGER THE BRAIN: "Guest is here. Wake up the room."
    // This tells the Multi-Agent System to turn on lights, unlock HVAC, etc.
    await this.intelligenceService.processIntent(
      'PMS_SYSTEM', 
      'PREPARE_ROOM_ARRIVAL', 
      reservation.roomAssetId, 
      'GUEST_ACCESS' // Priority Category
    );

    return { 
      success: true, 
      status: 'CHECKED_IN',
      automation_status: 'AGENTS_DEPLOYED' 
    };
  }
}
