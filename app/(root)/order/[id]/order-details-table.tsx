'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {Order} from '@/types';
import {formatCurrency, formatDateTime, formatId} from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import {
    PayPalButtons,
    PayPalScriptProvider,
    usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import {approvePayPalOrder, createPayPalOrder} from '@/lib/actions/order.actions';
import {useToast} from "@/hooks/use-toast";

const OrderDetailsTable = ({order, paypalClientId}: {order: Order, paypalClientId: string}) => {
      const {
        shippingAddress,
        orderItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        paymentMethod,
        isPaid,
        paidAt,
        isDelivered,
        deliveredAt,
      } = order;

      const {toast} = useToast();

      const PrintLoadingState = () => {
        const [{isPending, isRejected}] = usePayPalScriptReducer();
        let status = '';

        if (isPending) {
          status = 'Loading PayPal ...'
        } else if (isRejected) {
          status = 'Error Loading PayPal ...'
        }
        return status;
      };

      const handleCreatePayPalOrder = async () => {
        const res = await createPayPalOrder(order.id);

        if (!res.success) {
          toast ({
            variant: 'destructive',
            description: res.message,
          });
        }
        return res.data;
      }

      const handleApprovePayPalOrder = async (data: {orderID: string}) => {
        const res = await approvePayPalOrder(order.id, data);

        toast({
            variant:res.success ? 'default' : 'destructive',
            description: res.message,
        })
      }

    return (
      <>
        <h1 className='py-4 text-2xl'>Order {formatId(order.id)}</h1>
        <div className='grid md:grid-cols-3 md:gap-5'>
          <div className='col-span-2 space-4-y overlow-x-auto'>
            <Card>
              <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Payment Method</h2>
              <p className='mb-2'>{paymentMethod}</p>
              {isPaid ? (
                <Badge variant='secondary'> Paid at {formatDateTime(paidAt!).dateTime}</Badge>
              ) : (
                <Badge variant='destructive'>Not paid</Badge>
              )}
              </CardContent>
            </Card>

            <Card className='my-2'>
              <CardContent className='p-4 gap-4'>
                  <h2 className='text-xl pb-4'>Shipping Address</h2>
                  <p>{shippingAddress.fullName}</p>
                  <p className='mb-2'>
                    {shippingAddress.streetAddress}, {shippingAddress.city},{' '}
                    {shippingAddress.postalCode}, {shippingAddress.country}{' '}
                  </p>
                  {isDelivered ? (
                      <Badge variant='secondary'> Delivered at {formatDateTime(deliveredAt!).dateTime}</Badge>
                  ) : (
                      <Badge variant='destructive'>Not delivered</Badge>
                  )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4 gap-4'>
                <h2 className='text-xl pb-4'>Order Items</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item.slug}>
                          <TableCell>
                            <Link
                              href={`/product/${item.slug}`}
                              className='flex items-center'
                            >
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={50}
                                height={50}
                              />
                              <span className='px-2'>{item.name}</span>
                              </Link>
                          </TableCell>
                          <TableCell>
                            <span className='px-2'>{item.qty}</span>
                          </TableCell>
                          <TableCell >
                            <span className='px-2'>${item.price}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </CardContent>
            </Card>
          </div>

            <div>
              <Card>
                <CardContent className='p-4 gap-4 space-y-4'>
                  <div className='flex justify-between'>
                    <h2 className='text-normal'>Items</h2>
                    <div>{formatCurrency(itemsPrice)}</div>
                  </div>
                  <div className='flex justify-between'>
                    <h2 className='text-normal'>Tax</h2>
                    <div>{formatCurrency(taxPrice)}</div>
                  </div>
                  <div className='flex justify-between'>
                    <h2 className='text-normal'>Shipping</h2>
                    <div>{formatCurrency(shippingPrice)}</div>
                  </div>
                  <div className='flex justify-between'>
                    <h2 className='text-normal'>Total</h2>
                    <div>{formatCurrency(totalPrice)}</div>
                  </div>
                    {/* PayPal Payment */}
                  {!isPaid && paymentMethod === 'PayPal' && (
                    <div>
                      <PayPalScriptProvider options={{clientId: paypalClientId}}>
                        <PrintLoadingState />
                        <PayPalButtons
                          createOrder={handleCreatePayPalOrder}
                          onApprove={handleApprovePayPalOrder}
                        />
                      </PayPalScriptProvider>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
        </div>
      </>
    )
};

export default OrderDetailsTable;