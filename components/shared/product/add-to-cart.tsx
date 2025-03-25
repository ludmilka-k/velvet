'use client';

import { Button } from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import {Plus, Minus} from 'lucide-react';
import {Cart, CartItem} from '@/types';
import {useToast} from '@/hooks/use-toast';
import {ToastAction} from '@/components/ui/toast';
import {addItemToCart, removeItemFromCart} from '@/lib/actions/cart.actions';


const AddToCart = ({cart, item}:{cart?: Cart, item: CartItem}) => {
    const router = useRouter();
    const {toast} = useToast();

    const handleRemoveFromCart = async () => {
        const res = await removeItemFromCart(item.productId);

        toast({
            variant: res.success ? 'default' : 'destructive',
            description: res.message,
        });

        return;
    }
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
            description: res.message,
            action:
            <ToastAction altText='Go To Cart' onClick={() => router.push('/cart') }
                         className='bg-primary text-white hover: bg-gray-800'
            >
                Go To Cart
            </ToastAction>
        })
    };

    // Check if item is in the cart
    const exist = cart && cart.items
        .find((x) => x.productId === item.productId);

    return exist ? (
        <div>
          <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
            <Minus className='h-4, w-4'/>
          </Button>
          <span className='px-2'>{exist.qty}</span>
          <Button type='button' variant='outline' onClick={handleAddToCart}>
            <Plus className='w-4 h-4' />
          </Button>
        </div>
      ) : (
        <Button className='w-full' type='button' onClick={handleAddToCart}>
          <Plus className='w-4 h-4'/> Add to cart
        </Button>
    )
}

export default AddToCart