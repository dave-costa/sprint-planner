import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from './interfaces';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) { }

    validateEmail(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    async generateToken(user: AuthUser): Promise<string> {
        return this.jwtService.sign(user);
    }
}
