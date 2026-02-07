import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IntelligenceService } from './intelligence.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { UserRole } from '../users/user.entity';

@Controller('intelligence')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class IntelligenceController {
  constructor(private intelligenceService: IntelligenceService) {}

  @Post('command')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SYSTEM_AGENT) // Strict Access
  async submitCommand(@Body() body: any, @Request() req: any) {
    // Expected Body: { intent: 'UNLOCK_DOOR', assetId: 'uuid...', category: 'SECURITY' }
    return this.intelligenceService.processIntent(
      req.user.id, 
      body.intent, 
      body.assetId, 
      body.category
    );
  }
}
