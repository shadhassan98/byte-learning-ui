import { useState, useEffect } from 'react';
import { ChevronDown, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Lesson, Section, Course } from '../lib/database.types';

interface LessonDetailProps {
  courseId: string;
  sectionId: string;
  lessonId: string;
  onBack: () => void;
}

export function LessonDetail({ courseId, sectionId, lessonId, onBack }: LessonDetailProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<(Section & { lessons: Lesson[] })[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Python');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const [lessonRes, courseRes, sectionsRes] = await Promise.all([
        supabase.from('lessons').select('*').eq('id', lessonId).maybeSingle(),
        courseId ? supabase.from('courses').select('*').eq('id', courseId).maybeSingle() : Promise.resolve({ data: null }),
        courseId ? supabase.from('sections').select('*').eq('course_id', courseId).order('order') : Promise.resolve({ data: [] })
      ]);

      if (lessonRes.data) setLesson(lessonRes.data);
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
        
        const currentSection = sectionsWithLessons.find(s => 
          s.lessons.some(l => l.id === lessonId)
        );
        if (currentSection) {
          setExpandedSection(currentSection.id);
        }
      }

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

  return (
    <div className="flex min-h-screen">
      <aside className="w-80 bg-[#3D3D3D] text-white flex-shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-300 mb-6">
            {course?.title || 'Coding Interview Patterns'}
          </h2>

          <div className="space-y-2">
            {sections.map((section, index) => (
              <div key={section.id} className="border-b border-gray-600 last:border-0">
                <button
                  onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                  className="w-full flex items-center justify-between py-3 text-left hover:text-white transition-colors"
                >
                  <span className="text-sm font-medium text-gray-300">
                    {String(index + 1).padStart(2, '0')} {section.title}
                  </span>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`}
                  />
                </button>

                {expandedSection === section.id && (
                  <div className="pb-3 space-y-1">
                    {section.lessons.map((sectionLesson) => (
                      <button
                        key={sectionLesson.id}
                        onClick={() => window.location.hash = `lesson/${sectionLesson.id}`}
                        className={`w-full text-left px-4 py-2.5 rounded text-sm transition-colors ${
                          sectionLesson.id === lessonId
                            ? 'bg-[#5A5A5A] text-white font-medium'
                            : 'text-gray-400 hover:bg-[#4A4A4A] hover:text-white'
                        }`}
                      >
                        {sectionLesson.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-8 py-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">{lesson.title}</h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intuition</h2>
              <div className="text-gray-700 text-lg leading-relaxed space-y-4">
                <p className="text-justify">
                  {lesson.content || 'As the name implies, a two-pointer pattern refers to an algorithm that utilizes two pointers. But what is a pointer? It\'s a variable that represents an index or position within a data structure, like an array or linked list. Many algorithms just use a single pointer to attain or keep track of a single element:'}
                </p>
                
                {lesson.content && lesson.content.includes('comparison') && (
                  <>
                    <div className="my-6 text-center">
                      <div className="inline-block font-mono text-sm bg-gray-50 px-4 py-3 rounded">
                        {'[... 14  5  5  20 ...]'}
                        <div className="text-orange-500 mt-1">↑</div>
                      </div>
                    </div>

                    <p className="text-justify">
                      Introducing a second pointer opens a new world of possibilities. Most importantly, we can now make <span className="font-semibold">comparisons</span>. With pointers at two different positions, we can compare the elements at those positions and make decisions based on the comparison:
                    </p>

                    <div className="my-6 flex items-center justify-center gap-4">
                      <div className="font-mono text-sm bg-gray-50 px-4 py-3 rounded">
                        {'[... 14  5  5  20 ...]'}
                        <div className="flex justify-around mt-1">
                          <div className="text-orange-500">↑</div>
                          <div className="text-blue-500">↑</div>
                        </div>
                      </div>
                      <div className="text-sm font-mono bg-gray-50 px-4 py-3 rounded border border-gray-300">
                        {'compare(nums[i], nums[j])\n——→ make decision'}
                      </div>
                    </div>

                    <p className="text-justify">
                      In many cases, such comparisons are made using two nested for-loops, which takes <em>O(n²)</em> time, where n denotes the length of the data structure. In the code snippet below, i and j are two pointers used to compare every two elements of an array:
                    </p>

                    <div className="my-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex gap-2 mb-4 border-b border-gray-300 pb-2">
                        {['Python', 'JavaScript', 'Java', 'Cpp'].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
                              activeTab === tab
                                ? 'bg-white text-gray-900 border-t border-x border-gray-300'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                        <button className="ml-auto p-2 hover:bg-white rounded transition-colors">
                          <Copy className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <pre className="text-sm font-mono text-gray-900 overflow-x-auto">
                        <code>
{`for i in range(n):
    for j in range(i + 1, n):
        compare(nums[i], nums[j])`}
                        </code>
                      </pre>
                    </div>
                  </>
                )}
              </div>
            </section>
          </div>

          <div className="fixed bottom-8 right-8">
            <button className="bg-[#4EEDC4] hover:bg-[#3DD8AF] text-gray-900 font-semibold px-6 py-3 rounded-full shadow-lg transition-colors flex items-center gap-2">
              Ask Alex
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-500" />
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
