import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class RoomsService {
    private rooms: Record<string, any> = {};

    createRoom(randomId: string, email: string, username: string, sequence: string) {
        this.rooms[randomId] = {
            users: {},
        };
        this.rooms[randomId].users[email] = {
            name: username,
            email: email,
            card: null,
            show: false,
            master: {
                email: email,
                room: randomId,
            },
            sequence,
        };
        return this.rooms[randomId];
    }

    joinRoom(roomName: string, email: string, username: string) {
        if (!this.rooms[roomName]) return null;
        this.rooms[roomName].users[email] = {
            name: username,
            email: email,
            card: null,
            show: false,
            master: null,
            sequence: this.rooms[roomName].users[Object.keys(this.rooms[roomName].users)[0]].sequence,
        };
        return this.rooms[roomName];
    }

    selectCard(roomName: string, email: string, card: string) {
        if (!this.rooms[roomName] || !this.rooms[roomName].users[email]) {
            throw new NotFoundException('Room or user not found');
        }
        this.rooms[roomName].users[email].card = card;
        return this.rooms[roomName].users;
    }

    revealCards(roomName: string) {
        if (!this.rooms[roomName]) {
            throw new NotFoundException('Room not found');
        }
        for (const user in this.rooms[roomName].users) {
            this.rooms[roomName].users[user].show = true;
        }
        return this.rooms[roomName].users;
    }

    resetRoom(roomName: string) {
        if (!this.rooms[roomName]) {
            throw new NotFoundException('Room not found');
        }
        for (const user in this.rooms[roomName].users) {
            this.rooms[roomName].users[user].card = null;
            this.rooms[roomName].users[user].show = false;
        }
        return this.rooms[roomName].users;
    }

    disconnectUser(roomName: string, email: string) {
        if (!this.rooms[roomName] || !this.rooms[roomName].users[email]) {
            throw new NotFoundException('Room or user not found');
        }
        const username = this.rooms[roomName].users[email].name;
        delete this.rooms[roomName].users[email];
        return { username, users: this.rooms[roomName].users };
    }

    getRoom(roomName: string) {
        return this.rooms[roomName] || null;
    }

    getUsersInRoom(roomName: string) {
        if (!this.rooms[roomName]) {
            throw new NotFoundException('Room not found');
        }
        return this.rooms[roomName].users;
    }
}
