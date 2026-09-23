export interface PracticalCalculationStep {
  stepNumber: number;
  stepTitleNe: string;
  formulaOrWorkingLatex?: string;
  explanationNe: string;
}

export interface PracticalNumericalExample {
  scenarioTitleNe: string;
  bankNameNe: string;
  fiscalYearNe: string;
  givenData: { labelNe: string; valueFormatted: string }[];
  steps: PracticalCalculationStep[];
  resultValueLatex: string;
  interpretationNe: string;
}

export interface RatioRegulatoryDetails {
  directiveNumberNe: string;
  mandatoryThresholdNe: string;
  nonCompliancePenaltyNe: string;
  baselFrameworkNe?: string;
}

export interface RatioPracticalApplications {
  regulatorySupervisionNe: string;
  creditRiskApprovalNe: string;
  investorPerceptionNe: string;
}

export interface RatioWindowDressingRisks {
  manipulationTechniquesNe: string[];
  auditorDetectionGuideNe: string[];
}

export interface FinancialRatioFormula {
  id: string;
  nameNe: string;
  nameEn: string;
  category: 'Liquidity' | 'Profitability' | 'Solvency' | 'Activity' | 'MarketValue' | 'Regulatory';
  formulaLatex: string;
  numeratorNe: string;
  denominatorNe: string;
  multiplier?: string;
  standardBenchmark: string;
  significanceNe: string;
  conceptAndPurposeNe: string;
  bankingApplicationNe: string;
  nrbDirectiveNormsNe: string;
  numericalExample: PracticalNumericalExample;
  strategicLimitationsNe: string;
  // Ultra-Premium Deep Research Fields
  deepConceptualRationaleNe?: string;
  practicalApplications?: RatioPracticalApplications;
  regulatoryFramework?: RatioRegulatoryDetails;
  windowDressingRisks?: RatioWindowDressingRisks;
}

export interface ComparisonTableRow {
  parameterNe: string;
  parameterEn: string;
  column1Value: string;
  column2Value: string;
  column3Value?: string;
}

export interface ExamQuestionModel {
  marks: number;
  questionNe: string;
  questionEn: string;
  examLevel: string;
  modelAnswerFramework: string[];
}

export interface BankingExamTopicNote {
  id: string;
  topicNumber: number;
  titleNe: string;
  titleEn: string;
  subtitleNe: string;
  categoryTag: string;
  paperReference: string;
  examWeightage: string;
  readTime: string;
  pdfFilename: string;
  summaryNe: string;
  definitionCard?: {
    termNe: string;
    termEn: string;
    definitionNe: string;
    source: string;
  };
  statutoryCard?: {
    actTitleNe: string;
    clauses: { clause: string; title: string; description: string }[];
  };
  markdownContent: string;
  ratios?: FinancialRatioFormula[];
  comparisonTable?: {
    titleNe: string;
    column1Header: string;
    column2Header: string;
    column3Header?: string;
    rows: ComparisonTableRow[];
  };
  probableExamQuestions: ExamQuestionModel[];
  keyTakeaways: string[];
}

export const BANKING_EXAM_TOPICS_DATA: BankingExamTopicNote[] = [
  // =========================================================================
  // TOPIC 1: Financial Statement & Ratio Analysis
  // =========================================================================
  {
    id: 'financial-statement-ratio-analysis',
    topicNumber: 1,
    titleNe: 'वित्तीय विवरण र यसको विश्लेषण',
    titleEn: 'Financial Statement & Ratio Analysis',
    subtitleNe: 'वासलात, नाफा-नोक्सान हिसाब, नगद प्रवाह, वित्तीय अनुपात तथा NFRS/NAS 1 ढाँचा',
    categoryTag: 'लेखा तथा वित्तीय विश्लेषण',
    paperReference: 'NRB / RBB / NBL / ADBL - Paper II (व्यवस्थापन र लेखा)',
    examWeightage: '१०-१५ अङ्क (नियमित परीक्षा प्रश्न)',
    readTime: '१२ मिनेट',
    pdfFilename: 'Banking_Notes_Topic_1_Financial_Statement_Ratio_Analysis.pdf',
    summaryNe: 'वित्तीय विवरणले संस्थाको निश्चित अवधिको वित्तीय अवस्था, कार्यसम्पादन तथा नगद प्रवाहको यथार्थ चित्रण प्रस्तुत गर्दछ। वित्तीय अनुपात विश्लेषणमार्फत बैंक तथा वित्तीय संस्थाको तरलता, नाफामूलकता, शोधनक्षमता र कार्यकुशलताको मूल्याङ्कन गरिन्छ।',
    definitionCard: {
      termNe: 'वित्तीय विवरण (Financial Statements)',
      termEn: 'Financial Statements (NFRS / NAS 1)',
      definitionNe: 'कुनै पनि संस्थाको निश्चित अवधिको वित्तीय स्थिति (Financial Position) तथा वित्तीय कार्यसम्पादन (Financial Performance) को व्यवस्थित र प्रमाणीकृत संरचनात्मक प्रस्तुतीकरणलाई वित्तीय विवरण भनिन्छ। यसले संस्थाको सम्पत्ति, दायित्व, पुँजी, आम्दानी, खर्च र नगद प्रवाहको यथार्थ ऐना प्रस्तुत गर्दछ।',
      source: 'NAS 1 (Presentation of Financial Statements) & BAFIA 2073 Sec 84'
    },
    statutoryCard: {
      actTitleNe: 'सम्बन्धित ऐन, कानुन तथा नियामकीय व्यवस्थाहरू',
      clauses: [
        { clause: 'BAFIA २०७३ दफा ८४', title: 'वित्तीय विवरण तयार गर्नुपर्ने', description: 'बैंक तथा वित्तीय संस्थाले प्रत्येक आर्थिक वर्ष समाप्त भएको ३ महिनाभित्र NFRS ढाँचामा वित्तीय विवरण तयार गरी लेखापरीक्षण गराउनुपर्ने।' },
        { clause: 'NRB ऐन २०५८ दफा ८५', title: 'वित्तीय विवरण राष्ट्र बैंकमा पेश गर्नुपर्ने', description: 'लेखापरीक्षण भएको वित्तीय विवरण राष्ट्र बैंकमा बुझाई स्वीकृति पश्चात मात्र साधारण सभामा पेश गर्न पाइने।' },
        { clause: 'NRB एकीकृत निर्देशन नं. १', title: 'पुँजी कोष (CAR/CRAR)', description: 'न्यूनतम ११% पुँजी पर्याप्तता र ८.५% प्राथमिक पुँजी (Tier 1) कायम गर्नुपर्ने अनिवार्य व्यवस्था।' },
        { clause: 'NRB एकीकृत निर्देशन नं. २', title: 'कर्जा-निक्षेप अनुपात (CD Ratio)', description: 'बैंकले कुल स्थानीय निक्षेपको अधिकतम ९०% सम्म मात्र कर्जा लगानी गर्न पाउने व्यवस्था।' },
        { clause: 'NRB एकीकृत निर्देशन नं. ४', title: 'लेखा सम्बन्धी ढाँचा', description: 'NFRS अनुरूप वित्तीय विवरणको ५ अङ्गहरूको विस्तृत अनुसूची र वर्गीकरण।' }
      ]
    },
    keyTakeaways: [
      'NFRS / NAS 1 अनुसार वित्तीय विवरणका ५ प्रमुख अङ्गहरू: वासलात, नाफा-नोक्सान, नगद प्रवाह, इक्विटी परिवर्तन विवरण र लेखा नीति अनुसूची।',
      'तरलता अनुपात (Current Ratio २:१, Quick Ratio १:१ र Cash Ratio ०.२-०.५:१) ले अल्पकालीन दायित्व भुक्तानी क्षमता मापन गर्दछ।',
      'नाफामूलकता अनुपातमा GPM, NPM, ROE र NIM मार्फत बैंकको सञ्चालन कार्यदक्षता मापन गरिन्छ।',
      'शोधनक्षमतामा Debt-to-Equity र Interest Coverage Ratio मार्फत संस्थाको दीर्घकालीन वित्तीय जोखिम जाँचिन्छ।',
      'नेपाल राष्ट्र बैंकको निर्देशन अनुसार CD Ratio अधिकतम ९०%, CAR कम्तीमा ११%, र NPL Ratio अधिकतम ५% भन्दा कम हुनु अनिवार्य छ।'
    ],
    ratios: [
      // =====================================================================
      // 1. LIQUIDITY RATIOS (तरलता अनुपातहरू)
      // =====================================================================
      {
        id: 'current-ratio',
        nameNe: 'चालु अनुपात',
        nameEn: 'Current Ratio (CR)',
        category: 'Liquidity',
        formulaLatex: '$\\text{Current Ratio} = \\frac{\\text{Current Assets}}{\\text{Current Liabilities}}$',
        numeratorNe: 'कुल चालु सम्पत्ति (नगद, बैंक मौज्दात, अल्पकालीन लगानी, ऋणी, चालु सम्पत्ति)',
        denominatorNe: 'कुल चालु दायित्व (माग तथा अल्पकालीन निक्षेप, साहु, तिर्न बाँकी खर्च, अल्पकालीन ऋण)',
        standardBenchmark: '२ : १ (वाणिज्य बैंकहरूमा १.२ - १.५ : १ सम्म स्वीकार्य)',
        significanceNe: 'संस्थाले १ वर्षभित्र परिपक्व हुने आफ्ना चालु दायित्वहरू चालु सम्पत्तिबाट चुक्ता गर्न सक्छ कि सक्दैन भनी अल्पकालीन शोधनक्षमता मापन गर्दछ।',
        conceptAndPurposeNe: 'चालु अनुपातले संस्थाको अल्पकालीन वित्तीय स्वास्थ्य र सुरक्षाको सीमा (Margin of Safety) देखाउँछ। यसले व्यवसायसँग १ रुपैयाँको अल्पकालीन दायित्व तिर्न कति रुपैयाँ बराबरको तरल तथा चालु सम्पत्ति उपलब्ध छ भन्ने यकिन गर्दछ।',
        bankingApplicationNe: 'नेपाल राष्ट्र बैंकका बैंक सुपरिवेक्षण विभाग (BSD) का निरीक्षकहरू, कर्जा अधिकृतहरू तथा अन्तर्राष्ट्रिय क्रेडिट रेटिङ एजेन्सीहरूले बैंकको आकस्मिक तरलता जोखिम (Liquidity Run Risk) विश्लेषण गर्न यसको प्रत्यक्ष मूल्याङ्कन गर्दछन्।',
        nrbDirectiveNormsNe: 'NRB एकीकृत निर्देशन नं. ५ (तरलता जोखिम व्यवस्थापन) अनुसार बैंकहरूले कुल निक्षेपको कम्तीमा २०% खुद तरल सम्पत्ति (Net Liquid Assets) कायम गर्नुपर्दछ। परम्परागत कम्पनीका लागि २:१ आदर्श मानिए तापनि बैंकिङ क्षेत्रमा १.२५:१ भन्दा माथिको अनुपात सन्तोषजनक मानिन्छ।',
        numericalExample: {
          scenarioTitleNe: 'राष्ट्रिय वाणिज्य बैंक लिमिटेडको आव २०८०/८१ को चौथो त्रैमासिक वासलात अनुसार:',
          bankNameNe: 'राष्ट्रिय वाणिज्य बैंक लि.',
          fiscalYearNe: 'आव २०८०/८१',
          givenData: [
            { labelNe: 'नगद तथा बैंक मौज्दात', valueFormatted: 'रु. ३२ अर्ब' },
            { labelNe: 'नेपाल राष्ट्र बैंकमा मौज्दात', valueFormatted: 'रु. १८ अर्ब' },
            { labelNe: 'सरकारी ऋणपत्रमा अल्पकालीन लगानी', valueFormatted: 'रु. ४० अर्ब' },
            { labelNe: 'अन्य चालु सम्पत्तिहरू', valueFormatted: 'रु. १० अर्ब' },
            { labelNe: 'कुल चालु दायित्व (माग तथा बचत निक्षेप, अल्पकालीन साहु)', valueFormatted: 'रु. ६५ अर्ब' }
          ],
          steps: [
            {
              stepNumber: 1,
              stepTitleNe: 'कुल चालु सम्पत्ति (Current Assets) को गणना',
              formulaOrWorkingLatex: '\\text{Current Assets} = 32 + 18 + 40 + 10 = 100\\text{ अर्ब}',
              explanationNe: 'नगद, केन्द्रीय बैंक मौज्दात, सरकारी ट्रेजरी बिल र अन्य चालु सम्पत्ति जोडेर कुल चालु सम्पत्ति रु. १०० अर्ब निकालियो।'
            },
            {
              stepNumber: 2,
              stepTitleNe: 'कुल चालु दायित्व (Current Liabilities) को पहिचान',
              formulaOrWorkingLatex: '\\text{Current Liabilities} = 65\\text{ अर्ब}',
              explanationNe: '१ वर्षभित्र भुक्तानी गर्नुपर्ने माग निक्षेप र अन्य चालु दायित्व रु. ६५ अर्ब रहेको छ।'
            },
            {
              stepNumber: 3,
              stepTitleNe: 'चालु अनुपात सूत्रमा मान प्रतिस्थापन',
              formulaOrWorkingLatex: '\\text{Current Ratio} = \\frac{100\\text{ अर्ब}}{65\\text{ अर्ब}} = 1.538\\approx 1.54 : 1',
              explanationNe: 'कुल चालु सम्पत्तिलाई कुल चालु दायित्वले भाग गर्दा १.५४ अनुपात प्राप्त हुन्छ।'
            }
          ],
          resultValueLatex: '1.54 : 1',
          interpretationNe: 'बैंकसँग प्रत्येक रु. १ को अल्पकालीन दायित्व भुक्तानी गर्न रु. १.५४ बराबरको चालु सम्पत्ति सुरक्षित छ। यो बैंकिङ मापदण्ड (१.२ - १.५:१) भन्दा माथि रहेकाले बैंकको तरलता अवस्था बलियो र सुरक्षित देखिन्छ।'
        },
        strategicLimitationsNe: 'चालु सम्पत्तिमा नउठ्ने जोखिमयुक्त सम्पत्ति वा खराब कर्जा मिसिएको भएमा यस अनुपातले वास्तविक तरलताभन्दा बढी कृत्रिम तरलता देखाउन सक्छ (त्यसैले Quick Ratio सँगै हेर्नुपर्दछ)।',
        deepConceptualRationaleNe: "चालु अनुपातले संस्थाको अल्पकालीन वित्तीय स्वास्थ्य र सुरक्षाको सीमा (Margin of Safety) देखाउँछ। यसले व्यवसायसँग १ रुपैयाँको अल्पकालीन दायित्व तिर्न कति रुपैयाँ बराबरको तरल तथा चालु सम्पत्ति उपलब्ध छ भन्ने यकिन गर्दछ। यदि यो अनुपात १ भन्दा कम भएमा संस्था प्राविधिक रूपमा अल्पकालीन टाट पल्टिने (Technical Insolvency) जोखिममा पर्दछ।",
        practicalApplications: {
          "regulatorySupervisionNe": "नेपाल राष्ट्र बैंकको बैंक तथा वित्तीय संस्था सुपरिवेक्षण विभाग (BSD) ले स्थलगत तथा गैर-स्थलगत निरीक्षण गर्दा संस्थाको तरल सम्पत्ति र दायित्व बीचको असन्तुलन (Maturity Mismatch) मापन गर्न चालु अनुपात परीक्षण गर्दछ।",
          "creditRiskApprovalNe": "बैंकका कर्जा अधिकृतहरूले चालु पुँजी कर्जा (Working Capital Loan / OD / Cash Credit) स्वीकृत गर्दा ऋणी उद्योगको चालु अनुपात न्यूनतम १.२५ : १ भए नभएको अनिवार्य विश्लेषण गर्दछन्।",
          "investorPerceptionNe": "नेप्सेका विश्लेषकहरूले सूचीकृत उत्पादनमूलक तथा व्यापारिक कम्पनीहरूको तरलता सङ्कट जाँच गर्न चालु अनुपात हेर्दछन्, जसले शेयरधनीको लगानी सुरक्षा सुनिश्चित गर्दछ।"
},
        regulatoryFramework: {
          "directiveNumberNe": "NRB एकीकृत निर्देशन नं. २ (कर्जा वर्गीकरण) तथा निर्देशन नं. ४",
          "mandatoryThresholdNe": "सामान्य व्यवसायमा २:१ आदर्श, तर वाणिज्य बैंकको कर्जा विश्लेषणमा न्यूनतम १.२५ : १ अनिवार्य।",
          "nonCompliancePenaltyNe": "ऋणीको चालु अनुपात कमजोर भएमा कर्जा नवीकरण रोकिने वा थप धितो/मार्जिन माग गरिने तथा बैंकको आफ्नै तरलता घटेमा शीघ्र सुधारात्मक कारबाही (PCA) आकर्षित हुने।"
},
        windowDressingRisks: {
          "manipulationTechniquesNe": [
                    "वर्षको अन्त्यमा कृत्रिम रूपमा अल्पकालीन ऋण चुक्ता गरी चालु सम्पत्ति र दायित्व दुवै घटाएर अनुपात उच्च देखाउनु।",
                    "बिक्री नहुने म्याद नाघेका स्टक वा नउठ्ने आसामी (Dead Debtors) लाई चालु सम्पत्तिमै कायम राखिराख्नु।",
                    "वर्षको अन्तिम दिन उधारो बिक्री देखाएर बिल भुक्तानी नआउँदै Debtors वृद्धि गर्नु।"
          ],
          "auditorDetectionGuideNe": [
                    "लेखापरीक्षकले ब्यालेन्स सिट मिति भन्दा अघि र पछिको नगद कारोबार (Cut-off Testing) गहन रूपमा जाँच्नुपर्छ।",
                    "ऋणीको स्टक अडिट रिपोर्ट र उमेर विश्लेषण (Debtor Ageing Analysis) जाँची ९० दिन नाघेका आसामी हटाउनुपर्छ।"
          ]
}
      },
      {
        id: 'quick-ratio',
        nameNe: 'शीघ्र / तरल अनुपात',
        nameEn: 'Quick / Acid-Test Ratio',
        category: 'Liquidity',
        formulaLatex: '$\\text{Quick Ratio} = \\frac{\\text{Quick Assets}}{\\text{Current Liabilities}} = \\frac{\\text{Current Assets} - \\text{Inventory} - \\text{Prepaids}}{\\text{Current Liabilities}}$',
        numeratorNe: 'शीघ्र सम्पत्ति (चालु सम्पत्ति - मौज्दात - पेश्की खर्च)',
        denominatorNe: 'कुल चालु दायित्व',
        standardBenchmark: '१ : १ (उत्कृष्ट)',
        significanceNe: 'बजारमा सामान बिक्री हुन कुर्नु नपरी तत्काल नगदमा रूपान्तरण गर्न सकिने परम तरल सम्पत्तिबाट तत्कालका दायित्व तिर्ने क्षमता नाप्दछ।',
        conceptAndPurposeNe: 'मौज्दात (Inventory) तुरुन्त नगदमा बिक्री हुन नसक्ने र पेश्की खर्च (Prepaids) बाट नगद फिर्ता नआउने भएकाले यी दुई घटाएर बाँकी रहने विशुद्ध तरल सम्पत्तिबाट दायित्व भुक्तानी गर्ने सामर्थ्य यसले देखाउँछ।',
        bankingApplicationNe: 'क्रेडिट एनालिस्टहरूले ऋणी कम्पनीको आकस्मिक नगद संकट झेल्ने क्षमता हेर्न यस अनुपातलाई प्रमुख आधार मान्दछन्। बैंक स्वयंका लागि यो गैर-ब्याज तरलताको सूचक हो।',
        nrbDirectiveNormsNe: 'NRB ले औद्योगिक तथा व्यापारिक ऋणीहरूको कर्जा प्रस्ताव मूल्याङ्कन गर्दा Quick Ratio न्यूनतम १:१ हुनुपर्ने निर्देशन दिएको छ।',
        numericalExample: {
          scenarioTitleNe: 'नबिल बैंक लिमिटेडबाट कर्जा माग गरेको एक प्रतिष्ठित व्यापारिक फर्मको विवरण:',
          bankNameNe: 'नबिल बैंक लि. (कर्जा विश्लेषण)',
          fiscalYearNe: 'आव २०८०/८१',
          givenData: [
            { labelNe: 'कुल चालु सम्पत्ति', valueFormatted: 'रु. ८० करोड' },
            { labelNe: 'अन्तिम मौज्दात (Closing Inventory)', valueFormatted: 'रु. २५ करोड' },
            { labelNe: 'पेश्की खर्च तथा धरौटी', valueFormatted: 'रु. ५ करोड' },
            { labelNe: 'कुल चालु दायित्व', valueFormatted: 'रु. ४० करोड' }
          ],
          steps: [
            {
              stepNumber: 1,
              stepTitleNe: 'शीघ्र सम्पत्ति (Quick Assets) को गणना',
              formulaOrWorkingLatex: '\\text{Quick Assets} = 80 - 25 - 5 = 50\\text{ करोड}',
              explanationNe: 'कुल चालु सम्पत्ति रु. ८० करोडबाट मौज्दात रु. २५ करोड र पेश्की रु. ५ करोड घटाउँदा रु. ५० करोड शीघ्र सम्पत्ति कायम भयो।'
            },
            {
              stepNumber: 2,
              stepTitleNe: 'शीघ्र अनुपातको सूत्रमा प्रतिस्थापन',
              formulaOrWorkingLatex: '\\text{Quick Ratio} = \\frac{50\\text{ करोड}}{40\\text{ करोड}} = 1.25 : 1',
              explanationNe: 'शीघ्र सम्पत्तिलाई चालु दायित्वले भाग गर्दा १.२५ अनुपात प्राप्त भयो।'
            }
          ],
          resultValueLatex: '1.25 : 1',
          interpretationNe: 'फर्मसँग तत्काल नगदमा परिणत हुने रु. १.२५ बराबरको सम्पत्ति उपलब्ध छ। यो १:१ को मानकभन्दा उच्च रहेकाले ऋणीको तत्काल ऋण चुक्ता गर्ने क्षमता मजबुत छ।'
        },
        strategicLimitationsNe: 'यसमा समावेश भएका ऋणीहरू (Debtors) यदि खराब कर्जामा फसेका छन् भने कागजमा Quick Ratio राम्रो देखिए पनि नगद अभाव हुन सक्छ।',
        deepConceptualRationaleNe: "द्रुत अनुपात (Acid-Test Ratio) ले तुरुन्तै नगदमा रूपान्तरण हुन नसक्ने मौज्दात (Inventory) र पेस्की खर्चलाई हटाएर वास्तविक तत्काल भुक्तानी क्षमता मापन गर्दछ। बजार मन्दी वा सङ्कटका बेला मौज्दात तुरुन्त बिक्री नहुने भएकाले यो अनुपात चालु अनुपात भन्दा बढी कठोर र भरपर्दो मानिन्छ।",
        practicalApplications: {
          "regulatorySupervisionNe": "NRB ले तरलता सङ्कट वा बैंक रन (Bank Run) को अवस्थामा बैंकहरूले तत्काल माग दायित्वहरू भुक्तानी गर्न सक्ने तरल सम्पत्ति राखेका छन् वा छैनन् भनी जाँच्दछ।",
          "creditRiskApprovalNe": "मौसमी तथा व्यापारिक कम्पनीहरूको कर्जा मूल्याङ्कन गर्दा स्टकमा अत्यधिक रकम अड्किएको जोखिम पहिचान गर्न कर्जा समितिले यो अनुपातलाई मुख्य आधार मान्दछ।",
          "investorPerceptionNe": "लगानीकर्ताहरूले कम्पनीको चालु सम्पत्ति केवल बिक्री नभएको स्टकले मात्र ढाकेको छ कि वास्तविक नगद र रिसिभेबल्स बलियो छ भनी पत्ता लगाउन यो अनुपात हेर्दछन्।"
},
        regulatoryFramework: {
          "directiveNumberNe": "NRB एकीकृत निर्देशन नं. ५ (तरलता जोखिम व्यवस्थापन)",
          "mandatoryThresholdNe": "मानक बेन्चमार्क १ : १ (वाणिज्य बैंकहरूमा ०.८ - १.० : १ स्वीकार्य)।",
          "nonCompliancePenaltyNe": "द्रुत अनुपात १:१ भन्दा निकै कम भएमा बैंकले आकस्मिक तरलता कर्जा (SLF) लिनुपर्ने र राष्ट्र बैंकले दैनिक तरलता अनुगमन कडा बनाउने।"
},
        windowDressingRisks: {
          "manipulationTechniquesNe": [
                    "सङ्कलन हुन असम्भव भएका शंकास्पद आसामीहरू (Doubtful Debtors) लाई छिट्टै उठ्ने दाबी गरी द्रुत सम्पत्तिमा समावेश गर्नु।",
                    "अल्पकालीन तिर्नुपर्ने दायित्वहरूलाई जानीजानी दीर्घकालीन दायित्वमा वर्गीकरण गरी हर (Denominator) सानो बनाउनु।"
          ],
          "auditorDetectionGuideNe": [
                    "लेखापरीक्षकले कुल रिसिभेबल्सको प्रोभिजनिङ जाँच गरी खराब आसामी घटाएर मात्र द्रुत अनुपात पुनर्गणना गर्नुपर्दछ।"
          ]
}
      },
      {
        id: 'cash-ratio',
        nameNe: 'नगद अनुपात (परम तरलता अनुपात)',
        nameEn: 'Cash Ratio (Absolute Liquidity)',
        category: 'Liquidity',
        formulaLatex: '$\\text{Cash Ratio} = \\frac{\\text{Cash and Cash Equivalents} + \\text{Marketable Securities}}{\\text{Current Liabilities}}$',
        numeratorNe: 'नगद, बैंक मौज्दात र तत्काल बिक्रीयोग्य सरकारी धितोपत्र',
        denominatorNe: 'कुल चालु दायित्व',
        standardBenchmark: '०.२ : १ देखि ०.५ : १ (२०% देखि ५०%)',
        significanceNe: 'संस्थाले बजारमा कुनै पनि सम्पत्ति वा सामान बिक्री नगरी हातमा भएको विशुद्ध नगदबाट तुरुन्तै दायित्व तिर्न सक्ने क्षमता देखाउँछ।',
        conceptAndPurposeNe: 'यो तरलताको सबैभन्दा कठोर र रुढिवादी (Most Conservative) सूचक हो। यसले कुनै पनि मध्यस्थता बिना बैंक वा कम्पनी बन्द हुँदा समेत आजको आज कति दायित्व भुक्तान हुन सक्छ भनी देखाउँछ।',
        bankingApplicationNe: 'केन्द्रीय बैंकले तरलता तनाव परीक्षण (Liquidity Stress Testing) गर्दा र बैंक रन (Bank Run) को परिदृश्य विश्लेषण गर्दा यस अनुपातलाई सूक्ष्म रूपमा निगरानी गर्दछ।',
        nrbDirectiveNormsNe: 'NRB ले बैंकहरूलाई दैनिक रूपमा कुल निक्षेपको निश्चित प्रतिशत बराबर तुरुन्त भुक्तानयोग्य नगद र केन्द्रीय बैंक मौज्दात राख्न अनिवार्य गर्दछ।',
        numericalExample: {
          scenarioTitleNe: 'नेपाल बैंक लिमिटेडको त्रैमासिक तरलता विवरण अनुसार:',
          bankNameNe: 'नेपाल बैंक लिमिटेड',
          fiscalYearNe: 'आव २०८०/८१',
          givenData: [
            { labelNe: 'भल्टमा रहेको नगद (Cash in Vault)', valueFormatted: 'रु. ८ अर्ब' },
            { labelNe: 'NRB मा रहेको चालु मौज्दात', valueFormatted: 'रु. १२ अर्ब' },
            { labelNe: 'तत्काल बिक्रीयोग्य ट्रेजरी बिल', valueFormatted: 'रु. १० अर्ब' },
            { labelNe: 'कुल चालु दायित्व', valueFormatted: 'रु. ८० अर्ब' }
          ],
          steps: [
            {
              stepNumber: 1,
              stepTitleNe: 'कुल नगद र नगद सरहको सम्पत्ति',
              formulaOrWorkingLatex: '\\text{Cash & Equivalents} = 8 + 12 + 10 = 30\\text{ अर्ब}',
              explanationNe: 'भल्ट नगद, NRB ब्यालेन्स र ट्रेजरी बिल जोड्दा रु. ३० अर्ब परम तरल सम्पत्ति हुन्छ।'
            },
            {
              stepNumber: 2,
              stepTitleNe: 'नगद अनुपात गणना',
              formulaOrWorkingLatex: '\\text{Cash Ratio} = \\frac{30\\text{ अर्ब}}{80\\text{ अर्ब}} = 0.375\\approx 0.38 : 1',
              explanationNe: '३० अर्बलाई ८० अर्बले भाग गर्दा ०.३८ अनुपात निस्कन्छ।'
            }
          ],
          resultValueLatex: '0.38 : 1 (37.5%)',
          interpretationNe: 'बैंकसँग कुल चालु दायित्वको ३७.५% हिस्सा तुरुन्त नगदमा भुक्तान गर्न सक्ने क्षमता छ, जुन ०.२-०.५:१ को आदर्श दायराभित्र पर्दछ।'
        },
        strategicLimitationsNe: 'अत्यधिक उच्च नगद अनुपात (०.८:१ भन्दा माथि) हुनुले बैंकले आम्दानी नगर्ने बाँझो नगद थुपारेको र पुँजी परिचालन दक्षता कमजोर भएको जनाउँछ।',
        deepConceptualRationaleNe: "नगद अनुपातले कुनै पनि मध्यस्थता बिना तुरुन्तै भुक्तानी दिन सकिने विशुद्ध नगद र बैंक मौज्दात मात्र समावेश गर्दछ। यो सबैभन्दा अनुदार (Ultra-Conservative) तरलता मापक हो, जसले बाह्य बजारमा कुनै पनि सम्पत्ति बेच्न नपरीकन संस्थाले आजै कति दायित्व चुक्ता गर्न सक्छ भनी देखाउँछ।",
        practicalApplications: {
          "regulatorySupervisionNe": "केन्द्रीय बैंकको सुपरिवेक्षण टोलीले दैनिक नगद मौज्दात अनुपात (CRR) र वैधानिक तरलता अनुपात (SLR) अनुपालनमा नगद अनुपातको सूक्ष्म निरीक्षण गर्दछ।",
          "creditRiskApprovalNe": "सङ्कटग्रस्त वा उच्च जोखिमयुक्त उद्योगलाई कर्जा दिँदा बैंकले आकस्मिक दायित्व धान्ने नगद सुरक्षा जाँच गर्न यो अनुपात विश्लेषण गर्दछ।",
          "investorPerceptionNe": "वित्तीय सङ्कट वा मन्दीका समयमा बजार विश्लेषकहरूले कम्पनीको \"Cash Buffer\" कति बलियो छ भनी हेर्न नगद अनुपातलाई प्राथमिकता दिन्छन्।"
},
        regulatoryFramework: {
          "directiveNumberNe": "NRB एकीकृत निर्देशन नं. ५ (अनिवार्य नगद मौज्दात CRR)",
          "mandatoryThresholdNe": "०.२ : १ देखि ०.५ : १ (२०% देखि ५०% सम्म नगद कभरेज)।",
          "nonCompliancePenaltyNe": "नगद अनुपात न्यून भई राष्ट्र बैंकमा तोकिएको ४% CRR नपुगेमा नपुग रकममा प्रचलित बैंक दरमा जरिवाना असुल गरिन्छ।"
},
        windowDressingRisks: {
          "manipulationTechniquesNe": [
                    "अन्तिम दिन अन्य बैंकबाट २४ घण्टे ओभरनाइट कल लोन (Call Borrowing) झिकेर नगद बढाउने र अर्को महिनाको पहिलो दिन फिर्ता गर्ने।",
                    "चेक जारी गरिसकेको तर ग्राहकले साट्न नल्याएको रकमलाई खातामै मौज्दात देखाएर नगद फुलाउनु।"
          ],
          "auditorDetectionGuideNe": [
                    "अन्तिम साताको बैंक रिकन्सिलिएसन स्टेटमेन्ट (BRS) र इन्टरबैंक सापटीको मुभमेन्ट विश्लेषण गर्नुपर्छ।"
          ]
}
      },

      // =====================================================================
      // 2. PROFITABILITY RATIOS (नाफामूलकता अनुपातहरू)
      // =====================================================================
      {
        id: 'gross-profit-margin',
        nameNe: 'कुल नाफा मार्जिन',
        nameEn: 'Gross Profit Margin (GPM)',
        category: 'Profitability',
        formulaLatex: '$\\text{Gross Profit Margin} = \\frac{\\text{Gross Profit}}{\\text{Total Revenue / Sales}} \\times 100\\%$',
        numeratorNe: 'कुल नाफा (बिक्री आम्दानी - प्रत्यक्ष उत्पादन/सञ्चालन लागत)',
        denominatorNe: 'कुल बिक्री आम्दानी (Revenue)',
        multiplier: '100%',
        standardBenchmark: '२०% - ३०% (उद्योगको प्रकृति अनुसार भिन्न)',
        significanceNe: 'प्रत्यक्ष उत्पादन लागत नियन्त्रण गरी कुल नाफा आर्जन गर्न सकेको आधारभूत कार्यकुशलता मापन गर्दछ।',
        conceptAndPurposeNe: 'प्रत्येक १०० रुपैयाँको बिक्रीमा प्रत्यक्ष कच्चा पदार्थ र श्रम खर्च कटाएर कति रकम प्रशासनिक खर्च र खुद नाफाका लागि बचत हुन्छ भन्ने देखाउँछ।',
        bankingApplicationNe: 'बैंकहरूले औद्योगिक तथा उत्पादनमूलक ऋणीहरूलाई चालु पुँजी कर्जा (Working Capital Loan) स्वीकृत गर्दा GPM को ५ वर्षे प्रवृत्ति विश्लेषण गर्छन्।',
        nrbDirectiveNormsNe: 'NRB को चालू पुँजी कर्जा सम्बन्धी मार्गदर्शन २०७९ अनुसार ऋणीको कुल नाफा मार्जिन स्थिर र यथार्थपरक हुनुपर्दछ।',
        numericalExample: {
          scenarioTitleNe: 'विराटनगरस्थित एक जुत्ता उद्योगको वार्षिक वित्तीय विवरण:',
          bankNameNe: 'कृषि विकास बैंक (कर्जा मूल्याङ्कन)',
          fiscalYearNe: 'आव २०८०/८१',
          givenData: [
            { labelNe: 'वार्षिक कुल बिक्री (Sales)', valueFormatted: 'रु. ५० करोड' },
            { labelNe: 'बिक्री भएको वस्तुको लागत (COGS)', valueFormatted: 'रु. ३५ करोड' }
          ],
          steps: [
            {
              stepNumber: 1,
              stepTitleNe: 'कुल नाफा (Gross Profit) पत्ता लगाउने',
              formulaOrWorkingLatex: '\\text{Gross Profit} = 50 - 35 = 15\\text{ करोड}',
              explanationNe: 'बिक्री ५० करोडबाट COGS ३५ करोड घटाउँदा कुल नाफा १५ करोड हुन्छ।'
            },
            {
              stepNumber: 2,
              stepTitleNe: 'GPM सूत्रमा मान राख्ने',
              formulaOrWorkingLatex: '\\text{GPM} = \\frac{15\\text{ करोड}}{50\\text{ करोड}} \\times 100\\% = 30.0\\%',
              explanationNe: '१५ लाई ५० ले भाग गरी १०० ले गुणन गर्दा ३०% आउँछ।'
            }
          ],
          resultValueLatex: '30.0\%',
          interpretationNe: 'कम्पनीले प्रत्येक १०० रुपैयाँको सामान बेच्दा रु. ३० कुल नाफा आर्जन गरेको छ, जसले उत्पादन लागत नियन्त्रण चुस्त रहेको देखाउँछ।'
        },
        strategicLimitationsNe: 'यो अनुपातले प्रशासनिक, मार्केटिङ, र वित्तीय (ब्याज) खर्च समावेश नगर्ने भएकाले कम्पनीको अन्तिम खुद नाफा यसबाट यकिन गर्न सकिँदैन।',
        deepConceptualRationaleNe: "कुल नाफा अनुपातले वस्तु वा सेवाको प्रत्यक्ष उत्पादन वा खरिद लागत (COGS) घटाएपछि बाँकी रहने नाफाको हिस्सा देखाउँछ। बैंकिङ सन्दर्भमा यसलाई कुल वित्तीय आम्दानी (ब्याज आम्दानी) बाट निक्षेपको ब्याज खर्च घटाएपछि आउने खुद ब्याज आम्दानी (NII Margin) सँग तुलना गरिन्छ।",
        practicalApplications: {
          "regulatorySupervisionNe": "नियामकले बैंकको कोष संकलन लागत (Cost of Funds) र कर्जा लगानी दर (Lending Yield) बीचको आधारभूत मार्जिन जाँच गर्न प्रयोग गर्दछ।",
          "creditRiskApprovalNe": "उत्पादनमूलक उद्योगको कर्जा प्रस्तावमा कच्चा पदार्थको मूल्यवृद्धिले नाफामा कस्तो असर पार्छ भनी संवेदनशीलता विश्लेषण (Sensitivity Analysis) गर्न प्रयोग हुन्छ।",
          "investorPerceptionNe": "लगानीकर्ताहरूले उद्योगको मूल्य निर्धारण शक्ति (Pricing Power) र उत्पादन कुशलता मूल्याङ्कन गर्न कुल नाफा मार्जिन तुलना गर्दछन्।"
},
        regulatoryFramework: {
          "directiveNumberNe": "NRB एकीकृत निर्देशन नं. १५ (ब्याजदर निर्धारण तथा नियमन)",
          "mandatoryThresholdNe": "सामान्य उद्योगमा २०% देखि ३०% सम्म, बैंकिङमा स्प्रेड दर अधिकतम ४.००% भित्र हुनुपर्ने।",
          "nonCompliancePenaltyNe": "स्प्रेड दर ४% भन्दा बढी भएमा बैंकले बढी लिएको ब्याज फिर्ता गर्नुपर्ने वा जरिवाना तिर्नुपर्ने।"
},
        windowDressingRisks: {
          "manipulationTechniquesNe": [
                    "समाप्ति मौज्दात (Closing Stock) को कृत्रिम रूपमा उच्च मूल्याङ्कन गरी COGS घटाएर Gross Profit बढाउनु।",
                    "प्रत्यक्ष उत्पादन खर्चलाई प्रशासनिक खर्चमा सारेर कुल नाफा फुलाउनु।"
          ],
          "auditorDetectionGuideNe": [
                    "स्टक मूल्याङ्कन विधि (FIFO/Weighted Average) को स्थिरता परीक्षण र कच्चा पदार्थ खपत अनुपात (Consumption Ratio) रुजु गर्नुपर्दछ।"
          ]
}
      },
      {
        id: 'net-profit-margin',
        nameNe: 'खुद नाफा मार्जिन',
        nameEn: 'Net Profit Margin (NPM)',
        category: 'Profitability',
        formulaLatex: '$\\text{Net Profit Margin} = \\frac{\\text{Net Profit After Tax (NPAT)}}{\\text{Total Revenue / Sales}} \\times 100\\%$',
        numeratorNe: 'कर पछिको खुद नाफा (NPAT)',
        denominatorNe: 'कुल बिक्री वा कुल सञ्चालन आम्दानी',
        multiplier: '100%',
        standardBenchmark: '१०% - १५%',
        significanceNe: 'सम्पूर्ण सञ्चालन, प्रशासनिक, वित्तीय खर्च तथा कर कटाएर प्रत्येक १०० रुपैयाँको कारोबारमा कति खुद नाफा बचत भयो भन्ने देखाउँछ।',
        conceptAndPurposeNe: 'यसले व्यवसायको समग्र व्यवस्थापकीय कार्यदक्षता, मूल्य निर्धारण क्षमता र लागत नियन्त्रणको संयुक्त सफलतालाई मापन गर्दछ।',
        bankingApplicationNe: 'बैंकको नाफा-नोक्सान विवरण विश्लेषण गर्दा विश्लेषकहरूले कुल ब्याज र गैर-ब्याज आम्दानीमा खुद नाफाको अंश कति रह्यो भनी हेर्न NPM प्रयोग गर्छन्।',
        nrbDirectiveNormsNe: 'NRB ले बैंकहरूको सञ्चालन दक्षता अनुगमन गर्दा नाफा मार्जिन र प्रोभिजनिङ पछिको खुद नाफालाई CAMELS रेटिङको "Earnings (E)" घटकमा मूल्याङ्कन गर्दछ।',
        numericalExample: {
          scenarioTitleNe: 'ग्लोबल आइएमई बैंक लिमिटेडको आव २०८०/८१ को वार्षिक कार्यसम्पादन:',
          bankNameNe: 'ग्लोबल आइएमई बैंक लि.',
          fiscalYearNe: 'आव २०८०/८१',
          givenData: [
            { labelNe: 'कुल सञ्चालन आम्दानी (Total Operating Income)', valueFormatted: 'रु. ४० अर्ब' },
            { labelNe: 'कर पछिको खुद नाफा (NPAT)', valueFormatted: 'रु. ६ अर्ब' }
          ],
          steps: [
            {
              stepNumber: 1,
              stepTitleNe: 'खुद नाफा मार्जिनको सूत्र प्रयोग',
              formulaOrWorkingLatex: '\\text{NPM} = \\frac{\\text{NPAT}}{\\text{Total Operating Income}} \\times 100\\%',
              explanationNe: 'कर पछिको खुद नाफालाई कुल आम्दानीले भाग गरी १०० ले गुणन गर्ने।'
            },
            {
              stepNumber: 2,
              stepTitleNe: 'मान प्रतिस्थापन र गणना',
              formulaOrWorkingLatex: '\\text{NPM} = \\frac{6\\text{ अर्ब}}{40\\text{ अर्ब}} \\times 100\\% = 15.0\\%',
              explanationNe: '६ लाई ४० ले भाग गर्दा ०.१५ आउँछ, जसलाई १०० ले गुणन गर्दा १५% हुन्छ।'
            }
          ],
          resultValueLatex: '15.0\%',
          interpretationNe: 'बैंकले कुल आम्दानीको १५% हिस्सा खुद नाफाको रूपमा सुरक्षित गरेको छ, जुन बैंकिङ उद्योगको औसतभन्दा उत्कृष्ट मानिन्छ।'
        },
        strategicLimitationsNe: 'गैर-सञ्चालन आम्दानी (जस्तै सम्पत्ति बिक्री वा विदेशी विनिमय उतारचढाव) ले कृत्रिम रूपमा NPM उच्च देखिन सक्छ।',
        deepConceptualRationaleNe: "खुद नाफा अनुपातले संस्थाको सम्पूर्ण सञ्चालन खर्च, प्रशासनिक खर्च, कर्जा नोक्सानी व्यवस्था (Loan Loss Provisioning), ह्रासकट्टी र कर भुक्तानी गरिसकेपछि कुल आम्दानीको कति प्रतिशत रकम शेयरधनीका लागि नाफाको रूपमा सुरक्षित रह्यो भनी देखाउँछ। यसले संस्थाको समष्टिगत लागत नियन्त्रण र मूल्य रणनीतिको दक्षता मापन गर्दछ।",
        practicalApplications: {
          "regulatorySupervisionNe": "NRB को CAMELS रेटिङको \"E\" (Earnings Quality) मूल्याङ्कनमा NPM र नाफाको दिगोपना (Sustainability) प्रमुख आधार बन्दछ।",
          "creditRiskApprovalNe": "ऋणीको खुद नाफा मार्जिनले उसले ऋणको किस्ता र ब्याज सजिलै तिर्न सक्छ कि सक्दैन भन्ने नगद सृजना क्षमता (Cash Generation Capacity) पुष्टि गर्दछ।",
          "investorPerceptionNe": "नेप्सेमा कम्पनीको शेयर मूल्य (MPS) निर्धारण, लाभांश क्षमता (Dividend Payout Ratio) र PE Ratio गणनामा यसले प्रत्यक्ष भूमिका खेल्दछ।"
},
        regulatoryFramework: {
          "directiveNumberNe": "NRB एकीकृत निर्देशन नं. ४ (NFRS वित्तीय विवरण ढाँचा)",
          "mandatoryThresholdNe": "नेपाली वाणिज्य बैंकहरूमा १५% देखि २५% सम्म स्वस्थ मानिन्छ।",
          "nonCompliancePenaltyNe": "लगातार ऋणात्मक NPM भएमा बैंकलाई शीघ्र सुधारात्मक कारबाही (PCA) अन्तर्गत लाभांश वितरणमा रोक र नयाँ शाखा खोल्न प्रतिबन्ध लगाइन्छ।"
},
        windowDressingRisks: {
          "manipulationTechniquesNe": [
                    "खराब कर्जाको प्रोभिजनिङ (Loan Loss Provision) कम छुट्याएर नाफा कृत्रिम रूपमा बढाउनु।",
                    "पुँजीगत खर्च (Capital Expenditure) लाई आम्दानी खर्च (Revenue Expenditure) को रूपमा देखाएर कर घटाउने वा उल्टो गरी नाफा बढाउने।"
          ],
          "auditorDetectionGuideNe": [
                    "NFRS 9 अनुसार Expected Credit Loss (ECL) र प्रोभिजनिङको स्वतन्त्र गणना गरी गैर-सञ्चालन आम्दानीको अंश अलग्याउनुपर्छ।"
          ]
}
      },
      {
        id: 'roa',
        nameNe: 'सम्पत्तिमा प्रतिफल',
        nameEn: 'Return on Assets (ROA)',
        category: 'Profitability',
        formulaLatex: '$\\text{ROA} = \\frac{\\text{Net Profit After Tax}}{\\text{Total Assets}} \\times 100\\%$',
        numeratorNe: 'कर पछिको खुद नाफा (NPAT)',
        denominatorNe: 'कुल सम्पत्ति (Total Assets / Average Assets)',
        multiplier: '100%',
        standardBenchmark: '१.०% - २.०% (बैंकिङ क्षेत्रमा १.५% उत्कृष्ट)',
        significanceNe: 'व्यवस्थापनले संस्थाको समग्र सम्पत्ति (निक्षेपबाट सिर्जित कर्जा र लगानी) परिचालन गरी नाफा कमाउन देखाएको कार्यकुशलता मापन गर्दछ।',
        conceptAndPurposeNe: 'बैंकहरू निकै उच्च लिभरेज (High Leverage) मा चल्ने भएकाले कुल सम्पत्तिको तुलनामा नाफाको प्रतिशत १ देखि २ प्रतिशत हुनु अन्तर्राष्ट्रिय रूपमै बलियो मानिन्छ।',
        bankingApplicationNe: 'केन्द्रीय बैंकका सुपरिवेक्षकहरूले बैंकको CAMELS रेटिङ गर्दा "Earnings Quality" मापन गर्न ROA लाई प्रमुख अन्तर्राष्ट्रिय सूचक मान्दछन्।',
        nrbDirectiveNormsNe: 'NRB ले १.५% वा सोभन्दा माथिको ROA लाई "उत्कृष्ट", १.०% - १.४९% लाई "सन्तोषजनक" र १% भन्दा कमलाई "कमजोर" श्रेणीमा वर्गीकरण गर्दछ।',
        numericalExample: {
          scenarioTitleNe: 'एभरेष्ट बैंक लिमिटेडको आव २०८०/८१ को वासलात र नाफा-नोक्सान विवरण:',
          bankNameNe: 'एभरेष्ट बैंक लि.',
          fiscalYearNe: 'आव २०८०/८१',
          givenData: [
            { labelNe: 'कर पछिको खुद नाफा (NPAT)', valueFormatted: 'रु. ३.४० अर्ब' },
            { labelNe: 'औसत कुल सम्पत्ति (Total Assets)', valueFormatted: 'रु. २१२.५० अर्ब' }
          ],
          steps: [
            {
              stepNumber: 1,
              stepTitleNe: 'ROA सूत्रमा मान प्रतिस्थापन',
              formulaOrWorkingLatex: '\\text{ROA} = \\frac{3.40\\text{ अर्ब}}{212.50\\text{ अर्ब}} \\times 100\\%',
              explanationNe: 'खुद नाफा रु. ३.४० अर्बलाई कुल सम्पत्ति रु. २१२.५० अर्बले भाग गर्ने।'
            },
            {
              stepNumber: 2,
              stepTitleNe: 'अन्तिम प्रतिशत गणना',
              formulaOrWorkingLatex: '\\text{ROA} = 0.0160 \\times 100\\% = 1.60\\%',
              explanationNe: 'प्रतिफल दर १.६०% प्राप्त भयो।'
            }
          ],
          resultValueLatex: '1.60\%',
          interpretationNe: 'बैंकले आफ्नो प्रत्येक १०० रुपैयाँ सम्पत्ति परिचालन गरी रु. १.६० खुद नाफा आर्जन गरेको छ। यो NRB को १.५% को बेन्चमार्कभन्दा उच्च रहेकाले सम्पत्ति व्यवस्थापन अति कार्यकुशल छ।'
        },
        strategicLimitationsNe: 'बैंकको कुल सम्पत्तिमा ठूलो मात्रामा सरकारी ऋणपत्र (कम जोखिम र कम प्रतिफल) राखिएको छ भने नाफा सुरक्षित भए तापनि ROA कम देखिन सक्छ।',
        deepConceptualRationaleNe: "सम्पत्तिमा प्रतिफल (ROA) ले बैंकले परिचालन गरेको कुल सम्पत्ति (निक्षेप, कर्जा, लगानी, स्थिर सम्पत्ति) बाट कति प्रतिशत खुद नाफा आर्जन गर्न सफल भयो भनी देखाउँछ। बैंकहरू अत्यधिक कर्जा वा निक्षेपमा भर पर्ने (Highly Leveraged) संस्था भएकाले ROA ले व्यवस्थापनले सम्पत्तिको कुशलतम उपयोग गरेको छ वा छैन भन्ने स्पष्ट पार्दछ।",
        practicalApplications: {
          "regulatorySupervisionNe": "केन्द्रीय बैंकले सबै वाणिज्य बैंकहरूको कार्यसम्पादन तुलना गर्न र वित्तीय स्थायित्व प्रतिवेदन (FSR) तयार गर्न ROA लाई विश्वव्यापी मानक मान्दछ।",
          "creditRiskApprovalNe": "कर्जा विश्लेषणमा ऋणी कम्पनीले लिएको ऋण र सम्पत्तिको आधारमा पर्याप्त प्रतिफल निकालेको छ कि छैन भनी जाँच्न प्रयोग हुन्छ।",
          "investorPerceptionNe": "विश्वका ठूला लगानी कोषहरूले बैंकको गुणस्तर मापन गर्न १.०% भन्दा माथिको ROA भएका बैंकहरूलाई प्रिमियम मूल्याङ्कन गर्दछन्।"
},
        regulatoryFramework: {
          "directiveNumberNe": "NRB CAMELS सुपरिवेक्षण निर्देशिका",
          "mandatoryThresholdNe": "अन्तर्राष्ट्रिय मानक अनुसार १.०% भन्दा माथि (नेपालमा १.०% - १.५% स्वस्थ)।",
          "nonCompliancePenaltyNe": "ROA ०.५% भन्दा कम भएमा बैंकलाई कमजोर कार्यसम्पादन समूहमा राखी सञ्चालक समितिसँग स्पष्टीकरण माग गरिन्छ।"
},
        windowDressingRisks: {
          "manipulationTechniquesNe": [
                    "अन्तिम त्रैमासमा गैर-बैंकिङ सम्पत्ति (Non-Banking Assets - NBA) को पुनःमूल्याङ्कन गरी अन्य आम्दानीमा देखाउनु।",
                    "सम्पत्तिको ह्रासकट्टी (Depreciation) कम गरेर सम्पत्ति फुलाउनु र खर्च घटाउनु।"
          ],
          "auditorDetectionGuideNe": [
                    "कुल सम्पत्तिबाट काल्पनिक सम्पत्ति (Fictitious Assets) हटाई औसत सम्पत्ति (Average Assets) का आधारमा ROA जाँच गर्नुपर्छ।"
          ]
}
      },
      {
        id: 'roe',
        nameNe: 'स्वपुँजीमा प्रतिफल',
        nameEn: 'Return on Equity (ROE)',
        category: 'Profitability',
        formulaLatex: '$$\\text{ROE} = \\frac{\\text{Net Profit After Tax}}{\\text{Shareholders Equity}} \\times 100\\%$$',
        numeratorNe: 'कर पछिको खुद नाफा (NPAT)',
        denominatorNe: 'कुल सेयरधनी कोष (इक्विटी पुँजी + जगेडा तथा सञ्चित कोष)',
        multiplier: '100%',
        standardBenchmark: '१२% - १५% भन्दा माथि उत्कृष्ट मानिन्छ',
        significanceNe: 'सेयरधनीहरूले लगानी गरेको प्रत्येक १०० रुपैयाँ पुँजीले कति रुपैयाँ नाफा आर्जन गर्‍यो भन्ने मापन गर्दछ (DuPont विश्लेषणको आधार)।',
        conceptAndPurposeNe: 'यो अनुपात साधारण सेयरधनी र लगानीकर्ताहरूका लागि सबैभन्दा महत्त्वपूर्ण सूचक हो। यसले सेयरधनीको पुँजीलाई व्यवस्थापनले कत्तिको प्रतिफलमुखी बनाएको छ भन्ने देखाउँछ।',
        bankingApplicationNe: 'स्टक मार्केट विश्लेषक, लगानीकर्ता र मर्जर/एक्विजिसन कमिटीहरूले बैंकको मूल्य निर्धारण गर्न ROE लाई प्रमुख कसी मान्छन्।',
        nrbDirectiveNormsNe: 'NRB ले बैंकहरूको पुँजी योजना (Capital Plan) मूल्याङ्कन गर्दा आन्तरिक पुँजी सिर्जना (Internal Capital Generation) को क्षमता जाँच्न ROE हेर्दछ।',
        numericalExample: {
          scenarioTitleNe: 'स्ट्यान्डर्ड चार्टर्ड बैंक नेपाल लिमिटेडको आव २०८०/८१ को विवरण:',
          bankNameNe: 'स्ट्यान्डर्ड चार्टर्ड बैंक नेपाल लि.',
          fiscalYearNe: 'आव २०८०/८१',
          givenData: [
            { labelNe: 'कर पछिको खुद नाफा (NPAT)', valueFormatted: 'रु. २.८० अर्ब' },
            { labelNe: 'कुल सेयरधनी कोष (Shareholders Equity)', valueFormatted: 'रु. १७.५० अर्ब' }
          ],
          steps: [
            {
              stepNumber: 1,
              stepTitleNe: 'ROE सूत्र प्रयोग',
              formulaOrWorkingLatex: '\\text{ROE} = \\frac{\\text{NPAT}}{\\text{Shareholders Equity}} \\times 100\\%',
              explanationNe: 'खुद नाफालाई कुल सेयरधनी कोषले भाग गर्ने।'
            },
            {
              stepNumber: 2,
              stepTitleNe: 'मान प्रतिस्थापन र गणना',
              formulaOrWorkingLatex: '\\text{ROE} = \\frac{2.80\\text{ अर्ब}}{17.50\\text{ अर्ब}} \\times 100\\% = 16.0\\%',
              explanationNe: '२.८० लाई १७.५० ले भाग गर्दा ०.१६ आउँछ, अर्थात् १६%।'
            }
          ],
          resultValueLatex: '16.0\%',
          interpretationNe: 'सेयरधनीको प्रत्येक रु. १०० लगानीमा बैंकले रु. १६ खुद नाफा आर्जन गरेको छ। यो १५% को उत्कृष्ट बेन्चमार्कभन्दा माथि रहेकाले लगानीकर्ताका लागि बैंक अति आकर्षक छ।'
        },
        strategicLimitationsNe: 'बैंकले अत्यधिक ऋण वा बाह्य दायित्व लिई इक्विटी निकै सानो बनाएको अवस्थामा वित्तीय जोखिम उच्च भए तापनि कृत्रिम रूपमा ROE धेरै उच्च देखिन सक्छ (Financial Leverage Risk)।',
        deepConceptualRationaleNe: "इक्विटीमा प्रतिफल (ROE) ले शेयरधनीहरूले लगानी गरेको प्रत्येक १०० रुपैयाँ पुँजीबाट बैंकले कति रुपैयाँ खुद नाफा कमायो भनी देखाउँछ। यो डुपोन्ट विश्लेषण (DuPont Analysis) को केन्द्रबिन्दु हो, जसमा नाफा मार्जिन (NPM), सम्पत्ति कारोबार दर (Asset Turnover), र वित्तीय लिभरेज (Financial Leverage) गरी ३ प्रमुख तत्व समाविष्ट हुन्छन्।",
        practicalApplications: {
          "regulatorySupervisionNe": "शेयरधनीको पुँजी संरक्षण भइरहेको छ वा पुँजी क्षयीकरण (Capital Erosion) भइरहेको छ भनी निगरानी गर्न NRB ले ROE अनुगमन गर्दछ।",
          "creditRiskApprovalNe": "संस्थामा प्रवर्द्धकहरूको लगानी प्रतिको प्रतिबद्धता र पुँजी विस्तार क्षमता मूल्याङ्कन गर्न प्रयोग हुन्छ।",
          "investorPerceptionNe": "नेप्सेका लगानीकर्ताहरूका लागि शेयर खरिद-बिक्रीको सबैभन्दा शक्तिशाली सूचक ROE हो। उच्च ROE ले उच्च बोनस शेयर र नगद लाभांश सुनिश्चित गर्दछ।"
},
        regulatoryFramework: {
          "directiveNumberNe": "NRB एकीकृत निर्देशन नं. १ (पुँजी पर्याप्तता) तथा NFRS",
          "mandatoryThresholdNe": "नेपालमा वाणिज्य बैंकहरूका लागि १२% देखि १५% सम्म सन्तोषजनक मानिन्छ।",
          "nonCompliancePenaltyNe": "लगातार ५% भन्दा कम ROE भएमा बैंकको शेयर मूल्य अङ्कित मूल्य (Par Value) भन्दा तल झर्ने र पुँजी जुटाउन नसक्ने जोखिम हुन्छ।"
},
        windowDressingRisks: {
          "manipulationTechniquesNe": [
                    "अत्यधिक ऋण लिएर पुँजीको आधार सानो राखी कृत्रिम रूपमा उच्च ROE देखाउने (Over-leveraging)।",
                    "सञ्चिति कोष (Reserves) बाट रकम झिकेर आम्दानीमा देखाउनु।"
          ],
          "auditorDetectionGuideNe": [
                    "डुपोन्ट ३-तत्व विश्लेषण गरी ROE वृद्धिको कारण वास्तविक नाफा हो वा अत्यधिक वित्तीय जोखिम (Leverage) हो भनी खुट्याउनुपर्छ।"
          ]
}
      },
      {
        id: 'nim',
        nameNe: 'खुद ब्याज मार्जिन',
        nameEn: 'Net Interest Margin (NIM)',
        category: 'Profitability',
        formulaLatex: '$\\text{NIM} = \\frac{\\text{Interest Income} - \\text{Interest Expense}}{\\text{Average Total Earning Assets}} \\times 100\\%$',
        numeratorNe: 'खुद ब्याज आम्दानी (ब्याज आम्दानी - ब्याज खर्च)',
        denominatorNe: 'औसत ब्याज आर्जन गर्ने कुल सम्पत्ति (कर्जा तथा सापट + लगानी)',
        multiplier: '100%',
        standardBenchmark: '३.०% - ४.०% को बीचमा सन्तुलित',
        significanceNe: 'बैंकको मुख्य वित्तीय मध्यस्थता (निक्षेप संकलन र कर्जा प्रवाह) कार्यबाट आर्जित नाफाको वास्तविक दर मापन गर्दछ।',
        conceptAndPurposeNe: 'बैंकको मुख्य आम्दानी निक्षेपमा तिर्ने ब्याज र कर्जामा लिने ब्याज बीचको अन्तर (Spread) बाट आउँछ। NIM ले बैंकको कोषको लागत (Cost of Funds) र कर्जाको प्रतिफल (Yield on Advances) बीचको अन्तर कत्तिको नाफामूलक छ भनी देखाउँछ।',
        bankingApplicationNe: 'एसेट लायबिलिटी म्यानेजमेन्ट कमिटी (ALCO) ले ब्याजदर जोखिम (Interest Rate Risk) व्यवस्थापन गर्न र निक्षेप/कर्जाको ब्याजदर तोक्न NIM विश्लेषण गर्दछ।',
        nrbDirectiveNormsNe: 'नेपाल राष्ट्र बैंकले बैंक तथा वित्तीय संस्थाहरूको औसत ब्याजदर अन्तर (Interest Rate Spread) अधिकतम ४.००% भित्र राख्नुपर्ने अनिवार्य सीमा तोकेको छ, जसको प्रत्यक्ष असर NIM मा पर्दछ।',
        numericalExample: {
          scenarioTitleNe: 'सानिमा बैंक लिमिटेडको आव २०८०/८१ को वार्षिक कार्यविवरण:',
          bankNameNe: 'सानिमा बैंक लि.',
          fiscalYearNe: 'आव २०८०/८१',
          givenData: [
            { labelNe: 'कुल ब्याज आम्दानी (Interest Income)', valueFormatted: 'रु. १५ अर्ब' },
            { labelNe: 'कुल ब्याज खर्च (Interest Expense)', valueFormatted: 'रु. १० अर्ब' },
            { labelNe: 'औसत ब्याज आर्जन गर्ने सम्पत्ति (Earning Assets)', valueFormatted: 'रु. १४० अर्ब' }
          ],
          steps: [
            {
              stepNumber: 1,
              stepTitleNe: 'खुद ब्याज आम्दानी (Net Interest Income) पत्ता लगाउने',
              formulaOrWorkingLatex: '\\text{Net Interest Income} = 15 - 10 = 5\\text{ अर्ब}',
              explanationNe: 'ब्याज आम्दानीबाट ब्याज खर्च घटाउँदा खुद ब्याज आम्दानी रु. ५ अर्ब प्राप्त भयो।'
            },
            {
              stepNumber: 2,
              stepTitleNe: 'NIM सूत्रमा प्रतिस्थापन',
              formulaOrWorkingLatex: '\\text{NIM} = \\frac{5\\text{ अर्ब}}{140\\text{ अर्ब}} \\times 100\\% = 3.571\\approx 3.57\\%',
              explanationNe: '५ लाई १४० ले भाग गरी १०० ले गुणन गर्दा ३.५७% आउँछ।'
            }
          ],
          resultValueLatex: '3.57\%',
          interpretationNe: 'बैंकले आफ्ना कुल ब्याज आर्जन गर्ने सम्पत्तिबाट खुद ३.५७% ब्याज नाफा आर्जन गरेको छ। यो ३-४% को स्वस्थ दायराभित्र पर्दछ र बैंकको मध्यस्थता कार्य कुशल रहेको प्रमाणित गर्छ।'
        },
        strategicLimitationsNe: 'खराब कर्जा बढेर ब्याज असुली नहुँदा पनि एक्रूअल बेसिसमा ब्याज आम्दानी जनाइएको भए NIM बढी देखिन सक्छ (त्यसैले Cash NIM समेत हेर्नुपर्छ)।',
        deepConceptualRationaleNe: "खुद ब्याज मार्जिन (NIM) ले बैंकको मूल बैंकिङ कारोबार (Core Banking Business) को नाफामूलकता देखाउँछ। बैंकले कर्जा तथा लगानीबाट कमाएको ब्याज आम्दानी र निक्षेप तथा सापटीमा तिरेको ब्याज खर्च बीचको खुद अन्तरलाई कुल कमाउने सम्पत्ति (Earning Assets) सँग तुलना गरिन्छ। यो बैंकको ब्याजदर जोखिम व्यवस्थापन (ALM) को सबैभन्दा महत्त्वपूर्ण मापक हो।",
        practicalApplications: {
          "regulatorySupervisionNe": "NRB को सम्पत्ति-दायित्व व्यवस्थापन समिति (ALCO) सुपरिवेक्षणमा NIM को स्थिरता र स्प्रेड दर अनुगमनको मुख्य हतियार।",
          "creditRiskApprovalNe": "बैंकले सस्तो ब्याजमा निक्षेप उठाएर सुरक्षित कर्जामा लगानी गर्न सकेको छ कि छैन भनी आन्तरिक कार्यदक्षता मूल्याङ्कन गर्न प्रयोग हुन्छ।",
          "investorPerceptionNe": "विश्लेषकहरूले बैंकको कोर बैंकिङ बलियो छ वा अन्य कमिसन/धितोपत्र कारोबारमा मात्र निर्भर छ भनी छुट्याउन NIM हेर्दछन्।"
},
        regulatoryFramework: {
          "directiveNumberNe": "NRB एकीकृत निर्देशन नं. १५ (ब्याजदर अन्तर - Interest Rate Spread)",
          "mandatoryThresholdNe": "नेपाली वाणिज्य बैंकहरूमा ३.०% देखि ४.०% सम्म आदर्श NIM।",
          "nonCompliancePenaltyNe": "ब्याजदर स्प्रेड ४% नाघेमा राष्ट्र बैंकले कारबाही गरी ब्याजदर घटाउन बाध्य पार्दछ।"
},
        windowDressingRisks: {
          "manipulationTechniquesNe": [
                    "खराब कर्जाको पाकेको तर नउठेको ब्याजलाई पनि आम्दानीमा देखाउने (Accrual basis manipulation)।",
                    "अन्तिम महिनामा कम ब्याजदरका मुद्दती निक्षेपको ब्याज खर्च स्थगित गर्नु।"
          ],
          "auditorDetectionGuideNe": [
                    "Interest Suspense Account को रुजु गर्ने र NFRS अनुसार पाकेको ब्याज नगदमा उठेको अनुपात (Cash Realization) परीक्षण गर्ने।"
          ]
}
      },

      // =====================================================================
      // 3. REGULATORY NORMS (नेपाल राष्ट्र बैंकका प्रमुख नियामकीय सूचकहरू)
      // =====================================================================
      {
        id: 'car',
        nameNe: 'पुँजी पर्याप्तता अनुपात',
        nameEn: 'Capital Adequacy Ratio (CAR / CRAR)',
        category: 'Regulatory',
        formulaLatex: '$\\text{CAR} = \\frac{\\text{Total Capital (Tier 1 + Tier 2)}}{\\text{Total Risk-Weighted Assets (RWA)}} \\times 100\\%$',
        numeratorNe: 'कुल पुँजी कोष (प्राथमिक पुँजी Tier 1 + पूरक पुँजी Tier 2)',
        denominatorNe: 'कुल जोखिम भारित सम्पत्ति (क्रेडिट, बजार र सञ्चालन जोखिम भार)',
        multiplier: '100%',
        standardBenchmark: 'न्यूनतम ११.०% (प्राथमिक पुँजी Tier 1 कम्तीमा ८.५%)',
        significanceNe: 'बैंकले वित्तीय संकट, कर्जा नोक्सानी र बजार जोखिम वहन गर्न पर्याप्त आन्तरिक पुँजी राखेको छ वा छैन भनी निक्षेपकर्ताको सुरक्षा प्रत्याभूत गर्दछ।',
        conceptAndPurposeNe: 'बासेल ३ (Basel III) मापदण्ड अनुसार बैंकको सम्पत्ति जति बढी जोखिमयुक्त हुन्छ, त्यति नै बढी पुँजी कोष जगेडा राख्नुपर्छ ताकि निक्षेपकर्ताको १ रुपैयाँ पनि नडुबोस्।',
        bankingApplicationNe: 'NRB को गैर-स्थलगत सुपरिवेक्षण, बैंकको शाखा विस्तार स्वीकृति, लाभांश वितरण स्वीकृति र शीघ्र सुधारात्मक कारबाही (PCA) निर्धारण गर्ने प्रमुख कसी CAR हो।',
        nrbDirectiveNormsNe: 'NRB एकीकृत निर्देशन नं. १ (Capital Adequacy Framework 2015) अनुसार वाणिज्य बैंकहरूले न्यूनतम ११% Total CAR (जसमा २.५% Capital Conservation Buffer समावेश छ) र ८.५% Common Equity Tier 1 (CET1) कायम गर्नुपर्दछ।',
        numericalExample: {
          scenarioTitleNe: 'प्राइम कमर्सियल बैंक लिमिटेडको आव २०८०/८१ को पुँजी संरचना र जोखिम भार:',
          bankNameNe: 'प्राइम कमर्सियल बैंक लि.',
          fiscalYearNe: 'आव २०८०/८१',
          givenData: [
            { labelNe: 'प्राथमिक पुँजी (Tier 1 Capital)', valueFormatted: 'रु. २२ अर्ब' },
            { labelNe: 'पूरक पुँजी (Tier 2 Capital)', valueFormatted: 'रु. ६ अर्ब' },
            { labelNe: 'कुल जोखिम भारित सम्पत्ति (Total RWA)', valueFormatted: 'रु. २३० अर्ब' }
          ],
          steps: [
            {
              stepNumber: 1,
              stepTitleNe: 'कुल पुँजी कोष (Total Capital Fund) गणना',
              formulaOrWorkingLatex: '\\text{Total Capital} = 22 + 6 = 28\\text{ अर्ब}',
              explanationNe: 'Tier 1 र Tier 2 पुँजी जोडेर कुल पुँजी रु. २८ अर्ब भयो।'
            },
            {
              stepNumber: 2,
              stepTitleNe: 'CAR सूत्रमा प्रतिस्थापन',
              formulaOrWorkingLatex: '\\text{CAR} = \\frac{28\\text{ अर्ब}}{230\\text{ अर्ब}} \\times 100\\% = 12.17\\%',
              explanationNe: 'कुल पुँजीलाई कुल RWA ले भाग गरी १०० ले गुणन गर्दा १२.१७% आयो।'
            },
            {
              stepNumber: 3,
              stepTitleNe: 'Tier 1 अनुपात परीक्षण',
              formulaOrWorkingLatex: '\\text{Tier 1 Ratio} = \\frac{22\\text{ अर्ब}}{230\\text{ अर्ब}} \\times 100\\% = 9.57\\%',
              explanationNe: 'Tier 1 अनुपात ९.५७% आयो।'
            }
          ],
          resultValueLatex: 'CAR = 12.17\% \\text{ (Tier 1 = 9.57\%)}',
          interpretationNe: 'बैंकको CAR १२.१७% रहेको छ जुन NRB को न्यूनतम सीमा ११% भन्दा माथि छ र Tier 1 पनि ८.५% भन्दा माथि छ। बैंक वित्तीय रूपमा सुरक्षित छ र लाभांश बाँड्न योग्य छ।'
        },
        strategicLimitationsNe: 'जोखिम भार निर्धारण गर्दा बैंकले वास्तविक कर्जा जोखिम कम मूल्याङ्कन गरेमा CAR कागजमा मात्र बलियो देखिन सक्छ।',
        deepConceptualRationaleNe: "पुँजी पर्याप्तता अनुपात (CAR / CRAR) ले बैंकसँग आफ्ना निक्षेपकर्ताहरूको सुरक्षा गर्न र सम्भावित कर्जा, बजार तथा सञ्चालन जोखिम धान्न पर्याप्त पुँजी कोष उपलब्ध छ वा छैन भनी मापन गर्दछ। यो बासेल ३ (Basel III) फ्रेमवर्कमा आधारित अन्तर्राष्ट्रिय स्तरको शोधनक्षमता मापदण्ड हो।",
        practicalApplications: {
          "regulatorySupervisionNe": "NRB को बैंक सुपरिवेक्षण विभागले मासिक रूपमा CAR अनुगमन गर्दछ। CAR नपुगेमा बैंकमाथि तत्काल कारबाही हुन्छ।",
          "creditRiskApprovalNe": "बैंकले नयाँ ठूला कर्जा प्रवाह गर्न पाउँछ वा पाउँदैन भन्ने निर्णय उसको CAR मा बाँकी रहेको पुँजीगत मार्जिन (Capital Buffer) ले तय गर्दछ।",
          "investorPerceptionNe": "लगानीकर्ताका लागि CAR ले बैंक सुरक्षित छ कि छैन र भविष्यमा हकप्रद शेयर (Right Shares) जारी गर्नुपर्ने हो कि होइन भनी पूर्वानुमान गर्न मद्दत गर्दछ।"
},
        regulatoryFramework: {
          "directiveNumberNe": "NRB एकीकृत निर्देशन नं. १ (पुँजी कोष सम्बन्धी व्यवस्था - Basel III)",
          "mandatoryThresholdNe": "कुल पुँजी कोष (Total CAR) न्यूनतम ११.००% र प्राथमिक पुँजी (Tier 1) न्यूनतम ८.५०% (२.५% Capital Conservation Buffer सहित)।",
          "nonCompliancePenaltyNe": "CAR ११% भन्दा तल झरेमा शीघ्र सुधारात्मक कारबाही (Prompt Corrective Action - PCA) लागू भई नगद तथा बोनस लाभांश वितरणमा पूर्ण रोक, कर्जा विस्तारमा रोक र सञ्चालक समिति विघटन सम्म हुन सक्ने।"
},
        windowDressingRisks: {
          "manipulationTechniquesNe": [
                    "कर्जालाई कम जोखिम भार (Risk Weight) भएको समूहमा गलत वर्गीकरण गरी कुल जोखिम भारित सम्पत्ति (RWA) घटाउनु।",
                    "अन्तिम दिन सहायक कम्पनीलाई कर्जा दिएर शेयर पुँजीमा लगानी गराई प्राथमिक पुँजी फुलाउनु (Evergreening of Capital)।"
          ],
          "auditorDetectionGuideNe": [
                    "RWA गणना गर्दा NRB निर्देशन नं. १ को अनुसूची अनुसार सम्पूर्ण कर्जा र वासलात बाहिरका कारोबार (OBS) को जोखिम भार शतप्रतिशत रुजु गर्ने।"
          ]
}
      },
      {
        id: 'cd-ratio',
        nameNe: 'कर्जा-निक्षेप अनुपात',
        nameEn: 'Credit to Deposit (CD) Ratio',
        category: 'Regulatory',
        formulaLatex: '$\\text{CD Ratio} = \\frac{\\text{Total Domestic Credit}}{\\text{Total Domestic Deposit}} \\times 100\\%$',
        numeratorNe: 'कुल स्थानीय कर्जा तथा सापट (Total Local Currency Loans)',
        denominatorNe: 'कुल स्थानीय निक्षेप (Total Local Currency Deposits)',
        multiplier: '100%',
        standardBenchmark: 'अधिकतम ९०.०% (NRB Unified Directive No. 2)',
        significanceNe: 'बैंकको तरलता नियन्त्रण गर्न र अत्यधिक आक्रामक कर्जा विस्तार रोक्न राष्ट्र बैंकले तोकेको अनिवार्य सीमा हो।',
        conceptAndPurposeNe: 'बैंकले जनताबाट संकलन गरेको निक्षेपभन्दा बढी वा अत्यधिक मात्रामा कर्जा लगानी गर्दा तरलता संकट (Liquidity Crunch) नहोस् भन्नका लागि संकलित प्रत्येक १०० रुपैयाँ निक्षेपमा अधिकतम ९० रुपैयाँसम्म मात्र ऋण लगानी गर्न दिने व्यवस्था हो। बाँकी १० रुपैयाँ तरलता कुसनको रूपमा रहन्छ।',
        bankingApplicationNe: 'बैंकको दैनिक ट्रेजरी व्यवस्थापन र कर्जा प्रवाह गर्ने वा रोक्ने निर्णय CD Ratio को दैनिक स्थितिका आधारमा गरिन्छ।',
        nrbDirectiveNormsNe: 'NRB एकीकृत निर्देशन नं. २ अनुसार बैंक तथा वित्तीय संस्थाले दैनिक रूपमा CD Ratio अधिकतम ९०% भित्र राख्नुपर्छ। ९०% नाघेमा राष्ट्र बैंकले हर्जाना (Penal Interest) लगाउने र कर्जा प्रवाह रोक्का गर्ने कानुनी व्यवस्था छ।',
        numericalExample: {
          scenarioTitleNe: 'कुमारी बैंक लिमिटेडको दैनिक तरलता र कर्जा स्थिति:',
          bankNameNe: 'कुमारी बैंक लि.',
          fiscalYearNe: 'आव २०८०/८१ (दैनिक रिपोर्टिङ)',
          givenData: [
            { labelNe: 'कुल स्थानीय निक्षेप (Domestic Deposits)', valueFormatted: 'रु. २०० अर्ब' },
            { labelNe: 'कुल स्थानीय कर्जा प्रवाह (Domestic Credit)', valueFormatted: 'रु. १७० अर्ब' }
          ],
          steps: [
            {
              stepNumber: 1,
              stepTitleNe: 'CD Ratio सूत्र प्रयोग',
              formulaOrWorkingLatex: '\\text{CD Ratio} = \\frac{\\text{Total Credit}}{\\text{Total Deposit}} \\times 100\\%',
              explanationNe: 'कुल कर्जालाई कुल निक्षेपले भाग गर्ने।'
            },
            {
              stepNumber: 2,
              stepTitleNe: 'मान प्रतिस्थापन र गणना',
              formulaOrWorkingLatex: '\\text{CD Ratio} = \\frac{170\\text{ अर्ब}}{200\\text{ अर्ब}} \\times 100\\% = 85.0\\%',
              explanationNe: '१७० लाई २०० ले भाग गर्दा ०.८५ आउँछ, अर्थात् ८५%।'
            },
            {
              stepNumber: 3,
              stepTitleNe: 'थप कर्जा लगानी गर्न सक्ने क्षमता (Headroom) गणना',
              formulaOrWorkingLatex: '\\text{Max Permissible Credit} = 200 \\times 90\\% = 180\\text{ अर्ब}; \\quad \\text{Headroom} = 180 - 170 = 10\\text{ अर्ब}',
              explanationNe: 'बैंकले ९०% को सीमा ननाघी अझै रु. १० अर्ब सम्म थप कर्जा विस्तार गर्न सक्दछ।'
            }
          ],
          resultValueLatex: '85.0\% \\quad (\\text{Headroom: रु. १० अर्ब})',
          interpretationNe: 'बैंकको CD Ratio ८५% छ, जुन NRB को ९०% को अधिकतम सीमाभित्र पूर्ण रूपमा सुरक्षित छ र बैंकसँग रु. १० अर्ब नयाँ कर्जा लगानी गर्ने क्षमता बाँकी छ।'
        },
        strategicLimitationsNe: 'बैंकले निक्षेप बढाउन अल्पकालीन महँगो संस्थागत निक्षेप (Institutional FD) भित्र्याएर कृत्रिम रूपमा CD Ratio घटाउने जोखिम रहन्छ।',
        deepConceptualRationaleNe: "कर्जा-निक्षेप अनुपात (CD Ratio) ले बैंकले संकलन गरेको कुल स्थानीय निक्षेप र प्राथमिक पुँजीको कति हिस्सा कर्जा लगानीमा परिचालन गरेको छ भनी देखाउँछ। पहिले प्रयोग हुने CCD Ratio लाई प्रतिस्थापन गरी राष्ट्र बैंकले अन्तर्राष्ट्रिय अभ्यास अनुसार CD Ratio लागू गरेको हो। यसले अनियन्त्रित कर्जा विस्तार नियन्त्रण गरी प्रणालीगत तरलता जोखिम रोक्दछ।",
        practicalApplications: {
          "regulatorySupervisionNe": "NRB ले दैनिक रूपमा सबै बैंकहरूको CD Ratio अनलाइन प्रणालीबाट अनुगमन गर्दछ, जसले वित्तीय प्रणालीमा तरलता अभाव हुन दिँदैन।",
          "creditRiskApprovalNe": "यदि बैंकको CD Ratio ८९.५% पुगिसकेको छ भने बैंकले नयाँ कर्जा स्वीकृति तत्काल स्थगित गर्नुपर्ने बाध्यता हुन्छ।",
          "investorPerceptionNe": "CD Ratio ८५% भन्दा कम भएका बैंकहरूसँग कर्जा विस्तार गर्ने र थप नाफा कमाउने प्रशस्त ठाउँ हुने हुँदा बजारले तिनलाई सकारात्मक रूपमा लिन्छ।"
},
        regulatoryFramework: {
          "directiveNumberNe": "NRB एकीकृत निर्देशन नं. २ (कर्जा निक्षेप अनुपात सम्बन्धी व्यवस्था)",
          "mandatoryThresholdNe": "अधिकतम ९०.००% (Ceiling of 90.00%)।",
          "nonCompliancePenaltyNe": "९०% नाघेको अवस्थामा नपुग निक्षेप वा अधिक कर्जा रकममा प्रचलित बैंक दरमा दैनिक जरिवाना (Penal Interest) लाग्ने र कर्जा प्रवाह रोक्नुपर्ने।"
},
        windowDressingRisks: {
          "manipulationTechniquesNe": [
                    "मसान्तका दिन ठूला संस्थागत निक्षेपकर्ताबाट उच्च ब्याजमा केही दिनका लागि निक्षेप भित्र्याएर निक्षेपको आकार कृत्रिम रूपमा बढाउनु।",
                    "कर्जा रकमलाई अस्थायी रूपमा अन्य बैंकमा स्थानान्तरण वा रिकभरी भएको देखाउनु।"
          ],
          "auditorDetectionGuideNe": [
                    "दैनिक औसत CD Ratio (Daily Average) र शीर्ष ५० निक्षेपकर्ताहरूको मसान्त अघि र पछिको मौज्दात उतारचढाव जाँच्नुपर्छ।"
          ]
}
      },
      {
        id: 'npl-ratio',
        nameNe: 'निष्क्रिय कर्जा अनुपात',
        nameEn: 'Non-Performing Loan (NPL) Ratio',
        category: 'Regulatory',
        formulaLatex: '$\\text{NPL Ratio} = \\frac{\\text{Total Gross Non-Performing Loans}}{\\text{Total Gross Loans and Advances}} \\times 100\\%$',
        numeratorNe: 'कुल निष्क्रिय कर्जा (कमसल Substandard + शंकास्पद Doubtful + खराब Bad Loans)',
        denominatorNe: 'कुल कर्जा तथा सापट (Total Gross Loans and Advances)',
        multiplier: '100%',
        standardBenchmark: 'अधिकतम ५.०% भन्दा कम (अन्तर्राष्ट्रिय मापदण्ड: २-३% भित्र)',
        significanceNe: 'बैंकको कर्जा पोर्टफोलियोको गुणस्तर, असुली कार्यक्षमता र सम्भावित कर्जा जोखिमको अवस्था मापन गर्दछ।',
        conceptAndPurposeNe: 'सावाँ वा ब्याज भुक्तानी भाखा नाघेको ९० दिनभन्दा बढी भएका कर्जाहरूलाई निष्क्रिय कर्जा भनिन्छ। NPL बढ्नु भनेको बैंकको आम्दानी रोकिनु, कर्जा नोक्सानी व्यवस्था (Loan Loss Provision) मा नाफा खर्च हुनु र पुँजी क्षय हुनु हो।',
        bankingApplicationNe: 'केन्द्रीय बैंकले CAMELS रेटिङको "Asset Quality (A)" मा NPL Ratio लाई मुख्य आधार मान्दछ। ५% भन्दा बढी NPL भएका बैंकलाई नगद लाभांश वितरणमा प्रतिबन्ध लगाइन्छ।',
        nrbDirectiveNormsNe: 'NRB एकीकृत निर्देशन नं. २ अनुसार कर्जा वर्गीकरण: १. असल (०-१ महिना: १.२०% LLP), २. सूक्ष्म निगरानी (१-३ महिना: ५% LLP), ३. कमसल (३-६ महिना: २५% LLP), ४. शंकास्पद (६-१२ महिना: ५०% LLP), ५. खराब (१ वर्षभन्दा बढी: १००% LLP)। ३, ४ र ५ नम्बरका कर्जा NPL हुन्।',
        numericalExample: {
          scenarioTitleNe: 'नेपाल इन्भेष्टमेन्ट मेगा बैंकको त्रैमासिक वित्तीय विवरण अनुसार:',
          bankNameNe: 'नेपाल इन्भेष्टमेन्ट मेगा बैंक लि.',
          fiscalYearNe: 'आव २०८०/८१',
          givenData: [
            { labelNe: 'कुल कर्जा तथा सापट (Total Gross Loans)', valueFormatted: 'रु. ३०० अर्ब' },
            { labelNe: 'कमसल कर्जा (Substandard)', valueFormatted: 'रु. ४ अर्ब' },
            { labelNe: 'शंकास्पद कर्जा (Doubtful)', valueFormatted: 'रु. ३ अर्ब' },
            { labelNe: 'खराब कर्जा (Bad Loans)', valueFormatted: 'रु. २ अर्ब' }
          ],
          steps: [
            {
              stepNumber: 1,
              stepTitleNe: 'कुल निष्क्रिय कर्जा (Total NPL) गणना',
              formulaOrWorkingLatex: '\\text{Total NPL} = 4 + 3 + 2 = 9\\text{ अर्ब}',
              explanationNe: 'कमसल, शंकास्पद र खराब कर्जा जोड्दा कुल NPL रु. ९ अर्ब हुन्छ।'
            },
            {
              stepNumber: 2,
              stepTitleNe: 'NPL अनुपात सूत्रमा प्रतिस्थापन',
              formulaOrWorkingLatex: '\\text{NPL Ratio} = \\frac{9\\text{ अर्ब}}{300\\text{ अर्ब}} \\times 100\\% = 3.00\\%',
              explanationNe: '९ लाई ३०० ले भाग गरी १०० ले गुणन गर्दा ३.००% आउँछ।'
            }
          ],
          resultValueLatex: '3.00\%',
          interpretationNe: 'बैंकको निष्क्रिय कर्जा अनुपात ३.००% रहेको छ। यो नेपाल राष्ट्र बैंकको अधिकतम ५% को सीमाभन्दा धेरै तल सुरक्षित छ र बैंकको कर्जा असुली प्रभावकारी रहेको देखाउँछ।'
        },
        strategicLimitationsNe: 'बैंकहरूले समयमै असुली नभएको कर्जालाई एभरग्रिनिङ (Evergreening) वा पुनर्संरचना (Restructuring) गरेर कानुनी छिद्रमार्फत NPL कृत्रिम रूपमा कम देखाउने खतरा रहन्छ।',
        deepConceptualRationaleNe: "खराब कर्जा अनुपात (NPL / NPA Ratio) ले बैंकले प्रवाह गरेको कुल कर्जा लगानीमध्ये कति प्रतिशत कर्जाको साँवा-ब्याज भाखा नाघेको छ (भाखा नाघेको ९० दिन भन्दा बढी) भनी मापन गर्दछ। यो बैंकको सम्पत्ति गुणस्तर (Asset Quality) को सबैभन्दा संवेदनशील र प्राथमिक सूचक हो। NPL बढ्दा नाफा र पुँजी कोष दुवैमा प्रत्यक्ष प्रहार हुन्छ।",
        practicalApplications: {
          "regulatorySupervisionNe": "NRB को बैंक सुपरिवेक्षणको CAMELS ढाँचामा \"A\" (Asset Quality) निर्धारण गर्न NPL प्रमुख आधार हो।",
          "creditRiskApprovalNe": "उच्च NPL भएका शाखाहरू र कर्जा अधिकृतहरूको कर्जा स्वीकृति सीमा (Lending Authority) कटौती गरिन्छ।",
          "investorPerceptionNe": "NPL ५% नाघेका बैंकहरूलाई नेप्सेमा जोखिमयुक्त मानिन्छ किनभने प्रोभिजनिङ बढेर लाभांश क्षमता शून्य हुन सक्छ।"
},
        regulatoryFramework: {
          "directiveNumberNe": "NRB एकीकृत निर्देशन नं. २ (कर्जा वर्गीकरण तथा नोक्सानी व्यवस्था)",
          "mandatoryThresholdNe": "अन्तर्राष्ट्रिय तथा NRB मानक अनुसार अधिकतम ५.००% भन्दा कम (Ideal: < ३%)।",
          "nonCompliancePenaltyNe": "NPL ५% नाघेमा राष्ट्र बैंकले बैंकलाई समस्याग्रस्त (Problem Bank) घोषणा गर्न सक्ने, लाभांश रोक्ने, र नयाँ कर्जा लगानीमा प्रतिबन्ध लगाउने।"
},
        windowDressingRisks: {
          "manipulationTechniquesNe": [
                    "सदाबहार कर्जा (Evergreening): खराब ऋणीलाई नयाँ कर्जा स्वीकृत गरी पुरानो कर्जाको साँवा-ब्याज भुक्तानी गराएर कर्जा असल देखाउनु।",
                    "ऋणीको मन्जुरी बिना कर्जा पुनर्संरचना वा पुनर्तालिकीकरण (Restructuring/Rescheduling) गरी NPL लुकाउनु।"
          ],
          "auditorDetectionGuideNe": [
                    "कर्जा चुक्ता भएको स्रोत (Source of Fund) परीक्षण गर्ने र कर्जा चुक्ता भएको दिन नै सोही ऋणी वा सम्बद्ध व्यक्तिलाई नयाँ कर्जा प्रवाह भएको छ कि छैन भनी रुजु गर्ने।"
          ]
}
      },
      {
        id: 'crr',
        nameNe: 'अनिवार्य नगद मौज्दात',
        nameEn: 'Cash Reserve Ratio (CRR)',
        category: 'Regulatory',
        formulaLatex: '$\\text{CRR} = \\frac{\\text{Cash Reserves Maintained with NRB}}{\\text{Total Domestic Deposit Liabilities}} \\times 100\\%$',
        numeratorNe: 'नेपाल राष्ट्र बैंकमा रहेको चालु खाता मौज्दात (Reserves with NRB)',
        denominatorNe: 'कुल स्थानीय निक्षेप दायित्व (Domestic Deposits)',
        multiplier: '100%',
        standardBenchmark: '४.०% (वाणिज्य, विकास बैंक र वित्त कम्पनी सबैका लागि)',
        significanceNe: 'मुद्रा प्रदाय (Money Supply) नियन्त्रण गर्न र बैंकहरूको तरलता सुनिश्चित गर्न केन्द्रीय बैंकमा अनिवार्य राख्नुपर्ने ब्याजविहीन नगद मौज्दात हो।',
        conceptAndPurposeNe: 'CRR केन्द्रीय बैंकको मौद्रिक नीतिको प्रत्यक्ष परिमाणात्मक उपकरण (Quantitative Monetary Tool) हो। यसले बैंकहरूलाई कर्जा विस्तार गर्नबाट निश्चित प्रतिशत नगद केन्द्रीय बैंकमा रोक्का राख्न बाध्य पार्दछ।',
        bankingApplicationNe: 'बैंकको ट्रेजरी अफिसरले दैनिक रूपमा NRB सँगको मौज्दात मिलाई CRR घाटा (Shortfall) हुन नदिने रणनीति बनाउँछन्।',
        nrbDirectiveNormsNe: 'NRB को मौद्रिक नीति अनुसार सबै वर्गका बैंक तथा वित्तीय संस्थाहरूले कुल निक्षेपको ४% CRR अनिवार्य रूपमा राष्ट्र बैंकमा राख्नुपर्छ। कमी भएमा बैंकदर (Bank Rate) अनुसार जरिवाना लाग्छ।',
        numericalExample: {
          scenarioTitleNe: 'सिद्धार्थ बैंक लिमिटेडको पाक्षिक (१४ दिने) निक्षेप र NRB मौज्दात स्थिति:',
          bankNameNe: 'सिद्धार्थ बैंक लि.',
          fiscalYearNe: 'आव २०८०/८१ (मौद्रिक रिपोर्टिङ)',
          givenData: [
            { labelNe: 'कुल स्थानीय निक्षेप दायित्व', valueFormatted: 'रु. १५० अर्ब' },
            { labelNe: 'NRB मा रहेको वास्तविक मौज्दात', valueFormatted: 'रु. ६.३० अर्ब' }
          ],
          steps: [
            {
              stepNumber: 1,
              stepTitleNe: 'अनिवार्य न्यूनतम मौज्दात (Required CRR Amount) निकाल्ने',
              formulaOrWorkingLatex: '\\text{Required CRR} = 150\\text{ अर्ब} \\times 4\\% = 6.00\\text{ अर्ब}',
              explanationNe: '१५० अर्बको ४% ले हुन आउने रु. ६.०० अर्ब न्यूनतम राष्ट्र बैंकमा हुनुपर्दछ।'
            },
            {
              stepNumber: 2,
              stepTitleNe: 'वास्तविक CRR प्रतिशत गणना',
              formulaOrWorkingLatex: '\\text{Actual CRR} = \\frac{6.30\\text{ अर्ब}}{150\\text{ अर्ब}} \\times 100\\% = 4.20\\%',
              explanationNe: '६.३० लाई १५० ले भाग गर्दा ४.२०% कायम भयो।'
            }
          ],
          resultValueLatex: '4.20\% \\quad (\\text{Required: 4.0\%})',
          interpretationNe: 'बैंकले ४% को अनिवार्य सीमाको तुलनामा ४.२०% मौज्दात राष्ट्र बैंकमा राखेको छ, जसले गर्दा बैंक कुनै पनि जरिवानाबाट मुक्त छ र थप रु. ३० करोड तरलता बफर उपलब्ध छ।'
        },
        strategicLimitationsNe: 'राष्ट्र बैंकले CRR मा कुनै ब्याज नदिने भएकाले अत्यधिक रकम CRR मा थुप्रिँदा बैंकको नाफा आर्जन क्षमतामा प्रतिकूल असर पर्दछ।',
        deepConceptualRationaleNe: "अनिवार्य नगद मौज्दात (CRR) भन्नाले वाणिज्य बैंकहरूले आफूले संकलन गरेको कुल निक्षेप दायित्वको निश्चित प्रतिशत रकम केन्द्रीय बैंक (नेपाल राष्ट्र बैंक) मा विना ब्याज नगदै मौज्दातको रूपमा अनिवार्य जम्मा गर्नुपर्ने अनुपात हो। यो केन्द्रीय बैंकको सबैभन्दा शक्तिशाली परिमाणात्मक मौद्रिक उपकरण (Quantitative Monetary Tool) हो।",
        practicalApplications: {
          "regulatorySupervisionNe": "NRB को मौद्रिक व्यवस्थापन विभागले पाक्षिक (Fortnightly) आधारमा प्रत्येक बैंकको खातामा CRR रकम रुजु गर्दछ।",
          "creditRiskApprovalNe": "बैंकिङ प्रणालीमा तरलता अधिक हुँदा वा अभाव हुँदा बैंकहरूको नयाँ कर्जा लगानी गर्ने क्षमता CRR बाट प्रत्यक्ष प्रभावित हुन्छ।",
          "investorPerceptionNe": "मौद्रिक नीतिमा CRR घटाउँदा बजारमा तरलता बढ्ने र शेयर बजार उकासिने, तथा CRR बढाउँदा तरलता संकुचन हुने हुँदा लगानीकर्ताले यसलाई सूक्ष्म रूपमा हेर्छन्।"
},
        regulatoryFramework: {
          "directiveNumberNe": "NRB ऐन २०५८ दफा ७९ तथा एकीकृत निर्देशन नं. ५",
          "mandatoryThresholdNe": "क, ख र ग वर्गका बैंक तथा वित्तीय संस्थाहरूका लागि समान ४.००% अनिवार्य।",
          "nonCompliancePenaltyNe": "दैनिक वा पाक्षिक रूपमा CRR नपुगेमा अपुग रकममा बैंक दर (६.५०%) अनुसार दैनिक जरिवाना तिर्नुपर्ने।"
},
        windowDressingRisks: {
          "manipulationTechniquesNe": [
                    "मसान्तको गणना मितिमा निक्षेप दायित्व कृत्रिम रूपमा घटाएर देखाउने (Clearing Pending Transfers)।",
                    "अन्तरबैंक कल मनीबाट मसान्तको दिन मात्र मौज्दात देखाउने।"
          ],
          "auditorDetectionGuideNe": [
                    "पाक्षिक औसत मौज्दात (Fortnightly Average Balance) र NRB ले जारी गर्ने दैनिक CRR स्टेटमेन्ट रुजु गर्नुपर्छ।"
          ]
}
      },
      {
        id: 'slr',
        nameNe: 'वैधानिक तरलता अनुपात',
        nameEn: 'Statutory Liquidity Ratio (SLR)',
        category: 'Regulatory',
        formulaLatex: '$\\text{SLR} = \\frac{\\text{Liquid Assets (Cash + Bank + Govt Securities)}}{\\text{Total Domestic Deposit Liabilities}} \\times 100\\%$',
        numeratorNe: 'तरल सम्पत्ति (नगद + NRB मौज्दात + सरकारी ऋणपत्र/ट्रेजरी बिल)',
        denominatorNe: 'कुल स्थानीय निक्षेप दायित्व',
        multiplier: '100%',
        standardBenchmark: '"क" वर्गका वाणिज्य बैंक: १२.०%, "ख" र "ग" वर्ग: १०.०%',
        significanceNe: 'बैंकहरूले आकस्मिक निक्षेप फिर्ता माग धान्न र सरकारी ऋणपत्रमा लगानी सुरक्षित राख्न कायम गर्नुपर्ने वैधानिक तरलता सीमा हो।',
        conceptAndPurposeNe: 'SLR ले बैंकको पैसा सरकारी विकास ऋणपत्र र ट्रेजरी बिलमा लगानी गराई सरकारको आन्तरिक ऋण उठाउन सहयोग पुर्‍याउँछ र निक्षेपकर्ताको निक्षेपलाई शतप्रतिशत सुरक्षित तरल धितोमा बाँध्छ।',
        bankingApplicationNe: 'ट्रेजरी विभागले सरकारी सेक्युरिटिज खरिद गर्दा र रिपो (Repo) मार्फत तरलता खिच्दा SLR को गणना गर्दछ।',
        nrbDirectiveNormsNe: 'NRB मौद्रिक नीति २०८०/८१ अनुसार "क" वर्गका वाणिज्य बैंकले १२% र विकास बैंक तथा वित्त कम्पनीले १०% SLR कायम गर्नुपर्दछ।',
        numericalExample: {
          scenarioTitleNe: 'सिटिजन्स बैंक इन्टरनेसनलको मासिक तरलता विवरण:',
          bankNameNe: 'सिटिजन्स बैंक इन्टरनेसनल लि.',
          fiscalYearNe: 'आव २०८०/८१',
          givenData: [
            { labelNe: 'कुल स्थानीय निक्षेप', valueFormatted: 'रु. १८० अर्ब' },
            { labelNe: 'नगद तथा बैंक मौज्दात (CRR सहित)', valueFormatted: 'रु. ९ अर्ब' },
            { labelNe: 'सरकारी ऋणपत्र (Govt Securities)', valueFormatted: 'रु. १५ अर्ब' }
          ],
          steps: [
            {
              stepNumber: 1,
              stepTitleNe: 'कुल वैधानिक तरल सम्पत्ति गणना',
              formulaOrWorkingLatex: '\\text{Total Liquid Assets} = 9 + 15 = 24\\text{ अर्ब}',
              explanationNe: 'नगद तथा सरकारी सेक्युरिटिज जोडेर रु. २४ अर्ब कायम भयो।'
            },
            {
              stepNumber: 2,
              stepTitleNe: 'SLR सूत्रमा प्रतिस्थापन',
              formulaOrWorkingLatex: '\\text{SLR} = \\frac{24\\text{ अर्ब}}{180\\text{ अर्ब}} \\times 100\\% = 13.33\\%',
              explanationNe: '२४ लाई १८० ले भाग गरी १०० ले गुणन गर्दा १३.३३% प्राप्त भयो।'
            }
          ],
          resultValueLatex: '13.33\% \\quad (\\text{Required: 12.0\%})',
          interpretationNe: 'बैंकको SLR १३.३३% छ, जुन NRB को न्यूनतम १२% को मापदण्डभन्दा १.३३% विन्दुले बढी छ। बैंकसँग संकटको बेला तुरुन्त बिक्री गर्न सकिने पर्याप्त सरकारी ऋणपत्र उपलब्ध छ।'
        },
        strategicLimitationsNe: 'सरकारी ऋणपत्रमा ब्याजदर निकै कम हुँदा उच्च SLR ले बैंकको समग्र औसत प्रतिफल (Yield) घटाउन सक्छ।',
        deepConceptualRationaleNe: "वैधानिक तरलता अनुपात (SLR) भन्नाले बैंक तथा वित्तीय संस्थाले आफ्ना निक्षेपकर्ताहरूको आकस्मिक भुक्तानी दायित्व पूरा गर्न आफ्नो कुल निक्षेपको निश्चित प्रतिशत रकम सरकारी ऋणपत्र (Treasury Bills / Development Bonds) र नगद मौज्दातमा लगानी गरी तरल रूपमा राख्नुपर्ने अनिवार्य अनुपात हो। यसले सरकारलाई आन्तरिक ऋण जुटाउन समेत मद्दत गर्दछ।",
        practicalApplications: {
          "regulatorySupervisionNe": "NRB सुपरिवेक्षण विभागले बैंकको तरलता जोखिम र सरकारी सुरक्षणपत्रमा लगानीको वैधानिकता जाँच्न SLR अनुगमन गर्दछ।",
          "creditRiskApprovalNe": "बैंकको कुल स्रोतमध्ये १२% SLR मा बाँधिने हुँदा बाँकी स्रोत मात्र कर्जा लगानीमा प्रयोग गर्न सकिन्छ।",
          "investorPerceptionNe": "SLR मजबुत भएका बैंकहरू प्रणालीगत सङ्कटमा पनि निक्षेप फिर्ता गर्न पूर्ण सक्षम हुन्छन् भन्ने विश्वास लगानीकर्तामा रहन्छ।"
},
        regulatoryFramework: {
          "directiveNumberNe": "NRB एकीकृत निर्देशन नं. ५ (वैधानिक तरलता सम्बन्धी व्यवस्था)",
          "mandatoryThresholdNe": "क वर्ग (वाणिज्य बैंक): १२.००%, ख वर्ग (विकास बैंक) र ग वर्ग (वित्त कम्पनी): १०.००%।",
          "nonCompliancePenaltyNe": "SLR नपुगेमा अपुग रकममा प्रचलित बैंक दरमा राष्ट्र बैंकले जरिवाना लगाउने।"
},
        windowDressingRisks: {
          "manipulationTechniquesNe": [
                    "धितो बन्धक राखिएका वा रोक्का रहेका सरकारी सुरक्षणपत्रलाई पनि खुला तरल सम्पत्तिमा गणना गर्नु।",
                    "अन्य बैंकमा रहेको निक्षेपलाई परस्पर दोहोरो गणना (Double Counting) गर्नु।"
          ],
          "auditorDetectionGuideNe": [
                    "सरकारी सुरक्षणपत्रको अन-इन्कम्बर्ड (Unencumbered / Lien Free) प्रमाणपत्र र राष्ट्र बैंकको अभिलेख भिडाउनुपर्छ।"
          ]
}
      },

      // =====================================================================
      // 4. SOLVENCY & LEVERAGE RATIOS (शोधनक्षमता तथा लिभरेज अनुपातहरू)
      // =====================================================================
      {
        id: 'debt-equity-ratio',
        nameNe: 'ऋण-इक्विटी अनुपात',
        nameEn: 'Debt-to-Equity Ratio (D/E)',
        category: 'Solvency',
        formulaLatex: '$$\\text{Debt to Equity Ratio} = \\frac{\\text{Total Long-Term Debt}}{\\text{Shareholders Equity}}$$',
        numeratorNe: 'कुल दीर्घकालीन ऋण (ऋणपत्र Debentures + दीर्घकालीन सापटी)',
        denominatorNe: 'कुल सेयरधनी कोष (इक्विटी पुँजी + जगेडा कोष)',
        standardBenchmark: '१ : १ देखि २ : १ (उत्पादनमूलक उद्योगमा २:१, व्यापारमा १:१)',
        significanceNe: 'संस्थामा साहुको बाह्य ऋण र मालिकको आफ्नै पुँजीको दाँजो देखाउँछ; यसले संस्थाको वित्तीय जोखिम (Financial Risk) मापन गर्दछ।',
        conceptAndPurposeNe: 'उच्च D/E अनुपात भएको कम्पनीलाई "Highly Leveraged" भनिन्छ। यस्ता कम्पनीले मन्दीको समयमा ब्याज तिर्न नसकेर टाट पल्टिने खतरा रहन्छ।',
        bankingApplicationNe: 'बैंकहरूले ठूला परियोजना कर्जा (Consortium Loan) तथा हाइड्रोपावर कर्जा प्रवाह गर्दा सामान्यतया ७०:३० (२.३३:१) वा ८०:२० सम्मको D/E सीमा तोक्दछन्।',
        nrbDirectiveNormsNe: 'NRB को ठूला कर्जा सम्बन्धी निर्देशन अनुसार ऋणीको D/E अनुपात तोकिएको वित्तीय सीमाभित्र हुनुपर्छ।',
        numericalExample: {
          scenarioTitleNe: 'माथिल्लो तामाकोशी हाइड्रोपावर मोडलमा आधारित परियोजनाको वित्तीय विवरण:',
          bankNameNe: 'कन्सोर्टियम लिड बैंक (ऋण मूल्याङ्कन)',
          fiscalYearNe: 'आव २०८०/८१',
          givenData: [
            { labelNe: 'कुल दीर्घकालीन ऋण (बैंक कर्जा + ऋणपत्र)', valueFormatted: 'रु. १४ अर्ब' },
            { labelNe: 'प्रवर्द्धक तथा सेयरधनी पुँजी (Equity)', valueFormatted: 'रु. ६ अर्ब' }
          ],
          steps: [
            {
              stepNumber: 1,
              stepTitleNe: 'D/E अनुपात सूत्र प्रयोग',
              formulaOrWorkingLatex: '\\text{Debt to Equity} = \\frac{\\text{Total Long-Term Debt}}{\\text{Shareholders Equity}}',
              explanationNe: 'कुल ऋणलाई कुल इक्विटीले भाग गर्ने।'
            },
            {
              stepNumber: 2,
              stepTitleNe: 'मान प्रतिस्थापन र गणना',
              formulaOrWorkingLatex: '\\text{D/E Ratio} = \\frac{14\\text{ अर्ब}}{6\\text{ अर्ब}} = 2.33 : 1 \\quad (70 : 30)',
              explanationNe: '१४ लाई ६ ले भाग गर्दा २.३३ अनुपात आउँछ।'
            }
          ],
          resultValueLatex: '2.33 : 1 \\quad (70\\% \\text{ Debt} : 30\\% \\text{ Equity})',
          interpretationNe: 'परियोजनामा ७०% ऋण र ३०% पुँजी लगानी भएको छ, जुन जलविद्युत क्षेत्रको प्रचलित ७०:३० को मापदण्ड अनुसार पूर्ण रूपमा स्वीकृतियोग्य छ।'
        },
        strategicLimitationsNe: 'बैंकहरूको हकमा निक्षेप बाह्य दायित्व भए तापनि D/E भन्दा पुँजी पर्याप्तता अनुपात (CAR) बढी सान्दर्भिक मानिन्छ।',
        deepConceptualRationaleNe: 'ऋण-इक्विटी अनुपात (D/E Ratio) ले संस्थाको पुँजी संरचनामा बाह्य ऋण र शेयरधनीको आन्तरिक इक्विटी बीचको अनुपात देखाउँछ। यसले संस्था कत्तिको वित्तीय लिभरेज (Financial Leverage) मा चलेको छ र ऋणदाताहरूको सुरक्षा कति छ भनी दीर्घकालीन शोधनक्षमता मापन गर्दछ।',
        practicalApplications: {
          regulatorySupervisionNe: 'गैर-बैंकिङ ऋणी कम्पनीहरूको वित्तीय जोखिम मूल्याङ्कन गर्न NRB को कर्जा निर्देशन अनुसार प्रयोग हुन्छ।',
          creditRiskApprovalNe: 'बैंकले ठूला परियोजना (हाइड्रोपावर, सिमेन्ट) कर्जा स्वीकृत गर्दा सामान्यतया ७०:३० वा अधिकतम ८०:२० (D/E २.३३ : १ देखि ४ : १) को सीमा तोक्दछ।',
          investorPerceptionNe: 'अत्यधिक D/E अनुपात भएका कम्पनीहरू ब्याजदर बढ्दा तुरुन्त घाटामा जाने हुँदा रूढीवादी लगानीकर्ताहरू कम D/E भएका कम्पनी रोज्दछन्।'
        },
        regulatoryFramework: {
          directiveNumberNe: 'NRB एकीकृत निर्देशन नं. २ (कन्सोर्टियम र परियोजना कर्जा मापदण्ड)',
          mandatoryThresholdNe: 'उत्पादनमूलक उद्योगमा २:१ देखि ३:१, पूर्वाधार/जलविद्युत आयोजनामा अधिकतम ४:१ सम्म।',
          nonCompliancePenaltyNe: 'ऋणीको D/E सीमा नाघेमा बैंकले अतिरिक्त ब्याज (Penal Charge) लगाउनुपर्ने र जोखिम व्यवस्था बढाउनुपर्ने।'
        },
        windowDressingRisks: {
          manipulationTechniquesNe: [
            'सञ्चालकहरूको ऋण (Directors Loan) लाई गैरकानुनी रूपमा इक्विटीमा देखाएर ऋण घटाउनु।',
            'सहायक कम्पनीको नाममा ऋण लिएर मूल कम्पनीको ब्यालेन्स सिटमा नदेखाउनु (Off-Balance Sheet Borrowing)।'
          ],
          auditorDetectionGuideNe: [
            'समूह कम्पनीहरूको एकीकृत वित्तीय विवरण (Consolidated Statements) र कर्जा सूचना केन्द्र (CIC) को रिपोर्ट विश्लेषण गर्नुपर्छ।'
          ]
        }
      },
      {
        id: 'interest-coverage-ratio',
        nameNe: 'ब्याज भुक्तानी क्षमता अनुपात',
        nameEn: 'Interest Coverage Ratio (ICR)',
        category: 'Solvency',
        formulaLatex: '$\\text{Interest Coverage Ratio} = \\frac{\\text{EBIT (Earnings Before Interest & Tax)}}{\\text{Interest Expense}}$',
        numeratorNe: 'ब्याज तथा कर अघिको आम्दानी (सञ्चालन नाफा EBIT)',
        denominatorNe: 'वार्षिक कुल ब्याज खर्च (Interest Expense)',
        multiplier: 'गुणा (Times)',
        standardBenchmark: '२.५ गुणाभन्दा बढी (उत्कृष्ट: ३.०+ गुणा)',
        significanceNe: 'संस्थाले आफ्नो सञ्चालन नाफाबाट ऋणको वार्षिक ब्याज कति पटकसम्म तिर्न सक्छ भन्ने देखाउँछ। १ भन्दा कम भएमा ब्याज तिर्न नसक्ने गम्भीर खतरा हुन्छ।',
        conceptAndPurposeNe: 'यदि कुनै कम्पनीको ICR १.० भन्दा कम छ भने, त्यसको अर्थ कम्पनीले कमाएको नाफाले बैंकको ब्याज तिर्न पनि पुग्दैन र कम्पनीले ब्याज तिर्न थप ऋण लिनुपर्छ वा सम्पत्ति बेच्नुपर्छ।',
        bankingApplicationNe: 'क्रेडिट रेटिङ एजेन्सीहरू (ICRA Nepal, Care Ratings Nepal) ले डिबेन्चर वा कर्जा रेटिङ गर्दा ICR लाई मुख्य आधार बनाउँछन्।',
        nrbDirectiveNormsNe: 'NRB ले जोखिमयुक्त ऋणीहरूको पहिचान गर्न र कर्जा पुनर्संरचना गर्दा ऋणीको आगामी ३ वर्षको ICR कम्तीमा १.५ गुणा पुग्ने सम्भावना हुनुपर्ने व्यवस्था गरेको छ।',
        numericalExample: {
          scenarioTitleNe: 'बुटवलस्थित एक सिमेन्ट उद्योगको नाफा-नोक्सान विवरण:',
          bankNameNe: 'प्रभु बैंक लि. (कर्जा अनुगमन)',
          fiscalYearNe: 'आव २०८०/८१',
          givenData: [
            { labelNe: 'सञ्चालन नाफा (EBIT)', valueFormatted: 'रु. ४५ करोड' },
            { labelNe: 'वार्षिक बैंक ब्याज खर्च (Interest Expense)', valueFormatted: 'रु. १५ करोड' }
          ],
          steps: [
            {
              stepNumber: 1,
              stepTitleNe: 'ICR सूत्रमा मान प्रतिस्थापन',
              formulaOrWorkingLatex: '\\text{ICR} = \\frac{\\text{EBIT}}{\\text{Interest Expense}} = \\frac{45\\text{ करोड}}{15\\text{ करोड}}',
              explanationNe: '४५ करोड EBIT लाई १५ करोड ब्याज खर्चले भाग गर्ने।'
            },
            {
              stepNumber: 2,
              stepTitleNe: 'गुणक गणना',
              formulaOrWorkingLatex: '\\text{ICR} = 3.00\\text{ गुणा (Times)}',
              explanationNe: 'सञ्चालन नाफा ब्याज खर्चभन्दा ३ गुणा बढी छ।'
            }
          ],
          resultValueLatex: '3.00 \\text{ गुणा (Times)}',
          interpretationNe: 'कम्पनीले आफ्नो ब्याज दायित्वभन्दा ३ गुणा बढी नाफा कमाएको छ। यसले कम्पनीको ऋण तिर्ने क्षमता अति सुरक्षित रहेको र कर्जा डिफल्ट हुने जोखिम न्यून रहेको देखाउँछ।'
        },
        strategicLimitationsNe: 'EBIT मा नगद नभएको आम्दानी (Accrued Revenue) समावेश हुन सक्ने भएकाले नगदमा आधारित DSCR (Debt Service Coverage Ratio) समेत विश्लेषण गर्नुपर्छ।',
        deepConceptualRationaleNe: "ब्याज कभरेज अनुपात (ICR) ले ऋणी कम्पनीले आफ्नो सञ्चालन नाफा (EBIT) बाट ऋणको ब्याज कति पटक तिर्न सक्छ भनी नाफाको सुरक्षा मार्जिन मापन गर्दछ। यदि ICR १ भन्दा कम भएमा कम्पनीले चालु नाफाबाट ब्याज समेत तिर्न सक्दैन र ऋण तिर्न थप ऋण लिनुपर्ने वा सम्पत्ति बेच्नुपर्ने दुष्चक्रमा फस्दछ।",
        practicalApplications: {
          "regulatorySupervisionNe": "कर्जाको गुणस्तर अनुगमन गर्न र कर्जालाई असल वर्गबाट सूक्ष्म निगरानी वा खराब वर्गमा वर्गीकरण गर्न NRB ले ICR परीक्षण गर्दछ।",
          "creditRiskApprovalNe": "कर्जा नवीकरण वा नयाँ कर्जा प्रस्तावमा ICR न्यूनतम १.५ देखि २.० पटक हुनु बैंकहरूको अनिवार्य सर्त रहन्छ।",
          "investorPerceptionNe": "ऋणपत्र (Debentures) वा शेयरमा लगानी गर्दा कम्पनी डिफल्ट हुने सम्भावना जाँच्न लगानीकर्ताहरूले ICR हेर्दछन्।"
},
        regulatoryFramework: {
          "directiveNumberNe": "NRB एकीकृत निर्देशन नं. २ (कर्जा जोखिम व्यवस्थापन)",
          "mandatoryThresholdNe": "न्यूनतम १.५० गुणा (१.५x भन्दा माथि सुरक्षित, २.०x भन्दा माथि उत्कृष्ट)।",
          "nonCompliancePenaltyNe": "लगातार २ वर्षसम्म ICR १ भन्दा कम भएमा बैंकले उक्त कर्जालाई अनिवार्य रूपमा वाचलिस्ट वा खराब कर्जामा वर्गीकरण गरी प्रोभिजनिङ बढाउनुपर्ने।"
},
        windowDressingRisks: {
          "manipulationTechniquesNe": [
                    "ब्याज खर्चलाई पुँजीकरण (Capitalization of Interest) गरी नाफा-नोक्सान हिसाबमा खर्च नदेखाई सम्पत्तिमा जोड्नु।",
                    "एकपटक मात्र प्राप्त भएको सम्पत्ति बिक्रीको नाफा (Extraordinary Gain) सञ्चालन नाफामा मिलाएर EBIT फुलाउनु।"
          ],
          "auditorDetectionGuideNe": [
                    "पुँजीकृत ब्याजको औचित्य जाँच गर्ने र केवल नियमित सञ्चालनबाट प्राप्त वास्तविक EBITDA सँग ब्याज खर्चको अनुपात निकाल्ने।"
          ]
}
      },

      // =====================================================================
      // 5. ACTIVITY & EFFICIENCY RATIOS (कार्यकुशलता तथा चक्रण अनुपातहरू)
      // =====================================================================
      {
        id: 'inventory-turnover',
        nameNe: 'मौज्दात चक्रण अनुपात',
        nameEn: 'Inventory Turnover Ratio (ITR)',
        category: 'Activity',
        formulaLatex: '$\\text{Inventory Turnover} = \\frac{\\text{Cost of Goods Sold (COGS)}}{\\text{Average Inventory}}$',
        numeratorNe: 'बिक्री भएको वस्तुको कुल लागत (COGS)',
        denominatorNe: 'औसत मौज्दात (सुरु मौज्दात + अन्तिम मौज्दात / २)',
        multiplier: 'पटक (Times)',
        standardBenchmark: '५ - ८ पटक प्रति वर्ष (उद्योग अनुसार भिन्न)',
        significanceNe: 'वर्षभरिमा मौज्दात कति पटक बिक्री भई नगदमा रूपान्तरण भयो भन्ने देखाउँछ; उच्च दरले चुस्त कार्यकुशलता जनाउँछ।',
        conceptAndPurposeNe: 'कम दरले सामान गोदाममा थन्किएर नष्ट हुने वा चालु पुँजी जाम हुने जोखिम जनाउँछ भने उच्च दरले सामान छिटो-छिटो बिक्री भई नयाँ सामान आएको देखाउँछ।',
        bankingApplicationNe: 'बैंकहरूले हाइपोथिकेसन कर्जा (Hypothecation Loan) वा स्टक कर्जा दिँदा धितो राखिएको सामान कत्तिको छिटो बिक्री हुन्छ भनी जाँच्न ITR प्रयोग गर्छन्।',
        nrbDirectiveNormsNe: 'NRB चालू पुँजी कर्जा मार्गदर्शन २०७९ अनुसार ऋणीको मौज्दात होल्डिङ अवधि र चक्रण दर उद्योगको औसत अनुसार हुनुपर्दछ।',
        numericalExample: {
          scenarioTitleNe: 'काठमाडौंको एक सुपरमार्केट चेनको वार्षिक व्यापार विवरण:',
          bankNameNe: 'लक्ष्मी सन्राइज बैंक लि.',
          fiscalYearNe: 'आव २०८०/८१',
          givenData: [
            { labelNe: 'बिक्री भएको वस्तुको लागत (COGS)', valueFormatted: 'रु. ४८ करोड' },
            { labelNe: 'सुरु मौज्दात (Opening Stock)', valueFormatted: 'रु. ५ करोड' },
            { labelNe: 'अन्तिम मौज्दात (Closing Stock)', valueFormatted: 'रु. ७ करोड' }
          ],
          steps: [
            {
              stepNumber: 1,
              stepTitleNe: 'औसत मौज्दात (Average Inventory) निकाल्ने',
              formulaOrWorkingLatex: '\\text{Average Inventory} = \\frac{5 + 7}{2} = 6\\text{ करोड}',
              explanationNe: 'सुरु र अन्तिम मौज्दातको औसत रु. ६ करोड निस्कियो।'
            },
            {
              stepNumber: 2,
              stepTitleNe: 'ITR सूत्र प्रयोग',
              formulaOrWorkingLatex: '\\text{ITR} = \\frac{48\\text{ करोड}}{6\\text{ करोड}} = 8.00\\text{ पटक (Times)}',
              explanationNe: '४८ लाई ६ ले भाग गर्दा ८ पटक आउँछ।'
            }
          ],
          resultValueLatex: '8.00 \\text{ पटक (Times / Year)}',
          interpretationNe: 'कम्पनीको मौज्दात वर्षमा ८ पटक (प्रत्येक ४५ दिनमा एक पटक) पूरै बिक्री भएर नयाँ सामान भित्रिन्छ। यो अति कुशल र गतिशील मौज्दात व्यवस्थापन हो।'
        },
        strategicLimitationsNe: 'सामान अभाव (Stock-out) भएर कम मौज्दात राखिएको बेला पनि ITR उच्च देखिन सक्छ (बिक्री गुमाएको अवस्था)।',
        deepConceptualRationaleNe: 'मौज्दात चक्रण अनुपातले व्यापारिक तथा उत्पादनमूलक कम्पनीले आफ्नो चालु पुँजीको प्रमुख हिस्सा मानिने मौज्दात (Inventory) लाई कति छिटो र प्रभावकारी रूपमा बिक्री गरी नगदमा रूपान्तरण गर्दछ भनी मापन गर्दछ। उच्च चक्रण दरले गोदाममा सामान थन्किने लागत, म्याद सकिने जोखिम र मूल्य ह्रास न्यूनीकरण गर्दछ।',
        practicalApplications: {
          regulatorySupervisionNe: 'नेपाल राष्ट्र बैंकको चालू पुँजी कर्जा मार्गदर्शन २०७९ बमोजिम बैंक तथा वित्तीय संस्था सुपरिवेक्षण विभागले ऋणी संस्थाको मौज्दात होल्डिङ अवधि र वास्तविक चक्रण चक्रको स्थलगत अडिट गर्दछ।',
          creditRiskApprovalNe: 'बैंकका क्रेडिट एनालिस्टहरूले हाइपोथिकेसन कर्जा (Hypothecation Loan) तथा स्टक फाइनान्सिङ सीमा (Drawing Power) तोक्दा ऋणीको मौज्दात चक्रण दर उद्योगको बेन्चमार्क अनुसार भए नभएको अनिवार्य विश्लेषण गर्दछन्।',
          investorPerceptionNe: 'उत्पादनमूलक तथा ट्रेडिङ कम्पनीहरूको सेयर मूल्याङ्कन गर्दा उच्च ITR भएको कम्पनीलाई चुस्त व्यवस्थापन भएको मानिन्छ।'
        },
        regulatoryFramework: {
          directiveNumberNe: 'NRB चालू पुँजी कर्जा मार्गदर्शन २०७९ (Working Capital Guidelines) तथा एकीकृत निर्देशन नं. २',
          mandatoryThresholdNe: 'उद्योगको प्रकृति अनुसार ५ देखि ८ पटक (होल्डिङ अवधि अधिकतम ६०-७५ दिन)',
          nonCompliancePenaltyNe: 'स्वीकृत सीमाभन्दा बढी समय स्टक थन्किएमा कर्जाको ब्याजदरमा २% सम्म पेनल ब्याज थपिने तथा चालु पुँजी कर्जाको सीमा घटाइने।'
        },
        windowDressingRisks: {
          manipulationTechniquesNe: [
            'वर्षको अन्त्यमा कृत्रिम रूपमा कम स्टक देखाउन कागजी रूपमा गोदामबाट सामान डिस्प्याच भएको देखाई ITR फुलाउने।',
            'बिक्री नभएका म्याद गुज्रेका (Damaged/Obsolete) स्टकलाई पनि वासलातमा उच्च मूल्यमा देखाइराख्ने।'
          ],
          auditorDetectionGuideNe: [
            'लेखापरीक्षकले ब्यालेन्स सिट मितिमा अनिवार्य भौतिक स्टक भेरिफिकेसन (Physical Stock Count) गर्नुपर्दछ।',
            'स्टक मुभमेन्ट रजिस्टर र वास्तविक गोदाम प्रवेश रसिद (Goods Received Notes) बीच क्रस-चेक गर्नुपर्छ।'
          ]
        }
      },
      {
        id: 'collection-period',
        nameNe: 'ऋणी संकलन अवधि',
        nameEn: 'Average Collection Period (DSO)',
        category: 'Activity',
        formulaLatex: '$\\text{DSO} = \\frac{\\text{Accounts Receivable}}{\\text{Total Credit Sales}} \\times 365\\text{ Days}$',
        numeratorNe: 'प्राप्य हिसाब / ऋणीहरू (Accounts Receivable)',
        denominatorNe: 'वार्षिक कुल उधारो बिक्री (Net Annual Credit Sales)',
        multiplier: 'दिन (Days)',
        standardBenchmark: '३० - ४५ दिन (उत्कृष्ट)',
        significanceNe: 'उधारोमा बिक्री गरेको रकम ग्राहकहरूबाट असुली गरी नगदमा परिणत गर्न औसत कति दिन लाग्छ भन्ने मापन गर्दछ।',
        conceptAndPurposeNe: 'यदि उधारो असुली अवधि ९० दिनभन्दा बढी पुग्यो भने कम्पनीमा नगद प्रवाह (Cash Flow) सुक्ने र खराब ऋणी (Bad Debts) बढ्ने जोखिम हुन्छ।',
        bankingApplicationNe: 'चालु पुँजी कर्जाको सीमा (Drawing Power) गणना गर्दा बैंकहरूले सामान्यतया ९० दिनभन्दा पुराना ऋणीहरूलाई अयोग्य (Ineligible Debtors) घोषित गर्दछन्।',
        nrbDirectiveNormsNe: 'NRB ले व्यापारिक ऋणीहरूको कर्जा अनुगमन गर्दा प्राप्य हिसाबको उमेर विश्लेषण (Aging Analysis of Receivables) अनिवार्य गरेको छ।',
        numericalExample: {
          scenarioTitleNe: 'एक औषधि उत्पादक कम्पनीको उधारो असुली विवरण:',
          bankNameNe: 'एनएमबि बैंक लि. (चालु पुँजी अनुगमन)',
          fiscalYearNe: 'आव २०८०/८१',
          givenData: [
            { labelNe: 'उठ्न बाँकी प्राप्य हिसाब (Receivables)', valueFormatted: 'रु. ६ करोड' },
            { labelNe: 'वार्षिक कुल उधारो बिक्री (Credit Sales)', valueFormatted: 'रु. ६० करोड' }
          ],
          steps: [
            {
              stepNumber: 1,
              stepTitleNe: 'DSO सूत्रमा मान प्रतिस्थापन',
              formulaOrWorkingLatex: '\\text{DSO} = \\frac{6\\text{ करोड}}{60\\text{ करोड}} \\times 365\\text{ Days}',
              explanationNe: '६ लाई ६० ले भाग गर्दा ०.१० आउँछ।'
            },
            {
              stepNumber: 2,
              stepTitleNe: 'दिन गणना',
              formulaOrWorkingLatex: '\\text{DSO} = 0.10 \\times 365 = 36.5\\approx 37\\text{ दिन (Days)}',
              explanationNe: 'औसत असुली अवधि ३७ दिन निस्कियो।'
            }
          ],
          resultValueLatex: '36.5 \\text{ दिन (Days)}',
          interpretationNe: 'कम्पनीले उधारोमा बेचेको सामानको पैसा औसत ३६.५ दिनभित्र उठाइसक्छ, जुन उद्योगको सामान्य ४५ दिने उधारो नीतिको दायराभित्र धेरै राम्रो छ।'
        },
        strategicLimitationsNe: 'वर्षको अन्त्यमा कृत्रिम रूपमा उधारो असुली देखाउन बैंकबाट ओभरड्राफ्ट चलाएर ऋणी खाता मिलान गरेको हुन सक्छ।',
        deepConceptualRationaleNe: 'औसत असुली अवधि (DSO) ले उधारोमा सामान बिक्री गरेपछि त्यसबापतको नगद संकलन गर्न औसत कति दिन लाग्छ भन्ने मापन गर्दछ। यो अनुपात जति छोटो हुन्छ, कम्पनीको तरलता र नगद प्रवाह (Cash Flow) उति नै सबल रहन्छ र खराब ऋण (Bad Debts) को जोखिम न्यूनीकरण हुन्छ।',
        practicalApplications: {
          regulatorySupervisionNe: 'नेपाल राष्ट्र बैंकले बैंकहरूलाई ऋणीहरूको आसामी उमेर विश्लेषण (Debtor Ageing Analysis) जाँच्न र ९० दिन नाघेका आसामीहरूको हकमा १००% जोखिम व्यवस्था गर्न निर्देशन दिएको छ।',
          creditRiskApprovalNe: 'चालु पुँजी कर्जाको ड्रइङ पावर (DP) गणना गर्दा क्रेडिट अधिकृतहरूले ९० दिनभन्दा पुराना ऋणीहरूलाई कुल चालु सम्पत्तिबाट अनिवार्य रूपमा कट्टा (Disallow) गर्दछन्।',
          investorPerceptionNe: 'उधारो असुली चक्र लामो भएका कम्पनीहरूमा नगद अभाव भई लाभांश वितरण क्षमता कमजोर हुने भएकाले लगानीकर्ताहरू सतर्क रहन्छन्।'
        },
        regulatoryFramework: {
          directiveNumberNe: 'NRB चालू पुँजी कर्जा सम्बन्धी मार्गदर्शन २०७९ तथा एकीकृत निर्देशन नं. २',
          mandatoryThresholdNe: 'अधिकतम ४५ देखि ६० दिन (उत्कृष्ट ३०-४५ दिन)',
          nonCompliancePenaltyNe: 'ऋणी संकलन अवधि ९० दिन नाघेमा उक्त रकममा बैंकले धितो सुविधा दिन नपाउने र कर्जालाई खराब वर्गमा वर्गीकरण गरी नोक्सानी व्यवस्था गर्नुपर्ने।'
        },
        windowDressingRisks: {
          manipulationTechniquesNe: [
            'वर्षको अन्त्यमा नक्कली बिल काटेर उधारो बिक्री उच्च देखाउने र नयाँ आर्थिक वर्ष सुरु हुनासाथ सेल्स रिटर्न (Sales Return) देखाउने।',
            'नउठ्ने जोखिमयुक्त आसामीहरूलाई प्रोभिजन नगरी नियमित प्राप्य हिसाबमै राखिरहने।'
          ],
          auditorDetectionGuideNe: [
            'आसामीहरूको कन्फर्मेसन लेटर (Direct External Confirmation) मगाएर खाता प्रमाणीकरण गर्नुपर्दछ।',
            '९० दिनभन्दा पुराना आसामीहरूको सूची अलग गरी प्रोभिजन जाँच गर्नुपर्छ।'
          ]
        }
      },

      // =====================================================================
      // 6. MARKET VALUE RATIOS (बजार मूल्य तथा लगानी अनुपातहरू)
      // =====================================================================
      {
        id: 'eps',
        nameNe: 'प्रति सेयर आम्दानी',
        nameEn: 'Earnings Per Share (EPS)',
        category: 'MarketValue',
        formulaLatex: '$\\text{EPS} = \\frac{\\text{Net Profit After Tax} - \\text{Preference Dividend}}{\\text{Weighted Average Number of Common Shares}}$',
        numeratorNe: 'कर पछिको खुद नाफा - अग्राधिकार सेयर लाभांश',
        denominatorNe: 'कुल साधारण सेयर संख्या (Number of Equity Shares)',
        multiplier: 'रु. (NPR)',
        standardBenchmark: 'रु. २० भन्दा बढी (वाणिज्य बैंकहरूमा उत्कृष्ट)',
        significanceNe: 'प्रत्येक साधारण सेयरले कम्पनीको खुद नाफामा कति रुपैयाँ आर्जन गर्‍यो भन्ने मापन गर्दछ र लाभांश क्षमता निर्धारण गर्दछ।',
        conceptAndPurposeNe: 'यो अनुपात कम्पनीको प्रति सेयर नाफा आर्जन क्षमताको यथार्थ सूचक हो। नेपाल स्टक एक्सचेन्ज (NEPSE) मा सेयर मूल्य निर्धारण गर्ने सबैभन्दा प्राथमिक आधार EPS हो।',
        bankingApplicationNe: 'बैंकको त्रैमासिक वित्तीय विवरण प्रकाशित गर्दा वार्षिक प्रति सेयर आम्दानी (Annualized EPS) प्रमुखताका साथ सार्वजनिक गर्नुपर्छ।',
        nrbDirectiveNormsNe: 'NRB ले बैंकहरूको वित्तीय विवरण ढाँचा (Directive No. 4) मा EPS को गणना NAS 33 (Earnings Per Share) अनुसार गर्नुपर्ने अनिवार्य व्यवस्था गरेको छ।',
        numericalExample: {
          scenarioTitleNe: 'नेपाल एसबिआई बैंक लिमिटेडको आव २०८०/८१ को वार्षिक कार्यविवरण:',
          bankNameNe: 'नेपाल एसबिआई बैंक लि.',
          fiscalYearNe: 'आव २०८०/८१',
          givenData: [
            { labelNe: 'कर पछिको खुद नाफा (NPAT)', valueFormatted: 'रु. २.४० अर्ब' },
            { labelNe: 'साधारण सेयर संख्या (रु. १०० अङ्कित दर)', valueFormatted: '१० करोड कित्ता (१०,००,००,०००)' }
          ],
          steps: [
            {
              stepNumber: 1,
              stepTitleNe: 'EPS सूत्र प्रयोग',
              formulaOrWorkingLatex: '\\text{EPS} = \\frac{\\text{NPAT}}{\\text{No. of Shares}}',
              explanationNe: 'खुद नाफालाई कुल सेयर संख्याले भाग गर्ने।'
            },
            {
              stepNumber: 2,
              stepTitleNe: 'मान प्रतिस्थापन र गणना',
              formulaOrWorkingLatex: '\\text{EPS} = \\frac{2,40,00,00,000}{10,00,00,000} = 24.00\\text{ रुपैयाँ}',
              explanationNe: '२ अर्ब ४० करोडलाई १० करोड कित्ताले भाग गर्दा रु. २४ प्राप्त भयो।'
            }
          ],
          resultValueLatex: 'रु. २४.०० (NPR 24.00 / Share)',
          interpretationNe: 'बैंकको प्रत्येक १ कित्ता सेयरले वर्षमा रु. २४ खुद नाफा आर्जन गरेको छ। यो रु. २० को बेन्चमार्कभन्दा उच्च रहेकाले बैंक आकर्षक लाभांश दिन पूर्ण सक्षम छ।'
        },
        strategicLimitationsNe: 'बोनस सेयर जारी भएपछि सेयर संख्या बढ्दा नाफा स्थिर रहे पनि EPS घट्छ (Dilution Effect)।',
        deepConceptualRationaleNe: "प्रतिशेयर आम्दानी (EPS) ले कम्पनीले आर्जन गरेको खुद नाफालाई कुल जारी साधारण शेयर संख्याले भाग गर्दा १ कित्ता शेयरको भागमा कति आम्दानी पर्यो भनी देखाउँछ। यो शेयर बजारमा कम्पनीको कार्यसम्पादन मापन गर्ने सबैभन्दा लोकप्रिय र महत्त्वपूर्ण आधारभूत सूचक हो।",
        practicalApplications: {
          "regulatorySupervisionNe": "बैंकको नाफा वितरण क्षमता र प्राथमिक पुँजी वृद्धिको दिगोपना जाँच्न राष्ट्र बैंकले वार्षिक EPS विश्लेषण गर्दछ।",
          "creditRiskApprovalNe": "कर्पोरेट ऋणीको शेयर बजारको साख र पुँजी बजारबाट थप पुँजी जुटाउन सक्ने क्षमता मापन गर्न बैंकले EPS हेर्दछन्।",
          "investorPerceptionNe": "नेप्सेमा शेयरको वास्तविक मूल्य मूल्याङ्कन (P/E Ratio, PEG Ratio) र भविष्यमा प्राप्त हुने प्रतिफलको आधार नै EPS हो।"
},
        regulatoryFramework: {
          "directiveNumberNe": "NAS 33 / NFRS (Earnings Per Share) तथा धितोपत्र बोर्ड (SEBON) नियमन",
          "mandatoryThresholdNe": "नेपाली वाणिज्य बैंकहरूमा रु. १५ देखि रु. ३५ प्रतिशेयर स्वस्थ मानिन्छ।",
          "nonCompliancePenaltyNe": "लगातार ऋणात्मक वा न्यून EPS भएमा बैंकको शेयर दोस्रो बजारमा अङ्कित मूल्य (रु. १००) भन्दा तल झर्न सक्छ।"
},
        windowDressingRisks: {
          "manipulationTechniquesNe": [
                    "हकप्रद वा बोनस शेयर जारी गर्दा भारित औसत शेयर संख्या (Weighted Average Shares) गणना नगरी पुरानो शेयर संख्याले भाग गरेर EPS उच्च देखाउनु।",
                    "अस्थायी गैर-सञ्चालन आम्दानीलाई नाफामा जोडेर EPS फुलाउनु।"
          ],
          "auditorDetectionGuideNe": [
                    "NAS 33 अनुसार Basic EPS र Diluted EPS को छुट्टाछुट्टै परीक्षण गर्ने र भारित औसत शेयर संख्या रुजु गर्ने।"
          ]
}
      },
      {
        id: 'pe-ratio',
        nameNe: 'मूल्य-आम्दानी अनुपात',
        nameEn: 'Price to Earnings (P/E) Ratio',
        category: 'MarketValue',
        formulaLatex: '$\\text{P/E Ratio} = \\frac{\\text{Market Price Per Share (MPS)}}{\\text{Earnings Per Share (EPS)}}$',
        numeratorNe: 'प्रति सेयर बजार मूल्य (MPS on NEPSE)',
        denominatorNe: 'प्रति सेयर आम्दानी (EPS)',
        multiplier: 'गुणा (Times)',
        standardBenchmark: '१५ - २५ गुणा (बैंकिङ क्षेत्रमा १५-२० गुणा सन्तुलित)',
        significanceNe: 'लगानीकर्ताहरूले कम्पनीको प्रत्येक १ रुपैयाँ आम्दानीका लागि दोस्रो बजारमा कति रुपैयाँ मूल्य तिर्न तयार छन् भन्ने मूल्याङ्कन गर्दछ।',
        conceptAndPurposeNe: 'कम P/E अनुपात (१५ भन्दा कम) ले सेयर अवमूल्यन (Undervalued / Bargain) भएको जनाउँछ भने अत्यधिक उच्च P/E (३० भन्दा माथि) ले सेयर बढी महँगो (Overvalued / Bubble) भएको जनाउँछ।',
        bankingApplicationNe: 'धितोपत्र बोर्ड (SEBON) र संस्थागत लगानीकर्ताहरूले सेयर पोर्टफोलियो निर्माण गर्दा जोखिम व्यवस्थापन गर्न P/E Ratio हेर्छन्।',
        nrbDirectiveNormsNe: 'NRB ले बैंकहरूलाई धितोपत्रमा लगानी (Investment in Shares) सम्बन्धी सीमा तोक्दा जोखिमयुक्त र उच्च P/E भएका कम्पनीको सेयरमा लगानी नियन्त्रण गर्दछ।',
        numericalExample: {
          scenarioTitleNe: 'नेप्सेमा सूचीकृत एक वाणिज्य बैंकको सेयर कारोबार स्थिति:',
          bankNameNe: 'वाणिज्य बैंक (NEPSE विश्लेषण)',
          fiscalYearNe: 'आव २०८०/८१',
          givenData: [
            { labelNe: 'नेप्सेमा अन्तिम कारोबार मूल्य (MPS)', valueFormatted: 'रु. ३६० प्रति सेयर' },
            { labelNe: 'वार्षिक प्रति सेयर आम्दानी (EPS)', valueFormatted: 'रु. २४ प्रति सेयर' }
          ],
          steps: [
            {
              stepNumber: 1,
              stepTitleNe: 'P/E अनुपात सूत्रमा प्रतिस्थापन',
              formulaOrWorkingLatex: '\\text{P/E Ratio} = \\frac{360}{24}',
              explanationNe: 'बजार मूल्य रु. ३६० लाई EPS रु. २४ ले भाग गर्ने।'
            },
            {
              stepNumber: 2,
              stepTitleNe: 'गुणक गणना',
              formulaOrWorkingLatex: '\\text{P/E Ratio} = 15.00\\text{ गुणा (Times)}',
              explanationNe: '१५ गुणा प्राप्त भयो।'
            }
          ],
          resultValueLatex: '15.00 \\text{ गुणा (Times)}',
          interpretationNe: 'लगानीकर्ताहरूले यस बैंकको प्रत्येक रु. १ को नाफाका लागि बजारमा रु. १५ तिर्न तयार छन्। १५ गुणाको P/E बैंकिङ क्षेत्रका लागि अति सन्तुलित, आकर्षक र सुरक्षित मानिन्छ।'
        },
        strategicLimitationsNe: 'घाटामा रहेका कम्पनीहरूको EPS ऋणात्मक हुने भएकाले तिनको P/E अनुपात अर्थहीन हुन्छ।',
        deepConceptualRationaleNe: "मूल्य-आम्दानी अनुपात (P/E Ratio) ले कम्पनीको १ रुपैयाँ नाफा किन्न लगानीकर्ताहरू दोस्रो बजारमा कति रुपैयाँ तिर्न तयार छन् भनी देखाउँछ। यसले बजारको अपेक्षा, वृद्धि सम्भावना (Growth Potential), र शेयर सस्तो (Undervalued) वा महङ्गो (Overvalued) छ भन्ने यथार्थ चित्रण गर्दछ।",
        practicalApplications: {
          "regulatorySupervisionNe": "शेयर बजारमा बैंकहरूको मूल्याङ्कनमा अत्यधिक सट्टाबाजी वा कृत्रिम मूल्यवृद्धि (Speculative Bubble) भएको छ कि छैन भनी वित्तीय स्थायित्व अध्ययन गर्न प्रयोग हुन्छ।",
          "creditRiskApprovalNe": "शेयर धितो कर्जा (Margin Lending / Share Loan) प्रवाह गर्दा शेयरको उचित मूल्याङ्कन गर्न र जोखिम सीमा तोक्न P/E अनुपात विश्लेषण गरिन्छ।",
          "investorPerceptionNe": "भ्यालु इन्भेस्टरहरूले कम P/E (१५ भन्दा कम) भएका राम्रा बैंकहरू छान्छन् भने ग्रोथ इन्भेस्टरहरू उच्च वृद्धिको अपेक्षामा बढी P/E तिर्न तयार हुन्छन्।"
},
        regulatoryFramework: {
          "directiveNumberNe": "NRB शेयर धितो कर्जा सम्बन्धी निर्देशन तथा SEBON मापदण्ड",
          "mandatoryThresholdNe": "सामान्यतया १५ देखि २५ गुणा बीचको P/E अनुपातलाई सन्तुलित मानिन्छ।",
          "nonCompliancePenaltyNe": "P/E ४० भन्दा माथि पुगेको अवस्थामा शेयर धितो कर्जाको मार्जिन कल जोखिम उच्च रहने हुँदा बैंकहरूले कर्जा सीमा घटाउँछन्।"
},
        windowDressingRisks: {
          "manipulationTechniquesNe": [
                    "बजारमा कर्नरिङ वा सर्कुलर ट्रेडिङ (Circular Trading) गरेर बजार मूल्य (MPS) कृत्रिम रूपमा बढाउनु।",
                    "अस्थायी नाफाको आधारमा एकाएक P/E सस्तो भएको देखाएर भ्रम छर्नु।"
          ],
          "auditorDetectionGuideNe": [
                    "P/E अनुपातलाई ऐतिहासिक ५ वर्षे औसत र समग्र बैंकिङ क्षेत्रको औसत P/E सँग तुलना (Peer Group Comparison) गर्नुपर्दछ।"
          ]
}
      }
    ],
    comparisonTable: {
      titleNe: 'प्रमुख वित्तीय विवरणहरूको तुलनात्मक वर्गीकरण तालिका',
      column1Header: 'तुलनाको आधार (Basis)',
      column2Header: 'वासलात (Balance Sheet / SOFP)',
      column3Header: 'नाफा-नोक्सान हिसाब (P&L / SOPL)',
      rows: [
        {
          parameterNe: 'प्रकृति तथा उद्देश्य',
          parameterEn: 'Nature & Objective',
          column1Value: 'निश्चित मितिमा संस्थाको वित्तीय स्थिति (सम्पत्ति, दायित्व र पुँजी) देखाउँछ।',
          column2Value: 'निश्चित समयावधिको सञ्चालन नतिजा (आम्दानी, खर्च र खुद नाफा/नोक्सान) देखाउँछ।'
        },
        {
          parameterNe: 'समय अवधि',
          parameterEn: 'Time Horizon',
          column1Value: 'विशिष्ट बिन्दुमा (Point in time: As on Ashadh End)।',
          column2Value: 'निश्चित अवधिभर (Period of time: For the fiscal year)।'
        },
        {
          parameterNe: 'समीकरणको आधार',
          parameterEn: 'Core Equation',
          column1Value: 'Assets = Liabilities + Equity (सम्पत्ति = दायित्व + पुँजी)।',
          column2Value: 'Net Profit = Total Revenue - Total Expenses।'
        },
        {
          parameterNe: 'NFRS / NAS ढाँचा',
          parameterEn: 'NFRS / NAS Standard',
          column1Value: 'NAS 1 - Statement of Financial Position।',
          column2Value: 'NAS 1 - Statement of Profit or Loss & Other Comprehensive Income।'
        },
        {
          parameterNe: 'प्रयोगकर्ताको दृष्टिकोण',
          parameterEn: 'User Perspective',
          column1Value: 'ऋणदाता तथा निक्षेपकर्ताले शोधनक्षमता र सुरक्षा जाँच्न प्रयोग गर्छन्।',
          column2Value: 'लगानीकर्ता तथा सेयरधनीले नाफा आर्जन क्षमता र लाभांश सम्भावना जाँच्न प्रयोग गर्छन्।'
        }
      ]
    },
    markdownContent: `
# वित्तीय विवरण र यसको विश्लेषण (Financial Statement & Ratio Analysis)

## १. पृष्ठभूमि र अवधारणा (Introduction & Concept)
वित्तीय विवरण (Financial Statements) कुनै पनि व्यवसाय वा बैंक तथा वित्तीय संस्थाको निश्चित समयावधिको **आर्थिक गतिविधि, वित्तीय कार्यसम्पादन (Financial Performance) तथा वित्तीय स्थिति (Financial Position)** को व्यवस्थित र प्रमाणीकृत अभिलेख हो। 

नेपालमा बैंक तथा वित्तीय संस्थाहरूले नेपाल वित्तीय प्रतिवेदन मानहरू (**NFRS - Nepal Financial Reporting Standards**) तथा **नेपाल राष्ट्र बैंकको एकीकृत निर्देशन (Unified Directives No. 4)** बमोजिम वित्तीय विवरण तयार पार्नु कानुनी रूपमा अनिवार्य छ।

> **परिभाषा:** "Financial statements are structured representations of the financial position and financial performance of an entity, reflecting transactions, assets, liabilities, equity, income, and cash flows." - **NAS 1 (Presentation of Financial Statements)**

---

## २. NFRS अनुसार वित्तीय विवरणका ५ अनिवार्य अङ्गहरू (Components of Financial Statements)
NFRS / NAS 1 अनुसार वित्तीय विवरणको पूर्ण सेटमा देहायका ५ वटा विवरणहरू समावेश हुन्छन्:

1. **वित्तीय अवस्थाको विवरण (Statement of Financial Position - वासलात):**
   - आर्थिक वर्षको अन्तिम दिन संस्थाको कुल सम्पत्ति (Assets), बाह्य दायित्व (Liabilities), र आन्तरिक पुँजी (Equity) को सन्तुलन देखाउँछ।
   - मूल सूत्र: $\\text{Total Assets} = \\text{Total Liabilities} + \\text{Shareholders' Equity}$
2. **नाफा वा नोक्सान तथा अन्य विस्तृत आम्दानीको विवरण (Statement of Profit or Loss and Other Comprehensive Income):**
   - आर्थिक वर्षभरिको ब्याज आम्दानी, कमिसन, सञ्चालन खर्च, इम्पेयरमेन्ट चार्ज र कर पछिको खुद नाफा प्रस्तुत गर्दछ।
3. **नगद प्रवाह विवरण (Statement of Cash Flows - NAS 7):**
   - नगदको स्रोत र उपयोगलाई ३ प्रमुख गतिविधिमा वर्गीकरण गर्दछ:
     - सञ्चालन गतिविधिबाट नगद प्रवाह (Operating Activities)
     - लगानी गतिविधिबाट नगद प्रवाह (Investing Activities)
     - वित्तीय गतिविधिबाट नगद प्रवाह (Financing Activities)
4. **इक्विटीमा भएको परिवर्तनको विवरण (Statement of Changes in Equity):**
   - सेयर पुँजी, जगेडा कोष, साधारण जगेडा (General Reserve), र प्रतिधारित नाफा (Retained Earnings) मा भएको थपघट देखाउँछ।
5. **लेखा नीति तथा व्याख्यात्मक टिप्पणीहरू (Accounting Policies & Explanatory Notes):**
   - प्रयोग गरिएका लेखा मान्यताहरू, सम्भावित दायित्व (Contingent Liabilities), र अनुसूचीहरूको विस्तृत विवरण।

---

## ३. वित्तीय अनुपात विश्लेषणको विस्तृत वर्गीकरण (Classification of Financial Ratios)
वित्तीय विवरणमा प्रस्तुत भएका तथ्याङ्कहरू बीचको **गणितीय र तार्किक सम्बन्ध** स्थापना गरी संस्थाको सबल र दुर्बल पक्षको मूल्याङ्कन गर्ने विधिलाई **अनुपात विश्लेषण (Ratio Analysis)** भनिन्छ।

### क. तरलता अनुपातहरू (Liquidity Ratios)
अल्पकालीन दायित्व भुक्तानी गर्न सक्ने क्षमता मापन गर्दछ:
- **चालु अनुपात (Current Ratio):** $\\text{Current Ratio} = \\frac{\\text{Current Assets}}{\\text{Current Liabilities}}$ (मानक: २:१)
- **शीघ्र अनुपात (Quick Ratio):** $\\text{Quick Ratio} = \\frac{\\text{Current Assets} - \\text{Inventory} - \\text{Prepaids}}{\\text{Current Liabilities}}$ (मानक: १:१)
- **नगद अनुपात (Cash Ratio):** $\\text{Cash Ratio} = \\frac{\\text{Cash} + \\text{Marketable Securities}}{\\text{Current Liabilities}}$ (मानक: ०.२:१ देखि ०.५:१)

### ख. नाफामूलक अनुपातहरू (Profitability Ratios)
संस्थाले पुँजी र सम्पत्ति परिचालनबाट नाफा कमाउन देखाएको दक्षता:
- **कुल नाफा मार्जिन (GPM):** $\\text{GPM} = \\frac{\\text{Gross Profit}}{\\text{Revenue}} \\times 100\\%$
- **खुद नाफा मार्जिन (NPM):** $\\text{NPM} = \\frac{\\text{NPAT}}{\\text{Revenue}} \\times 100\\%$
- **स्वपुँजी प्रतिफल (ROE):** $\\text{ROE} = \\frac{\\text{NPAT}}{\\text{Shareholders' Equity}} \\times 100\\%$
- **सम्पत्ति प्रतिफल (ROA):** $\\text{ROA} = \\frac{\\text{NPAT}}{\\text{Total Assets}} \\times 100\\%$
- **खुद ब्याज मार्जिन (NIM):** $\\text{NIM} = \\frac{\\text{Interest Income} - \\text{Interest Expense}}{\\text{Average Earning Assets}} \\times 100\\%$

### ग. शोधनक्षमता तथा लिभरेज अनुपातहरू (Solvency / Leverage Ratios)
दीर्घकालीन वित्तीय स्थायित्व र ऋण तिर्ने क्षमता:
- **ऋण-इक्विटी अनुपात (Debt to Equity):** $\\text{D/E} = \\frac{\\text{Total Debt}}{\\text{Shareholders' Equity}}$
- **ब्याज भुक्तानी क्षमता (Interest Coverage Ratio):** $\\text{ICR} = \\frac{\\text{EBIT}}{\\text{Interest Expense}}$

### घ. सञ्चालन कार्यकुशलता अनुपातहरू (Efficiency / Activity Ratios)
- **मौज्दात चक्रण अनुपात (ITR):** $\\text{ITR} = \\frac{\\text{Cost of Goods Sold}}{\\text{Average Inventory}}$
- **औसत संकलन अवधि (DSO):** $\\text{DSO} = \\frac{\\text{Accounts Receivable}}{\\text{Credit Sales}} \\times 365\\text{ Days}$

### ङ. बजार मूल्य अनुपातहरू (Market Value Ratios)
- **प्रति सेयर आम्दानी (EPS):** $\\text{EPS} = \\frac{\\text{NPAT} - \\text{Preference Dividend}}{\\text{No. of Common Shares}}$
- **मूल्य-आम्दानी अनुपात (P/E Ratio):** $\\text{P/E} = \\frac{\\text{MPS}}{\\text{EPS}}$

---

## ४. नेपाल राष्ट्र बैंकको प्रमुख नियामकीय सूचकहरू (NRB Prudential Norms)
वाणिज्य बैंक तथा वित्तीय संस्थाहरूले पालना गर्नुपर्ने प्रमुख वित्तीय अनुपातहरू:

| सूचक (Indicator) | न्यूनतम / अधिकतम सीमा | सम्बन्धित NRB निर्देशन |
| :--- | :--- | :--- |
| **पुँजी पर्याप्तता अनुपात (CAR)** | न्यूनतम ११.०% (Tier 1: ८.५%) | निर्देशन नं. १ (पुँजी कोष) |
| **कर्जा-निक्षेप अनुपात (CD Ratio)** | अधिकतम ९०.०% | निर्देशन नं. २ (कर्जा परिचालन) |
| **निष्क्रिय कर्जा (NPL Ratio)** | अधिकतम ५.०% भन्दा कम | निर्देशन नं. २ (कर्जा वर्गीकरण) |
| **वैधानिक तरलता अनुपात (SLR)** | 'क' वर्ग: १२%, 'ख' र 'ग': १०% | मौद्रिक नीति व्यवस्था |
| **नगद मौज्दात अनुपात (CRR)** | सबै वर्गका लागि ४.०% | मौद्रिक नीति व्यवस्था |
| **खुद तरल सम्पत्ति (Net Liquid Assets)** | कुल निक्षेपको कम्तीमा २०% | निर्देशन नं. ५ (तरलता जोखिम) |

---

## ५. वासलात बाहिरका कारोबारहरू (Off-Balance Sheet Items - OBS)

### क. अवधारणा र परिचय (Concept & Definition)
वासलात बाहिरका कारोबारहरू (Off-Balance Sheet Items) भन्नाले यस्ता कारोबार वा सम्झौताहरू हुन् जुन **सञ्चालन भएको मितिमा बैंकको वास्तविक सम्पत्ति (Assets) वा प्रत्यक्ष दायित्व (Liabilities) का रूपमा वासलातको मूल तालिकाभित्र प्रविष्ट हुँदैनन्**, तर भविष्यमा कुनै निश्चित घटना घट्दा वा ऋणीले सर्त पालना नगर्दा **प्रत्यक्ष वित्तीय दायित्व (Contingent Liabilities) मा परिणत हुन सक्दछन्**।

नेपाल राष्ट्र बैंकको एकीकृत निर्देशन नं. ४ अनुसार यस्ता सम्पूर्ण कारोबारहरूलाई वित्तीय विवरणको व्याख्यात्मक टिप्पणी (Notes to Accounts) मा अनिवार्य रूपमा खुलाउनुपर्दछ।

### ख. बैंकिङ क्षेत्रमा प्रमुख ५ वासलात बाहिरका कारोबारहरू:
1. **प्रतितपत्र (Letters of Credit - L/C):** 
   - अन्तर्राष्ट्रिय व्यापारमा आयातकर्ताले सामानको भुक्तानी दिने प्रत्याभूतिका लागि बैंकद्वारा जारी गरिने वित्तीय साखपत्र। सामान प्राप्त नभएसम्म वा कागजात नआएसम्म यो गैर-प्रत्यक्ष दायित्व रहन्छ।
2. **बैंक जमानत (Bank Guarantees - BG):**
   - ग्राहकले कुनै सम्झौता पालना नगरेमा तेस्रो पक्षलाई क्षतिपूर्ति दिने बैंकको लिखित प्रतिबद्धता।
   - प्रमुख प्रकारहरू:
     - बोलपत्र जमानत (Bid Bond / Tender Guarantee)
     - कार्यसम्पादन जमानत (Performance Bond)
     - अग्रिम भुक्तानी जमानत (Advance Payment Guarantee)
     - काउन्टर ग्यारेन्टी (Counter Guarantee)
3. **स्वीकृति तथा पृष्ठाङ्कन (Acceptances and Endorsements):**
   - ग्राहकको तर्फबाट बैंकले विनिमय पत्र (Bills of Exchange) वा ड्राफ्ट स्वीकार गरी भुक्तानीको जिम्मेवारी लिनु।
4. **विदेशी विनिमय सम्बन्धी अग्रिम सम्झौता (Forward Foreign Exchange Contracts):**
   - विदेशी विनिमय उतारचढावको जोखिम न्यूनीकरण (Hedging) गर्न भविष्यको निश्चित मितिमा निश्चित विनिमय दरमा मुद्रा खरिद-बिक्री गर्ने सम्झौता।
5. **अपरिवर्तनीय कर्जा प्रतिबद्धता (Undrawn / Irrevocable Loan Commitments):**
   - स्वीकृत भइसकेको तर ग्राहकले अहिलेसम्म नझिकेको कर्जा रकम (Undrawn Credit Facilities)।

### ग. वासलात बाहिरका कारोबारको जोखिम र बासेल व्यवस्था:
- **क्रेडिट जोखिम (Credit Conversion Factor - CCF):** बासेल ३ तथा NRB निर्देशन नं. १ अनुसार OBS कारोबारहरूलाई प्रत्यक्ष सम्पत्ति सरह मानी २०% देखि १००% सम्मको क्रेडिट रूपान्तरण गुणक (CCF) लागू गरी जोखिम भार (RWA) गणना गरिन्छ र त्यसका लागि पुँजी कोष (CAR) छुट्याउनुपर्दछ।
- **कमिशन आम्दानीको स्रोत:** यी कारोबारबाट बैंकले जोखिमरहित गैर-ब्याज आम्दानी (Fee & Commission Income) आर्जन गर्दछ।

---

## ६. वित्तीय विवरण विश्लेषणको महत्त्व र सीमाहरू (Significance & Limitations)
### महत्त्व (Significance):
- **सञ्चालक तथा व्यवस्थापनका लागि:** नीति निर्माण, लागत नियन्त्रण, र रणनीतिक योजना तर्जुमा गर्न।
- **नेपाल राष्ट्र बैंकका लागि:** CAMELS फ्रेमवर्क अनुसार स्थलगत तथा गैर-स्थलगत सुपरिवेक्षण गर्न।
- **निक्षेपकर्ता र लगानीकर्ताका लागि:** आफ्नो रकमको सुरक्षा र प्रतिफलको सम्भावना यकिन गर्न।

### सीमाहरू (Limitations):
- ऐतिहासिक लागत (Historical Cost) मा आधारित हुने हुँदा मुद्रास्फीतिको वास्तविक प्रभाव नदेखिनु।
- गुणात्मक पक्षहरू (कर्मचारी मनोबल, ग्राहक सन्तुष्टि) समावेश नहुनु।
- 'विन्डो ड्रेसिङ' (Window Dressing) मार्फत कृत्रिम रूपमा विवरण आकर्षक बनाउने सम्भावना।
`,
    probableExamQuestions: [
      {
        marks: 10,
        questionNe: 'वित्तीय विवरण भन्नाले के बुझिन्छ? NFRS अनुसार वित्तीय विवरणका प्रमुख अङ्गहरूको संक्षेपमा चर्चा गर्दै वित्तीय अनुपात विश्लेषणको महत्त्व प्रकाश पार्नुहोस्।',
        questionEn: 'What is a Financial Statement? Briefly explain the main components of financial statements under NFRS and discuss the importance of financial ratio analysis in banking.',
        examLevel: 'NRB / RBB Level 5 & 6',
        modelAnswerFramework: [
          'परिचय: वित्तीय विवरणको अवधारणा, NFRS / NAS 1 को कानुनी आधार (२ अङ्क)',
          'NFRS का ५ अङ्गहरू: SOFP, SOPL, Cash Flow, Changes in Equity, Notes को व्याख्या (४ अङ्क)',
          'अनुपात विश्लेषणको महत्त्व: तरलता, नाफा, शोधनक्षमता, सुपरिवेक्षण र निर्णय प्रक्रिया (३ अङ्क)',
          'निष्कर्ष: विन्डो ड्रेसिङरहित पारदर्शी विवरणको आवश्यकता (१ अङ्क)'
        ]
      },
      {
        marks: 10,
        questionNe: 'वासलात बाहिरका कारोबारहरू (Off-Balance Sheet Items) भन्नाले के बुझिन्छ? बैंकिङ क्षेत्रमा यसका प्रमुख प्रकारहरूको चर्चा गर्दै यसमा निहित जोखिम व्यवस्थापनका लागि नेपाल राष्ट्र बैंकको व्यवस्था प्रस्ट्याउनुहोस्।',
        questionEn: 'What are Off-Balance Sheet (OBS) items? Discuss their major types in commercial banking and elucidate Nepal Rastra Bank regulations to manage risks associated with them.',
        examLevel: 'NRB / RBB / ADBL Level 6 / Officer Level',
        modelAnswerFramework: [
          'OBS को परिभाषा तथा अवधारणा: सम्भावित दायित्व (Contingent Liabilities) को औचित्य (२ अङ्क)',
          'प्रमुख ४-५ प्रकारहरू: L/C, Bank Guarantee, Acceptances, Forward Forex (४ अङ्क)',
          'जोखिमहरू: क्रेडिट जोखिम, तरलता जोखिम र CCF / बासेल ३ पुँजी पर्याप्तता व्यवस्था (३ अङ्क)',
          'निष्कर्ष: गैर-ब्याज आम्दानी र जोखिम बीचको सन्तुलन (१ अङ्क)'
        ]
      },
      {
        marks: 5,
        questionNe: 'बैंक तथा वित्तीय संस्थामा पुँजी पर्याप्तता अनुपात (CAR) र कर्जा-निक्षेप अनुपात (CD Ratio) को नियामकीय औचित्य पुष्टि गर्नुहोस्।',
        questionEn: 'Justify the regulatory rationale of Capital Adequacy Ratio (CAR) and Credit to Deposit (CD) Ratio in commercial banks.',
        examLevel: 'NRB Level 4 / Loksewa Kharidar-Nasu',
        modelAnswerFramework: [
          'CAR को अर्थ, बासेल ३ फ्रेमवर्क, ११% को औचित्य (२.५ अङ्क)',
          'CD Ratio को अर्थ, ९०% को सीमा, तरलता जोखिम व्यवस्थापन (२.५ अङ्क)'
        ]
      }
    ]
  },

  // =========================================================================
  // TOPIC 2: E-Commerce (विद्युतीय वाणिज्य) - 10-15 Mark Comprehensive Depth
  // =========================================================================
  {
    id: 'e-commerce-banking-nepal',
    topicNumber: 2,
    titleNe: 'विद्युतीय वाणिज्य (E-Commerce)',
    titleEn: 'Electronic Commerce (E-Commerce)',
    subtitleNe: '१०-चरणीय भुक्तानी चक्र, ६ मोडेल, साइबर सुरक्षा, ऐन २०६३, भुक्तानी गेटवे र जोखिम नियन्त्रण',
    categoryTag: 'डिजिटल बैंकिङ तथा सूचना प्रविधि',
    paperReference: 'NRB / RBB / NBL / Banking - Paper I & II (१०-१५ अङ्क)',
    examWeightage: '१०-१५ अङ्क (लिखित परीक्षा)',
    readTime: '१५ मिनेट',
    pdfFilename: 'Banking_Notes_Topic_2_E_Commerce.pdf',
    summaryNe: 'इन्टरनेट तथा डिजिटल प्रविधिको माध्यमबाट वस्तु वा सेवाको उत्पादन, विज्ञापन, खरिद-बिक्री, अर्डर व्यवस्थापन तथा डिजिटल भुक्तानी फछ्र्यौट गर्ने सम्पूर्ण प्रक्रियालाई विद्युतीय वाणिज्य भनिन्छ। नेपालमा विद्युतीय कारोबार ऐन २०६३, राष्ट्रिय ई-कमर्स रणनीति २०७६ र NRB भुक्तानी निर्देशनहरू यसका नियामक आधार हुन्।',
    definitionCard: {
      termNe: 'विद्युतीय वाणिज्य (E-Commerce)',
      termEn: 'Electronic Commerce (E-Commerce)',
      definitionNe: 'इन्टरनेट, कम्प्युटर नेटवर्क, मोबाइल एप्लिकेसन तथा डिजिटल सञ्चार प्रविधिको माध्यमबाट वस्तु, सेवा वा बौद्धिक सम्पत्तिको उत्पादन, विज्ञापन, खरिद, बिक्री, अर्डर व्यवस्थापन, डिजिटल भुक्तानी र डेलिभरी ट्र्याकिङ गर्ने सम्पूर्ण एकीकृत व्यावसायिक प्रक्रियालाई विद्युतीय वाणिज्य (E-Commerce) भनिन्छ।',
      source: 'राष्ट्रिय ई-कमर्स रणनीति, २०७६ तथा WTO E-Commerce Work Programme'
    },
    statutoryCard: {
      actTitleNe: 'सम्बन्धित ऐन, कानुन तथा नीतिगत व्यवस्थाहरू',
      clauses: [
        { clause: 'विद्युतीय कारोबार ऐन, २०६३ (दफा ३ र ४)', title: 'विद्युतीय अभिलेख र हस्ताक्षर', description: 'विद्युतीय अभिलेखलाई कानुनी मान्यता र डिजिटल हस्ताक्षरलाई आधिकारिक वैधानिकता प्रदान।' },
        { clause: 'विद्युतीय कारोबार ऐन, २०६३ (दफा ४४-५९)', title: 'कम्प्युटर सम्बन्धी कसुर र सजाय', description: 'ह्याकिङ, डाटा चोरी, अनाधिकृत पहुँच र विद्युतीय ठगीमा २ देखि ५ वर्षसम्म कैद र जरिवाना।' },
        { clause: 'राष्ट्रिय ई-कमर्स रणनीति, २०७६', title: '५ वर्षे राष्ट्रिय कार्ययोजना', description: 'डिजिटल भुक्तानी प्रवर्द्धन, राष्ट्रिय लजिस्टिक्स सुधार, ग्रामीण ई-कमर्स विस्तार र कानुनी सुधार।' },
        { clause: 'उपभोक्ता संरक्षण ऐन, २०७५', title: 'उपभोक्ता हित संरक्षण', description: 'अनलाइन खरिदमा गुणस्तरहीन वस्तु, भ्रामक विज्ञापन र मूल्य ठगी नियन्त्रण सम्बन्धी व्यवस्था।' },
        { clause: 'NRB भुक्तानी निर्देशन तथा सीमाहरू', title: 'डिजिटल भुक्तानी नियमन', description: 'वालेट तथा अनलाइन कार्ड कारोबारको दैनिक र मासिक सीमा तथा दुई-चरणीय प्रमाणीकरण (2FA)।' }
      ]
    },
    keyTakeaways: [
      '१०-चरणीय ई-कमर्स भुक्तानी चक्र: ग्राहक इच्छा -> खोज/कार्ट -> चेकआउट -> अर्डर अनुरोध -> गेटवे/स्वीच रिडाइरेक्ट -> 2FA प्रमाणीकरण -> बैंक स्वीकृति -> सेटलमेन्ट -> लजिस्टिक्स डेलिभरी -> पोस्ट-पर्चेज रिकन्सिलिएसन।',
      'ई-कमर्सका मुख्य ६ मोडेलहरू: B2B, B2C, C2C, C2B, B2G र G2C।',
      'सुरक्षा पूर्वाधार: SSL/TLS 1.3, PKI (सार्वजनिक/निजी कुञ्जी), टोकनाइजेसन (Tokenization), र 3D Secure 2.0।',
      'विद्युतीय कारोबार ऐन २०६३ का प्रमुख दफाहरू (दफा ३, ४, १५, १६ र दफा ४४ देखि ५९)।',
      '८ प्रमुख जोखिमहरू र बहुस्तरीय सुरक्षा रणनीति: साइबर ठगी, चार्जDefault, डाटा लिक, सिस्टम डाउनटाइम आदि।'
    ],
    comparisonTable: {
      titleNe: 'परम्परागत व्यापार र विद्युतीय वाणिज्य (E-Commerce) बीच तुलनात्मक तालिका',
      column1Header: 'तुलनाको आधार',
      column2Header: 'परम्परागत व्यापार (Traditional Commerce)',
      column3Header: 'विद्युतीय वाणिज्य (E-Commerce)',
      rows: [
        {
          parameterNe: 'सञ्चालन माध्यम',
          parameterEn: 'Operational Medium',
          column1Value: 'भौतिक पसल, शोरुम, र व्यक्तिगत भेटघाट।',
          column2Value: 'इन्टरनेट, वेबसाइट, मोबाइल एप र डिजिटल प्लेटफर्म।'
        },
        {
          parameterNe: 'सञ्चालन समय',
          parameterEn: 'Operating Hours',
          column1Value: 'सीमित समय (प्रायः बिहान १० देखि साँझ ७ बजेसम्म)।',
          column2Value: '२४ घण्टा, ३६५ दिन (24/7/365 Non-stop)।'
        },
        {
          parameterNe: 'भौगोलिक पहुँच',
          parameterEn: 'Geographical Reach',
          column1Value: 'स्थानीय बजार वा निश्चित क्षेत्रमा सीमित।',
          column2Value: 'विश्वव्यापी वा देशव्यापी (Global/National Reach)।'
        },
        {
          parameterNe: 'लागत संरचना',
          parameterEn: 'Cost Structure',
          column1Value: 'भाडा, भौतिक सजावट, र कर्मचारीमा उच्च स्थिर लागत।',
          column2Value: 'कम प्रशासनिक लागत, बिचौलियाको अन्त्य, कम ओभरहेड।'
        },
        {
          parameterNe: 'भुक्तानी विधि',
          parameterEn: 'Payment Method',
          column1Value: 'प्रायः भौतिक नगद (Physical Cash) वा चेक।',
          column2Value: 'डिजिटल वालेट, कार्ड, QR कोड, नेट बैंकिङ र COD।'
        },
        {
          parameterNe: 'ग्राहक अनुभव',
          parameterEn: 'Customer Experience',
          column1Value: 'सामान छोएर प्रत्यक्ष हेर्न सकिने तर समय लाग्ने।',
          column2Value: 'घरमै बसी तुरुन्त अर्डर, तुलना गर्न सजिलो तर सामान परीक्षण गर्न नमिल्ने।'
        }
      ]
    },
    markdownContent: "# विद्युतीय वाणिज्य (E-Commerce) - १०-१५ अङ्क विशेष विस्तृत अध्ययन नोट\n\n## १. अवधारणा, परिचय र परिभाषा (Concept & Legal Definition)\nविद्युतीय वाणिज्य (Electronic Commerce - E-Commerce) भन्नाले कम्प्युटर सञ्जाल, इन्टरनेट, टेलिकम्युनिकेसन तथा मोबाइल प्रविधिको प्रयोग गरी **वस्तु, सेवा वा सूचनाको उत्पादन, विज्ञापन, खरिद, बिक्री, अर्डर व्यवस्थापन र डिजिटल भुक्तानी फछ्र्यौट** गर्ने सम्पूर्ण आधुनिक व्यावसायिक प्रणालीलाई जनाउँछ।\n\nबैंकिङ क्षेत्र ई-कमर्सको मेरुदण्ड (Backbone) हो। बैंक तथा वित्तीय संस्थाहरूले सुरक्षित भुक्तानी गेटवे (Payment Gateway), कार्ड स्वीचिङ, मर्चेन्ट बैंकिङ र एस्क्रो एकाउन्ट (Escrow Account) उपलब्ध गराएर ई-कमर्सलाई चलायमान बनाउँछन्।\n\n> **कानुनी तथा रणनीतिक परिभाषा:**\n> \"ई-कमर्स भन्नाले कम्प्युटर सञ्जाल र इन्टरनेटको प्रयोग गरी वस्तु, सेवा वा बौद्धिक सम्पत्तिको खरिद, बिक्री तथा विनिमय गर्ने, डिजिटल माध्यमबाट भुक्तानी फछ्र्यौट गर्ने र स्वचालित प्रणालीमार्फत ग्राहक सेवा तथा ढुवानी व्यवस्थापन गर्ने एकीकृत व्यावसायिक पद्धति हो।\"\n> — **राष्ट्रिय ई-कमर्स रणनीति, २०७६ (उद्योग, वाणिज्य तथा आपूर्ति मन्त्रालय)**\n\n---\n\n## २. ई-कमर्सको सम्पूर्ण १०-चरणीय भुक्तानी तथा डेलिभरी प्रक्रियागत प्रवाह (Full 10-Step E2E Process Flow)\nई-कमर्सको कारोबार सुरक्षित रूपमा सम्पन्न हुन देहायका १० वटा चरण पार गर्नुपर्दछ:\n\n**[१. ग्राहक इच्छा र खोज]** ──> **[२. सपिङ कार्टमा थप र अर्डर पुष्टि]** ──> **[३. चेकआउट र डेलिभरी ठेगाना]**\n                                                                                   │\n                                                                                   ▼\n**[६. कार्ड/बैंक 2FA प्रमाणीकरण]** <── **[५. स्वीच तथा जारीकर्ता बैंक]** <── **[४. मर्चेन्टबाट भुक्तानी गेटवेमा रिडाइरेक्ट]**\n         │\n         ▼\n**[७. खाताबाट रकम कट्टी र स्वीकृति]** ──> **[८. मर्चेन्ट अर्डर फन्ड सेटलमेन्ट]** ──> **[९. गोदामबाट लजिस्टिक्स डेलिभरी]**\n                                                                                   │\n                                                                                   ▼\n                                                             **[१०. पोस्ट-पर्चेज रिभर्स लजिस्टिक्स / रिफण्ड]**\n\n### विस्तृत १० चरणहरूको विवरण:\n1. **चरण १ (Consumer Intent & Browsing):** ग्राहकद्वारा वेबसाइट वा मोबाइल एपमा सामान वा सेवाको खोजी तथा मूल्य/विशेषता तुलना।\n2. **चरण २ (Add to Cart & Order Confirmation):** खरिद गर्न चाहेको वस्तु सपिङ कार्टमा राख्ने र परिमाण यकिन गर्ने।\n3. **चरण ३ (Checkout & Delivery Details):** ग्राहकले आफ्नो नाम, फोन नम्बर, बिलिङ र शिपिङ ठेगाना प्रविष्ट गरी भुक्तानी विकल्प रोज्ने।\n4. **चरण ४ (Merchant to Payment Gateway Integration):** मर्चेन्ट सर्भरले कारोबार रकम, अर्डर नम्बर र मर्चेन्ट कोडसहित भुक्तानी गेटवे (Payment Gateway - जस्तै eSewa, Khalti, NCHL-NPI) मा सुरक्षित HTTPS/TLS मार्फत पठाउने।\n5. **चरण ५ (Payment Switch & Routing):** गेटवेले नेपाल क्लियरिङ्ग हाउस (NCHL), भिसा (Visa), मास्टरकार्ड (MasterCard) वा नेपालपे (NepalPay) स्वीचमार्फत ग्राहकको खाता रहेको बैंक (Issuer Bank) मा अनुरोध पठाउने।\n6. **चरण ६ (Two-Factor Authentication - 2FA):** जारीकर्ता बैंकले ग्राहकको दर्ता भएको मोबाइल वा इमेलमा एकपटक प्रयोग हुने कोड (OTP) पठाउने वा बायोमेट्रिक प्रमाणीकरण माग्ने।\n7. **चरण ७ (Issuer Bank Authorization & Fund Debit):** OTP सही प्रमाणित भएपछि बैंकले ग्राहकको खाताबाट रकम कट्टा (Debit) गरी भुक्तानी सफल भएको डिजिटल टोकन जारी गर्दछ।\n8. **चरण ८ (Clearing, Settlement & Merchant Notification):** भुक्तानी स्वीचले मर्चेन्टको खातामा रकम जम्मा (Credit) गर्दछ वा एस्क्रो खातामा सुरक्षित राख्दछ र मर्चेन्टलाई \"Payment Successful\" सन्देश दिन्छ।\n9. **चरण ९ (Order Fulfillment & Logistics Tracking):** मर्चेन्टले गोदामबाट सामान प्याक गरी कुरियर/डेलिभरी पार्टनरमार्फत ग्राहकको ठेगानामा पठाउँछ र रियल-टाइम GPS ट्र्याकिङ कोड दिन्छ।\n10. **चरण १० (Post-Purchase Reconciliation & Returns):** ग्राहकले सामान प्राप्त गरी सन्तुष्टि पुष्टि गरेपछि कारोबार बन्द हुन्छ। सामान बिग्रिएको भए फिर्ता (Reverse Logistics) र रिफण्ड (Refund) प्रक्रिया सुरु हुन्छ।\n\n---\n\n## ३. ई-कमर्सका ६ प्रमुख व्यावसायिक मोडेलहरू (6 Core Business Models)\n\n| मोडेल | पूरा नाम | नेपाली सन्दर्भ र उदाहरण | बैंकिङ भूमिका |\n| :--- | :--- | :--- | :--- |\n| **B2B** | Business-to-Business | थोक बिक्रेता र उद्योग बीच (उदा. डाबर नेपाल र खुद्रा डिस्टिब्युटर) | उच्च मूल्य RTGS, NPI, L/C, बैंक ग्यारेन्टी |\n| **B2C** | Business-to-Consumer | अनलाइन पसलबाट उपभोक्ता (उदा. Daraz, SastoDeal, Gyapu) | कार्ड भुक्तानी, connectIPS, डिजिटल वालेट, COD |\n| **C2C** | Consumer-to-Consumer | ग्राहकबाट ग्राहकमा (उदा. Hamrobazar, Facebook Marketplace) | P2P वालेट ट्रान्सफर, मोबाइल बैंकिङ QR |\n| **C2B** | Consumer-to-Business | फ्रिल्यान्सरले कम्पनीलाई सेवा (उदा. Upwork, Fiverr, फोटोग्राफी) | अन्तर्राष्ट्रिय रेमिट्यान्स, स्विफ्ट, विदेशी मुद्रा खाता |\n| **B2G** | Business-to-Government | ठेकेदारले सरकारलाई आपूर्ति (उदा. e-GP सार्वजनिक खरिद पोर्टल) | अनलाइन बिड बन्ड (Bid Bond), राजस्व दाखिला |\n| **G2C** | Government-to-Citizen | सरकारबाट नागरिकलाई सेवा (उदा. नागरिक एप, लाइसेन्स/राहदानी दस्तुर) | सरकारी राजस्व भुक्तानी गेटवे, सामाजिक सुरक्षा भत्ता |\n\n---\n\n## ४. भुक्तानी गेटवे तथा प्राविधिक सुरक्षा पूर्वाधार (Payment Gateway & Technical Architecture)\n\n### क. भुक्तानी गेटवेको कार्य प्रणाली (Payment Gateway Architecture)\nभुक्तानी गेटवे ई-कमर्स वेबसाइट र बैंकहरू बीचको सुरक्षित वित्तीय पुल (Financial Bridge) हो। यसमा ४ वटा प्रमुख पक्षहरू संलग्न हुन्छन्:\n1. **मर्चेन्ट (Merchant):** अनलाइन वस्तु वा सेवा बेच्ने व्यवसायी।\n2. **भुक्तानी सेवा प्रदायक (PSP - Payment Service Provider):** eSewa, Khalti, IME Pay, connectIPS जसले ग्राहक इन्टरफेस प्रदान गर्छन्।\n3. **भुक्तानी प्रणाली सञ्चालक (PSO - Payment System Operator):** NCHL, Nepal Payment Solution, Fonepay जसले बैंकहरू बीच अन्तरआवद्धता (Interoperability) गराउँछन्।\n4. **जारीकर्ता बैंक (Issuing Bank) र अधिग्रहणकर्ता बैंक (Acquiring Bank):** ग्राहकको खाता रहेको बैंक र मर्चेन्टको खाता रहेको बैंक।\n\n### ख. प्राविधिक सुरक्षा मापदण्डहरू (Security Protocols)\n- **SSL/TLS 1.3 इन्क्रिप्सन:** प्रयोगकर्ताको ब्राउजर र सर्भर बीच आदानप्रदान हुने सम्पूर्ण डेटालाई २५६-बिट क्रिप्टोग्राफीमार्फत सुरक्षित गरिन्छ।\n- **सार्वजनिक कुञ्जी पूर्वाधार (PKI - Public Key Infrastructure):** डिजिटल हस्ताक्षर (Digital Signature) को प्रमाणीकरणका लागि asymmetric cryptography (Private Key & Public Key) को प्रयोग।\n- **टोकनाइजेसन (Card Tokenization):** ग्राहकको वास्तविक १६ अङ्कको कार्ड नम्बर सर्भरमा सुरक्षित नराखी त्यसको सट्टा एक अद्वितीय डिजिटल टोकन (Token) प्रयोग गर्ने।\n- **3D Secure 2.0 (3DS 2.0):** भिसा र मास्टरकार्डको सुरक्षा मापदण्ड जसले जोखिममा आधारित प्रमाणीकरण (Risk-based Authentication) गर्दछ।\n\n---\n\n## ५. नेपालको कानुनी तथा नीतिगत संरचना (Legal & Regulatory Framework)\n\n### क. विद्युतीय कारोबार ऐन, २०६३ (Electronic Transaction Act, 2063) का प्रमुख व्यवस्थाहरू:\n- **दफा ३:** विद्युतीय अभिलेख (Electronic Records) को कानुनी मान्यता। अदालतमा प्रमाणको रूपमा ग्राह्य हुने।\n- **दफा ४:** डिजिटल हस्ताक्षर (Digital Signature) को वैधानिकता।\n- **दफा १५ र १६:** प्रमाणीकरण नियन्त्रक (Controller of Certifying Authorities - CCA) को काम, कर्तव्य र अधिकार।\n- **दफा ४४:** कम्प्युटर प्रणालीमा अनाधिकृत पहुँच (Unauthorized Access) गरेमा ३ वर्षसम्म कैद वा रु. २ लाखसम्म जरिवाना वा दुवै।\n- **दफा ४५:** कम्प्युटर प्रोग्राम वा डेटा नष्ट वा क्षति गरेमा ३ वर्ष कैद वा रु. २ लाख जरिवाना।\n- **दफा ५१:** कम्प्युटर स्रोत संकेत (Source Code) चोरी वा नष्ट गरेमा ३ वर्ष कैद वा रु. २ लाख जरिवाना।\n- **दफा ५२:** विद्युतीय माध्यमबाट गैरकानुनी सामग्री वा अश्लील सामग्री प्रकाशन गरेमा ५ वर्ष कैद वा रु. १ लाख जरिवाना।\n\n### ख. राष्ट्रिय ई-कमर्स रणनीति, २०७६ (National E-Commerce Strategy 2076):\n- देशव्यापी डिजिटल भुक्तानी पूर्वाधार विस्तार गर्ने।\n- राष्ट्रिय लजिस्टिक्स नीति सुधार गरी दुर्गम क्षेत्रसम्म हुलाक र निजी कुरियर सञ्जाल जोड्ने।\n- ई-कमर्स व्यवसायीहरूलाई एकल बिन्दु सेवा (Single Window System) मार्फत दर्ता र नियमन गर्ने।\n\n---\n\n## ५.१ ई-कमर्सका १० प्रमुख लाभहरू (10 Key Strategic Benefits of E-Commerce)\n\nई-कमर्सले अर्थतन्त्र र बैंकिङ क्षेत्रमा पुर्‍याएका १० प्रमुख फाइदाहरू:\n1. **२४/७/३६५ निरन्तर सेवा (Continuous 24/7 Availability):** भौतिक बैंक तथा पसलको समय सीमा बिना चौबिसै घण्टा जुनसुकै स्थानबाट खरिद-बिक्री तथा डिजिटल भुक्तानी सम्भव।\n2. **सञ्चालन लागतमा भारी कटौती (Drastic Operating Cost Reduction):** भौतिक शाखा, भाडा, फर्निचर र कर्मचारी खर्च बिना कम लागतमा देशव्यापी बजार विस्तार।\n3. **पारदर्शी र औपचारिक अर्थतन्त्र (Formalization & Audit Trail):** प्रत्येक कारोबारको डिजिटल अभिलेख (Audit Trail) रहने हुँदा कर छली नियन्त्रण र भ्याट/आयकर संकलनमा वृद्धि।\n4. **कागजी मुद्रा व्यवस्थापन खर्च बचत (Reduced Cash Logistics Cost):** भौतिक नगद छपाई, ढुवानी, सुरक्षा र पुराना नोट नष्ट गर्ने राष्ट्र बैंक तथा वाणिज्य बैंकहरूको खर्चमा ठूलो बचत।\n5. **वित्तीय समावेशीकरण तथा ग्रामीण पहुँच (Financial Inclusion):** दुर्गम भेगका नागरिकले पनि राजधानीका वस्तु तथा वित्तीय सेवाहरू आफ्नै मोबाइलमार्फत खरिद गर्न सक्ने।\n6. **द्रुत पुँजी चक्रण (Accelerated Working Capital Velocity):** तत्काल फन्ड ट्रान्सफर र रियल-टाइम सेटलमेन्टले व्यवसायको नगद प्रवाह र पुँजी चक्रण तीव्र बनाउने।\n7. **व्यापारको असीमित भौगोलिक पहुँच (Global Market Reach):** स्थानीय उत्पादन (हस्तकला, चिया, कफी) लाई राष्ट्रिय तथा अन्तर्राष्ट्रिय बजारसँग सहजै जोड्न सकिने।\n8. **डेटामा आधारित कर्जा प्रवाह (Data-Driven Digital Lending):** ई-कमर्स कारोबारको डिजिटल हिस्ट्री र कारोबार भोल्युमलाई आधार मानेर विना धितो चालू पुँजी कर्जा (Cash Flow-based Lending) प्रवाह गर्न सकिने।\n9. **उपभोक्ता सन्तुष्टि र विकल्पको विविधता (Consumer Convenience & Choice):** घरमै बसी प्रतिस्पर्धी मूल्यमा वस्तु तुलना, गुणस्तर समीक्षा र छिटो डेलिभरीको सुविधा।\n10. **नवीन रोजगारी तथा स्टार्टअप इकोसिस्टम (Job Creation & Gig Economy):** डिजिटल मार्केटिङ, लजिस्टिक्स, डेलिभरी राइडर, वेब डेभलपमेन्ट र फिनटेक क्षेत्रमा लाखौँ स्वरोजगार सिर्जना।\n\n---\n\n## ६. ई-कमर्स बैंकिङका १० प्रमुख जोखिमहरू र बहुस्तरीय समाधान (10 Major Risks & Mitigation)\n\n1. **फिसिङ तथा सामाजिक इन्जिनियरिङ (Phishing & Social Engineering):**\n   - *जोखिम:* नक्कली वेबसाइट वा म्यासेज पठाएर प्रयोगकर्ताको पासवर्ड, पिन वा OTP चोर्नु।\n   - *समाधान:* बहु-चरणीय प्रमाणीकरण (MFA), बैंकबाट कहिल्यै OTP नमागिने जनचेतना, र एन्टी-फिसिङ फिल्टर।\n2. **चार्जDefault र रिफण्ड विवाद (Chargeback & Payment Dispute):**\n   - *जोखिम:* सामान प्राप्त नभएको वा नक्कली परेको भन्दै ग्राहकले बैंकबाट रकम फिर्ता दाबी गर्नु।\n   - *समाधान:* बलियो एस्क्रो मेकानिज्म (Escrow Mechanism), डेलिभरीको डिजिटल प्रमाण (Digital POD)।\n3. **कार्ड विवरण चोरी (Card Credential Theft / Man-in-the-Middle):**\n   - *जोखिम:* भुक्तानीका बेला कार्ड नम्बर र CVV ह्याकरको हातमा पर्नु।\n   - *समाधान:* EMVCo टोकनाइजेसन, PCI-DSS प्रमाणीकरण अनिवार्य गर्नु।\n4. **अनाधिकृत सेवा अवरोध आक्रमण (DDoS Attacks):**\n   - *जोखिम:* ट्राफिकको बाढी ल्याएर ई-कमर्स तथा भुक्तानी गेटवे सर्भर डाउन गरिदिनु।\n   - *समाधान:* Cloudflare/Akamai जस्ता DDoS प्रोटेक्सन, लोड ब्यालेन्सर र रिडन्डन्ट सर्भर।\n5. **व्यक्तिगत गोपनीयता तथा डाटा लिक (Privacy Breach):**\n   - *जोखिम:* ग्राहकको खरिद इतिहास, ठेगाना र फोन नम्बर बाहिरिनु (वैयक्तिक गोपनीयता ऐन २०७५ को उल्लंघन)।\n   - *समाधान:* डाटा इन्क्रिप्सन (AES-256), रोल-बेस्ड एक्सेस कन्ट्रोल (RBAC), र नियमित IS Audit।\n6. **नक्कली तथा गुणस्तरहीन वस्तु बिक्री (Counterfeit Goods):**\n   - *जोखिम:* उपभोक्ता ठगिने र ई-कमर्स प्रणालीमाथिको विश्वसनीयता गुम्ने।\n   - *समाधान:* उपभोक्ता संरक्षण ऐन २०७५ बमोजिम विक्रेताको अनिवार्य KYC दर्ता र वस्तु फिर्ता नीति (Return Policy)।\n7. **सम्पत्ति शुद्धीकरण तथा साइबर ठगी (AML/CFT & Illicit Financing):**\n   - *जोखिम:* अवैध कालोधनलाई ई-कमर्स कारोबारमा खरिद देखाएर सेतो बनाउने प्रयास।\n   - *समाधान:* NRB को goAML प्रणालीसँग इन्टिग्रेशन, शंकास्पद कारोबार प्रतिवेदन (STR/CTR) अनिवार्य।\n8. **लजिस्टिक्स तथा क्यास अन डेलिभरी (COD) जोखिम:**\n   - *जोखिम:* नगद कारोबारमा पैसा लुटिने, हराउने वा डेलिभरी ब्वायले हिनामिना गर्ने।\n   - *समाधान:* Dynamic QR मार्फत डेलिभरीको समयमा अनिवार्य डिजिटल भुक्तानी (Digital COD) प्रवर्द्धन।\n9. **नियामकीय अनुपालन तथा कानुनी अस्पष्टता (Regulatory Non-Compliance Risk):**\n   - *जोखिम:* ई-कमर्स विधेयक र विदेशी विनिमय नियमहरूको परिपालना नहुँदा कानुनी कारबाही हुनु।\n   - *समाधान:* वाणिज्य मन्त्रालय र राष्ट्र बैंकको नियमन ढाँचा अनुसार अनिवार्य इजाजत र वार्षिक लेखापरीक्षण।\n10. **सप्लाई चेन र प्रणालीगत अन्तरसम्बन्ध जोखिम (Operational Supply Chain Breakdown):**\n    - *जोखिम:* इन्भेन्टरी सफ्टवेयर र भुक्तानी गेटवे बीच एपीआई विच्छेद भई अर्डर रद्द वा दोहोरो भुक्तानी हुनु।\n    - *समाधान:* ९९.९९% अपटाइम सहितको हाइपर-स्केलेबल क्लाउड इन्फ्रास्ट्रक्चर र स्वचालित रिकन्सिलिएसन।\n\n---\n\n## ७. निष्कर्ष र भावी कार्यदिशा (Conclusion & Way Forward)\nविद्युतीय वाणिज्यले नेपालको परम्परागत बजारलाई डिजिटल अर्थतन्त्रमा रूपान्तरण गर्न क्रान्तिकारी भूमिका खेलेको छ। बैंक तथा वित्तीय संस्थाहरूले विश्वसनीय भुक्तानी गेटवे, साइबर सुरक्षा, र ग्रामीण क्षेत्रसम्म लजिस्टिक्स पूर्वाधार विस्तार गर्न सकेमा ई-कमर्स नेपालको समावेशी आर्थिक समृद्धिको प्रमुख संवाहक बन्नेछ।",
    probableExamQuestions: [
      {
        marks: 15,
        questionNe: 'विद्युतीय वाणिज्य (E-Commerce) भन्नाले के बुझिन्छ? यसको सम्पूर्ण प्रक्रियागत प्रवाह (Process Flow) को चर्चा गर्दै ई-कमर्स सञ्चालनमा आउन सक्ने प्रमुख प्राविधिक तथा वित्तीय जोखिमहरू र त्यसको न्यूनीकरणका उपायहरू विस्तृत रूपमा विश्लेषण गर्नुहोस्।',
        questionEn: 'What is E-Commerce? Discuss its end-to-end process flow and critically analyze major technical and financial risks associated with e-commerce operations along with multi-layer mitigation strategies.',
        examLevel: 'NRB / RBB Level 6 / Officer Level',
        modelAnswerFramework: [
          '१. अवधारणा, परिभाषा र पृष्ठभूमि (राष्ट्रिय ई-कमर्स रणनीति २०७६ को सन्दर्भ) (३ अङ्क)',
          '२. १०-चरणीय प्रक्रियागत प्रवाह (ब्राउजिङ देखि भुक्तानी, सेटलमेन्ट र रिभर्स लजिस्टिक्ससम्म) (५ अङ्क)',
          '३. प्रमुख जोखिमहरू (फिसिङ, चार्जब्याक, साइबर आक्रमण, डाटा लिक, COD जोखिम) (४ अङ्क)',
          '४. समाधानका उपायहरू (SSL/PKI, टोकनाइजेसन, 2FA, उपभोक्ता संरक्षण र NRB नियमन) (२ अङ्क)',
          '५. निष्कर्ष र भावी मार्गचित्र (१ अङ्क)'
        ]
      },
      {
        marks: 10,
        questionNe: 'नेपालमा विद्युतीय कारोबार ऐन, २०६३ का प्रमुख विशेषताहरू उल्लेख गर्दै ई-कमर्स प्रवर्द्धनमा बैंकिङ प्रणालीको भूमिका प्रस्ट पार्नुहोस्।',
        questionEn: 'Highlight the key features of the Electronic Transaction Act, 2063 in Nepal and elucidate the role of the banking system in promoting e-commerce.',
        examLevel: 'NRB / RBB Level 5 & Assistant Director Level',
        modelAnswerFramework: [
          'विद्युतीय कारोबार ऐन २०६३ को पृष्ठभूमि र उद्देश्य (२ अङ्क)',
          'ऐनका प्रमुख दफाहरू (दफा ३, ४, १५, १६ र ४४ देखि ५९ सम्मका साइबर अपराध नियन्त्रण) (४ अङ्क)',
          'ई-कमर्समा बैंकको भूमिका (भुक्तानी गेटवे, कार्ड स्वीच, 2FA, एस्क्रो खाता) (३ अङ्क)',
          'निष्कर्ष (१ अङ्क)'
        ]
      }
    ]
  },

  // =========================================================================
  // TOPIC 3: Electronic Payment Systems (EPS) - 10-15 Mark Depth
  // =========================================================================
  {
    id: 'electronic-payment-system-eps',
    topicNumber: 3,
    titleNe: 'विद्युतीय भुक्तानी प्रणाली (Electronic Payment System - EPS)',
    titleEn: 'Electronic Payment System (EPS)',
    subtitleNe: 'RTGS, NCHL (connectIPS, NPI), NepalQR, साइबर सुरक्षा निर्देशिका २०८० र वित्तीय समावेशीकरण',
    categoryTag: 'भुक्तानी प्रणाली तथा फिनटेक',
    paperReference: 'NRB / Banking / Loksewa - Paper I & II (१०-१५ अङ्क)',
    examWeightage: '१०-१५ अङ्क (अत्यन्त महत्त्वपूर्ण)',
    readTime: '१५ मिनेट',
    pdfFilename: 'Banking_Notes_Topic_3_Electronic_Payment_System_EPS.pdf',
    summaryNe: 'विद्युतीय भुक्तानी प्रणाली (EPS) ले भौतिक मुद्राको प्रयोग बिना कम्प्युटर, मोबाइल, इन्टरनेट र कार्डका माध्यमबाट वित्तीय दायित्व फछ्र्यौट गर्ने संरचनालाई जनाउँछ। नेपाल राष्ट्र बैंकले भुक्तानी तथा फछ्र्यौट ऐन २०७५ बमोजिम RTGS, NCHL, connectIPS र NepalQR मार्फत सुरक्षित नगदरहित अर्थतन्त्र प्रवर्द्धन गर्दछ।',
    definitionCard: {
      termNe: 'विद्युतीय भुक्तानी प्रणाली (EPS)',
      termEn: 'Electronic Payment System (EPS)',
      definitionNe: 'कागजी मुद्रा वा भौतिक चेकको सट्टा कम्प्युटर सञ्जाल, टेलिकम्युनिकेसन, चिप कार्ड, डिजिटल वालेट तथा इन्टरनेट प्रविधिको माध्यमबाट क्रेताबाट बिक्रेता वा एक वित्तीय संस्थाबाट अर्को संस्थामा रकम स्थानान्तरण गरी आर्थिक दायित्व राफसाफ तथा फछ्र्यौट गर्ने सम्पूर्ण प्रविधि, सञ्जाल र कानुनी संरचनालाई विद्युतीय भुक्तानी प्रणाली भनिन्छ।',
      source: 'भुक्तानी तथा फछ्र्यौट ऐन, २०७५ दफा २(ज)'
    },
    statutoryCard: {
      actTitleNe: 'सम्बन्धित ऐन, कानुन तथा संस्थागत व्यवस्थाहरू',
      clauses: [
        { clause: 'भुक्तानी तथा फछ्र्यौट ऐन, २०७५', title: 'मूल भुक्तानी ऐन', description: 'भुक्तानी प्रणाली सञ्चालन, क्लियरिङ, सेटलमेन्ट, इजाजतपत्र, नियमन तथा कारबाहीको सर्वाधिकार राष्ट्र बैंकलाई।' },
        { clause: 'भुक्तानी तथा फछ्र्यौट विनियमावली, २०७७', title: 'PSP र PSO मापदण्ड', description: 'वालेट (PSP) का लागि चुक्ता पुँजी रु. ५-१० करोड र स्वीच (PSO) का लागि रु. ४०-५० करोड अनिवार्य।' },
        { clause: 'NRB साइबर सुरक्षा निर्देशिका, २०८०', title: 'सूचना प्रविधि सुरक्षा', description: '२४/७ SOC, वार्षिक IS Audit, BCP/DR (RTO < २ घण्टा, RPO < १५ मिनेट) र VAPT अनिवार्य।' },
        { clause: 'नेपाल क्युआर मापदण्ड (NepalQR)', title: 'अन्तरआवद्ध QR फ्रेमवर्क', description: 'सबै बैंक र वालेटबाट एउटै QR स्क्यान गरी तत्काल भुक्तानी गर्न सकिने राष्ट्र बैंकको मापदण्ड।' },
        { clause: 'NRB ऐन, २०५८ दफा ४(च)', title: 'केन्द्रीय बैंकको उद्देश्य', description: 'सुरक्षित, स्वस्थ तथा सक्षम भुक्तानी प्रणालीको विकास तथा प्रवर्द्धन गर्ने उद्देश्य।' }
      ]
    },
    keyTakeaways: [
      'RTGS पूर्वाधार: राष्ट्र बैंकद्वारा सञ्चालित उच्च मूल्य (रु. २ लाख माथि) को रियल-टाइम ग्रस सेटलमेन्ट।',
      'NCHL इकोसिस्टम: connectIPS, National Payments Interface (NPI), NCHL-ECC, NCHL-IPS, र NepalPay।',
      'NepalQR मानकीकरण: EMVCo मापदण्डमा आधारित अन्तरआवद्ध (Interoperable) युनिफाइड क्युआर।',
      'NRB सूचना प्रविधि तथा साइबर सुरक्षा निर्देशिका २०८० का ५ अनिवार्य सर्तहरू (SOC, IS Audit, BCP/DR, VAPT, Incident Response)।',
      'वित्तीय समावेशीकरण सूचक: ७५३ स्थानीय तहमा वाणिज्य बैंक, २.४ करोड मोबाइल बैंकिङ र २.१ करोड वालेट खाता।'
    ],
    comparisonTable: {
      titleNe: 'नेपालका प्रमुख विद्युतीय भुक्तानी संयन्त्रहरूको विस्तृत तुलनात्मक तालिका',
      column1Header: 'भुक्तानी संयन्त्र',
      column2Header: 'सञ्चालक / पूर्वाधार',
      column3Header: 'कारोबारको प्रकृति र समय',
      rows: [
        {
          parameterNe: 'RTGS (Real-Time Gross Settlement)',
          parameterEn: 'RTGS System',
          column1Value: 'नेपाल राष्ट्र बैंक स्वयंले सञ्चालन गर्दछ।',
          column2Value: 'उच्च मूल्य (रु. २ लाख माथि), तत्काल व्यक्तिगत फछ्र्यौट (Gross Basis)।'
        },
        {
          parameterNe: 'connectIPS',
          parameterEn: 'connectIPS e-Payment',
          column1Value: 'नेपाल क्लियरिङ्ग हाउस लिमिटेड (NCHL)।',
          column2Value: 'खाताबाट सिधै खातामा (A2A), रियल-टाइम, प्रति कारोबार रु. २० लाखसम्म (वेब)।'
        },
        {
          parameterNe: 'NCHL-IPS',
          parameterEn: 'Interbank Payment System',
          column1Value: 'नेपाल क्लियरिङ्ग हाउस लिमिटेड (NCHL)।',
          column2Value: 'ब्याच फछ्र्यौट (Non-real time), तलब, लाभांश, सरकारी भुक्तानी आदि।'
        },
        {
          parameterNe: 'इलेक्ट्रोनिक चेक क्लियरिङ (NCHL-ECC)',
          parameterEn: 'Electronic Check Clearing',
          column1Value: 'नेपाल क्लियरिङ्ग हाउस लिमिटेड (NCHL)।',
          column2Value: 'चेकको डिजिटल इमेजमार्फत सोही दिन वा अर्को दिन क्लियरिङ।'
        },
        {
          parameterNe: 'NepalQR / Fonepay QR',
          parameterEn: 'Interoperable QR Payment',
          column1Value: 'Fonepay, NCHL (NepalQR) र बैंकहरू।',
          column2Value: 'खुद्रा खुद्रे भुक्तानी, मोबाइल बैंकिङ वा वालेटबाट स्क्यान गरी तुरुन्त भुक्तानी।'
        }
      ]
    },
    markdownContent: "# विद्युतीय भुक्तानी प्रणाली (Electronic Payment System - EPS) - १०-१५ अङ्क विशेष\n\n## १. अवधारणा, कानुनी परिभाषा र महत्त्व (Concept & Statutory Basis)\nविद्युतीय भुक्तानी प्रणाली (EPS) भन्नाले कागजी मुद्रा वा भौतिक चेकको सट्टा **इलेक्ट्रोनिक माध्यमहरू (कम्प्युटर नेटवर्क, टेलिकम्युनिकेसन, चिप कार्ड, मोबाइल फोन, QR कोड)** को प्रयोग गरी क्रेताबाट बिक्रेता वा एक पक्षबाट अर्को पक्षमा रकम स्थानान्तरण गर्ने सम्पूर्ण प्रविधि, पूर्वाधार र कानुनी संरचनालाई बुझाउँछ।\n\n> **कानुनी परिभाषा (भुक्तानी तथा फछ्र्यौट ऐन, २०७५):**\n> \"भुक्तानी प्रणाली भन्नाले रकम स्थानान्तरण गर्ने, भुक्तानी आदेश जारी वा कार्यान्वयन गर्ने, राफसाफ (Clearing) गर्ने र फछ्र्यौट (Settlement) गर्ने कार्यमा प्रयोग हुने सम्पूर्ण संयन्त्र र कानुनी व्यवस्थालाई सम्झनुपर्दछ।\"\n> — **दफा २(ज), भुक्तानी तथा फछ्र्यौट ऐन, २०७५**\n\n---\n\n## २. नेपालको राष्ट्रिय भुक्तानी प्रणालीको मूल संरचना (National Payment Architecture)\n\nनेपालको भुक्तानी प्रणालीलाई मूलतः दुई भागमा विभाजन गरिएको छ:\n1. **उच्च मूल्य तथा प्रणालीगत महत्त्वपूर्ण भुक्तानी (Systemically Important Payment Systems - SIPS / RTGS)**\n2. **खुद्रे भुक्तानी प्रणाली (Retail Payment Systems - RPS)**\n\n**नेपाल राष्ट्र बैंक (NRB)**\n├── **RTGS (Real Time Gross Settlement)** (उच्च मूल्य रु. २ लाख माथि - वाणिज्य बैंकहरू र केन्द्रीय खाता)\n└── **खुद्रे भुक्तानी प्रणाली (RPS)**\n    ├── **NCHL इकोसिस्टम:** connectIPS, NPI, NCHL-ECC, NCHL-IPS, NepalPay QR\n    └── **निजी स्वीच तथा वालेट:** Fonepay, eSewa, Khalti, IME Pay, POS Network\n\n---\n\n## ३. RTGS प्रणालीको विस्तृत कार्यप्रणाली (RTGS Architecture)\n- **सञ्चालक:** नेपाल राष्ट्र बैंक (भुक्तानी प्रणाली विभाग)।\n- **कारोबारको न्यूनतम सीमा:** सामान्यतया रु. २ लाख वा सोभन्दा माथिका ठूला कारोबार (सरकारी वा वित्तीय बजार कारोबारमा सीमा लागू नहुन सक्छ)।\n- **विशेषताहरू:**\n  1. **रियल-टाइम (Real-Time):** भुक्तानी आदेश प्राप्त हुनासाथ कुनै पर्खाइ बिना तुरुन्त फछ्र्यौट।\n  2. **ग्रस सेटलमेन्ट (Gross Settlement):** एक-एक कारोबारको छुट्टाछुट्टै फछ्र्यौट, कुनै नेटिङ (Netting) नगरिने।\n  3. **अपरिवर्तनीय फछ्र्यौट (Settlement Finality):** राष्ट्र बैंकको खातामा रकम ट्रान्सफर भइसकेपछि उक्त कारोबार रद्द वा उल्ट्याउन नमिल्ने।\n  4. **प्रणालीगत जोखिम न्यूनीकरण:** ठूला रकमको फछ्र्यौटमा कुनै बैंक टाट पल्टिए पनि अर्को बैंक जोखिममा नपर्ने।\n\n---\n\n## ४. नेपाल क्लियरिङ्ग हाउस (NCHL) को भुक्तानी इकोसिस्टम\nNCHL नेपालको राष्ट्रिय भुक्तानी पूर्वाधार निर्माण गर्ने संयुक्त संस्था (Public-Private Partnership - NRB र बैंकहरूको लगानी) हो। यसका प्रमुख प्रणालीहरू:\n\n1. **connectIPS e-Payment:**\n   - ग्राहकको बैंक खाताबाट अर्को खातामा सिधै रकम स्थानान्तरण (Account-to-Account)।\n   - सीमा: वेबमार्फत रु. २० लाख प्रति कारोबार र मोबाइल एपमार्फत रु. २ लाख प्रति कारोबार।\n2. **National Payments Interface (NPI):**\n   - ओपन एपीआई (Open API) प्लेटफर्म जसले सरकारी राजस्व, सामाजिक सुरक्षा कोष, नागरिक लगानी कोष, र बीमा कम्पनीहरूलाई बैंकिङ प्रणालीसँग जोड्दछ।\n3. **NCHL-ECC (Electronic Cheque Clearing):**\n   - चेकको भौतिक ओसारपसार नगरी चेकको स्क्यान गरिएको डिजिटल इमेज र MICR डेटाका आधारमा सोही दिन चेक क्लियरिङ गर्ने प्रणाली।\n4. **NCHL-IPS (Interbank Payment System):**\n   - गैर-रियल टाइम ब्याच प्रणाली। ठूलो परिमाणमा तलब वितरण, लाभांश भुक्तानी, र नियमित किस्ता भुक्तानी।\n5. **नेपालपे क्युआर (NepalPay QR):**\n   - राष्ट्रिय QR पूर्वाधार जसले विभिन्न बैंक र वालेटहरू बीच अन्तरआवद्धता सुनिश्चित गर्दछ।\n\n---\n\n## ५. नेपाल क्युआर मापदण्ड (NepalQR Standardization)\nनेपाल राष्ट्र बैंकले जारी गरेको **NepalQR Specifications** ले देहायका सुधार ल्याएको छ:\n- **अन्तरआवद्धता (Interoperability):** कुनै पनि बैंकको मोबाइल बैंकिङ वा वालेट एपबाट जुनसुकै बैंक/वालेटको QR स्क्यान गरी भुक्तानी गर्न सकिने।\n- **EMVCo मापदण्ड:** अन्तर्राष्ट्रिय EMVCo स्तरको सुरक्षा र डाटा संरचना।\n- **मर्चेन्ट एग्रिगेशन (Merchant Aggregator Model):** एउटै पसलमा धेरै कम्पनीका QR स्ट्यान्डी झुन्ड्याउनु नपर्ने, एउटै एकीकृत QR ले सबै कारोबार धान्ने।\n- **स्थिर र गतिशील QR (Static vs Dynamic QR):**\n  - *Static QR:* पसलमा टाँसिएको स्थायी कोड जसमा ग्राहकले आफै रकम प्रविष्ट गर्छन्।\n  - *Dynamic QR:* बिलिङ मेसिन वा कम्प्युटरले प्रत्येक बिलका लागि रकमसहित छुट्टै निकाल्ने एकपटक मात्र प्रयोग हुने कोड।\n\n---\n\n## ६. NRB सूचना प्रविधि तथा साइबर सुरक्षा निर्देशिका २०८० (Cyber Security Guidelines)\nनेपाल राष्ट्र बैंकले सम्पूर्ण बैंक तथा वित्तीय संस्थाहरू र भुक्तानी प्रदायकहरूका लागि ५ अनिवार्य साइबर सुरक्षा सर्तहरू लागू गरेको छ:\n1. **२४/७ सुरक्षा सञ्चालन केन्द्र (Security Operations Center - SOC):** वित्तीय नेटवर्कमा हुने साइबर आक्रमण, मालवेयर र अनधिकृत पहुँचलाई २४ सै घण्टा रियल-टाइम निगरानी गर्ने संयन्त्र।\n2. **वार्षिक सूचना प्रणाली लेखापरीक्षण (IS Audit):** अन्तर्राष्ट्रिय मान्यता प्राप्त CISA वा CISSP प्रमाणित स्वतन्त्र बाह्य लेखापरीक्षकबाट अनिवार्य वार्षिक IS Audit गराउनुपर्ने।\n3. **व्यवसाय निरन्तरता योजना र विपद् पुनरुत्थान (BCP & DR):**\n   - मुख्य डाटा सेन्टर (DC) भन्दा कम्तीमा ५० कि.मी. टाढा विपद् पुनरुत्थान केन्द्र (Disaster Recovery - DR Site) हुनुपर्ने।\n   - **RTO (Recovery Time Objective):** प्रणाली अवरुद्ध भएको २ घण्टाभित्र सेवा पुनः सञ्चालन हुनुपर्ने।\n   - **RPO (Recovery Point Objective):** डेटा नोक्सानी अधिकतम १५ मिनेटभन्दा बढी हुन नहुने।\n4. **नियमित कमजोरी परीक्षण र प्रवेश परीक्षण (VAPT):** वर्षमा कम्तीमा दुई पटक बाह्य साइबर विज्ञमार्फत Vulnerability Assessment & Penetration Testing (VAPT) गराउनुपर्ने।\n5. **घटना प्रतिक्रिया योजना (Incident Response Team - CSIRT):** साइबर सुरक्षा घटना घटेको २४ घण्टाभित्र राष्ट्र बैंकलाई अनिवार्य जानकारी दिनुपर्ने।\n\n---\n\n## ७. नेपालमा वित्तीय समावेशीकरण र डिजिटल भुक्तानीको स्थिति (Financial Inclusion Metrics)\n- **भौगोलिक पहुँच:** नेपालका कुल ७५३ वटै स्थानीय तहमा वाणिज्य बैंकका शाखाहरू पुगेका छन्।\n- **मोबाइल बैंकिङ खाता:** २ करोड ४० लाख भन्दा बढी।\n- **डिजिटल वालेट खाता:** २ करोड १० लाख भन्दा बढी।\n- **QR कारोबारको वृद्धि:** मासिक रु. ५० अर्ब भन्दा बढीको खुद्रे भुक्तानी QR मार्फत भइरहेको छ, जसले भौतिक नगदको प्रयोग (Cash Velocity) उल्लेखनीय रूपमा घटाएको छ।\n- **सरकारी कारोबार:** ९०% भन्दा बढी सरकारी राजस्व तथा सामाजिक सुरक्षा भत्ता डिजिटल भुक्तानी प्रणालीमा आबद्ध।\n\n---\n\n## ७.१ विद्युतीय भुक्तानी प्रणालीका १० प्रमुख लाभहरू (10 Key Benefits of EPS)\n\n1. **तत्काल रकमान्तर र फछ्र्यौट (Real-Time Settlement):** सेकेन्डभरमै एक खाताबाट अर्को खातामा रकम स्थानान्तरण भई कारोबार राफसाफ हुने।\n2. **बैंक शाखाको भीडभाड नियन्त्रण (Decongestion of Branches):** चेक साट्न वा नगद झिक्न बैंक धाउनुपर्ने बाध्यता अन्त्य, ९०% भन्दा बढी खुद्रे कारोबार डिजिटल च्यानलमा।\n3. **नगद सञ्चालन लागतमा अत्यधिक बचत (Huge Savings in Cash Handling):** नोट छपाई, बैंक नोट काउन्टिङ, स्ट्रङरुम भण्डारण र सुरक्षा ढुवानी खर्चमा अरबौँको बचत।\n4. **पारदर्शिता र कर प्रणालीमा सुधार (Enhanced Transparency & Tax Audit):** प्रत्येक भुक्तानीको डिजिटल प्रमाण रहने हुँदा बिलविहीन अनौपचारिक कारोबारको अन्त्य।\n5. **सरकारी राजस्व संकलनमा दक्षता (Efficient Government Collections):** नागरिक एप तथा अनलाइन पोर्टलबाट राजस्व, भन्सार महसुल, ट्राफिक जरिवाना तत्काल दाखिला।\n6. **अन्तर्राष्ट्रिय विप्रेषणको सहज वितरण (Seamless Remittance Distribution):** विदेशबाट पठाएको रेमिट्यान्स सोझै मोबाइल खाता वा वालेटमा तत्काल जम्मा।\n7. **२४सै घण्टा अन्तरबैंकिङ कारोबार (Interbank 24/7 Operations):** सार्वजनिक बिदा वा बैंक बन्द भएको समयमा पनि connectIPS र QR मार्फत कारोबार चालु।\n8. **साना व्यापारीहरूको वित्तीय सशक्तिकरण (Empowering MSMEs):** केवल मोबाइल र QR स्ट्यान्डीको भरमा विना कुनै लागत डिजिटल भुक्तानी स्वीकार गर्ने सुविधा।\n9. **सम्पत्ति शुद्धीकरण नियन्त्रण (AML/CFT Monitoring):** ठूला नगद कारोबार निरुत्साहित भई वित्तीय गुप्तचर निकाय (FIU) द्वारा शंकास्पद कारोबारको तत्काल ट्र्याकिङ।\n10. **डिजिटल नेपाल फ्रेमवर्क २०७६ को प्राप्ति (Realization of Digital Nepal):** राष्ट्रिय डिजिटल अर्थतन्त्र, क्यासलेस सोसाइटी र वित्तीय प्रविधिको तीव्र रूपान्तरण।\n\n---\n\n## ८. विद्युतीय भुक्तानीका १० प्रमुख साइबर तथा प्रणालीगत जोखिमहरू (10 Major Cyber & Systemic Risks & Defense)\n\n1. **प्रणालीगत तरलता जोखिम (Systemic Liquidity Risk):**\n   - *जोखिम:* सदस्य बैंकको खातामा पर्याप्त मौज्दात नहुँदा क्लियरिङ प्रक्रिया अड्किने।\n   - *उपाय:* RTGS मा अनिवार्य Intra-day Liquidity Facility (ILF) र सेक्युरिटिज धितो व्यवस्था।\n2. **वित्तीय स्वीच तथा सर्भर ह्याकिङ (Switch & API Gateway Intrusion):**\n   - *जोखिम:* कोर बैंकिङ वा कार्ड स्वीचमा अनधिकृत घुसपैठ गरी अनपेक्षित फन्ड ट्रान्सफर।\n   - *उपाय:* हार्डवेयर सेक्युरिटी मोड्युल (HSM), नेटवर्क सेग्मेन्टेसन, र २४/७ SOC निगरानी।\n3. **सिम स्वापिङ र ओटीपी चोरी (SIM Swap & Man-in-the-Middle):**\n   - *जोखिम:* ग्राहकको टेलिकम सिम क्लोन गरी 2FA OTP कब्जा गरेर खाता रित्याउनु।\n   - *उपाय:* टेलिकम-बैंक रियल-टाइम सिम भेरिफिकेसन एपीआई र बायोमेट्रिक एप प्रमाणीकरण।\n4. **डीडीओएस आक्रमण (DDoS Attacks on Payment Nodes):**\n   - *जोखिम:* पिक आवर (दसैँ, तलब आउने दिन) मा भुक्तानी सर्भरमा अत्यधिक ट्राफिक पठाएर सेवा ठप्प पार्नु।\n   - *उपाय:* बहु-स्तरीय CDN, DDoS स्क्रबिङ सेन्टर, र ब्यान्डविथ अटो-स्केलिङ।\n5. **मालवेयर तथा र्‍यानसमवेयर आक्रमण (Ransomware & Zero-Day Exploits):**\n   - *जोखिम:* बैंकको आन्तरिक डेटाबेस इन्क्रिप्ट गरी फिरौती माग्ने र प्रणाली बन्द गर्ने।\n   - *उपाय:* एयर-ग्याप्ड ब्याकअप (Air-gapped Backups), EDR सोलुसन, र नियमित VAPT।\n6. **नक्कली QR र म्यानिपुलेसन (QR Code Tampering):**\n   - *जोखिम:* पसलको ओरिजिनल QR माथि धोकेबाजले आफ्नै खाताको QR स्टिकर टाँसी रकम डाइभर्ट गर्नु।\n   - *उपाय:* डायनामिक बिलिङ QR, अडियो स्पिकर/भ्वाइस बक्स अलर्ट, र व्यापारी प्रमाणीकरण।\n7. **डाटा सुरक्षा तथा गोपनीयता उल्लंघन (Customer Data Breach):**\n   - *जोखिम:* प्रयोगकर्ताको व्यक्तिगत र वित्तीय डाटा डार्क वेबमा लिक हुनु।\n   - *उपाय:* डाटा रेस्ट र ट्रान्जिटमा AES-256 इन्क्रिप्सन तथा PCI-DSS पालना।\n8. **अन्तर-सञ्चालन विफलता (Interoperability Network Outage):**\n   - *जोखिम:* NCHL वा टेलिकम इन्टरनेट ब्याकबोन फेल हुँदा देशव्यापी कार्ड/QR भुक्तानी अवरुद्ध।\n   - *उपाय:* रिडन्डन्ट अप्टिकल फाइबर नेटवर्क र स्वचालित डिजास्टर रिकभरी (DR) फेलओभर।\n9. **प्रविधि निरक्षरता र सोसल इन्जिनियरिङ (Social Engineering Fraud):**\n   - *जोखिम:* चिठ्ठा परेको वा बैंक कर्मचारी भन्दै सोझा ग्राहकलाई खाताको पिन/पासवर्ड माग्नु।\n   - *उपाय:* बैंकहरूद्वारा लगातार राष्ट्रव्यापी जनचेतना अभियान र ठगी अनुसन्धान सेल।\n10. **तेस्रो पक्ष भेन्डर जोखिम (Third-Party Vendor & Supply Chain Risk):**\n    - *जोखिम:* सफ्टवेयर भेन्डर वा विदेशी क्लाउड प्रोभाइडरको कमजोरीबाट बैंकिङ प्रणालीमा साइबर छिद्र बन्नु।\n    - *उपाय:* कडा SLA, भेन्डर सेक्युरिटी अडिट, र स्थानीय स्तरमा डाटा होस्टिङ प्राथमिकता।\n\n---\n\n## ९. निष्कर्ष (Conclusion)\nविद्युतीय भुक्तानी प्रणाली आधुनिक अर्थतन्त्रको स्नायु प्रणाली हो। नेपाल राष्ट्र बैंकले सुरक्षित पूर्वाधार, कडा साइबर सुरक्षा मापदण्ड र अन्तरआवद्धता प्रवर्द्धन गरेर नेपाललाई पूर्ण नगदरहित (Cashless) र पारदर्शी अर्थतन्त्रतर्फ उन्मुख गराएको छ।",
    probableExamQuestions: [
      {
        marks: 15,
        questionNe: 'विद्युतीय भुक्तानी प्रणाली (EPS) भन्नाले के बुझिन्छ? नेपालको राष्ट्रिय भुक्तानी प्रणालीमा RTGS र NCHL को संरचनात्मक भूमिका विश्लेषण गर्दै विद्युतीय भुक्तानी सुरक्षित बनाउन नेपाल राष्ट्र बैंकको साइबर सुरक्षा निर्देशिकाका प्रमुख व्यवस्थाहरू चर्चा गर्नुहोस्।',
        questionEn: 'What is an Electronic Payment System (EPS)? Analyze the structural roles of RTGS and NCHL in Nepals national payment ecosystem and elucidate key provisions of NRB Cyber Security Directives to safeguard electronic transactions.',
        examLevel: 'NRB / RBB Level 6 / Officer Level',
        modelAnswerFramework: [
          '१. EPS को अवधारणा र कानुनी परिभाषा (भुक्तानी ऐन २०७५) (३ अङ्क)',
          '२. RTGS को कार्यप्रणाली र महत्त्व (३ अङ्क)',
          '३. NCHL का प्रमुख संयन्त्रहरू (connectIPS, NPI, ECC, NepalPay) (३ अङ्क)',
          '४. NRB साइबर सुरक्षा निर्देशिका २०८० का प्रावधानहरू (SOC, IS Audit, BCP/DR, VAPT) (४ अङ्क)',
          '५. वित्तीय समावेशीकरणमा योगदान र निष्कर्ष (२ अङ्क)'
        ]
      },
      {
        marks: 10,
        questionNe: 'नेपाल क्युआर मापदण्ड (NepalQR Specifications) को आवश्यकता किन पर्‍यो? यसले खुद्रे भुक्तानी प्रणाली र वित्तीय समावेशीकरणमा पारेको प्रभाव स्पष्ट पार्नुहोस्।',
        questionEn: 'Why was NepalQR Standardization required? Explain its impact on retail payment systems and financial inclusion in Nepal.',
        examLevel: 'NRB Level 5 & Assistant Director Level',
        modelAnswerFramework: [
          'NepalQR को अवधारणा र पृष्ठभूमि (२ अङ्क)',
          'अन्तरआवद्धता (Interoperability) र मर्चेन्ट एग्रिगेशनको आवश्यकता (३ अङ्क)',
          'खुद्रे भुक्तानी र वित्तीय समावेशीकरणमा परेको प्रभाव (४ अङ्क)',
          'निष्कर्ष (१ अङ्क)'
        ]
      }
    ]
  },

  // =========================================================================
  // TOPIC 4: Virtual Currency & CBDC - 10-15 Mark Comprehensive Depth
  // =========================================================================
  {
    id: 'virtual-currency-and-cbdc',
    topicNumber: 4,
    titleNe: 'भर्चुअल मुद्रा र केन्द्रीय बैंक डिजिटल मुद्रा (CBDC)',
    titleEn: 'Virtual Currency and CBDC',
    subtitleNe: 'ब्लकचेन प्रविधि, क्रिप्टो vs CBDC, NRB कन्सेप्ट पेपर, ७ विश्वव्यापी अभ्यास र प्रतिबन्धका आधारहरू',
    categoryTag: 'उदीयमान प्रविधि तथा मौद्रिक अर्थशास्त्र',
    paperReference: 'NRB / Banking / Loksewa - Paper I & II (१०-१५ अङ्क)',
    examWeightage: '१०-१५ अङ्क (समसामयिक महत्त्वपूर्ण)',
    readTime: '१५ मिनेट',
    pdfFilename: 'Banking_Notes_Topic_4_Virtual_Currency_and_CBDC.pdf',
    summaryNe: 'भर्चुअल मुद्रा (क्रिप्टोकरेन्सी) विकेन्द्रीकृत ब्लकचेन प्रविधिमा आधारित गैर-कानुनी डिजिटल सम्पत्ति हो भने केन्द्रीय बैंक डिजिटल मुद्रा (CBDC) केन्द्रीय बैंकद्वारा जारी गरिने कानुनी ग्राह्य डिजिटल मुद्रा (Legal Tender) हो। नेपालमा क्रिप्टोकरेन्सी पूर्ण प्रतिबन्धित छ भने राष्ट्र बैंकले CBDC को सम्भाव्यता अध्ययन सम्पन्न गरिसकेको छ।',
    definitionCard: {
      termNe: 'केन्द्रीय बैंक डिजिटल मुद्रा (CBDC)',
      termEn: 'Central Bank Digital Currency (CBDC)',
      definitionNe: 'कुनै पनि देशको केन्द्रीय बैंकले आफ्नो प्रत्यक्ष दायित्व (Sovereign Liability) को रूपमा जारी गर्ने, आधिकारिक कानुनी ग्राह्य मान्यता (Legal Tender) प्राप्त, कागजी नोट सरह विनिमय हुन सक्ने र राष्ट्रिय मौद्रिक एकाइमा अङ्कित डिजिटल रूपको सार्वभौम मुद्रालाई केन्द्रीय बैंक डिजिटल मुद्रा (CBDC) भनिन्छ।',
      source: 'NRB CBDC Concept Paper, 2022 & BIS Annual Economic Report'
    },
    statutoryCard: {
      actTitleNe: 'सम्बन्धित ऐन, कानुन तथा नीतिगत व्यवस्थाहरू',
      clauses: [
        { clause: 'नेपाल राष्ट्र बैंक ऐन, २०५८ दफा ५२', title: 'बैंक नोट निष्कासनको एकाधिकार', description: 'नेपाल राज्यभित्र कानुनी ग्राह्य मुद्रा तथा नोट जारी गर्ने पूर्ण एकाधिकार राष्ट्र बैंकमा मात्र निहित।' },
        { clause: 'विदेशी विनिमय (नियमित गर्ने) ऐन, २०१९ दफा १२', title: 'विदेशी विनिमय नियन्त्रण', description: 'नेपालभित्र क्रिप्टोकरेन्सी, बिटक्वाइन तथा भर्चुअल मुद्राको खरिद, बिक्री, माइनिङ र लगानी पूर्ण गैरकानुनी।' },
        { clause: 'सम्पत्ति शुद्धीकरण निवारण ऐन, २०६४', title: 'AML/CFT जोखिम नियन्त्रण', description: 'अवैध धन ओसारपसार, क्रिप्टोमार्फत पुँजी पलायन र आतङ्कवादी वित्तीय लगानी नियन्त्रण।' },
        { clause: 'NRB CBDC Concept Paper (२०७९/२०८०)', title: 'नेपालमा सीबीडीसी सम्भाव्यता', description: 'कागजी नोटको छपाई लागत न्यूनीकरण, भुक्तानी प्रणालीको आधुनिकता र डिजिटल रुपैयाँको मार्गचित्र।' },
        { clause: 'FATF अन्तर्राष्ट्रिय मापदण्ड (Recommendation 15)', title: 'भर्चुअल एसेट नियमन', description: 'Virtual Asset Service Providers (VASPs) माथि कडा वित्तीय नियमन र Travel Rule को पालना।' }
      ]
    },
    keyTakeaways: [
      'ब्लकचेन प्रविधि: Distributed Ledger Technology (DLT), SHA-256 क्रिप्टोग्राफी, र सहमति संयन्त्र (PoW vs PoS)।',
      'क्रिप्टोकरेन्सी vs स्टेबलक्वाइन vs CBDC: तुलनात्मक विश्लेषण (कानुनी मान्यता, जारीकर्ता, मूल्य स्थिरता, र नियमन)।',
      'नेपालमा क्रिप्टो प्रतिबन्धका ४ प्रमुख कारण: पुँजी पलायन (Capital Flight), मौद्रिक सार्वभौमिकतामा प्रहार, AML/CFT जोखिम, र उपभोक्ता संरक्षणको अभाव।',
      'NRB CBDC कन्सेप्ट पेपरका ४ उद्देश्यहरू: नगद व्यवस्थापन लागत घटाउने, वित्तीय समावेशीकरण, विप्रेषण लागत न्यूनीकरण, र वित्तीय सार्वभौमिकता।',
      '७ विश्वव्यापी CBDC अभ्यासहरू: बहामास (Sand Dollar), नाइजेरिया (eNaira), चीन (e-CNY), भारत (e₹), स्विडेन (e-Krona), क्यारेबियन (DCash), सिंगापुर (Project Ubin)।'
    ],
    comparisonTable: {
      titleNe: 'क्रिप्टोकरेन्सी, स्टेबलक्वाइन र CBDC बीच १२-सूचक बृहत् तुलनात्मक तालिका (12-Factor Comparison Matrix)',
      column1Header: 'तुलनाको आधार (Parameters)',
      column2Header: 'क्रिप्टोकरेन्सी (उदा. Bitcoin, Ethereum)',
      column3Header: 'केन्द्रीय बैंक डिजिटल मुद्रा - CBDC (उदा. Digital Rupee)',
      rows: [
        {
          parameterNe: '१. जारीकर्ता तथा नियन्त्रक (Issuing Authority)',
          parameterEn: 'Issuing Authority & Control',
          column1Value: 'कुनै केन्द्रीय निकाय छैन (विकेन्द्रीकृत खुला स्रोत कोड, माइनर र भ्यालिडेटरहरू)।',
          column2Value: 'सम्बन्धित देशको केन्द्रीय बैंक (नेपालको सन्दर्भमा नेपाल राष्ट्र बैंक - सार्वभौम निकाय)।'
        },
        {
          parameterNe: '२. कानुनी मान्यता (Legal Tender Status in Nepal)',
          parameterEn: 'Legal Tender Status',
          column1Value: 'नेपालमा विदेशी विनिमय (नियमित गर्ने) ऐन २०१९ अनुसार पूर्ण गैरकानुनी र दण्डनीय।',
          column2Value: 'कानुनी ग्राह्यता प्राप्त (कागजी बैंक नोट सरह राष्ट्र बैंक ऐन २०५८ अनुसार बाध्यकारी स्वीकार्यता)।'
        },
        {
          parameterNe: '३. मूल्यको स्थिरता (Price Volatility / Stability)',
          parameterEn: 'Price Volatility',
          column1Value: 'अति अस्थिर (सट्टेबाजी, बजार माग र हल्लाका आधारमा क्षणभरमै ३०-५०% सम्म उतारचढाव)।',
          column2Value: 'स्थिर (राष्ट्रिय मुद्राको १:१ विनिमय दर कायम रहने, राष्ट्रिय सार्वभौमिकताद्वारा सुरक्षित)।'
        },
        {
          parameterNe: '४. अन्तर्निहित सुरक्षण / ब्याकिङ (Underlying Backing)',
          parameterEn: 'Underlying Collateral Backing',
          column1Value: 'कुनै भौतिक वा वित्तीय सुरक्षण छैन (अन्तर्निहित मूल्य शून्य, मागमा आधारित विश्वास मात्र)।',
          column2Value: 'केन्द्रीय बैंकको सम्पूर्ण वासलात, सरकारी सुरक्षणपत्र तथा विदेशी मुद्रा सञ्चितिको ब्याकिङ।'
        },
        {
          parameterNe: '५. लेजर तथा प्रविधि (Ledger & Consensus Mechanism)',
          parameterEn: 'Ledger Architecture & Consensus',
          column1Value: 'सार्वजनिक अनुमतिरहित ब्लकचेन (Public Permissionless DLT - Proof of Work / Proof of Stake)।',
          column2Value: 'अनुमतिप्राप्त वितरण प्रणाली (Permissioned DLT वा केन्द्रीय सुरक्षित बैंक लेजर)।'
        },
        {
          parameterNe: '६. गोपनीयता तथा एएमएल ट्र्याकिङ (Anonymity vs KYC/AML)',
          parameterEn: 'Anonymity & AML/CFT Compliance',
          column1Value: 'स्यूडोनिमस (छद्म-गोपनीय), वालेट ठेगाना पत्ता लगाउन कठिन, सम्पत्ति शुद्धीकरणको उच्च जोखिम।',
          column2Value: 'नियन्त्रित गोपनीयता (Account-based वा Token-based KYC/AML, वित्तीय गुप्तचर एकाइ FIU द्वारा अनुगमनयोग्य)।'
        },
        {
          parameterNe: '७. मौद्रिक नीतिको प्रभावकारिता (Monetary Policy Transmission)',
          parameterEn: 'Monetary Policy Transmission',
          column1Value: 'केन्द्रीय बैंकको नीतिगत दर र तरलता नियन्त्रणभन्दा बाहिर (समानान्तर छायाँ अर्थतन्त्र सिर्जना गर्छ)।',
          column2Value: 'केन्द्रीय बैंकको मौद्रिक उपकरण (ब्याजदर, खुला बजार कारोबार) सँग पूर्ण आबद्ध र प्रभावकारी।'
        },
        {
          parameterNe: '८. पुँजी पलायन जोखिम (Capital Flight & Remittance Risk)',
          parameterEn: 'Capital Flight Risk',
          column1Value: 'अवैध रूपमा विदेशी मुद्रा सीमापार ओसारपसार (हुन्डी र पुँजी पलायन) को चरम जोखिम।',
          column2Value: 'औपचारिक बैंकिङ च्यानलबाट सीमापार विप्रेषण सस्तो, छिटो र पूर्ण पारदर्शी बनाउने औजार।'
        },
        {
          parameterNe: '९. कारोबार गति र लागत (Speed & Transaction Cost)',
          parameterEn: 'Speed & Transaction Cost',
          column1Value: 'नेटवर्क जाम हुँदा ग्यास फी (Gas Fee) महँगो हुने र कारोबार फछ्र्यौटमा १० मिनेटदेखि घण्टौँ लाग्ने।',
          column2Value: 'तुरुन्त फछ्र्यौट (Real-time Instant Settlement) र शून्य वा न्यून कारोबार लागत।'
        },
        {
          parameterNe: '१०. वित्तीय स्थायित्वमा असर (Impact on Financial Stability)',
          parameterEn: 'Financial Stability Impact',
          column1Value: 'बैंकहरूबाट निक्षेप पलायन गराई प्रणालीगत तरलता सङ्कट र वित्तीय अस्थिरता निम्त्याउने जोखिम।',
          column2Value: 'केन्द्रीय बैंकको सुपरिवेक्षणमा चल्ने भएकाले वित्तीय प्रणालीको विश्वसनीयता र दक्षता अभिवृद्धि गर्दछ।'
        },
        {
          parameterNe: '११. उपभोक्ता संरक्षण तथा विवाद समाधान (Consumer Protection)',
          parameterEn: 'Consumer Protection & Dispute Resolution',
          column1Value: 'कुनै गुनासो सुन्ने निकाय छैन, वालेट ह्याक वा कि (Private Key) हराएमा सम्पत्ति सधैँका लागि नष्ट।',
          column2Value: 'नेपाल राष्ट्र बैंक र वाणिज्य बैंकहरूको औपचारिक ग्राहक गुनासो तथा विवाद समाधान संयन्त्र उपलब्ध।'
        },
        {
          parameterNe: '१२. नेपालको कानुनी स्थिति (Regulatory Stand in Nepal)',
          parameterEn: 'Legal Status under Nepalese Law',
          column1Value: 'विदेशी विनिमय नियमित गर्ने ऐन २०१९ को दफा १२ अनुसार पूर्ण गैरकानुनी (जफत र ३ गुणासम्म जरिवाना)।',
          column2Value: 'नेपाल राष्ट्र बैंक ऐन २०५८ को संशोधन गरी कानुनी ढाँचा निर्माण तथा पाइलट परीक्षणको तयारीमा।'
        }
      ]
    },
    markdownContent: "# भर्चुअल मुद्रा र केन्द्रीय बैंक डिजिटल मुद्रा (CBDC) - १०-१५ अङ्क विशेष\n\n## १. अवधारणा र पृष्ठभूमि (Concept & Background)\nआधुनिक वित्तीय प्रविधिको विकाससँगै भौतिक मुद्रालाई प्रतिस्थापन गर्ने गरी डिजिटल सम्पत्ति र मुद्राको उदय भएको छ। यस सन्दर्भमा दुईवटा विपरीत अवधारणाहरू चर्चामा छन्:\n1. **भर्चुअल मुद्रा / क्रिप्टोकरेन्सी (Virtual Currency / Cryptocurrency):** कुनै पनि सरकार वा केन्द्रीय बैंकको नियन्त्रण बाहिर रहने, निजी तथा विकेन्द्रीकृत कम्प्युटर सञ्जालद्वारा सञ्चालित सम्पत्ति।\n2. **केन्द्रीय बैंक डिजिटल मुद्रा (Central Bank Digital Currency - CBDC):** सार्वभौम राष्ट्रको केन्द्रीय बैंकले आफ्नै प्रत्यक्ष दायित्वमा जारी गर्ने कानुनी ग्राह्य (Legal Tender) डिजिटल मुद्रा।\n\n---\n\n## २. ब्लकचेन प्रविधिको कार्यप्रणाली (Blockchain Mechanics)\nक्रिप्टोकरेन्सीको मेरुदण्ड ब्लकचेन (Distributed Ledger Technology - DLT) हो। यसका प्रमुख ४ प्राविधिक खम्बाहरू:\n1. **वितरित लेजर (Distributed Ledger):** डाटा कुनै एउटा केन्द्रीय सर्भरमा नभई सञ्जालमा जोडिएका हजारौँ कम्प्युटर (Nodes) हरूमा एकैसाथ सुरक्षित रहन्छ।\n2. **क्रिप्टोग्राफिक ह्यास (SHA-256 Cryptographic Hash):** प्रत्येक ब्लकमा कारोबारको डाटा, टाइमस्ट्याम्प र अघिल्लो ब्लकको अद्वितीय ह्यास कोड गाँसिएको हुन्छ, जसले गर्दा अघिल्लो डाटा फेरबदल गर्न असम्भव हुन्छ।\n3. **अपरिवर्तनीयता (Immutability):** एक पटक ब्लकमा प्रविष्ट भएको कारोबारलाई मेटाउन वा बदल्न सकिँदैन।\n4. **सहमति संयन्त्र (Consensus Mechanism):**\n   - **Proof of Work (PoW):** जटिल गणितीय समस्या समाधान गरी ब्लक थप्ने (उदा. Bitcoin - अत्यधिक बिजुली खपत)।\n   - **Proof of Stake (PoS):** शेयर/सम्पत्ति बन्धक राखेर भ्यालिडेटर छनोट हुने वातावरणमैत्री विधि (उदा. Ethereum 2.0)।\n\n---\n\n## ३. नेपालमा क्रिप्टोकरेन्सी पूर्ण प्रतिबन्ध हुनुका कानुनी तथा आर्थिक आधारहरू (Why Crypto is Banned in Nepal)\n\nनेपाल राष्ट्र बैंकले वि.सं. २०७४ भदौ २९, २०७८ माघ ९ र २०७९ वैशाखमा सार्वजनिक सूचना जारी गरी क्रिप्टोकरेन्सीको कारोबारलाई पूर्ण गैरकानुनी घोषणा गरेको छ। यसका प्रमुख आधारहरू:\n\n### क. कानुनी आधारहरू (Statutory Prohibitions):\n1. **नेपाल राष्ट्र बैंक ऐन, २०५८ (दफा ५२):** नेपालमा कानुनी मुद्रा तथा नोट निष्कासन गर्ने सर्वाधिकार राष्ट्र बैंकलाई मात्र छ। निजी मुद्रा चलाउनु ऐन विपरीत हो।\n2. **विदेशी विनिमय (नियमित गर्ने) ऐन, २०१९ (दफा १२):** राष्ट्र बैंकको अनुमति बिना विदेशी विनिमयको कारोबार गर्न पाइँदैन। क्रिप्टोमार्फत विदेशी मुद्राको अपचलन हुन्छ।\n3. **सम्पत्ति शुद्धीकरण (मनी लाउन्डरिङ) निवारण ऐन, २०६४:** क्रिप्टो कारोबारको कुनै KYC र स्रोत नहुने हुँदा कालोधन सेतो बनाउन र आतङ्कवादी क्रियाकलापमा प्रयोग हुने उच्च जोखिम।\n\n### ख. समष्टिगत आर्थिक तथा वित्तीय आधारहरू (Macroeconomic Risks):\n1. **पुँजी पलायन (Capital Flight):** नेपालबाट गैरकानुनी रूपमा विदेशी मुद्रा बाहिरिएर देशको विदेशी विनिमय सञ्चिति (Forex Reserves) मा गम्भीर धक्का पुग्ने।\n2. **मौद्रिक सार्वभौमिकताको क्षयीकरण (Monetary Sovereignty):** केन्द्रीय बैंकको मौद्रिक नीतिको प्रभावकारिता समाप्त हुने र अनौपचारिक अर्थतन्त्र (Shadow Economy) मौलाउने।\n3. **उपभोक्ता संरक्षणको अभाव (Lack of Investor Protection):** कुनै संस्थागत ब्याकिङ नहुँदा ठगी भएमा वा भ्यालु शून्य भएमा क्षतिपूर्ति दिने कुनै निकाय नहुनु।\n4. **हुण्डी र वित्तीय अपराध (Hundi & Illegal Remittance):** औपचारिक बैंकिङ च्यानलबाट आउने रेमिट्यान्स क्रिप्टोमार्फत डाइभर्ट हुने जोखिम।\n\n---\n\n## ४. केन्द्रीय बैंक डिजिटल मुद्रा (CBDC): अवधारणा र प्रकार (CBDC Concepts & Types)\n\nCBDC कागजी नोटको डिजिटल रूप हो। यो कमर्सियल बैंकमा रहेको निक्षेप भन्दा फरक हुन्छ किनभने यो **सिधै केन्द्रीय बैंकको ब्यालेन्स सिटको दायित्व** हो।\n\n### CBDC का मुख्य दुई प्रकार:\n1. **खुद्रे सीबीडीसी (Retail CBDC - CBDC-R):**\n   - आम नागरिक, व्यापारी र उपभोक्ताहरूले दैनिक किनमेल र रकम ट्रान्सफरका लागि प्रयोग गर्ने।\n   - कागजी नोटको प्रत्यक्ष डिजिटल विकल्प।\n2. **थोक सीबीडीसी (Wholesale CBDC - CBDC-W):**\n   - केवल केन्द्रीय बैंक र वाणिज्य बैंकहरू बीच अन्तरबैंकिङ फछ्र्यौट, वित्तीय बजार कारोबार र सुरक्षणपत्र राफसाफका लागि प्रयोग हुने।\n\n---\n\n## ५. नेपाल राष्ट्र बैंकको CBDC सम्भाव्यता अध्ययन र ८ प्रमुख उपयोगिता स्तम्भहरू (8 Utility Pillars)\n\nनेपाल राष्ट्र बैंकको मुद्रा व्यवस्थापन विभागले वि.सं. २०७९ मा **\"Concept Paper on Central Bank Digital Currency in Nepal\"** सार्वजनिक गर्‍यो। नेपालको सन्दर्भमा CBDC का ८ आधारभूत उपयोगिता स्तम्भहरू (8 Core Utility Pillars):\n\n1. **कागजी नोट छपाई तथा व्यवस्थापन लागतमा भारी कटौती (Currency Logistics Efficiency):** नेपालले बर्सेनि अर्बौँ रुपैयाँ विदेशी प्रेसमा नोट छपाई, ढुवानी, सुरक्षा र पुराना नोट जलाउन खर्च गर्छ। CBDC ले यो भौतिक लागत शून्यप्रायः बनाउँछ।\n2. **मौद्रिक सार्वभौमिकताको रक्षा (Safeguarding Monetary Sovereignty):** निजी क्रिप्टोकरेन्सी (Bitcoin) र विदेशी अनधिकृत डिजिटल मुद्राको अनौपचारिक प्रयोगलाई रोकी राष्ट्रिय मुद्राको एकाधिकार सुरक्षित राख्ने।\n3. **अफलाइन भुक्तानी क्षमता (Offline Resilience in Disasters):** भूकम्प, बाढी वा नेटवर्क अवरुद्ध हुँदा पनि स्मार्ट कार्ड वा चिप डिभाइसमार्फत विना इन्टरनेट अफलाइन डिजिटल रुपैयाँ कारोबार सम्भव हुने।\n4. **दुर्गम क्षेत्रमा वित्तीय समावेशीकरण (Deep Financial Inclusion):** हिमाली र पहाडी भेगमा भौतिक बैंक शाखा नभए पनि नागरिकले केन्द्रीय बैंकको सुरक्षित डिजिटल वालेटमार्फत कारोबार गर्न सक्ने।\n5. **सस्तो र द्रुत सीमापार विप्रेषण (Cost-Effective Cross-Border Remittance):** विदेशी रेमिट्यान्समा बिचौलिया लागत हटाई वैदेशिक रोजगारीमा रहेका नेपालीले पठाएको पैसा तत्काल नेपालका आफन्तको CBDC खातामा जम्मा हुने।\n6. **लक्षित सरकारी अनुदान र सामाजिक सुरक्षा (Programmable Social Subsidies):** सरकारले दिने कृषि अनुदान वा छात्रवृत्ति रकम तोकिएका मलखाद वा किताब पसलमा मात्र खर्च गर्न मिल्ने गरी स्मार्ट कन्ट्र्याक्ट (Programmable Money) लागू गर्न सकिने।\n7. **वित्तीय अपराध तथा कालोधन नियन्त्रण (AML/CFT Auditability):** प्रत्येक डिजिटल टोकनको अद्वितीय क्रिप्टोग्राफिक सिरियल नम्बर रहने हुँदा अवैध पुँजी र कर छलीको सहजै फरेन्सिक ट्र्याकिङ हुने।\n8. **अन्तरबैंकिङ थोक फछ्र्यौटको आधुनिकीकरण (Wholesale Liquidity Optimization):** वाणिज्य बैंकहरू बीचको अन्तरबैंकिङ सापटी, सरकारी ऋणपत्र र तरलता व्यवस्थापन २४ सै घण्टा तत्काल राफसाफ हुने।\n\n---\n\n## ५.१ CBDC का ८ सञ्चालन तथा प्रणालीगत जोखिमहरू र नीतिगत सिफारिस (8 Risks & Policy Recommendations)\n\n1. **बैंकहरूको निक्षेप पलायन (Bank Disintermediation Risk):**\n   - *जोखिम:* आर्थिक अनिश्चितताको बेला नागरिकले कमर्सियल बैंकबाट पैसा झिकेर १००% सुरक्षित CBDC मा राख्दा बैंकहरूमा तरलता अभाव हुने।\n   - *नीतिगत समाधान:* व्यक्तिगत वालेटमा रकम होल्ड गर्ने अधिकतम सीमा (Holding Limits) तोक्ने र CBDC मा शून्य ब्याजदर (Zero-Interest Policy) राख्ने।\n2. **साइबर सुरक्षा तथा राष्ट्रिय लेजर जोखिम (Catastrophic Cyber Threats):**\n   - *जोखिम:* राष्ट्रिय CBDC लेजर ह्याक भएमा समग्र देशको सार्वभौम अर्थतन्त्र एकैपटक ठप्प हुने खतरा।\n   - *नीतिगत समाधान:* क्वान्टम-प्रतिरोधी इन्क्रिप्सन (Post-Quantum Cryptography) र बहु-केन्द्रित वितरण ब्याकअप।\n3. **व्यक्तिगत गोपनीयता विरुद्ध वित्तीय निगरानी (Privacy vs Surveillance):**\n   - *जोखिम:* नागरिकको प्रत्येक व्यक्तिगत किनमेल र कारोबार केन्द्रीय बैंकको निगरानीमा पर्दा वैयक्तिक स्वतन्त्रतामा आँच आउन सक्ने।\n   - *नीतिगत समाधान:* निश्चित सानो रकम (उदा. रु. ५,००० सम्म) को कारोबारमा पूर्ण नगद सरह गोपनीयता (Cash-like Anonymity) दिने र ठूला रकममा मात्र KYC अनिवार्य गर्ने।\n4. **डिजिटल तथा प्रविधि पूर्वाधार असमानता (Digital Infrastructure Gap):**\n   - *जोखिम:* ग्रामीण भेगमा गुणस्तरीय बिजुली र स्मार्टफोनको अभावले प्रविधि विभेद बढ्ने।\n   - *नीतिगत समाधान:* फिचर फोनका लागि USSD/NFC प्रविधि र सिम-कार्डमा आधारित हार्डवेयर वालेट वितरण।\n5. **कानुनी तथा संस्थागत ढाँचाको अभाव (Statutory Void):**\n   - *जोखिम:* नेपाल राष्ट्र बैंक ऐन २०५८ ले हाल केवल भौतिक कागजी नोट र धातुको सिक्कालाई मात्र कानुनी मुद्रा मान्दछ।\n   - *नीतिगत समाधान:* राष्ट्र बैंक ऐन २०५८ मा दफा संशोधन गरी डिजिटल मुद्रा निष्कासनको स्पष्ट कानुनी अधिकार समावेश गर्ने।\n6. **उच्च प्रारम्भिक विकास र सञ्चालन लागत (High Technological Capex):**\n   - *जोखिम:* सुरक्षित डिस्ट्रीब्युटेड लेजर, वालेट एप, र साइबर सुरक्षा पूर्वाधार निर्माणमा भारी पुँजीगत खर्च।\n   - *नीतिगत समाधान:* BIS Innovation Hub र अन्तर्राष्ट्रिय प्राविधिक साझेदारहरूसँग सहकार्य गरी प्रमाणीकरण भएको खुला प्रविधि अपनाउने।\n7. **अन्तर्राष्ट्रिय भुक्तानी प्रणालीसँग अन्तरसञ्चालन (Cross-Border Interoperability Issues):**\n   - *जोखिम:* नेपालको CBDC विदेशी प्रणाली (उदा. भारतको e-Rupee वा चीनको e-CNY) सँग नमिल्दा सीमापार कारोबार कठिन हुनु।\n   - *नीतिगत समाधान:* Project mBridge वा BIS मानकीकृत अन्तर्राष्ट्रिय प्रोटोकल अनुसार प्राविधिक ढाँचा निर्माण गर्ने।\n8. **सार्वजनिक विश्वास र अपनाउने दर (Public Trust & Adoption Inertia):**\n   - *जोखिम:* नगद चलाउने बानी परेका आम जनता र व्यापारीहरूले नयाँ प्रविधिलाई शंकाको दृष्टिले हेर्न सक्ने।\n   - *नीतिगत समाधान:* राष्ट्रव्यापी सञ्चार अभियान, व्यापारीहरूलाई शून्य ट्रान्ज्याक्सन फी, र सुरुवाती क्यासब्याक प्रोत्साहन।\n\n---\n\n## ६. विश्वका ७ प्रमुख देशहरूको CBDC अभ्यास र पाइलट अनुभव (7 Global Case Studies)\n\n1. **बहामास (The Bahamas - Sand Dollar):**\n   - सन् २०२० अक्टोबरमा जारी गरिएको **विश्वको पहिलो पूर्ण कार्यान्वयन भएको रिटेल CBDC**। दुर्गम टापुहरूमा बैंकिङ पहुँच पुर्‍याउन सफल।\n2. **नाइजेरिया (Nigeria - eNaira):**\n   - सन् २०२१ मा जारी। अफ्रिका महादेशको पहिलो CBDC। नगद संकट र रेमिट्यान्स सुधार गर्ने लक्ष्य तर जनतामा सचेतना अभावले ग्रहण दर (Adoption Rate) सुस्त।\n3. **चीन (China - Digital Yuan / e-CNY):**\n   - विश्वकै सबैभन्दा ठूलो पाइलट प्रोजेक्ट। बेइजिङ विन्टर ओलम्पिक्स र प्रमुख शहरहरूमा व्यापक परीक्षण। क्रस-बोर्डर व्यापारका लागि **mBridge** प्लेटफर्ममा प्रयोग।\n4. **भारत (India - Digital Rupee e₹):**\n   - भारतीय रिजर्भ बैंक (RBI) ले सन् २०२२ मा थोक (e₹-W) र खुद्रे (e₹-R) दुवै पाइलट सुरु गरेको। अन्तरबैंकिङ कल बजार र सरकारी सुरक्षणपत्रमा सफल परीक्षण।\n5. **स्विडेन (Sweden - e-Krona):**\n   - स्विडेनमा भौतिक नगदको प्रयोग ९५% भन्दा बढी घटेपछि निजी भुक्तानी कम्पनीहरूको एकाधिकार तोड्न र राष्ट्रिय सार्वभौम मुद्रा जोगाउन Riksbank ले e-Krona पाइलट सुरु गरेको।\n6. **पूर्वी क्यारेबियन केन्द्रीय बैंक (ECCB - DCash):**\n   - मुद्रा युनियनमा रहेका विभिन्न टापु देशहरू बीच बिना शुल्क अन्तरदेशीय भुक्तानी गर्न जारी गरिएको सफल ब्लकचेन CBDC।\n7. **सिंगापुर (Singapore - Project Ubin / Project Orchid):**\n   - थोक अन्तरबैंकिङ फछ्र्यौट र प्रोग्रामेबल मनी (Purpose-Bound Money) को परीक्षण।\n\n---\n\n## ७. वाणिज्य बैंकहरूमा पर्ने प्रभाव र जोखिमहरू (Impact on Commercial Banks: Disintermediation Risk)\n\nयदि आम जनताले वाणिज्य बैंकमा रहेको निक्षेप झिकेर शतप्रतिशत सुरक्षित मानिने केन्द्रीय बैंकको CBDC मा राख्न थाले भने:\n- **निक्षेप पलायन (Bank Disintermediation):** वाणिज्य बैंकहरूको निक्षेप आधार खुम्चिनेछ।\n- **कर्जा प्रवाहमा संकुचन:** निक्षेप घटेपछि बैंकहरूले उद्योग तथा व्यवसायलाई सस्तो ब्याजमा कर्जा दिन सक्ने छैनन्।\n- **बैंक रनको खतरा (Digital Bank Run):** वित्तीय संकटका बेला एक क्लिकमै सबै पैसा बैंकबाट CBDC मा सार्ने जोखिम।\n- **समाधान:** राष्ट्र बैंकले CBDC होल्डिङमा अधिकतम सीमा (Holding Limit) तोक्ने वा CBDC मा ब्याज नदिने नीति लिनुपर्दछ।\n\n---\n\n## ८. निष्कर्ष (Conclusion)\nभर्चुअल मुद्रा वित्तीय सार्वभौमिकता र स्थायित्वका लागि चुनौती भए तापनि यसको अन्तर्निहित प्रविधि (DLT) लाई उपयोग गरी जारी गरिने CBDC भविष्यको आधिकारिक मुद्रा हो। नेपालले कानुनी सुधार, साइबर सुरक्षा पूर्वाधार र बैंकिङ प्रणालीको सहकार्यमा चरणबद्ध रूपमा डिजिटल रुपैयाँ लागू गर्नु समयानुकूल कदम हुनेछ।",
    probableExamQuestions: [
      {
        marks: 15,
        questionNe: 'केन्द्रीय बैंक डिजिटल मुद्रा (CBDC) भन्नाले के बुझिन्छ? क्रिप्टोकरेन्सी र CBDC बीचको भिन्नता प्रस्ट्याउँदै नेपाल राष्ट्र बैंकले क्रिप्टोकरेन्सीलाई पूर्ण प्रतिबन्ध लगाउनुका कानुनी तथा आर्थिक आधारहरू र नेपालमा CBDC जारी गर्दा वाणिज्य बैंकहरूमा पर्न सक्ने प्रभावहरूको विश्लेषण गर्नुहोस्।',
        questionEn: 'What is Central Bank Digital Currency (CBDC)? Differentiate between Cryptocurrency and CBDC, analyze the statutory and macroeconomic rationales for banning crypto in Nepal, and evaluate the potential impacts of CBDC on commercial banks.',
        examLevel: 'NRB / RBB Level 6 / Officer Level',
        modelAnswerFramework: [
          '१. CBDC को अवधारणा र कानुनी परिभाषा (२ अङ्क)',
          '२. क्रिप्टोकरेन्सी, स्टेबलक्वाइन र CBDC बीचको विस्तृत तुलनात्मक तालिका (४ अङ्क)',
          '३. नेपालमा क्रिप्टो प्रतिबन्धका कानुनी तथा आर्थिक आधारहरू (NRB ऐन, विदेशी विनिमय ऐन, पुँजी पलायन, AML/CFT) (४ अङ्क)',
          '४. वाणिज्य बैंकहरूमा पर्ने प्रभाव (Disintermediation, Bank Run, निक्षेप संकुचन) (३ अङ्क)',
          '५. निष्कर्ष र भावी मार्गचित्र (२ अङ्क)'
        ]
      },
      {
        marks: 10,
        questionNe: 'नेपाल राष्ट्र बैंकद्वारा प्रकाशित CBDC कन्सेप्ट पेपरका प्रमुख उद्देश्यहरू उल्लेख गर्दै विश्वका प्रमुख देशहरूको CBDC अभ्यासबाट नेपालले सिक्न सक्ने पाठहरू संक्षेपमा लेख्नुहोस्।',
        questionEn: 'Highlight the key objectives of NRB CBDC Concept Paper and summarize lessons Nepal can learn from global CBDC implementations.',
        examLevel: 'NRB Level 5 & Assistant Director Level',
        modelAnswerFramework: [
          'NRB CBDC कन्सेप्ट पेपरका प्रमुख उद्देश्यहरू (नोट छपाई लागत, भुक्तानी आधुनिकता, रेमिट्यान्स) (४ अङ्क)',
          'विश्वव्यापी अभ्यासहरू (बहामास, चीन, भारत, स्विडेन) बाट प्राप्त पाठहरू (४ अङ्क)',
          'निष्कर्ष (२ अङ्क)'
        ]
      }
    ]
  },

  // =========================================================================
  // TOPIC 5: Virtual Banking / Neobank - 10-15 Mark Comprehensive Depth
  // =========================================================================
  {
    id: 'virtual-bank-neobank',
    topicNumber: 5,
    titleNe: 'भर्चुअल बैंकिङ र नियोबैंक (Virtual Bank / Neobank)',
    titleEn: 'Virtual Banking and Neobanks',
    subtitleNe: 'क्लाउड आर्किटेक्चर, Open/API बैंकिङ, ६-चरणीय ग्राहक यात्रा, लागत विश्लेषण र NRB रोडम्याप',
    categoryTag: 'आधुनिक बैंकिङ मोडेल तथा फिनटेक',
    paperReference: 'NRB / Banking / Loksewa - Paper I & II (१०-१५ अङ्क)',
    examWeightage: '१०-१५ अङ्क (नयाँ प्रवृत्ति)',
    readTime: '१५ मिनेट',
    pdfFilename: 'Banking_Notes_Topic_5_Virtual_Bank_Neobank.pdf',
    summaryNe: 'कुनै पनि भौतिक शाखा बिना पूर्ण रूपमा डिजिटल, इन्टरनेट, क्लाउड र मोबाइल एपका माध्यमबाट २४/७ बैंकिङ सेवा प्रवाह गर्ने आधुनिक बैंकलाई भर्चुअल बैंक वा नियोबैंक भनिन्छ। परम्परागत बैंक भन्दा न्यून सञ्चालन लागत, ओपन एपीआई बैंकिङ (Open Banking) र एआई-सञ्चालित व्यक्तिगत सेवा यसका मुख्य आधार हुन्।',
    definitionCard: {
      termNe: 'नियोबैंक / भर्चुअल बैंक (Neobank)',
      termEn: 'Neobank / Digital-Only Bank',
      definitionNe: 'कुनै पनि भौतिक शाखा वा इँटा-माटोको पूर्वाधार बिना पूर्ण रूपमा क्लाउड-नेटिभ सफ्टवेयर, मोबाइल एप्लिकेसन, ओपन एपीआई (Open API) तथा आर्टिफिसियल इन्टेलिजेन्सको माध्यमबाट ग्राहक खाता खोल्ने, निक्षेप संकलन, स्वचालित डिजिटल कर्जा र भुक्तानी सेवा प्रवाह गर्ने शतप्रतिशत डिजिटल बैंकलाई नियोबैंक भनिन्छ।',
      source: 'UK Financial Conduct Authority (FCA) & Basel Committee on Banking Supervision (BCBS)'
    },
    statutoryCard: {
      actTitleNe: 'सम्बन्धित ऐन, कानुन तथा नीतिगत व्यवस्थाहरू',
      clauses: [
        { clause: 'बैंक तथा वित्तीय संस्था सम्बन्धी ऐन (BAFIA), २०७३', title: 'बैंक स्थापना तथा इजाजतपत्र', description: 'दफा ३ देखि ३१ सम्म बैंक दर्ता, चुक्ता पुँजी, सञ्चालक समिति र इजाजतपत्र सम्बन्धी व्यवस्था।' },
        { clause: 'NRB डिजिटल लेन्डिङ मार्गनिर्देशन, २०७८/२०८०', title: 'डिजिटल कर्जा सीमा', description: 'बिना धितो अनलाइन माध्यमबाट ग्राहकको क्यासफ्लो र डिजिटल स्कोरका आधारमा अधिकतम रु. ५ लाखसम्म डिजिटल कर्जा प्रवाह।' },
        { clause: 'नेपाल राष्ट्र बैंक सूचना प्रविधि नीति, २०८०', title: 'क्लाउड कम्प्युटिङ मापदण्ड', description: 'क्लाउड होस्टिङ, डाटा इन्क्रिप्सन, स्थानीय डाटा सार्वभौमिकता र प्रणालीगत साइबर अडिट।' },
        { clause: 'NRB चौथो रणनीतिक योजना (4th Strategic Plan)', title: 'नियमनकारी स्यान्डबक्स', description: 'फिनटेक तथा डिजिटल बैंकको प्रवर्द्धनका लागि Regulatory Sandbox को व्यवस्था।' },
        { clause: 'वैयक्तिक गोपनीयता ऐन, २०७५', title: 'डिजिटल ग्राहक डाटा संरक्षण', description: 'ग्राहकको वित्तीय विवरण र व्यक्तिगत डाटाको गोप्यता, सहमति बिना तेस्रो पक्षलाई दिन निषेध।' }
      ]
    },
    keyTakeaways: [
      'नियोबैंकको प्राविधिक संरचना: Cloud-Native CBS, Microservices, Open APIs, र AI/ML अण्डरराइटिङ इन्जिन।',
      'ओपन बैंकिङ र BaaS (Banking as a Service): बैंकको पूर्वाधारमा फिनटेकले सफ्टवेयर चलाउने सहकार्य।',
      '६-चरणीय ग्राहक यात्रा: डिजिटल e-KYC -> Video KYC -> ३ मिनेटमा खाता सक्रिय -> भर्चुअल कार्ड -> AI बजेटिङ -> २४/७ च्याटबट।',
      'लागत तुलना: परम्परागत बैंकको Cost-to-Income अनुपात ४५-५५% विरुद्ध नियोबैंकको २०-३०%।',
      'नेपालमा डिजिटल बैंकिङको भावी बाटो: डिजिटल बैंकको छुट्टै लाइसेन्स नीति, रेगुलेटरी स्यान्डबक्स र डिजिटल कर्जा विस्तार।'
    ],
    comparisonTable: {
      titleNe: 'परम्परागत वाणिज्य बैंक र नियोबैंक (Neobank) बीच विस्तृत तुलनात्मक तालिका',
      column1Header: 'तुलनाको आधार',
      column2Header: 'परम्परागत वाणिज्य बैंक (Traditional Bank)',
      column3Header: 'नियोबैंक (Neobank / Digital Bank)',
      rows: [
        {
          parameterNe: 'भौतिक पूर्वाधार',
          parameterEn: 'Physical Branches',
          column1Value: 'शाखा सञ्जाल, काउन्टर, सुरक्षा गार्ड, र भौतिक भवन।',
          column2Value: 'शून्य भौतिक शाखा (Zero Branches), १००% क्लाउड र मोबाइल एप।'
        },
        {
          parameterNe: 'लागत संरचना (Cost Structure)',
          parameterEn: 'Cost Structure',
          column1Value: 'उच्च स्थिर लागत (High Branch CAPEX/OPEX), कर्मचारी खर्च।',
          column2Value: 'अत्यन्त न्यून सञ्चालन लागत (Low Overhead), स्वचालन।'
        },
        {
          parameterNe: 'खाता खोल्ने प्रक्रिया',
          parameterEn: 'Account Opening Time',
          column1Value: 'भौतिक फारम, कागजात प्रमाणीकरण (२४ देखि ४८ घण्टा)।',
          column2Value: 'e-KYC र Video KYC मार्फत ३ मिनेटभित्र पेपरलेस खाता।'
        },
        {
          parameterNe: 'कर्जा स्वीकृति गति',
          parameterEn: 'Loan Approval Speed',
          column1Value: 'कागजात अडिट, धितो मूल्याङ्कन (३ देखि १५ दिन)।',
          column2Value: 'एआई एल्गोरिदम र डिजिटल फुटप्रिन्टबाट केही सेकेन्डमै स्वीकृति।'
        },
        {
          parameterNe: 'ग्राहक अनुभव (UI/UX)',
          parameterEn: 'Customer Experience',
          column1Value: 'कम्प्लेक्स CBS, नियमित शाखा धाउनुपर्ने बाध्यता।',
          column2Value: 'अत्याधुनिक सहज मोबाइल इन्टरफेस, व्यक्तिगत वित्तीय विश्लेषण (PFM)।'
        },
        {
          parameterNe: 'सञ्चालन समय',
          parameterEn: 'Operating Hours',
          column1Value: 'शाखा समय (बिहान १० देखि साँझ ४-५ बजेसम्म)।',
          column2Value: '२४ घण्टा, ३६५ दिन पूर्ण डिजिटल सेवा (24/7 Real-Time)।'
        }
      ]
    },
    markdownContent: "# भर्चुअल बैंकिङ र नियोबैंक (Virtual Bank & Neobanks) - १०-१५ अङ्क विशेष\n\n## १. अवधारणा र परिभाषा (Concept & Definition)\nभर्चुअल बैंक वा नियोबैंक (Neobank / Digital-Only Bank) भन्नाले **कुनै पनि भौतिक शाखा वा इँटा-माटोको काउन्टर बिना** पूर्ण रूपमा डिजिटल माध्यम (मोबाइल एप, वेबसाइट, इन्टरनेट र क्लाउड कम्प्युटिङ) बाट बैंकिङ सेवा प्रवाह गर्ने २१औँ शताब्दीको आधुनिक बैंक हो।\n\nविश्वव्यापी रूपमा Revolut (UK), Nubank (ब्राजिल), Chime (अमेरिका), WeBank (चीन), र KakaoBank (दक्षिण कोरिया) ले परम्परागत बैंकिङ प्रणालीलाई विस्थापित गर्दै अभूतपूर्व सफलता हासिल गरेका छन्।\n\n> **प्राविधिक परिभाषा:**\n> \"नियोबैंक भन्नाले क्लाउड-नेटिभ आर्किटेक्चर, खुला एप्लिकेसन प्रोग्रामिङ इन्टरफेस (Open APIs), र स्वचालित डाटा एनालिटिक्सको प्रयोग गरी बिना शाखा ग्राहक पहिचान (e-KYC), निक्षेप संकलन, स्वचालित डिजिटल ऋण र कार्ड भुक्तानी सेवा प्रवाह गर्ने शतप्रतिशत डिजिटल वित्तीय संस्था हो।\"\n\n---\n\n## २. नियोबैंकको प्राविधिक पूर्वाधार (Neobank Technical Architecture)\n\nनियोबैंकको संरचना परम्परागत बैंकको जस्तो भारी र जटिल हुँदैन। यसका ४ मुख्य प्राविधिक खम्बाहरू:\n1. **क्लाउड-नेटिभ कोर बैंकिङ (Cloud-Native CBS):** भौतिक मेनफ्रेम सर्भरको सट्टा AWS, Google Cloud वा Azure जस्ता क्लाउड पूर्वाधारमा आधारित स्केलेबल कोर बैंकिङ।\n2. **माइक्रोसर्भिस आर्किटेक्चर (Microservices):** भुक्तानी, कर्जा, खाता र सुरक्षाका छुट्टाछुट्टै स्वतन्त्र मोड्युलहरू, जसले गर्दा प्रणाली कहिल्यै पूरै डाउन हुँदैन।\n3. **ओपन एपीआई र बैंकिङ एज अ सर्भिस (Open API & BaaS):** तेस्रो पक्ष फिनटेक कम्पनीहरूलाई बैंकको खाता र भुक्तानी प्रणालीसँग सुरक्षित रूपमा जोडिन दिने एपीआई सञ्जाल।\n4. **एआई तथा मेसिन लर्निङ इन्जिन (AI/ML Underwriting):** ग्राहकको कारोबार इतिहास, डिजिटल भुक्तानी प्रवृत्ति र वित्तीय बानीको विश्लेषण गरी तत्काल कर्जा योग्यता (Credit Scoring) निर्धारण गर्ने स्वचालित सफ्टवेयर।\n\n---\n\n## ३. ६-चरणीय घर्षणरहित ग्राहक यात्रा (6-Step Frictionless Customer Journey)\n\nपरम्परागत बैंकमा शाखा पुगेर लाइन बस्नुपर्ने झन्झटलाई नियोबैंकले ६ मिनेटभित्रको मोबाइल यात्रामा रूपान्तरण गरेको छ:\n\n**[१. मोबाइल एप डाउनलोड र e-KYC]** ──> **[२. Video KYC र लाइभनेस चेक]** ──> **[३. ३ मिनेटमा खाता सक्रिय]**\n                                                                                │\n                                                                                ▼\n**[६. २४/७ एआई कन्भर्सेसनल बैंकिङ]** <── **[५. AI व्यक्तिगत बजेटिङ/PFM]** <── **[४. भर्चुअल डेबिट कार्ड जारी]**\n\n1. **चरण १ (Digital Onboarding & e-KYC):** ग्राहकले मोबाइल एप डाउनलोड गरी राष्ट्रिय परिचयपत्र वा नागरिकताको फोटो खिच्ने। OCR प्रविधिले नाम र विवरण स्वतः भर्छ।\n2. **चरण २ (Video KYC & Liveness Check):** मोबाइल क्यामेरामार्फत ग्राहकको अनुहारको जीवन्तता (Liveness Detection), आँखा झिम्क्याउने परीक्षण र जीपीएस लोकेसन प्रमाणीकरण।\n3. **चरण ३ (Instant Account Opening):** केन्द्रीय बैंकको AML/CFT कालोसूची स्क्रिनिङ तुरुन्तै भई ३ मिनेटभित्र डिजिटल खाता नम्बर सिर्जना।\n4. **चरण ४ (Virtual Card Issuance):** खाता खुल्नासाथ मोबाइल एपभित्रै भर्चुअल भिसा/मास्टरकार्ड डेबिट कार्ड जारी, जसबाट तुरुन्त अनलाइन सपिङ सुरु गर्न सकिने।\n5. **चरण ५ (AI Personal Financial Management - PFM):** ग्राहकले कहाँ कति खर्च गर्‍यो (खाना, यात्रा, मनोरञ्जन) स्वचालित रूपमा वर्गीकरण गर्ने र बचत लक्ष्य (Goal-based Savings) बनाइदिने।\n6. **चरण ६ (24/7 Automated Support):** मानिसको आवश्यकता बिना एआई च्याटबटमार्फत २४ सै घण्टा तत्काल समस्या समाधान।\n\n---\n\n## ४. परम्परागत बैंक र नियोबैंकको लागत संरचनाको गहिरो विश्लेषण (Deep Cost-Structure Analysis)\n\n| वित्तीय सूचक | परम्परागत वाणिज्य बैंक | नियोबैंक (Neobank) | प्रभाव र फाइदा |\n| :--- | :--- | :--- | :--- |\n| **लागत-आम्दानी अनुपात (Cost-to-Income Ratio)** | **४५% देखि ५५%** | **२०% देखि ३०%** | नियोबैंकको नाफा मार्जिन निकै उच्च रहने। |\n| **भौतिक शाखा पुँजीगत खर्च (Branch CAPEX)** | प्रति शाखा रु. ५० लाख देखि १ करोड | **रु. शून्य (Zero CAPEX)** | भवन भाडा, सजावट, जेनेरेटरको खर्च पूर्ण बचत। |\n| **कर्मचारी सञ्चालन खर्च (Staff OPEX)** | कुल आम्दानीको १५-२०% | **कुल आम्दानीको ५-७%** | काउन्टर टेलरको सट्टा सफ्टवेयर इन्जिनियर मात्र। |\n| **ग्राहक अधिग्रहण लागत (CAC - Acquisition Cost)** | उच्च (मार्केटिङ + भौतिक भेरिफिकेसन) | **न्यून (डिजिटल भाइरल रेफरल)** | प्रति ग्राहक अधिग्रहण लागत ६०-७०% सस्तो। |\n| **प्रविधि अपग्रेड गति** | महिना/वर्ष लाग्ने (Legacy System) | **दैनिक/साप्ताहिक (CI/CD DevOps)** | नयाँ फिचर तुरुन्तै बजारमा ल्याउन सकिने। |\n\n---\n\n## ५. नेपालमा भर्चुअल बैंकिङको वर्तमान अवस्था र नियामक मार्गचित्र (NRB Strategic Roadmap)\n\nनेपालमा हालसम्म पूर्ण डिजिटल बैंक (Stand-alone Neobank) लाई छुट्टै इजाजतपत्र दिने नीति नभए तापनि देहायका नियामक कदमहरू चालिएका छन्:\n\n1. **NRB डिजिटल लेन्डिङ निर्देशिका, २०७८/२०८०:**\n   - बैंक तथा वित्तीय संस्थाहरूले ग्राहकको व्यक्तिगत उपस्थिति बिना मोबाइल एपमार्फत **अधिकतम रु. ५ लाखसम्म बिना धितो डिजिटल कर्जा** (Digital Nano Loan) प्रवाह गर्न पाउने व्यवस्था (उदा. फोनलोन / Fonepay Foneloan)।\n2. **रेगुलेटरी स्यान्डबक्स (Regulatory Sandbox):**\n   - राष्ट्र बैंकको चौथो रणनीतिक योजना अन्तर्गत नयाँ फिनटेक आविष्कारहरूलाई सीमित दायरामा परीक्षण गर्न स्यान्डबक्सको व्यवस्था।\n3. **ओपन बैंकिङ र API मापदण्डको आवश्यकता:**\n   - बैंकहरूले फिनटेक कम्पनीहरूलाई सुरक्षित Open API दिनुपर्ने नीतिगत बहस सुरु भएको छ।\n4. **नेपालमा सम्भावित नियोबैंक मोडेलहरू:**\n   - **पार्टनरशिप मोडेल (Front-end Neobank):** फिनटेक कम्पनीले एप चलाउने र पछाडि 'क' वर्गको वाणिज्य बैंकको लाइसेन्स प्रयोग गर्ने।\n   - **पूर्ण डिजिटल बैंक (Independent Digital Bank License):** भविष्यमा राष्ट्र बैंकले सिंगापुर र मलेसिया जस्तै छुट्टै डिजिटल बैंकिङ लाइसेन्स जारी गर्ने सम्भावना।\n\n---\n\n## ६. नियोबैंकका प्रमुख चुनौतीहरू र जोखिमहरू (Key Challenges & Risks)\n1. **साइबर सुरक्षा तथा एपीआई जोखिम (Cyber & API Vulnerabilities):**\n   - पूर्ण क्लाउडमा आधारित हुने हुँदा एपीआई ह्याकिङ, डाटा लिक, र सेवा अवरोध (Outage) को उच्च जोखिम।\n2. **निक्षेप संकलनमा जनविश्वासको अभाव (Trust Deficit):**\n   - भौतिक शाखा नदेख्दा नेपाल जस्तो विकासोन्मुख देशका आम नागरिकले ठूलो रकम निक्षेप राख्न हिचकिचाउने।\n3. **डिजिटल तथा वित्तीय साक्षरताको कमी:**\n   - ग्रामीण भेगका जनतालाई स्मार्टफोन, e-KYC र अनलाइन कारोबारमा दक्ष बनाउन समय लाग्ने।\n4. **सम्पत्ति शुद्धीकरण तथा सिन्थेटिक पहिचान ठगी (Synthetic Identity Theft):**\n   - नक्कली कागजात वा डीपफेक (Deepfake) भिडियोमार्फत Video KYC छलेर खाता खोल्ने जोखिम।\n\n---\n\n## ७. निष्कर्ष (Conclusion)\nभर्चुअल बैंक र नियोबैंक विश्व बैंकिङ क्षेत्रको अपरिहार्य भविष्य हुन्। नेपालले पनि समयमै स्पष्ट डिजिटल बैंकिङ ऐन, कडा साइबर सुरक्षा मापदण्ड र रेगुलेटरी स्यान्डबक्स कार्यान्वयन गरी नियोबैंकलाई खुला गरेमा यसले बैंकिङ पहुँच विस्तार, सञ्चालन लागत कटौती, र वित्तीय समावेशीकरणमा ऐतिहासिक फड्को मार्नेछ।",
    probableExamQuestions: [
      {
        marks: 15,
        questionNe: 'नियोबैंक (Neobank) वा भर्चुअल बैंक भन्नाले के बुझिन्छ? यसको प्राविधिक पूर्वाधार र ६-चरणीय ग्राहक यात्रा (Customer Journey) को चर्चा गर्दै परम्परागत वाणिज्य बैंकको तुलनामा यसको लागत संरचना कस्तो रहन्छ? नेपालमा नियोबैंक स्थापनाका सम्भावना र चुनौतीहरूको समीक्षा गर्नुहोस्।',
        questionEn: 'What is a Neobank or Virtual Bank? Discuss its technical architecture and 6-step customer journey, evaluate its cost structure compared to traditional banks, and examine opportunities and challenges for establishing neobanks in Nepal.',
        examLevel: 'NRB / RBB Level 6 / Officer Level',
        modelAnswerFramework: [
          '१. नियोबैंकको अवधारणा, विश्वव्यापी पृष्ठभूमि र परिभाषा (२.५ अङ्क)',
          '२. प्राविधिक पूर्वाधार (क्लाउड-नेटिभ, माइक्रोसर्भिस, ओपन एपीआई, एआई) (३ अङ्क)',
          '३. ६-चरणीय ग्राहक यात्रा (e-KYC देखि AI बजेटिङ र च्याटबटसम्म) (३ अङ्क)',
          '४. लागत संरचना तुलना (Cost-to-Income, CAPEX, OPEX) (२.५ अङ्क)',
          '५. नेपालमा सम्भावना (डिजिटल कर्जा, युवा जनसाङ्ख्यिकी) र चुनौती (साइबर, जनविश्वास, नियमन) (३ अङ्क)',
          '६. निष्कर्ष (१ अङ्क)'
        ]
      },
      {
        marks: 10,
        questionNe: 'ओपन बैंकिङ (Open Banking) र बैंकिङ एज अ सर्भिस (BaaS) को अवधारणा प्रस्ट पार्दै नेपालको वित्तीय क्षेत्रमा यसको सान्दर्भिकता पुष्टि गर्नुहोस्।',
        questionEn: 'Clarify the concepts of Open Banking and Banking-as-a-Service (BaaS) and substantiate their relevance in the Nepalese financial sector.',
        examLevel: 'NRB Level 5 & Assistant Director Level',
        modelAnswerFramework: [
          'Open Banking र BaaS को परिभाषा र प्राविधिक अन्तर (४ अङ्क)',
          'नेपालमा यसको सान्दर्भिकता (फिनटेक सहकार्य, डिजिटल कर्जा, NPI) (४ अङ्क)',
          'निष्कर्ष र नियमनको आवश्यकता (२ अङ्क)'
        ]
      }
    ]
  }
];
