import { Controller, Get, Param, NotFoundException, Post, Body, Res, HttpStatus, UsePipes } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { IPayloadSprintFromClient, createRoomSchema } from './schemas/room';
import { makeRoomCycles } from './useCases/make-room-cyle';
import { Response } from 'express';
import { ZodValidationPipe } from 'src/validators/payload-controller';

@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) { }


    @Post('create-room')
    @UsePipes(new ZodValidationPipe(createRoomSchema))
    createRoom(@Body() body: IPayloadSprintFromClient, @Res() res: Response) {
        if (body.tasks.length == 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Especifique pelo menos uma tarefa' });
        }
        const room = makeRoomCycles(this.roomsService, body)
        return res.status(room.status).json(room.json);
    }




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



    // NÃO VAI PRA PROD

    @Get('see-rooms/:code')
    seeRooms(@Param('code') code: string, @Res() res: Response) {
        if (!code || code != '4444') return res.status(HttpStatus.BAD_REQUEST).json({ error: 'ROTA PRIVADA' });
        return res.status(HttpStatus.OK).json(this.roomsService.seeRooms());
    }

    @Post('add-user-rooms/:code')
    addUserRooms(@Param('code') code: string, @Res() res: Response, @Body() body: {
        roomCode: string,
        taskCode: string,
        email: string,
        sequenceName: string,
        name: string

    }) {
        if (!code || code != '4444') return res.status(HttpStatus.BAD_REQUEST).json({ error: 'ROTA PRIVADA' });

    }
}
