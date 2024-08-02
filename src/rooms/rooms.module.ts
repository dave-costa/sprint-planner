import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsGateway } from './rooms.gateway';
import { RoomsController } from './rooms.controller';
import { PrismaModule } from '../../prisma/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [RoomsService, RoomsGateway],
    controllers: [RoomsController],
})
export class RoomsModule { }
