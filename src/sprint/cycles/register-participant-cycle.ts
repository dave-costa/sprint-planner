import { HttpStatus } from '@nestjs/common';
import { SprintsService } from '../sprints.service';
import { IParticipant } from 'src/domain/sprints';

export const registerParticipantCycle = async (
  sprintsService: SprintsService,
  payload: IParticipant,
): Promise<{ status: number; json: any }> => {
  try {
    const task = await sprintsService.registerParticipantInSprint(payload);
    return {
      status: HttpStatus.OK,
      json: task,
    };
  } catch (error) {
    return {
      status: HttpStatus.BAD_REQUEST,
      json: { error: 'Erro ao registrar participante' },
    };
  }
};
