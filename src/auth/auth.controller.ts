import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUser } from './interfaces';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('make-token')
    async makeToken(@Body('user') user: AuthUser) {
        if (!user || typeof user.name !== 'string' || !this.authService.validateEmail(user.email)) {
            throw new BadRequestException('Invalid user data');
        }
        const token = await this.authService.generateToken(user);
        return { token };
    }
}
