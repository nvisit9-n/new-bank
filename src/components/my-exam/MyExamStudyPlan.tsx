import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  RotateCcw, 
  Zap, 
  Flame, 
  Sparkles, 
  ChevronRight, 
  Sliders, 
  Target, 
  AlertCircle,
  TrendingUp,
  BrainCircuit,
  FileText
} from 'lucide-react';
import { InstitutionId, ExamLevelNumber } from '../../types/masterEcosystem';
import { useApp } from '../../context/AppContext';

interface TopicTrackingRecord {
  id: string;
  name: string;
  subject: string;
  status: 'NOT_STARTED' | 'LEARNING' | 'PRACTICED' | 'MASTERED';
  accuracy: number;
}

const INITIAL_TOPIC_TRACKER: TopicTrackingRecord[] = [
  { id: 'top-01', name: 'नेपाल राष्ट्र बैंक ऐन, २०५८ (दफा ४, ५, १४, ४३)', subject: 'Law', status: 'MASTERED', accuracy: 92 },
  { id: 'top-02', name: 'बाफिया २०७३ र बैंकहरूको वर्गीकरण (क, ख, ग, घ)', subject: 'Law', status: 'PRACTICED', accuracy: 80 },
  { id: 'top-03', name: 'पुँजी पर्याप्तता अनुपात (CAR ११%) र बफर', subject: 'Banking', status: 'LEARNING', accuracy: 65 },
  { id: 'top-04', name: 'कर्जा-निक्षेप अनुपात (CD Ratio ९०%) र गणना', subject: 'Accounting', status: 'MASTERED', accuracy: 95 },
  { id: 'top-05', name: 'कर्जा वर्गीकरण र नोक्सानी व्यवस्था (NPL & LLP)', subject: 'Banking', status: 'LEARNING', accuracy: 58 },
  { id: 'top-06', name: 'मौद्रिक नीति, ब्याजदर करिडोर र तरलता व्यवस्थापन', subject: 'Economics', status: 'PRACTICED', accuracy: 75 },
  { id: 'top-07', name: 'सम्पत्ति शुद्धीकरण (AML/CFT) र KYC/EDD', subject: 'Banking', status: 'NOT_STARTED', accuracy: 0 },
  { id: 'top-08', name: 'कोर बैंकिङ प्रणाली (CBS) र RTGS/ConnectIPS', subject: 'Computer', status: 'NOT_STARTED', accuracy: 0 }
];

export const MyExamStudyPlan: React.FC = () => {
  const { setActiveTab } = useApp();
  const [selectedInst, setSelectedInst] = useState<InstitutionId>('NRB');
  const [selectedLevel, setSelectedLevel] = useState<ExamLevelNumber>('4');
  const [dailyHours, setDailyHours] = useState<number>(3);
  const [targetDateBS, setTargetDateBS] = useState<string>('२०८३ मंसिर');
  const [topics, setTopics] = useState<TopicTrackingRecord[]>(INITIAL_TOPIC_TRACKER);

  const handleToggleStatus = (topicId: string) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        const nextMap: Record<string, TopicTrackingRecord['status']> = {
          NOT_STARTED: 'LEARNING',
          LEARNING: 'PRACTICED',
          PRACTICED: 'MASTERED',
          MASTERED: 'NOT_STARTED'
        };
        return { ...t, status: nextMap[t.status] };
      }
      return t;
    }));
  };

  const masteredCount = topics.filter(t => t.status === 'MASTERED').length;
  const progressPercent = Math.round((masteredCount / topics.length) * 100);

  return (
    <div id="my-exam-study-plan" className="space-y-6 pb-16 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0B192C] text-white border border-slate-700 shadow-xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-sky-950/80 text-sky-300 border border-sky-500/50 text-xs font-black flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                व्यक्तिगत परीक्षा रणनीति इन्जिन (Personalized Strategy Engine)
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 text-xs font-bold">
                Spaced Repetition: १/३/७/१५/३० दिन
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              मेरो परीक्षा अध्ययन योजना (My Exam Study Plan & Tracker)
            </h1>
            <p className="text-sm text-[#CBD5E1] leading-relaxed">
              आफ्नो लक्षित बैंक तथा तह छनोट गर्नुहोस्। प्रणालीले तपाईंको उपलब्ध दैनिक समय र पाठ्यक्रम अनुसार अध्ययन योजना, स्पेसड् रिभिजन र कमजोर विषयहरू सिफारिस गर्दछ।
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-center shrink-0 min-w-[160px]">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">पाठ्यक्रम कभरेज</span>
            <span className="text-3xl font-black text-emerald-400 my-1">{progressPercent}%</span>
            <span className="text-[10px] text-slate-400">{masteredCount} / {topics.length} मुख्य शीर्षक पोख्त</span>
          </div>
        </div>
      </div>

      {/* 2. Target Exam Preferences Toolbar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
            लक्षित बैंक वा संस्था (Target Institution)
          </label>
          <select
            value={selectedInst}
            onChange={e => setSelectedInst(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer"
          >
            <option value="NRB">नेपाल राष्ट्र बैंक (NRB)</option>
            <option value="RBB">राष्ट्रिय वाणिज्य बैंक (RBB)</option>
            <option value="NBL">नेपाल बैंक लिमिटेड (NBL)</option>
            <option value="ADBL">कृषि विकास बैंक (ADBL)</option>
            <option value="LOKSEWA">लोक सेवा आयोग (Civil Service)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
            लक्षित तह (Target Level)
          </label>
          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer"
          >
            <option value="4">तह ४: सहायक / क्यासियर</option>
            <option value="5">तह ५: वरिष्ठ सहायक</option>
            <option value="6">तह ६: अधिकृत तृतीय / सहायक निर्देशक</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
            दैनिक अध्ययन समय (Daily Study Hours)
          </label>
          <select
            value={dailyHours}
            onChange={e => setDailyHours(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer"
          >
            <option value={2}>२ घण्टा दैनिक (अंशकालिक)</option>
            <option value={3}>३ घण्टा दैनिक (मानक)</option>
            <option value={5}>५ घण्टा दैनिक (पूर्णकालीन तीव्र तयारी)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
            लक्षित परीक्षा मिति (Target Exam Date)
          </label>
          <input
            type="text"
            value={targetDateBS}
            onChange={e => setTargetDateBS(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* 3. 7-Day Spaced Repetition Queue */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-black text-white">
              आजको स्पेसड् रिभिजन तालिका (Spaced Repetition Queue)
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-sky-950 text-sky-300 text-xs font-black border border-sky-600/40">
            विस्मृति रोक्ने वैज्ञानिक प्रणाली
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-700 space-y-2">
            <span className="text-[10px] font-black text-sky-400 uppercase tracking-wider block">१ दिन पछिको रिभिजन (Day 1)</span>
            <h4 className="text-xs font-black text-white">नेपाल राष्ट्र बैंक ऐन २०५८ का मुख्य दफाहरू</h4>
            <p className="text-[11px] text-slate-400">हिजो पढेको विषयवस्तुको द्रुत ५ मिनेट स्मरण परीक्षण।</p>
            <button 
              onClick={() => setActiveTab('master-books')} 
              className="text-[11px] text-sky-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer pt-1"
            >
              रिभिजन गर्नुहोस् <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-700 space-y-2">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">७ दिन पछिको रिभिजन (Day 7)</span>
            <h4 className="text-xs font-black text-white">पुँजी पर्याप्तता अनुपात (CAR) र Basel III</h4>
            <p className="text-[11px] text-slate-400">१ हप्ता अगाडिको संख्यात्मक हिसाब दोहोर्याउने समय।</p>
            <button 
              onClick={() => setActiveTab('master-books')} 
              className="text-[11px] text-amber-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer pt-1"
            >
              हिसाब अभ्यास गर्नुहोस् <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-700 space-y-2">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">३० दिन पछिको रिभिजन (Day 30)</span>
            <h4 className="text-xs font-black text-white">सम्पत्ति शुद्धीकरण (AML/CFT) र FATF</h4>
            <p className="text-[11px] text-slate-400">दीर्घकालीन स्मरणमा स्थायी बनाउन अन्तिम चक्र।</p>
            <button 
              onClick={() => setActiveTab('master-books')} 
              className="text-[11px] text-emerald-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer pt-1"
            >
              परीक्षण दिनुहोस् <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Interactive Syllabus Topic Tracker */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              पाठ्यक्रम शीर्षक ट्र्याकर (Syllabus Topic Mastery Tracker)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              प्रत्येक शीर्षकको स्थिति परिवर्तन गर्न क्लिक गर्नुहोस्: Not Started → Learning → Practiced → Mastered
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="flex items-center gap-1 text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> शुरु नभएको</span>
            <span className="flex items-center gap-1 text-sky-600"><span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> पढ्दै</span>
            <span className="flex items-center gap-1 text-amber-600"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> अभ्यास गरेको</span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> कण्ठस्थ / पोख्त</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {topics.map(t => {
            const statusConfig = {
              NOT_STARTED: { label: 'शुरु नभएको', class: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' },
              LEARNING: { label: 'पढ्दै गरेको (Learning)', class: 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300' },
              PRACTICED: { label: 'अभ्यास गरिएको (Practiced)', class: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' },
              MASTERED: { label: 'कण्ठस्थ / पोख्त (Mastered)', class: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold' }
            }[t.status];

            return (
              <div key={t.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {t.subject}
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {t.name}
                    </h4>
                  </div>
                  {t.accuracy > 0 && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      वस्तुगत शुद्धता: <strong>{t.accuracy}%</strong>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(t.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition cursor-pointer border border-transparent hover:border-slate-300 ${statusConfig.class}`}
                  >
                    {statusConfig.label}
                  </button>

                  <button
                    onClick={() => setActiveTab('master-books')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer"
                    title="अध्याय अध्ययन गर्नुहोस्"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyExamStudyPlan;
