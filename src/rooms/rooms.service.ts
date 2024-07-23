import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { IFormattedRoom, IRoom, IUserInRoom } from 'src/domain/room';
import { IMainClientInfo } from 'src/domain/room/data-from-client';

@Injectable()
export class RoomsService {
    private rooms: IRoom = {};
    private sequences = {
        fibonacciSequence: ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '144'],
        tShirtSizesSequence: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        powersOf2Sequence: ['1', '2', '4', '8', '16', '32', '64', '128'],
        standardPlanningPokerSequence: ['0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100'],
        hoursSequence: ['2h', '4h', '6h', '8h', '12h', '24h', '1sem', '2sem', '3sem', '4sem']
    }
    private commonPoints: Record<string, number> = {
        '1': 1, '2': 2, '3': 3, '5': 5, '8': 8, '13': 13, '21': 21, '34': 34, '55': 55, '89': 89, '144': 144,
        'XS': 1, 'S': 2, 'M': 5, 'L': 8, 'XL': 13, 'XXL': 21,
        '4': 4, '16': 16, '32': 32, '64': 64, '128': 128,
        '0.5': 0.5, '20': 20, '40': 40, '100': 100,
        '2h': 1, '4h': 2, '6h': 3, '8h': 5, '12h': 8, '24h': 13, '1sem': 21, '2sem': 34, '3sem': 55, '4sem': 89
    };
    seeRooms() {
        return this.rooms
    }

    createRoom(roomToCreate: IFormattedRoom) {
        this.rooms[roomToCreate.id] = {
            ...roomToCreate,
        }
        return this.rooms[roomToCreate.id];
    }

    addUserToTaskFromRoom(user: IMainClientInfo & { name: string }) {
        if (!this.rooms[user.roomCode] || !this.rooms[user.roomCode].tasks.some((task) => task.id === user.taskCode)) {
            throw new NotFoundException('Room or task not found');
        }

        const isMaster = this.rooms[user.roomCode].tasks.every((task) => task.usersInRoom.length === 0);

        let userToRoom = {};

        if (isMaster) {
            this.rooms[user.roomCode].masterInfo = {
                email: user.email,
                room: user.roomCode,
                sequence: this.rooms[user.roomCode].sequence
            };

            userToRoom = {
                email: user.email,
                isMaster: {
                    roomCode: user.roomCode,
                    taskCode: user.taskCode,
                },
                name: user.name,
                card: null,
                show: false,
                sequence: this.sequences[this.rooms[user.roomCode].sequence],
                sequenceName: this.rooms[user.roomCode].sequence
            };
        } else {
            if (this.rooms[user.roomCode].masterInfo && this.rooms[user.roomCode].masterInfo.email === user.email) {
                this.rooms[user.roomCode].tasks.forEach((task) => {
                    task.usersInRoom = task.usersInRoom.filter((u) => u.email !== user.email);
                });

                this.rooms[user.roomCode].masterInfo = {
                    email: user.email,
                    room: user.roomCode,
                    sequence: this.rooms[user.roomCode].sequence
                };
            }

            userToRoom = {
                email: user.email,
                isMaster: null,
                name: user.name,
                card: null,
                show: false,
                sequence: this.sequences[this.rooms[user.roomCode].sequence],
                sequenceName: this.rooms[user.roomCode].sequence
            };
        }

        this.rooms[user.roomCode].tasks.forEach((task) => {
            task.usersInRoom = task.usersInRoom.filter((u) => u.email !== user.email);
        });

        const taskIndex = this.rooms[user.roomCode].tasks.findIndex((task) => task.id === user.taskCode);
        this.rooms[user.roomCode].tasks[taskIndex].usersInRoom.push(userToRoom as IUserInRoom);

        return this.rooms[user.roomCode];
    }
    deleteUserFromRoom(user: IMainClientInfo) {
        if (!this.rooms[user.roomCode] || !this.rooms[user.roomCode].tasks.some((task) => task.id === user.taskCode)) {
            throw new NotFoundException('Room or task not found');
        }

        const taskIndex = this.rooms[user.roomCode].tasks.findIndex((task) => task.id === user.taskCode);
        this.rooms[user.roomCode].tasks[taskIndex].usersInRoom = this.rooms[user.roomCode].tasks[taskIndex].usersInRoom.filter((u) => u.email !== user.email);
        return this.rooms[user.roomCode];
    }

    selectCardFromRoom(user: IMainClientInfo & { card: string }) {
        if (!this.rooms[user.roomCode] || !this.rooms[user.roomCode].tasks.some((task) => task.id === user.taskCode)) {
            throw new NotFoundException('Room or task not found');
        }
        const taskIndex = this.rooms[user.roomCode].tasks.findIndex((task) => task.id === user.taskCode);
        this.rooms[user.roomCode].tasks[taskIndex].usersInRoom.forEach((u) => {
            if (u.email === user.email) {
                u.card = user.card;
            }
        });
        return this.rooms[user.roomCode]
    }

    revealCardsFromRoom(user: IMainClientInfo) {
        if (!this.rooms[user.roomCode] || !this.rooms[user.roomCode].tasks.some((task) => task.id === user.taskCode)) {
            throw new NotFoundException('Room or task not found');
        }

        if (!this.rooms[user.roomCode].masterInfo || this.rooms[user.roomCode].masterInfo.email !== user.email) {
            throw new ForbiddenException('You are not the master of this room');
        }



        const taskIndex = this.rooms[user.roomCode].tasks.findIndex((task) => task.id === user.taskCode);

        if (taskIndex === -1) {
            throw new NotFoundException('Task not found');
        }

        if (!this.rooms[user.roomCode].tasks[taskIndex].usersInRoom.every((u) => u.card)) {
            throw new ForbiddenException('Not all users have selected a card');
        }

        if (this.rooms[user.roomCode].tasks[taskIndex].isVoted) {
            throw new ForbiddenException('Task has already been voted on');
        }



        // update information 


        let pointsForTask = 0;
        let maxPointVoted = null;
        let minPointVoted = null;

        this.rooms[user.roomCode].tasks[taskIndex].usersInRoom.forEach((u) => {
            pointsForTask += this.commonPoints[u.card];

            if (maxPointVoted === null || maxPointVoted.points < this.commonPoints[u.card]) {
                maxPointVoted = {
                    email: u.email,
                    points: this.commonPoints[u.card]
                }
            }

            if (minPointVoted === null || minPointVoted.points > this.commonPoints[u.card]) {
                minPointVoted = {
                    email: u.email,
                    points: this.commonPoints[u.card]
                }
            }
        })

        this.rooms[user.roomCode].tasks[taskIndex].isVoted = true
        this.rooms[user.roomCode].tasks[taskIndex].pointsVoted = pointsForTask
        this.rooms[user.roomCode].tasks[taskIndex].maxPontuation = maxPointVoted
        this.rooms[user.roomCode].tasks[taskIndex].minPontuation = minPointVoted

        // Show cards
        this.rooms[user.roomCode].tasks[taskIndex].usersInRoom.forEach((u) => {

            u.show = true;
        });
        return this.rooms[user.roomCode]
    }

    resetTask(user: IMainClientInfo) {

        if (!this.rooms[user.roomCode] || !this.rooms[user.roomCode].tasks.some((task) => task.id === user.taskCode)) {
            throw new NotFoundException('Room or task not found');
        }

        if (!this.rooms[user.roomCode].masterInfo || this.rooms[user.roomCode].masterInfo.email !== user.email) {
            throw new ForbiddenException('You are not the master of this room');
        }

        const taskIndex = this.rooms[user.roomCode].tasks.findIndex((task) => task.id === user.taskCode);
        if (taskIndex === -1) {
            throw new NotFoundException('Task not found');
        }
        this.rooms[user.roomCode].tasks[taskIndex].isVoted = false
        this.rooms[user.roomCode].tasks[taskIndex].pointsVoted = 0
        this.rooms[user.roomCode].tasks[taskIndex].maxPontuation = null
        this.rooms[user.roomCode].tasks[taskIndex].minPontuation = null
        this.rooms[user.roomCode].tasks[taskIndex].usersInRoom.forEach((u) => {
            u.show = false
            u.card = null
        });
        return this.rooms[user.roomCode]
    }
}