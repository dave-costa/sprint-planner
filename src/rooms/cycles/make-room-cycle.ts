import { IPayloadSprintFromClient } from "src/domain/room/data-from-client";
import { formatPayloadFromClient } from "../helpers/format-payload-from-client";
import { RoomsService } from "../rooms.service";
import { HttpStatus } from '@nestjs/common';
export const makeRoomCycles = (roomsService: RoomsService, payloadSprint: IPayloadSprintFromClient): { status: number, json: any } => {
    try {
        const roomToCreate = formatPayloadFromClient(payloadSprint);
        return {
            status: HttpStatus.OK,
            json: roomsService.createRoom(roomToCreate)
        };
    } catch (error) {
        return {
            status: HttpStatus.BAD_REQUEST,
            json: error.message
        }
    }

}