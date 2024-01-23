import { PageDto } from './page.dto';
import { PageMetaDto } from './page-meta.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PageOptionsDto } from './page-options.dto';

// const pageOptionsDto = new PageOptionsDto();
// pageOptionsDto.page = 1;

const pageMetaParameters = { pageOptionsDto: { page: 1, limit: 10, skip: 0 } as PageOptionsDto, itemCount: 1 };
// const pageMetaParameters = { pageOptionsDto: new PageOptionsDto({ page: 1, limit: 10, skip: 0 }), itemCount: 1 };

describe('PageDto', () => {
  it('should create an instance of PageDto', () => {
    const meta = new PageMetaDto(pageMetaParameters);
    const pageDto = new PageDto(['item1', 'item2'], meta);

    expect(pageDto.data).toEqual(['item1', 'item2']);
    expect(pageDto.meta).toEqual(meta);
  });

  it('should fail validation if data or meta are invalid', async () => {
    const invalidPageDto = plainToInstance(PageDto, { data: 'not an array', meta: 'not a PageMetaDto' });

    const errors = await validate(invalidPageDto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
