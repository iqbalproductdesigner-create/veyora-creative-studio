# Veyora Creative Studio — PRD

## Original Problem Statement
Build the official, production-grade website for **Veyora Creative Studio** — a creative partner helping Indonesian UMKM & local brands look more professional. Dark, premium, minimal, CMS-ready company-profile site. Primary conversion = WhatsApp consultation (+6285177881357). NOT e-commerce. Copy in Bahasa Indonesia.

## Architecture
- **Stack**: FastAPI + React (CRA) + MongoDB (Motor).
- **Auth**: JWT single-admin (bcrypt), Bearer token in localStorage (`veyora_token`). Seeded on startup from `ADMIN_EMAIL`/`ADMIN_PASSWORD`.
- **CMS collections**: homepage (singleton), settings (singleton), services, portfolio, faqs. Content auto-seeded on first boot (`seed_data.py`).
- **Public API**: GET /api/{homepage,settings,services,services/{slug},portfolio,faqs}. **Admin API** (Bearer): PUT homepage/settings; POST/PUT/DELETE services/portfolio/faqs.
- **Frontend**: React Router. Public `/` (Home) + `/services/:slug` (reusable dynamic Service Detail template). Admin `/admin/login` + protected `/admin` dashboard (tabs: Homepage, Services, Portfolio, FAQ, Settings).
- **Motion/UX**: framer-motion (scroll reveals, kinetic hero word-reveal, portfolio side-drawer) + Lenis smooth scroll. Fonts: Outfit (head), DM Sans (body), Playfair Display (editorial). Brand palette locked (#080D10 bg, #121417 surface, #23262B border, #5C6773 accent, #D9DEE6 secondary).

## User Personas
- UMKM / small business owners (primary) — non-designers, need clarity & trust.
- Growing brands, startups, F&B / fashion / beauty (secondary).
- Admin (single) — manages content via dashboard.

## Core Requirements (static)
Homepage flow: Hero → Statistics → Marquee → Why Choose → Services → Portfolio (drawer) → Working Process → Testimonials → FAQ → Final CTA → Footer. WhatsApp CTAs everywhere. Reusable ServiceCard + one Service Detail template. Portfolio opens side drawer (no new page). Responsive + SEO meta/OG + accessible.

## What's Been Implemented (2025-12)
- Full backend: JWT auth, all public + admin CRUD endpoints, startup seeding (8 services, 6 portfolio, 6 FAQ, homepage, settings). Backend tested 21/21 passing.
- Full public site with premium motion, kinetic hero, editorial marquee, portfolio drawer, dynamic service detail.
- Full admin panel: login + dashboard with 5 CMS panels (Homepage, Services CRUD, Portfolio CRUD, FAQ CRUD, Settings). Tested end-to-end.
- Original Bahasa Indonesia copywriting throughout.

### Iteration 2 (enhancements) — tested 29/29 backend
- **Image upload** in CMS via Emergent Object Storage (`storage.py`, POST /api/admin/upload → absolute URL, public GET /api/files/{path}). ImageUpload + GalleryUpload components; URL paste still supported.
- **Per-page SEO** (react-helmet-async): Home + Service Detail set title/description/OG; `og_image` field added to Service & Portfolio.
- **Portfolio↔Services relationship**: `related_services` (string[] of slugs) via searchable MultiSelect; drawer shows all related services.
- **Dynamic WhatsApp message** per service (`serviceWaMessage`) — pre-filled Bahasa Indonesia template with service name.
- **Auto slug** from title (new services), **Draft/Published** status for Services & Portfolio (drafts hidden from public, visible in admin via GET /api/admin/{services,portfolio}).

## Backlog / Next
- P1: Image upload in CMS (currently URL fields). Would need object storage integration.
- P1: Per-page dynamic SEO/OG injection (react-helmet).
- P2: Portfolio ↔ Service relational picker in CMS (currently slug/id text).
- P2: 404 already handled on service detail only.

## Test Credentials
admin@veyora.studio / veyora2025 (see /app/memory/test_credentials.md)
