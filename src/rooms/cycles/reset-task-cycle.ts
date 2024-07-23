import { IMainClientInfo } from "src/domain/room/data-from-client";
import { RoomsService } from "../rooms.service";
import { HttpStatus } from '@nestjs/common';
export const resetTaskCycle = (roomsService: RoomsService, payload: IMainClientInfo): { status: number, json: any } => {
    try {
        return {
            status: HttpStatus.OK,
            json: roomsService.resetTask(payload)
        };
    } catch (error) {
        console.log(error);

        return {
            status: HttpStatus.BAD_REQUEST,
            json: { error: "Erro inesperado, já estamos verificando. Tente novamente mais tarde" }
        }
    }

}