export interface PracticeMcq {
  id: string;
  questionNe: string;
  questionEn?: string;
  optionsNe: string[];
  optionsEn?: string[];
  correctIndex: number;
  explanationNe: string;
}

export interface ExamTopicDetail {
  id: string;
  titleNe: string;
  titleEn: string;
  sectionNe: string;
  category: string;
  weightageMarks: number;
  readTimeMin: number;
  latexFormula?: string;
  latexCaption?: string;
  keyProvisionsNe: string[];
  bulletPointsNe: string[];
  lessonSummaryNe: string;
  examTipsNe: string[];
  noteReaderId?: string;
  practiceMcqs: PracticeMcq[];
}

export interface ExamPhase {
  id: string; // 'phase-1' | 'phase-2' | 'phase-3'
  phaseNumber: number;
  phaseTitleNe: string;
  phaseTitleEn: string;
  badgeNe: string;
  formatNe: string;
  fullMarks: number;
  passMarks: number;
  timeLimitNe: string;
  negativeMarkingNe?: string;
  descriptionNe: string;
  sectionsNe: string[];
  topics: ExamTopicDetail[];
}

export interface TargetExam {
  id: string;
  categoryId: 'banking' | 'enterprises' | 'loksewa';
  nameNe: string;
  nameEn: string;
  shortName: string;
  taglineNe: string;
  badgeNe: string;
  colorScheme: {
    primary: string;
    border: string;
    bg: string;
    badgeBg: string;
    badgeText: string;
  };
  levelsNe: string;
  totalPhasesCount: number;
  descriptionNe: string;
  eligibilityNe: string;
  syllabusPdfUrl?: string;
  phases: ExamPhase[];
}

export interface ExamCategory {
  id: 'banking' | 'enterprises' | 'loksewa';
  numNe: string;
  titleNe: string;
  titleEn: string;
  subtextNe: string;
  descriptionNe: string;
  badgeNe: string;
  accentColor: string;
  borderColor: string;
  bgColor: string;
  iconName: 'Landmark' | 'Building2' | 'Scale';
  examIds: string[];
}

export const EXAM_CATEGORIES: Record<'banking' | 'enterprises' | 'loksewa', ExamCategory> = {
  banking: {
    id: 'banking',
    numNe: '१',
    titleNe: 'बैंकिङ्ग सेवा',
    titleEn: 'Banking Sector Written & Syllabus',
    subtextNe: 'NRB, RBB, NBL, ADBL, आदि',
    descriptionNe: 'नेपाल राष्ट्र बैंक, राष्ट्रिय वाणिज्य बैंक, नेपाल बैंक र कृषि विकास बैंकको एकीकृत पूर्वयोग्यता तथा लिखित पाठ्यक्रम।',
    badgeNe: '४ प्रमुख बैंकहरू',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    bgColor: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    iconName: 'Landmark',
    examIds: ['nrb', 'rbb', 'nbl', 'adbl']
  },
  enterprises: {
    id: 'enterprises',
    numNe: '२',
    titleNe: 'संगठित संस्था',
    titleEn: 'Public Enterprises Written & Syllabus',
    subtextNe: 'NTC, NEA, EPF, CIT, आदि',
    descriptionNe: 'नेपाल टेलिकम, नेपाल विद्युत प्राधिकरण, कर्मचारी सञ्चय कोष र नागरिक लगानी कोषको आधिकारिक पाठ्यक्रम।',
    badgeNe: '४ संगठित संस्थानहरू',
    accentColor: 'text-sky-600 dark:text-sky-400',
    borderColor: 'border-sky-200 dark:border-sky-800',
    bgColor: 'bg-sky-50/50 dark:bg-sky-950/20',
    iconName: 'Building2',
    examIds: ['ntc', 'nea', 'epf', 'cit']
  },
  loksewa: {
    id: 'loksewa',
    numNe: '३',
    titleNe: 'निजामती / लोकसेवा',
    titleEn: 'PSC Civil Service Written & Syllabus',
    subtextNe: 'Section Officer, NaSu, Kharidar, आदि',
    descriptionNe: 'लोक सेवा आयोगद्वारा सञ्चालन गरिने शाखा अधिकृत, नायब सुब्बा र खरिदारको सामान्य ज्ञान, बौद्धिक परीक्षण र सेवा सम्बन्धी पाठ्यक्रम।',
    badgeNe: '३ निजामती श्रेणीहरू',
    accentColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-200 dark:border-amber-800',
    bgColor: 'bg-amber-50/50 dark:bg-amber-950/20',
    iconName: 'Scale',
    examIds: ['officer', 'nasu', 'kharidar']
  }
};

export const TARGET_EXAMS_DATA: Record<string, TargetExam> = {
  // ==========================================
  // CATEGORY 1: BANKING SECTOR (बैंकिङ्ग सेवा)
  // ==========================================
  nrb: {
    id: 'nrb',
    categoryId: 'banking',
    nameNe: 'नेपाल राष्ट्र बैंक',
    nameEn: 'Nepal Rastra Bank (NRB)',
    shortName: 'NRB',
    taglineNe: 'केन्द्रीय बैंक सेवा: तह ४ सहायक तथा तह ६ सहायक निर्देशक',
    badgeNe: 'केन्द्रीय बैंक सेवा (Central Bank)',
    colorScheme: {
      primary: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800',
      bg: 'bg-emerald-50/60 dark:bg-emerald-950/20',
      badgeBg: 'bg-emerald-600',
      badgeText: 'text-white'
    },
    levelsNe: 'तह ४ (सहायक द्वितीय) & तह ६ (सहायक निर्देशक)',
    totalPhasesCount: 3,
    descriptionNe: 'नेपालको सर्वोच्च मौद्रिक तथा वित्तीय नियमनकारी निकाय नेपाल राष्ट्र बैंकको खुला तथा समावेशी प्रतियोगितात्मक लिखित तथा पूर्वयोग्यता परीक्षाको आधिकारिक संरचना।',
    eligibilityNe: 'तह ४: १०+२ (वा सो सरह) उत्तीर्ण | तह ६: अर्थशास्त्र, वाणिज्य, व्यवस्थापनमा स्नातकोत्तर (Master Degree)',
    syllabusPdfUrl: '/notes-pdf/financial-statement-ratio-analysis.pdf',
    phases: [
      {
        id: 'phase-1',
        phaseNumber: 1,
        phaseTitleNe: 'चरण १: पूर्वयोग्यता परीक्षा (Pre-Test / Preliminary Exam)',
        phaseTitleEn: 'Phase 1: Pre-Qualifying Objective Test',
        badgeNe: 'वस्तुगत बहुवैकल्पिक (MCQs)',
        formatNe: '५० वस्तुगत प्रश्नहरू (MCQ × २ अंक)',
        fullMarks: 100,
        passMarks: 40,
        timeLimitNe: '४५ मिनेट',
        negativeMarkingNe: '-०.४ अंक (प्रत्येक गलत उत्तरमा २०% कट्टा)',
        descriptionNe: 'प्रथम चरणको पूर्वयोग्यता परीक्षामा उत्तीर्ण हुने उम्मेदवारहरू मात्र द्वितीय चरणको मुख्य लिखित परीक्षामा सहभागी हुन पाउनेछन्।',
        sectionsNe: [
          'खण्ड (क): सामान्य ज्ञान तथा नेपालको भूगोल, इतिहास, संविधान',
          'खण्ड (ख): बैंकिङ, ऐन कानुन तथा मौद्रिक नीति',
          'खण्ड (ग): आधारभूत गणित, कम्प्युटर तथा लेखाविधि'
        ],
        topics: [
          {
            id: 'nrb-act-2058',
            titleNe: 'नेपाल राष्ट्र बैंक ऐन, २०५८ (NRB Act 2058)',
            titleEn: 'Nepal Rastra Bank Act, 2058 (With 2nd Amendment)',
            sectionNe: 'खण्ड (ख): बैंकिङ, ऐन कानुन तथा मौद्रिक नीति',
            category: 'Law',
            weightageMarks: 16,
            readTimeMin: 12,
            keyProvisionsNe: [
              'दफा ३: बैंकको स्थापना, स्वशासित र अविच्छिन्न उत्तराधिकारवाला संस्था',
              'दफा ४: बैंकका ३ प्रमुख उद्देश्यहरू (मूल्य स्थिरता, बाह्य क्षेत्र स्थायित्व, भुक्तानी प्रणाली)',
              'दफा ५: बैंकका काम, कर्तव्य र अधिकार (मौद्रिक नीति, नोट निष्कासन, विदेशी मुद्रा व्यवस्थापन)',
              'दफा १४: सञ्चालक समिति (७ सदस्यीय, गभर्नरको अध्यक्षतामा)',
              'दफा ४३: बैंक नोट तथा सिक्का निष्कासन गर्ने एकाधिकार',
              'दफा ८६ (क देखि ल): शीघ्र सुधारात्मक कारबाही (PCA) र समस्याग्रस्त घोषणा'
            ],
            bulletPointsNe: [
              'नेपाल राष्ट्र बैंक वि.सं. २०१३ वैशाख १४ गते स्थापना भएको हो।',
              'वर्तमान ऐन वि.सं. २०५८ माघ १७ मा प्रमाणीकरण भई दोस्रो संशोधन २०७३ मा सम्पन्न भएको हो।',
              'गभर्नरको नियुक्ति नेपाल सरकार (मन्त्रिपरिषद्) ले अर्थमन्त्रीको संयोजकत्वमा गठित ३ सदस्यीय सिफारिस समितिको सिफारिसमा ५ वर्षका लागि गर्दछ।'
            ],
            lessonSummaryNe: 'नेपाल राष्ट्र बैंक ऐन, २०५८ ले केन्द्रीय बैंकलाई सरकारको बैंकर, सल्लाहकार तथा वित्तीय एजेन्टका रूपमा स्थापित गर्दै पूर्ण संस्थागत, वित्तीय र प्रशासनिक स्वायत्तता प्रदान गरेको छ। मूल्य स्थिरता कायम गर्नु र शोधनान्तर स्थितिलाई सन्तुलनमा राखी दिगो आर्थिक विकास हासिल गर्नु यसको मुख्य ध्येय हो।',
            examTipsNe: [
              'दफा ४ का तीन उद्देश्यहरू र दफा ५ का मुख्य कामहरू कण्ठस्थ राख्नुहोस्।',
              'सञ्चालक समितिका ७ सदस्यहरूको पदसोपान र नियुक्तिको प्रक्रियामा बारम्बार प्रश्न सोधिन्छ।'
            ],
            noteReaderId: 'nrb-act-2058-comprehensive',
            practiceMcqs: [
              {
                id: 'nrb-mcq-1',
                questionNe: 'नेपाल राष्ट्र बैंक ऐन, २०५८ को कुन दफामा बैंकका उद्देश्यहरू उल्लेख गरिएका छन्?',
                optionsNe: ['दफा २', 'दफा ३', 'दफा ४', 'दफा ५'],
                correctIndex: 2,
                explanationNe: 'नेपाल राष्ट्र बैंक ऐन, २०५८ को दफा ४ मा बैंकका प्रमुख उद्देश्यहरू (मूल्य स्थिरता, वित्तीय क्षेत्र स्थायित्व र सुरक्षित भुक्तानी प्रणाली) तोकिएका छन्।'
              },
              {
                id: 'nrb-mcq-2',
                questionNe: 'नेपाल राष्ट्र बैंकको सञ्चालक समिति कति सदस्यीय हुने कानुनी व्यवस्था छ?',
                optionsNe: ['५ सदस्यीय', '७ सदस्यीय', '९ सदस्यीय', '११ सदस्यीय'],
                correctIndex: 1,
                explanationNe: 'दफा १४ बमोजिम गभर्नर (अध्यक्ष), अर्थ मन्त्रालयका सचिव (सदस्य), २ जना डेपुटी गभर्नरहरू र ३ जना सरकारले नियुक्त गरेका विज्ञहरू गरी जम्मा ७ सदस्य हुन्छन्।'
              }
            ]
          },
          {
            id: 'bafia-2073',
            titleNe: 'बैंक तथा वित्तीय संस्था सम्बन्धी ऐन, २०७३ (BAFIA 2073)',
            titleEn: 'Bank and Financial Institutions Act, 2073',
            sectionNe: 'खण्ड (ख): बैंकिङ, ऐन कानुन तथा मौद्रिक नीति',
            category: 'Banking',
            weightageMarks: 14,
            readTimeMin: 14,
            keyProvisionsNe: [
              'दफा ३७: इजाजतपत्रको वर्गीकरण (क वर्ग वाणिज्य बैंक, ख वर्ग विकास बैंक, ग वर्ग वित्त कम्पनी, घ वर्ग लघुवित्त)',
              'दफा ४९: वित्तीय संस्थाहरूले गर्न पाउने बैंकिङ कारोबारहरू',
              'दफा ५०: बैंक तथा वित्तीय संस्थाले गर्न नहुने निषेधित कार्यहरू',
              'दफा १२: सञ्चालकको योग्यता र अयोग्यता (Fit & Proper Criteria)',
              'दफा ४१: पुँजी कोष पर्याप्तता (Capital Adequacy Ratio - Basel III)'
            ],
            bulletPointsNe: [
              'प्रमाणीकरण मिति: वि.सं. २०७४ वैशाख १० (April 23, 2017)।',
              'क वर्गका वाणिज्य बैंकको न्यूनतम चुक्ता पुँजी रु. ८ अर्ब तोकिएको छ।',
              'निक्षेपकर्ताको हित संरक्षण गर्नु BAFIA को सर्वोपरि प्राथमिकता हो।'
            ],
            lessonSummaryNe: 'BAFIA २०७३ ले नेपालका सबै वर्गका बैंक तथा वित्तीय संस्थाहरूको संस्थापना, सञ्चालन, सञ्चालक समितिको उत्तरदायित्व, कर्जा प्रवाह, जोखिम व्यवस्थापन र मर्जर तथा प्राप्तिको कानुनी आधारशिला तय गरेको छ।',
            examTipsNe: [
              'दफा ५० अन्तर्गत बैंकले आफ्ना सञ्चालकलाई कर्जा दिन नपाउने र अचल सम्पत्ति खरिद बिक्रीमा प्रतिबन्ध सम्बन्धी व्यवस्थाहरू दोहोरिने प्रश्नहरू हुन्।'
            ],
            noteReaderId: 'bafia-2073-comprehensive',
            practiceMcqs: [
              {
                id: 'bafia-mcq-1',
                questionNe: 'BAFIA २०७३ अनुसार वाणिज्य बैंक (क वर्ग) को न्यूनतम चुक्ता पुँजी कति तोकिएको छ?',
                optionsNe: ['रु. २ अर्ब', 'रु. ५ अर्ब', 'रु. ८ अर्ब', 'रु. १० अर्ब'],
                correctIndex: 2,
                explanationNe: 'नेपाल राष्ट्र बैंकको निर्देशन तथा BAFIA बमोजिम वाणिज्य बैंकहरूको न्यूनतम चुक्ता पुँजी रु. ८ अर्ब हुनुपर्छ।'
              }
            ]
          },
          {
            id: 'monetary-policy-forex',
            titleNe: 'मौद्रिक नीति तथा विदेशी विनिमय व्यवस्थापन (Monetary Policy & Forex)',
            titleEn: 'Monetary Policy Instruments, Forex Reserves & BOP Analysis',
            sectionNe: 'खण्ड (ख): बैंकिङ, ऐन कानुन तथा मौद्रिक नीति',
            category: 'Economics',
            weightageMarks: 16,
            readTimeMin: 15,
            latexFormula: '\\text{CRR} = \\frac{\\text{Cash Reserve in NRB}}{\\text{Total Domestic Deposit Liability}} \\times 100\\% = 4\\%',
            latexCaption: 'अनिवार्य नगद मौज्दात अनुपात (Cash Reserve Ratio - CRR)',
            keyProvisionsNe: [
              'परिमाणात्मक उपकरणहरू: CRR (४%), SLR (वाणिज्य बैंक १२%, विकास बैंक/वित्त १०%), Bank Rate',
              'विदेशी विनिमय सञ्चिति: न्यूनतम ७ महिनाको वस्तु तथा सेवा आयात धान्न पर्याप्त हुनुपर्ने लक्ष्य'
            ],
            bulletPointsNe: [
              'नेपाल राष्ट्र बैंक ऐन २०५८ को दफा ४४ बमोजिम प्रत्येक आर्थिक वर्षमा वार्षिक मौद्रिक नीति सार्वजनिक गरिन्छ।',
              'ब्याजदर करिडोर (Interest Rate Corridor): माथिल्लो सीमा बैंक दर, नीतिगत दर (Repo Rate), र तल्लो सीमा निक्षेप संकलन दर।'
            ],
            lessonSummaryNe: 'मौद्रिक नीति केन्द्रीय बैंकको मुद्राको परिमाण, उपलब्धता र लागत नियन्त्रण गर्ने प्रमुख साधन हो।',
            examTipsNe: ['CRR र SLR को विद्यमान दरमा प्रश्न प्रायः सोधिन्छ।'],
            noteReaderId: 'note-deposit-credit',
            practiceMcqs: [
              {
                id: 'mp-mcq-1',
                questionNe: 'हाल नेपालमा वाणिज्य बैंकहरूका लागि अनिवार्य नगद मौज्दात (CRR) कति प्रतिशत तोकिएको छ?',
                optionsNe: ['३ प्रतिशत', '४ प्रतिशत', '५ प्रतिशत', '६ प्रतिशत'],
                correctIndex: 1,
                explanationNe: 'हाल नेपाल राष्ट्र बैंकको मौद्रिक नीति अनुसार सबै वर्गका बैंक तथा वित्तीय संस्थाका लागि CRR ४ प्रतिशत कायम गरिएको छ।'
              }
            ]
          }
        ]
      },
      {
        id: 'phase-2',
        phaseNumber: 2,
        phaseTitleNe: 'चरण २: मुख्य लिखित परीक्षा (Main Written Examination)',
        phaseTitleEn: 'Phase 2: Main Subjective Written Papers',
        badgeNe: 'विषयगत विश्लेषणात्मक (Subjective)',
        formatNe: '२ पत्रहरू (प्रत्येक पत्र १०० पूर्णाङ्क, १० प्रश्न × १० अंक)',
        fullMarks: 200,
        passMarks: 80,
        timeLimitNe: '१८० मिनेट (३ घण्टा) प्रति पत्र',
        descriptionNe: 'पूर्वयोग्यता उत्तीर्ण उम्मेदवारहरूका लागि लिइने गहन विषयगत लिखित परीक्षा।',
        sectionsNe: [
          'द्वितीय पत्र: बैंकिङ, लेखा, व्यवस्थापन तथा ऐन नियम (Paper II)',
          'तृतीय पत्र: समष्टिगत अर्थशास्त्र, वित्तीय प्रणाली र IT (Paper III)'
        ],
        topics: [
          {
            id: 'nrb-w-supervision',
            titleNe: 'केन्द्रीय बैंकको स्वायत्तता र जोखिममा आधारित सुपरिवेक्षण (RBS)',
            titleEn: 'Central Bank Autonomy & Risk-Based Supervision Framework',
            sectionNe: 'द्वितीय पत्र: बैंकिङ, लेखा, व्यवस्थापन तथा ऐन नियम (Paper II)',
            category: 'Banking',
            weightageMarks: 20,
            readTimeMin: 20,
            keyProvisionsNe: [
              'स्वायत्तताका ४ आयामहरू: संस्थागत स्वायत्तता, नीतिगत स्वायत्तता, वित्तीय स्वायत्तता र व्यक्तिगत स्वायत्तता',
              'CAMELS सुपरिवेक्षण ढाँचा'
            ],
            bulletPointsNe: ['RBS ले जोखिमको सम्भाव्यताका आधारमा सुपरिवेक्षण गर्दछ।'],
            lessonSummaryNe: 'केन्द्रीय बैंकको स्वायत्तता प्रभावकारी मौद्रिक नीति निर्माणका लागि मेरुदण्ड हो।',
            examTipsNe: ['CAMELS को प्रत्येक अक्षरको विश्लेषण तयार पार्नुहोस्।'],
            practiceMcqs: []
          }
        ]
      },
      {
        id: 'phase-3',
        phaseNumber: 3,
        phaseTitleNe: 'चरण ३: अन्तर्वार्ता तथा कम्प्युटर सीप परीक्षण (Interview & Skill Test)',
        phaseTitleEn: 'Phase 3: Practical Skill Test & Viva Interview',
        badgeNe: 'प्रयोगात्मक + अन्तर्वार्ता',
        formatNe: 'कम्प्युटर सीप परीक्षण र मौखिक अन्तर्वार्ता',
        fullMarks: 50,
        passMarks: 20,
        timeLimitNe: '४५ मिनेट',
        descriptionNe: 'लिखित परीक्षामा सफल उम्मेदवारहरूको व्यावहारिक कम्प्युटर सीप र व्यक्तित्व परीक्षण।',
        sectionsNe: ['कम्प्युटर प्रयोगात्मक सीप परीक्षण', 'व्यक्तिगत मौखिक अन्तर्वार्ता'],
        topics: []
      }
    ]
  },

  rbb: {
    id: 'rbb',
    categoryId: 'banking',
    nameNe: 'राष्ट्रिय वाणिज्य बैंक',
    nameEn: 'Rastriya Banijya Bank (RBB)',
    shortName: 'RBB',
    taglineNe: 'नेपालको सबैभन्दा ठूलो सरकारी स्वामित्वको वाणिज्य बैंक',
    badgeNe: 'सरकारी वाणिज्य बैंक',
    colorScheme: {
      primary: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      bg: 'bg-blue-50/60 dark:bg-blue-950/20',
      badgeBg: 'bg-blue-600',
      badgeText: 'text-white'
    },
    levelsNe: 'तह ४ (सहायक) & तह ५ (वरिष्ठ सहायक - नगद/प्रशासन)',
    totalPhasesCount: 3,
    descriptionNe: 'राष्ट्रिय वाणिज्य बैंक लिमिटेडको खुला तथा समावेशी प्रतियोगितात्मक परीक्षा। सरकारी स्वामित्वको पूर्ण सुरक्षित बैंकिङ करियर।',
    eligibilityNe: 'तह ४: १०+२ वा सो सरह उत्तीर्ण | तह ५: स्नातक तह (Bachelor Degree) उत्तीर्ण',
    phases: [
      {
        id: 'phase-1',
        phaseNumber: 1,
        phaseTitleNe: 'चरण १: पूर्वयोग्यता वस्तुगत परीक्षा (Pre-Test MCQs)',
        phaseTitleEn: 'Phase 1: Pre-Qualifying Objective Test',
        badgeNe: 'वस्तुगत बहुवैकल्पिक (MCQs)',
        formatNe: '५० प्रश्नहरू (प्रत्येक २ अंक, कुल १०० पूर्णाङ्क)',
        fullMarks: 100,
        passMarks: 40,
        timeLimitNe: '४५ मिनेट',
        negativeMarkingNe: '-०.४ अंक (२०% कट्टा)',
        descriptionNe: 'सामान्य ज्ञान, बैंकिङ कारोबार, लेखा र ऐन नियम समेटिएको ५० प्रश्नहरूको वस्तुगत परीक्षा।',
        sectionsNe: [
          'बैंकिङ कारोबार, ग्राहक सेवा तथा रेमिट्यान्स',
          'BAFIA २०७३ र बैंकिङ कसूर ऐन २०६४',
          'दोहोरो लेखा प्रणाली, गोश्वारा भौचर र BRS'
        ],
        topics: [
          {
            id: 'rbb-banking-operations',
            titleNe: 'वाणिज्य बैंकिङ कारोबार, निक्षेप तथा कर्जा परिचालन',
            titleEn: 'Commercial Banking Operations: Deposits, Lending & Remittance',
            sectionNe: 'बैंकिङ कारोबार, ग्राहक सेवा तथा रेमिट्यान्स',
            category: 'Banking',
            weightageMarks: 25,
            readTimeMin: 12,
            keyProvisionsNe: [
              'निक्षेपका प्रकारहरू: चल्ती, बचत, मुद्दती र कल निक्षेप',
              'कर्जाका प्रकारहरू: आवधिक कर्जा (Term Loan), चालु पुँजी कर्जा (Working Capital)',
              'विप्रेषण (Remittance) कारोबार र बैंक ग्यारेन्टी'
            ],
            bulletPointsNe: [
              'कर्जा वर्गीकरण: असल, सूक्ष्म निगरानी, कमसल, शंकास्पद, खराब।'
            ],
            lessonSummaryNe: 'वाणिज्य बैंकहरूको मुख्य आम्दानीको स्रोत ब्याज आम्दानी हो। प्रभावकारी निक्षेप संकलन बैंकको आधार हो।',
            examTipsNe: ['कर्जा नोक्सानी व्यवस्था (Loan Loss Provisioning) का दरहरू कण्ठ गर्नुहोस्।'],
            noteReaderId: 'note-deposit-credit',
            practiceMcqs: [
              {
                id: 'rbb-mcq-1',
                questionNe: 'नेपाल राष्ट्र बैंकको निर्देशन अनुसार असल कर्जा (Pass Loan) मा कति प्रतिशत कर्जा नोक्सानी व्यवस्था गर्नुपर्छ?',
                optionsNe: ['१.२० प्रतिशत', '१.२५ प्रतिशत', '५.०० प्रतिशत', '२५.०० प्रतिशत'],
                correctIndex: 0,
                explanationNe: 'हाल असल (Pass) कर्जामा १.२०% कर्जा नोक्सानी व्यवस्था (Loan Loss Provision) गर्नुपर्ने व्यवस्था छ।'
              }
            ]
          }
        ]
      },
      {
        id: 'phase-2',
        phaseNumber: 2,
        phaseTitleNe: 'चरण २: मुख्य लिखित परीक्षा (Main Written Exam)',
        phaseTitleEn: 'Phase 2: Main Subjective Examination',
        badgeNe: 'विषयगत लिखित',
        formatNe: '२ पत्रहरू (प्रत्येक १०० पूर्णाङ्क)',
        fullMarks: 200,
        passMarks: 80,
        timeLimitNe: '१८० मिनेट प्रति पत्र',
        descriptionNe: 'व्यवस्थापन, बैंकिङ, लेखा, अर्थशास्त्र र कानुनी प्रणाली सम्बन्धी विश्लेषणात्मक प्रश्नोत्तर।',
        sectionsNe: ['प्रथम पत्र: बैंकिङ र व्यवस्थापन', 'द्वितीय पत्र: लेखा तथा अर्थशास्त्र'],
        topics: []
      }
    ]
  },

  nbl: {
    id: 'nbl',
    categoryId: 'banking',
    nameNe: 'नेपाल बैंक लिमिटेड',
    nameEn: 'Nepal Bank Limited (NBL)',
    shortName: 'NBL',
    taglineNe: 'नेपालको पहिलो बैंक (स्थापना: वि.सं. १९९४ कार्तिक ३०)',
    badgeNe: 'ऐतिहासिक पहिलो बैंक',
    colorScheme: {
      primary: 'text-indigo-700 dark:text-indigo-400',
      border: 'border-indigo-200 dark:border-indigo-800',
      bg: 'bg-indigo-50/60 dark:bg-indigo-950/20',
      badgeBg: 'bg-indigo-600',
      badgeText: 'text-white'
    },
    levelsNe: 'तह ३ (कनिष्ठ सहायक) & तह ४ (सहायक)',
    totalPhasesCount: 3,
    descriptionNe: 'नेपालको आधुनिक बैंकिङ इतिहासको सुरुआत गर्ने ऐतिहासिक नेपाल बैंक लिमिटेडको खुला तथा समावेशी प्रतियोगितात्मक परीक्षा।',
    eligibilityNe: 'तह ३: SLC/SEE उत्तीर्ण | तह ४: १०+२ (वा सो सरह) उत्तीर्ण',
    phases: [
      {
        id: 'phase-1',
        phaseNumber: 1,
        phaseTitleNe: 'चरण १: पूर्वयोग्यता परीक्षा (Pre-Test)',
        phaseTitleEn: 'Phase 1: Pre-Qualifying MCQs',
        badgeNe: 'वस्तुगत MCQs',
        formatNe: '५० प्रश्नहरू (१०० पूर्णाङ्क)',
        fullMarks: 100,
        passMarks: 40,
        timeLimitNe: '४५ मिनेट',
        negativeMarkingNe: '-०.४ अंक (२०% कट्टा)',
        descriptionNe: 'बैंकिङ इतिहास, सामान्य ज्ञान, आधारभूत लेखा र कानुन समेटिएको परीक्षा।',
        sectionsNe: ['नेपाल बैंकको इतिहास र बैंकिङ विकास', 'सामान्य ज्ञान र कम्प्युटर', 'लेखा तथा गणित'],
        topics: [
          {
            id: 'nbl-history-heritage',
            titleNe: 'नेपाल बैंकको स्थापना, इतिहास र बैंकिङ विकासक्रम',
            titleEn: 'Establishment of Nepal Bank, Banking History & Evolution',
            sectionNe: 'नेपाल बैंकको इतिहास र बैंकिङ विकास',
            category: 'History',
            weightageMarks: 20,
            readTimeMin: 10,
            keyProvisionsNe: [
              'स्थापना: वि.सं. १९९४ कार्तिक ३० (15 November 1937) राजा त्रिभुवनको पालामा',
              'उद्घाटन: प्रधानमन्त्री जुद्ध शमशेर जबराद्वारा',
              'प्रारम्भिक चुक्ता पुँजी: ८ लाख ४२ हजार रुपैयाँ'
            ],
            bulletPointsNe: [
              'नेपालमा कागजी मुद्रा निष्कासन हुनुअगावै नेपाल बैंकको स्थापना भएको हो।',
              'हाल नेपाल बैंक आधुनिक डिजिटल प्रविधिसहितको क वर्गको वाणिज्य बैंक हो।'
            ],
            lessonSummaryNe: 'नेपाल बैंकको स्थापनाले नेपालमा परम्परागत साहुमहाजनको ऋण प्रणालीको अन्त्य गरी आधुनिक वित्तीय प्रणालीको जग बसालेको थियो।',
            examTipsNe: ['स्थापना मिति र प्रारम्भिक पुँजी लोकसेवा र बैंकिङ परीक्षामा बारम्बार सोधिने प्रश्न हो।'],
            practiceMcqs: [
              {
                id: 'nbl-mcq-1',
                questionNe: 'नेपाल बैंक लिमिटेडको स्थापना कहिले भएको थियो?',
                optionsNe: ['वि.सं. १९९० वैशाख १', 'वि.सं. १९९४ कार्तिक ३०', 'वि.सं. २०१३ वैशाख १४', 'वि.सं. २०२४ माघ ७'],
                correctIndex: 1,
                explanationNe: 'नेपाल बैंक लिमिटेडको स्थापना वि.सं. १९९४ कार्तिक ३० गते भएको हो।'
              }
            ]
          }
        ]
      }
    ]
  },

  adbl: {
    id: 'adbl',
    categoryId: 'banking',
    nameNe: 'कृषि विकास बैंक',
    nameEn: 'Agricultural Development Bank (ADBL)',
    shortName: 'ADBL',
    taglineNe: 'कृषि, ग्रामीण तथा समावेशी बैंकिङको अग्रणी बैंक',
    badgeNe: 'कृषि तथा विकास वित्त',
    colorScheme: {
      primary: 'text-teal-700 dark:text-teal-400',
      border: 'border-teal-200 dark:border-teal-800',
      bg: 'bg-teal-50/60 dark:bg-teal-950/20',
      badgeBg: 'bg-teal-600',
      badgeText: 'text-white'
    },
    levelsNe: 'तह ४ (लेखापाल/सहायक) & तह ५ (व्यवसाय सहायक)',
    totalPhasesCount: 3,
    descriptionNe: 'नेपालको कृषि तथा ग्रामीण अर्थतन्त्रलाई गति दिन वि.सं. २०२४ मा स्थापित कृषि विकास बैंक लिमिटेडको खुला प्रतियोगितात्मक परीक्षा।',
    eligibilityNe: 'तह ४: १०+२ उत्तीर्ण | तह ५: वाणिज्य, अर्थशास्त्र वा व्यवस्थापनमा स्नातक',
    phases: [
      {
        id: 'phase-1',
        phaseNumber: 1,
        phaseTitleNe: 'चरण १: पूर्वयोग्यता परीक्षा (Pre-Test Examination)',
        phaseTitleEn: 'Phase 1: Pre-Qualifying Test',
        badgeNe: 'वस्तुगत MCQs',
        formatNe: '५० प्रश्नहरू (१०० पूर्णाङ्क)',
        fullMarks: 100,
        passMarks: 40,
        timeLimitNe: '४५ मिनेट',
        descriptionNe: 'कृषि वित्त, ग्रामीण बैंकिङ, सामान्य ज्ञान र आधारभूत लेखा सम्बन्धी वस्तुगत परीक्षा।',
        sectionsNe: ['कृषि कर्जा तथा साना किसान वित्त', 'बैंकिङ ऐन नियम र संस्थागत इतिहास', 'लेखा तथा कम्प्युटर'],
        topics: [
          {
            id: 'adbl-agri-banking',
            titleNe: 'कृषि कर्जा, परियोजना धितो र साना किसान विकास',
            titleEn: 'Agricultural Credit, Project Financing & Small Farmers Development',
            sectionNe: 'कृषि कर्जा तथा साना किसान वित्त',
            category: 'Banking',
            weightageMarks: 30,
            readTimeMin: 12,
            keyProvisionsNe: [
              'कृषि विकास बैंक ऐन, २०२४ को ऐतिहासिक पृष्ठभूमि र रूपान्तरण',
              'प्राथमिकता प्राप्त क्षेत्र कर्जा (कृषि क्षेत्रमा न्यूनतम १५% कर्जा)',
              'सहुलियतपूर्ण कर्जाका लागि ब्याज अनुदान सम्बन्धी कार्यविधि'
            ],
            bulletPointsNe: [
              'ADBL को स्थापना वि.सं. २०२४ माघ ७ मा भएको थियो।',
              'हाल यो BAFIA अन्तर्गतको ‘क’ वर्गको वाणिज्य बैंकको रूपमा सञ्चालित छ।'
            ],
            lessonSummaryNe: 'कृषि क्षेत्रको उत्पादकत्व वृद्धि, किसानलाई सहुलियत दरमा कर्जा र ग्रामीण क्षेत्रमा वित्तीय पहुँच विस्तारमा ADBL को अग्रणी योगदान रहेको छ।',
            examTipsNe: ['सहुलियतपूर्ण कर्जाका शीर्षकहरू र ब्याज अनुदानको प्रतिशत परीक्षामा सोधिन्छ।'],
            practiceMcqs: [
              {
                id: 'adbl-mcq-1',
                questionNe: 'कृषि विकास बैंकको स्थापना कहिले भएको थियो?',
                optionsNe: ['वि.सं. २०१३ वैशाख १४', 'वि.सं. २०२४ माघ ७', 'वि.सं. २०२२ माघ १०', 'वि.सं. २०३१ असार १'],
                correctIndex: 1,
                explanationNe: 'कृषि विकास बैंकको स्थापना वि.सं. २०२४ माघ ७ मा भएको थियो।'
              }
            ]
          }
        ]
      }
    ]
  },

  // ===============================================
  // CATEGORY 2: PUBLIC ENTERPRISES (संगठित संस्था)
  // ===============================================
  ntc: {
    id: 'ntc',
    categoryId: 'enterprises',
    nameNe: 'नेपाल टेलिकम',
    nameEn: 'Nepal Telecom (NTC)',
    shortName: 'NTC',
    taglineNe: 'नेपाल दूरसञ्चार कम्पनी लिमिटेड: तह ४ सहायक तथा तह ६ अधिकृत स्तर',
    badgeNe: 'दूरसञ्चार सेवा (Telecom)',
    colorScheme: {
      primary: 'text-sky-700 dark:text-sky-400',
      border: 'border-sky-200 dark:border-sky-800',
      bg: 'bg-sky-50/60 dark:bg-sky-950/20',
      badgeBg: 'bg-sky-600',
      badgeText: 'text-white'
    },
    levelsNe: 'तह ४ (सहायक/टेक्निकल) & तह ६ (अधिकृत/इन्जिनियर)',
    totalPhasesCount: 3,
    descriptionNe: 'नेपालको राष्ट्रिय दूरसञ्चार सेवा प्रदायक नेपाल दूरसञ्चार कम्पनी लिमिटेड (NTC) को प्रशासन तथा प्राविधिक तर्फको प्रतियोगितात्मक परीक्षा।',
    eligibilityNe: 'तह ४: १०+२ वा सम्बन्धित विषयमा डिप्लोमा | तह ६: स्नातक/इन्जिनियरिङ',
    phases: [
      {
        id: 'phase-1',
        phaseNumber: 1,
        phaseTitleNe: 'चरण १: सामान्य ज्ञान, बौद्धिक परीक्षण र संस्थान सम्बन्धी',
        phaseTitleEn: 'Phase 1: GK, IQ & Enterprise Fundamentals',
        badgeNe: 'वस्तुगत बहुवैकल्पिक (MCQs)',
        formatNe: '५० प्रश्नहरू (१०० पूर्णाङ्क)',
        fullMarks: 100,
        passMarks: 40,
        timeLimitNe: '४५ मिनेट',
        negativeMarkingNe: '-०.४ अंक (२०% कट्टा)',
        descriptionNe: 'नेपालको भूगोल, इतिहास, संविधान, दूरसञ्चार ऐन २०५३ र सामान्य बौद्धिक परीक्षण।',
        sectionsNe: ['सामान्य ज्ञान तथा संविधान', 'दूरसञ्चार ऐन २०५३ र NTC इतिहास', 'तार्किक बौद्धिक परीक्षण (IQ)'],
        topics: [
          {
            id: 'ntc-telecom-act',
            titleNe: 'दूरसञ्चार ऐन, २०५३ र नेपाल दूरसञ्चार प्राधिकरण (NTA)',
            titleEn: 'Telecommunications Act 2053 & NTA Regulatory Framework',
            sectionNe: 'दूरसञ्चार ऐन २०५३ र NTC इतिहास',
            category: 'Law',
            weightageMarks: 20,
            readTimeMin: 12,
            keyProvisionsNe: [
              'दूरसञ्चार ऐन, २०५३ ले दूरसञ्चार सेवालाई नियमित, व्यवस्थित र प्रतिस्पर्धी बनाएको छ',
              'नेपाल दूरसञ्चार प्राधिकरण (NTA) को नियामक भूमिका र फ्रिक्वेन्सी व्यवस्थापन',
              'ग्राहकको गोपनीयता र दूरसञ्चार सेवाको गुणस्तर मापदण्ड'
            ],
            bulletPointsNe: [
              'NTC को स्थापना २०३२ मा दूरसञ्चार संस्थानको रूपमा भई २०६० मा कम्पनीमा रूपान्तरण भयो।'
            ],
            lessonSummaryNe: 'दूरसञ्चार ऐन २०५३ ले नेपालमा दूरसञ्चार क्षेत्रको उदारीकरण र निजी क्षेत्रको सहभागिताको ढोका खोलेको थियो।',
            examTipsNe: ['प्राधिकरणका अधिकार र कम्पनी ऐन २०६३ का प्रमुख दफाहरू हेर्नुहोस्।'],
            practiceMcqs: [
              {
                id: 'ntc-mcq-1',
                questionNe: 'दूरसञ्चार ऐन, २०५३ अनुसार नेपाल दूरसञ्चार प्राधिकरणको गठन कुन दफामा गरिएको छ?',
                optionsNe: ['दफा ३', 'दफा ५', 'दफा १०', 'दफा १२'],
                correctIndex: 0,
                explanationNe: 'दूरसञ्चार ऐन, २०५३ को दफा ३ मा नेपाल दूरसञ्चार प्राधिकरण (NTA) को स्थापनाको व्यवस्था छ।'
              }
            ]
          }
        ]
      }
    ]
  },

  nea: {
    id: 'nea',
    categoryId: 'enterprises',
    nameNe: 'नेपाल विद्युत प्राधिकरण',
    nameEn: 'Nepal Electricity Authority (NEA)',
    shortName: 'NEA',
    taglineNe: 'ऊर्जा क्षेत्रको सर्वोच्च सार्वजनिक संस्थान: तह ३, ४, ५ र ७ स्तर',
    badgeNe: 'ऊर्जा तथा जलविद्युत',
    colorScheme: {
      primary: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
      bg: 'bg-amber-50/60 dark:bg-amber-950/20',
      badgeBg: 'bg-amber-600',
      badgeText: 'text-white'
    },
    levelsNe: 'तह ४ (सहायक लेखापाल/प्रशासन) & तह ५ (लेखापाल/सुपरभाइजर)',
    totalPhasesCount: 3,
    descriptionNe: 'नेपाल विद्युत प्राधिकरण (NEA) को खुला तथा समावेशी प्रतियोगितात्मक लिखित परीक्षा। राष्ट्रिय प्रसारण, वितरण तथा जलविद्युत व्यवस्थापन।',
    eligibilityNe: 'तह ४: १०+२ वा सम्बन्धित विषयमा प्रवीणता | तह ५: स्नातक तह',
    phases: [
      {
        id: 'phase-1',
        phaseNumber: 1,
        phaseTitleNe: 'चरण १: सामान्य ज्ञान, जलविद्युत र सेवा सम्बन्धी वस्तुगत',
        phaseTitleEn: 'Phase 1: Pre-Test GK & Electricity Operations',
        badgeNe: 'वस्तुगत MCQs',
        formatNe: '५० प्रश्नहरू (१०० पूर्णाङ्क)',
        fullMarks: 100,
        passMarks: 40,
        timeLimitNe: '४५ मिनेट',
        descriptionNe: 'नेपालको जलस्रोत, उर्जा विकास, विद्युत ऐन २०४९ र NEA कर्मचारी विनियमावली।',
        sectionsNe: ['जलस्रोत तथा जलविद्युत आयोजनाहरू', 'विद्युत ऐन २०४९ र नियमन', 'लेखा, व्यवस्थापन र IQ'],
        topics: [
          {
            id: 'nea-electricity-act',
            titleNe: 'विद्युत ऐन, २०४९ र नेपाल विद्युत प्राधिकरण ऐन, २०४१',
            titleEn: 'Electricity Act 2049 & NEA Act 2041',
            sectionNe: 'विद्युत ऐन २०४९ र नियमन',
            category: 'Law',
            weightageMarks: 20,
            readTimeMin: 12,
            keyProvisionsNe: [
              'नेपाल विद्युत प्राधिकरण ऐन, २०४१ अन्तर्गत २०४२ भदौ १ मा NEA को स्थापना भएको हो',
              'विद्युत उत्पादन, प्रसारण र वितरणको एकाधिकार र खुला पहुँच (Open Access) नीति',
              'विद्युत चुहावट नियन्त्रण ऐन, २०५८'
            ],
            bulletPointsNe: [
              'विद्युत विकास दशक र नेपालको स्वच्छ ऊर्जा निर्यात रणनीति।'
            ],
            lessonSummaryNe: 'नेपालमा ऊर्जा आत्मनिर्भरता र क्रस-बोर्डर विद्युत व्यापारमा विद्युत ऐन र नियमनकारी आयोगको भूमिका अहम् छ।',
            examTipsNe: ['स्थापना मिति (२०४२ भदौ १) र विद्युत महसुल निर्धारण प्रक्रियामा प्रश्न सोधिन्छ।'],
            practiceMcqs: [
              {
                id: 'nea-mcq-1',
                questionNe: 'नेपाल विद्युत प्राधिकरणको स्थापना कहिले भएको थियो?',
                optionsNe: ['वि.सं. २०३२ असार १', 'वि.सं. २०४१ माघ १०', 'वि.सं. २०४२ भदौ १', 'वि.सं. २०४९ असोज १'],
                correctIndex: 2,
                explanationNe: 'नेपाल विद्युत प्राधिकरणको स्थापना वि.सं. २०४२ भदौ १ गते भएको हो।'
              }
            ]
          }
        ]
      }
    ]
  },

  epf: {
    id: 'epf',
    categoryId: 'enterprises',
    nameNe: 'कर्मचारी सञ्चय कोष',
    nameEn: 'Employees Provident Fund (EPF)',
    shortName: 'EPF',
    taglineNe: 'सामाजिक सुरक्षा तथा दीर्घकालीन बचत व्यवस्थापन: तह ४, ५ र ६',
    badgeNe: 'सामाजिक सुरक्षा कोष',
    colorScheme: {
      primary: 'text-violet-700 dark:text-violet-400',
      border: 'border-violet-200 dark:border-violet-800',
      bg: 'bg-violet-50/60 dark:bg-violet-950/20',
      badgeBg: 'bg-violet-600',
      badgeText: 'text-white'
    },
    levelsNe: 'तह ४ (सहायक) & तह ५ (वरिष्ठ सहायक) & तह ६ (अधिकृत)',
    totalPhasesCount: 3,
    descriptionNe: 'सरकारी तथा संगठित संस्थाका कर्मचारीहरूको सञ्चय कोष तथा सामाजिक सुरक्षा योजना सञ्चालन गर्ने कर्मचारी सञ्चय कोषको परीक्षा।',
    eligibilityNe: 'तह ४: १०+२ उत्तीर्ण | तह ५: स्नातक तह | तह ६: स्नातकोत्तर',
    phases: [
      {
        id: 'phase-1',
        phaseNumber: 1,
        phaseTitleNe: 'चरण १: पूर्वयोग्यता वस्तुगत परीक्षा (MCQs)',
        phaseTitleEn: 'Phase 1: Pre-Qualifying Objective Test',
        badgeNe: 'वस्तुगत MCQs',
        formatNe: '५० प्रश्नहरू (१०० पूर्णाङ्क)',
        fullMarks: 100,
        passMarks: 40,
        timeLimitNe: '४५ मिनेट',
        descriptionNe: 'कर्मचारी सञ्चय कोष ऐन २०१९, लगानी नीति, सामाजिक सुरक्षा र लेखाविधि।',
        sectionsNe: ['कर्मचारी सञ्चय कोष ऐन २०१९', 'लगानी नीति र सामाजिक सुरक्षण', 'लेखा र कार्यालय व्यवस्थापन'],
        topics: [
          {
            id: 'epf-act-2019',
            titleNe: 'कर्मचारी सञ्चय कोष ऐन, २०१९ र सामाजिक सुरक्षा सुविधाहरू',
            titleEn: 'Employees Provident Fund Act 2019 & Social Security Schemes',
            sectionNe: 'कर्मचारी सञ्चय कोष ऐन २०१९',
            category: 'Law',
            weightageMarks: 25,
            readTimeMin: 12,
            keyProvisionsNe: [
              'वि.सं. २०१९ असोज १ मा कर्मचारी सञ्चय कोषको स्थापना भएको हो',
              'कट्टी हुने कोष रकम: १०% कर्मचारी र १०% रोजगारदाता गरी कुल २०%',
              'कोषका कल्याणकारी सुविधाहरू: काजकिरिया अनुदान, सुत्केरी स्याहार, दुर्घटना क्षतिपूर्ति र औषधोपचार'
            ],
            bulletPointsNe: [
              'कोष रकमको लगानी: पूर्वाधार, जलविद्युत, रियल स्टेट र सुरक्षित सरकारी ऋणपत्र।'
            ],
            lessonSummaryNe: 'कर्मचारी सञ्चय कोषले देशको कुल बचत परिचालन र राष्ट्रिय गौरवका आयोजनाहरूमा दीर्घकालीन पुँजी जुटाउने कार्य गर्दछ।',
            examTipsNe: ['कल्याणकारी सुविधाहरूको विवरण र लगानी विविधीकरणबाट प्रश्न सोधिन्छ।'],
            practiceMcqs: [
              {
                id: 'epf-mcq-1',
                questionNe: 'कर्मचारी सञ्चय कोषको स्थापना कहिले भएको थियो?',
                optionsNe: ['वि.सं. २०१६ असार १', 'वि.सं. २०१९ असोज १', 'वि.सं. २०२४ माघ ७', 'वि.सं. २०३१ असार १'],
                correctIndex: 1,
                explanationNe: 'कर्मचारी सञ्चय कोषको स्थापना वि.सं. २०१९ असोज १ गते भएको हो।'
              }
            ]
          }
        ]
      }
    ]
  },

  cit: {
    id: 'cit',
    categoryId: 'enterprises',
    nameNe: 'नागरिक लगानी कोष',
    nameEn: 'Citizen Investment Trust (CIT)',
    shortName: 'CIT',
    taglineNe: 'पुँजी बजार तथा नागरिक बचत परिचालनको अग्रणी वित्तीय संस्था',
    badgeNe: 'लगानी तथा पुँजी बजार',
    colorScheme: {
      primary: 'text-rose-700 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-800',
      bg: 'bg-rose-50/60 dark:bg-rose-950/20',
      badgeBg: 'bg-rose-600',
      badgeText: 'text-white'
    },
    levelsNe: 'तह ४ (सहायक) & तह ५ (वरिष्ठ सहायक) & तह ६ (अधिकृत)',
    totalPhasesCount: 3,
    descriptionNe: 'नागरिक लगानी कोष ऐन २०४७ अन्तर्गत स्थापित पुँजी बजारको विकास, नागरिक पेन्सन योजना र बचत परिचालनको आधिकारिक परीक्षा।',
    eligibilityNe: 'तह ४: १०+२ उत्तीर्ण | तह ५: स्नातक तह उत्तीर्ण',
    phases: [
      {
        id: 'phase-1',
        phaseNumber: 1,
        phaseTitleNe: 'चरण १: पूर्वयोग्यता वस्तुगत परीक्षा (MCQs)',
        phaseTitleEn: 'Phase 1: Pre-Qualifying Test',
        badgeNe: 'वस्तुगत MCQs',
        formatNe: '५० प्रश्नहरू (१०० पूर्णाङ्क)',
        fullMarks: 100,
        passMarks: 40,
        timeLimitNe: '४५ मिनेट',
        descriptionNe: 'नागरिक लगानी कोष ऐन २०४७, नागरिक पेन्सन योजना, पुँजी बजार र वित्तीय विश्लेषण।',
        sectionsNe: ['नागरिक लगानी कोष ऐन २०४७', 'पुँजी बजार तथा म्युचुअल फन्ड', 'लेखा र वित्तीय व्यवस्थापन'],
        topics: [
          {
            id: 'cit-act-2047',
            titleNe: 'नागरिक लगानी कोष ऐन, २०४७ र नागरिक पेन्सन योजना',
            titleEn: 'Citizen Investment Trust Act 2047 & Citizen Pension Scheme',
            sectionNe: 'नागरिक लगानी कोष ऐन २०४७',
            category: 'Law',
            weightageMarks: 25,
            readTimeMin: 12,
            keyProvisionsNe: [
              'स्थापना: वि.सं. २०४७ चैत ४ (18 March 1991)',
              'नागरिक पेन्सन योजना: सर्वसाधारण नेपाली नागरिकलाई लक्षित निवृत्तभरण कार्यक्रम',
              'पुँजी बजार विकास: शेयर निष्कासन तथा बिक्री प्रबन्धक (Issue Manager) र अन्डरराइटिङ'
            ],
            bulletPointsNe: [
              'CIT ले देशको आन्तरिक स्रोत परिचालन र शेयर बजार स्थिरीकरण कोषमा काम गर्दछ।'
            ],
            lessonSummaryNe: 'नागरिक लगानी कोष ऐन २०४७ ले नागरिकहरूमा बचतको बानी विकास गर्न र पुँजी बजारमा लगानी विविधीकरण गर्न संस्थालाई अधिकार दिएको छ।',
            examTipsNe: ['नागरिक पेन्सन योजनाका मुख्य विशेषता र स्थापना मिति कण्ठ गर्नुहोस्।'],
            practiceMcqs: [
              {
                id: 'cit-mcq-1',
                questionNe: 'नागरिक लगानी कोष (CIT) को स्थापना कहिले भएको थियो?',
                optionsNe: ['वि.सं. २०४४ असार १', 'वि.सं. २०४७ चैत ४', 'वि.सं. २०५० वैशाख १', 'वि.सं. २०५५ असोज १'],
                correctIndex: 1,
                explanationNe: 'नागरिक लगानी कोषको स्थापना वि.सं. २०४७ चैत ४ गते भएको थियो।'
              }
            ]
          }
        ]
      }
    ]
  },

  // ===============================================
  // CATEGORY 3: PSC CIVIL SERVICE (निजामती / लोकसेवा)
  // ===============================================
  officer: {
    id: 'officer',
    categoryId: 'loksewa',
    nameNe: 'शाखा अधिकृत (Section Officer)',
    nameEn: 'PSC Section Officer (Gazetted Class III)',
    shortName: 'शाखा अधिकृत',
    taglineNe: 'नेपाल प्रशासन सेवा (सामान्य प्रशासन, लेखा, राजस्व): रा.प. तृतीय श्रेणी',
    badgeNe: 'रा.प.तृतीय श्रेणी (अधिकृत)',
    colorScheme: {
      primary: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
      bg: 'bg-amber-50/60 dark:bg-amber-950/20',
      badgeBg: 'bg-amber-600',
      badgeText: 'text-white'
    },
    levelsNe: 'रा.प. तृतीय श्रेणी (अधिकृत स्तर - Level 6)',
    totalPhasesCount: 3,
    descriptionNe: 'लोक सेवा आयोगद्वारा सञ्चालन गरिने नेपाल निजामती सेवाको सर्वोच्च प्राथमिक प्रवेशद्वार शाखा अधिकृत (Section Officer) पदको परीक्षा।',
    eligibilityNe: 'मान्यता प्राप्त विश्वविद्यालयबाट स्नातक तह (Bachelor Degree) उत्तीर्ण।',
    phases: [
      {
        id: 'phase-1',
        phaseNumber: 1,
        phaseTitleNe: 'चरण १: प्रशासनिक अभिरुचि परीक्षण (Aptitude Test - GK & IQ)',
        phaseTitleEn: 'Phase 1: Administrative Aptitude Test (GK & IQ)',
        badgeNe: 'वस्तुगत बहुवैकल्पिक (MCQs)',
        formatNe: '१०० प्रश्नहरू (प्रत्येक १ अंक, १०० पूर्णाङ्क)',
        fullMarks: 100,
        passMarks: 40,
        timeLimitNe: '९० मिनेट',
        negativeMarkingNe: '-०.२ अंक (२०% कट्टा)',
        descriptionNe: 'विश्व तथा नेपालको भूगोल, इतिहास, शासन प्रणाली, अन्तर्राष्ट्रिय सम्बन्ध र बौद्धिक परीक्षण (IQ)।',
        sectionsNe: ['सामान्य ज्ञान (General Knowledge)', 'सामान्य बौद्धिक परीक्षण (General Mental Ability)'],
        topics: [
          {
            id: 'officer-constitution',
            titleNe: 'नेपालको संविधान (२०७२): राज्यको संरचना र शक्ति पृथकीकरण',
            titleEn: 'Constitution of Nepal: State Structure & Separation of Powers',
            sectionNe: 'सामान्य ज्ञान (General Knowledge)',
            category: 'Loksewa',
            weightageMarks: 20,
            readTimeMin: 15,
            keyProvisionsNe: [
              'भाग ३: ३१ वटा मौलिक हकहरू र तिनको कार्यान्वयन',
              'भाग ५: संघ, प्रदेश र स्थानीय तह बीचको अन्तरसम्बन्ध (सहकारिता, सहअस्तित्व र समन्वय)',
              'धारा ५१ (घ): अर्थ, उद्योग र वाणिज्य सम्बन्धी राज्यका नीतिहरू'
            ],
            bulletPointsNe: [
              'संविधानमा ३५ भाग, ३०८ धारा र ९ अनुसूचीहरू रहेका छन्।'
            ],
            lessonSummaryNe: 'नेपालको वर्तमान संविधानले संघीय लोकतान्त्रिक गणतन्त्रात्मक प्रणालीलाई संस्थागत गर्दै सुशासन र कानुनी शासनको प्रत्याभूति गरेको छ।',
            examTipsNe: ['मौलिक हक र संघ-प्रदेश अधिकार सूची अनुसूची ५, ६, ७, ८, ९ अनिवार्य कण्ठ पार्नुहोस्।'],
            practiceMcqs: [
              {
                id: 'off-mcq-1',
                questionNe: 'नेपालको संविधानमा संघ, प्रदेश र स्थानीय तहको साझा अधिकार कुन अनुसूचीमा छ?',
                optionsNe: ['अनुसूची ७', 'अनुसूची ८', 'अनुसूची ९', 'अनुसूची ६'],
                correctIndex: 2,
                explanationNe: 'नेपालको संविधानको अनुसूची ९ मा संघ, प्रदेश र स्थानीय तहको साझा अधिकार सूची व्यवस्था गरिएको छ।'
              }
            ]
          }
        ]
      }
    ]
  },

  nasu: {
    id: 'nasu',
    categoryId: 'loksewa',
    nameNe: 'नायब सुब्बा (Nayab Subba)',
    nameEn: 'PSC Nayab Subba (Non-Gazetted 1st Class)',
    shortName: 'नायब सुब्बा (नासु)',
    taglineNe: 'निजामती प्रशासन तथा लेखा सेवा: रा.प.अनं. प्रथम श्रेणी',
    badgeNe: 'रा.प.अनं. प्रथम श्रेणी',
    colorScheme: {
      primary: 'text-orange-700 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-800',
      bg: 'bg-orange-50/60 dark:bg-orange-950/20',
      badgeBg: 'bg-orange-600',
      badgeText: 'text-white'
    },
    levelsNe: 'रा.प.अनं. प्रथम श्रेणी (Level 5)',
    totalPhasesCount: 3,
    descriptionNe: 'लोक सेवा आयोगद्वारा सञ्चालन गरिने नायब सुब्बा (प्रशासन, लेखा, राजस्व) पदको खुला प्रतियोगितात्मक परीक्षा।',
    eligibilityNe: 'मान्यता प्राप्त शिक्षण संस्थाबाट १०+२ (वा सो सरह) उत्तीर्ण।',
    phases: [
      {
        id: 'phase-1',
        phaseNumber: 1,
        phaseTitleNe: 'चरण १: सामान्य ज्ञान तथा सामान्य बौद्धिक परीक्षण (GK & IQ)',
        phaseTitleEn: 'Phase 1: General Knowledge & IQ Test',
        badgeNe: 'वस्तुगत MCQs',
        formatNe: '५० प्रश्नहरू (प्रत्येक २ अंक, कुल १०० पूर्णाङ्क)',
        fullMarks: 100,
        passMarks: 40,
        timeLimitNe: '४५ मिनेट',
        negativeMarkingNe: '-०.४ अंक (२०% कट्टा)',
        descriptionNe: 'सौर्यमण्डल, भूगोल, इतिहास, संस्कृति, शासन प्रणाली र IQ श्रेणीगत परीक्षण।',
        sectionsNe: ['सामान्य ज्ञान (General Knowledge)', 'सामान्य बौद्धिक परीक्षण (Mental Ability)'],
        topics: [
          {
            id: 'nasu-governance',
            titleNe: 'नेपालको शासन प्रणाली, निजामती सेवा ऐन २०४९ र सुशासन',
            titleEn: 'Nepal Governance System, Civil Service Act 2049 & Good Governance',
            sectionNe: 'सामान्य ज्ञान (General Knowledge)',
            category: 'Loksewa',
            weightageMarks: 25,
            readTimeMin: 12,
            keyProvisionsNe: [
              'निजामती सेवा ऐन, २०४९ र नियमावली २०५० का प्रमुख व्यवस्थाहरू',
              'सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन, २०६४: नागरिक बडापत्र र पारदर्शिता',
              'सार्वजनिक खरिद ऐन, २०६३ का आधारभूत सिद्धान्तहरू'
            ],
            bulletPointsNe: [
              'निजामती कर्मचारीले पालना गर्नुपर्ने आचरण (दफा ४१ देखि ५५)।'
            ],
            lessonSummaryNe: 'सुशासनले सार्वजनिक प्रशासनमा जवाफदेहिता, कानुनको शासन, पारदर्शिता र नागरिक केन्द्रित सेवा प्रवाहलाई सुनिश्चित गर्दछ।',
            examTipsNe: ['नागरिक बडापत्रको क्षतिपूर्ति सम्बन्धी व्यवस्था र निजामती बिदाका प्रकारहरू दोहोरिने प्रश्न हुन्।'],
            practiceMcqs: [
              {
                id: 'nasu-mcq-1',
                questionNe: 'सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन, २०६४ अनुसार नागरिक बडापत्र कुन दफामा व्यवस्था गरिएको छ?',
                optionsNe: ['दफा १५', 'दफा २०', 'दफा २५', 'दफा ३०'],
                correctIndex: 2,
                explanationNe: 'सुशासन ऐन, २०६४ को दफा २५ मा प्रत्येक सरकारी कार्यालयमा नागरिक बडापत्र (Citizen Charter) राख्नुपर्ने व्यवस्था छ।'
              }
            ]
          }
        ]
      }
    ]
  },

  kharidar: {
    id: 'kharidar',
    categoryId: 'loksewa',
    nameNe: 'खरिदार (Kharidar)',
    nameEn: 'PSC Kharidar (Non-Gazetted 2nd Class)',
    shortName: 'खरिदार',
    taglineNe: 'निजामती सेवा प्रवेश: रा.प.अनं. द्वितीय श्रेणी',
    badgeNe: 'रा.प.अनं. द्वितीय श्रेणी',
    colorScheme: {
      primary: 'text-yellow-700 dark:text-yellow-400',
      border: 'border-yellow-200 dark:border-yellow-800',
      bg: 'bg-yellow-50/60 dark:bg-yellow-950/20',
      badgeBg: 'bg-yellow-600',
      badgeText: 'text-white'
    },
    levelsNe: 'रा.प.अनं. द्वितीय श्रेणी (Level 4)',
    totalPhasesCount: 3,
    descriptionNe: 'लोक सेवा आयोग नेपालद्वारा लिइने खरिदार (प्रशासन, लेखा, न्याय) पदको खुला प्रतियोगितात्मक परीक्षा।',
    eligibilityNe: 'एसईई (SEE) वा एसएलसी (SLC) उत्तीर्ण।',
    phases: [
      {
        id: 'phase-1',
        phaseNumber: 1,
        phaseTitleNe: 'चरण १: सामान्य ज्ञान तथा आधारभूत बौद्धिक परीक्षण (GK & IQ)',
        phaseTitleEn: 'Phase 1: Basic GK & IQ Test',
        badgeNe: 'वस्तुगत MCQs',
        formatNe: '५० प्रश्नहरू (१०० पूर्णाङ्क)',
        fullMarks: 100,
        passMarks: 40,
        timeLimitNe: '४५ मिनेट',
        negativeMarkingNe: '-०.४ अंक (२०% कट्टा)',
        descriptionNe: 'नेपालको भूगोल, इतिहास, हावापानी, समसामयिक घटनाहरू र IQ गणितीय श्रेणी।',
        sectionsNe: ['सामान्य ज्ञान (भूगोल, इतिहास, संस्कृति)', 'आधारभूत बौद्धिक परीक्षण (IQ)'],
        topics: [
          {
            id: 'kharidar-geography',
            titleNe: 'नेपालको भौगोलिक अवस्था, हावापानी, हिमाल र नदीनाला',
            titleEn: 'Geography of Nepal, Climate, Himalayas & River Systems',
            sectionNe: 'सामान्य ज्ञान (भूगोल, इतिहास, संस्कृति)',
            category: 'Geography',
            weightageMarks: 25,
            readTimeMin: 12,
            keyProvisionsNe: [
              'नेपालको क्षेत्रफल: १,४७,५१६ वर्ग किलोमिटर (५६,९५६ वर्ग माइल)',
              '३ भौगोलिक प्रदेश: हिमाल (१५%), पहाड (६८%), तराई (१७%)',
              'प्रमुख नदी प्रणालीहरू: कोशी, गण्डकी, कर्णाली र महाकाली'
            ],
            bulletPointsNe: [
              'सप्तकोशीको सबैभन्दा ठूलो सहायक नदी अरुण र सबैभन्दा सानो लिखु हो।'
            ],
            lessonSummaryNe: 'नेपालको भौगोलिक विविधता, जैविक विविधता र प्राकृतिक स्रोतहरूले राष्ट्रको आर्थिक तथा सामाजिक विकासको मेरुदण्डको काम गरेका छन्।',
            examTipsNe: ['नेपालका राष्ट्रिय निकुञ्ज, तालतलैया र नदीका उद्गमस्थलका तथ्यहरू कण्ठ गर्नुहोस्।'],
            practiceMcqs: [
              {
                id: 'kha-mcq-1',
                questionNe: 'नेपालको कुल क्षेत्रफल कति रहेको छ?',
                optionsNe: ['१,४७,१८१ वर्ग कि.मि.', '१,४७,५१६ वर्ग कि.मि.', '१,४५,५१६ वर्ग कि.मि.', '१,४८,००० वर्ग कि.मि.'],
                correctIndex: 1,
                explanationNe: 'नेपालको हालको आधिकारिक क्षेत्रफल १,४७,५१६ वर्ग किलोमिटर रहेको छ।'
              }
            ]
          }
        ]
      }
    ]
  }
};
