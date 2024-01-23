import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DbCurrency } from './entities/currency.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PagerService } from '../common/services/pager.service';
import { CreateCurrencyDto } from './dtos/create-currency.dto';
import { UpdateCurrencyDto } from './dtos/update-currency.dto';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(DbCurrency, 'DbConnection')
    private currencyRepository: Repository<DbCurrency>,

    private pagerService: PagerService,
  ) {}

  baseQueryBuilder() {
    const builder = this.currencyRepository
      .createQueryBuilder('currency')
      .leftJoinAndMapMany('currency.exchangeRates', 'currency.exchangeRates', 'exchangeRates');

    return builder;
  }

  async createOne(data: CreateCurrencyDto) {
    try {
      const item = await this.currencyRepository.insert(data);

      return this.findOneByCode(item.identifiers[0].code as string);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        // @ts-expect-error typing postgres is incomplete
        const { code, routine } = error;

        if (code === '23505' || routine === 'NewUniquenessConstraintViolationError') {
          throw new ConflictException('Currency already exists');
        }
      }

      throw new BadRequestException('Invalid currency data');
    }
  }

  async findOneByCode(code: string) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where('currency.code = :code', { code });

    const item = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException('Currency not found');
    }

    return item;
  }

  async deleteOneByCode(code: string) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.withDeleted().where('currency.code = :code', { code });

    const item = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException('Currency not found');
    }

    if (item.deletedAt) {
      throw new ConflictException('Currency was already removed');
    }

    return this.currencyRepository.softRemove(item);
  }

  async updateOneByCode(code: string, data: UpdateCurrencyDto) {
    try {
      const item = await this.findOneByCode(code);

      const updatedItem = await this.currencyRepository.update(item.code, data);

      if (!updatedItem.affected || updatedItem.affected < 1) {
        throw new BadRequestException('Invalid currency data');
      }

      return this.findOneByCode(code);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        // @ts-expect-error typing postgres is incomplete
        const { code, routine } = error;

        if (code === '23505' || routine === 'NewUniquenessConstraintViolationError') {
          throw new ConflictException('Currency already exists');
        }
      }

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Invalid currency data');
    }
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.baseQueryBuilder();

    return this.pagerService.applyPagination({ queryBuilder, pageOptionsDto });
  }
}
