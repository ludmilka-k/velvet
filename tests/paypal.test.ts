import {generateAccessToken} from '../lib/paypal';

// Test to generate access token from PayPal
test('generates token from PayPal', async () => {
    const tokenResponse = await generateAccessToken();
    console.log(tokenResponse);
    expect(typeof tokenResponse).toBe('string');
    expect(tokenResponse.length).toBeGreaterThan(0);
})