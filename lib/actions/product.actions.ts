'use server';
import { PrismaClient} from '@prisma/client';
import {convertToPlainObject} from '@/lib/utils';
import {LATEST_PRODUCTS_LIMIT} from '@/lib/constants';

// Get the latest products
export async function getLatestProducts() {
    const prisma = new PrismaClient();

    const data = await prisma.product.findMany({
        take : LATEST_PRODUCTS_LIMIT,
        orderBy: {createAt: 'desc'},
    });

    return convertToPlainObject(data);
}