import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './rooms/rooms.module';
import { PrismaModule } from 'prisma/prisma/prisma.module';
import { UsersModule } from './user/users.module';
import { SprintsModule } from './sprint/sprints.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PtModule } from './periodic-tasks/pt.module';
@Module({
  imports: [
    AuthModule, RoomsModule, PrismaModule, UsersModule, SprintsModule, ScheduleModule.forRoot(),
    PtModule
  ],
})
export class AppModule { }