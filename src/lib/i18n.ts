import { useState, useEffect } from 'react';

type Lang = 'uz' | 'ru' | 'en';

const dictionaries = {
  uz: {
    home: 'Bosh sahifa',
    community: 'Hamjamiyat',
    create: 'Yaratish',
    stats: 'Statistika',
    profile: 'Profil',
    teachers: 'Ustozlar',
    chats: 'Chatlar',
    courses: 'Kurslar',
    resources: 'Darsliklar',
    premium: 'Premium',
    admin: 'Admin Panel',
    upload_file: 'Fayl yuklash',
    generate_quiz: 'Test yaratish',
    generate_doc: 'Mustaqil ish yaratish',
    generate_presentation: 'Taqdimot yaratish',
    help: 'Yordam markazi',
    privacy: 'Maxfiylik siyosati',
    offer: 'Ommaviy Ofera',
    limit_reached: 'Siz kunlik limitingizga yetdingiz.',
    get_premium: 'Premium sotib olish',
    // ... we will add more as components are developed
  },
  ru: {
    home: 'Главная',
    community: 'Сообщество',
    create: 'Создать',
    stats: 'Статистика',
    profile: 'Профиль',
    teachers: 'Учителя',
    chats: 'Чаты',
    courses: 'Курсы',
    resources: 'Ресурсы',
    premium: 'Премиум',
    admin: 'Админ Панель',
    upload_file: 'Загрузить файл',
    generate_quiz: 'Создать тест',
    generate_doc: 'Создать работу',
    generate_presentation: 'Создать презентацию',
    help: 'Центр поддержки',
    privacy: 'Политика конфиденциальности',
    offer: 'Публичная оферта',
    limit_reached: 'Вы достигли дневного лимита.',
    get_premium: 'Купить Премиум',
  },
  en: {
    home: 'Home',
    community: 'Community',
    create: 'Create',
    stats: 'Stats',
    profile: 'Profile',
    teachers: 'Teachers',
    chats: 'Chats',
    courses: 'Courses',
    resources: 'Resources',
    premium: 'Premium',
    admin: 'Admin Panel',
    upload_file: 'Upload file',
    generate_quiz: 'Generate quiz',
    generate_doc: 'Generate paper',
    generate_presentation: 'Generate presentation',
    help: 'Help Center',
    privacy: 'Privacy Policy',
    offer: 'Public Offer',
    limit_reached: 'You have reached your daily limit.',
    get_premium: 'Get Premium',
  }
};

let currentLang: Lang = 'uz';
const listeners = new Set<() => void>();

export function setLanguage(lang: Lang) {
  currentLang = lang;
  listeners.forEach(l => l());
}

export function useLanguage() {
  const [, setTick] = useState(0);
  
  useEffect(() => {
    const listener = () => setTick(t => t + 1);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  return {
    lang: currentLang,
    t: (key: keyof typeof dictionaries['uz']) => dictionaries[currentLang][key] || key
  };
}
