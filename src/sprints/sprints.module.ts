import { Module } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { SprintsController } from './sprints.controller';
import { PrismaModule } from 'prisma/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [SprintsService],
    controllers: [SprintsController],
})
export class SprintsModule { }
