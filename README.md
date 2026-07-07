# ExploreX 🌍

> **Explore. Share. Connect.**

A modern, production-ready travel & sports blogging platform built with **React**, **TypeScript**, **Tailwind CSS**, and powered by a live **Supabase** backend.

---

## ✨ Features

- **Supabase Integration (New!)** — Real-time persistence of all user blogs (Create, Read, Update, Delete) directly inside a PostgreSQL database table (`blogs`).
- **Secure Passwordless OTP (New!)** — Sign in instantly using a 6-digit OTP passcode sent directly to your email address.
- **Forgot & Reset Password Flow (New!)** — Fully functional recovery flow to securely request password changes and update them under Settings.
- **Live Sports Hub (New!)** — Connects to the official **ESPN Top Headlines Feed** to display live, real-world sports news and details with direct coverage redirect links.
- **Interactive Communities (New!)** — Join community groups, read discussion feeds, and write your own posts in real time.
- **AI Travel Planner & Bookmarks (New!)** — Generate day-by-day itineraries, **Save** them directly to your browser's local bookmarks, and **Share** them via copyable query parameters.
- **Landing Page** — Hero, animated stats, trending destinations, featured blogs, sports communities, AI showcase, testimonials, FAQ.
- **Dashboard** — Personalized feed, quick stats, trending content, sidebar navigation.
- **Creator Analytics** — Recharts-powered graphs for views, likes, and followers growth.
- **Bookmarks** — Saved blogs, destinations, communities, and saved AI itineraries.
- **Leaderboard** — XP-based gamification with podium ranks.
- **Settings** — Profile updates, stateful privacy/notification toggle switches, and password updates.

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#2563EB` |
| Secondary | `#7C3AED` |
| Accent | `#06B6D4` |
| Background | `#F8FAFC` |
| Dark Mode | `#0F172A` |

- Glassmorphism cards and smooth backdrop filters.
- Subtle interactive micro-animations on all elements.
- State-driven slider toggles for privacy and notifications.
- Fully responsive (mobile-first) layout.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- A Supabase Project (for database and authentication)

### Installation

1. Clone or unzip the project:
   ```bash
   cd explorex
   ```

2. Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
explorex/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.tsx                    # Router + layout routes
│   ├── main.tsx                   # React entry point
│   ├── index.css                  # Custom styling + design tokens
│   ├── components/
│   │   ├── ui/index.tsx           # Button, Input, Avatar, Modal, Badge...
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Sticky nav, notifications, profile dropdown
│   │   │   ├── Sidebar.tsx        # Dashboard sidebar with XP progress
│   │   │   └── Footer.tsx         # Full footer with links
│   │   ├── blog/BlogCard.tsx      # Blog card variants
│   │   ├── travel/DestinationCard.tsx
│   │   └── community/CommunityCard.tsx
│   ├── pages/
│   │   ├── LandingPage.tsx        # Full marketing landing page
│   │   ├── AllPages.tsx           # Travel, Sports Hub, Communities, Profile, Write, Analytics, Bookmarks, Explore, AI Planner, Leaderboard, Settings
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   └── ResetPasswordPage.tsx
│   │   └── dashboard/
│   │       └── DashboardHome.tsx
│   ├── context/AuthContext.tsx    # Supabase Auth state provider
│   ├── data/mockData.ts           # Mock starter datasets
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client instantiation
│   │   └── blogs.ts               # Database CRUD logic
│   ├── types/index.ts             # TypeScript interfaces
│   └── utils/index.ts             # Formatting helpers
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + TypeScript |
| Backend & Database | Supabase (PostgreSQL + GoTrue Auth) |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Charts | Recharts |
| Routing | React Router 6 |

---

## 📱 Pages & Routes

| Route | Page | Auth |
|-------|------|------|
| `/` | Landing Page | Public |
| `/login` | Login | Public |
| `/signup` | Sign Up | Public |
| `/forgot-password` | Forgot Password | Public |
| `/reset-password` | Reset Password | Public |
| `/dashboard` | Dashboard Home | Protected |
| `/explore` | Explore | Protected |
| `/blogs` | Blogs List | Protected |
| `/blog/:slug` | Blog Detail | Protected |
| `/write` | Write Blog | Protected |
| `/travel` | Travel / Destinations | Protected |
| `/travel/:id` | Destination Detail | Protected |
| `/sports` | Sports Hub | Protected |
| `/sports/:id` | Sports News Detail | Protected |
| `/communities` | Communities | Protected |
| `/communities/:slug` | Community Detail | Protected |
| `/ai-planner` | AI Travel Planner | Protected |
| `/analytics` | Creator Analytics | Protected |
| `/bookmarks` | Bookmarks | Protected |
| `/leaderboard` | Leaderboard | Protected |
| `/profile` | My Profile | Protected |
| `/settings` | Settings | Protected |

---

## 🏆 Gamification

- **XP System** — Earn XP for publishing blogs, getting likes, and gaining followers.
- **Badges** — Unlock Explorer 🗺️, Top Creator ⭐, Sports Guru 🏏, and Adventurer 🏔️ achievements.
- **Leaderboard** — Real-time rankings of top creators.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

Built with ❤️ for explorers worldwide.
