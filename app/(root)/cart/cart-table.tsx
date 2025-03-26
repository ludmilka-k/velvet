'use client';

import {useToast} from '@/hooks/use-toast';
import {useTransition} from 'react';
import {addItemToCart, removeItemFromCart} from '@/lib/actions/cart.actions';
import {Loader, Minus, Plus} from 'lucide-react';
import {Cart, CartItem} from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

function RemoveButton({item}: {item: CartItem}) {
    const {toast} = useToast();
    const [isPending, startTransition] = useTransition();

    return (
      <Button
          disabled={isPending}
          variant='outline'
          type='button'
          onClick={() =>
            startTransition(async () => {
            const res = await removeItemFromCart(item.productId);

            if (!res.success) {
              toast({
                  variant: 'destructive',
                  description: res.message,
              });
            }
          })
        }
      >
        {isPending ? (
          <Loader className='w-4 h-4 animate-spin' />
        ) : (
          <Minus className='w-4 h-4' />
        )}
      </Button>
    );
}

function AddButton({item}: {item: CartItem}) {
    const {toast} = useToast();
    const [isPending, startTransition] = useTransition();

    return (
        <Button
            disabled={isPending}
            variant='outline'
            type='button'
            onClick={() =>
              startTransition(async () => {
                const res = await addItemToCart(item);

                if (!res.success) {
                  toast({
                    variant: 'destructive',
                    description: res.message,
                  });
                }
              })
            }
        >
          {isPending ? (
            <Loader className='w-4 h-4 animate-spin' />
          ) : (
            <Plus className='w-4 h-4' />
          )}
        </Button>
    );
}

const CartTable = ({cart}: {cart?: Cart}) => {

    return (
    <>
      <h1 className='py-4 h2-bold'>Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is empty.<Link href='/'>Go Shopping</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className='text-center'>Quantity</TableHead>
                  <TableHead className='text-right'>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                    <Link href={`/product/${item.slug}`} className='flex items-center'>
                      <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                      />
                      <span className='px-2'>{item.name}</span>
                    </Link>
                    </TableCell>
                    <TableCell className='flex-center gap-2'>
                      <RemoveButton item={item}></RemoveButton>
                       <span>{item.qty}</span>
                      <AddButton item={item}></AddButton>
                    </TableCell>
                    <TableCell className='text-right'>${item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
    )
};

export default CartTable;
