# Supportly 💜

### Get supported for what you create.

Supportly is a full-stack creator-support platform where creators can build personalized profiles, receive contributions from supporters, and connect with their community through messages.

Built with **Next.js, MongoDB, NextAuth.js, and Razorpay**, Supportly explores authentication, database design, API development, and payment integration in a modern web application.

## ✨ Features

- **User Authentication** — Sign up and log in using email/password, GitHub, or Google.
- **Creator Profiles** — Personalized public pages with usernames, profile pictures, cover images, and bios.
- **Profile Management** — Update personal information and creator profile settings.
- **Payment Integration** — Accept creator contributions through Razorpay Checkout.
- **Secure Payment Verification** — Verify payment signatures and payment status on the server before recording successful contributions.
- **Supporter Messages** — Allow supporters to attach messages to their contributions.
- **Recent Supporters** — Display recent verified contributions on creator pages.
- **Input Validation** — Validate profile information, payment amounts, and API requests.
- **Dark UI** — Modern dark interface styled with Tailwind CSS.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack framework and App Router |
| React | Component-based user interface |
| Tailwind CSS | Styling and responsive design |
| MongoDB | Database |
| Mongoose | Database modeling |
| NextAuth.js | Authentication and session management |
| bcryptjs | Password hashing |
| Razorpay | Payment processing |
| React Icons | Interface icons |
| ESLint | Code quality checks |

## 📸 Screenshots

### Homepage

![Supportly Homepage](screenshot/Screenshot2.png)

### Creator Profile

![Supportly Creator Profile](screenshot/Screenshot5.png)

### Creator Support & Payment

![Supportly Payment Page](screenshot/Screenshot4.png)

### Login

![Supportly Dashboard](screenshot/Screenshot3.png)

### Find Creator

![Supportly Account Settings](screenshot/Screenshot1.png)

## 📄 Application Pages

- **Home** — Introduction to Supportly and its features.
- **About** — Information about the platform.
- **Creators** — Creator discovery page.
- **Login / Sign Up** — Authentication and account creation.
- **Creator Profile** — Public profile, contribution form, and recent supporters.
- **Dashboard / Settings** — Profile and creator account management.

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB database
- Razorpay account for payment testing
- GitHub and/or Google OAuth credentials for social login

### 1. Clone the repository

```bash
git clone https://github.com/mansi0sinha/Supportly.git
cd Supportly
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

Replace the values with your own credentials.

You only need to configure the OAuth providers you intend to use.

Generate a secure NextAuth secret with Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

> **Security:** Never commit `.env.local` or expose your MongoDB credentials, `NEXTAUTH_SECRET`, or `RAZORPAY_KEY_SECRET`. Keep sensitive payment credentials on the server.

### 4. Run the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## 💳 Payment Flow

Supportly uses Razorpay to process creator contributions.

1. A supporter enters their name, message, and contribution amount.
2. The frontend requests a payment order from the server.
3. The server creates an order through the Razorpay API.
4. Razorpay Checkout handles the payment.
5. The server verifies the Razorpay payment signature.
6. The server checks the payment, order, amount, currency, and payment status.
7. The verified contribution is saved to MongoDB.
8. Recent verified contributions are displayed on the creator's page.

Payment verification is performed server-side instead of trusting the browser callback alone.

For production use, payment webhooks and reconciliation should also be configured to handle cases where a payment succeeds but the browser closes or the verification request fails.

## 📂 Project Structure

```text
Supportly/
├── app/
│   ├── about/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   └── register/
│   │   ├── payments/
│   │   │   ├── order/
│   │   │   ├── recent/
│   │   │   └── verify/
│   │   └── user/
│   │       └── profile/
│   ├── components/
│   ├── creators/
│   ├── dashboard/
│   ├── login/
│   ├── settings/
│   ├── [username]/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── db/
│   └── connectDB.js
├── lib/
│   └── mongodb.js
├── models/
│   ├── User.js
│   └── Payment.js
├── public/
├── screenshots/
│   ├── screenshot1.png
│   ├── screenshot2.png
│   ├── screenshot3.png
│   ├── screenshot4.png
│   └── screenshot5.png
├── .gitignore
├── jsconfig.json
├── next.config.js
├── package.json
└── README.md
```

## 🧪 Running the Project

### Development

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

### Production Build

```bash
npm run build
```

### Production Server

```bash
npm run start
```

Before deployment, manually test:

- Account registration and login
- Invalid credentials
- Logout
- Profile updates
- Profile persistence after refresh
- Public creator pages
- Valid and invalid contribution amounts
- Successful Razorpay test payments
- Failed Razorpay payments
- Cancelled Razorpay payments
- Payment verification
- Recent supporter records

## 🔐 Security

Supportly follows several security practices:

- Passwords are hashed using `bcryptjs`.
- Sensitive credentials are stored in environment variables.
- API requests are validated on the server.
- Razorpay payment signatures are verified on the server.
- Payment amounts and order details are validated before saving.
- Sensitive Razorpay credentials are never sent to the client.
- Authentication is handled through NextAuth.js.
- Production deployments should use HTTPS.
- Production OAuth callback URLs should be configured separately from local development URLs.

## 🌐 Deployment

Supportly can be deployed using a Next.js-compatible hosting platform such as Vercel.

Before deploying:

1. Push the project to GitHub.
2. Configure the production environment variables.
3. Use a production MongoDB connection.
4. Set `NEXTAUTH_URL` to the deployed application URL.
5. Configure GitHub and Google OAuth callback URLs for production.
6. Configure Razorpay credentials.
7. Run the production build.
8. Test authentication, profiles, and payments on the deployed application.

For payment testing, use Razorpay test credentials before switching to production credentials.

## 🎯 What I Learned

Building Supportly helped me gain practical experience with:

- Full-stack development using Next.js App Router
- React component development
- MongoDB database integration
- Mongoose schema and model design
- Authentication using NextAuth.js
- Password hashing with bcryptjs
- REST API development
- Server-side validation
- Payment gateway integration with Razorpay
- Payment signature verification
- Protected user operations
- Environment variable management
- Error handling
- Connecting frontend and backend systems
- Building and structuring a complete full-stack application

## 👩‍💻 Author

### Mansi Sinha

MCA Student | Aspiring Full-Stack Developer

**GitHub:** [@mansi0sinha](https://github.com/mansi0sinha)

**Project:** [Supportly](https://github.com/mansi0sinha/Supportly)

---

### 💜 Support creators. Celebrate creativity.

Built with **Next.js, MongoDB, NextAuth.js, and Razorpay**.