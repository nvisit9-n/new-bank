import { MasterBook, MasterChapter } from '../types/masterEcosystem';
import { OFFICIAL_SOURCE_REGISTRY } from './sourceVerificationData';

export const MASTER_BOOKS_DATABASE: MasterBook[] = [
  // =========================================================================
  // BOOK 01: COMPLETE BANKING MASTER TEXTBOOK (बैंकिङ सिद्धान्त, सञ्चालन र अभ्यास)
  // =========================================================================
  {
    id: 'book-01-complete-banking',
    bookCode: 'BTN-MB-01',
    titleNepali: 'पूर्ण बैंकिङ सिद्धान्त, सञ्चालन तथा कानुनी अभ्यास (Master Banking Book)',
    titleEnglish: 'Complete Banking Theory, Operations & Legal Practice Master Textbook',
    subject: 'Banking',
    targetLevels: ['3', '4', '5', '6'],
    targetInstitutions: ['NRB', 'RBB', 'NBL', 'ADBL'],
    descriptionNepali: 'लोक सेवा आयोग तथा नेपालका ' +
      'वाणिज्य बैंकहरू (NRB, RBB, NBL, ADBL) को तह ४ र ५ का लागि आधिकारिक पाठ्यक्रम अनुसार तयार पारिएको ३०-बुँदे प्राज्ञिक पाठ्यपुस्तक।',
    totalChapters: 12,
    totalEstimatedHours: 45,
    authorEditorialBoard: 'Banking Tayari Nepal Academic Research Wing (Senior Banking Faculty)',
    latestEditionYear: '२०८२/८३ परिमार्जित संस्करण',
    syllabusVersionCode: 'SYL-BANKING-UNIFIED-2082',
    isPremium: false,
    coverAccent: 'from-blue-700 via-indigo-800 to-slate-900',
    chapters: [
      {
        id: 'mb-ch-01-banking-concept',
        chapterNumber: 1,
        bookId: 'book-01-complete-banking',
        titleNepali: '१. बैंकिङको अवधारणा, विकासक्रम र कानुनी संरचना (Banking Concept, Evolution & Legal Framework)',
        titleEnglish: 'Banking Concept, Historical Evolution & Nepalese Legal Architecture',
        subject: 'Banking',
        targetInstitutions: ['NRB', 'RBB', 'NBL', 'ADBL'],
        targetLevels: ['4', '5', '6'],
        depthLevel: 3,
        estimatedStudyTimeMinutes: 50,
        syllabusMapping: [
          { institution: 'NRB', level: '4', paper: 'Paper I', unitNumber: 'Unit 1', topicName: 'बैंकिङ अवधारणा र विकासक्रम' },
          { institution: 'RBB', level: '4', paper: 'Paper I', unitNumber: 'खण्ड क', topicName: 'बैंकिङ सिद्धान्त र कार्यहरू' }
        ],
        sections: [
          {
            sectionNumber: '१.१',
            titleNepali: 'परिचय तथा बैंकको शाब्दिक र प्राज्ञिक अर्थ (Meaning and Definitions)',
            titleEnglish: 'Etymological Meaning & Academic Definitions of Bank and Banking',
            contentMarkdown: `### १. व्युत्पत्तिगत अर्थ (Etymological Meaning)
'Bank' शब्दको व्युत्पत्ति सम्बन्धमा अर्थशास्त्री तथा भाषाविद्हरूका बीच मुख्यतया तीनवटा ऐतिहासिक मान्यताहरू पाइन्छन्:
१. **इटालियन शब्द 'Banco'**: मध्यकालीन इटाली (१२औँ शताब्दी) का यहूदी साहुकारहरूले खुला बजार वा चोकमा बेञ्च (Bench) राखेर विभिन्न देशका मुद्रा साट्ने (Money Changing) र ऋण लेनदेन गर्ने गर्दथे। यदि कुनै साहुकार आफ्नो दायित्व भुक्तान गर्न असमर्थ भएमा उसको बेञ्च भाँचिदिने चलन थियो, जसबाट **'Bankrupt'** (दिवालिया) शब्दको उत्पत्ति भएको मानिन्छ।
२. **जर्मन शब्द 'Banck'**: यसको अर्थ संयुक्त कोष (Joint Stock Fund / Common Heap) वा थुप्रो भन्ने बुझाउँछ।
३. **फ्रेन्च शब्द 'Banque'**: यसले मुद्रा कारोबार गर्ने स्थानलाई संकेत गर्दछ।

### २. आधुनिक प्राज्ञिक परिभाषा (Academic Definitions)
विभिन्न अर्थशास्त्रीहरूले बैंकलाई निम्नअनुसार परिभाषित गरेका छन्:
- **हर्ट (Walter Leaf / Dr. Herbert L. Hart)**: *"बैंक त्यो व्यक्ति वा संस्था हो जसले आफ्नो नियमित व्यवसायको रूपमा सर्वसाधारणबाट रकम जम्मा लिन्छ र ग्राहकहरूले काटेको चेकको भुक्तानी गर्दछ।"*
- **किन्ले (Prof. Kinley)**: *"बैंक यस्तो संस्था हो जसले व्यापारिक प्रयोजनका लागि ऋण लिन चाहनेहरूलाई आफूले प्राप्त गरेको निक्षेपबाट कर्जा प्रवाह गर्दछ र वित्तीय मध्यस्थता गर्दछ।"*
- **क्राउथर (Geoffrey Crowther)**: *"बैंक ऋणको व्यापारी (Dealer in Debts) हो; यसले आफ्नै ऋण सिर्जना गरी अरूको ऋण खरिद तथा बिक्री गर्दछ।"*`,
            keyTakeaways: [
              'व्युत्पत्ति: इटालियन Banco (बेञ्च), जर्मन Banck (संयुक्त कोष) र फ्रेन्च Banque।',
              'बैंक मूलतः वित्तीय मध्यस्थकर्ता (Financial Intermediary) र ऋणको व्यापारी (Dealer in Debts) हो।'
            ]
          },
          {
            sectionNumber: '१.२',
            titleNepali: 'नेपालको कानुनी अवधारणा र विशिष्ट दफाहरू (Legal Concept & Statutory Clauses in Nepal)',
            titleEnglish: 'Legal Definitions Under Nepalese Statutes: BAFIA 2073 and NRB Act 2058',
            contentMarkdown: `### १. बैंक तथा वित्तीय संस्था सम्बन्धी ऐन (BAFIA), २०७३ बमोजिम कानुनी परिभाषा:
BAFIA २०७३ को **दफा २ (क)** अनुसार:
> *"बैंक भन्नाले दफा ४९ को उपदफा (१) बमोजिमको बैंकिङ तथा वित्तीय कारोबार गर्न इजाजतपत्र प्राप्त 'क' वर्गको संगठित संस्था सम्झनु पर्छ।"*

BAFIA २०७३ को **दफा ४९ को उपदफा (१)** ले वाणिज्य बैंक (क वर्ग) ले गर्न पाउने मुख्य कारोबारहरू तोकेको छ:
- ब्याज वा बिना ब्याजमा निक्षेप स्वीकार गर्ने र भुक्तानी दिने।
- तोकिएको सीमा र धितोमा कर्जा प्रवाह गर्ने।
- प्रतितपत्र (Letter of Credit - LC), बैंक जमानत (Bank Guarantee - BG) जारी गर्ने।
- विदेशी विनिमय कारोबार गर्ने र विप्रेषण (Remittance) सेवा उपलब्ध गराउने।
- नेपाल क्लियरिङ हाउस (NCHL) तथा अन्तरबैंक भुक्तानी प्रणालीमा सहभागी हुने।

### २. नेपाल राष्ट्र बैंक ऐन, २०५८ को दफा २(ख) अनुसार:
> *"वाणिज्य बैंक भन्नाले मुद्राको कारोबार गर्ने, निक्षेप संकलन गर्ने, कर्जा दिने र अन्य वित्तीय सेवा प्रवाह गर्ने उद्देश्यले कानुन बमोजिम स्थापना भएको बैंक सम्झनु पर्छ।"*`,
            keyTakeaways: [
              'BAFIA २०७३ दफा २(क) ले क वर्गको इजाजतपत्रप्राप्त संस्थालाई बैंक भनी परिभाषित गरेको छ।',
              'दफा ४९(१) ले क वर्गको वाणिज्य बैंकको अधिकार क्षेत्र र कारोबार सीमा स्पष्ट तोकेको छ।'
            ],
            exactLegalClauses: [
              {
                actName: 'बैंक तथा वित्तीय संस्था सम्बन्धी ऐन, २०७३',
                sectionClause: 'दफा ४९ (१)',
                legalText: 'क वर्गका वाणिज्य बैंकहरूले निक्षेप संकलन, कर्जा लगानी, प्रतितपत्र, बैंक ग्यारेन्टी, विदेशी विनिमय, डिजिटल भुक्तानी र विप्रेषण कारोबार गर्न पाउने।',
                practicalApplication: 'बैंकहरूले नयाँ उत्पादन वा सेवा सुरु गर्दा दफा ४९ को कानुनी क्षेत्राधिकार भित्र रहेर मात्र NRB बाट स्वीकृति लिनुपर्दछ।'
              },
              {
                actName: 'नेपाल राष्ट्र बैंक ऐन, २०५८',
                sectionClause: 'दफा ७९ र ८०',
                legalText: 'बैंक तथा वित्तीय संस्थाहरूलाई नियमनकारी निर्देशन जारी गर्ने, सुपरिवेक्षण गर्ने र उल्लङ्घन गरेमा कारबाही तथा जरिवाना गर्ने अधिकार।',
                practicalApplication: 'एकीकृत निर्देशन (Unified Directives) को आधारशिला यही दफा ७९ हो।'
              }
            ]
          },
          {
            sectionNumber: '१.३',
            titleNepali: 'नेपालमा बैंकिङ विकासक्रमको ऐतिहासिक चरण (Evolutionary Milestones in Nepalese Banking)',
            titleEnglish: 'Chronological Milestones of Nepalese Banking History',
            contentMarkdown: `नेपालमा बैंकिङ प्रणालीको विकासलाई पाँच प्रमुख चरणहरूमा विश्लेषण गर्न सकिन्छ:

| चरण | कालखण्ड | मुख्य ऐतिहासिक घटना र उपलब्धि |
| :--- | :--- | :--- |
| **१. परम्परागत चरण** | वि.सं. १९३३ अघि | साहुमहाजन, सुनार, कौसी तोषखाना, धर्मभकारी मार्फत वस्तु तथा व्यक्तिगत ऋण विनिमय। |
| **२. प्रारम्भिक संस्थागत चरण** | वि.सं. १९३३ - १९९३ | राणा प्रधानमन्त्री रणोद्दीप सिंहद्वारा **तेजारथ अड्डा (वि.सं. १९३३)** स्थापना। सरकारी कर्मचारी र सर्वसाधारणलाई ५% ब्याजमा सुनचाँदी धितोमा ऋण दिने पहिलो संस्थागत निकाय। |
| **३. आधुनिक वाणिज्य बैंकिङ युग** | वि.सं. १९९४ - २०१२ | राणा प्रधानमन्त्री जुद्ध शमशेरको पालामा **नेपाल बैंक लिमिटेड (वि.सं. १९९४ कार्तिक ३०)** को स्थापना। राजा त्रिभुवनद्वारा उद्घाटन। नेपाल बैंक ऐन १९९४ अन्तर्गत स्थापना भई पहिलो वाणिज्य बैंकको रूपमा आधुनिक बैंकिङको थालनी। |
| **४. केन्द्रीय बैंक र सरकारी विस्तार** | वि.सं. २०१३ - २०४० | **नेपाल राष्ट्र बैंक (वि.सं. २०१३ वैशाख १४)** को स्थापना (पहिलो गभर्नर: हिमालय शमशेर ज.ब.रा.) जसले भारुको दोहोरो चलन अन्त्य गर्यो। **राष्ट्रिय वाणिज्य बैंक (२०२२ माघ १०)** र **कृषि विकास बैंक (२०२४ माघ ७)** को स्थापना। |
| **५. वित्तीय उदारीकरण र डिजिटल युग** | वि.सं. २०४१ - हालसम्म | सन् १९८४ मा नेपाल अरब बैंक (हाल नबिल बैंक) मार्फत संयुक्त लगानीको निजी बैंक प्रवेश। दोस्रो पुस्ताको वित्तीय सुधार (FSRP), BAFIA २०६३ र २०७३, RTGS, ConnectIPS, मोबाइल बैंकिङ, र फिनटेक क्रान्ति। |`,
            keyTakeaways: [
              'तेजारथ अड्डा (१९३३ BS): नेपालको पहिलो संस्थागत ऋणदाता अड्डा।',
              'नेपाल बैंक (१९९४ कार्तिक ३०): नेपालको पहिलो आधुनिक वाणिज्य बैंक।',
              'नेपाल राष्ट्र बैंक (२०१३ वैशाख १४): पहिलो गभर्नर हिमालय शमशेर जबरा, भारुको दोहोरो चलन अन्त्य।'
            ]
          }
        ],
        nepalContextAnalysis: `नेपालको बैंकिङ क्षेत्र हाल 'कन्सोलीडेसन' (Consolidation) र 'डिजिटलाइजेसन' (Digitalization) को दोहोरो मोडमा छ। नेपाल राष्ट्र बैंकको मर्जर तथा प्राप्ति नीतिका कारण वाणिज्य बैंकहरूको संख्या घटेर २० मा आइपुगेको छ। कुल ७५३ स्थानीय तहमध्ये ७५२ तहमा वाणिज्य बैंकका शाखा पुगेका छन्। कुल निक्षेप गार्हस्थ्य उत्पादन (GDP) को १००% भन्दा माथि पुगेको छ भने डिजिटल भुक्तानी (QR, ConnectIPS, Mobile Banking) ले कुल कारोबारको ठूलो हिस्सा ओगटेको छ। तर खराब कर्जा (NPL) को वृद्धि, पुँजी पर्याप्तता अनुपात (CAR) मा दबाब, र कर्जाको गुणस्तर सुधार मुख्य समकालीन चुनौती हुन्।`,
        numericalSolutions: [
          {
            id: 'num-01-car-calculation',
            title: 'पुँजी पर्याप्तता अनुपात (CAR / CRAR) सम्बन्धी संख्यात्मक हिसाब',
            topic: 'Capital Adequacy Ratio under Basel III',
            marks: 10,
            problemStatementNepali: `कुनै 'क' वर्गको वाणिज्य बैंकको वित्तीय विवरण अनुसार प्राथमिक पुँजी (Tier 1 Capital) रु. १२ अर्ब, पूरक पुँजी (Tier 2 Capital) रु. ३ अर्ब र कुल जोखिम भारित सम्पत्ति (Total Risk Weighted Assets - RWA) रु. १२० अर्ब रहेको छ भने:
१. बैंकको प्राथमिक पुँजी अनुपात (Tier 1 Ratio) र कुल पुँजी अनुपात (Total Capital Ratio) गणना गर्नुहोस्।
२. नेपाल राष्ट्र बैंकको एकीकृत निर्देशन नं. १ अनुसार बैंकले तोकिएको न्यूनतम पुँजी पर्याप्तता अनुपात पूरा गरेको छ वा छैन, विश्लेषणात्मक टिप्पणी गर्नुहोस्।`,
            problemStatementEnglish: `A commercial bank has Tier 1 Capital of NPR 12 Billion, Tier 2 Capital of NPR 3 Billion, and Total Risk Weighted Assets (RWA) of NPR 120 Billion. Calculate Tier 1 Capital Ratio, Total Capital Ratio (CAR), and comment based on NRB Unified Directive No. 1.`,
            givenData: [
              { variable: 'प्राथमिक पुँजी (Tier 1 Capital)', symbol: 'T1', value: '12', unit: 'अर्ग (NPR Billion)' },
              { variable: 'पूरक पुँजी (Tier 2 Capital)', symbol: 'T2', value: '3', unit: 'अर्ग (NPR Billion)' },
              { variable: 'कुल जोखिम भारित सम्पत्ति', symbol: 'RWA', value: '120', unit: 'अर्ग (NPR Billion)' }
            ],
            requiredToCalculate: [
              'प्राथमिक पुँजी अनुपात (Tier 1 Capital Ratio)',
              'कुल पुँजी पर्याप्तता अनुपात (Total CAR / CRAR)',
              'NRB मापदण्ड (११.०% कुल, ८.५% टियर १) अनुसार कानुनी अनुपालनको विश्लेषण'
            ],
            applicableFormulas: [
              {
                formulaName: 'Total Capital Ratio (CAR)',
                latexOrText: 'CAR = (Tier 1 Capital + Tier 2 Capital) / Total RWA * 100%',
                explanation: 'कुल पुँजी कोषलाई कुल जोखिम भारित सम्पत्तिले भाग गरी प्रतिशतमा निकालिन्छ।'
              },
              {
                formulaName: 'Tier 1 Capital Ratio',
                latexOrText: 'Tier 1 Ratio = (Tier 1 Capital / Total RWA) * 100%',
                explanation: 'प्राथमिक पुँजी र कुल जोखिम भारित सम्पत्तिको प्रतिशत अनुपात।'
              }
            ],
            stepByStepSolution: [
              {
                stepNumber: 1,
                stepTitle: 'कुल पुँजी कोष (Total Capital Fund) गणना',
                calculationText: 'कुल पुँजी कोष = Tier 1 + Tier 2 = १२ अर्ब + ३ अर्ब = १५ अर्ब रुपैयाँ।',
                workingNote: 'NRB निर्देशन अनुसार Tier 2 Capital को मान Tier 1 भन्दा बढी हुन पाउँदैन, यहाँ ३ अर्ब < १२ अर्ब भएकाले पूर्ण गणना योग्य छ।'
              },
              {
                stepNumber: 2,
                stepTitle: 'प्राथमिक पुँजी अनुपात (Tier 1 Ratio) को गणना',
                calculationText: 'Tier 1 Ratio = (१२ अर्ब / १२० अर्ब) × १००% = १०.००%',
                workingNote: 'NRB ले तोकेको न्यूनतम Tier 1 अनुपात ८.५% (६.०% आधारभूत + २.५% Capital Conservation Buffer) हो।'
              },
              {
                stepNumber: 3,
                stepTitle: 'कुल पुँजी पर्याप्तता अनुपात (CAR) को गणना',
                calculationText: 'CAR = (१५ अर्ब / १२० अर्ब) × १००% = १२.५०%',
                workingNote: 'NRB ले वाणिज्य बैंकहरूका लागि तोकेको न्यूनतम कुल पुँजी अनुपात ११.०% (८.५% टियर १ + २.५% बफर) हो।'
              }
            ],
            finalAnswerText: 'प्राथमिक पुँजी अनुपात (Tier 1 Ratio) = १०.००% र कुल पुँजी अनुपात (CAR) = १२.५०% प्राप्त भयो।',
            interpretationAndExamTrap: 'व्याख्या: बैंकको कुल CAR १२.५०% छ जुन नेपाल राष्ट्र बैंकको न्यूनतम ११.०% भन्दा १.५०% ले बढी छ। साथै Tier 1 अनुपात १०.००% छ जुन न्यूनतम ८.५% भन्दा १.५०% ले बढी छ। अतः बैंक वित्तीय दृष्टिले सुरक्षित छ र यसमा कुनै पनि Prompt Corrective Action (PCA) आकर्षित हुँदैन।'
          }
        ],
        subjectiveAnswers: [
          {
            marks: 10,
            questionNepali: 'वाणिज्य बैंकको अवधारणा प्रष्ट पार्दै नेपालको आर्थिक विकासमा वाणिज्य बैंकहरूले निर्वाह गर्ने बहुआयामिक भूमिकाको समीक्षा गर्नुहोस्। (४+६=१०)',
            questionEnglish: 'Clarify the concept of commercial banks and critically review their multifaceted role in the economic development of Nepal. (4+6=10)',
            timeAllocationMinutes: 18,
            structure: {
              introduction: 'वाणिज्य बैंक भनेको सर्वसाधारण तथा संस्थाहरूबाट बचत वा निक्षेप संकलन गरी उत्पादनशील तथा व्यापारिक क्षेत्रमा कर्जा प्रवाह गर्ने, भुक्तानी प्रणाली सहज बनाउने र वित्तीय मध्यस्थता (Financial Intermediation) प्रदान गर्ने कानुनबमोजिम संगठित वित्तीय संस्था हो। BAFIA २०७३ को दफा ४९(१) बमोजिम क वर्गका इजाजतपत्रप्राप्त संस्थाहरू वाणिज्य बैंक हुन्।',
              definitionsAndLegalBase: 'किन्लेका अनुसार बैंक कर्जाको व्यापारी र वित्तीय मध्यस्थकर्ता हो। नेपालमा बैंक तथा वित्तीय संस्था सम्बन्धी ऐन २०७३ र नेपाल राष्ट्र बैंक ऐन २०५८ यसका कानुनी आधारस्तम्भ हुन्।',
              mainBodyPoints: [
                {
                  title: '१. पुँजी निर्माण र निक्षेप परिचालन (Capital Formation & Savings Mobilization)',
                  explanation: 'छरिएर रहेको स-साना बचतलाई निक्षेपको रूपमा संकलन गरी ठूला पूर्वाधार, उद्योग तथा व्यवसायमा दीर्घकालीन पुँजीको रूपमा परिचालन गर्दछ।'
                },
                {
                  title: '२. उत्पादनशील तथा प्राथमिकता प्राप्त क्षेत्रमा कर्जा (Credit to Productive Sectors)',
                  explanation: 'NRB को निर्देशन अनुसार कृषि, ऊर्जा, साना तथा मझौला उद्योग (SMEs) मा तोकिएको न्यूनतम प्रतिशत कर्जा प्रवाह गरी उत्पादन र रोजगारी वृद्धिमा मद्दत गर्दछ।'
                },
                {
                  title: '३. सुरक्षित तथा आधुनिक भुक्तानी प्रणाली (Payment & Settlement Facilitation)',
                  explanation: 'RTGS, ECC, ConnectIPS, मोबाइल बैंकिङ, QR कोड मार्फत नगदरहित (Cashless) अर्थतन्त्र प्रवर्द्धन गरी कारोबार लागत घटाउँछ।'
                },
                {
                  title: '४. वैदेशिक व्यापार र विदेशी विनिमय सहजीकरण (Foreign Trade & Forex)',
                  explanation: 'प्रतितपत्र (Letter of Credit) र बैंक ग्यारेन्टी मार्फत अन्तर्राष्ट्रिय व्यापार सहजीकरण गर्दछ र विप्रेषण (Remittance) लाई औपचारिक च्यानलमा ल्याउँछ।'
                },
                {
                  title: '५. वित्तीय समावेशीकरण र गरिबी निवारण (Financial Inclusion)',
                  explanation: '७५२ स्थानीय तहमा शाखा विस्तार, शाखारहित बैंकिङ र विपन्न वर्ग कर्जा (Deprived Sector Lending) मार्फत ग्रामीण अर्थतन्त्रलाई मूलप्रवाहमा जोड्दछ।'
                }
              ],
              nepalBankingContext: 'नेपालमा हाल २० वाणिज्य बैंकहरू सञ्चालनमा छन्। कुल GDP को १००% भन्दा बढी निक्षेप परिचालन भएको छ। तर उत्पादनशील क्षेत्रमा कर्जा सदुपयोग नहुनु, घरजग्गा र आयातमा कर्जा केन्द्रित हुनु, र खराब कर्जा (NPL) बढ्नु मुख्य संरचनात्मक समस्याहरू हुन्।',
              challengesOrGaps: [
                'सहरी क्षेत्रमा मात्र शाखा तथा कर्जाको केन्द्रीकरण, ग्रामीण क्षेत्रमा वित्तीय साक्षरताको कमी।',
                'धितोमा आधारित परम्परागत कर्जा प्रणाली, परियोजनामा आधारित कर्जाको न्यूनता।',
                'बढ्दो निष्क्रिय कर्जा (NPL) र रिकभरीमा कानुनी ढिलासुस्ती।'
              ],
              recommendationsOrWayForward: [
                'परियोजना धितो कर्जा (Project Financing) र स्टार्टअप इनोभेसन कोषलाई प्राथमिकता दिने।',
                'डिजिटल कर्जा (Digital Lending) र AI आधारित क्रेडिट स्कोरिङ प्रणाली लागू गर्ने।',
                'कर्जा अनुगमन (Credit Monitoring) प्रभावकारी बनाई गैर-उत्पादनशील क्षेत्रमा कर्जा प्रवाह रोक्ने।'
              ],
              conclusion: 'निष्कर्षतः, वाणिज्य बैंकहरू आधुनिक अर्थतन्त्रको धमनी हुन्। नेपाल जस्तो विकासोन्मुख मुलुकमा बैंकहरूले परम्परागत साहुमहाजनको शोषण अन्त्य गर्दै उत्पादनशील अर्थतन्त्र निर्माणमा अग्रणि भूमिका निर्वाह गर्नुपर्दछ।'
            },
            examTips: [
              '१० अङ्कको उत्तरमा अनिवार्य रूपमा: अवधारणा (२-३ लाइन), ५ वटा मुख्य बुँदा व्याख्या, नेपालको सन्दर्भ र तथ्य, चुनौतीहरू, र सुधारात्मक निष्कर्ष लेख्नुपर्छ।',
              'नेपालको कुल GDP सँग निक्षेप र कर्जाको तुलना तथा ७५२ स्थानीय तहको तथ्य उल्लेख गर्दा परीक्षकमा सकारात्मक प्रभाव पर्छ।'
            ]
          },
          {
            marks: 5,
            questionNepali: 'बैंकका प्राथमिक कार्यहरू (Primary Functions) संक्षिप्तमा बुँदागत उल्लेख गर्नुहोस्। (५ अङ्क)',
            timeAllocationMinutes: 8,
            structure: {
              introduction: 'बैंकका आधारभूत र अस्तित्वसँग प्रत्यक्ष जोडिएका कार्यहरूलाई प्राथमिक कार्य भनिन्छ। यी कार्यहरू बिना कुनै पनि संस्था बैंक बन्न सक्दैन।',
              mainBodyPoints: [
                {
                  title: 'क. निक्षेप स्वीकार गर्नु (Accepting Deposits)',
                  explanation: 'ग्राहकहरूबाट चल्ती (Current), बचत (Saving), मुद्दती (Fixed), र कल (Call) खाता मार्फत रकम जम्मा लिने।'
                },
                {
                  title: 'ख. कर्जा तथा साख प्रवाह गर्नु (Granting Loans and Advances)',
                  explanation: 'निक्षेपबाट संकलित रकमलाई अल्पकालीन, मध्यकालीन र दीर्घकालीन कर्जा, ओभरड्राफ्ट, र नगद साखको रूपमा लगानी गर्ने।'
                },
                {
                  title: 'ग. साख सिर्जना गर्नु (Credit Creation)',
                  explanation: 'नगद मौज्दात अनुपात (CRR) कटाएर बाँकी रकम पुनः कर्जा प्रवाह गरी बहुगुणा साख (Derivative Deposits) सिर्जना गर्ने।'
                }
              ],
              nepalBankingContext: 'नेपालमा BAFIA २०७३ को दफा ४९(१) ले क वर्गका बैंकहरूको प्राथमिक कार्य अधिकार निर्धारण गरेको छ।',
              conclusion: 'यी कार्यहरू बैंकको नाफा आर्जन र अस्तित्वको प्रमुख आधार हुन्।'
            },
            examTips: ['५ अङ्कको उत्तर ठ्याक्कै १ देखि १.५ पृष्ठमा ३ वटा मुख्य प्राथमिक कार्यहरूमा केन्द्रित हुनुपर्छ।']
          }
        ],
        highYieldMcqs: [
          {
            id: 'mcq-mb-01',
            category: 'Banking',
            difficulty: 'Medium',
            questionNepali: 'बैंक तथा वित्तीय संस्था सम्बन्धी ऐन, २०७३ को कुन दफा अनुसार वाणिज्य बैंकलाई "क" वर्गको संस्थाको रूपमा परिभाषित गरिएको छ?',
            questionEnglish: 'Under which section of BAFIA 2073 is a commercial bank defined as a Class "A" institution?',
            options: [
              { key: 'A', textNepali: 'दफा २ (क)', textEnglish: 'Section 2 (a)' },
              { key: 'B', textNepali: 'दफा ४९ (१)', textEnglish: 'Section 49 (1)' },
              { key: 'C', textNepali: 'दफा ३ (२)', textEnglish: 'Section 3 (2)' },
              { key: 'D', textNepali: 'दफा १६ (१)', textEnglish: 'Section 16 (1)' }
            ],
            correctAnswer: 'A',
            explanationNepali: 'BAFIA २०७३ को दफा २(क) मा "बैंक" भन्नाले दफा ४९ को उपदफा (१) बमोजिम क वर्गको इजाजत प्राप्त संस्था भनी परिभाषित गरिएको छ।',
            examTag: 'BAFIA 2073 Def'
          },
          {
            id: 'mcq-mb-02',
            category: 'Banking',
            difficulty: 'Hard',
            questionNepali: 'नेपाल राष्ट्र बैंकको एकीकृत निर्देशन नं. १ अनुसार वाणिज्य बैंकहरूले कायम गर्नुपर्ने न्यूनतम प्राथमिक पुँजी (Tier 1) अनुपात कति हो?',
            questionEnglish: 'What is the minimum Tier 1 Capital ratio required for commercial banks under NRB Directive No. 1?',
            options: [
              { key: 'A', textNepali: '६.० प्रतिशत', textEnglish: '6.0 Percent' },
              { key: 'B', textNepali: '८.५ प्रतिशत (Buffer सहित)', textEnglish: '8.5 Percent (including Buffer)' },
              { key: 'C', textNepali: '१०.० प्रतिशत', textEnglish: '10.0 Percent' },
              { key: 'D', textNepali: '११.० प्रतिशत', textEnglish: '11.0 Percent' }
            ],
            correctAnswer: 'B',
            explanationNepali: 'वाणिज्य बैंकहरूका लागि आधारभूत टियर १ ६.०% र क्यापिटल कन्जर्भेसन बफर २.५% गरी कुल न्यूनतम प्राथमिक पुँजी ८.५% कायम गर्नुपर्छ। कुल CAR भने ११.०% हुनुपर्छ।',
            examTag: 'NRB Directive 1'
          }
        ],
        interviewVivaQuestions: [
          {
            questionNepali: 'यदि तपाईं वाणिज्य बैंकको शाखा प्रबन्धक (Branch Manager) हुनुभयो भने हालको उच्च खराब कर्जा (NPL) न्यूनीकरण गर्न कुन तीनवटा व्यवहारिक कदम चाल्नुहुन्छ?',
            questionEnglish: 'If you were appointed Branch Manager, what three practical steps would you take to reduce high NPL?',
            expectedInsight: 'परीक्षकले उम्मेदवारको जोखिम मूल्याङ्कन, ग्राहक सम्बन्ध व्यवस्थापन र कानुनी असुली प्रक्रियाको स्पष्टता जाँच्न खोजेका हुन्।',
            sampleHighScoringResponse: 'म देहायका तीन कदम चाल्नेछु: १. कर्जा प्रवाह पूर्व (Pre-sanction) ५Cs सिद्धान्त कडाइका साथ लागू गरी परियोजनाको नगद प्रवाह (Cash Flow) परीक्षण गर्ने, २. कर्जा पछिको (Post-disbursement) स्थलगत निरीक्षण र कर्जा सदुपयोगिता प्रमाणीकरण मासिक रूपमा गर्ने, ३. प्रारम्भिक चेतावनी संकेत (Early Warning Signals - EWS) ट्र्याक गरी Overdue हुनासाथ समयमै कर्जा पुनर्संरचना वा कानुनी ताकेता गर्ने।'
          }
        ],
        revisionSummary: {
          coreMemoryMnemonic: 'बैंकिङको आधार: D-L-C-P (Deposit -> Lending -> Credit Creation -> Payment Services)',
          bulletSummary: [
            'व्युत्पत्ति: इटालियन Banco (बेञ्च साहुकार), जर्मन Banck (संयुक्त कोष)।',
            'नेपालको इतिहास: तेजारथ अड्डा (१९३३) -> नेपाल बैंक (१९९४) -> NRB (२०१३) -> RBB (२०२२) -> ADBL (२०२४)।',
            'कानुनी आधार: BAFIA २०७३ दफा २(क) परिभाषा, दफा ४९(१) काम कर्तव्य, दफा ५० निषेधित कार्य।',
            'पुँजी कोष: Tier 1 न्यूनतम ८.५%, कुल CAR न्यूनतम ११.०% (NRB एकीकृत निर्देशन १)।',
            'समकालीन अवस्था: २० वाणिज्य बैंक, ७५२ स्थानीय तहमा उपस्थिति, कुल GDP को १००%+ निक्षेप।'
          ],
          quickReviewPoints: [
            'नेपालको पहिलो बैंक: नेपाल बैंक लिमिटेड (स्थापना १९९४ कार्तिक ३०)।',
            'नेपाल राष्ट्र बैंक ऐन २०१२ अन्तर्गत २०१३ वैशाख १४ मा NRB स्थापना, पहिलो गभर्नर हिमालय शमशेर।',
            'क वर्गको बैंकको लागि एकल ग्राहक कर्जा सीमा (SOL): Fund-based २५% र Non-fund based ५०%।'
          ]
        },
        sources: [OFFICIAL_SOURCE_REGISTRY[0], OFFICIAL_SOURCE_REGISTRY[1]],
        status: 'published',
        lastVerifiedDate: '२०८१-१२-०१'
      }
    ]
  },

  // =========================================================================
  // BOOK 02: COMPLETE ACCOUNTING & RATIO ANALYSIS (लेखा तथा वित्तीय विश्लेषण)
  // =========================================================================
  {
    id: 'book-02-complete-accounting',
    bookCode: 'BTN-MB-02',
    titleNepali: 'पूर्ण वित्तीय लेखाविधि, अनुपात विश्लेषण तथा NFRS (Accounting Master Book)',
    titleEnglish: 'Complete Financial Accounting, Ratio Analysis & NFRS Standards',
    subject: 'Accounting',
    targetLevels: ['3', '4', '5', '6'],
    targetInstitutions: ['NRB', 'RBB', 'NBL', 'ADBL'],
    descriptionNepali: 'दोहोरो लेखाप्रणाली, वासलात, नाफा-नोक्सान, नगद प्रवाह, NFRS, वित्तीय अनुपात र संख्यात्मक समस्या समाधानको मास्टर पाठ्यपुस्तक।',
    totalChapters: 10,
    totalEstimatedHours: 40,
    authorEditorialBoard: 'Chartered Accountants & Banking Accounting Faculty',
    latestEditionYear: '२०८२/८३ संस्करण',
    syllabusVersionCode: 'SYL-ACC-UNIFIED-2082',
    isPremium: false,
    coverAccent: 'from-emerald-700 via-teal-800 to-slate-900',
    chapters: [
      {
        id: 'mb-ch-acc-01-ratios',
        chapterNumber: 1,
        bookId: 'book-02-complete-accounting',
        titleNepali: '१. वित्तीय अनुपात विश्लेषण र बैंकिङ स्वास्थ्य सूचक (Financial Ratio Analysis)',
        titleEnglish: 'Financial Ratio Analysis and Banking Health Indicators',
        subject: 'Accounting',
        targetInstitutions: ['NRB', 'RBB', 'NBL', 'ADBL'],
        targetLevels: ['4', '5', '6'],
        depthLevel: 3,
        estimatedStudyTimeMinutes: 45,
        syllabusMapping: [
          { institution: 'RBB', level: '4', paper: 'Paper II', unitNumber: 'लेखा खण्ड', topicName: 'वित्तीय अनुपात विश्लेषण' }
        ],
        sections: [
          {
            sectionNumber: '१.१',
            titleNepali: 'अनुपात विश्लेषणको अवधारणा र बैंकिङ उपयोगिता (Concept & Utility)',
            titleEnglish: 'Concept, Significance and Classification of Financial Ratios',
            contentMarkdown: `### १. अवधारणा (Concept)
वित्तीय विवरणमा रहेका दुई वा दुईभन्दा बढी अन्तरसम्बन्धित अङ्कहरूको गणितीय सम्बन्धलाई **अनुपात (Ratio)** भनिन्छ। बैंकको वित्तीय स्वास्थ्य, शोधनक्षमता, तरलता, नाफा आर्जन क्षमता र व्यवस्थापकीय कार्यकुशलता मूल्याङ्कन गर्न अनुपात विश्लेषण सबैभन्दा शक्तिशाली औजार हो।

### २. प्रमुख वर्गीकरण (Classification):
१. **तरलता अनुपात (Liquidity Ratios)**: Current Ratio, Quick Ratio, Cash Reserve Ratio (CRR), Statutory Liquidity Ratio (SLR), Net Stable Funding Ratio (NSFR)।
२. **नाफा आर्जन अनुपात (Profitability Ratios)**: Return on Assets (ROA), Return on Equity (ROE), Net Interest Margin (NIM), Cost to Income Ratio।
३. **सम्पत्ति गुणस्तर अनुपात (Asset Quality Ratios)**: Non-Performing Loan (NPL) Ratio, Loan Loss Provision (LLP) to Total Loans।
४. **पुँजी तथा उत्तोलन अनुपात (Capital & Leverage Ratios)**: Capital Adequacy Ratio (CAR), Debt to Equity Ratio, Credit to Deposit (CD) Ratio (अधिकतम ९०%)।`,
            keyTakeaways: [
              'अनुपात विश्लेषणले बैंकको वित्तीय शक्ति र कमजोरीलाई तुलनात्मक रूपमा उजागर गर्दछ।',
              'बैंकिङमा CAMELS ढाँचा (Capital, Asset, Management, Earnings, Liquidity, Sensitivity) अनुपातहरूमा आधारित हुन्छ।'
            ]
          }
        ],
        nepalContextAnalysis: 'नेपाल राष्ट्र बैंकले वाणिज्य बैंकहरूका लागि CD Ratio को अधिकतम सीमा ९०% तोकेको छ। अनिवार्य नगद मौज्दात (CRR) ४.०% र वैधानिक तरलता अनुपात (SLR) १२.०% तोकिएको छ। यी सीमा उल्लङ्घन भएमा बैंकलाई दण्ड जरिवाना लाग्दछ।',
        numericalSolutions: [
          {
            id: 'num-acc-01-cd-ratio',
            title: 'कर्जा-निक्षेप अनुपात (CD Ratio) र ऋण लगानी क्षमता गणना',
            topic: 'Credit-Deposit (CD) Ratio & Lending Headroom',
            marks: 10,
            problemStatementNepali: `कुनै बैंकको कुल प्राथमिक पुँजी (Tier 1) रु. १० अर्ब, कुल स्वदेशी निक्षेप रु. १०० अर्ब र हालसम्म प्रवाह गरिएको कुल कर्जा रु. ८८ अर्ब छ। NRB को नियम अनुसार बैंकले अधिकतम ९०% CD Ratio कायम गर्न पाउँछ भने:
१. बैंकको हालको CD Ratio कति छ?
२. बैंकले ९०% को सीमा ननाघी थप कति रकम कर्जा प्रवाह गर्न सक्छ?`,
            problemStatementEnglish: `A bank has Tier 1 Capital of NPR 10B, Total Domestic Deposits of NPR 100B, and Total Loans of NPR 88B. With max CD Ratio of 90%, calculate current CD Ratio and additional lending headroom.`,
            givenData: [
              { variable: 'कुल प्राथमिक पुँजी (Tier 1)', symbol: 'C', value: '10', unit: 'अर्ग' },
              { variable: 'कुल निक्षेप (Total Deposits)', symbol: 'D', value: '100', unit: 'अर्ग' },
              { variable: 'हाल प्रवाह भएको कर्जा (Current Loans)', symbol: 'L', value: '88', unit: 'अर्ग' },
              { variable: 'अधिकतम तोकिएको सीमा', symbol: 'Max CD', value: '90', unit: '%' }
            ],
            requiredToCalculate: [
              'हालको CD Ratio (%)',
              '९०% सम्म थप कर्जा लगानी गर्न सकिने अधिकतम रकम (Headroom)'
            ],
            applicableFormulas: [
              {
                formulaName: 'CD Ratio Formula (NRB Directives)',
                latexOrText: 'CD Ratio = Total Loans / (Total Deposit + Core Capital) * 100%',
                explanation: 'नेपाल राष्ट्र बैंकको निर्देशिका अनुसार हर (Denominator) मा निक्षेप र प्राथमिक पुँजी जोडिन्छ।'
              }
            ],
            stepByStepSolution: [
              {
                stepNumber: 1,
                stepTitle: 'कुल आधार रकम (Denominator Base) गणना',
                calculationText: 'कुल आधार = निक्षेप (१०० अर्ब) + प्राथमिक पुँजी (१० अर्ब) = ११० अर्ब रुपैयाँ।'
              },
              {
                stepNumber: 2,
                stepTitle: 'हालको CD Ratio गणना',
                calculationText: 'हालको CD Ratio = (८८ अर्ब / ११० अर्ब) × १००% = ८०.००%'
              },
              {
                stepNumber: 3,
                stepTitle: 'अधिकतम प्रवाह गर्न सकिने कुल कर्जा',
                calculationText: 'अधिकतम कर्जा = ११० अर्ब × ९०% = ९९ अर्ब रुपैयाँ।'
              },
              {
                stepNumber: 4,
                stepTitle: 'थप कर्जा प्रवाह क्षमता (Lending Headroom) गणना',
                calculationText: 'थप कर्जा = ९९ अर्ब - ८८ अर्ब = ११ अर्ब रुपैयाँ।'
              }
            ],
            finalAnswerText: 'हालको CD Ratio = ८०.००% छ र बैंकले ९०% को कानुनी सीमा भित्र रही थप रु. ११ अर्ब कर्जा प्रवाह गर्न सक्दछ।',
            interpretationAndExamTrap: 'परीक्षार्थीले झुक्किएर हर (Denominator) मा निक्षेप मात्र राख्न सक्छन्, तर NRB को पछिल्लो एकीकृत निर्देशन अनुसार Core Capital (Tier 1) पनि जोड्नुपर्छ।'
          }
        ],
        subjectiveAnswers: [],
        highYieldMcqs: [],
        interviewVivaQuestions: [],
        revisionSummary: {
          coreMemoryMnemonic: 'अनुपात त्रिशूल: Liquidity (तरलता) + Solvency (शोधन) + Profitability (नाफा)',
          bulletSummary: ['CD Ratio अधिकतम ९०%', 'CRR ४.०%, SLR १२.०%', 'NPL ५% भन्दा कम हुनुपर्ने'],
          quickReviewPoints: ['CD Ratio को हरमा Deposit + Core Capital दुवै समावेश हुन्छ।']
        },
        sources: [OFFICIAL_SOURCE_REGISTRY[5]],
        status: 'published',
        lastVerifiedDate: '२०८१-१२-०१'
      }
    ]
  },

  // =========================================================================
  // BOOK 03: COMPLETE ECONOMICS & MONETARY SYSTEMS (अर्थशास्त्र र मौद्रिक प्रणाली)
  // =========================================================================
  {
    id: 'book-03-complete-economics',
    bookCode: 'BTN-MB-03',
    titleNepali: 'पूर्ण समष्टिगत अर्थशास्त्र, मौद्रिक नीति तथा नेपाली अर्थतन्त्र (Economics Master Book)',
    titleEnglish: 'Complete Macroeconomics, Monetary Policy & Nepalese Economy',
    subject: 'Economics',
    targetLevels: ['4', '5', '6'],
    targetInstitutions: ['NRB', 'RBB', 'NBL', 'ADBL'],
    descriptionNepali: 'GDP, मुद्रास्फीति, ब्याजदर करिडोर, आर्थिक सर्वेक्षण, बजेट, भुक्तानी सन्तुलन र विदेशी मुद्रा सञ्चितिको विस्तृत पाठ्यपुस्तक।',
    totalChapters: 12,
    totalEstimatedHours: 42,
    authorEditorialBoard: 'Macroeconomic Researchers & Former NRB Directors',
    latestEditionYear: '२०८२/८३ संस्करण',
    syllabusVersionCode: 'SYL-ECON-UNIFIED-2082',
    isPremium: false,
    coverAccent: 'from-amber-700 via-orange-800 to-slate-900',
    chapters: []
  },

  // =========================================================================
  // BOOK 04: MANAGEMENT, HRM & GOVERNANCE (व्यवस्थापन तथा सुशासन)
  // =========================================================================
  {
    id: 'book-04-complete-management',
    bookCode: 'BTN-MB-04',
    titleNepali: 'पूर्ण व्यवस्थापन, मानव संसाधन तथा संस्थागत सुशासन (Management Master Book)',
    titleEnglish: 'Complete Management, Human Resource & Corporate Governance',
    subject: 'Management',
    targetLevels: ['4', '5', '6'],
    targetInstitutions: ['NRB', 'RBB', 'NBL', 'ADBL', 'EPF', 'CIT', 'LOKSEWA'],
    descriptionNepali: 'व्यवस्थापनका सिद्धान्त, नेतृत्व, उत्प्रेरणा, निर्णय प्रक्रिया, कार्यसम्पादन, द्वन्द्व व्यवस्थापन र सुशासन ऐन २०६४।',
    totalChapters: 8,
    totalEstimatedHours: 35,
    authorEditorialBoard: 'Public Administration & Management Specialists',
    latestEditionYear: '२०८२/८३ संस्करण',
    syllabusVersionCode: 'SYL-MGMT-UNIFIED-2082',
    isPremium: false,
    coverAccent: 'from-purple-700 via-violet-800 to-slate-900',
    chapters: []
  },

  // =========================================================================
  // BOOK 05: BANKING LAW & DIRECTIVES (बैंकिङ कानुन तथा एकीकृत निर्देशन)
  // =========================================================================
  {
    id: 'book-05-complete-laws',
    bookCode: 'BTN-MB-05',
    titleNepali: 'पूर्ण बैंकिङ कानुन, ऐन तथा एकीकृत निर्देशन म्यानुअल (Banking Law Master)',
    titleEnglish: 'Complete Banking Laws, Statutes & NRB Directives Annotated Manual',
    subject: 'Law',
    targetLevels: ['4', '5', '6'],
    targetInstitutions: ['NRB', 'RBB', 'NBL', 'ADBL'],
    descriptionNepali: 'NRB Act २०५८, BAFIA २०७३, सम्पत्ति शुद्धीकरण ऐन २०६४, बैंकिङ कसूर ऐन २०६४, विनिमय अधिकारपत्र ऐन २०३४ का दफागत व्याख्या।',
    totalChapters: 9,
    totalEstimatedHours: 38,
    authorEditorialBoard: 'Advocates & Banking Legal Compliance Advisors',
    latestEditionYear: '२०८२/८३ संस्करण',
    syllabusVersionCode: 'SYL-LAW-UNIFIED-2082',
    isPremium: false,
    coverAccent: 'from-rose-700 via-red-800 to-slate-900',
    chapters: []
  },

  // =========================================================================
  // BOOK 06: COMPUTER & IT SYSTEMS (कम्प्युटर, सूचना प्रविधि र डिजिटल बैंकिङ)
  // =========================================================================
  {
    id: 'book-06-complete-it',
    bookCode: 'BTN-MB-06',
    titleNepali: 'कम्प्युटर, सूचना प्रविधि, साइबर सुरक्षा तथा डिजिटल बैंकिङ (IT Master Book)',
    titleEnglish: 'Computer, IT, Cybersecurity & Digital Banking Architecture',
    subject: 'Computer',
    targetLevels: ['4', '5', '6'],
    targetInstitutions: ['NRB', 'RBB', 'NBL', 'ADBL'],
    descriptionNepali: 'हार्डवेयर, सफ्टवेयर, अपरेटिङ सिस्टम, नेटवर्क, साइबर सुरक्षा, CBS (Pumori/Finacle), RTGS, ConnectIPS र विद्युतीय कारोबार ऐन २०६३।',
    totalChapters: 8,
    totalEstimatedHours: 30,
    authorEditorialBoard: 'Information Security Officers & FinTech Engineers',
    latestEditionYear: '२०८२/८३ संस्करण',
    syllabusVersionCode: 'SYL-IT-UNIFIED-2082',
    isPremium: false,
    coverAccent: 'from-cyan-700 via-sky-800 to-slate-900',
    chapters: []
  }
];

export function getMasterBookById(bookId: string): MasterBook | undefined {
  return MASTER_BOOKS_DATABASE.find(b => b.id === bookId);
}
