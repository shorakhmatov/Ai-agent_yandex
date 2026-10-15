import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ScheduleView } from './pages/ScheduleView';
import { ScheduleWizard } from './pages/ScheduleWizard';
import { AIAssistant } from './pages/AIAssistant';
import { TeachersView } from './pages/TeachersView';
import { GroupsView } from './pages/GroupsView';
import { ClassroomsView } from './pages/ClassroomsView';
import { Login } from './pages/Login';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'schedules' | 'wizard' | 'ai' | 'teachers' | 'groups' | 'classrooms' | 'login'>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={(page) => setCurrentPage(page)}
    >
      {currentPage === 'dashboard' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setCurrentPage('wizard')}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow-md transition-colors"
            >
              + Создать расписание (Мастер)
            </button>
          </div>
          <Dashboard />
        </div>
      )}

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
