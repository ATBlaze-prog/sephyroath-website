# SephyrOath Gaming Platform

A production-ready, highly secure, fully responsive, and scalable esports community management platform for SephyrOath Gaming.

## 🎯 Project Overview

SephyrOath is a comprehensive gaming community management system supporting:

- **Multi-game Support**: Blood Strike, Mobile Legends, Valorant, PUBG Mobile, COD Mobile
- **Role-Based Access Control**: 9-tier hierarchical permission system (SUPER_ADMIN → VISITOR)
- **Recruitment Workflow**: Application → Tryout Evaluation → Oath Ceremony
- **Community Features**: Forum, Events, Tournaments, Hall of Fame
- **Security**: NextAuth.js, CSRF protection, rate limiting, audit logging
- **Premium Branding**: Dynamic asset injection, SephyrOath dark theme with neon accents

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom SephyrOath theme
- **Animation**: Framer Motion
- **Image Optimization**: Next.js Image component with Cloudinary

### Backend
- **Server**: Node.js + Next.js Server Actions / API Routes
- **Authentication**: NextAuth.js (Credentials + Discord OAuth 2.0)
- **ORM**: Prisma
- **File Storage**: Cloudinary API
- **Deployment**: Vercel Pro or AWS Amplify

### Database
- **Primary**: PostgreSQL
- **Admin Panel**: Prisma Studio

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Discord Bot token (for OAuth)
- Cloudinary account (for image storage)

## 🚀 Getting Started

### 1. Clone or download the project

```bash
cd project
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your configuration:

```bash
cp .env.example .env.local
```

Required variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for dev)
- `NEXTAUTH_SECRET`: Generate with: `openssl rand -base64 32`
- `DISCORD_CLIENT_ID` & `DISCORD_CLIENT_SECRET`: From Discord Developer Portal
- Cloudinary credentials for image uploads

### 4. Set up the database

Generate Prisma client and run migrations:

```bash
npm run generate
npm run db:migrate
```

Or push the schema directly:

```bash
npm run db:push
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
project/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── (pages)/           # Public pages
│   │   ├── auth/              # Authentication pages
│   │   └── admin/             # Admin dashboard
│   ├── components/
│   │   ├── layout/            # Header, Footer, Layout
│   │   ├── common/            # Reusable components
│   │   └── sections/          # Page sections (Hero, etc.)
│   ├── lib/
│   │   ├── auth.ts            # Auth config
│   │   └── utils/             # Helper functions
│   └── styles/
│       └── globals.css        # Global styles
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── tailwind.config.ts         # Tailwind configuration
├── next.config.js             # Next.js configuration
└── package.json
```

## 🎨 Design System

### Color Palette (SephyrOath Theme)

- **Primary Dark**: `#0A0E27` (SO Dark)
- **Darker**: `#050812` (SO Darker)
- **Primary Accent**: `#FF6B35` (Orange-Red)
- **Light Accent**: `#FF8C00`
- **Gold Text**: `#D4AF37`
- **Gold Light**: `#E8C547`
- **Purple**: `#9D4EDD`

### Typography

- **Headings**: Poppins font
- **Body**: Inter font

### Effects

- Glassmorphism (backdrop blur)
- Neon glow shadows
- Particle canvas background
- Smooth animations with Framer Motion

## 🔑 Key Features

### Role-Based Access Control (RBAC)

9 hierarchical roles with specific permissions:
1. **SUPER_ADMIN** - Full global access
2. **CLAN_LEADER** - Org management
3. **CO_LEADER** - Recruitment & tournaments
4. **STAFF_ADMIN** - Tryout scheduling
5. **MODERATOR** - Forum moderation
6. **COMPETITIVE_PLAYER** - Team access
7. **CASUAL_PLAYER** - Member access
8. **RECRUIT** - Limited access
9. **VISITOR** - Public access

### Core Modules

#### Homepage
- Hero section with dynamic banner injection
- Feature highlights
- Stats counter
- Latest announcements
- Call-to-action buttons

#### Games Hub
- List all supported games
- Dynamic roster management
- Recruitment status per game

#### Member Directory
- Search and filter by game, rank, role
- Profile view with achievements
- Activity status tracking

#### Forum System
- Structured sections (General, Game-Specific, Recruitment, Highlights, Feedback)
- Rich text posting with markdown
- Thread management
- Moderation tools

#### Recruitment Workflow
1. **Application Submission**: Player applies with proof files
2. **Application Review**: Admins evaluate submissions
3. **Tryout Scheduling**: Schedule evaluation sessions
4. **Tryout Evaluation**: Record performance metrics
5. **Oath Ceremony**: Acceptance → Oath ceremony → Badge assignment

#### The Creed
- Full oath text display
- Creed code & conduct rules
- Core principles
- Interactive oath acceptance modal

#### Tournaments
- Upcoming/Active/Completed tournaments
- Bracket management
- Cumulative statistics
- MVP tracking

#### Events & Meetings
- Calendar view
- RSVP management ("Attending", "Maybe", "Not Attending")
- Clan meetings, scrims, giveaways

#### Hall of Fame
- Player achievements and badges
- Seasonal awards
- Historic legends vault
- Immutable archive

### Security Features

- CSRF tokens on all forms
- Rate limiting (100 requests/15 min per IP)
- Auto-lockout after 5 failed login attempts
- Input validation and SQL injection prevention
- File upload validation (magic bytes, size limits)
- Audit logging for all admin actions
- Discord OAuth integration
- Session management with NextAuth.js

## 🗄️ Database Schema

Key tables:
- **users**: User accounts and authentication
- **member_profiles**: Clan member data
- **applications**: Recruitment applications
- **tryouts**: Evaluation records
- **achievements**: Badge/achievement definitions
- **audit_logs**: System audit trail
- **games**: Supported game titles
- **rosters**: Game-specific team assignments
- **events**: Clan events and meetings
- **tournaments**: Tournament data and brackets

See `prisma/schema.prisma` for full schema.

## 🔌 Integrations

### Discord OAuth
- User authentication via Discord
- Role synchronization to Discord guild
- Webhook notifications for events

### Cloudinary
- Image uploads with validation
- Dynamic asset injection
- CDN delivery

### Email (Future)
- Transactional emails
- Notifications
- Announcements

## 📦 Build & Deployment

### Production Build

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
# Connect your GitHub repo to Vercel
# Vercel will auto-deploy on push to main
```

### Deploy to AWS Amplify

```bash
# Configure AWS credentials
amplify init
amplify add hosting
amplify publish
```

## 🧪 Testing

```bash
# Unit tests (to be implemented)
npm run test

# E2E tests (to be implemented)
npm run test:e2e
```

## 📝 Environment Variables

See `.env.example` for full list. Key variables:

```
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/sephyroath

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generated-secret

# Discord
DISCORD_CLIENT_ID=your-id
DISCORD_CLIENT_SECRET=your-secret
DISCORD_GUILD_ID=your-guild-id

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

## 🎯 Next Steps

1. **Database**: Configure PostgreSQL and migrate schema
2. **Authentication**: Set up NextAuth with Discord OAuth
3. **Cloudinary**: Configure image storage
4. **Discord Bot**: Create bot for role synchronization
5. **Content**: Populate games, events, and initial data
6. **Frontend**: Complete remaining pages and forms
7. **Backend**: Implement API endpoints for all modules
8. **Testing**: Add unit and E2E tests
9. **Performance**: Optimize images, implement caching
10. **Deployment**: Deploy to Vercel or AWS

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Framer Motion Documentation](https://www.framer.com/motion)

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is proprietary to SephyrOath Gaming.

## 📞 Support

For questions or issues, contact the SephyrOath development team.

---

**Last Updated**: May 2026
**Version**: 1.0.0
**Status**: In Development
