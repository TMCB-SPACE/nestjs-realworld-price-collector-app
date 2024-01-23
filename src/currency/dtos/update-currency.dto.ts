import { OmitType } from '@nestjs/swagger';
import { CreateCurrencyDto } from './create-currency.dto';

export class UpdateCurrencyDto extends OmitType(CreateCurrencyDto, ['code'] as const) {}
