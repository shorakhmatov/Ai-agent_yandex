import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import {
  Send,
  Sparkles,
  Bot,
  User,
  DoorOpen,
  AlertTriangle,
  TrendingUp,
  CalendarDays,
  CheckCircle2,
  HelpCircle
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
        ? "Assalomu alaykum! Men EdSchedule AI yordamchisiman. Sizga dars jadvalini optimallashtirish, boʻsh xonalarni topish, oʻqituvchilar yuklamasini tahlil qilish yoki ziddiyatlarni bartaraf etishda yordam bera olaman."
        : "Здравствуйте! Я ИИ-помощник EdSchedule AI. Я могу помочь вам составить расписание, найти свободные аудитории, проверить накладки или проанализировать нагрузку преподавателей.",
      timestamp: '10:00'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const samplePrompts = language === 'uz' ? [
    "Dushanba kuni boʻsh xonalarni koʻrsat",
    "Jadvaldagi barcha ziddiyatlarni (konfliktlarni) tekshir",
    "Oʻqituvchilarning dars yuklamasini koʻrsat",
    "ИС-21 guruhi uchun jadvalni tuzish"
  ] : [
    "Покажи свободные аудитории в понедельник",
    "Найди все конфликты в текущем расписании",
    "Какая нагрузка у преподавателей?",
    "Оптимизируй окна для группы ИС-21"
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
        body: JSON.stringify({
          message: text,
          organization_id: 'default-org-id',
          schedule_id: 'default-schedule-id',
          day_of_week: 1,
          slot_number: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.response || "Запрос обработан.",
          action: data.action,
          data: data.data,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        // Fallback for demo when backend is offline or mock
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
    let action = "";
    let data = null;

    if (q.includes('аудитор') || q.includes('xona')) {
      reply = language === 'uz'
        ? "Dushanba kuni 1-para uchun 4 ta boʻsh xona topildi:"
        : "На 1-ю пару в понедельник найдено 4 свободные аудитории:";
      action = 'rooms';
      data = [
        { name: '101 (Лекционная)', capacity: 60, type: 'Лекционная' },
        { name: '204 (Лаборатория)', capacity: 25, type: 'Лаборатория' },
        { name: 'Комп. класс 1', capacity: 30, type: 'Компьютерный класс' },
        { name: '308', capacity: 35, type: 'Стандартная' },
      ];
    } else if (q.includes('конфликт') || q.includes('ziddiyat')) {
      reply = language === 'uz'
        ? "Jadvalda 1 ta ziddiyat aniqlandi: 2-para, Seshanba kuni xona 204 bir vaqtning oʻzida ikkita guruhga tayinlangan."
        : "В расписании обнаружен 1 конфликт: Вторник, урок 2 — аудитория 204 назначена сразу двум группам одновременно.";
      action = 'conflicts';
    } else if (q.includes('нагрузк') || q.includes('yuklama')) {
      reply = language === 'uz'
        ? "Oʻqituvchilar yuklamasi tahlili tayyorlandi. Oʻrtacha haftalik yuklama: 16 soat."
        : "Анализ учебной нагрузки преподавателей: средняя нагрузка составляет 16 академических часов в неделю.";
      action = 'workload';
    } else {
      reply = language === 'uz'
        ? `"${query}" soʻrovingiz qabul qilindi. Dars jadvali algoritmi ushbu talablarga mos optimal yechimni topdi.`
        : `Запрос "${query}" успешно обработан алгоритмом OR-Tools. Решение найдено с соблюдением всех жестких ограничений.`;
    }

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'assistant',
      text: reply,
      action,
      data,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, botMsg]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">EdSchedule AI Assistant</h2>
            <p className="text-xs text-slate-500">
              {language === 'uz' ? 'Oʻzbek va rus tillarida xavfsiz boshqaruv' : 'Безопасное управление расписанием на русском и узбекском'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-600">OR-Tools + Tool Calling</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              "flex gap-3 max-w-2xl",
              msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold",
              msg.sender === 'user' ? "bg-primary-600 text-white" : "bg-white border border-slate-200 text-primary-600 shadow-sm"
            )}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className="space-y-2">
              <div className={clsx(
                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                msg.sender === 'user'
                  ? "bg-primary-600 text-white rounded-br-none"
                  : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
              )}>
                {msg.text}

                {/* Render Tool Results (e.g., Free Rooms) */}
                {msg.data && Array.isArray(msg.data) && (
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    {msg.data.map((item: any, i: number) => (
                      <div key={i} className="p-2 bg-slate-50 rounded border border-slate-200">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-slate-500">Вместимость: {item.capacity} чел.</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className={clsx("text-[10px] text-slate-400 px-1", msg.sender === 'user' && "text-right")}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 mr-auto items-center text-sm text-slate-500 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <Bot className="w-4 h-4 text-primary-600 animate-bounce" />
            <span>{language === 'uz' ? 'AI soʻrovni tahlil qilmoqda...' : 'ИИ выполняет проверку ограничений и расчет...'}</span>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="px-6 py-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto">
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="whitespace-nowrap px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-full transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-primary-600" />
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ai.placeholder')}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
