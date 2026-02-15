interface HeaderProps {
  title?: string;
}

export function Header({ title = 'My Courses' }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-900">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-lg font-semibold text-gray-900">ByteByteGo</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-base font-medium text-gray-900">{title}</span>
            <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-500" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
