import { Module } from "@nestjs/common";
import { MatchModule } from "../match/match.module";
import { MatchWebSocketGateway } from "./web-socket.gateway";


@Module({
    imports: [MatchModule],
    providers: [MatchWebSocketGateway],
})
export class WebSocketModule {

}