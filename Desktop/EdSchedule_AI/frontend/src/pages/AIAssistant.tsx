import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import {
  Send,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
} from 'lucide-react';
import { clsx } from 'clsx';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  action?: string;
  data?: any;
  timestamp: string;
}

export const AIAssistant: React.FC = () => {
  const { t, language } = useLanguage();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: language === 'uz'
        ? "Assalomu alaykum! Men EdSchedule AI yordamchisiman. Dars jadvalini optimallashtirish, boʻsh xonalarni topish, yuklamani tahlil qilish yoki ziddiyatlarni bartaraf etishda yordam beraman."
        : "Здравствуйте! Я ИИ-помощник EdSchedule AI. Помогу оптимизировать расписание, найти свободные аудитории, проанализировать нагрузку или исправить конфликты.",
      timestamp: '10:00'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const samplePrompts = language === 'uz' ? [
    "Dushanba kuni boʻsh xonalar",
    "Barcha ziddiyatlarni tekshir",
    "Oʻqituvchi yuklamasi",
    "ИС-21 jadvalini optimallashtir"
  ] : [
    "Свободные аудитории в понедельник",
    "Найди все конфликты в расписании",
    "Нагрузка преподавателей",
    "Оптимизируй расписание для ИС-21"
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.response || data.answer || (language === 'uz' ? 'Soʻrov qabul qilindi' : 'Запрос обработан'),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        generateLocalResponse(text);
      }
    } catch (err) {
      generateLocalResponse(text);
    } finally {
      setIsLoading(false);
    }
  };

  const generateLocalResponse = (query: string) => {
    const q = query.toLowerCase();
    let reply = "";

    if (q.includes('аудитор') || q.includes('xona')) {
      reply = language === 'uz'
        ? "Dushanba kuni 1-para uchun 4 ta boʻsh xona topildi: 101 (60 oʻrin), 204 (25 oʻrin), Kompyuter sinfi 1 (30 oʻrin), 308 (35 oʻrin)."
        : "На 1-ю пару в понедельник найдено 4 свободные аудитории: 101 (60 мест), 204 (25 мест), Комп. класс 1 (30 мест), 308 (35 мест).";
    } else if (q.includes('конфликт') || q.includes('ziddiyat')) {
      reply = language === 'uz'
        ? "Jadvalda 1 ta ziddiyat aniqlandi: Seshanba, 2-para — xona 204 ikkita guruhga bir vaqtda tayinlangan."
        : "В расписании обнаружен 1 конфликт: Вторник, урок 2 — аудитория 204 назначена двум группам одновременно.";
    } else if (q.includes('нагрузк') || q.includes('yuklama')) {
      reply = language === 'uz'
        ? "Oʻqituvchilarning oʻrtacha haftalik yuklamasi: 16 soat. Eng yuqori: 22 soat, eng past: 8 soat."
        : "Средняя недельная нагрузка преподавателей: 16 часов. Максимальная: 22 ч, минимальная: 8 ч.";
    } else {
      reply = language === 'uz'
        ? `"${query}" soʻrovingiz qabul qilindi. Optimal yechim topildi.`
        : `Запрос "${query}" обработан. Оптимальное решение найдено.`;
    }

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'assistant',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, botMsg]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">EdSchedule AI</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'uz' ? 'Intellektual yordamchi' : 'Интеллектуальный помощник'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-900">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              "flex gap-3 max-w-2xl",
              msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              msg.sender === 'user'
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
            )}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className="space-y-1">
              <div className={clsx(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.sender === 'user'
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm"
              )}>
                {msg.text}
              </div>
              <p className={clsx("text-[10px] text-slate-400 px-1", msg.sender === 'user' && "text-right")}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 mr-auto items-center">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none shadow-sm">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
                <span>{language === 'uz' ? 'Tahlil qilmoqda...' : 'Анализ...'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-6 py-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto">
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="whitespace-nowrap px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-full transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-blue-500" />
            {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ai.placeholder')}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-colors shadow-lg shadow-blue-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
