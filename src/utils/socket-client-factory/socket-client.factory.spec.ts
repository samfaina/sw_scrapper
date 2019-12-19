import { Test, TestingModule } from '@nestjs/testing';
import { SocketClientFactory } from './socket-client.factory';

describe('SocketClientFactory', () => {
  let service: SocketClientFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketClientFactory],
    }).compile();

    service = module.get<SocketClientFactory>(SocketClientFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
