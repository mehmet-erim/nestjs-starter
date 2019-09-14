import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client, Server } from 'socket.io';
import { Events } from './events';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  sendEvent$ = new ReplaySubject<Events.Data<any>>(1);

  recievedEvent$ = new ReplaySubject<Events.Data<any>>(1);

  @SubscribeMessage('events')
  listenToEvents(
    client: Client,
    clientData: any,
  ): Observable<WsResponse<number>> {
    return this.sendEvent$.pipe(
      map(data => ({ event: 'events', data } as any)),
    );
  }
}
