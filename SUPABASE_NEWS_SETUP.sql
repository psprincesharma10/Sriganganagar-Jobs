-- =====================================================
-- STEP 1: news_posts table banao
-- SQL Editor → New Snippet → paste karo → Run
-- =====================================================

create table if not exists public.news_posts (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  title text not null,
  content text not null,
  category text default 'Local'
);

-- Row Level Security enable karo
alter table public.news_posts enable row level security;

-- Public read access (website visitors news padh sakein)
create policy "Public can read news posts"
on public.news_posts
for select
to anon
using (true);

-- Public insert access (admin blog page se news add kar sake)
create policy "Public can insert news posts"
on public.news_posts
for insert
to anon
with check (true);

-- Public delete access (admin delete button kaam kare)
create policy "Public can delete news posts"
on public.news_posts
for delete
to anon
using (true);


-- =====================================================
-- STEP 2: 30-din auto-delete (pg_cron)
-- ALAG SNIPPET mein run karo (upar wala run karne ke baad)
-- =====================================================

-- pg_cron extension enable karo (sirf ek baar chahiye)
create extension if not exists pg_cron;

-- Roz raat 12 baje (midnight IST = 18:30 UTC) 30 din purani news delete ho
select cron.schedule(
  'delete-old-news-posts',        -- job ka naam
  '30 18 * * *',                  -- har roz 18:30 UTC = 12:00 midnight IST
  $$
    delete from public.news_posts
    where created_at < now() - interval '30 days';
  $$
);
