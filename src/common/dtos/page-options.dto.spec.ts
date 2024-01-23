import { PageOptionsDto } from './page-options.dto';
import { validate } from 'class-validator';
import { OrderDirectionEnum } from '../constants/order-direction.constant';

describe('PageOptionsDto', () => {
  it('should validate with default values', async () => {
    const dto = new PageOptionsDto();

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(50);
    expect(dto.orderDirection).toBe(OrderDirectionEnum.DESC);
  });

  it('should validate with correct custom values', async () => {
    const dto = new PageOptionsDto();
    dto.page = 2;
    dto.limit = 100;
    dto.orderDirection = OrderDirectionEnum.ASC;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(dto.page).toBe(2);
    expect(dto.limit).toBe(100);
    expect(dto.orderDirection).toBe(OrderDirectionEnum.ASC);
  });

  it('should return errors for invalid page and limit values', async () => {
    const dto = new PageOptionsDto();
    dto.page = 0; // Invalid, should be >= 1
    dto.limit = 10001; // Invalid, should be <= 10000

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should calculate skip correctly', () => {
    const dto = new PageOptionsDto();
    dto.page = 3;
    dto.limit = 100;

    expect(dto.skip).toBe(200); // (3 - 1) * 100
  });

  it('should default skip to 0', () => {
    const dto = new PageOptionsDto();

    delete dto.page;
    delete dto.limit;
    expect(dto.skip).toBe(0); // (1 - 1) * 50
  });
});
