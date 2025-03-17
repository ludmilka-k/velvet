'use server';
import { prisma } from '@/db/prisma';
import {convertToPlainObject} from '@/lib/utils';
import {LATEST_PRODUCTS_LIMIT} from '@/lib/constants';

// Get the latest products
export async function getLatestProducts() {
    const data = await prisma.product.findMany({
        take : LATEST_PRODUCTS_LIMIT,
        orderBy: {createAt: 'desc'},
    });

    return convertToPlainObject(data);
}