import { UseInterceptors } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import {
  EVENTS_KEY,
  MatchInitiatedEvent,
  MatchResultEvent,
} from 'src/core/const/events';
import { ResponseWrapperInterceptor } from 'src/core/interceptors/response-wrapper.interceptor';

export const SOCKET_EVENTS = {
  onFoundOpponent: 'onFoundOpponent',
  onMatchResult: 'onMatchResult',
};

/**
 * What does this aims to do?
 *
 * 1. Find opponent in real time
 * 2. Match plays in real time (opponent move, result,... all real time)
 *
 */
@UseInterceptors(ResponseWrapperInterceptor) // TODO: check if this is needed
@WebSocketGateway({
  transport: 'websocket'
})
export class MatchWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private client: Socket;

  handleConnection(client: Socket, ...args: any[]) {
    this.client = client;
  }

  handleDisconnect(client: Socket) {
    this.client.disconnect();
    this.client = undefined;
  }

  @OnEvent(EVENTS_KEY.matchInitiated)
  onMatchInitiated(payload: MatchInitiatedEvent) {
    this.client?.emit(SOCKET_EVENTS.onFoundOpponent, payload.matchId)
  }

  @OnEvent(EVENTS_KEY.matchResult)
  onMatchResult(payload: MatchResultEvent) {
    this.client?.emit(SOCKET_EVENTS.onMatchResult);
  }
}
