import React, { useState, useEffect } from 'react';
import { CalendarDays, Lock, User, ArrowRight, Sun, Moon, School, GraduationCap, Building2, Sparkles, Check, Eye, EyeOff } from 'lucide-react';
import { useLanguage, InstitutionType } from '../LanguageContext';
import { api } from '../lib/api';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { language, setLanguage, theme, setTheme, setInstitutionType } = useLanguage();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedInst, setSelectedInst] = useState<InstitutionType>('school');
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (api.isAuthenticated()) {
      api.me()
        .then(() => onLogin())
        .catch(() => api.clearTokens());
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        if (!orgName.trim()) {
          setError(language === 'uz' ? 'Muassasa nomi boʻsh boʻlishi mumkin emas' : 'Название учреждения обязательно');
          setLoading(false);
          return;
        }
        setInstitutionType(selectedInst ?? 'school');
        await api.register({
          username,
          password,
          organization_name: orgName,
          org_type: selectedInst || 'school',
        });
        const tokens = await api.login(username, password);
        api.saveTokens(tokens.access, tokens.refresh);
        onLogin();
      } else {
        if (!username || !password) {
          setError(language === 'uz' ? 'Barcha maydonlarni toʻldiring' : 'Заполните все поля');
          setLoading(false);
          return;
        }
        const tokens = await api.login(username, password);
        api.saveTokens(tokens.access, tokens.refresh);
        onLogin();
      }
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('username') || msg.includes('password')) {
        setError(language === 'uz' ? 'Notoʻgʻri foydalanuvchi nomi yoki parol' : 'Неверный логин или пароль');
      } else {
        setError(msg || (language === 'uz' ? 'Xatolik yuz berdi' : 'Произошла ошибка'));
      }
    } finally {
      setLoading(false);
    }
  };

  const institutions = [
    { id: 'school' as const, icon: School, title: language === 'uz' ? 'Maktab' : 'Школа', desc: language === 'uz' ? '1-11 sinflar va smenalar' : '1-11 классы, 2 смены' },
    { id: 'college' as const, icon: GraduationCap, title: language === 'uz' ? 'Kollej / Texnikum' : 'Колледж', desc: language === 'uz' ? 'Guruhlar, paralar va lab.' : 'Курсы, специальности, пары' },
    { id: 'university' as const, icon: Building2, title: language === 'uz' ? 'Universitet / OTM' : 'Университет', desc: language === 'uz' ? 'Fakultetlar va HEMIS' : 'Факультеты, HEMIS/ECTS' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-4 transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400/5 dark:bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30 mb-4">
            <CalendarDays className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            EdSchedule <span className="text-blue-600 dark:text-blue-400">AI</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
            {language === 'uz'
              ? 'Taʼlim muassasalari uchun intellektual jadval tizimi'
              : 'Интеллектуальная система управления расписанием'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-800 p-8 space-y-6">
          {/* Controls */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
              <button
                onClick={() => setLanguage('ru')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  language === 'ru'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                RU
              </button>
              <button
                onClick={() => setLanguage('uz')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  language === 'uz'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                UZ
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                !isRegister
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {language === 'uz' ? 'Kirish' : 'Вход'}
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                isRegister
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {language === 'uz' ? 'Roʻyxatdan oʻtish' : 'Регистрация'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-3 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {language === 'uz' ? 'Muassasa turi:' : 'Тип учреждения:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {institutions.map((item) => {
                      const Icon = item.icon;
                      const sel = selectedInst === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedInst(item.id)}
                          className={`p-3 rounded-xl border-2 cursor-pointer text-center transition-all flex flex-col items-center gap-1.5 ${
                            sel
                              ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-[10px] font-medium leading-tight">{item.title}</span>
                          {sel && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {language === 'uz' ? 'Muassasa nomi:' : 'Название учреждения:'}
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder={language === 'uz' ? 'Masalan: 42-maktab' : 'Например: Школа №42'}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {language === 'uz' ? 'Foydalanuvchi nomi' : 'Имя пользователя'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {language === 'uz' ? 'Parol' : 'Пароль'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {isRegister
                      ? (language === 'uz' ? 'Roʻyxatdan oʻtish' : 'Зарегистрироваться')
                      : (language === 'uz' ? 'Tizimga kirish' : 'Войти в систему')
                    }
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo info */}
          {!isRegister && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                {language === 'uz' ? 'Demo kirish: vice_principal / password123' : 'Демо-вход: vice_principal / password123'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
