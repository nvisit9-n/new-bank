import { QuizSet, SubjectCategory } from '../types';
import { ALL_QUIZ_QUESTIONS, MOCK_COURSES } from './mockData';
import { convertQuizQuestionToQuestion } from './quizData';
import { safeStorage } from '../utils/safeHelpers';
import { ActivityTrackingService } from '../services/activityTrackingService';

export interface LevelSyllabusTopic {
  id: string;
  code: string;
  nameNe: string;
  nameEn: string;
  paper: 'Paper I' | 'Paper II';
  sectionNe: string;
  sectionEn: string;
  marks: number;
  questionTypeNe: string;
  questionTypeEn: string;
  noteRefId?: string;
  detailsNe: string[];
  detailsEn: string[];
}

export interface LevelSyllabusPaper {
  paperNumber: 'Paper I' | 'Paper II';
  titleNe: string;
  titleEn: string;
  fullMarks: number;
  passMarks: number;
  timeLimitNe: string;
  timeLimitEn: string;
  examTypeNe: string;
  examTypeEn: string;
  sections: {
    sectionId: string;
    sectionNameNe: string;
    sectionNameEn: string;
    weightageMarks: number;
    topics: LevelSyllabusTopic[];
  }[];
}

export interface LevelCategoryData {
  categoryId: string;
  categoryNameNe: string;
  categoryNameEn: string;
  levels: {
    level: '4' | '5' | '6';
    levelLabelNe: string;
    levelLabelEn: string;
    papers: LevelSyllabusPaper[];
    totalTopics: number;
    totalMarks: number;
  }[];
}

export const LEVEL_SYLLABUS_DATABASE: Record<string, LevelCategoryData> = {
  banking: {
    categoryId: 'banking',
    categoryNameNe: 'बैंकिङ क्षेत्र (Banking Sector)',
    categoryNameEn: 'Banking Sector (NRB, RBB, NBL, ADBL)',
    levels: [
      {
        level: '4',
        levelLabelNe: 'तह ४ (सहायक / Assistant Level 4)',
        levelLabelEn: 'Level 4 (Assistant)',
        totalTopics: 12,
        totalMarks: 200,
        papers: [
          {
            paperNumber: 'Paper I',
            titleNe: 'प्रथम पत्र: सामान्य ज्ञान, बौद्धिक परीक्षण तथा व्यवस्थापन',
            titleEn: 'Paper I: General Knowledge, IQ, Banking & Management',
            fullMarks: 100,
            passMarks: 40,
            timeLimitNe: '४५ मिनेट',
            timeLimitEn: '45 Minutes',
            examTypeNe: '५० वस्तुगत बहुवैकल्पिक प्रश्न (MCQs) • नेगेटिभ मार्किङ ०.२',
            examTypeEn: '50 Objective MCQs • Negative Marking 0.2',
            sections: [
              {
                sectionId: 'sec-p1-gk',
                sectionNameNe: 'खण्ड (क): सामान्य ज्ञान तथा समसामयिक (General Knowledge)',
                sectionNameEn: 'Section A: General Knowledge & Current Affairs',
                weightageMarks: 30,
                topics: [
                  {
                    id: 'b4-p1-01',
                    code: '१.१',
                    nameNe: 'नेपालको भूगोल, ऐतिहासिक विकास र प्रशासनिक संरचना',
                    nameEn: 'Geography, History and Administrative Structure of Nepal',
                    paper: 'Paper I',
                    sectionNe: 'खण्ड (क) सामान्य ज्ञान',
                    sectionEn: 'Section A GK',
                    marks: 10,
                    questionTypeNe: '५ वस्तुगत प्रश्न (MCQs)',
                    questionTypeEn: '5 MCQs',
                    noteRefId: 'note-geography',
                    detailsNe: ['धरातलीय स्वरूप, नदीनाला, तालतलैया र जलवायु', '७७ जिल्ला र ७ प्रदेशको प्रशासनिक विभाजन', 'नेपालको ऐतिहासिक कालखण्ड'],
                    detailsEn: ['Topography, rivers, lakes and climate', '77 districts and 7 provinces', 'Historical milestones of Nepal']
                  },
                  {
                    id: 'b4-p1-02',
                    code: '१.२',
                    nameNe: 'नेपाली अर्थतन्त्र, बजेट प्रणाली र मौद्रिक नीति',
                    nameEn: 'Nepalese Economy, Budgeting and Monetary Policy',
                    paper: 'Paper I',
                    sectionNe: 'खण्ड (क) सामान्य ज्ञान',
                    sectionEn: 'Section A GK',
                    marks: 10,
                    questionTypeNe: '५ वस्तुगत प्रश्न (MCQs)',
                    questionTypeEn: '5 MCQs',
                    noteRefId: 'note-monetary-policy',
                    detailsNe: ['नेपालको कुल गार्हस्थ्य उत्पादन (GDP) संरचना', 'चालू आवको बजेटका मुख्य प्राथमिकता', 'नेपाल राष्ट्र बैंकको मौद्रिक नीति दरहरू (CRR, SLR, Policy Rate)'],
                    detailsEn: ['GDP structure of Nepal', 'Current fiscal budget priorities', 'Monetary policy rates (CRR 4%, SLR 12%)']
                  },
                  {
                    id: 'b4-p1-03',
                    code: '१.३',
                    nameNe: 'अन्तर्राष्ट्रिय संघसंस्था तथा राष्ट्रिय/अन्तर्राष्ट्रिय समसामयिक घटनाक्रम',
                    nameEn: 'International Organizations & Current Affairs',
                    paper: 'Paper I',
                    sectionNe: 'खण्ड (क) सामान्य ज्ञान',
                    sectionEn: 'Section A GK',
                    marks: 10,
                    questionTypeNe: '५ वस्तुगत प्रश्न (MCQs)',
                    questionTypeEn: '5 MCQs',
                    noteRefId: 'note-current-affairs',
                    detailsNe: ['संयुक्त राष्ट्रसंघ (UN), SAARC, BIMSTEC र विश्व बैंक', 'राष्ट्रिय पुरस्कार, खेलकुद तथा आर्थिक सूचकाङ्क'],
                    detailsEn: ['UN, SAARC, BIMSTEC and World Bank', 'National awards, sports and economic indicators']
                  }
                ]
              },
              {
                sectionId: 'sec-p1-acts',
                sectionNameNe: 'खण्ड (ख): बैंकिङ ऐन, नियम तथा संस्थागत सुशासन',
                sectionNameEn: 'Section B: Banking Acts, Laws & Governance',
                weightageMarks: 40,
                topics: [
                  {
                    id: 'b4-p1-04',
                    code: '२.१',
                    nameNe: 'नेपाल राष्ट्र बैंक ऐन, २०५८ (उद्देश्य, काम, कर्तव्य र अधिकार)',
                    nameEn: 'Nepal Rastra Bank Act, 2058 (Objectives & Functions)',
                    paper: 'Paper I',
                    sectionNe: 'खण्ड (ख) ऐन नियम',
                    sectionEn: 'Section B Acts',
                    marks: 15,
                    questionTypeNe: '७ वस्तुगत प्रश्न (MCQs)',
                    questionTypeEn: '7 MCQs',
                    noteRefId: 'note-nrb-act-bare-act',
                    detailsNe: ['सञ्चालक समिति गठन र गभर्नरको नियुक्ति', 'बैंक नोट निष्कासन एकाधिकार (दफा ५२)', 'विदेशी विनिमय सञ्चिति व्यवस्थापन'],
                    detailsEn: ['Board composition & Governor appointment', 'Banknote issuance monopoly (Sec 52)', 'Forex reserve management']
                  },
                  {
                    id: 'b4-p1-05',
                    code: '२.२',
                    nameNe: 'बैंक तथा वित्तीय संस्था सम्बन्धी ऐन, २०७३ (BAFIA)',
                    nameEn: 'Bank and Financial Institutions Act, 2073 (BAFIA)',
                    paper: 'Paper I',
                    sectionNe: 'खण्ड (ख) ऐन नियम',
                    sectionEn: 'Section B Acts',
                    marks: 15,
                    questionTypeNe: '७ वस्तुगत प्रश्न (MCQs)',
                    questionTypeEn: '7 MCQs',
                    noteRefId: 'note-bafia-bare-act',
                    detailsNe: ['क, ख, ग, घ वर्गका इजाजतपत्र प्राप्त संस्थाहरूको कार्यक्षेत्र (दफा ४९)', 'कर्जा प्रवाह र धितो व्यवस्था', 'समस्याग्रस्त वित्तीय संस्था र कारबाही'],
                    detailsEn: ['Scope of Class A, B, C, D institutions', 'Credit issuance & collateral norms', 'Problematic institutions resolution']
                  },
                  {
                    id: 'b4-p1-06',
                    code: '२.३',
                    nameNe: 'बैंकिङ कसूर तथा सजाय ऐन, २०६४ र सम्पत्ति शुद्धीकरण निवारण ऐन',
                    nameEn: 'Banking Offence Act, 2064 & AML/CFT Act, 2064',
                    paper: 'Paper I',
                    sectionNe: 'खण्ड (ख) ऐन नियम',
                    sectionEn: 'Section B Acts',
                    marks: 10,
                    questionTypeNe: '६ वस्तुगत प्रश्न (MCQs)',
                    questionTypeEn: '6 MCQs',
                    noteRefId: 'note-aml-kyc',
                    detailsNe: ['अनाधिकृत चेक जारी, ओभरड्राफ्ट दुरुपयोग र जालसाजी', 'ग्राहक पहिचान (KYC) र शंकास्पद कारोबार प्रतिवेदन (STR)'],
                    detailsEn: ['Dishonored cheques, loan fraud and forged accounts', 'KYC compliance & Suspicious Transaction Reporting (STR)']
                  }
                ]
              },
              {
                sectionId: 'sec-p1-iq-math',
                sectionNameNe: 'खण्ड (ग): बौद्धिक परीक्षण (IQ) तथा गणित (Mathematics)',
                sectionNameEn: 'Section C: Logical Reasoning (IQ) & Mathematics',
                weightageMarks: 30,
                topics: [
                  {
                    id: 'b4-p1-07',
                    code: '३.१',
                    nameNe: 'साधारण र चक्रीय ब्याज, नाफा र नोक्सान, ऐकिक नियम',
                    nameEn: 'Simple & Compound Interest, Profit & Loss, Unitary Method',
                    paper: 'Paper I',
                    sectionNe: 'खण्ड (ग) गणित',
                    sectionEn: 'Section C Math',
                    marks: 15,
                    questionTypeNe: '७ वस्तुगत प्रश्न (MCQs)',
                    questionTypeEn: '7 MCQs',
                    noteRefId: 'note-nrb-math-master',
                    detailsNe: ['ब्याज हिसाब र समय मान', 'छुट, नाफा-नोक्सान र प्रतिशत', 'काम र समयको ऐकिक समाधान'],
                    detailsEn: ['Interest calculation & time value', 'Discounts, profit/loss and percentages', 'Work & time unitary problem solving']
                  },
                  {
                    id: 'b4-p1-08',
                    code: '३.२',
                    nameNe: 'भर्बल र नन-भर्बल तार्किक विश्लेषण (IQ Series, Analogy, Coding)',
                    nameEn: 'Verbal & Non-Verbal IQ (Series, Analogy, Coding-Decoding)',
                    paper: 'Paper I',
                    sectionNe: 'खण्ड (ग) IQ',
                    sectionEn: 'Section C IQ',
                    marks: 15,
                    questionTypeNe: '८ वस्तुगत प्रश्न (MCQs)',
                    questionTypeEn: '8 MCQs',
                    noteRefId: 'note-it-fundamentals',
                    detailsNe: ['संख्या र अक्षर अनुक्रम (Number & Letter Series)', 'दिशा, दुरी र रक्तसम्बन्ध (Direction & Blood Relations)', 'आकृतिको वर्गीकरण'],
                    detailsEn: ['Number and letter series patterns', 'Direction, distance and relation puzzles', 'Visual matrix classification']
                  }
                ]
              }
            ]
          },
          {
            paperNumber: 'Paper II',
            titleNe: 'द्वितीय पत्र: विषयगत (बैंकिङ, लेखा, व्यवस्थापन, अर्थशास्त्र र कम्प्युटर)',
            titleEn: 'Paper II: Subjective (Banking, Accounting, Management, Economics, IT)',
            fullMarks: 100,
            passMarks: 40,
            timeLimitNe: '३ घण्टा',
            timeLimitEn: '3 Hours',
            examTypeNe: 'विषयगत विश्लेषणात्मक (१० x ५ अंक = ५०, ५ x १० अंक = ५०)',
            examTypeEn: 'Subjective Analytical (10 questions x 5 marks + 5 questions x 10 marks)',
            sections: [
              {
                sectionId: 'sec-p2-banking',
                sectionNameNe: 'खण्ड (क): बैंकिङ कारोबार तथा व्यापार वित्त (Banking Operations)',
                sectionNameEn: 'Section A: Banking Operations & Trade Finance',
                weightageMarks: 35,
                topics: [
                  {
                    id: 'b4-p2-01',
                    code: '१.१',
                    nameNe: 'निक्षेप परिचालन, कर्जा प्रवाह, वर्गीकरण र नोक्सानी व्यवस्था',
                    nameEn: 'Deposit Mobilization, Credit Classification & Loan Loss Provisioning',
                    paper: 'Paper II',
                    sectionNe: 'खण्ड (क) बैंकिङ',
                    sectionEn: 'Section A Banking',
                    marks: 15,
                    questionTypeNe: 'विषयगत विश्लेषणात्मक प्रश्न (१० अंक)',
                    questionTypeEn: '10 Marks Analytical',
                    noteRefId: 'note-deposit-credit',
                    detailsNe: ['चालू, बचत र मुद्दती निक्षेपको विशेषता', 'सक्रिय कर्जा (असल, सूक्ष्म निगरानी) र निष्कृय कर्जा (कमसल, शंकास्पद, खराब)', 'कर्जा नोक्सानी व्यवस्था दरहरू (१.२% देखि १००%)'],
                    detailsEn: ['Current, savings and fixed deposit features', 'Pass, Watchlist, Substandard, Doubtful & Loss loans', 'Provisioning rates (1.2% to 100%)']
                  },
                  {
                    id: 'b4-p2-02',
                    code: '१.२',
                    nameNe: 'प्रतीतपत्र (Letter of Credit) र बैंक जमानत (Bank Guarantee)',
                    nameEn: 'Letter of Credit (LC) and Bank Guarantee Operations',
                    paper: 'Paper II',
                    sectionNe: 'खण्ड (क) बैंकिङ',
                    sectionEn: 'Section A Banking',
                    marks: 10,
                    questionTypeNe: 'विषयगत प्रश्न (५/१० अंक)',
                    questionTypeEn: '5/10 Marks',
                    noteRefId: 'note-trade-finance-lc-bg',
                    detailsNe: ['प्रतीतपत्रका पक्षहरू र UCPDC 600 का प्रावधान', 'Bid Bond, Performance Bond र Advance Payment Guarantee'],
                    detailsEn: ['Parties to LC and UCPDC 600 norms', 'Tender guarantees and advance payment security']
                  }
                ]
              },
              {
                sectionId: 'sec-p2-acc-mgmt',
                sectionNameNe: 'खण्ड (ख): लेखा तथा व्यवस्थापन (Accounting & Management)',
                sectionNameEn: 'Section B: Accounting & Management Fundamentals',
                weightageMarks: 35,
                topics: [
                  {
                    id: 'b4-p2-03',
                    code: '२.१',
                    nameNe: 'दोहोरो लेखा प्रणाली, गोश्वारा भौचर, लेजर र सन्तुलन परीक्षण',
                    nameEn: 'Double Entry System, Journal, Ledger & Trial Balance',
                    paper: 'Paper II',
                    sectionNe: 'खण्ड (ख) लेखा',
                    sectionEn: 'Section B Accounting',
                    marks: 15,
                    questionTypeNe: 'विषयगत व्यावहारिक प्रश्न (१० अंक)',
                    questionTypeEn: '10 Marks Numerical/Theory',
                    noteRefId: 'note-accounting-basics',
                    detailsNe: ['लेखाका सिद्धान्त र मान्यताहरू', 'बैंक हिसाब मिलान विवरण (BRS) बनाउने विधि', 'अन्तिम हिसाब र वासलात विश्लेषण'],
                    detailsEn: ['Accounting principles & conventions', 'Bank Reconciliation Statement step-by-step', 'Balance sheet and P&L analysis']
                  },
                  {
                    id: 'b4-p2-04',
                    code: '२.२',
                    nameNe: 'व्यवस्थापन सिद्धान्त, संस्थागत सुशासन र ग्राहक सेवा',
                    nameEn: 'Management Principles, Good Governance & Customer Care',
                    paper: 'Paper II',
                    sectionNe: 'खण्ड (ख) व्यवस्थापन',
                    sectionEn: 'Section B Mgmt',
                    marks: 10,
                    questionTypeNe: 'विषयगत प्रश्न (५/१० अंक)',
                    questionTypeEn: '5/10 Marks',
                    noteRefId: 'note-public-admin',
                    detailsNe: ['योजना, संगठन, नेतृत्व, उत्प्रेरणा र नियन्त्रण', 'बैंकिङ क्षेत्रमा ग्राहक सम्बन्ध व्यवस्थापन (CRM)', 'नागरिक बडापत्र र गुनासो व्यवस्थापन'],
                    detailsEn: ['Planning, organizing, leadership and control', 'Customer relationship management in banks', 'Citizen charter & grievance handling']
                  }
                ]
              },
              {
                sectionId: 'sec-p2-it',
                sectionNameNe: 'खण्ड (ग): कम्प्युटर तथा सूचना प्रविधि (Computer & IT in Banking)',
                sectionNameEn: 'Section C: Computer & Information Technology',
                weightageMarks: 30,
                topics: [
                  {
                    id: 'b4-p2-05',
                    code: '३.१',
                    nameNe: 'Core Banking System (CBS), साइबर सुरक्षा र विद्युतीय भुक्तानी',
                    nameEn: 'Core Banking System (CBS), Cybersecurity & Digital Payments',
                    paper: 'Paper II',
                    sectionNe: 'खण्ड (ग) सूचना प्रविधि',
                    sectionEn: 'Section C IT',
                    marks: 15,
                    questionTypeNe: 'विषयगत प्रश्न (५/१० अंक)',
                    questionTypeEn: '5/10 Marks',
                    noteRefId: 'note-nrb-it-master',
                    detailsNe: ['RTGS, IPS, connectIPS र QR भुक्तानी प्रणाली', 'NRB IT Guidelines २०६९ र डेटा सुरक्षा', 'बैंकिङ साइबर जोखिम न्यूनीकरण'],
                    detailsEn: ['RTGS, IPS, connectIPS and QR payment rails', 'NRB IT Guidelines and information security', 'Mitigating cyber threats in banking']
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        level: '5',
        levelLabelNe: 'तह ५ (वरिष्ठ सहायक / Senior Assistant)',
        levelLabelEn: 'Level 5 (Senior Assistant / Supervisor)',
        totalTopics: 14,
        totalMarks: 200,
        papers: [
          {
            paperNumber: 'Paper I',
            titleNe: 'प्रथम पत्र: बैंकिङ ज्ञान, ऐन नियम, अर्थशास्त्र तथा गणित',
            titleEn: 'Paper I: Banking, Laws, Economics & Advanced Math',
            fullMarks: 100,
            passMarks: 40,
            timeLimitNe: '४५ मिनेट',
            timeLimitEn: '45 Minutes',
            examTypeNe: '५० वस्तुगत प्रश्न (MCQs) • नेगेटिभ मार्किङ ०.२',
            examTypeEn: '50 MCQs • Negative Marking 0.2',
            sections: [
              {
                sectionId: 'sec-b5-p1-core',
                sectionNameNe: 'खण्ड (क): बैंकिङ निर्देशन, तरलता व्यवस्थापन र पुँजी पर्याप्तता',
                sectionNameEn: 'Section A: Directives, Liquidity & Capital Adequacy',
                weightageMarks: 40,
                topics: [
                  {
                    id: 'b5-p1-01',
                    code: '१.१',
                    nameNe: 'NRB एकीकृत निर्देशन १ देखि २१ (Unified Directives Master)',
                    nameEn: 'NRB Unified Directives 1 to 21 (Capital & Provisioning)',
                    paper: 'Paper I',
                    sectionNe: 'खण्ड (क) निर्देशन',
                    sectionEn: 'Section A Directives',
                    marks: 15,
                    questionTypeNe: '८ वस्तुगत प्रश्न (MCQs)',
                    questionTypeEn: '8 MCQs',
                    noteRefId: 'note-nrb-unified-directives-master',
                    detailsNe: ['पुँजी कोष (CAR - Tier 1 & Tier 2) मापदण्ड', 'एकल ग्राहक कर्जा सीमा (Single Obligor Limit)', 'विदेशी मुद्रा खुला स्थिति (Net Open Position)'],
                    detailsEn: ['Capital Adequacy Ratio (CAR 11%) standards', 'Single Obligor Limit ceilings', 'Foreign exchange net open position limits']
                  },
                  {
                    id: 'b5-p1-02',
                    code: '१.२',
                    nameNe: 'तरलता व्यवस्थापन, CD Ratio र खुला बजार कारोबार',
                    nameEn: 'Liquidity Management, CD Ratio & Open Market Operations',
                    paper: 'Paper I',
                    sectionNe: 'खण्ड (क) तरलता',
                    sectionEn: 'Section A Liquidity',
                    marks: 15,
                    questionTypeNe: '७ वस्तुगत प्रश्न (MCQs)',
                    questionTypeEn: '7 MCQs',
                    noteRefId: 'note-monetary-policy',
                    detailsNe: ['क्रेडिट-डिपोजिट अनुपात (CD Ratio ९०% सीमा)', 'रिपो (Repo) र रिभर्स रिपो (Reverse Repo)', 'Standing Deposit Facility (SDF) संयन्त्र'],
                    detailsEn: ['Credit-Deposit ratio 90% ceiling', 'Repo and reverse repo instruments', 'Standing Deposit Facility mechanism']
                  }
                ]
              },
              {
                sectionId: 'sec-b5-p1-econ',
                sectionNameNe: 'खण्ड (ख): मैक्रो-इकोनोमिक्स र वित्तीय बजार विश्लेषण',
                sectionNameEn: 'Section B: Macroeconomics & Financial Markets',
                weightageMarks: 30,
                topics: [
                  {
                    id: 'b5-p1-03',
                    code: '२.१',
                    nameNe: 'मुद्रास्फीति, शोधनान्तर स्थिति (BOP) र रेमिट्यान्स',
                    nameEn: 'Inflation, Balance of Payments (BOP) & Remittance',
                    paper: 'Paper I',
                    sectionNe: 'खण्ड (ख) अर्थशास्त्र',
                    sectionEn: 'Section B Economics',
                    marks: 15,
                    questionTypeNe: '७ वस्तुगत प्रश्न (MCQs)',
                    questionTypeEn: '7 MCQs',
                    noteRefId: 'note-macro-economics',
                    detailsNe: ['उपभोक्ता मुद्रास्फीति (CPI) मापन विधि', 'चालू खाता र पूँजीगत खाता घाटा/बचत', 'नेपालको अर्थतन्त्रमा विप्रेषणको प्रभाव'],
                    detailsEn: ['Consumer Price Index measurement', 'Current account and balance of payment dynamics', 'Remittance inflow contribution to forex']
                  }
                ]
              }
            ]
          },
          {
            paperNumber: 'Paper II',
            titleNe: 'द्वितीय पत्र: विषयगत (व्यवस्थापन, लेखापरीक्षण, वित्तीय विश्लेषण र BPR)',
            titleEn: 'Paper II: Management, Auditing, Financial Analysis & BPR',
            fullMarks: 100,
            passMarks: 40,
            timeLimitNe: '३ घण्टा',
            timeLimitEn: '3 Hours',
            examTypeNe: '१० x ५ अंक = ५०, ५ x १० अंक = ५०',
            examTypeEn: 'Subjective (10x5 + 5x10)',
            sections: [
              {
                sectionId: 'sec-b5-p2-core',
                sectionNameNe: 'खण्ड (क): वित्तीय अनुपात, लेखापरीक्षण र NFRS',
                sectionNameEn: 'Section A: Financial Ratios, Auditing & NFRS',
                weightageMarks: 50,
                topics: [
                  {
                    id: 'b5-p2-01',
                    code: '१.१',
                    nameNe: 'तरलता, नाफा र कर्जा जोखिम अनुपात विश्लेषण (Financial Ratio Analysis)',
                    nameEn: 'Liquidity, Profitability & Solvency Ratio Analysis',
                    paper: 'Paper II',
                    sectionNe: 'खण्ड (क) अनुपात विश्लेषण',
                    sectionEn: 'Section A Ratio Analysis',
                    marks: 20,
                    questionTypeNe: '१० अंक विश्लेषणात्मक',
                    questionTypeEn: '10 Marks Numerical/Case',
                    noteRefId: 'note-accounting-basics',
                    detailsNe: ['ROA, ROE, Net Interest Margin (NIM) विश्लेषण', 'Non-Performing Loan (NPL) अनुपात र यसको न्यूनीकरण', 'Base Rate र Spread Rate निर्धारण'],
                    detailsEn: ['Return on Assets, Equity and NIM dynamics', 'NPL ratio mitigation strategies', 'Base rate & interest spread formula']
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        level: '6',
        levelLabelNe: 'तह ६ (अधिकृत / Officer Level)',
        levelLabelEn: 'Level 6 (Officer)',
        totalTopics: 16,
        totalMarks: 300,
        papers: [
          {
            paperNumber: 'Paper I',
            titleNe: 'प्रथम पत्र: सामान्य ज्ञान, वस्तुगत तथा विश्लेषणात्मक केस स्टडी',
            titleEn: 'Paper I: GK, Case Studies & Advanced Governance',
            fullMarks: 100,
            passMarks: 40,
            timeLimitNe: '१ घण्टा',
            timeLimitEn: '1 Hour',
            examTypeNe: 'वस्तुगत तथा छोटा विश्लेषणात्मक प्रश्न',
            examTypeEn: 'Objective & Short Case Studies',
            sections: [
              {
                sectionId: 'sec-b6-p1',
                sectionNameNe: 'केन्द्रीय बैंकिङ, वित्तीय प्रणाली स्थायित्व र बासेल ३',
                sectionNameEn: 'Central Banking, Financial Stability & Basel III',
                weightageMarks: 50,
                topics: [
                  {
                    id: 'b6-p1-01',
                    code: '१.१',
                    nameNe: 'Basel III मापदण्ड, लिक्विडिटी कभरेज रेसियो (LCR) र काउन्टर-साइक्लिकल बफर',
                    nameEn: 'Basel III Standards, LCR, NSFR & Countercyclical Buffer',
                    paper: 'Paper I',
                    sectionNe: 'केन्द्रीय बैंकिङ',
                    sectionEn: 'Central Banking',
                    marks: 25,
                    questionTypeNe: 'वस्तुगत/विश्लेषणात्मक',
                    questionTypeEn: 'MCQs & Analysis',
                    noteRefId: 'note-nrb-unified-directives-master',
                    detailsNe: ['Tier 1 Capital, Common Equity Tier 1 (CET1) अनुपात', 'Liquidity Coverage Ratio (LCR) १००% मापदण्ड', 'Net Stable Funding Ratio (NSFR) अवधारणा'],
                    detailsEn: ['CET1 and Tier 1 capital composition', '100% LCR requirement implementation', 'NSFR long-term funding stability']
                  }
                ]
              }
            ]
          },
          {
            paperNumber: 'Paper II',
            titleNe: 'द्वितीय पत्र: वित्तीय नीति, समष्टिगत अर्थशास्त्र, बैंकिङ कानुन तथा अनुसन्धान',
            titleEn: 'Paper II: Financial Policy, Macroeconomics, Laws & Research',
            fullMarks: 100,
            passMarks: 40,
            timeLimitNe: '३ घण्टा',
            timeLimitEn: '3 Hours',
            examTypeNe: 'विषयगत विश्लेषणात्मक र नीतिगत प्रश्न',
            examTypeEn: 'Policy & Long Analytical Questions',
            sections: [
              {
                sectionId: 'sec-b6-p2',
                sectionNameNe: 'समष्टिगत आर्थिक नीति र बैंकिङ सुधार',
                sectionNameEn: 'Macroeconomic Policy & Banking Reforms',
                weightageMarks: 50,
                topics: [
                  {
                    id: 'b6-p2-01',
                    code: '२.१',
                    nameNe: 'नेपालमा वित्तीय क्षेत्र सुधार कार्यक्रम (FSRP) र आगामी चुनौती',
                    nameEn: 'Financial Sector Reform Program (FSRP) & Future Outlook',
                    paper: 'Paper II',
                    sectionNe: 'आर्थिक नीति',
                    sectionEn: 'Economic Policy',
                    marks: 25,
                    questionTypeNe: '१५/१० अंक नीतिगत',
                    questionTypeEn: '15/10 Marks Policy',
                    noteRefId: 'note-banking-history',
                    detailsNe: ['NRB को स्वायत्तता र सुपरिवेक्षकीय क्षमता विकास', 'बैंकिङ मर्जर तथा एक्विजिसनको प्रभाव', 'डिजिटल मुद्रा (CBDC) को सम्भाव्यता'],
                    detailsEn: ['NRB autonomy and supervisory capacity', 'Banking mergers and consolidation impact', 'Central Bank Digital Currency (CBDC) feasibility']
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  enterprises: {
    categoryId: 'enterprises',
    categoryNameNe: 'संस्थान तथा संगठित संस्था (Public Enterprises)',
    categoryNameEn: 'Public Enterprises (NTC, NEA, EPF, CIT)',
    levels: [
      {
        level: '4',
        levelLabelNe: 'तह ४ (सहायक / प्रशासन)',
        levelLabelEn: 'Level 4 (Assistant / Administration)',
        totalTopics: 10,
        totalMarks: 200,
        papers: [
          {
            paperNumber: 'Paper I',
            titleNe: 'प्रथम पत्र: सामान्य ज्ञान र सेवा सम्बन्धी आधारभूत ज्ञान',
            titleEn: 'Paper I: General Knowledge & Organizational Fundamentals',
            fullMarks: 100,
            passMarks: 40,
            timeLimitNe: '४५ मिनेट',
            timeLimitEn: '45 Minutes',
            examTypeNe: '५० वस्तुगत बहुवैकल्पिक प्रश्न (MCQs)',
            examTypeEn: '50 Objective MCQs',
            sections: [
              {
                sectionId: 'sec-ent4-p1',
                sectionNameNe: 'खण्ड (क): सार्वजनिक संस्थान अवधारणा र सेवा ज्ञान',
                sectionNameEn: 'Section A: Public Enterprise Concepts & Service Rules',
                weightageMarks: 50,
                topics: [
                  {
                    id: 'ent4-p1-01',
                    code: '१.१',
                    nameNe: 'सार्वजनिक संस्थानको भूमिका, उद्देश्य र नेपालका प्रमुख संगठित संस्थाहरू',
                    nameEn: 'Role & Objectives of Public Enterprises in Nepal',
                    paper: 'Paper I',
                    sectionNe: 'खण्ड (क) संस्थान ज्ञान',
                    sectionEn: 'Section A Enterprise',
                    marks: 15,
                    questionTypeNe: '७ वस्तुगत प्रश्न (MCQs)',
                    questionTypeEn: '7 MCQs',
                    noteRefId: 'note-public-admin',
                    detailsNe: ['नेपाल टेलिकम, विद्युत प्राधिकरण, सञ्चय कोष र नागरिक लगानी कोषको स्थापना र कार्यक्षेत्र', 'संस्थान सञ्चालन सम्बन्धी नीति र स्वायत्तता'],
                    detailsEn: ['Founding statutes of NTC, NEA, EPF and CIT', 'Corporate governance & autonomy norms']
                  },
                  {
                    id: 'ent4-p1-02',
                    code: '१.२',
                    nameNe: 'संस्थान कर्मचारी विनियमावली, आचरण तथा अनुशासन',
                    nameEn: 'Enterprise Staff Bylaws, Ethics & Workplace Conduct',
                    paper: 'Paper I',
                    sectionNe: 'खण्ड (क) विनियमावली',
                    sectionEn: 'Section A Bylaws',
                    marks: 15,
                    questionTypeNe: '७ वस्तुगत प्रश्न (MCQs)',
                    questionTypeEn: '7 MCQs',
                    noteRefId: 'note-banking-bylaws-manual',
                    detailsNe: ['सेवा शर्त, विदा, बढुवा र सजाय सम्बन्धी प्रावधान', 'कार्यसम्पादन मूल्याङ्कन प्रणाली'],
                    detailsEn: ['Service conditions, leaves, promotions and penalties', 'Performance appraisal procedures']
                  }
                ]
              }
            ]
          },
          {
            paperNumber: 'Paper II',
            titleNe: 'द्वितीय पत्र: कार्यालय सञ्चालन, लेखा, टिप्पणी लेखन र दर्ता/चलानी',
            titleEn: 'Paper II: Office Procedures, Accounting, Note-Writing & Records',
            fullMarks: 100,
            passMarks: 40,
            timeLimitNe: '३ घण्टा',
            timeLimitEn: '3 Hours',
            examTypeNe: 'विषयगत प्रश्नहरू',
            examTypeEn: 'Subjective Questions',
            sections: [
              {
                sectionId: 'sec-ent4-p2',
                sectionNameNe: 'खण्ड (क): कार्यालय व्यवस्थापन र टिप्पणी लेखन',
                sectionNameEn: 'Section A: Office Management & Note Drafting',
                weightageMarks: 50,
                topics: [
                  {
                    id: 'ent4-p2-01',
                    code: '२.१',
                    nameNe: 'टिप्पणी र प्रतिवेदन लेखन विधि, पत्रव्यवहार र दर्ता/चलानी',
                    nameEn: 'Official Note Writing, Report Drafting & Correspondence',
                    paper: 'Paper II',
                    sectionNe: 'खण्ड (क) कार्यालय व्यवस्थापन',
                    sectionEn: 'Section A Office Mgmt',
                    marks: 20,
                    questionTypeNe: '१० अंक व्यावहारिक टिप्पणी',
                    questionTypeEn: '10 Marks Practical Draft',
                    noteRefId: 'note-public-admin',
                    detailsNe: ['टिप्पणीको संरचना, पेश गर्ने तरिका र सदर प्रक्रिया', 'अभिलेख व्यवस्थापन र फाइल प्रणाली'],
                    detailsEn: ['Official note draft structure & approval chain', 'Records keeping & indexing methods']
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        level: '5',
        levelLabelNe: 'तह ५ (वरिष्ठ सहायक / लेखा / प्रशासन)',
        levelLabelEn: 'Level 5 (Senior Assistant)',
        totalTopics: 12,
        totalMarks: 200,
        papers: [
          {
            paperNumber: 'Paper I',
            titleNe: 'प्रथम पत्र: सामान्य अध्ययन र संस्थान कानुन',
            titleEn: 'Paper I: General Studies & Enterprise Acts',
            fullMarks: 100,
            passMarks: 40,
            timeLimitNe: '४५ मिनेट',
            timeLimitEn: '45 Minutes',
            examTypeNe: '५० बहुवैकल्पिक प्रश्न (MCQs)',
            examTypeEn: '50 MCQs',
            sections: [
              {
                sectionId: 'sec-ent5-p1',
                sectionNameNe: 'संस्थान ऐन तथा सार्वजनिक खरिद ऐन',
                sectionNameEn: 'Public Procurement & Enterprise Acts',
                weightageMarks: 50,
                topics: [
                  {
                    id: 'ent5-p1-01',
                    code: '१.१',
                    nameNe: 'सार्वजनिक खरिद ऐन, २०६३ र नियमावली २०६४',
                    nameEn: 'Public Procurement Act, 2063 & Rules 2064',
                    paper: 'Paper I',
                    sectionNe: 'सार्वजनिक खरिद',
                    sectionEn: 'Public Procurement',
                    marks: 20,
                    questionTypeNe: '१० वस्तुगत प्रश्न (MCQs)',
                    questionTypeEn: '10 MCQs',
                    noteRefId: 'note-public-admin',
                    detailsNe: ['बोलपत्र (Tender) आह्वान, मूल्याङ्कन र सम्झौता', 'सिलबन्दी दरभाउपत्र र सोझै खरिद विधि'],
                    detailsEn: ['Bidding process, tender evaluation and award', 'Sealed quotation and direct procurement']
                  }
                ]
              }
            ]
          },
          {
            paperNumber: 'Paper II',
            titleNe: 'द्वितीय पत्र: संस्थान व्यवस्थापन, लेखापरीक्षण र परियोजना विश्लेषण',
            titleEn: 'Paper II: Corporate Management & Project Evaluation',
            fullMarks: 100,
            passMarks: 40,
            timeLimitNe: '३ घण्टा',
            timeLimitEn: '3 Hours',
            examTypeNe: 'विषयगत विश्लेषणात्मक प्रश्न',
            examTypeEn: 'Analytical Subjective',
            sections: [
              {
                sectionId: 'sec-ent5-p2',
                sectionNameNe: 'संस्थान वित्तीय व्यवस्थापन र आन्तरिक नियन्त्रण',
                sectionNameEn: 'Financial Management & Internal Controls',
                weightageMarks: 50,
                topics: [
                  {
                    id: 'ent5-p2-01',
                    code: '२.१',
                    nameNe: 'संस्थानको आन्तरिक लेखापरीक्षण र बेरुजु फर्स्यौट',
                    nameEn: 'Internal Audit & Settlement of Audit Irregularities (Beruju)',
                    paper: 'Paper II',
                    sectionNe: 'लेखापरीक्षण',
                    sectionEn: 'Auditing',
                    marks: 20,
                    questionTypeNe: '१० अंक विषयगत',
                    questionTypeEn: '10 Marks Subjective',
                    noteRefId: 'note-accounting-basics',
                    detailsNe: ['महालेखा परीक्षकको भूमिका र बेरुजु वर्गीकरण', 'आन्तरिक नियन्त्रण प्रणाली (Internal Control Framework)'],
                    detailsEn: ['Auditor General audit mandates & audit queries', 'Internal control mechanisms and risk prevention']
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        level: '6',
        levelLabelNe: 'तह ६ (अधिकृत / Officer)',
        levelLabelEn: 'Level 6 (Officer)',
        totalTopics: 14,
        totalMarks: 300,
        papers: [
          {
            paperNumber: 'Paper I',
            titleNe: 'प्रथम पत्र: सामान्य ज्ञान र समसामयिक संस्थान नीति',
            titleEn: 'Paper I: GK & Enterprise Policy Framework',
            fullMarks: 100,
            passMarks: 40,
            timeLimitNe: '१ घण्टा',
            timeLimitEn: '1 Hour',
            examTypeNe: 'वस्तुगत तथा विश्लेषणात्मक प्रश्न',
            examTypeEn: 'Objective & Case Questions',
            sections: [
              {
                sectionId: 'sec-ent6-p1',
                sectionNameNe: 'सार्वजनिक संस्थानको निजीकरण, सुधार र रणनीतिक योजना',
                sectionNameEn: 'Privatization, Reforms & Strategic Planning',
                weightageMarks: 50,
                topics: [
                  {
                    id: 'ent6-p1-01',
                    code: '१.१',
                    nameNe: 'संस्थानको पुनर्संरचना, रणनीतिक व्यवस्थापन र नाफा-नोक्सान विश्लेषण',
                    nameEn: 'Enterprise Restructuring, Strategic Management & Profitability',
                    paper: 'Paper I',
                    sectionNe: 'रणनीतिक व्यवस्थापन',
                    sectionEn: 'Strategic Mgmt',
                    marks: 25,
                    questionTypeNe: 'विश्लेषणात्मक',
                    questionTypeEn: 'Analytical',
                    noteRefId: 'note-reengineering',
                    detailsNe: ['SWOT विश्लेषण, KPI निर्धारण र कार्यसम्पादन सम्झौता', 'सार्वजनिक-निजी साझेदारी (PPP) मोडल'],
                    detailsEn: ['SWOT analysis, KPIs and performance contracts', 'Public-Private Partnership (PPP) model']
                  }
                ]
              }
            ]
          },
          {
            paperNumber: 'Paper II',
            titleNe: 'द्वितीय पत्र: संस्थान प्रशासन, मानव संसाधन विकास तथा औद्योगिक सम्बन्ध',
            titleEn: 'Paper II: HR Development, Industrial Relations & Labor Laws',
            fullMarks: 100,
            passMarks: 40,
            timeLimitNe: '३ घण्टा',
            timeLimitEn: '3 Hours',
            examTypeNe: 'विषयगत विश्लेषणात्मक प्रश्न',
            examTypeEn: 'Policy Subjective',
            sections: [
              {
                sectionId: 'sec-ent6-p2',
                sectionNameNe: 'श्रम ऐन २०७४ र औद्योगिक सम्बन्ध',
                sectionNameEn: 'Labor Act 2074 & Industrial Relations',
                weightageMarks: 50,
                topics: [
                  {
                    id: 'ent6-p2-01',
                    code: '२.१',
                    nameNe: 'श्रम ऐन, २०७४, ट्रेड युनियन अधिकार र सामूहिक सौदाबाजी',
                    nameEn: 'Labor Act 2074, Trade Union Rights & Collective Bargaining',
                    paper: 'Paper II',
                    sectionNe: 'श्रम ऐन',
                    sectionEn: 'Labor Act',
                    marks: 25,
                    questionTypeNe: 'विषयगत विश्लेषणात्मक',
                    questionTypeEn: 'Analytical Long Answer',
                    noteRefId: 'note-public-admin',
                    detailsNe: ['रोजगार सम्झौता, सामाजिक सुरक्षा कोष (SSF) र कामदारको अधिकार', 'हड्ताल, तालाबन्दी र विवाद समाधान प्रक्रिया'],
                    detailsEn: ['Employment contracts, Social Security Fund (SSF)', 'Strike rules and dispute arbitration']
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  loksewa: {
    categoryId: 'loksewa',
    categoryNameNe: 'लोकसेवा आयोग (Lok Sewa / Civil Service)',
    categoryNameEn: 'Lok Sewa / Civil Service (Kharidar, NaSu, Officer)',
    levels: [
      {
        level: '4',
        levelLabelNe: 'खरिदार (तह ४ / Kharidar)',
        levelLabelEn: 'Kharidar (Level 4)',
        totalTopics: 10,
        totalMarks: 200,
        papers: [
          {
            paperNumber: 'Paper I',
            titleNe: 'प्रथम पत्र: सामान्य ज्ञान र आधारभूत बौद्धिक परीक्षण (GK & IQ)',
            titleEn: 'Paper I: General Knowledge & Basic IQ',
            fullMarks: 100,
            passMarks: 40,
            timeLimitNe: '४५ मिनेट',
            timeLimitEn: '45 Minutes',
            examTypeNe: '५० बहुवैकल्पिक प्रश्न (MCQs) • नेगेटिभ मार्किङ ०.२',
            examTypeEn: '50 Objective MCQs',
            sections: [
              {
                sectionId: 'sec-lok4-p1',
                sectionNameNe: 'नेपालको भूगोल, इतिहास र निजामती सेवा आधारभूत ज्ञान',
                sectionNameEn: 'Geography, History & Civil Service Basics',
                weightageMarks: 50,
                topics: [
                  {
                    id: 'lok4-p1-01',
                    code: '१.१',
                    nameNe: 'नेपालको संविधान २०७२: मौलिक हक र राज्यका निर्देशक सिद्धान्त',
                    nameEn: 'Constitution of Nepal: Fundamental Rights & Directive Principles',
                    paper: 'Paper I',
                    sectionNe: 'संविधान',
                    sectionEn: 'Constitution',
                    marks: 20,
                    questionTypeNe: '१० वस्तुगत प्रश्न (MCQs)',
                    questionTypeEn: '10 MCQs',
                    noteRefId: 'note-constitution',
                    detailsNe: ['धारा १६ देखि ४६ सम्मका ३१ मौलिक हकहरू', 'राज्यका नीतिहरू र नागरिकका कर्तव्य'],
                    detailsEn: ['31 Fundamental Rights (Articles 16-46)', 'Directive principles and civic obligations']
                  },
                  {
                    id: 'lok4-p1-02',
                    code: '१.२',
                    nameNe: 'निजामती सेवा ऐन, २०४९ र नियमावली २०५० का प्रमुख प्रावधान',
                    nameEn: 'Civil Service Act, 2049 & Rules 2050 Key Mandates',
                    paper: 'Paper I',
                    sectionNe: 'निजामती सेवा ऐन',
                    sectionEn: 'Civil Service Act',
                    marks: 15,
                    questionTypeNe: '७ वस्तुगत प्रश्न (MCQs)',
                    questionTypeEn: '7 MCQs',
                    noteRefId: 'note-public-admin',
                    detailsNe: ['निजामती सेवाका पद र श्रेणीहरू', 'पदपूर्ति, सरुवा, बढुवा र आचरण'],
                    detailsEn: ['Civil service ranks and cadres', 'Recruitment, transfers and disciplinary actions']
                  }
                ]
              }
            ]
          },
          {
            paperNumber: 'Paper II',
            titleNe: 'द्वितीय पत्र: कार्यालय सञ्चालन, गणित र ऐन कानुन',
            titleEn: 'Paper II: Office Procedures, Basic Math & Legal Provisions',
            fullMarks: 100,
            passMarks: 40,
            timeLimitNe: '२ घण्टा ३० मिनेट',
            timeLimitEn: '2 Hours 30 Mins',
            examTypeNe: 'विषयगत तथा व्यावहारिक प्रश्न',
            examTypeEn: 'Subjective Practical',
            sections: [
              {
                sectionId: 'sec-lok4-p2',
                sectionNameNe: 'सरकारी कार्यालय कार्यविधि र टिप्पणी लेखन',
                sectionNameEn: 'Government Office Procedures & Notes',
                weightageMarks: 50,
                topics: [
                  {
                    id: 'lok4-p2-01',
                    code: '२.१',
                    nameNe: 'सरकारी कार्यालयमा पत्रव्यवहार, दर्ता, चलानी र टिप्पणी लेखन',
                    nameEn: 'Government Drafting, Filing, Dispatch & Minute Writing',
                    paper: 'Paper II',
                    sectionNe: 'सरकारी कार्यविधि',
                    sectionEn: 'Gov Procedures',
                    marks: 25,
                    questionTypeNe: '१० अंक टिप्पणी र ५ अंक पत्र',
                    questionTypeEn: '10 Marks Note & 5 Marks Letter',
                    noteRefId: 'note-public-admin',
                    detailsNe: ['टिप्पणीको उठान, कैफियत र अन्तिम निर्णय प्रक्रिया', 'नागरिक बडापत्रको महत्व र सार्वजनिक सेवा प्रवाह'],
                    detailsEn: ['Civil drafting procedures and decisions', 'Citizen charter in local governance']
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        level: '5',
        levelLabelNe: 'नायब सुब्बा (तह ५ / Nayab Subba)',
        levelLabelEn: 'Nayab Subba (Level 5 / NaSu)',
        totalTopics: 12,
        totalMarks: 200,
        papers: [
          {
            paperNumber: 'Paper I',
            titleNe: 'प्रथम पत्र: सामान्य ज्ञान र सामान्य अभिक्षमता परीक्षण (GK & IQ)',
            titleEn: 'Paper I: General Knowledge & Aptitude Test (GK & IQ)',
            fullMarks: 100,
            passMarks: 40,
            timeLimitNe: '४५ मिनेट',
            timeLimitEn: '45 Minutes',
            examTypeNe: '५० बहुवैकल्पिक प्रश्न (MCQs) • नेगेटिभ मार्किङ ०.२',
            examTypeEn: '50 MCQs',
            sections: [
              {
                sectionId: 'sec-lok5-p1',
                sectionNameNe: 'विश्व भूगोल, अन्तर्राष्ट्रिय सम्बन्ध र सुशासन',
                sectionNameEn: 'World Geography, International Relations & Governance',
                weightageMarks: 50,
                topics: [
                  {
                    id: 'lok5-p1-01',
                    code: '१.१',
                    nameNe: 'सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन, २०६४ र सूचनाको हक ऐन, २०६४',
                    nameEn: 'Good Governance Act 2064 & Right to Information Act 2064',
                    paper: 'Paper I',
                    sectionNe: 'सुशासन र सूचनाको हक',
                    sectionEn: 'Good Governance & RTI',
                    marks: 20,
                    questionTypeNe: '१० वस्तुगत प्रश्न (MCQs)',
                    questionTypeEn: '10 MCQs',
                    noteRefId: 'note-public-admin',
                    detailsNe: ['सार्वजनिक उत्तरदायित्व, पारदर्शिता र भ्रष्टाचार नियन्त्रण', 'RTI अन्तर्गत सूचना माग्ने र दिने म्याद र दण्ड जरिवाना'],
                    detailsEn: ['Accountability and anti-corruption mandates', 'RTI timelines, exceptions and penalties']
                  }
                ]
              }
            ]
          },
          {
            paperNumber: 'Paper II',
            titleNe: 'द्वितीय पत्र: समसामयिक अध्ययन र सार्वजनिक सेवा व्यवस्थापन',
            titleEn: 'Paper II: Contemporary Studies & Public Service Management',
            fullMarks: 100,
            passMarks: 40,
            timeLimitNe: '२ घण्टा ३० मिनेट',
            timeLimitEn: '2.5 Hours',
            examTypeNe: 'विषयगत विश्लेषणात्मक प्रश्न',
            examTypeEn: 'Subjective Analytical',
            sections: [
              {
                sectionId: 'sec-lok5-p2',
                sectionNameNe: 'नेपालमा संघीयता, योजनाबद्ध विकास र स्थानीय प्रशासन',
                sectionNameEn: 'Federalism, Planned Development & Local Governance',
                weightageMarks: 50,
                topics: [
                  {
                    id: 'lok5-p2-01',
                    code: '२.१',
                    nameNe: 'स्थानीय सरकार सञ्चालन ऐन, २०७४ र अन्तर-तह समन्वय',
                    nameEn: 'Local Government Operation Act, 2074 & Inter-tier Relations',
                    paper: 'Paper II',
                    sectionNe: 'स्थानीय सरकार',
                    sectionEn: 'Local Gov',
                    marks: 25,
                    questionTypeNe: '१० अंक विश्लेषणात्मक',
                    questionTypeEn: '10 Marks Analytical',
                    noteRefId: 'note-public-admin',
                    detailsNe: ['स्थानीय तहका २२ एकल अधिकार र साझा अधिकार सूची', 'संघ, प्रदेश र स्थानीय तह बीचको वित्तीय हस्तान्तरण'],
                    detailsEn: ['22 exclusive powers of local units', 'Fiscal equalization and conditional grants']
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        level: '6',
        levelLabelNe: 'शाखा अधिकृत (तह ६/७ / Section Officer)',
        levelLabelEn: 'Section Officer (Level 6/7)',
        totalTopics: 16,
        totalMarks: 300,
        papers: [
          {
            paperNumber: 'Paper I',
            titleNe: 'प्रथम पत्र: प्रशासनिक अभिरुचि परीक्षण (AAT - GK, IQ & English)',
            titleEn: 'Paper I: Administrative Aptitude Test (GK, IQ & English)',
            fullMarks: 100,
            passMarks: 40,
            timeLimitNe: '१ घण्टा ३० मिनेट',
            timeLimitEn: '1.5 Hours',
            examTypeNe: '१०० बहुवैकल्पिक प्रश्न (MCQs) • नेगेटिभ मार्किङ ०.२',
            examTypeEn: '100 MCQs',
            sections: [
              {
                sectionId: 'sec-lok6-p1',
                sectionNameNe: 'प्रशासनिक अभिक्षमता, समस्या समाधान र निर्णय क्षमता',
                sectionNameEn: 'Administrative Aptitude, Problem Solving & Critical Reasoning',
                weightageMarks: 50,
                topics: [
                  {
                    id: 'lok6-p1-01',
                    code: '१.१',
                    nameNe: 'सार्वजनिक नीति निर्माण, कार्यान्वयन र मूल्याङ्कन चक्र',
                    nameEn: 'Public Policy Formulation, Implementation & Evaluation Cycle',
                    paper: 'Paper I',
                    sectionNe: 'सार्वजनिक नीति',
                    sectionEn: 'Public Policy',
                    marks: 25,
                    questionTypeNe: 'वस्तुगत/केस स्टडी प्रश्न',
                    questionTypeEn: 'MCQs & Case Scenarios',
                    noteRefId: 'note-public-admin',
                    detailsNe: ['नीति निर्माणका चरण र सरोकारवाला सहभागिता', 'कार्यान्वयनका समस्या र नीति विफलताका कारण'],
                    detailsEn: ['Policy cycle phases and stakeholder involvement', 'Implementation bottlenecks and failure causes']
                  }
                ]
              }
            ]
          },
          {
            paperNumber: 'Paper II',
            titleNe: 'द्वितीय पत्र: शासन प्रणाली (Governance System)',
            titleEn: 'Paper II: Governance System in Nepal',
            fullMarks: 100,
            passMarks: 40,
            timeLimitNe: '३ घण्टा',
            timeLimitEn: '3 Hours',
            examTypeNe: 'विषयगत विश्लेषणात्मक प्रश्न (१० x १० अंक)',
            examTypeEn: 'Subjective Long (10x10)',
            sections: [
              {
                sectionId: 'sec-lok6-p2',
                sectionNameNe: 'राज्य, सरकार, संविधान र लोकतान्त्रिक मूल्य मान्यता',
                sectionNameEn: 'State, Government, Constitution & Democratic Values',
                weightageMarks: 50,
                topics: [
                  {
                    id: 'lok6-p2-01',
                    code: '२.१',
                    nameNe: 'कानूनको शासन, मानव अधिकार र समावेशीकरणको अभ्यास',
                    nameEn: 'Rule of Law, Human Rights & Inclusive Democracy',
                    paper: 'Paper II',
                    sectionNe: 'शासन प्रणाली',
                    sectionEn: 'Governance',
                    marks: 25,
                    questionTypeNe: '१० अंक विश्लेषणात्मक',
                    questionTypeEn: '10 Marks Analytical',
                    noteRefId: 'note-constitution',
                    detailsNe: ['शक्ति पृथकीकरण, सन्तुलन र नियन्त्रण (Checks & Balances)', 'सकारात्मक विभेद र समानुपातिक समावेशिता सिद्धान्त'],
                    detailsEn: ['Separation of powers and constitutional balance', 'Affirmative action and proportional representation']
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};

// ============================================================================
// SYLLABUS PROGRESS PERSISTENCE
// ============================================================================

export interface SyllabusProgressState {
  completedTopicIds: string[];
  lastUpdated: string;
}

export const getSyllabusProgress = (categoryId: string, level: '4' | '5' | '6'): SyllabusProgressState => {
  const key = `btn_syllabus_progress_${categoryId}_${level}`;
  try {
    const raw = safeStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.completedTopicIds)) {
        return parsed;
      }
    }
  } catch {}
  return { completedTopicIds: [], lastUpdated: new Date().toISOString() };
};

export const toggleSyllabusTopicProgress = (
  categoryId: string,
  level: '4' | '5' | '6',
  topicId: string
): SyllabusProgressState => {
  const key = `btn_syllabus_progress_${categoryId}_${level}`;
  const current = getSyllabusProgress(categoryId, level);
  const exists = current.completedTopicIds.includes(topicId);
  const updatedIds = exists
    ? current.completedTopicIds.filter(id => id !== topicId)
    : [...current.completedTopicIds, topicId];

  const newState: SyllabusProgressState = {
    completedTopicIds: updatedIds,
    lastUpdated: new Date().toISOString()
  };

  try {
    safeStorage.setItem(key, JSON.stringify(newState));
    // Log user activity for real-time tracking
    ActivityTrackingService.logActivity({
      activityType: 'syllabus_view',
      details: `Syllabus topic ${topicId} in ${categoryId} Level ${level} (${exists ? 'unmarked' : 'completed'})`,
      targetId: topicId,
      targetTitle: `${categoryId} Level ${level}`,
      metadata: {
        action: exists ? 'unmark_topic' : 'complete_topic',
        categoryId,
        level,
        topicId,
        status: exists ? 'unmarked' : 'completed',
        totalCompleted: updatedIds.length
      }
    });
  } catch {}

  return newState;
};

// ============================================================================
// LEVEL-SPECIFIC QUESTION RETRIEVER (FOR TAB 2: QUESTION BANK VIEW-ONLY)
// ============================================================================

export const getLevelQuestions = (categoryId: string, level: '4' | '5' | '6', topicId?: string) => {
  let pool = ALL_QUIZ_QUESTIONS;

  if (categoryId === 'banking') {
    pool = pool.filter(q => q.category === 'NRB' || q.category === 'Banking');
  } else if (categoryId === 'enterprises') {
    pool = pool.filter(q => q.category === 'PublicEnterprises');
  } else if (categoryId === 'loksewa') {
    pool = pool.filter(q => q.category === 'Loksewa' || q.category === 'GK');
  }

  if (pool.length < 20) {
    pool = ALL_QUIZ_QUESTIONS;
  }

  // Pick questions according to requested count
  return pool.slice(0, 50);
};

// ============================================================================
// DYNAMIC MOCK TEST GENERATOR (FOR TAB 3: LIVE TEST ENGINE)
// ============================================================================

export const generateLevelMockTestSet = (
  categoryId: string,
  level: '4' | '5' | '6',
  setName?: string
): QuizSet => {
  const categoryData = LEVEL_SYLLABUS_DATABASE[categoryId] || LEVEL_SYLLABUS_DATABASE.banking;
  const levelInfo = categoryData.levels.find(l => l.level === level) || categoryData.levels[0];

  const questions = getLevelQuestions(categoryId, level).slice(0, 50);

  const title = setName || `${categoryData.categoryNameNe} - ${levelInfo.levelLabelNe} ५० प्रश्न विशेष सिमुलेसन`;

  const categoryType: SubjectCategory = 
    categoryId === 'enterprises' ? 'PublicEnterprises' : 
    categoryId === 'loksewa' ? 'Loksewa' : 'Banking';

  return {
    id: `mock-test-${categoryId}-${level}-${Date.now()}`,
    title,
    description: `आधिकारिक परीक्षा सिमुलेसन: ४५ मिनेट, ५० प्रश्न, नेगेटिभ मार्किङ ०.२ (${levelInfo.levelLabelNe})`,
    category: categoryType,
    difficulty: 'Medium',
    mode: 'exam',
    timeLimitMinutes: 45,
    questions: questions.map(convertQuizQuestionToQuestion),
    badge: `तह ${level}`
  };
};
