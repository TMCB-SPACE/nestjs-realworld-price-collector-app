import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  @ValidateNested({ each: true })
  @Type(() => Array)
  readonly data: T[];

  @IsObject()
  @ApiProperty({ type: PageMetaDto })
  @ValidateNested()
  @Type(() => PageMetaDto)
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
