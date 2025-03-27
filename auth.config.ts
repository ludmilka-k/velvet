/* eslint-disable @typescript-eslint/no-explicit-any */
import {NextResponse} from 'next/server';
import type {NextAuthConfig} from 'next-auth';

export const authConfig = {
  providers: [], // Required by NextAuthConfig type
  callbacks: {
      authorized({request, auth}: any) {
          // Array of regex patterns of protected paths
          const protectedPaths = [
              /\/shipping-address/,
              /\/payment-method/,
              /\/place-order/,
              /\/profile/,
              /\/user\/(.*)/,
              /\/order\/(.*)/,
              /\/admin/,
          ];

          // Get pathname from the req URL object
          const {pathname} = request.nextUrl;

          // Check if user is not authenticated and on a protected path
          if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

          // Check for session cart cookie
          if (!request.cookies.get('sessionCartId')) {
              // Generate new session cart id cookie
              const sessionCartId = crypto.randomUUID();

              // Clone request headers
              const newRequestHeaders = new Headers(request.headers);

              // Create a new response and add the new headers
              const response = NextResponse.next({
                  request: {
                      headers: newRequestHeaders,
                  },
              });

              // Set the newly generated sessionCartId in the response cookies
              response.cookies.set('sessionCartId', sessionCartId);

              // Return the response with the sessionCartId set
              return response;
          }
          return true;
      },
  },
} satisfies NextAuthConfig;