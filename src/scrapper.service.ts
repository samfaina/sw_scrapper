import { Injectable, Logger } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CheerioUtilsService } from './cheerio.utils/cheerio.utils.service';

@Injectable()
export class ScrapperService {
  private logger = new Logger('ScrapperService');
  private client: ClientProxy;

  constructor(private readonly cheerioService: CheerioUtilsService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 8876,
      },
    });
  }

  async wathSites() {
    const sites = await this.client.send<any[], any>('findAll', []).toPromise();
    this.logger.log(`${sites.length} sites founded`);

    for (const site of sites) {
      const temp = await this.cheerioService.handleSite(site);
      if (temp) {
        try {
          const res = await this.client
            .send<any, any>('updateSite', temp)
            .toPromise();
          this.logger.log(res);
        } catch (error) {
          this.logger.error('ERROR', error.message);
        }
      }
    }
  }
}
