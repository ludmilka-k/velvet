import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {signInDefaultValues} from "@/lib/constants";

const CredentialsSignInForm = () => {
    return (
      <form>
        <div className='space-y-6'>
          <div>
            <Label htmlFor='email'>Email</Label>
            <Input
              type='email'
              id='email'
              name='email'
              required
              autoComplete='email'
              defaultValue={signInDefaultValues.email}
            />
          </div>
          <div>
            <Label htmlFor='password'>Password</Label>
            <Input
              type='password'
              id='password'
              name='password'
              required
              autoComplete='password'
              defaultValue={signInDefaultValues.password}
            />
          </div>
            <div>
              <Button className='w-full' variant='default'>Sign In</Button>
            </div>
            <div className='text-sm text-center text-muted-foreground'>
              Don&apos;t have an account?{' '}
              <Link href='/sign-up' target='_self' className='link'>
                Sign Up
              </Link>
            </div>
        </div>
      </form>
    );
}

export default CredentialsSignInForm;