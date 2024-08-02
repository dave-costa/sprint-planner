import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from '../rooms.service';
import { formatPayloadFromClient } from '../helpers/format-payload-from-client';
import { IPayloadSprintFromClient } from 'src/domain/room/data-from-client';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from '../../../prisma/prisma/prisma.module';
describe('O serviço de salas deve: ', () => {
    let service: RoomsService;
    let mockMasterUser: IPayloadSprintFromClient = {
        "name": "Sprint Planning Meeting",
        "email": "dave@sprintplanner.com",
        "duration": "1",
        "estimated_points": 30,
        "sequence": "fibonacciSequence",
        "tasks": [
            {
                "name": "Task 1",
                "description": "Description for Task 1"
            },
            {
                "name": "Task 2",
                "description": "Description for Task 2"
            },
            {
                "name": "Task 3",
                "description": "Description for Task 3"
            }
        ]
    }
    let mockMasterUnvited: any = {
        "name": "Sprint Planning Meeting",
        "email": "dave@sprintplanner.com",
        "roomCode": "5c407fec-255d-4ae2-a454-3bc65281bb2e",
        "taskCode": "449889d1-0344-4ad1-8229-682400a80bb9"
    }
    let prisma: PrismaClient;

    let mockInvitedUser = {
        "name": "Sprint Planning Meeting",
        "email": "aline@sprintplanner.com",
        "roomCode": "5c407fec-255d-4ae2-a454-3bc65281bb2e",
        "taskCode": "449889d1-0344-4ad1-8229-682400a80bb9"
    }
    beforeAll(async () => {
        prisma = new PrismaClient({
            datasources: {
                db: {
                    url: 'postgresql://dave-costa:eq8mnk9tvxHg@ep-fancy-sun-a5u0qciv-pooler.us-east-2.aws.neon.tech/planner?sslmode=require',
                },
            },
        });
        await prisma.$connect();
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });

    /* afterEach(async () => {
        // Limpar dados de teste após cada execução de teste
        await prisma.user.deleteMany();
    }); */

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule],
            providers: [RoomsService],
        }).compile();

        service = module.get<RoomsService>(RoomsService);
    });

    it('- Criar o serviço bem definido', () => {
        expect(service).toBeDefined();
    });

    it('- Criar uma sala com 3 tarefas', () => {
        const roomToCreate = formatPayloadFromClient(mockMasterUser);
        const room = service.createRoom(roomToCreate);
        expect(room.tasks.length).toBe(3);
    })

    it('- Criar o Mestre da sala e adicionar usuário convidado', () => {
        const roomToCreate = formatPayloadFromClient(mockMasterUser);
        const room = service.createRoom(roomToCreate);
        mockMasterUnvited.roomCode = room.id
        mockInvitedUser.roomCode = room.id
        mockMasterUnvited.taskCode = room.tasks[0].id
        mockInvitedUser.taskCode = room.tasks[0].id

        const roomUpdated = service.addUserToTaskFromRoom(mockMasterUnvited);
        const roomUptated2 = service.addUserToTaskFromRoom(mockInvitedUser);

        expect(roomUptated2?.masterInfo?.email).toBe(roomUpdated?.masterInfo?.email);
    })
    it('- Deletar um usuário da sala', () => {
        const roomToCreate = formatPayloadFromClient(mockMasterUser);
        const room = service.createRoom(roomToCreate);
        mockMasterUnvited.roomCode = room.id
        mockMasterUnvited.taskCode = room.tasks[0].id
        const roomUpdatedWithUser = service.addUserToTaskFromRoom(mockMasterUnvited);
        expect(roomUpdatedWithUser?.tasks[0].usersInRoom.length).toBe(1);
        const roomUpdated = service.deleteUserFromRoom(mockMasterUnvited);
        expect(roomUpdated?.tasks[0].usersInRoom.length).toBe(0);
    })

    it('- Selecionar cartas', () => {
        const roomToCreate = formatPayloadFromClient(mockMasterUser);
        const room = service.createRoom(roomToCreate);
        mockMasterUnvited.roomCode = room.id
        mockMasterUnvited.taskCode = room.tasks[0].id
        const roomUpdatedWithUser = service.addUserToTaskFromRoom(mockMasterUnvited);
        expect(roomUpdatedWithUser?.tasks[0].usersInRoom.length).toBe(1);
        mockMasterUnvited.card = "1"
        const roomUpdated = service.selectCardFromRoom(mockMasterUnvited);
        expect(roomUpdated?.tasks[0].usersInRoom[0].card).toBe("1");
    })

    it('- Revelar cartas', () => {
        const roomToCreate = formatPayloadFromClient(mockMasterUser);
        const room = service.createRoom(roomToCreate);
        mockMasterUnvited.roomCode = room.id
        mockMasterUnvited.taskCode = room.tasks[0].id
        const roomUpdatedWithUser = service.addUserToTaskFromRoom(mockMasterUnvited);
        expect(roomUpdatedWithUser?.tasks[0].usersInRoom.length).toBe(1);
        mockMasterUnvited.card = "1"
        service.selectCardFromRoom(mockMasterUnvited);
        const roomUptated2 = service.revealCardsFromRoom(mockMasterUnvited);
        expect(roomUptated2?.tasks[0].usersInRoom[0].show).toBe(true);
    })
    it('- Resetar tarefa', () => {
        const roomToCreate = formatPayloadFromClient(mockMasterUser);
        const room = service.createRoom(roomToCreate);
        mockMasterUnvited.roomCode = room.id
        mockMasterUnvited.taskCode = room.tasks[0].id
        const roomUpdatedWithUser = service.addUserToTaskFromRoom(mockMasterUnvited);
        expect(roomUpdatedWithUser?.tasks[0].usersInRoom.length).toBe(1);
        mockMasterUnvited.card = "1"
        service.selectCardFromRoom(mockMasterUnvited);
        service.revealCardsFromRoom(mockMasterUnvited);
        const roomUpdated = service.resetTask(mockMasterUnvited);
        const updatedTask = roomUpdated.tasks[0]
        expect(updatedTask?.isVoted).toBe(false);
        expect(updatedTask?.pointsVoted).toBe(0);
        expect(updatedTask?.maxPontuation).toBeNull();
        expect(updatedTask?.minPontuation).toBeNull();

        updatedTask?.usersInRoom.forEach(u => {
            expect(u.show).toBe(false);
            expect(u.card).toBeNull();
        });

    })

});
