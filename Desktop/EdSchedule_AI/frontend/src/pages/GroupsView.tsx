import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Users, Plus, Upload, Search, Trash2, Edit } from 'lucide-react';

interface GroupItem {
  id: string;
  name: string;
  studentCount: number;
  course: number;
  shift: string;
}

export const GroupsView: React.FC = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [groups, setGroups] = useState<GroupItem[]>([
    { id: '1', name: 'ИС-21', studentCount: 28, course: 2, shift: '1-я смена' },
    { id: '2', name: 'ИС-22', studentCount: 25, course: 2, shift: '1-я смена' },
    { id: '3', name: 'ЭК-11', studentCount: 24, course: 1, shift: '1-я смена' },
    { id: '4', name: 'ПИ-31', studentCount: 22, course: 3, shift: '2-я смена' },
    { id: '5', name: 'ДИЗ-12', studentCount: 20, course: 1, shift: '2-я смена' },
  ]);

  const filtered = groups.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {language === 'uz' ? 'Oʻquv guruhlari' : 'Учебные группы'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {language === 'uz' ? 'Guruhlar, talabalar soni va smenalarni boshqarish' : 'Список групп, численность студентов и учебные смены'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">
            <Upload className="w-4 h-4 text-slate-500" />
            {language === 'uz' ? 'Import' : 'Импорт'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            {language === 'uz' ? 'Guruh qoʻshish' : 'Добавить группу'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск по названию группы..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs uppercase font-semibold">
            <tr>
              <th className="p-4">Название группы</th>
              <th className="p-4">Курс</th>
              <th className="p-4">Количество студентов</th>
              <th className="p-4">Учебная смена</th>
              <th className="p-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(group => (
              <tr key={group.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-4 font-bold text-slate-900">{group.name}</td>
                <td className="p-4 text-slate-600">{group.course} курс</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                    {group.studentCount} студентов
                  </span>
                </td>
                <td className="p-4 text-slate-600">{group.shift}</td>
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
