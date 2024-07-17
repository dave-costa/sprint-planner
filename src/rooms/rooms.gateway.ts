import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from './rooms.service';
import { DisconnectUserPayload, JoinRoomPayload, SelectCardPayload } from './interfaces';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class RoomsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private readonly roomsService: RoomsService) { }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, payload: JoinRoomPayload): void {

        const { roomName, email, username, sequence } = payload;
        const room = roomName
            ? this.roomsService.joinRoom(roomName, email, username)
            : this.roomsService.createRoom(this.makeUniqueId(), email, username, sequence);

        if (room) {
            const roomId = roomName || room.master.room;
            client.join(roomId);
            this.server.to(roomId).emit('userJoined', { users: room.users, sequence: room.users[email].sequence });
        }
    }

    @SubscribeMessage('selectCard')
    handleSelectCard(_client: Socket, payload: SelectCardPayload): void {
        const { roomName, email, card } = payload;
        const users = this.roomsService.selectCard(roomName, email, card);
        this.server.to(roomName).emit('cardSelected', users);
    }

    @SubscribeMessage('revealCards')
    handleRevealCards(_client: Socket, roomName: string): void {
        const users = this.roomsService.revealCards(roomName);
        this.server.to(roomName).emit('cardsRevealed', users);
    }

    @SubscribeMessage('resetRoom')
    handleResetRoom(_client: Socket, roomName: string): void {
        const users = this.roomsService.resetRoom(roomName);
        this.server.to(roomName).emit('roomReset', users);
    }

    @SubscribeMessage('disconnectUser')
    handleDisconnectUser(_client: Socket, payload: DisconnectUserPayload): void {
        const { roomName, email } = payload;
        const { username, users } = this.roomsService.disconnectUser(roomName, email);
        this.server.to(roomName).emit('userLeft', { username, users });
    }

    afterInit(_server: Server) {
        console.log('Init');
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ..._args: any[]) {
        console.log(`Client connected: ${client.id}`);
    }

    private makeUniqueId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}
