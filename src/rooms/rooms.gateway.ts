import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from './rooms.service';
import { addRoomCycles } from './cycles/add-room-cycle';
import { deleteUserCycle } from './cycles/delete-user-cycle';
import { selectCardCycle } from './cycles/select-card-cycle';
import { revealCardsCycle } from './cycles/reveal-cards-cycle';
import { resetTaskCycle } from './cycles/reset-task-cycle';
import { IMainClientInfo } from 'src/domain/room/data-from-client';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class RoomsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private readonly roomsService: RoomsService) { }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, payload: IMainClientInfo & { name: string }): void {
        const roomUpdated = addRoomCycles(this.roomsService, payload);
        if (roomUpdated.status == 200) {
            const socket_room = `${payload.roomCode}-${payload.taskCode}`;
            client.join(socket_room);
            this.server.to(socket_room).emit('userJoined', {
                data: roomUpdated.json
            })
        } else {
            client.emit('error', roomUpdated.json);
        }
    }

    @SubscribeMessage('disconnectUser')
    handleDisconnectUser(client: Socket, payload: IMainClientInfo): void {

        const roomUpdated = deleteUserCycle(this.roomsService, payload);
        const socket_room = `${payload.roomCode}-${payload.taskCode}`;

        if (roomUpdated.status == 200) {
            this.server.to(socket_room).emit('userLeft', {
                data: roomUpdated.json
            })
        } else {
            client.emit('error', roomUpdated.json);
        }
    }

    @SubscribeMessage('selectCard')
    handleSelectCard(client: Socket, payload: IMainClientInfo & { card: string }): void {

        const roomUpdated = selectCardCycle(this.roomsService, payload);
        const socket_room = `${payload.roomCode}-${payload.taskCode}`;

        if (roomUpdated.status == 200) {
            this.server.to(socket_room).emit('cardSelected', {
                data: roomUpdated.json
            })
        } else {
            client.emit('error', roomUpdated.json);
        }
    }
    @SubscribeMessage('revealCards')
    handleRevealCards(client: Socket, payload: IMainClientInfo): void {
        const roomUpdated = revealCardsCycle(this.roomsService, payload);
        const socket_room = `${payload.roomCode}-${payload.taskCode}`;

        if (roomUpdated.status == 200) {
            this.server.to(socket_room).emit('cardsRevealed', {
                data: roomUpdated.json
            })
        } else {
            client.emit('error', roomUpdated.json);
        }
    }

    @SubscribeMessage('resetRoom')
    handleResetRoom(client: Socket, payload: IMainClientInfo): void {
        const roomUpdated = resetTaskCycle(this.roomsService, payload);
        const socket_room = `${payload.roomCode}-${payload.taskCode}`;

        if (roomUpdated.status == 200) {
            this.server.to(socket_room).emit('roomReset', {
                data: roomUpdated.json
            })
        } else {
            client.emit('error', roomUpdated.json);
        }
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
}
