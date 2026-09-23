import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  HelpCircle, 
  BookOpen, 
  FileText, 
  Scale, 
  Calculator,
  RefreshCw
} from 'lucide-react';
import { BankingExamTopicNote } from '../../data/bankingExamNotesData';

interface AiBankingStudyCompanionProps {
  currentTopic: BankingExamTopicNote;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiBankingStudyCompanion: React.FC<AiBankingStudyCompanionProps> = ({ currentTopic }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `नमस्ते! म तपाईँको **बैंकिङ परीक्षा AI अध्ययन साथी** हुँ। 

हाल तपाईँ **विषय ${currentTopic.topicNumber}: ${currentTopic.titleNe}** अध्ययन गरिरहनुभएको छ। 

तलका द्रुत अध्ययन बटनहरू (Quick Prompts) क्लिक गर्न सक्नुहुन्छ वा आफ्नै प्रश्न सोध्न सक्नुहुन्छ:
- १० अङ्कको विस्तृत मोडेल उत्तर ढाँचा
- ५ अङ्कको संक्षिप्त बुँदागत उत्तर
- सम्बन्धित ऐन, कानुन र दफाहरू
- अनुपात हिसाब समाधान र परीक्षा टिप्स`,
      timestamp: 'भर्खरै'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(id);
    setTimeout(() => setIsCopied(null), 2000);
  };

  const generateAnswer = (prompt: string, topic: BankingExamTopicNote): string => {
    const p = prompt.toLowerCase();
    
    if (topic.topicNumber === 1) {
      if (p.includes('१० अङ्क') || p.includes('मोडेल उत्तर')) {
        return `### १० अङ्कको मोडेल उत्तर: वित्तीय विवरण र यसको विश्लेषण

**१. परिचय र अवधारणा (२ अङ्क):**
- वित्तीय विवरण संस्थाको निश्चित समयावधिको आर्थिक ऐना हो। NFRS/NAS 1 बमोजिम संस्थाको वित्तीय स्थिति, वित्तीय कार्यसम्पादन तथा नगद प्रवाहको प्रमाणीकृत विवरण नै वित्तीय विवरण हो।
- BAFIA २०७३ को दफा ८४ अनुसार बैंक तथा वित्तीय संस्थाले प्रत्येक आर्थिक वर्ष समाप्त भएको ३ महिनाभित्र NFRS ढाँचामा वित्तीय विवरण तयार गरी लेखापरीक्षण गराउनुपर्छ।

**२. NFRS अनुसार वित्तीय विवरणका ५ अनिवार्य अङ्गहरू (४ अङ्क):**
1. वित्तीय अवस्थाको विवरण (Statement of Financial Position - वासलात)
2. नाफा-नोक्सान तथा अन्य विस्तृत आम्दानीको विवरण (Statement of Profit or Loss)
3. नगद प्रवाह विवरण (Statement of Cash Flows - सञ्चालन, लगानी, वित्तीय गतिविधि)
4. इक्विटी परिवर्तन विवरण (Statement of Changes in Equity)
5. लेखा नीति तथा व्याख्यात्मक टिप्पणीहरू (Accounting Policies & Explanatory Notes)

**३. बैंकिङमा वित्तीय अनुपात विश्लेषणको महत्त्व (३ अङ्क):**
- **तरलता मूल्याङ्कन:** Current Ratio (२:१), Quick Ratio (१:१) मार्फत अल्पकालीन दायित्व भुक्तानी क्षमता परीक्षण।
- **नियामकीय अनुपालन (NRB Norms):** पुँजी पर्याप्तता अनुपात (CAR कम्तीमा ११%), कर्जा-निक्षेप अनुपात (CD Ratio अधिकतम ९०%), र खराब कर्जा (NPL अधिकतम ५%) को निगरानी।
- **नाफामूलकता तथा कार्यदक्षता:** ROE, ROA, र NIM मार्फत सम्पत्ति तथा पुँजी परिचालनको कार्यकुशलता मापन।

**४. निष्कर्ष (१ अङ्क):**
वित्तीय विवरण पारदर्शी, विन्डो-ड्रेसिङमुक्त र यथार्थपरक हुनुपर्छ। यसले निक्षेपकर्ताको विश्वास आर्जन गर्न र राष्ट्र बैंकको सुपरिवेक्षकीय मापदण्ड पूरा गर्न अहम् भूमिका खेल्दछ।`;
      } else if (p.includes('५ अङ्क') || p.includes('संक्षिप्त')) {
        return `### ५ अङ्कको संक्षिप्त उत्तर: पुँजी पर्याप्तता अनुपात (CAR) र CD Ratio

**१. पुँजी पर्याप्तता अनुपात (CAR):**
- **अर्थ:** बैंकको कुल जोखिम भारित सम्पत्ति (RWA) को तुलनामा बैंकसँग रहेको पुँजी कोषको अनुपात हो।
- **सूत्र:** $\\text{CAR} = \\frac{\\text{Total Capital (Tier 1 + Tier 2)}}{\\text{RWA}} \\times 100\\%$
- **NRB सीमा:** न्यूनतम ११.०% (Tier 1: कम्तीमा ८.५%) - निर्देशन नं. १।
- **महत्त्व:** बैंकलाई अप्रत्याशित वित्तीय नोक्सानी र टाट पल्टिनबाट जोगाउँछ।

**२. कर्जा-निक्षेप अनुपात (CD Ratio):**
- **अर्थ:** बैंकले संकलन गरेको कुल स्थानीय निक्षेपको तुलनामा प्रवाह गरेको कर्जाको प्रतिशत हो।
- **सूत्र:** $\\text{CD Ratio} = \\frac{\\text{Total Domestic Credit}}{\\text{Total Domestic Deposit}} \\times 100\\%$
- **NRB सीमा:** अधिकतम ९०.०% - निर्देशन नं. २।
- **महत्त्व:** बैंकको तरलता नियन्त्रण गर्न र अत्यधिक आक्रामक कर्जा रोक्न।`;
      } else {
        return `### वित्तीय अनुपात विश्लेषण सारांश:
- **Liquidity:** Current Ratio (२:१), Quick Ratio (१:१), Cash Ratio (०.२:१)
- **Profitability:** Gross Profit Margin, Net Profit Margin, ROE (१५%+), ROA (१.५%+), NIM (३-४%)
- **Solvency:** Debt-to-Equity (१:१ देखि २:१), Interest Coverage Ratio (२.५+ गुणा)
- **Activity:** Inventory Turnover (५-८ पटक), DSO (३०-४५ दिन)
- **Regulatory:** CAR (११%), CD Ratio (९०%), NPL (<५%)`;
      }
    } else if (topic.topicNumber === 2) {
      return `### विद्युतीय वाणिज्य (E-Commerce) - परीक्षा सारांश र उत्तर संरचना:

**१. परिभाषा:** कम्प्युटर, इन्टरनेट तथा डिजिटल प्रविधिको प्रयोगबाट वस्तु, सेवा वा सूचनाको खरिद, बिक्री, भुक्तानी र डेलिभरी गर्ने प्रक्रिया।
**२. ६ प्रमुख मोडेलहरू:**
- **B2B:** उद्योग-उद्योग बीच (उदा: धागो र कपडा कारखाना)
- **B2C:** व्यापार-उपभोक्ता (Daraz, SastoDeal)
- **C2C:** उपभोक्ता-उपभोक्ता (Hamrobazar, FB Marketplace)
- **C2B:** उपभोक्ता-व्यापार (Fiverr, Upwork फ्रिलान्सिङ)
- **B2G:** व्यापार-सरकार (PPMO Bolpatra ई-टेन्डर)
- **G2C:** सरकार-नागरिक (Nagarik App, मालपोत अनलाइन)

**३. नेपालका ८ मुख्य समस्या र जोखिमहरू:**
- क्यास अन डेलिभरी (COD) मा अत्यधिक निर्भरता (७०%+)
- लजिस्टिक्स र ठेगाना प्रणालीको कमजोरी
- सामानको भौतिक परीक्षण नहुँदा गुणस्तर विवाद
- साइबर सुरक्षा, फिसिङ र डेटा गोपनीयता जोखिम
- सामाजिक सञ्जालबाट कर नतिरी अवैध व्यापार (कर चुहावट)`;
    } else if (topic.topicNumber === 3) {
      return `### विद्युतीय भुक्तानी प्रणाली (EPS) - मुख्य परीक्षा बुँदाहरू:

**१. कानुनी आधार:** भुक्तानी तथा फछ्र्यौट ऐन, २०७५ तथा विनियमावली, २०७७।
**२. ६ प्रकारहरू:**
1. खातामा आधारित (connectIPS, Net Banking)
2. कार्डमा आधारित (Visa, MasterCard, SCT)
3. वालेटमा आधारित (eSewa, Khalti, IME Pay)
4. QR कोडमा आधारित (NepalQR, Fonepay)
5. क्लियरिङ आधारित (NCHL-ECC, NCHL-IPS)
6. RTGS आधारित (NRB सञ्चालित रु. २ लाख माथिका उच्च मूल्य कारोबार)

**३. नेपालको पूर्वाधार:**
- RTGS (नेपाल राष्ट्र बैंक)
- NPS / RPS / connectIPS (NCHL)
- NepalQR (अन्तरआवद्ध क्युआर)
- PSPs (२७+ वालेटहरू) र PSOs (NCHL, Fonepay, SCT, NEPS)

**४. प्रमुख जोखिमहरू:** साइबर आक्रमण, सिस्टम डाउनटाइम, फिसिङ/OTP चोरी, तरलता जोखिम, र प्रविधि बहिष्करण।`;
    } else if (topic.topicNumber === 4) {
      return `### भर्चुअल मुद्रा र CBDC - प्रमुख परीक्षा विश्लेषण:

**१. क्रिप्टोकरेन्सी vs CBDC:**
- **क्रिप्टोकरेन्सी:** निजी, विकेन्द्रीकृत, कुनै सरकारको जमानी नभएको (उदा: Bitcoin)। नेपालमा पूर्णतः गैरकानुनी र दण्डनीय।
- **CBDC:** केन्द्रीय बैंकको आधिकारिक प्रत्यक्ष दायित्व (Sovereign Liability) भएको डिजिटल फियाट मुद्रा।

**२. नेपालमा क्रिप्टो प्रतिबन्धका कानुनी आधार:**
- नेपाल राष्ट्र बैंक ऐन २०५८ को दफा ४३ (मुद्रा निष्कासनको एकाधिकार)
- विदेशी विनिमय (नियमित गर्ने) ऐन २०१९ को दफा ९ग (विदेशी विनिमय कसूर)
- विदेशी मुद्रा सञ्चिति जोगाउन, पुँजी पलायन रोक्न र ठगी नियन्त्रण गर्न।

**३. CBDC का ७ प्रयोगहरू:**
१. खुद्रा भुक्तानी, २. सस्तो रेमिट्यान्स, ३. लक्षित सरकारी भत्ता, ४. अफलाइन दुर्गम भुक्तानी, ५. थोक अन्तरबैंक फछ्र्यौट, ६. वित्तीय समावेशीकरण, ७. नोट छपाई खर्च न्यूनीकरण।`;
    } else {
      return `### भर्चुअल बैंक (Neobank) - परीक्षा सारांश:

**१. मूल अवधारणा:** भौतिक शाखा (Brick-and-mortar) नभएको, १००% डिजिटल, मोबाइल एप र AI बाट चल्ने आधुनिक बैंक।
> "Banking is essential, banks are not." - Bill Gates

**२. ६-चरणीय कार्यविधि:**
१. भिडियो KYC अनबोर्डिङ ➔ २. क्लाउड कोर बैंकिङ सक्रियता ➔ ३. ओपन API कोष लोड ➔ ४. AI क्रेडिट स्कोरिङ र न्यानो कर्जा ➔ ५. स्वचालित बजेटिङ ➔ ६. २४/७ AI च्याटबट

**३. परम्परागत बैंकसँग तुलना:**
- शाखा: परम्परागतमा अनिवार्य, भर्चुअलमा ० शाखा
- लागत: परम्परागतमा उच्च ओपेक्स, भर्चुअलमा न्यून ओपेक्स
- निर्णय: परम्परागतमा दिन/हप्ता, भर्चुअलमा मिनेटमै AI निर्णय

**४. नेपालमा चुनौती:** BAFIA २०७३ ले भौतिक संरचना मात्र चिनेको हुँदा छुट्टै डिजिटल बैंक लाइसेन्स ऐन आवश्यक।`;
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: 'भर्खरै'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    setTimeout(() => {
      const responseText = generateAnswer(text, currentTopic);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: responseText,
        timestamp: 'भर्खरै'
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 600);
  };

  const quickPrompts = [
    { label: '१० अङ्कको मोडेल उत्तर', icon: FileText, query: 'यस विषयमा १० अङ्कको विस्तृत लोकसेवा मोडेल उत्तर ढाँचा प्रस्तुत गर्नुहोस्।' },
    { label: '५ अङ्कको संक्षिप्त संरचना', icon: BookOpen, query: 'यस विषयबाट सोधिने ५ अङ्कको प्रश्नको संक्षिप्त र प्रभावकारी उत्तर दिनुहोस्।' },
    { label: 'ऐन तथा कानूनी प्रावधान', icon: Scale, query: 'यस विषयसँग सम्बन्धित नेपालका प्रमुख ऐन, नियम तथा राष्ट्र बैंकका निर्देशनहरू के-के हुन्?' },
    { label: 'जोखिम तथा समाधानका उपाय', icon: Sparkles, query: 'यस विषयका मुख्य जोखिमहरू, कमी-कमजोरीहरू र समाधानका उपायहरू बुँदागत रूपमा खुलाउनुहोस्।' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6 text-[#0F172A]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-50 text-[#1E40AF] border border-blue-200 shadow-sm">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-[#0F172A]">
                बैंकिङ AI अध्ययन साथी (AI Companion)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#1E40AF] text-white">
                TOPIC {currentTopic.topicNumber}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              लोकसेवा आयोग तथा बैंकिङ परीक्षाको पाठ्यक्रममा आधारित तत्काल उत्तर तथा परामर्श
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMessages([messages[0]])}
          className="text-xs font-bold text-slate-600 hover:text-[#1E40AF] flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> संवाद खाली गर्नुहोस्
        </button>
      </div>

      {/* Quick Prompt Chips */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>द्रुत लोकसेवा परीक्षा प्रम्प्टहरू (Quick Prompts):</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(qp.query)}
              className="p-2.5 rounded-xl bg-[#F8FAFC] hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 text-left transition flex items-center gap-2 cursor-pointer group"
            >
              <qp.icon className="w-4 h-4 text-[#1E40AF] shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-700 group-hover:text-[#1E40AF] truncate">
                {qp.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[#1E40AF] shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#1E40AF] text-white rounded-tr-xs'
                    : 'bg-[#F8FAFC] text-slate-800 border border-slate-200 rounded-tl-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-slate-200/50">
                  <span className="text-[10px] font-bold opacity-75">
                    {isUser ? 'तपाईँको प्रश्न' : 'AI अध्ययन साथी'}
                  </span>
                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => handleCopy(m.id, m.text)}
                      className="p-1 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                      title="कपी गर्नुहोस्"
                    >
                      {isCopied === m.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                <div className="whitespace-pre-wrap font-sans font-medium space-y-2">
                  {m.text}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center text-xs text-slate-500 font-bold p-3 bg-slate-50 rounded-2xl w-fit border border-slate-200">
            <Bot className="w-4 h-4 text-[#1E40AF] animate-bounce" />
            <span>AI ले उत्तर तयार गर्दैछ...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="pt-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`विषय ${currentTopic.topicNumber} सम्बन्धी कुनै पनि प्रश्न सोध्नुहोस्...`}
            className="flex-1 px-4 py-3 bg-[#F8FAFC] border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent transition"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-[#1E40AF] hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">पठाउनुहोस्</span>
          </button>
        </div>
      </div>

    </div>
  );
};
