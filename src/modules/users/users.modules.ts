import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
// We will create the service/controller later, but the module needs to exist now
// import { UsersService } from './users.service'; 

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [], // Add UsersService here later
  exports: [TypeOrmModule] // Exporting allows AuthModule to use the User repo
})
export class UsersModule {}