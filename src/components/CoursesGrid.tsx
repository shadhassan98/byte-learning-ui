import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Course } from '../lib/database.types';
import { CourseCard } from './CourseCard';
import { Loader2 } from 'lucide-react';

interface CoursesGridProps {
  onSelectCourse?: (courseId: string) => void;
}

export function CoursesGrid({ onSelectCourse }: CoursesGridProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {courses.map((course) => (
        <div key={course.id} onClick={() => onSelectCourse?.(course.id)}>
          <CourseCard course={course} />
        </div>
      ))}
    </div>
  );
}
