import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin, ChatSession, ChatMessage, SupportChannel, FeedbackItem, PlatformConfig } from '../context/AdminState';
import DownloadTrendsChart from './DownloadTrendsChart';
import { 
  X, ShieldAlert, KeyRound, MonitorCheck, RefreshCw, 
  MessageSquare, Sliders, Globe, Server, Activity, ArrowRight, 
  CornerDownRight, Send, CheckCircle2, AlertTriangle, Play, HelpCircle, LogOut, Radio, Volume2, User,
  Trash2, Plus, Link2, Eye, EyeOff, LayoutDashboard, Settings, Download, MessageCircle, Share2, Terminal,
  TrendingUp, Star, Search, ShieldCheck, Cpu, HardDrive, Filter, Copy, Check, ChevronRight, BarChart3, CloudLightning,
  Monitor, Laptop, Smartphone
} from 'lucide-react';

export default function AdminPanelOverlay() {
  const {
    isAdmin, setIsAdmin,
    isLoginModalOpen, setIsLoginModalOpen,
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
    broadcastMessage, setBroadcastMessage,
    adminNotifications, clearAdminNotifications,
    supportChannels, setSupportChannels,
    feedbacks,
    platforms, setPlatforms,
    showUpdatesAlert, setShowUpdatesAlert,
    updatesAlertText, setUpdatesAlertText,
    updatesVersion, setUpdatesVersion,
    updatesTitleRu, setUpdatesTitleRu,
    updatesTitleEn, setUpdatesTitleEn,
    updatesSubtitleRu, setUpdatesSubtitleRu,
    updatesSubtitleEn, setUpdatesSubtitleEn,
    updateBlocks, setUpdateBlocks,
    showToast, t
  } = useAdmin();

  // Authentication states
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  
  // High-fidelity Category Navigation Tabs
  // Categories: 'dashboard' | 'branding' | 'installer' | 'channels' | 'interceptor' | 'logger' | 'updates'
  const [activeCategory, setActiveCategory] = useState<'dashboard' | 'branding' | 'installer' | 'channels' | 'interceptor' | 'logger' | 'updates'>('dashboard');
  
  // Custom interactive search / filters for feedbacks & logs
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState<string>('Все');
  const [logSearchQuery, setLogSearchQuery] = useState('');

  // Input bindings inside dashboard (temporary variables, applied when user clicks Save)
  const [tempSiteName, setTempSiteName] = useState(siteName);
  const [tempTagline, setTempTagline] = useState(heroTagline);
  const [tempDescription, setTempDescription] = useState(heroDescription);
  const [tempOffset, setTempOffset] = useState(downloadsTodayOffset);
  const [tempBroadcast, setTempBroadcast] = useState(broadcastMessage);
  const [tempShowUpdatesAlert, setTempShowUpdatesAlert] = useState(showUpdatesAlert);
  const [tempUpdatesAlertText, setTempUpdatesAlertText] = useState(updatesAlertText);

  // Updates hub configuration temporaries
  const [tempUpdatesVersion, setTempUpdatesVersion] = useState(updatesVersion);
  const [tempUpdatesTitleRu, setTempUpdatesTitleRu] = useState(updatesTitleRu);
  const [tempUpdatesTitleEn, setTempUpdatesTitleEn] = useState(updatesTitleEn);
  const [tempUpdatesSubtitleRu, setTempUpdatesSubtitleRu] = useState(updatesSubtitleRu);
  const [tempUpdatesSubtitleEn, setTempUpdatesSubtitleEn] = useState(updatesSubtitleEn);
  const [tempUpdateBlocks, setTempUpdateBlocks] = useState<any[]>(updateBlocks);

  // Support channel temporaries
  const [tempSupportChannels, setTempSupportChannels] = useState<SupportChannel[]>(supportChannels);

  // Installer configuration temporaries
  const [tempDownloadTitle, setTempDownloadTitle] = useState(downloadTitle);
  const [tempDownloadDesc, setTempDownloadDesc] = useState(downloadDesc);
  const [tempDownloadBtnText, setTempDownloadBtnText] = useState(downloadBtnText);
  const [tempDownloadFileName, setTempDownloadFileName] = useState(downloadFileName);
  const [tempDownloadFileType, setTempDownloadFileType] = useState<'txt' | 'link' | 'file'>(downloadFileType);
  const [tempDownloadRedirectUrl, setTempDownloadRedirectUrl] = useState(downloadRedirectUrl);
  const [tempDownloadFileContent, setTempDownloadFileContent] = useState(downloadFileContent);
  const [tempUploadedFileBase64, setTempUploadedFileBase64] = useState(uploadedFileBase64);
  const [tempUploadedFile, setTempUploadedFile] = useState<File | null>(null);
  const [tempUploadedFileName, setTempUploadedFileName] = useState(uploadedFileName);
  const [tempUploadedFileType, setTempUploadedFileType] = useState(uploadedFileType);
  const [tempSpecCrc, setTempSpecCrc] = useState(specCrc);
  const [tempSpecSha, setTempSpecSha] = useState(specSha);
  const [tempSpecRuntime, setTempSpecRuntime] = useState(specRuntime);
  const [tempDownloadSteps, setTempDownloadSteps] = useState(downloadSteps);
  const [tempPlatforms, setTempPlatforms] = useState<PlatformConfig[]>([]);
  const [adminActivePlatformId, setAdminActivePlatformId] = useState<'windows' | 'macos' | 'linux' | 'android' | 'ios'>('windows');

  // Live admin reply state
  const [adminReplyText, setAdminReplyText] = useState('');
  const [adminLogs, setAdminLogs] = useState<string[]>([
    'Защищенный шлюз инициализирован.', 
    'Админ-панель готова к работе.',
    'Квантовое шифрование соединений переведено на E2E P2P.'
  ]);

  // Chat window bottom anchors
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);

  // Sync internal state with context state when logged in or changes occur
  useEffect(() => {
    if (isAdmin) {
      setTempSiteName(siteName);
      setTempTagline(heroTagline);
      setTempDescription(heroDescription);
      setTempOffset(downloadsTodayOffset);
      setTempBroadcast(broadcastMessage);

      setTempDownloadTitle(downloadTitle);
      setTempDownloadDesc(downloadDesc);
      setTempDownloadBtnText(downloadBtnText);
      setTempDownloadFileName(downloadFileName);
      setTempDownloadFileType(downloadFileType);
      setTempDownloadRedirectUrl(downloadRedirectUrl);
      setTempDownloadFileContent(downloadFileContent);
      setTempUploadedFileBase64(uploadedFileBase64);
      setTempUploadedFileName(uploadedFileName);
      setTempUploadedFileType(uploadedFileType);
      setTempSpecCrc(specCrc);
      setTempSpecSha(specSha);
      setTempSpecRuntime(specRuntime);
      setTempDownloadSteps(downloadSteps);
      setTempSupportChannels(supportChannels);
      setTempPlatforms(platforms || []);
      setTempShowUpdatesAlert(showUpdatesAlert);
      setTempUpdatesAlertText(updatesAlertText);
      setTempUpdatesVersion(updatesVersion);
      setTempUpdatesTitleRu(updatesTitleRu);
      setTempUpdatesTitleEn(updatesTitleEn);
      setTempUpdatesSubtitleRu(updatesSubtitleRu);
      setTempUpdatesSubtitleEn(updatesSubtitleEn);
      setTempUpdateBlocks(updateBlocks);
    }
  }, [
    isAdmin, siteName, heroTagline, heroDescription, downloadsTodayOffset, broadcastMessage,
    downloadTitle, downloadDesc, downloadBtnText, downloadFileName, downloadFileType,
    downloadRedirectUrl, downloadFileContent, uploadedFileBase64, uploadedFileName, uploadedFileType,
    specCrc, specSha, specRuntime, downloadSteps, supportChannels, platforms, showUpdatesAlert, updatesAlertText,
    updatesVersion, updatesTitleRu, updatesTitleEn, updatesSubtitleRu, updatesSubtitleEn, updateBlocks
  ]);

  const activeSession = chatSessions.find(s => s.id === activeSessionId) || null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTempUploadedFile(file);
      setTempUploadedFileName(file.name);
      setTempUploadedFileType(file.type);
      setTempDownloadFileName(file.name);
      addLog(`Файл подготовлен ко внедрению: "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setTempUploadedFile(file);
      setTempUploadedFileName(file.name);
      setTempUploadedFileType(file.type);
      setTempDownloadFileName(file.name);
      addLog(`Файл перетащен во внедрение: "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`);
    }
  };

  // Auto-scrollToBottom inside active session
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSessionId, activeSession?.messages?.length]);

  const addLog = (text: string) => {
    const time = new Date().toLocaleTimeString('ru-RU');
    setAdminLogs(prev => [`[${time}] ${text}`, ...prev]);
  };

  useEffect(() => {
    const handleFeedbackEvent = (e: any) => {
      const fb = e.detail;
      const emailStr = fb.userEmail ? ` от ${fb.userEmail}` : '';
      addLog(`[ОБРАТНАЯ СВЯЗЬ] Получен отзыв (${fb.category}, Оценка: ${fb.rating}/5): "${fb.userText}"${emailStr}`);
    };
    window.addEventListener('nexus:feedbackAdded', handleFeedbackEvent);
    return () => window.removeEventListener('nexus:feedbackAdded', handleFeedbackEvent);
  }, []);

  useEffect(() => {
    fetch('/api/installer-status')
      .then(res => res.json())
      .then(data => {
        if (data.hasFile) {
          addLog(`[Диспетчер диска] На сервере обнаружен ранее загруженный файл: "${data.fileName}" (~${(data.size / 1024).toFixed(1)} KB).`);
        } else {
          addLog('[Диспетчер диска] На сервере пока нет загруженных файлов. Будет использован стандартный текстовый дистрибутив.');
        }
      })
      .catch(err => {
        console.warn('Unable to retrieve server file status:', err);
      });
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim() === 'admin@gmail.com' && passwordInput === '638650') {
      setIsAdmin(true);
      setAuthError('');
      addLog('Администратор admin@gmail.com успешно вошел в панель.');
    } else {
      setAuthError('Неверный адрес почты или мастер-ключ!');
    }
  };

  const handleApplyCustomizations = () => {
    setSiteName(tempSiteName);
    setHeroTagline(tempTagline);
    setHeroDescription(tempDescription);
    setDownloadsTodayOffset(Number(tempOffset));
    setBroadcastMessage(tempBroadcast);
    setShowUpdatesAlert(tempShowUpdatesAlert);
    setUpdatesAlertText(tempUpdatesAlertText);

    // Save Updates-specific options
    setUpdatesVersion(tempUpdatesVersion);
    setUpdatesTitleRu(tempUpdatesTitleRu);
    setUpdatesTitleEn(tempUpdatesTitleEn);
    setUpdatesSubtitleRu(tempUpdatesSubtitleRu);
    setUpdatesSubtitleEn(tempUpdatesSubtitleEn);
    setUpdateBlocks(tempUpdateBlocks);

    // Save installer states
    setDownloadTitle(tempDownloadTitle);
    setDownloadDesc(tempDownloadDesc);
    setDownloadBtnText(tempDownloadBtnText);
    setDownloadFileName(tempDownloadFileName);
    setDownloadFileType(tempDownloadFileType);
    setDownloadRedirectUrl(tempDownloadRedirectUrl);
    setDownloadFileContent(tempDownloadFileContent);
    setUploadedFileName(tempUploadedFileName);
    setUploadedFileType(tempUploadedFileType);
    setUploadedFileBase64(""); // Do not store massive file content in React state/localStorage
    setSpecCrc(tempSpecCrc);
    setSpecSha(tempSpecSha);
    setSpecRuntime(tempSpecRuntime);
    setDownloadSteps(tempDownloadSteps);

    // Save support channels
    setSupportChannels(tempSupportChannels);
    setPlatforms(tempPlatforms);

    // Persist all text configurations in admin_settings.json on the server
    const settingsPayload = {
      siteName: tempSiteName,
      heroTagline: tempTagline,
      heroDescription: tempDescription,
      downloadsTodayOffset: Number(tempOffset),
      broadcastMessage: tempBroadcast,
      showUpdatesAlert: tempShowUpdatesAlert,
      updatesAlertText: tempUpdatesAlertText,
      updatesVersion: tempUpdatesVersion,
      updatesTitleRu: tempUpdatesTitleRu,
      updatesTitleEn: tempUpdatesTitleEn,
      updatesSubtitleRu: tempUpdatesSubtitleRu,
      updatesSubtitleEn: tempUpdatesSubtitleEn,
      updateBlocks: tempUpdateBlocks,
      downloadTitle: tempDownloadTitle,
      downloadDesc: tempDownloadDesc,
      downloadBtnText: tempDownloadBtnText,
      downloadFileName: tempDownloadFileName,
      downloadFileType: tempDownloadFileType,
      downloadRedirectUrl: tempDownloadRedirectUrl,
      downloadFileContent: tempDownloadFileContent,
      uploadedFileName: tempUploadedFileName,
      uploadedFileType: tempUploadedFileType,
      uploadedFileBase64: "", // Never write massive base64 payloads to settings JSON!
      specCrc: tempSpecCrc,
      specSha: tempSpecSha,
      specRuntime: tempSpecRuntime,
      downloadSteps: tempDownloadSteps,
      supportChannels: tempSupportChannels,
      platforms: tempPlatforms.map(p => ({ ...p, uploadedFileBase64: "" })) // Strip any large base64 from platforms
    };

    fetch('/api/save-settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settingsPayload)
    })
    .then(res => {
      if (!res.ok) throw new Error('Код ответа ' + res.status);
      addLog('[Служба CMS] Все текстовые пресеты и параметры бренда успешно закреплены на диске сервера.');
    })
    .catch(err => {
      console.error('Failed to sync settings on server:', err);
      addLog('[ОШИБКА CMS] Не удалось синхронизировать параметры в хранилище сервера: ' + err.message);
    });

    // Server-side binary upload routing
    if (tempDownloadFileType === 'file' && tempUploadedFile) {
      addLog(`[Синхронизация] Начата поблочная передача файла "${tempUploadedFileName}"...`);
      
      const file = tempUploadedFile;
      const CHUNK_SIZE = 256 * 1024; // 256KB chunks
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      
      const uploadChunk = (chunkIndex: number) => {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const blob = file.slice(start, end);
        
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            const base64Data = reader.result.substring(reader.result.indexOf(',') + 1);
            
            fetch('/api/upload-installer-chunk', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                chunkIndex,
                totalChunks,
                fileName: tempUploadedFileName,
                fileType: tempUploadedFileType || 'application/octet-stream',
                chunkData: base64Data
              })
            })
            .then(res => {
              if (!res.ok) throw new Error('Сервер вернул код ошибки ' + res.status);
              return res.json();
            })
            .then(data => {
              const progress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
              addLog(`[Передача] Загружено ${progress}% (${chunkIndex + 1}/${totalChunks} блоков)...`);
              
              if (chunkIndex < totalChunks - 1) {
                uploadChunk(chunkIndex + 1);
              } else {
                addLog(`[УСПЕХ] Файл "${tempUploadedFileName}" весом ${(data.size / 1024).toFixed(1)} KB сохранен на сервере.`);
                showToast('Файл успешно сохранен на сервере!', 'success');
                setTempUploadedFile(null);
              }
            })
            .catch(err => {
              console.error('File upload failed at chunk ' + chunkIndex, err);
              addLog(`[ОШИБКА ДИСТРИБУЦИИ] Сбой передачи сегмента ${chunkIndex + 1}: ${err.message}`);
              showToast('Произошла ошибка при поблочной загрузке файла. Пожалуйста, сохраните настройки снова.', 'error');
            });
          }
        };
        reader.readAsDataURL(blob);
      };
      
      uploadChunk(0);
    }

    addLog(`Обновлены настройки сайта: имя="${tempSiteName}", файл="${tempDownloadFileName}", каналов=` + tempSupportChannels.length);
    showToast('Системные изменения успешно внедрены на сайт!', 'success');
  };

  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !activeSessionId) return;

    const replyMsg: ChatMessage = {
      id: `admin_${Date.now()}`,
      sender: 'admin',
      text: adminReplyText,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };

    setChatSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        return {
          ...session,
          unread: false,
          lastActive: replyMsg.time,
          messages: [...session.messages, replyMsg]
        };
      }
      return session;
    }));

    addLog(`Отправлен ответ в сессию "${activeSession?.userName}": ${adminReplyText.slice(0, 30)}...`);
    setAdminReplyText('');

    window.dispatchEvent(new CustomEvent('nexus:adminMessage', {
      detail: { sessionId: activeSessionId, message: replyMsg }
    }));
  };

  const forceClientQuestionSimulation = (presetNum: number) => {
    const questions = [
      'Здравствуйте! Я из Киева, работает ли Nexus без VPN в сложных регионах?',
      'Приветствую. Как верифицировать свой зашифрованный E2E ключ SHA-256?',
      'Браузер ругается на файловый лог. Безопасно ли запускать .txt или настроить exe-конфиг?',
      'Есть ли мобильная версия для iOS или планируется ли открытый P2P-клиент?'
    ];
    const pickedText = questions[presetNum];
    const newMsg: ChatMessage = {
      id: `userSim_${Date.now()}`,
      sender: 'user',
      text: pickedText,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };

    setChatSessions(prev => prev.map(s => {
      if (s.id === 'session_demo') {
        return {
          ...s,
          unread: true,
          lastActive: newMsg.time,
          messages: [...s.messages, newMsg]
        };
      }
      return s;
    }));

    addLog(`[Симуляция] Новое сообщение от Демо-клиента: "${pickedText}"`);
    
    window.dispatchEvent(new CustomEvent('nexus:userMessageSimulated', {
      detail: { text: pickedText }
    }));
    
    showToast('Новый запрос имитирован в чате!', 'info');
  };

  // Metrics calculations for high-end dashboard
  const totalDownloadsToday = 1384 + downloadsTodayOffset;
  
  const computedStats = React.useMemo(() => {
    if (!feedbacks || feedbacks.length === 0) {
      return {
        avgRating: 4.9,
        total: 12,
        byCategory: { 'Возможности AI': 3, 'Дизайн и Интерфейс': 5, 'Скорость и Соединение': 3, 'Другое': 1 },
        stars: { '5': 10, '4': 2, '3': 0, '2': 0, '1': 0 }
      };
    }
    const total = feedbacks.length;
    const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
    const avgRating = Number((sum / total).toFixed(1));
    
    const byCategory: Record<string, number> = { 'Возможности AI': 0, 'Дизайн и Интерфейс': 0, 'Скорость и Соединение': 0, 'Другое': 0 };
    const stars: Record<string, number> = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };
    
    feedbacks.forEach(f => {
      if (byCategory[f.category] !== undefined) {
        byCategory[f.category]++;
      } else {
        byCategory['Другое']++;
      }
      const scoreStr = String(Math.floor(f.rating));
      if (stars[scoreStr] !== undefined) {
        stars[scoreStr]++;
      }
    });

    return { avgRating, total, byCategory, stars };
  }, [feedbacks]);

  // Copy helper
  const handleCopyToClipboard = (text: string, id: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedTextId(id);
      setTimeout(() => setCopiedTextId(null), 2000);
      showToast('Текст скопирован в буфер!', 'info');
    } catch {}
  };

  return (
    <>
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050508]/90 backdrop-blur-lg overflow-hidden w-screen h-screen">
            
            {/* BACKGROUND GLOWS ORBS */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[140px] pointer-events-none" />
            
            {/* LOGIN DIALOG BOX (Shown if not authenticated yet) */}
            {!isAdmin ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -30 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full max-w-lg bg-[#0a0a12] border border-purple-500/25 rounded-3xl p-8 relative overflow-hidden shadow-2xl shrink-0"
              >
                {/* Tech grid border lights */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                
                <div className="relative space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400 border border-purple-500/35">
                        <ShieldAlert className="w-5.5 h-5.5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white text-base tracking-wide uppercase font-mono">
                          NEXUS SECURE AUTH
                        </h3>
                        <span className="text-[9px] text-purple-400 uppercase tracking-widest font-mono block">Криптографический Рубеж</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsLoginModalOpen(false)}
                      className="cursor-pointer text-slate-500 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-[#10101d] border border-white/5 rounded-2xl p-4.5 space-y-2">
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      Добро пожаловать в шлюз ядра мессенджера. Авторизуйтесь под своей инженерной учетной записью администратора для полного контроля над сайтом.
                    </p>
                    <div className="pt-1.5 flex items-center gap-2 text-[10px] text-purple-300 font-mono">
                      <span className="inline-block w-2 h-2 rounded-full bg-purple-500 animate-ping shrink-0" />
                      <span>Аутентификация требует AES-GCM токен</span>
                    </div>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                        Адрес электронной почты
                      </label>
                      <input 
                        type="email" 
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="admin@gmail.com"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:bg-black/70 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                        Мастер-Ключ Безопасности
                      </label>
                      <input 
                        type="password" 
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:bg-black/70 font-mono"
                      />
                    </div>

                    {authError && (
                      <p className="text-xs text-rose-400 font-semibold bg-rose-950/25 border border-rose-500/25 px-3 py-2.5 rounded-xl flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        {authError}
                      </p>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button 
                        type="button"
                        onClick={() => setIsLoginModalOpen(false)}
                        className="cursor-pointer py-3.5 flex-1 rounded-xl text-xs font-bold text-slate-400 bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center"
                      >
                        Вернуться
                      </button>
                      <button 
                        type="submit"
                        className="cursor-pointer py-3.5 flex-1 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/30 transition-all text-center flex items-center justify-center gap-1.5"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>Войти в систему</span>
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            ) : (
              
              /* STANDALONE EXPANDED PROFESSIONAL CONTROL HOOD PORTAL */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full bg-[#05050a] flex flex-col relative select-text"
                id="portal-workspace-master"
              >
                {/* GLOBAL DASHBOARD HEADER HUD */}
                <header className="bg-slate-950/90 border-b border-white/5 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/35 flex items-center justify-center text-purple-400">
                      <CloudLightning className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-white font-extrabold text-sm tracking-widest uppercase font-mono">
                          NEXUS CORE WORKSPACE v3.10
                        </h2>
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          LIVE CONSOLE ACTIVE
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono transition-all">
                        <span>Узел: 0.0.0.0:3000</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <span>Администратор: admin@gmail.com</span>
                      </div>
                    </div>
                  </div>

                  {/* HEADER QUICK ACTIONS */}
                  <div className="flex items-center gap-2.5">
                    
                    <button
                      onClick={handleApplyCustomizations}
                      className="cursor-pointer bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[11px] uppercase tracking-wider px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-purple-600/20 flex items-center gap-1.5 active:scale-95 border border-purple-400/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Сохранить всё</span>
                    </button>

                    <button
                      onClick={() => setIsLoginModalOpen(false)}
                      className="cursor-pointer bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold text-xs px-3.5 py-2 rounded-xl transition-all border border-white/5 flex items-center gap-1.5 hover:text-white"
                      title="Вернуться к просмотру сайта без логаута"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Панель сайта</span>
                    </button>

                    <span className="w-px h-6 bg-white/10 mx-1 hidden sm:inline" />

                    <button
                      onClick={() => {
                        setIsAdmin(false);
                        addLog('Администратор принудительно завершил суверенную сессию.');
                        showToast('Вы вышли из учетной записи', 'warning');
                      }}
                      className="cursor-pointer text-xs font-bold text-rose-400 hover:text-rose-300 px-3 py-2 rounded-xl border border-rose-500/20 hover:bg-rose-500/10 flex items-center gap-1 bg-rose-950/5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Выйти</span>
                    </button>
                  </div>
                </header>

                {/* WORKSPACE COLUMN SPLIT: SIDEBAR LEFT & DETAILS GRID RIGHT */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                  
                  {/* SIDEBAR NAVIGATION - CATEGORIES & SUB-CATEGORIES */}
                  <aside className="w-full md:w-64 bg-slate-950/40 border-r border-white/5 flex flex-col shrink-0 overflow-y-auto z-10">
                    
                    {/* Navigation Category list container */}
                    <div className="flex-1 p-3 space-y-5">
                      
                      {/* Nav Group 1: METRICS & VISUAL */}
                      <div className="space-y-1">
                        <span className="px-3 text-[10px] font-mono text-purple-400/80 uppercase font-extrabold tracking-widest block mb-2">
                          Аналитический блок
                        </span>
                        
                        <button
                          onClick={() => setActiveCategory('dashboard')}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            activeCategory === 'dashboard'
                              ? 'bg-purple-600/15 border border-purple-500/25 text-white shadow shadow-purple-950/20'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4 shrink-0" />
                            <span>Панель Сводки</span>
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 opacity-50 transition-transform ${activeCategory === 'dashboard' ? 'rotate-90 text-purple-400' : ''}`} />
                        </button>
                      </div>

                      {/* Nav Group 2: SYSTEM CONFIG */}
                      <div className="space-y-1">
                        <span className="px-3 text-[10px] font-mono text-purple-400/80 uppercase font-extrabold tracking-widest block mb-1">
                          Кабинет Настроек
                        </span>

                        <button
                          onClick={() => setActiveCategory('branding')}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            activeCategory === 'branding'
                              ? 'bg-purple-600/15 border border-purple-500/25 text-white'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Sliders className="w-4 h-4 shrink-0" />
                            <span>Редактор Контента</span>
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 opacity-50 transition-transform ${activeCategory === 'branding' ? 'rotate-90 text-purple-400' : ''}`} />
                        </button>

                        <button
                          onClick={() => setActiveCategory('installer')}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            activeCategory === 'installer'
                              ? 'bg-purple-600/15 border border-purple-500/25 text-white shadow'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Download className="w-4 h-4 shrink-0" />
                            <span>Настройка Загрузки</span>
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 opacity-50 transition-transform ${activeCategory === 'installer' ? 'rotate-90 text-purple-400' : ''}`} />
                        </button>

                        <button
                          onClick={() => setActiveCategory('updates')}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            activeCategory === 'updates'
                              ? 'bg-purple-600/15 border border-purple-500/25 text-white shadow'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
                            <span>Экран Обновлений (CMS)</span>
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 opacity-50 transition-transform ${activeCategory === 'updates' ? 'rotate-90 text-purple-400' : ''}`} />
                        </button>
                      </div>

                      {/* Nav Group 3: COMMUNICATIONS */}
                      <div className="space-y-1">
                        <span className="px-3 text-[10px] font-mono text-purple-400/80 uppercase font-extrabold tracking-widest block mb-1">
                          Деск Поддержки
                        </span>

                        <button
                          onClick={() => setActiveCategory('interceptor')}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                            activeCategory === 'interceptor'
                              ? 'bg-purple-600/15 border border-purple-500/25 text-white'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 shrink-0" />
                            <span>Перехват Чатов</span>
                            {chatSessions.some(c => c.unread) && (
                              <span className="absolute left-2.5 top-2.5 w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] bg-slate-900 border border-white/5 py-0.5 px-1.5 rounded font-mono text-purple-300">{chatSessions.length}</span>
                            <ChevronRight className={`w-3.5 h-3.5 opacity-50 transition-transform ${activeCategory === 'interceptor' ? 'rotate-90 text-purple-400' : ''}`} />
                          </div>
                        </button>

                        <button
                          onClick={() => setActiveCategory('channels')}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            activeCategory === 'channels'
                              ? 'bg-purple-600/15 border border-purple-500/25 text-white shadow'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Share2 className="w-4 h-4 shrink-0" />
                            <span>Каналы и Кнопки</span>
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 opacity-50 transition-transform ${activeCategory === 'channels' ? 'rotate-90 text-purple-400' : ''}`} />
                        </button>
                      </div>

                      {/* Nav Group 4: HARDWARE CORE */}
                      <div className="space-y-1">
                        <span className="px-3 text-[10px] font-mono text-purple-400/80 uppercase font-extrabold tracking-widest block mb-1">
                          Ядро и Пакеты
                        </span>

                        <button
                          onClick={() => setActiveCategory('logger')}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            activeCategory === 'logger'
                              ? 'bg-purple-600/15 border border-purple-500/25 text-white shadow'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 shrink-0" />
                            <span>Системные Логи</span>
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 opacity-50 transition-transform ${activeCategory === 'logger' ? 'rotate-90 text-purple-400' : ''}`} />
                        </button>
                      </div>

                    </div>

                    {/* Left sidebar footer with server indicator */}
                    <div className="p-4 bg-slate-950/60 border-t border-white/5 space-y-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-mono font-bold text-slate-400">P2P KERNEL ACTIVE</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        Операторы защищены квантовой криптографической подписью AES-255-GCM.
                      </p>
                    </div>
                  </aside>

                  {/* DETAILS VIEWPORT CONTAINER */}
                  <main className="flex-1 overflow-y-auto bg-[#07070c] p-6 lg:p-8 space-y-6">
                    
                    {/* ---------------------------------------------------- */}
                    {/* CATEGORY: DASHBOARD (С сводными аналитиками и чартами) */}
                    {/* ---------------------------------------------------- */}
                    {activeCategory === 'dashboard' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        {/* Tab header area */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                          <div>
                            <h3 className="text-white font-extrabold text-xl flex items-center gap-2 tracking-tight">
                              <LayoutDashboard className="w-5.5 h-5.5 text-purple-400" />
                              <span>Раздел: Аналитика и Сводная Статистика</span>
                            </h3>
                            <p className="text-slate-400 text-xs mt-1 font-light leading-normal">
                              Информационная панель реального времени. Настройте добавку счетчика скачиваний, просматривайте рейтинг клиентов и анализируйте отзывы.
                            </p>
                          </div>
                          <div className="bg-slate-900 border border-white/5 shadow-inner px-3 py-2 rounded-xl text-[11px] font-mono text-slate-400 flex items-center gap-2.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Обновление: Мгновенное</span>
                          </div>
                        </div>

                        {/* HIGH-END KEY METRICS METADATA GRIDS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          
                          {/* Card 1: Downloads today dynamic widget */}
                          <div className="bg-[#0b0b14]/75 border border-white/5 rounded-2xl p-5 relative overflow-hidden group shadow hover:border-purple-500/20 transition-all">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-600/5 rounded-full blur-xl pointer-events-none group-hover:bg-purple-600/10 transition-all" />
                            <div className="flex justify-between items-start">
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider">Всего скачиваний сегодня</span>
                                <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-baseline gap-1.5 font-mono">
                                  <span>{totalDownloadsToday}</span>
                                  <span className="text-xs text-purple-400 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded font-sans">+{downloadsTodayOffset} доп.</span>
                                </h1>
                              </div>
                              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                                <Download className="w-4.5 h-4.5" />
                              </div>
                            </div>
                            
                            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                              <span className="text-[10px] text-slate-550 leading-relaxed font-mono">Коррекция счетчика добавочных копий:</span>
                              <input
                                type="number"
                                value={tempOffset}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setTempOffset(val);
                                  setDownloadsTodayOffset(val); // Real-time feedback in parent context
                                  addLog(`Коррекция добавочных копий скачивания изменена на: +${val}`);
                                }}
                                title="Изменение добавочного смещения"
                                placeholder="0"
                                className="w-16 bg-black/60 border border-white/10 rounded px-2 py-0.5 text-center text-xs text-purple-300 font-bold font-mono focus:outline-none focus:border-purple-500 focus:bg-black/90"
                              />
                            </div>
                          </div>

                          {/* Card 2: Cumulative Customer Satisfaction feedback */}
                          <div className="bg-[#0b0b14]/75 border border-white/5 rounded-2xl p-5 relative overflow-hidden group shadow hover:border-amber-500/20 transition-all">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-600/5 rounded-full blur-xl pointer-events-none transition-all" />
                            <div className="flex justify-between items-start">
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider">Индекс Доверия (Rating)</span>
                                <h1 className="text-3xl font-extrabold tracking-tight text-amber-400 flex items-center gap-1.5 font-mono">
                                  <span>{computedStats.avgRating}</span>
                                  <span className="text-xs text-slate-450 font-medium">★ из 5.0</span>
                                </h1>
                              </div>
                              <div className="p-2 bg-amber-500/15 text-amber-400 rounded-xl border border-amber-550/20">
                                <Star className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-450 mt-4 leading-normal font-sans">
                              Рассчитано на основе <b className="text-amber-400">{computedStats.total}</b> реальных отзывов пользователей во встроенном виджете обратной связи.
                            </p>
                          </div>

                          {/* Card 3: Operation system load metrics */}
                          <div className="bg-[#0b0b14]/75 border border-white/5 rounded-2xl p-5 relative overflow-hidden group shadow hover:border-purple-500/20 transition-all">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-600/5 rounded-full blur-xl pointer-events-none transition-all" />
                            <div className="flex justify-between items-start">
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider">Текущая Нагрузка Сети</span>
                                <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-baseline gap-1 font-mono">
                                  <span className="animate-pulse">CPU 2.4%</span>
                                </h1>
                              </div>
                              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                                <Activity className="w-4.5 h-4.5" />
                              </div>
                            </div>
                            <div className="text-[10px] text-slate-550 mt-4 flex items-center justify-between">
                              <span className="font-mono">ОТКЛИК: 0.8ms (В сети)</span>
                              <span className="text-emerald-400 font-bold uppercase tracking-wider">В СЕТИ 100%</span>
                            </div>
                          </div>

                        </div>

                        {/* TWO COLUMN GRID: CHART & DETAILED STAR RATING BREAKDOWN */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
                          
                          {/* Left layout item: High fidelity SVG line chart showing download trends */}
                          <div className="lg:col-span-8 bg-[#0b0b14]/75 border border-white/5 rounded-3xl p-6 relative">
                            <DownloadTrendsChart downloadsTodayOffset={downloadsTodayOffset} />
                            <div className="hidden">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-4 mb-4">
                              <div>
                                <h4 className="text-white font-extrabold text-xs uppercase tracking-wider font-mono">График интенсивности скачиваний (7 дней)</h4>
                                <span className="text-[10px] text-slate-400 mt-1 block">Активность распределения пиров и трафика</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-purple-400 flex items-center gap-1">
                                  <span className="w-2.5 h-1 bg-purple-500 inline-block rounded" />
                                  <span>Пики активности за сутки</span>
                                </span>
                              </div>
                            </div>

                            {/* Crisp SVG area line graph */}
                            <div className="w-full h-56 mt-4">
                              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 220" preserveAspectRatio="none">
                                <defs>
                                  {/* Area glow purple gradient */}
                                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.00" />
                                  </linearGradient>
                                </defs>

                                {/* Grid guides horizontal lines */}
                                <line x1="0" y1="50" x2="700" y2="50" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="3,3" />
                                <line x1="0" y1="110" x2="700" y2="110" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="3,3" />
                                <line x1="0" y1="170" x2="700" y2="170" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="3,3" />
                                
                                {/* Vertical separators */}
                                <line x1="116.6" y1="0" x2="116.6" y2="200" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
                                <line x1="233.2" y1="0" x2="233.2" y2="200" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
                                <line x1="349.8" y1="0" x2="349.8" y2="200" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
                                <line x1="466.4" y1="0" x2="466.4" y2="200" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
                                <line x1="583"   y1="0" x2="583"   y2="200" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />

                                {/* Area Fill Path under the curve */}
                                <path 
                                  d="M 10,210 L 10,130 Q 116.6,140 116.6,150 T 233.2,90 T 349.8,110 T 466.4,40 T 583,160 T 680,60 L 680,210 Z" 
                                  fill="url(#chartGradient)" 
                                />

                                {/* Interactive Stroke Curved Line */}
                                <path 
                                  d="M 10,130 Q 116.6,140 116.6,150 T 233.2,90 T 349.8,110 T 466.4,40 T 583,160 T 680,60" 
                                  fill="none" 
                                  stroke="#a855f7" 
                                  strokeWidth="3.5" 
                                  strokeLinecap="round" 
                                />

                                {/* Points and values indicators */}
                                <circle cx="10" cy="130" r="4.5" fill="#07070c" stroke="#a855f7" strokeWidth="2.5" />
                                <circle cx="116.6" cy="150" r="4.5" fill="#07070c" stroke="#a855f7" strokeWidth="2.5" />
                                <circle cx="233.2" cy="90" r="4.5" fill="#07070c" stroke="#a855f7" strokeWidth="2.5" />
                                <circle cx="349.8" cy="110" r="4.5" fill="#07070c" stroke="#a855f7" strokeWidth="2.5" />
                                <circle cx="466.4" cy="40" r="4.5" fill="#07070c" stroke="#a855f7" strokeWidth="2.5" />
                                <circle cx="583" cy="160" r="4.5" fill="#07070c" stroke="#a855f7" strokeWidth="2.5" />
                                <circle cx="680" cy="60" r="4.5" fill="#07070c" stroke="#a855f7" strokeWidth="2.5" />

                                <text x="116.6" y="175" fill="#58586c" fontSize="9" textAnchor="middle" fontFamily="monospace">ПН</text>
                                <text x="233.2" y="175" fill="#58586c" fontSize="9" textAnchor="middle" fontFamily="monospace">ВТ</text>
                                <text x="349.8" y="175" fill="#58586c" fontSize="9" textAnchor="middle" fontFamily="monospace">СР</text>
                                <text x="466.4" y="175" fill="#58586c" fontSize="9" textAnchor="middle" fontFamily="monospace">ЧТ</text>
                                <text x="583.0" y="175" fill="#58586c" fontSize="9" textAnchor="middle" fontFamily="monospace">ПТ</text>
                                <text x="680.0" y="175" fill="#58586c" fontSize="9" textAnchor="middle" fontFamily="monospace">СБ (СЕГОДНЯ)</text>
                              </svg>
                            </div>
                            </div>
                          </div>

                          {/* Right layout item: Deep Feedback Star Breakdown mapping percentages */}
                          <div className="lg:col-span-4 bg-[#0b0b14]/75 border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
                            <div className="border-b border-white/5 pb-3">
                              <h4 className="text-white font-extrabold text-xs uppercase tracking-wider font-mono">Распределение оценок</h4>
                              <span className="text-[10px] text-slate-400 mt-0.5 block">Инструмент мониторинга доверия</span>
                            </div>

                            <div className="space-y-3 py-4">
                              {/* Draw star bars dynamically */}
                              {['5', '4', '3', '2', '1'].map((score) => {
                                const count = computedStats.stars[score] || 0;
                                const percentage = computedStats.total > 0 ? (count / computedStats.total) * 100 : 0;
                                return (
                                  <div key={score} className="flex items-center gap-3 text-xs">
                                    <div className="w-12 text-slate-400 font-mono text-[11px] flex items-center justify-end gap-1 font-bold">
                                      <span>{score}</span>
                                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                                    </div>
                                    <div className="flex-1 h-3 bg-black/50 border border-white/5 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full transition-all duration-500" 
                                        style={{ width: `${Math.max(percentage, count > 0 ? 5 : 0)}%` }}
                                      />
                                    </div>
                                    <span className="w-8 text-left text-slate-450 font-mono text-[11px] font-bold">
                                      {count} шт
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="bg-[#10101c] border border-white/5 p-3 rounded-xl text-center">
                              <span className="text-[10px] text-slate-400 leading-normal block">
                                Клиенты хвалят <b className="text-purple-400">Возможности AI</b> и жалуются на медленные прокси.
                              </span>
                            </div>
                          </div>

                        </div>

                        {/* THIRD GRID ROW: LIST OF RECEIVED CUSTOMER FEEDBACKS */}
                        <div className="bg-[#0b0b14]/75 border border-white/5 rounded-3xl p-6 space-y-4">
                          
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-4">
                            <div>
                              <h4 className="text-white font-extrabold text-xs uppercase tracking-wider font-mono">Журнал отзывов обратной связи ({computedStats.total})</h4>
                              <span className="text-[10px] text-slate-400 mt-1 block">Управляйте отзывами и фильтруйте их по категориям</span>
                            </div>

                            {/* Feedbacks category filter buttons */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              {['Все', 'Возможности AI', 'Дизайн и Интерфейс', 'Скорость и Соединение', 'Другое'].map((cat) => (
                                <button
                                  key={cat}
                                  onClick={() => setFeedbackCategoryFilter(cat)}
                                  className={`cursor-pointer px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                                    feedbackCategoryFilter === cat
                                      ? 'bg-purple-600 border-purple-500 text-white'
                                      : 'bg-black/20 text-slate-400 border-white/5 hover:text-slate-200 hover:bg-white/5'
                                  }`}
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Render filtered feedbacks cards */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                            {feedbacks
                              .filter(f => feedbackCategoryFilter === 'Все' || f.category === feedbackCategoryFilter)
                              .map((fb) => (
                                <div 
                                  key={fb.id}
                                  className="bg-[#0e0e1a]/85 border border-white/5 hover:border-white/10 p-4.5 rounded-2xl relative space-y-2.5 transition-all"
                                >
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20 font-bold text-xs uppercase">
                                        {(fb.userEmail || 'A').slice(0, 2)}
                                      </div>
                                      <div>
                                        <p className="text-xs font-bold text-slate-200 truncate max-w-[130px] sm:max-w-xs">{fb.userEmail || 'Аноним'}</p>
                                        <span className="text-[9px] font-mono text-slate-500">{fb.timestamp}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 py-0.5 px-2 rounded-lg bg-black/40 border border-white/5 text-amber-400 font-mono text-xs font-bold shrink-0">
                                      <span>{fb.rating}</span>
                                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                                    </div>
                                  </div>

                                  <div className="bg-black/30 border border-white/5 py-2.5 px-3 rounded-xl">
                                    <p className="text-xs text-slate-350 leading-relaxed font-light">
                                      "{fb.userText}"
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-between pt-1">
                                    <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest font-bold bg-purple-500/15 border border-purple-500/20 px-1.5 py-0.5 rounded">
                                      {fb.category}
                                    </span>
                                    <span className="text-[9px] text-slate-500">Статус: Проверено</span>
                                  </div>
                                </div>
                              ))}

                            {(feedbacks.length === 0 || feedbacks.filter(f => feedbackCategoryFilter === 'Все' || f.category === feedbackCategoryFilter).length === 0) && (
                              <div className="col-span-2 text-center py-12 border border-dashed border-white/10 rounded-2xl text-slate-500 text-xs font-light">
                                Отзывы в данной категории отсутствуют. Имитируйте действия клиентов для проверки.
                              </div>
                            )}
                          </div>

                        </div>

                      </motion.div>
                    )}

                    {/* ---------------------------------------------------- */}
                    {/* CATEGORY: BRANDING CUSTOMIZATION PANEL */}
                    {/* ---------------------------------------------------- */}
                    {activeCategory === 'branding' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        <div className="border-b border-white/5 pb-4">
                          <h3 className="text-white font-extrabold text-xl flex items-center gap-2">
                            <Sliders className="w-5.5 h-5.5 text-purple-400" />
                            <span>Редактор Визуального Контента</span>
                          </h3>
                          <p className="text-slate-400 text-xs mt-1 font-light leading-normal">
                            Подраздел бренда: Изменяйте заголовки, описание, лозунги и системные трансляции мгновенно. Не забудьте кликнуть "Сохранить всё" сверху.
                          </p>
                        </div>

                        {/* Branding Subcategories Container */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Left Column: Subcategory Брендинг айдентика */}
                          <div className="bg-[#0b0b14]/75 border border-white/5 rounded-3xl p-6 space-y-4">
                            <div className="pb-3 border-b border-white/5">
                              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-purple-400">Суб-категория 1: Айдентика</span>
                              <h4 className="text-xs text-slate-450 mt-0.5 leading-normal">Основные текстовые пресеты бренда на сайте</h4>
                            </div>

                            <div className="space-y-4 pt-1">
                              <div className="space-y-1.5 text-left">
                                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">
                                  Название проекта (Имя сайта)
                                </label>
                                <input
                                  type="text"
                                  value={tempSiteName}
                                  onChange={(e) => setTempSiteName(e.target.value)}
                                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:bg-black/60 font-mono"
                                />
                              </div>

                              <div className="space-y-1.5 text-left">
                                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">
                                  Главный слоган на баннере (Tagline)
                                </label>
                                <input
                                  type="text"
                                  value={tempTagline}
                                  onChange={(e) => setTempTagline(e.target.value)}
                                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-purple-500/50"
                                />
                              </div>

                              <div className="space-y-1.5 text-left">
                                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">
                                  Подробное описание проекта (Hero Description)
                                </label>
                                <textarea
                                  rows={3}
                                  value={tempDescription}
                                  onChange={(e) => setTempDescription(e.target.value)}
                                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 leading-relaxed"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Subcategory Уведомления и Broadcast баннеры */}
                          <div className="bg-[#0b0b14]/75 border border-white/5 rounded-3xl p-6 space-y-4">
                            <div className="pb-3 border-b border-white/5">
                              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-purple-400">Суб-категория 2: Системная трансляция</span>
                              <h4 className="text-xs text-slate-450 mt-0.5 leading-normal">Трансляция объявлений в виде неоновой бегущей строки</h4>
                            </div>

                            <div className="space-y-4 pt-1">
                              <p className="text-xs text-slate-400 leading-relaxed font-light">
                                Трансляционное окно появится над шапкой главной страницы сайта. Идеально подходит для предупреждений о технических работах или обновлений.
                              </p>

                              <div className="space-y-1.5 text-left">
                                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">
                                  Текст объявления (Свяжитесь для отключения)
                                </label>
                                <textarea
                                  rows={3}
                                  value={tempBroadcast}
                                  onChange={(e) => setTempBroadcast(e.target.value)}
                                  placeholder="Внимание: Плановое резервное квантовое копирование сети в 18:00 UTC."
                                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 leading-normal"
                                />
                              </div>

                              <div className="bg-purple-950/15 border border-purple-500/20 rounded-2xl p-4 text-[11px] text-purple-300 font-light leading-relaxed">
                                Оставьте текстовое поле пустым, чтобы полностью деактивировать верхнюю информационную бегущую линию на сайте.
                              </div>
                            </div>

                          </div>

                          {/* Column 3: Свежие обновления (Nexus Updates Announcement) */}
                          <div className="bg-[#0b0b14]/75 border border-white/5 rounded-3xl p-6 space-y-4 md:col-span-2 xl:col-span-1">
                            <div className="pb-3 border-b border-white/5">
                              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-purple-400">Суб-категория 3: Глобальное обновление</span>
                              <h4 className="text-xs text-slate-450 mt-0.5 leading-normal">Кнопка и текст-анимация обновления на сайте</h4>
                            </div>

                            <div className="space-y-4 pt-1 text-left">
                              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-2xl">
                                <div>
                                  <label className="text-[11px] font-bold text-slate-250 block">
                                    Статус обновления
                                  </label>
                                  <span className="text-[10px] text-slate-400 font-light block mt-0.5 leading-tight">
                                    Включить баннер и кнопку "Обновить"
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setTempShowUpdatesAlert(!tempShowUpdatesAlert)}
                                  className={`relative h-6 w-11 rounded-full shrink-0 cursor-pointer border transition-colors ${
                                    tempShowUpdatesAlert ? 'bg-purple-600 border-purple-500' : 'bg-slate-800 border-slate-705'
                                  }`}
                                >
                                  <span
                                    className={`absolute top-0.5 left-0.5 h-4.5 w-4.5 rounded-full bg-white shadow-md transform transition-transform ${
                                      tempShowUpdatesAlert ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">
                                  Текст-оповещение об обновлении
                                </label>
                                <textarea
                                  rows={3}
                                  value={tempUpdatesAlertText}
                                  onChange={(e) => setTempUpdatesAlertText(e.target.value)}
                                  placeholder="Опишите, какие ключевые новшества вышли в этом патче..."
                                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 leading-normal"
                                />
                              </div>

                              <p className="text-[11px] text-purple-300 bg-purple-950/15 border border-purple-500/20 rounded-2xl p-4 leading-relaxed font-light">
                                При активации этой функции у всех пользователей под шапкой на главном экране появится аниме-баннер с бегущим текстом и кнопкой «Обновить», ведущей на интерактивную панель патч-ноутов.
                              </p>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    )}


                    {/* ---------------------------------------------------- */}
                    {/* CATEGORY: INSTALLER CONFIGURATION SUITE */}
                    {/* ---------------------------------------------------- */}
                    {activeCategory === 'installer' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        <div className="border-b border-white/5 pb-4">
                          <h3 className="text-white font-extrabold text-xl flex items-center gap-2">
                            <Download className="w-5.5 h-5.5 text-purple-400" />
                            <span>Управление Дистрибутивами ПО</span>
                          </h3>
                          <p className="text-slate-400 text-xs mt-1 font-light leading-normal">
                            Настройте поведение кнопки загрузки, зашифрованные системные хэши файла и пошаговые этапы анимации инсталлятора.
                          </p>
                        </div>

                        {/* Layout grid nested subcategories */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                          
                          {/* Subcategory 1: Specifications (4 cols) */}
                          <div className="lg:col-span-5 bg-[#0b0b14]/75 border border-white/5 rounded-3xl p-6 space-y-4">
                            <div className="pb-3 border-b border-white/5">
                              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-purple-400">Суб-профиль 1: Спецификации</span>
                              <h4 className="text-xs text-slate-450 mt-0.5 leading-normal">Канонические системные хэши ПО инсталлятора</h4>
                            </div>

                            <div className="space-y-4 pt-1">
                              <div className="space-y-1.5 text-left">
                                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                                  Контрольная сумма 1 (Crc)
                                </label>
                                <input
                                  type="text"
                                  value={tempSpecCrc}
                                  onChange={(e) => setTempSpecCrc(e.target.value)}
                                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 font-mono"
                                />
                              </div>

                              <div className="space-y-1.5 text-left">
                                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                                  Эклиптический ключ 2 (Sha-256)
                                </label>
                                <input
                                  type="text"
                                  value={tempSpecSha}
                                  onChange={(e) => setTempSpecSha(e.target.value)}
                                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 font-mono"
                                />
                              </div>

                              <div className="space-y-1.5 text-left">
                                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                                  Окружение 3 (Runtime Версия)
                                </label>
                                <input
                                  type="text"
                                  value={tempSpecRuntime}
                                  onChange={(e) => setTempSpecRuntime(e.target.value)}
                                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 font-mono"
                                />
                              </div>

                              <div className="space-y-2 text-left pt-2">
                                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Текст кнопки загрузки</label>
                                <input
                                  type="text"
                                  value={tempDownloadBtnText}
                                  onChange={(e) => setTempDownloadBtnText(e.target.value)}
                                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Subcategory 2: Progressive Build & Delivery (7 cols) */}
                          <div className="lg:col-span-7 bg-[#0b0b14]/75 border border-white/5 rounded-3xl p-6 space-y-4">
                            <div className="pb-3 border-b border-white/5">
                              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-purple-400">Суб-профиль 2: Сборка и Поставка</span>
                              <h4 className="text-xs text-slate-450 mt-0.5 leading-normal">Кастомная выдача файлов и прогресс шаги компилятора</h4>
                            </div>

                            <div className="space-y-4">
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5 text-left">
                                  <label className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Заголовок загрузки (Title)</label>
                                  <input
                                    type="text"
                                    value={tempDownloadTitle}
                                    onChange={(e) => setTempDownloadTitle(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
                                  />
                                </div>
                                <div className="space-y-1.5 text-left">
                                  <label className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Конечное имя сохраняемого файла</label>
                                  <input
                                    type="text"
                                    value={tempDownloadFileName}
                                    onChange={(e) => setTempDownloadFileName(e.target.value)}
                                    placeholder="setup.exe"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none font-mono"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1.5 text-left">
                                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Под-описание инсталлятора</label>
                                <input
                                  type="text"
                                  value={tempDownloadDesc}
                                  onChange={(e) => setTempDownloadDesc(e.target.value)}
                                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
                                />
                              </div>

                              {/* Progress Animation Log Steps editor */}
                              <div className="space-y-1.5 text-left">
                                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                                  Последовательность этапов (через запятую)
                                </label>
                                <textarea
                                  rows={2}
                                  value={tempDownloadSteps}
                                  onChange={(e) => setTempDownloadSteps(e.target.value)}
                                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 font-mono leading-relaxed"
                                />
                                <span className="text-[9px] text-slate-500">
                                  Уникальные псевдо-компиляционные этапы, которые видит пользователь во время загрузочного экрана компилятора.
                                </span>
                              </div>

                              {/* Target Delivery Mechanism selector */}
                              <div className="space-y-2 border-t border-white/5 pt-3">
                                <label className="text-[10px] uppercase font-bold text-purple-400 font-mono block">МЕХАНИЗМ ЗАГРУЗКИ ПО КНОПКЕ:</label>
                                <div className="flex flex-wrap gap-4 pt-1">
                                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                                    <input
                                      type="radio"
                                      name="deliveryType"
                                      checked={tempDownloadFileType === 'txt'}
                                      onChange={() => setTempDownloadFileType('txt')}
                                      className="accent-purple-500"
                                    />
                                    <span>TXT-генератор инструкций</span>
                                  </label>
                                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                                    <input
                                      type="radio"
                                      name="deliveryType"
                                      checked={tempDownloadFileType === 'link'}
                                      onChange={() => setTempDownloadFileType('link')}
                                      className="accent-purple-500"
                                    />
                                    <span>Прямая ссылка (URL/EXE)</span>
                                  </label>
                                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                                    <input
                                      type="radio"
                                      name="deliveryType"
                                      checked={tempDownloadFileType === 'file'}
                                      onChange={() => setTempDownloadFileType('file')}
                                      className="accent-purple-500"
                                    />
                                    <span className="text-purple-400 font-bold">Свой файл с ПК ⬆</span>
                                  </label>
                                </div>
                              </div>

                              {/* Render conditional files fields */}
                              {tempDownloadFileType === 'link' && (
                                <div className="space-y-1.5 text-left pt-1">
                                  <label className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Адрес внешней ссылки дистрибутива (URL)</label>
                                  <input
                                    type="text"
                                    value={tempDownloadRedirectUrl}
                                    onChange={(e) => setTempDownloadRedirectUrl(e.target.value)}
                                    placeholder="https://my-server.com/setup.exe"
                                    className="w-full bg-black/40 border border-purple-500/20 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                                  />
                                </div>
                              )}

                              {tempDownloadFileType === 'file' && (
                                <div className="space-y-3.5 text-left pt-1">
                                  <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`relative border-2 border-dashed rounded-2xl p-6 transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                                      isDragOver
                                        ? 'border-purple-500 bg-purple-500/10'
                                        : tempUploadedFileName
                                        ? 'border-emerald-500/30 bg-emerald-500/[0.02]'
                                        : 'border-white/10 hover:border-purple-500/30 bg-black/20'
                                    }`}
                                    onClick={() => document.getElementById('delivery-upload-pc')?.click()}
                                  >
                                    <input
                                      id="delivery-upload-pc"
                                      type="file"
                                      className="hidden"
                                      onChange={handleFileChange}
                                    />
                                    <div className="space-y-2 pointer-events-none">
                                      {tempUploadedFileName ? (
                                        <>
                                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                                            <CheckCircle2 className="w-5 h-5" />
                                          </div>
                                          <p className="text-xs font-bold text-slate-200">
                                            {tempUploadedFileName}
                                          </p>
                                          <p className="text-[10px] text-slate-500">
                                            Тип: {tempUploadedFileType || 'application/octet-stream'} • Готов
                                          </p>
                                        </>
                                      ) : (
                                        <>
                                          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
                                            <Download className="w-5 h-5 animate-bounce" />
                                          </div>
                                          <p className="text-xs font-medium text-slate-300">
                                            Перетащите ваш файл сюда или нажмите для выбора
                                          </p>
                                          <p className="text-[9px] text-slate-500">
                                            Поддерживается абсолютно любой формат (EXE, MSI, Client, ZIP...)
                                          </p>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {tempUploadedFileName && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setTempUploadedFileBase64('');
                                        setTempUploadedFileName('');
                                        setTempUploadedFileType('');
                                        addLog('Удален загруженный файл дистрибутива.');
                                      }}
                                      className="text-[10px] text-red-400 font-bold hover:underline font-mono"
                                    >
                                      Сбросить загруженный файл
                                    </button>
                                  )}
                                </div>
                              )}

                              {tempDownloadFileType === 'txt' && (
                                <div className="space-y-1.5 text-left pt-1">
                                  <label className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Текст содержимого TXT инструкции при загрузке</label>
                                  <textarea
                                    rows={5}
                                    value={tempDownloadFileContent}
                                    onChange={(e) => setTempDownloadFileContent(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-purple-500/50 leading-relaxed"
                                  />
                                </div>
                              )}

                            </div>
                          </div>

                        </div>

                        {/* Subcategory 3: Управление Платформами */}
                        <div className="bg-[#0b0b14]/75 border border-white/5 rounded-3xl p-6 space-y-4">
                          <div className="pb-3 border-b border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <div>
                              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-purple-400">Суб-профиль 3: Управление Платформенным Селектором</span>
                              <h4 className="text-xs text-slate-300 mt-0.5 leading-normal">Настройка доступности и видимости операционных систем</h4>
                            </div>
                            <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 border border-purple-500/25 px-2.5 py-1 rounded-full">
                              Адаптивный фильтр активен
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-1 text-left">
                            {tempPlatforms.map((plat) => {
                              return (
                                <div 
                                  key={plat.id}
                                  className="bg-black/30 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-3 relative overflow-hidden group hover:border-purple-500/20 transition-all duration-300"
                                >
                                  {/* Top OS Row */}
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-purple-400">
                                        {plat.id === 'windows' && <Monitor className="w-3.5 h-3.5" />}
                                        {plat.id === 'macos' && <Laptop className="w-3.5 h-3.5" />}
                                        {plat.id === 'linux' && <Terminal className="w-3.5 h-3.5" />}
                                        {(plat.id === 'android' || plat.id === 'ios') && <Smartphone className="w-3.5 h-3.5" />}
                                      </div>
                                      <span className="text-xs font-extrabold text-white">{plat.name}</span>
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-500 block truncate">{plat.tag}</span>
                                  </div>

                                  {/* Settings Actions */}
                                  <div className="space-y-2 pt-2 border-t border-white/5">
                                    
                                    {/* Toggle Visibility (Отображение на сайте) */}
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-[10px] text-slate-400 font-sans">Отображать:</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = tempPlatforms.map(p => 
                                            p.id === plat.id ? { ...p, isVisible: !p.isVisible } : p
                                          );
                                          setTempPlatforms(updated);
                                          addLog(`Изменена видимость платформы ${plat.name}: ${!plat.isVisible ? 'Видна' : 'Скрыта'}`);
                                        }}
                                        className={`cursor-pointer px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all ${
                                          plat.isVisible 
                                            ? 'bg-emerald-550/10 border border-emerald-500/30 text-emerald-400 font-bold' 
                                            : 'bg-red-550/15 border border-red-550/30 text-red-400 font-bold'
                                        }`}
                                      >
                                        {plat.isVisible ? 'ВИДЕН 👁' : 'СКРЫТ 👁‍🗨'}
                                      </button>
                                    </div>

                                    {/* Toggle Availability (Доступность загрузки) */}
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-[10px] text-slate-400 font-sans">Статус:</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const currentVal = plat.isAvailable !== false; // handle default undefined as true
                                          const updated = tempPlatforms.map(p => 
                                            p.id === plat.id ? { ...p, isAvailable: !currentVal } : p
                                          );
                                          setTempPlatforms(updated);
                                          addLog(`Доступность платформы ${plat.name}: ${!currentVal ? 'Доступен' : 'Временно недоступен'}`);
                                        }}
                                        className={`cursor-pointer px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all ${
                                          plat.isAvailable !== false 
                                            ? 'bg-purple-550/15 border border-purple-550/30 text-purple-300 font-bold' 
                                            : 'bg-amber-550/15 border border-amber-550/30 text-amber-400 font-bold'
                                        }`}
                                      >
                                        {plat.isAvailable !== false ? 'ДОСТУПЕН' : 'БЛОК ❌'}
                                      </button>
                                    </div>

                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-[9px] text-slate-500 font-light italic leading-normal pt-1 text-center">
                            * Платформы со статусом <span className="text-red-400 font-bold">СКРЫТ</span> не будут видны в селекторе дистрибутивов вообще. <br />
                            * Платформы со статусом <span className="text-amber-400 font-bold">БЛОК</span> останутся в селекторе, но кнопка скачивания для них сменится на «Временно недоступно» и будет заблокирована.
                          </p>
                        </div>
                      </motion.div>
                    )}


                    {/* ---------------------------------------------------- */}
                    {/* CATEGORY: SUPPORT CHANNELS (Коннекторные карты связи) */}
                    {/* ---------------------------------------------------- */}
                    {activeCategory === 'channels' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-white/5 pb-4">
                          <div>
                            <h3 className="text-white font-extrabold text-xl flex items-center gap-2">
                              <Share2 className="w-5.5 h-5.5 text-purple-400" />
                              <span>Редактор Кнопок и Каналов Поддержки</span>
                            </h3>
                            <p className="text-slate-400 text-xs mt-1 font-light leading-normal">
                              Управляйте карточками связи в разделе поддержки (Telegram, Discord, Live-чат, почта). Можно добавлять, скрывать, настраивать hex-неон цвета бренда и иконки.
                            </p>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              const newId = `custom_${Date.now()}`;
                              const newChannel: SupportChannel = {
                                id: newId,
                                name: 'Новый Канал Поддержки',
                                icon: 'MessageSquare',
                                value: 't.me/nexus_link',
                                url: 'https://t.me/nexus_link',
                                desc: 'Напишите короткую и полезную цель этого канала общения.',
                                color: '#a855f7',
                                isActive: true
                              };
                              setTempSupportChannels([...tempSupportChannels, newChannel]);
                              addLog('Добавлен новый шаблон канала поддержки.');
                              showToast('Шаблон канала добавлен! Заполните его ниже.', 'success');
                            }}
                            className="cursor-pointer flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-purple-600/10 active:scale-95 transition-all text-center"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Добавить канал</span>
                          </button>
                        </div>

                        {/* Interactive list of support channel elements */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
                          {tempSupportChannels.map((channel, index) => (
                            <div
                              key={channel.id}
                              className="bg-[#0b0b14]/75 border border-white/5 rounded-3xl p-5 space-y-4 relative group"
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                                  Карта связи #{index + 1}: {channel.name || '(Без названия)'}
                                </span>
                                <div className="flex items-center gap-2">
                                  
                                  {/* Visbility Toggle */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedChannels = tempSupportChannels.map(c => 
                                        c.id === channel.id ? { ...c, isActive: !c.isActive } : c
                                      );
                                      setTempSupportChannels(updatedChannels);
                                      addLog(`Изменена видимость канала "${channel.name}": ${!channel.isActive}`);
                                    }}
                                    className={`cursor-pointer px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                                      channel.isActive
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                        : 'bg-slate-550/5 border-white/5 text-slate-500'
                                    }`}
                                  >
                                    {channel.isActive ? (
                                      <>
                                        <Eye className="w-3.5 h-3.5 shrink-0" />
                                        <span>Активна</span>
                                      </>
                                    ) : (
                                      <>
                                        <EyeOff className="w-3.5 h-3.5 shrink-0" />
                                        <span>Скрыта</span>
                                      </>
                                    )}
                                  </button>

                                  {/* Delete Card */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedChannels = tempSupportChannels.filter(c => c.id !== channel.id);
                                      setTempSupportChannels(updatedChannels);
                                      addLog(`Канал поддержки удален: "${channel.name}"`);
                                      showToast('Канал удален из временных настроек', 'warning');
                                    }}
                                    className="cursor-pointer p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg transition-all border border-rose-500/20"
                                    title="Удалить карточку"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3.5">
                                <div className="space-y-1 text-left">
                                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">Контактое имя</label>
                                  <input
                                    type="text"
                                    value={channel.name}
                                    onChange={(e) => {
                                      const updated = tempSupportChannels.map(c => c.id === channel.id ? { ...c, name: e.target.value } : c);
                                      setTempSupportChannels(updated);
                                    }}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-250 focus:outline-none"
                                  />
                                </div>
                                <div className="space-y-1 text-left">
                                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono font-bold text-purple-400">Текст значения (Value)</label>
                                  <input
                                    type="text"
                                    value={channel.value}
                                    onChange={(e) => {
                                      const updated = tempSupportChannels.map(c => c.id === channel.id ? { ...c, value: e.target.value } : c);
                                      setTempSupportChannels(updated);
                                    }}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-250 focus:outline-none font-mono"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1 text-left">
                                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono text-purple-400 flex items-center gap-1">
                                  <Link2 className="w-3 h-3 text-purple-400" />
                                  <span>Адрес ссылки (URL)</span>
                                </label>
                                <input
                                  type="text"
                                  value={channel.url}
                                  onChange={(e) => {
                                    const updated = tempSupportChannels.map(c => c.id === channel.id ? { ...c, url: e.target.value } : c);
                                    setTempSupportChannels(updated);
                                  }}
                                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none font-mono"
                                  placeholder="https://t.me/... или 'chat' для интерактивного Live Чата"
                                />
                                <span className="text-[9px] text-slate-500 block mt-0.5">
                                  Укажите <b className="text-purple-400 font-mono">chat</b> для открытия оперативного виджета поддержки прямо на сайте.
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-3.5">
                                <div className="space-y-1 text-left">
                                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">Иконка Lucide</label>
                                  <select
                                    value={['MessageSquare', 'Mail', 'Headset', 'Send', 'Bot', 'Sparkles', 'Smile', 'ShieldAlert'].includes(channel.icon) ? channel.icon : 'Custom'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      const updated = tempSupportChannels.map(c => c.id === channel.id ? { ...c, icon: val === 'Custom' ? 'Code' : val } : c);
                                      setTempSupportChannels(updated);
                                    }}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                                  >
                                    <option value="MessageSquare">💬 MessageSquare</option>
                                    <option value="Mail">📧 Mail</option>
                                    <option value="Headset">🎧 Headset</option>
                                    <option value="Send">✈️ Send</option>
                                    <option value="Bot">🤖 Bot</option>
                                    <option value="Sparkles">✨ Sparkles</option>
                                    <option value="Smile">😊 Smile</option>
                                    <option value="ShieldAlert">🛡️ ShieldAlert</option>
                                    <option value="Custom">✍️ Другое значение</option>
                                  </select>
                                </div>

                                <div className="space-y-1 text-left">
                                  <label className="text-[10px] uppercase font-bold text-slate-550 font-mono">Текстовый очерк иконки</label>
                                  <input
                                    type="text"
                                    value={channel.icon}
                                    maxLength={30}
                                    onChange={(e) => {
                                      const updated = tempSupportChannels.map(c => c.id === channel.id ? { ...c, icon: e.target.value } : c);
                                      setTempSupportChannels(updated);
                                    }}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none font-mono"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                {/* Brand Color Picker */}
                                <div className="md:col-span-4 space-y-1.5 text-left">
                                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">Цвет бренда (Hex Link)</label>
                                  <div className="flex items-center gap-2">
                                    <div 
                                      className="w-9 h-9 rounded-xl border border-white/10 shrink-0 transition-transform hover:scale-105" 
                                      style={{ backgroundColor: channel.color }}
                                    />
                                    <input
                                      type="text"
                                      value={channel.color}
                                      onChange={(e) => {
                                        const updated = tempSupportChannels.map(c => c.id === channel.id ? { ...c, color: e.target.value } : c);
                                        setTempSupportChannels(updated);
                                      }}
                                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none font-mono"
                                    />
                                  </div>
                                </div>

                                {/* Area Details */}
                                <div className="md:col-span-8 space-y-1 text-left">
                                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">Краткое описание на карте</label>
                                  <textarea
                                    rows={2}
                                    value={channel.desc}
                                    onChange={(e) => {
                                      const updated = tempSupportChannels.map(c => c.id === channel.id ? { ...c, desc: e.target.value } : c);
                                      setTempSupportChannels(updated);
                                    }}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                                  />
                                </div>
                              </div>

                            </div>
                          ))}

                          {tempSupportChannels.length === 0 && (
                            <div className="col-span-2 text-center py-16 border border-dashed border-white/10 rounded-3xl text-slate-500 text-xs font-light">
                              Кнопки связи отсутствуют. Нажмите кнопку "Добавить канал" сверху, чтобы запустить новую карту в панели!
                            </div>
                          )}
                        </div>

                      </motion.div>
                    )}


                    {/* ---------------------------------------------------- */}
                    {/* CATEGORY: CHAT INTERCEPTOR PANEL (Ядро оператора) */}
                    {/* ---------------------------------------------------- */}
                    {activeCategory === 'interceptor' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.99 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0b0b14]/75 border border-white/5 rounded-3xl overflow-hidden flex flex-col h-[75vh]"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 h-full">
                          
                          {/* Left Session navigation directory: 4 columns */}
                          <div className="md:col-span-4 border-r border-white/5 flex flex-col overflow-y-auto">
                            <div className="p-4 border-b border-white/5 bg-slate-950/35">
                              <span className="text-[10px] font-extrabold tracking-widest text-purple-400 block uppercase font-mono">
                                МОНИТОРИНГ КЛИЕНТСКИХ СЕССИЙ
                              </span>
                              <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">
                                Как только посетитель напишет на сайте, оператор услышит сигнал и сессия отобразится здесь. Вы можете перехватить бота.
                              </p>
                            </div>

                            {/* Session list buttons */}
                            <div className="flex-1 p-2 space-y-1">
                              {chatSessions.map((session) => {
                                const active = session.id === activeSessionId;
                                return (
                                  <button
                                    key={session.id}
                                    onClick={() => {
                                      setActiveSessionId(session.id);
                                      setChatSessions(prev => prev.map(s => s.id === session.id ? {...s, unread: false} : s));
                                    }}
                                    className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-start gap-3 relative border ${
                                      active 
                                        ? 'bg-purple-600/10 border-purple-500/35 text-white' 
                                        : 'bg-transparent hover:bg-white/[0.02] border-transparent text-slate-400 hover:text-slate-200'
                                    }`}
                                  >
                                    {session.unread && (
                                      <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                                    )}
                                    <div className="p-2 rounded-xl bg-white/5 text-purple-300 mt-0.5 shrink-0 border border-white/5">
                                      <User className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-center mb-0.5">
                                        <span className="font-extrabold text-[12.5px] truncate text-slate-200">{session.userName}</span>
                                        <span className="text-[9px] font-mono font-medium text-slate-500">{session.lastActive}</span>
                                      </div>
                                      <p className="text-xs truncate font-light text-slate-450 leading-relaxed">
                                        {session.messages[session.messages.length - 1]?.text || 'Диалог пуст'}
                                      </p>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Question Preset simulator tool */}
                            <div className="p-4 bg-slate-950/60 border-t border-white/5 space-y-2 shrink-0">
                              <span className="text-[9px] font-extrabold text-amber-500 uppercase tracking-widest font-mono block">
                                Имитация трафика клинетов
                              </span>
                              <p className="text-[9px] text-slate-500 leading-normal">
                                Нажмите на кнопку ниже, чтобы имитировать сложный вопрос от реального пользователя в чате для отладки оповещений:
                              </p>
                              <div className="grid grid-cols-2 gap-1.5 pt-1">
                                <button
                                  onClick={() => forceClientQuestionSimulation(0)}
                                  className="cursor-pointer bg-[#10101d] hover:bg-purple-900/20 text-slate-300 text-[9.5px] py-1.5 px-2 rounded-lg text-left truncate border border-white/5"
                                >
                                  "Прокси без VPN?"
                                </button>
                                <button
                                  onClick={() => forceClientQuestionSimulation(1)}
                                  className="cursor-pointer bg-[#10101d] hover:bg-purple-900/20 text-slate-300 text-[9.5px] py-1.5 px-2 rounded-lg text-left truncate border border-white/5"
                                >
                                  "SHA-256 E2E?"
                                </button>
                                <button
                                  onClick={() => forceClientQuestionSimulation(2)}
                                  className="cursor-pointer bg-[#10101d] hover:bg-purple-900/20 text-slate-300 text-[9.5px] py-1.5 px-2 rounded-lg text-left truncate border border-white/5"
                                >
                                  "Лог exe файла?"
                                </button>
                                <button
                                  onClick={() => forceClientQuestionSimulation(3)}
                                  className="cursor-pointer bg-[#10101d] hover:bg-purple-900/20 text-slate-300 text-[9.5px] py-1.5 px-2 rounded-lg text-left truncate border border-white/5"
                                >
                                  "Клиент на iOS?"
                                </button>
                              </div>
                            </div>

                          </div>

                          {/* Right Interactive Chat pane: 8 columns */}
                          <div className="md:col-span-8 flex flex-col bg-black/30 h-full relative overflow-hidden">
                            
                            {activeSession ? (
                              <>
                                {/* Selected session details bar */}
                                <div className="p-4 border-b border-white/5 bg-slate-900/20 flex justify-between items-center shrink-0">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                                    <span className="font-extrabold text-sm text-slate-200">
                                      Сессия оператора: {activeSession.userName}
                                    </span>
                                    <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono font-medium uppercase tracking-wider">
                                      ID: {activeSession.id}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-amber-400 font-mono font-bold uppercase tracking-wide bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                    РУЧНОЙ ПЕРЕХВАТ РАЗРЕШЕН
                                  </span>
                                </div>

                                {/* Chat message stream */}
                                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                  {activeSession.messages.map((m) => {
                                    let labelName = 'Пользователь';
                                    let labelStyle = 'text-slate-500';
                                    if (m.sender === 'bot') {
                                      labelName = 'Виртуальный ИИ';
                                      labelStyle = 'text-purple-400 font-extrabold';
                                    } else if (m.sender === 'admin') {
                                      labelName = 'Вы (Дежурный Оператор)';
                                      labelStyle = 'text-amber-400 font-bold';
                                    }

                                    return (
                                      <div
                                        key={m.id}
                                        className={`flex gap-3 max-w-[85%] ${
                                          m.sender === 'admin' ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'
                                        }`}
                                      >
                                        <div className={`p-2 rounded-xl shrink-0 w-8 h-8 flex items-center justify-center text-[10px] font-mono font-bold border ${
                                          m.sender === 'admin' 
                                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                                            : 'bg-[#10101d] text-slate-200 border-white/5'
                                        }`}>
                                          {m.sender === 'admin' ? 'АД' : m.sender === 'bot' ? 'ИИ' : 'ЮЗ'}
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-1.5 px-1 mb-0.5">
                                            <span className={`text-[10px] uppercase font-mono tracking-wider ${labelStyle}`}>
                                              {labelName}
                                            </span>
                                            <span className="text-[8px] text-slate-600 font-mono">
                                              {m.time}
                                            </span>
                                          </div>
                                          <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-light select-text ${
                                            m.sender === 'admin'
                                              ? 'bg-amber-950/20 text-neutral-200 border border-amber-500/25 rounded-tr-none'
                                              : m.sender === 'bot'
                                                ? 'bg-purple-950/10 text-slate-300 border border-purple-500/15 rounded-tl-none'
                                                : 'bg-[#121221] text-slate-200 border border-white/5 rounded-tl-none'
                                          }`}>
                                            {m.text}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                  <div ref={chatBottomRef} />
                                </div>

                                {/* Send replies form */}
                                <form
                                  onSubmit={handleSendAdminReply}
                                  className="p-4 bg-slate-950/60 border-t border-white/5 flex gap-2 shrink-0 z-10"
                                >
                                  <div className="p-2.5 rounded-xl bg-amber-500/5 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                                    <CornerDownRight className="w-5 h-5 animate-pulse" />
                                  </div>
                                  <input
                                    type="text"
                                    value={adminReplyText}
                                    onChange={(e) => setAdminReplyText(e.target.value)}
                                    placeholder="Напишите ответ от лица дежурного Администратора Nexus..."
                                    className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50"
                                  />
                                  <button
                                    type="submit"
                                    className="cursor-pointer bg-gradient-to-tr from-amber-600 to-yellow-500 text-white font-extrabold text-xs px-5 rounded-xl hover:from-amber-500 hover:to-yellow-400 transition-colors flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-amber-950/20 uppercase tracking-wider"
                                  >
                                    <span>Ответить</span>
                                    <Send className="w-3.5 h-3.5" />
                                  </button>
                                </form>
                              </>
                            ) : (
                              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3.5">
                                <MessageCircle className="w-12 h-12 text-slate-700 animate-bounce" />
                                <div>
                                  <p className="font-extrabold text-slate-300">Нет активной сессии для перехвата</p>
                                  <p className="text-xs font-light max-w-sm mt-1 leading-normal text-slate-550">
                                    Выберите любую пользовательскую сессию в левом меню, чтобы перехватить диалог или отправить симуляцию.
                                  </p>
                                </div>
                              </div>
                            )}

                          </div>

                        </div>
                      </motion.div>
                    )}


                    {/* ---------------------------------------------------- */}
                    {/* CATEGORY: LOGGER SYSTEM PANEL */}
                    {/* ---------------------------------------------------- */}
                    {activeCategory === 'logger' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                          <div>
                            <h3 className="text-white font-extrabold text-xl flex items-center gap-2">
                              <Terminal className="w-5.5 h-5.5 text-purple-400" />
                              <span>Журнал Операций Ядра и Дежурный Лог</span>
                            </h3>
                            <p className="text-slate-400 text-xs mt-1 font-light leading-normal">
                              История событий шифратора за сеанс, включая действия админа, подписки и отзывы. Используйте поиск для быстрой навигации.
                            </p>
                          </div>
                          
                          {/* Search bar input is a pro element */}
                          <div className="relative w-full sm:w-64 shrink-0">
                            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              value={logSearchQuery}
                              onChange={(e) => setLogSearchQuery(e.target.value)}
                              placeholder="Поиск по содержанию лога..."
                              className="w-full bg-slate-900 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
                            />
                          </div>
                        </div>

                        {/* Interactive kernel logger terminal stream */}
                        <div className="bg-black/75 border border-white/15 rounded-3xl p-5 overflow-hidden flex flex-col h-[52vh] shadow-inner relative font-mono">
                          
                          <div className="text-slate-550 pb-2 border-b border-white/5 mb-3 flex justify-between items-center text-[10px]">
                            <span>БЕЗОПАСНАЯ ЛОКАЛЬНАЯ ШИНА: ACTIVE TLS v1.3</span>
                            <span className="flex items-center gap-1.5 font-bold uppercase text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              <span>Служба активна</span>
                            </span>
                          </div>

                          <div className="flex-1 overflow-y-auto text-[11px] text-purple-200/90 space-y-2 select-text scrollbar-thin">
                            {adminLogs
                              .filter(log => !logSearchQuery || log.toLowerCase().includes(logSearchQuery.toLowerCase()))
                              .map((log, index) => (
                                <div key={index} className="leading-relaxed flex items-start gap-1 relative group">
                                  <span className="text-purple-500 font-extrabold select-none shrink-0">&#x203a;</span>
                                  <span className="flex-1 whitespace-pre-wrap">{log}</span>
                                  
                                  {/* Quick log copy helper */}
                                  <button
                                    onClick={() => handleCopyToClipboard(log, `log_${index}`)}
                                    className="cursor-pointer opacity-0 group-hover:opacity-100 absolute right-2 top-0 p-1 bg-purple-900/60 text-purple-300 font-sans text-[9px] rounded hover:text-white"
                                    title="Копировать строку"
                                  >
                                    {copiedTextId === `log_${index}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                              ))}

                            {adminLogs.filter(log => !logSearchQuery || log.toLowerCase().includes(logSearchQuery.toLowerCase())).length === 0 && (
                              <div className="text-center py-12 text-slate-550 text-xs font-light font-sans">
                                Вхождения лога по вашему запросу не обнаружены.
                              </div>
                            )}
                          </div>

                        </div>

                        <div className="flex justify-between items-center pt-1.5 shrink-0">
                          <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono uppercase font-bold tracking-wider">
                            <span>Задержка: 0.8ms</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                            <span>Операционная память: 41 MB</span>
                          </div>
                          
                          <button
                            onClick={() => {
                              setAdminLogs(['Консоль очищена администратором.']);
                              showToast('Консоль логов успешно очищена', 'info');
                            }}
                            className="cursor-pointer text-xs font-bold text-slate-400 hover:text-white border border-white/10 rounded-lg px-3 py-1.5 bg-white/[0.01] hover:bg-white/5 transition-all text-center"
                          >
                            Очистить лог ядра
                          </button>
                        </div>
                      </motion.div>
                    )}


                    {/* ---------------------------------------------------- */}
                    {/* CATEGORY: UPDATES SCREEN MANAGER (CMS) */}
                    {/* ---------------------------------------------------- */}
                    {activeCategory === 'updates' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6 text-left"
                      >
                        {/* Tab Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                          <div>
                            <h3 className="text-white font-extrabold text-xl flex items-center gap-2">
                              <RefreshCw className="w-5.5 h-5.5 text-purple-400 animate-spin" style={{ animationDuration: '10s' }} />
                              <span>Система Управления Обновлениями (CMS Core)</span>
                            </h3>
                            <p className="text-slate-400 text-xs mt-1 font-light leading-normal">
                              Здесь вы можете настраивать экраны обновлений, менять версию сборки, управлять оповещениями, а также создавать и упорядочивать интерактивные технологические блоки.
                            </p>
                          </div>
                          <button
                            onClick={handleApplyCustomizations}
                            className="cursor-pointer bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Сохранить изменения</span>
                          </button>
                        </div>

                        {/* Top Global Variables Settings Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                          {/* Alert notice parameters */}
                          <div className="bg-slate-950/60 p-5 rounded-3xl border border-white/5 space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">Индикатор обновлений</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={tempShowUpdatesAlert} 
                                  onChange={(e) => setTempShowUpdatesAlert(e.target.checked)} 
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-500/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-650 peer-checked:after:bg-purple-200"></div>
                              </label>
                            </div>
                            <p className="text-[10px] text-slate-550 leading-relaxed font-light">
                              Включает анимированную кнопку «Подробности» и мерцающий статус нового обновления на главном экране.
                            </p>
                            
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono text-purple-400 font-black uppercase tracking-wider">Версия новой сборки</label>
                              <input 
                                type="text"
                                value={tempUpdatesVersion}
                                onChange={(e) => setTempUpdatesVersion(e.target.value)}
                                className="w-full bg-slate-900 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500/50"
                                placeholder="Например v1.0.4"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono text-purple-400 font-black uppercase tracking-wider">Текст оповещения (Мерцающий)</label>
                              <input 
                                type="text"
                                value={tempUpdatesAlertText}
                                onChange={(e) => setTempUpdatesAlertText(e.target.value)}
                                className="w-full bg-slate-900 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50"
                                placeholder="Доступна новая прошивка v1.0.4..."
                              />
                            </div>
                          </div>

                          {/* Titles RU parameters */}
                          <div className="bg-slate-950/60 p-5 rounded-3xl border border-white/5 space-y-4">
                            <span className="text-xs font-extrabold text-slate-200 uppercase tracking-wider block">Основные заголовки (RU)</span>
                            
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono text-purple-400 font-black uppercase tracking-wider">Заголовок страницы</label>
                              <input 
                                type="text"
                                value={tempUpdatesTitleRu}
                                onChange={(e) => setTempUpdatesTitleRu(e.target.value)}
                                className="w-full bg-slate-900 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono text-purple-400 font-black uppercase tracking-wider">Подзаголовок страницы</label>
                              <textarea 
                                value={tempUpdatesSubtitleRu}
                                onChange={(e) => setTempUpdatesSubtitleRu(e.target.value)}
                                rows={2}
                                className="w-full bg-slate-900 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50"
                              />
                            </div>
                          </div>

                          {/* Titles EN parameters */}
                          <div className="bg-slate-950/60 p-5 rounded-3xl border border-white/5 space-y-4">
                            <span className="text-xs font-extrabold text-slate-200 uppercase tracking-wider block">Основные заголовки (EN)</span>
                            
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono text-purple-400 font-black uppercase tracking-wider">Заголовок страницы (Page Title)</label>
                              <input 
                                type="text"
                                value={tempUpdatesTitleEn}
                                onChange={(e) => setTempUpdatesTitleEn(e.target.value)}
                                className="w-full bg-slate-900 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono text-purple-400 font-black uppercase tracking-wider">Подзаголовок страницы (Page Subtitle)</label>
                              <textarea 
                                value={tempUpdatesSubtitleEn}
                                onChange={(e) => setTempUpdatesSubtitleEn(e.target.value)}
                                rows={2}
                                className="w-full bg-slate-900 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50"
                              />
                            </div>
                          </div>

                        </div>

                        {/* Interactive Blocks list and real-time simulator split */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                          
                          {/* Left Column: Form blocks list (col-span-7) */}
                          <div className="xl:col-span-7 space-y-5">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-extrabold text-slate-300 uppercase tracking-widest font-mono">
                                СТРУКТУРНЫЕ БЛОКИ ОБНОВЛЕНИЯ ({tempUpdateBlocks.length})
                              </span>
                              
                              {/* Template block quick generator */}
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500 font-mono">Добавить шаблон:</span>
                                <button
                                  onClick={() => {
                                    const nextId = 'block_' + Math.random().toString(36).substring(2, 7);
                                    const newBlock = {
                                      id: nextId,
                                      tagRu: 'ВИЗУАЛ', tagEn: 'IMAGE',
                                      titleRu: 'Обновленная система скриншотов', titleEn: 'Enhanced Interface Screenshots',
                                      descRu: 'Интегрировали новые аппаратные слайды в прошивку для детализации рендеров.', descEn: 'We have integrated new schematic mockups directly inside core firmware.',
                                      mediaType: 'image',
                                      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'
                                    };
                                    setTempUpdateBlocks([...tempUpdateBlocks, newBlock]);
                                    showToast('Добавлен блок с картинкой', 'info');
                                  }}
                                  className="cursor-pointer bg-slate-900 border border-white/10 hover:border-purple-500/40 text-[10px] px-2.5 py-1 rounded text-purple-300"
                                >
                                  Картинка
                                </button>
                                <button
                                  onClick={() => {
                                    const nextId = 'block_' + Math.random().toString(36).substring(2, 7);
                                    const newBlock = {
                                      id: nextId,
                                      tagRu: 'ВИДЕО_AV1', tagEn: 'COMPILER_MODE',
                                      titleRu: 'Режим 8K Dual Broadcast', titleEn: 'Vite 8K AV1 Broadcast',
                                      descRu: 'Трансляция исходного кода декомпилятора в режиме реального времени на частоте 144 Гц.', descEn: 'Live compiler visual streaming at 144 Hz with ultra-fast latency bindings.',
                                      mediaType: 'video_simulator'
                                    };
                                    setTempUpdateBlocks([...tempUpdateBlocks, newBlock]);
                                    showToast('Добавлен AV1 видео симулятор', 'info');
                                  }}
                                  className="cursor-pointer bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-[10px] px-2.5 py-1 rounded text-cyan-300"
                                >
                                  Стриминг
                                </button>
                                <button
                                  onClick={() => {
                                    const nextId = 'block_' + Math.random().toString(36).substring(2, 7);
                                    const newBlock = {
                                      id: nextId,
                                      tagRu: 'ШИФРАТОР', tagEn: 'ROTATOR',
                                      titleRu: 'Квантовая смена туннелей', titleEn: 'PQ Cryptographic Rotator',
                                      descRu: 'Ротация сессионых ключей по алгоритму CRYSTALS-Kyber без задержек.', descEn: 'Real-time post-quantum session key updates using E2E cipher tunnel.',
                                      mediaType: 'crypto_simulator'
                                    };
                                    setTempUpdateBlocks([...tempUpdateBlocks, newBlock]);
                                    showToast('Добавлен крипто симулятор', 'info');
                                  }}
                                  className="cursor-pointer bg-slate-900 border border-white/10 hover:border-emerald-500/40 text-[10px] px-2.5 py-1 rounded text-emerald-300"
                                >
                                  Криптосинх
                                </button>
                              </div>
                            </div>

                            {tempUpdateBlocks.length === 0 ? (
                              <div className="bg-slate-950/40 border border-white/5 rounded-3xl p-8 text-center text-slate-500 space-y-2">
                                <Activity className="w-10 h-10 text-slate-700 mx-auto" />
                                <h4 className="font-extrabold text-slate-300">Блоки отсутствуют</h4>
                                <p className="text-xs font-light max-w-sm mx-auto">
                                  Нажмите на кнопки шаблонов вверху справа, чтобы мгновенно добавить предварительно настроенные интерактивные блоки в обновление.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {tempUpdateBlocks.map((block, idx) => (
                                  <div 
                                    key={block.id || idx}
                                    className="bg-slate-950/80 border border-white/5 rounded-3xl p-5 space-y-4 hover:border-purple-500/20 transition-all relative group"
                                  >
                                    {/* Action Header bar inside the card */}
                                    <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                                      <div className="flex items-center gap-1.5 font-mono text-[9px] font-extrabold tracking-widest text-slate-400">
                                        <span className="w-4 h-4 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-[10px] text-purple-400">
                                          {idx + 1}
                                        </span>
                                        <span>БЛОК ID: {block.id}</span>
                                      </div>
                                      
                                      {/* Order modifier actions */}
                                      <div className="flex items-center gap-1">
                                        <button
                                          disabled={idx === 0}
                                          onClick={() => {
                                            const updated = [...tempUpdateBlocks];
                                            const [moved] = updated.splice(idx, 1);
                                            updated.splice(idx - 1, 0, moved);
                                            setTempUpdateBlocks(updated);
                                          }}
                                          className="cursor-pointer p-1.5 text-slate-500 hover:text-slate-200 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-900 rounded-lg transition-colors"
                                          title="Переместить выше"
                                        >
                                          <ArrowRight className="w-3.5 h-3.5 -rotate-90" />
                                        </button>
                                        <button
                                          disabled={idx === tempUpdateBlocks.length - 1}
                                          onClick={() => {
                                            const updated = [...tempUpdateBlocks];
                                            const [moved] = updated.splice(idx, 1);
                                            updated.splice(idx + 1, 0, moved);
                                            setTempUpdateBlocks(updated);
                                          }}
                                          className="cursor-pointer p-1.5 text-slate-500 hover:text-slate-200 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-900 rounded-lg transition-colors"
                                          title="Переместить ниже"
                                        >
                                          <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                                        </button>
                                        <span className="w-px h-3.5 bg-white/10 mx-1" />
                                        <button
                                          onClick={() => {
                                            const updated = tempUpdateBlocks.filter((_, bIdx) => bIdx !== idx);
                                            setTempUpdateBlocks(updated);
                                            showToast('Блок удален из списка', 'warning');
                                          }}
                                          className="cursor-pointer p-1.5 text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors"
                                          title="Удалить блок"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Grid input panel */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      
                                      {/* Left side: Russian version */}
                                      <div className="space-y-3.5 p-3.5 bg-white/[0.01] border border-white/5 rounded-2xl">
                                        <span className="text-[9px] font-mono font-black text-rose-400 uppercase tracking-widest block pb-1 border-b border-white/5">Локализация RU</span>
                                        
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-mono text-slate-400">Шильдик / Тег (RU)</label>
                                          <input 
                                            type="text" 
                                            value={block.tagRu || ''} 
                                            onChange={(e) => {
                                              const updated = [...tempUpdateBlocks];
                                              updated[idx].tagRu = e.target.value;
                                              setTempUpdateBlocks(updated);
                                            }}
                                            className="w-full bg-slate-900 border border-white/5 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                                            placeholder="ВИЗУАЛ"
                                          />
                                        </div>

                                        <div className="space-y-1">
                                          <label className="text-[9px] font-mono text-slate-400">Заглавие (RU)</label>
                                          <input 
                                            type="text" 
                                            value={block.titleRu || ''} 
                                            onChange={(e) => {
                                              const updated = [...tempUpdateBlocks];
                                              updated[idx].titleRu = e.target.value;
                                              setTempUpdateBlocks(updated);
                                            }}
                                            className="w-full bg-slate-900 border border-white/5 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                                            placeholder="Реверс прошивки"
                                          />
                                        </div>

                                        <div className="space-y-1">
                                          <label className="text-[9px] font-mono text-slate-400">Описание нововведения (RU)</label>
                                          <textarea 
                                            value={block.descRu || ''} 
                                            onChange={(e) => {
                                              const updated = [...tempUpdateBlocks];
                                              updated[idx].descRu = e.target.value;
                                              setTempUpdateBlocks(updated);
                                            }}
                                            rows={2}
                                            className="w-full bg-slate-900 border border-white/5 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                                            placeholder="Мы перевели архитектуру на суверенное шифрование..."
                                          />
                                        </div>
                                      </div>

                                      {/* Right side: English version */}
                                      <div className="space-y-3.5 p-3.5 bg-white/[0.01] border border-white/5 rounded-2xl">
                                        <span className="text-[9px] font-mono font-black text-cyan-400 uppercase tracking-widest block pb-1 border-b border-white/5">Localization EN</span>
                                        
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-mono text-slate-400">Badge / Tag (EN)</label>
                                          <input 
                                            type="text" 
                                            value={block.tagEn || ''} 
                                            onChange={(e) => {
                                              const updated = [...tempUpdateBlocks];
                                              updated[idx].tagEn = e.target.value;
                                              setTempUpdateBlocks(updated);
                                            }}
                                            className="w-full bg-slate-900 border border-white/5 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                                            placeholder="VISUAL"
                                          />
                                        </div>

                                        <div className="space-y-1">
                                          <label className="text-[9px] font-mono text-slate-400">Title (EN)</label>
                                          <input 
                                            type="text" 
                                            value={block.titleEn || ''} 
                                            onChange={(e) => {
                                              const updated = [...tempUpdateBlocks];
                                              updated[idx].titleEn = e.target.value;
                                              setTempUpdateBlocks(updated);
                                            }}
                                            className="w-full bg-slate-900 border border-white/5 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                                            placeholder="Firmware update"
                                          />
                                        </div>

                                        <div className="space-y-1">
                                          <label className="text-[9px] font-mono text-slate-400">Description (EN)</label>
                                          <textarea 
                                            value={block.descEn || ''} 
                                            onChange={(e) => {
                                              const updated = [...tempUpdateBlocks];
                                              updated[idx].descEn = e.target.value;
                                              setTempUpdateBlocks(updated);
                                            }}
                                            rows={2}
                                            className="w-full bg-slate-900 border border-white/5 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                                            placeholder="We migrated key nodes directly onto custom AV1 codecs..."
                                          />
                                        </div>
                                      </div>

                                    </div>

                                    {/* Media selector line */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                      <div className="space-y-1.5">
                                        <label className="text-[10px] font-mono text-slate-400 block uppercase">Технологический медиа-интегратор</label>
                                        <select
                                          value={block.mediaType}
                                          onChange={(e) => {
                                            const updated = [...tempUpdateBlocks];
                                            updated[idx].mediaType = e.target.value;
                                            
                                            // Reset parameters nicely based on select
                                            if (e.target.value === 'code' && !updated[idx].codeTemplate) {
                                              updated[idx].codeTemplate = `// Custom Code Sandbox Node\nconst system = require('nexus_core');\nawait system.rotateKeys();\nconsole.log("TLS v1.3 Rerouted OK");`;
                                            }
                                            setTempUpdateBlocks(updated);
                                          }}
                                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                                        >
                                          <option value="none">Без симулятора (Только Текст)</option>
                                          <option value="image">Персональный скриншот (Изображение)</option>
                                          <option value="video_url">Адресное видео файл (MP4 URL)</option>
                                          <option value="code">Интерактивный Терминал (Печать Скрипта)</option>
                                          <option value="video_simulator">Симулятор AV1 Live 8K-Broadcast</option>
                                          <option value="audio_simulator">Симулятор Матрицы De-Noiser</option>
                                          <option value="crypto_simulator">Симулятор PQ Quantum Tunneled Key</option>
                                          <option value="all_summary">Суммарный отчет Nexus Multi-Engine</option>
                                        </select>
                                      </div>

                                      {/* Custom conditions line */}
                                      {block.mediaType === 'image' && (
                                        <div className="space-y-1.5">
                                          <label className="text-[10px] font-mono text-slate-400 block uppercase">Прямая ссылка на скриншот (URL)</label>
                                          <input 
                                            type="text" 
                                            value={block.mediaUrl || ''} 
                                            onChange={(e) => {
                                              const updated = [...tempUpdateBlocks];
                                              updated[idx].mediaUrl = e.target.value;
                                              setTempUpdateBlocks(updated);
                                            }}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                                            placeholder="https://example.com/screenshot.png"
                                          />
                                        </div>
                                      )}

                                      {block.mediaType === 'video_url' && (
                                        <div className="space-y-1.5">
                                          <label className="text-[10px] font-mono text-slate-400 block uppercase">Прямая ссылка на файл MP4 (URL)</label>
                                          <input 
                                            type="text" 
                                            value={block.mediaUrl || ''} 
                                            onChange={(e) => {
                                              const updated = [...tempUpdateBlocks];
                                              updated[idx].mediaUrl = e.target.value;
                                              setTempUpdateBlocks(updated);
                                            }}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                                            placeholder="https://example.com/presentation.mp4"
                                          />
                                        </div>
                                      )}

                                      {block.mediaType === 'code' && (
                                        <div className="space-y-1.5">
                                          <label className="text-[10px] font-mono text-slate-400 block uppercase">Содержание лога в терминале</label>
                                          <textarea 
                                            value={block.codeTemplate || ''} 
                                            onChange={(e) => {
                                              const updated = [...tempUpdateBlocks];
                                              updated[idx].codeTemplate = e.target.value;
                                              setTempUpdateBlocks(updated);
                                            }}
                                            rows={2}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                                            placeholder="// Напишите любой вывод тут..."
                                          />
                                        </div>
                                      )}
                                    </div>

                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Main block creation activator */}
                            <button
                              onClick={() => {
                                const nextId = 'custom_block_' + Math.random().toString(36).substring(2, 7);
                                const newBlock: any = {
                                  id: nextId,
                                  tagRu: 'ОБНОВЛЕНИЕ', tagEn: 'PATCH',
                                  titleRu: 'Собственное нововведение', titleEn: 'Custom block',
                                  descRu: 'Введите подробное описание созданного блока для отображения на новом экране обновлений.', descEn: 'Configure description here.',
                                  mediaType: 'none'
                                };
                                setTempUpdateBlocks([...tempUpdateBlocks, newBlock]);
                                showToast('Пустой блок успешно добавлен', 'success');
                              }}
                              className="cursor-pointer w-full py-4 border border-dashed border-white/10 hover:border-purple-550 rounded-3xl bg-white/[0.01] hover:bg-purple-650/[0.02] text-slate-400 hover:text-purple-300 transition-all font-bold text-xs flex items-center justify-center gap-2"
                            >
                              <Plus className="w-4 h-4 animate-bounce" />
                              <span>Создать произвольный блок с нуля</span>
                            </button>
                          </div>

                          {/* Right Column: Real-time Live Preview WYSIWYG replica (col-span-5) */}
                          <div className="xl:col-span-5 bg-slate-950/80 border border-white/10 rounded-3xl p-6 space-y-6 sticky top-6">
                            <div className="flex justify-between items-center pb-3 border-b border-white/5">
                              <span className="text-xs font-black text-purple-400 uppercase tracking-widest font-mono">
                                ПАКЕТНЫЙ ПРЕДПРОСМОТР (WYSIWYG)
                              </span>
                              <span className="text-[9px] bg-purple-500/10 text-purple-300 font-mono px-2 py-0.5 rounded border border-purple-500/20 font-bold uppercase tracking-wider">
                                СИМУЛЯЦИЯ ЭКРАНА
                              </span>
                            </div>

                            {/* Simulated screen container mockup */}
                            <div className="bg-[#050508] border border-white/5 rounded-2xl overflow-hidden font-sans h-[62vh] flex flex-col relative text-left shadow-2xl">
                              
                              {/* OS Head bar */}
                              <div className="h-6 bg-[#0c0c16] px-3 flex items-center justify-between text-[9px] text-slate-500 select-none">
                                <span className="font-mono font-bold text-purple-400">NEXUS SYSTEM COMPILER v1.7</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                                </div>
                              </div>

                              {/* Simulated full-screen viewport */}
                              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin select-none">
                                
                                {/* Back action top simulated */}
                                <div className="flex justify-between items-center text-[10px] pb-2 border-b border-white/5">
                                  <span className="text-slate-400 flex items-center gap-1">
                                    <span>&larr; Назад</span>
                                  </span>
                                  <span className="text-purple-400 font-bold font-mono">{tempUpdatesVersion || 'v1.0.0'}</span>
                                </div>

                                {/* Simulated header */}
                                <div className="space-y-1 py-1">
                                  <div className="font-black text-sm tracking-tight text-white uppercase text-center leading-tight">
                                    {tempUpdatesTitleRu || 'Спецификация Обновлений'}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-light text-center leading-relaxed">
                                    {tempUpdatesSubtitleRu || 'Ознакомьтесь с актуальными прошивками'}
                                  </div>
                                </div>

                                {/* Active alert button simulator mockup */}
                                {tempShowUpdatesAlert && (
                                  <div className="p-3 bg-gradient-to-r from-purple-950/20 to-transparent border border-purple-500/15 rounded-xl flex items-center justify-between animate-pulse">
                                    <div className="flex items-center gap-2">
                                      <RefreshCw className="w-3 h-3 text-purple-400 animate-spin" style={{ animationDuration: '4s' }} />
                                      <span className="text-[9px] text-purple-200 font-semibold truncate max-w-[140px]">{tempUpdatesAlertText}</span>
                                    </div>
                                    <span className="text-[8px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded uppercase font-bold tracking-widest leading-none">Обновить</span>
                                  </div>
                                )}

                                {/* Simple Blocks List simulator */}
                                <div className="space-y-3 pt-2">
                                  {tempUpdateBlocks.map((block, simIdx) => (
                                    <div key={simIdx} className="bg-[#090912] border border-white/5 p-3 rounded-xl space-y-2">
                                      <div className="flex justify-between items-center">
                                        <span className="text-[7.5px] font-black text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">{block.tagRu || 'НОВОЕ'}</span>
                                        <span className="text-[8px] text-slate-550 font-mono">#{simIdx + 1}</span>
                                      </div>
                                      <h5 className="text-[11px] font-extrabold text-slate-200">{block.titleRu}</h5>
                                      <p className="text-[9.5px] text-slate-450 leading-relaxed font-light">{block.descRu}</p>
                                      
                                      {/* Media item rendering simulator indicator */}
                                      {block.mediaType !== 'none' && (
                                        <div className="h-20 rounded-lg bg-black/80 border border-white/5 flex flex-col items-center justify-center p-2 text-center text-slate-500">
                                          {block.mediaType === 'image' && (
                                            <>
                                              <Eye className="w-5 h-5 text-purple-400/60" />
                                              <span className="text-[7.5px] font-mono uppercase mt-1">Отрисовка Скриншота</span>
                                              <span className="text-[6.5px] text-slate-600 truncate max-w-xs">{block.mediaUrl || 'Картинка не выбрана'}</span>
                                            </>
                                          )}
                                          {block.mediaType === 'video_url' && (
                                            <>
                                              <Play className="w-5 h-5 text-cyan-400/60" />
                                              <span className="text-[7.5px] font-mono uppercase mt-1">Рендер MP4 файла</span>
                                              <span className="text-[6.5px] text-slate-600 truncate max-w-xs">{block.mediaUrl || 'Видео не выбрано'}</span>
                                            </>
                                          )}
                                          {block.mediaType === 'code' && (
                                            <div className="w-full h-full font-mono text-[6.5px] text-purple-300 text-left bg-black/60 p-1.5 overflow-hidden truncate">
                                              {block.codeTemplate}
                                            </div>
                                          )}
                                          {block.mediaType === 'video_simulator' && (
                                            <>
                                              <Activity className="w-5 h-5 text-cyan-400/60 animate-pulse" />
                                              <span className="text-[7.5px] font-mono uppercase mt-1 text-cyan-300">AV1 Code Stream Simulator</span>
                                            </>
                                          )}
                                          {block.mediaType === 'crypto_simulator' && (
                                            <>
                                              <ShieldCheck className="w-5 h-5 text-purple-400/60 animate-bounce" />
                                              <span className="text-[7.5px] font-mono uppercase mt-1 text-purple-300">Rotator Simulator active</span>
                                            </>
                                          )}
                                          {block.mediaType === 'audio_simulator' && (
                                            <>
                                              <Volume2 className="w-5 h-5 text-pink-400/60 animate-pulse" />
                                              <span className="text-[7.5px] font-mono uppercase mt-1 text-pink-300">De-Noiser isolation simulator</span>
                                            </>
                                          )}
                                          {block.mediaType === 'all_summary' && (
                                            <>
                                              <Sliders className="w-5 h-5 text-slate-400/60" />
                                              <span className="text-[7.5px] font-mono uppercase mt-1 text-slate-300">Multi-Engine Summary Panel</span>
                                            </>
                                          )}
                                        </div>
                                      )}

                                    </div>
                                  ))}
                                </div>

                              </div>

                              {/* Simulated bottom button */}
                              <div className="bg-[#0b0b14] border-t border-white/5 p-3 flex justify-center">
                                <button className="w-full bg-purple-600 text-white font-extrabold text-[10px] uppercase py-2 rounded-lg tracking-widest text-center shadow-lg">
                                  Выйти на главную
                                </button>
                              </div>

                            </div>
                          </div>

                        </div>

                      </motion.div>
                    )}


                  </main>

                </div>

                {/* SITENOTICE SYSTEM STATUS / WORKSPACE CONTROL BAR FOOTER */}
                <footer className="bg-slate-950 border-t border-white/5 px-6 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0 text-slate-500 text-xs font-mono select-none">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>NEXUS TRUST NETWORK • ЗАШИФРОВАННЫЙ СЕКТОР</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>ПИРОВ ОНЛАЙН: 148,321</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                    <span>СТАТУС ШЛЮЗА: СТАБИЛЬНО (100%)</span>
                  </div>
                </footer>

              </motion.div>
            )}

          </div>
        )}
      </AnimatePresence>
    </>
  );
}
