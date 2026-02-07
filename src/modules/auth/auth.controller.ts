import { Controller, Post, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SetrService } from './setr.service';
import { AuthService } from './auth.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { UserRole } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { GenerateTokenDto } from './dto/generate-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private setrService: SetrService,
    private authService: AuthService
  ) {}

  // PUBLIC: Login
  @Post('login')
    async login(@Body() loginDto: LoginDto) {
    const validUser = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!validUser) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    return this.authService.login(validUser);
  }

  // PROTECTED: Generate Token
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('token/generate')
  @Roles(UserRole.GUEST, UserRole.STAFF, UserRole.ADMIN)
  async generateToken(@Request() req, @Body() body: GenerateTokenDto) {
    return this.setrService.generateEphemeralToken(req.user.id, body.doorId);
  }

  // PROTECTED: Verify Token
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('token/verify')
  @Roles(UserRole.SYSTEM_AGENT, UserRole.ADMIN) // Added ADMIN for testing
  async verifyToken(@Body() body: { token: string; doorId: string }) {
    return this.setrService.validateToken(body.token, body.doorId);
  }
}