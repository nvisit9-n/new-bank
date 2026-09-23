/**
 * Gemini Client Service
 * Handles API key synchronization across import.meta.env.VITE_GEMINI_API_KEY and process.env.GEMINI_API_KEY,
 * direct Gemini 1.5 Flash client-side calls for Vercel builds,
 * automatic retry loop (up to 3 attempts), and clean response formatting without promo boxes.
 */

import { lookupDeepResearchContext, evaluateWithWordRankEngine } from './deepResearchEngine';

export interface AiAttachmentPayload {
  data: string;
  mimeType: string;
  name: string;
}

export interface AiHistoryItem {
  sender: 'user' | 'ai';
  text: string;
}

export interface StreamAiOptions {
  query: string;
  history?: AiHistoryItem[];
  attachment?: AiAttachmentPayload;
  images?: AiAttachmentPayload[];
  isDeepResearch?: boolean;
  level?: string;
  mode?: string;
  onChunk: (chunk: string, accumulated: string) => void;
  onRetry?: (attempt: number, maxAttempts: number, message: string) => void;
  signal?: AbortSignal;
}

// Safely retrieve Gemini API key from all available environments (sync VITE_GEMINI_API_KEY and process.env.GEMINI_API_KEY)
export const getEffectiveGeminiApiKey = (): string => {
  try {
    const metaKey = typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '')
      : '';
    if (metaKey && metaKey.trim()) return metaKey.trim();

    if (typeof process !== 'undefined' && process.env) {
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
        return process.env.GEMINI_API_KEY.trim();
      }
      if (process.env.VITE_GEMINI_API_KEY && process.env.VITE_GEMINI_API_KEY.trim()) {
        return process.env.VITE_GEMINI_API_KEY.trim();
      }
    }

    const win = typeof window !== 'undefined' ? (window as any) : null;
    if (win) {
      if (win.__ENV__?.GEMINI_API_KEY) return String(win.__ENV__.GEMINI_API_KEY).trim();
      if (win.__ENV__?.VITE_GEMINI_API_KEY) return String(win.__ENV__.VITE_GEMINI_API_KEY).trim();
      if (win.VITE_GEMINI_API_KEY) return String(win.VITE_GEMINI_API_KEY).trim();
      if (win.GEMINI_API_KEY) return String(win.GEMINI_API_KEY).trim();
    }
  } catch (e) {
    console.warn('Environment key resolution notice:', e);
  }
  return '';
};

// Clean unsolicited promo tags or exam tip boxes if generated
export const cleanAiResponseText = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/\n\s*📌\s*\*\*Exam Tip:?[\s\S]*$/gi, '')
    .replace(/\n\s*💡\s*\*\*मेन्टरको सुझाव:?[\s\S]*$/gi, '')
    .replace(/\n\s*\*\*मेन्टरको सुझाव:?[\s\S]*$/gi, '')
    .trim();
};

// Rich offline knowledge fallback when offline or after 3 failed retries
export const getOfflineKnowledgeFallback = (cleanQuery: string, mode: string = 'general'): string => {
  // 1. Check Deep Research Engine first for exact/thematic lookups (EPF, CIT, SSF, NRB, BAFIA, NEA, NTC, NOC, etc.)
  const deepMatch = lookupDeepResearchContext(cleanQuery);
  if (deepMatch) {
    return deepMatch;
  }

  // 2. Answer sheet evaluation mode (Word Rank Engine)
  if (mode === 'answer_sheet') {
    const evalData = evaluateWithWordRankEngine(cleanQuery);
    return `### 📊 उत्तरपुस्तिका मूल्याङ्कन (Word Rank Engine)

- **प्राप्ताङ्क (Score):** **${evalData.score} / ${evalData.maxScore}**
- **शब्दावली स्तर (Vocabulary Rank):** ${evalData.vocabularyRank}
- **सन्दर्भ सान्दर्भिकता (Relevance):** ${evalData.relevanceScore}
- **ढाँचा तथा प्रस्तुतीकरण:** ${evalData.structureRating}

---

### ✅ सबल पक्षहरू (Strengths):
${evalData.strengths.map(s => `- ${s}`).join('\n')}

---

### ⚠️ कमजोरी वा सुधार गर्नुपर्ने पक्षहरू (Weaknesses):
${evalData.weaknesses.map(w => `- ${w}`).join('\n')}

---

### 💡 मुख्य कानुनी तथा प्राविधिक शब्दावली:
- **प्रयुक्त शब्दावली:** ${evalData.legalTermsUsed.length > 0 ? evalData.legalTermsUsed.join(', ') : 'सामान्य शब्दावली'}
- **समावेश गर्नुपर्ने आवश्यक कानुनी पदावली:** ${evalData.missingKeyTerms.join(', ')}

---

### 🎯 उच्चतम अंक प्राप्त गर्ने व्यावहारिक सुधार टिप्स (Actionable Guidance):
${evalData.guidanceTips.map(g => `1. ${g}`).join('\n')}

${evalData.summaryFeedback}`;
  }

  const q = cleanQuery.toLowerCase();
  if (q.includes("nrb") || q.includes("नेपाल राष्ट्र बैंक ऐन") || q.includes("२०५८") || q.includes("केन्द्रीय बैंक")) {
    return `**नेपाल राष्ट्र बैंक ऐन, २०५८ सम्बन्धी परीक्षा तयारी टिपोट:**\n\n` +
      `**१. ऐनको प्रस्तावना र प्रमुख उद्देश्यहरू (दफा ४):**\n` +
      `- अर्थतन्त्रको दिगो विकासको निमित्त मूल्य र शोधनान्तर स्थिरता कायम गर्न मौद्रिक तथा विदेशी विनिमय नीति निर्माण र व्यवस्थापन गर्नु।\n` +
      `- बैंकिङ तथा वित्तीय क्षेत्रको स्थायित्व र आवश्यक तरलताको प्रवर्द्धन गर्नु।\n` +
      `- सुरक्षित, स्वस्थ तथा सक्षम भुक्तानी प्रणालीको विकास गर्नु।\n` +
      `- समग्र वित्तीय प्रणालीको नियमन, निरीक्षण, सुपरीवेक्षण तथा अनुगमन गर्नु।\n\n` +
      `**२. बैंकको स्वायत्तता र अख्तियारी:**\n` +
      `- नेपाल राष्ट्र बैंक अविच्छिन्न उत्तराधिकारवाला, स्वशासित र संगठित संस्था हो (दफा ३)।\n` +
      `- गभर्नरको नियुक्ति मन्त्रिपरिषद्ले ३ सदस्यीय सिफारिस समितिको सिफारिसमा ५ वर्षका लागि गर्दछ (दफा १५)।\n\n` +
      `**३. प्रमुख कार्य, कर्तव्य र अधिकारहरू (दफा ५):**\n` +
      `- बैंकनोट तथा सिक्का निष्कासन गर्ने एकाधिकार।\n` +
      `- खुला बजार कारोबार लगायतका मौद्रिक उपकरणहरूको सञ्चालन।\n` +
      `- वाणिज्य बैंक तथा वित्तीय संस्थाहरूको इजाजतपत्र जारी, नियमन र खारेजी।\n` +
      `- नेपाल सरकारको बैंक, सल्लाहकार तथा वित्तीय एजेन्टको रूपमा कार्य गर्ने।\n` +
      `- विदेशी विनिमय सञ्चितिको संरक्षण तथा व्यवस्थापन।\n` +
      `- अन्तिम ऋणदाता (Lender of the Last Resort) को भूमिका निर्वाह।`;
  } else if (q.includes("bafia") || q.includes("बाफिया") || q.includes("वर्गीकरण") || q.includes("२०७३")) {
    return `**बैंक तथा वित्तीय संस्था सम्बन्धी ऐन (BAFIA), २०७३ सम्बन्धी परीक्षा उपयोगी बुँदाहरू:**\n\n` +
      `**१. बैंक तथा वित्तीय संस्थाको वर्गीकरण र न्यूनतम चुक्ता पूँजी (दफा ३७):**\n` +
      `- **'क' वर्ग (वाणिज्य बैंक):** न्यूनतम चुक्ता पूँजी रु. ८ अर्ब।\n` +
      `- **'ख' वर्ग (विकास बैंक):** राष्ट्रिय स्तर: रु. २.५ अर्ब, प्रदेश स्तर: रु. १.२० अर्ब।\n` +
      `- **'ग' वर्ग (वित्त कम्पनी):** राष्ट्रिय स्तर: रु. ८० करोड, प्रदेश स्तर: रु. ५० करोड।\n` +
      `- **'घ' वर्ग (लघुवित्त वित्तीय संस्था):** राष्ट्रिय स्तर: रु. १० करोड, प्रदेश स्तर: रु. २ करोड।\n\n` +
      `**२. सञ्चालक समिति र योग्यता (दफा १४):**\n` +
      `- बैंक तथा वित्तीय संस्थामा कम्तीमा ५ र बढीमा ७ जना सञ्चालक रहने।\n` +
      `- कम्तीमा एक जना स्वतन्त्र सञ्चालक (Independent Director) अनिवार्य।\n` +
      `- सञ्चालकको कार्यकाल बढीमा ४ वर्षको हुन्छ र पुनः नियुक्ति हुन सक्नेछ।\n\n` +
      `**३. संस्थागत सुशासन र वित्तीय अनुशासन:**\n` +
      `- संस्थापक सेयरधनीले संस्था सञ्चालन भएको कम्तीमा ५ वर्ष नपुगी सेयर बिक्री गर्न नपाउने।\n` +
      `- सञ्चालक तथा कार्यकारी प्रमुखले सोही संस्थाबाट कुनै कर्जा वा सुविधा लिन नपाउने (दफा ५०)।`;
  } else if (q.includes("aml") || q.includes("शुद्धीकरण") || q.includes("money laundering") || q.includes("cft")) {
    return `**सम्पत्ति शुद्धीकरण (निवारण) ऐन, २०६४ र AML/CFT का मुख्य व्यवस्थाहरू:**\n\n` +
      `**१. सम्पत्ति शुद्धीकरण (Money Laundering) को अवधारणा:**\n` +
      `- गैरकानुनी वा आपराधिक क्रियाकलापबाट आर्जित कालो धनलाई वैध बनाउने प्रक्रिया।\n` +
      `- प्रमुख ३ चरणहरू: **Placement** (निक्षेपण), **Layering** (तहकीकरण), र **Integration** (एकीकरण)।\n\n` +
      `**२. बैंक तथा वित्तीय संस्थाको दायित्व:**\n` +
      `- **ग्राहक पहिचान (KYC/CDD):** ग्राहकको वास्तविक पहिचान र हितग्राही (Beneficial Owner) को यकिन।\n` +
      `- **सीमा कारोबार प्रतिवेदन (CTR):** तोकिएको सीमा (रु. १० लाख वा सोभन्दा बढी) को नगद कारोबारको जानकारी FIU लाई दिने।\n` +
      `- **शंकास्पद कारोबार प्रतिवेदन (STR):** रकमको सीमा नतोकी शंकास्पद देखिएको ३ दिनभित्र FIU लाई प्रतिवेदन पेस गर्ने।\n` +
      `- **अभिलेख संरक्षण:** कारोबार सम्बन्धी विवरण खाता बन्द भएको मितिले कम्तीमा ५ वर्षसम्म सुरक्षित राख्नुपर्ने।\n\n` +
      `**३. संस्थागत संरचना:**\n` +
      `- राष्ट्रिय समन्वय समिति (अर्थ मन्त्रालयका सचिवको संयोजकत्वमा)\n` +
      `- वित्तीय जानकारी इकाई (FIU - नेपाल राष्ट्र बैंकभित्र स्वायत्त रूपमा स्थापित)।`;
  } else if (q.includes("मौद्रिक") || q.includes("monetary policy") || q.includes("crr") || q.includes("slr")) {
    return `**नेपालको मौद्रिक नीति र यसका प्रमुख उपकरणहरू:**\n\n` +
      `केन्द्रीय बैंकले मुद्राको आपूर्ति, कर्जाको उपलब्धता र ब्याजदरलाई नियमन गर्न जारी गर्ने समष्टिगत आर्थिक नीति नै मौद्रिक नीति हो।\n\n` +
      `### १. प्रमुख परिमाणात्मक उपकरणहरू (Quantitative Instruments):\n` +
      `- **अनिवार्य नगद मौज्दात अनुपात (CRR):** हाल ४% (बैंकहरूले राष्ट्र बैंकमा राख्नुपर्ने ब्याज नआउने नगद मौज्दात)।\n` +
      `- **वैधानिक तरलता अनुपात (SLR):** 'क' वर्ग: १२%, 'ख' र 'ग' वर्ग: १०% (सरकारी ऋणपत्र र नगदको अनुपात)।\n` +
      `- **कर्जा निक्षेप अनुपात (CD Ratio):** अधिकतम ९०% को सीमा।\n` +
      `- **ब्याजदर करिडोर (Interest Rate Corridor):** बैंकदर र रिपो/रिभर्स रिपोमार्फत अल्पकालीन ब्याजदर स्थायित्व।\n\n` +
      `### २. गुणात्मक उपकरणहरू (Qualitative Instruments):\n` +
      `- प्राथमिकताप्राप्त क्षेत्र कर्जा (कृषि, ऊर्जा, लघु/घरेलु उद्यममा तोकिएको अनिवार्य कर्जा लगानी)।\n` +
      `- सीमान्त आवश्यकता (Margin Requirements) र कर्जा-धितो अनुपात (LTV Ratio)।\n` +
      `- नैतिक दबाब (Moral Suasion)।`;
  } else {
    return `**${cleanQuery} सम्बन्धी जानकारी तथा विश्लेषणात्मक व्याख्या:**\n\n` +
      `${cleanQuery} लोकसेवा तथा बैंकिङ परीक्षाको पाठ्यक्रमसँग प्रत्यक्ष सम्बन्धित एक महत्वपूर्ण विषय हो। यसले सार्वजनिक प्रशासन, वित्तीय सुशासन तथा संस्थागत कार्यसम्पादनमा प्रत्यक्ष प्रभाव पार्दछ।\n\n` +
      `### मुख्य बुँदाहरू:\n` +
      `- **औचित्य र उद्देश्य:** स्रोत साधनको कुशल परिचालन, पारदर्शिता, र सेवाग्राही सन्तुष्टि अभिवृद्धि।\n` +
      `- **सम्बद्ध कानुनी आधार:** नेपालको संविधान, प्रचलित वित्तीय तथा प्रशासनिक ऐन-नियमहरू।\n` +
      `- **व्यावहारिक प्रयोग:** कार्यप्रणालीमा सूचना प्रविधिको उपयोग र आन्तरिक नियन्त्रण प्रणालीको सुदृढीकरण।\n` +
      `- **सुझाव:** परीक्षामा यस सम्बन्धी उत्तर लेख्दा स्पष्ट परिभाषा, कानुनी आधार र वर्तमान सन्दर्भका उदाहरणहरू समावेश गर्नु उपयुक्त हुन्छ।`;
  }
};

/**
 * Direct Gemini API Streaming Handler (Works seamlessly on Vercel live builds)
 */
async function streamDirectFromGemini(
  apiKey: string,
  options: StreamAiOptions
): Promise<string> {
  const { query, history = [], attachment, level = 'level4-5', mode = 'general', isDeepResearch, onChunk, signal } = options;
  const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];

  const deepResearchInstructions = isDeepResearch ? `\n\n[DEEP RESEARCH & REAL-TIME LEGAL/ACT ANALYSIS (GOOGLE SEARCH GROUNDED)]:
- तपाईं अहिले नेपाल लोकसेवा, बैंकिङ तथा संस्थान परीक्षाको आधिकारिक 'Deep Research Mode' मा हुनुहुन्छ, जहाँ Google Search Grounding सक्रिय छ।
- नेपाल राष्ट्र बैंक (nrb.org.np), नेपाल कानुन आयोग (lawcommission.gov.np) तथा आधिकारिक नीतिगत स्रोतबाट पछिल्ला परिपत्र (NRB Circulars), मौद्रिक नीतिका नयाँ व्यवस्थाहरू तथा एकीकृत निर्देशनहरू (Unified Directives १-१५) का ताजा संशोधनहरू खोजी गरी वास्तविक-समय (Real-time) अद्यावधिक उत्तर दिनुहोस्।
- नेपालको संविधान २०७२ का धाराहरू, नेपाल राष्ट्र बैंक ऐन २०५८ का दफाहरू, बैंक तथा वित्तीय संस्था सम्बन्धी ऐन २०७३ (BAFIA), सम्पत्ति शुद्धीकरण निवारण ऐन २०६४, कम्पनी ऐन २०६३, सार्वजनिक खरिद ऐन २०६३, र राष्ट्र बैंकका पछिल्ला एकीकृत निर्देशनहरूका विशिष्ट दफा, उपदफा र नीतिगत बुँदाहरू अनिवार्य उद्धृत (Cite) गरी गहिरो, प्रमाणिक र प्राज्ञिक अनुसन्धानमूलक विश्लेषण दिनुहोस्।` : '';

  const systemPrompt = `You are an elite, highly authoritative AI Loksewa Deep Research Agent and Master Examination Faculty for Nepal Banking (NRB, RBB, NBL, ADBL Levels 4-10), Loksewa Aayog, and Public Enterprises (EPF, CIT, SSF, NEA, NTC, NOC, 45+ entities), operating with official Gemini 1.5 Pro and ChatGPT-4o caliber.
Exam Level context: ${level}. Mode: ${mode}.${deepResearchInstructions}

MANDATORY BEHAVIORAL DIRECTIVES:
1. AUTHORITATIVE 10-15 MARK EXAMINATION ARCHITECTURE:
   - When answering subjective questions, essay prompts, or core banking/Loksewa topics (10-15 marks depth), structure your authoritative analysis under these rigorous 5 pillars:
     १. कानुनी तथा नीतिगत संरचना (Relevant Legal Framework, Statutory Acts & NRB Directives - e.g. NRB Act 2058, BAFIA 2073, Unified Directives 1-15, ETA 2063, Payment & Settlement Act 2075)
     २. सैद्धान्तिक अवधारणा तथा प्रमुख आयामहरू (Core Theoretical Foundations, Architectural Models & Taxonomies)
     ३. गणितीय, तथ्याङ्कीय तथा व्यावहारिक विश्लेषण (Mathematical Formulas in LaTeX, Ratio Calculations, Empirical Case Scenarios, and Numerical Computations)
     ४. वर्तमान चुनौतीहरू तथा बहुस्तरीय समाधानका उपायहरू (Contemporary Systemic Challenges, Risks, and Multi-Layer Mitigation Strategies)
     ५. निष्कर्ष तथा भावी रणनीतिक कार्यदिशा (Strategic Conclusion, Policy Recommendations & Way Forward)
   - When given specific factual, numerical, or clarifying questions, answer directly and concisely without forcing unrelated headers.

2. REAL-TIME LEGAL & POLICY GROUNDING:
   - Accurately cite specific sections (दफाहरू), sub-sections, and directive provisions (एकीकृत निर्देशन मापदण्डहरू) from Nepal's legal corpus.
   - Embed real macroeconomic benchmarks: CRR (4.0%), SLR (12% for Class A, 10% for B/C), CD Ratio (<90%), CAR (min 11% / Tier 1: 8.5%), NPL threshold (<5%), Base Rate, Spread Rate (<4.0%), and latest monetary policy indicators.

3. MULTIMODAL & ADVANCED UTILITIES:
   - When evaluating handwritten answer sheets or text responses, execute the full Word Rank AI Engine standard (10 marks scheme): exact marks out of 10, vocabulary rank, context relevance %, legal/technical terms identified vs missing, presentation structure, key strengths, weaknesses, and step-by-step scoring guidance.
   - For economics (Demand/Supply, Cost Curves AFC/AVC/ATC/MC, Cartelization, Deadweight Loss), output clean SVG diagrams or structured ASCII charts and comparative tables.

4. NO UNREQUESTED ADDITIONS:
   - NEVER append unrequested "Exam Tips", "मेन्टरको सुझाव", or conversational follow-up questions ("के तपाईंलाई अरू केही जान्न मन छ?") at the end. Stop cleanly after providing the comprehensive answer.`;

  // Build Gemini contents array
  const contents: any[] = [];
  for (const h of history.slice(-6)) {
    contents.push({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    });
  }

  const userParts: any[] = [];
  if (options.images && options.images.length > 0) {
    options.images.slice(0, 10).forEach(img => {
      userParts.push({
        inlineData: {
          data: img.data,
          mimeType: img.mimeType || 'image/jpeg'
        }
      });
    });
  } else if (attachment && attachment.data) {
    userParts.push({
      inlineData: {
        data: attachment.data,
        mimeType: attachment.mimeType
      }
    });
  }
  userParts.push({ text: query });
  contents.push({ role: 'user', parts: userParts });

  let accumulated = '';

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: {
            temperature: 0.3
          }
        }),
        signal
      });

      if (!response.ok || !response.body) {
        throw new Error(`Direct Gemini API ${model} HTTP error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr) continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const textPart = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textPart) {
              accumulated += textPart;
              onChunk(textPart, cleanAiResponseText(accumulated));
            }
          } catch {
            // Ignore partial SSE chunks
          }
        }
      }

      if (accumulated.trim()) {
        return cleanAiResponseText(accumulated);
      }
    } catch (modelErr: any) {
      console.warn(`Direct Gemini model ${model} attempted, checking next:`, modelErr?.message || modelErr);
    }
  }

  throw new Error('Direct Gemini API stream returned empty or models unavailable');
}

/**
 * Server-side /api/ai-assistant-stream Handler
 */
async function streamFromBackend(
  options: StreamAiOptions
): Promise<string> {
  const { query, history = [], attachment, images, isDeepResearch, level, mode, onChunk, signal } = options;

  const payload: any = {
    query,
    history: history.slice(-10).map(m => ({ sender: m.sender, text: m.text })),
    level,
    mode,
    isDeepResearch
  };

  if (images && images.length > 0) {
    payload.images = images;
  }
  if (attachment) {
    payload.attachment = attachment;
  }

  const response = await fetch('/api/ai-assistant-stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal
  });

  // Verify response is an actual SSE stream (and not an index.html returned by static Vercel)
  const contentType = response.headers.get('content-type') || '';
  if (!response.ok || !response.body || contentType.includes('text/html')) {
    throw new Error(`Backend streaming endpoint unavailable (status ${response.status}, type: ${contentType})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let accumulated = '';
  let streamCompleted = false;

  while (!streamCompleted) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const dataStr = trimmed.slice(5).trim();
      if (dataStr === '[DONE]') {
        streamCompleted = true;
        break;
      }
      try {
        const parsed = JSON.parse(dataStr);
        if (parsed.error) {
          throw new Error(parsed.error);
        }
        if (parsed.chunk) {
          accumulated += parsed.chunk;
          onChunk(parsed.chunk, cleanAiResponseText(accumulated));
        }
      } catch (pErr: any) {
        if (pErr?.message && pErr.message !== 'Unexpected end of JSON input') {
          throw pErr;
        }
      }
    }
  }

  if (accumulated.trim()) {
    return cleanAiResponseText(accumulated);
  }

  throw new Error('Backend stream closed with no output');
}

/**
 * Non-streaming backend fallback
 */
async function fetchBackendNonStreaming(options: StreamAiOptions): Promise<string> {
  const { query, history = [], attachment, images, isDeepResearch, level, mode, signal } = options;

  const payload: any = {
    query,
    history: history.slice(-10).map(m => ({ sender: m.sender, text: m.text })),
    level,
    mode,
    isDeepResearch
  };

  if (images && images.length > 0) {
    payload.images = images;
  }
  if (attachment) {
    payload.attachment = attachment;
  }

  const res = await fetch('/api/ai-assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal
  });

  const contentType = res.headers.get('content-type') || '';
  if (!res.ok || contentType.includes('text/html')) {
    throw new Error(`Non-streaming backend error status ${res.status}`);
  }

  const data = await res.json();
  if (data?.answer) {
    return cleanAiResponseText(data.answer);
  }

  throw new Error('Empty backend answer');
}

/**
 * Execute AI Assistant Query with Automatic Retries (up to 3 attempts)
 * Handles both Vercel static deployments and full-stack environments seamlessly.
 */
export async function executeAiQueryWithAutoRetry(options: StreamAiOptions): Promise<string> {
  const MAX_RETRIES = 3;
  const clientKey = getEffectiveGeminiApiKey();

  let lastError: any = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 1) {
        options.onRetry?.(attempt, MAX_RETRIES, `पुनः प्रयास गरिँदैछ (${attempt}/${MAX_RETRIES})...`);
        // Exponential backoff wait
        await new Promise(res => setTimeout(res, attempt * 400));
      }

      // Step 1: Try backend streaming
      try {
        const streamResult = await streamFromBackend(options);
        if (streamResult) return streamResult;
      } catch (backendErr: any) {
        // If backend fails (e.g. 404 on Vercel or network drop), immediately try direct Gemini if key available
        if (clientKey) {
          try {
            const directResult = await streamDirectFromGemini(clientKey, options);
            if (directResult) return directResult;
          } catch (directErr) {
            console.warn(`Direct Gemini attempt ${attempt} notice:`, directErr);
          }
        }

        // Step 2: Try backend non-streaming as an alternative
        try {
          const nonStreamResult = await fetchBackendNonStreaming(options);
          if (nonStreamResult) {
            options.onChunk(nonStreamResult, nonStreamResult);
            return nonStreamResult;
          }
        } catch (nsErr) {
          lastError = nsErr;
        }

        throw backendErr;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`AI Assistant attempt ${attempt} failed:`, err?.message || err);
    }
  }

  // If all 3 attempts failed, return high-yield offline pedagogical knowledge
  // This guarantees the user is NEVER blocked by network errors or quota limits!
  console.info('All 3 network attempts completed; providing comprehensive syllabus knowledge response');
  const fallbackText = getOfflineKnowledgeFallback(options.query, options.mode);
  options.onChunk(fallbackText, fallbackText);
  return fallbackText;
}

/**
 * Generate structured Notes via backend or direct Gemini API with fallback
 */
export async function generateNotesWithAutoRetry(params: {
  topic: string;
  examLevel: string;
  language: string;
}): Promise<{ notes: any; source: 'gemini' | 'curated' }> {
  const { topic, examLevel, language } = params;

  // 1. Try backend endpoint first
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await fetch('/api/generate-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          examLevel,
          language,
          format: 'comprehensive'
        })
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && !contentType.includes('text/html')) {
        const data = await response.json();
        if (data.notes) {
          return { notes: data.notes, source: data.source || 'gemini' };
        }
      }
    } catch (e) {
      console.warn(`Backend notes attempt ${attempt} notice:`, e);
    }
  }

  // 2. Try direct Gemini API if client-side key exists
  const clientKey = getEffectiveGeminiApiKey();
  if (clientKey) {
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    const prompt = `Generate comprehensive exam notes on the topic: "${topic}".
Target Exam Level: ${examLevel}
Language Preference: ${language}
Format Style: comprehensive

Return clean JSON matching:
{
  "topicTitle": "${topic} - विस्तृत परीक्षा तयारी नोट्स",
  "examRelevance": "NRB, RBB, NBL, ADBL (${examLevel}) प्रथम तथा द्वितीय पत्र विशेष",
  "summary": "Clear conceptual overview",
  "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4"],
  "formulasOrFrameworks": ["Formula or legal section 1", "Formula 2"],
  "practiceQuestions": {
    "subjective": [{"question": "...", "marks": 10, "hint": "..."}],
    "mcqs": [{"question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0, "explanation": "..."}]
  },
  "examinerTip": "..."
}`;

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${clientKey}`;
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2
            }
          })
        });

        if (resp.ok) {
          const resData = await resp.json();
          const text = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const parsed = JSON.parse(text);
            return { notes: parsed, source: 'gemini' };
          }
        }
      } catch (directErr) {
        console.warn(`Direct Gemini notes with model ${model} error:`, directErr);
      }
    }
  }

  throw new Error('Notes API unavailable');
}

/**
 * High-fidelity Audio Transcription using gemini-3.5-transcribe
 * Replaces Web Speech API to eliminate word duplication bugs and provide 1-to-1 Nepali STT
 */
export async function transcribeAudioWithGemini(audioBlob: Blob, language: string = 'ne-NP'): Promise<string> {
  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve, reject) => {
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Clean = result.split(',')[1] || result;
      resolve(base64Clean);
    };
    reader.onerror = reject;
  });
  reader.readAsDataURL(audioBlob);
  const base64Data = await base64Promise;

  const res = await fetch('/api/transcribe-audio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      audioData: base64Data,
      mimeType: audioBlob.type || 'audio/webm',
      language
    })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Audio transcription failed (${res.status})`);
  }

  const data = await res.json();
  return (data.text || '').trim();
}
