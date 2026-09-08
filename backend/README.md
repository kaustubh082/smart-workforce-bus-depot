# Backend setup

1. Create a Supabase project, then run [supabase-schema.sql](supabase-schema.sql) in its SQL Editor.
2. Copy `.env.example` to `.env`, add the Supabase Postgres connection string, and supply a long random JWT secret.
3. Run `npm install`, then `npm run dev`.

Get the connection string from Supabase **Connect**. On an IPv4-only home network, use the Session Pooler connection string. The health check is `GET http://localhost:5000/api/health`.
