import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../modules/users/user.entity';
import { Asset } from '../../modules/assets/asset.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class GenesisSeed implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Asset) private assetRepo: Repository<Asset>,
  ) {}

  async onApplicationBootstrap() {
    // Safety Check: Don't overwrite existing data
    const userCount = await this.userRepo.count();
    if (userCount > 0) {
      console.log('[GENESIS] System already seeded. Skipping initialization.');
      return;
    }

    console.log('[GENESIS] ⚠️  Fresh Database Detected. Initializing Infrastructure...');

    // 1. Create the "System Overlord" (Admin)
    const adminPassword = await bcrypt.hash('EnigmaSecure2026!', 10);
    const admin = this.userRepo.create({
      email: 'admin@enigma.logic',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      isActive: true,
    });
    await this.userRepo.save(admin);
    console.log('   ├── 👤 Administrator Created (admin@enigma.logic)');

    // 2. Create the "Guest Zero" (Demo User)
    const guestPassword = await bcrypt.hash('Guest123!', 10);
    const guest = this.userRepo.create({
      email: 'guest@demo.com',
      passwordHash: guestPassword,
      role: UserRole.GUEST,
      isActive: true,
    });
    await this.userRepo.save(guest);
    console.log('   ├── 👤 Guest Zero Created');

    // 3. Create the Physical Asset Grid (The Rooms)
    const rooms = ['401', '402', '403', 'Penthouse'].map((num, idx) => ({
      name: `Suite ${num}`,
      hardwareId: `ENIGMA-IOT-${num}-${idx}`, // Simulating a MAC address
      lockState: 'LOCKED' as const,
      isUnderMaintenance: false,
      telemetry: { temp: 21.5, battery: 98, signal: 'STRONG' }
    }));
    
    await this.assetRepo.save(rooms);
    console.log(`   ├── 🏨 ${rooms.length} Autonomous Assets Online`);
    console.log('[GENESIS] ✅ Initialization Complete. System Ready.');
  }
}