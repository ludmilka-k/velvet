# Velvet

> A modern E-commerce platform built with Next.js, TypeScript, Postgres, Prisma & ShadCN.

> Your go-to fashion marketplace for timeless elegance and modern trends.
> Fashion at your fingertips.

<code><img src="/public/images/screen.jpeg" alt="Next.js Ecommerce" /></code>

## Table of Contents

<!--toc:start-->

- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Technologies Steak](#technologies-steak)
- [Getting Started](#getting-started)
  - [Install Dependencies](#install-dependencies)
  - [Environment Variables](#environment-variables)
  - [Run](#run)
- [Prisma Studio](#prisma-studio)
- [Seed Database](#seed-database)
- [Demo](#demo)
<!--toc:end-->

## Features

- [x] **Next Auth authentication**
- [x] **Route protection** with Next.js Middleware
- [x] Fetch live data from Neon database using **Prisma**
- [x] **Admin area** with dashboard of stats and chart bar
- [x] **Admin management:** products, orders, and users
- [x] **CRUD** operations via React Server Actions
- [x] **User area** with profile and orders history
- [x] **Stripe Payment** integration
- [x] **PayPal Payment** integration
- [x] **Cash on delivery** option
- [x] **Featured products carousel**
- [x] **Multiple images** using Uploadthing
- [x] **Search form** (customer & admin)
- [x] **Sorting, filtering & pagination**
- [x] **Ratings & reviews system**
- [x] **Theme Mode:** dark, light, system
- [x] **Deal Countdown**
- [x] Adding **Metadata**
- [x] **Responsive Design (Tailwind)**
- [x] **User-Friendly**: Custom 404 page, Loading spinners, Toast notifications

## Technologies Steak

### # Next.js 15 & React 19
A powerful full-stack React framework with the latest React features like Server Components and Actions.
### # PostgreSQL Database
Postgres through Vercel - a cloud relation database that's managed by Neon.
### # Prisma ORM
Prisma - Object Relation Mapping, providing auto-generated queries and easy schema management.
### # TypeScript, ES Lint & Zod
For type-safe programming. TypeScript ensures type safety, ESLint enforces code quality,
and Zod provides runtime schema validation for maintainable code.
### # ShadCN UI
For the UI, a unique library that allows you to pick and choose which components you want to use.
### # Next Auth
For authentication, in this project setup email and password authentication with Bcrypt encryption.
### # React Hook Form
To handle form state, validation and submission and works great with Zod.
### # Jest Testing
A unit tests to do things like generate tokens and verify payments.
### # Other smaller libraries
 * Stripe - Used to integrate Stripe payments
 * PayPal React SDK - Used to integrate PayPal payments
 * Uploadthing - Used to upload files as product image
 * React Email & Resend - Used to create email templates and send emails
 * Lucide React - Icon library
 * Next Themes - Used to manage themes such as light, dark and system
 * Recharts - Used to create charts. We'll use this in our admin dashboard
 * Slugify - Used to create slugs for products
 * Zod - Used to validate data
 * Embla Carousel - To display featured products in a carousel

## Getting Started

### Install Dependencies

```bash
npm install
# or
pnpm install
```

### Environment Variables

Rename the `.example-env` file to `.env` and add the following

```
DATABASE_URL=
NEXTAUTH_SECRET=
PAYPAL_CLIENT_ID=
PAYPAL_APP_SECRET=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
UPLOADTHING_TOKEN=
UPLOADTHIUG_SECRET=
UPLOADTHING_APPID=
RESEND_API_KEY=
```

### Run

```bash
# Run in development mode
npm run dev
# or
pnpm dev

# Run in production mode
npm build
# or
pnpm build
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Prisma Studio
To open Prisma Studio, run the following command:

```bash
npx prisma studio
```

## Seed Database
To seed the database with sample data, run the following command:

```bash
npx tsx ./db/seed
```

## Demo

[https://velvet.vercel.app](https://velvet.vercel.app)