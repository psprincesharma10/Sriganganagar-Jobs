-- Run this once in Supabase Dashboard → SQL Editor → New Query → Run
-- This creates the blog_posts table that the website now reads/writes to,
-- replacing the old localStorage-only blog storage.

create table if not exists public.blog_posts (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  title text not null,
  content text not null,
  category text default 'Other',
  author text default 'Prince Sharma'
);

-- Enable Row Level Security
alter table public.blog_posts enable row level security;

-- Allow anyone (the public anon key used by the website) to read posts
create policy "Public can read blog posts"
on public.blog_posts
for select
to anon
using (true);

-- Allow anyone to insert a new post (matches how Job/Ad posting already works on this site —
-- the "admin" password in BlogPage.tsx is only a soft, front-end gate, not real authentication)
create policy "Public can insert blog posts"
on public.blog_posts
for insert
to anon
with check (true);

-- Allow anyone to delete a post (used by the admin "Delete Post" button)
create policy "Public can delete blog posts"
on public.blog_posts
for delete
to anon
using (true);
