import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post()
    async createUser(@Body() body: { email: string; name: string }) {
        const { email, name } = body;
        return this.usersService.createUser(email, name);
    }
}
