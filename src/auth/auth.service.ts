import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ) { }

    validateEmail(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    private async validateUser(email: string, password: string): Promise<any> {
        const user = await this.prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (user && await bcrypt.compare(password, user.password)) {
            return {
                email: user.email,
                clowi: user.paidPlan,  // clowi é email conta paga 
                mixu_temp_duration_session: user.maxUsersInPlan, // usuarios maximos 
                id: user.id,
            };
        }
        return null;
    }

    async generateToken(email: string, password: string): Promise<string> {
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return this.jwtService.sign(user);
    }
}
