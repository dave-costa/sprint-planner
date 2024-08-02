import { Controller, Post, Body, Get, Param, UsePipes, Res, Req, HttpStatus, Delete, UseGuards } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { ISprintToCreate, IParticipant, IUpdateRealPoints } from 'src/domain/sprints';
import { ZodValidationPipe } from 'src/validators/payload-controller';
import { createSprintCycle } from './cycles/create-sprint-cycle';
import { getSprintCycle } from './cycles/get-sprint-cycle';
import { registerParticipantCycle } from './cycles/register-participant-cycle';
import { updateRealPointsCycle } from './cycles/update-real-points-cycle';
import { deleteSprintCycle } from './cycles/delete-sprint-cycle';
import { Response, Request } from 'express';
import { basicSprintSchema } from 'src/domain/sprints/zod-schemas';
import { AuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(AuthGuard)
@Controller('sprints')
export class SprintsController {
    constructor(private sprintsService: SprintsService) { }

    @Post()
    @UsePipes(new ZodValidationPipe(basicSprintSchema))
    async createSprint(@Req() req: Request, @Body() body: ISprintToCreate, @Res() res: Response) {
        console.log('user payload',);
        const user = (req as any)?.user ?? {}
        const ownerID = user.id
        body.ownerID = ownerID
        const response = await createSprintCycle(this.sprintsService, body);
        return res.status(response.status).json(response.json);
    }

    @Get(':id')
    async getSprintById(@Param('id') id: string, @Res() res: Response) {
        if (!id) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'ID obrigatório' });
        const response = await getSprintCycle(this.sprintsService, { id });
        return res.status(response.status).json(response.json);
    }

    @Post('register-participant')
    async registerParticipant(@Body() body: IParticipant, @Res() res: Response) {
        const response = await registerParticipantCycle(this.sprintsService, body);
        return res.status(response.status).json(response.json);
    }

    @Post('update-real-points')
    async updateRealPoints(@Body() body: IUpdateRealPoints, @Res() res: Response) {
        const response = await updateRealPointsCycle(this.sprintsService, body);
        return res.status(response.status).json(response.json);
    }

    @Delete(':id')
    async deleteSprint(@Param('id') id: string, @Res() res: Response) {
        if (!id) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'ID obrigatório' });
        const response = await deleteSprintCycle(this.sprintsService, { id });
        return res.status(response.status).json(response.json);
    }
}
