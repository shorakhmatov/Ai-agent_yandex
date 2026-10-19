import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import {
  Calendar,
  Upload,
  Sliders,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  FileSpreadsheet,
  Check
} from 'lucide-react';
import { clsx } from 'clsx';

interface WizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const ScheduleWizard: React.FC<WizardProps> = ({ onComplete, onCancel }) => {
  const { t, language } = useLanguage();
  const [step, setStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationComplete, setGenerationComplete] = useState<boolean>(false);

  const steps = language === 'uz' ? [
    { num: 1, title: 'Oʻquv davri' },
    { num: 2, title: 'Maʼlumotlar' },
    { num: 3, title: 'Qoidalar' },
    { num: 4, title: 'Tekshiruv' },
    { num: 5, title: 'Yaratish' }
  ] : [
    { num: 1, title: 'Учебный период' },
    { num: 2, title: 'Данные' },
    { num: 3, title: 'Правила' },
    { num: 4, title: 'Проверка' },
    { num: 5, title: 'Создание' }
  ];

  const handleStartGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationComplete(true);
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {language === 'uz' ? 'Jadval yaratish ustasi' : 'Мастер создания расписания'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {language === 'uz' ? 'Qadamma-qadam jadvalni sozlang' : 'Пошаговая настройка расписания'}
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between max-w-3xl">
          {steps.map((s, i) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-3">
                <div className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all",
                  step === s.num
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : step > s.num
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                )}>
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <div className="hidden md:block">
                  <p className="text-[10px] font-semibold uppercase text-slate-400">
                    {language === 'uz' ? `${s.num}-qadam` : `Шаг ${s.num}`}
                  </p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{s.title}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-800 mx-4 hidden md:block" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
        {step === 1 && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {language === 'uz' ? '1-qadam: Oʻquv davrini tanlang' : 'Шаг 1: Выберите учебный период'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {language === 'uz' ? 'Semestr va dars kunlarini belgilang' : 'Задайте даты семестра и учебные дни'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'uz' ? 'Semestr' : 'Семестр'}
                </label>
                <select className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option value="2026-spring">II Семестр (Весенний 2026)</option>
                  <option value="2026-fall">I Семестр (Осенний 2026)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'uz' ? 'Smena' : 'Смена'}
                </label>
                <select className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option>{language === 'uz' ? 'Birinchi smena (08:30-15:30)' : 'Первая смена (08:30-15:30)'}</option>
                  <option>{language === 'uz' ? 'Ikkinchi smena (13:30-19:30)' : 'Вторая смена (13:30-19:30)'}</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all"
              >
                {language === 'uz' ? 'Keyingi' : 'Далее'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {language === 'uz' ? '2-qadam: Maʼlumotlarni yuklang' : 'Шаг 2: Загрузите данные'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {language === 'uz' ? 'Excel/CSV faylini yuklang yoki mavjud maʼlumotlardan foydalaning' : 'Загрузите Excel/CSV файл или используйте существующие данные'}
              </p>
            </div>
            <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
              <FileSpreadsheet className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800 dark:text-white">{language === 'uz' ? 'Faylni bu yerga tashlang' : 'Перетащите файл сюда'}</p>
              <p className="text-xs text-slate-400 mt-1">.xlsx, .csv qoʻllab-quvvatlanadi</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div className="text-xs text-emerald-900 dark:text-emerald-200">
                <span className="font-bold">{language === 'uz' ? 'Tizimda tayyor:' : 'Данные в системе готовы:'}</span>
                {' '}{language === 'uz' ? '42 oʻqituvchi, 18 guruh, 24 xona rejalashtirish uchun tayyor' : '42 преподавателя, 18 групп, 24 аудитории готовы к планированию'}
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'uz' ? 'Orqaga' : 'Назад'}
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all"
              >
                {language === 'uz' ? 'Keyingi' : 'Далее'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {language === 'uz' ? '3-qadam: Qoidalar va optimizatsiya' : 'Шаг 3: Правила и оптимизация'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {language === 'uz' ? 'Algoritm parametrlarini sozlang' : 'Настройте параметры алгоритма'}
              </p>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white">{language === 'uz' ? 'Oynalarni minimallashtirish' : 'Минимизировать окна между парами'}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{language === 'uz' ? 'Darslarni zich joylashtirish' : 'Компактное размещение занятий'}</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white">{language === 'uz' ? 'Bir xil yuklama' : 'Равномерная нагрузка'}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{language === 'uz' ? 'Kuchli fanlarni teng taqsimlash' : 'Равномерное распределение сложных предметов'}</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white">{language === 'uz' ? 'Auditoriya samaradorligi' : 'Оптимальное использование аудиторий'}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{language === 'uz' ? 'Katta sinf xonalari samarali foydalanish' : 'Эффективное использование больших аудиторий'}</div>
                </div>
              </label>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'uz' ? 'Orqaga' : 'Назад'}
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all"
              >
                {language === 'uz' ? 'Keyingi' : 'Далее'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {language === 'uz' ? '4-qadam: Avtomatik tekshiruv' : 'Шаг 4: Автоматическая проверка'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {language === 'uz' ? 'Masala yechimining imkoniyatini tekshiramiz' : 'Проверка разрешимости задачи'}
              </p>
            </div>
            <div className="space-y-3">
              {[
                { text: language === 'uz' ? 'Barcha fanlar oʻqituvchilarga tayinlangan' : 'Все предметы имеют назначенных преподавателей', ok: true },
                { text: language === 'uz' ? 'Auditoriya sigʻimi guruhlarga mos' : 'Вместимость аудиторий соответствует группам', ok: true },
                { text: language === 'uz' ? 'Vaqt resurslari yetarli (30 slot/hafta ≥ 126 soat)' : 'Временных слотов достаточно (30/нед ≥ 126 часов)', ok: true },
              ].map((check, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-emerald-900 dark:text-emerald-200">{check.text}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'uz' ? 'Orqaga' : 'Назад'}
              </button>
              <button
                onClick={() => setStep(5)}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all"
              >
                {language === 'uz' ? 'Keyingi' : 'Далее'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 max-w-xl text-center py-4">
            {!generationComplete ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {language === 'uz' ? 'Jadval yaratishga tayyor' : 'Готово к созданию расписания'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {language === 'uz'
                    ? 'Or-Tools CP-SAT yordamida jadvalni avtomatik optimallashtiramiz'
                    : 'Запустим оптимизацию расписания через Google OR-Tools CP-SAT'}
                </p>
                <button
                  disabled={isGenerating}
                  onClick={handleStartGeneration}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all text-sm inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {isGenerating
                    ? (language === 'uz' ? 'Optimallashtirilmoqda...' : 'Оптимизация...')
                    : (language === 'uz' ? 'Jadval yaratish' : 'Создать расписание')
                  }
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {language === 'uz' ? 'Jadval muvaffaqiyatli yaratildi!' : 'Расписание успешно создано!'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {language === 'uz'
                    ? 'Barcha qattiq cheklovlar saqlangan. Jadval loyiha sifatida saqlandi.'
                    : 'Все жесткие ограничения соблюдены. Расписание сохранено как черновик.'}
                </p>
                <div className="flex justify-center gap-3 pt-4">
                  <button
                    onClick={onCancel}
                    className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {language === 'uz' ? 'Bosh sahifa' : 'На главную'}
                  </button>
                  <button
                    onClick={onComplete}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all"
                  >
                    {language === 'uz' ? 'Jadvalga oʻtish' : 'Перейти к расписанию'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
