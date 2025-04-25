import {getAllCategories} from '@/lib/actions/product.actions';
import {Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger} from '@/components/ui/drawer';
import {Button} from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

const CategoryDrawer = async () => {
    const categories = await getAllCategories();

    return (
      <Drawer direction='left'>
        <DrawerTrigger asChild>
          <Button variant='outline'>
            <MenuIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent className='h-full max-w-sm'>
          <DrawerHeader>
            <DrawerTitle>Select a category</DrawerTitle>
            <div className='space-y-1 mt-4'>
              {categories.map((x) => (
                <Button
                  variant='ghost'
                  key={x.category}
                  className='w-full justify-start'
                  asChild
                >
                  <DrawerClose asChild>
                    <Link href={`/search?category=${x.category}`}>
                      {x.category} ({x._count})
                    </Link>
                  </DrawerClose>
                </Button>
              ))}
            </div>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    )
};

export default CategoryDrawer;