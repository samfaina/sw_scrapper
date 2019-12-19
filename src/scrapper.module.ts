import { Module } from '@nestjs/common';
import { ScrapperController } from './scrapper.controller';
import { ScrapperService } from './scrapper.service';
import { CheerioUtilsService } from './utils/cheerio/cheerioutils.service';
import { SocketClientFactory } from './utils/socket-client-factory/socket-client.factory';

@Module({
  imports: [],
  controllers: [ScrapperController],
  providers: [ScrapperService, CheerioUtilsService, SocketClientFactory],
})
export class ScrapperModule {}
