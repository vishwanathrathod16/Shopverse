# 🛒 ShopVerse

ShopVerse is a full-stack e-commerce monorepo project built with a modern tech stack. It features a Next.js frontend, a Node.js/Express backend, and a client-side cart, with payments handled by Razorpay.

![Project Status: In Development](https://img.shields.io/badge/status-in_development-yellow)
![Tech: TypeScript](https://img.shields.io/badge/tech-TypeScript-blue)
![Tech: Next.js](https://img.shields.io/badge/tech-Next.js-black)
![Tech: Node.js](httpss://img.shields.io/badge/tech-Node.js-green)

---

## 📸 Demo

Place a GIF or screenshots of your application here.

| Home Page | Product Page | Cart |
| :---: | :---: | :---: |
|  |  |  |

---

## 🌟 Features

-   **Monorepo Structure:** `pnpm` workspaces for clean separation of frontend and backend.
-   **Full-stack TypeScript:** Type safety across the entire application.
-   **User Authentication:** Secure JWT (httpOnly cookie) authentication for user registration and login.
-   **Protected Routes:** Backend and frontend middleware to protect routes like checkout and order history.
-   **Product Catalog:** Fetches and displays a list of products and individual product details.
-   **Client-side Cart:** Persistent cart using React Context and `localStorage`.
-   **Full Checkout Flow:**
    1.  Collect Shipping Address.
    2.  Confirm Order & Total.
    3.  Process payment via **Razorpay**.
-   **Order History:** A "My Orders" page for users to view their past orders.

---

## 🔧 Tech Stack

| Area | Technologies |
| :--- | :--- |
| **Monorepo** | **pnpm Workspaces** |
| **Frontend** | React (Next.js 14+), TypeScript, Tailwind CSS, React Context, Axios |
| **Backend** | Node.js, Express, TypeScript, Mongoose, JWT, bcryptjs |
| **Database** | MongoDB (Atlas) |
| **Payments** | Razorpay |

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### 1. Prerequisites

You must have the following tools installed on your machine:
-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [pnpm](https://pnpm.io/installation) (Install with `npm install -g pnpm`)
-   [Git](https://git-scm.com/)
-   [MongoDB](https://www.mongodb.com/try/download/community) (or a free MongoDB Atlas account)
-   A **Razorpay Account** (for API keys)

### 2. Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/shopverse-mono.git](https://github.com/your-username/shopverse-mono.git)
    cd shopverse-mono
    ```

2.  **Install all dependencies:**
    `pnpm` will read the `pnpm-workspace.yaml` and install packages for *both* frontend and backend.
    ```bash
    pnpm install
    ```

### 3. Environment Variables

You need to create two `.env` files.

**A. Backend:**
Create a file at `apps/backend/.env`

```ini
# --- MongoDB ---
# Get this from your MongoDB Atlas cluster
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/shopverse

# --- Server ---
PORT=5000

# --- JWT ---
# Use a long, random string
JWT_SECRET=your_jwt_secret_string

# --- Razorpay ---
# Get these from your Razorpay Dashboard
RAZORPAY_KEY_ID=YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
B. Frontend: Create a file at apps/frontend/.env.local

Ini, TOML

# --- API URL ---
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# --- Razorpay ---
# This is your PUBLIC key, not the secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=YOUR_KEY_ID
4. Seed the Database (Optional)
You can populate the database with sample products using the seeder script.

Bash

# Run this from the root directory
pnpm --filter backend run seed
To destroy all data:

Bash

pnpm --filter backend run seed:destroy
5. Running the Application
You will need two separate terminals.

Terminal 1: Run the Backend Server

Bash

# From the root directory
pnpm --filter backend run dev
Server will be running at http://localhost:5000

Terminal 2: Run the Frontend Server

Bash

# From the root directory
pnpm --filter frontend run dev
Server will be running at http://localhost:3000

📂 Project Structure
A high-level overview of the monorepo structure.

shopverse-mono/
│
├── apps/
│   │
│   ├── backend/
│   │   ├── src/
│   │   │   ├── config/       (DB connection)
│   │   │   ├── controllers/  (Route logic)
│   │   │   ├── middleware/   (Auth guard)
│   │   │   ├── models/       (Mongoose schemas)
│   │   │   ├── routes/       (API endpoints)
│   │   │   ├── utils/        (Token generator)
│   │   │   ├── seeder.ts     (Sample data script)
│   │   │   └── index.ts      (Server entry)
│   │   ├── .env
│   │   └── package.json
│   │
│   └── frontend/
│       ├── src/
│       │   ├── app/          (Next.js App Router pages)
│       │   ├── components/   (Reusable components)
│       │   ├── context/      (AuthContext, CartContext)
│       │   ├── types/        (Shared interfaces)
│       │   └── ...
│       ├── .env.local
│       └── package.json
│
├── package.json          (Root package.json)
└── pnpm-workspace.yaml   (Defines the monorepo)
🛣️ Roadmap
This project is the MVP. Future enhancements include:

[ ] Admin Dashboard: CRUD products, view orders, manage users.

[ ] Image Uploads: Integrate Cloudinary or S3 for product image hosting.

[ ] Google OAuth: Add "Sign in with Google" functionality.

[ ] Search & Filtering: A search bar and category filters on the home page.

[ ] Product Reviews: Allow logged-in users to leave reviews.

[ ] Caching: Implement Redis for caching products.

[ ] Deployment: Dockerize and deploy (Vercel for frontend, Render/AWS for backend).
