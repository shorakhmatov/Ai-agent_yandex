import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Users, Plus, Upload, Search, Trash2, Edit } from 'lucide-react';
import { api } from '../lib/api';

interface GroupItem {
  id: string;
  name: string;
  student_count: number;
  course?: string;
  shift?: string;
}

export const GroupsView: React.FC = () => {
  const { language, institutionType } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', studentCount: 25, course: '1 курс', shift: '1-я смена' });

  useEffect(() => {
    api.groups()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setGroups(list.map((g: any) => ({
          id: g.id,
          name: g.name,
          student_count: g.student_count || 0,
          course: `${(g.current_year || g.course_year || '—').toString()}`,
          shift: g.shift || (institutionType === 'university' ? 'Дневная' : '1-я смена'),
        })));
        setLoading(false);
      })
      .catch((e: any) => {
        console.error('Failed to load groups:', e);
        setError(e.message || (language === 'uz' ? 'Guruhlarni yuklab boʻlmadi' : 'Не удалось загрузить группы'));
        setLoading(false);
      });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroup.name) return;
    try {
      await api.createGroup({ name: newGroup.name, student_count: Number(newGroup.studentCount) });
      const data = await api.groups();
      setGroups(Array.isArray(data) ? data.map((g: any) => ({
        id: g.id, name: g.name, student_count: g.student_count || 0,
      })) : []);
      setNewGroup({ name: '', studentCount: 25, course: '1 курс', shift: '1-я смена' });
      setIsAddOpen(false);
    } catch (err: any) {
      alert(err.message || (language === 'uz' ? 'Xatolik yuz berdi' : 'Ошибка при добавлении'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'uz' ? 'Guruhni oʻchirishni xohlaysizmi?' : 'Удалить группу?')) return;
    try {
      await api.deleteGroup(id);
      setGroups(groups.filter(g => g.id !== id));
    } catch (err: any) {
      alert(err.message || (language === 'uz' ? 'Xatolik yuz berdi' : 'Ошибка при удалении'));
    }
  };

  const filtered = groups.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const getTitle = () => {
    if (institutionType === 'school') return language === 'uz' ? 'Maktab sinflari (1-11)' : 'Учебные классы школы';
    if (institutionType === 'college') return language === 'uz' ? 'Kollej guruhlari' : 'Группы и курсы колледжа';
    return language === 'uz' ? 'Talabalar oqimlari va guruhlar' : 'Студенческие потоки и группы';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 dark:text-slate-400">{language === 'uz' ? 'Yuklanmoqda...' : 'Загрузка...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getTitle()}</h1>
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-semibold">
              {groups.length}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {language === 'uz' ? 'Guruhlar roʻyxati, toʻliqlik darajasi va smenalar' : 'Список контингента, наполняемость и распределение по сменам'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl text-sm font-semibold transition-all">
            <Upload className="w-4 h-4 text-slate-400" />
            <span>Excel / CSV</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'uz' ? 'Qoʻshish' : 'Добавить'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'uz' ? 'Nomi boʻyicha qidirish...' : 'Поиск по наименованию...'}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <span className="text-xs font-semibold text-slate-400 hidden sm:block">
            {language === 'uz' ? `Topildi: ${filtered.length}` : `Найдено: ${filtered.length}`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold">
              <tr>
                <th className="p-4">{language === 'uz' ? 'Nomi' : 'Наименование'}</th>
                <th className="p-4">{language === 'uz' ? 'Parallelnik / Kurs' : 'Параллель / Курс'}</th>
                <th className="p-4">{language === 'uz' ? 'Kontingent' : 'Контингент'}</th>
                <th className="p-4">{language === 'uz' ? 'Smena / Format' : 'Смена / Формат'}</th>
                <th className="p-4 text-right">{language === 'uz' ? 'Amallar' : 'Действия'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(group => (
                <tr key={group.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="p-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                      <Users className="w-4 h-4" />
                    </div>
                    {group.name}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">{group.course || '—'}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60">
                      {group.student_count} уч.
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{group.shift || '—'}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(String(group.id))}
                        className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-sm">
              {language === 'uz' ? 'Maʼlumotlar topilmadi' : 'Нет данных'}
            </div>
          )}
        </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {language === 'uz' ? 'Yangi guruh qoʻshish' : 'Добавить группу'}
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'uz' ? 'Guruh / Sinf nomi' : 'Наименование группы / класса'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={institutionType === 'school' ? '8-Б класс' : 'ИС-21'}
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'uz' ? 'Oʻquvchilar soni' : 'Количество обучающихся'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={newGroup.studentCount}
                  onChange={(e) => setNewGroup({ ...newGroup, studentCount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  {language === 'uz' ? 'Bekor qilish' : 'Отмена'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 transition-colors"
                >
                  {language === 'uz' ? 'Saqlash' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
