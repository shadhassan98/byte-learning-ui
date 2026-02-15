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

  console.log('[v0] App mounted, current route:', route);

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

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (route.view === 'course' && route.courseId) {
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
}

export default App;
