# ExploreX 🌍

> **Explore. Share. Connect.**

A modern, production-ready SaaS travel & sports blogging platform built with React, TypeScript, and Tailwind CSS.

---

## ✨ Features

- **Landing Page** — Hero, animated stats, trending destinations, featured blogs, sports communities, AI showcase, testimonials, FAQ
- **Authentication** — Login, Signup with Google/GitHub OAuth UI, protected routes
- **Dashboard** — Personalized feed, quick stats, trending content, sidebar navigation
- **Blog Platform** — Rich blog cards, featured/compact/horizontal variants, like/bookmark/share, comments
- **Travel Module** — Destination cards with budget filters, continent filtering, search
- **Sports Hub** — Live scores, sports news, community cards
- **AI Travel Planner** — Generate full itineraries with cost breakdowns
- **Creator Analytics** — Charts for views, likes, followers growth (Recharts)
- **Bookmarks** — Saved blogs, destinations, and communities
- **Leaderboard** — XP-based gamification with podium
- **Profile Page** — Cover image, stats, badges, tabbed content
- **Settings** — Profile edit, notification preferences
- **Communities** — Join/leave sports communities

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#2563EB` |
| Secondary | `#7C3AED` |
| Accent | `#06B6D4` |
| Background | `#F8FAFC` |
| Dark Mode | `#0F172A` |

- Glassmorphism cards
- Smooth animations via Tailwind keyframes
- Skeleton loaders
- Micro-interactions on every card
- Fully responsive (mobile-first)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone or unzip the project
cd explorex

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

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
│   ├── App.tsx                    # Router + layout logic
│   ├── main.tsx                   # React entry point
│   ├── index.css                  # Tailwind + design tokens
│   ├── components/
│   │   ├── ui/index.tsx           # Button, Input, Avatar, Modal, Badge...
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Sticky nav, notifications, profile dropdown
│   │   │   ├── Sidebar.tsx        # Dashboard sidebar with XP progress
│   │   │   └── Footer.tsx         # Full footer with links
│   │   ├── blog/BlogCard.tsx      # 4 card variants
│   │   ├── travel/DestinationCard.tsx
│   │   └── community/CommunityCard.tsx
│   ├── pages/
│   │   ├── LandingPage.tsx        # Full marketing landing page
│   │   ├── AllPages.tsx           # Travel, Sports, Communities, Profile, Write, Analytics, Bookmarks, Explore, AI Planner, Leaderboard, Settings
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── SignupPage.tsx
│   │   ├── blog/
│   │   │   ├── BlogsPage.tsx
│   │   │   └── BlogDetailPage.tsx
│   │   └── dashboard/
│   │       └── DashboardHome.tsx
│   ├── context/AuthContext.tsx    # Auth state management
│   ├── data/mockData.ts           # Mock users, blogs, destinations, communities
│   ├── types/index.ts             # TypeScript interfaces
│   └── utils/index.ts             # Helpers (formatNumber, formatDate...)
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Charts | Recharts |
| Routing | React Router 6 |
| State | React Context API |
| Fonts | Inter (Google Fonts) |

---

## 🌐 Deployment

### Frontend → Vercel
```bash
npm run build
# Deploy /dist folder to Vercel
```

### Backend (optional) → Render
Connect MongoDB Atlas for persistent data.

---

## 🔐 Demo Credentials

On the login page, click **"🚀 Fill demo credentials"** to auto-fill:
- Email: `alex@example.com`
- Password: `demo123`

---

## 📱 Pages & Routes

| Route | Page | Auth |
|-------|------|------|
| `/` | Landing Page | Public |
| `/login` | Login | Public |
| `/signup` | Sign Up | Public |
| `/dashboard` | Dashboard Home | Protected |
| `/explore` | Explore | Protected |
| `/blogs` | Blogs List | Protected |
| `/blog/:slug` | Blog Detail | Protected |
| `/write` | Write Blog | Protected |
| `/travel` | Travel / Destinations | Protected |
| `/sports` | Sports Hub | Protected |
| `/communities` | Communities | Protected |
| `/ai-planner` | AI Travel Planner | Protected |
| `/analytics` | Creator Analytics | Protected |
| `/bookmarks` | Bookmarks | Protected |
| `/leaderboard` | Leaderboard | Protected |
| `/profile` | My Profile | Protected |
| `/profile/:username` | User Profile | Protected |
| `/settings` | Settings | Protected |

---

## 🏆 Gamification

- **XP System** — Earn XP for publishing, likes, followers
- **Badges** — Explorer 🗺️, Top Creator ⭐, Sports Guru 🏏, Adventurer 🏔️
- **Leaderboard** — Ranked by XP with podium for top 3

---

## 🤖 AI Features

The AI Travel Planner generates:
- Day-by-day itineraries
- Cost breakdowns per day
- Activity recommendations
- Budget summaries
- Travel tips

*(Uses simulated AI response for demo. Connect to Anthropic Claude API or OpenAI for real responses.)*

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

Built with ❤️ for explorers worldwide.
