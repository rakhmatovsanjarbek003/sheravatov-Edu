EduBot Pro: To'liq Texnik Dokumentatsiya

Ushbu hujjat EduBot Pro Telegram Mini App ilovasining barcha qismlari, texnologiyalari va fayl tuzilishi haqida batafsil ma'lumot beradi.

## 1. Texnologiyalar Steki (Technology Stack)

Ilova zamonaviy va yuqori unumdorlikka ega texnologiyalar asosida qurilgan:

*   **Frontend**: 
    *   **React 19**: Foydalanuvchi interfeysini boshqarish uchun eng so'nggi kutubxona.
    *   **TailwindCSS 4**: Stil berish va dizayn uchun foydalanilgan.
    *   **Vite**: Ilovani tezkor yig'ish va ishlab chiqish muhiti.
    *   **Motion (Framer Motion)**: Interfeysdagi silliq animatsiyalar uchun.
    *   **Lucide React**: Premium ikonkalarni boshqarish uchun.

*   **Backend**:
    *   **Node.js & Express**: API so'rovlarni boshqaruvchi server qismi.
    *   **tsx**: TypeScript fayllarini to'g'ridan-to'g'ri ishga tushirish uchun.
    *   **Groq SDK**: Sun'iy intellekt (Llama 3) bilan yuqori tezlikda ishlash uchun.

*   **Sun'iy Intellekt (AI)**:
    *   **Groq AI Cloud**: Matnlarni tahlil qilish, testlar yaratish va prezentatsiyalar tayyorlash uchun foydalaniladi.
    *   **Model**: `llama-3.3-70b-versatile` - tezkor va aqlli javoblar uchun.

*   **Fayllar bilan ishlash**:
    *   **pdf-parse**: PDF fayllarni o'qish.
    *   **mammoth**: MS Word (.docx) fayllarni tahlil qilish.
    *   **multer**: Fayllarni serverga yuklash.

## 2. Fayllar Tuzilishi va Vazifalari

### Ildiz Fayllar (Root Directory)
*   `server.ts`: Ilovaning backend qismi. API endpointlar, fayl tahlili va AI bilan bog'lanish shu yerda amalga oshiriladi.
*   `package.json`: Barcha kutubxonalar va scriptlar ro'yxati.
*   `vite.config.ts`: Frontendni yig'ish (build) sozlamalari.
*   `schema.sql`: Ma'lumotlar bazasi loyihasi (SQL).
*   `.env`: Maxfiy kalitlar va bot tokenlari saqlanadigan joy.

### Frontend Manbalari (`src/`)
*   `main.tsx`: Applikatsiyaning asosiy kirish nuqtasi.
*   `App.tsx`: Ilovaning "yuragi". Navigatsiya, asosiy holatlar (state) va modal oynalar shu yerda boshqariladi.
*   `types.ts`: TypeScript interfeyslari va turlari saqlanadi.
*   `index.css`: TailwindCSS va global stillar (neon effektlar, glassmorphism).

### Komponentlar (`src/components/`)
*   `Header.tsx`: Ilovaning yuqori qismi (Profil rasm, xabarnomalar).
*   `BottomNav.tsx`: Pastki navigatsiya menyusi.
*   `AICoach.tsx`: AI maslahatchi bloki.
*   `FeatureCarousel.tsx`: Ilovaning asosiy funksiyalari (Quiz, Doc, Presentation).
*   `Categories.tsx`: Testlar kategoriyasi (Matematika, IT, va h.k.).
*   `UploadModal.tsx`: Fayl yuklash va undan test yaratish oynasi.
*   `QuizActiveView.tsx`: Testni ishlash jarayoni interfeysi.

### Ko'rinishlar (`src/views/`)
*   `CommunityView.tsx`: Ustozlar va o'quvchilar muloqot qiladigan hamjamiyat qismi.
*   `ProfileView.tsx`: Foydalanuvchi ma'lumotlari, yutuqlari va tariflari.
*   `AdminView.tsx`: Admin panelining mobil ko'rinishi.
*   `CreateQuizView.tsx`: Yangi testlar yaratish markazi.
*   `PresentationView.tsx`: AI orqali prezentatsiya tayyorlash bo'limi.
*   `StatsView.tsx`: Foydalanuvchining umumiy reytingi va statistikasi.

## 3. Ilovaning Ishlash Mexanizmi

1.  **Kirish**: Ilova Telegram orqali ochilganda `App.tsx` foydalanuvchi ma'lumotlarini (`tgUser`) oladi va dark-mode yoqadi.
2.  **Test Yaratish**: Foydalanuvchi fayl yuklaganda, backend (`server.ts`) uni o'qiydi va Groq AI orqali JSON formatidagi testlarga aylantiradi.
3.  **Hujjat Generatsiya**: Prezentatsiya yoki ilmiy ish so'ralganda, backend bosqichma-bosqich (SSE) ma'lumotlarni yuboradi va AI har bir sahifani yozib beradi.
4.  **Cheklovlar**: Bepul foydalanuvchilar kuniga faqat 1 tadan test/hujjat yaratishi mumkin. Premium foydalanuvchilar uchun cheklovlar yo'q.

## 4. MVP (Minimum Viable Product) Holati

Hozirda ilova 90% tayyor. Sotuvga chiqarishdan oldin quyidagilar bajarilishi kerak:
1.  Ma'lumotlar bazasi (SQLite) ulanishi (Hozircha ma'lumotlar vaqtinchalik).
2.  Admin panelidagi barcha tugmalarni real funksiyalarga ulash.
3.  Premium to'lov imkoniyatlarini modellashtirish.
4.  Community (Hamjamiyat) qismidagi xabar almashishni backendga ulash.

---
*Ushbu hujjat Antigravity AI tomonidan yaratildi.*
