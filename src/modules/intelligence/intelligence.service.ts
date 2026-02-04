import { Injectable, ForbiddenException } from '@nestjs/common';
import { AssetsService } from '../assets/asset.service';
import { LedgerService } from '../ledger/ledger.service';
import _ from 'lodash';
import { User } from '../users/user.entity';

// The "Constitution" of your autonomous system
const PRIORITY_HIERARCHY = {
  'LIFE_SAFETY': 100,  // Fire, Medical
  'SECURITY': 80,      // Lockdowns, Intrusions
  'GUEST_ACCESS': 60,  // Paid entry
  'ENERGY_OPS': 40,    // HVAC optimization
  'CONVENIENCE': 20    // Lighting scenes
};

@Injectable()
export class IntelligenceService {
  constructor(
    private assetsService: AssetsService,
    private ledgerService: LedgerService
  ) {}

  async processIntent(agentId: string, intent: string, targetAssetId: string, category: keyof typeof PRIORITY_HIERARCHY) {
    // 1. Calculate Priority Score
    const priorityScore = _.get(PRIORITY_HIERARCHY, category, 0);
    
    // 2. Check for Active Conflicts (e.g., Is the room currently in 'SECURITY_LOCKDOWN'?)
    // In a real implementation, we would query the current system state here.
    const systemState = 'LOCKDOWN'; // Mocked for now
    
    if (systemState === 'LOCKDOWN' && priorityScore < 90) {
      // XAI: Explain why we refused
      await this.ledgerService.recordEntry({
        actorId: 'SYSTEM_OVERLORD',
        action: 'DENY_INTENT',
        context: {
          intent,
          reason: 'Global Security Lockdown overrides Guest Access',
          delta: priorityScore - 90
        }
      });
      throw new ForbiddenException('INTENT_DENIED: System is in Lockdown');
    }

    // 3. Execute the Command (The "Autonomous" Action)
    let result;
    if (intent === 'UNLOCK_DOOR') {
      // We pass 'true' to skip internal checks because the Intelligence Layer has already authorized it
      const actor = { id: agentId } as User;
      result = await this.assetsService.remoteUnlock(targetAssetId, actor, `Authorized by Intelligence (Score: ${priorityScore})`);
    }

    // 4. Record the "Why" (XAI Compliance)
    await this.ledgerService.recordEntry({
      actorId: agentId,
      action: 'EXECUTE_INTENT',
      context: {
        intent,
        target: targetAssetId,
        priorityScore,
        reasoning: `Priority ${category} (${priorityScore}) sufficient for execution.`
      }
    });

    return { 
      success: true, 
      executionId: result.auditId,
      xai_explanation: `Action permitted due to ${category} priority.` 
    };
  }
}