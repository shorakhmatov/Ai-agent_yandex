import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { DoorOpen, Plus, Upload, Search, Trash2, Edit } from 'lucide-react';
import { api } from '../lib/api';

interface ClassroomItem {
  id: string;
  name: string;
  capacity: number;
  type: string;
  building: string;
}

export const ClassroomsView: React.FC = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [rooms, setRooms] = useState<ClassroomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: '', capacity: 30, type: 'standard', building: '' });

  useEffect(() => {
    api.classrooms()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setRooms(list.map((r: any) => ({
          id: r.id,
          name: r.name,
          capacity: r.capacity || 30,
          type: r.room_type || 'standard',
          building: r.building || '',
        })));
        setLoading(false);
      })
      .catch((e: any) => {
        console.error('Failed to load classrooms:', e);
        setError(e.message || (language === 'uz' ? 'Auditoriyalarni yuklab boʻlmadi' : 'Не удалось загрузить аудитории'));
        setLoading(false);
      });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.name) return;
    try {
      await api.createClassroom({
        name: newRoom.name,
        capacity: Number(newRoom.capacity),
        room_type: newRoom.type,
        building: newRoom.building,
      });
      const data = await api.classrooms();
      setRooms(Array.isArray(data) ? data.map((r: any) => ({
        id: r.id, name: r.name, capacity: r.capacity || 30,
        type: r.room_type || 'standard', building: r.building || '',
      })) : []);
      setNewRoom({ name: '', capacity: 30, type: 'standard', building: '' });
      setIsAddOpen(false);
    } catch (err: any) {
      alert(err.message || (language === 'uz' ? 'Xatolik yuz berdi' : 'Ошибка при добавлении'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'uz' ? 'Auditoriyani oʻchirishni xohlaysizmi?' : 'Удалить аудиторию?')) return;
    try {
      await api.deleteClassroom(id);
      setRooms(rooms.filter(r => r.id !== id));
    } catch (err: any) {
      alert(err.message || (language === 'uz' ? 'Xatolik yuz berdi' : 'Ошибка при удалении'));
    }
  };

  const filtered = rooms.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roomTypeLabel = (t: string) => {
    const map: Record<string, string> = {
      standard: language === 'uz' ? 'Standart' : 'Стандартная',
      lecture: language === 'uz' ? 'Leksion' : 'Лекционная',
      lab: language === 'uz' ? 'Laboratoriya' : 'Лаборатория',
      computer: language === 'uz' ? 'Kompyuter sinfi' : 'Компьютерный класс',
      gym: language === 'uz' ? 'Sport zali' : 'Спортзал',
    };
    return map[t] || t;
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {language === 'uz' ? 'Auditoriyalar fondi' : 'Аудиторный фонд'}
            </h1>
            <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-semibold">
              {rooms.length}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {language === 'uz' ? 'Xonalar, sigʻim va jihozlar roʻyxati' : 'Управление кабинетами, вместимостью и типами помещений'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl text-sm font-semibold transition-all">
            <Upload className="w-4 h-4 text-slate-400" />
            <span>{language === 'uz' ? 'Import' : 'Импорт'}</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'uz' ? 'Xona qoʻshish' : 'Добавить аудиторию'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'uz' ? 'Xona nomi yoki turi boʻyicha qidirish...' : 'Поиск по номеру или типу аудитории...'}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold">
              <tr>
                <th className="p-4">{language === 'uz' ? 'Nomer / Nomi' : 'Номер / Название'}</th>
                <th className="p-4">{language === 'uz' ? 'Sigʻim' : 'Вместимость'}</th>
                <th className="p-4">{language === 'uz' ? 'Turi' : 'Тип аудитории'}</th>
                <th className="p-4">{language === 'uz' ? 'Bino' : 'Корпус'}</th>
                <th className="p-4 text-right">{language === 'uz' ? 'Amallar' : 'Действия'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(room => (
                <tr key={room.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="p-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                      <DoorOpen className="w-4 h-4" />
                    </div>
                    {room.name}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60">
                      {room.capacity} мест
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                      {roomTypeLabel(room.type)}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{room.building || '—'}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(String(room.id))}
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
              {language === 'uz' ? 'Yangi auditoriya qoʻshish' : 'Добавить аудиторию'}
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'uz' ? 'Nomer / Nomi' : 'Номер / Название'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="204 (Лекционная)"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'uz' ? 'Sigʻim (oʻrinlar soni)' : 'Вместимость (количество мест)'}
                </label>
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={newRoom.capacity}
                  onChange={(e) => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'uz' ? 'Auditoriya turi' : 'Тип аудитории'}
                </label>
                <select
                  value={newRoom.type}
                  onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="standard">Стандартная</option>
                  <option value="lecture">Лекционная</option>
                  <option value="lab">Лаборатория</option>
                  <option value="computer">Компьютерный класс</option>
                  <option value="gym">Спортзал</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'uz' ? 'Bino' : 'Корпус'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'uz' ? 'Asosiy bino' : 'Главный корпус'}
                  value={newRoom.building}
                  onChange={(e) => setNewRoom({ ...newRoom, building: e.target.value })}
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
