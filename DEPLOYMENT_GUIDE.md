# SephyrOath CMS - Deployment Guide

## ✅ Complete CMS Implementation

Your SephyrOath Gaming website now has a fully functional Content Management System with the following features:

### 🎯 Key Features Implemented

#### 1. **Role Permissions System**
- **Owner**: Full access to all website features, can manage everything
- **Admin**: Can create, edit, delete, and publish Events, Tournaments, Hall of Fame achievements, and manage members
- **Member**: View-only access to public content and their own profile

#### 2. **Events Management**
- Admin/Owner can create, edit, delete, and publish events
- Fields: Title, Description, Date, Location, Banner Image, Event Type, Status
- Events displayed on `/events` page - only published events are shown
- Admin panel: `/admin/events`

#### 3. **Tournaments Management**
- Admin/Owner can create tournament announcements
- Fields: Title, Description, Schedule, Registration Details, Banner, Prize Pool, Max Teams, Rules
- Tournaments displayed on `/tournaments` page - only upcoming tournaments
- Admin panel: `/admin/tournaments`

#### 4. **Hall of Fame System**
- Admin/Owner can add, edit, and remove achievements
- 8 Achievement Categories:
  - Major Tournament Champion
  - Scrimmage Champion
  - Home Scrim Champion
  - MVP
  - Best Recruiter
  - Clan Contributor
  - Clan Veteran
  - Special Recognition
- Support for achievement images and descriptions
- Achievements grouped by category on `/hall-of-fame`
- Admin panel: `/admin/hall-of-fame`

#### 5. **Admin Dashboard**
Access at `/admin/dashboard` (login required)
- Dashboard Overview with content statistics
- Events Management Panel
- Tournaments Management Panel
- Hall of Fame Management Panel
- Members Management
- Settings Page
- Responsive admin UI with sidebar navigation

#### 6. **Discord Integration**
- Fixed Discord buttons on all pages
- Discord button opens official SephyrOath Discord invite in new tab
- Environment variable: `NEXT_PUBLIC_DISCORD_INVITE`

#### 7. **Database-Driven Content**
- All content stored in PostgreSQL database via Prisma ORM
- Complete CRUD functionality
- Content persists after deployment
- No hardcoded placeholder data

---

## 🚀 Deployment to Vercel

### Step 1: Prepare for Deployment

1. **Verify all code is committed and pushed:**
   ```bash
   git status  # Should show "working tree clean"
   git log --oneline | head -5  # Verify commits are there
   ```

2. **Check environment variables** - Ensure your `.env` file has all required variables (but DON'T commit `.env` to GitHub!)

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Vercel will guide you through setup:**
   - Select "Confirm and deploy"
   - Choose your project settings
   - Vercel will automatically build and deploy

#### Option B: Using GitHub Integration (Easiest)

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)

2. Click "Add New" → "Project"

3. Select your GitHub repository (`ATBlaze-prog/sephyroath-website`)

4. Click "Import"

5. **Configure Environment Variables:**
   - Add all variables from your `.env` file:
     - `DATABASE_URL` - Your PostgreSQL connection string
     - `NEXTAUTH_URL` - Your Vercel deployment URL
     - `NEXTAUTH_SECRET` - Your secret key
     - `DISCORD_CLIENT_ID` - Discord OAuth ID
     - `DISCORD_CLIENT_SECRET` - Discord OAuth Secret
     - `NEXT_PUBLIC_DISCORD_INVITE` - Discord invite link
     - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary settings
     - Other variables as needed

6. Click "Deploy"

### Step 3: Post-Deployment Setup

1. **Run Database Migration on Vercel:**
   After first deployment, you might need to run migrations:
   ```bash
   vercel env pull  # Pull environment variables
   npx prisma migrate deploy
   ```

2. **Create Your First Admin Account:**
   - You'll need to manually create an admin user in the database or through the signup process
   - Set their role to `ADMIN` or `OWNER`

3. **Test the Deployment:**
   - Visit your Vercel URL
   - Navigate to `/admin/dashboard` (you'll need to be logged in)
   - Try creating an event, tournament, and hall of fame entry

### Step 4: Update Discord Integration

1. Update `NEXT_PUBLIC_DISCORD_INVITE` in Vercel:
   - Go to Vercel Project Settings → Environment Variables
   - Update `NEXT_PUBLIC_DISCORD_INVITE` with your Discord invite link
   - Click "Save"
   - Redeploy: `vercel --prod`

---

## 📊 Database Management

### Accessing the Database

Your database is hosted on Neon (PostgreSQL). To access it:

1. **Connection String**: Use `DATABASE_URL` from your `.env`
2. **GUI Access**: Visit [https://console.neon.tech](https://console.neon.tech)
3. **Run Migrations**: `npx prisma migrate deploy`

### Database Tables Created

- `User` - User accounts and roles
- `MemberProfile` - Member profiles with stats
- `Event` - Events and scrims
- `Tournament` - Tournament announcements
- `HallOfFameAchievement` - Hall of fame entries
- `Application` - Recruitment applications
- And more (see schema.prisma for full details)

---

## 🔧 API Endpoints

### Events API
- `GET /api/events` - Get published events
- `POST /api/events` - Create event (Admin/Owner)
- `GET /api/events/[id]` - Get single event
- `PUT /api/events/[id]` - Update event (Admin/Owner)
- `DELETE /api/events/[id]` - Delete event (Admin/Owner)

### Tournaments API
- `GET /api/tournaments` - Get tournaments
- `POST /api/tournaments` - Create tournament (Admin/Owner)
- `GET /api/tournaments/[id]` - Get single tournament
- `PUT /api/tournaments/[id]` - Update tournament (Admin/Owner)
- `DELETE /api/tournaments/[id]` - Delete tournament (Admin/Owner)

### Hall of Fame API
- `GET /api/hall-of-fame` - Get achievements
- `POST /api/hall-of-fame` - Create achievement (Admin/Owner)
- `GET /api/hall-of-fame/[id]` - Get single achievement
- `PUT /api/hall-of-fame/[id]` - Update achievement (Admin/Owner)
- `DELETE /api/hall-of-fame/[id]` - Delete achievement (Admin/Owner)

---

## 🔑 Important Notes

1. **Database URL**: Keep your `DATABASE_URL` secret - never commit it to GitHub
2. **NEXTAUTH_SECRET**: Should be a strong random string
3. **Discord OAuth**: Make sure your Discord bot is properly configured
4. **Admin Access**: Only ADMIN and OWNER roles can manage content
5. **Vercel Caching**: If changes don't appear immediately, wait a few moments or clear cache

---

## ✨ Going Live

Once deployed to Vercel:

1. **Your website is live at**: `https://your-vercel-url.vercel.app`
2. **Custom domain**: Add your domain in Vercel Project Settings
3. **Analytics**: Monitor traffic in Vercel dashboard
4. **Logs**: View deployment logs in Vercel dashboard if issues occur

---

## 🆘 Troubleshooting

### Issue: "Database connection failed"
- Verify `DATABASE_URL` is set in Vercel Environment Variables
- Check database is accessible from Vercel IP

### Issue: "Admin panel not accessible"
- Ensure you're logged in with Admin/Owner role
- Check database has correct role assignment

### Issue: "Discord button not working"
- Verify `NEXT_PUBLIC_DISCORD_INVITE` is set correctly
- Make sure it's a valid Discord invite link

### Issue: "Content not displaying"
- Check database has data (run migrations: `npx prisma migrate deploy`)
- Verify Prisma client is generated: `npm run generate`
- Rebuild: `npm run build`

---

## 📞 Support

For issues or questions:
1. Check the logs in Vercel dashboard
2. Review error messages in browser console
3. Test API endpoints locally before deployment
4. Verify environment variables are correctly set

---

**Your CMS is now ready for production! 🎉**
