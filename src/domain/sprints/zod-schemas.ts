import { z } from 'zod';

export const basicSprintSchema = z.object({
    name: z.string({ message: "Nome da sprint é obrigatório" }),
    durationWeeks: z.number().int().positive({ message: "Duração em semanas deve ser um número positivo" }),
    sequencie: z.string(),
    estimatedPoints: z.number(),
    tasks: z.array(
        z.object({
            name: z.string({ message: "Nome da tarefa é obrigatório" }),
            description: z.string().optional(),
            voted: z.boolean().optional(),
            pointsVoted: z.number().int().optional(),
        })
    )
});
