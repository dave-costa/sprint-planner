import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'prisma/prisma/prisma.module';
import { SECRETJWT } from './conts';

@Module({
    imports: [
        JwtModule.register({
            secret: SECRETJWT,
            signOptions: { expiresIn: '8h' },
        }),
        PrismaModule
    ],
    providers: [AuthService],
    exports: [JwtModule, AuthService],
    controllers: [AuthController],
})
export class AuthModule { }
