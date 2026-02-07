import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  hardwareId: string;

  @Column({ default: 'LOCKED' })
  lockState: 'LOCKED' | 'UNLOCKED' | 'JAMMED';

  @Column({ type: 'jsonb', nullable: true })
  telemetry: any;

  @Column({ nullable: true })
  activeTokenHash: string;

  @Column({ default: false })
  isUnderMaintenance: boolean;
}