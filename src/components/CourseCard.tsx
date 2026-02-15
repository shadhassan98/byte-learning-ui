import { BookOpen, Users } from 'lucide-react';
import type { Course } from '../lib/database.types';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer p-6">
      <div className="mb-4">
        <div className="inline-block px-4 py-2 bg-[#4EEDC4] text-gray-900 text-sm font-semibold rounded-full">
          {course.title}
        </div>
        {course.is_featured && (
          <div className="inline-block ml-2 px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full">
            Coming soon
          </div>
        )}
      </div>

      <div className="aspect-[4/3] bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <div className="text-gray-400 text-sm">Visual content</div>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" />
          <span>{course.lessons_count || 0} Lessons</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span>{course.learners_count ? course.learners_count.toLocaleString() : '0'} Learners</span>
        </div>
      </div>
    </div>
  );
}
