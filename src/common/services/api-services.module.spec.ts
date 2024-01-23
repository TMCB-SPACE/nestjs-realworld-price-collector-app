import { Test, TestingModule } from '@nestjs/testing';
import { ApiServicesModule } from './api-services.module';
import { PagerService } from './pager.service';

describe('ApiServicesModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ApiServicesModule],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should provide the PagerService', () => {
    const pagerService = module.get<PagerService>(PagerService);
    expect(pagerService).toBeInstanceOf(PagerService);
  });
});
