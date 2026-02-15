-- Seed sample courses matching the design screenshots

-- First, add learners_count column if it doesn't exist
ALTER TABLE courses ADD COLUMN IF NOT EXISTS learners_count integer DEFAULT 0;

-- Clear existing data
TRUNCATE TABLE courses CASCADE;

-- Insert courses matching the screenshots
INSERT INTO courses (title, description, thumbnail, category, lessons_count, learners_count, duration, level, progress, is_featured)
VALUES
  ('How to Write a Good Resume', 'Learn to craft a compelling resume that stands out to recruiters', '', 'Career', 13, 5000, '2 hours', 'beginner', 0, false),
  ('Coding Interview Patterns', 'Master essential patterns for coding interviews', '', 'Interview', 101, 10000, '20 hours', 'intermediate', 0, false),
  ('System Design Interview', 'Prepare for system design interviews at top tech companies', '', 'Interview', 30, 250000, '15 hours', 'advanced', 0, false),
  ('Behavioral Interview', 'Ace your behavioral interviews with proven frameworks', '', 'Interview', 15, 10, '3 hours', 'beginner', 0, false),
  ('Object-Oriented Design Interview', 'Master OOP principles for technical interviews', '', 'Design', 14, 5000, '8 hours', 'intermediate', 0, false),
  ('Machine Learning System Design Interview', 'Design scalable ML systems for interviews', '', 'ML', 11, 25000, '12 hours', 'advanced', 0, false),
  ('Mobile System Design Interview', 'Prepare for mobile system design interviews', '', 'Mobile', 11, 1000, '10 hours', 'intermediate', 0, false),
  ('Generative AI System Design Interview', 'Design Gen AI systems at scale', '', 'AI', 11, 10000, '14 hours', 'advanced', 0, true);

-- Get the "Coding Interview Patterns" course ID
DO $$
DECLARE
  coding_course_id uuid;
  two_pointers_section_id uuid;
  hash_maps_section_id uuid;
BEGIN
  SELECT id INTO coding_course_id FROM courses WHERE title = 'Coding Interview Patterns' LIMIT 1;
  
  -- Insert sections
  INSERT INTO sections (course_id, title, "order")
  VALUES
    (coding_course_id, 'Two Pointers', 1),
    (coding_course_id, 'Hash Maps And Sets', 2)
  RETURNING id INTO two_pointers_section_id;
  
  SELECT id INTO two_pointers_section_id FROM sections WHERE course_id = coding_course_id AND title = 'Two Pointers';
  SELECT id INTO hash_maps_section_id FROM sections WHERE course_id = coding_course_id AND title = 'Hash Maps And Sets';
  
  -- Insert lessons for Two Pointers section
  INSERT INTO lessons (section_id, title, content, "order", duration)
  VALUES
    (two_pointers_section_id, 'Introduction to Two Pointers', 
     'As the name implies, a two-pointer pattern refers to an algorithm that utilizes two pointers. But what is a pointer? It''s a variable that represents an index or position within a data structure, like an array or linked list. Many algorithms just use a single pointer to attain or keep track of a single element:

Introducing a second pointer opens a new world of possibilities. Most importantly, we can now make comparisons. With pointers at two different positions, we can compare the elements at those positions and make decisions based on the comparison:', 
     1, '10 min'),
    (two_pointers_section_id, 'Pair Sum - Sorted', 'Find two numbers that add up to a target in a sorted array', 2, '15 min'),
    (two_pointers_section_id, 'Triplet Sum', 'Find three numbers that sum to zero', 3, '20 min'),
    (two_pointers_section_id, 'Is Palindrome Valid', 'Check if a string is a valid palindrome', 4, '12 min'),
    (two_pointers_section_id, 'Largest Container', 'Find container with most water', 5, '18 min'),
    (two_pointers_section_id, 'Shift Zeros to the End', 'Move all zeros to the end of array', 6, '10 min'),
    (two_pointers_section_id, 'Next Lexicographical Sequence', 'Find next greater permutation', 7, '25 min');
    
  -- Insert lessons for Hash Maps section
  INSERT INTO lessons (section_id, title, content, "order", duration)
  VALUES
    (hash_maps_section_id, 'Introduction to Hash Maps', 'Learn the fundamentals of hash maps and their use cases', 1, '10 min'),
    (hash_maps_section_id, 'Two Sum Problem', 'Solve the classic two sum problem using hash maps', 2, '15 min'),
    (hash_maps_section_id, 'Group Anagrams', 'Group strings that are anagrams of each other', 3, '20 min');
END $$;
