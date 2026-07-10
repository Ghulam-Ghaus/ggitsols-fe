# GG IT Solutions ERP & LMS - Frontend Portal

A premium, high-fidelity frontend web portal built with **Next.js 15 (App Router)**, featuring a 3D glassmorphic user interface and direct integrations with the NestJS backend APIs.

---

## 🛠️ Tech Stack & UI/UX Design

- **Core Framework:** Next.js 15 with TypeScript (React 19)
- **Styling:** Tailwind CSS v4
- **State Management:** React Context API (AuthContext)
- **API Client:** Axios with request token injection and custom response error formatting
- **Icons:** Lucide React
- **Aesthetic System:** Modern dark-theme glassmorphism:
  - Deep dark background gradients (`bg-slate-950`).
  - Frosted borders and background filters (`backdrop-blur-xl border-white/10`).
  - Interactive 3D perspective translations on mouse hover.
  - Floating ambient blur background lights.

---

## 📂 Project Structure

```text
frontend/
├── public/                      # Static assets
│   ├── flyer.jpg                # Institute promotional flyer
│   ├── founder.png              # Portrait photo of Ghulam Ghaus
│   ├── logo.jpg                 # GG IT Solutions white-background logo
│   └── next.svg / vercel.svg
├── src/
│   ├── app/                     # Next.js App Router folders
│   │   ├── login/               # 3D Glassmorphic Login page
│   │   │   └── page.tsx
│   │   ├── profile/             # Profile details dashboard & update CRUD
│   │   │   └── page.tsx
│   │   ├── register/            # 3D Glassmorphic Registration page
│   │   │   └── page.tsx
│   │   ├── globals.css          # Tailwind CSS global styles
│   │   ├── layout.tsx           # Global layout wrapping AuthProvider
│   │   └── page.tsx             # Public landing page with team profiles
│   ├── context/                 # Global state management
│   │   └── AuthContext.tsx      # Auth session, login/logout, and redirection
│   ├── lib/                     # Global client configurations
│   │   └── axios.ts             # Custom axios instance with authorization interceptor
├── tsconfig.json                # TypeScript compiler rules
├── package.json                 # Scripts and package dependency definitions
└── CLAUDE.md                    # Core architecture guidelines and security rules
```

---

## ⚙️ Environment Configuration

Create a `.env` or `.env.local` file in the root of the `/frontend` folder:

```env
# Next.js Public Backend API Address
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependency packages:
```bash
npm install
```

### 2. Start Development Server
By default, the development port is configured to run on port **`3001`** in `package.json` to prevent conflicts with the NestJS backend (running on port `3000`).

Start the hot-reload dev server:
```bash
npm run dev
```
*Access the portal at: `http://localhost:3001`*

### 3. Build & Prerender
Build the production-optimized static and server-rendered bundle:
```bash
npm run build
```

### 4. Run Production Build locally
Start the production Next.js server locally:
```bash
npm run start
```

---

## 🎨 Interactive Pages & Features

1. **Public Landing Page (`/`):**
   - Features the blurred promotional flyer as background.
   - Houses the **Founder Spotlight Card**, showing the founder's portrait alongside career histories and expert skills.
   - Houses the **Co-Founder** and **Software Engineer** profiles on the left side of their grids with larger circular avatars.
   - Adapts to user session states: dynamically shows "Portal Login" or "Go to Portal" CTAs.
2. **Auth Gateway Pages (`/login` & `/register`):**
   - Embedded in tilting 3D glass cards.
   - Performs validation validations (password length checks, correct email constraints) and alerts errors.
3. **Profile Panel (`/profile`):**
   - Renders a secure, private interface.
   - Direct Profile Edit panel enabling users to patch database columns (First Name, Last Name, Phone, Password) with immediate session refreshes.
   - Logout button to safely clear cookies/localStorage tokens.

---

## 🌿 Git Branching Strategy

The repository follows a clean development workflow:
- **`main`:** Production-stable frontend releases.
- **`dev`:** Active development branch where new dashboard screens are integrated and validated against the backend.