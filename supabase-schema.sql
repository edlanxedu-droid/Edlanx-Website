-- ============================================================
-- SUPERSEDED — the site now uses self-hosted PostgreSQL.
-- See db/schema.sql instead. Kept here only for reference in
-- case of rollback to Supabase.
-- ============================================================
-- Edlanx website leads table
-- Run this once in the Supabase SQL editor for the project you
-- want website registrations to land in. Isolated from the
-- edlanx-titors-ops internal console tables (companies/users/etc).
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists website_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  course_interest text,
  message text,
  source text not null default 'website',
  page_url text,
  user_agent text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists website_leads_created_at_idx on website_leads (created_at desc);
create index if not exists website_leads_status_idx on website_leads (status);

alter table website_leads enable row level security;

-- No policies are defined on purpose: only the service role key
-- (used server-side in /api/lead.js) can read or write this table.
-- The anon/public key used by the website's client-side JS has
-- zero access, so leads can only be written through the API route.

comment on table website_leads is 'Leads captured from the public Edlanx marketing website register/contact forms.';
