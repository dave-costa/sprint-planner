
import { z } from 'zod';

export const createRoomSchema = z
    .object({
        name: z.string(),
        email: z.string(),
        duration: z.enum(["1", "2", "3", "4"]),
        estimated_points: z.number().optional(),
        sequence: z.enum(['fibonacciSequence', 'tShirtSizesSequence', 'powersOf2Sequence', 'standardPlanningPokerSequence', 'hoursSequence']),
        tasks: z.array(z.object({ name: z.string(), description: z.string() }))
    })
    .required();

export type IPayloadSprintFromClient = z.infer<typeof createRoomSchema>;
