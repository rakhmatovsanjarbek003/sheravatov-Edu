import express, { Request } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import multer from 'multer';
import Groq from 'groq-sdk';
import mammoth from 'mammoth';
import pptxgen from 'pptxgenjs';
import dotenv from 'dotenv';
import { createRequire } from 'module';
import FormData from 'form-data';
import fs from 'fs';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

dotenv.config();

// SIMPLE JSON DB INITIALIZATION
const DB_PATH = path.join(process.cwd(), 'db.json');
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({
    users: [],
    mentors: [
      { id: '1', name: 'Jasur Ustoz', field: 'Python', status: 'Pending', date: '12 Apr' },
      { id: '2', name: 'Malika Karimova', field: 'English', status: 'Reviewing', date: '11 Apr' },
      { id: '3', name: 'Zafar Aliyev', field: 'Math', status: 'Pending', date: '10 Apr' }
    ],
    stats: {
      totalRevenue: 12450,
      activeUsers: 42800,
      retentionRate: 68,
      aiAccuracy: 94.2
    },
    officialQuizzes: [
       { id: 'm1', title: 'Algebra Basics', category: 'math', questionsCount: 10, icon: '📐', timeAgo: '2h ago', score: '8/10' },
       { id: 'p1', title: 'Python Basics', category: 'programming', questionsCount: 10, icon: '🐍', timeAgo: '5h ago', score: '9/10' },
       { id: 's1', title: 'Chemical Bonds', category: 'chemistry', questionsCount: 10, icon: '🧪', timeAgo: '1d ago' },
       { id: 'h1', title: 'Ancient Rome', category: 'history', questionsCount: 15, icon: '🏛️', timeAgo: '2d ago' },
       { id: 'e1', title: 'Grammar 101', category: 'english', questionsCount: 20, icon: '📝', timeAgo: '3d ago' },
       { id: 'b1', title: 'Human Anatomy', category: 'biology', questionsCount: 30, icon: '🧬', timeAgo: '4d ago' }
    ],
    userQuizzes: []
  }, null, 2));
}

const getDb = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const saveDb = (data: any) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// GROQ KEY ROTATION
const keysString = process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || '';
const GROQ_KEYS = keysString.split(',').map(k => k.trim()).filter(Boolean);
let currentKeyIndex = 0;

async function callGroq(messages: any[], model = 'llama-3.3-70b-versatile', maxRetries = 5) {
  if (GROQ_KEYS.length === 0) throw new Error("No GROQ keys provided in .env");
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const key = GROQ_KEYS[currentKeyIndex];
    try {
      const groq = new Groq({ apiKey: key });
      const completion = await groq.chat.completions.create({
        messages,
        model,
        temperature: 0.7,
      });
      return completion.choices[0]?.message?.content;
    } catch (error: any) {
      if (error?.status === 429) {
        console.warn(`[Groq] Rate limit on key index ${currentKeyIndex}. Rotating...`);
        currentKeyIndex = (currentKeyIndex + 1) % GROQ_KEYS.length;
      } else {
        throw error;
      }
    }
  }
  return null;
}

function extractJSON(text: string | null | undefined): any {
  if (!text) return null;
  try {
    const match = text.match(/\[.*\]/s) || text.match(/\{.*\}/s);
    if (match) return JSON.parse(match[0]);
  } catch (e) {
    console.error("Failed to parse JSON");
  }
  return null;
}

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const upload = multer({ storage: multer.memoryStorage() });

  app.use(express.json());

  // 1. Chat API
  app.post('/api/chat', async (req, res) => {
    const { message, history, context } = req.body;
    try {
      const systemInstruction = `${context || ''}Siz akademik AI maslahatchisiz. Javoblar qisqa va kitobiy bo'lsin. So'kinish ishlatmang.`;
      const messages = [
        { role: 'system', content: systemInstruction },
        ...history.map((m: any) => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content })),
        { role: 'user', content: message }
      ];
      const reply = await callGroq(messages);
      res.json({ reply });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'AI bilan bog\'lanishda xatolik yuz berdi.' });
    }
  });

  // 2. Upload and Parse Quiz (Assyst / Markers Fix)
  app.post('/api/upload', upload.single('file'), async (req: MulterRequest, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'Fayl yuklanmadi' });
      let text = '';
      const buffer = req.file.buffer;

      if (req.file.mimetype === 'application/pdf') {
        const data = await pdf(buffer);
        text = data.text;
      } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const data = await mammoth.extractRawText({ buffer });
        text = data.value;
      } else {
        text = buffer.toString('utf-8');
      }

      // Prompt tuned for high extraction
      const prompt = `Matn: ${text.substring(0, 15000)}\n\nUshbu matndan testlarni to'g'ri o'qib JSON array [ { "text": "savol", "options": ["A","B","C","D"], "correctAnswer": 0_dan_3_gacha_index } ] qaytar. Agar maxsus belgi (+ yoki #) bo'lsa uni olib tashla va uni To'g'ri javob sifatida indexga ber. Faqat JSON qaytar!`;
      const reply = await callGroq([{ role: 'user', content: prompt }]);
      const questions = extractJSON(reply) || [];
      res.json({ questions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Faylni tahlil qilishda xatolik' });
    }
  });

  // 3. Document / Presentation Generation (Iterative approach)
  app.post('/api/generate-document', async (req, res) => {
    const { topic, pages, type, customPlan } = req.body;
    try {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const sendStatus = (pct: number, text: string) => {
        res.write(`data: ${JSON.stringify({ progress: pct, status: text })}\n\n`);
      };

      sendStatus(10, 'Reja tuzilmoqda...');
      let titles = [];
      if (type === 'presentation') {
        const p = `Mavzu: ${topic}. Slayd soni: ${pages}. Sarlavhalarni JSON array formatida yoz. Faqat sarlavhalar!`;
        const rep = await callGroq([{ role: 'user', content: p }]);
        titles = extractJSON(rep) || Array.from({ length: pages }, (_, i) => `${topic} - Qism ${i + 1}`);
      } else {
        const p = `Mavzu: ${topic}. ${customPlan ? 'Reja: '+customPlan : `${pages} ta qism.`} Reja ro'yxatini JSON array qilib ber. Faqat JSON!`;
        const rep = await callGroq([{ role: 'user', content: p }]);
        titles = extractJSON(rep) || Array.from({ length: pages }, (_, i) => `Bob ${i + 1}`);
      }

      const contents = [];
      for (let i = 0; i < Math.min(titles.length, pages); i++) {
         const t = titles[i];
         sendStatus(10 + Math.floor((i / pages) * 80), `Yozilmoqda: ${t}`);
         const p2 = type === 'presentation' 
           ? `Mavzu: ${topic}. Slayd: ${t}. Slayd uchun qisqa, aniq va londa ma'lumotlarni yoz (3-4 jumla).`
           : `Mavzu: ${topic}. Bob nomi: ${t}. Batafsil 800 so'z atrofida akademik ilmiy tilda yoz.`;
         
         const text = await callGroq([{ role: 'user', content: p2 }]);
         contents.push({ title: t, content: text || "..." });
      }

      sendStatus(100, 'Tugallanmoqda...');
      
      // End format JSON format for client to construct PPTX / PDF
      res.write(`data: ${JSON.stringify({ done: true, data: contents })}\n\n`);
      res.end();
    } catch (error) {
      console.error(error);
      res.write(`data: ${JSON.stringify({ error: 'Failed' })}\n\n`);
      res.end();
    }
  });

  // 4. Telegram Cloud Form Upload proxy
  app.post('/api/upload-media', upload.single('file'), async (req: MulterRequest, res) => {
      try {
          if (!req.file) return res.status(400).json({error:'Fayl yoq'});
          const tgKey = process.env.TELEGRAM_BOT_TOKEN;
          const tgChat = process.env.TELEGRAM_STORAGE_CHAT_ID;
          if (!tgKey || !tgChat) return res.status(500).json({error:'Cloud sozlanmagan'});

          const formData = new FormData();
          formData.append('chat_id', tgChat);
          formData.append('document', req.file.buffer, { filename: req.file.originalname });

          // Safer fetch for different Node versions
          const nodeFetch = (await import('node-fetch').catch(() => ({} as any))).default || (globalThis as any).fetch;
          
          if (!nodeFetch) throw new Error("Fetch not found");

          const response = await nodeFetch(`https://api.telegram.org/bot${tgKey}/sendDocument`, {
              method: 'POST',
              body: formData
          });
          const json: any = await response.json();
          if (json.ok && json.result.document) {
              const fileId = json.result.document.file_id;
              return res.json({ file_id: fileId, url: `/api/media/${fileId}` });
          }
          res.status(500).json({ error: 'Telegram api error' });
      } catch (e) {
          console.error(e);
          res.status(500).json({ error: 'Media xatosi' });
      }
  });

  // 5. ADMIN API ENDPOINTS
  app.get('/api/admin/stats', (req, res) => {
    const db = getDb();
    res.json(db.stats);
  });

  app.get('/api/admin/mentors', (req, res) => {
    const db = getDb();
    res.json(db.mentors);
  });

  app.post('/api/admin/verify-mentor', (req, res) => {
    const { id, status } = req.body;
    const db = getDb();
    const mentor = db.mentors.find((m: any) => m.id === id);
    if (mentor) {
      mentor.status = status;
      saveDb(db);
      res.json({ success: true, mentor });
    } else {
      res.status(404).json({ error: 'Mentor not found' });
    }
  });

  app.post('/api/admin/action', (req, res) => {
    const { action, userId } = req.body;
    // Simulate complex logic
    console.log(`Admin action: ${action} on ${userId}`);
    res.json({ success: true, message: `Action ${action} completed` });
  });

  app.get('/api/admin/users', (req, res) => {
    const db = getDb();
    res.json(db.users);
  });

  // 7. USER QUIZZES
  app.post('/api/quizzes', (req, res) => {
    const quiz = req.body;
    const db = getDb();
    if (!db.userQuizzes) db.userQuizzes = [];
    
    // Check if exists
    const idx = db.userQuizzes.findIndex((q: any) => q.id === quiz.id);
    if (idx >= 0) {
      db.userQuizzes[idx] = quiz;
    } else {
      db.userQuizzes.push(quiz);
    }
    
    saveDb(db);
    res.json({ success: true });
  });

  app.get('/api/quizzes', (req, res) => {
    const db = getDb();
    res.json([...(db.officialQuizzes || []), ...(db.userQuizzes || [])]);
  });

  // 6. OFFICIAL SUBJECTS & QUIZZES
  app.get('/api/subjects', (req, res) => {
    const db = getDb();
    res.json(db.officialQuizzes || []);
  });

  app.post('/api/admin/add-official-quiz', (req, res) => {
    const { title, category, questions, icon } = req.body;
    const db = getDb();
    if (!db.officialQuizzes) db.officialQuizzes = [];
    
    const newQuiz = {
      id: Date.now().toString(),
      title,
      category,
      questions,
      icon: icon || '📚',
      questionsCount: questions.length,
      createdAt: new Date().toISOString()
    };
    
    db.officialQuizzes.push(newQuiz);
    saveDb(db);
    res.json({ success: true, quiz: newQuiz });
  });

  app.get('/api/daily-quiz', async (req, res) => {
    // Generate or fetch daily quiz
    const db = getDb();
    const today = new Date().toISOString().split('T')[0];
    
    if (db.dailyQuiz?.date === today) {
      return res.json(db.dailyQuiz.quiz);
    }
    
    const prompt = `Generate 10 randomized medium difficulty quiz questions on various general knowledge topics (science, history, tech, art). Return as JSON array [ { "text": "...", "options": ["...", "..."], "correctAnswer": index } ]. No markdown, just raw JSON.`;
    const reply = await callGroq([{ role: 'user', content: prompt }]);
    const questions = extractJSON(reply) || [];
    
    const dailyQuiz = {
      id: 'daily-' + today,
      title: 'Kunlik AI Challenge',
      category: 'daily',
      questions,
      questionsCount: questions.length,
      icon: '✨'
    };
    
    db.dailyQuiz = { date: today, quiz: dailyQuiz };
    saveDb(db);
    res.json(dailyQuiz);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://localhost:${PORT}`));
}

startServer();
