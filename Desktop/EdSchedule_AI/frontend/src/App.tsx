import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ScheduleView } from './pages/ScheduleView';
import { ScheduleWizard } from './pages/ScheduleWizard';
import { AIAssistant } from './pages/AIAssistant';
import { TeachersView } from './pages/TeachersView';
import { GroupsView } from './pages/GroupsView';
import { ClassroomsView } from './pages/ClassroomsView';
import { Login } from './pages/Login';
import { api } from './lib/api';

type PageKey = 'dashboard' | 'schedules' | 'wizard' | 'ai' | 'teachers' | 'groups' | 'classrooms';

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (api.isAuthenticated()) {
      api.me()
        .then(() => setIsAuthenticated(true))
        .catch((e: any) => {
          api.clearTokens();
          setError(e.message || 'Ошибка авторизации');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full opacity-20 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">EdSchedule AI</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Загрузка системы...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-red-200 dark:border-red-900 p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ошибка загрузки</h2>
          <p className="text-slate-600 dark:text-slate-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Layout currentPage={currentPage} onNavigate={(page) => setCurrentPage(page)}>
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'schedules' && <ScheduleView />}
      {currentPage === 'wizard' && (
        <ScheduleWizard
          onComplete={() => setCurrentPage('schedules')}
          onCancel={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'teachers' && <TeachersView />}
      {currentPage === 'groups' && <GroupsView />}
      {currentPage === 'classrooms' && <ClassroomsView />}
      {currentPage === 'ai' && <AIAssistant />}
    </Layout>
  );
}

export default App;
