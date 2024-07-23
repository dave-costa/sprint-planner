import { Controller, Get, Param, Post, Body, Res, HttpStatus, UsePipes } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { makeRoomCycles } from './cycles/make-room-cycle';
import { Response } from 'express';
import { ZodValidationPipe } from 'src/validators/payload-controller';
import { addRoomCycles } from './cycles/add-room-cycle';
import { deleteUserCycle } from './cycles/delete-user-cycle';
import { selectCardCycle } from './cycles/select-card-cycle';
import { revealCardsCycle } from './cycles/reveal-cards-cycle';
import { resetTaskCycle } from './cycles/reset-task-cycle';
import { createRoomSchema, includeCardSchema, joinRoomSchema, mainClientSchema } from 'src/domain/room/zod-schemas';
import { IMainClientInfo, IPayloadSprintFromClient } from 'src/domain/room/data-from-client';

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

    @Post('join-room')
    @UsePipes(new ZodValidationPipe(joinRoomSchema))
    joinRoom(@Body() body: IMainClientInfo & { name: string }, @Res() res: Response) {
        const room = addRoomCycles(this.roomsService, body)
        return res.status(room.status).json(room.json);
    }

    @Post('delete-user-in-room')
    @UsePipes(new ZodValidationPipe(mainClientSchema))
    deleteUser(@Body() body: IMainClientInfo, @Res() res: Response) {
        const room = deleteUserCycle(this.roomsService, body)
        return res.status(room.status).json(room.json);
    }


    @Post('select-card-in-room')
    @UsePipes(new ZodValidationPipe(mainClientSchema.merge(includeCardSchema)))
    selectCard(@Body() body: IMainClientInfo & { card: string }, @Res() res: Response) {
        const room = selectCardCycle(this.roomsService, body)
        return res.status(room.status).json(room.json);

    }

    @Post('reveal-cards-in-task')
    @UsePipes(new ZodValidationPipe(mainClientSchema))
    revealCards(@Body() body: IMainClientInfo, @Res() res: Response) {
        const room = revealCardsCycle(this.roomsService, body);
        return res.status(room.status).json(room.json);
    }

    @Post('reset-task')
    @UsePipes(new ZodValidationPipe(mainClientSchema))
    resetTask(@Body() body: IMainClientInfo, @Res() res: Response) {
        const room = resetTaskCycle(this.roomsService, body);
        return res.status(room.status).json(room.json);
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
