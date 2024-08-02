import { RoomsService } from "../rooms.service";
import { HttpStatus } from '@nestjs/common';
import { IMainClientInfo } from "src/domain/room/data-from-client";
export const verifyLimitCycle = async (roomsService: RoomsService, payload: IMainClientInfo): Promise<{ status: number, json: any }> => {
    try {
        const data = await roomsService.verifyLimitFromRoom(payload)
        return {
            status: HttpStatus.OK,
            json: data
        };
    } catch (error) {
        return {
            status: HttpStatus.BAD_REQUEST,
            json: { error: "Erro inesperado, já estamos verificando. Tente novamente mais tarde" }
        }
    }

}