import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Mail, Headset, Send, Bot, User, Check, Sparkles, Smile, ShieldAlert } from 'lucide-react';
import { useAdmin, SupportChannel } from '../context/AdminState';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'admin';
  text: string;
  time: string;
}

export default function Support() {
  const [activeTab, setActiveTab] = useState<'info' | 'chat'>('info');
  const [isTabLoading, setIsTabLoading] = useState<boolean>(true);

  // Soft perceived high-speed skeleton overlay when mounting or changing tabs
  useEffect(() => {
    setIsTabLoading(true);
    const timer = setTimeout(() => {
      setIsTabLoading(false);
    }, 850);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const { chatSessions, setChatSessions, supportChannels, triggerAdminNotification } = useAdmin();
  const demoSession = chatSessions.find(s => s.id === 'session_demo') || chatSessions[0];
  const messages = demoSession.messages;

  const [chatInput, setChatInput] = useState<string>('');
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const presetQuestions = [
    { text: 'Как работает AI-шумоподавление?', tag: 'ШУМОПОДАВЛЕНИЕ' },
    { text: 'Безопасен ли Quantum Shield?', tag: 'БЕЗОПАСНОСТЬ' },
    { text: 'Как запустить Nexus на Windows?', tag: 'УСТАНОВКА' },
    { text: 'Бесплатен ли этот проект?', tag: 'ЦЕНЫ' },
  ];

  // Auto Scroll Chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isBotTyping]);

  // Support listening to simulated user clicks coming from Admin
  useEffect(() => {
    const handleSimulatedMsg = (e: any) => {
      // Just auto scroll
      if (scrollRef.current) {
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        }, 150);
      }
    };
    window.addEventListener('nexus:userMessageSimulated', handleSimulatedMsg);
    return () => window.removeEventListener('nexus:userMessageSimulated', handleSimulatedMsg);
  }, []);

  const getBotResponse = (input: string): string => {
    const raw = input.toLowerCase();
    
    if (raw.includes('шум') || raw.includes('cleaner') || raw.includes('очиститель') || raw.includes('микрофон')) {
      return 'Технология AI Noise Cleaner работает прямо на вашем устройстве, используя спектральный фильтр и локальную нейросеть. Она мгновенно высекает фоновое шипение кондиционера, щелчки кликов мышки, сохраняя кристально чистый голос без задержки ( latency менее 5мс).';
    }
    if (raw.includes('шифр') || raw.includes('shield') || raw.includes('безопасн') || raw.includes('ключ')) {
      return 'Да, Quantum Shield абсолютно безопасен! Nexus использует алгоритмы сквозного шифрования (E2EE), генерируя стойкие симметричные криптографические ключи непосредственно на вашей стороне. У серверов Nexus технически нет доступа к дешифровке ваших текстовых сообщений или голосовых потоков.';
    }
    if (raw.includes('установ') || raw.includes('запуск') || raw.includes('windows') || raw.includes('exe')) {
      return 'Для запуска на Windows скачайте установочный пакет "Nexus Setup" во фрейме ниже. Файл проверен антивирусными базами и устанавливается в один клик за 15 секунд.';
    }
    if (raw.includes('бесплат') || raw.includes('цен') || raw.includes('плат')) {
      return 'Да! Nexus — на 100% бесплатный проект, финансируемый за счет пожертвований нашего сообщества. У нас нет скрытых платных функций, лимитов на стриминг в 8K или надоедливой коммерческой рекламы.';
    }
    if (raw.includes('разработ') || raw.includes('api') || raw.includes('код')) {
      return 'Мы открыты к новым талантам! Наш API полностью документирован, а исходный код содержит примеры интеграций на TypeScript, Rust и Go.';
    }
    
    return 'Благодарю за ваш интерес! Я зафиксировал ваш вопрос. Наша дежурная команда инженеров активна круглосуточно и готова ответить в Discord (@nexus_support) или Telegram (@nexus_help) за пару минут вживую. Также вы можете скачать приложение и опробовать всё прямо сейчас!';
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };

    // Store messages history *before* state update occurs
    const currentHistory = [...messages];

    // Trigger notification alert logged directly into the Admin Panel terminal/alerts
    triggerAdminNotification(`[Панель связи] Зарегистрировано сообщение в чате: "${textToSend}"`);

    setChatSessions((prev) => prev.map(s => {
      if (s.id === 'session_demo') {
        return {
          ...s,
          unread: true, // Let the admin know there's a new message
          lastActive: userMsg.time,
          messages: [...s.messages, userMsg]
        };
      }
      return s;
    }));

    setChatInput('');
    setIsBotTyping(true);

    const historyToSend = currentHistory.map(m => ({ sender: m.sender, text: m.text }));

    // Real API call to Express backend proxying Gemini
    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: textToSend,
        history: historyToSend
      })
    })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error('API server returned error code ' + res.status);
      }
      return res.json();
    })
    .then((data) => {
      setChatSessions((prev) => prev.map(s => {
        if (s.id === 'session_demo') {
          // Verify if admin has replied first during this delay (intercepted)
          const lastMsg = s.messages[s.messages.length - 1];
          if (lastMsg && lastMsg.sender === 'admin') {
            return s; // Keep admin's premium message as the focal response
          }

          const botMsg: ChatMessage = {
            id: `bot_${Date.now()}`,
            sender: 'bot',
            text: data.reply || getBotResponse(textToSend),
            time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          };
          return {
            ...s,
            lastActive: botMsg.time,
            messages: [...s.messages, botMsg]
          };
        }
        return s;
      }));
    })
    .catch((err) => {
      console.warn('Real AI chat endpoint has failed or returned empty. Using smart local simulator fallback:', err);
      
      // Fallback local response simulation
      setTimeout(() => {
        setChatSessions((prev) => prev.map(s => {
          if (s.id === 'session_demo') {
            const lastMsg = s.messages[s.messages.length - 1];
            if (lastMsg && lastMsg.sender === 'admin') {
              return s;
            }

            const responseText = getBotResponse(textToSend);
            const botMsg: ChatMessage = {
              id: `bot_fallback_${Date.now()}`,
              sender: 'bot',
              text: responseText,
              time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            };
            return {
              ...s,
              lastActive: botMsg.time,
              messages: [...s.messages, botMsg]
            };
          }
          return s;
        }));
      }, 700);
    })
    .finally(() => {
      setIsBotTyping(false);
    });
  };

  return (
    <section id="support" className="py-24 border-t border-slate-900 bg-[#06060c]/40">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        
        {/* Title Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 flex items-center justify-center gap-2 bg-gradient-to-r from-white via-white to-purple-300 bg-clip-text text-transparent italic">
            Техподдержка уровня 💎
          </h2>
          <p className="text-slate-400 text-lg font-light">
            Мы отвечаем в среднем за 2 минуты в режиме 24/7. Выберите удобный канал связи.
          </p>
        </motion.div>

        {/* Tab Switching for Live Chat vs Social Channels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="flex justify-center mb-10"
        >
          <div className="bg-black/50 p-1 border border-white/10 rounded-2xl flex">
            <button
              onClick={() => setActiveTab('info')}
              className={`cursor-pointer px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'info'
                  ? 'bg-purple-600 text-white shadow shadow-purple-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Официальные Каналы
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`cursor-pointer px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-purple-600 text-white shadow shadow-purple-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Онлайн Чат на Сайте</span>
            </button>
          </div>
        </motion.div>

        {/* Dynamic Display content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
          className="max-w-4xl mx-auto"
        >
          <AnimatePresence mode="wait">
            {isTabLoading ? (
              activeTab === 'info' ? (
                /* INFO SKELETON: 4 pulsing cards */
                <motion.div
                  key="info-skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center"
                >
                  {[1, 2, 3, 4].map((id) => (
                    <div key={id} className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col items-center animate-pulse">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 mb-5" />
                      <div className="h-4 w-24 rounded-full bg-white/10 mb-2.5" />
                      <div className="h-3.5 w-32 rounded-full bg-white/5 mb-4" />
                      <div className="h-3 w-full rounded-full bg-white/5 mb-1.5" />
                      <div className="h-3 w-4/5 rounded-full bg-white/5" />
                    </div>
                  ))}
                </motion.div>
              ) : (
                /* CHAT SKELETON: pulsing layout */
                <motion.div
                  key="chat-skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[520px] animate-pulse text-left"
                >
                  {/* Chat header skeleton */}
                  <div className="bg-slate-900/40 px-6 py-4 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 shrink-0" />
                      <div className="space-y-1.5">
                        <div className="h-4 w-36 rounded-full bg-white/10" />
                        <div className="h-2.5 w-44 rounded-full bg-white/5" />
                      </div>
                    </div>
                    <div className="h-7 w-28 rounded-lg bg-white/10" />
                  </div>

                  {/* Simulated message stream bubbles */}
                  <div className="flex-1 px-6 py-5 space-y-6">
                    {/* Left bubble skeleton */}
                    <div className="flex gap-3 max-w-[70%] mr-auto items-start">
                      <div className="w-8 h-8 rounded-lg bg-white/10 shrink-0" />
                      <div className="space-y-2 w-full">
                        <div className="h-14 w-full rounded-2xl rounded-tl-none bg-white/10" />
                        <div className="h-2 w-10 rounded-full bg-white/5" />
                      </div>
                    </div>

                    {/* Right bubble skeleton */}
                    <div className="flex gap-3 max-w-[65%] ml-auto flex-row-reverse text-right items-start">
                      <div className="w-8 h-8 rounded-lg bg-white/10 shrink-0" />
                      <div className="space-y-2 w-full flex flex-col items-end">
                        <div className="h-10 w-full rounded-2xl rounded-tr-none bg-white/10" />
                        <div className="h-2 w-10 rounded-full bg-white/5" />
                      </div>
                    </div>

                    {/* Left bubble skeleton (bot) */}
                    <div className="flex gap-3 max-w-[50%] mr-auto items-start">
                      <div className="w-8 h-8 rounded-lg bg-white/5 shrink-0" />
                      <div className="space-y-2 w-full">
                        <div className="h-12 w-full rounded-2xl rounded-tl-none bg-white/5" />
                        <div className="h-2 w-10 rounded-full bg-white/5" />
                      </div>
                    </div>
                  </div>

                  {/* Helper fast buttons skeleton */}
                  <div className="bg-slate-950/20 p-4 border-t border-white/10 flex gap-2 overflow-x-hidden">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="shrink-0 w-32 h-14 bg-white/5 border border-white/5 rounded-xl" />
                    ))}
                  </div>

                  {/* Input panel skeleton */}
                  <div className="bg-slate-900/40 p-4 border-t border-white/10 flex gap-2">
                    <div className="h-11 bg-black/40 border border-white/5 rounded-xl flex-1" />
                    <div className="w-11 h-11 bg-white/10 rounded-xl" />
                  </div>
                </motion.div>
              )
            ) : (
              <>
                {/* TAB: Official Contacts Info */}
                {activeTab === 'info' && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    {supportChannels && supportChannels.filter(c => c.isActive).map((channel) => {
                      const isChatTrigger = channel.url === 'chat';
                      
                      const iconMap: Record<string, any> = {
                        MessageSquare: MessageSquare,
                        Mail: Mail,
                        Headset: Headset,
                        Send: Send,
                        Bot: Bot,
                        Sparkles: Sparkles,
                        Smile: Smile,
                        ShieldAlert: ShieldAlert,
                      };
                      
                      const IconComp = iconMap[channel.icon];
                      const colorHex = channel.color || '#a855f7';
                      
                      const handleClick = () => {
                        if (isChatTrigger) {
                          setActiveTab('chat');
                        } else if (channel.url) {
                          window.open(channel.url, '_blank', 'noreferrer,noopener');
                        }
                      };
                      
                      return (
                        <div
                          key={channel.id}
                          id={`support-card-${channel.id}`}
                          onClick={handleClick}
                          className="group bg-white/5 border border-white/10 p-6 rounded-3xl text-center select-none cursor-pointer hover:border-purple-500/30 transition-all hover:-translate-y-1 hover:bg-white/10 flex flex-col justify-between h-full min-h-[220px]"
                        >
                          <div>
                            <div 
                              className="inline-flex p-4 rounded-2xl mb-4 group-hover:scale-105 transition-transform"
                              style={{ backgroundColor: `${colorHex}15`, color: colorHex }}
                            >
                              {IconComp ? (
                                <IconComp className="w-8 h-8" />
                              ) : (
                                <span className="text-2xl font-black font-mono leading-none flex items-center justify-center w-8 h-8">
                                  {channel.icon ? channel.icon.substring(0, 3) : 'Nex'}
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-white text-lg mb-1 font-sans">{channel.name}</h3>
                            <p className="text-sm font-semibold mb-3 font-mono transition-colors" style={{ color: colorHex }}>
                              {channel.value}
                            </p>
                          </div>
                          <p className="text-xs text-slate-500 font-light leading-relaxed mt-auto">
                            {channel.desc}
                          </p>
                        </div>
                      );
                    })}
                  </motion.div>
                )}

            {/* TAB: Web Interactive Message UI */}
            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[520px]"
              >
                {/* Messenger Inner Head */}
                <div className="bg-slate-900/40 px-6 py-4 border-b border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-purple-400" />
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm tracking-tight">Nexus Support Agent AI</h4>
                      <span className="text-[10px] text-emerald-400 font-semibold block uppercase font-mono tracking-wider">
                        ● ONLINE СКОРОСТЬ ОТВЕТА БЫСТРЕЕ 1 МИН
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setChatSessions((prev) => prev.map(s => {
                        if (s.id === 'session_demo') {
                          return {
                            ...s,
                            unread: false,
                            messages: [
                              {
                                id: '1',
                                sender: 'bot',
                                text: 'Привет! Я виртуальный помощник Nexus 🌐. Рад помочь вам с любыми вопросами касательно технологии, безопасности и скачивания клиента. О чем бы вы хотели узнать?',
                                time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                              }
                            ]
                          };
                        }
                        return s;
                      }));
                    }}
                    className="cursor-pointer text-xs font-bold text-slate-500 hover:text-slate-300 py-1.5 px-3 rounded-lg border border-white/10 hover:border-white/20"
                  >
                    Очистить диалог
                  </button>
                </div>

                {/* Message Streams Content */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin"
                >
                  {messages.map((msg) => {
                    const isBot = msg.sender === 'bot';
                    const isAdminMsg = msg.sender === 'admin';
                    const isLeftAligned = isBot || isAdminMsg;
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-[80%] ${isLeftAligned ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'}`}
                      >
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isAdminMsg
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : isBot 
                              ? 'bg-purple-600/10 text-purple-400' 
                              : 'bg-indigo-600/10 text-indigo-400'
                        }`}>
                          {isAdminMsg ? <ShieldAlert className="w-4 h-4" /> : isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>

                        {/* Speech Bubble */}
                        <div className="space-y-1">
                          {isAdminMsg && (
                            <span className="text-[9px] uppercase font-mono font-extrabold text-amber-400 tracking-wider px-1 block">
                              🛡️ ИНЖЕНЕР NEXUS ОНЛАЙН:
                            </span>
                          )}
                          <div className={`p-4 rounded-2xl text-[13px] leading-relaxed shadow-xs ${
                            isAdminMsg
                              ? 'bg-amber-950/20 border border-amber-500/35 text-amber-200 rounded-tl-none font-medium'
                              : isBot
                                ? 'bg-slate-900/60 border border-white/5 text-slate-200 rounded-tl-none'
                                : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-tr-none font-medium'
                          }`}>
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-slate-600 font-mono block px-1">
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isBotTyping && (
                    <div className="flex gap-3 max-w-[50%] mr-auto text-left">
                      <div className="w-8 h-8 rounded-lg bg-purple-600/10 text-purple-400 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-slate-900/60 border border-white/5 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Preset Fast questions helper panel */}
                <div className="bg-slate-950/20 p-4 border-t border-white/10 flex gap-2 overflow-x-auto select-none scrollbar-none">
                  {presetQuestions.map((q) => (
                    <button
                      key={q.text}
                      onClick={() => handleSendMessage(q.text)}
                      className="cursor-pointer shrink-0 text-left bg-white/5 hover:bg-purple-500/10 hover:border-purple-500/20 active:scale-95 border border-white/10 rounded-xl px-3 py-2 transition-all flex flex-col justify-between"
                    >
                      <span className="text-[8px] font-extrabold text-purple-400 font-mono mb-0.5">{q.tag}</span>
                      <span className="text-xs text-slate-300 font-medium font-sans">{q.text}</span>
                    </button>
                  ))}
                </div>

                {/* Write input panel */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(chatInput);
                  }}
                  className="bg-slate-900/40 p-4 border-t border-white/10 flex gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Задайте свой вопрос на русском языке..."
                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-200 flex-1 focus:outline-none focus:border-purple-500/40"
                  />
                  <button
                    type="submit"
                    className="cursor-pointer bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl transition-colors flex items-center justify-center"
                    aria-label="Send Message"
                  >
                    <Send className="w-4.5 h-4.5" />
                  </button>
                </form>

              </motion.div>
            )}
              </>
            )}

          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
