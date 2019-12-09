import { Test, TestingModule } from '@nestjs/testing';
import { Cheerio.UtilsService } from './cheerio.utils.service';

describe('Cheerio.UtilsService', () => {
  let service: Cheerio.UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Cheerio.UtilsService],
    }).compile();

    service = module.get<Cheerio.UtilsService>(Cheerio.UtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
