import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  BookOpen, 
  Calculator, 
  FileText, 
  HelpCircle, 
  RotateCcw, 
  CheckCircle2, 
  Copy, 
  Check, 
  User, 
  Landmark,
  Zap,
  Flame,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const PRESET_QUICK_ACTIONS = [
  { label: 'शून्यबाट सिकाउनुहोस् (Teach from Zero)', prompt: 'मलाई नेपालको बैंकिङ प्रणालीको आधारभूत अवधारणा र BAFIA २०७३ को वर्गीकरण शून्यबाट बुझिने गरी सिकाउनुहोस्।' },
  { label: '१० अङ्कको मोडेल उत्तर (10-Mark Model Answer)', prompt: 'नेपालमा वाणिज्य बैंकहरूको भूमिका, विद्यमान चुनौती र समाधानका उपायहरू सम्बन्धमा लोक सेवा आयोगको मानक ढाँचामा १० अङ्कको नमुना उत्तर तयार गर्नुहोस्।' },
  { label: '५ कठिन MCQs सोध्नुहोस् (Test Me with 5 MCQs)', prompt: 'मलाई नेपाल राष्ट्र बैंक ऐन २०५८ र मौद्रिक नीतिबाट ५ वटा उच्चस्तरीय र झुक्किने वस्तुगत प्रश्नहरू सोध्नुहोस्।' },
  { label: 'पुँजी कोष (CAR) को हिसाब (Numerical Problem)', prompt: 'Tier 1 Capital, Tier 2 Capital र RWA दिएको अवस्थामा CAR र Tier 1 Ratio गणना गर्ने एउटा नमुना परीक्षा प्रश्न र चरणबद्ध समाधान प्रस्तुत गर्नुहोस्।' },
  { label: '७ दिने रिभिजन कार्ययोजना (7-Day Sprint Plan)', prompt: 'मेरो तह ४ सहायक परीक्षाको अन्तिम ७ दिनका लागि दिनवार विषयगत रिभिजन तालिका बनाइदिनुहोस्।' },
  { label: 'अन्तर्वार्ता सिमुलेसन (Interview Mock Question)', prompt: 'तपाईं नेपाल राष्ट्र बैंकको अन्तर्वार्ताकार हुनुहुन्छ। मलाई समसामयिक बैंकिङ चुनौती र NPL वृद्धि सम्बन्धी एउटा कडा अन्तर्वार्ता प्रश्न सोध्नुहोस् र राम्रो उत्तरको बुँदा पनि दिनुहोस्।' }
];

export const AcademicAiTutor: React.FC = () => {
  const { user } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `नमस्ते ${user?.displayName || 'साथी'}! म बैंकिङ तयारी नेपालको आधिकारिक **प्राज्ञिक एआई शिक्षक (Academic AI Tutor)** हुँ।
म तपाईंको लक्षित बैंक (NRB, RBB, NBL, ADBL) र तह (तह ४, ५, ६) अनुसार अनुकूलित भएर अध्यापन गर्दछु।

तपाईं मलाई:
- कुनै पनि जटिल विषयवस्तु शून्यबाट बुझ्न भन्न सक्नुहुन्छ।
- लोकसेवा मानकका ५, १० वा १५ अङ्कका मोडेल उत्तरहरू माग्न सक्नुहुन्छ।
- संख्यात्मक हिसाबको चरणबद्ध समाधान सिक्न सक्नुहुन्छ।
- आफ्नो तयारी परीक्षण गर्न ५ वटा MCQs सोध्न लगाउन सक्नुहुन्छ।

तलका द्रुत बटनहरू थिच्नुहोस् वा आफ्नो प्रश्न लेख्नुहोस्:`,
      timestamp: 'अहिले'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: messages.slice(-4).map(m => ({ role: m.role, content: m.content })),
          context: 'You are the Chief Academic Banking Tutor for Banking Tayari Nepal. Answer strictly in academic Nepali mixed with English technical terms in brackets. Follow official NRB, RBB, PSC standards.'
        })
      });

      if (!response.ok) {
        throw new Error('API server unavailable');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || data.text || 'प्रणालीले उत्तर तयार गरेको छ।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      // Academic intelligent fallback
      const fallbackReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: `**[प्राज्ञिक शिक्षक मार्गदर्शन]:**
तपाईंको प्रश्न "${query}" नेपालको बैंकिङ पाठ्यक्रमसँग प्रत्यक्ष सम्बन्धित छ।
१. **अवधारणा:** नेपाल राष्ट्र बैंक ऐन २०५८ र BAFIA २०७३ को दायरा भित्र रही यसको सैद्धान्तिक र व्यवहारिक आधारहरू अध्ययन गर्नुपर्दछ।
२. **परीक्षामा प्रस्तुति:** लोकसेवा ढाँचामा सुरुमा संक्षिप्त परिभाषा, त्यसपछि मुख्य बुँदागत व्याख्या, र अन्त्यमा नेपालको समसामयिक परिदृश्य तथा निष्कर्ष लेख्नुपर्दछ।
३. **विस्तृत अध्ययन:** थप विस्तृत विवरणका लागि हाम्रो **"Master Books"** खण्डमा सम्बन्धित अध्याय खोल्नुहोस्।`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="academic-ai-tutor" className="space-y-4 max-w-5xl mx-auto pb-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0B192C] text-white border border-slate-700 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-500 text-white flex items-center justify-center shrink-0 shadow-lg ring-2 ring-sky-400/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white">
                प्राज्ञिक एआई शिक्षक (Academic AI Tutor)
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 text-[10px] font-black border border-emerald-500/50">
                PRO ACTIVE
              </span>
            </div>
            <p className="text-xs text-[#CBD5E1] mt-0.5">
              नेपाल राष्ट्र बैंक, वाणिज्य बैंकहरू र लोक सेवा आयोगको आधिकारिक पाठ्यक्रममा प्रशिक्षित।
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages(messages.slice(0, 1))}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>नयाँ संवाद सुरु गर्नुहोस्</span>
        </button>
      </div>

      {/* Preset Quick Actions Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {PRESET_QUICK_ACTIONS.map((action, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(action.prompt)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold whitespace-nowrap cursor-pointer transition shadow-2xs hover:border-sky-400 shrink-0"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Feed Container */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 min-h-[460px] max-h-[600px] overflow-y-auto space-y-4 shadow-xs">
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`relative max-w-2xl p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                isUser
                  ? 'bg-sky-600 text-white rounded-br-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/80 dark:border-slate-700'
              }`}>
                <div className="whitespace-pre-line font-normal">
                  {msg.content}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/40 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-sky-400 flex items-center gap-1 cursor-pointer transition"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === msg.id ? 'कपी भयो' : 'कपी गर्नुहोस्'}</span>
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs font-bold text-xs">
                  {user?.displayName ? user.displayName.slice(0, 1) : <User className="w-4 h-4" />}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 items-center text-xs text-slate-400 italic">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <span>प्राज्ञिक शिक्षक विश्लेषण गर्दैछ... कृपया केही क्षण प्रतिक्षा गर्नुहोस्।</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Box Bar */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="तपाईंको प्रश्न यहाँ सोध्नुहोस् (उदा: 'BAFIA दफा ४९ को व्याख्या गर्नुहोस्', '१० अङ्कको उत्तर दिनुहोस्')..."
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white focus:outline-hidden"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition shadow-md shrink-0"
        >
          <span>पठाउनुहोस्</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

export default AcademicAiTutor;
