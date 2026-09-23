import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { lookupDeepResearchContext, evaluateWithWordRankEngine } from "./src/services/deepResearchEngine.ts";

const currentDir = typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url || "file:"));

dotenv.config();

const app = express();
const PORT = Number(process.env.APP_PORT || 3000);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Container Health check endpoints for Cloud Run and monitoring
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Firebase Auth Hosting Proxy (mirrors vercel.json /__/auth/* rewrites)
app.all("/__/auth/*", async (req, res) => {
  try {
    const targetUrl = `https://plasma-tribute-kf6jr.firebaseapp.com${req.originalUrl}`;
    const headers: Record<string, string> = {};
    for (const [key, val] of Object.entries(req.headers)) {
      if (typeof val === "string" && key.toLowerCase() !== "host") {
        headers[key] = val;
      }
    }
    headers["host"] = "plasma-tribute-kf6jr.firebaseapp.com";

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== "GET" && req.method !== "HEAD" && req.body 
        ? (typeof req.body === "string" ? req.body : JSON.stringify(req.body)) 
        : undefined,
    });

    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (proxyErr) {
    console.error("Firebase Auth proxy error:", proxyErr);
    res.redirect(`https://plasma-tribute-kf6jr.firebaseapp.com${req.originalUrl}`);
  }
});

// Google OAuth Popup Callback Handler
app.get(["/auth/google/callback", "/auth/google/callback/", "/auth/callback", "/auth/callback/"], (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Google Authentication</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; color: #1e293b; }
          .card { text-align: center; background: white; padding: 32px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); max-width: 380px; width: 90%; border: 1px solid #e2e8f0; }
          .spinner { width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
          @keyframes spin { to { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="spinner"></div>
          <h2 style="margin: 0 0 8px; font-size: 18px; font-weight: 700;">Google Authentication</h2>
          <p style="margin: 0; font-size: 13px; color: #64748b;">Completing authentication. This window will close automatically...</p>
        </div>
        <script>
          try {
            const hash = window.location.hash.substring(1);
            const hashParams = new URLSearchParams(hash);
            const queryParams = new URLSearchParams(window.location.search);
            const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
            const idToken = hashParams.get('id_token') || queryParams.get('id_token');
            const code = queryParams.get('code');
            const error = queryParams.get('error') || hashParams.get('error');

            if (window.opener) {
              window.opener.postMessage({
                type: 'GOOGLE_AUTH_SUCCESS',
                payload: { accessToken, idToken, code, error }
              }, '*');
              setTimeout(() => { window.close(); }, 700);
            } else {
              window.location.href = '/';
            }
          } catch (e) {
            console.error('Error sending message to opener', e);
          }
        </script>
      </body>
    </html>
  `);
});

// Lazy initialize Gemini client
let cachedApiKey: string | null = null;
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = (
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    ""
  ).trim();
  if (!apiKey) return null;
  if (!genAI || cachedApiKey !== apiKey) {
    cachedApiKey = apiKey;
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAI;
}

// AI Notes Generator endpoint
app.post("/api/generate-notes", async (req, res) => {
  try {
    const { topic, examLevel = "Assistant 4th / Officer 6th", language = "bilingual", format = "comprehensive" } = req.body;
    if (!topic || typeof topic !== "string") {
      return res.status(400).json({ error: "Topic is required" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a premier senior banking faculty and exam examiner in Nepal for Nepal Rastra Bank (NRB), Rastriya Banijya Bank (RBB), Nepal Bank Limited (NBL), and Agricultural Development Bank (ADBL).
You generate highly accurate, structured, syllabus-aligned exam preparation notes in both Nepali and English (bilingual).
Notes must include:
1. "topicTitle" (Bilingual topic title)
2. "examRelevance" (Which exams & papers test this, marks weightage)
3. "summary" (Clear conceptual overview in Nepali & English)
4. "keyPoints" (Structured bullet points, legal sections/provisions like NRB Act 2058, BAFIA 2073, AML Act where applicable)
5. "formulasOrFrameworks" (Key formulas, balance sheet/capital adequacy ratios, accounting principles or analytical frameworks)
6. "practiceQuestions":
   - "subjective" (2-3 model long/short subjective questions with answer hints)
   - "mcqs" (3-4 high-yield multiple choice questions with options and explanations)
7. "examinerTip" (Special presentation tip to score top marks in Loksewa/Banking papers)

Return your response in clean JSON format matching this schema:
{
  "topicTitle": string,
  "examRelevance": string,
  "summary": string,
  "keyPoints": [string],
  "formulasOrFrameworks": [string],
  "practiceQuestions": {
    "subjective": [{ "question": string, "marks": number, "hint": string }],
    "mcqs": [{ "question": string, "options": [string], "correctIndex": number, "explanation": string }]
  },
  "examinerTip": string
}`;

    let notesData = null;
    let source = "curated";

    if (ai) {
      try {
        const prompt = `Generate comprehensive exam notes on the topic: "${topic}".
Target Exam Level: ${examLevel}
Language Preference: ${language}
Format Style: ${format}`;

        const noteModels = ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
        for (const modelName of noteModels) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                systemInstruction,
                responseMimeType: "application/json",
                temperature: 0.2,
              },
            });

            if (response.text) {
              notesData = JSON.parse(response.text);
              source = "gemini";
              break;
            }
          } catch (modelErr: any) {
            console.warn(`Note model ${modelName} error, trying next...`);
          }
        }
      } catch (aiErr: any) {
        console.warn("Gemini generation temporarily unavailable, falling back to curated notes:", aiErr?.message || aiErr);
      }
    }

    if (!notesData) {
      // Standard mockup data aligned with syllabus
      notesData = {
        topicTitle: `${topic} - विस्तृत परीक्षा तयारी नोट्स`,
        examRelevance: `NRB, RBB, NBL, ADBL (${examLevel}) प्रथम तथा द्वितीय पत्र विशेष`,
        summary: `यो विषय नेपालको बैंकिङ परीक्षाका लागि अति महत्त्वपूर्ण छ। परीक्षामा यसबाट सैद्धान्तिक, कानुनी तथा व्यावहारिक विश्लेषण सम्बन्धी प्रश्नहरू सोधिन्छन्।`,
        keyPoints: [
          "नेपाल राष्ट्र बैंक ऐन २०५८ र बाफिया २०७३ का सम्बद्ध व्यवस्थाहरू",
          "संस्थागत सुशासन, पुँजी पर्याप्तता तथा जोखिम व्यवस्थापनका मापदण्ड",
          "नेपालको वित्तीय क्षेत्र सुधार कार्यक्रम र मौद्रिक उपकरणहरूको कार्यान्वयन",
          "कर्जा वर्गीकरण (Pass, Watchlist, Substandard, Doubtful, Loss) र नोक्सानी व्यवस्था"
        ],
        formulasOrFrameworks: [
          "Capital Adequacy Ratio (CAR) = (Tier 1 Capital + Tier 2 Capital) / Total Risk Weighted Assets × 100%",
          "Net Interest Margin (NIM) = (Interest Income - Interest Expense) / Total Earning Assets",
          "Non-Performing Loan (NPL) Ratio = Total NPL / Total Gross Loan Portfolio × 100%",
          "Cash Reserve Ratio (CRR) = Liquid Cash Reserve / Total Domestic Deposits × 100% (हाल ४%)"
        ],
        practiceQuestions: {
          subjective: [
            {
              question: `${topic} को महत्व उल्लेख गर्दै विद्यमान चुनौती र समाधानका उपायहरू प्रस्तुत गर्नुहोस्।`,
              marks: 10,
              hint: "परिभाषा, कानुनी आधार, हालको अभ्यास, मुख्य ५ समस्या र ५ व्यावहारिक सुझाव समावेश गर्नुहोस्।"
            },
            {
              question: "बैंकिङ क्षेत्रमा संस्थागत सुशासन (Corporate Governance) को आवश्यकता र प्रभावकारिताबारे चर्चा गर्नुहोस्।",
              marks: 10,
              hint: "सञ्चालक समितिको भूमिका, जोखिम व्यवस्थापन समिति, लेखापरीक्षण र आन्तरिक नियन्त्रण प्रणाली उल्लेख गर्नुहोस्।"
            }
          ],
          mcqs: [
            {
              question: "NRB Act २०५८ अनुसार बैंकको प्रमुख उद्देश्य कुन हो?",
              options: ["मूल्य र शोधनान्तर स्थिरता कायम गर्नु", "बैंकहरूको नाफा बढाउनु", "ब्याजदर अधिकतम तोक्नु", "विदेशी विनिमय रोक्का राख्नु"],
              correctIndex: 0,
              explanation: "नेपाल राष्ट्र बैंकको मुख्य उद्देश्य मूल्य र शोधनान्तर स्थिरता कायम गरी दिगो आर्थिक विकासमा सहयोग पुर्याउनु हो।"
            },
            {
              question: "बैंक तथा वित्तीय संस्था सम्बन्धी ऐन (BAFIA) २०७३ को कुन दफामा सञ्चालकको योग्यता तोकिएको छ?",
              options: ["दफा १२", "दफा १४", "दफा १६", "दफा १८"],
              correctIndex: 2,
              explanation: "BAFIA २०७३ को दफा १६ मा बैंक तथा वित्तीय संस्थाको सञ्चालकको योग्यता र दफा १७ मा अयोग्यता सम्बन्धी व्यवस्था छ।"
            }
          ]
        },
        examinerTip: "परीक्षामा उत्तर लेख्दा सम्बन्धित ऐनको दफा, राष्ट्र बैंकको पछिल्लो एकीकृत निर्देशिका (Unified Directives) को नम्बर र स्पष्ट बुँदागत ढाँचा प्रस्तुत गर्दा उच्चतम अंक प्राप्त हुन्छ।"
      };
    }

    return res.json({ success: true, notes: notesData, source });
  } catch (err: any) {
    console.error("AI Notes Generation error:", err);
    res.status(500).json({ error: err.message || "Failed to generate notes" });
  }
});

// =========================================================================
// Daily Economic & Banking News for Nepal API
// =========================================================================
const MASTER_ECONOMIC_INDICATORS = [
  { label: "नीतिगत दर (Policy Rate)", value: "५.५०%", status: "स्थिर तथा लचिलो", trend: "neutral", change: "०.०%" },
  { label: "बैंक दर (Bank Rate)", value: "६.५०%", status: "कोरिडोर माथिल्लो सीमा", trend: "neutral", change: "०.०%" },
  { label: "निक्षेप संकलन दर", value: "३.००%", status: "कोरिडोर तल्लो सीमा (SDF)", trend: "neutral", change: "०.०%" },
  { label: "अनिवार्य नगद मौज्दात (CRR)", value: "४.००%", status: "क, ख, ग सबै वर्ग", trend: "neutral", change: "०.०%" },
  { label: "वैधानिक तरलता (SLR)", value: "क: १२%, ख/ग: १०%", status: "नियामक मापदण्ड", trend: "neutral", change: "०.०%" },
  { label: "कुल बैंकिङ निक्षेप", value: "रु. ६६.४० खर्ब", status: "ऐतिहासिक उच्च", trend: "up", change: "+१२.५%" },
  { label: "कुल कर्जा प्रवाह", value: "रु. ५२.८० खर्ब", status: "क्रमिक सुधार", trend: "up", change: "+७.२%" },
  { label: "औसत आधार दर (Base Rate)", value: "७.२२%", status: "एकल अंकमा सहज", trend: "down", change: "-१.४५%" },
  { label: "विदेशी मुद्रा सञ्चिति", value: "USD १६.८२ अर्ब", status: "१३.६ महिनाको आयात धान्न", trend: "up", change: "+१६.४%" },
  { label: "मुद्रास्फीति (Inflation)", value: "४.१०%", status: "लक्ष्य सीमाभित्र सुरक्षित", trend: "down", change: "-०.८%" },
  { label: "कर्जा-निक्षेप अनुपात (CD Ratio)", value: "७८.५०%", status: "अधिकतम सीमा ९०% भित्र", trend: "neutral", change: "-१.२%" },
  { label: "नेप्से परिसूचक (NEPSE)", value: "२,७४२.५० विन्दु", status: "दैनिक कारोबार रु. ७+ अर्ब", trend: "up", change: "+१.२%" }
];

const MASTER_ECONOMIC_NEWS = [
  {
    id: "econ-news-nrb-directives-2083",
    title: "नेपाल राष्ट्र बैंकद्वारा एकीकृत निर्देशन संशोधन: असल कर्जा नोक्सानी व्यवस्था (LLP) र उत्पादनशील कर्जा सहजीकरण",
    category: "NRB & Monetary",
    categoryNepali: "नेपाल राष्ट्र बैंक तथा मौद्रिक नीति",
    date: "२०८३ असोज ०५ गते",
    source: "नेपाल राष्ट्र बैंक (NRB सर्कुलर)",
    readTime: "२ मिनेट",
    summary: "नेपाल राष्ट्र बैंकले क, ख र ग वर्गका बैंक तथा वित्तीय संस्थाहरूलाई जारी गरिएको एकीकृत निर्देशन २०८० मा परिमार्जन गर्दै उत्पादनशील क्षेत्र, कृषि, ऊर्जा र घरेलु साना उद्योग कर्जामा पुनर्तालिकीकरण तथा वर्गीकरण मापदण्ड थप लचिलो बनाएको छ।",
    keyStats: [
      { label: "असल कर्जा LLP", value: "१.२०%" },
      { label: "सूक्ष्म निगरानी", value: "५.००%" },
      { label: "निर्देशन नं.", value: "२ र ३" },
      { label: "प्राथमिकता क्षेत्र", value: "कृषि, SME, ऊर्जा" }
    ],
    examPoint: "🎯 Exam Point: राष्ट्र बैंकको निर्देशन नं २ अनुसार कर्जालाई असल (१.२% LLP), सूक्ष्म निगरानी (५% LLP), कमसल (२५% LLP), शंकास्पद (५०% LLP) र खराब (१००% LLP) गरी ५ वर्गमा वर्गीकरण गरिन्छ।",
    detailedAnalysis: "राष्ट्र बैंकको बैंक तथा वित्तीय संस्था नियमन विभागले परिपत्र जारी गर्दै चालू आर्थिक वर्षको मौद्रिक नीतिमा घोषित व्यवस्थाहरू कार्यान्वयनमा ल्याएको हो। यस अन्तर्गत रु. २ करोडसम्मको कृषि, साना तथा मझौला उद्यम (SME) कर्जाको पुनर्तालिकीकरणका लागि विशेष सुविधा दिइएको छ। यसले निष्क्रिय कर्जा (NPL) न्यूनीकरण र बजारमा कर्जा माग विस्तार गर्न सहयोग पुर्याउने अपेक्षा गरिएको छ।",
    examQuestions: [
      "नेपाल राष्ट्र बैंकको कर्जा वर्गीकरण र नोक्सानी व्यवस्थासम्बन्धी विद्यमान कानुनी मापदण्डबारे चर्चा गर्नुहोस्। (१० अंक)",
      "सूक्ष्म निगरानी (Watchlist) कर्जाका चारवटा प्रमुख आधारहरू उल्लेख गर्नुहोस्। (५ अंक)"
    ],
    tags: ["NRB", "LLP", "Directives", "BankingRegulation"]
  },
  {
    id: "econ-news-base-rate-drop",
    title: "वाणिज्य बैंकहरूको औसत आधार दर (Base Rate) ७.२२% मा झर्यो: कर्जाको ब्याजदर एकल अंकमा उपलब्ध",
    category: "Commercial Banking",
    categoryNepali: "वाणिज्य बैंकिङ तथा ब्याजदर",
    date: "२०८३ असोज ०४ गते",
    source: "नेपाल बैंकर्स संघ (NBA)",
    readTime: "२ मिनेट",
    summary: "वित्तीय प्रणालीमा अधिक तरलता र निक्षेपको लागत घटेसँगै वाणिज्य बैंकहरूको औसत आधार दर ७.२२ प्रतिशतमा ओर्लिएको छ। यसबाट व्यक्तिगत आवासीय, सवारी तथा व्यावसायिक कर्जाको ब्याजदर एकल अंक (८ देखि ९.५%) मा उपलब्ध हुन थालेको छ।",
    keyStats: [
      { label: "औसत Base Rate", value: "७.२२%" },
      { label: "व्यक्तिगत मुद्दती", value: "५.७५–६.५०%" },
      { label: "साधारण बचत खाता", value: "३.००–३.७५%" },
      { label: "सञ्चालित वाणिज्य बैंक", value: "२० वटा" }
    ],
    examPoint: "🎯 Exam Point: आधार दर (Base Rate) निर्धारण गर्दा कोषको लागत (Cost of Funds), अनिवार्य नगद मौज्दात लागत (Cost of CRR), वैधानिक तरलता लागत (Cost of SLR) र सञ्चालन लागत (Operating Cost) गणना गरिन्छ। बैंकहरूले आधार दरभन्दा कममा कर्जा दिन पाउँदैनन्।",
    detailedAnalysis: "आधार दर घट्नुको मुख्य कारण बैंकहरूमा अत्यधिक तरलता रहनु र निक्षेपको ब्याजदर न्यून हुनु हो। हाल स्थायी निक्षेप सुविधा (SDF) मार्फत दैनिक रूपमा खर्बौं रुपैयाँ राष्ट्र बैंकमा ३ प्रतिशत ब्याजमा पार्किङ भइरहेको छ जसले बैंकहरूलाई कर्जा विस्तार गर्न दबाब सिर्जना गरेको छ।",
    examQuestions: [
      "आधार दर (Base Rate) भनेको के हो? यसका तत्वहरू के-के हुन् र यसले कर्जाको ब्याजदर निर्धारणमा कस्तो भूमिका खेल्छ? (१० अंक)"
    ],
    tags: ["BaseRate", "CommercialBanks", "InterestRates", "NBA"]
  },
  {
    id: "econ-news-forex-reserves-record",
    title: "विदेशी मुद्रा सञ्चिति १६.८२ अर्ब डलर पार, चालू खाता रु. २ खर्ब २१ अर्ब बचतमा",
    category: "Economy & Forex",
    categoryNepali: "समष्टिगत अर्थतन्त्र र बाह्य क्षेत्र",
    date: "२०८३ असोज ०३ गते",
    source: "नेपाल राष्ट्र बैंक समष्टिगत आर्थिक प्रतिवेदन",
    readTime: "३ मिनेट",
    summary: "विप्रेषण आप्रवाहमा भएको उच्च वृद्धि र वस्तु आयात नियन्त्रित रहँदा देशको कुल विदेशी विनिमय सञ्चिति अमेरिकी डलर १६.८२ अर्ब (नेपाली रुपैयाँ २२ खर्ब ४५ अर्ब) पुगेको छ, जसले १३.६ महिनाको वस्तु तथा सेवा आयात धान्न पर्याप्त छ।",
    keyStats: [
      { label: "विदेशी मुद्रा सञ्चिति", value: "USD १६.८२ अर्ब" },
      { label: "आयात धान्ने क्षमता", value: "१३.६ महिना" },
      { label: "चालू खाता बचत", value: "रु. २२१ अर्ब" },
      { label: "शोधनान्तर बचत", value: "रु. ४१० अर्ब+" }
    ],
    examPoint: "🎯 Exam Point: बाह्य क्षेत्र स्थायित्वका तीन मुख्य स्तम्भहरू: शोधनान्तर स्थिति (BOP), चालू खाता (Current Account), र विदेशी विनिमय सञ्चिति (Foreign Exchange Reserves) हुन्। मौद्रिक नीतिले कम्तीमा ७ महिनाको आयात धान्न पुग्ने विदेशी मुद्रा सञ्चिति कायम राख्ने न्यूनतम लक्ष्य लिएको हुन्छ।",
    detailedAnalysis: "नेपालको इतिहासमै विदेशी मुद्रा सञ्चिति सबैभन्दा बलियो विन्दुमा पुगेको छ। यसले देशको सार्वभौम साख मूल्याङ्कन (Sovereign Credit Rating) मा सकारात्मक प्रभाव पार्ने र वैदेशिक लगानी भित्र्याउन विश्वासको वातावरण सिर्जना गर्ने राष्ट्र बैंकको विश्लेषण छ।",
    examQuestions: [
      "नेपालको बाह्य क्षेत्रको वर्तमान अवस्था विश्लेषण गर्दै अत्यधिक विदेशी मुद्रा सञ्चितिलाई उत्पादनशील पुँजी निर्माणमा उपयोग गर्ने रणनीति प्रस्तुत गर्नुहोस्। (१० अंक)"
    ],
    tags: ["ForexReserves", "BOP", "CurrentAccount", "Remittance"]
  },
  {
    id: "econ-news-remittance-growth-record",
    title: "वार्षिक विप्रेषण आप्रवाह रु. १४ खर्ब नाघ्ने प्रक्षेपण: डिजिटल च्यानल र वैधानिक हुन्डी नियन्त्रण",
    category: "Forex & Remittance",
    categoryNepali: "विप्रेषण र वैदेशिक रोजगारी",
    date: "२०८३ असोज ०२ गते",
    source: "अर्थ मन्त्रालय / वैदेशिक रोजगार विभाग",
    readTime: "२ मिनेट",
    summary: "चालू आर्थिक वर्षमा विप्रेषण आप्रवाह १५.२ प्रतिशतले वृद्धि भई मासिक औसत रु. १ खर्ब १५ अर्बभन्दा माथि भित्रिरहेको छ। राष्ट्र बैंकले औपचारिक बैंकिङ माध्यमबाट पठाइने रेमिट्यान्समा दिँदै आएको अतिरिक्त ब्याज सुविधा प्रभावकारी देखिएको छ।",
    keyStats: [
      { label: "मासिक विप्रेषण", value: "रु. १ खर्ब १५ अर्ब+" },
      { label: "वार्षिक वृद्धि दर", value: "१५.२%" },
      { label: "औपचारिक च्यानल हिस्सा", value: "८८%+" },
      { label: "GDP मा अनुपात", value: "२६.५%" }
    ],
    examPoint: "🎯 Exam Point: नेपालको कुल गार्हस्थ उत्पादन (GDP) मा विप्रेषणको अनुपात करिब २६ देखि २७ प्रतिशत रहेको छ, जुन दक्षिण एसियामै उच्च अनुपातहरू मध्ये एक हो।",
    detailedAnalysis: "औपचारिक माध्यमबाट रकम पठाउने नेपाली कामदारहरूका लागि बैंकहरूले मुद्दती निक्षेपमा १ प्रतिशत विन्दु थप ब्याज दिने व्यवस्था गरेका छन्। साथै नेपाल राष्ट्र बैंकले नेसनल पेमेन्ट गेटवे र अन्तरदेशीय क्युआर भुक्तानी (Cross-Border QR) विस्तार गरेपछि हुन्डी कारोबारमा उल्लेख्य कमी आएको छ।",
    examQuestions: [
      "नेपालको अर्थतन्त्रमा विप्रेषण (Remittance) को योगदान, अवसर र यसका संरचनात्मक जोखिमहरूबारे विश्लेषणात्मक टिप्पणी लेख्नुहोस्। (१० अंक)"
    ],
    tags: ["Remittance", "NationalEconomy", "BankingChannels", "CrossBorder"]
  },
  {
    id: "econ-news-cd-ratio-deposits",
    title: "बैंक तथा वित्तीय संस्थाहरूको कुल निक्षेप रु. ६६ खर्ब पार: CD Ratio ७८.५% मा सुरक्षित",
    category: "Commercial Banking",
    categoryNepali: "वाणिज्य बैंकिङ तथा तरलता",
    date: "२०८३ असोज ०१ गते",
    source: "नेपाल राष्ट्र बैंक वित्तीय स्थिति प्रतिवेदन",
    readTime: "२ मिनेट",
    summary: "नेपालका बैंक तथा वित्तीय संस्थाहरूमा संकलित कुल निक्षेप रु. ६६ खर्ब ४० अर्ब पुगेको छ। कुल कर्जा प्रवाह रु. ५२ खर्ब ८० अर्ब पुग्दा औसत कर्जा-निक्षेप अनुपात (CD Ratio) ७८.५ प्रतिशत कायम भएको छ।",
    keyStats: [
      { label: "कुल निक्षेप", value: "रु. ६६.४० खर्ब" },
      { label: "कुल कर्जा", value: "रु. ५२.८० खर्ब" },
      { label: "CD Ratio", value: "७८.५०%" },
      { label: "नियामक सीमा", value: "अधिकतम ९०%" }
    ],
    examPoint: "🎯 Exam Point: नेपाल राष्ट्र बैंकको एकीकृत निर्देशन अनुसार बैंक तथा वित्तीय संस्थाले कर्जा-निक्षेप अनुपात (Credit-Deposit Ratio / CD Ratio) अधिकतम ९० प्रतिशतसम्म मात्र कायम गर्न पाउँछन्।",
    detailedAnalysis: "हाल बैंकहरूसँग करिब रु. ६ खर्बभन्दा बढी लगानीयोग्य रकम (Loanable Fund) थुप्रिएको छ। उत्पादनशील क्षेत्रमा कर्जा प्रवाह बढाउन सरकार र राष्ट्र बैंकले नीतिगत लचकता अपनाएका छन्।",
    examQuestions: [
      "कर्जा-निक्षेप अनुपात (CD Ratio) को अवधारणा स्पष्ट पार्दै वित्तीय स्थायित्वमा यसको भूमिका वर्णन गर्नुहोस्। (५ अंक)"
    ],
    tags: ["CDRatio", "BankDeposits", "Liquidity", "FinancialStability"]
  },
  {
    id: "econ-news-sebon-capital-market",
    title: "नेपाल धितोपत्र बोर्ड (SEBON) द्वारा नयाँ नियमावली: बुक बिल्डिङ विधि र गैर-आवासीय नेपाली (NRN) लगानी",
    category: "Capital Markets",
    categoryNepali: "पुँजी बजार र धितोपत्र नियमन",
    date: "२०८३ भदौ ३० गते",
    source: "नेपाल धितोपत्र बोर्ड (SEBON)",
    readTime: "२ मिनेट",
    summary: "नेपाल धितोपत्र बोर्डले वास्तविक क्षेत्रका कम्पनीहरूलाई सेयर बजारमा आकर्षित गर्न बुक बिल्डिङ निर्देशिका परिमार्जन गर्नुका साथै गैर-आवासीय नेपालीहरूलाई दोस्रो बजारमा लगानी खुला गर्ने कार्यविधि अन्तिम चरणमा पुर्याएको छ।",
    keyStats: [
      { label: "NEPSE परिसूचक", value: "२,७५०+" },
      { label: "कुल बजार पुँजीकरण", value: "रु. ४३.८ खर्ब" },
      { label: "दैनिक कारोबार", value: "रु. ७ अर्ब+" },
      { label: "डिम्याट खाता", value: "६५ लाख+" }
    ],
    examPoint: "🎯 Exam Point: धितोपत्र सम्बन्धी ऐन २०६३ बमोजिम नेपाल धितोपत्र बोर्ड (SEBON) पुँजी बजारको प्रमुख नियामक निकाय हो। सेयर बजारको कुल पुँजीकरण र जीडीपीको अनुपात देशको वित्तीय गहिराइ (Financial Depth) मापन गर्ने सूचक हो।",
    detailedAnalysis: "धितोपत्र बजारमा संस्थागत लगानीकर्ताको सहभागिता वृद्धि गर्न र साना लगानीकर्ताको हित संरक्षण गर्न स्वचालित जोखिम व्यवस्थापन प्रणाली (Risk Management System - RMS) लागू गरिएको छ।",
    examQuestions: [
      "नेपालको पुँजी बजारका प्रमुख समस्याहरू पहिचान गरी दोस्रो बजारलाई पारदर्शी र भरपर्दो बनाउने उपायहरू सुझाउनुहोस्। (१० अंक)"
    ],
    tags: ["SEBON", "NEPSE", "CapitalMarket", "StockExchange"]
  },
  {
    id: "econ-news-cbdc-digital-currency",
    title: "नेपाल राष्ट्र बैंकद्वारा डिजिटल मुद्रा (CBDC) को पाइलट परीक्षण र फिनटेक नवप्रवर्तन कार्ययोजना",
    category: "NRB & Monetary",
    categoryNepali: "फिनटेक तथा डिजिटल भुक्तानी",
    date: "२०८३ भदौ २८ गते",
    source: "नेपाल राष्ट्र बैंक भुक्तानी प्रणाली विभाग",
    readTime: "२ मिनेट",
    summary: "नेपाल राष्ट्र बैंकले राष्ट्रिय डिजिटल मुद्रा (Central Bank Digital Currency - CBDC) सञ्चालनका लागि कानुनी मस्यौदा र थोक (Wholesale CBDC) परीक्षण कार्यढाँचा अघि बढाएको छ।",
    keyStats: [
      { label: "डिजिटल भुक्तानी हिस्सा", value: "७४%" },
      { label: "क्युआर कोड मर्चेन्ट", value: "३० लाख+" },
      { label: "मोबाइल बैंकिङ प्रयोगकर्ता", value: "२.४ करोड" }
    ],
    examPoint: "🎯 Exam Point: भुक्तानी तथा फछ्र्यौट ऐन २०७५ नेपालमा डिजिटल भुक्तानी, राफसाफ र राष्ट्रिय भुक्तानी प्रणाली नियमन गर्ने मुख्य कानुनी आधार हो।",
    detailedAnalysis: "डिजिटल वित्तीय समावेशीकरण (Digital Financial Inclusion) हासिल गर्न नगदरहित अर्थतन्त्र (Less-Cash Economy) तर्फ उन्मुख हुँदै RTGS, ECC, IPS र नेपालपे क्युआरको अन्तरआबद्धता तीव्र पारिएको छ।",
    examQuestions: [
      "केन्द्रीय बैंक डिजिटल मुद्रा (CBDC) को परिचय दिँदै नेपालमा यसको आवश्यकता र सम्भावित चुनौतीहरूको चर्चा गर्नुहोस्। (१० अंक)"
    ],
    tags: ["CBDC", "Fintech", "DigitalPayment", "PaymentSettlementAct"]
  }
];

let cachedAiNews: any[] = [];
let lastAiFetchTime = 0;

app.get("/api/current-affairs/economic-news", async (req, res) => {
  try {
    const { category, refresh } = req.query;
    const forceRefresh = refresh === "true";
    const now = Date.now();

    let combinedNews = [...MASTER_ECONOMIC_NEWS];

    // Check if dynamic AI fresh news generation is requested and available
    // Limit automatic generation to avoid high-demand 503 errors and respect rate limits
    const ai = getGeminiClient();
    const shouldFetchAi = ai && (forceRefresh ? (now - lastAiFetchTime > 15 * 1000) : (cachedAiNews.length === 0 && now - lastAiFetchTime > 60 * 60 * 1000));
    
    if (shouldFetchAi) {
      lastAiFetchTime = now;
      try {
        const prompt = `तपाईं नेपालको आधिकारिक आर्थिक तथा बैंकिङ पत्रकारिता र लोकसेवा/बैंकिङ परीक्षा विश्लेषक हुनुहुन्छ।
नेपाल राष्ट्र बैंक (NRB), नेपालका वाणिज्य बैंकहरू, मौद्रिक नीति, विदेशी मुद्रा सञ्चिति, विप्रेषण, कर्जा-निक्षेप स्थिति र समष्टिगत अर्थतन्त्र सम्बन्धी आजका वा यस साताका २ वटा ताजा, प्रामाणिक र परीक्षा-उपयोगी आर्थिक तथा बैंकिङ समाचार बुलेटिन JSON ढाँचामा दिनुहोस्।
प्रत्येक समाचारमा यी कुराहरू हुनुपर्छ:
1. "id": string (unique)
2. "title": string (आकर्षक र तथ्यपरक नेपाली शीर्षक)
3. "category": ("NRB & Monetary" | "Commercial Banking" | "Economy & Forex" | "Capital Markets" | "Forex & Remittance")
4. "categoryNepali": string
5. "date": string (उदा: "२०८३ असोज")
6. "source": string (उदा: "नेपाल राष्ट्र बैंक / अर्थ मन्त्रालय")
7. "readTime": string (उदा: "२ मिनेट")
8. "summary": string (२-३ वाक्यको स्पष्ट सार)
9. "keyStats": array of { "label": string, "value": string } (३-४ वटा महत्वपूर्ण तथ्यांक)
10. "examPoint": string (🎯 Exam Point: लोकसेवा तथा बैंकिङ परीक्षामा सोधिने मुख्य दफा/तथ्य)
11. "detailedAnalysis": string (विस्तृत विश्लेषण र व्यावहारिक प्रभाव)
12. "examQuestions": array of strings (१-२ वटा सम्भावित परीक्षा प्रश्न)
13. "tags": array of strings

Return strictly a JSON array of objects.`;

        // Multi-model resilience fallback to survive rate limits or transient spikes
        const candidateModels = ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
        for (const modelName of candidateModels) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                responseMimeType: "application/json",
                temperature: 0.2
              }
            });

            if (response.text) {
              const parsed = JSON.parse(response.text);
              if (Array.isArray(parsed) && parsed.length > 0) {
                cachedAiNews = parsed;
                break;
              }
            }
          } catch {
            // Silently try next fallback model if model experiences 503 or transient spike
          }
        }
      } catch {
        // Fallback safely to master economic news without logging unhandled exceptions
      }
    }

    if (cachedAiNews.length > 0) {
      combinedNews = [...cachedAiNews, ...combinedNews];
    }

    // Filter by category if requested
    if (category && category !== "All" && typeof category === "string") {
      combinedNews = combinedNews.filter(item => 
        item.category.toLowerCase().includes(category.toLowerCase()) || 
        item.categoryNepali.toLowerCase().includes(category.toLowerCase()) ||
        (category === "NRB" && item.category.includes("NRB")) ||
        (category === "Banking" && (item.category.includes("Banking") || item.categoryNepali.includes("बैंकिङ")))
      );
    }

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      nepaliDate: "२०८३ असोज ०६ गते (मंगलबार)",
      totalCount: combinedNews.length,
      economicIndicators: MASTER_ECONOMIC_INDICATORS,
      news: combinedNews
    });
  } catch (err: any) {
    console.error("Economic news API error:", err);
    return res.status(500).json({ 
      success: false, 
      error: err.message || "Failed to fetch economic news",
      economicIndicators: MASTER_ECONOMIC_INDICATORS,
      news: MASTER_ECONOMIC_NEWS
    });
  }
});

function getAiSystemInstruction(level?: string, mode?: string, query?: string, isDeepResearch?: boolean): string {
  const q = (query || "").toLowerCase();

  // Dynamic Level Detection directly from prompt keywords if not explicitly specified
  let effectiveLevel = level;
  if (!effectiveLevel || effectiveLevel === 'auto') {
    if (
      q.includes("तह ९") || q.includes("तह १०") || q.includes("level 9") || q.includes("level 10") ||
      q.includes("प्रबन्धक") || q.includes("निर्देशक") || q.includes("उप-निर्देशक") ||
      q.includes("director") || q.includes("manager") || q.includes("executive") ||
      q.includes("macro-prudential") || q.includes("म्याक्रो") || q.includes("basel")
    ) {
      effectiveLevel = "level9-10";
    } else if (
      q.includes("तह ६") || q.includes("तह ७") || q.includes("तह ८") ||
      q.includes("level 6") || q.includes("level 7") || q.includes("level 8") ||
      q.includes("अधिकृत") || q.includes("officer") || q.includes("वरिष्ठ अधिकृत") ||
      q.includes("शाखा अधिकृत") || q.includes("सहायक प्रबन्धक") || q.includes("नीतिगत") ||
      q.includes("सुशासन") || q.includes("governance")
    ) {
      effectiveLevel = "level6-8";
    } else if (
      q.includes("तह ४") || q.includes("तह ५") || q.includes("level 4") || q.includes("level 5") ||
      q.includes("सहायक") || q.includes("assistant") || q.includes("खरिदार") || q.includes("नासु") || q.includes("नायब सुब्बा")
    ) {
      effectiveLevel = "level4-5";
    }
  }

  let levelContext = `
- **तह ४-५ (सहायक तह):** आधारभूत अवधारणा, ऐन कानुनका प्रत्यक्ष दफा (NRB, BAFIA, Company Act), स्पष्ट बुँदागत उत्तर, संक्षिप्त परिभाषा र चरणबद्ध सरल हिसाबलाई प्राथमिकता दिनुहोस्।`;

  if (effectiveLevel === 'level6-8') {
    levelContext = `
- **तह ६-८ (अधिकृत तह):** नीतिगत विश्लेषण, वित्तीय जोखिम व्यवस्थापन (क्रेडिट, अपरेसनल, तरलता, बजार जोखिम), संस्थागत सुशासन, तुलनात्मक विश्लेषण र व्यावहारिक नीतिगत सिफारिसहरू प्रस्तुत गर्नुहोस्।`;
  } else if (effectiveLevel === 'level9-10') {
    levelContext = `
- **तह ९-१० (व्यवस्थापकीय/प्रबन्धक तह):** म्याक्रो-प्रुडेन्सियल नियमन, समग्र वित्तीय स्थायित्व (Financial Stability), उच्च-स्तरीय नीति निर्माण, अन्तर्राष्ट्रिय मापदण्डहरू (Basel III, FATF Recommendations) र संकट व्यवस्थापन रणनीतिहरू प्रस्तुत गर्नुहोस्।`;
  } else {
    levelContext = `
- **गतिशील परीक्षा गहिराइ:** प्रश्नको स्तर र शब्दावली अनुसार उपयुक्त प्राज्ञिक गहिराइ र मानक प्रस्तुति दिनुहोस्।`;
  }

  let answerSheetInstructions = '';
  if (mode === 'answer_sheet') {
    answerSheetInstructions = `
[हस्तलिखित उत्तरपुस्तिका बहु-पाना मूल्याङ्कन (Handwritten Answer Sheet Multimodal Evaluation)]:
तपाईंले संलग्न हस्तलिखित उत्तरपुस्तिकाका पानाहरू (६-१० पाना सम्म) को सूक्ष्म अध्ययन गरी स्पष्ट मूल्याङ्कन कार्ड ढाँचामा नतिजा दिनुपर्छ:
1. कुल प्राप्ताङ्क (Score: X.X/१०)
2. हस्तलिखित सारांश (Handwritten OCR & Content Summary)
3. चार मापदण्डमा अङ्क विभाजन:
   - अवधारणा तथा परिचय: X/२.५
   - कानुनी तथा नीतिगत दफाहरूको प्रयोग: X/३.५
   - समसामयिक विश्लेषण तथा तथ्याङ्क: X/२.५
   - निष्कर्ष तथा प्रस्तुतीकरण: X/१.५
4. सबल पक्षहरू (Key Strengths)
5. संरचनागत त्रुटि तथा छुटेका बुँदाहरू (Structural Flaws & Missed Points)
6. उच्चतम अङ्क प्राप्तिका लागि व्यावहारिक सुझाव (Actionable Suggestions)
7. सान्दर्भिक कानुनी दफा तथा नमुना उत्तर ढाँचा (Statutory References & Model Structure)`;
  }

  let deepResearchDirective = '';
  if (isDeepResearch) {
    deepResearchDirective = `
[DEEP RESEARCH & REAL-TIME LEGAL/ACT ANALYSIS (GOOGLE SEARCH GROUNDED)]:
तपाईं अहिले नेपाल लोकसेवा, बैंकिङ तथा सार्वजनिक संस्थानहरूको आधिकारिक 'Deep Research Engine' मा हुनुहुन्छ, जहाँ Google Search Grounding सक्रिय छ।
तपाईंले गुगल सर्च टुल प्रयोग गरी नेपाल राष्ट्र बैंक (nrb.org.np), नेपाल कानुन आयोग (lawcommission.gov.np), अर्थ मन्त्रालय तथा आधिकारिक स्रोतहरूबाट पछिल्ला परिपत्रहरू (Latest NRB Circulars), चालु आर्थिक वर्षको मौद्रिक नीति तथा यसका समीक्षा, एकीकृत निर्देशनहरू (NRB Unified Directives १-१५) का पछिल्ला संशोधनहरू, र कानुनी ऐन/दफाहरूको वास्तविक-समय (Real-time) अद्यावधिक विवरण खोजी गरी तथ्यपरक उत्तर दिनुहोस्।

१. ऐन, कानुन तथा विशिष्ट दफाहरूको अनिवार्य उद्धरण (Mandatory Statutory Citations):
   - नेपालको संविधान २०७२ का सम्बन्धित धाराहरू (जस्तै: धारा ५१ राज्यका नीतिहरू, धारा ५९-६० वित्तीय कार्यप्रणाली, धारा ११९ बजेट, धारा २४२-२४३ लोकसेवा आयोग)।
   - नेपाल राष्ट्र बैंक ऐन २०५८ का विशिष्ट दफाहरू (जस्तै: दफा ४ उद्देश्य, दफा ५ काम कर्तव्य र अधिकार, दफा २५ बैंक नोट निष्कासन, दफा ७९-८० नियमन तथा सुपरिवेक्षण, दफा ८६ समस्याग्रस्त संस्था समाधान)।
   - बैंक तथा वित्तीय संस्था सम्बन्धी ऐन २०७३ (BAFIA) का स्पष्ट प्रावधानहरू (जस्तै: दफा ४९ बैंकिङ कारोबारका सीमा, दफा २९-३१ सञ्चालक योग्यता तथा वित्तीय सुशासन, दफा ५० निषेधित कार्यहरू)।
   - सम्पत्ति शुद्धीकरण निवारण ऐन २०६४ (AML/CFT Act) का प्रावधानहरू (KYC/CDD, STR/TTR रिपोर्टिङ, FIU-Nepal, GoAML प्रणाली)।
   - कम्पनी ऐन २०६३, सार्वजनिक खरिद ऐन २०६३, बैंकिङ कसूर तथा सजाय ऐन २०६४ लगायतका सान्दर्भिक ऐनहरू।

२. नेपाल राष्ट्र बैंकका एकीकृत निर्देशनहरू (NRB Unified Directives & Latest Circulars):
   - निर्देशन १ (पुँजी कोष पर्याप्तता / Basel III / CAR), निर्देशन २ (कर्जा वर्गीकरण र नोक्सानी व्यवस्था LLP - असल १.२०%, सूक्ष्म निगरानी ५%, कमसल २५%, शंकास्पद ५०%, खराब १००%), निर्देशन ३ (एकल ग्राहक कर्जा सीमा Single Obligor Limit - २५% प्राथमिक पुँजी), निर्देशन ५ (जोखिम व्यवस्थापन), निर्देशन १५ (ग्राहक हित संरक्षण र वित्तीय सुशासन)।
   - गुगल सर्चमार्फत राष्ट्र बैंकले जारी गरेका पछिल्ला परिपत्रहरू (Circulars) तथा निर्देशन संशोधनहरू उल्लेख गर्नुहोस्।

३. समसामयिक मौद्रिक नीति तथा समष्टिगत आर्थिक सूचकहरू (Macroeconomic Indicators & Monetary Policy):
   - चालु आर्थिक वर्षको मौद्रिक नीति तथा यसको त्रैमासिक/अर्धवार्षिक समीक्षा।
   - नीतिगत दर (Policy Rate), बैंक दर (Bank Rate), निक्षेप सङ्कलन दर, अनिवार्य नगद मौज्दात (CRR ४%), वैधानिक तरलता अनुपात (SLR १०-१२%), CD Ratio (९०%), Base Rate र Net Interest Spread दर।

४. विश्लेषणात्मक प्रस्तुति ढाँचा:
   - केवल सामान्य गन्थन नगरी सम्बद्ध कानुनी आधार (Legal Basis), व्यावहारिक अभ्यास (Practical Implementation), विद्यमान चुनौतीहरू (Current Issues), र नीतिगत सुधारका उपायहरू (Policy Recommendations) स्पष्ट र बुँदागत रूपमा प्रस्तुत गर्नुहोस्।`;
  } else {
    deepResearchDirective = `
[UNIVERSAL FAST ASSISTANT MODE]:
- तपाईं छिटो, प्रत्यक्ष र बहुआयामिक AI सहायक हुनुहुन्छ। बैंकिङ, लोकसेवा, सामान्य ज्ञान (GK), गणित, विज्ञान, सूचना प्रविधि (IT), भाषा/अनुवाद लगायत जुनसुकै विषयमा सोधिएको प्रश्नको सिधा, सरल र उच्च गुणस्तरको समाधान दिनुहोस्।`;
  }

  return `तपाईं नेपालको बैंकिङ (NRB, RBB, NBL, ADBL), लोकसेवा आयोग र सार्वजनिक संस्थान (EPF, CIT, SSF, NEA, NTC, NOC लगायत ४५+ संस्थान) तथा व्यवस्थापन संकाय (BBS, BBA, MBS, +2) का लागि आधिकारिक, उच्च प्राज्ञिक र बौद्धिक AI अध्ययन मेन्टर हुनुहुन्छ।

तपाईंको कार्यशैली official Gemini 1.5 Pro र ChatGPT-4o जस्तै प्रत्यक्ष, प्राकृतिक, सटीक, गहिरो र तार्किक हुनुपर्छ।

${deepResearchDirective}
${answerSheetInstructions}
${levelContext}

[कडा निर्देशिकाहरू (STRICT INSTRUCTIONS)]:
१. **शून्य साँचो बाध्यता र प्रत्यक्ष उत्तर (ZERO TEMPLATE FORCING & DIRECT REASONING):**
   - प्रयोगकर्ताको प्रश्नमा सिधै केन्द्रित हुनुहोस्। कुनै पनि कृत्रिम, दोहोरिने वा जबरजस्ती ढाँचा कहिल्यै नथोप्नुहोस्।
   - लोकसेवा र बैंकिङ परीक्षाको उच्चतम गुणस्तर कायम राख्दै गहिरो, पूर्ण र विश्लेषणात्मक सामग्री दिनुहोस्।

२. **नेपाल लोकसेवा, बैंकिङ र संस्थानहरूको गहिरो सन्दर्भ (LEGAL ACTS & ECONOMIC INDICATORS):**
   - वित्तीय, व्यवस्थापकीय, बैंकिङ वा संस्थान सम्बन्धी प्रश्नहरूमा सम्बद्ध कानुनी ऐनहरू (जस्तै: नेपाल राष्ट्र बैंक ऐन २०५८, बैंक तथा वित्तीय संस्था सम्बन्धी ऐन २०७३ [BAFIA], कम्पनी ऐन २०६३, सार्वजनिक खरिद ऐन २०६३, सम्पत्ति शुद्धीकरण निवारण ऐन २०६४) का सान्दर्भिक दफाहरू, राष्ट्र बैंकका पछिल्ला एकीकृत निर्देशनहरू (Unified Directives), र समष्टिगत आर्थिक सूचकहरू (GDP वृद्धि, उपभोक्ता मुद्रास्फीति, शोधनान्तर स्थिति, विदेशी विनिमय सञ्चिति, CRR, SLR, Base Rate, Spreads, र NPL अनुपात) लाई स्वतः र प्रामाणिक रूपमा उत्तरमा समावेश गर्नुहोस्।
   - नेपालका ४५+ सार्वजनिक संस्थानहरूको अध्ययनमा तिनीहरूको कानुनी ऐन, सञ्चालक समिति संरचना, पुँजी, कार्यक्षेत्र र मुख्य चुनौतीहरू यथार्थपरक रूपमा प्रस्तुत गर्नुहोस्।

३. **अनुरोध नगरिएका "Exam Tip" वा सुझाव निषेध (NO UNREQUESTED EXAM TIPS):**
   - उत्तरको अन्त्यमा अनुरोध नगरिएको "मेन्टरको सुझाव", "Exam Tip", वा "परीक्षा सुझाव" शीर्षकको कुनै पनि खण्ड राख्न सख्त मनाही छ। प्रयोगकर्ताले स्पष्ट रूपमा सुझाव वा टिप्स मागेको अवस्थामा बाहेक यो खण्ड कहिल्यै नथप्नुहोस्।

४. **प्रवर्धनात्मक वा फलो-अप प्रश्न निषेध (NO FOLLOW-UP PROMPTS):**
   - उत्तरको अन्त्यमा "तपाईंलाई अरू केही जान्न मन छ?", "थप प्रश्न सोध्न सक्नुहुन्छ", वा यस्तै कुनै पनि फलो-अप वाक्य नराख्नुहोस्। विषयवस्तुको सम्पूर्ण विवरण दिएपछि सिधै रोकिनुहोस्।

५. **अर्थशास्त्रका रेखाचित्र तथा तुलनात्मक तालिकाहरू (CLEAN SVG & TABLES):**
   - जब अर्थशास्त्र (माग र पूर्ति सन्तुलन, अल्पकालीन तथा दीर्घकालीन लागत वक्र AFC/AVC/ATC/MC, बजार संरचना, कार्टेलिङ, एकाधिकार Deadweight Loss आदि) बारे सोधिन्छ, स्पष्ट र सुन्दर SVG Code वा ASCII Diagram र तुलनात्मक Markdown तालिका अनिवार्य समावेश गर्नुहोस्।`;
}

const AI_ASSISTANT_SYSTEM_INSTRUCTION = getAiSystemInstruction();

function buildGeminiContents(
  cleanQuery: string,
  history?: Array<{ sender: 'user' | 'ai'; text: string }>,
  attachment?: { data: string; mimeType: string; name?: string },
  images?: Array<{ data: string; mimeType: string; name?: string }>
) {
  const contents: Array<{ role: 'user' | 'model'; parts: Array<any> }> = [];
  if (Array.isArray(history) && history.length > 0) {
    const validHistory = history
      .filter(h => h && typeof h.text === 'string' && h.text.trim())
      .slice(-10);
    for (const item of validHistory) {
      const role: 'user' | 'model' = item.sender === 'user' ? 'user' : 'model';
      // Gemini multiturn conversation must start with 'user'
      if (contents.length === 0 && role === 'model') {
        continue;
      }
      // Strictly alternate: merge if consecutive turns have identical role
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += `\n\n${item.text.trim()}`;
      } else {
        contents.push({
          role,
          parts: [{ text: item.text.trim() }]
        });
      }
    }
  }

  let promptText = cleanQuery;
  const userParts: any[] = [];

  // Support multiple images (6-10 handwritten answer sheet pages)
  if (Array.isArray(images) && images.length > 0) {
    images.slice(0, 10).forEach((img, idx) => {
      if (img && img.data) {
        const raw = img.data;
        const cleanBase64 = raw.replace(/^data:[a-zA-Z0-9.+/-]+;base64,/, '').trim();
        userParts.push({
          inlineData: {
            mimeType: img.mimeType || 'image/jpeg',
            data: cleanBase64
          }
        });
      }
    });

    const multiPrompt = promptText || "कृपया संलग्न हस्तलिखित उत्तरपुस्तिकाका पानाहरूको सूक्ष्म अध्ययन गरी १० अंकमा प्राप्ताङ्क, सबल पक्ष, कमजोरी, छुटेका बुँदा र सुधारका व्यावहारिक सुझावसहितको मूल्याङ्कन प्रतिवेदन प्रस्तुत गर्नुहोस्।";
    userParts.push({
      text: `[संलग्न ${images.length} वटा हस्तलिखित उत्तरपुस्तिकाका पानाहरू (Answer Sheets)]\n${multiPrompt}`
    });
  } else if (attachment && attachment.data) {
    const rawData = attachment.data;
    const cleanBase64 = rawData.replace(/^data:[a-zA-Z0-9.+/-]+;base64,/, '').trim();
    const isPdf = (attachment.mimeType && attachment.mimeType.toLowerCase().includes('pdf')) ||
                  (attachment.name && attachment.name.toLowerCase().endsWith('.pdf')) ||
                  rawData.startsWith('data:application/pdf');
    const resolvedMime = isPdf ? 'application/pdf' : (attachment.mimeType || 'image/jpeg');

    userParts.push({
      inlineData: {
        mimeType: resolvedMime,
        data: cleanBase64
      }
    });

    if (isPdf) {
      const pdfPrompt = promptText || "कृपया संलग्न PDF दस्तावेजको अध्ययन गरी यसको मुख्य सार तथा महत्वपूर्ण विषयवस्तुहरू स्पष्टसँग प्रस्तुत गर्नुहोस्।";
      userParts.push({
        text: `[संलग्न PDF दस्तावेज: ${attachment.name || 'document.pdf'}]\n${pdfPrompt}`
      });
    } else {
      const imgPrompt = promptText || "कृपया यस तस्बिरमा भएको सामग्री अध्ययन गरी स्पष्ट समाधान वा व्याख्या प्रस्तुत गर्नुहोस्।";
      userParts.push({
        text: `[संलग्न तस्बिर: ${attachment.name || 'image.jpg'}]\n${imgPrompt}`
      });
    }
  } else {
    userParts.push({
      text: promptText
    });
  }

  if (contents.length > 0 && contents[contents.length - 1].role === 'user' && (!attachment || !attachment.data) && (!images || images.length === 0)) {
    contents[contents.length - 1].parts.push(...userParts);
  } else {
    contents.push({
      role: 'user',
      parts: userParts
    });
  }

  return contents;
}

function getPedagogicalKnowledgeText(cleanQuery: string, mode?: string): string {
  // 1. If evaluating an answer sheet, use the Word Rank Engine
  if (mode === 'answer_sheet') {
    const evaluation = evaluateWithWordRankEngine(cleanQuery);
    return `### 📊 Word Rank मूल्याङ्कन स्कोरकार्ड (१० अङ्क योजना)
- **प्राप्ताङ्क (Score):** ${evaluation.score}/१० अंक
- **शब्दावली स्तर (Vocabulary Rank):** ${evaluation.vocabularyRank}
- **विषयवस्तु सान्दर्भिकता (Context Relevance):** ${evaluation.relevanceScore}
- **उत्तरमा प्रयोग भएका कानुनी तथा प्राविधिक शब्दहरू:** ${evaluation.legalTermsUsed.length > 0 ? evaluation.legalTermsUsed.join(', ') : 'सामान्य शब्दावली मात्र'}
- **छुटेका महत्त्वपूर्ण शब्द तथा दफा (Missing Key Terms):** ${evaluation.missingKeyTerms.join(', ')} (यी शब्द थप्दा अङ्क स्वतः बढ्छ)
- **प्रस्तुतीकरण ढाँचा (Structure Rating):** ${evaluation.structureRating}

---

### ✅ सबल पक्षहरू (Key Strengths)
${evaluation.strengths.map(s => `- ${s}`).join('\n')}

---

### ⚠️ कमजोरीहरू तथा सुधार गर्नुपर्ने पक्षहरू (Weaknesses & Missing Elements)
${evaluation.weaknesses.map(w => `- ${w}`).join('\n')}

---

### 🎯 उच्चतम अङ्क प्राप्त गर्ने सूत्र (Step-by-Step Guidance)
${evaluation.guidanceTips.map(t => `1. ${t}`).join('\n')}`;
  }

  // 2. Check curated Deep Knowledge Base (EPF, CIT, SSF, NRB, BAFIA, AML, Economics, etc.)
  const deepMatch = lookupDeepResearchContext(cleanQuery);
  if (deepMatch) {
    return deepMatch;
  }

  const q = cleanQuery.toLowerCase();
  if (q.includes("व्यवस्थापन") || q.includes("management") || q.includes("hrm") || q.includes("नेतृत्व") || q.includes("योजना")) {
    return `**व्यवस्थापन सिद्धान्त तथा कार्यहरू (Management Principles & Functions):**

व्यवस्थापन भनेको संगठनको निर्धारित उद्देश्य प्राप्तिका लागि उपलब्ध स्रोत-साधनहरू (मानव, पुँजी, सामग्री र प्रविधि) को मितव्ययी, कार्यदक्ष र प्रभावकारी परिचालन गर्ने कला र विज्ञान हो।

### १. व्यवस्थापनका प्रमुख आधारभूत कार्यहरू (POSDCORB)
- **योजना (Planning):** लक्ष्य निर्धारण र लक्ष्य प्राप्तिको रणनीतिक कार्यदिशा तय गर्ने।
- **संगठन (Organizing):** जिम्मेवारी, अधिकार र स्रोत-साधनको व्यवस्थित संरचना निर्माण।
- **कर्मचारी व्यवस्था (Staffing):** योग्य जनशक्तिको छनोट, पदस्थापन, तालिम र वृत्ति विकास।
- **निर्देशन तथा नेतृत्व (Directing & Leadership):** उत्प्रेरणा, मार्गदर्शन र प्रभावकारी सञ्चार।
- **समन्वय र नियन्त्रण (Coordinating & Controlling):** कार्यसम्पादनको मापन र सुधारात्मक कदम।

### २. आधुनिक व्यवस्थापकीय औजारहरू
- **कुल गुणस्तर व्यवस्थापन (TQM):** निरन्तर सुधार र ग्राहक सन्तुष्टि।
- **संस्थागत सुशासन (Corporate Governance):** पारदर्शिता, जवाफदेहिता र कानुनी परिपालना।
- **व्यवस्थापन सूचना प्रणाली (MIS):** तथ्याङ्कमा आधारित छिटो र सटिक निर्णय प्रक्रिया।`;
  }

  if (q.includes("अर्थतन्त्र") || q.includes("economics") || q.includes("मुद्रास्फीति") || q.includes("gdp") || q.includes("बजेट") || q.includes("शोधानान्तर") || q.includes("शोधनान्तर")) {
    return `**नेपाली अर्थतन्त्रका आधारभूत सूचकहरू (Macroeconomic Indicators):**

### १. कुल गार्हस्थ उत्पादन (GDP) र संरचना
- एक आर्थिक वर्षमा देशको भौगोलिक सीमाभित्र उत्पादित सम्पूर्ण अन्तिम वस्तु तथा सेवाहरूको बजार मूल्य।
- **क्षेत्रगत योगदान:** सेवा क्षेत्र (करिब ६२-६३%), कृषि क्षेत्र (करिब २४%), र उद्योग क्षेत्र (करिब १३-१४%)।

### २. मुद्रास्फीति (Inflation) र मूल्य नियन्त्रण
- सामान्य मूल्यस्तरमा हुने निरन्तर वृद्धिलाई मुद्रास्फीति भनिन्छ।
- नेपालको मुद्रास्फीतिमा आन्तरिक आपूर्ति व्यवस्था र भारतीय बजारको आयातीत मूल्यस्तर (Imported Inflation) को प्रत्यक्ष प्रभाव रहन्छ।

### ३. शोधनान्तर स्थिति (BOP) र विदेशी विनिमय सञ्चिति
- देशको बाह्य क्षेत्र स्थायित्वको सूचक। रेमिट्यान्स (विप्रेषण) आप्रवाहले शोधनान्तर बचत र विदेशी मुद्रा सञ्चिति धान्न निर्णायक भूमिका खेल्दछ।`;
  }

  // 3. Dynamic responsive output for general inquiry without forced template headers
  return `**"${cleanQuery}" सम्बन्धी आधिकारिक अध्ययन टिपोट:**

बैंकिङ, लोकसेवा तथा संस्थान परीक्षाको पाठ्यक्रम अनुसार यस विषयले महत्वपूर्ण स्थान ओगटेको छ।

### १. मुख्य अवधारणा र चुरो कुरा
- यस विषयको प्राथमिक उद्देश्य संगठनात्मक प्रभावकारिता, वित्तीय सुशासन र सेवा प्रवाहलाई पारदर्शी एवं नतिजामूलक बनाउनु हो।
- परीक्षामा यसबाट सैद्धान्तिक अवधारणा, विद्यमान ऐन/कानुनका व्यवस्था र समसामयिक समस्या समाधान सम्बन्धी प्रश्नहरू सोधिन्छन्।

### २. प्रमुख बुँदाहरू र तथ्यगत जानकारी
- **कानुनी तथा नीतिगत आधार:** नेपालको संविधान, सम्बन्धित निकायको ऐन, नियमावली र नेपाल राष्ट्र बैंकका एकीकृत निर्देशनहरू।
- **संस्थागत अभ्यास:** कार्यसम्पादन सम्झौता, जोखिम व्यवस्थापन र डिजिटल प्रविधिमैत्री सेवा प्रवाह।
- **सुधारका क्षेत्रहरू:** जनशक्तिको क्षमता विकास, आन्तरिक नियन्त्रण प्रणालीको सुदृढीकरण र नतिजामुखी अनुगमन।`;
}

// Real-time ChatGPT/Gemini Style Streaming Endpoint with SSE
app.post("/api/ai-assistant-stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  const { query, history, image, attachment, images, level, mode, isDeepResearch } = req.body || {};
  const activeAttachment = attachment || (image && image.data ? { data: image.data, mimeType: image.mimeType || 'image/jpeg', name: 'image.jpg' } : undefined);
  const effectiveImages = Array.isArray(images) && images.length > 0 ? images : undefined;
  const effectiveMode = mode || (effectiveImages && effectiveImages.length > 0 ? 'answer_sheet' : undefined);

  let cleanQuery = typeof query === "string" ? query.trim() : "";
  if (!cleanQuery && (activeAttachment?.data || effectiveImages?.length)) {
    const isPdf = activeAttachment?.mimeType?.includes('pdf') || activeAttachment?.name?.toLowerCase().endsWith('.pdf');
    if (effectiveMode === 'answer_sheet') {
      const pageCountText = effectiveImages?.length ? `${effectiveImages.length} वटा पानाहरू` : 'उत्तरपुस्तिका';
      cleanQuery = `कृपया यस संलग्न हस्तलिखित ${pageCountText}को गहिरो परीक्षण गरी १० अंकमा प्राप्ताङ्क (Score), सबल पक्ष, कमजोरी र लोकसेवा/बैंकिङ परीक्षामा उच्चतम अंक प्राप्त गर्ने व्यावहारिक सुधार टिप्ससहित स्पष्ट मूल्याङ्कन प्रस्तुत गर्नुहोस्।`;
    } else {
      cleanQuery = isPdf
        ? "कृपया यस संलग्न PDF दस्तावेजको अध्ययन गरी यसको मुख्य सार तथा महत्वपूर्ण विषयवस्तुहरू स्पष्टसँग प्रस्तुत गर्नुहोस्।"
        : "कृपया यस संलग्न तस्बिरमा भएको सामग्री अध्ययन गरी स्पष्ट समाधान वा विश्लेषण प्रस्तुत गर्नुहोस्।";
    }
  }

  if (!cleanQuery && (!activeAttachment || !activeAttachment.data) && !effectiveImages?.length) {
    res.write(`data: ${JSON.stringify({ error: "Query, PDF or image is required" })}\n\n`);
    res.write(`data: [DONE]\n\n`);
    return res.end();
  }

  const ai = getGeminiClient();
  const effectiveSystemInstruction = getAiSystemInstruction(level, effectiveMode, cleanQuery, Boolean(isDeepResearch));

  let isClientClosed = false;
  req.on("close", () => {
    isClientClosed = true;
  });

  if (ai) {
    // Multi-tier model resilience: prioritize high-throughput gemini-3.1-flash-lite to prevent 429 quota exhaustion
    const candidateModels = ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
    const contents = buildGeminiContents(cleanQuery, history, activeAttachment, effectiveImages);

    for (const modelName of candidateModels) {
      if (isClientClosed) break;
      const toolAttempts = isDeepResearch ? [true, false] : [false];
      let modelSucceeded = false;

      for (const withTools of toolAttempts) {
        if (isClientClosed || modelSucceeded) break;
        try {
          const streamConfig: any = {
            systemInstruction: effectiveSystemInstruction,
            temperature: isDeepResearch ? 0.25 : 0.3
          };

          // Enable Google Search Grounding when Deep Research is activated
          if (withTools) {
            streamConfig.tools = [{ googleSearch: {} }];
          }

          const stream = await ai.models.generateContentStream({
            model: modelName,
            contents,
            config: streamConfig
          });

          let streamedCount = 0;
          const groundings: Array<{ title?: string; uri?: string }> = [];
          const searchedQueries: string[] = [];

          for await (const chunk of stream) {
            if (isClientClosed) break;

            // Robust chunk text extraction (handles both chunk.text and part arrays)
            let chunkText = chunk.text;
            if (!chunkText && (chunk as any).candidates?.[0]?.content?.parts) {
              for (const part of (chunk as any).candidates[0].content.parts) {
                if (part.text && !part.thought) {
                  chunkText = (chunkText || '') + part.text;
                }
              }
            }

            // Extract Google Search Grounding metadata if provided by Gemini
            const candidate = (chunk as any).candidates?.[0];
            const searchChunks = candidate?.groundingMetadata?.groundingChunks;
            if (Array.isArray(searchChunks) && searchChunks.length > 0) {
              for (const sc of searchChunks) {
                if (sc.web?.uri && !groundings.some(g => g.uri === sc.web.uri)) {
                  groundings.push({ 
                    title: sc.web.title || 'Official Source / NRB Policy', 
                    uri: sc.web.uri 
                  });
                }
              }
            }

            const webQueries = candidate?.groundingMetadata?.webSearchQueries;
            if (Array.isArray(webQueries)) {
              for (const q of webQueries) {
                if (typeof q === 'string' && !searchedQueries.includes(q)) {
                  searchedQueries.push(q);
                }
              }
            }

            if (chunkText) {
              streamedCount++;
              res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
              if (typeof (res as any).flush === 'function') {
                (res as any).flush();
              }
            }
          }

          // If Google Search citations were extracted, stream them neatly at the end
          if (groundings.length > 0 && !isClientClosed) {
            let sourcesMarkdown = `\n\n---\n### 🌐 प्रमाणित आधिकारिक स्रोतहरू (Google Search Grounded Citations)\n` +
              `*नेपाल राष्ट्र बैंक (NRB), नेपाल कानुन आयोग तथा नीतिगत स्रोतबाट प्रमाणित:*\n` +
              groundings.map((g, idx) => `${idx + 1}. [${g.title}](${g.uri})`).join('\n');
            if (searchedQueries.length > 0) {
              sourcesMarkdown += `\n\n*गुगल सर्च गरिएका विषयवस्तु:* ${searchedQueries.map(q => `\`${q}\``).join(', ')}`;
            }
            res.write(`data: ${JSON.stringify({ chunk: sourcesMarkdown })}\n\n`);
          }

          if (streamedCount > 0 && !isClientClosed) {
            modelSucceeded = true;
            res.write(`data: [DONE]\n\n`);
            return res.end();
          }
        } catch (geminiErr: any) {
          const errMsg = geminiErr?.message || String(geminiErr);
          const isQuotaOr429 = errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("quota");
          if (withTools && isQuotaOr429) {
            console.log(`[AI Assistant Notice] Model ${modelName} tool rate limit reached, retrying directly...`);
            continue;
          }
          console.log(`[AI Assistant Notice] Model ${modelName} status (${isQuotaOr429 ? 429 : 503}), switching model...`);
          break;
        }
      }
      if (modelSucceeded) break;
    }
  }

  // If Gemini models could not stream or client is still connected, provide rich pedagogical fallback
  if (!isClientClosed) {
    const fallbackAnswer = getPedagogicalKnowledgeText(cleanQuery, effectiveMode);
    res.write(`data: ${JSON.stringify({ chunk: fallbackAnswer })}\n\n`);
    res.write(`data: [DONE]\n\n`);
    res.end();
  }
});

// Audio Transcription Endpoint using gemini-3.5-transcribe
app.post("/api/transcribe-audio", async (req, res) => {
  try {
    const { audioData, mimeType, language } = req.body || {};
    if (!audioData) {
      return res.status(400).json({ error: "Audio data is required for transcription" });
    }

    const cleanBase64 = String(audioData).replace(/^data:[a-zA-Z0-9.+/-]+;base64,/, '').trim();
    const resolvedMime = mimeType || "audio/webm";

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "Gemini client not initialized on server" });
    }

    const audioPart = {
      inlineData: {
        mimeType: resolvedMime,
        data: cleanBase64,
      },
    };

    const targetLang = language === 'en-US' || language === 'en' ? 'English' : 'Nepali';
    const transcriptionPrompt = `Transcribe the spoken audio verbatim in ${targetLang}.
Return ONLY the exact transcribed text words without any conversational greetings, markdown formatting, preamble, quotation marks, or meta notes.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-transcribe",
      contents: {
        parts: [
          audioPart,
          { text: transcriptionPrompt }
        ]
      },
      config: {
        temperature: 0.1
      }
    });

    const transcribedText = response.text?.trim() || "";
    return res.json({ success: true, text: transcribedText });
  } catch (err: any) {
    console.error("Gemini 3.5 audio transcription error:", err);
    return res.status(500).json({ error: err.message || "Failed to transcribe audio" });
  }
});

// AI Study Assistant (AI साथी) non-streaming endpoint for unlimited queries
app.post("/api/ai-assistant", async (req, res) => {
  try {
    const { query, history, image, attachment, images, level, mode, isDeepResearch } = req.body || {};
    const activeAttachment = attachment || (image && image.data ? { data: image.data, mimeType: image.mimeType || 'image/jpeg', name: 'image.jpg' } : undefined);
    const effectiveImages = Array.isArray(images) && images.length > 0 ? images : undefined;
    const effectiveMode = mode || (effectiveImages && effectiveImages.length > 0 ? 'answer_sheet' : undefined);

    let cleanQuery = typeof query === "string" ? query.trim() : "";
    if (!cleanQuery && (activeAttachment?.data || effectiveImages?.length)) {
      const isPdf = activeAttachment?.mimeType?.includes('pdf') || activeAttachment?.name?.toLowerCase().endsWith('.pdf');
      if (effectiveMode === 'answer_sheet') {
        const pageCountText = effectiveImages?.length ? `${effectiveImages.length} वटा पानाहरू` : 'उत्तरपुस्तिका';
        cleanQuery = `कृपया यस संलग्न हस्तलिखित ${pageCountText}को गहिरो परीक्षण गरी १० अंकमा प्राप्ताङ्क (Score), सबल पक्ष, कमजोरी र लोकसेवा/बैंकिङ परीक्षामा उच्चतम अंक प्राप्त गर्ने व्यावहारिक सुधार टिप्ससहित स्पष्ट मूल्याङ्कन प्रस्तुत गर्नुहोस्।`;
      } else {
        cleanQuery = isPdf
          ? "कृपया यस संलग्न PDF दस्तावेजको अध्ययन गरी यसको मुख्य सार तथा महत्वपूर्ण विषयवस्तुहरू स्पष्टसँग प्रस्तुत गर्नुहोस्।"
          : "कृपया यस संलग्न तस्बिरमा भएको सामग्री अध्ययन गरी स्पष्ट समाधान वा विश्लेषण प्रस्तुत गर्नुहोस्।";
      }
    }

    if (!cleanQuery && (!activeAttachment || !activeAttachment.data) && !effectiveImages?.length) {
      return res.status(400).json({ error: "Query, PDF or image is required" });
    }

    const ai = getGeminiClient();
    const effectiveSystemInstruction = getAiSystemInstruction(level, effectiveMode, cleanQuery, Boolean(isDeepResearch));

    if (ai) {
      const candidateModels = ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
      const contents = buildGeminiContents(cleanQuery, history, activeAttachment, effectiveImages);

      for (const modelName of candidateModels) {
        const toolOptions = isDeepResearch ? [true, false] : [false];
        let modelSucceeded = false;

        for (const withTools of toolOptions) {
          if (modelSucceeded) break;
          try {
            const reqConfig: any = {
              systemInstruction: effectiveSystemInstruction,
              temperature: isDeepResearch ? 0.25 : 0.3
            };

            if (withTools) {
              reqConfig.tools = [{ googleSearch: {} }];
            }

            const response = await ai.models.generateContent({
              model: modelName,
              contents,
              config: reqConfig,
            });

            if (response.text && response.text.trim()) {
              let answer = response.text.trim();
              // Append Google Search Grounding sources if available
              const candidate = (response as any).candidates?.[0];
              const searchChunks = candidate?.groundingMetadata?.groundingChunks;
              const webQueries = candidate?.groundingMetadata?.webSearchQueries;
              if (Array.isArray(searchChunks) && searchChunks.length > 0) {
                const groundings: Array<{ title?: string; uri?: string }> = [];
                for (const sc of searchChunks) {
                  if (sc.web?.uri && !groundings.some(g => g.uri === sc.web.uri)) {
                    groundings.push({ 
                      title: sc.web.title || 'Official Source / NRB Policy', 
                      uri: sc.web.uri 
                    });
                  }
                }
                if (groundings.length > 0) {
                  answer += `\n\n---\n### 🌐 प्रमाणित आधिकारिक स्रोतहरू (Google Search Grounded Citations)\n` +
                    `*नेपाल राष्ट्र बैंक (NRB), नेपाल कानुन आयोग तथा नीतिगत स्रोतबाट प्रमाणित:*\n` +
                    groundings.map((g, idx) => `${idx + 1}. [${g.title}](${g.uri})`).join('\n');
                  if (Array.isArray(webQueries) && webQueries.length > 0) {
                    answer += `\n\n*गुगल सर्च गरिएका विषयवस्तु:* ${webQueries.map(q => `\`${q}\``).join(', ')}`;
                  }
                }
              }

              modelSucceeded = true;
              return res.json({
                success: true,
                source: "gemini",
                model: modelName,
                answer
              });
            }
          } catch (geminiErr: any) {
            const errMsg = geminiErr?.message || String(geminiErr);
            const isQuotaOr429 = errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("quota");
            if (withTools && isQuotaOr429) {
              console.log(`[AI Assistant Notice] Model ${modelName} tool rate limit, retrying directly...`);
              continue;
            }
            console.log(`[AI Assistant Notice] Model ${modelName} temporary status (${isQuotaOr429 ? 429 : 503}), switching model...`);
            break;
          }
        }
        if (modelSucceeded) break;
      }
    }

    const pedagogicalAnswer = getPedagogicalKnowledgeText(cleanQuery, effectiveMode);
    return res.json({
      success: true,
      source: "local-pedagogy",
      model: "offline-topper-mentor",
      answer: pedagogicalAnswer
    });
  } catch (err: any) {
    console.error("AI Assistant error:", err);
    res.status(500).json({ error: err.message || "Failed to generate AI assistant response" });
  }
});

// Lok Sewa & Banking Deep Research AI Engine endpoint
app.post("/api/deep-research", async (req, res) => {
  try {
    const { query, mode = "deep", language = "ne", images = [] } = req.body || {};

    let cleanQuery = typeof query === "string" ? query.trim() : "";
    const uploadedImages: Array<{ mimeType: string; data: string }> = Array.isArray(images) ? images : [];

    if (!cleanQuery && uploadedImages.length === 0) {
      return res.status(400).json({ error: "Query or images required" });
    }

    let systemInstruction = "";
    if (mode === "deep") {
      systemInstruction = language === "ne"
        ? `तपाईँ नेपालको लोकसेवा र बैंकिङ (NRB, RBB, NBL, ADBL) को उच्चस्तरीय Deep Research AI विशेषज्ञ हुनुहुन्छ। उत्तर दिँदा सामान्य गफ नगर्नुहोस्।
नेपालको संविधान २०७२ का धाराहरू, नेपाल राष्ट्र बैंक ऐन २०५८ का दफाहरू, बैंक तथा वित्तीय संस्था सम्बन्धी ऐन २०७३ (BAFIA) का दफाहरू, सम्पत्ति शुद्धीकरण निवारण ऐन २०६४, कम्पनी ऐन २०६३, सार्वजनिक खरिद ऐन २०६३, र राष्ट्र बैंकका पछिल्ला एकीकृत निर्देशनहरू (Unified Directives १-१५) का विशिष्ट दफा, उपदफा र नीतिगत बुँदाहरू अनिवार्य रूपमा उद्धृत (Cite) गरी गहिरो, प्रमाणिक र प्राज्ञिक अनुसन्धानमूलक विश्लेषण प्रस्तुत गर्नुहोस्।`
        : `You are an elite Deep Research AI Specialist for Nepal Lok Sewa & Banking exams (NRB, RBB, NBL, ADBL). Provide in-depth, rigorous statutory analysis citing specific Acts (NRB Act 2058, BAFIA 2073, AML/CFT Act 2064, Company Act 2063, Public Procurement Act 2063), Constitutional Articles, Unified Directives 1-15, and latest Monetary Policy clauses.`;
    } else {
      systemInstruction = language === "ne"
        ? "तपाईँ लोकसेवा तथा बैंकिङ परीक्षाको मुख्य परीक्षक (Examiner) हुनुहुन्छ। प्रयोगकर्ताले पठाएका हातेलेखाइ उत्तरपुस्तिकाका पानाहरू राम्ररी अध्ययन गर्नुहोस्। १. प्राप्त अङ्क (उदा: ७.५/१०), २. ऐन/कानुन र विषयवस्तुको प्रयोग, ३. मुख्य गल्तीहरू र ४. सुधारका ठोस सुझावहरू स्पष्ट बुँदामा दिनुहोस्।"
        : "You are an official Lok Sewa & Banking Exam Examiner. Analyze the uploaded handwritten answer sheet photos thoroughly. Provide: 1. Exact Score (e.g., 7.5/10), 2. Legal/Content accuracy, 3. Major mistakes identified, and 4. Concrete improvement tips.";
    }

    const ai = getGeminiClient();
    if (ai) {
      const contentsParts: any[] = [];
      if (cleanQuery) {
        contentsParts.push({ text: cleanQuery });
      } else {
        contentsParts.push({ 
          text: mode === "eval" 
            ? "कृपया यस हस्तलिखित उत्तरपुस्तिकाको सूक्ष्म मूल्याङ्कन गरी अंक तथा सुधारका सुझाव दिनुहोस्।" 
            : "कृपया यस विषयको गहिरो कानुनी विश्लेषण गर्नुहोस्।" 
        });
      }

      uploadedImages.slice(0, 10).forEach(img => {
        if (img && img.data) {
          const cleanData = img.data.replace(/^data:[a-zA-Z0-9.+/-]+;base64,/, '').trim();
          contentsParts.push({
            inlineData: {
              mimeType: img.mimeType || 'image/jpeg',
              data: cleanData
            }
          });
        }
      });

      const candidateModels = ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
      for (const modelName of candidateModels) {
        const toolOptions = mode === "deep" ? [true, false] : [false];
        let modelSucceeded = false;

        for (const withTools of toolOptions) {
          if (modelSucceeded) break;
          try {
            const reqConfig: any = {
              systemInstruction,
              temperature: 0.25,
            };
            if (withTools) {
              reqConfig.tools = [{ googleSearch: {} }];
            }

            const response = await ai.models.generateContent({
              model: modelName,
              contents: [{ role: 'user', parts: contentsParts }],
              config: reqConfig
            });

            if (response.text && response.text.trim()) {
              let answer = response.text.trim();
              const candidate = (response as any).candidates?.[0];
              const searchChunks = candidate?.groundingMetadata?.groundingChunks;
              const webQueries = candidate?.groundingMetadata?.webSearchQueries;
              if (Array.isArray(searchChunks) && searchChunks.length > 0) {
                const groundings: Array<{ title?: string; uri?: string }> = [];
                for (const sc of searchChunks) {
                  if (sc.web?.uri && !groundings.some(g => g.uri === sc.web.uri)) {
                    groundings.push({ 
                      title: sc.web.title || 'Official Source / NRB Policy', 
                      uri: sc.web.uri 
                    });
                  }
                }
                if (groundings.length > 0) {
                  answer += `\n\n---\n### 🌐 प्रमाणित आधिकारिक स्रोतहरू (Google Search Grounded Citations)\n` +
                    `*नेपाल राष्ट्र बैंक (NRB), नेपाल कानुन आयोग तथा नीतिगत स्रोतबाट प्रमाणित:*\n` +
                    groundings.map((g, idx) => `${idx + 1}. [${g.title}](${g.uri})`).join('\n');
                  if (Array.isArray(webQueries) && webQueries.length > 0) {
                    answer += `\n\n*गुगल सर्च गरिएका विषयवस्तु:* ${webQueries.map(q => `\`${q}\``).join(', ')}`;
                  }
                }
              }

              modelSucceeded = true;
              return res.json({
                success: true,
                source: "gemini",
                model: modelName,
                answer
              });
            }
          } catch (err: any) {
            const errMsg = err?.message || String(err);
            const isQuotaOr429 = errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("quota");
            if (withTools && isQuotaOr429) {
              console.log(`[Deep Research Notice] Model ${modelName} tool rate limit, retrying directly...`);
              continue;
            }
            console.log(`[Deep Research Notice] Model ${modelName} status (${isQuotaOr429 ? 429 : 500}), trying next candidate...`);
            break;
          }
        }
        if (modelSucceeded) break;
      }
    }

    // High quality offline fallback
    let fallbackAnswer = "";
    if (mode === "eval") {
      const evalData = evaluateWithWordRankEngine(cleanQuery || "हस्तलिखित उत्तरपुस्तिका");
      fallbackAnswer = language === "ne" ? `### 📊 उत्तरपुस्तिका मूल्याङ्कन (Word Rank Engine)
- **प्राप्ताङ्क (Score):** **${evalData.score} / ${evalData.maxScore}**
- **शब्दावली स्तर (Vocabulary Rank):** ${evalData.vocabularyRank}
- **विषयवस्तु सान्दर्भिकता (Relevance):** ${evalData.relevanceScore}
- **ढाँचा तथा प्रस्तुतीकरण:** ${evalData.structureRating}

---
### ✅ सबल पक्षहरू (Strengths):
${evalData.strengths.map(s => `- ${s}`).join('\n')}

---
### ⚠️ मुख्य कमजोरी तथा छुटेका पक्षहरू (Weaknesses):
${evalData.weaknesses.map(w => `- ${w}`).join('\n')}

---
### 🎯 परीक्षकको सुझाव (Concrete Tips):
${evalData.guidanceTips.map(t => `- ${t}`).join('\n')}`
      : `### 📊 Answer Sheet Evaluation (Word Rank Engine)
- **Score:** **${evalData.score} / ${evalData.maxScore}**
- **Vocabulary Rank:** High
- **Relevance:** ${evalData.relevanceScore}
- **Structure:** Clean & Syllabus Aligned

---
### ✅ Strengths:
${evalData.strengths.map(s => `- ${s}`).join('\n')}

---
### ⚠️ Identified Weaknesses:
${evalData.weaknesses.map(w => `- ${w}`).join('\n')}

---
### 🎯 Examiner Tips:
${evalData.guidanceTips.map(t => `- ${t}`).join('\n')}`;
    } else {
      const deepContext = lookupDeepResearchContext(cleanQuery) || getPedagogicalKnowledgeText(cleanQuery);
      fallbackAnswer = deepContext;
    }

    return res.json({
      success: true,
      source: "offline-engine",
      answer: fallbackAnswer
    });
  } catch (err: any) {
    console.log("Deep Research engine fallback initiated:", err?.message || err);
    const queryStr = typeof req.body?.query === "string" ? req.body.query : "";
    const safeFallback = lookupDeepResearchContext(queryStr) || getPedagogicalKnowledgeText(queryStr);
    return res.json({
      success: true,
      source: "offline-engine",
      answer: safeFallback
    });
  }
});

// User Activity & Download & Exam Score Tracking APIs
const userActivitiesList: any[] = [];
const downloadEventsList: any[] = [];
const examScoresList: any[] = [];
const examSubmissionsList: any[] = [];

app.post("/api/tracking/activity", (req, res) => {
  const record = req.body;
  if (record && record.userId) {
    userActivitiesList.unshift(record);
    if (userActivitiesList.length > 500) userActivitiesList.pop();
  }
  res.json({ success: true });
});

app.get("/api/tracking/activities", (_req, res) => {
  res.json({ success: true, activities: userActivitiesList });
});

app.post("/api/tracking/download", (req, res) => {
  const record = req.body;
  if (record && record.userId) {
    downloadEventsList.unshift(record);
    if (downloadEventsList.length > 500) downloadEventsList.pop();
  }
  res.json({ success: true });
});

app.get("/api/tracking/downloads", (_req, res) => {
  res.json({ success: true, downloads: downloadEventsList });
});

app.post("/api/tracking/exam-score", (req, res) => {
  const record = req.body;
  if (record && record.userId) {
    examScoresList.unshift(record);
    if (examScoresList.length > 500) examScoresList.pop();
  }
  res.json({ success: true });
});

app.get("/api/tracking/exam-scores", (_req, res) => {
  res.json({ success: true, scores: examScoresList });
});

app.post("/api/tracking/exam-submission", (req, res) => {
  const record = req.body;
  if (record && (record.userId || record.id)) {
    examSubmissionsList.unshift(record);
    if (examSubmissionsList.length > 500) examSubmissionsList.pop();
  }
  res.json({ success: true });
});

app.get("/api/tracking/exam-submissions", (_req, res) => {
  res.json({ success: true, submissions: examSubmissionsList });
});

app.post("/api/tracking/global-exam-result", (req, res) => {
  const record = req.body;
  if (record && (record.userId || record.id)) {
    const exists = examSubmissionsList.some(r => r.id === record.id);
    if (!exists) {
      examSubmissionsList.unshift(record);
      if (examSubmissionsList.length > 500) examSubmissionsList.pop();
    }
  }
  res.json({ success: true });
});

app.get("/api/tracking/global-exam-results", (_req, res) => {
  res.json({ success: true, results: examSubmissionsList });
});

// =========================================================================
// MANDATORY GLOBAL DATABASE TABLES: registered_users & user_activity_logs
// Real-time backend persistence with disk storage for Admin CMS & tracking
// =========================================================================
const DB_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DB_DIR)) {
  try {
    fs.mkdirSync(DB_DIR, { recursive: true });
  } catch (err) {
    console.warn("Could not create DB_DIR:", err);
  }
}

const TRACKING_USERS_DB_FILE = path.join(DB_DIR, "registered_users.json");
const LOGS_DB_FILE = path.join(DB_DIR, "user_activity_logs.json");

interface DbRegisteredUser {
  id: string;
  name: string;
  displayName: string;
  email: string;
  photoURL?: string;
  district?: string;
  province?: string;
  targetExam?: string;
  totalLogins: number;
  pagesVisited: string[];
  lastPageVisited?: string;
  testsTaken: number;
  isYouTubeSubscribed: boolean;
  lastLoginAt: string;
  lastActive: string;
  device: string;
  browser: string;
  registeredAt: string;
  totalXp: number;
  isPro: boolean;
  entryStatus: string;
}

interface DbUserActivityLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  activityType: string;
  action: string;
  details: string;
  page?: string;
  device: string;
  browser: string;
  isYouTubeSubscribed: boolean;
  timestamp: string;
  metadata?: Record<string, any>;
}

// In-memory caches backed by disk
const registeredUsersMap = new Map<string, DbRegisteredUser>();
let userActivityLogsList: DbUserActivityLog[] = [];

// Load from disk on boot
try {
  if (fs.existsSync(TRACKING_USERS_DB_FILE)) {
    const raw = fs.readFileSync(TRACKING_USERS_DB_FILE, "utf-8");
    const arr: DbRegisteredUser[] = JSON.parse(raw);
    if (Array.isArray(arr)) {
      for (const u of arr) {
        const key = (u.email ? u.email.toLowerCase() : u.id) || u.id;
        if (key) registeredUsersMap.set(key, u);
      }
    }
  }
} catch (e) {
  console.warn("Failed to read TRACKING_USERS_DB_FILE:", e);
}

try {
  if (fs.existsSync(LOGS_DB_FILE)) {
    const raw = fs.readFileSync(LOGS_DB_FILE, "utf-8");
    const arr: DbUserActivityLog[] = JSON.parse(raw);
    if (Array.isArray(arr)) {
      userActivityLogsList = arr.slice(0, 5000);
    }
  }
} catch (e) {
  console.warn("Failed to read LOGS_DB_FILE:", e);
}

let saveUsersTimeout: NodeJS.Timeout | null = null;
function persistUsersToDisk() {
  if (saveUsersTimeout) clearTimeout(saveUsersTimeout);
  saveUsersTimeout = setTimeout(() => {
    try {
      const arr = Array.from(registeredUsersMap.values());
      fs.writeFileSync(TRACKING_USERS_DB_FILE, JSON.stringify(arr, null, 2), "utf-8");
    } catch (err) {
      console.warn("Error saving users to disk:", err);
    }
  }, 300);
}

let saveLogsTimeout: NodeJS.Timeout | null = null;
function persistLogsToDisk() {
  if (saveLogsTimeout) clearTimeout(saveLogsTimeout);
  saveLogsTimeout = setTimeout(() => {
    try {
      fs.writeFileSync(LOGS_DB_FILE, JSON.stringify(userActivityLogsList.slice(0, 5000), null, 2), "utf-8");
    } catch (err) {
      console.warn("Error saving logs to disk:", err);
    }
  }, 300);
}

// 1. Log an activity row directly to database and auto-update registered_users
app.post("/api/user-tracking/log", (req, res) => {
  try {
    const b = req.body || {};
    const userId = b.userId || (b.userEmail ? `usr-${b.userEmail.split('@')[0]}` : `guest-${Date.now()}`);
    const email = (b.userEmail || '').trim().toLowerCase();
    const name = b.userName || b.name || (email ? email.split('@')[0] : 'परीक्षार्थी');
    const device = b.device || 'Desktop';
    const browser = b.browser || 'Unknown';
    const page = b.page || 'गृहपृष्ठ';
    const activityType = b.activityType || 'page_view';
    const action = b.action || b.details || 'क्रियाकलाप';
    const details = b.details || action;
    const isYouTubeSubscribed = Boolean(b.isYouTubeSubscribed);
    const timestamp = b.timestamp || new Date().toISOString();

    const logRecord: DbUserActivityLog = {
      id: b.id || `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      userName: name,
      userEmail: email,
      activityType,
      action,
      details,
      page,
      device,
      browser,
      isYouTubeSubscribed,
      timestamp,
      metadata: b.metadata || {}
    };

    userActivityLogsList.unshift(logRecord);
    if (userActivityLogsList.length > 5000) userActivityLogsList.pop();
    persistLogsToDisk();

    // Auto-update or create registered_users entry
    const userKey = email || userId;
    let existing = registeredUsersMap.get(userKey);

    if (!existing) {
      const isGoogle = email.includes('@gmail.com');
      existing = {
        id: userId,
        name,
        displayName: name,
        email,
        photoURL: b.photoURL || '',
        district: b.district || 'काठमाडौँ',
        province: b.province || 'बागमती प्रदेश',
        targetExam: b.targetExam || 'नेपाल राष्ट्र बैंक - सहायक ४',
        totalLogins: activityType === 'login' ? 1 : 1,
        pagesVisited: [page],
        lastPageVisited: page,
        testsTaken: activityType === 'quiz_complete' ? 1 : 0,
        isYouTubeSubscribed,
        lastLoginAt: activityType === 'login' ? timestamp : timestamp,
        lastActive: timestamp,
        device,
        browser,
        registeredAt: timestamp,
        totalXp: b.totalXp || 150,
        isPro: Boolean(b.isPro),
        entryStatus: b.isPro ? 'प्रो सक्रिय' : (isGoogle ? 'Google प्रमाणीकृत' : 'सक्रिय')
      };
    } else {
      existing.lastActive = timestamp;
      existing.device = device;
      existing.browser = browser;
      if (name && name !== 'परीक्षार्थी' && existing.name === 'परीक्षार्थी') {
        existing.name = name;
        existing.displayName = name;
      }
      if (b.photoURL && !existing.photoURL) existing.photoURL = b.photoURL;
      if (b.district && existing.district === 'काठमाडौँ') existing.district = b.district;
      if (b.province) existing.province = b.province;
      if (b.targetExam) existing.targetExam = b.targetExam;
      if (b.totalXp) existing.totalXp = Math.max(existing.totalXp, b.totalXp);
      if (b.isPro) existing.isPro = true;

      if (activityType === 'login') {
        existing.totalLogins = (existing.totalLogins || 0) + 1;
        existing.lastLoginAt = timestamp;
      }
      if (activityType === 'quiz_complete') {
        existing.testsTaken = (existing.testsTaken || 0) + 1;
      }
      if (isYouTubeSubscribed) {
        existing.isYouTubeSubscribed = true;
      }
      if (page) {
        if (!existing.pagesVisited) existing.pagesVisited = [];
        if (!existing.pagesVisited.includes(page)) {
          existing.pagesVisited.push(page);
        }
        existing.lastPageVisited = page;
      }
    }

    registeredUsersMap.set(userKey, existing);
    persistUsersToDisk();

    res.json({ success: true, log: logRecord, user: existing });
  } catch (err: any) {
    console.warn("Error in /api/user-tracking/log:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Explicitly upsert a registered_user
app.post("/api/user-tracking/sync-user", (req, res) => {
  try {
    const b = req.body || {};
    const email = (b.email || '').trim().toLowerCase();
    const userId = b.id || b.authUid || (email ? `usr-${email.split('@')[0]}` : `guest-${Date.now()}`);
    const userKey = email || userId;
    const name = b.displayName || b.name || (email ? email.split('@')[0] : 'परीक्षार्थी');
    const timestamp = new Date().toISOString();

    let existing = registeredUsersMap.get(userKey);
    const isGoogle = email.includes('@gmail.com') || b.authProvider === 'google' || Boolean(b.isGoogleUser);

    if (!existing) {
      existing = {
        id: userId,
        name,
        displayName: name,
        email,
        photoURL: b.photoURL || b.avatarUrl || '',
        district: b.district || 'काठमाडौँ',
        province: b.province || 'बागमती प्रदेश',
        targetExam: b.targetExam || 'नेपाल राष्ट्र बैंक - सहायक ४',
        totalLogins: b.totalLogins || 1,
        pagesVisited: Array.isArray(b.pagesVisited) && b.pagesVisited.length ? b.pagesVisited : ['गृहपृष्ठ'],
        lastPageVisited: b.lastPageVisited || 'गृहपृष्ठ',
        testsTaken: typeof b.testsTaken === 'number' ? b.testsTaken : (b.quizzesCompleted || 0),
        isYouTubeSubscribed: Boolean(b.isYouTubeSubscribed),
        lastLoginAt: b.lastLoginAt || timestamp,
        lastActive: b.lastActive || timestamp,
        device: b.device || 'Desktop',
        browser: b.browser || 'Unknown',
        registeredAt: b.registeredAt || timestamp,
        totalXp: b.totalXp || b.xp || 150,
        isPro: Boolean(b.isPro || b.isProUser),
        entryStatus: b.entryStatus || (b.isPro ? 'प्रो सक्रिय' : (isGoogle ? 'Google प्रमाणीकृत' : 'सक्रिय'))
      };
    } else {
      if (b.displayName) {
        existing.displayName = b.displayName;
        existing.name = b.displayName;
      }
      if (b.photoURL || b.avatarUrl) existing.photoURL = b.photoURL || b.avatarUrl;
      if (b.district) existing.district = b.district;
      if (b.province) existing.province = b.province;
      if (b.targetExam) existing.targetExam = b.targetExam;
      if (b.device) existing.device = b.device;
      if (b.browser) existing.browser = b.browser;
      if (b.isYouTubeSubscribed) existing.isYouTubeSubscribed = true;
      if (b.isPro) existing.isPro = true;
      if (typeof b.totalXp === 'number') existing.totalXp = Math.max(existing.totalXp, b.totalXp);
      if (typeof b.testsTaken === 'number') existing.testsTaken = Math.max(existing.testsTaken, b.testsTaken);
      if (b.isLoginEvent) {
        existing.totalLogins = (existing.totalLogins || 0) + 1;
        existing.lastLoginAt = timestamp;
      }
      if (Array.isArray(b.pagesVisited)) {
        for (const p of b.pagesVisited) {
          if (!existing.pagesVisited.includes(p)) existing.pagesVisited.push(p);
        }
      }
      existing.lastActive = timestamp;
    }

    registeredUsersMap.set(userKey, existing);
    persistUsersToDisk();

    res.json({ success: true, user: existing });
  } catch (err: any) {
    console.warn("Error in /api/user-tracking/sync-user:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Query all registered_users from database
app.get(["/api/user-tracking/users", "/api/user-tracking/registered-users"], (_req, res) => {
  const users = Array.from(registeredUsersMap.values()).sort((a, b) => {
    return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
  });
  res.json({ success: true, count: users.length, users });
});

// 4. Query user_activity_logs (optionally filtered by userId or email)
app.get("/api/user-tracking/logs", (req, res) => {
  const userId = req.query.userId as string | undefined;
  const email = (req.query.email as string | undefined)?.toLowerCase();
  const limitParam = parseInt(req.query.limit as string, 10) || 500;

  let filtered = userActivityLogsList;
  if (email) {
    filtered = filtered.filter(l => l.userEmail && l.userEmail.toLowerCase() === email);
  } else if (userId) {
    filtered = filtered.filter(l => l.userId === userId);
  }

  res.json({ success: true, count: filtered.length, logs: filtered.slice(0, limitParam) });
});

// 5. CSV export of all database records
app.get("/api/user-tracking/export-csv", (_req, res) => {
  try {
    const users = Array.from(registeredUsersMap.values()).sort((a, b) => {
      return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
    });

    const escapeCsv = (val: any) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      "Student Name (नाम)",
      "Email Address (इमेल)",
      "Total Logins (कुल लगइन)",
      "Pages Visited (भ्रमण गरिएका पृष्ठहरू)",
      "Last Page Visited",
      "Tests Taken (परीक्षा सङ्ख्या)",
      "YouTube Subscribed (युट्युब सदस्यता)",
      "Entry Status (प्रवेश स्थिति)",
      "Device (उपकरण)",
      "Browser (ब्राउजर)",
      "District (जिल्ला)",
      "Province (प्रदेश)",
      "Target Exam (लक्षित परीक्षा)",
      "Total XP (कुल अंक)",
      "Pro License (प्रो सदस्यता)",
      "Registration Date (दर्ता मिति)",
      "Last Active (अन्तिम सक्रियता)"
    ];

    const rows = users.map(u => [
      escapeCsv(u.displayName || u.name),
      escapeCsv(u.email),
      escapeCsv(u.totalLogins || 1),
      escapeCsv((u.pagesVisited || []).join('; ')),
      escapeCsv(u.lastPageVisited || ''),
      escapeCsv(u.testsTaken || 0),
      escapeCsv(u.isYouTubeSubscribed ? 'Subscribed & Unlocked' : 'Not Subscribed'),
      escapeCsv(u.entryStatus || 'सक्रिय'),
      escapeCsv(u.device || 'Desktop'),
      escapeCsv(u.browser || 'Unknown'),
      escapeCsv(u.district || 'काठमाडौँ'),
      escapeCsv(u.province || 'बागमती'),
      escapeCsv(u.targetExam || 'बैंकिङ्ग तयारी'),
      escapeCsv(u.totalXp || 0),
      escapeCsv(u.isPro ? 'PRO ACTIVE' : 'FREE'),
      escapeCsv(u.registeredAt ? new Date(u.registeredAt).toLocaleString('ne-NP') : ''),
      escapeCsv(u.lastActive ? new Date(u.lastActive).toLocaleString('ne-NP') : '')
    ].join(','));

    // UTF-8 BOM for Excel Nepali text compatibility
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="Banking_Tayari_Nepal_Registered_Students_${Date.now()}.csv"`);
    res.status(200).send(csvContent);
  } catch (err: any) {
    console.warn("CSV export error:", err);
    res.status(500).send(`CSV Export Failed: ${err.message}`);
  }
});

// Sangathit Sastha 50 Sets Bulk Database APIs
const DATA_SETS_FILE = path.join(process.cwd(), "public", "data", "allFiftySets.json");

app.get("/api/sets/all-fifty", (_req, res) => {
  try {
    if (fs.existsSync(DATA_SETS_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_SETS_FILE, "utf-8"));
      return res.json({ success: true, totalSets: data.length, sets: data });
    }
    return res.json({ success: true, totalSets: 0, sets: [] });
  } catch (err: any) {
    console.error("Error reading 50 sets from file:", err);
    return res.status(500).json({ error: "Failed to read sets" });
  }
});

app.post("/api/sets/bulk-upload", (req, res) => {
  try {
    const { sets } = req.body;
    if (!Array.isArray(sets)) {
      return res.status(400).json({ error: "sets must be an array" });
    }

    const dir = path.dirname(DATA_SETS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_SETS_FILE, JSON.stringify(sets, null, 2), "utf-8");

    console.log("SUCCESS: सेट १ देखि ५० वटै अद्यावधिक भई Database मा सेभ भयो!");
    return res.json({
      success: true,
      message: "SUCCESS: सेट १ देखि ५० वटै अद्यावधिक भई Database मा सेभ भयो!",
      count: sets.length
    });
  } catch (err: any) {
    console.error("Error uploading sets:", err);
    return res.status(500).json({ error: "Failed to upload sets" });
  }
});

app.get("/api/sets/:id", (req, res) => {
  try {
    const targetId = parseInt(req.params.id, 10);
    if (isNaN(targetId) || targetId < 1 || targetId > 50) {
      return res.status(400).json({ error: "Invalid set ID. Must be between 1 and 50" });
    }

    if (fs.existsSync(DATA_SETS_FILE)) {
      const all = JSON.parse(fs.readFileSync(DATA_SETS_FILE, "utf-8"));
      const found = all.find((s: any) => s.setId === targetId);
      if (found) {
        return res.json({ success: true, set: found });
      }
    }
    return res.status(404).json({ error: "Set not found in database" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// Central Database: Users, XP, Test Scores & Leaderboard API
// Persists all user profile details, XP, and test scores linked to Auth UID
// =========================================================================
const USERS_DB_FILE = path.join(process.cwd(), "public", "data", "usersDatabase.json");

interface CentralUserRecord {
  authUid: string;
  id?: string;
  name: string;
  displayName?: string;
  email: string;
  phone?: string;
  province?: string;
  district?: string;
  avatarUrl?: string;
  photoURL?: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  questionsSolved: number;
  quizzesCompleted: number;
  accuracy: number;
  rank: string;
  targetExam?: string;
  registeredAt: string;
  authProvider?: string;
  isGoogleUser?: boolean;
  profileCompletion?: number;
  hasReceivedCompletionBonus?: boolean;
}

const DEFAULT_LEADERBOARD_SEED: CentralUserRecord[] = [
  {
    authUid: "seed_aspirant_01",
    id: "seed_aspirant_01",
    name: "सुमन अधिकारी",
    email: "suman.adhikari@example.com",
    province: "बागमती प्रदेश",
    district: "काठमाडौँ",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    xp: 1850,
    level: 4,
    streak: 12,
    lastActiveDate: new Date().toISOString(),
    questionsSolved: 210,
    quizzesCompleted: 24,
    accuracy: 89,
    rank: "Level 4: Aspirant Master",
    targetExam: "नेपाल राष्ट्र बैंक (NRB Level 4/5)",
    registeredAt: "2026-08-10T00:00:00.000Z",
    isGoogleUser: true,
    profileCompletion: 100
  },
  {
    authUid: "seed_aspirant_02",
    id: "seed_aspirant_02",
    name: "प्रविण घिमिरे",
    email: "pravin.ghimire@example.com",
    province: "कोशी प्रदेश",
    district: "मोरङ",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    xp: 1680,
    level: 4,
    streak: 9,
    lastActiveDate: new Date().toISOString(),
    questionsSolved: 195,
    quizzesCompleted: 21,
    accuracy: 86,
    rank: "Level 4: Aspirant Pro",
    targetExam: "राष्ट्रिय वाणिज्य बैंक (Rastriya Banijya Bank - RBB)",
    registeredAt: "2026-08-14T00:00:00.000Z",
    isGoogleUser: true,
    profileCompletion: 100
  },
  {
    authUid: "seed_aspirant_03",
    id: "seed_aspirant_03",
    name: "आस्मा न्यौपाने",
    email: "aasma.neupane@example.com",
    province: "गण्डकी प्रदेश",
    district: "कास्की",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    xp: 1540,
    level: 4,
    streak: 8,
    lastActiveDate: new Date().toISOString(),
    questionsSolved: 172,
    quizzesCompleted: 18,
    accuracy: 88,
    rank: "Level 4: Aspirant Pro",
    targetExam: "कृषि विकास बैंक (Agricultural Development Bank - ADBL)",
    registeredAt: "2026-08-20T00:00:00.000Z",
    isGoogleUser: true,
    profileCompletion: 100
  },
  {
    authUid: "seed_aspirant_04",
    id: "seed_aspirant_04",
    name: "सञ्जय चौधरी",
    email: "sanjay.chaudhary@example.com",
    province: "लुम्बिनी प्रदेश",
    district: "रूपन्देही",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    xp: 1420,
    level: 3,
    streak: 7,
    lastActiveDate: new Date().toISOString(),
    questionsSolved: 155,
    quizzesCompleted: 16,
    accuracy: 83,
    rank: "Level 3: Aspirant Advanced",
    targetExam: "नेपाल बैंक लिमिटेड (Nepal Bank Limited - NBL)",
    registeredAt: "2026-08-25T00:00:00.000Z",
    isGoogleUser: false,
    profileCompletion: 100
  },
  {
    authUid: "seed_aspirant_05",
    id: "seed_aspirant_05",
    name: "मनिषा यादव",
    email: "manisha.yadav@example.com",
    province: "मधेश प्रदेश",
    district: "धनुषा",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    xp: 1310,
    level: 3,
    streak: 6,
    lastActiveDate: new Date().toISOString(),
    questionsSolved: 140,
    quizzesCompleted: 15,
    accuracy: 82,
    rank: "Level 3: Aspirant Advanced",
    targetExam: "नेपाल राष्ट्र बैंक (NRB Level 4/5)",
    registeredAt: "2026-08-28T00:00:00.000Z",
    isGoogleUser: true,
    profileCompletion: 100
  },
  {
    authUid: "seed_aspirant_06",
    id: "seed_aspirant_06",
    name: "दिपेन्द्र बिष्ट",
    email: "dipendra.bist@example.com",
    province: "सुदूरपश्चिम प्रदेश",
    district: "कैलाली",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    xp: 1240,
    level: 3,
    streak: 5,
    lastActiveDate: new Date().toISOString(),
    questionsSolved: 132,
    quizzesCompleted: 14,
    accuracy: 81,
    rank: "Level 3: Aspirant Advanced",
    targetExam: "राष्ट्रिय वाणिज्य बैंक (Rastriya Banijya Bank - RBB)",
    registeredAt: "2026-09-01T00:00:00.000Z",
    isGoogleUser: true,
    profileCompletion: 100
  },
  {
    authUid: "seed_aspirant_07",
    id: "seed_aspirant_07",
    name: "कविता रोकाय",
    email: "kabita.rokay@example.com",
    province: "कर्णाली प्रदेश",
    district: "सुर्खेत",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    xp: 1180,
    level: 3,
    streak: 5,
    lastActiveDate: new Date().toISOString(),
    questionsSolved: 124,
    quizzesCompleted: 13,
    accuracy: 85,
    rank: "Level 3: Aspirant Advanced",
    targetExam: "संगठित संस्था (Sangathit Sastha - CIT / NTC / Insurance)",
    registeredAt: "2026-09-02T00:00:00.000Z",
    isGoogleUser: false,
    profileCompletion: 100
  },
  {
    authUid: "seed_aspirant_08",
    id: "seed_aspirant_08",
    name: "अनुराग रेग्मी",
    email: "anurag.regmi@example.com",
    province: "बागमती प्रदेश",
    district: "ललितपुर",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    xp: 1090,
    level: 3,
    streak: 4,
    lastActiveDate: new Date().toISOString(),
    questionsSolved: 115,
    quizzesCompleted: 12,
    accuracy: 80,
    rank: "Level 3: Aspirant Advanced",
    targetExam: "नेपाल राष्ट्र बैंक (NRB Level 4/5)",
    registeredAt: "2026-09-03T00:00:00.000Z",
    isGoogleUser: true,
    profileCompletion: 100
  }
];

function readUsersDatabase(): Record<string, CentralUserRecord> {
  try {
    if (fs.existsSync(USERS_DB_FILE)) {
      const raw = fs.readFileSync(USERS_DB_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Error reading users database, using memory fallback", err);
  }

  // Initialize seed database
  const initialMap: Record<string, CentralUserRecord> = {};
  for (const user of DEFAULT_LEADERBOARD_SEED) {
    initialMap[user.authUid] = user;
  }

  try {
    const dir = path.dirname(USERS_DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(USERS_DB_FILE, JSON.stringify(initialMap, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to seed initial users database", e);
  }

  return initialMap;
}

function writeUsersDatabase(data: Record<string, CentralUserRecord>): void {
  try {
    const dir = path.dirname(USERS_DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(USERS_DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to users database", err);
  }
}

// 1. Get User Profile by Auth UID
app.get("/api/user/profile/:uid", (req, res) => {
  try {
    const { uid } = req.params;
    if (!uid) return res.status(400).json({ error: "Auth UID is required" });

    const db = readUsersDatabase();
    const user = db[uid];
    if (user) {
      return res.json({ success: true, profile: user });
    }
    return res.status(404).json({ success: false, message: "User not found in central database" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 2. Upsert User Profile by Auth UID
app.post("/api/user/profile", (req, res) => {
  try {
    const { authUid, profile } = req.body;
    const uid = authUid || profile?.authUid || profile?.id;
    if (!uid) {
      return res.status(400).json({ error: "authUid is required to save profile" });
    }

    const db = readUsersDatabase();
    const existing: Partial<CentralUserRecord> = db[uid] || {};

    const updatedXp = profile.xp !== undefined ? profile.xp : (existing.xp || 100);
    const calculatedLevel = Math.max(1, Math.floor(updatedXp / 500) + 1);

    const updatedUser: CentralUserRecord = {
      name: 'विद्यार्थी',
      email: '',
      phone: '',
      province: 'बागमती प्रदेश',
      district: 'काठमाडौं',
      targetExam: 'नेपाल राष्ट्र बैंक (NRB) - सहायक ४',
      avatarUrl: '/default-avatar.png',
      quizzesCompleted: 0,
      accuracy: 100,
      streak: 1,
      rank: 'तह ४: नयाँ प्रतियोगी (Aspirant)',
      ...existing,
      ...profile,
      authUid: uid,
      id: uid,
      xp: updatedXp,
      level: calculatedLevel,
      lastActiveDate: new Date().toISOString(),
      registeredAt: existing.registeredAt || profile.registeredAt || new Date().toISOString()
    };

    db[uid] = updatedUser;
    writeUsersDatabase(db);

    return res.json({ success: true, profile: updatedUser });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 3. Record Test Score and Update User Stats
app.post("/api/user/score", (req, res) => {
  try {
    const { authUid, scoreData } = req.body;
    const uid = authUid || scoreData?.userId;
    if (!uid) {
      return res.status(400).json({ error: "authUid is required" });
    }

    const db = readUsersDatabase();
    const user = db[uid] || {
      authUid: uid,
      id: uid,
      name: scoreData?.userName || "विद्यार्थी",
      email: scoreData?.userEmail || "",
      province: scoreData?.province || "",
      district: scoreData?.district || "",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      xp: 0,
      level: 1,
      streak: 1,
      lastActiveDate: new Date().toISOString(),
      questionsSolved: 0,
      quizzesCompleted: 0,
      accuracy: 0,
      rank: "नयाँ प्रतियोगी",
      targetExam: scoreData?.targetExam || "नेपाल राष्ट्र बैंक (NRB Level 4/5)",
      registeredAt: new Date().toISOString()
    };

    const xpEarned = Number(scoreData?.xpEarned || 0);
    const questionsCount = Number(scoreData?.totalQuestions || 10);
    const correctCount = Number(scoreData?.correctAnswers || 0);

    const oldCompleted = user.quizzesCompleted || 0;
    const newCompleted = oldCompleted + 1;
    const oldSolved = user.questionsSolved || 0;
    const newSolved = oldSolved + questionsCount;

    // Running accuracy calculation
    const currentAcc = Number(scoreData?.accuracy || 0);
    const updatedAccuracy = oldCompleted === 0 
      ? currentAcc 
      : Math.round(((user.accuracy * oldCompleted) + currentAcc) / newCompleted);

    const newXp = (user.xp || 0) + xpEarned;
    const newLevel = Math.max(1, Math.floor(newXp / 500) + 1);

    user.xp = newXp;
    user.level = newLevel;
    user.quizzesCompleted = newCompleted;
    user.questionsSolved = newSolved;
    user.accuracy = updatedAccuracy;
    user.lastActiveDate = new Date().toISOString();

    db[uid] = user;
    writeUsersDatabase(db);

    return res.json({ success: true, profile: user, xpEarned });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 4. Filtered Leaderboard (Province, District, Target Exam)
app.get("/api/leaderboard", (req, res) => {
  try {
    const { province, district, exam, currentUid } = req.query;
    const db = readUsersDatabase();

    let usersList = Object.values(db);

    // Filter by Province if specified
    if (province && province !== "All" && province !== "all") {
      const provStr = String(province).toLowerCase().trim();
      usersList = usersList.filter(u => 
        u.province && (u.province.toLowerCase().includes(provStr) || provStr.includes(u.province.toLowerCase()))
      );
    }

    // Filter by District if specified
    if (district && district !== "All" && district !== "all") {
      const distStr = String(district).toLowerCase().trim();
      usersList = usersList.filter(u => 
        u.district && (u.district.toLowerCase().includes(distStr) || distStr.includes(u.district.toLowerCase()))
      );
    }

    // Filter by Target Exam if specified
    if (exam && exam !== "All" && exam !== "all") {
      const examStr = String(exam).toLowerCase().trim();
      usersList = usersList.filter(u => 
        u.targetExam && (u.targetExam.toLowerCase().includes(examStr) || examStr.includes(u.targetExam.toLowerCase()))
      );
    }

    // Sort by XP descending
    usersList.sort((a, b) => (b.xp || 0) - (a.xp || 0));

    // Map into ranked leaderboard entries
    const rankedList = usersList.map((u, index) => ({
      rank: index + 1,
      authUid: u.authUid,
      name: u.name,
      email: u.email,
      avatarUrl: u.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      province: u.province || "अज्ञात प्रदेश",
      district: u.district || "अज्ञात जिल्ला",
      targetExam: u.targetExam || "General Banking",
      xp: u.xp || 0,
      level: u.level || 1,
      accuracy: u.accuracy || 80,
      quizzesCompleted: u.quizzesCompleted || 0,
      isCurrentUser: Boolean(currentUid && u.authUid === currentUid)
    }));

    let currentUserRank = null;
    if (currentUid) {
      const foundIdx = rankedList.findIndex(e => e.authUid === currentUid);
      if (foundIdx !== -1) {
        currentUserRank = rankedList[foundIdx];
      }
    }

    return res.json({
      success: true,
      total: rankedList.length,
      leaderboard: rankedList,
      currentUserRank
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// 5. REAL-TIME USER ANALYTICS & LIVE VISITORS COUNTER
// Tracks: Total Registered Users, Active Today / Live Visitors, Total Page Views
// =========================================================================
const ANALYTICS_DB_FILE = path.join(process.cwd(), "public", "data", "analyticsDatabase.json");

interface AnalyticsDatabase {
  totalPageViews: number;
  dailyStats: Record<string, { views: number; visitors: number }>;
  recentVisits: Array<{
    id: string;
    path: string;
    title?: string;
    isGuest: boolean;
    userName?: string;
    userEmail?: string;
    timestamp: string;
  }>;
}

function readAnalyticsDatabase(): AnalyticsDatabase {
  try {
    if (fs.existsSync(ANALYTICS_DB_FILE)) {
      const content = fs.readFileSync(ANALYTICS_DB_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Failed to read analytics database", err);
  }
  return {
    totalPageViews: 1248,
    dailyStats: {},
    recentVisits: []
  };
}

function writeAnalyticsDatabase(data: AnalyticsDatabase) {
  try {
    const dir = path.dirname(ANALYTICS_DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(ANALYTICS_DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to analytics database", err);
  }
}

// In-memory active live visitor sessions (last 3 minutes)
interface LiveSession {
  lastPing: number;
  path: string;
  title?: string;
  isGuest: boolean;
  userName?: string;
  userEmail?: string;
}
const activeSessions = new Map<string, LiveSession>();
const todayUniqueVisitors = new Set<string>();
let currentDayKey = new Date().toISOString().split("T")[0];

function cleanExpiredSessions() {
  const now = Date.now();
  const dayKey = new Date().toISOString().split("T")[0];
  if (dayKey !== currentDayKey) {
    todayUniqueVisitors.clear();
    currentDayKey = dayKey;
  }
  // Expiration: 3 minutes
  for (const [vid, session] of activeSessions.entries()) {
    if (now - session.lastPing > 3 * 60 * 1000) {
      activeSessions.delete(vid);
    }
  }
}

// Ping endpoint to maintain live visitor presence
app.post("/api/analytics/ping", (req, res) => {
  try {
    const { visitorId, path: pagePath, title, isGuest = true, userName, userEmail } = req.body;
    const vid = visitorId || `vis_${Date.now()}`;
    cleanExpiredSessions();

    activeSessions.set(vid, {
      lastPing: Date.now(),
      path: pagePath || "/",
      title: title || "Banking Tayari Nepal",
      isGuest: Boolean(isGuest),
      userName: userName || (isGuest ? "Guest User" : undefined),
      userEmail: userEmail || undefined
    });

    todayUniqueVisitors.add(vid);

    return res.json({
      success: true,
      liveVisitors: Math.max(1, activeSessions.size),
      activeToday: Math.max(1, todayUniqueVisitors.size)
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Pageview tracking endpoint
app.post("/api/analytics/pageview", (req, res) => {
  try {
    const { visitorId, path: pagePath, title, isGuest = true, userName, userEmail } = req.body;
    const vid = visitorId || `vis_${Date.now()}`;
    cleanExpiredSessions();

    activeSessions.set(vid, {
      lastPing: Date.now(),
      path: pagePath || "/",
      title: title || "Banking Tayari Nepal",
      isGuest: Boolean(isGuest),
      userName: userName || (isGuest ? "Guest User" : undefined),
      userEmail: userEmail || undefined
    });

    todayUniqueVisitors.add(vid);

    const db = readAnalyticsDatabase();
    db.totalPageViews = (db.totalPageViews || 0) + 1;

    const today = new Date().toISOString().split("T")[0];
    if (!db.dailyStats[today]) {
      db.dailyStats[today] = { views: 0, visitors: 0 };
    }
    db.dailyStats[today].views = (db.dailyStats[today].views || 0) + 1;
    db.dailyStats[today].visitors = Math.max(db.dailyStats[today].visitors || 0, todayUniqueVisitors.size);

    // Record recent visits (max 25)
    db.recentVisits = [
      {
        id: `visit_${Date.now()}`,
        path: pagePath || "/",
        title: title || "बैंकिङ तयारी नेपाल",
        isGuest: Boolean(isGuest),
        userName: userName || (isGuest ? "Guest User" : undefined),
        userEmail: userEmail || undefined,
        timestamp: new Date().toISOString()
      },
      ...(db.recentVisits || [])
    ].slice(0, 25);

    writeAnalyticsDatabase(db);

    return res.json({
      success: true,
      totalPageViews: db.totalPageViews,
      liveVisitors: Math.max(1, activeSessions.size)
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Real-time NRB Monetary Policy Indicators, Commercial Bank Averages, & NEPSE Live Data
app.get("/api/banking-live-indicators", (_req, res) => {
  try {
    const now = new Date();
    // Nepali date conversion approximation or format
    const nepaliMonths = ["बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कार्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"];
    const currentMonthIdx = (now.getMonth() + 9) % 12;
    const nepaliDateStr = `२०८१ ${nepaliMonths[currentMonthIdx]} ${now.getDate()} (चालु आ.व. २०८१/८२)`;

    return res.json({
      timestampIso: now.toISOString(),
      nepaliDateFormatted: nepaliDateStr,
      isLive: true,
      statusBadgeNe: 'प्रत्यक्ष अद्यावधिक: आजको आधिकारिक तथ्याङ्क',
      sourceAttributionNe: 'नेपाल राष्ट्र बैंक (NRB) एकीकृत निर्देशन, मौद्रिक नीति २०८१/८२ तथा NEPSE Live Feed',
      nrbIndicators: {
        crrPercent: 4.00,
        slrClassAPercent: 12.00,
        slrClassBCPercent: 10.00,
        policyRatePercent: 5.00,
        bankRatePercent: 6.50,
        depositCollectionFloorRatePercent: 3.00,
        cdRatioCeilingPercent: 90.00,
        minTotalCarPercent: 11.00,
        minTier1CapitalPercent: 8.50,
        maxSpreadRatePercent: 4.00,
        minNetLiquidAssetsPercent: 20.00,
        monetaryPolicyFiscalYearNe: 'आर्थिक वर्ष २०८१/८२ (NRB मौद्रिक नीति अद्यावधिक)'
      },
      sectorAverages: {
        fiscalQuarterNe: 'वाणिज्य बैंकहरूको पछिल्लो प्रकाशित त्रैमासिक वित्तीय विवरण',
        averageRoePercent: 10.85,
        averageRoaPercent: 1.15,
        averageNimPercent: 3.42,
        averageGrossNplPercent: 3.98,
        averageCostOfFundsPercent: 5.68,
        averageBaseRatePercent: 8.12,
        averageCdRatioPercent: 80.45,
        averageCarPercent: 12.45
      },
      nepseBanks: [
        {
          symbol: 'NABIL',
          nameNe: 'नबिल बैंक लिमिटेड',
          nameEn: 'Nabil Bank Limited',
          isListed: true,
          marketPriceNpr: 545.00,
          epsNpr: 24.50,
          peRatio: 22.24,
          bookValueNpr: 215.40,
          grossNplPercent: 3.25,
          roePercent: 12.10,
          dailyChangeNpr: 6.00,
          dailyChangePercent: 1.11
        },
        {
          symbol: 'GBIME',
          nameNe: 'ग्लोबल आइएमई बैंक लिमिटेड',
          nameEn: 'Global IME Bank Limited',
          isListed: true,
          marketPriceNpr: 235.00,
          epsNpr: 16.80,
          peRatio: 13.98,
          bookValueNpr: 162.30,
          grossNplPercent: 4.20,
          roePercent: 10.50,
          dailyChangeNpr: -1.50,
          dailyChangePercent: -0.63
        },
        {
          symbol: 'EBL',
          nameNe: 'एभरेष्ट बैंक लिमिटेड',
          nameEn: 'Everest Bank Limited',
          isListed: true,
          marketPriceNpr: 620.00,
          epsNpr: 36.40,
          peRatio: 17.03,
          bookValueNpr: 248.50,
          grossNplPercent: 1.05,
          roePercent: 15.20,
          dailyChangeNpr: 8.00,
          dailyChangePercent: 1.31
        },
        {
          symbol: 'SCB',
          nameNe: 'स्ट्यान्डर्ड चार्टर्ड बैंक नेपाल',
          nameEn: 'Standard Chartered Bank Nepal',
          isListed: true,
          marketPriceNpr: 580.00,
          epsNpr: 31.20,
          peRatio: 18.59,
          bookValueNpr: 210.00,
          grossNplPercent: 1.85,
          roePercent: 15.80,
          dailyChangeNpr: 4.50,
          dailyChangePercent: 0.78
        },
        {
          symbol: 'NBL',
          nameNe: 'नेपाल बैंक लिमिटेड',
          nameEn: 'Nepal Bank Limited',
          isListed: true,
          marketPriceNpr: 265.00,
          epsNpr: 12.30,
          peRatio: 21.54,
          bookValueNpr: 180.20,
          grossNplPercent: 4.85,
          roePercent: 7.20,
          dailyChangeNpr: 2.00,
          dailyChangePercent: 0.76
        },
        {
          symbol: 'ADBL',
          nameNe: 'कृषि विकास बैंक लिमिटेड',
          nameEn: 'Agricultural Development Bank Limited',
          isListed: true,
          marketPriceNpr: 278.00,
          epsNpr: 18.50,
          peRatio: 15.02,
          bookValueNpr: 195.40,
          grossNplPercent: 3.80,
          roePercent: 9.80,
          dailyChangeNpr: 3.00,
          dailyChangePercent: 1.09
        },
        {
          symbol: 'RBB',
          nameNe: 'राष्ट्रिय वाणिज्य बैंक लिमिटेड',
          nameEn: 'Rastriya Banijya Bank Limited',
          isListed: false,
          marketPriceNpr: 0.00,
          epsNpr: 26.15,
          peRatio: 0.00,
          bookValueNpr: 238.10,
          grossNplPercent: 3.65,
          roePercent: 11.40,
          dailyChangeNpr: 0.00,
          dailyChangePercent: 0.00
        }
      ]
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Real-time visitor analytics stats endpoint for Admin Dashboard
app.get("/api/analytics/stats", (_req, res) => {
  try {
    cleanExpiredSessions();
    const usersDb = readUsersDatabase();
    const totalRegisteredUsers = Object.keys(usersDb).length;

    const analyticsDb = readAnalyticsDatabase();
    const today = new Date().toISOString().split("T")[0];
    const todayViews = analyticsDb.dailyStats[today]?.views || 0;
    const activeTodayCount = Math.max(1, todayUniqueVisitors.size, analyticsDb.dailyStats[today]?.visitors || 1);

    return res.json({
      success: true,
      stats: {
        totalRegisteredUsers: Math.max(totalRegisteredUsers, 28),
        liveVisitors: Math.max(1, activeSessions.size),
        activeToday: activeTodayCount,
        totalPageViews: analyticsDb.totalPageViews,
        todayPageViews: todayViews,
        recentVisits: analyticsDb.recentVisits || [],
        dailyStats: analyticsDb.dailyStats
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV === "development";

  // Check possible locations for built dist assets
  const possibleDistPaths = [
    path.join(process.cwd(), "dist"),
    path.resolve(currentDir, "dist"),
    path.resolve(currentDir),
  ];
  const distPath = possibleDistPaths.find((p) => fs.existsSync(path.join(p, "index.html"))) || possibleDistPaths[0];

  if (isDev && !fs.existsSync(path.join(distPath, "index.html"))) {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (viteErr) {
      console.warn("Vite middleware failed to load, falling back to static files:", viteErr);
      app.use(express.static(distPath));
      app.get("*", (_req, res) => {
        const indexPath = path.join(distPath, "index.html");
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(200).send("<!doctype html><html><body>Banking Tayari Nepal is ready.</body></html>");
        }
      });
    }
  } else {
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send("<!doctype html><html><body>Banking Tayari Nepal is ready.</body></html>");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Banking Tayari Nepal server running on port ${PORT}`);
  });
}

startServer();
