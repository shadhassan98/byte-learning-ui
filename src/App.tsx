import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CoursesGrid } from './components/CoursesGrid';
import { CourseDetail } from './components/CourseDetail';
import { LessonDetail } from './components/LessonDetail';

type View = 'home' | 'course' | 'lesson';

interface RouteState {
  view: View;
  courseId?: string;
  sectionId?: string;
  lessonId?: string;
}

function App() {
  const [route, setRoute] = useState<RouteState>({ view: 'home' });

  console.log('[v0] App component rendering, route:', route);

  useEffect(() => {
    console.log('[v0] App useEffect running');
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      console.log('[v0] Hash changed to:', hash);

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

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  console.log('[v0] About to render view:', route.view);

  try {
    if (route.view === 'course' && route.courseId) {
      console.log('[v0] Rendering course view');
      return (
        <div className="min-h-screen bg-gray-50">
          <Header title="My Courses" />
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
      console.log('[v0] Rendering lesson view');
      return (
        <div className="min-h-screen bg-white">
          <Header title="My Courses" />
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

    console.log('[v0] Rendering home view');
    return (
      <div className="min-h-screen bg-white">
        <Header title="Visual Dev Guides" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CoursesGrid
            onSelectCourse={(courseId) => {
              window.location.hash = `course/${courseId}`;
              setRoute({ view: 'course', courseId });
            }}
          />
        </main>
      </div>
    );
  } catch (error) {
    console.error('[v0] Error rendering App:', error);
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-red-700">{String(error)}</p>
        </div>
      </div>
    );
  }
}

export default App;
