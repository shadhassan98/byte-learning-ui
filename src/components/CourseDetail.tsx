import { useState, useEffect } from 'react';
import { ChevronLeft, BookOpen, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Course, Section, Lesson } from '../lib/database.types';

interface CourseDetailProps {
  courseId: string;
  onBack: () => void;
  onSelectLesson: (lessonId: string) => void;
}

export function CourseDetail({ courseId, onBack, onSelectLesson }: CourseDetailProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<(Section & { lessons: Lesson[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const courseRes = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .maybeSingle();

      const sectionsRes = await supabase
        .from('sections')
        .select('*')
        .eq('course_id', courseId)
        .order('order');

      if (courseRes.data) setCourse(courseRes.data);

      if (sectionsRes.data && sectionsRes.data.length > 0) {
        const sectionsWithLessons = await Promise.all(
          sectionsRes.data.map(async (section) => {
            const lessonsRes = await supabase
              .from('lessons')
              .select('*')
              .eq('section_id', section.id)
              .order('order');

            return {
              ...section,
              lessons: lessonsRes.data || []
            };
          })
        );

        setSections(sectionsWithLessons);
      }

      setLoading(false);
    };

    fetchData();
  }, [courseId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!course) {
    return <div className="flex justify-center items-center h-screen">Course not found</div>;
  }

  const totalLessons = sections.reduce((sum, section) => sum + section.lessons.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover rounded-lg mb-6"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{course.title}</h1>
          <p className="text-gray-600 text-lg mb-6">{course.description}</p>

          <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>{totalLessons} lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>{course.duration}</span>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {section.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson.id)}
                    className="w-full px-6 py-4 text-left hover:bg-blue-50 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {lesson.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 flex-shrink-0">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.duration}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
