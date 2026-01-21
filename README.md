# Online Subscription System (Express + MongoDB + Stripe)

A backend implementation for managing user subscriptions using **Node.js (Express)**, **MongoDB**, and **Stripe**.  
Supports subscription creation/cancellation, failed payment retries, and syncing subscription status via Stripe webhooks.

---

## 🚀 Features

- User registration with subscription
- Multiple plans (monthly, yearly, etc.)
- Stripe checkout integration
- Webhooks to sync subscription status
- Customer portal for updating billing info
- Handles failed payments with retry support

---

## 🛠️ Tech Stack

- **Backend:** Node.js (Express)
- **Database:** MongoDB (Mongoose)
- **Payments:** Stripe
- **Auth:** JWT

---

## 📂 Project Structure

```
project-root/
│── config/
│   └── env.js
│   └── stripe.js
│── controllers/
│   └── auth.controller.js
│   └── subscription.controller.js
│   └── subscriptionPlan.controller.js
│   └── userController.controller.js
│── database/
│   └── mongodb.js
│── middlewares/
│   └── auth.middleware.js
│   └── error.middleware.js
│── models/
│   └── subscription.model.js
│   └── SubscriptionPlan.model.js
│   └── user.model.js
│── routes/
│   └── auth.routes.js
│   └── subscription.routes.js
│   └── subscriptionPlan.routes.js
│   └── user.routes.js
│── app.js
.
.
.
```

---

## ⚙️ Environment Variables

Create a `.env.development.local` file:

```env
PORT=
NODE_ENV=
DOMAIN=

DB_URI=

JWT_SECRET=
JWT_EXPIRES_IN=

STRIPE_SECRET=
STRIPE_WEBHOOK_SECRET=
```

---

## 📦 Installation & Setup

1. Clone repo & install dependencies

   ```bash
   git clone https://github.com/erennbs/online-subscription-system.git
   cd online-subscription-system
   npm install
   ```

2. Start MongoDB (locally or Atlas)

3. Run server
   ```bash
   npm run dev
   ```

---

## 🔄 Subscription Status Flow

1. User purchases subscription via Stripe Checkout.
2. Stripe sends `customer.subscription.created` → backend saves subscription.
3. On renewal:
   - If **success** → `invoice.payment_succeeded` → subscription stays `active`.
   - If **failure** → `invoice.payment_failed` → subscription set to `past_due`.
     - User updates card via Customer Portal.
     - Stripe retries → if success → subscription `active`.
     - If failure persists → subscription `canceled`.
---

## 🧪 Testing Webhooks Locally

Install Stripe CLI:

```bash
npm install -g stripe
```

Forward events:

```bash
stripe listen --forward-to [your-webhook-uri]
```
