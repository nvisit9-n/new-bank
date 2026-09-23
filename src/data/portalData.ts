export interface TickerAlert {
  id: string;
  category: 'vacancy' | 'exam' | 'circular' | 'result' | 'policy';
  categoryLabelNe: string;
  categoryLabelEn: string;
  badgeColor: string;
  titleNe: string;
  titleEn: string;
  source: string;
  date: string;
  isUrgent: boolean;
  linkText?: string;
  actionType?: 'quiz' | 'note' | 'external' | 'view';
  actionTarget?: string;
}

export interface EconomicIndicator {
  id: string;
  labelNe: string;
  labelEn: string;
  currentValue: string;
  previousValue?: string;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  changeText?: string;
  period: string;
  source: string;
}

export interface ForexRateItem {
  currencyCode: string;
  currencyNameNe: string;
  currencyNameEn: string;
  flag: string;
  unit: number;
  buyRate: number;
  sellRate: number;
  change: number; // percentage or diff
}

export interface InstitutionHubItem {
  id: 'nrb' | 'rbb' | 'adbl' | 'nbl' | 'loksewa';
  nameNe: string;
  nameEn: string;
  shortName: string;
  established: string;
  headquartersNe: string;
  taglineNe: string;
  themeColor: string;
  badge: string;
  accentBg: string;
  logoLetter: string;
  keyLevels: {
    level: string;
    designationNe: string;
    designationEn: string;
    qualification: string;
    preTestMarks: number;
    timeMinutes: number;
  }[];
  examPattern: {
    firstPaper: string;
    secondPaper: string;
    passMarks: string;
    negativeMarking: string;
    interviewMarks: string;
  };
  keySyllabusTopics: string[];
  mandatoryActs: string[];
  currentVacancyStatus: string;
  officialCareerUrl: string;
  quizCategory: 'Banking' | 'NRB' | 'Loksewa';
}

export interface LawActDetail {
  id: string;
  shortCode: string;
  titleNe: string;
  titleEn: string;
  enactedBikram: string;
  amendmentInfo: string;
  totalChapters: number;
  totalSections: number;
  significanceRating: 'Crucial' | 'High' | 'Standard';
  primaryFocus: string;
  keySections: {
    sectionNum: string;
    titleNe: string;
    summaryNe: string;
    isExamFavorite: boolean;
  }[];
  frequentExamQuestions: {
    questionNe: string;
    type: 'Subjective' | 'Objective';
    frequentlyAskedBy: string[];
  }[];
  relatedNoteId?: string;
}

export interface NewsPortalItem {
  id: string;
  category: 'banking-news' | 'economic-affairs' | 'loksewa-circulars' | 'vacancies';
  categoryLabelNe: string;
  titleNe: string;
  summaryNe: string;
  detailedContentNe?: string[];
  source: string;
  publishedTime: string;
  readTimeMinutes: number;
  isHeadline?: boolean;
  isEditorPick?: boolean;
  viewsCount: number;
  sharesCount: number;
  tags: string[];
  actionLink?: string;
  actionType?: 'quiz' | 'note' | 'external';
}

// 1. Dynamic Urgent Headline Ticker Alerts
export const PORTAL_TICKER_ALERTS: TickerAlert[] = [
  {
    id: 'ticker-1',
    category: 'vacancy',
    categoryLabelNe: 'खुला विज्ञापन',
    categoryLabelEn: 'Vacancy Alert',
    badgeColor: 'bg-rose-600 text-white',
    titleNe: 'राष्ट्रिय वाणिज्य बैंक (RBB) तह ४ सहायक (प्रशासन/नगद) र तह ५ वरिष्ठ सहायक खुला पदपूर्ति विज्ञापन प्रकाशित!',
    titleEn: 'Rastriya Banijya Bank announces open vacancy for Level 4 & 5 Assistant posts.',
    source: 'RBB HR Dept',
    date: 'आज भर्खरै',
    isUrgent: true,
    actionType: 'view',
    actionTarget: 'rbb'
  },
  {
    id: 'ticker-2',
    category: 'circular',
    categoryLabelNe: 'NRB परिपत्र',
    categoryLabelEn: 'NRB Circular',
    badgeColor: 'bg-emerald-600 text-white',
    titleNe: 'नेपाल राष्ट्र बैंक: क, ख र ग वर्गका बैंक तथा वित्तीय संस्थाहरूलाई जारी गरिएको एकीकृत निर्देशन २०८१/८२ संशोधन जारी।',
    titleEn: 'NRB issues amended unified directives for A, B, and C class BFIs.',
    source: 'NRB Regulation Dept',
    date: '२ घण्टा अगाडि',
    isUrgent: true,
    actionType: 'note',
    actionTarget: 'note-nrb-act'
  },
  {
    id: 'ticker-3',
    category: 'exam',
    categoryLabelNe: 'परीक्षा तालिका',
    categoryLabelEn: 'Exam Schedule',
    badgeColor: 'bg-amber-600 text-white',
    titleNe: 'लोकसेवा आयोग: नेपाल बैंक लिमिटेड (NBL) र कृषि विकास बैंक (ADBL) तह ४ पूर्वयोग्यता (Pre-Test) परीक्षा मिति सार्वजनिक।',
    titleEn: 'PSC publishes pre-test examination routine for NBL and ADBL Level 4.',
    source: 'Loksewa Aayog',
    date: '४ घण्टा अगाडि',
    isUrgent: false,
    actionType: 'quiz',
    actionTarget: 'Banking'
  },
  {
    id: 'ticker-4',
    category: 'policy',
    categoryLabelNe: 'मौद्रिक नीति',
    categoryLabelEn: 'Monetary Policy',
    badgeColor: 'bg-blue-600 text-white',
    titleNe: 'केन्द्रीय बैंकद्वारा नीतिगत दर (Policy Rate) ५.००% र बैंक दर (Bank Rate) ६.५०% मा यथावत राख्ने निर्णय।',
    titleEn: 'NRB maintains policy rate at 5.00% and bank rate at 6.50% in latest review.',
    source: 'NRB Research Dept',
    date: 'आज',
    isUrgent: false,
    actionType: 'view',
    actionTarget: 'nrb'
  }
];

// 2. Key Economic Indicators
export const KEY_ECONOMIC_INDICATORS: EconomicIndicator[] = [
  {
    id: 'ind-inflation',
    labelNe: 'उपभोक्ता मुद्रास्फीति (Inflation)',
    labelEn: 'Consumer Price Inflation (y-o-y)',
    currentValue: '४.१०',
    previousValue: '५.४०',
    unit: '%',
    trend: 'down',
    changeText: '-१.३०% विन्दुले घटेको',
    period: '२०८१/८२ वार्षिक स्थिति',
    source: 'NRB Macroeconomic Report'
  },
  {
    id: 'ind-policy-rate',
    labelNe: 'नीतिगत दर (Policy / Repo Rate)',
    labelEn: 'NRB Key Policy Rate',
    currentValue: '५.००',
    previousValue: '५.५०',
    unit: '%',
    trend: 'neutral',
    changeText: 'स्थिर',
    period: 'मौद्रिक नीति कार्यान्वयन',
    source: 'NRB Monetary Policy'
  },
  {
    id: 'ind-bank-rate',
    labelNe: 'बैंक दर (Bank Rate)',
    labelEn: 'Lender of Last Resort Rate',
    currentValue: '६.५०',
    previousValue: '७.००',
    unit: '%',
    trend: 'neutral',
    changeText: 'अपरिवर्तित',
    period: 'वर्तमान',
    source: 'NRB Directive'
  },
  {
    id: 'ind-crr',
    labelNe: 'अनिवार्य नगद अनुपात (CRR)',
    labelEn: 'Cash Reserve Ratio',
    currentValue: '४.००',
    previousValue: '४.००',
    unit: '%',
    trend: 'neutral',
    changeText: 'क, ख, ग सबै वर्गलाई',
    period: 'स्थिर',
    source: 'NRB Directive'
  },
  {
    id: 'ind-slr',
    labelNe: 'वैधानिक तरलता अनुपात (SLR)',
    labelEn: 'Statutory Liquidity Ratio',
    currentValue: '१२.००',
    previousValue: '१२.००',
    unit: '%',
    trend: 'neutral',
    changeText: 'क वर्ग: १२%, ख/ग: १०%',
    period: 'स्थिर',
    source: 'NRB Directive'
  },
  {
    id: 'ind-cd-ratio',
    labelNe: 'कर्जा-निक्षेप अनुपात (CD Ratio)',
    labelEn: 'Credit to Deposit Ratio',
    currentValue: '७९.४५',
    previousValue: '८०.२०',
    unit: '%',
    trend: 'down',
    changeText: 'अधिकतम ९०% को सीमा भित्र',
    period: 'सहज तरलता अवस्था',
    source: 'Banking Statistics'
  },
  {
    id: 'ind-forex-reserves',
    labelNe: 'विदेशी विनिमय सञ्चिति (Forex Reserves)',
    labelEn: 'Gross FX Reserves',
    currentValue: '१५.४२',
    previousValue: '१४.८५',
    unit: 'अर्ब USD',
    trend: 'up',
    changeText: '+१३.५ महिनाको आयात धान्न पर्याप्त',
    period: 'रेकर्ड उच्च स्तर',
    source: 'NRB Balance of Payments'
  },
  {
    id: 'ind-remittance',
    labelNe: 'विप्रेषण आप्रवाह (Remittance Inflow)',
    labelEn: 'Remittance Growth',
    currentValue: '+१६.५',
    previousValue: '+१४.२',
    unit: '%',
    trend: 'up',
    changeText: 'रु. १२ खर्ब+ वार्षिक दर',
    period: 'हालसम्मकै उच्च',
    source: 'NRB External Sector'
  }
];

// 3. Official NRB Daily Foreign Exchange Rates
export const DAILY_FOREX_RATES: ForexRateItem[] = [
  {
    currencyCode: 'USD',
    currencyNameNe: 'अमेरिकी डलर',
    currencyNameEn: 'US Dollar',
    flag: '🇺🇸',
    unit: 1,
    buyRate: 135.42,
    sellRate: 136.02,
    change: +0.15
  },
  {
    currencyCode: 'EUR',
    currencyNameNe: 'युरोपियन युरो',
    currencyNameEn: 'European Euro',
    flag: '🇪🇺',
    unit: 1,
    buyRate: 147.20,
    sellRate: 147.85,
    change: -0.22
  },
  {
    currencyCode: 'GBP',
    currencyNameNe: 'बेलायती पाउन्ड स्टर्लिङ',
    currencyNameEn: 'Pound Sterling',
    flag: '🇬🇧',
    unit: 1,
    buyRate: 174.65,
    sellRate: 175.42,
    change: +0.38
  },
  {
    currencyCode: 'AUD',
    currencyNameNe: 'अस्ट्रेलियन डलर',
    currencyNameEn: 'Australian Dollar',
    flag: '🇦🇺',
    unit: 1,
    buyRate: 88.50,
    sellRate: 88.90,
    change: -0.12
  },
  {
    currencyCode: 'JPY',
    currencyNameNe: 'जापानी येन (१० एकाइ)',
    currencyNameEn: 'Japanese Yen (10)',
    flag: '🇯🇵',
    unit: 10,
    buyRate: 8.92,
    sellRate: 8.96,
    change: +0.05
  },
  {
    currencyCode: 'INR',
    currencyNameNe: 'भारतीय रुपैयाँ (१०० एकाइ)',
    currencyNameEn: 'Indian Rupee (100)',
    flag: '🇮🇳',
    unit: 100,
    buyRate: 160.00,
    sellRate: 160.15,
    change: 0.00
  },
  {
    currencyCode: 'AED',
    currencyNameNe: 'युएई दिर्हाम',
    currencyNameEn: 'UAE Dirham',
    flag: '🇦🇪',
    unit: 1,
    buyRate: 36.87,
    sellRate: 37.03,
    change: +0.04
  },
  {
    currencyCode: 'SAR',
    currencyNameNe: 'साउदी रियाल',
    currencyNameEn: 'Saudi Riyal',
    flag: '🇸🇦',
    unit: 1,
    buyRate: 36.11,
    sellRate: 36.27,
    change: +0.02
  }
];

// 4. Institution Data Hub (NRB, RBB, ADBL, NBL, Loksewa)
export const INSTITUTION_DATA_HUB: Record<string, InstitutionHubItem> = {
  nrb: {
    id: 'nrb',
    nameNe: 'नेपाल राष्ट्र बैंक',
    nameEn: 'Nepal Rastra Bank (Central Bank)',
    shortName: 'NRB',
    established: '२०१३ वैशाख १४ (1956 AD)',
    headquartersNe: 'बालुवाटार, काठमाडौं',
    taglineNe: 'नेपालको केन्द्रीय बैंक तथा मौद्रिक अधिकारी',
    themeColor: 'emerald',
    badge: 'Central Bank',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800',
    logoLetter: 'NRB',
    keyLevels: [
      {
        level: 'तह ४',
        designationNe: 'सहायक (प्रशासन/लेखा)',
        designationEn: 'Assistant (Admin/Accounts)',
        qualification: '१०+२ वा सो सरह उत्तीर्ण',
        preTestMarks: 100,
        timeMinutes: 45
      },
      {
        level: 'तह ६',
        designationNe: 'सहायक निर्देशक (अधिकृत तृतीय)',
        designationEn: 'Assistant Director (Officer III)',
        qualification: 'अर्थशास्त्र, व्यवस्थापन वा वाणिज्यमा स्नातकोत्तर',
        preTestMarks: 100,
        timeMinutes: 50
      }
    ],
    examPattern: {
      firstPaper: 'पूर्वयोग्यता परीक्षा (Pre-Test) - १०० पूर्णाङ्क वस्तुगत बहुउत्तर (MCQs)',
      secondPaper: 'द्वितीय चरण: बैंकिङ, लेखा, अर्थशास्त्र, व्यवस्थापन र ऐन नियम (लिखित परीक्षा)',
      passMarks: 'पूर्वयोग्यतामा कम्तीमा ४०% अंक प्राप्त गर्नुपर्ने (Negative Marking २०%)',
      negativeMarking: 'प्रत्येक गलत उत्तर बापत २०% (०.२x) अंक कट्टा गरिनेछ',
      interviewMarks: 'अन्तर्वार्ता ३० वा ५० पूर्णाङ्क'
    },
    keySyllabusTopics: [
      'नेपाल राष्ट्र बैंक ऐन, २०५८ (उद्देश्य, काम कर्तव्य र अधिकार)',
      'नेपालको मौद्रिक नीति तथा मौद्रिक उपकरणहरू (Repo, Reverse Repo, CRR, SLR)',
      'बैंक तथा वित्तीय संस्था सम्बन्धी ऐन, २०७३ (BAFIA)',
      'विदेशी विनिमय नियमित गर्ने ऐन, २०१९ तथा विदेशी मुद्रा व्यवस्थापन',
      'म्याक्रो इकोनोमिक्स, मुद्रास्फीति, भुक्तानी सन्तुलन (BOP) र शोधनान्तर स्थिति'
    ],
    mandatoryActs: [
      'नेपाल राष्ट्र बैंक ऐन, २०५८',
      'बैंक तथा वित्तीय संस्था सम्बन्धी ऐन, २०७३ (BAFIA)',
      'सम्पत्ति शुद्धीकरण निवारण ऐन, २०६४',
      'बैंकिङ कसूर तथा सजाय ऐन, २०६४'
    ],
    currentVacancyStatus: 'नियमित वार्षिक पदपूर्ति तालिका अनुसार विज्ञापन प्रक्रियामा',
    officialCareerUrl: 'https://www.nrb.org.np/category/career/',
    quizCategory: 'NRB'
  },
  rbb: {
    id: 'rbb',
    nameNe: 'राष्ट्रिय वाणिज्य बैंक लिमिटेड',
    nameEn: 'Rastriya Banijya Bank Limited',
    shortName: 'RBB',
    established: '२०२२ माघ १० (1966 AD)',
    headquartersNe: 'सिंहदरबार प्लाजा, काठमाडौं',
    taglineNe: 'नेपाल सरकारको पूर्ण स्वामित्वमा रहेको देशकै अग्रणी वाणिज्य बैंक',
    themeColor: 'blue',
    badge: '100% Gov Owned Commercial Bank',
    accentBg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800',
    logoLetter: 'RBB',
    keyLevels: [
      {
        level: 'तह ४',
        designationNe: 'सहायक (प्रशासन/नगद)',
        designationEn: 'Assistant (Admin/Cash)',
        qualification: '१०+२ वा सो सरह उत्तीर्ण',
        preTestMarks: 100,
        timeMinutes: 45
      },
      {
        level: 'तह ५',
        designationNe: 'वरिष्ठ सहायक (प्रशासन/लेखा)',
        designationEn: 'Senior Assistant',
        qualification: 'स्नातक तह (Bachelor) उत्तीर्ण',
        preTestMarks: 100,
        timeMinutes: 45
      }
    ],
    examPattern: {
      firstPaper: 'पूर्वयोग्यता परीक्षा (Pre-Test) - १०० पूर्णाङ्क वस्तुगत बहुउत्तर (५० प्रश्न x २ अंक)',
      secondPaper: 'लिखित परीक्षा (बैंकिङ, लेखा, गणित, कम्प्युटर र सेवा सम्बन्धी)',
      passMarks: 'पूर्वयोग्यतामा कम्तीमा ४० अंक (२०% नेगेटिभ मार्किङ)',
      negativeMarking: 'प्रत्येक गलत उत्तरमा ०.४ अंक कट्टा',
      interviewMarks: 'अन्तर्वार्ता २५ पूर्णाङ्क'
    },
    keySyllabusTopics: [
      'निक्षेप संकलन, कर्जा प्रवाह तथा कर्जा वर्गीकरण (Pass, SMA, Substandard, Doubtful, Loss)',
      'नेपालको बैंकिङ प्रणालीको विकासक्रम र राष्ट्रिय वाणिज्य बैंकको भूमिका',
      'ग्राहक पहिचान (KYC) र सम्पत्ति शुद्धीकरण (AML) का प्रावधानहरू',
      'कम्प्युटर फन्डामेन्टल्स, इन्टरनेट बैंकिङ, मोबाइल बैंकिङ र CBS',
      'लेखा प्रणाली: दोहोरो लेखा प्रणाली, गोश्वारा भौचर, बैंक हिसाब मिलान विवरण'
    ],
    mandatoryActs: [
      'बैंक तथा वित्तीय संस्था सम्बन्धी ऐन, २०७३ (BAFIA)',
      'नेपाल राष्ट्र बैंक ऐन, २०५८',
      'बैंकिङ कसूर तथा सजाय ऐन, २०६४',
      'कम्पनी ऐन, २०६३'
    ],
    currentVacancyStatus: 'हालै नयाँ विज्ञापन प्रकाशित, आवेदन खुला गरिएको',
    officialCareerUrl: 'https://www.rbb.com.np/career',
    quizCategory: 'Banking'
  },
  adbl: {
    id: 'adbl',
    nameNe: 'कृषि विकास बैंक लिमिटेड',
    nameEn: 'Agricultural Development Bank Limited',
    shortName: 'ADBL',
    established: '२०२४ माघ ७ (1968 AD)',
    headquartersNe: 'रामशाहपथ, काठमाडौं',
    taglineNe: 'कृषि तथा समग्र ग्रामीण अर्थतन्त्र विकासको मेरुदण्ड',
    themeColor: 'emerald',
    badge: 'Agri & Commercial Bank',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800',
    logoLetter: 'ADBL',
    keyLevels: [
      {
        level: 'तह ४',
        designationNe: 'लेखापाल (प्रशासन/लेखा)',
        designationEn: 'Accountant / Assistant',
        qualification: '१०+२ वा सो सरह उत्तीर्ण',
        preTestMarks: 100,
        timeMinutes: 45
      },
      {
        level: 'तह ५',
        designationNe: 'व्यवसाय सहायक (Business Assistant)',
        designationEn: 'Senior Assistant / Field',
        qualification: 'स्नातक तह उत्तीर्ण',
        preTestMarks: 100,
        timeMinutes: 50
      }
    ],
    examPattern: {
      firstPaper: 'प्रथम चरण: सामान्य ज्ञान, बैंकिङ, लेखा तथा बौद्धिक परीक्षण (MCQs १०० पूर्णाङ्क)',
      secondPaper: 'द्वितीय चरण: कृषि कर्जा, परियोजना विश्लेषण र बैंकिङ व्यवसाय सम्बन्धी लिखित',
      passMarks: '४० अंक अनिवार्य',
      negativeMarking: '२०% कट्टा',
      interviewMarks: '२५ पूर्णाङ्क'
    },
    keySyllabusTopics: [
      'कृषि कर्जा, सहुलियतपूर्ण कर्जा र प्राथमिकता प्राप्त क्षेत्र कर्जाका निर्देशिकाहरू',
      'कृषि विकास बैंकको स्थापना, उद्देश्य, ऐतिहासिक पृष्ठभूमि र वर्तमान स्वरूप',
      'साना किसान विकास, ग्रामीण बैंकिङ तथा वित्तीय समावेशीकरण',
      'वित्तीय विवरण विश्लेषण (Financial Statement Analysis) र अनुपात विश्लेषण',
      'बैंकिङ कानुन तथा लोकसेवा सामान्य ज्ञान'
    ],
    mandatoryActs: [
      'बैंक तथा वित्तीय संस्था सम्बन्धी ऐन, २०७३',
      'नेपाल राष्ट्र बैंक ऐन, २०५८',
      'बैंकिङ कसूर तथा सजाय ऐन, २०६४',
      'सहकारी ऐन, २०७४ का मुख्य बुँदाहरू'
    ],
    currentVacancyStatus: 'लोकसेवा आयोगको वार्षिक पदपूर्ति कार्यतालिकामा समावेश',
    officialCareerUrl: 'https://www.adbl.gov.np/career',
    quizCategory: 'Banking'
  },
  nbl: {
    id: 'nbl',
    nameNe: 'नेपाल बैंक लिमिटेड',
    nameEn: 'Nepal Bank Limited',
    shortName: 'NBL',
    established: '१९९४ कात्तिक ३० (1937 AD)',
    headquartersNe: 'धर्मपथ, नयाँ सडक, काठमाडौं',
    taglineNe: 'नेपालको पहिलो र जेठो वाणिज्य बैंक - आधुनिक वित्तीय सेवाको जग',
    themeColor: 'sky',
    badge: 'First Commercial Bank of Nepal',
    accentBg: 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800',
    logoLetter: 'NBL',
    keyLevels: [
      {
        level: 'तह ३',
        designationNe: 'कनिष्ठ सहायक (Junior Assistant)',
        designationEn: 'Junior Assistant Gold Tester / Admin',
        qualification: 'एसईई / १०+२ उत्तीर्ण',
        preTestMarks: 100,
        timeMinutes: 45
      },
      {
        level: 'तह ४',
        designationNe: 'सहायक (प्रशासन/लेखा)',
        designationEn: 'Assistant (Level 4)',
        qualification: '१०+२ वा सो सरह उत्तीर्ण',
        preTestMarks: 100,
        timeMinutes: 45
      }
    ],
    examPattern: {
      firstPaper: 'प्रथम चरण: पूर्वयोग्यता परीक्षा (Pre-Test) - १०० पूर्णाङ्क वस्तुगत बहुउत्तर',
      secondPaper: 'द्वितीय चरण: बैंकिङ कार्यसञ्चालन, कर्जा सुरक्षण, लेखा र ऐन सम्बन्धी',
      passMarks: '४० अंक अनिवार्य',
      negativeMarking: '२०% कट्टा',
      interviewMarks: '२५ पूर्णाङ्क'
    },
    keySyllabusTopics: [
      'नेपाल बैंक लिमिटेडको स्थापनाको इतिहास, राणा प्रधानमन्त्री जुद्ध शमशेर र बैंकिङ विकास',
      'सुनचाँदी कर्जा, धितो मूल्याङ्कन तथा सुरक्षण सम्बन्धी आधारहरू',
      'नेगोसिएबल इन्स्ट्रुमेन्ट्स (चेक, विनिमय पत्र, प्रतिज्ञा पत्र) र विनिमय अधिकारपत्र ऐन',
      'शाखा व्यवस्थापन, नगद काउन्टर व्यवस्थापन र आन्तरिक नियन्त्रण प्रणाली',
      'नेपालको संविधान २०७२ मा आर्थिक तथा वित्तीय व्यवस्थाहरू'
    ],
    mandatoryActs: [
      'विनिमय अधिकारपत्र ऐन, २०३४',
      'बैंक तथा वित्तीय संस्था सम्बन्धी ऐन, २०७३',
      'नेपाल राष्ट्र बैंक ऐन, २०५८',
      'बैंकिङ कसूर तथा सजाय ऐन, २०६४'
    ],
    currentVacancyStatus: 'वार्षिक परीक्षा तालिका अनुसार विज्ञापन प्रक्रिया जारी',
    officialCareerUrl: 'https://nepalbank.com.np/careers',
    quizCategory: 'Banking'
  },
  loksewa: {
    id: 'loksewa',
    nameNe: 'लोकसेवा आयोग (नेपाल)',
    nameEn: 'Public Service Commission (Loksewa Aayog)',
    shortName: 'PSC',
    established: '२००८ असार १ (1951 AD)',
    headquartersNe: 'कमलपोखरी, काठमाडौं',
    taglineNe: 'योग्यता, निष्पक्षता र स्वच्छता - राष्ट्र सेवाको प्रवेशद्वार',
    themeColor: 'purple',
    badge: 'Constitutional Body',
    accentBg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800',
    logoLetter: 'PSC',
    keyLevels: [
      {
        level: 'खरिदार (तह ४)',
        designationNe: 'राजपत्राङ्कित अनङ्कित द्वितीय',
        designationEn: 'Kharidar / Assistant IV',
        qualification: 'एसईई / १० कक्षा उत्तीर्ण',
        preTestMarks: 100,
        timeMinutes: 45
      },
      {
        level: 'नायब सुब्बा (तह ५)',
        designationNe: 'राजपत्राङ्कित अनङ्कित प्रथम',
        designationEn: 'Nayab Subba / Senior Assistant',
        qualification: '१०+२ वा सो सरह उत्तीर्ण',
        preTestMarks: 100,
        timeMinutes: 45
      },
      {
        level: 'शाखा अधिकृत (तह ६/७)',
        designationNe: 'राजपत्राङ्कित तृतीय श्रेणी',
        designationEn: 'Section Officer (Gazetted Class III)',
        qualification: 'स्नातक तह (Bachelor) उत्तीर्ण',
        preTestMarks: 100,
        timeMinutes: 90
      }
    ],
    examPattern: {
      firstPaper: 'प्रथम चरण: सामान्य ज्ञान (GK) र बौद्धिक परीक्षण (IQ) - १०० पूर्णाङ्क',
      secondPaper: 'द्वितीय चरण: समसामयिक अध्ययन र सार्वजनिक सेवा व्यवस्थापन',
      passMarks: 'प्रथम पत्रमा ४०% अंक (नेगेटिभ मार्किङ २०%)',
      negativeMarking: 'प्रत्येक गलत उत्तरमा २०% अंक कट्टा',
      interviewMarks: 'अन्तर्वार्ता ४० वा ५० पूर्णाङ्क'
    },
    keySyllabusTopics: [
      'नेपालको भूगोल, इतिहास, संस्कृति र सामाजिक अवस्था',
      'नेपालको संविधान २०७२: मौलिक हक, राज्यका निर्देशक सिद्धान्त र संघीय संरचना',
      'नेपालको चालु १५औं र १६औं आवधिक योजना र बजेट विनियोजन',
      'समसामयिक राष्ट्रिय तथा अन्तर्राष्ट्रिय घटनाक्रम, संयुक्त राष्ट्रसंघ र सार्क',
      'सार्वजनिक प्रशासन, शासन प्रणाली र सुशासन (Good Governance)'
    ],
    mandatoryActs: [
      'नेपालको संविधान २०७२',
      'निजामती सेवा ऐन, २०४९ तथा नियमावली, २०५०',
      'सार्वजनिक खरिद ऐन, २०६३',
      'भ्रष्टाचार निवारण ऐन, २०५९'
    ],
    currentVacancyStatus: 'प्रत्येक वर्षको कार्यतालिका बमोजिम नियमित विज्ञापन सार्वजनिक',
    officialCareerUrl: 'https://psc.gov.np/',
    quizCategory: 'Loksewa'
  }
};

// 5. Direct Laws & Acts Reference Data
export const DIRECT_LAWS_DATA: LawActDetail[] = [
  {
    id: 'bafia-2073',
    shortCode: 'BAFIA',
    titleNe: 'बैंक तथा वित्तीय संस्था सम्बन्धी ऐन, २०७३',
    titleEn: 'Bank and Financial Institutions Act, 2073',
    enactedBikram: '२०७४ वैशाख १०',
    amendmentInfo: 'हाल कार्यान्वयनमा रहेको प्रमुख एकीकृत बैंकिङ कानुन',
    totalChapters: 14,
    totalSections: 134,
    significanceRating: 'Crucial',
    primaryFocus: 'बैंक तथा वित्तीय संस्थाको स्थापना, सञ्चालक समिति, इजाजतपत्र, वित्तीय कारोबार र खारेजी',
    keySections: [
      {
        sectionNum: 'दफा ३ र ४',
        titleNe: 'बैंक तथा वित्तीय संस्थाको संस्थापना सम्बन्धी व्यवस्था',
        summaryNe: 'पब्लिक लिमिटेड कम्पनीको रूपमा मात्र बैंक तथा वित्तीय संस्था स्थापना गर्न सकिने व्यवस्था।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा १४',
        titleNe: 'सञ्चालक समितिको गठन र योग्यता',
        summaryNe: 'कम्तीमा ५ र बढीमा ७ जना सञ्चालक रहने, जसमा कम्तीमा एक जना स्वतन्त्र सञ्चालक अनिवार्य।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा १८',
        titleNe: 'सञ्चालकको अयोग्यता',
        summaryNe: 'कालोसूचीमा परेको, मानसिक सन्तुलन गुमाएको, नैतिक पतन देखिने फौजदारी कसुरमा सजाय पाएको व्यक्ति सञ्चालक हुन नसक्ने।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा ४९ र ५०',
        titleNe: 'क, ख, ग, घ वर्गका बैंक तथा वित्तीय संस्थाले गर्न पाउने र नपाउने कामहरू',
        summaryNe: 'निक्षेप, कर्जा, विदेशी विनिमय, हायर पर्चेज र माइक्रोफाइनान्सको वर्गगत अधिकार क्षेत्र विभाजन।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा ५७',
        titleNe: 'धितो लिलाम बिक्री र असुली प्रक्रिया',
        summaryNe: 'ऋणीले सम्झौता बमोजिम साँवा ब्याज नतिरेमा बैंकले धितो लिलाम बिक्री गरी असुलउपर गर्न पाउने विशेष कानुनी अधिकार।',
        isExamFavorite: true
      }
    ],
    frequentExamQuestions: [
      {
        questionNe: 'BAFIA २०७३ अनुसार सञ्चालक समितिको गठन कसरी गरिन्छ र सञ्चालकको योग्यता तथा अयोग्यताका सर्तहरू के-के हुन्? (१० अंक)',
        type: 'Subjective',
        frequentlyAskedBy: ['NRB तह ४/६', 'RBB तह ४/५', 'NBL तह ४']
      },
      {
        questionNe: 'क वर्गका वाणिज्य बैंकहरूले गर्न पाउने प्रमुख कार्यहरू र प्रतिबन्धित कारोबारहरू उल्लेख गर्नुहोस्। (१० अंक)',
        type: 'Subjective',
        frequentlyAskedBy: ['RBB तह ४', 'ADBL तह ४']
      }
    ],
    relatedNoteId: 'note-bafia-act'
  },
  {
    id: 'nrb-act-2058',
    shortCode: 'NRB Act',
    titleNe: 'नेपाल राष्ट्र बैंक ऐन, २०५८',
    titleEn: 'Nepal Rastra Bank Act, 2058',
    enactedBikram: '२०५८ माघ १७',
    amendmentInfo: 'दोस्रो संशोधन २०७३ सहित केन्द्रीय बैंकको स्वायत्तताको आधार',
    totalChapters: 12,
    totalSections: 112,
    significanceRating: 'Crucial',
    primaryFocus: 'केन्द्रीय बैंकको स्वायत्तता, मौद्रिक नीति निर्माण, नियमन, नोट निष्कासन र भुक्तानी प्रणाली',
    keySections: [
      {
        sectionNum: 'दफा ४',
        titleNe: 'नेपाल राष्ट्र बैंकका उद्देश्यहरू',
        summaryNe: 'मूल्य स्थिरता, शोधनान्तर स्थिरता कायम राख्ने, वित्तीय क्षेत्रको स्थायित्व र विश्वसनीय भुक्तानी प्रणालीको विकास गर्ने।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा ५',
        titleNe: 'बैंकका काम, कर्तव्य र अधिकारहरू',
        summaryNe: 'बैंक नोट तथा सिक्का निष्कासन, मौद्रिक नीति निर्माण, विदेशी विनिमय नीति, इजाजतपत्र प्रदान र नियमन/सुपरिवेक्षण।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा १४ र १५',
        titleNe: 'सञ्चालक समितिको गठन र गभर्नरको नियुक्ति',
        summaryNe: 'गभर्नर (अध्यक्ष), अर्थ मन्त्रालयका सचिव, दुई जना डेपुटी गभर्नर र तीन जना विज्ञ सञ्चालक गरी ७ जनाको समिति।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा २२',
        titleNe: 'गभर्नर, डेपुटी गभर्नर वा सञ्चालकलाई पदमुक्त गर्ने प्रक्रिया',
        summaryNe: 'सर्वोच्च अदालतका अवकाशप्राप्त न्यायाधीशको अध्यक्षतामा तीन सदस्यीय जाँचबुझ समिति गठन गर्नुपर्ने।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा ५२',
        titleNe: 'बैंक नोट निष्कासन र सुरक्षण व्यवस्था',
        summaryNe: 'कम्तीमा ५०% सुन, चाँदी, विदेशी मुद्रा र बाँकी ५०% मा नेपाल सरकारको ऋणपत्र वा ट्रेजरी बिल राख्नुपर्ने।',
        isExamFavorite: true
      }
    ],
    frequentExamQuestions: [
      {
        questionNe: 'नेपाल राष्ट्र बैंक ऐन, २०५८ अनुसार केन्द्रीय बैंकका मुख्य उद्देश्य तथा काम कर्तव्य र अधिकारहरू के-के हुन्? (१० अंक)',
        type: 'Subjective',
        frequentlyAskedBy: ['NRB तह ४/६', 'RBB तह ५']
      },
      {
        questionNe: 'नोट निष्कासनको प्रक्रिया र सुरक्षण सम्बन्धी कानुनी प्रावधान स्पष्ट पार्नुहोस्। (५ अंक)',
        type: 'Subjective',
        frequentlyAskedBy: ['NRB तह ४', 'NBL तह ४']
      }
    ],
    relatedNoteId: 'note-nrb-act'
  },
  {
    id: 'aml-act-2064',
    shortCode: 'AML/CFT',
    titleNe: 'सम्पत्ति शुद्धीकरण (मनी लाउण्डरिङ) निवारण ऐन, २०६४',
    titleEn: 'Money Laundering Prevention Act, 2064',
    enactedBikram: '२०६४ माघ १४',
    amendmentInfo: 'हालै एफएटीएफ (FATF) ग्रे-लिस्ट जोखिम न्यूनीकरण सम्बन्धी संशोधन',
    totalChapters: 8,
    totalSections: 44,
    significanceRating: 'Crucial',
    primaryFocus: 'अवैध आम्दानीलाई वैध बनाउने कार्य नियन्त्रण, ग्राहक पहिचान (KYC), र शंकास्पद कारोबार (STR/TTR) प्रतिवेदन',
    keySections: [
      {
        sectionNum: 'दफा ३ र ४',
        titleNe: 'सम्पत्ति शुद्धीकरण कसुरको परिभाषा',
        summaryNe: 'अपराधजन्य कार्यबाट प्राप्त सम्पत्तिको स्रोत लुकाउने वा स्वामित्व हस्तान्तरण गर्ने कार्यलाई दण्डनीय कसुर मानिने।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा ७',
        titleNe: 'ग्राहक पहिचान (KYC / CDD) सम्बन्धी व्यवस्था',
        summaryNe: 'कुनै पनि कारोबार गर्नुपूर्व ग्राहकको वास्तविक पहिचान, ठेगाना, र लाभग्राही (Beneficial Owner) यकिन गर्नुपर्ने।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा ७(ग)',
        titleNe: 'उच्च जोखिमयुक्त ग्राहक (PEPs) सम्बन्धी व्यवस्था',
        summaryNe: 'राजनीतिक रूपमा पहुँचवाला व्यक्तिहरू (PEPs) र उनका परिवारका सदस्यहरूको कारोबारमा थप कडाइ (EDD) गर्नुपर्ने।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा ९',
        titleNe: 'वित्तीय जानकारी एकाइ (FIU) र प्रतिवेदन',
        summaryNe: 'नेपाल राष्ट्र बैंक अन्तर्गत रहने FIU-Nepal लाई सीमा कारोबार (TTR) र शंकास्पद कारोबार (STR) पठाउनुपर्ने।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा ३०',
        titleNe: 'सजाय र जरिवाना',
        summaryNe: 'कसुरको गम्भीरता अनुसार बिगो जफत र २ वर्षदेखि १० वर्षसम्म कैद तथा बिगोको दोब्बरसम्म जरिवाना।',
        isExamFavorite: true
      }
    ],
    frequentExamQuestions: [
      {
        questionNe: 'ग्राहक पहिचान (KYC) को अवधारणा के हो? बैंकिङ क्षेत्रमा सम्पत्ति शुद्धीकरण निवारणका लागि बैंकहरूले अवलम्बन गर्नुपर्ने कदमहरू लेख्नुहोस्। (१० अंक)',
        type: 'Subjective',
        frequentlyAskedBy: ['NRB तह ४', 'RBB तह ४/५', 'ADBL तह ५']
      }
    ],
    relatedNoteId: 'note-aml-act'
  },
  {
    id: 'offence-act-2064',
    shortCode: 'Banking Offence',
    titleNe: 'बैंकिङ कसूर तथा सजाय ऐन, २०६४',
    titleEn: 'Banking Offence and Punishment Act, 2064',
    enactedBikram: '२०६४ माघ २३',
    amendmentInfo: 'चेक बाउन्स र डिजिटल ठगी सम्बन्धी संशोधन',
    totalChapters: 4,
    totalSections: 29,
    significanceRating: 'High',
    primaryFocus: 'नक्कली खाता, चेक अनादर (Cheque Bounce), अनाधिकृत कर्जा, र डिजिटल वित्तीय जालसाजी नियन्त्रण',
    keySections: [
      {
        sectionNum: 'दफा ३',
        titleNe: 'अनाधिकृत रूपमा खाता खोल्न वा रकम झिक्न नहुने',
        summaryNe: 'अरूको नाममा वा झुट्टा कागजात पेस गरी बैंक खाता खोल्ने वा रकम हिनामिना गर्ने कार्य पूर्ण निषेध।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा ३(ग)',
        titleNe: 'चेक अनादर (चेक बाउन्स) सम्बन्धी कसुर',
        summaryNe: 'खातामा पर्याप्त मौज्दात नभएको जानी-जानी कसैलाई चेक काटी दिन नहुने।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा ७ र ८',
        titleNe: 'अनाधिकृत कर्जा प्रवाह र धितोको अस्वाभाविक मूल्याङ्कन',
        summaryNe: 'धितोको मूल्यभन्दा बढी कर्जा प्रवाह गर्ने, कमसल धितो स्वीकार्ने वा बैंक कर्मचारी मिलेमतोमा कर्जा दुरुपयोग गर्न नहुने।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा १५',
        titleNe: 'सजाय र बिगो असुली',
        summaryNe: 'बिगो भराई बिगो बमोजिम जरिवाना र बिगोको परिमाण अनुसार कैद सजाय (५ वर्षसम्म)।',
        isExamFavorite: true
      }
    ],
    frequentExamQuestions: [
      {
        questionNe: 'बैंकिङ कसूर तथा सजाय ऐन २०६४ बमोजिम चेक अनादर (Cheque Bounce) भनेको के हो र यसमा कस्तो कानुनी उपचार र सजायको व्यवस्था छ? (१० अंक)',
        type: 'Subjective',
        frequentlyAskedBy: ['RBB तह ४', 'NBL तह ४', 'NRB तह ४']
      }
    ],
    relatedNoteId: 'note-banking-offence'
  },
  {
    id: 'company-act-2063',
    shortCode: 'Company Act',
    titleNe: 'कम्पनी ऐन, २०६३',
    titleEn: 'Companies Act, 2063',
    enactedBikram: '२०६३ कार्तिक २४',
    amendmentInfo: 'कम्पनी संस्थापना र संस्थागत सुशासनको मूल कानुन',
    totalChapters: 21,
    totalSections: 188,
    significanceRating: 'High',
    primaryFocus: 'प्राइभेट र पब्लिक कम्पनीको दर्ता, प्रबन्धपत्र र नियमावली, सेयर पूँजी, साधारण सभा र लेखापरीक्षण',
    keySections: [
      {
        sectionNum: 'दफा ३',
        titleNe: 'कम्पनीको संस्थापना र प्रकार',
        summaryNe: 'मुनाफा वितरण गर्ने वा नगर्ने, प्राइभेट (१ देखि १०१ जना) वा पब्लिक (न्यूनतम ७ जना) कम्पनी।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा ६७ र ७६',
        titleNe: 'साधारण सभा (वार्षिक साधारण सभा - AGM)',
        summaryNe: 'आर्थिक वर्ष समाप्त भएको ६ महिनाभित्र वार्षिक साधारण सभा सम्पन्न गर्नुपर्ने कानुनी बाध्यता।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा ८६',
        titleNe: 'सञ्चालकहरूको कर्तव्य र जिम्मेवारी',
        summaryNe: 'कम्पनीको सर्वोत्तम हितमा इमानदारीपूर्वक काम गर्नुपर्ने र स्वार्थ बाझिएमा जानकारी गराउनुपर्ने।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा १११',
        titleNe: 'लेखापरीक्षकको नियुक्ति र योग्यता',
        summaryNe: 'साधारण सभाबाट रजिष्टर्ड चार्टर्ड एकाउन्टेन्ट वा अडिटरलाई लेखापरीक्षक नियुक्त गर्नुपर्ने।',
        isExamFavorite: true
      }
    ],
    frequentExamQuestions: [
      {
        questionNe: 'प्राइभेट लिमिटेड र पब्लिक लिमिटेड कम्पनीबीचका प्रमुख भिन्नताहरू के-के हुन्? (५ अंक)',
        type: 'Subjective',
        frequentlyAskedBy: ['Loksewa तह ५', 'RBB तह ५']
      }
    ],
    relatedNoteId: 'note-company-act'
  },
  {
    id: 'negotiable-act-2034',
    shortCode: 'Negotiable Act',
    titleNe: 'विनिमय अधिकारपत्र ऐन, २०३४',
    titleEn: 'Negotiable Instruments Act, 2034',
    enactedBikram: '२०३४ असोज २६',
    amendmentInfo: 'नेपालको वाणिज्य कारोबार र चेक/विनिमय पत्रको आधार',
    totalChapters: 12,
    totalSections: 110,
    significanceRating: 'Standard',
    primaryFocus: 'प्रतिज्ञापत्र (Promissory Note), विनिमयपत्र (Bill of Exchange) र चेक (Cheque) को कानुनी मान्यता',
    keySections: [
      {
        sectionNum: 'दफा २',
        titleNe: 'विनिमय अधिकारपत्रको परिभाषा',
        summaryNe: 'हस्तान्तरणयोग्य प्रतिज्ञापत्र, विनिमयपत्र वा चेकलाई विनिमय अधिकारपत्र भनिन्छ।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा ५',
        titleNe: 'चेकको परिभाषा र प्रकार',
        summaryNe: 'कुनै निर्दिष्ट बैंकलाई माग हुनासाथ भुक्तानी दिनु भनी खिचेको विनिमयपत्र चेक हो (Bearer, Order, Crossed Cheque)।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा २१',
        titleNe: 'रेखांकन (Crossing of Cheques)',
        summaryNe: 'साधारण रेखांकन (General Crossing) र विशेष रेखांकन (Special Crossing) का कानुनी परिणामहरू।',
        isExamFavorite: true
      },
      {
        sectionNum: 'दफा १०७',
        titleNe: 'चेक अनादरमा क्षतिपूर्ति र कानुनी उपचार',
        summaryNe: 'चेक अनादर भएमा ब्याज सहित बिगो रकम असुलउपर गर्न पाउने व्यवस्था।',
        isExamFavorite: true
      }
    ],
    frequentExamQuestions: [
      {
        questionNe: 'चेकको रेखांकन (Crossing of Cheques) भनेको के हो? चेक रेखांकनका प्रकार र यसको महत्त्व लेख्नुहोस्। (५ अंक)',
        type: 'Subjective',
        frequentlyAskedBy: ['NBL तह ४', 'RBB तह ४']
      }
    ],
    relatedNoteId: 'note-banking-history'
  }
];

// 6. Onlinekhabar-Style Categorized News & Current Affairs Articles
export const ONLINEKHABAR_STYLE_NEWS: NewsPortalItem[] = [
  {
    id: 'news-1',
    category: 'banking-news',
    categoryLabelNe: 'बैंकिङ समाचार',
    titleNe: 'वाणिज्य बैंकहरूको खराब कर्जा (NPL) औसत ४.२% मा, असुली अभियान तीव्र बनाउन राष्ट्र बैंकको निर्देशन',
    summaryNe: 'पछिल्लो त्रैमासिक वित्तीय विवरण अनुसार वाणिज्य बैंकहरूमा निष्क्रिय कर्जाको चाप कायमै रहेकोले बैंकहरूले प्रोभिजनिङ बढाएका छन्।',
    detailedContentNe: [
      'नेपाल राष्ट्र बैंकले जारी गरेको पछिल्लो विवरण अनुसार वाणिज्य बैंकहरूको औषत खराब कर्जा ४.२० प्रतिशत कायम भएको छ।',
      'केन्द्रीय बैंकले जोखिमयुक्त सम्पत्ति घटाउन र गैर-बैंकिङ सम्पत्ति (Non-Banking Assets) बिक्रीलाई पारदर्शी बनाउन सबै बैंक प्रमुखहरूलाई निर्देशन दिएको छ।',
      'परीक्षार्थीहरूका लागि यस विषयबाट कर्जा वर्गीकरण (Loans Classification) र प्रोभिजनिङ दरहरू (१.२५% देखि १००% सम्म) अत्यधिक महत्त्वपूर्ण मानिन्छ।'
    ],
    source: 'अनलाइनखबर / NRB प्रेस विज्ञप्ति',
    publishedTime: 'आज दिउँसो १:३०',
    readTimeMinutes: 3,
    isHeadline: true,
    isEditorPick: true,
    viewsCount: 14250,
    sharesCount: 840,
    tags: ['NPL', 'वाणिज्य बैंक', 'NRB Directive', 'कर्जा वर्गीकरण'],
    actionType: 'quiz',
    actionLink: 'Banking'
  },
  {
    id: 'news-2',
    category: 'economic-affairs',
    categoryLabelNe: 'आर्थिक समसामयिक',
    titleNe: 'विदेशी मुद्रा सञ्चिति हालसम्मकै उच्च रेकर्ड: १५ अर्ब डलर नाघ्यो, १३.५ महिनाको आयात धान्न पर्याप्त',
    summaryNe: 'रेमिट्यान्स आप्रवाहमा भएको उच्च वृद्धि र आयातमा भएको सन्तुलनले गर्दा नेपालको बाह्य क्षेत्र बलियो बनेको राष्ट्र बैंकको प्रतिवेदन।',
    detailedContentNe: [
      'नेपालको कुल विदेशी विनिमय सञ्चिति १५ अर्ब ४२ करोड अमेरिकी डलर पुगेको छ, जुन नेपाली रुपैयाँमा २० खर्ब ६० अर्ब भन्दा बढी हो।',
      'यसले नेपालको चालु आर्थिक वर्षको आयात धान्ने क्षमता हालसम्मकै उच्च बिन्दुमा पुगेको देखाउँछ।',
      'परीक्षा उपयोगी बुँदा: विप्रेषण आप्रवाह (Remittance), भुक्तानी सन्तुलन (Current Account & BOP) र विनिमय सञ्चितिको संरचना।'
    ],
    source: 'आर्थिक अभियान / NRB',
    publishedTime: '३ घण्टा अगाडि',
    readTimeMinutes: 4,
    isHeadline: true,
    isEditorPick: true,
    viewsCount: 19800,
    sharesCount: 1250,
    tags: ['Forex', 'शोधनान्तर', 'आयात धान्ने क्षमता', 'Economy'],
    actionType: 'note',
    actionLink: 'note-monetary-policy'
  },
  {
    id: 'news-3',
    category: 'vacancies',
    categoryLabelNe: 'खुला विज्ञापन तथा पदपूर्ति',
    titleNe: 'राष्ट्रिय वाणिज्य बैंकमा सयौं पदका लागि नयाँ दरखास्त आह्वान: तह ४ र ५ का लागि तयारी रणनीति',
    summaryNe: 'सहायक (प्रशासन/नगद) र वरिष्ठ सहायक पदका लागि खुला तथा समावेशी प्रतियोगितात्मक परीक्षाको विस्तृत सूचना र पाठ्यक्रम विश्लेषण।',
    detailedContentNe: [
      'राष्ट्रिय वाणिज्य बैंकले प्रशासन र नगद सेवाका लागि नयाँ पदपूर्ति खुला गरेको छ। अनलाइन फाराम भर्ने म्याद तोकिएको छ।',
      'पहिलो चरणमा ५० बहुउत्तर प्रश्न (१०० पूर्णाङ्क) को पूर्वयोग्यता परीक्षा उत्तीर्ण हुनुपर्नेछ जसमा कम्तीमा ४० अंक आवश्यक छ।',
      'तयारी युक्ति: दैनिक २५ वटा बैंकिङ तथा सामान्य ज्ञान MCQs हल गर्ने र बैंकिङ ऐन नियमहरू अध्ययन गर्ने।'
    ],
    source: 'गोरखापत्र राष्ट्रिय दैनिक',
    publishedTime: 'आज बिहान ७:००',
    readTimeMinutes: 5,
    isHeadline: false,
    isEditorPick: true,
    viewsCount: 28400,
    sharesCount: 3120,
    tags: ['RBB Vacancy', 'Level 4 & 5', 'Exam Pattern'],
    actionType: 'quiz',
    actionLink: 'Banking'
  },
  {
    id: 'news-4',
    category: 'loksewa-circulars',
    categoryLabelNe: 'लोकसेवा तथा संस्थान सूचना',
    titleNe: 'लोकसेवा आयोगद्वारा सार्वजनिक संस्थानहरूको एकीकृत परीक्षा क्यालेन्डर परिमार्जन',
    summaryNe: 'कृषि विकास बैंक, नेपाल टेलिकम र नागरिक लगानी कोष लगायतका संगठित संस्थाहरूको लिखित परीक्षा मिति निर्धारण।',
    detailedContentNe: [
      'लोकसेवा आयोगले संगठित संस्थाहरूको पदपूर्तिका लागि लिखित परीक्षा सञ्चालन कार्यतालिका अद्यावधिक गरेको छ।',
      'पूर्वयोग्यता परीक्षामा उत्तीर्ण उम्मेदवारहरू मात्र द्वितीय चरणको विषयगत लिखित परीक्षामा सहभागी हुन पाउनेछन्।'
    ],
    source: 'लोकसेवा आयोग सूचना',
    publishedTime: 'हिजो',
    readTimeMinutes: 3,
    isHeadline: false,
    isEditorPick: false,
    viewsCount: 11200,
    sharesCount: 420,
    tags: ['Loksewa', 'ADBL', 'Exam Routine'],
    actionType: 'quiz',
    actionLink: 'Loksewa'
  },
  {
    id: 'news-5',
    category: 'banking-news',
    categoryLabelNe: 'बैंकिङ समाचार',
    titleNe: 'डिजिटल भुक्तानीमा नयाँ रेकर्ड: QR कोड र वालेट कारोबारले नगद कारोबारलाई तीव्र रूपमा प्रतिस्थापन गर्दै',
    summaryNe: 'नेपालमा मासिक ४ खर्बभन्दा बढीको डिजिटल भुक्तानी कारोबार, राष्ट्र बैंकद्वारा साइबर सुरक्षा र जोखिम व्यवस्थापन सम्बन्धी कडा मापदण्ड जारी।',
    detailedContentNe: [
      'नेपाल क्लियरिङ हाउस (NCHL) र विभिन्न भुक्तानी सेवा प्रदायकहरू मार्फत हुने रिटेल डिजिटल कारोबारमा ५०% भन्दा बढीको वृद्धि देखिएको छ।',
      'परीक्षा महत्त्व: National Payment Switch (NPS), RTGS, र डिजिटल बैंकिङका फाइदा र चुनौतीहरू।'
    ],
    source: 'अनलाइनखबर बैंकिङ ब्यूरो',
    publishedTime: '२ दिन अगाडि',
    readTimeMinutes: 3,
    isHeadline: false,
    isEditorPick: false,
    viewsCount: 9600,
    sharesCount: 380,
    tags: ['Digital Banking', 'QR Payment', 'Cyber Security'],
    actionType: 'note',
    actionLink: 'note-banking-history'
  }
];
