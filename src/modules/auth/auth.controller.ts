import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SetrService } from './setr.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';// Fixed import name
import { UserRole } from '../users/user.entity';

@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {
  constructor(private setrService: SetrService) {}

  @Post('token/generate')
  @Roles(UserRole.GUEST, UserRole.STAFF, UserRole.ADMIN)
  async generateToken(@Request() req, @Body() body: { doorId: string }) {
    // In a real app, 'req.user' comes from the JWT Strategy. 
    // For now, we assume the Guard attached the user.
    return this.setrService.generateEphemeralToken(req.user.id, body.doorId);
  }

  @Post('token/verify')
  @Roles(UserRole.SYSTEM_AGENT) // Only Hardware/Agents can verify!
  async verifyToken(@Body() body: { token: string; doorId: string }) {
    return this.setrService.validateToken(body.token, body.doorId);
  }
}