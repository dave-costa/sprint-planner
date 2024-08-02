import { HttpStatus } from "@nestjs/common";
import { IUserReturned } from "src/domain/users";
import { UsersService } from "../users.service";



export const getUserCycle = async (roomsService: UsersService, payload: { id: string }): Promise<{ status: number, json: any }> => {
    try {
        const userExist = await roomsService.getUserById(payload.id) as any;
        if (!userExist) {
            return {
                status: HttpStatus.BAD_REQUEST,
                json: 'Usuário não existe'
            }
        }

        return {
            status: HttpStatus.CREATED,
            json: userExist as IUserReturned
        };
    } catch (error) {
        console.log(error);

        return {
            status: HttpStatus.BAD_REQUEST,
            json: { error: "Erro inesperado, já estamos verificando. Tente novamente mais tarde" }
        }
    }
}