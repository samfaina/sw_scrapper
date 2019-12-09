import { Controller, Logger } from '@nestjs/common';
import * as https from 'https';
import * as cron from 'node-cron';
import { ScrapperService } from './scrapper.service';

@Controller()
export class ScrapperController {
  private logger = new Logger('ScrapperController');
  constructor(private readonly scrapperService: ScrapperService) {
    cron.schedule('*/15 * * * *', () => {
      this.logger.log('running a task every 15 minutes');
      this.scrapperService.wathSites();
      https.get('https://hc-ping.com/a5346934-bbb0-4147-ad6e-2f02e7712fbe');
    });
  }
}
