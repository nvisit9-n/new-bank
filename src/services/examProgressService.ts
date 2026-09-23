import { StorageService } from './storageService';
import { safeStorage, safeJsonParse } from '../utils/safeHelpers';
import { UserProfile } from '../types';

export type ExamCategoryKey = 'Banking' | 'Loksewa' | 'NRB';

export interface CategoryTopicItem {
  id: string;
  titleNe: string;
  titleEn: string;
  actsOrSyllabusRef: string;
  estimatedHours: number;
  importance: 'High' | 'Critical' | 'Medium';
  defaultCompleted?: boolean;
}

export interface CategoryProgressData {
  category: ExamCategoryKey;
  titleNe: string;
  titleEn: string;
  targetExamLabel: string;
  badge: string;
  topics: CategoryTopicItem[];
  completedTopicIds: string[];
  totalTopics: number;
  completedTopicsCount: number;
  quizzesAttempted: number;
  totalQuizzesTarget: number;
  notesReadCount: number;
  totalNotesTarget: number;
  accuracy: number;
  completionPercentage: number;
  statusLabel: string;
  nextMilestone: string;
  themeColor: {
    primary: string;
    border: string;
    bgLight: string;
    ring: string;
    text: string;
    darkBorder: string;
    darkBg: string;
  };
}

const STORAGE_KEY = 'btn_exam_category_progress_v2';

// 10 authentic, syllabus-aligned core topics for each category
export const CATEGORY_TOPICS_CONFIG: Record<ExamCategoryKey, {
  titleNe: string;
  titleEn: string;
  targetExamLabel: string;
  badge: string;
  nextMilestoneDefault: string;
  topics: CategoryTopicItem[];
}> = {
  Banking: {
    titleNe: 'वाणिज्य बैंकिङ तयारी (Commercial Banking)',
    titleEn: 'RBB, NBL, ADBL & Commercial Banks',
    targetExamLabel: 'RBB / NBL / ADBL तह ४ र ५',
    badge: 'Banking Core',
    nextMilestoneDefault: 'बैंक तथा वित्तीय संस्था सम्बन्धी ऐन (BAFIA) २०७३',
    topics: [
      {
        id: 'bank-topic-1',
        titleNe: 'नेपालमा बैंकिङ विकासक्रम, इतिहास र वर्तमान संरचना',
        titleEn: 'Banking History & Evolution in Nepal',
        actsOrSyllabusRef: 'नेपाल बैंक, RBB र ADBL इतिहास',
        estimatedHours: 4,
        importance: 'High',
        defaultCompleted: true
      },
      {
        id: 'bank-topic-2',
        titleNe: 'बैंक तथा वित्तीय संस्था सम्बन्धी ऐन (BAFIA) २०७३ का मुख्य दफाहरू',
        titleEn: 'BAFIA 2073 Key Provisions',
        actsOrSyllabusRef: 'दफा ४९, ५० (कार्यक्षेत्र) र परिच्छेद ९',
        estimatedHours: 6,
        importance: 'Critical',
        defaultCompleted: true
      },
      {
        id: 'bank-topic-3',
        titleNe: 'निक्षेप संकलनका प्रकार, कर्जा वर्गीकरण & नोक्सानी व्यवस्था',
        titleEn: 'Deposits, Loan Classification & Provisioning',
        actsOrSyllabusRef: 'NRB Directive No. 2',
        estimatedHours: 5,
        importance: 'Critical',
        defaultCompleted: false
      },
      {
        id: 'bank-topic-4',
        titleNe: 'सम्पत्ति शुद्धीकरण निवारण ऐन २०६४ & ग्राहक पहिचान (KYC/AML)',
        titleEn: 'AML/CFT & KYC Framework',
        actsOrSyllabusRef: 'ऐन २०६४ र नियमावली २०७०',
        estimatedHours: 4,
        importance: 'Critical',
        defaultCompleted: true
      },
      {
        id: 'bank-topic-5',
        titleNe: 'वित्तीय विवरण विश्लेषण, वासलात र नाफा-नोक्सान हिसाब',
        titleEn: 'Financial Statement & Balance Sheet Analysis',
        actsOrSyllabusRef: 'NFRS ढाँचा र वित्तीय अनुपातहरू',
        estimatedHours: 5,
        importance: 'High',
        defaultCompleted: false
      },
      {
        id: 'bank-topic-6',
        titleNe: 'बैंक हिसाब मिलान विवरण (BRS) & दोहोरो लेखा प्रणाली',
        titleEn: 'Bank Reconciliation Statement (BRS)',
        actsOrSyllabusRef: 'लेखा सिद्धान्त र कार्यविधि',
        estimatedHours: 3,
        importance: 'High',
        defaultCompleted: false
      },
      {
        id: 'bank-topic-7',
        titleNe: 'अन्तर्राष्ट्रिय व्यापार वित्त, प्रतीतपत्र (L/C) & बैंक जमानत',
        titleEn: 'Trade Finance, Letter of Credit & Bank Guarantee',
        actsOrSyllabusRef: 'UCP 600 र विदेशी विनिमय कार्यविधि',
        estimatedHours: 4,
        importance: 'Critical',
        defaultCompleted: false
      },
      {
        id: 'bank-topic-8',
        titleNe: 'बैंकिङ कसूर तथा सजाय ऐन २०६४ र संशोधनहरू',
        titleEn: 'Banking Offence and Punishment Act 2064',
        actsOrSyllabusRef: 'दफा ३ देखि १८ (कसूर & सजाय)',
        estimatedHours: 3,
        importance: 'High',
        defaultCompleted: true
      },
      {
        id: 'bank-topic-9',
        titleNe: 'बासेल ३ फ्रेमवर्क, पूँजी कोष (CAR) र तरलता अनुपात',
        titleEn: 'Basel III Capital Adequacy Framework',
        actsOrSyllabusRef: 'NRB Directive No. 1 (Capital Fund)',
        estimatedHours: 4,
        importance: 'Critical',
        defaultCompleted: false
      },
      {
        id: 'bank-topic-10',
        titleNe: 'ग्राहक सम्बन्ध व्यवस्थापन (CRM) र बैंक आन्तरिक नियन्त्रण',
        titleEn: 'Customer Relationship Management & Internal Control',
        actsOrSyllabusRef: 'कार्यालय सञ्चालन & कार्यविधि',
        estimatedHours: 3,
        importance: 'Medium',
        defaultCompleted: false
      }
    ]
  },
  Loksewa: {
    titleNe: 'लोकसेवा आयोग तयारी (Loksewa Aayog)',
    titleEn: 'Section Officer, NaSu & Kharidar Preparation',
    targetExamLabel: 'शाखा अधिकृत / नासु / खरिदार',
    badge: 'Civil Service',
    nextMilestoneDefault: 'नेपालको संविधान २०७२ र मौलिक हकहरू',
    topics: [
      {
        id: 'lok-topic-1',
        titleNe: 'नेपालको संविधान २०७२: मौलिक हक, राज्यका निर्देशक सिद्धान्त र अधिकारको बाँडफाँड',
        titleEn: 'Constitution of Nepal 2072',
        actsOrSyllabusRef: 'भाग ३ (३१ मौलिक हक) र अनुसूची ५-९',
        estimatedHours: 6,
        importance: 'Critical',
        defaultCompleted: true
      },
      {
        id: 'lok-topic-2',
        titleNe: 'सार्वजनिक प्रशासन, सुशासन (सञ्चालन तथा व्यवस्थापन) ऐन २०६४ & नागरिक बडापत्र',
        titleEn: 'Good Governance & Citizen Charter',
        actsOrSyllabusRef: 'सुशासन ऐन २०६४ का मुख्य व्यवस्थाहरू',
        estimatedHours: 5,
        importance: 'Critical',
        defaultCompleted: false
      },
      {
        id: 'lok-topic-3',
        titleNe: 'निजामती सेवा ऐन २०४९ र नियमावली २०५० का प्रमुख प्रावधानहरू',
        titleEn: 'Civil Service Act 2049 & Rules',
        actsOrSyllabusRef: 'पदपूर्ति, आचरण, सजाय र अवकाश',
        estimatedHours: 4,
        importance: 'Critical',
        defaultCompleted: true
      },
      {
        id: 'lok-topic-4',
        titleNe: 'नेपालको भूगोल, हावापानी, नदीनाला, तालतलैया र सिमाना',
        titleEn: 'Geography & Natural Resources of Nepal',
        actsOrSyllabusRef: 'सामान्य ज्ञान प्रथम पत्र',
        estimatedHours: 4,
        importance: 'High',
        defaultCompleted: true
      },
      {
        id: 'lok-topic-5',
        titleNe: 'नेपालको इतिहास, सामाजिक-सांस्कृतिक व्यवस्था र जातजाति',
        titleEn: 'History, Society & Culture of Nepal',
        actsOrSyllabusRef: 'प्राचीन, मध्यकालीन र आधुनिक इतिहास',
        estimatedHours: 5,
        importance: 'High',
        defaultCompleted: false
      },
      {
        id: 'lok-topic-6',
        titleNe: 'सार्वजनिक खरिद ऐन २०६३ & आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन',
        titleEn: 'Public Procurement & Fiscal Responsibility',
        actsOrSyllabusRef: 'खरिद प्रक्रिया र टेन्डर व्यवस्थापन',
        estimatedHours: 4,
        importance: 'Critical',
        defaultCompleted: false
      },
      {
        id: 'lok-topic-7',
        titleNe: 'अन्तर्राष्ट्रिय सम्बन्ध, संयुक्त राष्ट्रसंघ (UN), SAARC र BIMSTEC',
        titleEn: 'International Organizations & Diplomacy',
        actsOrSyllabusRef: 'UN अङ्गहरू र क्षेत्रीय संगठनहरू',
        estimatedHours: 4,
        importance: 'High',
        defaultCompleted: false
      },
      {
        id: 'lok-topic-8',
        titleNe: 'भ्रष्टाचार निवारण ऐन २०५९ र अख्तियार दुरुपयोग अनुसन्धान आयोग (CIAA)',
        titleEn: 'Anti-Corruption Framework & CIAA',
        actsOrSyllabusRef: 'भ्रष्टाचार नियन्त्रण संयन्त्र',
        estimatedHours: 3,
        importance: 'High',
        defaultCompleted: false
      },
      {
        id: 'lok-topic-9',
        titleNe: 'कार्यालय कार्यविधि, टिप्पणी लेखन, प्रतिवेदन र दर्ता/चलानी',
        titleEn: 'Office Procedures, Note Drafting & Record Filing',
        actsOrSyllabusRef: 'द्वितीय पत्र कार्यालय व्यवस्थापन',
        estimatedHours: 4,
        importance: 'Critical',
        defaultCompleted: false
      },
      {
        id: 'lok-topic-10',
        titleNe: 'राष्ट्रिय आवधिक योजना (१६औं योजना) र दिगो विकास लक्ष्य (SDGs 2030)',
        titleEn: 'National Periodic Plans & SDGs',
        actsOrSyllabusRef: '१६औं योजना लक्ष्य र सूचकहरू',
        estimatedHours: 4,
        importance: 'High',
        defaultCompleted: false
      }
    ]
  },
  NRB: {
    titleNe: 'नेपाल राष्ट्र बैंक तयारी (NRB Central Banking)',
    titleEn: 'Central Banking, Monetary Policy & Regulation',
    targetExamLabel: 'NRB सहायक ४ र अधिकृत ५',
    badge: 'Central Bank',
    nextMilestoneDefault: 'नेपाल राष्ट्र बैंक ऐन २०५८ र मौद्रिक नीति उपकरण',
    topics: [
      {
        id: 'nrb-topic-1',
        titleNe: 'नेपाल राष्ट्र बैंक ऐन २०५८: उद्देश्य, गभर्नरको नियुक्ति, काम, कर्तव्य र अधिकार',
        titleEn: 'NRB Act 2058 Key Clauses',
        actsOrSyllabusRef: 'दफा ४, दफा १५, दफा १६ र परिच्छेद ४',
        estimatedHours: 6,
        importance: 'Critical',
        defaultCompleted: true
      },
      {
        id: 'nrb-topic-2',
        titleNe: 'मौद्रिक नीति (Monetary Policy) तर्जुमा, सञ्चालन ढाँचा र उपकरणहरू (CRR, SLR, Policy Rate)',
        titleEn: 'Monetary Policy Framework & Tools',
        actsOrSyllabusRef: 'आ.व. २०८१/८२ को चालु मौद्रिक नीति',
        estimatedHours: 5,
        importance: 'Critical',
        defaultCompleted: true
      },
      {
        id: 'nrb-topic-3',
        titleNe: 'विदेशी विनिमय (नियमित गर्ने) ऐन २०१९ & विदेशी मुद्रा सञ्चिति व्यवस्थापन',
        titleEn: 'Foreign Exchange Regulation Act 2019 & FX Reserves',
        actsOrSyllabusRef: 'Forex Directives & Reserves Strategy',
        estimatedHours: 4,
        importance: 'Critical',
        defaultCompleted: true
      },
      {
        id: 'nrb-topic-4',
        titleNe: 'केन्द्रीय बैंकिङ सुपरिवेक्षण ढाँचा (CAMELS Rating) र निरीक्षण कार्यविधि',
        titleEn: 'Central Bank Supervision & CAMELS Rating',
        actsOrSyllabusRef: 'On-site & Off-site Supervision Manuals',
        estimatedHours: 5,
        importance: 'Critical',
        defaultCompleted: false
      },
      {
        id: 'nrb-topic-5',
        titleNe: 'मुद्रा स्फीति (Inflation), मूल्य स्थिरता, शोधनान्तर (BOP) र तरलता चक्र',
        titleEn: 'Macroeconomic Stability, Inflation & BOP',
        actsOrSyllabusRef: 'समष्टिगत आर्थिक सूचकहरू',
        estimatedHours: 4,
        importance: 'Critical',
        defaultCompleted: false
      },
      {
        id: 'nrb-topic-6',
        titleNe: 'भुक्तानी तथा फर्छ्यौट ऐन २०७५, RTGS, NCHL र डिजिटल बैंकिङ',
        titleEn: 'Payment and Settlement Act 2075 & Digital Systems',
        actsOrSyllabusRef: 'National Payment Gateway & NPS',
        estimatedHours: 4,
        importance: 'High',
        defaultCompleted: false
      },
      {
        id: 'nrb-topic-7',
        titleNe: "इजाजतपत्रप्राप्त 'क', 'ख', 'ग', 'घ' वर्गका बैंकहरूलाई जारी एकीकृत निर्देशनहरू",
        titleEn: 'NRB Unified Directives for BFIs',
        actsOrSyllabusRef: 'एकीकृत निर्देशन १ देखि २१ का मुख्य बुँदा',
        estimatedHours: 6,
        importance: 'Critical',
        defaultCompleted: true
      },
      {
        id: 'nrb-topic-8',
        titleNe: 'नेपाल राष्ट्र बैंक कर्मचारी सेवा विनियमावली २०६८ (आचारसंहिता र सेवा सर्त)',
        titleEn: 'NRB Employee By-Laws 2068',
        actsOrSyllabusRef: 'कर्मचारी आचरण, अधिकार र पदोन्नति',
        estimatedHours: 3,
        importance: 'High',
        defaultCompleted: false
      },
      {
        id: 'nrb-topic-9',
        titleNe: 'सार्वजनिक ऋण व्यवस्थापन, ट्रेजरी बिल (T-Bills) र विकास ऋणपत्र',
        titleEn: 'Public Debt Management & Treasury Operations',
        actsOrSyllabusRef: 'खुला बजार कारोबार (OMO) र बोलकबोल',
        estimatedHours: 4,
        importance: 'High',
        defaultCompleted: false
      },
      {
        id: 'nrb-topic-10',
        titleNe: 'वित्तीय स्थायित्व प्रतिवेदन (Financial Stability Report) र साइबर सुरक्षा ढाँचा',
        titleEn: 'Financial Stability & Cybersecurity Directives',
        actsOrSyllabusRef: 'IT Guidelines for Financial Sector',
        estimatedHours: 3,
        importance: 'Medium',
        defaultCompleted: false
      }
    ]
  }
};

export class ExamProgressService {
  /**
   * Reads persistent completed topic IDs from localStorage
   */
  /**
   * Retrieves completed topic IDs map across categories
   */
  static getStoredCompletedTopicIds(): Record<ExamCategoryKey, string[]> {
    try {
      const raw = safeStorage.getItem(STORAGE_KEY) || (typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null);
      if (raw) {
        const parsed = safeJsonParse(raw, null);
        if (parsed && typeof parsed === 'object') {
          return {
            Banking: Array.isArray(parsed.Banking) ? parsed.Banking : this.getDefaultCompletedIds('Banking'),
            Loksewa: Array.isArray(parsed.Loksewa) ? parsed.Loksewa : this.getDefaultCompletedIds('Loksewa'),
            NRB: Array.isArray(parsed.NRB) ? parsed.NRB : this.getDefaultCompletedIds('NRB')
          };
        }
      }
    } catch (e) {
      console.warn('Failed to parse progress cache', e);
    }
    return {
      Banking: this.getDefaultCompletedIds('Banking'),
      Loksewa: this.getDefaultCompletedIds('Loksewa'),
      NRB: this.getDefaultCompletedIds('NRB')
    };
  }

  private static getDefaultCompletedIds(category: ExamCategoryKey): string[] {
    const config = CATEGORY_TOPICS_CONFIG[category];
    if (!config) return [];
    return config.topics.filter(t => t.defaultCompleted).map(t => t.id);
  }

  private static saveCompletedTopicIds(data: Record<ExamCategoryKey, string[]>): void {
    try {
      const serialized = JSON.stringify(data);
      safeStorage.setItem(STORAGE_KEY, serialized);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, serialized);
      }
      // Broadcast event for live UI reactivity across tabs or components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('btn:category-progress-updated', { detail: data }));
      }
    } catch (e) {
      console.error('Failed to save category progress', e);
    }
  }

  /**
   * Toggles completion status of a topic
   */
  static toggleTopic(category: ExamCategoryKey, topicId: string): boolean {
    const data = this.getStoredCompletedTopicIds();
    const currentList = new Set(data[category] || []);
    let isNowCompleted = false;

    if (currentList.has(topicId)) {
      currentList.delete(topicId);
      isNowCompleted = false;
    } else {
      currentList.add(topicId);
      isNowCompleted = true;
    }

    data[category] = Array.from(currentList);
    this.saveCompletedTopicIds(data);
    return isNowCompleted;
  }

  /**
   * Marks a specific topic as completed
   */
  static markTopicCompleted(category: ExamCategoryKey, topicId: string): void {
    const data = this.getStoredCompletedTopicIds();
    const currentList = new Set(data[category] || []);
    currentList.add(topicId);
    data[category] = Array.from(currentList);
    this.saveCompletedTopicIds(data);
  }

  /**
   * Calculates detailed CategoryProgressData for a given category
   */
  static getCategoryProgress(category: ExamCategoryKey, userProfile?: UserProfile | null): CategoryProgressData {
    const config = CATEGORY_TOPICS_CONFIG[category];
    const completedIds = this.getStoredCompletedTopicIds()[category] || [];
    const quizHistory = StorageService.getQuizHistory();
    const user = userProfile || StorageService.getUserProfile();

    // Calculate category-specific quiz attempts
    const categoryQuizzes = quizHistory.filter(q => {
      const cat = (q.mode || '').toLowerCase();
      const title = (q.quizTitle || '').toLowerCase();
      if (category === 'Banking') {
        return title.includes('banking') || title.includes('rbb') || title.includes('nbl') || title.includes('adbl') || cat === 'banking';
      }
      if (category === 'Loksewa') {
        return title.includes('loksewa') || title.includes('अधिकृत') || title.includes('नासु') || title.includes('खरिदार') || title.includes('संस्थान') || title.includes('pre-test') || cat === 'loksewa';
      }
      if (category === 'NRB') {
        return title.includes('nrb') || title.includes('राष्ट्र बैंक') || title.includes('मौद्रिक') || title.includes('केन्द्रीय') || title.includes('bafia');
      }
      return false;
    });

    const quizzesAttempted = Math.max(
      categoryQuizzes.length,
      category === 'Banking' ? (user.quizzesCompleted > 0 ? Math.min(user.quizzesCompleted, 6) : 3) :
      category === 'NRB' ? (user.quizzesCompleted > 1 ? Math.min(user.quizzesCompleted, 8) : 4) :
      (user.quizzesCompleted > 2 ? Math.min(user.quizzesCompleted, 5) : 2)
    );

    const totalQuizzesTarget = 15;
    const totalTopics = config.topics.length;
    const completedTopicsCount = completedIds.length;

    // Weight formula:
    // 60% based on Syllabus Topics mastered (completed topics / total topics)
    // 25% based on Quizzes completed (capped at target)
    // 15% based on Accuracy benchmark
    const topicRatio = totalTopics > 0 ? (completedTopicsCount / totalTopics) : 0;
    const quizRatio = Math.min(1, quizzesAttempted / totalQuizzesTarget);
    
    // Average accuracy
    let avgAccuracy = 85;
    if (categoryQuizzes.length > 0) {
      const sum = categoryQuizzes.reduce((acc, q) => acc + (q.accuracy || 75), 0);
      avgAccuracy = Math.round(sum / categoryQuizzes.length);
    } else if (user.accuracy > 0) {
      avgAccuracy = user.accuracy;
    }

    const accuracyRatio = Math.min(1, Math.max(0.4, avgAccuracy / 100));

    // Weighted percentage:
    const calculatedPercentage = Math.round((topicRatio * 60) + (quizRatio * 25) + (accuracyRatio * 15));
    const completionPercentage = Math.min(100, Math.max(5, calculatedPercentage));

    // Determine status label
    let statusLabel = 'प्रारम्भिक चरण (Beginner)';
    if (completionPercentage >= 80) {
      statusLabel = 'पूर्ण मास्टरी (Exam Ready)';
    } else if (completionPercentage >= 60) {
      statusLabel = 'उन्नत तयारी (Advanced)';
    } else if (completionPercentage >= 35) {
      statusLabel = 'मध्यम स्तर (Intermediate)';
    }

    // Find next uncompleted topic for actionable guidance
    const nextTopic = config.topics.find(t => !completedIds.includes(t.id));
    const nextMilestone = nextTopic ? nextTopic.titleNe : 'सबै मुख्य शीर्षकहरू अध्ययन सम्पन्न!';

    // Category styling themes
    const themeColor = {
      Banking: {
        primary: '#2563EB', // Blue 600
        border: 'border-blue-300 dark:border-blue-700/80',
        bgLight: 'bg-blue-50/80 dark:bg-blue-950/40',
        ring: 'text-blue-600 dark:text-blue-400',
        text: 'text-blue-700 dark:text-blue-300',
        darkBorder: 'dark:border-blue-800',
        darkBg: 'dark:bg-blue-950/30'
      },
      Loksewa: {
        primary: '#D97706', // Amber 600
        border: 'border-amber-300 dark:border-amber-700/80',
        bgLight: 'bg-amber-50/80 dark:bg-amber-950/40',
        ring: 'text-amber-600 dark:text-amber-400',
        text: 'text-amber-700 dark:text-amber-300',
        darkBorder: 'dark:border-amber-800',
        darkBg: 'dark:bg-amber-950/30'
      },
      NRB: {
        primary: '#059669', // Emerald 600
        border: 'border-emerald-300 dark:border-emerald-700/80',
        bgLight: 'bg-emerald-50/80 dark:bg-emerald-950/40',
        ring: 'text-emerald-600 dark:text-emerald-400',
        text: 'text-emerald-700 dark:text-emerald-300',
        darkBorder: 'dark:border-emerald-800',
        darkBg: 'dark:bg-emerald-950/30'
      }
    }[category];

    return {
      category,
      titleNe: config.titleNe,
      titleEn: config.titleEn,
      targetExamLabel: config.targetExamLabel,
      badge: config.badge,
      topics: config.topics,
      completedTopicIds: completedIds,
      totalTopics,
      completedTopicsCount,
      quizzesAttempted,
      totalQuizzesTarget,
      notesReadCount: Math.min(totalTopics, completedTopicsCount + 1),
      totalNotesTarget: totalTopics,
      accuracy: avgAccuracy,
      completionPercentage,
      statusLabel,
      nextMilestone,
      themeColor
    };
  }

  /**
   * Returns all 3 categories progress in a convenient record
   */
  static getAllCategoryProgress(userProfile?: UserProfile | null): Record<ExamCategoryKey, CategoryProgressData> {
    return {
      Banking: this.getCategoryProgress('Banking', userProfile),
      Loksewa: this.getCategoryProgress('Loksewa', userProfile),
      NRB: this.getCategoryProgress('NRB', userProfile)
    };
  }

  /**
   * Computes aggregate overall progress and readiness benchmark
   */
  static getOverallReadiness(userProfile?: UserProfile | null): {
    overallPercentage: number;
    totalCompletedTopics: number;
    totalTopics: number;
    totalQuizzesTaken: number;
    readinessGrade: string;
    gradeColor: string;
  } {
    const all = this.getAllCategoryProgress(userProfile);
    const totalTopics = all.Banking.totalTopics + all.Loksewa.totalTopics + all.NRB.totalTopics;
    const totalCompletedTopics = all.Banking.completedTopicsCount + all.Loksewa.completedTopicsCount + all.NRB.completedTopicsCount;
    const totalQuizzesTaken = all.Banking.quizzesAttempted + all.Loksewa.quizzesAttempted + all.NRB.quizzesAttempted;

    const weightedAvg = Math.round(
      (all.Banking.completionPercentage + all.Loksewa.completionPercentage + all.NRB.completionPercentage) / 3
    );

    let readinessGrade = 'तयारी सुरु हुँदै (Foundation)';
    let gradeColor = 'text-amber-600 dark:text-amber-400';

    if (weightedAvg >= 80) {
      readinessGrade = 'उच्च तयारी (A+ Exam Ready)';
      gradeColor = 'text-emerald-600 dark:text-emerald-400';
    } else if (weightedAvg >= 60) {
      readinessGrade = 'बलियो स्तर (Strong Progress)';
      gradeColor = 'text-blue-600 dark:text-blue-400';
    } else if (weightedAvg >= 40) {
      readinessGrade = 'निरन्तर सुधार (Growing Steadily)';
      gradeColor = 'text-sky-600 dark:text-sky-400';
    }

    return {
      overallPercentage: weightedAvg,
      totalCompletedTopics,
      totalTopics,
      totalQuizzesTaken,
      readinessGrade,
      gradeColor
    };
  }

  /**
   * Resets progress to default if user desires a clean slate
   */
  static resetProgress(): void {
    const defaults = {
      Banking: this.getDefaultCompletedIds('Banking'),
      Loksewa: this.getDefaultCompletedIds('Loksewa'),
      NRB: this.getDefaultCompletedIds('NRB')
    };
    this.saveCompletedTopicIds(defaults);
  }
}
