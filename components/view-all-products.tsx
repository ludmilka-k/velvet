'use client';

import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/button';

const ViewAllProductsButton = () => {
    const router = useRouter();

    return (
      <div className='flex justify-center items-center my-8'>
        <Button
          onClick={() => router.push('/search')}
          className='py-4 px-8 text-lg font-semibold'
        >
          View All Products
        </Button>
      </div>
    )
};

export default ViewAllProductsButton;