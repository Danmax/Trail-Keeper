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
- Admin settings panel gated by an environment-provided master password

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
VITE_ADMIN_MASTER_PASSWORD=your-local-admin-password
```

Run the app:

```bash
npm run dev
```

Then open the local URL shown by Vite.

## Supabase Schema

The app includes SQL in the setup screen. In Supabase, open SQL Editor, paste the generated schema, and run it before relying on synced entries, trails, caches, or journal data.

## Notes

Vite `VITE_*` variables are exposed to browser builds. Do not store private server secrets in this frontend app. The admin password is a local UI gate, not backend authorization.
