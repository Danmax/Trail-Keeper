# TrailKeeper

TrailKeeper is a mobile-first React app for cataloging outdoor discoveries, building trails, tracking activities, journaling trips, and connecting health/device data.

## Features

- Supabase-backed email auth and data sync
- Discovery catalog for trees, plants, fungi, birds, animals, and landmarks
- Live activity tracker with GPS path and OpenStreetMap tiles
- Trail builder with shareable trail QR mockups
- Geocache and journal views
- Profile name editing with local persistence
- Google Health OAuth client setup using PKCE
- Local settings and connection diagnostics
- Server-side AI species identification through a Supabase Edge Function
- Installable browser app with a web manifest and service worker

## Setup

Install dependencies:

```bash
npm install
```

Create a local environment file from the example:

```bash
cp .env.example .env
```

Configure:

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GOOGLE_HEALTH_CLIENT_ID=your-google-oauth-client-id
VITE_AI_IDENTIFY_URL=https://your-project.supabase.co/functions/v1/identify-species
```

Run the app:

```bash
npm run dev
```

Then open the local URL shown by Vite.

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Install As An App

TrailKeeper includes a web manifest and service worker. On supported browsers, open the deployed site and use the browser's install action to add it to the home screen or app launcher.

## Supabase Schema

The app includes SQL in the setup screen. In Supabase, open SQL Editor, paste the generated schema, and run it before relying on synced entries, trails, caches, or journal data.

## AI Identify Function

The browser app does not call Anthropic directly. Deploy the included Supabase Edge Function and store the Anthropic API key as a Supabase secret:

```bash
supabase secrets set ANTHROPIC_API_KEY=your-anthropic-api-key
supabase functions deploy identify-species
```

Use the deployed function URL as `VITE_AI_IDENTIFY_URL`.

## Security Notes

Vite `VITE_*` variables are exposed to browser builds. Do not store private server secrets in this frontend app. Authorization must be enforced with Supabase Auth, row-level security policies, and Edge Function checks.
