import { FlashcardItem } from '../types';

export const FLASHCARD_ITEMS: FlashcardItem[] = [
  // ==========================================
  // १. मुख्य कानुनी परिभाषाहरू (LEGAL DEFINITIONS)
  // ==========================================
  {
    id: 'fc-legal-01',
    category: 'legal',
    categoryLabelNe: 'ऐन तथा कानुनी परिभाषा',
    categoryLabelEn: 'Legal Definition',
    termNe: 'बैंक वा वित्तीय संस्था (Bank or Financial Institution)',
    termEn: 'Bank or Financial Institution (BAFIA 2073)',
    actRef: 'बैंक तथा वित्तीय संस्था सम्बन्धी ऐन, २०७३ (BAFIA 2073)',
    sectionRef: 'दफा २ (ख) तथा दफा ३१',
    definitionNe: 'नेपाल राष्ट्र बैंकबाट इजाजतपत्र प्राप्त गरी दफा ४९ बमोजिम वित्तीय कारोबार सञ्चालन गर्न स्थापना भएको "क", "ख", "ग" वा "घ" वर्गको संगठित संस्था।',
    definitionEn: 'An institution licensed by Nepal Rastra Bank to carry on banking and financial transactions classified into "A", "B", "C", or "D" classes.',
    keyPointsNe: [
      'नेपाल राष्ट्र बैंकको इजाजतपत्र अनिवार्य',
      'चार वर्गमा वर्गीकरण ("क" वाणिज्य बैंक, "ख" विकास बैंक, "ग" वित्त कम्पनी, "घ" लघुवित्त वित्तीय संस्था)',
      'अविच्छिन्न उत्तराधिकारवाला स्वशासित र संगठित संस्था'
    ],
    examSignificanceNe: 'लिखित परीक्षा खण्ड (क) कानुन र ऐनमा अनिवार्य सोधिने आधारभूत परिभाषा।',
    memoryMnemonicNe: 'संकेत सूत्र: "इजाजत + वर्गीकरण (क,ख,ग,घ) + दफा ४९ कारोबार"',
    difficulty: 'Easy'
  },
  {
    id: 'fc-legal-02',
    category: 'legal',
    categoryLabelNe: 'ऐन तथा कानुनी परिभाषा',
    categoryLabelEn: 'Legal Definition',
    termNe: 'बैंकिङ कसूर (Banking Offence)',
    termEn: 'Banking Offence (Act 2064)',
    actRef: 'बैंकिङ कसूर तथा सजाय ऐन, २०६४',
    sectionRef: 'दफा ३ देखि १४',
    definitionNe: 'बैंक वा वित्तीय संस्थाको सम्पत्ति हिनामिना, अनाधिकृत ऋण प्रवाह, नक्कली धितो, खातामा रकम नभई चेक जारी गर्ने वा वित्तीय प्रणालीमा हानि-नोक्सानी पुर्‍याउने गरी गरिएका गैरकानुनी कार्य।',
    definitionEn: 'Illegal activities including embezzlement of bank assets, unauthorized lending, fake collateral, issuing checks without sufficient funds, and harming financial integrity.',
    keyPointsNe: [
      'खातामा पर्याप्त रकम नभई चेक जारी गर्नु (चेक अनादर/चेक बाउन्स)',
      'नक्कली कागजात वा कमसल धितो राखेर ऋण लिनु/दिनु',
      'संस्थाको कोषको दुरुपयोग वा हिनामिना गर्नु',
      'विद्युतीय माध्यम (ATM, कार्ड, मोबाइल बैंकिङ) बाट अनाधिकृत रकम झिक्नु'
    ],
    examSignificanceNe: 'राष्ट्र बैंक, रा.वा.बैंक, कृषि विकास बैंक परीक्षाको द्वितीय पत्रमा ५ वा १० अङ्कमा बारम्बार सोधिने प्रश्न।',
    memoryMnemonicNe: 'संकेत सूत्र: "अनाधिकृत चेक + नक्कली धितो + कोष दुरुपयोग + विद्युतीय ठगी"',
    difficulty: 'Medium'
  },
  {
    id: 'fc-legal-03',
    category: 'risk_aml',
    categoryLabelNe: 'सम्पत्ति शुद्धीकरण तथा जोखिम',
    categoryLabelEn: 'AML/CFT & Risk',
    termNe: 'सम्पत्ति शुद्धीकरण (Money Laundering)',
    termEn: 'Money Laundering (AML Act 2064)',
    actRef: 'सम्पत्ति शुद्धीकरण (मनी लाउण्डरिङ्ग) निवारण ऐन, २०६४',
    sectionRef: 'दफा ३ र ४',
    definitionNe: 'कुनै पनि गैरकानुनी वा कसूरजन्य कार्य (अपराध) बाट आर्जित कालो धनलाई वैध वा कानुनी स्रोतबाट प्राप्त भएको देखाउने कपटपूर्ण एवं जटिल प्रक्रिया।',
    definitionEn: 'The process of concealing or disguising the illicit origins of criminal proceeds to make them appear legitimate.',
    keyPointsNe: [
      '३ मुख्य चरण: १. Placement (जम्मा), २. Layering (तहकीकरण), ३. Integration (एकीकरण)',
      'आतंकवादी कार्यमा वित्तीय लगानी (CFT) सँग अन्तरसम्बन्धित',
      'बैंकले अनिवार्य शङ्कास्पद कारोबार प्रतिवेदन (STR) र सीमाना कारोबार प्रतिवेदन (TTR) FIU लाई पठाउनुपर्ने'
    ],
    examSignificanceNe: 'राष्ट्रिय तथा अन्तर्राष्ट्रिय (FATF/APG) सन्दर्भमा नेपालको बैंकिङ परीक्षामा सर्वाधिक सोधिने विषय।',
    memoryMnemonicNe: '३ चरण सूत्र: "PLI = Placement (जम्मा) -> Layering (तहकीकरण) -> Integration (वैधता)"',
    difficulty: 'Hard'
  },
  {
    id: 'fc-legal-04',
    category: 'legal',
    categoryLabelNe: 'ऐन तथा कानुनी परिभाषा',
    categoryLabelEn: 'Legal Definition',
    termNe: 'केन्द्रीय बैंक (Central Bank & Objectives)',
    termEn: 'Central Bank Objectives (NRB Act 2058)',
    actRef: 'नेपाल राष्ट्र बैंक ऐन, २०५८',
    sectionRef: 'दफा ४ (उद्देश्यहरू)',
    definitionNe: 'देशको समग्र मौद्रिक, बैंकिङ तथा वित्तीय प्रणालीको नियमन, सुपरीवेक्षण र स्थायित्व कायम गर्न स्थापित सर्वोच्च मौद्रिक निकाय।',
    definitionEn: 'The apex monetary authority established to regulate, supervise, and ensure stability of monetary, banking, and payment systems.',
    keyPointsNe: [
      'मूल्य र शोधनान्तर स्थायित्व कायम गरी आर्थिक वृद्धिमा सघाउ पुर्‍याउनु',
      'वित्तीय क्षेत्रको स्थायित्व र वित्तीय सेवाको पहुँच अभिवृद्धि गर्नु',
      'सुरक्षित, स्वस्थ तथा सक्षम भुक्तानी प्रणालीको विकास गर्नु'
    ],
    examSignificanceNe: 'नेपाल राष्ट्र बैंक ऐनको दफा ४ मा उल्लेखित तीन प्रमुख उद्देश्यहरू कण्ठ हुनु अनिवार्य छ।',
    memoryMnemonicNe: 'संकेत सूत्र: "मूल्य + वित्तीय स्थायित्व + सक्षम भुक्तानी"',
    difficulty: 'Easy'
  },
  {
    id: 'fc-legal-05',
    category: 'legal',
    categoryLabelNe: 'ऐन तथा कानुनी परिभाषा',
    categoryLabelEn: 'Legal Definition',
    termNe: 'वित्तीय स्वार्थ (Financial Interest)',
    termEn: 'Financial Interest (BAFIA 2073)',
    actRef: 'बैंक तथा वित्तीय संस्था सम्बन्धी ऐन, २०७३',
    sectionRef: 'दफा २ (त)',
    definitionNe: 'सञ्चालक, पदाधिकारी वा शेयरधनीको प्रत्यक्ष वा अप्रत्यक्ष रूपमा कुनै कम्पनी वा फर्ममा कुल चुक्ता पुँजीको १ प्रतिशत वा सोभन्दा बढी शेयर स्वामित्व वा वित्तीय लाभ गाँसिएको अवस्था।',
    definitionEn: 'Direct or indirect ownership of 1% or more share capital or financial stake in any company or firm by a director or official.',
    keyPointsNe: [
      '१ प्रतिशत वा सोभन्दा बढी शेयर स्वामित्व भएमा वित्तीय स्वार्थ मानिने',
      'सञ्चालकले स्वार्थ बाझिने निर्णय प्रक्रिया वा मतदानमा भाग लिन नपाउने',
      'सुशासन प्रवर्द्धन र स्वार्थको द्वन्द्व (Conflict of Interest) रोक्न व्यवस्था गरिएको'
    ],
    examSignificanceNe: 'बैंक सुशासन तथा कर्जा प्रवाहको सीमा निर्धारणमा महत्त्वपूर्ण।',
    memoryMnemonicNe: 'संकेत सूत्र: "१% शेयर + सञ्चालक संलग्नता + स्वार्थ बाझिने रोक्ने"',
    difficulty: 'Medium'
  },
  {
    id: 'fc-legal-06',
    category: 'legal',
    categoryLabelNe: 'ऐन तथा कानुनी परिभाषा',
    categoryLabelEn: 'Legal Definition',
    termNe: 'गोपनीयता कायम राख्नुपर्ने (Banking Secrecy)',
    termEn: 'Confidentiality of Customer Information',
    actRef: 'बैंक तथा वित्तीय संस्था सम्बन्धी ऐन, २०७३',
    sectionRef: 'दफा ११०',
    definitionNe: 'बैंक तथा वित्तीय संस्थाका सञ्चालक, कर्मचारी वा लेखापरीक्षकले ग्राहकको खाता, मौज्दात तथा कारोबार सम्बन्धी विवरण गोप्य राख्नुपर्ने कानुनी दायित्व।',
    definitionEn: 'The statutory duty of directors, employees, and auditors to maintain strict confidentiality of customer accounts and transactions.',
    keyPointsNe: [
      'ग्राहकको अनुमति विना खाता विवरण कसैलाई दिन नपाइने',
      'अपवाद: अदालतको आदेश, राष्ट्र बैंकको निर्देशन, अनुसन्धान निकाय (सम्पत्ति शुद्धीकरण, अख्तियार), वा कर्जा सूचना केन्द्र'
    ],
    examSignificanceNe: 'बैंकिङ नैतिकता र ग्राहक विश्वासको मूल खम्बा।',
    memoryMnemonicNe: 'संकेत सूत्र: "दफा ११० = ग्राहकको गोपनीयता + अनुसन्धान/अदालत बाहेक सुरक्षित"',
    difficulty: 'Medium'
  },
  {
    id: 'fc-legal-07',
    category: 'legal',
    categoryLabelNe: 'ऐन तथा कानुनी परिभाषा',
    categoryLabelEn: 'Legal Definition',
    termNe: 'अन्तिम ऋणदाता सुविधा (Lender of Last Resort - LOLR)',
    termEn: 'Lender of Last Resort (NRB Act 2058)',
    actRef: 'नेपाल राष्ट्र बैंक ऐन, २०५८',
    sectionRef: 'दफा ६८',
    definitionNe: 'कुनै इजाजतपत्रप्राप्त बैंक वा वित्तीय संस्थाले बजारका अन्य स्रोतबाट तरलता प्राप्त गर्न नसकेको तर संस्था सक्षम रहेको अवस्थामा केन्द्रीय बैंकले प्रदान गर्ने आपतकालीन वित्तीय सहयोग।',
    definitionEn: 'Emergency liquidity assistance provided by the central bank to solvent financial institutions facing critical short-term liquidity distress.',
    keyPointsNe: [
      'वित्तीय संकटबाट समग्र बैंकिङ प्रणाली जोगाउन प्रयोग हुने',
      'सुरक्षित धितो (सरकारी ऋणपत्र आदि) को आधारमा मात्र प्रदान गरिने',
      'अन्तिम विकल्पका रूपमा मात्र प्रयोग हुने'
    ],
    examSignificanceNe: 'केन्द्रीय बैंकको कार्य तथा वित्तीय संकट व्यवस्थापन सम्बन्धी प्रश्नमा प्रमुख।',
    memoryMnemonicNe: 'संकेत सूत्र: "संकटमा केन्द्रीय बैंकको आपतकालीन ढोका"',
    difficulty: 'Hard'
  },
  {
    id: 'fc-legal-08',
    category: 'legal',
    categoryLabelNe: 'ऐन तथा कानुनी परिभाषा',
    categoryLabelEn: 'Legal Definition',
    termNe: 'कर्जा सूचना केन्द्र (Credit Information Bureau - CIB)',
    termEn: 'Credit Information Bureau (BAFIA 2073)',
    actRef: 'बैंक तथा वित्तीय संस्था सम्बन्धी ऐन, २०७३',
    sectionRef: 'दफा ८८',
    definitionNe: 'बैंक तथा वित्तीय संस्थाबाट कर्जा लिने ऋणीहरूको वित्तीय विवरण, भुक्तानी इतिहास र कालोसूची सम्बन्धी तथ्याङ्क संकलन, अद्यावधिक र आदानप्रदान गर्ने आधिकारिक निकाय।',
    definitionEn: 'The authorized bureau collecting, updating, and disseminating credit histories, borrower profiles, and blacklisting data across institutions.',
    keyPointsNe: [
      'कर्जा प्रवाह गर्नुपूर्व अनिवार्य CIB प्रतिवेदन लिनुपर्ने',
      'कालोसूची (Blacklist) मा परेका व्यक्ति वा संस्थालाई थप कर्जा दिन बन्देज',
      'कर्जा जोखिम न्यूनीकरण गर्ने प्रमुख औजार'
    ],
    examSignificanceNe: 'कर्जा व्यवस्थापन प्रक्रिया र खराब कर्जा नियन्त्रणमा अनिवार्य उल्लेख गर्नुपर्ने।',
    memoryMnemonicNe: 'संकेत सूत्र: "ऋणीको इतिहास + कालोसूची + सुरक्षित कर्जा"',
    difficulty: 'Easy'
  },

  // ==========================================
  // २. बैंकिङ तथा वित्तीय शब्दावली (BANKING & FINANCE)
  // ==========================================
  {
    id: 'fc-bank-01',
    category: 'banking',
    categoryLabelNe: 'बैंकिङ तथा वित्तीय शब्दावली',
    categoryLabelEn: 'Banking & Finance',
    termNe: 'अनिवार्य नगद मौज्दात (Cash Reserve Ratio - CRR)',
    termEn: 'Cash Reserve Ratio (CRR)',
    actRef: 'नेपाल राष्ट्र बैंक एकीकृत निर्देशन तथा मौद्रिक नीति',
    sectionRef: 'निर्देशन नं. १३ / तरलता व्यवस्थापन',
    definitionNe: 'वाणिज्य बैंक तथा वित्तीय संस्थाहरूले आफ्नो कुल निक्षेप दायित्वको निश्चित प्रतिशत रकम नेपाल राष्ट्र बैंकमा शून्य ब्याजदरमा नगद मौज्दातका रूपमा राख्नुपर्ने कानुनी व्यवस्था।',
    definitionEn: 'The minimum percentage of total deposit liabilities that commercial banks must maintain as cash reserves with the Nepal Rastra Bank.',
    keyPointsNe: [
      'हालको व्यवस्था: "क", "ख", "ग" वर्गका लागि ४.००% (4%) अनिवार्य',
      'उद्देश्य: निक्षेपकर्ताको रकमको सुरक्षा र बजार तरलता नियन्त्रण',
      'CRR घटेमा बजारमा तरलता बढ्छ, बढेमा तरलता संकुचन हुन्छ'
    ],
    examSignificanceNe: 'मौद्रिक नीतिका प्रत्यक्ष औजारहरू सम्बन्धी प्रश्नको अनिवार्य बुँदा।',
    memoryMnemonicNe: 'संकेत सूत्र: "राष्ट्र बैंकमा बिना ब्याज थन्किने ४% नगद"',
    difficulty: 'Easy'
  },
  {
    id: 'fc-bank-02',
    category: 'banking',
    categoryLabelNe: 'बैंकिङ तथा वित्तीय शब्दावली',
    categoryLabelEn: 'Banking & Finance',
    termNe: 'वैधानिक तरलता अनुपात (Statutory Liquidity Ratio - SLR)',
    termEn: 'Statutory Liquidity Ratio (SLR)',
    actRef: 'नेपाल राष्ट्र बैंक एकीकृत निर्देशन',
    sectionRef: 'निर्देशन नं. १३',
    definitionNe: 'बैंक तथा वित्तीय संस्थाहरूले आफ्नो कुल निक्षेपको निश्चित प्रतिशत रकम नगद, सुन, विदेशी मुद्रा र सरकारी ऋणपत्र (ट्रेजरी बिल आदि) का रूपमा मौज्दात राख्नुपर्ने व्यवस्था।',
    definitionEn: 'The mandatory proportion of net demand and time deposits that banks must hold in the form of liquid assets like cash, gold, or government securities.',
    keyPointsNe: [
      'हालको व्यवस्था: "क" वर्ग = १२%, "ख" र "ग" वर्ग = १०%',
      'CRR भन्दा फराकिलो (यसमा सरकारी सुरक्षण पत्रहरू पनि समावेश हुन्छन्)',
      'बैंकको वित्तीय तरलता संकटबाट बच्ने सुरक्षा कवच'
    ],
    examSignificanceNe: 'CRR र SLR बीचको भिन्नता बैंक परीक्षामा धेरै सोधिने प्रश्न हो।',
    memoryMnemonicNe: 'संकेत सूत्र: "SLR = नगद + सुन + सरकारी ऋणपत्र (वाणिज्य बैंक = १२%)"',
    difficulty: 'Medium'
  },
  {
    id: 'fc-bank-03',
    category: 'banking',
    categoryLabelNe: 'बैंकिङ तथा वित्तीय शब्दावली',
    categoryLabelEn: 'Banking & Finance',
    termNe: 'पुँजी पर्याप्तता अनुपात (Capital Adequacy Ratio - CAR)',
    termEn: 'Capital Adequacy Ratio (CAR / Basel III)',
    actRef: 'नेपाल राष्ट्र बैंक पुँजी पर्याप्तता ढाँचा (Capital Adequacy Framework)',
    sectionRef: 'बासेल ३ मापदण्ड (Basel III)',
    definitionNe: 'बैंकले बेहोर्नुपर्ने विभिन्न जोखिम (कर्जा, बजार, सञ्चालन) भारित सम्पत्तिको तुलनामा बैंकसँग रहेको कुल पुँजी (प्राथमिक + पूरक) को प्रतिशत अनुपात।',
    definitionEn: 'A measurement of a bank’s available capital expressed as a percentage of a bank’s risk-weighted credit, market, and operational exposures.',
    keyPointsNe: [
      'सूत्र: CAR = (Tier 1 Capital + Tier 2 Capital) / Total Risk Weighted Assets × 100',
      'न्यूनतम प्राथमिक पुँजी (Tier 1): ६.००%',
      'पूँजी संरक्षण बफर (CCB) सहित न्यूनतम कुल पुँजी: ११.००%'
    ],
    examSignificanceNe: 'बासेल ३ सम्बन्धी प्रश्न र बैंकको जोखिम वहन क्षमता मापनमा आधारभूत।',
    memoryMnemonicNe: 'सूत्र: "कुल पुँजी ÷ जोखिम भारित सम्पत्ति × १०० (न्यूनतम ११%)"',
    difficulty: 'Hard'
  },
  {
    id: 'fc-bank-04',
    category: 'banking',
    categoryLabelNe: 'बैंकिङ तथा वित्तीय शब्दावली',
    categoryLabelEn: 'Banking & Finance',
    termNe: 'आधार दर (Base Rate)',
    termEn: 'Base Rate Mechanism',
    actRef: 'नेपाल राष्ट्र बैंक एकीकृत निर्देशन',
    sectionRef: 'निर्देशन नं. ४ / ब्याजदर सम्बन्धी',
    definitionNe: 'बैंक तथा वित्तीय संस्थाले कर्जाको ब्याजदर निर्धारण गर्दा प्रयोग गर्ने आधारभूत लागत दर, जसमा कोषको लागत, अनिवार्य मौज्दात लागत, वैधानिक तरलता लागत र सञ्चालन लागत समावेश हुन्छ।',
    definitionEn: 'The minimum internal reference interest rate reflecting the bank’s cost of funds, CRR/SLR cost, and operating costs below which loans cannot be priced.',
    keyPointsNe: [
      'कर्जाको ब्याजदर = आधार दर (Base Rate) + प्रिमियम (Premium %)',
      'कुनै पनि ग्राहकलाई आधार दरभन्दा कम ब्याजदरमा कर्जा दिन पाइँदैन (केही सहुलियत बाहेक)',
      'ब्याजदर निर्धारण प्रक्रियालाई पारदर्शी र प्रतिस्पर्धात्मक बनाउँछ'
    ],
    examSignificanceNe: 'बैंकको वित्तीय विश्लेषण तथा ब्याजदर नीतिमा बारम्बार सोधिने अवधारणा।',
    memoryMnemonicNe: 'संकेत सूत्र: "कोष लागत + सञ्चालन खर्च = आधार दर + प्रिमियम = कर्जा ब्याजदर"',
    difficulty: 'Medium'
  },
  {
    id: 'fc-bank-05',
    category: 'banking',
    categoryLabelNe: 'बैंकिङ तथा वित्तीय शब्दावली',
    categoryLabelEn: 'Banking & Finance',
    termNe: 'ब्याजदर अन्तर (Interest Rate Spread)',
    termEn: 'Interest Rate Spread',
    actRef: 'नेपाल राष्ट्र बैंक एकीकृत निर्देशन',
    sectionRef: 'निर्देशन नं. ४',
    definitionNe: 'बैंकले कर्जामा लिने भारित औसत ब्याजदर र निक्षेपमा दिने भारित औसत ब्याजदर बीचको अन्तर वा भिन्नता।',
    definitionEn: 'The difference between the weighted average interest rate charged on loans and the weighted average interest rate paid on deposits.',
    keyPointsNe: [
      'हालको सीमा: वाणिज्य बैंकहरूको अधिकतम ब्याजदर अन्तर ४.००% भित्र हुनुपर्ने',
      'बैंकको खुद ब्याज आम्दानी (Net Interest Margin - NIM) को मुख्य स्रोत',
      'अत्यधिक स्प्रेड भएमा ऋणीलाई मर्का पर्ने र निक्षेपकर्ताले कम प्रतिफल पाउने भएकाले सीमा तोकिएको'
    ],
    examSignificanceNe: 'बैंकको नाफा र वित्तीय स्वास्थ्य मापन गर्ने प्रमुख सूचक।',
    memoryMnemonicNe: 'संकेत सूत्र: "कर्जा ब्याजदर - निक्षेप ब्याजदर (अधिकतम सीमा: ४.००%)"',
    difficulty: 'Easy'
  },
  {
    id: 'fc-bank-06',
    category: 'banking',
    categoryLabelNe: 'बैंकिङ तथा वित्तीय शब्दावली',
    categoryLabelEn: 'Banking & Finance',
    termNe: 'खराब कर्जा (Non-Performing Loan / NPA)',
    termEn: 'Non-Performing Assets (NPA)',
    actRef: 'नेपाल राष्ट्र बैंक एकीकृत निर्देशन नं. २',
    sectionRef: 'कर्जा वर्गीकरण र नोक्सानी व्यवस्था',
    definitionNe: 'साँवा वा ब्याज भुक्तानी भाखा नाघेको ९० दिन (३ महिना) भन्दा बढी अवधि व्यतीत भई असुलीमा जोखिम देखिएको कर्जा।',
    definitionEn: 'Loans and advances where principal or interest payments have remained overdue for more than 90 days.',
    keyPointsNe: [
      'सक्रिय कर्जा (Performing): असल (०-१ महिना, १.२%), सूक्ष्म निगरानी (१-३ महिना, ५%)',
      'निष्क्रिय कर्जा (NPA): कमसल (३-६ महिना, २५%), शङ्कास्पद (६-१२ महिना, ५०%), खराब (१ वर्षभन्दा बढी, १००%)',
      'NPA ५% भन्दा बढी भएमा संस्थालाई जोखिमयुक्त मानिन्छ'
    ],
    examSignificanceNe: 'बैंकिङ परीक्षाको सर्वाधिक चर्चित र शतप्रतिशत सोधिने मुख्य विषय।',
    memoryMnemonicNe: 'भाखा नाघेको तालिका: "कमसल (३-६m, २५%) -> शङ्कास्पद (६-१२m, ५०%) -> खराब (>१ वर्ष, १००%)"',
    difficulty: 'Hard'
  },
  {
    id: 'fc-bank-07',
    category: 'banking',
    categoryLabelNe: 'बैंकिङ तथा वित्तीय शब्दावली',
    categoryLabelEn: 'Banking & Finance',
    termNe: 'प्रतितपत्र (Letter of Credit - LC)',
    termEn: 'Letter of Credit (LC)',
    actRef: 'अन्तर्राष्ट्रिय व्यापार कानुन / UCPDC 600',
    sectionRef: 'अन्तर्राष्ट्रिय व्यापार वित्त (Trade Finance)',
    definitionNe: 'आयातकर्ताको अनुरोधमा जारीकर्ता बैंकले तोकिएका सर्तहरू र कागजातहरू पेश भएमा निर्यातकर्तालाई भुक्तानी दिने गरी जारी गरेको लिखित प्रतिबद्धता पत्र।',
    definitionEn: 'A financial document issued by an issuing bank guaranteeing that a buyer’s payment to a seller will be received on time and for the correct amount upon delivery of conforming documents.',
    keyPointsNe: [
      '४ मुख्य पक्षहरू: १. Applicant (आयातकर्ता), २. Issuing Bank (जारीकर्ता बैंक), ३. Beneficiary (निर्यातकर्ता), ४. Advising/Confirming Bank',
      'अन्तर्राष्ट्रिय व्यापारमा अविश्वासको जोखिम हटाउने माध्यम',
      'गैर-कोषमा आधारित (Non-Fund Based) कर्जा सुविधा'
    ],
    examSignificanceNe: 'अन्तर्राष्ट्रिय व्यापार र वैदेशिक विनिमय सम्बन्धी प्रश्नमा अनिवार्य।',
    memoryMnemonicNe: 'संकेत सूत्र: "बैंकको ग्यारेन्टीयुक्त आयात-निर्यात भुक्तानी पत्र"',
    difficulty: 'Medium'
  },
  {
    id: 'fc-bank-08',
    category: 'banking',
    categoryLabelNe: 'बैंकिङ तथा वित्तीय शब्दावली',
    categoryLabelEn: 'Banking & Finance',
    termNe: 'बैंक जमानत (Bank Guarantee)',
    termEn: 'Bank Guarantee (BG)',
    actRef: 'मुलुकी देवानी संहिता, २०७४ तथा बैंकिङ अभ्यास',
    sectionRef: 'करार ऐन / बैंकिङ निर्देशन',
    definitionNe: 'मूल ऋणी वा ठेकेदारले आफ्नो दायित्व वा सम्झौता पूरा नगरेमा बैंकले तोकिएको निश्चित रकम तेस्रो पक्ष (Beneficiary) लाई भुक्तानी गरिदिने भनी दिएको कानुनी दायित्व।',
    definitionEn: 'An irrevocable promise by a bank to pay an agreed amount to a beneficiary if the debtor fails to fulfill contractual obligations.',
    keyPointsNe: [
      'मुख्य प्रकार: Bid Bond (बोलपत्र जमानत), Performance Bond (कार्यसम्पादन जमानत), Advance Payment Guarantee (पेश्की भुक्तानी जमानत)',
      'गैर-कोषमा आधारित बैंकिङ सुविधा',
      'सर्त पूरा नभएमा लाभग्राहीले दाबी (Invocation) गर्न पाउने'
    ],
    examSignificanceNe: 'ठेक्कापट्टा र सार्वजनिक खरिदमा बैंकको भूमिका बुझाउन आवश्यक।',
    memoryMnemonicNe: 'संकेत सूत्र: "Bid Bond (टेन्डर) + Performance Bond (काम) + APG (पेश्की)"',
    difficulty: 'Medium'
  },
  {
    id: 'fc-bank-09',
    category: 'banking',
    categoryLabelNe: 'बैंकिङ तथा वित्तीय शब्दावली',
    categoryLabelEn: 'Banking & Finance',
    termNe: 'स्विफ्ट (SWIFT Network)',
    termEn: 'Society for Worldwide Interbank Financial Telecommunication',
    actRef: 'अन्तर्राष्ट्रिय बैंकिङ सञ्चार मापदण्ड',
    sectionRef: 'SWIFT Messaging Protocols (MT/ISO 20022)',
    definitionNe: 'विश्वभरका वित्तीय संस्थाहरू बीच सुरक्षित, भरपर्दो र मानकीकृत ढाँचामा वित्तीय सन्देशहरू आदानप्रदान गर्न प्रयोग हुने विश्वव्यापी सञ्जाल प्रणाली।',
    definitionEn: 'A vast messaging network used by financial institutions globally to transmit information and instructions securely through a standardized system of codes.',
    keyPointsNe: [
      'मुख्यालय: बेल्जियम (स्थापना सन् १९७३)',
      'प्रत्येक बैंकको ८ वा ११ अक्षरको अद्वितीय BIC/SWIFT Code हुन्छ (उदा. RBBANPKA)',
      'यसले आफैं रकम स्थानान्तरण गर्दैन, केवल सुरक्षित निर्देशन सन्देश पठाउँछ'
    ],
    examSignificanceNe: 'विप्रेषण (Remittance) र अन्तर्राष्ट्रिय भुक्तानी प्रविधिमा सोधिने।',
    memoryMnemonicNe: 'संकेत सूत्र: "विश्वभरका बैंक जोड्ने सुरक्षित म्यासेजिङ सञ्जाल"',
    difficulty: 'Easy'
  },
  {
    id: 'fc-bank-10',
    category: 'banking',
    categoryLabelNe: 'बैंकिङ तथा वित्तीय शब्दावली',
    categoryLabelEn: 'Banking & Finance',
    termNe: 'क्यामेल्स रेटिङ (CAMELS Rating Framework)',
    termEn: 'CAMELS Supervisory Framework',
    actRef: 'नेपाल राष्ट्र बैंक बैंक सुपरीवेक्षण ढाँचा',
    sectionRef: 'जोखिममा आधारित सुपरीवेक्षण (RBS)',
    definitionNe: 'बैंक तथा वित्तीय संस्थाको समग्र वित्तीय अवस्था, कार्यसम्पादन र जोखिमको स्तर मूल्याङ्कन गर्न केन्द्रीय बैंकले प्रयोग गर्ने अन्तर्राष्ट्रिय सुपरीवेक्षकीय रेटिङ प्रणाली।',
    definitionEn: 'An international supervisory rating system used to evaluate bank strength based on Capital, Asset quality, Management, Earnings, Liquidity, and Sensitivity.',
    keyPointsNe: [
      'C - Capital Adequacy (पुँजी पर्याप्तता)',
      'A - Asset Quality (सम्पत्तिको गुणस्तर / खराब कर्जा)',
      'M - Management Capability (व्यवस्थापकीय क्षमता)',
      'E - Earnings Performance (नाफा आर्जन क्षमता)',
      'L - Liquidity Position (तरलता स्थिति)',
      'S - Sensitivity to Market Risk (बजार जोखिमप्रतिको संवेदनशीलता)'
    ],
    examSignificanceNe: 'बैंक सुपरीवेक्षण र नियमन सम्बन्धी परीक्षामा १० अङ्कको लामो उत्तरमा सोधिने प्रश्न।',
    memoryMnemonicNe: 'संकेत सूत्र: "CAMELS = C (पुँजी) + A (सम्पत्ति) + M (व्यवस्थापन) + E (नाफा) + L (तरलता) + S (संवेदनशीलता)"',
    difficulty: 'Hard'
  },

  // ==========================================
  // ३. अर्थशास्त्र तथा मौद्रिक नीति (ECONOMICS & MONETARY POLICY)
  // ==========================================
  {
    id: 'fc-econ-01',
    category: 'economics',
    categoryLabelNe: 'अर्थशास्त्र तथा मौद्रिक नीति',
    categoryLabelEn: 'Economics & Monetary',
    termNe: 'मौद्रिक नीति (Monetary Policy)',
    termEn: 'Monetary Policy Framework',
    actRef: 'नेपाल राष्ट्र बैंक ऐन, २०५८',
    sectionRef: 'दफा ४४ / वार्षिक मौद्रिक नीति',
    definitionNe: 'देशमा मूल्य स्थायित्व, शोधनान्तर सन्तुलन र दिगो आर्थिक वृद्धि हासिल गर्न केन्द्रीय बैंकले मुद्राको आपूर्ति, कर्जाको उपलब्धता र ब्याजदरलाई नियमन गर्ने समष्टिगत नीति।',
    definitionEn: 'The macroeconomic policy laid down by the central bank involving management of money supply, credit, and interest rates to achieve sustainable growth and price stability.',
    keyPointsNe: [
      'प्रकार: विस्तारकारी (Expansionary / Dovish) वा संकुचनकारी (Contractionary / Hawkish)',
      'औजारहरू: प्रत्यक्ष (CRR, SLR) र अप्रत्यक्ष (रिपो, रिभर्स रिपो, बैंक दर, स्थायी तरलता सुविधा)',
      'नेपालमा हरेक आर्थिक वर्षको सुरुवातमा वार्षिक र त्रैमासिक रूपमा समीक्षा सार्वजनिक गरिन्छ'
    ],
    examSignificanceNe: 'अर्थशास्त्र तथा बैंकिङ तयारीको मेरुदण्ड।',
    memoryMnemonicNe: 'संकेत सूत्र: "मुद्रा आपूर्ति + ब्याजदर नियन्त्रण = मूल्य र शोधनान्तर स्थायित्व"',
    difficulty: 'Medium'
  },
  {
    id: 'fc-econ-02',
    category: 'economics',
    categoryLabelNe: 'अर्थशास्त्र तथा मौद्रिक नीति',
    categoryLabelEn: 'Economics & Monetary',
    termNe: 'खुल्ला बजार कारोबार (Open Market Operations - OMO)',
    termEn: 'Open Market Operations (OMO)',
    actRef: 'नेपाल राष्ट्र बैंक ऐन, २०५८',
    sectionRef: 'दफा ६४ / तरलता व्यवस्थापन',
    definitionNe: 'बैंकिङ प्रणालीमा रहेको तरलतालाई व्यवस्थापन गर्न केन्द्रीय बैंकले वित्तीय बजारमा सरकारी ऋणपत्रहरू खरिद वा बिक्री गर्ने बजारमुखी प्रक्रिया।',
    definitionEn: 'The purchase and sale of government securities in the open market by a central bank to regulate money supply and short-term liquidity.',
    keyPointsNe: [
      'रिपो (Repo): बजारमा तरलता अभाव हुँदा राष्ट्र बैंकले ऋणपत्र खरिद गरी बजारमा पैसा पठाउने',
      'रिभर्स रिपो (Reverse Repo): बजारमा अधिक तरलता हुँदा राष्ट्र बैंकले ऋणपत्र बेचेर बजारबाट पैसा तान्ने',
      'अन्य उपकरण: निक्षेप संकलन बोलकबोल, सोझै खरिद (Outright Purchase), सोझै बिक्री (Outright Sale)'
    ],
    examSignificanceNe: 'बजार तरलता उतार-चढाव समाधान गर्ने आधुनिक औजार।',
    memoryMnemonicNe: 'संकेत सूत्र: "रिपो = पैसा पठाउने (खरिद) | रिभर्स रिपो = पैसा तान्ने (बिक्री)"',
    difficulty: 'Medium'
  },
  {
    id: 'fc-econ-03',
    category: 'economics',
    categoryLabelNe: 'अर्थशास्त्र तथा मौद्रिक नीति',
    categoryLabelEn: 'Economics & Monetary',
    termNe: 'मुद्रास्फीति (Inflation)',
    termEn: 'Inflation Measurement (CPI)',
    actRef: 'अर्थशास्त्र सिद्धान्त तथा मौद्रिक नीति लक्ष्य',
    sectionRef: 'उपभोक्ता मूल्य सूचकांक (CPI)',
    definitionNe: 'निश्चित समय अवधिमा वस्तु तथा सेवाहरूको सामान्य मूल्य स्तरमा हुने निरन्तर र उल्लेखनीय वृद्धि, जसले गर्दा मुद्राको क्रयशक्ति (Purchasing Power) घट्छ।',
    definitionEn: 'A continuous, sustained increase in the general price level of goods and services over time, resulting in a reduction in purchasing power per unit of money.',
    keyPointsNe: [
      'मापन: उपभोक्ता मूल्य सूचकांक (Consumer Price Index - CPI) द्वारा',
      'मुख्य कारणहरू: माग प्रेरित (Demand-Pull) र लागत प्रेरित (Cost-Push)',
      'नेपालमा मौद्रिक नीतिले वार्षिक मुद्रास्फीति सीमा (सामान्यतया ६-७%) भित्र राख्ने लक्ष्य लिन्छ'
    ],
    examSignificanceNe: 'समसामयिक आर्थिक विषय र मौद्रिक नीतिको प्राथमिक उद्देश्य।',
    memoryMnemonicNe: 'संकेत सूत्र: "मूल्य बढ्ने + मुद्राको शक्ति घट्ने = मुद्रास्फीति"',
    difficulty: 'Easy'
  },
  {
    id: 'fc-econ-04',
    category: 'economics',
    categoryLabelNe: 'अर्थशास्त्र तथा मौद्रिक नीति',
    categoryLabelEn: 'Economics & Monetary',
    termNe: 'शोधनान्तर स्थिति (Balance of Payments - BOP)',
    termEn: 'Balance of Payments (BOP)',
    actRef: 'नेपाल राष्ट्र बैंक विदेशी विनिमय तथ्याङ्क',
    sectionRef: 'बाह्य क्षेत्र स्थायित्व',
    definitionNe: 'एक निश्चित अवधि (प्रायः एक वर्ष) भित्र कुनै देशका बासिन्दाहरू र बाँकी विश्व बीच भएका सबै आर्थिक तथा वित्तीय कारोबारहरूको व्यवस्थित र दोहोरो लेखा प्रणालीमा राखिएको अभिलेख।',
    definitionEn: 'A systematic statement of all economic and financial transactions between the residents of a country and the rest of the world over a specified period.',
    keyPointsNe: [
      'खाताहरू: चालु खाता (Current Account), पुँजीगत खाता (Capital Account), वित्तीय खाता (Financial Account)',
      'शोधनान्तर बचत (Surplus): विदेशी मुद्रा आर्जन भुक्तानीभन्दा बढी भएको अवस्था',
      'शोधनान्तर घाटा (Deficit): विदेशी मुद्रा बाहिरिने दर भित्रिनेभन्दा बढी भएको अवस्था'
    ],
    examSignificanceNe: 'नेपालको बाह्य क्षेत्र स्थायित्व र विदेशी मुद्रा सञ्चिति मापनको मुख्य आधार।',
    memoryMnemonicNe: 'संकेत सूत्र: "देशभित्र भित्रिने डलर - देशबाट बाहिरिने डलर"',
    difficulty: 'Medium'
  },

  // ==========================================
  // ४. सुशासन, ग्राहक पहिचान & भुक्तानी (AML, KYC & PAYMENT)
  // ==========================================
  {
    id: 'fc-aml-01',
    category: 'risk_aml',
    categoryLabelNe: 'सम्पत्ति शुद्धीकरण तथा जोखिम',
    categoryLabelEn: 'AML/CFT & Risk',
    termNe: 'ग्राहक पहिचान (Know Your Customer - KYC)',
    termEn: 'Know Your Customer (KYC / CDD)',
    actRef: 'सम्पत्ति शुद्धीकरण निवारण ऐन तथा राष्ट्र बैंक निर्देशन नं. १९',
    sectionRef: 'ग्राहक पहिचान तथा सम्पुष्टि (Customer Due Diligence)',
    definitionNe: 'बैंक तथा वित्तीय संस्थाले ग्राहकसँग व्यावसायिक सम्बन्ध स्थापना गर्नुअघि वा ठूलो कारोबार गर्दा उसको वास्तविक पहिचान, ठेगाना, पेशा, आयस्रोत र वास्तविक हकदार (Beneficial Owner) यकिन गर्ने विधि।',
    definitionEn: 'The mandatory due diligence process banks use to verify customer identity, residential address, business profile, source of wealth, and beneficial ownership.',
    keyPointsNe: [
      'प्रकार: सामान्य (CDD), सरलीकृत (Simplified), र बृहत्/गहन ग्राहक पहिचान (Enhanced CDD for PEPs)',
      'विद्युतीय KYC (e-KYC) र राष्ट्रिय परिचयपत्र (NID) प्रणालीसँग आबद्धता',
      'अवैध कारोबार, नक्कली खाता र बेनामी कारोबार रोक्न अनिवार्य'
    ],
    examSignificanceNe: 'बैंकिङ सञ्चालन, जोखिम नियन्त्रण र शाखा कार्यविधिमा अत्यावश्यक।',
    memoryMnemonicNe: 'संकेत सूत्र: "पहिचान + ठेगाना + आयस्रोत + वास्तविक लाभग्राही"',
    difficulty: 'Easy'
  },
  {
    id: 'fc-aml-02',
    category: 'risk_aml',
    categoryLabelNe: 'सम्पत्ति शुद्धीकरण तथा जोखिम',
    categoryLabelEn: 'AML/CFT & Risk',
    termNe: 'सीमाना र शङ्कास्पद कारोबार (TTR vs STR)',
    termEn: 'Threshold (TTR) vs Suspicious (STR)',
    actRef: 'सम्पत्ति शुद्धीकरण निवारण ऐन, २०६४',
    sectionRef: 'दफा ७ / वित्तीय जानकारी एकाइ (FIU)',
    definitionNe: 'TTR: एकै दिन वा पटकमा १० लाख रुपैयाँ वा सोभन्दा बढीको नगद कारोबारको नियमित प्रतिवेदन। STR: कारोबारको रकम जतिसुकै भए पनि शङ्कास्पद देखिएमा ३ दिनभित्र वित्तीय जानकारी एकाइ (FIU) मा गरिने गोप्य प्रतिवेदन।',
    definitionEn: 'TTR is mandatory reporting of cash transactions >= NPR 10 Lakhs within 15 days. STR is confidential reporting of any suspicious transaction within 3 days to FIU.',
    keyPointsNe: [
      'TTR सीमा: रु १० लाख वा सोभन्दा बढी नगद कारोबार (१५ दिनभित्र FIU लाई प्रतिवेदन)',
      'STR: ग्राहकको पेशा, आयस्रोत वा सामान्य व्यवहारसँग मेल नखाने अस्वाभाविक कारोबार (३ दिनभित्र FIU लाई)',
      'Tipping-off निषेध: ग्राहकलाई आफ्नो कारोबार STR मा रिपोर्ट भएको जानकारी दिन पाइँदैन'
    ],
    examSignificanceNe: 'AML/CFT सम्बन्धी प्रश्नमा TTR र STR बीचको अन्तर अनिवार्य सोधिन्छ।',
    memoryMnemonicNe: 'संकेत सूत्र: "TTR = १० लाख+ नगद (१५ दिन) | STR = शङ्कास्पद जतिसुकै रकम (३ दिन)"',
    difficulty: 'Hard'
  },
  {
    id: 'fc-aml-03',
    category: 'risk_aml',
    categoryLabelNe: 'सम्पत्ति शुद्धीकरण तथा जोखिम',
    categoryLabelEn: 'AML/CFT & Risk',
    termNe: 'विद्युतीय भुक्तानी तथा फछ्र्यौट (RTGS & Payment Settlement)',
    termEn: 'Real Time Gross Settlement (RTGS)',
    actRef: 'भुक्तानी तथा फछ्र्यौट ऐन, २०७५',
    sectionRef: 'दफा २ र राष्ट्र बैंक भुक्तानी प्रणाली निर्देशिका',
    definitionNe: 'ठूलो रकमको अन्तरबैंक भुक्तानी कारोबारहरू तत्काल, छुट्टाछुट्टै (Gross) र निरन्तर रूपमा फछ्र्यौट गरिने केन्द्रीय बैंकद्वारा सञ्चालित उच्चस्तरीय विद्युतीय प्रणाली।',
    definitionEn: 'A continuous, individual order-by-order gross settlement of high-value interbank funds transfers without netting, operated directly by the central bank.',
    keyPointsNe: [
      'प्रायः रु २ लाखभन्दा माथिका ठूला भुक्तानीमा प्रयोग हुने',
      'कारोबार हुनासाथ तत्काल अन्तिम फछ्र्यौट (Irrevocable & Final Settlement)',
      'नेपालमा बहु-मुद्रा (NPR, USD, EUR, GBP) RTGS प्रणाली सञ्चालनमा छ'
    ],
    examSignificanceNe: 'डिजिटल बैंकिङ र भुक्तानी प्रणाली आधुनिकीकरण सम्बन्धी प्रश्न।',
    memoryMnemonicNe: 'संकेत सूत्र: "ठूलो रकम + शून्य समय + तत्काल अन्तिम फछ्र्यौट"',
    difficulty: 'Medium'
  }
];

export const FLASHCARD_CATEGORIES = [
  { id: 'all', labelNe: 'सबै फ्ल्यासकार्ड (All)', labelEn: 'All Cards', count: FLASHCARD_ITEMS.length },
  { id: 'legal', labelNe: 'ऐन तथा कानुनी परिभाषा (Legal Acts)', labelEn: 'Legal Definitions', count: FLASHCARD_ITEMS.filter(f => f.category === 'legal').length },
  { id: 'banking', labelNe: 'बैंकिङ शब्दावली (Banking Terms)', labelEn: 'Banking & Finance', count: FLASHCARD_ITEMS.filter(f => f.category === 'banking').length },
  { id: 'economics', labelNe: 'अर्थशास्त्र & मौद्रिक नीति (Economics)', labelEn: 'Economics', count: FLASHCARD_ITEMS.filter(f => f.category === 'economics').length },
  { id: 'risk_aml', labelNe: 'जोखिम, AML & भुक्तानी (Risk & AML)', labelEn: 'Risk & AML', count: FLASHCARD_ITEMS.filter(f => f.category === 'risk_aml').length }
];
