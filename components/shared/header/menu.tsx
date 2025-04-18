import ModeToggle from '@/components/shared/header/mode-toggle';
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {ShoppingCart, EllipsisVertical} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import UserButton from './user-button';

const Menu = () => {
    return (
        <div className='flex justify-center gap-3'>
          <nav className='hidden md:flex w-full max-w-xs gap-1'>
            <ModeToggle />
            <Button asChild variant='ghost'>
              <Link href='/cart'>
                <ShoppingCart /> Cart
              </Link>
            </Button>
            <UserButton />
          </nav>
          <nav className='md:hidden'>
            <Sheet>
              <SheetTrigger>
                <EllipsisVertical />
              </SheetTrigger>
              <SheetContent className='flex flex-col items-start'>
                <SheetTitle>Menu</SheetTitle>
                <ModeToggle />
                <Button asChild variant='ghost'>
                  <Link href='/cart'>
                    <ShoppingCart /> Cart
                  </Link>
                </Button>
                <UserButton />
                <SheetDescription></SheetDescription>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
    )
};

export default Menu;