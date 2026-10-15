import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { GraduationCap, Plus, Upload, Search, Trash2, Edit } from 'lucide-react';

interface TeacherItem {
  id: string;
  name: string;
  department: string;
  workload: number;
  email: string;
}

export const TeachersView: React.FC = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState<TeacherItem[]>([
    { id: '1', name: 'Иванов Алексей Андреевич', department: 'Кафедра точных наук', workload: 18, email: 'ivanov@school.uz' },
    { id: '2', name: 'Каримов Шерзод Тимурович', department: 'Кафедра информационных технологий', workload: 22, email: 'karimov@school.uz' },
    { id: '3', name: 'Смирнов Виктор Петрович', department: 'Кафедра точных наук', workload: 16, email: 'smirnov@school.uz' },
    { id: '4', name: 'Юсупова Нодира Анваровна', department: 'Кафедра информационных технологий', workload: 20, email: 'yusupova@school.uz' },
    { id: '5', name: 'Браун Эмма Сергеевна', department: 'Кафедра иностранных языков', workload: 14, email: 'brown@school.uz' },
  ]);

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {language === 'uz' ? 'Oʻqituvchilar tarkibi' : 'Преподавательский состав'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {language === 'uz' ? 'Oʻqituvchilar roʻyxati, yuklamasi va mavjudligi' : 'Управление списком преподавателей, нагрузкой и доступностью'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">
            <Upload className="w-4 h-4 text-slate-500" />
            {language === 'uz' ? 'Excel / CSV import' : 'Импорт из Excel'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            {language === 'uz' ? 'Oʻqituvchi qoʻshish' : 'Добавить преподавателя'}
          </button>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'uz' ? 'Oʻqituvchini qidirish...' : 'Поиск по ФИО или кафедре...'}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs uppercase font-semibold">
            <tr>
              <th className="p-4">ФИО Преподавателя</th>
              <th className="p-4">Кафедра / Подразделение</th>
              <th className="p-4">Недельная нагрузка</th>
              <th className="p-4">Email</th>
              <th className="p-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(teacher => (
              <tr key={teacher.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xs">
                    {teacher.name.slice(0, 2)}
                  </div>
                  {teacher.name}
                </td>
                <td className="p-4 text-slate-600">{teacher.department}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                    {teacher.workload} ч/нед
                  </span>
                </td>
                <td className="p-4 text-slate-500">{teacher.email}</td>
                <td className="p-4 text-right space-x-2">
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
