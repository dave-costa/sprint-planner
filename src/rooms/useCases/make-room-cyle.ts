import { formatPayloadFromClient } from "../helpers/format-payload-from-client";
import { RoomsService } from "../rooms.service";
import { HttpStatus } from '@nestjs/common';
import { IPayloadSprintFromClient } from "../schemas/room";
export const makeRoomCycles = (roomsService: RoomsService, payloadSprint: IPayloadSprintFromClient): { status: number, json: any } => {
    try {
        const roomToCreate = formatPayloadFromClient(payloadSprint);
        return {
            status: HttpStatus.OK,
            json: roomsService.createRoom(roomToCreate)
        };
    } catch (error) {
        console.log(error);

        return {
            status: HttpStatus.BAD_REQUEST,
            json: { error: "Erro inesperado, já estamos verificando. Tente novamente mais tarde" }
        }
    }

}