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

  // Settings State
  const [term, setTerm] = useState('2026-spring');
  const [days, setDays] = useState(['mon', 'tue', 'wed', 'thu', 'fri', 'sat']);
  const [duration, setDuration] = useState('80');
  const [minimizeWindows, setMinimizeWindows] = useState(true);

  const steps = language === 'uz' ? [
    { num: 1, title: 'Oʻquv davri' },
    { num: 2, title: 'Maʼlumotlar' },
    { num: 3, title: 'Qoidalar va cheklovlar' },
    { num: 4, title: 'Avtomatik tekshiruv' },
    { num: 5, title: 'Jadval yaratish' }
  ] : [
    { num: 1, title: 'Учебный период' },
    { num: 2, title: 'Учебные данные' },
    { num: 3, title: 'Настройка правил' },
    { num: 4, title: 'Автопроверка' },
    { num: 5, title: 'Создание расписания' }
  ];

  const handleStartGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationComplete(true);
    }, 2500);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Stepper Header */}
      <div className="border-b border-slate-200 bg-slate-50 p-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-3">
                <div className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors",
                  step === s.num ? "bg-primary-600 text-white ring-4 ring-primary-100" :
                  step > s.num ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600"
                )}>
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <div className="hidden md:block">
                  <p className="text-[11px] font-semibold uppercase text-slate-400">Шаг {s.num}</p>
                  <p className="text-xs font-bold text-slate-800">{s.title}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-slate-200 mx-4 hidden md:block" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Body */}
      <div className="p-8 max-w-3xl mx-auto min-h-[380px] flex flex-col justify-between">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Шаг 1. Выберите учебный период и дни</h2>
              <p className="text-sm text-slate-500">Задайте даты семестра и учебные дни заведения.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Период (семестр)</label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="2026-spring">II Семестр (Весенний 2026)</option>
                  <option value="2026-fall">I Семестр (Осенний 2026)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Смена</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                  <option>Первая смена (08:30 - 15:30)</option>
                  <option>Вторая смена (13:30 - 19:30)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Шаг 2. Учебные данные (группы, преподаватели, кабинеты)</h2>
              <p className="text-sm text-slate-500">Используйте данные из базы или загрузите готовый Excel файл.</p>
            </div>
            <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-colors">
              <FileSpreadsheet className="w-10 h-10 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">Перетащите сюда Excel / CSV файл с нагрузкой</p>
              <p className="text-xs text-slate-400 mt-1">Поддерживаются форматы: .xlsx, .csv</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="text-xs text-emerald-900">
                <span className="font-bold">Текущие данные в системе:</span> 42 преподавателя, 18 групп, 24 аудитории готовы к планированию.
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Шаг 3. Правила и оптимизация (Мягкие ограничения)</h2>
              <p className="text-sm text-slate-500">Настройте приоритеты алгоритма генерации расписания.</p>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={minimizeWindows}
                  onChange={(e) => setMinimizeWindows(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-800">Минимизировать окна между парами</div>
                  <div className="text-xs text-slate-500">Алгоритм группирует занятия преподавателей и студентов компактно.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary-600 focus:ring-primary-500" />
                <div>
                  <div className="text-sm font-semibold text-slate-800">Равномерная нагрузка по дням недели</div>
                  <div className="text-xs text-slate-500">Распределяет сложные предметы равномерно со вторника по пятницу.</div>
                </div>
              </label>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Шаг 4. Автоматическая предварительная проверка</h2>
              <p className="text-sm text-slate-500">Система проверяет математическую разрешимость задачи.</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-900 rounded-lg text-sm border border-emerald-200">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Все предметы имеют назначенных преподавателей.</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-900 rounded-lg text-sm border border-emerald-200">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Вместимость аудиторий соответствует количеству студентов в группах.</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-900 rounded-lg text-sm border border-emerald-200">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Временных слотов (30 в неделю) достаточно для размещения 126 часов занятий.</span>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 text-center py-4">
            {!generationComplete ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Готово к автоматической генерации</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Нажмите кнопку ниже, чтобы запустить оптимизацию расписания через Google OR-Tools CP-SAT.
                </p>
                <button
                  disabled={isGenerating}
                  onClick={handleStartGeneration}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-primary-500/25 transition-all text-sm inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {isGenerating ? "Оптимизация расписания..." : "Создать расписание автоматически"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Расписание успешно сгенерировано!</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Все жесткие ограничения соблюдены. Окна минимизированы. Расписание сохранено в виде черновика.
                </p>
                <button
                  onClick={onComplete}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all text-sm"
                >
                  Перейти в календарь расписания
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-6">
          <button
            onClick={step === 1 ? onCancel : () => setStep(step - 1)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? 'Отмена' : 'Назад'}
          </button>

          {step < 5 && (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Далее
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
