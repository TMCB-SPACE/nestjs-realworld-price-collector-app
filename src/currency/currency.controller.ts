import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrencyService } from './currency.service';
import { DbCurrency } from './entities/currency.entity';
import { CreateCurrencyDto } from './dtos/create-currency.dto';
import { UpdateCurrencyDto } from './dtos/update-currency.dto';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated-response.decorator';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';

@Controller('currency')
@ApiTags('Currency service')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('/')
  @ApiOperation({
    operationId: 'findAllCurrencies',
    summary: 'Finds all currencies',
  })
  @ApiOkResponse({ type: DbCurrency })
  @ApiPaginatedResponse(DbCurrency)
  async findAllCurrencies(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<DbCurrency>> {
    return this.currencyService.findAll(pageOptionsDto);
  }

  @Post('/')
  @ApiOperation({
    operationId: 'createCurrency',
    summary: 'Creates a currency',
  })
  @ApiOkResponse({ type: DbCurrency })
  @ApiBadRequestResponse({ description: 'Invalid currency data' })
  @ApiConflictResponse({ description: 'Currency already exists' })
  @ApiBody({ type: CreateCurrencyDto })
  async createCurrency(@Body() createCurrencyBody: CreateCurrencyDto): Promise<DbCurrency> {
    return this.currencyService.createOne(createCurrencyBody);
  }

  @Get('/:code')
  @ApiOperation({
    operationId: 'getCurrencyByCode',
    summary: 'Returns a currency by code',
  })
  @ApiOkResponse({ type: DbCurrency })
  @ApiNotFoundResponse({ description: 'Currency not found' })
  async getCurrencyByCode(@Param('code') code: string): Promise<DbCurrency> {
    return this.currencyService.findOneByCode(code);
  }

  @Delete('/:code')
  @ApiOperation({
    operationId: 'deleteCurrencyByCode',
    summary: 'Deletes a currency by code',
  })
  @ApiOkResponse({ type: DbCurrency })
  @ApiNotFoundResponse({ description: 'Currency not found' })
  @ApiConflictResponse({ description: 'Currency was already removed' })
  async deleteCurrencyByCode(@Param('code') code: string): Promise<DbCurrency> {
    return this.currencyService.deleteOneByCode(code);
  }

  @Patch('/:code')
  @ApiOperation({
    operationId: 'updateCurrencyByCode',
    summary: 'Updates a currency by code',
  })
  @ApiOkResponse({ type: DbCurrency })
  @ApiNotFoundResponse({ description: 'Currency not found' })
  @ApiBody({ type: UpdateCurrencyDto })
  async updateCurrencyByCode(
    @Param('code') code: string,
    @Body() updateCurrencyBody: UpdateCurrencyDto,
  ): Promise<DbCurrency> {
    return this.currencyService.updateOneByCode(code, updateCurrencyBody);
  }
}
