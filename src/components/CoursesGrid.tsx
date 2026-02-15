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
  const [filter, setFilter] = useState<string>('all');

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

  const filteredCourses = courses.filter((course) => {
    if (filter === 'all') return true;
    if (filter === 'in-progress') return course.progress > 0 && course.progress < 100;
    if (filter === 'completed') return course.progress === 100;
    if (filter === 'not-started') return course.progress === 0;
    return course.category.toLowerCase() === filter.toLowerCase();
  });

  const categories = ['all', 'in-progress', 'not-started', ...new Set(courses.map((c) => c.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === category
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No courses found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} onClick={() => onSelectCourse?.(course.id)} className="cursor-pointer">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
