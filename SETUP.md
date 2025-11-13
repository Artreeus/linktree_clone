# LinkHub Setup Guide

Welcome to LinkHub! This guide will help you set up and deploy your LinkHub application.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ or 20+
- npm, pnpm, or yarn
- A Supabase account (free tier is fine)
- (Optional) A Cloudinary account for image uploads

## Quick Start

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to find your credentials
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set Up Database

1. Go to your Supabase Dashboard > SQL Editor
2. Run the SQL scripts in order:
   - `scripts/001_create_tables.sql`
   - `scripts/002_add_appearance_columns.sql`
   - `scripts/003_add_link_scheduling.sql`

Or use the combined script: Copy all three files and run them in the SQL editor.

### 4. Configure Authentication (Optional but Recommended)

1. Go to Authentication > URL Configuration in Supabase
2. Add the following redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback` (for production)

### 5. Set Up Image Upload (Optional)

If you want to enable profile image uploads:

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Go to Settings > Upload and create an unsigned upload preset
3. Add to your `.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset-name
```

### 6. Run the Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### ✨ Core Features
- 🔐 **Authentication** - Secure sign up, login, and password reset
- 👤 **Profile Management** - Customizable username, display name, bio, and avatar
- 🔗 **Link Management** - Add, edit, delete, and reorder links with drag-and-drop
- 📊 **Analytics Dashboard** - Track clicks, views, and engagement
- 🎨 **Appearance Customization** - Multiple themes and button styles
- 📱 **Responsive Design** - Works beautifully on all devices
- 🌙 **Dark Mode** - System-aware theme switching
- 📈 **Click Tracking** - Real-time analytics for each link
- 🗓️ **Link Scheduling** - Schedule when links are visible
- 🎯 **Social Media Icons** - Instagram, Twitter, LinkedIn, GitHub, and more
- 🔍 **SEO Optimized** - Dynamic meta tags and Open Graph images
- 📥 **Data Export** - Download all your data as JSON
- ⚙️ **Account Settings** - Change password, delete account
- 🎨 **Custom Themes** - Ocean, Sunset, Forest, Midnight, Minimal

### 🔒 Security Features
- Row Level Security (RLS) on all database tables
- Secure authentication with Supabase
- Protected API routes
- CSRF protection

### 🚀 Performance
- Built with Next.js 16 App Router
- Server-side rendering for fast initial loads
- Optimized images and assets
- Edge-ready API routes

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables from `.env.local`
5. Deploy!

### Deploy to Other Platforms

The app works on any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS
- Google Cloud
- Azure

Just make sure to:
1. Set all environment variables
2. Use Node.js 18+
3. Run `npm run build` to build the app

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your site URL (for redirects) | Yes |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | No |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary upload preset | No |

### Customization

#### Themes
Edit `components/dashboard/appearance-editor.tsx` to add more themes.

#### Colors
Modify `app/globals.css` to change the color palette.

#### Analytics
The analytics system tracks:
- Link clicks
- Referrer sources
- User agents
- Timestamps

## Troubleshooting

### Database Errors
- Make sure all SQL scripts have been run
- Check that RLS policies are enabled
- Verify your Supabase credentials

### Authentication Issues
- Confirm redirect URLs are correct
- Check that email confirmation is enabled in Supabase
- Verify environment variables

### Image Upload Not Working
- Check Cloudinary credentials
- Ensure upload preset is unsigned
- Verify CORS settings in Cloudinary

## Support

If you encounter any issues:
1. Check the console for error messages
2. Review the Supabase logs
3. Make sure all dependencies are installed
4. Try clearing your browser cache

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)

