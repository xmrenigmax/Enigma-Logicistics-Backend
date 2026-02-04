import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SetrService } from './setr.service';
import { AuthService } from './auth.service'; // <--- Import this
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/role.decorator'; // Note: check filename 'role' vs 'roles'
import { UserRole } from '../users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private setrService: SetrService,
    private authService: AuthService // <--- Inject this
  ) {}

  // 🔓 PUBLIC ROUTE (No Guards)
  @Post('login')
  async login(@Body() body: any) {
    // Verify credentials
    const validUser = await this.authService.validateUser(body.email, body.password);
    if (!validUser) {
      throw new Error('Invalid Credentials');
    }
    return this.authService.login(validUser);
  }

  // 🔒 SECURE ROUTE (Needs Login)
  @UseGuards(RolesGuard)
  @Post('token/generate')
  @Roles(UserRole.GUEST, UserRole.STAFF, UserRole.ADMIN)
  async generateToken(@Request() req, @Body() body: { doorId: string }) {
    return this.setrService.generateEphemeralToken(req.user.id, body.doorId);
  }

  @UseGuards(RolesGuard)
  @Post('token/verify')
  @Roles(UserRole.SYSTEM_AGENT)
  async verifyToken(@Body() body: { token: string; doorId: string }) {
    return this.setrService.validateToken(body.token, body.doorId);
  }
}