import { Test, TestingModule } from '@nestjs/testing';
import { RoomsGateway } from '../rooms.gateway';
import { RoomsService } from '../rooms.service';
import { Server } from 'socket.io';

describe('RoomsGateway', () => {
    let gateway: RoomsGateway;
    let service: RoomsService;
    let mockServer: Partial<Server>;

    beforeEach(async () => {
        mockServer = {
            to: jest.fn().mockReturnThis(),
            emit: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoomsGateway,
                {
                    provide: RoomsService,
                    useValue: {
                        createRoom: jest.fn(),
                        joinRoom: jest.fn(),
                        selectCard: jest.fn(),
                        revealCards: jest.fn(),
                        resetRoom: jest.fn(),
                        disconnectUser: jest.fn(),
                    },
                },
            ],
        }).compile();

        gateway = module.get<RoomsGateway>(RoomsGateway);
        service = module.get<RoomsService>(RoomsService);

        (gateway as any).server = mockServer;
    });

    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });

    it('should handle joinRoom', () => {
        const mockClient = { join: jest.fn() } as any;
        const payload = { roomName: 'roomId', email: 'test@example.com', username: 'Test User', sequence: 'sequence' };

        service.joinRoom = jest.fn().mockReturnValue({ users: { 'test@example.com': { sequence: 'sequence' } } });

        gateway.handleJoinRoom(mockClient, payload);

        expect(service.joinRoom).toHaveBeenCalled();
        expect(mockClient.join).toHaveBeenCalledWith('roomId');
        expect(mockServer.to).toHaveBeenCalledWith('roomId');
        expect(mockServer.emit).toHaveBeenCalledWith('userJoined', { users: { 'test@example.com': { sequence: 'sequence' } }, sequence: 'sequence' });
    });

    it('should handle selectCard', () => {
        const mockClient = {} as any;
        const payload = { roomName: 'roomId', email: 'test@example.com', card: '5' };

        service.selectCard = jest.fn().mockReturnValue({ 'test@example.com': { card: '5' } });

        gateway.handleSelectCard(mockClient, payload);

        expect(service.selectCard).toHaveBeenCalledWith('roomId', 'test@example.com', '5');
        expect(mockServer.to).toHaveBeenCalledWith('roomId');
        expect(mockServer.emit).toHaveBeenCalledWith('cardSelected', { 'test@example.com': { card: '5' } });
    });

    it('should handle revealCards', () => {
        const mockClient = {} as any;
        const roomName = 'roomId';

        service.revealCards = jest.fn().mockReturnValue({ 'test@example.com': { show: true } });

        gateway.handleRevealCards(mockClient, roomName);

        expect(service.revealCards).toHaveBeenCalledWith('roomId');
        expect(mockServer.to).toHaveBeenCalledWith('roomId');
        expect(mockServer.emit).toHaveBeenCalledWith('cardsRevealed', { 'test@example.com': { show: true } });
    });

    it('should handle resetRoom', () => {
        const mockClient = {} as any;
        const roomName = 'roomId';

        service.resetRoom = jest.fn().mockReturnValue({ 'test@example.com': { card: null, show: false } });

        gateway.handleResetRoom(mockClient, roomName);

        expect(service.resetRoom).toHaveBeenCalledWith('roomId');
        expect(mockServer.to).toHaveBeenCalledWith('roomId');
        expect(mockServer.emit).toHaveBeenCalledWith('roomReset', { 'test@example.com': { card: null, show: false } });
    });

    it('should handle disconnectUser', () => {
        const mockClient = {} as any;
        const payload = { roomName: 'roomId', email: 'test@example.com' };

        service.disconnectUser = jest.fn().mockReturnValue({ username: 'Test User', users: {} });

        gateway.handleDisconnectUser(mockClient, payload);

        expect(service.disconnectUser).toHaveBeenCalledWith('roomId', 'test@example.com');
        expect(mockServer.to).toHaveBeenCalledWith('roomId');
        expect(mockServer.emit).toHaveBeenCalledWith('userLeft', { username: 'Test User', users: {} });
    });

    it('should log on init', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        gateway.afterInit(mockServer as Server);
        expect(consoleSpy).toHaveBeenCalledWith('Init');
    });

    it('should log on connection', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        const mockClient = { id: 'client1' } as any;
        gateway.handleConnection(mockClient);
        expect(consoleSpy).toHaveBeenCalledWith('Client connected: client1');
    });

    it('should log on disconnect', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        const mockClient = { id: 'client1' } as any;
        gateway.handleDisconnect(mockClient);
        expect(consoleSpy).toHaveBeenCalledWith('Client disconnected: client1');
    });
});
