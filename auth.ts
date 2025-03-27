/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth';
import { PrismaAdapter} from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import {compareSync} from 'bcrypt-ts-edge';
import type {NextAuthConfig} from 'next-auth';
import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [CredentialsProvider({
    credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
    },
    async authorize(credentials) {
      if (credentials == null) return null;

      // Find user in database
      const user = await prisma.user.findFirst({
        where: {
          email: credentials.email as string,
        },
      });

      // Check if user exists and password is correct
      if (user && user.password) {
        const isMatch = compareSync(credentials.password as string, user.password);

        // If password is correct, return user
        if (isMatch) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
      }
      // If user doesn't exist or password is incorrect, return null
      return null;
    },
  })],
  callbacks: {
    async session ({ session, user, trigger, token }: any) {
      // Set the user id on the session
      session.user.id = token.sub;
      session.user.role =token.role;
      session.user.name = token.name;

      // If there is an update, set the name on the session
      if (trigger === 'update') {
        session.user.name = user.name;
      }

      return session;
    },
    async jwt({token, user, trigger, session}: any) {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        // If user has no name then use the email
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];

          // Update database to reflect the token name
          await prisma.user.update({
            where: {id: user.id},
            data: {name: token.name},
          });
        }

        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get('sessionCartId')?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: {sessionCartId},
            });

            if (sessionCart) {
              //Delete current user cart
              await prisma.cart.deleteMany({
                where: {userId: user.id}
              });

              // Assign new cart
              await prisma.cart.update({
                where: {id: sessionCart.id},
                data: {userId: user.id}
              });
            }
          }
        }
      }

      // Handle session updates
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name;
      }

      return token;
    },
    authorized({request}: any) {
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
      } else {
        return true;
      }
    },
  }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);