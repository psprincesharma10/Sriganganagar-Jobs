-- Run this once in Supabase SQL Editor.
-- Adds image support to blog posts:
--  - header_image: main image shown above the title (both in the blog card
--    thumbnail and at the top of the full post)
--  - images: up to 3 more images (JSON array of base64 image strings),
--    automatically spaced through the paragraphs of the post content,
--    with the last one always shown at the very end.

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS header_image TEXT,
  ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
