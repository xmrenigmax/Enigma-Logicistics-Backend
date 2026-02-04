import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LedgerEntry } from './ledger.entity';
import * as crypto from 'crypto';

@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(LedgerEntry)
    private repo: Repository<LedgerEntry>,
  ) {}

  async recordEntry(data: Partial<LedgerEntry>) {
    // 1. Get the last entry to create the blockchain link
    const lastEntry = await this.repo.find({
      order: { timestamp: 'DESC' },
      take: 1
    });

    const previousHash = lastEntry[0]?.hash || 'GENESIS_BLOCK';

    // 2. Create the cryptographic hash for THIS entry
    const payload = JSON.stringify(data) + previousHash;
    const newHash = crypto.createHash('sha256').update(payload).digest('hex');

    // 3. Save
    const entry = this.repo.create({
      ...data,
      hash: newHash
    });

    return this.repo.save(entry);
  }
}