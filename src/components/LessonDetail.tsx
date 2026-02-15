import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Lesson, Section } from '../lib/database.types';

interface LessonDetailProps {
  courseId: string;
  sectionId: string;
  lessonId: string;
  onBack: () => void;
}

export function LessonDetail({ courseId, sectionId, lessonId, onBack }: LessonDetailProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const [lessonRes, sectionsRes, lessonsRes] = await Promise.all([
        supabase.from('lessons').select('*').eq('id', lessonId).maybeSingle(),
        supabase.from('sections').select('*').eq('course_id', courseId).order('order'),
        supabase.from('lessons').select('*').order('order')
      ]);

      if (lessonRes.data) setLesson(lessonRes.data);
      if (sectionsRes.data) setSections(sectionsRes.data);
      if (lessonsRes.data) setAllLessons(lessonsRes.data);

      setLoading(false);
    };

    fetchData();
  }, [courseId, sectionId, lessonId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!lesson) {
    return <div className="flex justify-center items-center h-screen">Lesson not found</div>;
  }

  const currentLessonIndex = allLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-8 px-4">
          <aside className="lg:col-span-1">
            <button
              onClick={onBack}
              className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Course
            </button>

            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4">Course Content</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {sections.map((section) => (
                  <div key={section.id}>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">{section.title}</h4>
                    <div className="space-y-1 pl-2 border-l-2 border-gray-200">
                      {allLessons
                        .filter(l => {
                          const sectionLessons = allLessons.filter(lesson => {
                            const lessonSection = sections.find(sec =>
                              allLessons.some(les => les.id === lesson.id && les.section_id === sec.id)
                            );
                            return lessonSection?.id === section.id;
                          });
                          return sectionLessons.some(sl => sl.id === l.id);
                        })
                        .map((sectionLesson) => (
                          <button
                            key={sectionLesson.id}
                            onClick={() => window.location.hash = `#lesson/${sectionLesson.id}`}
                            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                              sectionLesson.id === lessonId
                                ? 'bg-blue-100 text-blue-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {sectionLesson.title}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{lesson.duration}</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-6">{lesson.title}</h1>

                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {lesson.content}
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-12 pt-8">
                  <div className="grid grid-cols-2 gap-4">
                    {prevLesson ? (
                      <button
                        onClick={() => window.location.hash = `#lesson/${prevLesson.id}`}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                        <div className="text-sm">
                          <p className="text-gray-600">Previous</p>
                          <p className="font-medium text-gray-900">{prevLesson.title}</p>
                        </div>
                      </button>
                    ) : (
                      <div />
                    )}

                    {nextLesson ? (
                      <button
                        onClick={() => window.location.hash = `#lesson/${nextLesson.id}`}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-right justify-end"
                      >
                        <div className="text-sm">
                          <p className="text-gray-600">Next</p>
                          <p className="font-medium text-gray-900">{nextLesson.title}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
