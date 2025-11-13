# Deployment Guide for LinkHub

This guide will help you deploy your LinkHub application to production.

## Prerequisites

Before deploying, ensure you have:
- ✅ A GitHub account
- ✅ A Supabase project with tables created
- ✅ All environment variables ready
- ✅ (Optional) Cloudinary account for images

---

## Option 1: Deploy to Vercel (Recommended)

Vercel is the easiest and most optimized platform for Next.js applications.

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Complete LinkHub upgrade"

# Add remote (replace with your repo)
git remote add origin https://github.com/yourusername/linkhub.git

# Push
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Environment Variables

Add the following environment variables in Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=https://yourdomain.vercel.app
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name (optional)
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset (optional)
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Your site is live! 🎉

### Step 5: Configure Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_SITE_URL` to your custom domain

### Step 6: Update Supabase

1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Add Site URL: `https://yourdomain.vercel.app`
3. Add Redirect URLs:
   - `https://yourdomain.vercel.app/auth/callback`
   - `https://yourdomain.vercel.app/**`

---

## Option 2: Deploy to Netlify

### Step 1: Push to GitHub
(Same as Vercel Step 1)

### Step 2: Import to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Connect to GitHub and select your repository

### Step 3: Configure Build Settings

```
Build command: npm run build
Publish directory: .next
```

### Step 4: Environment Variables

Add the same environment variables as Vercel.

### Step 5: Deploy

Click "Deploy site" and wait for completion.

---

## Option 3: Deploy to Railway

### Step 1: Create Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository

### Step 3: Configure

Railway will auto-detect Next.js.

Add environment variables in the Variables tab.

### Step 4: Deploy

Railway will automatically build and deploy.

---

## Option 4: Self-Hosted (VPS)

### Prerequisites
- Ubuntu 20.04+ or similar
- Node.js 18+
- nginx
- PM2

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install nginx
sudo apt install nginx -y
```

### Step 2: Clone Repository

```bash
# Clone your repo
git clone https://github.com/yourusername/linkhub.git
cd linkhub

# Install dependencies
npm install

# Create .env.local
nano .env.local
# Add your environment variables

# Build
npm run build
```

### Step 3: Configure PM2

```bash
# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'linkhub',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/linkhub',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Step 4: Configure nginx

```bash
sudo nano /etc/nginx/sites-available/linkhub
```

Add:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/linkhub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Post-Deployment Checklist

### 1. Verify Deployment
- [ ] Site loads correctly
- [ ] Authentication works
- [ ] Can create account
- [ ] Can add links
- [ ] Analytics tracking works
- [ ] Theme switching works
- [ ] Images upload (if using Cloudinary)

### 2. Test Core Features
- [ ] Sign up
- [ ] Login
- [ ] Password reset
- [ ] Profile editing
- [ ] Link management
- [ ] Analytics
- [ ] Settings
- [ ] Public profile view

### 3. Performance Check
- [ ] Run Lighthouse audit
- [ ] Check page load times
- [ ] Test on mobile devices
- [ ] Test different browsers

### 4. SEO Setup
- [ ] Submit to Google Search Console
- [ ] Create sitemap
- [ ] Set up analytics (Google Analytics, Plausible, etc.)
- [ ] Check meta tags
- [ ] Test social sharing (Open Graph)

### 5. Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure uptime monitoring
- [ ] Set up database backups
- [ ] Monitor resource usage

---

## Continuous Deployment

### GitHub Actions (Example)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Troubleshooting

### Build Fails
1. Check environment variables
2. Verify Node.js version (18+)
3. Clear cache and rebuild
4. Check build logs

### Database Connection Issues
1. Verify Supabase URL and key
2. Check RLS policies
3. Ensure tables are created
4. Check Supabase service status

### Authentication Not Working
1. Verify redirect URLs in Supabase
2. Check site URL environment variable
3. Clear browser cache
4. Test in incognito mode

### Images Not Uploading
1. Check Cloudinary credentials
2. Verify CORS settings
3. Check file size limits
4. Test with different image

---

## Production Best Practices

### Security
1. **Never commit** `.env.local` to git
2. Use **environment variables** for secrets
3. Enable **rate limiting** (Vercel Pro, Cloudflare)
4. Set up **DDoS protection**
5. Regular **security updates**

### Performance
1. Enable **CDN** (automatic on Vercel)
2. Use **image optimization**
3. Enable **compression**
4. Monitor **Core Web Vitals**
5. Set up **caching** strategies

### Reliability
1. Set up **automatic backups**
2. Use **error tracking** (Sentry)
3. Configure **uptime monitoring**
4. Have **rollback** strategy
5. Test **disaster recovery**

### Monitoring
1. **Application Performance Monitoring** (APM)
2. **User Analytics**
3. **Error Tracking**
4. **Uptime Monitoring**
5. **Database Performance**

---

## Scaling Considerations

### When to Scale
- **High Traffic**: > 10,000 daily users
- **Slow Response**: > 2s page loads
- **Database Load**: High query times
- **Storage**: Running out of space

### Scaling Options
1. **Vertical Scaling**: Upgrade server resources
2. **Horizontal Scaling**: Multiple instances
3. **Database**: Read replicas, connection pooling
4. **CDN**: Edge caching for static assets
5. **Media**: Separate media storage (S3, Cloudinary)

---

## Cost Optimization

### Free Tier Options
- **Vercel**: Hobby plan (free for personal use)
- **Supabase**: Free tier (up to 500MB database)
- **Cloudinary**: Free tier (25GB storage)

### Estimated Monthly Costs (Paid)
- **Vercel Pro**: $20/month
- **Supabase Pro**: $25/month
- **Cloudinary**: $0 - $99/month (usage based)
- **Domain**: $10-15/year
- **Total**: ~$45-65/month for professional setup

---

## Support & Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)

### Community
- Next.js Discord
- Supabase Discord
- Stack Overflow

---

**Your application is now deployed and ready to serve users!** 🚀

Remember to monitor performance and gather user feedback for continuous improvement.

