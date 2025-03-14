import { z } from 'zod';

// Schema for inserting products
export const insertProductSchema = z.object ({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    images: z.array(z.string()),
    brand: z.string(),
    stock: z.coerce.number(),
    price: z.number(),
    // more
});