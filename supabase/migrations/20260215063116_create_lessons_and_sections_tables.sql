/*
  # Create Lessons and Sections Tables

  1. New Tables
    - `sections`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `title` (text) - Section title
      - `order` (integer) - Order in course
      - `created_at` (timestamptz)

    - `lessons`
      - `id` (uuid, primary key)
      - `section_id` (uuid, foreign key)
      - `title` (text) - Lesson title
      - `content` (text) - Lesson content (markdown)
      - `order` (integer) - Order in section
      - `duration` (text) - Duration to complete
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
*/

CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  duration text NOT NULL DEFAULT '5 min',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sections are viewable by everyone"
  ON sections FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Lessons are viewable by everyone"
  ON lessons FOR SELECT
  TO anon, authenticated
  USING (true);