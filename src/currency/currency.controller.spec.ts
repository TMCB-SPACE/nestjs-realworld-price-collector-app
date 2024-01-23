import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { PageOptionsDto } from '../common/dtos/page-options.dto';

describe('CurrencyController', () => {
  let testingModule: TestingModule;
  let currencyController: CurrencyController;
  let currencyService: CurrencyService;
  let pageOptionsDto: PageOptionsDto;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
      providers: [
        {
          provide: CurrencyService,
          useValue: {
            findAll: jest.fn(),
            createOne: jest.fn(),
            findOneByCode: jest.fn(),
            deleteOneByCode: jest.fn(),
            updateOneByCode: jest.fn(),
          },
        },
      ],
    }).compile();

    currencyController = testingModule.get<CurrencyController>(CurrencyController);
    currencyService = testingModule.get<CurrencyService>(CurrencyService);
  });

  it('should be defined', () => {
    expect(currencyController).toBeDefined();
  });

  describe('findAllCurrencies', () => {
    it('should return an array of currencies', async () => {
      const findAll = jest.spyOn(currencyService, 'findAll');

      await currencyController.findAllCurrencies(pageOptionsDto);
      expect(findAll).toHaveBeenCalledWith(pageOptionsDto);
    });
  });

  describe('createCurrency', () => {
    const createCurrencyDto = {
      code: 'USD',
      name: 'US Dollar',
    };

    it('should return the created currency', async () => {
      const createOne = jest.spyOn(currencyService, 'createOne');

      await currencyController.createCurrency(createCurrencyDto);
      expect(createOne).toHaveBeenCalledWith(createCurrencyDto);
    });
  });

  describe('getCurrencyByCode', () => {
    const code = 'USD';

    it('should return an existing currency by code', async () => {
      const findOneByCode = jest.spyOn(currencyService, 'findOneByCode');

      await currencyController.getCurrencyByCode(code);
      expect(findOneByCode).toHaveBeenCalledWith(code);
    });
  });

  describe('deleteCurrencyByCode', () => {
    const code = 'USD';

    it('should return the removed currency', async () => {
      const deleteCurrencyByCode = jest.spyOn(currencyService, 'deleteOneByCode');

      await currencyController.deleteCurrencyByCode(code);
      expect(deleteCurrencyByCode).toHaveBeenCalledWith(code);
    });
  });

  describe('updateCurrencyByCode', () => {
    const code = 'USD';
    const updateCurrencyDto = {
      name: 'US Dollar',
    };

    it('should return the updated currency', async () => {
      const updateCurrencyByCode = jest.spyOn(currencyService, 'updateOneByCode');

      await currencyController.updateCurrencyByCode(code, updateCurrencyDto);
      expect(updateCurrencyByCode).toHaveBeenCalledWith(code, updateCurrencyDto);
    });
  });
});
