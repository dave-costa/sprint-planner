
import { z } from 'zod';

export const basicUserSchema = z
    .object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
    })
    .required();
