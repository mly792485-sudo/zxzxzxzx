import React, { useMemo, useState } from 'react';
import {
  BookOpen, CheckCircle2, ExternalLink, Headphones, Library, Play,
  RotateCcw, Trophy, Video, Volume2, Youtube,
} from 'lucide-react';
import { safeStorage } from '../utils/safeStorage';

type LibraryItem = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  source: string;
  url: string;
  kind: 'audio' | 'video' | 'reading';
};

const CATEGORIES = [
  { id: 'all', ar: 'الكل', en: 'All' },
  { id: 'podcast', ar: 'بودكاست ودروس', en: 'Podcasts & Lessons' },
  { id: 'quran', ar: 'تلاوات وقرآن', en: 'Quran Recitations' },
  { id: 'seerah', ar: 'السيرة والقصص', en: 'Seerah & Stories' },
  { id: 'fiqh', ar: 'فقه وتزكية', en: 'Fiqh & Spirituality' },
  { id: 'sources', ar: 'مصادر رسمية', en: 'Official Sources' },
  { id: 'quiz', ar: 'مسابقة القرآن', en: 'Quran Quiz' },
];

// External links are intentionally kept as official/public source pages.
// The app does not copy or redistribute recordings without a clear licence.
const ITEMS: LibraryItem[] = [
  { id: 'quran-radio', title: 'إذاعة القرآن الكريم', subtitle: 'تلاوات وبرامج قرآنية على مدار الساعة', category: 'quran', source: 'إذاعة القرآن الكريم — المملكة العربية السعودية', url: 'https://quran.saudiaudio.com/', kind: 'audio' },
  { id: 'quran-com', title: 'تلاوات القرآن الكريم', subtitle: 'قراءة واستماع وترجمات وتفاسير', category: 'quran', source: 'Quran.com', url: 'https://quran.com/', kind: 'reading' },
  { id: 'dorar', title: 'الموسوعة الحديثية', subtitle: 'البحث في الأحاديث وتخريجها ودرجتها', category: 'sources', source: 'الدرر السنية', url: 'https://dorar.net/hadith', kind: 'reading' },
  { id: 'bin-baz', title: 'فتاوى ودروس موثقة', subtitle: 'دروس وفتاوى من الموقع الرسمي', category: 'fiqh', source: 'موقع الشيخ ابن باز الرسمي', url: 'https://binbaz.org.sa/', kind: 'reading' },
  { id: 'islamweb', title: 'محاضرات ودروس إسلامية', subtitle: 'مكتبة صوتية ومقالات وبحوث شرعية', category: 'podcast', source: 'إسلام ويب', url: 'https://www.islamweb.net/ar/audios', kind: 'audio' },
  { id: 'altafsir', title: 'موسوعة التفسير', subtitle: 'تفاسير العلماء مع عرض الآية ومراجعها', category: 'sources', source: 'موقع Altafsir', url: 'https://www.altafsir.com/', kind: 'reading' },
  { id: 'youtube-quran', title: 'قناة القرآن الكريم', subtitle: 'بث مرئي من المصدر الرسمي', category: 'quran', source: 'قناة القرآن الكريم الرسمية', url: 'https://www.youtube.com/@qurantvsa', kind: 'video' },
  { id: 'podcast-search', title: 'استكشف برامج دينية موثوقة', subtitle: 'ابحث عن حلقات من المصدر الأصلي وتحقق من اسم الشيخ', category: 'podcast', source: 'Apple Podcasts', url: 'https://podcasts.apple.com/us/genre/podcasts-religion-spirituality/id1314', kind: 'audio' },
  { id: 'seerah', title: 'السيرة النبوية', subtitle: 'قراءة واستماع في أحداث السيرة والدروس المستفادة', category: 'seerah', source: 'مكتبة صيد الفوائد', url: 'https://saaid.org/seerah/', kind: 'reading' },
];

const QUESTIONS = [
  { q: 'ما السورة التي تُسمّى أم الكتاب؟', answers: ['الفاتحة', 'البقرة', 'الإخلاص'], correct: 0, ref: 'صحيح البخاري، كتاب التفسير، سورة الفاتحة' },
  { q: 'كم عدد أجزاء القرآن الكريم؟', answers: ['20 جزءًا', '30 جزءًا', '40 جزءًا'], correct: 1, ref: 'المعروف في تقسيم المصحف: ثلاثون جزءًا' },
  { q: 'في أي شهر أُنزل القرآن؟', answers: ['رمضان', 'شوال', 'محرم'], correct: 0, ref: 'سورة البقرة: 185' },
  { q: 'ما أطول سورة في القرآن الكريم؟', answers: ['آل عمران', 'النساء', 'البقرة'], correct: 2, ref: 'ترتيب سور المصحف وعدد آياته' },
  { q: 'ما السورة التي تعدل ثلث القرآن؟', answers: ['الفلق', 'الإخلاص', 'الناس'], correct: 1, ref: 'صحيح البخاري، كتاب فضائل القرآن، فضل قل هو الله أحد' },
];

export default function IslamicLibrarySection({ isEn = false }: { isEn?: boolean }) {
  const [category, setCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(safeStorage.getItem('noor_library_favorites') || '[]'); } catch { return []; }
  });
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const filteredItems = useMemo(() => category === 'all' || category === 'quiz'
    ? ITEMS
    : ITEMS.filter((item) => item.category === category), [category]);
  const question = QUESTIONS[quizIndex];

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    setFavorites(next);
    safeStorage.setItem('noor_library_favorites', JSON.stringify(next));
  };

  const answerQuiz = (answer: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    if (answer === question.correct) setScore((value) => value + 1);
  };

  const nextQuestion = () => {
    setQuizIndex((value) => (value + 1) % QUESTIONS.length);
    setSelectedAnswer(null);
  };

  const resetQuiz = () => { setQuizIndex(0); setSelectedAnswer(null); setScore(0); };

  return (
    <section className="w-full rounded-3xl border border-emerald-500/20 bg-white dark:bg-[#091B1F] p-4 sm:p-6 shadow-xl space-y-5" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="rounded-2xl bg-gradient-to-br from-emerald-950 via-[#0A2828] to-teal-900 p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-amber-400/15 p-3 text-amber-300"><Library className="h-7 w-7" /></div>
          <div>
            <h2 className="font-kufi text-xl font-black">{isEn ? 'Noor Islamic Library' : 'المكتبة الإسلامية'}</h2>
            <p className="mt-1 text-xs leading-6 text-emerald-100">{isEn ? 'Audio, lessons, Quran, references and a Quran challenge in one place.' : 'بودكاست وتلاوات ودروس ومراجع ومسابقات القرآن في قسم واحد مرتب.'}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px]">
          <div className="rounded-xl bg-white/10 p-2"><Headphones className="mx-auto mb-1 h-4 w-4 text-amber-300" />بودكاست</div>
          <div className="rounded-xl bg-white/10 p-2"><BookOpen className="mx-auto mb-1 h-4 w-4 text-amber-300" />قرآن وتفسير</div>
          <div className="rounded-xl bg-white/10 p-2"><Trophy className="mx-auto mb-1 h-4 w-4 text-amber-300" />مسابقات</div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((item) => (
          <button key={item.id} onClick={() => setCategory(item.id)} className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs font-bold transition ${category === item.id ? 'border-emerald-600 bg-emerald-700 text-white' : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'}`}>
            {isEn ? item.en : item.ar}
          </button>
        ))}
      </div>

      {category === 'quiz' ? (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-50 p-5 dark:bg-amber-950/20">
          <div className="mb-4 flex items-center justify-between"><span className="text-xs font-bold text-amber-700 dark:text-amber-300">{isEn ? `Question ${quizIndex + 1} of ${QUESTIONS.length}` : `السؤال ${quizIndex + 1} من ${QUESTIONS.length}`}</span><span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{isEn ? `Score: ${score}` : `النتيجة: ${score}`}</span></div>
          <h3 className="text-base font-black leading-8 text-slate-800 dark:text-slate-100">{question.q}</h3>
          <div className="mt-4 grid gap-2">{question.answers.map((answer, index) => <button key={answer} onClick={() => answerQuiz(index)} className={`rounded-xl border p-3 text-right text-sm font-bold transition ${selectedAnswer === null ? 'border-slate-200 bg-white hover:border-emerald-500 dark:border-slate-700 dark:bg-slate-900' : index === question.correct ? 'border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200' : selectedAnswer === index ? 'border-red-500 bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-200' : 'border-slate-200 bg-white opacity-70 dark:border-slate-700 dark:bg-slate-900'}`}>{answer}{selectedAnswer !== null && index === question.correct && <CheckCircle2 className="mr-2 inline h-4 w-4 text-emerald-600" />}</button>)}</div>
          {selectedAnswer !== null && <div className="mt-4 rounded-xl bg-white/70 p-3 text-xs leading-6 text-slate-600 dark:bg-slate-900/60 dark:text-slate-300"><strong>المصدر:</strong> {question.ref}</div>}
          <div className="mt-4 flex gap-2"><button onClick={nextQuestion} className="flex-1 rounded-xl bg-emerald-700 px-4 py-3 text-xs font-black text-white">{isEn ? 'Next question' : 'السؤال التالي'}</button><button onClick={resetQuiz} className="rounded-xl border border-slate-300 px-4 text-slate-600 dark:border-slate-700 dark:text-slate-300" title="إعادة المسابقة"><RotateCcw className="h-4 w-4" /></button></div>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filteredItems.map((item) => <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="flex items-start justify-between gap-3"><div className="flex items-start gap-3"><div className="rounded-xl bg-emerald-700/10 p-2 text-emerald-700 dark:text-emerald-300">{item.kind === 'audio' ? <Volume2 className="h-5 w-5" /> : item.kind === 'video' ? <Video className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}</div><div><h3 className="text-sm font-black text-slate-800 dark:text-slate-100">{item.title}</h3><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.subtitle}</p></div></div><button onClick={() => toggleFavorite(item.id)} className={`text-lg ${favorites.includes(item.id) ? 'text-amber-500' : 'text-slate-300'}`} aria-label="حفظ في المفضلة">★</button></div>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-200/70 pt-3 text-[10px] text-slate-500 dark:border-slate-800 dark:text-slate-400"><span className="truncate">{item.source}</span><a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-emerald-700 px-2.5 py-1.5 font-bold text-white"><Play className="h-3 w-3" />فتح المصدر <ExternalLink className="h-3 w-3" /></a></div>
          </article>)}
        </div>
      )}

      <div className="rounded-2xl border border-sky-500/20 bg-sky-50 p-4 text-xs leading-6 text-sky-900 dark:bg-sky-950/20 dark:text-sky-200"><strong>تنبيه الحقوق والمصادر:</strong> هذا القسم يفتح الصفحات الرسمية للمحتوى ولا ينسخ تسجيلات المشايخ أو يعيد توزيعها دون إذن. قبل إضافة التحميل دون إنترنت، يجب الحصول على ترخيص واضح لكل ملف صوتي.</div>
    </section>
  );
}
