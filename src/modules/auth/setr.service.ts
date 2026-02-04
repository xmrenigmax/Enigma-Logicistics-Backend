import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import { LedgerService } from '../ledger/ledger.service';

@Injectable()
export class SetrService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private ledgerService: LedgerService
  ) {}

  // 1. GENERATE (The Handshake)
  async generateEphemeralToken(userId: string, doorId: string) {
    // Cryptographically secure random token
    const token = crypto.randomBytes(32).toString('hex');
    
    const payload = {
      userId,
      doorId,
      issuedAt: Date.now(),
      fingerprint: this.generateDeviceFingerprint(userId) 
    };

    // Store in RAM (Redis) with strict 30s TTL
    // The patent relies on this being "Ephemeral" by nature of the storage medium
    await this.cacheManager.set(`setr:${token}`, payload, 30000);

    // Audit the issuance
    await this.ledgerService.recordEntry({
      actorId: userId,
      action: 'SETR_ISSUANCE',
      context: { doorId, expires: '30s' }
    });

    return {
      token,
      expiresIn: 30,
      type: 'Bearer-SETR-v1'
    };
  }

  // 2. VALIDATE (The Zero-Trust Check)
  async validateToken(token: string, targetDoorId: string) {
    const payload: any = await this.cacheManager.get(`setr:${token}`);

    if (!payload) {
      throw new UnauthorizedException('SETR_TOKEN_EXPIRED');
    }

    if (payload.doorId !== targetDoorId) {
      // Security Event: Token used on wrong door
      await this.ledgerService.recordEntry({
        actorId: payload.userId,
        action: 'SETR_VIOLATION',
        context: { attempted: targetDoorId, authorized: payload.doorId }
      });
      throw new UnauthorizedException('SETR_SCOPE_MISMATCH');
    }

    // Optional: Burn token after use (One-Time-Use / Nonce)
    await this.cacheManager.del(`setr:${token}`);

    return { valid: true, userId: payload.userId };
  }

  // Helper for device fingerprinting
  private generateDeviceFingerprint(id: string) {
    return crypto.createHash('md5').update(id).digest('hex');
  }
}