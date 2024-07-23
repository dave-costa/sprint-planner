import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './rooms/rooms.module';
import { PrismaModule } from 'prisma/prisma/prisma.module';
/* import { UsersModule } from './users/users.module';
import { SprintsModule } from './sprints/sprints.module'; */

@Module({
  imports: [AuthModule, RoomsModule, PrismaModule,/*  UsersModule, SprintsModule */],
})
export class AppModule { }