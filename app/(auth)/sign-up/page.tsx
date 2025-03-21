import {Metadata} from 'next';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import {APP_NAME} from '@/lib/constants';
import SignUpForm from './sign-up-form';
import {auth} from '@/auth';
import {redirect} from 'next/navigation';

export const metadata: Metadata = {
    title: 'Sign Up',
};

const SignUpPage = async (props: {
    searchParams: Promise<{callbackUrl: string}>
}) => {
    const {callbackUrl} = await props.searchParams;

    const session = await auth();

    if (session) {
        return redirect(callbackUrl || '/');
    }

    return (
      <div className='w-full max-w-md mx-auto'>
        <Card>
          <CardHeader className='space-y-4'>
            <Link href='/' className='flex-center'>
              <Image
                src='/images/logo.svg'
                alt={`${APP_NAME} Logo`}
                width={100}
                height={100}
                priority={true}
                />
            </Link>
              <CardTitle className='flex-center'>Create Account</CardTitle>
              <CardDescription className='flex-center'>
                Enter your information below to sign up
              </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <SignUpForm />
          </CardContent>
        </Card>
      </div>
    )
};

export default SignUpPage;