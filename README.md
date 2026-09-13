<div align="center">

# 🛍️ Lumina Multi-Category E-Commerce & CRM Portal

**A production-ready, high-performance E-Commerce & CRM storefront built with Next.js 15, React 19, MongoDB, and Tailwind CSS.**

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

</div>

---

## 📖 Overview

**Lumina** is an enterprise-grade, multi-category storefront and management portal designed for speed, security, and effortless scalability. It combines a visually rich customer-facing marketplace with robust backend security features including 2FA authentication, audit logging, dynamic product filtering, and multi-language support.

---

## ✨ Key Features

| Category | Key Capabilities |
| :--- | :--- |
| 🛒 **E-Commerce Experience** | Dynamic Multi-Category Banners, Live Product Search, Slide-out Cart Drawer, Multi-attribute Filtering Sidebar, and Detailed Product Views. |
| 🔐 **Enterprise Security** | 2FA (TOTP with QR Code setup via `speakeasy`), JOSE JWT Authentication, Password Hashing (`bcryptjs`), and Rate-limited API routes. |
| 🛡️ **Audit & Monitoring** | System Audit Logging, URL Security Sanitization, Zod Schema Validation, and Telemetry service integration. |
| 🎨 **UI & Customization** | Dark / Light Theme Switching, Multi-Language i18n Translation Context, Responsive Layouts, and Lucide React Icons. |
| ⚡ **Modern Stack** | Next.js 15 App Router, React 19 Server & Client Components, and Mongoose ORM for MongoDB data modeling. |

---

## 🛠️ Tech Stack & Dependencies

```
Core Framework  : Next.js 15.3 (App Router) & React 19
Language        : TypeScript 5.8
Styling         : Tailwind CSS, PostCSS, Autoprefixer
Database        : MongoDB via Mongoose ORM
Authentication  : JOSE (JWT), bcryptjs, Speakeasy (TOTP 2FA), QRCode
Validation      : Zod Schema Validation
Icons & UI      : Lucide React
```

 

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js 18+** installed along with **npm** or **yarn**.

### 1. Installation

```bash
# Clone repository
git clone https://github.com/AghaEssa/LUMINA_Multi-Ecomerce_CRM_portal.git
cd LUMINA_Multi-Ecomerce_CRM_portal

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/lumina_db
JWT_SECRET=your_super_secret_jwt_key_here
```

### 3. Database Seeding (Optional)

Populate categories and starter products into your MongoDB database:

```bash
npm run seed:categories
npm run seed:products
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---
 

<div align="center">
  <sub>Built  by Agha Essa Khan • Powered by Next.js 15 & MongoDB</sub>
</div>