import {Product} from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import {Card, CardContent, CardHeader,} from '@/components/ui/card';
import ProductPrice from './product-price';

const ProductCard = ({product}: {product: Product}) => {
    return (
        <Card className='w-full max-w-sm'>
          <CardHeader className='p-0 item-center'>
            <Link href={`/product/${product.slug}`}>
              <Image src={product.images[0]} alt={product.name} height={300} width={300} priority={true} />
            </Link>
          </CardHeader>
          <CardContent>
            <div className='text-xs'>{product.brand}</div>
            <Link href={`/product/${product.slug}`}>
              <h2 className='text-sm'>{product.name}</h2>
            </Link>
            <div className='flex-between gap-4'>
              <p>{product.rating} Stars</p>
              {product.stock > 0 ? (
                <ProductPrice value={Number(product.price)} />
              ) : (
                <p className='text-destructive'>Out Of Stock</p>
              ) }
            </div>
          </CardContent>
        </Card>
    )
};

export default ProductCard;