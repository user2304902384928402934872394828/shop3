import { Wrench } from 'lucide-react';

interface HeaderProps {
  currentView: 'projects' | 'add';
  onViewChange: (view: 'projects' | 'add') => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  return (
    <header className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Wrench className="h-8 w-8 text-orange-500" />
            <h1 className="text-2xl font-bold">AutoShop Pro</h1>
          </div>
          <nav className="flex space-x-4">
            <button
              onClick={() => onViewChange('projects')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'projects'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              View Projects
            </button>
            <button
              onClick={() => onViewChange('add')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'add'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              Add Project
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
