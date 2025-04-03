import {generateAccessToken, paypal} from '../lib/paypal';

// Test to generate access token from PayPal
test('generates token from paypal', async () => {
    const tokenResponse = await generateAccessToken();
    console.log(tokenResponse);
    expect(typeof tokenResponse).toBe('string');
    expect(tokenResponse.length).toBeGreaterThan(0);
});

// Test to create a PayPal order
test('creates a paypal order', async () => {
    const price = 10.0; // Example price for testing

    const orderResponse = await paypal.createOrder(price)
    console.log(orderResponse);

    expect(orderResponse).toHaveProperty('id');
    expect(orderResponse).toHaveProperty('status');
    expect(orderResponse.status).toBe('CREATED');
});

// Test to capture payment with a mock order
test('simulates capturing a payment from an order', async () => {
    const orderId = '100'; // Mock order ID

    const mockCapturePayment = jest
      .spyOn(paypal, 'capturePayment')
      .mockResolvedValue({
        status: 'COMPLETED',
      });

    const captureResponse = await paypal.capturePayment(orderId);

    expect(captureResponse).toHaveProperty('status', 'COMPLETED');

    mockCapturePayment.mockRestore();
})