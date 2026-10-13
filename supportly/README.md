# Supportly 💜

### Get supported for what you create.

Supportly is a full-stack creator-support platform where creators can build personalized profiles, receive contributions from supporters, and connect with their community through messages.

Built with **Next.js, MongoDB, NextAuth.js, and Razorpay**, this project explores authentication, database design, API development, and payment integration in a modern web application.

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

## 📸 Application Pages

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
git clone <YOUR_REPOSITORY_URL>
cd supportly
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

Replace the placeholder values with your actual credentials. OAuth credentials are needed only for the providers you configure.

Generate a NextAuth secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Security:** Never commit `.env.local` or expose database credentials, `NEXTAUTH_SECRET`, or `RAZORPAY_KEY_SECRET`. Keep payment secrets on the server.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💳 Payment Flow

Supportly integrates Razorpay for processing contributions.

1. The supporter enters their name, message, and contribution amount.
2. The application requests an order from the server.
3. The server creates an order through Razorpay.
4. Razorpay Checkout handles the payment.
5. The server verifies the payment signature and checks the payment and order details.
6. The verified contribution is saved to MongoDB.
7. Recent verified contributions are retrieved and displayed on the creator's page.

Payment verification is performed server-side rather than trusting the browser callback alone. For production use, webhooks and payment reconciliation should also be implemented to handle interrupted checkout sessions and database failures.

## 📂 Project Structure

```text
supportly/
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
├── lib/
├── models/
│   ├── User.js
│   └── Payment.js
├── public/
├── .gitignore
├── jsconfig.json
├── next.config.js
└── package.json
```

## 🧪 Running Quality Checks

Check the code with ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Start the production server after a successful build:

```bash
npm run start
```

Before deploying, manually test:

- Account registration and login.
- Invalid credentials and logout.
- Profile updates and persistence after refresh.
- Public creator pages.
- Valid and invalid contribution amounts.
- Successful, failed, and cancelled Razorpay test payments.
- Payment verification and recent supporter records.

## 🔐 Security Considerations

- Hash passwords before storing them.
- Keep private credentials in server-side environment variables.
- Validate request data on the server.
- Verify payment signatures and payment status before saving contributions as successful.
- Use HTTPS and production-specific OAuth callback URLs when deployed.
- Configure Razorpay webhooks and reconciliation before relying on the system for production payments.

## 🌐 Deployment

Supportly can be deployed to a hosting platform that supports Next.js, such as Vercel.

Before deployment:

1. Push the project to GitHub.
2. Configure the required environment variables in your hosting platform.
3. Set `NEXTAUTH_URL` to your production URL.
4. Update the GitHub and Google OAuth callback URLs.
5. Configure the production MongoDB connection and Razorpay credentials.
6. Run a production build and test the deployed application.

## 🎯 What I Learned

Through this project, I explored:

- Building a full-stack application with Next.js App Router.
- Implementing authentication and protected user flows.
- Designing MongoDB schemas with Mongoose.
- Creating and validating API routes.
- Integrating a third-party payment gateway.
- Verifying payment details securely on the server.
- Managing environment variables and handling API errors.
- Connecting frontend components with backend services.

## 👩‍💻 Author

**Mansi Sinha**

MCA Student | Aspiring Full-Stack Developer

- GitHub: [@mansi0sinha](https://github.com/mansi0sinha)

---

*Support creators. Celebrate creativity. Built with 💜 using Next.js.*
