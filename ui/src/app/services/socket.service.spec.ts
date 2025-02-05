import { TestBed } from '@angular/core/testing';
import { SocketService } from './socket.service';
import { Socket } from 'socket.io-client';

describe('SocketService', () => {
  let service: SocketService;
  let mockSocket: jasmine.SpyObj<Socket>;

  beforeEach(() => {
    mockSocket = jasmine.createSpyObj<Socket>('Socket', [
      'emit',
      'on',
      'disconnect',
    ]);

    // Create a test class that extends SocketService to override the socket creation
    class TestSocketService extends SocketService {
      protected createSocket(): Socket {
        return mockSocket;
      }
    }

    TestBed.configureTestingModule({
      providers: [
        {
          provide: SocketService,
          useClass: TestSocketService,
        },
      ],
    });

    service = TestBed.inject(SocketService);
  });

  afterEach(() => {
    service.disconnect();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
