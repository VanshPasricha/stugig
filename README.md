# StuGig 🎓💼

> **The freelance platform built exclusively for students.**

StuGig connects university students with real-world freelance opportunities — helping them build professional portfolios while still in college. Clients get access to talented, affordable student talent. Students get experience, income, and a head-start on their careers.

🌐 **Live Demo:** [https://stugig-five.vercel.app](https://stugig-five.vercel.app)

---

## ✨ Features

- 🔐 **Authentication** — Email/password login, Google OAuth, and GitHub OAuth
- 👤 **Role-based Access** — Separate flows for Clients (hiring) and Freelancers (working)
- 📋 **Job Marketplace** — Post gigs, browse listings, and submit proposals
- 💬 **Real-time Messaging** — Instant chat powered by Socket.io
- 💳 **Payments** — Secure Razorpay-integrated payment with escrow
- 🤖 **AI Bid Assistant** — Gemini-powered smart bidding assistant
- 🌙 **Dark Mode** — Beautiful dark/light theme with smooth transitions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Real-time | Socket.io |
| Auth | Passport.js (Google & GitHub OAuth), JWT |
| Payments | Razorpay |
| AI | Google Gemini API |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Git](https://git-scm.com/)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/VanshPasricha/stugig.git
cd stugig
```

### 2. Set Up the Backend

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory by copying the template below and filling in your own keys (see the [API Keys Setup Guide](#-api-keys-setup-guide) section below):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_strong_random_secret_string

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

GEMINI_API_KEY=your_gemini_api_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm start
```

The backend will run at `http://localhost:5000`.

### 3. Set Up the Frontend

In a new terminal:

```bash
cd Frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

## 🔑 API Keys Setup Guide

Below is a step-by-step guide to generating every required API key.

---

### 🍃 MongoDB Atlas — `MONGO_URI`

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account.
2. Click **Build a Database** and select the **Free (M0)** tier.
3. Choose a cloud provider and region, then click **Create**.
4. Under **Security > Database Access**, create a database user with a username and password.
5. Under **Security > Network Access**, click **Add IP Address** → select **Allow Access from Anywhere** (for development).
6. Go to **Deployment > Database** → click **Connect** on your cluster → **Drivers**.
7. Copy the connection string. It will look like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
8. Replace `<username>` and `<password>` with the credentials you created and add your database name before the `?`:
   `mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/stugig?retryWrites=true&w=majority`

---

### 🔏 JWT Secret — `JWT_SECRET`

This can be any long, random string. You can generate a secure one with the following command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET`.

---

### 💳 Razorpay — `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`

1. Go to [dashboard.razorpay.com](https://dashboard.razorpay.com/) and create an account.
2. Complete the basic signup steps. You can use Razorpay in **Test Mode** without needing full KYC verification.
3. In the left sidebar, navigate to **Account & Settings > API Keys**.
4. Click **Generate Test Key** (make sure you are in Test Mode — toggle is in the top-right corner).
5. A modal will show your **Key ID** and **Key Secret**. **Copy them immediately** — the Key Secret is only shown once.
6. Paste them as `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in your `.env`.

---

### 🤖 Google Gemini API — `GEMINI_API_KEY`

1. Go to [aistudio.google.com](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **Get API key** in the top-left area of the page.
4. Click **Create API key**, then select a Google Cloud project (or create a new one).
5. Your API key will be generated. Click the **copy** icon to copy it.
6. Paste it as `GEMINI_API_KEY` in your `.env`.

---

### 🔵 Google OAuth — `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and select or create a project.
2. In the left sidebar, navigate to **APIs & Services > OAuth consent screen**.
   - Select **External** user type and click **Create**.
   - Fill in the App name, User support email, and Developer contact email. Click **Save and Continue** through the remaining steps.
3. Navigate to **APIs & Services > Credentials**.
4. Click **+ Create Credentials** → **OAuth client ID**.
5. Set the **Application type** to **Web application**.
6. Under **Authorized JavaScript origins**, click **+ ADD URI** and add:
   - `http://localhost:5173` (for local development)
7. Under **Authorized redirect URIs**, click **+ ADD URI** and add:
   - `http://localhost:5000/api/auth/google/callback` (for local development)
8. Click **Create**. A popup will show your **Client ID** and **Client Secret**.
9. Copy them and paste as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in your `.env`.

> **For Production:** Also add your Vercel frontend URL (e.g., `https://stugig-five.vercel.app`) to the JavaScript origins and your Render backend callback URL (e.g., `https://stugig-backend.onrender.com/api/auth/google/callback`) to the redirect URIs.

---

### 🐙 GitHub OAuth — `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`

1. Go to [GitHub.com](https://github.com) and log into your account.
2. Click your **profile picture** → **Settings** → scroll to the bottom and click **< > Developer settings**.
3. Click **OAuth Apps** → **New OAuth App**.
4. Fill in the form:
   - **Application name:** `StuGig Local Dev`
   - **Homepage URL:** `http://localhost:5173`
   - **Authorization callback URL:** `http://localhost:5000/api/auth/github/callback`
5. Click **Register application**.
6. On the next page, your **Client ID** is displayed. Click **Generate a new client secret** to get your secret.
7. **Copy both immediately** — the secret cannot be viewed again.
8. Paste them as `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in your `.env`.

> **For Production:** Create a second GitHub OAuth App (e.g., "StuGig Production") with your live Vercel and Render URLs. Use those credentials in your production environment variables on Render.

---

## 📁 Project Structure

```
stugig/
├── Backend/
│   ├── config/         # Passport.js OAuth strategy setup
│   ├── controllers/    # Route logic (auth, jobs, messages, payments)
│   ├── middleware/     # JWT auth middleware
│   ├── models/         # Mongoose schemas (User, Job, Message, etc.)
│   ├── routes/         # Express route definitions
│   ├── socket.js       # Socket.io real-time messaging logic
│   └── server.js       # App entry point
│
└── Frontend/
    ├── public/
    └── src/
        ├── components/ # Reusable UI components (Navbar, etc.)
        ├── context/    # React context (Auth, Theme)
        ├── pages/      # Page components (Dashboard, Jobs, Messages, etc.)
        └── utils/      # Axios instance with interceptors
```

---

## 🌍 Deployment

### Frontend (Vercel)
1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com), import your repository.
3. Set the **Root Directory** to `Frontend`.
4. Add a `VITE_API_URL` environment variable pointing to your Render backend URL.
5. Deploy!

### Backend (Render)
1. Go to [render.com](https://render.com) and create a new **Web Service**.
2. Connect your GitHub repository and set the **Root Directory** to `Backend`.
3. Set the **Start Command** to `npm start`.
4. Add all your environment variables from your `.env` file in the Render dashboard.
5. Deploy!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.
