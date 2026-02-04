import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // e.g., "Room 402"

  @Column({ unique: true })
  hardwareId: string; // The MAC address or IoT topic

  @Column({ default: 'LOCKED' })
  lockState: 'LOCKED' | 'UNLOCKED' | 'JAMMED';

  @Column({ type: 'jsonb', nullable: true })
  telemetry: any; // Stores live temp, battery, signal strength

  @Column({ nullable: true })
  activeTokenHash: string; // The current SETR hash

  @Column({ default: false })
  isUnderMaintenance: boolean;
}