import { HttpStatus } from '@nestjs/common';
import { ISprintToCreate, ISprintReturned } from 'src/domain/sprints';
import { SprintsService } from '../sprints.service';

export const createSprintCycle = async (
    sprintsService: SprintsService,
    payload: ISprintToCreate
): Promise<{ status: number; json: any }> => {
    try {
        const sprint = await sprintsService.createSprint(payload);
        return {
            status: HttpStatus.CREATED,
            json: sprint,
        };
    } catch (error) {
        return {
            status: HttpStatus.BAD_REQUEST,
            json: { error: error.message },
        };
    }
};
