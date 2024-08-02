import { HttpStatus } from '@nestjs/common';
import { SprintsService } from '../sprints.service';
import { IUpdateRealPoints } from 'src/domain/sprints';

export const updateRealPointsCycle = async (
    sprintsService: SprintsService,
    payload: IUpdateRealPoints
): Promise<{ status: number; json: any }> => {
    try {
        const sprint = await sprintsService.updateRealPointsFromSprint(payload);
        return {
            status: HttpStatus.OK,
            json: sprint,
        };
    } catch (error) {
        return {
            status: HttpStatus.BAD_REQUEST,
            json: { error: 'Erro ao atualizar pontuação' },
        };
    }
};