import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.modules';
// We will fill this with JWT logic soon, but for now, let's stop the crash.

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [],
})
export class AuthModule {}