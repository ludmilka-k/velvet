'use client';

import { Button } from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import {Plus, Minus, Loader} from 'lucide-react';
import {Cart, CartItem} from '@/types';
import {useToast} from '@/hooks/use-toast';
import {ToastAction} from '@/components/ui/toast';
import {addItemToCart, removeItemFromCart} from '@/lib/actions/cart.actions';
import {useTransition} from 'react';

  function DeleteButton({ item }: { item: CartItem }) {
    const {toast} = useToast();
    const [isPending, startTransition] = useTransition();

    // Remove item from cart
    const handleRemoveFromCart = async () => {
      startTransition(async () => {
        const res = await removeItemFromCart(item.productId);

        toast({
          variant: res.success ? 'default' : 'destructive',
          description: res.message,
        });

        return;
      })
    }

    return (
    <Button
      disabled={isPending}
      variant='outline'
      type='button'
      onClick={handleRemoveFromCart}
    >
      {isPending ? (
        <Loader className='w-4 h-4 animate-spin' />
      ) : (
        <Minus className='w-4 h-4' />
      )}
    </Button>
    )
  }


function AddButton({ item }: { item: CartItem }) {
  const {toast} = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  // Add item to cart
  const handleAddToCart = async () => {
    startTransition(async () => {
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
    })
  };

  return (
      <Button type='button' variant='outline' onClick={handleAddToCart}>
        {isPending ? (
            <Loader className='w-4 h-4  animate-spin' />
        ) : (
            <Plus className='w-4 h-4'/>
        )}
      </Button>
  )
}

function AddToCartButton({ item }: { item: CartItem }) {
  const {toast} = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Add item to cart
  const handleAddToCartFirst = async () => {
    startTransition(async () => {
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
    })
  };

    return (
        <Button className='w-full' type='button' onClick={handleAddToCartFirst}>
          {isPending ? (
              <Loader className='w-4 h-4  animate-spin' />
          ) : (
              <Plus className='w-4 h-4'/>
          )}
          {' '}
          Add To Cart
        </Button>

    )
}

const AddToCart = ({cart, item}:{cart?: Cart, item: CartItem}) => {

    // Check if item is in the cart
    const exist = cart && cart.items
      .find((x) => x.productId === item.productId);

    return exist ? (
      <div>
        <DeleteButton item={item} />`
        <span className='px-2'>{exist.qty}</span>
        <AddButton item={item} />
      </div>
      ) : (
         <AddToCartButton item={item} />
    )
}


export default AddToCart;
