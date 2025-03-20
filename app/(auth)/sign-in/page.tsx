import {Metadata} from "next";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {APP_NAME} from "@/lib/constants";

export const metadata: Metadata = {
    title: 'SignIn',
};

const signInPage = () => {
    return (
      <div className='w-full max-w-md mx-auto'>
        <Card>
          <CardHeader>
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
           {/*Sign In Form*/}
          </CardContent>
        </Card>
      </div>
    )
};

export default signInPage;