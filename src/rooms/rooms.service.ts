import { Injectable, NotFoundException } from '@nestjs/common';
import { IFormattedPayloadClientToUseInSocket } from './helpers/format-payload-from-client';

@Injectable()
export class RoomsService {
    private rooms: Record<string, any> = {};
    private sequences = {
        fibonacciSequence: ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '144'],
        tShirtSizesSequence: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        powersOf2Sequence: ['1', '2', '4', '8', '16', '32', '64', '128'],
        standardPlanningPokerSequence: ['0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100'],
        hoursSequence: ['2h', '4h', '6h', '8h', '12h', '24h', '1sem', '2sem', '3sem', '4sem']
    }
    seeRooms() {
        return this.rooms
    }

    createRoom(roomToCreate: IFormattedPayloadClientToUseInSocket) {
        this.rooms[roomToCreate.id] = {
            ...roomToCreate,
        }
        return this.rooms[roomToCreate.id];
    }

    addUserToTaskFromRoom(user: {
        roomCode: string,
        taskCode: string,
        email: string,
        sequenceName: string,
        name: string
    }) {

        const isMaster = this.rooms[user.roomCode].tasks.some((task: any[]) => task.length == 0)
        const masterEmail = isMaster ? user.email : null;

        let userToRoom = {}
        if (isMaster && user.email === masterEmail) {
            this.rooms[user.roomCode].masterInfo = {
                email: user.email,
                room: user.roomCode,
                sequence: user.sequenceName
            }

            userToRoom = {
                email: user.email,
                isMaster: {
                    roomCode: user.roomCode,
                    taskCode: user.taskCode,
                },
                name: user.name,
                card: null,
                show: false,
                sequence: this.sequences[user.sequenceName],
                sequenceName: user.sequenceName
            }
        }


        // JA Fizeste o da master
        this.rooms[user.roomCode].tasks[0].usersInRoom.push({ ...userToRoom })


        if (!isMaster) {
            userToRoom = {
                email: user.email,
                isMaster: null,
                name: user.name,
                card: null,
                show: false,
                sequence: this.sequences[this.rooms[user.roomCode].masterInfo],
                sequenceName: user.sequenceName
            }
        }

        // removing user from other tasks
        this.rooms[user.roomCode].tasks.forEach((task: any) => {
            task.usersInRoom = task.usersInRoom.filter((u: any) => u.email != user.email)
        });

        // adding user to the task 
        const taskIndex = this.rooms[user.roomCode].tasks.findIndex((task: any) => task.id === user.taskCode);
        this.rooms[user.roomCode].tasks[taskIndex].usersInRoom.push({ ...userToRoom })

        // AMANHA TU COMPLETA AQUI TAVA FAZENDO CRIACAO ADICAO DE NOVO USER PELO ENDPOINT

        const task = this.rooms[user.roomCode].tasks.find((task: any) => task.id === user.taskCode);
        /*    if (task) {
               task.usersInRoom.push({
                   email: user.email,
                   name: user.name,
                   card: user.card,
                   show: user.show,
                   sequence: user.sequence,
                   sequenceName: user.sequenceName,
                   isMaster: user.roomCode ? { roomCode: user.roomCode } : undefined
               });
           } else {
               throw new Error(`Task with id ${user.taskCode} not found`);
           }
    */
    }



    // need rewrite
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
