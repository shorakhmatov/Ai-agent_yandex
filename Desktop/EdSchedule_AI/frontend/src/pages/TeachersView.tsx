import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import {
  GraduationCap, Plus, Upload, Search, Trash2, Edit, Mail, BookOpen,
  Clock, ShieldCheck, Zap
} from 'lucide-react';
import { api } from '../lib/api';

interface TeacherItem {
  id: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  department: string;
  workload_hours: number;
  email?: string;
  organization_id?: string;
}

export const TeachersView: React.FC = () => {
  const { language, institutionType } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: '', department: 'Кафедра точных наук', workload: 18, email: '' });

  useEffect(() => {
    api.teachers()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setTeachers(list.map((t: any) => ({
          id: t.id || String(t.teacher_id),
          user_id: t.user?.id || t.teacher_id,
          first_name: t.user?.first_name || '',
          last_name: t.user?.last_name || '',
          middle_name: t.user?.middle_name || t.middle_name || '',
          department: t.department || '—',
          workload_hours: t.max_hours_per_week || 18,
          email: t.user?.email || '',
          organization_id: t.organization_id,
        })));
        setLoading(false);
      })
      .catch((e: any) => {
        console.error('Failed to load teachers:', e);
        setError(e.message || (language === 'uz' ? 'Oʻqituvchilarni yuklab boʻlmadi' : 'Не удалось загрузить преподавателей'));
        setLoading(false);
      });
  }, []);

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.name) return;
    try {
      const nameParts = newTeacher.name.trim().split(' ');
      const last_name = nameParts[0] || '';
      const first_name = nameParts[1] || '';
      const middle_name = nameParts.slice(2).join(' ') || undefined;

      const resp = await fetch('/api/accounts/teachers/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('edschedule_access_token')}` },
        body: JSON.stringify({
          first_name,
          last_name,
          middle_name,
          email: newTeacher.email || `${last_name.toLowerCase()}@edu.uz`,
          department: newTeacher.department,
          max_hours_per_week: Number(newTeacher.workload),
          user: 'create' as any,
          password: 'password123',
        }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ detail: `HTTP ${resp.status}` }));
        throw new Error(err.detail || (language === 'uz' ? 'Xatolik yuz berdi' : 'Ошибка при добавлении'));
      }
      const created = await resp.json();
      setTeachers([{ ...created, department: newTeacher.department, workload_hours: Number(newTeacher.workload) }, ...teachers]);
      setNewTeacher({ name: '', department: 'Кафедра точных наук', workload: 18, email: '' });
      setIsAddModalOpen(false);
    } catch (err: any) {
      alert(err.message || (language === 'uz' ? 'Xatolik yuz berdi' : 'Ошибка при добавлении'));
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    if (!confirm(language === 'uz' ? 'Oʻqituvchini oʻchirishni xohlaysizmi?' : 'Удалить преподавателя?')) return;
    try {
      const resp = await fetch(`/api/accounts/teachers/${teacherId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('edschedule_access_token')}` },
      });
      if (resp.ok) {
        setTeachers(teachers.filter(t => t.id !== teacherId));
      } else {
        const err = await resp.json().catch(() => ({}));
        alert(err.detail || (language === 'uz' ? 'Xatolik yuz berdi' : 'Ошибка при удалении'));
      }
    } catch (err: any) {
      alert(err.message || (language === 'uz' ? 'Xatolik yuz berdi' : 'Ошибка при удалении'));
    }
  };

  const filtered = teachers.filter(t =>
    `${t.first_name} ${t.last_name} ${t.middle_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleLabel = () => {
    if (institutionType === 'university') return language === 'uz' ? 'Professor-oʻqituvchilar' : 'Профессорско-преподавательский состав';
    if (institutionType === 'college') return language === 'uz' ? 'Oʻqituvchilar va ustalar' : 'Преподаватели и мастера';
    return language === 'uz' ? 'Oʻqituvchilar tarkibi' : 'Учителя и предметники';
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getRoleLabel()}</h1>
            <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {teachers.length}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {language === 'uz' ? 'Oʻqituvchilar bazasi, yuklamalar va mavjudlik jadvallari' : 'Управление списком преподавателей, нагрузкой и доступностью'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl text-sm font-semibold transition-all">
            <Upload className="w-4 h-4 text-slate-400" />
            <span>Excel / CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'uz' ? 'Oʻqituvchi qoʻshish' : 'Добавить'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'uz' ? 'F.I.SH yoki kafedra boʻyicha qidirish...' : 'Поиск преподавателя по ФИО...'}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <span className="text-xs font-semibold text-slate-400 hidden sm:block">
            {language === 'uz' ? `Jami: ${filtered.length} ta` : `Всего: ${filtered.length}`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold">
              <tr>
                <th className="p-4">{language === 'uz' ? 'F.I.O.' : 'Преподаватель'}</th>
                <th className="p-4">{language === 'uz' ? 'Kafedra / Fan' : 'Кафедра / Предмет'}</th>
                <th className="p-4">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {language === 'uz' ? 'Haftalik yuklama' : 'Недельная нагрузка'}
                  </div>
                </th>
                <th className="p-4">{language === 'uz' ? 'Aloqa' : 'Контакты'}</th>
                <th className="p-4 text-right">{language === 'uz' ? 'Amallar' : 'Действия'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(teacher => (
                <tr key={teacher.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="p-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/20">
                      {teacher.first_name[0]}{teacher.last_name[0]}
                    </div>
                    <div>
                      <p className="leading-tight text-sm">
                        {teacher.last_name} {teacher.first_name} {teacher.middle_name}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">ID: {teacher.id}</p>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span>{teacher.department}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60">
                      {teacher.workload_hours} ч/нед
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{teacher.email || '—'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(String(teacher.id))}
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

      {/* Add Teacher Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {language === 'uz' ? 'Yangi oʻqituvchi qoʻshish' : 'Добавить преподавателя'}
            </h2>
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'uz' ? 'F.I.O. (Familiya Ism Ot chaqirgʻich)' : 'ФИО (Фамилия Имя Отчество)'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'uz' ? 'Ivanov Aleksey Andreevich' : 'Иванов Алексей Андреевич'}
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'uz' ? 'Kafedra / Yoʻnalish' : 'Кафедра / Направление'}
                </label>
                <select
                  value={newTeacher.department}
                  onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Кафедра точных наук">Кафедра точных наук</option>
                  <option value="Кафедра информационных технологий">Кафедра ИТ</option>
                  <option value="Кафедра иностранных языков">Кафедра иностранных языков</option>
                  <option value="Кафедра гуманитарных дисциплин">Кафедра гуманитарных дисциплин</option>
                  <option value="Физика">Физика</option>
                  <option value="Математика">Математика</option>
                  <option value="Информатика">Информатика</option>
                  <option value="Язык">Язык</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="ivanov@school.uz"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'uz' ? 'Haftalik soatlar soni' : 'Часовая нагрузка в неделю'}
                </label>
                <input
                  type="number"
                  min="2"
                  max="40"
                  value={newTeacher.workload}
                  onChange={(e) => setNewTeacher({ ...newTeacher, workload: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
