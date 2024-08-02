import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from '../users.service';
import { PrismaService } from '../../../prisma/prisma/prisma.service';

describe.skip('O serviço de usuários deve: ', () => {
    let service: UsersService;

    beforeEach(async () => {
        const prismaServiceMock = {
            user: {
                create: jest.fn().mockResolvedValue({
                    id: 1,
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    password: '1234',
                    paidPlan: false,
                    maxUsersInPlan: 10,
                }),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: PrismaService, useValue: prismaServiceMock },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it("- Criar um usuário com plano padrao", async () => {
        let userToCreate = {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "password": "1234",
            "paidPlan": false,
            "maxUsersInPlan": 10,
        }
        const user = await service.createUser(userToCreate);
        console.log(user);
    })


});
