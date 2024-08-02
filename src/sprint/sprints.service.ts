import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma/prisma.service';
import {
  IParticipant,
  ISprintReturned,
  ISprintToCreate,
  IUpdateRealPoints,
} from 'src/domain/sprints';

@Injectable()
export class SprintsService {
  constructor(private prisma: PrismaService) { }

  async createSprint(data: ISprintToCreate): Promise<ISprintReturned> {
    try {
      const sprint = await this.prisma.sprint.create({
        data: {
          name: data.name,
          durationWeeks: data.durationWeeks,
          sequencie: data.sequencie,
          estimatedPoints: data.estimatedPoints,
          ownerID: data.ownerID,
          tasks: {
            create: data.tasks.map((task) => ({
              name: task.name,
              description: task.description,
              voted: task.voted,
              pointsVoted: task.pointsVoted,
            })),
          },
        },
        include: { tasks: true },
      });
      return sprint as ISprintReturned;
    } catch (error) {
      console.log(error);

      throw new Error(
        'Erro salvando a sprint no banco, verifique as informações e tente novamente',
      );
    }
  }

  async getSprintById(id: string): Promise<ISprintReturned | null> {
    const data = await this.prisma.sprint.findUnique({
      where: { id },
      include: {
        tasks: true,
        participants: true,
      },
    });
    if (!data) {
      throw new Error('Sprint não encontrada');
    }

    return data as ISprintReturned;
  }

  async registerParticipantInSprint(data: IParticipant): Promise<any> {
    try {
      // Verifique se o participante já está registrado na sprint
      const existingParticipant = await this.prisma.sprint.findUnique({
        where: { id: data.sprintId },
        select: {
          participants: {
            where: { email: data.email },
          },
        },
      });

      if (existingParticipant && existingParticipant.participants.length > 0) {
        throw new BadRequestException("Participante ja existe")
      }

      return await this.prisma.sprint.update({
        where: { id: data.sprintId },
        data: {
          participants: {
            create: {
              email: data.email,
              points: data.points,
              phone: data.phone,
              tasksIds: data.tasksIds,
              tasksNames: data.tasksNames,
            },
          },
        },
        include: { participants: true },
      });
    } catch (error) {
      throw new Error('Erro adicionando participante');
    }
  }



  async updateRealPointsFromSprint(
    data: IUpdateRealPoints,
  ): Promise<ISprintReturned> {
    try {
      const sprint = await this.prisma.sprint.update({
        where: { id: data.sprintId },
        data: {
          realPoints: data.realPoints
        },
        include: {
          tasks: true,
          participants: true,
        },
      });
      return sprint as ISprintReturned;
    } catch (error) {
      throw new Error('Erro ao atualizar pontuação');
    }
  }

  async deleteSprint(id: string): Promise<void> {
    await this.prisma.sprint.delete({ where: { id } });
  }
}
