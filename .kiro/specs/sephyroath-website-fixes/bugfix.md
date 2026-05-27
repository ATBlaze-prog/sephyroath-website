# Bugfix Requirements Document

## Introduction

The SephyrOath Gaming Website has multiple broken systems, incomplete features, and non-functional CRUD operations across its admin panel and public-facing pages. The platform is built with Next.js 14, Prisma ORM, PostgreSQL, and NextAuth.js. While the structure, navigation, and pages exist, critical functionality is either broken, missing, or only visually stubbed. This document captures all defective behaviors and defines the correct behaviors required to make the website fully production-ready.

The fixes span eight major areas: tournament management, recruitment form, hall of fame member selection, member directory CRUD, file upload system, social media management, emergency announcement system, and ownership protection with audit logging.

---

## Bug Analysis

### Current Behavior (Defect)

**Tournament Management**

1.1 WHEN an administrator submits the Create Tournament form THEN the system fails to create the tournament because the `gameId` field references a `Game` record that may not exist, causing a foreign key constraint error with no user-facing error message.

1.2 WHEN an administrator views the Create Tournament form THEN the system displays a `Registration Link` field, a `Registration Deadline` field, a `Schedule` textarea, a `Rules` textarea, and a `Prize Pool` field alongside the required fields, creating an overly complex form that does not match the simplified requirements.

1.3 WHEN an administrator submits a tournament with an End Date earlier than the Start Date THEN the system accepts the invalid data without displaying a validation error.

1.4 WHEN an administrator submits a tournament with an empty Tournament Name or empty Start Date THEN the API returns a generic error without a clear user-facing validation message in the form.

1.5 WHEN an administrator attempts to Publish or Unpublish a tournament THEN the system has no Publish/Unpublish action — the status can only be changed by editing the full form, with no dedicated toggle action.

1.6 WHEN the tournament form is submitted THEN the system sends `registrationLink`, `registrationDeadline`, `schedule`, `rules`, and `prizePool` fields to the API, which are fields that should be removed from the tournament workflow.

**Hall of Fame — Empty Member Dropdown**

1.7 WHEN an administrator opens the Add Achievement form in the Hall of Fame panel THEN the system displays an empty "Select Member" dropdown because `fetchMembers()` calls `/api/members` which returns `MemberProfile` records, but the Hall of Fame form requires `memberProfileId` — and if no `MemberProfile` records exist (only `Member` records), the dropdown is empty.

1.8 WHEN an administrator searches for a member in the Hall of Fame achievement form THEN the system provides no search functionality — only a plain `<select>` dropdown with no search, no avatar preview, and no IGN display beyond the option text.

**Recruitment Form — Hardcoded Game Dropdown**

1.9 WHEN an applicant views the recruitment form THEN the system displays a "Target Game" dropdown populated from the `Game` database table, which requires administrators to add `Game` records to the database before any applicant can select a game — and if no games exist, the dropdown is empty and the form cannot be submitted.

1.10 WHEN an applicant submits the recruitment form THEN the system requires a `gameId` (a database foreign key) rather than a free-text game name, meaning new games cannot be supported without a database record and code changes.

1.11 WHEN an applicant fills out the recruitment form THEN the system provides no field for "Games You Currently Play" — applicants cannot list multiple games they actively play.

**Member Directory — Incomplete CRUD**

1.12 WHEN an administrator visits the Members Management page (`/admin/members`) THEN the system displays only a read-only list with no Create, Edit, or Delete controls — the page has no form, no add button, and no action buttons.

1.13 WHEN the Members API `GET /api/members` is called THEN the system returns `MemberProfile` records (linked to `User` accounts via `userId`), but the admin Members page is intended to manage standalone `Member` records (the simpler `Member` model with `ign`, `gender`, `gameId`) — the two models are conflated, causing confusion and broken relationships.

**File Upload System — Non-Functional**

1.14 WHEN an administrator attempts to upload a member avatar, tournament banner, event banner, or achievement image THEN the system displays a URL text input field instead of a functional file upload component — no drag-and-drop, no click-to-browse, no file preview, and no actual file storage occurs.

1.15 WHEN an administrator enters a file URL manually in any image field THEN the system stores the raw URL string but performs no validation that the URL points to a valid image, and there is no preview, replace, or delete capability.

**Social Media Management — Missing Features**

1.16 WHEN an administrator tries to add a second link for a platform that already has a record THEN the system returns a `400` error ("Social media link for this platform already exists") with no UI affordance to distinguish official vs. backup accounts for the same platform.

1.17 WHEN social media links are updated in the admin panel THEN the system does not propagate changes to the Homepage, Footer, Recruitment page, or Community Links sections because those pages use hardcoded URLs or do not fetch from `/api/social-media`.

**Emergency Announcement System — Missing**

1.18 WHEN a critical event occurs (e.g., Discord migration, Facebook page replacement, security alert) THEN the system has no global emergency banner — the `GlobalAnnouncement` model exists in the schema but there is no API route, no admin UI, and no frontend banner component to display it.

1.19 WHEN a global announcement is created THEN the system has no mechanism to display it on every page, no dismiss functionality for users, no pin/schedule capability, and no admin controls.

**Ownership Protection & Audit Logging — Missing**

1.20 WHEN an administrator deletes a social media link THEN the system deletes it immediately with no Super Admin approval requirement, no backup, no recovery mechanism, and no audit log entry.

1.21 WHEN any administrator performs a create, update, or delete action on social links, members, tournaments, or achievements THEN the system does not record the action in the `AuditLog` table — the table exists in the schema but is never written to by any API route.

---

### Expected Behavior (Correct)

**Tournament Management**

2.1 WHEN an administrator submits the Create Tournament form THEN the system SHALL create the tournament successfully, treating `gameId` as optional (nullable), and display a success message — no foreign key errors shall occur for missing game references.

2.2 WHEN an administrator views the Create Tournament form THEN the system SHALL display only the following fields: Tournament Name, Tournament Description, Tournament Banner (file upload), Start Date & Time (single datetime picker), End Date & Time (single datetime picker), Tournament Type, Tournament Status, and Maximum Teams or Players — all other fields (Registration Link, Registration Deadline, Schedule, Rules, Prize Pool) SHALL be removed.

2.3 WHEN an administrator submits a tournament with an End Date earlier than the Start Date THEN the system SHALL display a clear validation message ("End date must be after start date") and SHALL NOT submit the form.

2.4 WHEN an administrator submits a tournament with an empty Tournament Name or empty Start Date THEN the system SHALL display inline validation messages on the respective fields and SHALL NOT submit the form.

2.5 WHEN an administrator views a tournament in the list THEN the system SHALL display a Publish/Unpublish toggle button that changes the tournament status between `UPCOMING` and `ONGOING` (published) without requiring the full edit form.

2.6 WHEN the tournament API receives a POST or PUT request THEN the system SHALL accept only the simplified fields (title, description, bannerUrl, startDate, endDate, tournamentType, status, maxTeams) and SHALL ignore or reject registrationLink, registrationDeadline, schedule, rules, and prizePool.

**Hall of Fame — Member Dropdown**

2.7 WHEN an administrator opens the Add Achievement form THEN the system SHALL populate the member selector by fetching all `MemberProfile` records from the database and displaying each member's IGN and avatar — the dropdown SHALL NOT be empty as long as any member profiles exist.

2.8 WHEN an administrator types in the member search field THEN the system SHALL filter the member list in real time by IGN, displaying matching members with their avatar image and IGN text — the administrator SHALL be able to select any matching member.

**Recruitment Form**

2.9 WHEN an applicant views the recruitment form THEN the system SHALL display a free-text input field labeled "Game Applying For" with placeholder text "Enter the name of the game you are applying for (e.g., Blood Strike, Mobile Legends, Valorant)" — no dropdown or database lookup SHALL be required.

2.10 WHEN an applicant submits the recruitment form THEN the system SHALL store the game name as a plain text string in the application record — no `gameId` foreign key SHALL be required for form submission.

2.11 WHEN an applicant fills out the recruitment form THEN the system SHALL display a "Games You Currently Play" tag input field that allows entering multiple game names — each entered game SHALL be stored as a dynamic array in the database with no hardcoded values.

**Member Directory**

2.12 WHEN an administrator visits the Members Management page THEN the system SHALL display a full CRUD interface with: an "Add Member" button that opens a creation form, an Edit button on each member row, and a Delete button on each member row — all actions SHALL function correctly.

2.13 WHEN the Members Management page loads THEN the system SHALL clearly manage the standalone `Member` model (ign, gender, joinedAt, game) and display each member's IGN, gender, join date, and associated game — the page SHALL not conflate `Member` with `MemberProfile`.

**File Upload System**

2.14 WHEN an administrator clicks an image upload area or drags a file onto it THEN the system SHALL open a file browser or accept the dropped file, validate that it is PNG/JPG/JPEG/WEBP and under 10 MB, display a preview of the selected image, show an upload progress indicator, upload the file to storage, and display a success or error message upon completion.

2.15 WHEN an image has been successfully uploaded THEN the system SHALL display the image preview alongside a "Replace Image" button and a "Delete Image" button — clicking Delete SHALL remove the stored file reference and clear the preview.

**Social Media Management**

2.16 WHEN an administrator needs to add a backup account for a platform that already has a primary link THEN the system SHALL support multiple links per platform by distinguishing between "Official Account" and "Backup Account" designations — the unique constraint per platform SHALL be relaxed to allow multiple entries with account type labels.

2.17 WHEN social media links are created, updated, or toggled in the admin panel THEN the system SHALL serve the updated links via `/api/social-media` and all frontend pages (Homepage, Footer, Recruitment, Community Links) SHALL fetch and display links dynamically from that API — no hardcoded URLs SHALL remain.

**Emergency Announcement System**

2.18 WHEN an administrator creates a global announcement via the admin panel THEN the system SHALL save it to the `GlobalAnnouncement` table and display it as a banner on every page of the website — the banner SHALL appear above the main content and SHALL be visible to all visitors.

2.19 WHEN a global announcement banner is displayed THEN the system SHALL provide a dismiss button that hides the banner for the current user session, SHALL support a "pinned" flag that prevents dismissal, SHALL support a scheduled expiry date after which the banner auto-hides, and SHALL display the severity level (INFO, WARNING, CRITICAL) with appropriate color coding.

**Ownership Protection & Audit Logging**

2.20 WHEN an administrator attempts to delete a social media link THEN the system SHALL require Super Admin (OWNER role) approval before the deletion is committed — non-owner admins SHALL see a "Pending Approval" state rather than immediate deletion.

2.21 WHEN any administrator performs a create, update, or delete action on social links, members, tournaments, or achievements THEN the system SHALL write an entry to the `AuditLog` table recording: the administrator's user ID, the action type, the previous state (JSON), the new state (JSON), the IP address, and the timestamp.

---

### Unchanged Behavior (Regression Prevention)

3.1 WHEN an administrator navigates the admin sidebar THEN the system SHALL CONTINUE TO display all existing navigation links (Dashboard, Members, Tournaments, Events, Announcements, Hall of Fame, Social Media, Inbox, Settings) and route correctly to each page.

3.2 WHEN a user visits the public-facing pages (Homepage, The Creed, Games, Members, Hall of Fame, Tournaments, Events, Recruitment) THEN the system SHALL CONTINUE TO render those pages without errors.

3.3 WHEN a user logs in with valid credentials via the login page THEN the system SHALL CONTINUE TO authenticate successfully using NextAuth.js credentials provider and redirect to the admin dashboard.

3.4 WHEN the Announcements management panel is used THEN the system SHALL CONTINUE TO support Create, Edit, Delete, Publish, and Unpublish operations for `Announcement` records as currently implemented.

3.5 WHEN the Events management panel is used THEN the system SHALL CONTINUE TO support Create, Edit, Delete operations for `Event` records as currently implemented.

3.6 WHEN the Application Inbox is accessed THEN the system SHALL CONTINUE TO display submitted recruitment applications with their current status.

3.7 WHEN the Hall of Fame public page is visited THEN the system SHALL CONTINUE TO display existing `HallOfFameAchievement` records with member IGN and category information.

3.8 WHEN the Social Media admin panel lists existing links THEN the system SHALL CONTINUE TO display platform name, URL, enabled/disabled status, and order — existing toggle and delete functionality SHALL remain intact.

3.9 WHEN the Prisma schema is modified for new fields THEN the system SHALL CONTINUE TO maintain all existing model relationships and foreign key constraints without data loss.

3.10 WHEN the recruitment form is submitted with valid data THEN the system SHALL CONTINUE TO create an `Application` record in the database and display a success message to the applicant.

---

## Bug Condition Pseudocode

### Bug Condition Functions

```pascal
FUNCTION isTournamentCreationBroken(X)
  INPUT: X of type TournamentFormSubmission
  OUTPUT: boolean
  RETURN X.gameId IS NOT NULL AND Game.findById(X.gameId) IS NULL
END FUNCTION

FUNCTION isHallOfFameMemberDropdownEmpty(X)
  INPUT: X of type AdminSession
  OUTPUT: boolean
  RETURN MemberProfile.count() = 0 OR fetchMembers() RETURNS MemberProfile records
         WHILE HallOfFame form EXPECTS memberProfileId
END FUNCTION

FUNCTION isRecruitmentGameDropdownBroken(X)
  INPUT: X of type RecruitmentFormLoad
  OUTPUT: boolean
  RETURN Game.count() = 0
END FUNCTION

FUNCTION isMemberCRUDMissing(X)
  INPUT: X of type AdminMembersPageLoad
  OUTPUT: boolean
  RETURN page HAS NO create_button AND page HAS NO edit_button AND page HAS NO delete_button
END FUNCTION

FUNCTION isFileUploadNonFunctional(X)
  INPUT: X of type ImageFieldInteraction
  OUTPUT: boolean
  RETURN field IS text_input AND NOT file_picker AND NOT drag_drop
END FUNCTION
```

### Fix Checking Properties

```pascal
// Property: Tournament Creation Fix
FOR ALL X WHERE isTournamentCreationBroken(X) DO
  result ← createTournament'(X)
  ASSERT result.success = true AND result.error IS NULL
END FOR

// Property: Hall of Fame Member Dropdown Fix
FOR ALL X WHERE isHallOfFameMemberDropdownEmpty(X) DO
  members ← fetchMembersForHallOfFame'()
  ASSERT members.length > 0 WHEN MemberProfile.count() > 0
  ASSERT each member HAS inGameName AND avatarUrl
END FOR

// Property: Recruitment Free-Text Game Fix
FOR ALL X WHERE isRecruitmentGameDropdownBroken(X) DO
  form ← loadRecruitmentForm'()
  ASSERT form HAS text_input FOR gameApplyingFor
  ASSERT form HAS NO select_dropdown FOR gameId
  ASSERT submission DOES NOT REQUIRE gameId foreign key
END FOR

// Property: Member CRUD Fix
FOR ALL X WHERE isMemberCRUDMissing(X) DO
  page ← loadAdminMembersPage'()
  ASSERT page HAS add_member_button
  ASSERT page HAS edit_button FOR each member
  ASSERT page HAS delete_button FOR each member
END FOR
```

### Preservation Checking

```pascal
// Property: Preservation — Existing Admin Navigation
FOR ALL X WHERE NOT isAdminNavBroken(X) DO
  ASSERT adminLayout'(X) = adminLayout(X)
END FOR

// Property: Preservation — Existing Announcement CRUD
FOR ALL X WHERE isAnnouncementOperation(X) DO
  ASSERT announcementsPanel'(X) = announcementsPanel(X)
END FOR

// Property: Preservation — Existing Auth Flow
FOR ALL X WHERE isValidLoginCredentials(X) DO
  ASSERT authenticate'(X) = authenticate(X)
END FOR
```
