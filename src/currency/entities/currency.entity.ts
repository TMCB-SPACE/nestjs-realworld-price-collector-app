import {
  Entity,
  Column,
  PrimaryColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DbExchangeRate } from './exchange-rate.entity';

@Entity({ name: 'currencies' })
export class DbCurrency extends BaseEntity {
  @ApiProperty({
    description: 'Currency identifier',
    example: 'EUR',
  })
  @PrimaryColumn({
    type: 'varchar',
    length: 3,
    nullable: false,
  })
  code: string;

  @ApiProperty({
    description: 'Currency name',
    example: 'Euro',
  })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Timestamp representing currency creation',
    example: '2016-10-19 13:24:51.000000',
  })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt?: Date;

  @ApiPropertyOptional({
    description: 'Timestamp representing currency update',
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
    description: 'Timestamp representing currency deletion',
    example: null,
  })
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    // commented due to broken logic in https://github.com/typeorm/typeorm/blob/c4a36da62593469436b074873eba186f0f8b990d/src/query-builder/SoftDeleteQueryBuilder.ts#L36C28-L36C53
    // select: false,
  })
  deletedAt?: Date;

  @ApiProperty({
    description: 'Currency exchange rates',
    type: DbExchangeRate,
    isArray: true,
  })
  @OneToMany(
    /* istanbul ignore next */ () => DbExchangeRate,
    /* istanbul ignore next */ (exchangeRate) => exchangeRate.currency,
  )
  exchangeRates: DbExchangeRate[];
}
