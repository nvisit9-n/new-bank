import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Landmark, 
  Scale, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  BookOpen, 
  Award, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  Check, 
  FileText, 
  Play, 
  Compass, 
  Flame, 
  Flag,
  Target,
  Layers,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExamProgressService, ExamCategoryKey } from '../../services/examProgressService';
import { getQuestionsByCategory, convertQuizQuestionToQuestion } from '../../data/quizData';
import { QuizSet } from '../../types';
import confetti from 'canvas-confetti';

export interface RoadmapStep {
  id: string;
  stepNumber: number;
  titleNe: string;
  titleEn: string;
  phaseLabelNe: string;
  estimatedHours: number;
  durationLabelNe: string;
  targetFocusNe: string;
  syllabusRef: string;
  topics: {
    id: string;
    titleNe: string;
    titleEn: string;
    ref: string;
    importance: 'Critical' | 'High' | 'Medium';
    quizCategory: 'Banking' | 'Loksewa' | 'NRB' | 'Law' | 'Economics' | 'Management' | 'Accounting';
  }[];
}

export const EXAM_ROADMAPS: Record<ExamCategoryKey, {
  category: ExamCategoryKey;
  titleNe: string;
  titleEn: string;
  examCoverageNe: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  steps: RoadmapStep[];
}> = {
  Banking: {
    category: 'Banking',
    titleNe: 'वाणिज्य बैंकिङ पाठ्यक्रम मार्गचित्र',
    titleEn: 'Commercial Banking Syllabus Roadmap (RBB / NBL / ADBL)',
    examCoverageNe: 'राष्ट्रिय वाणिज्य बैंक, नेपाल बैंक, कृषि विकास बैंक (तह ४ र ५)',
    icon: Building2,
    accentColor: 'from-blue-600 via-sky-600 to-indigo-600',
    badgeBg: 'bg-blue-500/20',
    badgeText: 'text-sky-300 border-sky-500/30',
    steps: [
      {
        id: 'bank-step-1',
        stepNumber: 1,
        titleNe: 'आधारभूत बैंकिङ विकासक्रम तथा संगठनात्मक संरचना',
        titleEn: 'Banking History, Evolution & Institutional Setup',
        phaseLabelNe: 'चरण १: आधारशिला निर्माण',
        estimatedHours: 12,
        durationLabelNe: '१ हप्ता',
        targetFocusNe: 'नेपालमा बैंकिङ प्रणालीको सुरुवात, ' +
          'क, ख, ग, घ वर्गका बैंकहरूको संरचना र केन्द्रीय बैंकसँगको सम्बन्ध बुझ्ने।',
        syllabusRef: 'नेपाल बैंक, रा.वा.बैंक, कृषि विकास बैंक इतिहास र पृष्ठभूमि',
        topics: [
          {
            id: 'bank-top-1-1',
            titleNe: 'नेपालमा बैंकिङ विकासक्रम, इतिहास र वर्तमान संरचना',
            titleEn: 'Banking History & Evolution in Nepal',
            ref: '१९९४ सालदेखि हालसम्मको बैंकिङ विकास',
            importance: 'High',
            quizCategory: 'Banking'
          },
          {
            id: 'bank-top-1-2',
            titleNe: 'बैंक तथा वित्तीय संस्थाको वर्गीकरण (क, ख, ग, घ) र पुँजी ढाँचा',
            titleEn: 'Classification of BFIs & Capital Structure',
            ref: 'BAFIA दफा ३१ र न्यूनतम चुक्ता पुँजी',
            importance: 'Critical',
            quizCategory: 'Banking'
          },
          {
            id: 'bank-top-1-3',
            titleNe: 'नेपाल राष्ट्र बैंक र वाणिज्य बैंकहरू बीचको नियमनकारी सम्बन्ध',
            titleEn: 'Central Bank Regulations & Relationship',
            ref: 'राष्ट्र बैंक ऐन २०५८ दफा ७९',
            importance: 'High',
            quizCategory: 'Banking'
          }
        ]
      },
      {
        id: 'bank-step-2',
        stepNumber: 2,
        titleNe: 'प्रमुख बैंकिङ ऐनहरू, BAFIA तथा कानुनी प्रावधान',
        titleEn: 'Core Banking Acts, BAFIA & Statutory Laws',
        phaseLabelNe: 'चरण २: कानुनी तथा नीतिगत पकड',
        estimatedHours: 18,
        durationLabelNe: '२ हप्ता',
        targetFocusNe: 'लिखित परीक्षामा सोधिने ऐन, नियम र कानुनी दफाहरूमा पूर्ण आत्मविश्वास प्राप्त गर्ने।',
        syllabusRef: 'BAFIA २०७३, बैंकिङ कसूर ऐन २०६४, सम्पत्ति शुद्धीकरण निवारण ऐन',
        topics: [
          {
            id: 'bank-top-2-1',
            titleNe: 'बैंक तथा वित्तीय संस्था सम्बन्धी ऐन (BAFIA) २०७३ का मुख्य दफाहरू',
            titleEn: 'BAFIA 2073 Core Provisions',
            ref: 'दफा ४९, ५० (कार्यक्षेत्र), सञ्चालक समिति, सुशासन',
            importance: 'Critical',
            quizCategory: 'Law'
          },
          {
            id: 'bank-top-2-2',
            titleNe: 'बैंकिङ कसूर तथा सजाय ऐन २०६४ र मुख्य कसूरहरू',
            titleEn: 'Banking Offence and Punishment Act 2064',
            ref: 'दफा ३ देखि १८ (चेक अनादर, नक्कली धितो, ठगी)',
            importance: 'Critical',
            quizCategory: 'Law'
          },
          {
            id: 'bank-top-2-3',
            titleNe: 'सम्पत्ति शुद्धीकरण (AML/CFT) निवारण ऐन २०६४ र KYC प्रणाली',
            titleEn: 'Anti-Money Laundering & KYC Framework',
            ref: 'दफा ३, ४ र राष्ट्र बैंक निर्देशन नं. १९',
            importance: 'Critical',
            quizCategory: 'Law'
          }
        ]
      },
      {
        id: 'bank-step-3',
        stepNumber: 3,
        titleNe: 'निक्षेप, कर्जा वर्गीकरण & लेखा विधि',
        titleEn: 'Deposits, Loan Classification (NPA) & Accounting',
        phaseLabelNe: 'चरण ३: व्यावहारिक बैंकिङ तथा हिसाब',
        estimatedHours: 20,
        durationLabelNe: '२ हप्ता',
        targetFocusNe: 'निक्षेप संकलन विधि, खराब कर्जा (NPA) नोक्सानी व्यवस्था र दोहोरो लेखा प्रणालीमा पकड।',
        syllabusRef: 'NRB Directive No. 2, NFRS मापदण्ड, BRS',
        topics: [
          {
            id: 'bank-top-3-1',
            titleNe: 'निक्षेप संकलनका प्रकार (बचत, मुद्दती, चालु, कल) र परिचालन',
            titleEn: 'Deposit Mobilization & Types',
            ref: 'कोषको लागत र निक्षेप नीति',
            importance: 'High',
            quizCategory: 'Banking'
          },
          {
            id: 'bank-top-3-2',
            titleNe: 'कर्जा वर्गीकरण र नोक्सानी व्यवस्था (Pass, Watchlist, NPA: Substandard, Doubtful, Loss)',
            titleEn: 'Loan Classification & Loan Loss Provisioning',
            ref: 'एकीकृत निर्देशन नं. २ (१.२%, ५%, २५%, ५०%, १००%)',
            importance: 'Critical',
            quizCategory: 'Banking'
          },
          {
            id: 'bank-top-3-3',
            titleNe: 'बैंक हिसाब मिलान विवरण (BRS) & वित्तीय अनुपात विश्लेषण',
            titleEn: 'BRS & Financial Ratio Analysis',
            ref: 'लेखा सिद्धान्त, वासलात र नाफा-नोक्सान',
            importance: 'High',
            quizCategory: 'Accounting'
          }
        ]
      },
      {
        id: 'bank-step-4',
        stepNumber: 4,
        titleNe: 'अन्तर्राष्ट्रिय व्यापार वित्त, भुक्तानी & जोखिम व्यवस्थापन',
        titleEn: 'Trade Finance, Digital Payments & Risk Management',
        phaseLabelNe: 'चरण ४: उन्नत प्राविधिक तथा जोखिम विश्लेषण',
        estimatedHours: 16,
        durationLabelNe: '१.५ हप्ता',
        targetFocusNe: 'प्रतितपत्र (LC), बैंक जमानत, बासेल ३ पूँजी पर्याप्तता र विद्युतीय भुक्तानी प्रणाली।',
        syllabusRef: 'UCP 600, Basel III, RTGS & Payment Settlement Act',
        topics: [
          {
            id: 'bank-top-4-1',
            titleNe: 'अन्तर्राष्ट्रिय व्यापार वित्त, प्रतीतपत्र (L/C) & बैंक जमानत (BG)',
            titleEn: 'Letter of Credit (LC) & Bank Guarantee',
            ref: 'UCPDC 600, Bid Bond, Performance Bond',
            importance: 'Critical',
            quizCategory: 'Banking'
          },
          {
            id: 'bank-top-4-2',
            titleNe: 'बासेल ३ फ्रेमवर्क, पूँजी कोष (CAR) र तरलता अनुपात (CRR/SLR)',
            titleEn: 'Basel III CAR & Liquidity Ratios',
            ref: 'Tier 1, Tier 2 Capital र जोखिम भारित सम्पत्ति',
            importance: 'Critical',
            quizCategory: 'Banking'
          },
          {
            id: 'bank-top-4-3',
            titleNe: 'विद्युतीय भुक्तानी, RTGS, SWIFT र कनेक्टआईपीएस प्रणाली',
            titleEn: 'Electronic Payments, RTGS & SWIFT',
            ref: 'भुक्तानी तथा फछ्र्यौट ऐन २०७५',
            importance: 'High',
            quizCategory: 'Banking'
          }
        ]
      },
      {
        id: 'bank-step-5',
        stepNumber: 5,
        titleNe: 'कार्यालय व्यवस्थापन, लिखित उत्तर लेखन & पूर्ण नमुना परीक्षा',
        titleEn: 'Office Management, Drafting & Full Mock Exam Mastery',
        phaseLabelNe: 'चरण ५: अन्तिम परीक्षा सफलता',
        estimatedHours: 24,
        durationLabelNe: '२ हप्ता',
        targetFocusNe: 'समय व्यवस्थापन, टिप्पणी/पत्र लेखन, ५० वटा पूर्ण नमुना परीक्षा सेट अभ्यास र अन्तिम दोहोर्याइ।',
        syllabusRef: 'द्वितीय पत्र कार्यालय व्यवस्थापन & ५,०००+ मेगा रिपोजिटरी',
        topics: [
          {
            id: 'bank-top-5-1',
            titleNe: 'ग्राहक सम्बन्ध व्यवस्थापन (CRM) र बैंक आन्तरिक नियन्त्रण',
            titleEn: 'Customer Relationship Management & Internal Control',
            ref: 'बैंक शाखा सञ्चालन कार्यविधि',
            importance: 'High',
            quizCategory: 'Management'
          },
          {
            id: 'bank-top-5-2',
            titleNe: 'बैंकिङ टिप्पणी लेखन, पत्राचार र प्रतिवेदन मस्यौदा',
            titleEn: 'Note Drafting & Official Correspondence',
            ref: 'द्वितीय पत्र विशेष लिखित अभ्यास',
            importance: 'Critical',
            quizCategory: 'Management'
          },
          {
            id: 'bank-top-5-3',
            titleNe: '१० वटा पूर्ण नमुना परीक्षा सेट (Full Mock Exams) अभ्यास',
            titleEn: 'Full Syllabus Mock Tests Revision',
            ref: '५० प्रश्नहरू • ४५ मिनेट टाइमर परीक्षा',
            importance: 'Critical',
            quizCategory: 'Banking'
          }
        ]
      }
    ]
  },
  Loksewa: {
    category: 'Loksewa',
    titleNe: 'लोकसेवा आयोग पाठ्यक्रम मार्गचित्र',
    titleEn: 'Loksewa Civil Service Syllabus Roadmap',
    examCoverageNe: 'शाखा अधिकृत, नायब सुब्बा (नासु) र खरिदार',
    icon: Scale,
    accentColor: 'from-amber-600 via-orange-600 to-rose-600',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300 border-amber-500/30',
    steps: [
      {
        id: 'lok-step-1',
        stepNumber: 1,
        titleNe: 'नेपालको संविधान २०७२ तथा राज्य संरचना',
        titleEn: 'Constitution of Nepal 2072 & State Architecture',
        phaseLabelNe: 'चरण १: संवैधानिक आधार',
        estimatedHours: 20,
        durationLabelNe: '२ हप्ता',
        targetFocusNe: 'मौलिक हक, राज्यका निर्देशक सिद्धान्त, अनुसूची ५-९ का अधिकार र संवैधानिक निकायहरू।',
        syllabusRef: 'नेपालको संविधान भाग १ देखि ५ र अनुसूचीहरू',
        topics: [
          {
            id: 'lok-top-1-1',
            titleNe: 'नेपालको संविधान २०७२: ३१ मौलिक हक र नागरिकका कर्तव्यहरू',
            titleEn: '31 Fundamental Rights & Duties',
            ref: 'भाग ३ दफा १६ देखि ४८',
            importance: 'Critical',
            quizCategory: 'Loksewa'
          },
          {
            id: 'lok-top-1-2',
            titleNe: 'राज्यका निर्देशक सिद्धान्त, नीति तथा दायित्वहरू',
            titleEn: 'Directive Principles & Policies of State',
            ref: 'भाग ४ दफा ४९ देखि ५५',
            importance: 'Critical',
            quizCategory: 'Loksewa'
          },
          {
            id: 'lok-top-1-3',
            titleNe: 'संघ, प्रदेश र स्थानीय तह बीचको अधिकारको बाँडफाँड',
            titleEn: 'Distribution of Powers (Schedules 5-9)',
            ref: 'अनुसूची ५, ६, ७, ८, ९ र अन्तर-सरकार सम्बन्ध',
            importance: 'Critical',
            quizCategory: 'Loksewa'
          }
        ]
      },
      {
        id: 'lok-step-2',
        stepNumber: 2,
        titleNe: 'सार्वजनिक प्रशासन, सुशासन & निजामती सेवा',
        titleEn: 'Public Administration, Good Governance & Civil Service',
        phaseLabelNe: 'चरण २: प्रशासनिक संयन्त्र',
        estimatedHours: 18,
        durationLabelNe: '२ हप्ता',
        targetFocusNe: 'सार्वजनिक सेवा प्रवाह, सुशासन ऐन, नागरिक बडापत्र र कर्मचारी प्रशासन।',
        syllabusRef: 'सुशासन ऐन २०६४, निजामती सेवा ऐन २०४९',
        topics: [
          {
            id: 'lok-top-2-1',
            titleNe: 'सुशासन (सञ्चालन तथा व्यवस्थापन) ऐन २०६४ र नागरिक बडापत्र',
            titleEn: 'Good Governance Act 2064 & Citizen Charter',
            ref: 'सुशासनका आधारभूत मान्यता र सेवा प्रवाह',
            importance: 'Critical',
            quizCategory: 'Loksewa'
          },
          {
            id: 'lok-top-2-2',
            titleNe: 'निजामती सेवा ऐन २०४९ र नियमावली २०५० का प्रमुख व्यवस्थाहरू',
            titleEn: 'Civil Service Act 2049 & Rules 2050',
            ref: 'पदपूर्ति, आचरण, विभागीय सजाय र वृत्ति विकास',
            importance: 'Critical',
            quizCategory: 'Loksewa'
          },
          {
            id: 'lok-top-2-3',
            titleNe: 'भ्रष्टाचार निवारण ऐन २०५९ र अख्तियार (CIAA) को भूमिका',
            titleEn: 'Anti-Corruption Act 2059 & CIAA',
            ref: 'भ्रष्टाचार नियन्त्रण र सदाचारिता प्रवर्द्धन',
            importance: 'High',
            quizCategory: 'Loksewa'
          }
        ]
      },
      {
        id: 'lok-step-3',
        stepNumber: 3,
        titleNe: 'नेपालको भूगोल, इतिहास, संस्कृति & सामान्य ज्ञान',
        titleEn: 'Geography, History, Society & GK of Nepal',
        phaseLabelNe: 'चरण ३: प्रथम पत्र सामान्य ज्ञान',
        estimatedHours: 16,
        durationLabelNe: '१.५ हप्ता',
        targetFocusNe: 'नेपालको प्राकृतिक स्रोत, हावापानी, ऐतिहासिक घटनाक्रम र जातजाति/संस्कृति।',
        syllabusRef: 'सामान्य ज्ञान (GK) खण्ड क र ख',
        topics: [
          {
            id: 'lok-top-3-1',
            titleNe: 'नेपालको भौगोलिक अवस्था, धरातलीय स्वरूप, नदीनाला र तालतलैया',
            titleEn: 'Geography, Rivers & Lakes of Nepal',
            ref: '८,८४८.८६ मिटर उचाइ, प्रमुख नदी प्रणाली',
            importance: 'High',
            quizCategory: 'Loksewa'
          },
          {
            id: 'lok-top-3-2',
            titleNe: 'नेपालको प्राचीन, मध्यकालीन र आधुनिक राजनीतिक इतिहास',
            titleEn: 'History & Political Evolution of Nepal',
            ref: 'लिच्छवि, मल्ल, शाहकाल र २०६२/६३ आन्दोलन',
            importance: 'High',
            quizCategory: 'Loksewa'
          },
          {
            id: 'lok-top-3-3',
            titleNe: 'नेपालको सामाजिक-सांस्कृतिक व्यवस्था र राष्ट्रिय जनगणना २०७८',
            titleEn: 'Culture, Castes & Census 2078 Data',
            ref: 'जनसंख्या २,९१,६४,५७८ र मुख्य सूचकहरू',
            importance: 'Critical',
            quizCategory: 'Loksewa'
          }
        ]
      },
      {
        id: 'lok-step-4',
        stepNumber: 4,
        titleNe: 'सार्वजनिक खरिद, वित्त व्यवस्थापन & आवधिक योजना',
        titleEn: 'Public Procurement, Fiscal Management & Periodic Plans',
        phaseLabelNe: 'चरण ४: आर्थिक तथा विकास पक्ष',
        estimatedHours: 16,
        durationLabelNe: '१.५ हप्ता',
        targetFocusNe: 'सार्वजनिक खरिद ऐन, वित्तीय उत्तरदायित्व ऐन र १६औं पञ्चवर्षीय योजना।',
        syllabusRef: 'सार्वजनिक खरिद ऐन २०६३, १६औं योजना, SDGs 2030',
        topics: [
          {
            id: 'lok-top-4-1',
            titleNe: 'सार्वजनिक खरिद ऐन २०६३, बोलपत्र (Tender) र खरिद विधि',
            titleEn: 'Public Procurement Act 2063 & Tenders',
            ref: 'दफा ८, १४, १५ (सिलबन्दी दरभाउ, टेन्डर)',
            importance: 'Critical',
            quizCategory: 'Loksewa'
          },
          {
            id: 'lok-top-4-2',
            titleNe: 'आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन २०७६ र बजेट चक्र',
            titleEn: 'Fiscal Responsibility Act 2076 & Budget Cycle',
            ref: 'बजेट तर्जुमा, खर्च व्यवस्थापन र लेखापरीक्षण',
            importance: 'High',
            quizCategory: 'Economics'
          },
          {
            id: 'lok-top-4-3',
            titleNe: '१६औं आवधिक योजना (२०८१/८२ - २०८५/८६) र दिगो विकास लक्ष्य (SDGs)',
            titleEn: '16th Five Year Plan & SDGs 2030',
            ref: 'सुशासन, सामाजिक न्याय र समृद्धिका लक्ष्यहरू',
            importance: 'Critical',
            quizCategory: 'Economics'
          }
        ]
      },
      {
        id: 'lok-step-5',
        stepNumber: 5,
        titleNe: 'अन्तर्राष्ट्रिय सम्बन्ध, टिप्पणी लेखन & पूर्ण नमुना परीक्षा',
        titleEn: 'International Relations, Drafting & Final Mocks',
        phaseLabelNe: 'चरण ५: लिखित परीक्षा mastery',
        estimatedHours: 24,
        durationLabelNe: '२ हप्ता',
        targetFocusNe: 'संयुक्त राष्ट्रसंघ, SAARC, BIMSTEC, सरकारी टिप्पणी/प्रतिवेदन लेखन र फुल टेस्ट।',
        syllabusRef: 'UN Charter, द्वितीय पत्र कार्यालय कार्यविधि',
        topics: [
          {
            id: 'lok-top-5-1',
            titleNe: 'संयुक्त राष्ट्रसंघ (UN), SAARC, BIMSTEC र नेपालको परराष्ट्र नीति',
            titleEn: 'United Nations, SAARC & Nepal Foreign Policy',
            ref: 'संविधानको धारा ५१ (ड) परराष्ट्र नीति',
            importance: 'High',
            quizCategory: 'Loksewa'
          },
          {
            id: 'lok-top-5-2',
            titleNe: 'सरकारी टिप्पणी लेखन, निर्णय प्रक्रिया, दर्ता र चलानी',
            titleEn: 'Official Note Writing & Government Office Procedures',
            ref: 'टिप्पणीको ढाँचा र निर्णयको तह',
            importance: 'Critical',
            quizCategory: 'Management'
          },
          {
            id: 'lok-top-5-3',
            titleNe: '१० वटा लोकसेवा प्रथम & द्वितीय पत्र नमुना परीक्षा हल',
            titleEn: 'Full 10 Loksewa Mock Sets Revision',
            ref: '१०० अङ्कको ढाँचामा समय व्यवस्थापन अभ्यास',
            importance: 'Critical',
            quizCategory: 'Loksewa'
          }
        ]
      }
    ]
  },
  NRB: {
    category: 'NRB',
    titleNe: 'नेपाल राष्ट्र बैंक पाठ्यक्रम मार्गचित्र',
    titleEn: 'NRB Central Banking & Regulation Roadmap',
    examCoverageNe: 'नेपाल राष्ट्र बैंक (सहायक ४ र अधिकृत ५)',
    icon: Landmark,
    accentColor: 'from-emerald-600 via-teal-600 to-cyan-600',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300 border-emerald-500/30',
    steps: [
      {
        id: 'nrb-step-1',
        stepNumber: 1,
        titleNe: 'नेपाल राष्ट्र बैंक ऐन २०५८ & केन्द्रीय बैंकिङ सिद्धान्त',
        titleEn: 'NRB Act 2058 & Central Banking Principles',
        phaseLabelNe: 'चरण १: केन्द्रीय बैंकको जग',
        estimatedHours: 18,
        durationLabelNe: '२ हप्ता',
        targetFocusNe: 'राष्ट्र बैंकका ३ मूल उद्देश्यहरू, गभर्नर र सञ्चालक समिति, नोट निष्कासन अधिकार।',
        syllabusRef: 'नेपाल राष्ट्र बैंक ऐन २०५८ दफा ४, १५, १६ र परिच्छेद ४',
        topics: [
          {
            id: 'nrb-top-1-1',
            titleNe: 'नेपाल राष्ट्र बैंक ऐन २०५८: उद्देश्य र स्वायत्तता',
            titleEn: 'NRB Act 2058: Objectives & Autonomy',
            ref: 'दफा ४ (मूल्य, शोधनान्तर, भुक्तानी स्थायित्व)',
            importance: 'Critical',
            quizCategory: 'NRB'
          },
          {
            id: 'nrb-top-1-2',
            titleNe: 'सञ्चालक समितिको गठन, गभर्नरको नियुक्ति र काम, कर्तव्य र अधिकार',
            titleEn: 'Board of Directors & Governor Functions',
            ref: 'दफा १४, १५, १६, १७',
            importance: 'Critical',
            quizCategory: 'NRB'
          },
          {
            id: 'nrb-top-1-3',
            titleNe: 'बैंक नोट निष्कासन एकाधिकार तथा सुरक्षण मौज्दात व्यवस्थापन',
            titleEn: 'Currency Note Issuance & Reserves',
            ref: 'दफा ५२, ५३ (न्यूनतम ५०% सुन, विदेशी मुद्रा)',
            importance: 'High',
            quizCategory: 'NRB'
          }
        ]
      },
      {
        id: 'nrb-step-2',
        stepNumber: 2,
        titleNe: 'मौद्रिक नीति, सञ्चालन ढाँचा & तरलता औजारहरू',
        titleEn: 'Monetary Policy Framework, Operations & Tools',
        phaseLabelNe: 'चरण २: मौद्रिक इन्जिनियरिङ',
        estimatedHours: 20,
        durationLabelNe: '२ हप्ता',
        targetFocusNe: 'चालु मौद्रिक नीति, ब्याजदर कोरिडोर, CRR (४%), SLR, रिपो/रिभर्स रिपो र SLF।',
        syllabusRef: 'वार्षिक मौद्रिक नीति र राष्ट्र बैंक ऐन दफा ४४, ६४',
        topics: [
          {
            id: 'nrb-top-2-1',
            titleNe: 'मौद्रिक नीति तर्जुमा प्रक्रिया, सञ्चालन ढाँचा र मध्यवर्ती लक्ष्यहरू',
            titleEn: 'Monetary Policy Formulation & Framework',
            ref: 'मुद्रा आपूर्ति (M2) र आन्तरिक कर्जा विस्तार लक्ष्य',
            importance: 'Critical',
            quizCategory: 'Economics'
          },
          {
            id: 'nrb-top-2-2',
            titleNe: 'प्रत्यक्ष र अप्रत्यक्ष मौद्रिक उपकरणहरू (CRR, SLR, Bank Rate, Policy Rate)',
            titleEn: 'Monetary Instruments: Direct & Indirect',
            ref: 'CRR ४%, SLR १२%, नीतिगत दर',
            importance: 'Critical',
            quizCategory: 'Economics'
          },
          {
            id: 'nrb-top-2-3',
            titleNe: 'खुल्ला बजार कारोबार (OMO), रिपो, रिभर्स रिपो र ब्याजदर कोरिडोर',
            titleEn: 'Open Market Operations & Interest Rate Corridor',
            ref: 'दफा ६४ र स्थायी तरलता सुविधा (SLF)',
            importance: 'Critical',
            quizCategory: 'Economics'
          }
        ]
      },
      {
        id: 'nrb-step-3',
        stepNumber: 3,
        titleNe: 'विदेशी विनिमय, सञ्चिति व्यवस्थापन & शोधनान्तर स्थिति (BOP)',
        titleEn: 'Foreign Exchange Regulation, Reserves & BOP Analysis',
        phaseLabelNe: 'चरण ३: बाह्य क्षेत्र स्थायित्व',
        estimatedHours: 16,
        durationLabelNe: '१.५ हप्ता',
        targetFocusNe: 'विदेशी विनिमय ऐन २०१९, विदेशी मुद्रा सञ्चिति विविधीकरण र शोधनान्तर खाता।',
        syllabusRef: 'विदेशी विनिमय ऐन २०१९, NRB Forex Directives',
        topics: [
          {
            id: 'nrb-top-3-1',
            titleNe: 'विदेशी विनिमय (नियमित गर्ने) ऐन २०१९ र विनिमय दर प्रणाली',
            titleEn: 'Foreign Exchange Regulation Act 2019',
            ref: 'भारतीय रुपैयाँसँगको स्थिर विनिमय दर (Pegged System)',
            importance: 'Critical',
            quizCategory: 'NRB'
          },
          {
            id: 'nrb-top-3-2',
            titleNe: 'विदेशी मुद्रा सञ्चिति व्यवस्थापन र सुरक्षा, तरलता र प्रतिफल सिद्धान्त',
            titleEn: 'Forex Reserves Management (Safety, Liquidity, Return)',
            ref: 'न्यूनतम ७ महिनाको वस्तु तथा सेवा आयात धान्ने लक्ष्य',
            importance: 'High',
            quizCategory: 'Economics'
          },
          {
            id: 'nrb-top-3-3',
            titleNe: 'शोधनान्तर स्थिति (BOP), चालु खाता, रेमिट्यान्स र बाह्य ऋण',
            titleEn: 'Balance of Payments (BOP) & Remittance',
            ref: 'BPM6 ढाँचा र चालु खाता बचत/घाटा',
            importance: 'Critical',
            quizCategory: 'Economics'
          }
        ]
      },
      {
        id: 'nrb-step-4',
        stepNumber: 4,
        titleNe: 'बैंक सुपरिवेक्षण, CAMELS ढाँचा & प्रणालीगत जोखिम',
        titleEn: 'Banking Supervision, CAMELS Rating & Systemic Risk',
        phaseLabelNe: 'चरण ४: वित्तीय क्षेत्र सुदृढीकरण',
        estimatedHours: 18,
        durationLabelNe: '१.५ हप्ता',
        targetFocusNe: 'स्थलगत र गैर-स्थलगत निरीक्षण, CAMELS रेटिङ, बासेल ३ पूँजी कोष र वित्तीय स्थायित्व।',
        syllabusRef: 'NRB Risk Based Supervision (RBS) Manual',
        topics: [
          {
            id: 'nrb-top-4-1',
            titleNe: 'जोखिममा आधारित सुपरिवेक्षण (RBS) र CAMELS रेटिङ फ्रेमवर्क',
            titleEn: 'Risk Based Supervision & CAMELS Framework',
            ref: 'Capital, Asset, Management, Earnings, Liquidity, Sensitivity',
            importance: 'Critical',
            quizCategory: 'NRB'
          },
          {
            id: 'nrb-top-4-2',
            titleNe: 'बासेल ३ मापदण्ड, पूँजी कोष बफर (CCB) र तनाव परीक्षण (Stress Testing)',
            titleEn: 'Basel III Standards & Stress Testing',
            ref: '११% कुल पूँजी कोष र क्रेडिट जोखिम सिमुलेसन',
            importance: 'Critical',
            quizCategory: 'NRB'
          },
          {
            id: 'nrb-top-4-3',
            titleNe: 'समस्याग्रस्त संस्थाको व्यवस्थापन र अन्तिम ऋणदाता सुविधा (LOLR)',
            titleEn: 'Prompt Corrective Action (PCA) & LOLR',
            ref: 'दफा ६८ र शीघ्र सुधारात्मक कारबाही',
            importance: 'High',
            quizCategory: 'NRB'
          }
        ]
      },
      {
        id: 'nrb-step-5',
        stepNumber: 5,
        titleNe: 'समष्टिगत अर्थशास्त्र, वित्तीय शोध & पूर्ण नमुना परीक्षा',
        titleEn: 'Macroeconomic Analysis, Research & Full Mock Tests',
        phaseLabelNe: 'चरण ५: राष्ट्र बैंक अधिकृत स्तर',
        estimatedHours: 24,
        durationLabelNe: '२ हप्ता',
        targetFocusNe: 'उपभोक्ता मूल्य सूचकांक (मुद्रास्फीति), आर्थिक सर्वेक्षण विश्लेषण, लिखित उत्तर लेखन।',
        syllabusRef: 'आर्थिक सर्वेक्षण, NRB अनुसन्धान प्रतिवेदन र फुल मक टेस्ट',
        topics: [
          {
            id: 'nrb-top-5-1',
            titleNe: 'मुद्रास्फीति (Inflation) मापन, CPI बास्केट र नियन्त्रणका उपायहरू',
            titleEn: 'Inflation Measurement & CPI Basket in Nepal',
            ref: '६.५% मुद्रास्फीति नियन्त्रण लक्ष्य',
            importance: 'Critical',
            quizCategory: 'Economics'
          },
          {
            id: 'nrb-top-5-2',
            titleNe: 'आर्थिक सर्वेक्षण र चालु बजेटका प्रमुख परिसूचकहरूको विश्लेषण',
            titleEn: 'Economic Survey & Fiscal Indicators Analysis',
            ref: 'कुल गार्हस्थ्य उत्पादन (GDP) र आर्थिक वृद्धिदर',
            importance: 'Critical',
            quizCategory: 'Economics'
          },
          {
            id: 'nrb-top-5-3',
            titleNe: '१० वटा नेपाल राष्ट्र बैंक विशेष पूर्ण नमुना परीक्षा सेट',
            titleEn: '10 NRB Full Mock Examination Sets',
            ref: 'प्रथम र द्वितीय पत्र समय-सीमा सहितको अभ्यास',
            importance: 'Critical',
            quizCategory: 'NRB'
          }
        ]
      }
    ]
  }
};

const ROADMAP_STORAGE_KEY = 'btn_exam_roadmap_completed_topics_v1';

export const ExamRoadmap: React.FC = () => {
  const { user, setActiveTab, openNoteReader, startQuiz, addToast } = useApp();

  // Detect user's preferred category or default to Banking
  const initialCategory: ExamCategoryKey = useMemo(() => {
    const target = user?.targetExam?.toLowerCase() || '';
    if (target.includes('nrb') || target.includes('राष्ट्र बैंक')) return 'NRB';
    if (target.includes('loksewa') || target.includes('अधिकृत') || target.includes('नासु')) return 'Loksewa';
    return 'Banking';
  }, [user?.targetExam]);

  const [selectedCategory, setSelectedCategory] = useState<ExamCategoryKey>(initialCategory);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Completed topic IDs stored in localStorage
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(ROADMAP_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Seed sensible defaults for user encouragement
    return [
      'bank-top-1-1', 'bank-top-1-2', 'bank-top-2-1',
      'lok-top-1-1', 'lok-top-1-2',
      'nrb-top-1-1', 'nrb-top-1-2'
    ];
  });

  // Keep state updated in storage
  const saveCompletedTopicIds = (ids: string[]) => {
    setCompletedTopicIds(ids);
    try {
      localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(ids));
    } catch {}
  };

  const currentRoadmap = EXAM_ROADMAPS[selectedCategory];
  const steps = currentRoadmap.steps;
  const currentStep = steps[activeStepIndex] || steps[0];

  // Calculate completion metrics
  const totalTopicsInRoadmap = useMemo(() => {
    return steps.reduce((sum, s) => sum + s.topics.length, 0);
  }, [steps]);

  const completedTopicsInRoadmap = useMemo(() => {
    const allTopicIds = steps.flatMap(s => s.topics.map(t => t.id));
    return allTopicIds.filter(id => completedTopicIds.includes(id)).length;
  }, [steps, completedTopicIds]);

  const roadmapPercentage = totalTopicsInRoadmap > 0
    ? Math.round((completedTopicsInRoadmap / totalTopicsInRoadmap) * 100)
    : 0;

  // Calculate step-level completion
  const stepStats = useMemo(() => {
    return steps.map((step, idx) => {
      const stepTopicIds = step.topics.map(t => t.id);
      const completedCount = stepTopicIds.filter(id => completedTopicIds.includes(id)).length;
      const isComplete = completedCount === stepTopicIds.length && stepTopicIds.length > 0;
      const isInProgress = completedCount > 0 && completedCount < stepTopicIds.length;
      return {
        stepIndex: idx,
        isComplete,
        isInProgress,
        completedCount,
        totalCount: stepTopicIds.length,
        percentage: Math.round((completedCount / stepTopicIds.length) * 100)
      };
    });
  }, [steps, completedTopicIds]);

  const completedStepsCount = stepStats.filter(s => s.isComplete).length;

  // Toggle single topic completion
  const handleToggleTopic = (topicId: string, topicTitle: string) => {
    const exists = completedTopicIds.includes(topicId);
    let updated: string[];
    if (exists) {
      updated = completedTopicIds.filter(id => id !== topicId);
      addToast(`विषय बाँकी सूचीमा राखियो: ${topicTitle.slice(0, 24)}...`, 'info');
    } else {
      updated = [...completedTopicIds, topicId];
      addToast(`✓ विषय सम्पन्न भयो! +१५ XP: ${topicTitle.slice(0, 24)}...`, 'success');
      try {
        confetti({
          particleCount: 20,
          spread: 45,
          origin: { y: 0.7 }
        });
      } catch {}
    }
    saveCompletedTopicIds(updated);

    // Also sync with ExamProgressService if matching
    try {
      ExamProgressService.toggleTopic(selectedCategory, topicId);
    } catch {}
  };

  // Toggle whole step completion
  const handleToggleStepAll = () => {
    const stepTopicIds = currentStep.topics.map(t => t.id);
    const allDone = stepTopicIds.every(id => completedTopicIds.includes(id));

    let updated: string[];
    if (allDone) {
      // Mark all in this step as not done
      updated = completedTopicIds.filter(id => !stepTopicIds.includes(id));
      addToast(`चरण ${currentStep.stepNumber} का सबै विषयहरू पुनर्अभ्यासका लागि खुला गरियो`, 'info');
    } else {
      // Mark all in this step as done
      const toAdd = stepTopicIds.filter(id => !completedTopicIds.includes(id));
      updated = [...completedTopicIds, ...toAdd];
      addToast(`🎉 बधाई छ! चरण ${currentStep.stepNumber} सफलतापूर्वक सम्पन्न भयो! +५० XP`, 'success');
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
    saveCompletedTopicIds(updated);
  };

  // Launch Practice Quiz for this step
  const handleStartStepQuiz = () => {
    const primaryQuizCat = currentStep.topics[0]?.quizCategory || selectedCategory;
    const questions = getQuestionsByCategory(primaryQuizCat, 10, 'Medium');
    const quizQuestions = questions.map(convertQuizQuestionToQuestion);

    const quizSet: QuizSet = {
      id: `step-quiz-${currentStep.id}-${Date.now()}`,
      title: `${currentStep.phaseLabelNe}: अभ्यास क्विज`,
      description: `${currentStep.titleNe} अन्तर्गतका १० मुख्य परीक्षा प्रश्नहरू`,
      category: selectedCategory,
      difficulty: 'Medium',
      mode: 'practice',
      timeLimitMinutes: 7,
      questions: quizQuestions,
      badge: `Phase ${currentStep.stepNumber}`
    };

    startQuiz(quizSet);
  };

  const IconComponent = currentRoadmap.icon;

  return (
    <div 
      id="exam-roadmap-dashboard-widget"
      className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-all"
    >
      {/* ================================================================= */}
      {/* 1. HEADER & EXAM TRACK SELECTOR                                   */}
      {/* ================================================================= */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-sky-500/15 text-sky-700 dark:text-[#38BDF8] border border-sky-400/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#38BDF8]" />
              पाठ्यक्रम मार्गचित्र (Exam Roadmap)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-[#4ADE80] border border-emerald-400/30 text-xs font-bold flex items-center gap-1">
              <Target className="w-3 h-3" /> ५-चरण ढाँचा (5-Step Stepper)
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#FFFFFF] tracking-tight flex items-center gap-2.5">
            <span>{currentRoadmap.titleNe}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 font-medium max-w-2xl">
            {currentRoadmap.examCoverageNe} को सम्पूर्ण पाठ्यक्रमलाई ५ चरणमा विभाजन गरिएको अन्तरक्रियात्मक मार्गचित्र।
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shrink-0 w-full sm:w-auto overflow-x-auto">
          {(['Banking', 'Loksewa', 'NRB'] as ExamCategoryKey[]).map(catKey => {
            const config = EXAM_ROADMAPS[catKey];
            const CatIcon = config.icon;
            const isSelected = selectedCategory === catKey;

            return (
              <button
                key={catKey}
                type="button"
                onClick={() => {
                  setSelectedCategory(catKey);
                  setActiveStepIndex(0);
                }}
                className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-[#FFFFFF] shadow-sm border border-slate-200/80 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#FFFFFF]'
                }`}
              >
                <CatIcon className={`w-3.5 h-3.5 ${
                  catKey === 'Banking' ? 'text-sky-500' : catKey === 'Loksewa' ? 'text-amber-500' : 'text-emerald-500'
                }`} />
                <span>{catKey === 'Banking' ? 'वाणिज्य बैंकिङ' : catKey === 'Loksewa' ? 'लोकसेवा आयोग' : 'नेपाल राष्ट्र बैंक'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. OVERALL READINESS & STEPPER OVERVIEW METRICS                    */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-600 dark:text-[#38BDF8] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
              सम्पन्न चरणहरू (Steps Cleared)
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-[#FFFFFF]">
              {completedStepsCount} / {steps.length} चरण पूरा
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-600 dark:text-[#4ADE80] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
              पाठ्यक्रम विषय कभरेज
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-[#FFFFFF]">
              {completedTopicsInRoadmap} / {totalTopicsInRoadmap} मुख्य विषयहरू
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-500 dark:text-slate-400">तयारी तत्परता</span>
              <span className="text-amber-600 dark:text-amber-400 font-black">{roadmapPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${roadmapPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 3. INTERACTIVE STEPPER PROGRESS TRACK (1 TO 5)                     */}
      {/* ================================================================= */}
      <div className="relative pt-2">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-3 scrollbar-thin">
          {steps.map((step, idx) => {
            const stats = stepStats[idx];
            const isActive = activeStepIndex === idx;

            return (
              <div key={step.id} className="flex-1 min-w-[130px] sm:min-w-[160px] relative">
                
                {/* Connecting track line between nodes */}
                {idx < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-5 left-[50%] right-[-50%] h-1 z-0">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        stats.isComplete
                          ? 'bg-emerald-500 dark:bg-emerald-400'
                          : stats.isInProgress
                            ? 'bg-sky-500/60 dark:bg-sky-400/60'
                            : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    />
                  </div>
                )}

                {/* Step Node Button */}
                <button
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`w-full text-center relative z-10 flex flex-col items-center group cursor-pointer p-2 rounded-2xl transition-all ${
                    isActive 
                      ? 'bg-sky-50/80 dark:bg-sky-950/40 ring-2 ring-sky-500/50 shadow-xs' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {/* Step Circle / Badge */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 shadow-sm ${
                    stats.isComplete
                      ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                      : isActive
                        ? 'bg-sky-600 text-white ring-4 ring-sky-400/30 scale-105'
                        : stats.isInProgress
                          ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border-2 border-sky-500'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                  }`}>
                    {stats.isComplete ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : (
                      <span>{step.stepNumber}</span>
                    )}
                  </div>

                  {/* Step Label */}
                  <span className={`text-[11px] font-black mt-2 leading-tight ${
                    isActive 
                      ? 'text-sky-600 dark:text-[#38BDF8]' 
                      : stats.isComplete 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-slate-700 dark:text-[#FFFFFF]'
                  }`}>
                    {step.phaseLabelNe.split(':')[0]}
                  </span>

                  <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[140px] font-medium">
                    {stats.completedCount}/{stats.totalCount} पूरा
                  </span>

                  {isActive && (
                    <span className="mt-1 px-2 py-0.2 rounded-full bg-sky-500 text-white text-[9px] font-black tracking-wide uppercase animate-pulse">
                      सक्रिय (Active)
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================================================= */}
      {/* 4. ACTIVE STEP DETAILS CARD & SYLLABUS CHECKLIST                   */}
      {/* ================================================================= */}
      <div 
        id="active-roadmap-step-card"
        className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-5 relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500 text-white font-black text-xs">
                {currentStep.phaseLabelNe}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-[#FFFFFF] text-xs font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-500" />
                {currentStep.estimatedHours} घण्टा • {currentStep.durationLabelNe}
              </span>
              {stepStats[activeStepIndex]?.isComplete && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[#4ADE80] border border-emerald-500/40 text-xs font-black flex items-center gap-1">
                  <Check className="w-3 h-3" /> यो चरण सम्पन्न भयो
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-[#FFFFFF] tracking-tight">
              {currentStep.titleNe}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {currentStep.titleEn}
            </p>
          </div>

          {/* Quick Mark All Done / Redo for This Step */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleToggleStepAll}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                stepStats[activeStepIndex]?.isComplete
                  ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {stepStats[activeStepIndex]?.isComplete 
                  ? 'फेरि अध्ययन गर्नुहोस् (Reopen Step)' 
                  : 'यो चरण पूर्ण भयो चिन्ह लगाउनुहोस् (Mark Step Done)'}
              </span>
            </button>
          </div>
        </div>

        {/* Target Objective Box */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs flex items-start gap-2.5">
          <Flag className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900 dark:text-[#FFFFFF]">
              यस चरणको मुख्य परीक्षा लक्ष्य (Phase Objective):
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {currentStep.targetFocusNe}
            </p>
          </div>
        </div>

        {/* Syllabus Topic Items with Toggleable Checkboxes */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
            <span>अध्ययन विषय सूची (Checklist):</span>
            <span>
              {stepStats[activeStepIndex]?.completedCount} / {currentStep.topics.length} विषय पूरा
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {currentStep.topics.map(topic => {
              const isChecked = completedTopicIds.includes(topic.id);

              return (
                <div
                  key={topic.id}
                  onClick={() => handleToggleTopic(topic.id, topic.titleNe)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 group ${
                    isChecked
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      type="button"
                      aria-label="Toggle completion"
                      className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition ${
                        isChecked
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-slate-300 dark:border-slate-600 group-hover:border-sky-500'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-xs sm:text-sm font-black tracking-tight leading-snug ${
                          isChecked 
                            ? 'text-emerald-900 dark:text-emerald-200 line-through opacity-85' 
                            : 'text-slate-900 dark:text-[#FFFFFF]'
                        }`}>
                          {topic.titleNe}
                        </h4>
                        {topic.importance === 'Critical' && (
                          <span className="px-2 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-black border border-rose-300 dark:border-rose-800">
                            CRITICAL
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {topic.titleEn} • <span className="text-sky-600 dark:text-[#38BDF8] font-bold">{topic.ref}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold shrink-0 ${
                    isChecked ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 group-hover:text-sky-500'
                  }`}>
                    {isChecked ? 'सम्पन्न' : 'बाँकी'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Phase Action Toolbar */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleStartStepQuiz}
              className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>यस चरणको क्विज अभ्यास गर्नुहोस्</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('free-notes')}
              className="py-2.5 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-500" />
              <span className="hidden sm:inline">नोट्स</span>
            </button>
          </div>

          {/* Stepper Prev / Next Navigation Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              type="button"
              disabled={activeStepIndex === 0}
              onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                activeStepIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-[#FFFFFF] hover:bg-slate-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>अघिल्लो चरण</span>
            </button>

            <button
              type="button"
              disabled={activeStepIndex === steps.length - 1}
              onClick={() => setActiveStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                activeStepIndex === steps.length - 1
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : 'bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 text-sky-700 dark:text-[#38BDF8] hover:bg-sky-100'
              }`}
            >
              <span>पछिल्लो चरण</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ExamRoadmap;
