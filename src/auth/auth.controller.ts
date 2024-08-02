import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginUser: { email: string; password: string }) {
        if (!loginUser || !this.authService.validateEmail(loginUser.email) || !loginUser.password) {
            throw new BadRequestException('Invalid login data');
        }

        const token = await this.authService.generateToken(loginUser.email, loginUser.password);
        return { token };
    }
}
