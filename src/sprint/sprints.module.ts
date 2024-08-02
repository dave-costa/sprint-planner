import { Module } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { SprintsController } from './sprints.controller';
import { PrismaModule } from 'prisma/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
    imports: [PrismaModule, AuthModule],
    providers: [SprintsService, AuthGuard],
    controllers: [SprintsController],
})
export class SprintsModule { }
