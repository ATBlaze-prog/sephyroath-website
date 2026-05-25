# SephyrOath Project Setup Guide

## 📋 What's Been Created

A complete Next.js 14+ esports community management platform with:

### ✅ Project Infrastructure
- Next.js App Router with TypeScript configuration
- Tailwind CSS with custom SephyrOath color palette
- Complete folder structure for scalability
- Configured build tools and development environment

### ✅ Database (Prisma ORM)
- PostgreSQL schema with 20+ tables
- User authentication and role-based access control
- Game, roster, and player management
- Recruitment workflow system (applications → tryouts → oath)
- Achievement and badge system
- Forum, events, tournaments, and audit logging
- Dynamic asset configuration tables

### ✅ Frontend Components
- **Header/Navigation**: Sticky navigation with mobile menu, logo, auth buttons
- **Footer**: Multi-section layout with links and social integration
- **ParticleCanvas**: Animated background particle effects
- **Global Styles**: SephyrOath dark theme with neon accents
- **Glassmorphism**: Modern UI effects throughout

### ✅ Pages Created
1. **Homepage** (`/`): Hero section, features, stats, announcements, CTAs
2. **The Creed** (`/the-creed`): Oath text, code of conduct, core principles, motto
3. **Games** (`/games`): Hub for game listings (stub)
4. **Members** (`/members`): Member directory (stub)
5. **Forum** (`/forum`): Community forum (stub)
6. **Hall of Fame** (`/hall-of-fame`): Legends and achievements (stub)
7. **Tournaments** (`/tournaments`): Tournament management (stub)
8. **Events** (`/events`): Event calendar (stub)
9. **Recruitment** (`/recruitment`): Application system (stub)

### ✅ Utility Functions
- Date formatting and time ago
- User role management
- Permission checking system
- File size formatting
- Email validation
- Slug generation
- Text truncation

### ✅ Authentication Setup
- NextAuth.js configuration with Discord OAuth
- Credentials provider for email/password login
- JWT sessions
- Role-based token data

### ✅ Configuration Files
- `package.json`: All dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `tailwind.config.ts`: Custom color palette
- `next.config.js`: Image optimization
- `.env.example`: Template for environment variables
- `.gitignore`: Git configuration

---

## 🚀 Quick Start Guide

### 1. **Open the Project**
Open the `project` folder in VS Code:
```bash
code project
```

### 2. **Install Dependencies**
```bash
npm install
```
This will install all required packages including Next.js, React, Tailwind CSS, Prisma, and more.

### 3. **Set Up Environment Variables**
Create `.env.local` in the project root:
```bash
cp .env.example .env.local
```

Fill in your values:
```
# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/sephyroath"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl rand -base64 32"

# Discord OAuth (from Discord Developer Portal)
DISCORD_CLIENT_ID="your-client-id"
DISCORD_CLIENT_SECRET="your-client-secret"

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. **Set Up PostgreSQL Database**

**Option A: Local PostgreSQL**
```bash
# Create database
createdb sephyroath

# Set DATABASE_URL in .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/sephyroath"
```

**Option B: Cloud PostgreSQL (Recommended)**
- Use Supabase, Railway, or Neon
- Copy connection string to DATABASE_URL

### 5. **Initialize Prisma**

Generate Prisma client:
```bash
npm run generate
```

Push schema to database:
```bash
npm run db:push
```

Or run migrations:
```bash
npm run db:migrate
```

### 6. **Start Development Server**
```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🎨 Customization

### Change Colors
Edit `tailwind.config.ts` to modify SephyrOath color palette:
```ts
colors: {
  'so-primary': '#FF6B35',  // Change this
  'so-gold': '#D4AF37',      // And this
  // ...
}
```

### Add Your Logo/Banner
1. Place images in `public/assets/`
2. Update asset config in database:
```sql
INSERT INTO asset_configs (key, value_url) VALUES 
('global_logo_url', 'https://your-image-url/logo.png'),
('global_banner_url', 'https://your-image-url/banner.png');
```

3. Update components to reference dynamic assets

### Modify Tailwind Theme
All SephyrOath-specific styles use custom classes:
- `.btn-primary` - Primary button style
- `.card-glassmorphism` - Glassmorphic card
- `.text-gradient` - Gradient text effect
- `.glow-text` - Glowing text effect

See `src/styles/globals.css` for all custom components.

---

## 📊 Database Management

### View/Edit Database
```bash
npm run db:studio
```
Opens Prisma Studio at http://localhost:5555

### Create Database Backups
```bash
# PostgreSQL backup
pg_dump sephyroath > backup.sql

# Restore
psql sephyroath < backup.sql
```

### Reset Database (Development Only)
```bash
npm run db:push -- --skip-generate --force-reset
```

---

## 🔐 Security Checklist

Before production deployment:

- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Configure CORS properly
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Configure CSRF protection
- [ ] Validate all file uploads
- [ ] Implement audit logging
- [ ] Set secure session cookies
- [ ] Configure Discord OAuth properly
- [ ] Test authentication flows

---

## 📦 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run generate         # Generate Prisma client
npm run db:migrate       # Run database migrations
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio
```

---

## 🛠️ What's Next?

### Priority 1 (Core Functionality)
- [ ] Implement authentication pages (login, register, password reset)
- [ ] Create admin dashboard
- [ ] Build recruitment application form
- [ ] Implement tryout evaluation system

### Priority 2 (Community Features)
- [ ] Complete forum system with moderation
- [ ] Build member directory with search
- [ ] Implement event RSVP system
- [ ] Create tournament bracket system

### Priority 3 (Integrations)
- [ ] Set up Discord bot for role sync
- [ ] Configure Cloudinary for image uploads
- [ ] Implement email notifications
- [ ] Add analytics tracking

### Priority 4 (Polish)
- [ ] Add comprehensive error handling
- [ ] Implement loading states
- [ ] Add form validation
- [ ] Optimize performance
- [ ] Add unit tests
- [ ] Set up monitoring

---

## 📚 Key Documentation Files

- **README.md**: Comprehensive project overview
- **DESIGN_SYSTEM.md**: Color palette and design reference
- **.env.example**: Environment variable template
- **prisma/schema.prisma**: Database schema reference

---

## 🐛 Troubleshooting

### PostgreSQL Connection Error
- Check DATABASE_URL format
- Ensure PostgreSQL is running
- Verify database exists

### Prisma Client Not Found
```bash
npm run generate
```

### Tailwind Styles Not Applied
- Clear `.next` folder
- Restart dev server
- Check `globals.css` is imported in layout

### Build Fails
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 📞 Support Resources

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **Tailwind**: https://tailwindcss.com/docs
- **NextAuth**: https://next-auth.js.org/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

**Project Status**: Ready for development  
**Last Updated**: May 26, 2026  
**Version**: 1.0.0
