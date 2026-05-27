# SephyrOath Website Fixes - Bugfix Design


## Overview

The SephyrOath Gaming Website has eight categories of broken or missing functionality across its admin panel and public-facing pages. The platform is built with Next.js 14 (App Router), Prisma ORM, PostgreSQL, and NextAuth.js. The site structure, navigation, and page shells already exist — this design focuses exclusively on fixing defective behavior and completing missing features without redesigning the site.

The fixes are:
1. **Tournament Management** — simplify the form, make `gameId` optional, add date validation, add Publish/Unpublish toggle
2. **Hall of Fame Member Dropdown** — fix empty dropdown by fetching `MemberProfile` records correctly, add searchable member selector
3. **Recruitment Form** — replace `gameId` dropdown with free-text game name field, add "Games You Currently Play" tag input
4. **Member Directory CRUD** — add full Create/Edit/Delete UI for the standalone `Member` model
5. **File Upload System** — replace URL text inputs with functional Cloudinary-backed file upload components
6. **Social Media Management** — support multiple links per platform, make all frontend pages fetch links dynamically
7. **Emergency Announcement System** — implement `GlobalAnnouncement` API, admin UI, and frontend banner component
8. **Ownership Protection & Audit Logging** — require OWNER approval for social link deletion, write all mutations to `AuditLog`

The fix strategy is minimal and targeted: change only what is broken, preserve all working functionality.


## Glossary

- **Bug_Condition (C)**: The condition that triggers a defect — the specific input state or code path that causes incorrect behavior
- **Property (P)**: The desired correct behavior when the bug condition holds — what the fixed code must produce
- **Preservation**: Existing working behavior that must remain unchanged after the fix is applied
- **F**: The original (unfixed) function or component
- **F'**: The fixed function or component
- **Member**: The standalone `Member` model in Prisma (`id`, `ign`, `gender`, `joinedAt`, `gameId`) — used for the public member directory
- **MemberProfile**: The `MemberProfile` model linked to a `User` account via `userId` — used for Hall of Fame achievements and authenticated member features
- **GlobalAnnouncement**: The `GlobalAnnouncement` Prisma model (`id`, `title`, `content`, `severity`, `isActive`, `expiresAt`) — currently exists in the schema but has no API, admin UI, or frontend display
- **AuditLog**: The `AuditLog` Prisma model that records admin actions — currently exists in the schema but is never written to by any API route
- **SocialMediaLink**: The `SocialMediaLink` Prisma model with a `@@unique([platform])` constraint — currently prevents multiple links per platform
- **tournamentType**: A display-only string field to be added to the Tournament form (e.g., "Solo", "Duo", "Squad") — not a Prisma enum, stored as a plain string in `description` or a new field
- **Cloudinary**: The file storage provider already installed (`cloudinary` package in `package.json`) — to be used for all image uploads
- **`/api/assets/[key]`**: Existing API route for `AssetConfig` key-value storage — not used for the file upload fix; Cloudinary upload API will be a new route
- **`requireAdminAccess`**: Utility in `src/lib/rbac.ts` that returns `true` for `OWNER`, `ADMIN`, and `STAFF_ADMIN` roles
- **`isAdmin`**: Utility in `src/lib/admin-utils.ts` that returns `true` only for `ADMIN` and `OWNER` roles


## Bug Details

### Bug Condition

The defects span eight distinct areas. Each has a formal bug condition below.

**Formal Specification:**

```
FUNCTION isTournamentFormBroken(X)
  INPUT: X of type TournamentFormSubmission
  OUTPUT: boolean
  RETURN (X.gameId IS NOT NULL AND Game.findById(X.gameId) IS NULL)
         OR (X.endDate IS NOT NULL AND X.endDate < X.startDate AND form ACCEPTS submission)
         OR form CONTAINS fields [registrationLink, registrationDeadline, schedule, rules, prizePool]
         OR tournament list HAS NO publish_toggle_button
END FUNCTION

FUNCTION isHallOfFameDropdownBroken(X)
  INPUT: X of type AdminHallOfFameFormLoad
  OUTPUT: boolean
  RETURN fetchMembers() CALLS /api/members
         AND /api/members RETURNS MemberProfile records
         AND MemberProfile.count() = 0
         AND Member.count() > 0
END FUNCTION

FUNCTION isRecruitmentFormBroken(X)
  INPUT: X of type RecruitmentPageLoad
  OUTPUT: boolean
  RETURN form CONTAINS select_dropdown FOR gameId
         AND Game.count() = 0
         AND form HAS NO text_input FOR gameApplyingFor
         AND form HAS NO tag_input FOR gamesCurrentlyPlaying
END FUNCTION

FUNCTION isMemberCRUDMissing(X)
  INPUT: X of type AdminMembersPageLoad
  OUTPUT: boolean
  RETURN page HAS NO add_member_button
         AND page HAS NO edit_button
         AND page HAS NO delete_button
         AND page FETCHES MemberProfile INSTEAD OF Member
END FUNCTION

FUNCTION isFileUploadNonFunctional(X)
  INPUT: X of type ImageFieldInteraction
  OUTPUT: boolean
  RETURN field IS text_input
         AND NOT file_picker
         AND NOT drag_drop_zone
         AND NOT cloudinary_upload
END FUNCTION

FUNCTION isSocialMediaMultiLinkBlocked(X)
  INPUT: X of type SocialMediaCreateRequest
  OUTPUT: boolean
  RETURN SocialMediaLink.findUnique({ platform: X.platform }) IS NOT NULL
         AND api RETURNS 400 error
         AND schema HAS @@unique([platform]) constraint
END FUNCTION

FUNCTION isGlobalAnnouncementMissing(X)
  INPUT: X of type AnyPageLoad
  OUTPUT: boolean
  RETURN GlobalAnnouncement.count() > 0
         AND page HAS NO banner_component
         AND /api/global-announcements DOES NOT EXIST
         AND admin panel HAS NO global_announcement_section
END FUNCTION

FUNCTION isAuditLogNeverWritten(X)
  INPUT: X of type AdminMutationRequest
  OUTPUT: boolean
  RETURN X.action IN [CREATE, UPDATE, DELETE]
         AND X.resource IN [SocialMediaLink, Member, Tournament, HallOfFameAchievement]
         AND AuditLog.count() UNCHANGED AFTER mutation
END FUNCTION
```

### Examples

**Tournament Management:**
- Admin submits "Blood Strike Championship" with `gameId: "nonexistent-id"` → Prisma throws foreign key error, no user-facing message shown
- Admin submits tournament with `endDate: "2025-01-01"` and `startDate: "2025-06-01"` → form submits successfully, invalid data stored
- Admin views tournament list → no Publish/Unpublish button visible, must open full edit form to change status

**Hall of Fame:**
- Admin opens "Add Achievement" form → "Select Member" dropdown shows zero options even though 5 `Member` records exist (because the API returns `MemberProfile` records, not `Member` records, and no `MemberProfile` records have been created)

**Recruitment Form:**
- Applicant visits `/recruitment` with zero `Game` records in database → "Target Game" dropdown is empty, form cannot be submitted
- Applicant wants to list "Blood Strike, Mobile Legends, Valorant" as games they play → no such field exists on the form

**Member Directory:**
- Admin visits `/admin/members` → sees a read-only list with no Add, Edit, or Delete buttons; the list shows `MemberProfile` data (inGameName, clanRank) instead of `Member` data (ign, gender, joinedAt)

**File Upload:**
- Admin tries to upload a tournament banner → sees a plain text input labeled "Banner URL", no file picker, no preview, no upload

**Social Media:**
- Admin tries to add a backup Facebook account → API returns `400: "Social media link for this platform already exists"`
- Footer component has hardcoded Facebook and TikTok URLs that never update when admin changes them in the panel

**Global Announcement:**
- Admin needs to post an emergency Discord migration notice → no admin UI section exists, no API route exists, no banner appears on any page

**Audit Logging:**
- Admin deletes a social media link → `AuditLog` table remains empty, no record of who deleted what or when
