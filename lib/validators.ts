import { z } from 'zod';

// Schema for inserting products
export const insertProductSchema = z.object ({
    name: z.string(),
    description: z.string(),
    // more
});