import {Metadata} from 'next';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import {APP_NAME} from '@/lib/constants';
import CredentialsSignInForm from './credentials-signin-form';
import {auth} from '@/auth';
import {redirect} from "next/navigation";

export const metadata: Metadata = {
    title: 'SignIn',
};

const signInPage = async (props: {
    searchParams: Promise<{callbackURL: string}>
}) => {
    const {callbackURL} = await props.searchParams;

    const session = await auth();

    if (session) {
      return redirect(callbackURL || '/');
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
            <CardTitle className='flex-center'>Sign In</CardTitle>
            <CardDescription className='flex-center'>
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
           <CredentialsSignInForm />
          </CardContent>
        </Card>
      </div>
    )
};

export default signInPage;