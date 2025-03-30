import { z } from 'zod';
import {
    insertProductSchema,
    insertCartSchema,
    cartItemSchema,
    shippingAddressSchema,
    insertOrderItemSchema,
    insertOrderSchema,
} from '@/lib/validators';

export type Product = z.infer<typeof insertProductSchema> &{
    id: string;
    rating: string;
    numReviews: number;
    createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof shippingAddressSchema>;
export type Order = z.infer<typeof shippingAddressSchema> & {
    id: string;
    createdAt: Date;
    isPaid: boolean;
    paidAt: Date | null;
    isDelivered: boolean;
    deliveredAt: Date | null;
    orderItem: OrderItem[];
    user: {name:string, email:string};

};