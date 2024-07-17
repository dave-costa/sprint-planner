import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async createUser(email: string, name: string): Promise<User> {
        return this.prisma.user.create({
            data: {
                email,
                name,
            },
        });
    }
}
