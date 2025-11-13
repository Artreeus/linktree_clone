# 🔗 LinkHub - Professional Linktree Clone

> A modern, feature-rich link-in-bio platform built with Next.js 16, React 19, TypeScript, Supabase, and Tailwind CSS.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Version](https://img.shields.io/badge/version-2.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)]()
[![React](https://img.shields.io/badge/React-19.2-blue)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)]()

---

## ✨ Features

### 🎯 Core Features
- 🔐 **Secure Authentication** - Email/password with Supabase
- 👤 **Profile Management** - Customizable profiles with avatars
- 🔗 **Link Management** - Drag-and-drop reordering, scheduling
- 📊 **Analytics Dashboard** - Real-time click tracking & insights
- 🎨 **6 Beautiful Themes** - Customizable appearance
- 🌙 **Dark Mode** - System-aware theme switching
- 📱 **Fully Responsive** - Beautiful on all devices
- 🚀 **SEO Optimized** - Dynamic meta tags & OG images

### 🔥 Advanced Features
- **Link Scheduling** - Set start/end dates for links
- **Social Media Icons** - 9 built-in icons (Instagram, Twitter, etc.)
- **Click Analytics** - Track performance & engagement
- **Custom Themes** - Ocean, Sunset, Forest, Midnight, Minimal
- **QR Code Generation** - For easy sharing
- **Data Export** - GDPR compliant
- **Password Reset** - Email-based recovery
- **Account Settings** - Full control over your account

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or 20+
- npm, pnpm, or yarn
- Supabase account (free tier works!)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/linkhub.git
cd linkhub

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional - for image uploads
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset
```

### Database Setup

1. Go to Supabase Dashboard > SQL Editor
2. Run the SQL scripts in order:
   - `scripts/001_create_tables.sql`
   - `scripts/002_add_appearance_columns.sql`
   - `scripts/003_add_link_scheduling.sql`

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Complete setup guide
- **[FEATURES.md](FEATURES.md)** - Detailed features documentation
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[UPGRADE_SUMMARY.md](UPGRADE_SUMMARY.md)** - Latest upgrade details

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Components:** shadcn/ui
- **Icons:** Lucide React
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Cloudinary (optional)
- **API:** Next.js API Routes

### Deployment
- **Platform:** Vercel (recommended)
- **Edge:** Vercel Edge Functions
- **Analytics:** Vercel Analytics

---

## 📊 Application Structure

```
linkhub/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── og/                   # OG image generation
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   ├── sign-up/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── verify-email/
│   ├── dashboard/                # Dashboard pages
│   │   ├── analytics/
│   │   └── settings/
│   ├── u/[username]/             # Public profiles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── dashboard/                # Dashboard components
│   ├── public-profile/           # Public profile components
│   ├── ui/                       # shadcn/ui components
│   └── ...                       # Other components
├── lib/                          # Utility functions
│   ├── supabase/                 # Supabase clients
│   ├── utils/                    # Helper functions
│   └── ...
├── scripts/                      # Database migrations
│   ├── 001_create_tables.sql
│   ├── 002_add_appearance_columns.sql
│   └── 003_add_link_scheduling.sql
├── public/                       # Static assets
├── .env.example                  # Environment variables template
└── package.json                  # Dependencies
```

---

## 🎨 Screenshots

### Landing Page
Beautiful, modern landing page with features showcase

### Dashboard
Comprehensive dashboard with tabs for Profile, Links, Analytics, and Share

### Analytics
Real-time analytics with charts and insights

### Public Profile
Stunning animated profile pages with customizable themes

---

## 🚀 Deployment

### Deploy to Vercel (One-Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

### Manual Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for:
- Vercel
- Netlify
- Railway
- Self-hosted (VPS)

---

## 🔒 Security

- **Row Level Security (RLS)** on all database tables
- **Input validation** with Zod schemas
- **SQL injection prevention**
- **XSS protection**
- **CSRF protection**
- **Secure password hashing**
- **Session management**

---

## ⚡ Performance

- **Server-Side Rendering (SSR)**
- **Static Site Generation (SSG)**
- **Code Splitting**
- **Image Optimization**
- **Edge Functions**
- **Minimal JavaScript Bundle**

Target Metrics:
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s

---

## 📈 Analytics Features

- Real-time click tracking
- Profile views estimation
- Link performance metrics
- Time-based filters (7d, 30d, 90d, all)
- Visual charts (Line, Bar)
- Top performing links
- Recent activity feed
- Referrer tracking
- User agent tracking

---

## 🎨 Themes

### Built-in Themes
1. **Default** - Purple/Pink gradient
2. **Ocean** - Blue/Cyan gradient
3. **Sunset** - Orange/Red gradient
4. **Forest** - Green/Emerald gradient
5. **Midnight** - Dark indigo
6. **Minimal** - Clean white/black

### Button Styles
- **Rounded** - Pill-shaped buttons
- **Sharp** - Square corners
- **Soft** - Slightly rounded

---

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix lint errors
npm run type-check   # TypeScript check
```

### Code Quality

- ESLint for code linting
- TypeScript for type safety
- Zod for runtime validation
- Prettier for code formatting (optional)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with these amazing technologies:
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)

---

## 📞 Support

For support and questions:
- 📧 Email: support@linkhub.com
- 💬 Discord: [Join our community](#)
- 🐦 Twitter: [@linkhub](#)

---

## 🗺️ Roadmap

### v2.1.0 (Coming Soon)
- [ ] Custom domains
- [ ] Link categories
- [ ] Advanced analytics filters
- [ ] Email notifications

### v2.2.0 (Planned)
- [ ] Team accounts
- [ ] API access
- [ ] Webhooks
- [ ] White-label options

### v3.0.0 (Future)
- [ ] Mobile app
- [ ] Advanced customization
- [ ] Integration marketplace
- [ ] AI-powered suggestions

---

## 📊 Status

- **Build:** ✅ Passing
- **Tests:** ✅ All Passing
- **Linter:** ✅ No Errors
- **TypeScript:** ✅ No Errors
- **Production:** ✅ Ready

---

## 🌟 Star Us!

If you find this project useful, please give it a ⭐️ on GitHub!

---

<p align="center">Made with ❤️ by the LinkHub Team</p>
<p align="center">© 2025 LinkHub. All rights reserved.</p>
