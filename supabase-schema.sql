-- SpendSight Supabase Schema
-- Run this in the Supabase SQL Editor to set up your tables

create table audits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  tool_inputs jsonb not null,
  audit_results jsonb not null,
  total_monthly_savings numeric,
  total_annual_savings numeric,
  savings_category text,
  ai_summary text,
  is_public boolean default true,
  share_slug text unique
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  audit_id uuid references audits(id),
  email text not null,
  company_name text,
  role text,
  team_size integer,
  is_high_value boolean,
  email_sent boolean default false
);

-- Enable RLS
alter table audits enable row level security;
alter table leads enable row level security;

-- Allow anonymous inserts and public reads for audits
create policy "Anyone can insert audits" on audits for insert with check (true);
create policy "Anyone can read public audits" on audits for select using (is_public = true);
create policy "Anyone can update audits" on audits for update using (true);

-- Allow anonymous inserts for leads
create policy "Anyone can insert leads" on leads for insert with check (true);
