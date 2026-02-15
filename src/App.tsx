import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CoursesGrid } from './components/CoursesGrid';
import { CourseDetail } from './components/CourseDetail';
import { LessonDetail } from './components/LessonDetail';
import { TrendingUp, Award, Users } from 'lucide-react';

type View = 'home' | 'course' | 'lesson';

interface RouteState {
  view: View;
  courseId?: string;
  sectionId?: string;
  lessonId?: string;
}

function App() {
  const [route, setRoute] = useState<RouteState>({ view: 'home' });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);

      if (!hash) {
        setRoute({ view: 'home' });
        return;
      }

      if (hash.startsWith('course/')) {
        const courseId = hash.replace('course/', '');
        setRoute({ view: 'course', courseId });
      } else if (hash.startsWith('lesson/')) {
        const lessonId = hash.replace('lesson/', '');
        setRoute({ view: 'lesson', lessonId });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (route.view === 'course' && route.courseId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CourseDetail
          courseId={route.courseId}
          onBack={() => {
            window.location.hash = '';
            setRoute({ view: 'home' });
          }}
          onSelectLesson={(lessonId) => {
            window.location.hash = `lesson/${lessonId}`;
            setRoute({ view: 'lesson', courseId: route.courseId, lessonId });
          }}
        />
      </div>
    );
  }

  if (route.view === 'lesson' && route.lessonId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <LessonDetail
          courseId={route.courseId || ''}
          sectionId={route.sectionId || ''}
          lessonId={route.lessonId}
          onBack={() => {
            window.location.hash = '';
            setRoute({ view: 'home' });
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h2>
          <p className="text-gray-600">Continue your learning journey and master system design</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Courses Enrolled</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-sm text-gray-600">Courses Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">156h</p>
                <p className="text-sm text-gray-600">Total Learning Time</p>
              </div>
            </div>
          </div>
        </div>

        <CoursesGrid
          onSelectCourse={(courseId) => {
            window.location.hash = `course/${courseId}`;
            setRoute({ view: 'course', courseId });
          }}
        />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-600">
            © 2024 ByteByteGo. Master system design through visual learning.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
