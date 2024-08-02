import { Controller, Post, Body, Get, Param, UsePipes, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { IMainUser, IUserToCreate } from 'src/domain/users';
import { ZodValidationPipe } from 'src/validators/payload-controller';
import { basicUserSchema } from 'src/domain/users/zod-schemas';
import { createUserCycle } from './cycles/create-user-cycle';
import { Response } from 'express';
import { changePlanCycle } from './cycles/change-plan-cycle';
import { getUserCycle } from './cycles/get-user-cycle';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post()
    @UsePipes(new ZodValidationPipe(basicUserSchema))
    async createFreeUser(@Body() body: IMainUser, @Res() res: Response) {
        const response = await createUserCycle(this.usersService, body)
        return res.status(response.status).json(response.json)
    }

    @Post('pay/:id')
    async changePlan(@Param('id') id: string, @Res() res: Response) {
        if (!id) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'ID obrigatório' });
        const response = await changePlanCycle(this.usersService, { id })
        return res.status(response.status).json(response.json)
    }

    @Get(':id')
    async getUserById(@Param('id') id: string, @Res() res: Response) {
        if (!id) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'ID obrigatório' });
        const response = await getUserCycle(this.usersService, { id })
        return res.status(response.status).json(response.json)
    }
}
