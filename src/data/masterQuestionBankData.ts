import { QuestionArchetype, InstitutionId, ExamLevelNumber } from '../types/masterEcosystem';
import { SubjectCategory, DifficultyLevel } from '../types';

export interface MasterQuestionRecord {
  id: string;
  archetype: QuestionArchetype;
  subject: SubjectCategory;
  topic: string;
  subtopic?: string;
  institution: InstitutionId;
  targetLevels: ExamLevelNumber[];
  difficulty: DifficultyLevel | 'Officer Level';
  marks: number;
  timeEstimateMinutes: number;
  questionNepali: string;
  questionEnglish?: string;
  
  // MCQ / Multiple Choice specific
  options?: { key: 'A' | 'B' | 'C' | 'D'; text: string; isCorrect: boolean }[];
  correctAnswerKey?: 'A' | 'B' | 'C' | 'D';
  
  // Assertion / Reason specific
  assertionText?: string;
  reasonText?: string;
  assertionAnalysis?: string;
  
  // Match Following specific
  columnA?: { id: number; label: string }[];
  columnB?: { id: string; label: string }[];
  matchingSolution?: string;

  // Numerical specific
  givenValues?: Record<string, string>;
  stepByStepSolution?: string[];
  finalAnswer?: string;

  // Subjective specific
  modelAnswerOutline?: {
    introduction: string;
    keyPoints: string[];
    nepalContext: string;
    conclusion: string;
  };

  // Past question metadata
  isPreviousExamQuestion: boolean;
  examYearBS?: string;
  examRollOrPost?: string;
  
  explanationNepali: string;
  sourceCitation: string;
}

export const MASTER_QUESTION_BANK_DATA: MasterQuestionRecord[] = [
  // 1. Assertion / Reason (कथन र कारण विश्लेषण)
  {
    id: 'qb-ar-01',
    archetype: 'assertion_reason',
    subject: 'Banking',
    topic: 'केन्द्रीय बैंक स्वायत्तता तथा वित्तीय नीति',
    institution: 'NRB',
    targetLevels: ['5', '6'],
    difficulty: 'Officer Level',
    marks: 2,
    timeEstimateMinutes: 2,
    questionNepali: 'देहायको कथन (Assertion - A) र कारण (Reason - R) अध्ययन गरी सही विकल्प छनोट गर्नुहोस्:',
    assertionText: 'कथन (A): नेपाल राष्ट्र बैंक ऐन २०५८ ले केन्द्रीय बैंकलाई पूर्ण कानुनी, नीतिगत र व्यवस्थापकीय स्वायत्तता प्रदान गरेको छ।',
    reasonText: 'कारण (R): केन्द्रीय बैंकलाई सरकारको वित्तीय घाटा पूर्ति गर्न असीमित रूपमा नोट छापेर ऋण दिनबाट कानुनतः निषेध गरिएको छ।',
    options: [
      { key: 'A', text: 'कथन (A) र कारण (R) दुवै सही छन् र (R) ले (A) को सही व्याख्या गर्दछ।', isCorrect: true },
      { key: 'B', text: 'कथन (A) र कारण (R) दुवै सही छन् तर (R) ले (A) को सही व्याख्या गर्दैन।', isCorrect: false },
      { key: 'C', text: 'कथन (A) सही छ तर कारण (R) गलत छ।', isCorrect: false },
      { key: 'D', text: 'कथन (A) गलत छ तर कारण (R) सही छ।', isCorrect: false }
    ],
    correctAnswerKey: 'A',
    explanationNepali: 'नेपाल राष्ट्र बैंक ऐन २०५८ को दफा ३ ले बैंकलाई स्वायत्त संगठित संस्था बनाएको छ भने दफा ७२ र ७५ ले सरकारलाई असीमित कर्जा दिन निषेध गरी अघिल्लो वर्षको राजस्वको अधिकतम १०% मात्र अधिविकर्ष (Overdraft) लिन पाउने सीमा तोकेको छ। अतः दुवै सही छन्।',
    isPreviousExamQuestion: true,
    examYearBS: '२०७९',
    examRollOrPost: 'NRB अधिकृत तृतीय',
    sourceCitation: 'NRB Act 2058 Section 3 & 75'
  },

  // 2. Match the Following (जोडा मिलाउने)
  {
    id: 'qb-mf-01',
    archetype: 'match_following',
    subject: 'Banking',
    topic: 'बैंकिङ दरहरू र मौद्रिक उपकरण',
    institution: 'ALL',
    targetLevels: ['4', '5'],
    difficulty: 'Hard',
    marks: 2,
    timeEstimateMinutes: 2,
    questionNepali: 'समूह I मा रहेका मौद्रिक उपकरणहरू र समूह II मा रहेका दरहरू बीच जोडा मिलाउनुहोस्:',
    columnA: [
      { id: 1, label: 'क. अनिवार्य नगद मौज्दात (CRR)' },
      { id: 2, label: 'ख. वैधानिक तरलता अनुपात (SLR) - वाणिज्य बैंक' },
      { id: 3, label: 'ग. नीतिगत दर (Policy Rate)' },
      { id: 4, label: 'घ. बैंक दर (Bank Rate)' }
    ],
    columnB: [
      { id: 'i', label: '१२.०%' },
      { id: 'ii', label: '४.०%' },
      { id: 'iii', label: '६.५%' },
      { id: 'iv', label: '५.०%' }
    ],
    matchingSolution: 'क-(ii), ख-(i), ग-(iv), घ-(iii)',
    options: [
      { key: 'A', text: 'क-(ii), ख-(i), ग-(iv), घ-(iii)', isCorrect: true },
      { key: 'B', text: 'क-(i), ख-(ii), ग-(iii), घ-(iv)', isCorrect: false },
      { key: 'C', text: 'क-(ii), ख-(i), ग-(iii), घ-(iv)', isCorrect: false },
      { key: 'D', text: 'क-(iv), ख-(iii), ग-(ii), घ-(i)', isCorrect: false }
    ],
    correctAnswerKey: 'A',
    explanationNepali: 'हालको मौद्रिक नीति अनुसार CRR ४.०%, वाणिज्य बैंकको SLR १२.०%, नीतिगत दर ५.०% र बैंक दर ६.५% कायम छ।',
    isPreviousExamQuestion: false,
    sourceCitation: 'NRB Monetary Policy 2081/82'
  },

  // 3. Case Study / Situation Based (घटना अध्ययन)
  {
    id: 'qb-cs-01',
    archetype: 'case_study',
    subject: 'Banking',
    topic: 'कर्जा असुली र गैर-बैंकिङ सम्पत्ति',
    institution: 'RBB',
    targetLevels: ['4', '5', '6'],
    difficulty: 'Officer Level',
    marks: 10,
    timeEstimateMinutes: 15,
    questionNepali: `[Case Study]: एबीसी निर्माण कम्पनीले वाणिज्य बैंकबाट रु. १० करोड कर्जा लिएकोमा लगातार ९ महिनादेखि साँवा र ब्याज भुक्तान गरेको छैन। कम्पनीका सञ्चालकहरू सम्पर्कविहीन छन् र धितोमा रहेको जग्गाको बजार मूल्य घट्दो छ।
प्रश्नहरू:
१. NRB को एकीकृत निर्देशन नं. २ अनुसार यो कर्जा कुन वर्गमा वर्गीकरण हुन्छ र कति नोक्सानी व्यवस्था (Loan Loss Provision) गर्नुपर्छ? (३ अङ्क)
२. बैंकले कर्जा असुली ऐन २०५८ र BAFIA २०७३ अनुसार कर्जा असुली गर्न कुन कानुनी प्रक्रिया अवलम्बन गर्नुपर्छ? (७ अङ्क)`,
    modelAnswerOutline: {
      introduction: '९ महिनासम्म भाखा नाघेको कर्जा खराब कर्जा (Non-Performing Loan) अन्तर्गत पर्दछ।',
      keyPoints: [
        'कर्जा वर्गीकरण: ६ महिनादेखि १ वर्षसम्म भाखा नाघेको हुनाले यो "शंकास्पद कर्जा" (Doubtful Loan) हो।',
        'नोक्सानी व्यवस्था: शंकास्पद कर्जाका लागि ५०% Loan Loss Provision अनिवार्य हुन्छ।',
        'असुली प्रक्रिया: १. ३५ दिने सार्वजनिक कर्जा चुक्ता सूचना, २. धितो लिलामी प्रक्रिया, ३. लिलाम नभएमा गैर-बैंकिङ सम्पत्ति (Non-Banking Asset - NBA) को रूपमा सकार गर्ने, ४. कर्जा असुली न्यायाधिकरण (DRT) मा मुद्दा दायर गर्ने, ५. कर्जा सूचना केन्द्र (CIB) मार्फत कालोसूचीमा राख्ने।'
      ],
      nepalContext: 'नेपालमा वाणिज्य बैंकहरूले धितो लिलाम गर्दा स्थानीय निकायको सहयोग र सुरक्षा चुनौती प्रमुख समस्याको रूपमा रहेको छ।',
      conclusion: 'कानुनी बाटो अवलम्बन गर्दै समयमै कर्जा असुली न्यायाधिकरण जानु बैंकको हितमा हुन्छ।'
    },
    isPreviousExamQuestion: true,
    examYearBS: '२०८०',
    examRollOrPost: 'RBB वरिष्ठ सहायक (तह ५) लिखित',
    explanationNepali: 'भाखा नाघेको अवधि अनुसार: ३ महिनासम्म असल (१.२%), ३-६ महिना कमसल (२५%), ६-१२ महिना शंकास्पद (५०%), र १ वर्षभन्दा बढी खराब (१००%)।',
    sourceCitation: 'NRB Directive No. 2'
  },

  // 4. Past Exam Question (विगतको लिखित परीक्षा प्रश्न - 10 Marks)
  {
    id: 'qb-past-01',
    archetype: 'long_answer_10m',
    subject: 'Banking',
    topic: 'सम्पत्ति शुद्धीकरण (AML/CFT) र KYC',
    institution: 'NRB',
    targetLevels: ['4', '5'],
    difficulty: 'Hard',
    marks: 10,
    timeEstimateMinutes: 18,
    questionNepali: 'सम्पत्ति शुद्धीकरण (Money Laundering) का तीन प्रमुख चरणहरू के-के हुन्? नेपालका बैंक तथा वित्तीय संस्थाहरूले सम्पत्ति शुद्धीकरण नियन्त्रण गर्न अपनाउनुपर्ने आन्तरिक नियन्त्रण प्रणाली र ग्राहक पहिचान (KYC) विधिको चर्चा गर्नुहोस्। (३+७=१०)',
    questionEnglish: 'What are the three stages of Money Laundering? Discuss internal control systems and KYC mechanisms banks must adopt to prevent money laundering in Nepal. (3+7=10)',
    modelAnswerOutline: {
      introduction: 'गैरकानुनी तथा आपराधिक क्रियाकलापबाट आर्जित कालो धनलाई वैध सम्पत्तिको रूपमा रूपान्तरण गर्ने प्रक्रिया सम्पत्ति शुद्धीकरण हो।',
      keyPoints: [
        'तीन चरणहरू: १. Placement (जम्मा/प्रवेश), २. Layering (तहकीकीकरण/तह निर्माण), ३. Integration (एकीकरण/वैधीकरण)।',
        'आन्तरिक नियन्त्रण: AML Compliance Officer को नियुक्ति, कर्मचारी तालिम, स्वायत्त आन्तरिक लेखापरीक्षण, र कोर बैंकिङ सफ्टवेयरमा स्क्रिनिङ टुल्स।',
        'KYC विधि: सरलीकृत KYC (कम जोखिम), सामान्य KYC (मध्यम), र वृहत् ग्राहक पहिचान (EDD - PEPs तथा उच्च जोखिम खाताहरूका लागि)।',
        'प्रतिवेदन संयन्त्र: सीमा कारोबार प्रतिवेदन (TTR - १० लाख वा सोभन्दा माथि) र शंकास्पद कारोबार प्रतिवेदन (STR - ३ दिनभित्र FIU लाई)।'
      ],
      nepalContext: 'नेपाल FATF को Asia Pacific Group (APG) को पारस्परिक मूल्याङ्कनको सुधारात्मक निगरानीमा रहेकाले बैंकहरूले यसमा शून्य सहनशीलता अपनाएका छन्।',
      conclusion: 'सम्पत्ति शुद्धीकरण नियन्त्रण बैंकको प्रतिष्ठा र राष्ट्रिय वित्तीय सार्वभौमिकताको अनिवार्य सर्त हो।'
    },
    isPreviousExamQuestion: true,
    examYearBS: '२०८०',
    examRollOrPost: 'NRB सहायक प्रशासन (तह ४)',
    explanationNepali: 'सम्पत्ति शुद्धीकरण निवारण ऐन २०६४ को दफा ७ अनुसार वित्तीय जानकारी एकाइ (FIU) मा STR/TTR पठाउनु कानुनी दायित्व हो।',
    sourceCitation: 'AML Act 2064 & FIU Directives'
  },

  // 5. Numerical Question (संख्यात्मक समस्या - 5 Marks)
  {
    id: 'qb-num-01',
    archetype: 'numerical',
    subject: 'Accounting',
    topic: 'अनिवार्य नगद मौज्दात (CRR) गणना',
    institution: 'ALL',
    targetLevels: ['4', '5'],
    difficulty: 'Medium',
    marks: 5,
    timeEstimateMinutes: 7,
    questionNepali: `कुनै वाणिज्य बैंकको कुल निक्षेप दायित्व देहाय बमोजिम छ:
- चल्ती निक्षेप (Current): रु. १५ अर्ब
- बचत निक्षेप (Saving): रु. ४५ अर्ब
- मुद्दती निक्षेप (Fixed): रु. ३५ अर्ब
- कल निक्षेप (Call): रु. ५ अर्ब
नेपाल राष्ट्र बैंकको हालको नियम अनुसार अनिवार्य नगद मौज्दात (CRR) ४.०% कायम गर्नुपर्ने भए सो बैंकले नेपाल राष्ट्र बैंकमा रहेको खातामा न्यूनतम कति रकम नगद मौज्दात राख्नुपर्दछ?`,
    givenValues: {
      'Current Deposit': '15 अर्ब',
      'Saving Deposit': '45 अर्ब',
      'Fixed Deposit': '35 अर्ब',
      'Call Deposit': '5 अर्ब',
      'CRR Rate': '4.0%'
    },
    stepByStepSolution: [
      'कुल निक्षेप (Total Deposit) = १५ + ४५ + ३५ + ५ = रु. १०० अर्ब',
      'न्यूनतम CRR रकम = कुल निक्षेप × ४.०% = १०० अर्ब × ०.०४ = रु. ४ अर्ब रुपैयाँ'
    ],
    finalAnswer: 'बैंकले नेपाल राष्ट्र बैंकमा न्यूनतम रु. ४ अर्ब (रु. चार अर्ब) अनिवार्य नगद मौज्दात (CRR) जम्मा राख्नुपर्दछ।',
    isPreviousExamQuestion: true,
    examYearBS: '२०७८',
    examRollOrPost: 'NBL सहायक (तह ४)',
    explanationNepali: 'CRR कुल स्वदेशी निक्षेप (Total Domestic Deposit) को ४.०% नेपाल राष्ट्र बैंकको खातामा बिना ब्याज मौज्दात राख्नुपर्ने अनिवार्य नियम हो।',
    sourceCitation: 'NRB Unified Directives No. 13'
  }
];
