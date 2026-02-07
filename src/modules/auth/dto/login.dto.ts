import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@enigma.logic' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'EnigmaSecure2026!' })
  @IsString()
  @MinLength(6)
  password: string;
}