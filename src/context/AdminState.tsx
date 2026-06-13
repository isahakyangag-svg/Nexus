import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'admin';
  text: string;
  time: string;
}

export interface ChatSession {
  id: string;
  userName: string;
  messages: ChatMessage[];
  lastActive: string;
  unread: boolean;
}

export interface FeedbackItem {
  id: string;
  category: string;
  rating: number;
  userText: string;
  userEmail?: string;
  timestamp: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

// Support card customization structure
export interface SupportChannel {
  id: string;
  name: string;
  icon: string;       // "MessageSquare" | "Send" | "Mail" | "Headset" | "Hash" | "Globe"
  value: string;      // "@nexus_support" or similar
  url: string;        // URL path or click action code
  desc: string;       // Card description details
  color: string;      // hex color code
  isActive: boolean;
}

export interface PlatformConfig {
  id: 'windows' | 'macos' | 'linux' | 'android' | 'ios';
  name: string;
  tag: string;
  desc: string;
  icon: string; // "Monitor" | "Laptop" | "Terminal" | "Smartphone" | "Chrome" | "Globe" etc.
  isVisible: boolean;
  fileName: string;
  fileType: 'txt' | 'link' | 'file';
  redirectUrl: string;
  fileContent: string;
  uploadedFileBase64?: string;
  uploadedFileName?: string;
  uploadedFileType?: string;
  specCrc?: string;
  specSha?: string;
  specRuntime?: string;
}

interface AdminContextType {
  // Site Customization Settings
  siteName: string;
  setSiteName: (val: string) => void;
  heroTagline: string;
  setHeroTagline: (val: string) => void;
  heroDescription: string;
  setHeroDescription: (val: string) => void;
  
  // Downloads config
  downloadsTodayOffset: number;
  setDownloadsTodayOffset: (val: number | ((prev: number) => number)) => void;
  downloadTitle: string;
  setDownloadTitle: (val: string) => void;
  downloadDesc: string;
  setDownloadDesc: (val: string) => void;
  downloadBtnText: string;
  setDownloadBtnText: (val: string) => void;
  downloadFileName: string;
  setDownloadFileName: (val: string) => void;
  downloadFileType: 'txt' | 'link' | 'file';
  setDownloadFileType: (val: 'txt' | 'link' | 'file') => void;
  downloadRedirectUrl: string;
  setDownloadRedirectUrl: (val: string) => void;
  downloadFileContent: string;
  setDownloadFileContent: (val: string) => void;
  uploadedFileBase64: string;
  setUploadedFileBase64: (val: string) => void;
  uploadedFileName: string;
  setUploadedFileName: (val: string) => void;
  uploadedFileType: string;
  setUploadedFileType: (val: string) => void;
  specCrc: string;
  setSpecCrc: (val: string) => void;
  specSha: string;
  setSpecSha: (val: string) => void;
  specRuntime: string;
  setSpecRuntime: (val: string) => void;
  downloadSteps: string;
  setDownloadSteps: (val: string) => void;
  
  // Real-time messenger system
  chatSessions: ChatSession[];
  setChatSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  
  // Admin auth
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (val: boolean) => void;
  
  // Notifications/Broadcast messages
  broadcastMessage: string;
  setBroadcastMessage: (val: string) => void;
  
  // Support trigger notification to Admin
  triggerAdminNotification: (text: string) => void;
  adminNotifications: string[];
  clearAdminNotifications: () => void;
  
  // Feedbacks
  feedbacks: FeedbackItem[];
  addFeedback: (feedback: Omit<FeedbackItem, 'id' | 'timestamp'>) => void;
  
  // High-contrast theme & Language switcher
  theme: 'dark' | 'light';
  setTheme: (val: 'dark' | 'light') => void;
  language: 'ru' | 'en';
  setLanguage: (val: 'ru' | 'en') => void;
  t: (key: string) => string;

  // Support channel cards
  supportChannels: SupportChannel[];
  setSupportChannels: (val: SupportChannel[]) => void;

  // Manageable dynamic platforms
  platforms: PlatformConfig[];
  setPlatforms: (val: PlatformConfig[]) => void;

  // Toast notifications
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;
}

export const translations: Record<'ru' | 'en', Record<string, string>> = {
  ru: {
    navHome: "Главная",
    navFeatures: "Возможности",
    navAbout: "О нас",
    navSupport: "Поддержка",
    navDownload: "Скачать",
    navButton: "Скачать бесплатно",
    
    // Hero Section
    newEra: "Новая эра общения",
    learnMore: "Подробнее",
    users: "Пользователей",
    countries: "Стран",
    supportStat: "Поддержка",
    activeCall: "АКТИВНЫЙ ЗВОНОК",
    voiceChatTitle: "Голосовой чат 8K",
    voiceChatDesc: "Технология Crystal Voice AI",
    aiNoise: "AI Шумоподавление",
    filterActive: "Фильтр активен: Окружающий шум подавлен",
    filterInactive: "Окружающий шум и шипение микрофона проходят",
    meChannel: "Вы (Канал)",
    micOn: "Микрофон включен",
    micOff: "Микрофон выключен",
    onlineSuffix: "в сети",
    announcement: "ОБЪЯВЛЕНИЕ СЛУЖБЫ:",
    
    // Support/Chat Section
    chatAssistantTitle: "Виртуальный помощник Nexus 🌐",
    chatAssistantGreeting: "Привет! Я виртуальный помощник Nexus 🌐. Рад помочь вам с любыми вопросами касательно технологии, безопасности и скачивания клиента. О чем бы вы хотели узнать?",
    writeMessage: "Напишите сообщение...",
    supportTitle: "Техническая поддержка 24/7",
    supportDesc: "Наши ассистенты и децентрализованный ИИ-помощник Марк готовы ответить на любые технические вопросы в режиме реального времени.",
    p2pStatus: "Статус P2P узлов: Стабильно (100%)",
    activeOperators: "Активных операторов: 12",
    yourNick: "Ваш Никнейм",
    startChat: "Начать новый диалог с ИИ",
    
    // About
    comparisonTitle: "НАШИ ПОКАЗАТЕЛИ СКОРОСТИ",
    audioDelay: "Задержка аудио",
    fileSpeed: "Скорость файлообмена",
    cpuUsage: "Нагрузка на CPU",
    teamTitle: "Команда Nexus",
    teamDesc: "Более 50+ топовых инженеров и криптоаналитиков со всего мира",
    legacyApps: "Обычные мессенджеры",
    betterBy: "Лучше на",
    valuesTitle: "НАША ФИЛОСОФИЯ И ЦЕННОСТИ",
    valuesLead: "Мы создаём независимое будущее интернет-связи",
    value1Title: "100% Анонимность",
    value1Desc: "Никаких паспортных данных, телефонов или имейлов при регистрации — только криптографическая пара ключей.",
    value2Title: "Сквозное P2P шифрование",
    value2Desc: "Ваш трафик не проходит через центральные серверы. Все данные передаются прямо между собеседниками.",
    value3Title: "Голос без помех",
    value3Desc: "ИИ очищает любой посторонний шум, хлопки и прерывания, оставляя кристально качественный звук.",
    
    // Download
    installerSecTitle: "ЗАГРУЗКА И УСТАНОВКА",
    specName: "Спецификация",
    stepsTitle: "ШАГИ ПРОГРЕССА ЗАГРУЗКИ (ЧЕРЕЗ ЗАПЯТЫЮ)",
    stepsAnnotation: "Текст высокотехнологичных этапов подготовки инсталлятора, отображаемый во время анимации полосы прогресса.",
    linkType: "ТИП ССЫЛКИ НА ДИСТРИБУТИВ",
    linkTxt: "Генератор ТXT-инструкции",
    linkDirect: "Прямой линк / EXE / Редирект",
    ownFile: "Свой файл с компьютера ⬆",
    finalFileName: "КОНЕЧНОЕ ИМЯ ФАЙЛА ПРИ ЗАГРУЗКЕ",
    contentToDownload: "СОДЕРЖИМОЕ СКАЧИВАЕМОГО ТХТ ФАЙЛА",
    restoreDefault: "Восстановить шаблон по умолчанию",
    downloadReady: "Пакет успешно загружен!",
    downloadReadyDesc: "Файл сохранен на вашем устройстве с автоматически настроенным умным пресетом.",
    downloadProgress: "ПОДГОТОВКА БЕЗОПАСНОГО ИНСТАЛЛЯТОРА...",
    
    // Newsletter / Footer
    subscribeTitle: "Будьте в курсе обновлений",
    subscribeDesc: "Подпишитесь на нашу зашифрованную P2P-рассылку для получения новостей о безопасности и обновлениях клиента.",
    emailPlaceholder: "Введите ваш зашифрованный email...",
    subscribeBtn: "Подписаться",
    footerBrandDesc: "Свободное и анонимное общение без компромиссов. Шифрование военного уровня, нейросетевые фильтры аудио и потоки качества Ultra-HD 8K.",
    footerProduct: "ПРОДУКТ",
    footerResources: "РЕСУРСЫ",
    footerCommunity: "СООБЩЕСТВО",
    footerDownload: "Скачать Клиент",
    footerFeatures: "Возможности AI",
    footerPrices: "Цены (Бесплатно)",
    footerBlog: "Блог Разработки",
    footerApi: "Интеграция API",
    footerStatus: "Статус Каналов",
    footerFollow: "Подписывайтесь и следите за обновлениями клиента в соцсетях.",
    footerRights: "Nexus Project. Все права зарезервированы сообществом.",
    devPanel: "Панель разработчика",
    
    // Feedback
    feedbackButton: "Обратная связь",
    feedbackTitle: "Поделитесь впечатлением",
    feedbackCategory: "Категория:",
    feedbackCatAI: "Возможности AI",
    feedbackCatDesign: "Дизайн и Интерфейс",
    feedbackCatSpeed: "Скорость и Соединение",
    feedbackCatOther: "Другое",
    feedbackRating: "Оценка:",
    feedbackTextPlaceholder: "Что нам улучшить? Мы ценим ваше мнение...",
    feedbackEmailLabel: "Email для связи (опционально):",
    feedbackSubmit: "Отправить отзыв",
    feedbackSuccess: "Спасибо! Ваше мнение отправлено.",
    
    // Admin panel specific
    adminPanelTitle: "Панель управления Nexus",
    authButton: "Вход для администраторов",
    exitBtn: "Выйти из панели",
    controlActive: "Панель активна",

    // Connection Info
    statusNetwork: "Сеть",
    statusOnline: "В сети",
    statusOffline: "Офлайн",
    statusEncrypted: "Шифрование",
    statusSecured: "Защищено",
    statusProtocol: "Протокол",
    statusEncryption: "Шифр",
    statusPing: "Задержка",
    statusTLSDetail: "AES-GCM-255 (Квантовая подпись)",

    // Language switcher tooltips
    langSelectedRU: "Русский язык уже выбран",
    langSwitchRU: "Переключить интерфейс на русский",
    langSelectedEN: "Английский язык уже выбран",
    langSwitchEN: "Переключить интерфейс на английский",

    // Toast notifications
    toastSettingsSaved: "Настройки Nexus успешно сохранены в реальном времени!",
    toastDownloadStart: "Начало безопасной генерации и загрузки пакета Nexus...",
    toastDownloadSuccess: "Файл Nexus успешно скачан на ваше устройство!",
    toastFeedbackSuccess: "Отзыв успешно зарегистрирован во вкладке ответов операторов!",
    toastOfflineWarning: "Внимание: Сетевое соединение утеряно!",
    toastOnlineRestore: "Подключение восстановлено! Сеть защищена сквозным TLSv1.3.",
    backToTop: "Наверх"
  },
  en: {
    navHome: "Home",
    navFeatures: "Features",
    navAbout: "About Us",
    navSupport: "Support",
    navDownload: "Download",
    navButton: "Download Free",
    
    // Hero Section
    newEra: "A New Era of Communication",
    learnMore: "Learn More",
    users: "Users",
    countries: "Countries",
    supportStat: "Support",
    activeCall: "ACTIVE CALL",
    voiceChatTitle: "8K Voice Chat",
    voiceChatDesc: "Crystal Voice AI Technology",
    aiNoise: "AI Noise Reduction",
    filterActive: "Filter Active: Ambient noise suppressed",
    filterInactive: "Ambient noise and mic hiss are audible",
    meChannel: "You (Channel)",
    micOn: "Microphone On",
    micOff: "Microphone Off",
    onlineSuffix: "online",
    announcement: "SYSTEM ANNOUNCEMENT:",
    
    // Support/Chat Section
    chatAssistantTitle: "Nexus Virtual Assistant 🌐",
    chatAssistantGreeting: "Hello! I am the Nexus virtual assistant 🌐. I am happy to help you with any questions about technology, security, and downloading the client. What would you like to know?",
    writeMessage: "Type a message...",
    supportTitle: "Technical Support 24/7",
    supportDesc: "Our live assistants and decentralized AI helper Mark are ready to resolve any technical questions in real time.",
    p2pStatus: "P2P Node Status: Stable (100%)",
    activeOperators: "Active Operators: 12",
    yourNick: "Your Nickname",
    startChat: "Start New Chat with AI",
    
    // About
    comparisonTitle: "OUR SPEED INDICATORS",
    audioDelay: "Audio Latency",
    fileSpeed: "File Sharing Speed",
    cpuUsage: "CPU Load",
    teamTitle: "Nexus Team",
    teamDesc: "Over 50+ world-class engineers and cryptanalysts worldwide",
    legacyApps: "Standard Messengers",
    betterBy: "Better by",
    valuesTitle: "OUR PHILOSOPHY & VALUES",
    valuesLead: "We create an independent future of internet communication",
    value1Title: "100% Anonymity",
    value1Desc: "No passport data, telephone numbers, or emails are needed for registration — only a cryptographic keypair.",
    value2Title: "End-to-End P2P Encryption",
    value2Desc: "Your traffic never passes through central servers. All data goes directly between participants.",
    value3Title: "Noise-Free Audio",
    value3Desc: "AI filters out any room noise, clicks, or dropouts, leaving perfectly crystal clear audio.",
    
    // Download
    installerSecTitle: "DOWNLOAD & INSTALLATION",
    specName: "Specification",
    stepsTitle: "DOWNLOAD STEPS (COMMAS SEPARATED)",
    stepsAnnotation: "The high-tech step titles displayed during the installer generation loading bar animation.",
    linkType: "DISTRIBUTION LINK TYPE",
    linkTxt: "Generate instruction TXT",
    linkDirect: "Direct Link / EXE / Redirect",
    ownFile: "Own file from PC ⬆",
    finalFileName: "FINAL FILENAME UPON DOWNLOAD",
    contentToDownload: "CONTENT OF THE DOWNLOADED TXT FILE",
    restoreDefault: "Restore default template",
    downloadReady: "Package downloaded successfully!",
    downloadReadyDesc: "The file was successfully saved on your device with automatically active smart presets.",
    downloadProgress: "PREPARING SECURE INSTALLER...",
    
    // Newsletter / Footer
    subscribeTitle: "Stay Tuned with Updates",
    subscribeDesc: "Subscribe to our encrypted P2P newsletter to receive critical security bulletins and client updates.",
    emailPlaceholder: "Enter your cryptographically shielded email...",
    subscribeBtn: "Subscribe",
    footerBrandDesc: "Free and anonymous communication without compromise. Military-grade encryption, AI-driven audio filters, and Ultra-HD 8K streaming pipelines.",
    footerProduct: "PRODUCT",
    footerResources: "RESOURCES",
    footerCommunity: "COMMUNITY",
    footerDownload: "Download Client",
    footerFeatures: "AI Capabilities",
    footerPrices: "Pricing (Always Free)",
    footerBlog: "Development Blog",
    footerApi: "API Integration",
    footerStatus: "Channels Status",
    footerFollow: "Follow us and watch client updates on social networks.",
    footerRights: "Nexus Project. All rights reserved by the community.",
    devPanel: "Developer Panel",
    
    // Feedback
    feedbackButton: "Feedback",
    feedbackTitle: "Share Your Feedback",
    feedbackCategory: "Category:",
    feedbackCatAI: "AI Features",
    feedbackCatDesign: "Design & UI",
    feedbackCatSpeed: "Speed & Connection",
    feedbackCatOther: "Other",
    feedbackRating: "Rating:",
    feedbackTextPlaceholder: "What can we improve? We value your thoughts...",
    feedbackEmailLabel: "Contact Email (optional):",
    feedbackSubmit: "Submit Feedback",
    feedbackSuccess: "Thank you! Your feedback has been sent.",
    
    // Admin panel specific
    adminPanelTitle: "Nexus Administration panel",
    authButton: "Admin login portal",
    exitBtn: "Exit Control Panel",
    controlActive: "Control Panel Active",

    // Connection Info
    statusNetwork: "Network",
    statusOnline: "Online",
    statusOffline: "Offline",
    statusEncrypted: "Encrypted",
    statusSecured: "Secured",
    statusProtocol: "Protocol",
    statusEncryption: "Cipher",
    statusPing: "Latency",
    statusTLSDetail: "AES-GCM-255 (Quantum Signed)",

    // Language switcher tooltips
    langSelectedRU: "Russian language is selected",
    langSwitchRU: "Switch interface to Russian",
    langSelectedEN: "English language is selected",
    langSwitchEN: "Switch interface to English",

    // Toast notifications
    toastSettingsSaved: "Nexus settings successfully saved in real-time!",
    toastDownloadStart: "Starting secure Nexus package generation and download...",
    toastDownloadSuccess: "Nexus file successfully downloaded to your device!",
    toastFeedbackSuccess: "Feedback successfully registered in user logs tab!",
    toastOfflineWarning: "Warning: Network connection has been severed!",
    toastOnlineRestore: "Connection restored! Network secured with end-to-end TLSv1.3.",
    backToTop: "Back to Top"
  }
};

const DEFAULT_FILE_CONTENT = `=========================================
⚡ NEXUS — ИНСТРУКЦИЯ ПО УСТАНОВКЕ КЛИЕНТА
=========================================
Версия приложения: v3.0.0 (Релиз)
Лицензия: Полная свобода и безопасность
Режим сети: Напрямую к пирам (P2P Mesh)

-----------------------------------------
СПАСИБО ЗА ЗАГРУЗКУ NEXUS!
-----------------------------------------
Вы скачали универсальный кроссплатформенный инсталлятор.

СЛЕДУЮЩИЕ ШАГИ:
1. Распакуйте содержимое данного архива / запустите установщик.
2. Программа автоматически адаптируется под вашу операционную систему
   (Windows, macOS, Linux, Android или iOS).
3. Войдите в аккаунт или создайте новый за 3 секунды.
4. Голосовые каналы Ultra HD 8K и шифрование Quantum Shield 
   уже настроены и активированы для вашей конфиденциальности.

-----------------------------------------
Служба технической поддержки: @nexus_support 24/7
Nexus — Будущее свободного общения.`;

const DEFAULT_PLATFORMS: PlatformConfig[] = [
  {
    id: 'windows',
    name: 'Windows',
    tag: 'Windows x64 / ARM',
    desc: 'Автономный EXE-инсталлятор',
    icon: 'Monitor',
    isVisible: true,
    fileName: 'nexus_setup.exe',
    fileType: 'txt',
    redirectUrl: '',
    fileContent: `=========================================
⚡ NEXUS — ИНСТРУКЦИЯ ПО УСТАНОВКЕ КЛИЕНТА (WINDOWS)
=========================================
Версия приложения: v3.0.0 (Релиз)
Лицензия: Полная свобода и безопасность
Режим сети: Напрямую к пирам (P2P Mesh)

СЛЕДУЮЩИЕ ШАГИ:
1. Запустите nexus_setup.exe.
2. Программа установится в автоматическом режиме.
3. Войдите по крипто-ключу или создайте новый профиль.
4. Голосовые каналы Ultra HD 8K и фильтрация Crystal Voice AI активны по умолчанию.`,
    specCrc: '0xE4A9B11C',
    specSha: 'SHA-256: F3A1...W64E',
    specRuntime: 'CoreCLR / .NET 8.0'
  },
  {
    id: 'macos',
    name: 'macOS',
    tag: 'macOS Universal',
    desc: 'DMG образ для Intel и Apple Silicon (M1/M2/M3)',
    icon: 'Laptop',
    isVisible: true,
    fileName: 'nexus_setup.dmg',
    fileType: 'txt',
    redirectUrl: '',
    fileContent: `=========================================
⚡ NEXUS — ИНСТРУКЦИЯ ПО УСТАНОВКЕ КЛИЕНТА (macOS)
=========================================
Версия приложения: v3.0.0 (Релиз - DMG)
Лицензия: Полная свобода и безопасность

СЛЕДУЮЩИЕ ШАГИ:
1. Откройте образ nexus_setup.dmg.
2. Перетащите Nexus.app в папку Applications (Программы).
3. Запустите и наслаждайтесь качеством Crystal Voice.`,
    specCrc: '0xD7B8F9A1',
    specSha: 'SHA-256: A8B2...M1MA',
    specRuntime: 'Swift Universal Darwin'
  },
  {
    id: 'linux',
    name: 'Linux',
    tag: 'Linux x86_64 tar.gz',
    desc: 'Бинарный архив с поддержкой systemd',
    icon: 'Terminal',
    isVisible: true,
    fileName: 'nexus_setup.tar.gz',
    fileType: 'txt',
    redirectUrl: '',
    fileContent: `=========================================
⚡ NEXUS — ИНСТРУКЦИЯ ПО УСТАНОВКЕ КЛИЕНТА (LINUX)
=========================================
Версия приложения: v3.0.0

СЛЕДУЮЩИЕ ШАГИ:
1. Распакуйте архив: tar -xzf nexus_setup.tar.gz.
2. Сделайте файл исполняемым: chmod +x nexus.
3. Запустите бинарный файл: ./nexus.`,
    specCrc: '0xFA981C2E',
    specSha: 'SHA-256: 7C1E...LNXE',
    specRuntime: 'Glibc v2.38 / GCC 13'
  },
  {
    id: 'android',
    name: 'Android',
    tag: 'Android APK (v8a)',
    desc: 'Установочный APK для мобильных систем',
    icon: 'Smartphone',
    isVisible: true,
    fileName: 'nexus_setup.apk',
    fileType: 'txt',
    redirectUrl: '',
    fileContent: `=========================================
⚡ NEXUS — ИНСТРУКЦИЯ ПО УСТАНОВКЕ КЛИЕНТА (ANDROID)
=========================================
Версия приложения: v3.0.0 MOBILE (APK)

СЛЕДУЮЩИЕ ШАГИ:
1. Передайте и запустите apk-файл на вашем телефоне.
2. Разрешите установку из неизвестных источников в настройках.
3. Пройдите быструю настройку за 2 секунды.`,
    specCrc: '0x8BC4D92F',
    specSha: 'SHA-256: D9F2...ANDD',
    specRuntime: 'ART / API Level 34'
  },
  {
    id: 'ios',
    name: 'iOS',
    tag: 'iOS MobileConfig',
    desc: 'Мобильный профиль конфигурации',
    icon: 'Smartphone',
    isVisible: true,
    fileName: 'nexus_setup.mobileconfig',
    fileType: 'txt',
    redirectUrl: '',
    fileContent: `=========================================
⚡ NEXUS — ИНСТРУКЦИЯ ПО УСТАНОВКЕ КЛИЕНТА (iOS)
=========================================
Версия приложения: v3.0.0 WEB APP PROFILES

СЛЕДУЮЩИЕ ШАГИ:
1. Скачайте nexus_setup.mobileconfig.
2. Перейдите в настройки iOS -> Профиль загружен -> Нажмите Установить.
3. Добавьте PWA приложение на экран Домой.`,
    specCrc: '0x5EF891A0',
    specSha: 'SHA-256: E8A3...IOSP',
    specRuntime: 'Native Objective-C / iOS'
  }
];

const DEFAULT_SUPPORT_CHANNELS: SupportChannel[] = [
  {
    id: 'discord',
    name: 'Discord',
    icon: 'MessageSquare',
    value: '@nexus_support',
    url: 'https://discord.gg/nexus',
    desc: 'Наш официальный гильд-сервер. Пообщайтесь с разработчиками вживую.',
    color: '#5865F2',
    isActive: true,
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: 'Send',
    value: 't.me/nexus_help',
    url: 'https://t.me/nexus_help',
    desc: 'Быстрая поддержка напрямую в мессенджере. Моментальный ответ бота.',
    color: '#0088cc',
    isActive: true,
  },
  {
    id: 'email',
    name: 'Email',
    icon: 'Mail',
    value: 'support@nexus.com',
    url: 'mailto:support@nexus.com',
    desc: 'Для корпоративных предложений, жалоб на безопасность и партнерства.',
    color: '#6366f1',
    isActive: true,
  },
  {
    id: 'chat',
    name: 'Live Chat',
    icon: 'Headset',
    value: '24/7 на сайте',
    url: 'chat',
    desc: 'Интерактивный интеллектуальный чат. Кликните для входа.',
    color: '#a855f7',
    isActive: true,
  }
];

const safeGetItem = (key: string, defaultValue: string): string => {
  try {
    return localStorage.getItem(key) || defaultValue;
  } catch (e) {
    console.warn('localStorage is not available within this context:', e);
    return defaultValue;
  }
};

const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // Consumes write/storage errors inside restricted environments
  }
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [siteName, setSiteName] = useState(() => safeGetItem('siteName', 'NEXUS'));
  const [heroTagline, setHeroTagline] = useState(() => safeGetItem('heroTagline', 'Свободное и анонимное общение без компромиссов'));
  const [heroDescription, setHeroDescription] = useState(() => safeGetItem('heroDescription', 'Шифрование военного уровня, нейросетевые фильтры аудио и потоки качества Ultra-HD 8K.'));
  const [downloadsTodayOffset, setDownloadsTodayOffset] = useState(() => Number(safeGetItem('downloadsTodayOffset', '0')));

  // Manageable dynamic platforms state
  const [platforms, setPlatforms] = useState<PlatformConfig[]>(() => {
    const saved = safeGetItem('platforms', '');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn('Failed to parse saved platforms, using default.', e);
      }
    }
    return DEFAULT_PLATFORMS;
  });

  // Customizable support channels state
  const [supportChannels, setSupportChannels] = useState<SupportChannel[]>(() => {
    const saved = safeGetItem('supportChannels', '');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved supportChannels, using default.', e);
      }
    }
    return DEFAULT_SUPPORT_CHANNELS;
  });

  // Prepopulate with a default chatbot session or load from local storage
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const saved = safeGetItem('chatSessions', '');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn('Failed to parse saved chatSessions:', e);
      }
    }
    return [
      {
        id: 'session_demo',
        userName: 'Гость #4129 (Аноним)',
        lastActive: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        unread: false,
        messages: [
          {
            id: '1',
            sender: 'bot',
            text: 'Привет! Я виртуальный помощник Nexus 🌐. Рад помочь вам с любыми вопросами касательно технологии, безопасности и скачивания клиента. О чем бы вы хотели узнать?',
            time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          }
        ]
      }
    ];
  });
  const [activeSessionId, setActiveSessionId] = useState<string | null>('session_demo');

  // Installer configuration attributes
  const [downloadTitle, setDownloadTitle] = useState(() => safeGetItem('downloadTitle', 'Все устройства защищены'));
  const [downloadDesc, setDownloadDesc] = useState(() => safeGetItem('downloadDesc', 'Пакет сканируется на целостность, сертифицирован антивирусами и поставляется со сквозной цифровой защитой.'));
  const [downloadBtnText, setDownloadBtnText] = useState(() => safeGetItem('downloadBtnText', 'Скачать инсталлятор Nexus'));
  const [downloadFileName, setDownloadFileName] = useState(() => safeGetItem('downloadFileName', 'nexus_setup_v3.0.0.txt'));
  const [downloadFileType, setDownloadFileType] = useState<'txt' | 'link' | 'file'>(() => {
    const val = safeGetItem('downloadFileType', 'txt');
    return (val === 'link' || val === 'file' || val === 'txt') ? val : 'txt';
  });
  const [downloadRedirectUrl, setDownloadRedirectUrl] = useState(() => safeGetItem('downloadRedirectUrl', ''));
  const [downloadFileContent, setDownloadFileContent] = useState(() => safeGetItem('downloadFileContent', DEFAULT_FILE_CONTENT));
  const [specCrc, setSpecCrc] = useState(() => safeGetItem('specCrc', 'CRC32 OK'));
  const [specSha, setSpecSha] = useState(() => safeGetItem('specSha', 'SHA-256 SECURE'));
  const [specRuntime, setSpecRuntime] = useState(() => safeGetItem('specRuntime', 'v3.0 RUNTIME'));
  const [downloadSteps, setDownloadSteps] = useState(() => safeGetItem('downloadSteps', 'Инициализация безопасного туннеля...,Генерация квантовой крипто-подписи...,Сборка кроссплатформенного инсталлятора...,Загрузка зашифрованного ядра...'));

  // Uploaded file storage base64
  const [uploadedFileBase64, setUploadedFileBase64] = useState(() => safeGetItem('uploadedFileBase64', ''));
  const [uploadedFileName, setUploadedFileName] = useState(() => safeGetItem('uploadedFileName', ''));
  const [uploadedFileType, setUploadedFileType] = useState(() => safeGetItem('uploadedFileType', ''));

  const [language, setLanguage] = useState<'ru' | 'en'>(() => {
    // 1. Try to get saved language selection from local storage
    const saved = safeGetItem('language', '');
    if (saved === 'ru' || saved === 'en') {
      return saved;
    }
    
    // 2. Fallback: Detect user's browser language on initial load
    try {
      if (typeof navigator !== 'undefined') {
        const browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase();
        // If browser's language starts with ru, be, uk, kk, default to Russian, else default to English
        if (
          browserLang.startsWith('ru') || 
          browserLang.startsWith('be') || 
          browserLang.startsWith('uk') || 
          browserLang.startsWith('kk')
        ) {
          return 'ru';
        }
      }
    } catch (e) {
      console.warn('Browser language auto-detection failed:', e);
    }
    
    // Default fallback to English for other international users
    return 'en';
  });
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    // 1. Try to get saved theme option from local storage
    const saved = safeGetItem('theme', '');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }

    // 2. Fallback: Automatically detect user's OS-level dark/light mode preference
    try {
      if (typeof window !== 'undefined' && window.matchMedia) {
        const isOsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return isOsDark ? 'dark' : 'light';
      }
    } catch (e) {
      console.warn('Failed to detect OS-level color scheme preference:', e);
    }

    // Default fallback to dark
    return 'dark';
  });

  // Sync theme changes to documentElement for system-wide Tailwind dark variant support
  useEffect(() => {
    try {
      if (typeof document !== 'undefined') {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch (e) {
      console.warn('Failed to sync theme class with documentElement:', e);
    }
  }, [theme]);

  // Fetch real-time customization settings from server filesystem on mount
  useEffect(() => {
    const applyData = (data: any) => {
      if (data && Object.keys(data).length > 0) {
        if (data.siteName) setSiteName(data.siteName);
        if (data.heroTagline) setHeroTagline(data.heroTagline);
        if (data.heroDescription) setHeroDescription(data.heroDescription);
        if (data.downloadsTodayOffset !== undefined) setDownloadsTodayOffset(Number(data.downloadsTodayOffset));
        if (data.downloadTitle) setDownloadTitle(data.downloadTitle);
        if (data.downloadDesc) setDownloadDesc(data.downloadDesc);
        if (data.downloadBtnText) setDownloadBtnText(data.downloadBtnText);
        if (data.downloadFileName) setDownloadFileName(data.downloadFileName);
        if (data.downloadFileType) setDownloadFileType(data.downloadFileType);
        if (data.downloadRedirectUrl) setDownloadRedirectUrl(data.downloadRedirectUrl);
        if (data.downloadFileContent) setDownloadFileContent(data.downloadFileContent);
        if (data.specCrc) setSpecCrc(data.specCrc);
        if (data.specSha) setSpecSha(data.specSha);
        if (data.specRuntime) setSpecRuntime(data.specRuntime);
        if (data.downloadSteps) setDownloadSteps(data.downloadSteps);
        if (data.uploadedFileName) setUploadedFileName(data.uploadedFileName);
        if (data.uploadedFileType) setUploadedFileType(data.uploadedFileType);
        if (data.uploadedFileBase64) setUploadedFileBase64(data.uploadedFileBase64);
        if (data.supportChannels) setSupportChannels(data.supportChannels);
        if (data.platforms) setPlatforms(data.platforms);
      }
    };

    fetch('/api/get-settings')
      .then(res => {
        if (!res.ok) throw new Error('API server returned error code ' + res.status);
        return res.json();
      })
      .then(applyData)
      .catch(err => {
        console.warn('Unable to load settings via /api/get-settings, attempting static /admin_settings.json fallback:', err);
        // Static config file fallback (Vercel, Netlify, offline builds)
        fetch('/admin_settings.json')
          .then(res => res.json())
          .then(applyData)
          .catch(staticErr => {
            console.warn('No static admin_settings.json configuration found. Using localized initial state:', staticErr);
          });
      });
  }, []);

  // Synchronize chatSessions state across multiple browser tabs in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'chatSessions' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setChatSessions(parsed);
          }
        } catch (err) {
          console.error('Failed to sync chat sessions on storage event:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [adminNotifications, setAdminNotifications] = useState<string[]>([]);

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => {
    const saved = safeGetItem('feedbacks', '[]');
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  });

  const addFeedback = (f: Omit<FeedbackItem, 'id' | 'timestamp'>) => {
    const timestamp = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('ru-RU');
    const newFeedback: FeedbackItem = {
      ...f,
      id: `fb_${Date.now()}`,
      timestamp
    };
    setFeedbacks(prev => {
      const updated = [newFeedback, ...prev];
      safeSetItem('feedbacks', JSON.stringify(updated));
      return updated;
    });

    triggerAdminNotification(`[Feedback] Категория: ${f.category}, Оценка: ${f.rating}/5. Сообщение: "${f.userText}"`);
    window.dispatchEvent(new CustomEvent('nexus:feedbackAdded', { detail: newFeedback }));
  };

  // Localization helper t
  const t = (key: string): string => {
    if (language === 'ru') {
      if (key === 'heroTagline') return heroTagline;
      if (key === 'heroDescription') return heroDescription;
      if (key === 'siteName') return siteName;
      if (key === 'downloadTitle') return downloadTitle;
      if (key === 'downloadDesc') return downloadDesc;
      if (key === 'downloadBtnText') return downloadBtnText;
    } else {
      // English version overrides
      if (key === 'heroTagline' && heroTagline !== 'Свободное и анонимное общение без компромиссов') {
        return heroTagline;
      }
      if (key === 'heroDescription' && heroDescription !== 'Шифрование военного уровня, нейросетевые фильтры аудио и потоки качества Ultra-HD 8K.') {
        return heroDescription;
      }
      if (key === 'siteName') return siteName;
    }
    
    const langDict = translations[language];
    return langDict[key] || translations['ru'][key] || key;
  };

  useEffect(() => {
    safeSetItem('siteName', siteName);
    safeSetItem('heroTagline', heroTagline);
    safeSetItem('heroDescription', heroDescription);
    safeSetItem('downloadsTodayOffset', String(downloadsTodayOffset));
    safeSetItem('downloadTitle', downloadTitle);
    safeSetItem('downloadDesc', downloadDesc);
    safeSetItem('downloadBtnText', downloadBtnText);
    safeSetItem('downloadFileName', downloadFileName);
    safeSetItem('downloadFileType', downloadFileType);
    safeSetItem('downloadRedirectUrl', downloadRedirectUrl);
    safeSetItem('downloadFileContent', downloadFileContent);
    safeSetItem('specCrc', specCrc);
    safeSetItem('specSha', specSha);
    safeSetItem('specRuntime', specRuntime);
    safeSetItem('downloadSteps', downloadSteps);
    safeSetItem('uploadedFileBase64', uploadedFileBase64);
    safeSetItem('uploadedFileName', uploadedFileName);
    safeSetItem('uploadedFileType', uploadedFileType);
    safeSetItem('language', language);
    safeSetItem('theme', theme);
    safeSetItem('feedbacks', JSON.stringify(feedbacks));
    safeSetItem('supportChannels', JSON.stringify(supportChannels));
    safeSetItem('chatSessions', JSON.stringify(chatSessions));
    safeSetItem('platforms', JSON.stringify(platforms));
  }, [
    siteName, heroTagline, heroDescription, downloadsTodayOffset,
    downloadTitle, downloadDesc, downloadBtnText, downloadFileName,
    downloadFileType, downloadRedirectUrl, downloadFileContent,
    specCrc, specSha, specRuntime, downloadSteps,
    uploadedFileBase64, uploadedFileName, uploadedFileType,
    language, theme, feedbacks, supportChannels, chatSessions, platforms
  ]);

  const triggerAdminNotification = (text: string) => {
    setAdminNotifications(prev => [...prev, text]);
  };

  const clearAdminNotifications = () => {
    setAdminNotifications([]);
  };

  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast['type'] = 'info', duration = 4000) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setToasts(prev => [...prev, { id, message, type, duration }]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AdminContext.Provider value={{
      siteName, setSiteName,
      heroTagline, setHeroTagline,
      heroDescription, setHeroDescription,
      downloadsTodayOffset, setDownloadsTodayOffset,
      downloadTitle, setDownloadTitle,
      downloadDesc, setDownloadDesc,
      downloadBtnText, setDownloadBtnText,
      downloadFileName, setDownloadFileName,
      downloadFileType, setDownloadFileType,
      downloadRedirectUrl, setDownloadRedirectUrl,
      downloadFileContent, setDownloadFileContent,
      uploadedFileBase64, setUploadedFileBase64,
      uploadedFileName, setUploadedFileName,
      uploadedFileType, setUploadedFileType,
      specCrc, setSpecCrc,
      specSha, setSpecSha,
      specRuntime, setSpecRuntime,
      downloadSteps, setDownloadSteps,
      chatSessions, setChatSessions,
      activeSessionId, setActiveSessionId,
      isAdmin, setIsAdmin,
      isLoginModalOpen, setIsLoginModalOpen,
      broadcastMessage, setBroadcastMessage,
      triggerAdminNotification,
      adminNotifications,
      clearAdminNotifications,
      feedbacks,
      addFeedback,
      theme, setTheme,
      language, setLanguage,
      t,
      supportChannels,
      setSupportChannels,
      platforms,
      setPlatforms,
      toasts,
      showToast,
      removeToast
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
