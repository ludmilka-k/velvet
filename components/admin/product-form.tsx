'use client';

import {Product} from '@/types';
import {useRouter} from 'next/navigation';
import {useToast} from '@/hooks/use-toast';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {insertProductSchema, updateProductSchema} from '@/lib/validators';
import {productDefaultValues} from '@/lib/constants';
import {Form} from '@/components/ui/form';

const ProductForm = ({type, product, productId}: {
    type: 'Create' | 'Update',
    product?: Product,
    productId?: string,
}) => {
    const router = useRouter();
    const {toast} = useToast();

    const form = useForm<z.infer<typeof insertProductSchema>>({
      resolver:
        type === 'Update'
          ? zodResolver(updateProductSchema)
          : zodResolver(insertProductSchema),
      defaultValues:
        product && type === 'Update' ? product : productDefaultValues,
    });

    return (
      <Form {...form}>
        <form className='space-y-8'>
          <div className='flex flex-col md:flex-row gap-5'>
            {/*Name*/}
            {/*Slug*/}
          </div>
          <div className='flex flex-col gap-5 md:flex-row'>
            {/* Category */}
            {/* Brand */}
          </div>
          <div className='flex flex-col gap-5 md:flex-row'>
            {/* Price */}
            {/* Stock  */}
          </div>
          <div className='upload-field flex flex-col gap-5 md:flex-row'>
            {/* Images */}
          </div>
          <div className='upload-field'>{/* Is Featured */}</div>
          <div>{/* Description */}</div>
          <div>{/* Submit */}</div>
        </form>
      </Form>
    )
};

export default ProductForm;