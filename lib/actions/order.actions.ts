'use server';

import {isRedirectError} from 'next/dist/client/components/redirect-error';
import {convertToPlainObject, formatError} from '@/lib/utils';
import {auth} from '@/auth';
import {getUserById} from '@/lib/actions/user.actions';
import {getMyCart} from '@/lib/actions/cart.actions';
import {insertOrderSchema} from '@/lib/validators';
import {prisma} from '@/db/prisma';
import {CartItem, PaymentResult} from '@/types';
import {paypal} from '@/lib/paypal';
import {revalidatePath} from 'next/cache';
import {PAGE_SIZE} from '@/lib/constants';
import {Prisma} from '@prisma/client';

// Create order and the order items
export async function createOrder() {
    try {
      const session = await auth();
      if (!session) throw new Error('User is not authenticated');

      const userId = session?.user?.id;
      if (!userId) throw new Error('user not found');

      const user = await getUserById(userId);

      const cart = await getMyCart();
      if (!cart || cart.items.length === 0) {
        return {success: false, message:'Your cart is empty', redirectTo: '/cart'}
      }

      if (!user.address) {
        return {success: false, message:'No shipping address', redirectTo: '/shipping-address'}
      }

      if (!user.paymentMethod) {
        return {success: false, message:'No payment address', redirectTo: '/payment-method'}
      }

      // Create order object
      const order = insertOrderSchema.parse({
        userId: user.id,
        shippingAddress: user.address,
        paymentMethod: user.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      });

      // Create a transaction to create order and order items in database
      const insertedOrderId = await prisma.$transaction(async (tx) => {
        // Create order
        const insertedOrder = await tx.order.create({data: order});

        // Create order items from the cart items
        for (const item of cart.items as CartItem[]) {
          await tx.orderItem.create({
            data: {
              ...item,
              price: item.price,
              orderId: insertedOrder.id,
            },
          });
        }
        // Clear cart
        await tx.cart.update({
          where: {id: cart.id},
          data: {
            items: [],
            itemsPrice: 0,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: 0,
          },
        });

        return insertedOrder.id;
      });

      if (!insertedOrderId) throw new Error('Order not created');

      return {
          success: true,
          message: 'Order created',
          redirectTo: `/order/${insertedOrderId}`
      };
    } catch (error) {
      if(isRedirectError(error)) throw error;
      return {
          success: false,
          message: formatError(error),
      }
    }
}

// Get order by ID
export async function getOrderById(orderId: string) {
   const data = await prisma.order.findFirst({
     where: {id: orderId},
     include: {
       orderItems: true,
       user: {select:{name: true, email: true}},
     },
   });
   return convertToPlainObject(data);
}

// Create new PayPal order
export async function createPayPalOrder(orderId: string) {
  try {
    // Get order from the database
    const order = await prisma.order.findFirst({
      where: {id: orderId},
    });

    if (order) {
      // Create PayPal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      // Update order with PayPal order ID
      await prisma.order.update({
        where: {id: order.id},
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: '',
            status: '',
            pricePaid: 0,
          },
        },
      });

      // Return the PayPal order id
      return {
        success: true,
        message: 'PayPal Order created successfully',
        data: paypalOrder.id,
      };
    } else {
      throw new Error('Order not found');
    }

  } catch (error) {
    return {success: false, message:formatError(error)};
  }
}

// Approve PayPal order
export async function approvePayPalOrder(orderId: string, data: { orderID: string }) {
  try {
    // Get the order in the database
    const order = await prisma.order.findFirst({
      where: {id: orderId},
    });

    if (!order) throw new Error('Order not found');

    // Check if the order is already paid
    const captureData = await paypal.capturePayment(data.orderID);

    if (!captureData ||
        captureData.id !== (order.paymentResult as PaymentResult)?.id ||
        captureData.status !== 'COMPLETED') {
      throw new Error('Error in PayPal payment');
    }

    //  Update order to "paid"
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid: captureData.purchase_units[0]?.payments?.captures[0].amount?.value,
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: 'Your order has been paid by PayPal',
    }

  } catch (error) {
    return {success: false, message:formatError(error)};
  }
}

// Update order to "paid" in Database
export async function updateOrderToPaid(
    {orderId, paymentResult}: {orderId: string, paymentResult?: PaymentResult}
) {
  // Get the order in the database and include the order items
  const order = await prisma.order.findFirst({
    where: {id: orderId},
    include: {orderItems: true},
  });

  if (!order) throw new Error('Order not found');

  if (order.isPaid) throw new Error('Order is already paid');

  //Transaction to update order and account for product stock
  await prisma.$transaction(async (tx) => {
    // Iterate over product and update product quantities in the stock
    for (const item of order.orderItems) {
      await tx.product.update({
        where: {id: item.productId},
        data: {stock: {increment: -item.qty}}
      });
    }

    // Set the order to "paid"
    await tx.order.update({
      where: {id: order.id},
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });
  // Get updated order  after transaction
  const updateOrder = await prisma.order.findFirst({
    where: {id: orderId},
    include: {
      orderItems: true,
      user: {select: {name: true, email: true}},
    },
  });

  if (!updateOrder) throw new Error('Order not found');
}

// Get user's orders
export async function getMyOrders({limit = PAGE_SIZE, page}: {limit?: number, page: number}) {
  const session = await auth();
  if (!session) throw new Error('User is not authorized');

  const data = await prisma.order.findMany({
    where: {userId: session?.user?.id},
    orderBy: {createdAt: 'desc'},
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({
    where: {userId: session?.user?.id},
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

type SalesDataType = {
  month: string,
  totalSales: number,
}[];

// Get  sales data and order summary
export async function getOrderSummary() {
  // Get counts for each sales
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  // Calculate the total sales
  const totalSales = await prisma.order.aggregate({
    _sum: {totalPrice: true}
  });

  // Get monthly sales
  const salesDataRaw = await prisma.$queryRaw<Array<{month: string, totalSales: Prisma.Decimal}>>`
    SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales"
    FROM "Order"
    GROUP BY to_char("createdAt", 'MM/YY')
    `;

  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));

  // Get latest sales
  const latestSales = await prisma.order.findMany({
    orderBy: {createdAt: 'desc'},
    include: {
      user: {select: {name: true} },
    },
    take: 6,
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
  }
}