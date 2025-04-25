'use client';
import {usePathname, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {Input} from "@/components/ui/input";

const AdminSearch = () => {
    const pathname = usePathname();
    const formActionUrl = pathname.includes('/admin/orders')
      ? '/admin/orders'
      : pathname.includes('/admin/products')
        ? '/admin/products'
        : '/admin/users';

    const searchParams = useSearchParams();
    const  [queryValue, setQueryValue] = useState(searchParams.get('query') || '');

    useEffect(() => {
      setQueryValue(searchParams.get('query') || '');
    }, [searchParams]);

    return (
      <form method='GET' action={formActionUrl}>
        <Input
          type='search'
          name='query'
          value={queryValue}
          placeholder='Search...'
          onChange={(e) => setQueryValue(e.target.value)}
          className='md:w-[100px] lg:w-[300px]'
        />
        <button className='sr-only' type='submit'>
          Search
        </button>
      </form>
    )
};

export default AdminSearch;