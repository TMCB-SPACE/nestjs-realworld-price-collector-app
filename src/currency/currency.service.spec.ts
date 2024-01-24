import { CurrencyService } from './currency.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyController } from './currency.controller';
import { PagerService } from '../common/services/pager.service';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { DbCurrency } from './entities/currency.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PageOptionsDto } from '../common/dtos/page-options.dto';

describe('CurrencyService', () => {
  let testingModule: TestingModule;
  let currencyService: CurrencyService;
  let currencyRepository: Repository<DbCurrency>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
      providers: [
        CurrencyService,
        {
          provide: getRepositoryToken(DbCurrency, 'DbConnection'),
          useValue: {
            insert: jest.fn(() => true),
            findOneByCode: jest.fn(() => true),
            createQueryBuilder: jest.fn().mockImplementation(() => ({
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockReturnValue(true),
              withDeleted: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockReturnValue(true),
              leftJoinAndMapMany: jest.fn().mockReturnThis(),
            })),
            softRemove: jest.fn(() => true),
          },
        },
        PagerService,
      ],
    }).compile();

    currencyService = testingModule.get<CurrencyService>(CurrencyService);
    currencyRepository = testingModule.get(getRepositoryToken(DbCurrency, 'DbConnection'));
  });

  describe('createOne', () => {
    const createCurrencyDto = {
      code: 'USD',
      name: 'US Dollar',
    };

    it('should return a newly created currency', async () => {
      currencyRepository.insert = jest.fn(() => Promise.resolve({ identifiers: [{ code: 'USD' }] } as any));
      const createOne = jest.spyOn(currencyService, 'createOne');
      const findOneByCode = jest.spyOn(currencyService, 'findOneByCode');

      await currencyService.createOne(createCurrencyDto);
      expect(createOne).toHaveBeenCalledWith(createCurrencyDto);
      expect(findOneByCode).toHaveBeenCalledWith(createCurrencyDto.code);
    });

    it('should throw a BadRequestException', async () => {
      currencyRepository.insert = jest.fn(() => Promise.reject(false));

      await expect(() => currencyService.createOne(createCurrencyDto)).rejects.toThrow(
        new BadRequestException('Invalid currency data'),
      );
    });

    // it('should throw a ConflictException on duplicate', async () => {
    //   currencyRepository.insert = jest.fn(() =>
    //     Promise.reject(
    //       new QueryFailedError('query', [], {
    //         name: 'test',
    //         // @ts-expect-error typing postgres is incomplete
    //         code: '23505',
    //         routine: 'NewUniquenessConstraintViolationError',
    //       }),
    //     ),
    //   );
    //
    //   await expect(() => currencyService.createOne(createCurrencyDto)).rejects.toThrow(
    //     new ConflictException('Currency already exists'),
    //   );
    // });
    //
    // it('should throw a BadRequestException on driver error', async () => {
    //   currencyRepository.insert = jest.fn(() =>
    //     Promise.reject(
    //       new QueryFailedError('query', [], {
    //         name: 'test',
    //         // @ts-expect-error typing postgres is incomplete
    //         code: '00000',
    //         routine: 'UnknownError',
    //       }),
    //     ),
    //   );
    //
    //   await expect(() => currencyService.createOne(createCurrencyDto)).rejects.toThrow(
    //     new BadRequestException('Invalid currency data'),
    //   );
    // });
  });

  describe('findOneByCode', () => {
    const code = 'USD';

    it('should return an existing currency', async () => {
      const findOneByCode = jest.spyOn(currencyService, 'findOneByCode');

      await currencyService.findOneByCode(code);
      expect(findOneByCode).toHaveBeenCalledWith(code);
    });

    it('should throw a NotFoundException', async () => {
      currencyRepository.createQueryBuilder = jest.fn().mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue(null),
        leftJoinAndMapMany: jest.fn().mockReturnThis(),
      }));

      await expect(() => currencyService.findOneByCode(code)).rejects.toThrow(
        new NotFoundException('Currency not found'),
      );
    });
  });

  describe('deleteOneByCode', () => {
    const code = 'USD';

    it('should return the removed currency', async () => {
      const deleteOneByCode = jest.spyOn(currencyService, 'deleteOneByCode');

      await currencyService.deleteOneByCode(code);
      expect(deleteOneByCode).toHaveBeenCalledWith(code);
    });

    it('should throw a NotFoundException', async () => {
      currencyRepository.createQueryBuilder = jest.fn().mockImplementation(() => ({
        withDeleted: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue(null),
        leftJoinAndMapMany: jest.fn().mockReturnThis(),
      }));

      await expect(() => currencyService.deleteOneByCode(code)).rejects.toThrow(
        new NotFoundException('Currency not found'),
      );
    });

    it('should throw a ConflictException', async () => {
      currencyRepository.createQueryBuilder = jest.fn().mockImplementation(() => ({
        withDeleted: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue({ deletedAt: new Date() }),
        leftJoinAndMapMany: jest.fn().mockReturnThis(),
      }));

      await expect(() => currencyService.deleteOneByCode(code)).rejects.toThrow(
        new ConflictException('Currency was already removed'),
      );
    });
  });

  describe('updateOneByCode', () => {
    const code = 'USD';
    const updateCurrencyDto = {
      name: 'US Dollar',
    };

    it('should return the updated currency', async () => {
      currencyRepository.update = jest.fn(() => Promise.resolve({ affected: 1 } as any));
      const findOneByCode = jest.spyOn(currencyService, 'findOneByCode');

      await currencyService.updateOneByCode(code, updateCurrencyDto);
      expect(findOneByCode).toHaveBeenCalledWith(code);
    });

    it('should throw a BadRequestException', async () => {
      currencyRepository.update = jest.fn(() => Promise.resolve({ affected: 0 } as any));

      await expect(() => currencyService.updateOneByCode(code, updateCurrencyDto)).rejects.toThrow(
        new BadRequestException('Invalid currency data'),
      );
    });

    it('should throw a ConflictException on duplicate', async () => {
      currencyRepository.update = jest.fn(() =>
        Promise.reject(
          new QueryFailedError('query', [], {
            name: 'test',
            // @ts-expect-error typing postgres is incomplete
            code: '23505',
            routine: 'NewUniquenessConstraintViolationError',
          }),
        ),
      );

      await expect(() => currencyService.updateOneByCode(code, updateCurrencyDto)).rejects.toThrow(
        new ConflictException('Currency already exists'),
      );
    });

    it('should throw a BadRequestException on driver error', async () => {
      currencyRepository.update = jest.fn(() =>
        Promise.reject(
          new QueryFailedError('query', [], {
            name: 'test',
            // @ts-expect-error typing postgres is incomplete
            code: '00000',
            routine: 'UnknownError',
          }),
        ),
      );

      await expect(() => currencyService.updateOneByCode(code, updateCurrencyDto)).rejects.toThrow(
        new BadRequestException('Invalid currency data'),
      );
    });
  });

  describe('findAll', () => {
    const pageOptionsDto: PageOptionsDto = {
      page: 1,
      limit: 10,
      skip: 0,
    };

    it('should return an array of currencies', async () => {
      const findAll = jest.spyOn(currencyService, 'findAll');

      await currencyService.findAll(pageOptionsDto);
      expect(findAll).toHaveBeenCalledWith(pageOptionsDto);
    });
  });
});
