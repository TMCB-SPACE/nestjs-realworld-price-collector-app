import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

import { OrderDirectionEnum } from '../constants/order-direction.constant';

export class PageOptionsDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    type: Number,
    example: 1,
  })
  @Type(/* istanbul ignore next */ () => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 1000,
    default: 10,
    type: Number,
    example: 10,
  })
  @Type(/* istanbul ignore next */ () => Number)
  @IsNumber()
  @Min(1)
  @Max(10000)
  @IsOptional()
  limit?: number = 50;

  @ApiPropertyOptional({
    enum: OrderDirectionEnum,
    enumName: 'OrderDirectionEnum',
    default: OrderDirectionEnum.DESC,
    example: OrderDirectionEnum.DESC,
  })
  @IsEnum(OrderDirectionEnum)
  @IsOptional()
  orderDirection?: OrderDirectionEnum = OrderDirectionEnum.DESC;

  get skip(): number {
    return ((this.page ?? 1) - 1) * (this.limit ?? 50);
  }
}
