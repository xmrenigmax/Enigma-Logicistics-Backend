import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './asset.entity';
import { LedgerService } from '../ledger/ledger.service'; // We assume this exists
import { User } from '../users/user.entity';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetRepo: Repository<Asset>,
    private ledgerService: LedgerService
  ) {}

  async remoteUnlock(assetId: string, actor: User, reason: string) {
    const asset = await this.assetRepo.findOne({ where: { id: assetId } });

    if (!asset) {
      throw new NotFoundException('ASSET_NOT_FOUND');
    }

    // 1. Perform the Hardware Action (Mocked for now)
    asset.lockState = 'UNLOCKED';
    await this.assetRepo.save(asset);

    // 2. Write to the Immutable Ledger (The "Patent" part)
    await this.ledgerService.recordEntry({
      actorId: actor.id,
      action: 'REMOTE_UNLOCK',
      context: {
        assetId: asset.id,
        reason: reason,
        telemetrySnapshot: asset.telemetry
      }
    });

    return { 
      success: true, 
      status: 'UNLOCKED', 
      auditId: 'PENDING_HASH_GENERATION' 
    };
  }
}