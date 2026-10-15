import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ru' | 'uz';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  'nav.dashboard': { ru: 'Панель управления', uz: 'Boshqaruv paneli' },
  'nav.schedules': { ru: 'Расписания', uz: 'Dars jadvallari' },
  'nav.teachers': { ru: 'Преподаватели', uz: 'Oʻqituvchilar' },
  'nav.groups': { ru: 'Группы', uz: 'Guruhlar' },
  'nav.classrooms': { ru: 'Аудитории', uz: 'Xonalar' },
  'nav.ai_assistant': { ru: 'ИИ-Помощник', uz: 'AI-Yordamchi' },
  'nav.settings': { ru: 'Настройки', uz: 'Sozlamalar' },
  'header.search': { ru: 'Поиск...', uz: 'Qidiruv...' },
  'dashboard.total_teachers': { ru: 'Всего преподавателей', uz: 'Jami oʻqituvchilar' },
  'dashboard.total_groups': { ru: 'Всего групп', uz: 'Jami guruhlar' },
  'dashboard.total_classrooms': { ru: 'Всего аудиторий', uz: 'Jami xonalar' },
  'dashboard.active_schedules': { ru: 'Активные расписания', uz: 'Faol jadvallar' },
  'dashboard.recent_activity': { ru: 'Последние действия', uz: 'Oxirgi harakatlar' },
  'schedule.create_button': { ru: 'Создать расписание', uz: 'Jadval yaratish' },
  'schedule.wizard_title': { ru: 'Мастер создания расписания', uz: 'Jadval yaratish ustasi' },
  'schedule.publish': { ru: 'Опубликовать', uz: 'Nashr qilish' },
  'schedule.draft': { ru: 'Черновик', uz: 'Qoralama' },
  'ai.placeholder': { ru: 'Спросите что-нибудь у ИИ...', uz: 'AI-dan biror narsa soʻrang...' },
  'ai.send': { ru: 'Отправить', uz: 'Yuborish' },
  'common.loading': { ru: 'Загрузка...', uz: 'Yuklanmoqda...' },
  'common.error': { ru: 'Ошибка', uz: 'Xato' },
  'common.save': { ru: 'Сохранить', uz: 'Saqlash' },
  'common.cancel': { ru: 'Отмена', uz: 'Bekor qilish' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('edschedule_lang');
    return (saved === 'ru' || saved === 'uz') ? saved : 'ru';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('edschedule_lang', lang);
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
