import { useState, useEffect } from 'react';
import { NavTab, Language, DiseaseActivity, NotificationItem, Pathogen } from './types';
import {
  INITIAL_WEATHER_ALERT,
  INITIAL_DISEASE_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
  PATHOGENS_LIBRARY,
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { LearnView } from './components/LearnView';
import { LibraryView } from './components/LibraryView';
import { ScanView } from './components/ScanView';
import { SettingsView } from './components/SettingsView';
import { NotificationsModal } from './components/NotificationsModal';
import { ChatDrawer } from './components/ChatDrawer';
import { AddDiseaseModal } from './components/AddDiseaseModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [settingsSection, setSettingsSection] = useState<'model' | 'add_disease' | 'terms' | 'app_info'>('add_disease');
  const [lang, setLang] = useState<Language>('es');

  const handleOpenSettingsSection = (section: 'model' | 'add_disease' | 'terms' | 'app_info' = 'add_disease') => {
    setSettingsSection(section);
    setActiveTab('settings');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab, settingsSection]);
  const [activities, setActivities] = useState<DiseaseActivity[]>(INITIAL_DISEASE_ACTIVITIES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAddDiseaseModalOpen, setIsAddDiseaseModalOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState('');

  const handleOpenAiChatWithPrompt = (promptText: string) => {
    setChatInitialPrompt(promptText);
    setIsChatOpen(true);
  };

  // Pathogens Knowledge Base State with localStorage persistence
  const [pathogensList, setPathogensList] = useState<Pathogen[]>(() => {
    try {
      const saved = localStorage.getItem('moradetec_pathogens');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p: Pathogen) => p.id));
          const missingDefaults = PATHOGENS_LIBRARY.filter((p) => !existingIds.has(p.id));
          return [...parsed, ...missingDefaults];
        }
      }
    } catch (e) {
      console.error("Error reading saved pathogens:", e);
    }
    return PATHOGENS_LIBRARY;
  });

  useEffect(() => {
    try {
      localStorage.setItem('moradetec_pathogens', JSON.stringify(pathogensList));
    } catch (e) {
      console.error("Error saving pathogens:", e);
    }
  }, [pathogensList]);

  const handleAddPathogen = (newPathogen: Pathogen) => {
    setPathogensList((prev) => [newPathogen, ...prev]);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      titleEs: `Base de Conocimiento Actualizada: ${newPathogen.scientificName}`,
      titleEn: `Knowledge Base Updated: ${newPathogen.scientificName}`,
      descEs: `Se registró una nueva ficha de enfermedad para el Robot Agrónomo IA.`,
      descEn: `A new disease datasheet was added for the AI Agronomist Bot.`,
      time: 'Reciente',
      read: false,
      type: 'info',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  const handleUpdateActivityStatus = (id: string, newStatusType: 'ACTIONED' | 'URGENT') => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === id) {
          return {
            ...act,
            statusType: newStatusType,
            statusEs: newStatusType === 'ACTIONED' ? 'GESTIONADO' : 'URGENTE',
            statusEn: newStatusType === 'ACTIONED' ? 'ACTIONED' : 'URGENT',
          };
        }
        return act;
      })
    );
  };

  const handleAddActivity = (newAct: DiseaseActivity) => {
    setActivities((prev) => [newAct, ...prev]);
    // Also push a notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      titleEs: `Nuevo Diagnóstico: ${newAct.titleEs}`,
      titleEn: `New Diagnostic: ${newAct.titleEn}`,
      descEs: `Se registró un escaneo con confianza ${newAct.confidence || '98%'}.`,
      descEn: `Recorded a scan with confidence ${newAct.confidence || '98%'}.`,
      time: 'Reciente',
      read: false,
      type: 'scan',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleMarkAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-body-md selection:bg-primary-container selection:text-on-primary-container relative overflow-x-hidden">
      {/* Visual Atmosphere Background Gradient & Organic Blobs */}
      <div className="fixed -bottom-28 -left-28 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-drift"></div>
      <div className="fixed top-1/3 -right-36 w-96 h-96 bg-purple-300/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Top Header */}
      <Header
        lang={lang}
        onToggleLang={toggleLanguage}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotifOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenSettings={() => {
          handleOpenSettingsSection('add_disease');
          setIsAddDiseaseModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-20 pb-28 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        {activeTab === 'dashboard' && (
          <DashboardView
            lang={lang}
            weatherAlert={INITIAL_WEATHER_ALERT}
            activities={activities}
            onNewScan={() => setActiveTab('scan')}
            onGoToLibrary={() => setActiveTab('library')}
            onUpdateActivityStatus={handleUpdateActivityStatus}
            onOpenAiChatWithPrompt={handleOpenAiChatWithPrompt}
            onAddNotification={(notif) => setNotifications((prev) => [notif, ...prev])}
          />
        )}

        {activeTab === 'learn' && <LearnView lang={lang} />}

        {activeTab === 'library' && (
          <LibraryView
            lang={lang}
            onOpenScanner={() => setActiveTab('scan')}
            pathogens={pathogensList}
            onAddPathogen={handleAddPathogen}
            onGoToSettings={() => handleOpenSettingsSection('add_disease')}
            onOpenAddDiseaseModal={() => setIsAddDiseaseModalOpen(true)}
          />
        )}

        {activeTab === 'scan' && (
          <ScanView
            lang={lang}
            onAddActivity={handleAddActivity}
            onGoToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            lang={lang}
            onAddPathogen={handleAddPathogen}
            onToggleLang={toggleLanguage}
            initialSection={settingsSection}
            onOpenAddDiseaseModal={() => setIsAddDiseaseModalOpen(true)}
          />
        )}
      </main>

      {/* Bottom Floating Navigation Bar */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} lang={lang} />

      {/* Add Disease Modal */}
      <AddDiseaseModal
        isOpen={isAddDiseaseModalOpen}
        onClose={() => setIsAddDiseaseModalOpen(false)}
        lang={lang}
        onAddPathogen={handleAddPathogen}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotifsRead}
        lang={lang}
        onOpenAiChatWithPrompt={handleOpenAiChatWithPrompt}
      />

      {/* AI Chat Drawer */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        lang={lang}
        knowledgeBase={pathogensList}
        initialPrompt={chatInitialPrompt}
      />
    </div>
  );
}
