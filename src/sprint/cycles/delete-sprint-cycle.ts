import { HttpStatus } from '@nestjs/common';
import { SprintsService } from '../sprints.service';

export const deleteSprintCycle = async (
    sprintsService: SprintsService,
    payload: { id: string }
): Promise<{ status: number; json: any }> => {
    try {
        await sprintsService.deleteSprint(payload.id);
        return {
            status: HttpStatus.NO_CONTENT,
            json: null,
        };
    } catch (error) {
        return {
            status: HttpStatus.BAD_REQUEST,
            json: { error: 'Erro ao deletar a sprint' },
        };
    }
};