import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { DoorOpen, Plus, Upload, Search, Trash2, Edit } from 'lucide-react';

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
  const [rooms, setRooms] = useState<ClassroomItem[]>([
    { id: '1', name: '101 (Большая лекционная)', capacity: 60, type: 'Лекционная', building: 'Главный корпус' },
    { id: '2', name: '102', capacity: 35, type: 'Стандартная', building: 'Главный корпус' },
    { id: '3', name: '201', capacity: 30, type: 'Стандартная', building: 'Главный корпус' },
    { id: '4', name: '204 (Лаборатория физики)', capacity: 25, type: 'Лаборатория', building: 'Лабораторный корпус' },
    { id: '5', name: 'Компьютерный класс 1', capacity: 30, type: 'Компьютерный класс', building: 'IT Корпус' },
    { id: '6', name: 'Компьютерный класс 2', capacity: 25, type: 'Компьютерный класс', building: 'IT Корпус' },
  ]);

  const filtered = rooms.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {language === 'uz' ? 'Auditoriyalar fondi' : 'Аудиторный фонд'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {language === 'uz' ? 'Xonalar, sigʻim va jihozlar roʻyxati' : 'Управление кабинетами, вместимостью и типами помещений'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">
            <Upload className="w-4 h-4 text-slate-500" />
            {language === 'uz' ? 'Import' : 'Импорт'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            {language === 'uz' ? 'Xona qoʻshish' : 'Добавить аудиторию'}
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
              placeholder="Поиск по номеру или типу аудитории..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs uppercase font-semibold">
            <tr>
              <th className="p-4">Номер / Название</th>
              <th className="p-4">Вместимость</th>
              <th className="p-4">Тип аудитории</th>
              <th className="p-4">Корпус</th>
              <th className="p-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(room => (
              <tr key={room.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-4 font-bold text-slate-900">{room.name}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                    {room.capacity} мест
                  </span>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded text-xs border border-slate-200 bg-slate-50 text-slate-600">
                    {room.type}
                  </span>
                </td>
                <td className="p-4 text-slate-600">{room.building}</td>
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
