import { Question, QuizSet, SubjectCategory } from '../types';
import { MasterBilingualItem } from '../data/questionPools/types';
import { 
  getBankingLawsSlot36, 
  getBankingLawsSlot37, 
  getBankingLawsSlot38, 
  getBankingLawsSlot39, 
  getBankingLawsSlot40 
} from '../data/questionPools/topic8BankingLaws';
import { 
  getEconomySlot11, 
  getEconomySlot12, 
  getEconomySlot13, 
  getEconomySlot14, 
  getEconomySlot15 
} from '../data/questionPools/topic3Economy';
import { 
  TOPIC_10_SLOT_46, 
  TOPIC_10_SLOT_47, 
  TOPIC_10_SLOT_48, 
  TOPIC_10_SLOT_49, 
  TOPIC_10_SLOT_50 
} from '../data/questionPools/topic10CurrentAffairs';
import { INITIAL_ARCHIVED_SETS } from '../data/dailyChallengeBank';
import { BANKING_SUITE_MCQS } from '../data/bankingSuiteMcqData';

export type DailyChallengeType = 'banking' | 'current_events' | 'mixed';

export interface DailyChallengeCategoryOption {
  id: DailyChallengeType;
  labelNepali: string;
  labelEnglish: string;
  badge: string;
  iconName: string;
  descriptionNepali: string;
  topics: string[];
}

export const DAILY_CHALLENGE_OPTIONS: DailyChallengeCategoryOption[] = [
  {
    id: 'banking',
    labelNepali: 'बैंकिङ आधारभूत तथा ऐन-कानुन',
    labelEnglish: 'Banking Fundamentals & Acts',
    badge: 'Banking Core',
    iconName: 'Building2',
    descriptionNepali: 'नेपाल राष्ट्र बैंक ऐन २०५८, बाफिया २०७३, सम्पत्ति शुद्धीकरण (AML/KYC), मौद्रिक नीति, लेखा तथा बैंकिङ सञ्चालनबाट २५ प्रश्नहरू।',
    topics: ['नेपाल राष्ट्र बैंक ऐन', 'बाफिया २०७३', 'AML/KYC', 'मौद्रिक नीति', 'लेखा तथा अनुपात']
  },
  {
    id: 'current_events',
    labelNepali: 'समसामयिक घटनाक्रम तथा परिदृश्य',
    labelEnglish: 'Current Events & Economic Affairs',
    badge: 'Current Affairs',
    iconName: 'Globe',
    descriptionNepali: 'आर्थिक सर्वेक्षण, संघीय बजेट, मौद्रिक नीति परिमार्जन, नयाँ नियुक्ति, पुरस्कार, सूचकांक तथा राष्ट्रिय-अन्तर्राष्ट्रिय समसामयिक २५ प्रश्नहरू।',
    topics: ['आर्थिक सर्वेक्षण', 'वार्षिक बजेट', 'समसामयिक नियुक्ति', 'अन्तर्राष्ट्रिय सूचक', 'पुरस्कार तथा खेलकुद']
  },
  {
    id: 'mixed',
    labelNepali: 'मिश्रित दैनिक सुपर चुनौती',
    labelEnglish: 'Mixed Daily Super Challenge',
    badge: '50-50 Mixed',
    iconName: 'Zap',
    descriptionNepali: '५०% बैंकिङ आधारभूत + ५०% समसामयिक विषयहरूको उत्कृष्ट सम्मिश्रण। वास्तविक लोक सेवा परीक्षा ढाँचामा २५ प्रश्नहरू।',
    topics: ['बैंकिङ कानुन', 'समसामयिक घटना', 'आर्थिक सूचक', 'संस्थागत सुशासन', 'नेगेटिभ मार्किङ']
  }
];

/**
 * Fisher-Yates array shuffle helper
 */
function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Converts a MasterBilingualItem into a standardized Question object
 */
function convertBilingualItemToQuestion(
  item: MasterBilingualItem, 
  id: string, 
  category: SubjectCategory,
  examTag: string,
  topic: string
): Question {
  const choices: { text: string; isCorrect: boolean }[] = [
    { text: item.correct, isCorrect: true },
    ...(item.distractors || []).slice(0, 3).map(d => ({ text: d, isCorrect: false }))
  ];

  // Randomize choices
  const shuffledChoices = shuffleArray(choices);
  const keys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  let correctAnswer: 'A' | 'B' | 'C' | 'D' = 'A';

  const options = shuffledChoices.map((c, idx) => {
    const key = keys[idx] || 'A';
    if (c.isCorrect) {
      correctAnswer = key;
    }
    return {
      key,
      textNepali: c.text,
      textEnglish: c.text
    };
  });

  return {
    id,
    category,
    difficulty: 'Medium',
    questionNepali: item.qNep,
    questionEnglish: item.qEng,
    options,
    correctAnswer,
    explanationNepali: item.expNep,
    actSection: item.actSection,
    examTip: item.expEng || 'लोक सेवा आयोग तथा बैंकिङ परीक्षाका लागि उच्च-उपयोगी प्रश्न।',
    examTag,
    topic
  };
}

/**
 * Collects a rich pool of Banking Fundamentals questions (500+ pool)
 */
function collectBankingFundamentalsPool(): Question[] {
  const questions: Question[] = [];

  // 1. Topic 8 Banking Laws (Slots 36 to 40, sets 1 to 50 = 250 questions)
  for (let s = 1; s <= 50; s++) {
    // Slot 36: NRB Act
    const q36 = getBankingLawsSlot36(s);
    questions.push(convertBilingualItemToQuestion(
      q36, 
      `banking-law-36-${s}`, 
      'Law', 
      'नेपाल राष्ट्र बैंक ऐन, २०५८', 
      'केन्द्रीय बैंक तथा मौद्रिक अधिकार'
    ));

    // Slot 37: BAFIA
    const q37 = getBankingLawsSlot37(s);
    questions.push(convertBilingualItemToQuestion(
      q37, 
      `banking-law-37-${s}`, 
      'Law', 
      'बाफिया (BAFIA) २०७३', 
      'बैंक तथा वित्तीय संस्था सम्बन्धी ऐन'
    ));

    // Slot 38: AML/KYC & Banking Offence
    const q38 = getBankingLawsSlot38(s);
    questions.push(convertBilingualItemToQuestion(
      q38, 
      `banking-law-38-${s}`, 
      'Banking', 
      'AML/KYC तथा बैंकिङ कसूर ऐन', 
      'सम्पत्ति शुद्धीकरण र बैंकिङ सुशासन'
    ));

    // Slot 39: Accounting & Auditing
    const q39 = getBankingLawsSlot39(s);
    questions.push(convertBilingualItemToQuestion(
      q39, 
      `banking-law-39-${s}`, 
      'Accounting', 
      'बैंकिङ लेखा तथा वित्तीय अनुपात', 
      'NFRS, वासलात र लेखापरीक्षण'
    ));

    // Slot 40: Negotiable Instruments & Banking Operations
    const q40 = getBankingLawsSlot40(s);
    questions.push(convertBilingualItemToQuestion(
      q40, 
      `banking-law-40-${s}`, 
      'Banking', 
      'बैंकिङ सञ्चालन तथा विनिमय पत्र', 
      'चेक, ड्राफ्ट र भुक्तानी प्रणाली'
    ));
  }

  // 2. Topic 3 Economy & Monetary Policy (Slots 11 to 15, sets 1 to 50 = 250 questions)
  for (let s = 1; s <= 50; s++) {
    const q11 = getEconomySlot11(s);
    questions.push(convertBilingualItemToQuestion(
      q11, 
      `banking-econ-11-${s}`, 
      'Economics', 
      'मौद्रिक नीति तथा ब्याजदर करिडोर', 
      'नीतिगत दर, CRR, SLR र तरलता'
    ));

    const q12 = getEconomySlot12(s);
    questions.push(convertBilingualItemToQuestion(
      q12, 
      `banking-econ-12-${s}`, 
      'Banking', 
      'पुँजी कोष तथा कर्जा व्यवस्थापन', 
      'CAR, CD Ratio, NPL र जोखिम व्यवस्थापन'
    ));

    const q13 = getEconomySlot13(s);
    questions.push(convertBilingualItemToQuestion(
      q13, 
      `banking-econ-13-${s}`, 
      'Economics', 
      'बजेट तथा वित्तीय नीति', 
      'आर्थिक वृद्धि तथा राजस्व संकलन'
    ));
  }

  // 3. Banking Suite MCQs (High-yield curated questions)
  BANKING_SUITE_MCQS.forEach((item, idx) => {
    const keys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
    const correctKey = keys[item.correctOptionIndex] || 'A';
    questions.push({
      id: `bs-mcq-${idx}-${item.id}`,
      category: 'Banking',
      difficulty: 'Medium',
      questionNepali: item.questionNe,
      questionEnglish: item.questionEn,
      options: item.optionsNe.map((opt, oIdx) => ({
        key: keys[oIdx] || 'A',
        textNepali: opt,
        textEnglish: item.optionsEn?.[oIdx] || opt
      })),
      correctAnswer: correctKey,
      explanationNepali: item.explanationNe,
      examTip: 'बैंकिङ परीक्षा विशेष नमुना प्रश्न',
      examTag: item.examTag || 'बैंकिङ आधारभूत',
      topic: 'वित्तीय विश्लेषण र बैंकिङ सिद्धान्त'
    });
  });

  return questions;
}

/**
 * Collects a rich pool of Current Events questions (300+ pool)
 */
function collectCurrentEventsPool(): Question[] {
  const questions: Question[] = [];

  // 1. Curated Historical & Today's Verified Sets from dailyChallengeBank
  INITIAL_ARCHIVED_SETS.forEach(set => {
    set.questions.forEach(mcq => {
      questions.push({
        id: `ca-bank-${mcq.id}`,
        category: 'Current Affairs',
        difficulty: mcq.difficulty || 'Medium',
        questionNepali: mcq.qNep,
        questionEnglish: mcq.qEng || '',
        options: mcq.options.map(opt => ({
          key: opt.key,
          textNepali: opt.text,
          textEnglish: opt.textEng || opt.text
        })),
        correctAnswer: mcq.correctAnswer,
        explanationNepali: mcq.explanationNep,
        examTip: mcq.sourceOrActRef || 'समसामयिक आर्थिक तथा बैंकिङ परिदृश्य',
        examTag: `समसामयिक • ${mcq.topicLabelNep || 'राष्ट्रिय घटना'}`,
        topic: mcq.topicLabelNep || 'समसामयिक'
      });
    });
  });

  // 2. Topic 10 Contemporary Affairs (Slots 46 to 50 = 250 questions)
  const slotArrays = [
    { items: TOPIC_10_SLOT_46, tag: 'पूर्वाधार, जनगणना र संवैधानिक मिति' },
    { items: TOPIC_10_SLOT_47, tag: 'आर्थिक सर्वेक्षण तथा बजेट सूचक' },
    { items: TOPIC_10_SLOT_48, tag: 'राष्ट्रिय तथा अन्तर्राष्ट्रिय पुरस्कार' },
    { items: TOPIC_10_SLOT_49, tag: 'खेलकुद, ओलम्पिक र पारालम्पिक' },
    { items: TOPIC_10_SLOT_50, tag: 'अन्तर्राष्ट्रिय सूचकांक तथा संस्था' }
  ];

  slotArrays.forEach((slot, sIdx) => {
    slot.items.forEach((item, iIdx) => {
      questions.push(convertBilingualItemToQuestion(
        item,
        `ca-slot-${sIdx + 46}-${iIdx + 1}`,
        'Current Affairs',
        `समसामयिक • ${slot.tag}`,
        slot.tag
      ));
    });
  });

  return questions;
}

// In-memory cached question pools
let cachedBankingPool: Question[] | null = null;
let cachedCurrentEventsPool: Question[] | null = null;

function getBankingPool(): Question[] {
  if (!cachedBankingPool || cachedBankingPool.length === 0) {
    cachedBankingPool = collectBankingFundamentalsPool();
  }
  return cachedBankingPool;
}

function getCurrentEventsPool(): Question[] {
  if (!cachedCurrentEventsPool || cachedCurrentEventsPool.length === 0) {
    cachedCurrentEventsPool = collectCurrentEventsPool();
  }
  return cachedCurrentEventsPool;
}

/**
 * Generates a randomized 25-question QuizSet for the Daily Challenge
 */
export function generateDailyChallengeQuiz(
  type: DailyChallengeType = 'banking',
  count: number = 25
): QuizSet {
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const timestamp = Date.now();

  let selectedQuestions: Question[] = [];

  if (type === 'banking') {
    const pool = shuffleArray(getBankingPool());
    selectedQuestions = pool.slice(0, count);
  } else if (type === 'current_events') {
    const pool = shuffleArray(getCurrentEventsPool());
    selectedQuestions = pool.slice(0, count);
  } else {
    // Mixed: 13 Banking Fundamentals + 12 Current Events
    const bankingPool = shuffleArray(getBankingPool());
    const caPool = shuffleArray(getCurrentEventsPool());
    const bPart = bankingPool.slice(0, 13);
    const caPart = caPool.slice(0, 12);
    selectedQuestions = shuffleArray([...bPart, ...caPart]);
  }

  // Fallback safeguard to guarantee exact count
  if (selectedQuestions.length < count) {
    const all = shuffleArray([...getBankingPool(), ...getCurrentEventsPool()]);
    selectedQuestions = all.slice(0, count);
  }

  const titles: Record<DailyChallengeType, { title: string; desc: string; category: SubjectCategory }> = {
    banking: {
      title: 'दैनिक २५ प्रश्न: बैंकिङ आधारभूत तथा ऐन-कानुन (Banking Fundamentals 25 MCQ)',
      desc: 'नेपाल राष्ट्र बैंक ऐन २०५८, बाफिया २०७३, सम्पत्ति शुद्धीकरण (AML), मौद्रिक नीति, लेखा तथा बैंकिङ सञ्चालन सम्बन्धी २५ बहुवैकल्पिक प्रश्नहरू (पूर्णाङ्क: २५, समय: १५ मिनेट, -२०% नेगेटिभ मार्किङ)।',
      category: 'Banking'
    },
    current_events: {
      title: 'दैनिक २५ प्रश्न: समसामयिक घटनाक्रम तथा परिदृश्य (Current Events 25 MCQ)',
      desc: 'आर्थिक सर्वेक्षण, संघीय बजेट, मौद्रिक समीक्षा, नयाँ नियुक्ति, अन्तर्राष्ट्रिय सूचकांक तथा पछिल्ला घटनाक्रमहरूबाट २५ बहुवैकल्पिक प्रश्नहरू (पूर्णाङ्क: २५, समय: १५ मिनेट, -२०% नेगेटिभ मार्किङ)।',
      category: 'Current Affairs'
    },
    mixed: {
      title: 'दैनिक २५ प्रश्न: समसामयिक र बैंकिङ संयुक्त चुनौती (Mixed Super 25 MCQ)',
      desc: '५०% बैंकिङ आधारभूत + ५०% समसामयिक विषयहरूको सन्तुलित २५ प्रश्नहरूको दैनिक चुनौती (पूर्णाङ्क: २५, समय: १५ मिनेट, -२०% नेगेटिभ मार्किङ)।',
      category: 'Banking'
    }
  };

  const meta = titles[type];

  return {
    id: `daily-challenge-${type}-${todayDateStr}-${timestamp}`,
    title: meta.title,
    description: meta.desc,
    category: meta.category,
    difficulty: 'Medium',
    mode: 'daily',
    timeLimitMinutes: 15,
    questions: selectedQuestions,
    badge: 'Daily 25 MCQ',
    syllabusModule: type === 'current_events' ? 'current-affairs' : 'banking-acts-regulations'
  };
}

/**
 * Formats current date nicely into Nepali
 */
export function getTodayNepaliDisplayDate(): string {
  try {
    const now = new Date();
    const monthsNep = [
      'जनवरी', 'फेब्रुअरी', 'मार्च', 'अप्रिल', 'मे', 'जुन',
      'जुलाई', 'अगस्ट', 'सेप्टेम्बर', 'अक्टोबर', 'नोभेम्बर', 'डिसेम्बर'
    ];
    const day = now.getDate();
    const month = monthsNep[now.getMonth()];
    const year = now.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return 'आजको दैनिक सेट';
  }
}
