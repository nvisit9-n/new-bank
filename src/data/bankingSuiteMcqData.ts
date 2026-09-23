export interface BankingSuiteMcqQuestion {
  id: string;
  topicId: string;
  topicNumber: number;
  questionNe: string;
  questionEn: string;
  optionsNe: string[];
  optionsEn: string[];
  correctOptionIndex: number;
  explanationNe: string;
  examTag: string;
}

export const BANKING_SUITE_MCQS: BankingSuiteMcqQuestion[] = [
  // Topic 1: Financial Statements & Ratio Analysis
  {
    id: 't1-mcq-1',
    topicId: 'financial-statement-ratio-analysis',
    topicNumber: 1,
    questionNe: 'NFRS / NAS 1 अनुसार वित्तीय विवरणको पूर्ण सेट (Complete Set of Financial Statements) मा कतिवटा अनिवार्य अङ्गहरू हुन्छन्?',
    questionEn: 'According to NFRS / NAS 1, how many components are there in a complete set of financial statements?',
    optionsNe: ['३ वटा', '४ वटा', '५ वटा', '६ वटा'],
    optionsEn: ['3 components', '4 components', '5 components', '6 components'],
    correctOptionIndex: 2,
    explanationNe: 'NFRS / NAS 1 अनुसार ५ वटा अनिवार्य अङ्गहरू हुन्छन्: १. वित्तीय अवस्थाको विवरण (SOFP), २. नाफा वा नोक्सान तथा अन्य विस्तृत आम्दानीको विवरण (SOPL), ३. नगद प्रवाह विवरण (NAS 7), ४. इक्विटी परिवर्तन विवरण, र ५. लेखा नीति तथा व्याख्यात्मक टिप्पणीहरू।',
    examTag: 'NRB Level 5 / RBB'
  },
  {
    id: 't1-mcq-2',
    topicId: 'financial-statement-ratio-analysis',
    topicNumber: 1,
    questionNe: 'नेपाल राष्ट्र बैंकको एकीकृत निर्देशन अनुसार वाणिज्य बैंकहरूले कायम गर्नुपर्ने न्यूनतम पुँजी पर्याप्तता अनुपात (CAR) कति हो?',
    questionEn: 'What is the minimum Capital Adequacy Ratio (CAR) required for commercial banks under NRB Unified Directives?',
    optionsNe: ['८.५%', '१०.०%', '११.०%', '१२.०%'],
    optionsEn: ['8.5%', '10.0%', '11.0%', '12.0%'],
    correctOptionIndex: 2,
    explanationNe: 'नेपाल राष्ट्र बैंकको निर्देशन नं. १ (पुँजी कोष) अनुसार वाणिज्य बैंकहरूले न्यूनतम ११.०% कुल पुँजी कोष (CAR/CRAR) र कम्तीमा ८.५% प्राथमिक पुँजी (Tier 1) कायम गर्नुपर्दछ।',
    examTag: 'NRB Directive No. 1'
  },
  {
    id: 't1-mcq-3',
    topicId: 'financial-statement-ratio-analysis',
    topicNumber: 1,
    questionNe: 'नेपाल राष्ट्र बैंकको निर्देशन अनुसार बैंक तथा वित्तीय संस्थाको कर्जा-निक्षेप अनुपात (CD Ratio) को अधिकतम सीमा कति तोकिएको छ?',
    questionEn: 'What is the maximum statutory limit for the Credit-to-Deposit (CD) Ratio as per NRB directives?',
    optionsNe: ['८०%', '८५%', '९०%', '९५%'],
    optionsEn: ['80%', '85%', '90%', '95%'],
    correctOptionIndex: 2,
    explanationNe: 'नेपाल राष्ट्र बैंकले निर्देशन नं. २ मार्फत कर्जा-निक्षेप अनुपात (CD Ratio) को अधिकतम सीमा ९०% तोकेको छ।',
    examTag: 'NRB Directive No. 2'
  },
  {
    id: 't1-mcq-4',
    topicId: 'financial-statement-ratio-analysis',
    topicNumber: 1,
    questionNe: 'शीघ्र अनुपात (Quick / Acid-Test Ratio) गणना गर्दा चालु सम्पत्तिबाट के घटाइन्छ?',
    questionEn: 'What is deducted from Current Assets when calculating the Quick Ratio?',
    optionsNe: ['नगद र बैंक मौज्दात', 'मौज्दात (Inventory) र पेश्की खर्च (Prepaid Expenses)', 'प्राप्य हिसाब (Debtors)', 'छोटो अवधिको लगानी'],
    optionsEn: ['Cash and Bank Balance', 'Inventory and Prepaid Expenses', 'Accounts Receivable', 'Short-term Investments'],
    correctOptionIndex: 1,
    explanationNe: 'Quick Assets = Current Assets - Inventory - Prepaid Expenses। मौज्दात र पेश्की खर्च तुरुन्त नगदमा परिणत हुन नसक्ने भएकाले शीघ्र अनुपातबाट घटाइन्छ। यसको आदर्श मानक १:१ हो।',
    examTag: 'Accounting Ratio'
  },
  {
    id: 't1-mcq-5',
    topicId: 'financial-statement-ratio-analysis',
    topicNumber: 1,
    questionNe: 'राष्ट्र बैंकको नियामकीय व्यवस्था अनुसार बैंकहरूको कुल कर्जामा निष्क्रिय कर्जा (NPL Ratio) अधिकतम कति प्रतिशत भन्दा बढी हुनु हुँदैन?',
    questionEn: 'What is the regulatory upper ceiling for Non-Performing Loan (NPL) Ratio in banks according to NRB?',
    optionsNe: ['३%', '५%', '७%', '१०%'],
    optionsEn: ['3%', '5%', '7%', '10%'],
    correctOptionIndex: 1,
    explanationNe: 'राष्ट्र बैंकको मापदण्ड अनुसार कुल कर्जामा खराब/निष्क्रिय कर्जा (NPL) को अंश ५% भन्दा बढी हुनु हुँदैन। ५% भन्दा माथि पुगेमा बैंकलाई शीघ्र सुधारात्मक कारबाही (PCA) हुन सक्छ।',
    examTag: 'NRB Prudential Norms'
  },

  // Topic 2: E-Commerce
  {
    id: 't2-mcq-1',
    topicId: 'e-commerce-banking-nepal',
    topicNumber: 2,
    questionNe: 'नेपालमा विद्युतीय कारोबार, डिजिटल हस्ताक्षर तथा साइबर अपराध नियन्त्रण सम्बन्धी मुख्य कानुन कुन हो?',
    questionEn: 'Which is the primary legislation governing electronic transactions and cyber crimes in Nepal?',
    optionsNe: ['विद्युतीय कारोबार ऐन, २०६३', 'सूचना प्रविधि ऐन, २०५३', 'उपभोक्ता संरक्षण ऐन, २०७५', 'भुक्तानी तथा फछ्र्यौट ऐन, २०७५'],
    optionsEn: ['Electronic Transactions Act, 2063', 'Information Technology Act, 2053', 'Consumer Protection Act, 2075', 'Payment and Settlement Act, 2075'],
    correctOptionIndex: 0,
    explanationNe: 'नेपालमा विद्युतीय कारोबारलाई कानुनी मान्यता दिन, डिजिटल हस्ताक्षर प्रमाणीकरण गर्न र साइबर अपराधमा दण्ड-सजाय गर्न विद्युतीय कारोबार ऐन, २०६३ (ETA 2063) लागू गरिएको हो।',
    examTag: 'Banking Law'
  },
  {
    id: 't2-mcq-2',
    topicId: 'e-commerce-banking-nepal',
    topicNumber: 2,
    questionNe: 'Hamrobazar वा Facebook Marketplace मार्फत एक सर्वसाधारणले अर्को सर्वसाधारणलाई सामान बेच्ने मोडल कुन हो?',
    questionEn: 'Selling goods between individual consumers on platforms like Hamrobazar represents which e-commerce model?',
    optionsNe: ['B2B', 'B2C', 'C2C', 'C2B'],
    optionsEn: ['B2B', 'B2C', 'C2C', 'C2B'],
    correctOptionIndex: 2,
    explanationNe: 'Consumer-to-Consumer (C2C) मोडलमा एक उपभोक्ताले अर्को उपभोक्तालाई सिधै सामान खरिद-बिक्री गर्दछ।',
    examTag: 'E-Commerce Models'
  },
  {
    id: 't2-mcq-3',
    topicId: 'e-commerce-banking-nepal',
    topicNumber: 2,
    questionNe: 'नेपालमा ई-कमर्सको तीव्र विकासमा देखिएको सबैभन्दा ठूलो व्यावहारिक चुनौती कुन हो?',
    questionEn: 'What is the most prominent operational bottleneck for e-commerce growth in Nepal?',
    optionsNe: ['नयाँ कम्प्युटरको अभाव', 'क्यास अन डेलिभरी (COD) मा अत्यधिक निर्भरता र कमजोर लजिस्टिक्स', 'बैंक खाताको अभाव', 'इन्टरनेटको पूर्ण अनुपस्थिति'],
    optionsEn: ['Lack of computers', 'High dependency on Cash on Delivery (COD) and weak logistics', 'Lack of bank accounts', 'Absence of internet'],
    correctOptionIndex: 1,
    explanationNe: 'नेपालमा ७०% भन्दा बढी अनलाइन किनमेल अझै क्यास अन डेलिभरी (COD) मा हुनु, सामान फिर्ता आउँदा ढुवानी घाटा हुनु र भरपर्दो ठेगाना प्रणाली नहुनु मुख्य चुनौती हुन्।',
    examTag: 'Syllabus Problem'
  },

  // Topic 3: Electronic Payment System (EPS)
  {
    id: 't3-mcq-1',
    topicId: 'electronic-payment-system-eps',
    topicNumber: 3,
    questionNe: 'नेपालमा भुक्तानी तथा फछ्र्यौट सम्बन्धी मूल ऐन "भुक्तानी तथा फछ्र्यौट ऐन" कुन वर्ष प्रमाणीकरण भएको हो?',
    questionEn: 'In which year was the Payment and Settlement Act enacted in Nepal?',
    optionsNe: ['वि.सं. २०७२', 'वि.सं. २०७३', 'वि.सं. २०७५', 'वि.सं. २०७८'],
    optionsEn: ['2072 BS', '2073 BS', '2075 BS', '2078 BS'],
    correctOptionIndex: 2,
    explanationNe: 'नेपालमा विद्युतीय भुक्तानी, क्लियरिङ र फछ्र्यौटलाई व्यवस्थित गर्न भुक्तानी तथा फछ्र्यौट ऐन, २०७५ प्रमाणीकरण भई लागू भएको हो।',
    examTag: 'Payment Acts'
  },
  {
    id: 't3-mcq-2',
    topicId: 'electronic-payment-system-eps',
    topicNumber: 3,
    questionNe: 'नेपाल राष्ट्र बैंकद्वारा सञ्चालित RTGS प्रणालीमार्फत न्यूनतम कति रकमभन्दा माथिका ठूला कारोबारहरू रियल-टाइममा फछ्र्यौट गरिन्छन्?',
    questionEn: 'Transactions above what minimum amount are settled in real-time through the NRB-operated RTGS system?',
    optionsNe: ['रु. ५०,०००', 'रु. १,००,०००', 'रु. २,००,०००', 'रु. १०,००,०००'],
    optionsEn: ['NPR 50,000', 'NPR 1,00,000', 'NPR 2,00,000', 'NPR 10,00,000'],
    correctOptionIndex: 2,
    explanationNe: 'RTGS (Real-Time Gross Settlement) मा प्रणालीगत जोखिम कम गर्न सामान्यतया रु. २ लाखभन्दा माथिका उच्च मूल्यका कारोबारहरू तत्काल फछ्र्यौट गरिन्छन्।',
    examTag: 'NRB RTGS Norms'
  },
  {
    id: 't3-mcq-3',
    topicId: 'electronic-payment-system-eps',
    topicNumber: 3,
    questionNe: 'भुक्तानी तथा फछ्र्यौट विनियमावली, २०७७ अनुसार भुक्तानी प्रणाली सञ्चालक (PSO) का लागि न्यूनतम चुक्ता पुँजी कति तोकिएको छ?',
    questionEn: 'What is the minimum paid-up capital requirement for a Payment System Operator (PSO) in Nepal?',
    optionsNe: ['रु. ५ करोड', 'रु. १० करोड', 'रु. ४० करोड देखि ५० करोड', 'रु. १ अर्ब'],
    optionsEn: ['NPR 5 Crore', 'NPR 10 Crore', 'NPR 40 to 50 Crore', 'NPR 1 Billion'],
    correctOptionIndex: 2,
    explanationNe: 'वालेट सञ्चालन गर्ने भुक्तानी सेवा प्रदायक (PSP) को लागि रु. ५ करोड (कार्ड सहित १० करोड) र स्वीच वा क्लियरिङ सञ्चालन गर्ने PSO का लागि रु. ४० देखि ५० करोड पुँजी तोकिएको छ।',
    examTag: 'NRB Licensing'
  },

  // Topic 4: Virtual Currency & CBDC
  {
    id: 't4-mcq-1',
    topicId: 'virtual-currency-and-cbdc',
    topicNumber: 4,
    questionNe: 'नेपालमा क्रिप्टोकरेन्सी कारोबारलाई पूर्णतः गैरकानुनी घोषणा गर्ने प्रमुख कानुनी आधारहरू कुन-कुन हुन्?',
    questionEn: 'What are the main legal grounds that declare cryptocurrency transactions illegal in Nepal?',
    optionsNe: [
      'नेपाल राष्ट्र बैंक ऐन २०५८ को दफा ४३ र विदेशी विनिमय ऐन २०१९ को दफा ९ग',
      'कम्पनी ऐन २०६३ को दफा १०',
      'बैंकिङ कसूर तथा सजाय ऐन २०६४ को दफा ५',
      'धितोपत्र ऐन २०६३ को दफा २०'
    ],
    optionsEn: [
      'NRB Act 2058 Sec 43 and Forex Act 2019 Sec 9C',
      'Company Act 2063 Sec 10',
      'Banking Offence Act 2064 Sec 5',
      'Securities Act 2063 Sec 20'
    ],
    correctOptionIndex: 0,
    explanationNe: 'नेपाल राष्ट्र बैंक ऐन २०५८ को दफा ४३ ले मुद्रा निष्कासनको एकाधिकार राष्ट्र बैंकलाई दिएको छ र विदेशी विनिमय (नियमित गर्ने) ऐन २०१९ को दफा ९ग ले अनुमति बिना विदेशी मुद्रा/सम्पत्ति कारोबार निषेध गरेको छ।',
    examTag: 'Legal Provision'
  },
  {
    id: 't4-mcq-2',
    topicId: 'virtual-currency-and-cbdc',
    topicNumber: 4,
    questionNe: 'क्रिप्टोकरेन्सी र केन्द्रीय बैंक डिजिटल मुद्रा (CBDC) बीचको सबैभन्दा मुख्य आधारभूत भिन्नता के हो?',
    questionEn: 'What is the most fundamental difference between cryptocurrency and CBDC?',
    optionsNe: [
      'क्रिप्टो मोबाइलमा चल्छ, CBDC कम्प्युटरमा',
      'CBDC केन्द्रीय बैंकको आधिकारिक कानुनी दायित्व (Sovereign Liability) हो, क्रिप्टोमा कुनै प्रत्याभूति हुँदैन',
      'क्रिप्टो सस्तो हुन्छ, CBDC महँगो हुन्छ',
      'कुनै भिन्नता छैन'
    ],
    optionsEn: [
      'Crypto runs on mobile, CBDC on PC',
      'CBDC is a sovereign liability of the central bank with legal tender status; crypto has no sovereign backing',
      'Crypto is cheaper, CBDC is expensive',
      'There is no difference'
    ],
    correctOptionIndex: 1,
    explanationNe: 'CBDC राष्ट्रिय मुद्रा सरह केन्द्रीय बैंकको प्रत्यक्ष दायित्व (Sovereign Liability) र कानुनी ग्राह्य (Legal Tender) हुन्छ, जबकि क्रिप्टोकरेन्सी निजी र सट्टेबाजीयुक्त कोड मात्र हो।',
    examTag: 'Core Concept'
  },
  {
    id: 't4-mcq-3',
    topicId: 'virtual-currency-and-cbdc',
    topicNumber: 4,
    questionNe: 'नेपाल राष्ट्र बैंकको सन् २०२२ को CBDC सम्भाव्यता अध्ययनले नेपालका लागि कुन मोडेल बढी उपयुक्त हुने सुझाव दिएको छ?',
    questionEn: 'Which architecture model did the NRB 2022 CBDC Feasibility Study recommend for Nepal?',
    optionsNe: ['शतप्रतिशत निजी क्रिप्टो मोडेल', 'दुई-तहको हाइब्रिड मोडेल (Two-Tier Hybrid Retail Model)', 'केवल विदेशी बैंकहरूले मात्र चलाउने मोडेल', 'अनलाइन बैंकिङ खारेज गर्ने मोडेल'],
    optionsEn: ['100% Private Crypto Model', 'Two-Tier Hybrid Retail Model', 'Foreign-banks only Model', 'Abolishing online banking'],
    correctOptionIndex: 1,
    explanationNe: 'राष्ट्र बैंकको अध्ययनले दुई-तहको (Two-Tier Hybrid) मोडल उपयुक्त हुने निष्कर्ष दिएको छ, जहाँ राष्ट्र बैंकले CBDC निष्कासन गर्छ र वाणिज्य बैंक तथा वित्तीय संस्थाले वितरण र वालेट व्यवस्थापन गर्दछन्।',
    examTag: 'NRB Study 2022'
  },

  // Topic 5: Virtual Bank / Neobank
  {
    id: 't5-mcq-1',
    topicId: 'virtual-bank-neobank',
    topicNumber: 5,
    questionNe: '"Banking is essential, banks are not" (बैंकिङ सेवा अपरिहार्य छ, भौतिक बैंक होइन) भन्ने चर्चित भनाइ कसको हो?',
    questionEn: 'Who famously quoted "Banking is essential, banks are not"?',
    optionsNe: ['वारेन बफेट (Warren Buffett)', 'बिल गेट्स (Bill Gates)', 'मिल्टन फ्राइडम्यान (Milton Friedman)', 'अडम स्मिथ (Adam Smith)'],
    optionsEn: ['Warren Buffett', 'Bill Gates', 'Milton Friedman', 'Adam Smith'],
    correctOptionIndex: 1,
    explanationNe: 'सन् १९९४ मा माइक्रोसफ्टका संस्थापक बिल गेट्स (Bill Gates) ले यो भनाइ व्यक्त गरेका थिए, जसले आजका भर्चुअल बैंक र नियोबैंकहरूको वैचारिक आधारशीला खडा गरेको छ।',
    examTag: 'Banking Quotation'
  },
  {
    id: 't5-mcq-2',
    topicId: 'virtual-bank-neobank',
    topicNumber: 5,
    questionNe: 'भर्चुअल बैंक (Neobank) को सबैभन्दा विशिष्ट संरचनात्मक विशेषता कुन हो?',
    questionEn: 'What is the most distinct structural feature of a virtual bank (Neobank)?',
    optionsNe: [
      'कुनै पनि भौतिक शाखा वा काउन्टर (Brick-and-mortar) नहुनु र १००% डिजिटल सञ्चालन',
      'केवल अमेरिकी डलरमा मात्र कारोबार गर्नु',
      'सरकारको कुनै नियमन नहुनु',
      'कर्मचारीहरूले मात्र ऋण लिन पाउनु'
    ],
    optionsEn: [
      'Zero brick-and-mortar branches and 100% digital operations',
      'Transacting only in USD',
      'Zero regulatory supervision',
      'Only employees can take loans'
    ],
    correctOptionIndex: 0,
    explanationNe: 'भर्चुअल बैंकको कुनै भौतिक शाखा वा काउन्टर हुँदैन। खाता खोल्ने, ऋण दिने, ब्याज दिने सबै कार्यहरू मोबाइल एप, क्लाउड सर्भर र AI बाटै सञ्चालन हुन्छन्।',
    examTag: 'Neobank Feature'
  },
  {
    id: 't5-mcq-3',
    topicId: 'virtual-bank-neobank',
    topicNumber: 5,
    questionNe: 'नेपालमा हालसम्म छुट्टै भर्चुअल बैंक स्थापना हुन नसक्नुको मुख्य कानुनी अड्चन के हो?',
    questionEn: 'What is the primary statutory bottleneck preventing independent virtual banks in Nepal?',
    optionsNe: [
      'नेपालमा कसैले इन्टरनेट नचलाउनु',
      'BAFIA २०७३ ले भौतिक कार्यालय, शाखा भवन र भौतिक संरचनालाई मात्र आधार मानेको हुनु',
      'नेपालमा सफ्टवेयर इन्जिनियर नहुनु',
      'विदेशी बैंकहरूले प्रतिबन्ध लगाउनु'
    ],
    optionsEn: [
      'Nobody uses internet in Nepal',
      'BAFIA 2073 envisions banks with physical branch infrastructure only',
      'Absence of software engineers',
      'Foreign bank ban'
    ],
    correctOptionIndex: 1,
    explanationNe: 'हालको बैंक तथा वित्तीय संस्था सम्बन्धी ऐन (BAFIA, २०७३) ले भौतिक शाखा, काउन्टर र भवन भएको बैंकको मात्र कल्पना गरेको हुँदा छुट्टै डिजिटल बैंक लाइसेन्सिङ ऐन वा BAFIA संशोधन आवश्यक छ।',
    examTag: 'BAFIA 2073'
  }
];
