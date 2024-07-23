import { RoomsService } from "../rooms.service";
import { HttpStatus } from '@nestjs/common';
import { IMainClientInfo } from "src/domain/room/data-from-client";
export const addRoomCycles = (roomsService: RoomsService, payload: IMainClientInfo & { name: string }): { status: number, json: any } => {
    try {
        return {
            status: HttpStatus.OK,
            json: roomsService.addUserToTaskFromRoom(payload)
        };
    } catch (error) {
        console.log(error);

        return {
            status: HttpStatus.BAD_REQUEST,
            json: { error: "Erro inesperado, já estamos verificando. Tente novamente mais tarde" }
        }
    }

}