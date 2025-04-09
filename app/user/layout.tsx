import React from 'react';
import {APP_NAME} from '@/lib/constants';
import Link from 'next/link';
import Image from 'next/image';
import Menu from '@/components/shared/header/menu';
import MainNav from '@/app/user/main-nav';

export default  function UserLayout({children}: {children: React.ReactNode}) {
  return (
    <div className='flex flex-col'>
      <div className='border-b container mx-auto'>
        <div className='flex h-16 items-center px-4'>
          <Link href='/' className='w-22'>
            <Image src='/images/logo.svg' alt={`${APP_NAME}Logo`} width={48} height={48} />
          </Link>
          <MainNav className='mx-6'/>
          <div className='ml-auto flex items-center space-x-4'>
            <Menu />
          </div>
        </div>
      </div>

      <div className='flex-1 space-y-4 p-8 pt-6 container mx-auto'>{children}</div>
    </div>
  )
}