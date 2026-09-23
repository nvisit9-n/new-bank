import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  TrendingUp, 
  Building2, 
  Landmark, 
  Scale, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Target, 
  FileText, 
  RotateCcw,
  Compass,
  Zap,
  Award,
  ChevronRight,
  ShieldCheck,
  CloudCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExamProgressService, ExamCategoryKey } from '../../services/examProgressService';
import { DbService } from '../../services/dbService';
import { FirebaseSyncService } from '../../services/firebaseSyncService';
import { getQuestionsByCategory, convertQuizQuestionToQuestion } from '../../data/quizData';
import { QuizSet } from '../../types';

export type SupportedExamId = 'nrb' | 'rbb' | 'adbl' | 'nbl' | 'loksewa';

interface ExamConfig {
  id: SupportedExamId;
  nameNe: string;
  nameEn: string;
  categoryKey: ExamCategoryKey;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  targetQuizzes: number;
  targetNotes: number;
  phases: {
    phaseNumber: number;
    titleNe: string;
    titleEn: string;
    focus: string;
    targetQuizCount: number;
    targetNoteCount: number;
    keyActs: string[];
  }[];
}

const EXAMS_CONFIG: Record<SupportedExamId, ExamConfig> = {
  nrb: {
    id: 'nrb',
    nameNe: 'नेपाल राष्ट्र बैंक (NRB)',
    nameEn: 'Nepal Rastra Bank (Level 4 & 6)',
    categoryKey: 'NRB',
    badge: 'केन्द्रीय बैंकिङ',
    icon: Landmark,
    color: 'emerald',
    targetQuizzes: 25,
    targetNotes: 15,
    phases: [
      {
        phaseNumber: 1,
        titleNe: 'आधारभूत केन्द्रीय बैंकिङ तथा इतिहास',
        titleEn: 'Central Banking Foundation',
        focus: 'नेपालको बैंकिङ इतिहास र केन्द्रीय बैंकको संरचना',
        targetQuizCount: 5,
        targetNoteCount: 3,
        keyActs: ['NRB Act 2058', 'बैंकिङ विकासक्रम']
      },
      {
        phaseNumber: 2,
        titleNe: 'मौद्रिक नीति, विदेशी विनिमय र BAFIA',
        titleEn: 'Monetary Policy & Acts',
        focus: 'मौद्रिक उपकरणहरू, शोधनान्तर, विदेशी मुद्रा सञ्चिति र नियमन',
        targetQuizCount: 8,
        targetNoteCount: 5,
        keyActs: ['BAFIA २०७३', 'विदेशी विनिमय ऐन २०१९', 'एकीकृत निर्देशन']
      },
      {
        phaseNumber: 3,
        titleNe: 'अर्थशास्त्र, वित्तीय स्थायित्व र सुपरिवेक्षण',
        titleEn: 'Financial Stability & Economics',
        focus: 'म्याक्रो-प्रुडेन्सियल नियमन, बासेल ३, मुद्रास्फीति र तरलता',
        targetQuizCount: 6,
        targetNoteCount: 4,
        keyActs: ['Basel Framework', 'CAMELS रेटिंग']
      },
      {
        phaseNumber: 4,
        titleNe: '५० पूर्ण नमुना सेट तथा परीक्षा मोक टेस्ट',
        titleEn: 'Full Mock Readiness',
        focus: 'समयबद्ध १०० पूर्णांक पूर्व-योग्यता तथा लिखित नमुना परीक्षा',
        targetQuizCount: 6,
        targetNoteCount: 3,
        keyActs: ['Full 50 Sets', 'NRB Model Papers']
      }
    ]
  },
  rbb: {
    id: 'rbb',
    nameNe: 'राष्ट्रिय वाणिज्य बैंक (RBB)',
    nameEn: 'Rastriya Banijya Bank (Level 4 & 5)',
    categoryKey: 'Banking',
    badge: 'वाणिज्य बैंकिङ',
    icon: Building2,
    color: 'blue',
    targetQuizzes: 24,
    targetNotes: 14,
    phases: [
      {
        phaseNumber: 1,
        titleNe: 'वाणिज्य बैंकिङ सञ्चालन र ग्राहक सेवा',
        titleEn: 'Commercial Banking Operations',
        focus: 'निक्षेप संकलन, खाताका प्रकार, विप्रेषण र ग्राहक पहिचान (KYC)',
        targetQuizCount: 6,
        targetNoteCount: 3,
        keyActs: ['खाता सञ्चालन निर्देशिका', 'KYC/AML']
      },
      {
        phaseNumber: 2,
        titleNe: 'कर्जा व्यवस्थापन र प्रमुख बैंकिङ ऐनहरू',
        titleEn: 'Credit Management & Banking Laws',
        focus: 'कर्जा वर्गीकरण, नोक्सानी व्यवस्था, धितो मूल्याङ्कन र BAFIA',
        targetQuizCount: 8,
        targetNoteCount: 5,
        keyActs: ['BAFIA २०७३', 'बैंकिङ कसूर ऐन २०६४', 'सम्पत्ति शुद्धीकरण ऐन']
      },
      {
        phaseNumber: 3,
        titleNe: 'लेखा, अनुपात विश्लेषण र कम्प्युटर ज्ञान',
        titleEn: 'Accounting & Banking IT',
        focus: 'वासलात, नाफा-नोक्सान, वित्तीय अनुपात र कोर बैंकिङ सफ्टवेयर',
        targetQuizCount: 5,
        targetNoteCount: 3,
        keyActs: ['Ratio Analysis', 'Finacle / CBS']
      },
      {
        phaseNumber: 4,
        titleNe: 'RBB विशेष नमुना प्रश्न तथा अभ्यास सेट',
        titleEn: 'RBB Targeted Mock Sets',
        focus: 'तह ४ र ५ को पाठ्यक्रम अनुसारका ५०-५० प्रश्न सेट',
        targetQuizCount: 5,
        targetNoteCount: 3,
        keyActs: ['RBB कर्मचारी सेवा विनियमावली', 'मोक सेट']
      }
    ]
  },
  adbl: {
    id: 'adbl',
    nameNe: 'कृषि विकास बैंक (ADBL)',
    nameEn: 'Agricultural Development Bank (Level 4 & 5)',
    categoryKey: 'Banking',
    badge: 'कृषि तथा ग्रामीण वित्त',
    icon: Building2,
    color: 'emerald',
    targetQuizzes: 20,
    targetNotes: 12,
    phases: [
      {
        phaseNumber: 1,
        titleNe: 'ग्रामीण बैंकिङ र कृषि विकास बैंकको इतिहास',
        titleEn: 'Rural Banking & ADBL History',
        focus: 'कृषि वित्त, साना किसान कर्जा र ADBL ऐन २०२४/२०३१',
        targetQuizCount: 5,
        targetNoteCount: 3,
        keyActs: ['कृषि विकास बैंक इतिहास', 'ग्रामीण कर्जा']
      },
      {
        phaseNumber: 2,
        titleNe: 'परियोजना कर्जा, धितो र BAFIA कानुन',
        titleEn: 'Project Finance & Collateral',
        focus: 'सहकारी, साना तथा मझौला उद्यम (SME) र पुनर्कर्जा',
        targetQuizCount: 6,
        targetNoteCount: 4,
        keyActs: ['BAFIA २०७३', 'कृषि कर्जा निर्देशिका']
      },
      {
        phaseNumber: 3,
        titleNe: 'लेखा प्रणाली र संस्थागत सुशासन',
        titleEn: 'Accounting & Governance',
        focus: 'वित्तीय विवरण विश्लेषण, जोखिम व्यवस्थापन र आन्तरिक नियन्त्रण',
        targetQuizCount: 5,
        targetNoteCount: 3,
        keyActs: ['NFRS Accounting', 'सुशासन']
      },
      {
        phaseNumber: 4,
        titleNe: 'ADBL लिखित तथा पूर्व-योग्यता मोक परीक्षा',
        titleEn: 'ADBL Speed Mock Exams',
        focus: 'समयसीमा भित्र वस्तुगत र विषयगत अभ्यास',
        targetQuizCount: 4,
        targetNoteCount: 2,
        keyActs: ['ADBL Model Exams']
      }
    ]
  },
  nbl: {
    id: 'nbl',
    nameNe: 'नेपाल बैंक लिमिटेड (NBL)',
    nameEn: 'Nepal Bank Limited (Level 3 & 4)',
    categoryKey: 'Banking',
    badge: 'नेपालको पहिलो बैंक',
    icon: Building2,
    color: 'sky',
    targetQuizzes: 20,
    targetNotes: 12,
    phases: [
      {
        phaseNumber: 1,
        titleNe: 'नेपाल बैंक स्थापना र बैंकिङ विकास',
        titleEn: 'NBL Evolution & Operations',
        focus: 'वि.सं. १९९४ को ऐतिहासिक पृष्ठभूमि र आधुनिक बैंकिङ सेवा',
        targetQuizCount: 5,
        targetNoteCount: 3,
        keyActs: ['नेपाल बैंक इतिहास', 'वाणिज्य बैंक सिद्धान्त']
      },
      {
        phaseNumber: 2,
        titleNe: 'अन्तर्राष्ट्रिय व्यापार, L/C र बैंकिङ ऐन',
        titleEn: 'Trade Finance, L/C & Banking Acts',
        focus: 'प्रतीतपत्र (Letter of Credit), बैंक ग्यारेन्टी, विदेशी विनिमय',
        targetQuizCount: 6,
        targetNoteCount: 4,
        keyActs: ['BAFIA २०७३', 'UCP 600', 'विदेशी विनिमय']
      },
      {
        phaseNumber: 3,
        titleNe: 'लेखाविधि र संस्थागत व्यवस्थापन',
        titleEn: 'Accounts & Modern Management',
        focus: 'दोहोरो लेखा प्रणाली, वित्तीय विश्लेषण र ग्राहक सम्बन्ध',
        targetQuizCount: 5,
        targetNoteCount: 3,
        keyActs: ['Double Entry Bookkeeping']
      },
      {
        phaseNumber: 4,
        titleNe: 'NBL तह ३ र ४ नमुना परीक्षा सेट',
        titleEn: 'NBL Special Mock Exams',
        focus: 'पाठ्यक्रम केन्द्रित बहुवैकल्पिक तथा संक्षिप्त लिखित प्रश्नहरू',
        targetQuizCount: 4,
        targetNoteCount: 2,
        keyActs: ['NBL Exam Papers']
      }
    ]
  },
  loksewa: {
    id: 'loksewa',
    nameNe: 'लोकसेवा आयोग (Loksewa)',
    nameEn: 'Public Service Commission (Kharidar, Nasu, Officer)',
    categoryKey: 'Loksewa',
    badge: 'निजामती सेवा',
    icon: Scale,
    color: 'amber',
    targetQuizzes: 30,
    targetNotes: 18,
    phases: [
      {
        phaseNumber: 1,
        titleNe: 'नेपालको संविधान र राज्य व्यवस्था',
        titleEn: 'Constitution & Governance',
        focus: 'मौलिक हक, राज्यका निर्देशक सिद्धान्त र संघीय संरचना',
        targetQuizCount: 8,
        targetNoteCount: 5,
        keyActs: ['नेपालको संविधान २०७२', 'संघीयता']
      },
      {
        phaseNumber: 2,
        titleNe: 'निजामती सेवा ऐन र सार्वजनिक व्यवस्थापन',
        titleEn: 'Civil Service & Public Administration',
        focus: 'सुशासन ऐन, सूचनाको हक, भ्रष्टाचार निवारण ऐन',
        targetQuizCount: 8,
        targetNoteCount: 5,
        keyActs: ['निजामती सेवा ऐन २०४९', 'सुशासन ऐन २०६४']
      },
      {
        phaseNumber: 3,
        titleNe: 'नेपालको भूगोल, इतिहास, अर्थतन्त्र र चालु योजना',
        titleEn: 'Geography, Economy & Plan',
        focus: '१६ औं योजना, बजेट, आर्थिक सर्वेक्षण र दिगो विकास लक्ष्य',
        targetQuizCount: 8,
        targetNoteCount: 5,
        keyActs: ['१६ औं पञ्चवर्षीय योजना', 'आर्थिक सर्वेक्षण']
      },
      {
        phaseNumber: 4,
        titleNe: 'समसामयिक घटनाक्रम र प्रथम पत्र नमुना सेट',
        titleEn: 'Current Affairs & Full Mock',
        focus: 'राष्ट्रिय तथा अन्तर्राष्ट्रिय समसामयिक र ५० प्रश्न सेट',
        targetQuizCount: 6,
        targetNoteCount: 3,
        keyActs: ['Loksewa Model Sets', 'समसामयिक']
      }
    ]
  }
};

interface StudyProgressTrackerProps {
  className?: string;
  defaultExamId?: SupportedExamId;
}

export const StudyProgressTracker: React.FC<StudyProgressTrackerProps> = ({
  className = '',
  defaultExamId
}) => {
  const { user, setUser, setActiveTab, startQuiz, addToast } = useApp();

  // Detect user's current target exam if exists
  const initialExamId: SupportedExamId = useMemo(() => {
    if (defaultExamId) return defaultExamId;
    const target = (user?.targetExam || '').toLowerCase();
    if (target.includes('rbb') || target.includes('वाणिज्य')) return 'rbb';
    if (target.includes('adbl') || target.includes('कृषि')) return 'adbl';
    if (target.includes('nbl') || target.includes('नेपाल बैंक')) return 'nbl';
    if (target.includes('loksewa') || target.includes('लोकसेवा')) return 'loksewa';
    return 'nrb';
  }, [defaultExamId, user?.targetExam]);

  const [selectedExamId, setSelectedExamId] = useState<SupportedExamId>(initialExamId);
  const [examProgress, setExamProgress] = useState(() => 
    ExamProgressService.getAllCategoryProgress(user)
  );

  // Sync when exam progress updates externally
  useEffect(() => {
    const handleProgressUpdate = () => {
      setExamProgress(ExamProgressService.getAllCategoryProgress(user));
    };
    window.addEventListener('btn_exam_progress_updated', handleProgressUpdate);
    window.addEventListener('btn_quiz_completed', handleProgressUpdate);
    return () => {
      window.removeEventListener('btn_exam_progress_updated', handleProgressUpdate);
      window.removeEventListener('btn_quiz_completed', handleProgressUpdate);
    };
  }, [user]);

  const activeConfig = EXAMS_CONFIG[selectedExamId];
  const categoryData = examProgress[activeConfig.categoryKey];

  // Specific exam calculated metrics
  const completedQuizzesCount = user?.quizzesCompleted || categoryData?.quizzesAttempted || 0;
  const targetQuizzes = activeConfig.targetQuizzes;
  const quizProgressPercent = Math.min(100, Math.round((completedQuizzesCount / targetQuizzes) * 100));

  const completedNotesCount = user?.notesRead || categoryData?.notesReadCount || 0;
  const targetNotes = activeConfig.targetNotes;
  const notesProgressPercent = Math.min(100, Math.round((completedNotesCount / targetNotes) * 100));

  // Overall readiness: 50% weight to quizzes + 50% weight to syllabus notes/topics
  const overallPercentage = Math.min(100, Math.round((quizProgressPercent * 0.5) + (notesProgressPercent * 0.5)));

  // SVG Circular progress dimensions
  const size = 180;
  const strokeWidth = 10;
  const center = size / 2;

  // Outer ring (Quizzes): Blue / Indigo
  const outerRadius = center - strokeWidth;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const outerOffset = outerCircumference - (quizProgressPercent / 100) * outerCircumference;

  // Inner ring (Notes): Emerald
  const innerRadius = outerRadius - strokeWidth - 5;
  const innerCircumference = 2 * Math.PI * innerRadius;
  const innerOffset = innerCircumference - (notesProgressPercent / 100) * innerCircumference;

  // Accuracy gauge ring (Small companion)
  const accuracyVal = user?.accuracy || categoryData?.accuracy || 82;

  // Readiness Grade Label
  const getReadinessLevel = (pct: number) => {
    if (pct >= 85) return { label: 'उत्कृष्ट तयारी (A+ Exam Ready)', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' };
    if (pct >= 65) return { label: 'बलियो प्रगति (Strong Progress)', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' };
    if (pct >= 40) return { label: 'मध्यम स्तर (Steady Growth)', color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800' };
    return { label: 'प्रारम्भिक स्तर (Foundation Stage)', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' };
  };

  const readiness = getReadinessLevel(overallPercentage);

  // Set as primary target exam handler
  const handleSetTargetExam = () => {
    const updatedTargetName = activeConfig.nameNe;
    const updatedUser = {
      ...user,
      targetExam: updatedTargetName
    };
    setUser(updatedUser);
    DbService.saveStudentProfile({ targetExam: updatedTargetName });
    
    // Seamlessly persist to Firebase Firestore across devices
    if (user && !user.isGuest && (user.authUid || user.id)) {
      FirebaseSyncService.syncStudyProgressToFirestore(user.authUid || user.id, { targetExam: updatedTargetName }).catch(() => {});
    }

    addToast(`${activeConfig.nameNe} लाई तपाईंको मुख्य लक्ष्य परीक्षाको रूपमा सुरक्षित गरियो!`, 'success');
  };

  // Launch targeted practice quiz
  const handleStartExamQuiz = () => {
    const pulled = getQuestionsByCategory(activeConfig.categoryKey === 'Banking' ? 'Banking' : activeConfig.categoryKey === 'NRB' ? 'NRB' : 'Loksewa', 15, 'Medium');
    const questions = pulled.map(convertQuizQuestionToQuestion);
    const quizSet: QuizSet = {
      id: `targeted-exam-${selectedExamId}-${Date.now()}`,
      title: `${activeConfig.nameNe} - विशेष तयारी क्विज`,
      description: `${activeConfig.nameEn} को पाठ्यक्रममा आधारित १५ उच्च सम्भावित प्रश्नहरू`,
      category: activeConfig.categoryKey === 'Banking' ? 'Banking' : activeConfig.categoryKey === 'NRB' ? 'NRB' : 'Loksewa',
      difficulty: 'Medium',
      mode: 'practice',
      timeLimitMinutes: 15,
      questions,
      badge: activeConfig.badge
    };
    startQuiz(quizSet);
  };

  return (
    <section 
      id="study-progress-tracker" 
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm ${className}`}
    >
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
              <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              तयारी यात्रा ट्र्याकर (Preparation Journey)
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              सम्पन्न क्विज र नोट्सको गोलाकार प्रगति चार्ट
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>अध्ययन प्रगति ट्र्याकर (Study Progress Tracker)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            आफ्नो लक्षित बैंक वा लोकसेवा परीक्षा अनुसार हल गरिएका क्विज सेट, अध्ययन गरिएका नोट्स र पाठ्यक्रम चरणहरूको प्रत्यक्ष दृश्य
          </p>
        </div>

        {/* Set Target Button & Cloud Sync Status */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CloudCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{user && !user.isGuest ? 'Cloud Synced' : 'स्थानीय (Guest)'}</span>
          </div>

          {user?.targetExam?.includes(activeConfig.nameNe.slice(0, 10)) ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>मेरो मुख्य लक्ष्य परीक्षा</span>
            </span>
          ) : (
            <button
              onClick={handleSetTargetExam}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              title="यस परीक्षालाई आफ्नो मुख्य प्रोफाइल लक्ष्य बनाउनुहोस्"
            >
              <Target className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>मुख्य लक्ष्य बनाउनुहोस्</span>
            </button>
          )}
        </div>
      </div>

      {/* Specific Exam Selector Tabs */}
      <div className="mt-5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 block">
          लक्षित परीक्षा चयन गर्नुहोस् (Select Target Exam)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {(Object.values(EXAMS_CONFIG)).map((exam) => {
            const Icon = exam.icon;
            const isSelected = selectedExamId === exam.id;
            const isUserTarget = user?.targetExam?.includes(exam.nameNe.slice(0, 8));

            return (
              <button
                key={exam.id}
                onClick={() => setSelectedExamId(exam.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 shadow-sm ring-1 ring-blue-600'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <div className={`p-1.5 rounded-lg ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isUserTarget && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                      Target
                    </span>
                  )}
                </div>
                <div>
                  <h4 className={`text-xs font-bold truncate ${
                    isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {exam.nameNe.split('(')[0]}
                  </h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                    {exam.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Charts & Breakdown Layout */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Concentric Circular Progress Chart (SVG) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50/60 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="relative flex items-center justify-center">
            <svg
              width={size}
              height={size}
              className="transform -rotate-90"
              viewBox={`0 0 ${size} ${size}`}
            >
              {/* Outer Ring Background (Quizzes) */}
              <circle
                cx={center}
                cy={center}
                r={outerRadius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-slate-200 dark:text-slate-700"
              />
              {/* Outer Ring Progress (Quizzes) */}
              <circle
                cx={center}
                cy={center}
                r={outerRadius}
                fill="transparent"
                stroke="#2563EB"
                strokeWidth={strokeWidth}
                strokeDasharray={outerCircumference}
                strokeDashoffset={outerOffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />

              {/* Inner Ring Background (Notes) */}
              <circle
                cx={center}
                cy={center}
                r={innerRadius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-slate-200 dark:text-slate-700"
              />
              {/* Inner Ring Progress (Notes) */}
              <circle
                cx={center}
                cy={center}
                r={innerRadius}
                fill="transparent"
                stroke="#059669"
                strokeWidth={strokeWidth}
                strokeDasharray={innerCircumference}
                strokeDashoffset={innerOffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {overallPercentage}%
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                समग्र तयारी प्रगति
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold truncate max-w-[110px]">
                {activeConfig.badge}
              </span>
            </div>
          </div>

          {/* Readiness Grade Badge */}
          <div className={`mt-4 px-3.5 py-1 rounded-full text-xs font-semibold border ${readiness.bg} ${readiness.color}`}>
            {readiness.label}
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 w-full text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                क्विज: {quizProgressPercent}%
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                नोट्स: {notesProgressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Quizzes vs Notes Detailed Companion Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Completed Quizzes */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                  <HelpCircle className="w-3 h-3 text-blue-600" />
                  क्विज प्रगति (Quizzes)
                </span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {quizProgressPercent}%
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {completedQuizzesCount}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  / {targetQuizzes} लक्षित क्विज सेट
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                {activeConfig.nameNe} का लागि आवश्यक सम्पूर्ण वस्तुगत बहुवैकल्पिक अभ्यास
              </p>

              <div className="space-y-1.5 py-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>हल गरिएका कुल प्रश्न:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{user?.questionsSolved || 150}+ MCQs</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>औसत शुद्धता दर (Accuracy):</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{accuracyVal}%</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartExamQuiz}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{activeConfig.badge} क्विज सुरु गर्नुहोस्</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Completed Notes & Topics */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  <BookOpen className="w-3 h-3 text-emerald-600" />
                  नोट्स प्रगति (Study Notes)
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {notesProgressPercent}%
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {completedNotesCount}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  / {targetNotes} मुख्य ऐन तथा विषय
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                पाठ्यक्रमका मुख्य ऐन, सिद्धान्त र विषयगत लिखित परीक्षा अध्ययन सामग्री
              </p>

              <div className="space-y-1.5 py-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>कण्ठस्थ गरिएका ऐनहरू:</span>
                  <span className="font-bold text-slate-900 dark:text-white">BAFIA, NRB Act</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>अनुमानित अध्ययन समय:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{Math.max(12, completedNotesCount * 3)} घण्टा</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('free-notes')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{activeConfig.badge} नोट्स पढ्नुहोस्</span>
              <BookOpen className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Preparation Journey 4-Phase Stepper */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>{activeConfig.nameNe} - ४ चरणको पाठ्यक्रम तयारी यात्रा (Syllabus Roadmap)</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            क्रमबद्ध रूपमा चरण १ देखि ४ सम्म अध्ययन पूरा गर्नुहोस्
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {activeConfig.phases.map((phase, pIdx) => {
            // Compute realistic phase completion state
            const isPhaseCompleted = overallPercentage >= (pIdx + 1) * 25;
            const isPhaseActive = !isPhaseCompleted && overallPercentage >= pIdx * 25;

            return (
              <div
                key={phase.phaseNumber}
                className={`p-4 rounded-xl border transition-all ${
                  isPhaseCompleted
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
                    : isPhaseActive
                    ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700 ring-1 ring-blue-500'
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/80 dark:border-slate-700/50 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isPhaseCompleted 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' 
                      : isPhaseActive 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 animate-pulse'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    चरण {phase.phaseNumber}
                  </span>
                  {isPhaseCompleted ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      सम्पन्न
                    </span>
                  ) : isPhaseActive ? (
                    <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1 text-[11px] font-bold">
                      <Zap className="w-3.5 h-3.5" />
                      जारी छ
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px] font-medium">
                      आगामी
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                  {phase.titleNe}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {phase.focus}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {phase.keyActs.map((act, aIdx) => (
                    <span key={aIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-700/80 border border-slate-200/60 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium">
                      {act}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                  <span>लक्ष्य: {phase.targetQuizCount} क्विज</span>
                  <span>{phase.targetNoteCount} नोट्स</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
