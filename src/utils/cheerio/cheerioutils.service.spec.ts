import { Test, TestingModule } from '@nestjs/testing';
import { CheerioUtilsService } from './cheerioutils.service';

describe('CheerioUtilsService', () => {
  let service: CheerioUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheerioUtilsService],
    }).compile();

    service = module.get<CheerioUtilsService>(CheerioUtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
