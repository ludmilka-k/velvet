import {Metadata} from 'next';
import Image from 'next/image';
import {APP_NAME} from '@/lib/constants';
import {Button} from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Unauthorized Access',
};

const UnauthorizedPage = ()  => {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen '>
        <Image
          src='/images/logo.svg'
          alt={`${APP_NAME}Logo`}
          width={48}
          height={48}
          priority={true}
        />
        <div className='p-6 rounded-lg shadow-md md:w-1/3 text-center'>
          <h1 className='text-3xl font-bold mb-4'>Unauthorized Access</h1>
          <p className='text-destructive'>You do not have permission to access this page</p>
          <Button variant='outline' className='mt-4 ml-2' asChild>
            <Link href='/'>Back To Home</Link>
          </Button>
        </div>
      </div>
    )
};

export default UnauthorizedPage;