import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GenerateTokenDto {
  @ApiProperty({ example: 'ENIGMA-IOT-401-0' })
  @IsString()
  doorId: string;
}