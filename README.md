# Nomichi Trip Desk

**Built by: Sai Prajpati**

A working web app for Nomichi's trip enquiry and lead pipeline, built for the
Engineering Intern build assignment. Next.js (App Router) + Supabase
(Postgres + Auth) + Vercel.

Three things live here, connected on purpose:

1. **Public enquiry page** — travellers browse open trips and send an enquiry.
2. **Team admin (mini-CRM)** — leads, pipeline stages, call log, owners.
3. **Trips CMS** — the team creates and edits trips without touching code.

## Live links

- App: nomichi-task-round.vercel.app
- Repo: https://github.com/saiprajapati/Nomichi_TaskRound

## Stack

- **Framework:** Next.js 16 (App Router, Server Actions, Server Components), TypeScript
- **Database & auth:** Supabase (Postgres, Row Level Security, Supabase Auth)
- **AI:** Anthropic API (`claude-sonnet-4-6`), called server-side only
- **Styling:** Tailwind CSS v4, Nomichi brand tokens (Rust, Yellow, Ink, Olive, Sand, Cream)
- **Hosting:** Vercel

## Getting started locally

1. **Clone and install**

   ```bash
   git clone <repo-url>
   cd nomichi-trip-desk
   npm install
   ```

2. **Create a Supabase project** at [supabase.com](https://supabase.com), then
   run the migrations in order from the Supabase SQL editor (or via the CLI):

   ```
   supabase/migrations/0001_init.sql   # schema, RLS policies, triggers
   supabase/migrations/0002_seed.sql   # 4 sample trips + 6 sample leads
   ```

3. **Create your first team login.** Go to Supabase Auth → Users → Add user,
   and create one with an email and password. A `team_members` row is
   created automatically by a trigger (`handle_new_team_member`). This is
   what you sign into `/admin` with.

4. **Environment variables.** Copy `.env.example` to `.env.local` and fill in:

   ```
   NEXT_PUBLIC_SUPABASE_URL=          # Project Settings -> API
   NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Project Settings -> API
   ANTHROPIC_API_KEY=                 # console.anthropic.com, for AI assist only
   ```

5. **Run it**

   ```bash
   npm run dev
   ```

   Public page at `http://localhost:3000`, admin at `http://localhost:3000/admin`.

6. **Deploy.** Push to GitHub, import into Vercel, add the same three
   environment variables in the Vercel project settings, deploy.

## What's built

### Public enquiry page (`/`)

- Lists open trips (destination, dates, price including GST, short
  description). Closed trips never appear here — enforced by a Postgres RLS
  policy on `trips`, not just a UI filter.
- Enquiry form: name, phone (validated against Indian mobile format), email,
  trip, group type, preferred month, and a free-text "what are you hoping
  this trip feels like" field.
- Handles empty (no open trips), validation error, and success states. The
  trip is re-checked as still open server-side at submit time, in case it
  closed between page load and submit.

### Team admin (`/admin`)

- Real Supabase Auth login, route-protected (`src/proxy.ts`, Next.js 16's
  renamed `middleware.ts`), with an authoritative session check again at the
  layout level.
- Lead list with search (name, phone, email) and filters (status, trip,
  owner).
- Lead detail: full enquiry context, a six-stage pipeline stepper (New →
  Contacted → Qualified → Vibe check sent → Confirmed, with a separate "not a
  fit" exit), a call log with timestamped notes and a next action field, and
  owner assignment.
- Every status change is logged automatically to `lead_status_events` via a
  Postgres trigger, which powers the activity timeline on the lead page.

### Trips CMS (`/admin/trips`)

- Create, edit, and delete trips. Setting a trip to "closed" pulls it from
  the public page immediately (same RLS policy as above, not a separate
  toggle to remember).

### Dashboard (`/admin/dashboard`)

- Total leads, counts by pipeline stage, leads per trip. The numbers worth a
  glance each morning, nothing more.

### AI assist (on the lead detail page)

Built all three suggested features rather than picking one, since they are
cheap to add once the lead context is loaded and they cover different
moments in a call:

- **Draft WhatsApp message** — first message to a lead, written in Nomichi's
  voice, referencing what the traveller actually said they want.
- **Summarise call log** — the full note history into one line: where this
  stands, what to do next.
- **Read the vibe** — a suggested fit read from the "what are you hoping this
  trip feels like" answer. Always shown as a suggestion with a reason, never
  an automatic decision, and the panel says so on screen.

All three call the Anthropic API from a Server Action (`ai-actions.ts`), so
the API key never reaches the browser.

## Engineering decisions and trade-offs

1. **RLS as the source of truth for "what the public can see," not the UI.**
   A closed trip or someone else's lead data is unreachable at the database
   level, regardless of what the frontend does. The enquiry form also
   re-validates the trip is still open at submit time, not just at page
   load.

2. **Logging pipeline moves automatically, not manually.** A Postgres trigger
   writes to `lead_status_events` on every status change (and on lead
   creation), so the activity timeline is always accurate without the app
   needing to remember to write two tables every time a stage changes.

3. **All three AI features, each doing one honest job.** Rather than one AI
   feature, the lead page has three small ones, each suggesting, never
   deciding. "Read the vibe" especially: it always returns a reason tied to
   what the traveller actually wrote, and is labelled as a suggestion in the
   UI itself, not just in this README.

## What I'd do with another week

- **Row-level security by owner**, so a sales associate only sees their own
  leads by default (the schema already has `owner_id`; this is a policy
  change plus a "my leads / all leads" toggle in the UI).
- **CSV export** of the current filtered lead list.
- **WhatsApp send, not just draft.** Right now the AI drafts a message and
  the team copies it. Wiring to the WhatsApp Business API would close that
  loop.
- **Duplicate lead detection** by phone number, since the same traveller
  enquiring about two trips currently creates two unrelated lead rows.
- **A proper design pass on the public trip cards** with real trip photos,
  once there's a place to store and serve them (Supabase Storage).

## Notes on AI tool use

AI tools were used as development assistants for brainstorming approaches, debugging issues, understanding unfamiliar concepts, and accelerating implementation.

The overall architecture decisions, feature integration, testing, customization, and final code review were done by me. Every generated piece of code was inspected, modified where required, and understood before being included in the final product.

The AI-assisted features inside the application were intentionally designed and implemented as part of the assignment requirements.

## Developer Notes

This project was built independently as part of the Nomichi Engineering Intern assignment.

Key areas I focused on:
- Secure backend design using Supabase Row Level Security.
- Clean separation between public, admin, and CMS functionality.
- Server-side AI integrations without exposing API keys.
- Maintaining data integrity through database triggers and validations.

The goal was not only to make the application work, but to design it in a way that remains maintainable and scalable.
