import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) { }

    @Get('verify-room/:id')
    verifyRoom(@Param('id') id: string) {
        const room = this.roomsService.getRoom(id);
        if (!room) {
            throw new NotFoundException('Room does not exist');
        }
        return { msg: 'Room found' };
    }

    @Get('show-users/:id')
    showUsers(@Param('id') id: string) {
        const room = this.roomsService.getRoom(id);
        if (!room) {
            throw new NotFoundException('Room does not exist');
        }
        return { room };
    }
}
