import React, { useState } from 'react';
import { School, GraduationCap, Building2, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage, InstitutionType } from '../LanguageContext';
import { clsx } from 'clsx';

interface InstitutionSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstitutionSurveyModal: React.FC<InstitutionSurveyModalProps> = ({ isOpen, onClose }) => {
  const { language, institutionType, setInstitutionType } = useLanguage();
  const [selected, setSelected] = useState<InstitutionType>(institutionType || 'school');

  if (!isOpen) return null;

  const institutions = [
    {
      id: 'school',
      icon: School,
      title: language === 'uz' ? 'Maktab / Gimnaziya' : 'Школа / Гимназия',
      desc: language === 'uz' ? '1-11 sinflar, sinf rahbarlari, qoʻngʻiroqlar jadvali va 45 daqiqalik darslar' : '1-11 классы, классные руководители, расписание звонков и 45-минутные уроки',
      features: language === 'uz' ? ['Sinflar boʻyicha taqsimot', 'Smena rejimi (1-2 smena)', 'Qoʻngʻiroqlar jadvali'] : ['Сетки классов (А, Б, В)', 'Двусменный режим', 'Расписание звонков']
    },
    {
      id: 'college',
      icon: GraduationCap,
      title: language === 'uz' ? 'Kollej / Texnikum' : 'Колледж / Лицей / Техникум',
      desc: language === 'uz' ? 'Kurslar va mutaxassisliklar, amaliyot va laboratoriya mashgʻulotlari, juftliklar' : 'Курсы, специальности, лабораторные, практика и пары (80-90 мин)',
      features: language === 'uz' ? ['Mutaxassisliklar', 'Laboratoriyalar', 'Juftliklar (paralar)'] : ['Специальности', 'Лаборатории', 'Пары по 80-90 мин']
    },
    {
      id: 'university',
      icon: Building2,
      title: language === 'uz' ? 'Universitet / OTM' : 'Университет / Институт',
      desc: language === 'uz' ? 'Fakultetlar, kafedralar, kredit-modul (HEMIS/ECTS) tizimi' : 'Факультеты, кафедры, потоковые лекции, HEMIS / ECTS',
      features: language === 'uz' ? ['Kafedralar va Fakultetlar', 'Oqim maʼruzalari', 'Kredit-modul tizimi'] : ['Факультеты и Кафедры', 'Потоковые лекции', 'Кредитно-модульная система']
    }
  ];

  const handleSave = () => {
    setInstitutionType(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-md mx-auto mb-8 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'uz' ? 'Moslashtirish' : 'Персонализация платформы'}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {language === 'uz' ? 'Muassasa turini tanlang' : 'Для кого создается расписание?'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {language === 'uz'
              ? 'Tizim sizning taʼlim shaklingizga mos ravishda resurslar va atamalarni moslashtiradi'
              : 'Система оптимизирует боковую панель, шаблоны звонков и структуру данных под ваш тип учреждения'}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {institutions.map((item) => {
            const isSelected = selected === item.id;
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => setSelected(item.id as InstitutionType)}
                className={clsx(
                  "p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 relative",
                  isSelected
                    ? "border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-md shadow-blue-500/10"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/50"
                )}
              >
                <div className={clsx(
                  "p-3 rounded-xl flex-shrink-0",
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                )}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 pr-6">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={clsx(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                  isSelected
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300 dark:border-slate-600"
                )}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>{language === 'uz' ? 'Tasdiqlash va davom etish' : 'Применить и продолжить'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
