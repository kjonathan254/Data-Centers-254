# 🚀 PostgreSQL Setup Guide for Vercel Deployment

## Problem Solved
Your site was crashing because SQLite (`dev.db`) doesn't persist on Vercel's serverless environment. 
We've switched to **PostgreSQL** which provides persistent, production-ready database storage.

## ✅ What We Changed
1. **Schema**: Updated `prisma/schema.prisma` to use `postgresql` provider
2. **Environment**: Added `DATABASE_URL` and `DIRECT_URL` variables in `.env`
3. **Binary Targets**: Added serverless compatibility flags

## 🔧 Next Steps: Create Your Database

### Option A: Vercel Postgres (Recommended - Easiest)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `Data-Centers-254`

2. **Create Database**
   - Click "Storage" tab
   - Click "Add Database" → "Vercel Postgres"
   - Name: `dc254-production`
   - Region: Choose closest to Kenya (e.g., `eu-west-1` or `af-south-1`)
   - Click "Create"

3. **Connect to Project**
   - Vercel will automatically show connection strings
   - Click "Connect to Project"
   - It will auto-populate `POSTGRES_URL` and `POSTGRES_PRISMA_URL`

4. **Update Environment Variables**
   Vercel will create these automatically, but ensure you have:
   ```
   DATABASE_URL=postgresql://...
   DIRECT_URL=postgresql://...
   ```

### Option B: Neon (Free Tier - Excellent Alternative)

1. **Sign Up**: https://neon.tech
2. **Create Project**: `dc254-production`
3. **Get Connection String**:
   - Go to Project Settings → Connection Details
   - Copy the URI (includes password)
4. **Update Vercel Environment Variables**:
   ```bash
   DATABASE_URL="your-neon-connection-string"
   DIRECT_URL="your-neon-connection-string"
   ```

### Option C: Supabase (Free Tier)

1. **Sign Up**: https://supabase.com
2. **Create Project**: `dc254`
3. **Get Connection String**:
   - Settings → Database → Connection string → URI
   - Use "Transaction mode" pooler link
4. **Update Vercel**: Same as above

## 📦 Deploy to Production

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Generate Prisma Client
```bash
npx prisma generate
```

### Step 3: Push Schema to Database
Once you have your DATABASE_URL from Vercel/Neon:
```bash
npx prisma db push
```

### Step 4: Seed Initial Data
```bash
npx prisma db seed
```

### Step 5: Deploy to Vercel
```bash
git add .
git commit -m "feat: migrate to PostgreSQL for production deployment"
git push origin main
```

Vercel will automatically redeploy with the new configuration.

## 🔍 Verify Deployment

1. **Check Vercel Build Logs**
   - Go to your project on Vercel
   - Click latest deployment
   - Ensure no database errors

2. **Test Site**
   - Visit: https://data-centers-254.vercel.app
   - Navigate to `/articles` - should load all 50 articles
   - Navigate to `/data-centres` - should show "Coming Soon" page

3. **Check Database**
   - Use Vercel's Data Browser (if using Vercel Postgres)
   - Or connect via DBeaver/pgAdmin with your connection string

## 🛠️ Troubleshooting

### Error: "Prisma Client is not configured"
```bash
npx prisma generate
npm run build
```

### Error: "Database URL is not defined"
- Ensure `DATABASE_URL` and `DIRECT_URL` are set in Vercel Environment Variables
- Go to Project Settings → Environment Variables

### Error: "Relation X does not exist"
```bash
npx prisma db push --force-reset
npx prisma db seed
```

### Local Development
For local testing, you can still use SQLite:
1. Create `.env.local`:
   ```
   DATABASE_URL="file:./dev.db"
   ```
2. Run: `npx prisma migrate dev`

## 📊 Database Schema Includes

✅ **Facility** - Data centre locations and specs  
✅ **PricingData** - Colocation pricing intelligence  
✅ **OutageReport** - Incident tracking  
✅ **EnergyMetric** - PUE, sustainability metrics  
✅ **Tenant** - Anchor tenants (hyperscalers)  
✅ **JobPosting** - Careers board  
✅ **Report** - Premium research reports  
✅ **User** - Subscription management  
✅ **ApiToken** - Enterprise API access  
✅ **Article** - All 50 educational articles  
✅ **ConnectivityProvider** - ISPs and fiber operators  

## 🎯 Success Criteria

- [ ] Database created on Vercel/Neon
- [ ] Environment variables configured
- [ ] `npx prisma db push` succeeds
- [ ] Site loads without errors at `/articles`
- [ ] No console errors in browser
- [ ] All 50 articles accessible

## 📞 Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Verify DATABASE_URL format
3. Ensure `DIRECT_URL` is set (required for migrations on Vercel)
4. Try Neon.tech as alternative (most reliable free tier)

---

**Ready to deploy?** Follow Option A (Vercel Postgres) for the smoothest experience!
