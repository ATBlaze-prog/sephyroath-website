# Asset Management Guide for SephyrOath

## 📁 Local Assets Setup

Your clan branding assets have been copied to:
```
project/public/assets/
├── Logo Only.jpg ................. SephyrOath Dragon Logo
└── SephyrOath Cover.jpg .......... Banner with color palette
```

## 🖼️ Using Assets in Components

### Option 1: Direct Import (Local Files)

```tsx
import Image from 'next/image';
import { ASSETS } from '@/lib/assets';

export default function MyComponent() {
  return (
    <Image
      src={ASSETS.LOGO}           // '/assets/Logo Only.jpg'
      alt="SephyrOath Logo"
      width={48}
      height={48}
      priority
    />
  );
}
```

### Option 2: Using HeroBanner Component

```tsx
import HeroBanner from '@/components/sections/HeroBanner';

export default function Page() {
  return (
    <HeroBanner
      title="Welcome to SephyrOath"
      subtitle="Bound by Oath. Guided by Honor."
      height="h-96"
    />
  );
}
```

### Option 3: Fetch from Database (Dynamic)

```tsx
async function getLogoUrl() {
  const res = await fetch('/api/assets/global_logo_url');
  const { valueUrl } = await res.json();
  return valueUrl;
}
```

## ☁️ Cloudinary Integration (Optional)

To use Cloudinary for image storage and dynamic asset management:

### 1. Create Cloudinary Account
- Visit https://cloudinary.com/users/register/free
- Sign up with email or GitHub
- Get your Cloud Name from the Dashboard

### 2. Get API Credentials
- Cloud Name: visible in Dashboard
- API Key: in Settings > API Keys
- API Secret: in Settings > API Keys

### 3. Update `.env.local`

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Upload Assets to Cloudinary

**Option A: Via Web Dashboard**
1. Go to Cloudinary Media Library
2. Click "Upload"
3. Upload `Logo Only.jpg` and `SephyrOath Cover.jpg`
4. Copy public URLs

**Option B: Via API**

```typescript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const result = await cloudinary.uploader.upload('path/to/logo.jpg', {
  public_id: 'sephyroath_logo',
  folder: 'sephyroath',
});
```

### 5. Store Cloudinary URLs in Database

```typescript
// POST /api/assets
const res = await fetch('/api/assets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    key: 'global_logo_url',
    valueUrl: 'https://res.cloudinary.com/your-cloud/image/upload/v1234/sephyroath_logo.jpg',
  }),
});
```

### 6. Use in Components

```tsx
import { getAssetUrl } from '@/lib/assets';

export default async function Header() {
  const logoUrl = await getAssetUrl('global_logo_url', '/assets/Logo Only.jpg');

  return (
    <Image
      src={logoUrl}  // Fetches from Cloudinary if set, falls back to local
      alt="Logo"
    />
  );
}
```

## 🎨 Color Extraction from Banner

Your SephyrOath Cover banner includes:
- **Primary Dark Background**: #0A0E27
- **Dragon Accent**: Red/Orange neon (#FF6B35)
- **Gold Text**: #D4AF37
- **Purple Highlights**: #9D4EDD

These colors are already configured in `tailwind.config.ts` as custom CSS classes:
- `.bg-so-dark`
- `.text-so-primary`
- `.text-so-gold`

## 📊 Asset Configuration Table

Assets are stored in the database `asset_configs` table:

```sql
SELECT * FROM asset_configs;
-- Returns:
-- key: "global_logo_url"
-- value_url: "https://res.cloudinary.com/.../logo.jpg"
```

To add new assets:

```sql
INSERT INTO asset_configs (key, value_url) VALUES
('global_logo_url', 'https://...'),
('global_banner_url', 'https://...'),
('favicon_url', 'https://...'),
('og_image_url', 'https://...');
```

## 🔧 Next.js Image Optimization

All images use Next.js Image component for:
✅ Automatic format conversion (WebP, AVIF)
✅ Responsive sizing
✅ Lazy loading
✅ Blur placeholder support
✅ CDN caching

```tsx
<Image
  src={imageUrl}
  alt="Description"
  width={800}
  height={400}
  className="object-cover"
  priority  // Only for above-the-fold images
/>
```

## 🚀 Performance Tips

1. **Use `priority` sparingly** - Only for hero/header images
2. **Set explicit widths/heights** - Prevents layout shift
3. **Use object-fit classes** - `object-cover`, `object-contain`, etc.
4. **Enable Cloudinary** - For CDN edge caching globally
5. **Optimize formats** - Cloudinary auto-converts to WebP/AVIF

## 📝 Checking Asset Setup

```bash
# Verify local assets exist
ls -la public/assets/

# View in browser
# Logo: http://localhost:3000/assets/Logo%20Only.jpg
# Banner: http://localhost:3000/assets/SephyrOath%20Cover.jpg

# Check database
npm run db:studio
# Navigate to asset_configs table
```

## 🔐 Security Notes

- Assets are public, don't store sensitive files
- Use Cloudinary transformations for optimization
- Validate file types on upload (PNG, JPG, WebP only)
- Set max file size: 10 MB per spec

## 📚 Resources

- [Next.js Image Documentation](https://nextjs.org/docs/app/api-reference/components/image)
- [Cloudinary SDK Docs](https://cloudinary.com/documentation/node_sdk_reference)
- [Image Optimization Guide](https://web.dev/image-optimization/)

---

**Current Setup**: ✅ Local assets in `/public/assets/`  
**Ready for**: Cloudinary integration or direct local serving  
**Next Step**: Configure Cloudinary for global CDN delivery (optional but recommended)
