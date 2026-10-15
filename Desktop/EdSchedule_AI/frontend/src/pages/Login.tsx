import React, { useState } from 'react';
import { CalendarDays, Lock, User, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { language, setLanguage } = useLanguage();
  const [username, setUsername] = useState('vice_principal');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top Header */}
        <div className="p-8 text-center bg-slate-50/50 border-b border-slate-100 relative">
          <div className="absolute right-4 top-4 flex bg-slate-100 rounded-lg p-1 text-xs">
            <button
              onClick={() => setLanguage('ru')}
              className={`px-2.5 py-1 rounded font-bold ${language === 'ru' ? 'bg-white shadow text-primary-600' : 'text-slate-500'}`}
            >
              RU
            </button>
            <button
              onClick={() => setLanguage('uz')}
              className={`px-2.5 py-1 rounded font-bold ${language === 'uz' ? 'bg-white shadow text-primary-600' : 'text-slate-500'}`}
            >
              UZ
            </button>
          </div>

          <div className="w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-primary-500/30">
            <CalendarDays className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">EdSchedule AI</h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'uz' ? 'Taʼlim muassasalari uchun intellektual jadval tizimi' : 'Интеллектуальная платформа управления расписанием'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'uz' ? 'Foydalanuvchi nomi yoki Email' : 'Имя пользователя или Email'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'uz' ? 'Parol' : 'Пароль'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{language === 'uz' ? 'Tizimga kirish' : 'Войти в систему'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
