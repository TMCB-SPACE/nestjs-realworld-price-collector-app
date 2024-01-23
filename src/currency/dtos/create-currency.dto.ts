import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCurrencyDto {
  @ApiProperty({
    description: 'Currency code',
    example: 'JPY',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(3)
  code: string;

  @ApiProperty({
    description: 'Currency name',
    example: 'Japanese Yen',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
