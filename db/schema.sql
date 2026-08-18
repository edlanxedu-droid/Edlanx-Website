-- ============================================================
-- Edlanx website — self-hosted PostgreSQL schema
-- Replaces the earlier Supabase-based storage (supabase-schema.sql,
-- kept in the repo for reference only, no longer used).
-- Run once against the target Postgres database:
--   psql "$DATABASE_URL" -f db/schema.sql
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Leads captured from the public site's forms ----------
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
  thank_you_sent boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists website_leads_created_at_idx on website_leads (created_at desc);
create index if not exists website_leads_status_idx on website_leads (status);

comment on table website_leads is 'Leads captured from the public Edlanx marketing website register/contact forms.';

-- ---------- Admin panel users ----------
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

comment on table admin_users is 'Admin panel logins. Created via db/setup-admin.js, never through the website itself.';

-- ---------- Runtime-configurable settings (Brevo, notify emails) ----------
create table if not exists admin_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

comment on table admin_settings is 'Key/value settings editable from the admin panel (Brevo API key, notify addresses). Falls back to matching env vars when a key is absent.';

-- ---------- Editable email templates ----------
create table if not exists email_templates (
  key text primary key,
  subject text not null,
  html_body text not null,
  updated_at timestamptz not null default now()
);

comment on table email_templates is 'Editable HTML email templates. {{placeholder}} tokens are substituted at send time; see lib/templates.js for the allowed token list per key.';

insert into email_templates (key, subject, html_body) values
(
  'internal_notification',
  'New lead: {{full_name}} ({{course_interest}})',
  '<h2>New website lead</h2>
<p><strong>Name:</strong> {{full_name}}</p>
<p><strong>Email:</strong> {{email}}</p>
<p><strong>Phone:</strong> {{phone}}</p>
<p><strong>Course interest:</strong> {{course_interest}}</p>
<p><strong>Message:</strong> {{message}}</p>
<p><strong>Source:</strong> {{source}}</p>
<p><strong>Page:</strong> {{page_url}}</p>'
),
(
  'student_thankyou',
  'Thanks for registering with Edlanx, {{full_name}}!',
  '<div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
  <h2 style="color:#FF4800; margin-bottom: 4px;">Thank you, {{first_name}}!</h2>
  <p>We have received your interest in <strong>{{course_interest}}</strong> at Edlanx.</p>
  <p>One of our academic counsellors will reach out to you shortly on <strong>{{phone}}</strong> or <strong>{{email}}</strong> to walk you through the course, curriculum, and admission process.</p>
  <p>In the meantime, feel free to explore our full course catalog or reach out directly if you have any questions.</p>
  <p style="margin-top: 24px;">
    <a href="{{site_url}}" style="background:#FF4800; color:#fff; padding:10px 20px; border-radius:6px; text-decoration:none; font-weight:bold;">Explore Edlanx</a>
  </p>
  <p style="margin-top: 32px; font-size: 13px; color: #666;">
    Edlanx Private Limited &middot; Bangalore, India<br>
    <a href="tel:+919360840496" style="color:#666;">+91 93608 40496</a> &middot;
    <a href="mailto:support@edlanx.com" style="color:#666;">support@edlanx.com</a>
  </p>
</div>'
)
on conflict (key) do nothing;
