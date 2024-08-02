import { HttpStatus } from '@nestjs/common';
import { SprintsService } from '../sprints.service';

export const getSprintCycle = async (
    sprintsService: SprintsService,
    payload: { id: string }
): Promise<{ status: number; json: any }> => {
    try {
        const sprint = await sprintsService.getSprintById(payload.id);
        if (!sprint) {
            return {
                status: HttpStatus.NOT_FOUND,
                json: { error: 'Sprint não encontrada' },
            };
        }
        return {
            status: HttpStatus.OK,
            json: sprint,
        };
    } catch (error) {
        return {
            status: HttpStatus.BAD_REQUEST,
            json: { error: error.message },
        };
    }
};
