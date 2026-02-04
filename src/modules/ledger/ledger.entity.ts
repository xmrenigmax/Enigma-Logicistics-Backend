import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('enigma_ledger')
export class LedgerEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column()
  actorId: string; // User ID or Agent Name

  @Column()
  action: string; // e.g., "OVERRIDE_LOCK", "GENERATE_TOKEN"

  @Column({ type: 'jsonb' })
  context: any; // The "Why" (XAI reasoning goes here)

  @Column()
  hash: string; // SHA-256 hash of the previous entry + this entry (Tamper Proof)
}