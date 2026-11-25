# Peerbridge Referral Ready

Build "PeerBridge", an award-winning, highly interactive mentorship, local readiness, and referral-matching web application aligned with UN SDGs 8 (Decent Work), 10 (Reduced Inequalities), and 17 (Partnerships for the Goals). The platform closes the "local experience" and referral gap by pairing newcomer/displaced professionals with established local industry mentors in Kenya/East Africa through a structured 3-Session Referral Readiness Roadmap that unlocks direct referrals to hiring partners.

### Visual Style, Brand Logo & Color Palette (Blue & Yellow)
- **Color Palette:** Use a vibrant, trustworthy, modern **Blue & Yellow** theme:
  - **Primary Brand Blue:** Deep Royal Blue (`#1E3A8A`) and Electric Sapphire (`#2563EB`) for primary headers, navigation bars, active tabs, and primary action buttons.
  - **Accent Yellow / Gold:** Warm Golden Yellow (`#FACC15` / `#F59E0B`) for highlight badges, progress indicators, match score pills, celebratory unlock states, and call-to-action accents (ensure crisp high-contrast dark navy text `#0F172A` on yellow buttons/badges for readability).
  - **Background & Surfaces:** Crisp off-white/ice-blue tint (`#F8FAFC` and `#EFF6FF`) for page backgrounds, pure white (`#FFFFFF`) cards with subtle blue-tinted borders (`#DBEAFE`), and soft emerald (`#10B981`) strictly for final "Verified/Completed" checkmarks.
- **Custom Brand Logo:** Create a crisp, custom inline **SVG Logo** in the top-left header (and reuse a mini version on the Verified Referral Certificate):
  - Design a stylized **Golden Yellow (`#FACC15`) arched bridge** connecting two **Royal Blue (`#2563EB`) circular nodes/people icons**, paired with bold **"Peer"** (in Deep Blue `#1E3A8A`) + **"Bridge"** (in Warm Gold `#D97706` / `#F59E0B`) wordmark typography.
- **Presentation Controls:**
  - Include a prominent top **"Demo Role Switcher"** pill bar (styled with blue active states and yellow highlights) allowing the presenter to toggle seamlessly between:
    1. **Candidate / Mentee View**
    2. **Industry Mentor View**
    3. **Hiring Partner Portal**
  - Include a subtle, collapsible **"Judge Demo Guide"** pill in the bottom-right corner (styled in Golden Yellow with dark navy text) outlining the 3-step live demo flow (1. Complete Candidate Roadmap -> 2. Switch to Mentor & Endorse -> 3. Switch to Hiring Partner & Fast-Track) and a **"Reset Demo Data"** button in the header/footer to restore initial seeded state for back-to-back demos.

### Live Impact & SDG KPI Strip (Top of App)
Display a sleek 4-card KPI strip below the header (white cards with blue top borders and yellow icon badges) that dynamically updates in real time as actions happen across the app:
- **Active Mentorship Matches**
- **Referral Readiness Rate** (updates live as sessions complete)
- **Verified Partner Referrals Issued** (increments live when a mentor issues an endorsement)
- **Fast-Tracked Interviews (SDG 8 & 10)** (increments live when a hiring partner schedules an interview)

### Core Interactive Views & Functional Flows

1. **Landing Hero & Candidate Onboarding**
   - Deep Royal Blue (`#1E3A8A`) hero banner with subtle geometric bridge-arch accents and a bright Golden Yellow (`#FACC15`) primary CTA button.
   - Headline: "Turn Global Talent into Local Hires Through Structured Mentorship."
   - Quick-start "Load Sample Candidate" buttons (e.g., "Amina Hassan — Displaced Software Engineer" and "David Osei — Cross-Border Financial Analyst") plus a prominent **"+ Register New Candidate"** button that opens a clean 3-field modal (Full Name, Track: `Software Engineering`, `Finance & Accounting`, or `Healthcare & Public Health`, Origin Country, and Top 3 Skills) to dynamically match them with mentors.

2. **View 1: Candidate / Mentee Workspace**
   - **Smart Mentor Pairing Engine:** Displays top 3 matched local mentors in Nairobi/East Africa with golden yellow match percentage badges (e.g., "96% Match"), mentor bio, company, years of local experience, spoken languages, and a functional Royal Blue **"Request Mentorship"** button.
   - **Interactive 3-Session Referral Readiness Roadmap (Progress Stepper):**
     - **Session 1: Local Market & CV Localization** — Includes an interactive **"Before vs. After Local CV Preview"** toggle showing how foreign job titles translate to local Kenyan/East African standards, plus a notes input to save mentor tips.
     - **Session 2: Mock Interview & Workplace Simulation** — Includes a quick 2-question interactive situational judgment mini-quiz with instant feedback before marking Session 2 complete.
     - **Session 3: Portfolio Audit & Referral Sign-Off** — Includes a 3-item final readiness checklist (LinkedIn/GitHub verified, Local Regulatory brief reviewed, Availability confirmed) that unlocks the **"Request Mentor Endorsement"** button.
   - Completing sessions updates a live **Blue-to-Yellow Referral Readiness Progress Bar** (0% -> 33% -> 67% -> 100%). At 100%, unlock a celebratory **"Verified PeerBridge Referral Card"** featuring the PeerBridge SVG logo, a unique verification code (e.g., `PB-NBO-2026-409`), and a "Copy Referral Link" button.

3. **View 2: Industry Mentor Dashboard**
   - Displays active mentees, blue/yellow session progress bars, and notes saved from completed sessions.
   - Features a functional Golden Yellow **"Issue Official Referral & Endorse to Hiring Partners"** button for mentees at 100% readiness. Clicking it opens an endorsement modal where the mentor selects strength tags (e.g., "Strong Technical Mastery", "Local Compliance Ready", "High Team Adaptability"), writes an endorsement quote, and dispatches the referral to the Hiring Partner Portal.

4. **View 3: Hiring Partner Talent & Referral Portal (SDG 17)**
   - Designed for inclusive partner companies (e.g., Safaricom, Equity Group, Andela, local tech/finance firms) with blue/yellow track filter pills (`All`, `Software Engineering`, `Finance & Accounting`, `Healthcare & Public Health`).
   - Displays a curated feed of **"Referral-Backed Candidates"** with a visual **"Skills Match Breakdown"** bar, completed 3-Session Roadmap badge, the local mentor's name & endorsement quote, and a functional **"Fast-Track to Interview"** button that updates status to "Interview Scheduled" with a confirmation toast.

### Supabase Database Persistence & Seed Data
Connect to our linked Supabase project and create PostgreSQL tables with permissive Row Level Security (RLS) policies for instant demo access:
- `profiles` (`id`, `full_name`, `role`, `headline`, `track`, `origin_country`, `target_location`, `company`, `years_experience`, `languages`, `skills`, `bio`)
- `mentorships` (`id`, `candidate_id`, `mentor_id`, `match_score`, `status`, `session_1_completed`, `session_1_notes`, `session_2_completed`, `session_2_notes`, `session_3_completed`, `session_3_notes`, `created_at`)
- `endorsements_and_referrals` (`id`, `mentorship_id`, `candidate_id`, `mentor_id`, `strength_tags`, `endorsement_quote`, `hiring_status`, `partner_company`, `created_at`)

Automatically seed the database on initial load (if empty) with realistic East African/Kenyan sample profiles across Software Engineering, Finance/Accounting, and Healthcare/Public Health, and ensure all CRUD actions (requesting mentorship, completing sessions, issuing referrals, scheduling interviews, and resetting demo data) sync cleanly with Supabase and show toast notifications.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://peerbridge-referral-ready.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3f20e5ce-4424-4a2f-8823-8c4a6e02c0d1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
