import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { CheerioUtilsService } from './utils/cheerio/cheerioutils.service';
import { SocketClientFactory } from './utils/socket-client-factory/socket-client.factory';

@Injectable()
export class ScrapperService {
  private logger = new Logger('ScrapperService');
  private client: ClientProxy;

  constructor(
    private readonly cheerioService: CheerioUtilsService,
    private readonly socketFactory: SocketClientFactory,
  ) {
    this.client = ClientProxyFactory.create(
      this.socketFactory.createDBClient(),
    );
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
