# Lumina

Multi-category e-commerce storefront with an integrated CRM portal. Built with Next.js 15 (App Router), React 19, TypeScript, PostgreSQL, and Prisma.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?logo=postgresql&logoColor=white)

## Overview

Lumina is a full-stack storefront and admin portal. The customer-facing side handles product browsing, search, filtering, and cart. The backend side handles authentication with two-factor support, audit logging, input validation, and rate limiting.

## Features

**Storefront**
- Multi-category catalog with category banners
- Live product search
- Multi-attribute filtering sidebar
- Slide-out cart drawer
- Product detail pages

**Authentication and Security**
- JWT sessions via `jose`
- TOTP-based two-factor authentication (`speakeasy`, QR code enrollment)
- Password hashing with `bcryptjs`
- Rate-limited API routes
- URL sanitization
- Request validation with Zod

**Operations**
- System audit logging
- Telemetry service integration

**UI**
- Light / dark theme
- i18n via a translation context
- Responsive layout

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript 5.8 |
| Styling | Tailwind CSS, PostCSS |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | jose, bcryptjs, speakeasy, qrcode |
| Validation | Zod |
| Icons | lucide-react |

## Prerequisites

- Node.js 18.18 or later
- npm or yarn
- A PostgreSQL instance (local or hosted)

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/AghaEssa/LUMINA_Multi-Ecomerce_CRM_portal.git
cd LUMINA_Multi-Ecomerce_CRM_portal
npm install
```

### 2. Configure environment

Create `.env.local` in the project root:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?sslmode=require"
JWT_SECRET="<long-random-string>"
```

Prisma CLI reads `.env` by default. If it cannot find `DATABASE_URL`, mirror the value in a `.env` file.

Generate a secure secret with:

```bash
openssl rand -base64 32
```

### 3. Set up the database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run the development server

```bash
npm run dev
```

The app is served at http://localhost:3000.

## Production

```bash
npm run build
npm run start
```

## Environment Variables

| Variable | Required | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma |
| `JWT_SECRET` | Yes | Secret used to sign and verify session tokens |

## Author

Agha Essa Khan
