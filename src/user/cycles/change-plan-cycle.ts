import { IMainUser } from "src/domain/users";
import { UsersService } from "../users.service";
import { HttpStatus } from "@nestjs/common";

export const changePlanCycle = async (roomsService: UsersService, payload: { id: string }): Promise<{ status: number, json: any }> => {

    try {

        const userExist = await roomsService.getUserById(payload.id);

        if (!userExist) {
            return {
                status: HttpStatus.NOT_FOUND,
                json: 'Usuário não encontrado'
            }
        }

        // logic to change plan 
        const paidPlan = {
            paidPlan: true,
            maxUsersInPlan: 100
        }

        // 



        const userUpdated = await roomsService.updatePlan(userExist.id, paidPlan)
        return {
            status: HttpStatus.OK,
            json: userUpdated
        };

    } catch (error) {
        console.log(error);

        return {
            status: HttpStatus.BAD_REQUEST,
            json: 'Erro inesperado, já estamos verificando. Tente novamente mais tarde'
        }
    }


}