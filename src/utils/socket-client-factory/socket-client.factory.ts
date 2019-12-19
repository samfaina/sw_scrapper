import { Injectable } from '@nestjs/common';
import { ClientOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class SocketClientFactory {
  createDBClient(): ClientOptions {
    return {
      transport: Transport.TCP,
      options: {
        host: process.env.SW_DB_MICRO_HOST,
        port: +process.env.SW_DB_MICRO_PORT,
      },
    };
  }

  createPushClient(): ClientOptions {
    return {
      transport: Transport.TCP,
      options: {
        host: process.env.SW_PUSH_MICRO_HOST,
        port: +process.env.SW_PUSH_MICRO_PORT,
      },
    };
  }
}
