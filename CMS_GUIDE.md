# SephyrOath CMS - Quick Start Guide

## 📱 Accessing the Admin Dashboard

1. **Go to**: `https://your-website.com/admin/dashboard`
2. **Login** with your Admin or Owner account
3. You'll see the dashboard overview with statistics

## 🎯 Quick Actions

### Creating an Event

1. Click **"Events"** in the sidebar or **"Create Event"** button on dashboard
2. Fill in the form:
   - **Event Title** - Name of the event
   - **Event Type** - Select from Meeting, Scrim, Practice, Tournament, or Giveaway
   - **Description** - Details about the event
   - **Start Time** - When the event starts
   - **End Time** (optional) - When the event ends
   - **Location** (optional) - Where the event is held
   - **Banner URL** (optional) - Link to banner image
   - **Status** - Draft, Published, or Archived

3. Click **"Create Event"** to publish immediately or save as Draft

✅ **Published events appear on `/events` page automatically**

### Creating a Tournament

1. Click **"Tournaments"** in sidebar
2. Fill in tournament details:
   - **Title** - Tournament name
   - **Description** - What the tournament is about
   - **Start Date** - Tournament start date
   - **Banner** - Tournament banner image
   - **Prize Pool** - What players can win
   - **Max Teams** - Maximum number of teams
   - **Registration Deadline** - Last day to register
   - **Registration Link** - Where players register
   - **Schedule** - Tournament bracket/schedule details
   - **Rules** - Tournament rules

3. Click **"Create Tournament"** to publish

✅ **Published tournaments appear on `/tournaments` page**

### Adding Hall of Fame Achievement

1. Click **"Hall of Fame"** in sidebar
2. Click **"Add Achievement"** button
3. Select:
   - **Member** - Who earned this achievement
   - **Category** - Type of achievement:
     - Major Tournament Champion
     - Scrimmage Champion
     - Home Scrim Champion
     - MVP
     - Best Recruiter
     - Clan Contributor
     - Clan Veteran
     - Special Recognition
4. Add:
   - **Title** - Achievement name
   - **Description** - What they did
   - **Image URL** - Screenshot or achievement image
5. Click **"Add Achievement"**

✅ **Achievements appear on `/hall-of-fame` grouped by category**

### Managing Content

**Edit**: Click the ✏️ **Edit** button on any item
**Delete**: Click the 🗑️ **Delete** button on any item
**Search**: Use browser Ctrl+F to search on the page

---

## 🔐 Permission Levels

### Owner
✅ Full access to everything
✅ Can delete other admin accounts
✅ Can modify website settings

### Admin
✅ Create, edit, publish events
✅ Create, edit, publish tournaments
✅ Add, edit, remove hall of fame entries
✅ Manage member profiles
❌ Cannot remove owner account

### Member
✅ View published content
✅ View their own profile
❌ Cannot create or edit content

---

## 🎨 Content Guidelines

### Events
- Use clear, descriptive titles
- Include date, time, and location when applicable
- Add a banner image for better visibility
- Set status to "Published" to make it visible

### Tournaments
- Include registration details and deadlines
- Add clear tournament rules
- Include prize pool information
- Provide a registration link

### Hall of Fame
- Choose appropriate category
- Add a screenshot or achievement image
- Write a brief description of the accomplishment
- Use the member's in-game name

---

## 🔍 Viewing Live Content

### Events Page
- **URL**: `/events`
- **Shows**: All published events, sorted by date
- **Admin Link**: Manage Events button if logged in as Admin/Owner

### Tournaments Page
- **URL**: `/tournaments`
- **Shows**: All upcoming tournaments with details
- **Admin Link**: Manage Tournaments button if logged in as Admin/Owner

### Hall of Fame Page
- **URL**: `/hall-of-fame`
- **Shows**: All achievements grouped by category
- **Admin Link**: Manage Achievements button if logged in as Admin/Owner

---

## 💡 Tips & Tricks

1. **Draft vs Publish**: Save as draft to work on content before publishing
2. **Banner Images**: Use high-quality images for better appearance
3. **Descriptions**: Make them clear and engaging for members
4. **Categories**: Choose accurate categories for hall of fame entries
5. **Dates**: Always set correct dates and times for events

---

## ❓ Common Questions

**Q: How long does it take for content to appear on the website?**
A: Content appears immediately if published. If not showing, refresh the page (Ctrl+R or Cmd+R).

**Q: Can I edit content after publishing?**
A: Yes! Click the edit button to modify any published content.

**Q: Can members create their own hall of fame entries?**
A: No, only Admins and Owners can create hall of fame entries.

**Q: What if I accidentally delete something?**
A: Unfortunately, deletions are permanent. Always double-check before deleting.

**Q: Can I have multiple admins?**
A: Yes! The Owner can promote other users to Admin role through the database.

**Q: How do I change the Discord invite link?**
A: Update `NEXT_PUBLIC_DISCORD_INVITE` in your Vercel environment variables.

---

## 🚀 You're All Set!

Your CMS is now ready to use. Start creating content and watch your website come to life! 🎉

**For deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**
