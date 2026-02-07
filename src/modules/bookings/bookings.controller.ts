import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // <--- ADD THIS
import { BookingsService } from './bookings.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRole } from '../users/user.entity';

@Controller('bookings')
@UseGuards(AuthGuard('jwt'), RolesGuard) 
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async create(@Body() body: any) {
    return this.bookingsService.createReservation(body);
  }

  @Post(':id/check-in')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GUEST)
  async checkIn(@Param('id') id: string) {
    return this.bookingsService.checkInGuest(id);
  }
}