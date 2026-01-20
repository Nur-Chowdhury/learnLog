# LearnLog – Subscription-Based Learning Portal API

LearnLog is a robust RESTful API for a **subscription-based e-learning platform**.
It supports secure authentication, gated free/premium content access, and recurring subscription billing using **Stripe**.

---

## 🚀 Live Demo & Documentation

- **Live API Base URL:** `https://learnlog-k8yz.onrender.com`
- **Swagger Documentation:** `https://learnlog-k8yz.onrender.com/api-docs`

---

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) with HTTP-Only Cookies
- **Payments:** Stripe API (Checkout Sessions & Webhooks)
- **Documentation:** Swagger UI (OpenAPI 3.0)

---

## ✨ Key Features

### 🔐 Authentication & Security

- JWT-based authentication with HTTP-Only cookies
- Role-Based Access Control (RBAC)
  - `learner`
  - `admin`

---

### 💳 Subscription Management (Stripe Integration)

- Monthly and Yearly subscription plans
- Stripe-hosted secure checkout (PCI-compliant)
- Webhook-driven subscription lifecycle handling

**Handled Stripe Events**

- `checkout.session.completed`
  - Activates user subscription
  - Creates subscription record

**Security**

- Stripe webhook signature verification to prevent spoofing

---

### 📚 Content Engine

- Access-controlled content delivery
  - **Free users:** Free content only
  - **Premium users:** Full access

- Optimized slug-based search
- Ratings system restricted to premium users for premium content

---

## ⚙️ Local Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Nur-Chowdhury/learnLog.git
cd learnlog
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Configuration

Create a `.env` file in the root directory and configure:

```env
PORT=YUOR_BACKEND_PORT
MONGODB_URL=YOUR_MONGO_URL
CLIENT_URL=YOUR_CLIENT_URL

# Authentication
JWT_SECRET=YOUR_JWT_SECRET_KEY

# Stripe Configuration
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET
```

---

### 4️⃣ Run the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

---

## 💳 Payment Flow Explanation

This project uses a **server-controlled Stripe Checkout flow** for maximum security.

### 1️⃣ Subscription Initiation

- Authenticated user sends request to:

  ```
  POST /api/subscriptions/subscribe
  ```

- Server:
  - Creates Stripe Customer if needed
  - Generates Checkout Session (`mode: subscription`)
  - Returns Stripe checkout URL

---

### 2️⃣ Payment

- User completes payment on Stripe-hosted page
- Stripe redirects to:

  ```
  CLIENT_URL/payment-success
  ```

---

### 3️⃣ Fulfillment (Webhook)

- Stripe sends webhook to:

  ```
  POST /api/webhooks/stripe
  ```

- Server verifies `Stripe-Signature`

**Event Handling**

- `checkout.session.completed`
  - Activates subscription
  - Sets `expiresAt`

---

## 📂 Project Structure

```bash
learnlog/
├── backend/configs/            # Database, Swagger, Stripe configs
├── backend/controllers/        # Auth, Content, Subscription logic
├── backend/middlewares/        # Auth guards & error handling
├── backend/models/             # Mongoose schemas
├── backend/routes/             # API routes
├── backend/utils/              # Email & helper utilities
├── backend/index.js            # App entry point
├── .env
└── package.json
```

---

## 📝 API Endpoints Overview

| Method | Endpoint                     | Description              | Access          |
| ------ | ---------------------------- | ------------------------ | --------------- |
| POST   | /api/auth/register           | Register new user        | Public          |
| POST   | /api/auth/login              | Login user               | Public          |
| POST   | /api/auth/logout             | Logout user              | User            |
| GET    | /api/user/me                 | Get xurrent user info    | User            |
| GET    | /api/contents                | Get content list         | User (Gated)    |
| GET    | /api/contents/:id            | Get specific content     | User (Gated)    |
| GET    | /api/contents/search         | Search content           | User (Gated)    |
| POST   | /api/contents                | Create content           | Admin           |
| PUT    | /api/contents/:id            | Update content           | Admin           |
| DELETE | /api/contents/:id            | Delete content           | Admin           |
| POST   | /api/subscriptions/subscribe | Start subscription       | User            |
| GET    | /api/subscriptions/me        | View subscription status | User            |
| DELETE | /api/subscriptions/cancel    | Cancel subscription      | User            |
| POST   | /api/webhooks/stripe         | Stripe webhook listener  | Stripe          |
| POST   | /api/rating/:contentID       | Rate a content           | User (Gated)    |
| GET    | /api/rating/:contentID       | Get ratings of a content | User            |


---

## 📌 Notes

- Swagger UI provides full API documentation
- Designed following REST best practices and secure payment handling
