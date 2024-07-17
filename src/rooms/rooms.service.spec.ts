import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';

describe('RoomsService', () => {
    let service: RoomsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RoomsService],
        }).compile();

        service = module.get<RoomsService>(RoomsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a room', () => {
        const room = service.createRoom('roomId', 'test@example.com', 'Test User', 'sequence');
        expect(room).toBeDefined();
        expect(room.users['test@example.com']).toBeDefined();
    });

    it('should join a room', () => {
        service.createRoom('roomId', 'test@example.com', 'Test User', 'sequence');
        const room = service.joinRoom('roomId', 'test2@example.com', 'Test User 2');
        expect(room).toBeDefined();
        expect(room.users['test2@example.com']).toBeDefined();
    });

    it('should select a card', () => {
        service.createRoom('roomId', 'test@example.com', 'Test User', 'sequence');
        const users = service.selectCard('roomId', 'test@example.com', '5');
        expect(users['test@example.com'].card).toBe('5');
    });

    it('should reveal cards', () => {
        service.createRoom('roomId', 'test@example.com', 'Test User', 'sequence');
        service.selectCard('roomId', 'test@example.com', '5');
        const users = service.revealCards('roomId');
        expect(users['test@example.com'].show).toBe(true);
    });

    it('should reset room', () => {
        service.createRoom('roomId', 'test@example.com', 'Test User', 'sequence');
        service.selectCard('roomId', 'test@example.com', '5');
        service.revealCards('roomId');
        const users = service.resetRoom('roomId');
        expect(users['test@example.com'].card).toBe(null);
        expect(users['test@example.com'].show).toBe(false);
    });

    it('should disconnect a user', () => {
        service.createRoom('roomId', 'test@example.com', 'Test User', 'sequence');
        service.joinRoom('roomId', 'test2@example.com', 'Test User 2');
        const { username, users } = service.disconnectUser('roomId', 'test2@example.com');
        expect(username).toBe('Test User 2');
        expect(users['test2@example.com']).toBeUndefined();
    });

    it('should get a room', () => {
        service.createRoom('roomId', 'test@example.com', 'Test User', 'sequence');
        const room = service.getRoom('roomId');
        expect(room).toBeDefined();
    });

    it('should get users in room', () => {
        service.createRoom('roomId', 'test@example.com', 'Test User', 'sequence');
        const users = service.getUsersInRoom('roomId');
        expect(users['test@example.com']).toBeDefined();
    });
});
