import { Injectable, Logger } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import * as cheerio from 'cheerio';
import * as moment from 'moment';
import * as request from 'request';

@Injectable()
export class CheerioUtilsService {
  private logger = new Logger('CheerioUtilsService');
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 8877,
      },
    });
  }

  async handleSite(_site: any): Promise<any> {
    const data = await this.resolveSite(_site);
    if (data) {
      return await this.scrapSite(data);
      //   const updateOp = await this.dbClient
      //     .send<any, any>('updateSite', site)
      //     .toPromise();

      //   this.logger.log(updateOp);
    }
    return Promise.resolve();
  }

  private resolveSite(_site: any): Promise<any> {
    const site = Object.assign({}, _site);
    return new Promise((resolve, reject) => {
      request(site.url, (error, response, html) => {
        if (error || (response && response.statusCode !== 200)) {
          this.logger.error(
            `Content not found for ${site.url}`,
            error || response,
          );
          resolve();
        } else {
          const $ = cheerio.load(html);
          //   console.log('Fetching ' + site.url);
          //   console.log('Anchor selector: ' + site.selector_chapter);
          const chapterCount = this.getChapterCount($, site);
          if (chapterCount > site.chapter_count) {
            // notify
            if (site.chapter_count > 0) {
              this.client.send<string, string>('push', site.name).toPromise();
            }

            site.chapter_count = chapterCount;
            // update value
            //   console.log('Updating: ', site.name);
            // this.dbClient.send<any, any>('updateSite', site).toPromise();
            // const _site = updateSiteRecord(site, chapterCount, $);
            // this.logger.writeLog(_site, 'Updated', old, chapterCount);
            resolve({
              _site: site,
              $: $,
            });
          } else {
            this.logger.log(`${site.name} is up to date`);
            resolve();
            // logger.writeLog(site, 'UpToDate', old, chapterCount);
          }
        }
      });
    });
  }

  private scrapSite({ _site, $ }): Promise<any> {
    const site = Object.assign({}, _site);
    return new Promise((resolve, reject) => {
      site.watched = false;
      site.last_update = moment().format('YYYY-MM-DD');

      let _chapterDate = $(site.selector_date)
        .first()
        .text()
        .trim()
        .replace('.', '');
      site.chapter_date = moment(_chapterDate, site.format_date).format(
        'YYYY-MM-DD',
      );

      site.status = $('dt')
        .filter(function() {
          return (
            $(this)
              .text()
              .trim() === 'Estado'
          );
        })
        .next()
        .text()
        .trim();

      site.chapter_last_published = $('.chapters a')
        .filter((index, anchor) => {
          return (
            $(anchor).attr('href') !== undefined &&
            $(anchor).attr('href') !== null &&
            $(anchor).attr('href') !== '' &&
            !/download/.test($(anchor).attr('href')) &&
            !/chapter_link/.test($(anchor).attr('class'))
          );
        })
        .first()
        .attr('href');

      site.chapter_last_published = site.chapter_last_published
        ? site.chapter_last_published.replace(/.*\//, '')
        : '';

      resolve(site);
    });
  }

  private getChapterCount($: any, site: any) {
    const chapterCount = $(site.selector_chapter).filter((index, anchor) => {
      return (
        $(anchor).attr('href') !== undefined &&
        $(anchor).attr('href') !== null &&
        $(anchor).attr('href') !== '' &&
        !/download/.test($(anchor).attr('href')) &&
        !/chapter_link/.test($(anchor).attr('class'))
      );
    }).length;
    //   console.log('Chapter count stored: ' + site.chapter_count);
    //   console.log('Chapter count finded: ' + chapterCount);
    // const old = site.chapter_count;
    return chapterCount;
  }
}
