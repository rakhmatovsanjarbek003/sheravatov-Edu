/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { triggerHaptic } from './lib/haptics';
import Header from './components/Header';
import FeatureCarousel from './components/FeatureCarousel';
import AICoach from './components/AICoach';
import Categories from './components/Categories';
import RecentQuizzes from './components/RecentQuizzes';
import StreakPanel from './components/StreakPanel';
import QuizActiveView from './components/QuizActiveView';
import BottomNav from './components/BottomNav';
import CreateQuizView from './views/CreateQuizView';
import StatsView from './views/StatsView';
import CommunityView from './views/CommunityView';
import ProfileView from './views/ProfileView';
import AdminView from './views/AdminView';
import PresentationView from './views/PresentationView';
import AcademicPaperView from './views/AcademicPaperView';
import PremiumView from './views/PremiumView';
import LegalView from './views/LegalView';
import SubjectView from './views/SubjectView';
import UploadModal from './components/UploadModal';
import { Quiz } from './types';

const INITIAL_QUIZZES: Quiz[] = [
  { id: 'm1', title: 'Algebra Basics', category: 'math', questionsCount: 10, icon: '📐', timeAgo: '2h ago', score: '8/10' },
  { id: 'p1', title: 'Python Basics', category: 'programming', questionsCount: 10, icon: '🐍', timeAgo: '5h ago', score: '9/10' },
  { id: 's1', title: 'Chemical Bonds', category: 'chemistry', questionsCount: 10, icon: '🧪', timeAgo: '1d ago' },
  { id: 'h1', title: 'Ancient Rome', category: 'history', questionsCount: 15, icon: '🏛️', timeAgo: '2d ago' },
  { id: 'e1', title: 'Grammar 101', category: 'english', questionsCount: 20, icon: '📝', timeAgo: '3d ago' },
  { id: 'b1', title: 'Human Anatomy', category: 'biology', questionsCount: 30, icon: '🧬', timeAgo: '4d ago' },
];

import AdminAdBot from './components/AdminAdBot';
import AIRecommendations from './components/AIRecommendations';
import DailyAIQuiz from './components/DailyAIQuiz';

import NotificationView, { Notification as NotificationType } from './components/NotificationView';

const INITIAL_NOTIFICATIONS: NotificationType[] = [
  {
    id: '1',
    title: 'Yangi Quiz Tayyor!',
    message: 'Siz uchun "Python Advanced" mavzusida yangi test yaratildi.',
    time: '5 daqiqa oldin',
    type: 'quiz',
    read: false
  },
  {
    id: '2',
    title: 'Yutuq Muborak!',
    message: 'Siz "Haftalik Faol" nishonini qo\'lga kiritdingiz.',
    time: '2 soat oldin',
    type: 'achievement',
    read: false
  },
  {
    id: '3',
    title: 'Chatda Yangi Xabar',
    message: 'Jasur Ustoz: "Bugungi dars materiallarini ko\'rib chiqing."',
    time: '4 soat oldin',
    type: 'community',
    read: true
  },
  {
    id: '4',
    title: 'Tizim Yangilanishi',
    message: 'Ilova interfeysi Apple minimalizmi asosida yangilandi.',
    time: '1 kun oldin',
    type: 'system',
    read: true
  }
];

// Inline SubjectView removed, moved to src/views/SubjectView.tsx

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>(INITIAL_NOTIFICATIONS);
  const [tgUser, setTgUser] = useState<any>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [freeUsage, setFreeUsage] = useState({ quiz: 0, doc: 0, presentation: 0 });
  
  // Secure Admin Check using .env
  const adminIds = (import.meta.env.VITE_ADMIN_UIDS || '').split(',');
  const isAdminMode = tgUser?.id ? adminIds.includes(tgUser.id.toString()) : false;

  const checkLimit = (type: 'quiz' | 'doc' | 'presentation'): boolean => {
    if (isAdminMode || isPremium) return true;
    if (freeUsage[type] >= 1) {
       alert("Free tizimda kuniga faqat 1 ta yaratish mumkin! Oylik obuna (14,999 so'm) xarid qiling.");
       return false;
    }
    setFreeUsage(prev => ({ ...prev, [type]: prev[type] + 1 }));
    return true;
  };

  useEffect(() => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        tg.setHeaderColor('#0f172a');
        tg.setBackgroundColor('#0f172a');
        // Setup theme (Force Dark Mode)
        document.body.classList.add('dark');
        document.body.classList.remove('light');
        setTgUser(tg.initDataUnsafe?.user);
      } else {
        document.body.classList.add('dark');
      }
    } catch (e) {
      console.error("Telegram SDK not found", e);
      document.body.classList.add('dark');
    }
  }, []);

  const [solveSettings, setSolveSettings] = useState({ shuffleQuestions: true, shuffleOptions: true, limit: 10 });

  useEffect(() => {
    // Load ALL quizzes (Official + User created)
    fetch('/api/quizzes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setQuizzes(data);
        }
      })
      .catch(err => console.error("Quiz load error:", err));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    setActiveTab('subject');
  };

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setSelectedCategory(null);
  };

  const handleSaveQuiz = async (newQuiz: Quiz) => {
    setQuizzes(prev => [newQuiz, ...prev]);
    // Persist to DB
    try {
      await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuiz)
      });
    } catch (e) {
        console.error("Failed to persist quiz", e);
    }
  };

  const handleFeatureAction = (id: number) => {
    switch (id) {
      case 2: // AI Path
        setActiveTab('create');
        break;
      case 3: // Upload
        setIsUploadModalOpen(true);
        break;
      case 4: // Presentation
        setActiveTab('presentation');
        break;
      case 5: // Paper
        setActiveTab('paper');
        break;
      case 6: // Session Mode
        setActiveTab('create');
        break;
      case 7: // Challenge
        setActiveTab('stats'); // Lead to stats/rankings
        break;
      default:
        break;
    }
  };

  const myRecentQuizzes = quizzes
    .filter(q => q.creatorId === tgUser?.id?.toString() || q.creatorId === 'unknown')
    .slice(0, 10);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AdminAdBot />
            <FeatureCarousel onAction={handleFeatureAction} />
            <AIRecommendations />
            <AICoach recentResults={[
              { title: 'Python Basics', score: '8/10', date: '2 days ago' },
              { title: 'Math Algebra', score: '7/10', date: '3 days ago' }
            ]} />
            <Categories 
              onSelect={handleCategorySelect} 
              selectedId={selectedCategory || undefined} 
            />
            <RecentQuizzes 
              quizzes={myRecentQuizzes} 
              onStartQuiz={handleStartQuiz}
            />
            <DailyAIQuiz onStart={setActiveQuiz} />
            <StreakPanel />
          </main>
        );
      case 'create':
        return (
          <CreateQuizView 
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onOpenPresentation={() => setActiveTab('presentation')}
            onOpenPaper={() => setActiveTab('paper')}
            quizzes={quizzes}
            onStartQuiz={handleStartQuiz}
            onSaveQuiz={handleSaveQuiz}
            settings={solveSettings}
            onSettingsChange={setSolveSettings}
          />
        );
      case 'stats':
        return <StatsView />;
      case 'community':
        return <CommunityView onBack={() => setActiveTab('home')} onOpenAdmin={() => setActiveTab('admin')} />;
      case 'profile':
        return (
          <ProfileView 
            user={tgUser} 
            isPremium={isPremium} 
            onUpgrade={() => setActiveTab('premium')} 
          />
        );
      case 'admin':
        return <AdminView />;
      case 'presentation':
        return <PresentationView onBack={() => setActiveTab('create')} />;
      case 'paper':
        return <AcademicPaperView onBack={() => setActiveTab('create')} />;
      case 'premium':
        return <PremiumView isPremium={isPremium} onBack={() => setActiveTab('home')} />;
      case 'legal':
        return <LegalView onBack={() => setActiveTab('home')} />;
      case 'subject':
        return (
          <SubjectView 
            subjectName={selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : ''} 
            quizzes={selectedCategory ? quizzes.filter(q => q.category === selectedCategory) : []}
            onStartQuiz={handleStartQuiz}
            onBack={() => {
              setActiveTab('home');
              setSelectedCategory(null);
            }} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen pb-10 relative">
      {activeTab !== 'community' && (
        <Header 
          unreadCount={unreadCount} 
          onOpenNotifications={() => setShowNotifications(true)} 
        />
      )}
      
      {renderContent()}

      {activeTab !== 'community' && (
        <BottomNav 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          isAdmin={isAdminMode} 
        />
      )}

      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onQuizParsed={(questions, isSession) => {
          if (!checkLimit('quiz')) {
            setIsUploadModalOpen(false);
            return;
          }
          setIsUploadModalOpen(false);
          const newQuiz: Quiz = {
            id: Date.now().toString(),
            title: isSession ? 'AI Sessiya Testi' : 'AI Parsed Quiz',
            category: 'resources', // Automatically published to Darsliklar
            questionsCount: questions.length,
            icon: isSession ? '👥' : '📄',
            timeAgo: 'Hozir',
            questions: questions,
            isPublic: true,
            creatorId: tgUser?.id?.toString() || 'unknown'
          };
          handleSaveQuiz(newQuiz);
          setActiveQuiz(newQuiz);
        }}
      />

      {/* Modals & Overlays */}
      {activeQuiz && (
        <QuizActiveView 
          quiz={activeQuiz} 
          onClose={() => setActiveQuiz(null)} 
          settings={solveSettings}
        />
      )}

      <NotificationView 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onClearAll={handleClearAll}
        onMarkRead={handleMarkRead}
      />

      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-blue/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
