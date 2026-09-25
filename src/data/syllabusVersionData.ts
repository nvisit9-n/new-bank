import { SyllabusVersionRecord } from '../types/masterEcosystem';

export const OFFICIAL_SYLLABUS_VERSIONS: SyllabusVersionRecord[] = [
  // 1. Nepal Rastra Bank - Level 4 (Assistant)
  {
    id: 'syl-nrb-level-4-current',
    institution: 'NRB',
    postName: 'सहायक (प्रशासन) - तह ४',
    level: '4',
    versionYearBS: '२०८२',
    status: 'CURRENT_OFFICIAL',
    effectiveDateBS: '२०८१-१०-१५',
    officialGazetteRef: 'नेपाल राष्ट्र बैंक कर्मचारी सेवा विनियमावली एवं पदपूर्ति समिति सूचना',
    totalMarks: 300,
    preTestMarks: 100,
    writtenPaperMarks: 200,
    interviewMarks: 50,
    hasNegativeMarking: true,
    negativeMarkingPercent: 20,
    diffFromPreviousVersion: [
      {
        topicId: 'nrb-digital-fintech',
        topicNameNepali: 'डिजिटल भुक्तानी, RTGS, ConnectIPS र AI FinTech',
        changeType: 'ADDED',
        currentSyllabusText: 'डिजिटल बैंकिङ प्रणाली, नेपाल क्लियरिङ हाउस (NCHL) संयन्त्र र साइबर सुरक्षाको आधारभूत ज्ञान।',
        changeImpactNotice: 'नयाँ पाठ्यक्रममा थपिएको अनिवार्य खण्ड। ५ अङ्कको छोटो उत्तर वा वस्तुगत प्रश्न सोधिने।'
      },
      {
        topicId: 'nrb-aml-fatf-greylist',
        topicNameNepali: 'सम्पत्ति शुद्धीकरण निवारण (AML/CFT) र FATF मापदण्ड',
        changeType: 'MODIFIED',
        previousSyllabusText: 'सम्पत्ति शुद्धीकरण ऐनको सामान्य परिचय।',
        currentSyllabusText: 'सम्पत्ति शुद्धीकरण ऐन २०६४, वास्तविक हितग्राही (BO) पहिचान, FIU नेपाल र सुधारात्मक कार्ययोजना।',
        changeImpactNotice: 'अन्तर्राष्ट्रिय मूल्याङ्कनलाई मध्यनजर गर्दै दायरा फराकिलो बनाइएको।'
      },
      {
        topicId: 'nrb-traditional-shorthand',
        topicNameNepali: 'परम्परागत स्टेनो तथा टाइपराइटिङ',
        changeType: 'REMOVED',
        previousSyllabusText: 'नेपाली तथा अंग्रेजी म्यानुअल टाइपिङ।',
        currentSyllabusText: 'कम्प्युटर दक्षता परीक्षण (MS Office, Web & Networking) मा रूपान्तरण।',
        changeImpactNotice: 'पुरानो म्यानुअल टाइपराइटिङ पूर्णतः हटाई कम्प्युटर प्रविधि समावेश।'
      }
    ]
  },

  // 2. Nepal Rastra Bank - Level 6 (Assistant Director / अधिकृत तृतीय)
  {
    id: 'syl-nrb-level-6-current',
    institution: 'NRB',
    postName: 'सहायक निर्देशक (अधिकृत तृतीय) - तह ६',
    level: '6',
    versionYearBS: '२०८२',
    status: 'CURRENT_OFFICIAL',
    effectiveDateBS: '२०८१-०९-२०',
    officialGazetteRef: 'नेपाल राष्ट्र बैंक पदपूर्ति समिति राजपत्र सूचना',
    totalMarks: 400,
    preTestMarks: 100,
    writtenPaperMarks: 300,
    interviewMarks: 60,
    hasNegativeMarking: true,
    negativeMarkingPercent: 20,
    diffFromPreviousVersion: [
      {
        topicId: 'nrb-l6-monetary-transmission',
        topicNameNepali: 'मौद्रिक नीति सञ्चार संयन्त्र (Monetary Transmission Channels)',
        changeType: 'MODIFIED',
        currentSyllabusText: 'ब्याजदर करिडोर, विनिमय दर च्यानल, कर्जा च्यानल र सम्पत्ति मूल्य च्यानलको गहिरो समष्टिगत विश्लेषण।',
        changeImpactNotice: '१० तथा १५ अङ्कका विश्लेषणात्मक प्रश्नहरूका लागि प्रमुख विषय।'
      },
      {
        topicId: 'nrb-l6-macroprudential',
        topicNameNepali: 'म्याक्रोप्रुडेन्सियल नियमन तथा बेसल ३ ढाँचा',
        changeType: 'ADDED',
        currentSyllabusText: 'Countercyclical Capital Buffer (CCyB), Domestic Systemically Important Banks (D-SIBs), LCR र NSFR।',
        changeImpactNotice: 'अधिकृत स्तरको वित्तीय स्थायित्व सम्बन्धी विशेष अध्ययन क्षेत्र।'
      }
    ]
  },

  // 3. Rastriya Banijya Bank - Level 4 (Assistant / Cashier)
  {
    id: 'syl-rbb-level-4-current',
    institution: 'RBB',
    postName: 'सहायक / सहायक (नगद) - तह ४',
    level: '4',
    versionYearBS: '२०८२/८३',
    status: 'CURRENT_OFFICIAL',
    effectiveDateBS: '२०८१-११-०१',
    officialGazetteRef: 'लोक सेवा आयोग, सुरक्षा निकाय तथा संगठित संस्था महाशाखा',
    totalMarks: 300,
    preTestMarks: 100,
    writtenPaperMarks: 200,
    interviewMarks: 50,
    hasNegativeMarking: true,
    negativeMarkingPercent: 20,
    diffFromPreviousVersion: [
      {
        topicId: 'rbb-cbs-core-banking',
        topicNameNepali: 'कोर बैंकिङ सफ्टवेयर (Pumori/Finacle) र डिजिटल काउन्टर सञ्चालन',
        changeType: 'ADDED',
        currentSyllabusText: 'काउन्टर सञ्चालन, नगद व्यवस्थापन, चेक भुक्तानी, Clearing, र ConnectIPS।',
        changeImpactNotice: 'सहायक नगद र प्रशासन दुवैका लागि व्यवहारिक बैंकिङ सम्बन्धी नयाँ खण्ड।'
      }
    ]
  },

  // 4. Rastriya Banijya Bank - Level 5 (Senior Assistant)
  {
    id: 'syl-rbb-level-5-current',
    institution: 'RBB',
    postName: 'वरिष्ठ सहायक - तह ५',
    level: '5',
    versionYearBS: '२०८२/८३',
    status: 'CURRENT_OFFICIAL',
    effectiveDateBS: '२०८१-११-०१',
    officialGazetteRef: 'लोक सेवा आयोग संगठित संस्था पदपूर्ति विवरण',
    totalMarks: 300,
    preTestMarks: 100,
    writtenPaperMarks: 200,
    interviewMarks: 50,
    hasNegativeMarking: true,
    negativeMarkingPercent: 20
  },

  // 5. Nepal Bank Limited - Level 4 (Assistant)
  {
    id: 'syl-nbl-level-4-current',
    institution: 'NBL',
    postName: 'सहायक (प्रशासन/नगद) - तह ४',
    level: '4',
    versionYearBS: '२०८२',
    status: 'CURRENT_OFFICIAL',
    effectiveDateBS: '२०८१-०८-१०',
    officialGazetteRef: 'नेपाल बैंक लिमिटेड पदपूर्ति उपसमिति सूचना',
    totalMarks: 300,
    preTestMarks: 100,
    writtenPaperMarks: 200,
    interviewMarks: 50,
    hasNegativeMarking: true,
    negativeMarkingPercent: 20
  },

  // 6. Agricultural Development Bank (ADBL) - Level 4 & 5
  {
    id: 'syl-adbl-level-4-current',
    institution: 'ADBL',
    postName: 'लेखापाल / व्यवसाय सहायक - तह ४',
    level: '4',
    versionYearBS: '२०८२',
    status: 'CURRENT_OFFICIAL',
    effectiveDateBS: '२०८१-०७-२२',
    officialGazetteRef: 'कृषि विकास बैंक कर्मचारी पदपूर्ति समिति',
    totalMarks: 300,
    preTestMarks: 100,
    writtenPaperMarks: 200,
    interviewMarks: 50,
    hasNegativeMarking: true,
    negativeMarkingPercent: 20,
    diffFromPreviousVersion: [
      {
        topicId: 'adbl-agri-value-chain',
        topicNameNepali: 'कृषि मूल्य शृङ्खला कर्जा (Agriculture Value Chain Financing)',
        changeType: 'MODIFIED',
        currentSyllabusText: 'सहुलियतपूर्ण कर्जा, कृषि ऋण, साना किसान समूह र ग्रामीण बैंकिङ।',
        changeImpactNotice: 'कृषि विकास बैंकको मौलिक कार्यक्षेत्रमा आधारित उच्च अङ्कभार भएको खण्ड।'
      }
    ]
  }
];

export function getSyllabusVersion(institution: string, level: string): SyllabusVersionRecord | undefined {
  return OFFICIAL_SYLLABUS_VERSIONS.find(s => s.institution === institution && s.level === level) || OFFICIAL_SYLLABUS_VERSIONS[0];
}
