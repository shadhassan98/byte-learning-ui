/*
  # Create Courses Table

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text) - Course title
      - `description` (text) - Course description
      - `thumbnail` (text) - Course thumbnail URL
      - `category` (text) - Course category (e.g., "System Design", "Backend")
      - `lessons_count` (integer) - Total number of lessons
      - `duration` (text) - Estimated duration (e.g., "8 hours")
      - `level` (text) - Course level (beginner, intermediate, advanced)
      - `progress` (integer) - User progress percentage (0-100)
      - `is_featured` (boolean) - Whether course is featured
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `courses` table
    - Add policy for public read access (courses are viewable by all)
*/

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  thumbnail text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  lessons_count integer NOT NULL DEFAULT 0,
  duration text NOT NULL DEFAULT '0 hours',
  level text NOT NULL DEFAULT 'beginner',
  progress integer NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses are viewable by everyone"
  ON courses FOR SELECT
  TO anon, authenticated
  USING (true);