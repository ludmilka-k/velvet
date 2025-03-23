'use client';

import { Button } from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import {Plus} from 'lucide-react';
import {CartItem} from '@/types';
import {useToast} from '@/hooks/use-toast';
import {ToastAction} from '@/components/ui/toast';
import {addItemToCart} from '@/lib/actions/cart.actions';

const AddToCart = ({item}:{item:CartItem}) => {
    const router = useRouter();
    const {toast} = useToast();

    const handleAddToCart = async () => {
        const res = await addItemToCart(item);

        if (!res.success) {
            toast({
                variant: 'destructive',
                description: res.message,
            });
            return;
        }

        // Handle success add to cart
        toast({
            description:`${item.name} added to cart `,
            action:
            <ToastAction altText='Go To Cart' onClick={() => router.push('/cart') }
                         className='bg-primary text-white hover: bg-gray-800'
            >
                Go To Cart
            </ToastAction>
        })
    }

    return (
        <Button className='w-full' type='button' onClick={handleAddToCart}>
           <Plus /> Add To Cart
        </Button>
    )
}

export default AddToCart