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
      console.log('[v0] Fetching courses...');
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      console.log('[v0] Courses data:', data);
      console.log('[v0] Courses error:', error);

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('[v0] Error fetching courses:', error);
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

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500 text-lg mb-2">No courses available</p>
        <p className="text-gray-400 text-sm">Please check your Supabase configuration</p>
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
