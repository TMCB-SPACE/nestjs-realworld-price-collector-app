import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional, ApiHideProperty } from '@nestjs/swagger';
import { DbCurrency } from './currency.entity';

@Entity({ name: 'exchange_rates' })
export class DbExchangeRate extends BaseEntity {
  @ApiProperty({
    description: 'Unique identifier for the exchange rate',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    description: 'Currency code of the source currency',
    example: 'EUR',
  })
  @Column({
    type: 'varchar',
    name: 'from_currency',
    length: 3,
    nullable: false,
  })
  fromCurrency: string;

  @ApiProperty({
    description: 'Currency code of the target currency',
    example: 'USD',
  })
  @Column({
    type: 'varchar',
    name: 'to_currency',
    length: 3,
    nullable: false,
  })
  toCurrency: string;

  @ApiPropertyOptional({
    description: 'Exchange rate between currencies',
    example: 1.18,
  })
  @Column({
    type: 'real',
    nullable: false,
    default: 1.0,
  })
  rate?: number;

  @ApiPropertyOptional({
    description: 'Timestamp representing exchange rate creation',
    example: '2016-10-19 13:24:51.000000',
  })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt?: Date;

  @ApiPropertyOptional({
    description: 'Timestamp representing exchange rate update',
    example: '2017-01-23 14:25:37.000000',
  })
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt?: Date;

  // @TODO: revert to ApiHideProperty once select:false logic is fixed upstream
  @ApiHideProperty()
  @ApiPropertyOptional({
    description: 'Timestamp representing exchange rate deletion',
    example: null,
  })
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    // commented due to broken logic in https://github.com/typeorm/typeorm/blob/c4a36da62593469436b074873eba186f0f8b990d/src/query-builder/SoftDeleteQueryBuilder.ts#L36C28-L36C53
    // select: false,
  })
  deletedAt?: Date;

  @ApiHideProperty()
  @ManyToOne(
    /* istanbul ignore next */ () => DbCurrency,
    /* istanbul ignore next */ (currency) => currency.exchangeRates,
  )
  @JoinColumn({
    name: 'from_currency',
    referencedColumnName: 'code',
  })
  currency: DbCurrency;
}
