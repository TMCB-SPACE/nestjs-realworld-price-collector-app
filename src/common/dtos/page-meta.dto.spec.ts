import { PageMetaDto } from './page-meta.dto';
import { PageMetaParameters } from './page-meta-parameters.dto';
import { PageOptionsDto } from './page-options.dto';

describe('PageMetaDto', () => {
  it('should create a valid PageMetaDto', () => {
    const pageOptionsDto = { page: 2, limit: 10, skip: 0 };
    const itemCount = 50;
    const pageMetaParameters: PageMetaParameters = { pageOptionsDto, itemCount };

    const pageMetaDto = new PageMetaDto(pageMetaParameters);

    expect(pageMetaDto.page).toBe(pageOptionsDto.page);
    expect(pageMetaDto.limit).toBe(pageOptionsDto.limit);
    expect(pageMetaDto.itemCount).toBe(itemCount);
    expect(pageMetaDto.pageCount).toBe(Math.ceil(itemCount / pageOptionsDto.limit));
    expect(pageMetaDto.hasPreviousPage).toBe(pageMetaDto.page > 1);
    expect(pageMetaDto.hasNextPage).toBe(pageMetaDto.page < pageMetaDto.pageCount);
  });

  it('should handle default values for page and limit', () => {
    const itemCount = 100;
    const pageMetaParameters: PageMetaParameters = {
      pageOptionsDto: {} as PageOptionsDto, // No page or limit specified
      itemCount,
    };

    const pageMetaDto = new PageMetaDto(pageMetaParameters);

    expect(pageMetaDto.page).toBe(1);
    expect(pageMetaDto.limit).toBe(10);
    expect(pageMetaDto.pageCount).toBe(10); // 100 items / 10 items per page
    expect(pageMetaDto.hasPreviousPage).toBe(false);
    expect(pageMetaDto.hasNextPage).toBe(true);
  });
});
