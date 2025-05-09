import {Metadata} from 'next';
import {getOrderById} from '@/lib/actions/order.actions';
import {notFound, redirect} from 'next/navigation';
import OrderDetailsTable from './order-details-table';
import {ShippingAddress} from '@/types';
import {auth} from '@/auth';
import Stripe from 'stripe';

export const metadata:Metadata = {
    title: 'Order Details',
};

const OrderDetailsPage = async (props:{
    params: Promise<{id: string}>;
}) => {

    const {id}= await props.params;

    const order = await getOrderById(id);
    if (!order) notFound();

    const session = await auth();

    // Redirect the user if they don't own the order
    if (order.userId !== session?.user?.id && session?.user.role !== 'admin') {
      redirect('/unauthorized');
    }

    let client_secret = null;

    // Check if not paid and using stripe
    if (order.paymentMethod === 'Stripe' && !order.isPaid) {
      // Init stripe instance
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
      // Create a new payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(order.totalPrice) * 100),
        currency: 'USD',
        metadata: {orderId: order.id},
      });
      client_secret = paymentIntent.client_secret;
    }

    return (
      <OrderDetailsTable
        order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
        }}
        stripeClientSecret={client_secret}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
        isAdmin={session?.user.role === 'admin' || false}
      />
    )
};

export default OrderDetailsPage;