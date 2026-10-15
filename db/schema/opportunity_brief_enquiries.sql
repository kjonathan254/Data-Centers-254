-- DC254 Opportunity Brief enquiries
-- Portable PostgreSQL schema. The current application adapter stores the same
-- logical record in Upstash Redis (src/lib/opportunity-brief-store.ts, keys
-- ob:enquiry:{id} with a 730-day TTL); this schema is the migration target
-- for a relational database when enquiry volume or workflow complexity
-- requires it.
--
-- Application-layer validation (not enforced here on purpose, keeps the
-- schema portable): buyer_type / preferred_format are checked against fixed
-- sets by the POST route, decision_question is capped at 2,000 chars, email
-- is lowercased before storage. Retention: request metadata (referrer,
-- user_agent) is operational minimised data — mirror the Redis 730-day
-- retention when a cleanup job is added.

create extension if not exists pgcrypto;

do $$
begin
  create type opportunity_brief_enquiry_status as enum (
    'new',
    'qualified',
    'quoted',
    'invoiced',
    'paid',
    'delivered',
    'closed',
    'spam'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists opportunity_brief_enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Contact details. Store only what is needed to qualify and answer the enquiry.
  name varchar(120) not null,
  email varchar(254) not null,
  organisation varchar(160) not null,
  role varchar(80) not null,
  buyer_type varchar(32) not null,

  -- The decision question is the most important product-development field.
  decision_question varchar(2000) not null,
  preferred_format varchar(32) not null default 'single-brief',
  source varchar(80) not null default 'opportunity-brief-page',

  status opportunity_brief_enquiry_status not null default 'new',
  consent_to_reply boolean not null default true,
  privacy_version varchar(32) not null default '2026-10-15',

  -- Operational fields. Do not expose these through the public POST route.
  notes text,
  assigned_to varchar(120),
  quoted_amount_cents integer,
  currency char(3),
  last_contacted_at timestamptz,
  closed_at timestamptz,

  -- Request metadata is deliberately minimised and may be null.
  referrer text,
  user_agent text
);

create index if not exists opportunity_brief_enquiries_created_at_idx
  on opportunity_brief_enquiries (created_at desc);

create index if not exists opportunity_brief_enquiries_status_idx
  on opportunity_brief_enquiries (status, created_at desc);

create index if not exists opportunity_brief_enquiries_buyer_type_idx
  on opportunity_brief_enquiries (buyer_type, created_at desc);

create index if not exists opportunity_brief_enquiries_email_idx
  on opportunity_brief_enquiries (lower(email));

create or replace function set_opportunity_brief_enquiry_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists opportunity_brief_enquiries_updated_at
  on opportunity_brief_enquiries;

create trigger opportunity_brief_enquiries_updated_at
before update on opportunity_brief_enquiries
for each row execute function set_opportunity_brief_enquiry_updated_at();
