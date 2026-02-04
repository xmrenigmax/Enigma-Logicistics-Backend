import { Controller, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator'; // Note: Ensure filename matches your existing one
import { UserRole } from '../users/user.entity';

@Controller('bookings')
@UseGuards(RolesGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER) // Only staff can force a booking manually for now
  async create(@Body() body: any) {
    return this.bookingsService.createReservation(body);
  }

  @Post(':id/check-in')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GUEST) // Guests can self-check-in
  async checkIn(@Param('id') id: string) {
    return this.bookingsService.checkInGuest(id);
  }
}