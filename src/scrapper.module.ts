import { Module } from '@nestjs/common';
import { CheerioUtilsService } from './cheerio.utils/cheerio.utils.service';
import { ScrapperController } from './scrapper.controller';
import { ScrapperService } from './scrapper.service';

@Module({
  imports: [],
  controllers: [ScrapperController],
  providers: [ScrapperService, CheerioUtilsService],
})
export class ScrapperModule {}
