import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma/prisma.service';
import { IUserReturned, IUserToCreate } from 'src/domain/users';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async createUser(data: IUserToCreate): Promise<IUserReturned> {
        let user = await this.prisma.user.create({
            data,
        }) as any;

        delete user?.password
        return user as IUserReturned
    }

    async updatePlan(id: string, updatedPlan: { paidPlan: boolean, maxUsersInPlan: number }): Promise<IUserReturned> {
        let user = await this.prisma.user.update({
            where: {
                id
            },
            data: {
                ...updatedPlan
            }
        }) as any;

        delete user?.password
        return user as IUserReturned
    }




    /*  async getCompleteUserById(id: string): Promise<any> {
         const user = await this.prisma.user.findUnique({
             where: {
                 id: id,
             },
             include: {
                 sprints: {
                     include: {
                         tasks: {
                             include: {
                                 participants: true,
                                 reports: true,
                             }
                         }
                     }
                 },
                 participants: true
             }
         });
         return user;
     } */
    async getUserById(id: string): Promise<IUserReturned> {
        const user = await this.prisma.user.findFirst({
            where: {
                id
            },
        }) as any;

        delete user?.password
        return user as IUserReturned
    }

    async getUserByEmail(email: string): Promise<any> {
        const user = await this.prisma.user.findFirst({
            where: {
                email: email
            }
        }) as any;

        delete user?.password
        return user as IUserReturned
    }
}
