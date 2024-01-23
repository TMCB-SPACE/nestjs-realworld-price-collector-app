import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbCurrency } from './entities/currency.entity';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { ApiServicesModule } from '../common/services/api-services.module';
import { DbExchangeRate } from './entities/exchange-rate.entity';

@Module({
  imports: [ApiServicesModule, TypeOrmModule.forFeature([DbCurrency, DbExchangeRate], 'DbConnection')],
  providers: [CurrencyService],
  controllers: [CurrencyController],
})
export class CurrencyModule {}
