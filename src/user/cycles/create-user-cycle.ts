import { HttpStatus } from "@nestjs/common";
import { IMainUser } from "src/domain/users";
import { UsersService } from "../users.service";
import * as bcrypt from 'bcrypt';
import { getLimitUsersByPlan } from "../helper/paidUser";



export const createUserCycle = async (roomsService: UsersService, payload: IMainUser): Promise<{ status: number, json: any }> => {
    try {
        const userExist = await roomsService.getUserByEmail(payload.email);
        if (userExist) {
            return {
                status: HttpStatus.BAD_REQUEST,
                json: 'Usuário já existe'
            }
        }

        const hashedPassword = await bcrypt.hash(payload.password, 10);
        const maxUsersInPlan = getLimitUsersByPlan['free']

        const userCreated = await roomsService.createUser({ ...payload, paidPlan: false, maxUsersInPlan: maxUsersInPlan, password: hashedPassword })
        return {
            status: HttpStatus.CREATED,
            json: userCreated
        };
    } catch (error) {
        console.log(error);

        return {
            status: HttpStatus.BAD_REQUEST,
            json: { error: "Erro inesperado, já estamos verificando. Tente novamente mais tarde" }
        }
    }
}