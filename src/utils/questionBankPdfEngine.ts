/**
 * COMPLETE PDF GENERATION ENGINE
 * Banking Tayari Nepal - Official Question Bank (10,000+) & 50 Pre-Test Sets
 * 
 * Features:
 * - Full Branding: Official logo, Deep Navy Blue (#0F2942), Accent Red/Crimson (#E63946), Soft Gray Backings
 * - Diagonal Light Watermark across every page: "BANKING TAYARI NEPAL • बैंकिङ्ग तयारी नेपाल"
 * - Full Nepali & English (Bilingual) Unicode rendering with high typographic clarity
 * - Clean A4 layout with page breaks (break-inside: avoid), headers, footers & answer keys
 * - Dual Delivery: High-Fidelity Browser Print/Save-as-PDF & Standalone Offline Document (.html)
 */

import { SYLLABUS_MODULES, buildModuleRepository } from '../data/quizData';
import { allFiftySets, convertRawSetToQuizSet } from '../data/sangathitDatabase';
import { getSetCategoryMeta, TOTAL_SETS } from '../data/questionBank';
import { DbService } from '../services/dbService';
import { Question, QuizQuestion, RawSangathitSet, RawSangathitQuestion } from '../types';

export interface PdfExportItem {
  number: number;
  questionNepali: string;
  questionEnglish?: string;
  options: { key: string; text: string }[];
  correctKey: string; // 'A' | 'B' | 'C' | 'D'
  explanation?: string;
  category?: string;
  module?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | string;
  actSection?: string;
  examTip?: string;
  marks?: number;
}

export interface PdfSetGroup {
  setId?: number;
  title: string;
  nepaliTitle: string;
  description?: string;
  targetLevel?: string;
  timeLimitMinutes?: number;
  questions: PdfExportItem[];
}

export interface QuestionBankPdfOptions {
  title: string;
  subtitle?: string;
  examLevel?: string;
  scopeDescription?: string;
  mode?: 'comprehensive' | 'exam'; // 'comprehensive' = with explanations; 'exam' = questions only + answer key table
  includeWatermark?: boolean;
  includeCoverPage?: boolean;
  onProgress?: (percent: number, message: string) => void;
}

// Brand Visual Tokens
const BRAND_NAVY = '#0F2942';
const BRAND_RED = '#E63946';
const BRAND_LIGHT_BG = '#F8FAFC';
const BRAND_BORDER = '#E2E8F0';

/**
 * Escapes HTML characters to prevent XSS and rendering breakages
 */
function escapeHtml(str: string | undefined | null): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Normalizes QuizQuestion into standard PdfExportItem
 */
export function normalizeQuizQuestion(q: QuizQuestion, index: number): PdfExportItem {
  let qNep = q.question;
  let qEng: string | undefined = undefined;

  if (q.question.includes(' / ')) {
    const parts = q.question.split(' / ');
    qNep = parts[0]?.trim() || q.question;
    qEng = parts.slice(1).join(' / ')?.trim();
  } else if (q.question.includes('\n')) {
    const parts = q.question.split('\n');
    qNep = parts[0]?.trim() || q.question;
    qEng = parts.slice(1).join(' ')?.trim();
  }

  const options = q.options.map((opt, i) => ({
    key: String.fromCharCode(65 + i),
    text: opt
  }));

  const correctKey = String.fromCharCode(65 + (typeof q.correctAnswer === 'number' ? q.correctAnswer : 0));

  return {
    number: index + 1,
    questionNepali: qNep,
    questionEnglish: qEng,
    options,
    correctKey,
    explanation: q.explanation,
    category: q.category,
    module: q.syllabusModule || q.category,
    difficulty: q.difficulty,
    actSection: q.actSection,
    examTip: q.examTip,
    marks: 2
  };
}

/**
 * Normalizes RawSangathitQuestion into standard PdfExportItem
 */
export function normalizeSangathitQuestion(q: RawSangathitQuestion, index: number): PdfExportItem {
  const options = (q.options || []).map((opt, i) => ({
    key: String.fromCharCode(65 + i),
    text: opt
  }));

  let correctKey = 'A';
  if (typeof q.correctAnswer === 'number') {
    correctKey = String.fromCharCode(65 + q.correctAnswer);
  } else if (typeof q.correctAnswer === 'string') {
    correctKey = q.correctAnswer.toUpperCase();
  }

  return {
    number: index + 1,
    questionNepali: q.question,
    questionEnglish: q.questionEnglish,
    options,
    correctKey,
    explanation: q.explanation,
    marks: 2
  };
}

/**
 * Normalizes CMS Question into standard PdfExportItem
 */
export function normalizeCmsQuestion(q: Question, index: number): PdfExportItem {
  const options = (q.options || []).map(opt => ({
    key: opt.key,
    text: opt.textNepali + (opt.textEnglish ? ` / ${opt.textEnglish}` : '')
  }));

  return {
    number: index + 1,
    questionNepali: q.questionNepali,
    questionEnglish: q.questionEnglish,
    options,
    correctKey: q.correctAnswer || 'A',
    explanation: q.explanationNepali,
    category: q.category,
    module: q.syllabusModule,
    difficulty: q.difficulty,
    actSection: q.actSection,
    examTip: q.examTip,
    marks: 2
  };
}

/**
 * Generates official vector SVG logo markup
 */
function getLogoSvgMarkup(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 340" style="height: 42px; width: auto; max-width: 170px;">
      <g transform="translate(15, 12)">
        <path d="M 28 8 L 175 8 C 218 8, 252 32, 252 76 C 252 112, 222 136, 182 144 C 226 154, 254 186, 254 228 C 254 246, 246 264, 234 278 C 225 272, 212 266, 196 264 C 224 250, 236 232, 236 212 C 236 178, 210 156, 166 156 L 76 156 L 76 250 L 28 250 Z" fill="${BRAND_NAVY}" />
        <path d="M 76 44 L 165 44 C 188 44, 206 56, 206 76 C 206 96, 188 110, 165 110 L 76 110 Z" fill="#FFFFFF" />
        <path d="M 12 312 C 45 292, 85 282, 126 280 C 126 270, 126 262, 126 256 C 76 260, 38 274, 12 312 Z" fill="${BRAND_NAVY}" />
        <path d="M 20 288 C 52 268, 90 258, 128 255 C 128 247, 128 240, 128 234 C 84 238, 48 250, 20 288 Z" fill="${BRAND_NAVY}" />
        <path d="M 32 264 C 62 244, 98 234, 130 230 C 130 222, 130 216, 130 210 C 90 214, 56 226, 32 264 Z" fill="${BRAND_NAVY}" />
        <path d="M 136 308 C 178 288, 222 266, 260 224 C 260 248, 246 280, 218 300 C 190 316, 160 316, 136 308 Z" fill="${BRAND_RED}" />
        <path d="M 138 288 C 170 270, 206 252, 238 224 C 238 240, 228 262, 208 278 C 184 292, 160 294, 138 288 Z" fill="${BRAND_RED}" />
        <g transform="translate(94, 154)">
          <path d="M 42 0 L 12 75 C 12 108, 24 135, 42 155 C 60 135, 72 108, 72 75 L 42 0 Z" fill="#FFFFFF" stroke="${BRAND_NAVY}" stroke-width="3" stroke-linejoin="round" />
          <circle cx="42" cy="76" r="6.5" fill="${BRAND_NAVY}" />
          <line x1="42" y1="70" x2="42" y2="4" stroke="${BRAND_NAVY}" stroke-width="3.5" stroke-linecap="round" />
        </g>
      </g>
      <g transform="translate(305, 12)">
        <text x="0" y="132" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="138" fill="${BRAND_NAVY}" letter-spacing="1.5">BANKING</text>
        <rect x="0" y="156" width="675" height="84" rx="6" fill="${BRAND_RED}" />
        <text x="337" y="218" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="48" fill="#FFFFFF" text-anchor="middle" letter-spacing="12">TAYARI NEPAL</text>
        <text x="0" y="295" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="30" fill="${BRAND_NAVY}" letter-spacing="3">PREPARE • PRACTICE • SUCCEED</text>
      </g>
    </svg>
  `;
}

/**
 * Generates the Complete HTML Document for PDF rendering with exact styles,
 * watermarks, pagination, and bilingual formatting.
 */
export function buildDocumentHtml(
  groups: PdfSetGroup[],
  options: QuestionBankPdfOptions
): string {
  const {
    title,
    subtitle = 'नेपाल राष्ट्र बैंक, वाणिज्य बैंकहरू, सार्वजनिक संस्थान तथा लोकसेवा परीक्षा तयारी आधिकारिक सामग्री',
    examLevel = 'सहायक तथा अधिकृत तह (Level 4 - 10)',
    scopeDescription = 'आधिकारिक पाठ्यक्रम अनुसार १० वटै खण्डका उच्च-स्तरीय वस्तुगत प्रश्नोत्तरहरू',
    mode = 'comprehensive',
    includeWatermark = true,
    includeCoverPage = true
  } = options;

  const totalQuestions = groups.reduce((acc, g) => acc + g.questions.length, 0);
  const totalSets = groups.length;
  const currentDate = new Date().toLocaleDateString('ne-NP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Build Table of Contents if multiple sets
  let tocHtml = '';
  if (groups.length > 1) {
    tocHtml = `
      <div class="toc-container page-break-after">
        <div class="toc-header">
          <h2>📑 विषय-सूची (Table of Contents)</h2>
          <p>सङ्ग्रहित ${totalSets} वटा सेटहरू तथा कुल ${totalQuestions.toLocaleString('ne-NP')} प्रश्नहरू</p>
        </div>
        <div class="toc-grid">
          ${groups.map((g, idx) => `
            <div class="toc-item">
              <span class="toc-num">सेट ${g.setId || (idx + 1)}</span>
              <span class="toc-title">${escapeHtml(g.nepaliTitle || g.title)}</span>
              <span class="toc-badge">${g.questions.length} प्रश्नहरू</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Build Sets and Questions
  const setsHtml = groups.map((group, gIdx) => {
    const isMultiSet = groups.length > 1;

    const groupHeaderHtml = `
      <div class="set-header ${isMultiSet && gIdx > 0 ? 'page-break-before' : ''}">
        <!-- Running Header with Official Logo -->
        <div class="running-header">
          <div class="header-brand-info">
            ${getLogoSvgMarkup()}
            <div class="header-text-block">
              <h1>BANKING TAYARI NEPAL</h1>
              <p>बैंकिङ्ग तयारी नेपाल • आधिकारिक परीक्षा तयारी तथा नमुना प्रश्नपत्र सङ्ग्रह</p>
            </div>
          </div>
          <div class="header-meta-block">
            <div><strong>सेट:</strong> ${group.setId || (gIdx + 1)} / ${groups.length}</div>
            <div><strong>लक्षित तह:</strong> ${escapeHtml(examLevel)}</div>
            <div><strong>मिति:</strong> ${currentDate}</div>
          </div>
        </div>

        <div class="set-banner">
          <div class="set-badge">सेट ${group.setId || (gIdx + 1)}</div>
          <h2 class="set-title">${escapeHtml(group.nepaliTitle || group.title)}</h2>
          <div class="set-meta">
            <span><strong>पूर्णाङ्क:</strong> ${group.questions.length * 2} अङ्क</span>
            <span>•</span>
            <span><strong>समय:</strong> ${group.timeLimitMinutes || 45} मिनेट</span>
            <span>•</span>
            <span><strong>प्रश्न संख्या:</strong> ${group.questions.length} MCQs</span>
            <span>•</span>
            <span><strong>नेगेटिभ मार्किङ:</strong> २०% (-०.४ प्रति गलत उत्तर)</span>
          </div>
        </div>
        ${group.description ? `<p class="set-desc">${escapeHtml(group.description)}</p>` : ''}
      </div>
    `;

    // Render questions
    const questionsHtml = group.questions.map((q, qIdx) => {
      const qNumber = q.number || (qIdx + 1);

      return `
        <div class="question-card" id="q-${gIdx}-${qIdx}">
          <div class="q-top">
            <span class="q-num">प्रश्न ${qNumber}</span>
            <div class="q-tags">
              ${q.module ? `<span class="q-tag module-tag">${escapeHtml(q.module)}</span>` : ''}
              ${q.difficulty ? `<span class="q-tag diff-tag">${escapeHtml(q.difficulty)}</span>` : ''}
              <span class="q-tag marks-tag">२ अङ्क</span>
            </div>
          </div>

          <div class="q-content">
            <p class="q-nepali">${escapeHtml(q.questionNepali)}</p>
            ${q.questionEnglish ? `<p class="q-english">${escapeHtml(q.questionEnglish)}</p>` : ''}
          </div>

          <div class="options-grid">
            ${q.options.map(opt => {
              const isCorrect = mode === 'comprehensive' && opt.key === q.correctKey;
              return `
                <div class="option-item ${isCorrect ? 'is-correct' : ''}">
                  <span class="opt-key ${isCorrect ? 'key-correct' : ''}">${opt.key}</span>
                  <span class="opt-text">${escapeHtml(opt.text)}</span>
                  ${isCorrect ? '<span class="correct-indicator">✓ सही उत्तर</span>' : ''}
                </div>
              `;
            }).join('')}
          </div>

          ${mode === 'comprehensive' && (q.explanation || q.actSection || q.examTip) ? `
            <div class="explanation-box">
              <div class="exp-header">
                <strong>💡 आधिकारिक उत्तर: विकल्प (${q.correctKey})</strong>
                ${q.actSection ? `<span class="act-ref">📜 ऐन/दफा: ${escapeHtml(q.actSection)}</span>` : ''}
              </div>
              ${q.explanation ? `<p class="exp-text">${escapeHtml(q.explanation)}</p>` : ''}
              ${q.examTip ? `<p class="exam-tip">🎯 <strong>परीक्षक सुझाव:</strong> ${escapeHtml(q.examTip)}</p>` : ''}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    // Answer Key Table if in 'exam' mode
    let answerKeyHtml = '';
    if (mode === 'exam') {
      answerKeyHtml = `
        <div class="answer-key-section page-break-before">
          <div class="answer-key-header">
            <h3>🔑 उत्तरकुञ्जी (Answer Key & Matrix) - सेट ${group.setId || (gIdx + 1)}</h3>
            <p>कुल ५० प्रश्नहरूको सही उत्तर तथा छोटो समाधान</p>
          </div>
          <div class="key-grid">
            ${group.questions.map((q, idx) => `
              <div class="key-cell">
                <span class="kc-q">Q.${idx + 1}</span>
                <span class="kc-ans">${q.correctKey}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    return `
      <div class="set-wrapper">
        ${groupHeaderHtml}
        <div class="questions-list">
          ${questionsHtml}
        </div>
        ${answerKeyHtml}
      </div>
    `;
  }).join('');

  // Assemble HTML
  return `
    <!DOCTYPE html>
    <html lang="ne">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(title)} - Banking Tayari Nepal</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
        
        <style>
          @page {
            size: A4 portrait;
            margin: 14mm 12mm 16mm 12mm;
            @top-right {
              content: "बैंकिङ्ग तयारी नेपाल • www.bankingtayari.com.np";
              font-family: 'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif;
              font-size: 8pt;
              color: #64748b;
            }
            @bottom-right {
              content: "Page " counter(page);
              font-family: 'Plus Jakarta Sans', sans-serif;
              font-size: 8pt;
              color: #64748b;
            }
          }

          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            font-family: 'Plus Jakarta Sans', 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #0F172A;
            background: #FFFFFF;
            margin: 0;
            padding: 0;
            font-size: 11pt;
            line-height: 1.55;
          }

          /* WATERMARK OVERLAY */
          ${includeWatermark ? `
            .watermark-layer {
              position: fixed;
              top: 0;
              left: 0;
              width: 100vw;
              height: 100vh;
              pointer-events: none;
              z-index: 0;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              align-items: center;
              overflow: hidden;
              opacity: 0.042;
              user-select: none;
            }
            .watermark-row {
              display: flex;
              gap: 40px;
              transform: rotate(-32deg) scale(1.15);
              white-space: nowrap;
            }
            .watermark-text {
              font-size: 26pt;
              font-weight: 900;
              color: ${BRAND_NAVY};
              letter-spacing: 2px;
              text-transform: uppercase;
            }
            @media print {
              .watermark-layer {
                display: flex !important;
                position: fixed !important;
                opacity: 0.055 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          ` : ''}

          .content-root {
            position: relative;
            z-index: 1;
          }

          /* RUNNING HEADER ON EVERY PRINT PAGE */
          .running-header {
            border-bottom: 2.5px solid ${BRAND_NAVY};
            padding-bottom: 8px;
            margin-bottom: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .header-brand-info {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .header-text-block h1 {
            font-size: 13pt;
            font-weight: 900;
            color: ${BRAND_NAVY};
            margin: 0;
            line-height: 1.2;
          }
          .header-text-block p {
            font-size: 7.5pt;
            color: ${BRAND_RED};
            font-weight: 800;
            letter-spacing: 1px;
            margin: 1px 0 0 0;
          }
          .header-meta-block {
            text-align: right;
            font-size: 8pt;
            color: #475569;
            line-height: 1.35;
          }

          /* COVER PAGE */
          .cover-page {
            min-height: 90vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 30px 15px;
            text-align: center;
            border: 2px solid ${BRAND_NAVY};
            border-radius: 12px;
            background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
            margin-bottom: 25px;
          }
          .cover-emblem-wrap {
            margin: 10px auto 20px auto;
          }
          .cover-tag {
            display: inline-block;
            background: ${BRAND_RED};
            color: #FFFFFF;
            font-weight: 800;
            font-size: 9.5pt;
            letter-spacing: 1.5px;
            padding: 4px 16px;
            border-radius: 20px;
            margin-bottom: 15px;
          }
          .cover-title {
            font-size: 24pt;
            font-weight: 900;
            color: ${BRAND_NAVY};
            line-height: 1.25;
            margin: 10px 0 12px 0;
          }
          .cover-subtitle {
            font-size: 12pt;
            color: #334155;
            max-width: 650px;
            margin: 0 auto 20px auto;
            line-height: 1.6;
          }
          .cover-stats-row {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 25px 0;
          }
          .stat-badge {
            background: #FFFFFF;
            border: 1.5px solid ${BRAND_BORDER};
            border-top: 4px solid ${BRAND_NAVY};
            padding: 12px 18px;
            border-radius: 8px;
            min-width: 140px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.03);
          }
          .stat-val {
            font-size: 16pt;
            font-weight: 900;
            color: ${BRAND_NAVY};
            display: block;
          }
          .stat-lbl {
            font-size: 8pt;
            color: #64748b;
            font-weight: 700;
            margin-top: 2px;
          }
          .cover-syllabus-table {
            width: 100%;
            max-width: 680px;
            margin: 15px auto;
            border-collapse: collapse;
            font-size: 8.5pt;
            text-align: left;
          }
          .cover-syllabus-table th {
            background: ${BRAND_NAVY};
            color: #FFFFFF;
            padding: 7px 10px;
            font-weight: 800;
          }
          .cover-syllabus-table td {
            border: 1px solid #E2E8F0;
            padding: 6px 10px;
            color: #1E293B;
          }
          .cover-syllabus-table tr:nth-child(even) {
            background: #F1F5F9;
          }
          .cover-footer {
            border-top: 1.5px solid #CBD5E1;
            padding-top: 15px;
            font-size: 8.5pt;
            color: #64748b;
          }

          /* TABLE OF CONTENTS */
          .toc-container {
            padding: 15px 0;
          }
          .toc-header h2 {
            font-size: 15pt;
            font-weight: 900;
            color: ${BRAND_NAVY};
            margin: 0 0 4px 0;
          }
          .toc-header p {
            font-size: 9pt;
            color: #64748b;
            margin: 0 0 15px 0;
          }
          .toc-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .toc-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            background: ${BRAND_LIGHT_BG};
            border: 1px solid ${BRAND_BORDER};
            border-radius: 6px;
            font-size: 9pt;
          }
          .toc-num {
            font-weight: 800;
            color: ${BRAND_RED};
            min-width: 50px;
          }
          .toc-title {
            font-weight: 700;
            color: #1E293B;
            flex: 1;
            padding: 0 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .toc-badge {
            background: #E2E8F0;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 7.5pt;
            font-weight: 800;
            color: #475569;
          }

          /* SET BANNER */
          .set-banner {
            background: linear-gradient(90deg, ${BRAND_NAVY} 0%, #1A3A5F 100%);
            color: #FFFFFF;
            padding: 14px 18px;
            border-radius: 8px;
            margin-bottom: 12px;
            position: relative;
          }
          .set-badge {
            background: ${BRAND_RED};
            color: #FFFFFF;
            display: inline-block;
            font-size: 8pt;
            font-weight: 900;
            padding: 3px 10px;
            border-radius: 4px;
            margin-bottom: 6px;
            text-transform: uppercase;
          }
          .set-title {
            font-size: 14pt;
            font-weight: 900;
            margin: 0 0 6px 0;
            color: #FFFFFF;
          }
          .set-meta {
            font-size: 8.5pt;
            color: #E2E8F0;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }
          .set-desc {
            font-size: 8.5pt;
            color: #475569;
            background: ${BRAND_LIGHT_BG};
            border-left: 3px solid ${BRAND_NAVY};
            padding: 6px 12px;
            margin-bottom: 15px;
            border-radius: 0 6px 6px 0;
          }

          /* QUESTION CARD */
          .question-card {
            border: 1px solid #CBD5E1;
            border-radius: 8px;
            padding: 11px 14px;
            margin-bottom: 11px;
            background: #FFFFFF;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .q-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
            border-bottom: 1px dashed #E2E8F0;
            padding-bottom: 4px;
          }
          .q-num {
            font-weight: 900;
            font-size: 9.5pt;
            color: ${BRAND_NAVY};
          }
          .q-tags {
            display: flex;
            gap: 5px;
          }
          .q-tag {
            font-size: 7pt;
            font-weight: 800;
            padding: 2px 6px;
            border-radius: 4px;
            text-transform: uppercase;
          }
          .module-tag {
            background: #E0E7FF;
            color: #3730A3;
          }
          .diff-tag {
            background: #FEF3C7;
            color: #92400E;
          }
          .marks-tag {
            background: #F1F5F9;
            color: #475569;
          }

          .q-content {
            margin-bottom: 8px;
          }
          .q-nepali {
            font-size: 10pt;
            font-weight: 700;
            color: #0F172A;
            margin: 0 0 3px 0;
            line-height: 1.45;
          }
          .q-english {
            font-size: 9pt;
            color: #475569;
            margin: 0;
            font-style: italic;
            line-height: 1.35;
          }

          /* OPTIONS GRID */
          .options-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
            margin-bottom: 6px;
          }
          .option-item {
            border: 1px solid #E2E8F0;
            border-radius: 6px;
            padding: 5px 8px;
            font-size: 9pt;
            display: flex;
            align-items: flex-start;
            gap: 6px;
            background: ${BRAND_LIGHT_BG};
          }
          .option-item.is-correct {
            border-color: #059669;
            background: #ECFDF5;
          }
          .opt-key {
            background: #CBD5E1;
            color: #0F172A;
            font-weight: 800;
            font-size: 7.5pt;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            flex-shrink: 0;
            margin-top: 1px;
          }
          .opt-key.key-correct {
            background: #059669;
            color: #FFFFFF;
          }
          .opt-text {
            color: #1E293B;
            line-height: 1.35;
            flex: 1;
          }
          .correct-indicator {
            font-size: 7pt;
            font-weight: 800;
            color: #059669;
            margin-left: auto;
          }

          /* EXPLANATION BOX */
          .explanation-box {
            background: #F0FDF4;
            border: 1px solid #BBF7D0;
            border-left: 3.5px solid #16A34A;
            border-radius: 4px;
            padding: 7px 10px;
            margin-top: 6px;
            font-size: 8.5pt;
          }
          .exp-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #15803D;
            margin-bottom: 3px;
          }
          .act-ref {
            font-size: 7.5pt;
            font-weight: 700;
            color: #1E3A8A;
            background: #DBEAFE;
            padding: 1px 6px;
            border-radius: 3px;
          }
          .exp-text {
            color: #166534;
            margin: 0 0 3px 0;
            line-height: 1.4;
          }
          .exam-tip {
            color: #9A3412;
            background: #FFEDD5;
            padding: 3px 6px;
            border-radius: 3px;
            margin: 3px 0 0 0;
            font-size: 8pt;
          }

          /* ANSWER KEY SECTION */
          .answer-key-section {
            border: 2px solid ${BRAND_NAVY};
            border-radius: 8px;
            padding: 15px;
            background: #FFFFFF;
            margin-top: 15px;
          }
          .answer-key-header h3 {
            font-size: 13pt;
            font-weight: 900;
            color: ${BRAND_NAVY};
            margin: 0 0 4px 0;
          }
          .answer-key-header p {
            font-size: 8.5pt;
            color: #64748b;
            margin: 0 0 12px 0;
          }
          .key-grid {
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            gap: 5px;
          }
          .key-cell {
            border: 1px solid #CBD5E1;
            border-radius: 4px;
            padding: 4px 2px;
            text-align: center;
            background: ${BRAND_LIGHT_BG};
          }
          .kc-q {
            display: block;
            font-size: 7.5pt;
            color: #64748b;
            font-weight: 600;
          }
          .kc-ans {
            display: block;
            font-size: 10.5pt;
            font-weight: 900;
            color: ${BRAND_RED};
          }

          /* PAGE BREAK UTILITIES */
          .page-break-before {
            page-break-before: always;
            break-before: page;
          }
          .page-break-after {
            page-break-after: always;
            break-after: page;
          }

          @media print {
            body {
              font-size: 9.5pt;
            }
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        ${includeWatermark ? `
          <div class="watermark-layer" aria-hidden="true">
            <div class="watermark-row">
              <span class="watermark-text">BANKING TAYARI NEPAL</span>
              <span class="watermark-text">•</span>
              <span class="watermark-text">बैंकिङ्ग तयारी नेपाल</span>
              <span class="watermark-text">•</span>
              <span class="watermark-text">BANKING TAYARI NEPAL</span>
            </div>
            <div class="watermark-row">
              <span class="watermark-text">बैंकिङ्ग तयारी नेपाल</span>
              <span class="watermark-text">•</span>
              <span class="watermark-text">PREPARE • PRACTICE • SUCCEED</span>
              <span class="watermark-text">•</span>
              <span class="watermark-text">बैंकिङ्ग तयारी नेपाल</span>
            </div>
            <div class="watermark-row">
              <span class="watermark-text">BANKING TAYARI NEPAL</span>
              <span class="watermark-text">•</span>
              <span class="watermark-text">लोकसेवा तथा बैंकिङ परीक्षा</span>
              <span class="watermark-text">•</span>
              <span class="watermark-text">OFFICIAL QUESTION BANK</span>
            </div>
            <div class="watermark-row">
              <span class="watermark-text">बैंकिङ्ग तयारी नेपाल</span>
              <span class="watermark-text">•</span>
              <span class="watermark-text">BANKING TAYARI NEPAL</span>
              <span class="watermark-text">•</span>
              <span class="watermark-text">सङ्गठित संस्था ५० पूर्ण सेटहरू</span>
            </div>
          </div>
        ` : ''}

        <div class="content-root">
          <!-- COVER PAGE -->
          ${includeCoverPage ? `
            <div class="cover-page page-break-after">
              <div class="cover-emblem-wrap">
                ${getLogoSvgMarkup()}
              </div>

              <div>
                <span class="cover-tag">२०८३/८४ BS अद्यावधिक बृहत् परीक्षा संस्करण</span>
                <h1 class="cover-title">${escapeHtml(title)}</h1>
                <p class="cover-subtitle">${escapeHtml(subtitle)}</p>

                <div class="cover-stats-row">
                  <div class="stat-badge">
                    <span class="stat-val">${totalQuestions.toLocaleString('ne-NP')}</span>
                    <span class="stat-lbl">कुल वस्तुगत प्रश्नहरू (MCQs)</span>
                  </div>
                  <div class="stat-badge">
                    <span class="stat-val">${totalSets}</span>
                    <span class="stat-lbl">परीक्षा सेट / खण्डहरू</span>
                  </div>
                  <div class="stat-badge">
                    <span class="stat-val">१० खण्ड</span>
                    <span class="stat-lbl">पाठ्यक्रम समेटिएको</span>
                  </div>
                  <div class="stat-badge">
                    <span class="stat-val">१००%</span>
                    <span class="stat-lbl">द्विभाषी (Bilingual)</span>
                  </div>
                </div>

                <table class="cover-syllabus-table">
                  <thead>
                    <tr>
                      <th style="width: 8%;">क्र.सं.</th>
                      <th style="width: 50%;">पाठ्यक्रम क्षेत्र (Syllabus Module)</th>
                      <th style="width: 22%;">लक्षित तह</th>
                      <th style="width: 20%;">अङ्कभार ढाँचा</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>१.</td><td>सार्वजनिक संस्थान व्यवस्थापन र निजीकरण ऐन २०५०</td><td>तह ४ र ५</td><td>१० प्रश्न (२० अङ्क)</td></tr>
                    <tr><td>२.</td><td>सार्वजनिक-निजी साझेदारी (PPP) र लगानी बोर्ड ऐन २०७५</td><td>तह ४ र ५</td><td>५ प्रश्न (१० अङ्क)</td></tr>
                    <tr><td>३.</td><td>अर्थशास्त्र, मौद्रिक नीति र ब्याजदर करिडोर (५.५%/६.५%)</td><td>तह ४ देखि १०</td><td>५ प्रश्न (१० अङ्क)</td></tr>
                    <tr><td>४.</td><td>नेपालको संविधान २०७२, मौलिक हक र सुशासन ऐन २०६४</td><td>तह ४ र ५</td><td>५ प्रश्न (१० अङ्क)</td></tr>
                    <tr><td>५.</td><td>नेपालको भूगोल, नदीनाला (रसुवा/सिन्धुपाल्चोक) र सीमाना</td><td>तह ४ र ५</td><td>५ प्रश्न (१० अङ्क)</td></tr>
                    <tr><td>६.</td><td>नेपालको इतिहास र बैंकिङ विकास (तेजारथ अड्डा देखि हालसम्म)</td><td>तह ४ र ५</td><td>५ प्रश्न (१० अङ्क)</td></tr>
                    <tr><td>७.</td><td>सूचना प्रविधि, AI, कोर बैंकिङ र NRB IT Guidelines</td><td>तह ४ र ५</td><td>४ प्रश्न (८ अङ्क)</td></tr>
                    <tr><td>८.</td><td>व्यावहारिक गणित, ब्याज, नाफा-नोक्सान र ऐकिक नियम</td><td>तह ४ र ५</td><td>४ प्रश्न (८ अङ्क)</td></tr>
                    <tr><td>९.</td><td>समसामयिक घटनाक्रम, पेरिस पारालम्पिक र आर्थिक सर्वेक्षण</td><td>तह ४ र ५</td><td>४ प्रश्न (८ अङ्क)</td></tr>
                    <tr><td>१०.</td><td>भाषा परीक्षण (शुद्ध नेपाली ३ + English Concord २)</td><td>तह ४ र ५</td><td>३ प्रश्न (६ अङ्क)</td></tr>
                  </tbody>
                </table>
              </div>

              <div class="cover-footer">
                <div><strong>प्रकाशक:</strong> बैंकिङ्ग तयारी नेपाल (Banking Tayari Nepal Pvt. Ltd.) • www.bankingtayari.com.np</div>
                <div style="margin-top: 4px;">जारी मिति: ${currentDate} | सर्वाधिकार सुरक्षित © ${new Date().getFullYear()}</div>
              </div>
            </div>
          ` : ''}

          <!-- TABLE OF CONTENTS -->
          ${tocHtml}

          <!-- RUNNING TOP HEADER (PRESENT ON STUDY PAGES) -->
          <div class="running-header">
            <div class="header-brand-info">
              ${getLogoSvgMarkup()}
              <div class="header-text-block">
                <h1>BANKING TAYARI NEPAL</h1>
                <p>PREPARE • PRACTICE • SUCCEED</p>
              </div>
            </div>
            <div class="header-meta-block">
              <div><strong>स्रोत:</strong> आधिकारिक बृहत् प्रश्न बैंक</div>
              <div><strong>लक्षित तह:</strong> ${escapeHtml(examLevel)}</div>
              <div><strong>मिति:</strong> ${currentDate}</div>
            </div>
          </div>

          <!-- QUESTION SETS LIST -->
          ${setsHtml}
        </div>
      </body>
    </html>
  `;
}

/**
 * Triggers Browser Print/Save-as-PDF smoothly using an iframe
 */
export function triggerPrintDocument(htmlContent: string): void {
  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = '0';
  document.body.appendChild(printFrame);

  const doc = printFrame.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  doc.open();
  doc.write(htmlContent);
  doc.close();

  setTimeout(() => {
    try {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
    } catch (e) {
      console.warn('Iframe print trigger noticed:', e);
      // Fallback: Open in new window
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    } finally {
      setTimeout(() => {
        if (document.body.contains(printFrame)) {
          document.body.removeChild(printFrame);
        }
      }, 5000);
    }
  }, 600);
}

/**
 * Downloads the complete formatted HTML file directly as an offline document
 */
export function downloadOfflineHtmlDocument(htmlContent: string, fileName: string): void {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.endsWith('.html') ? fileName : `${fileName}.html`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * High-Level Method 1: Export All 50 Pre-Test Sets (2,500 MCQs)
 */
export function exportAllFiftyPreTestSets(
  mode: 'comprehensive' | 'exam' = 'comprehensive',
  includeWatermark: boolean = true,
  onProgress?: (percent: number, msg: string) => void
): void {
  onProgress?.(10, '५० वटै Pre-Test सेटहरू तयार गरिँदैछ...');

  const groups: PdfSetGroup[] = allFiftySets.map((rawSet, idx) => {
    const setNum = rawSet.setId || (idx + 1);
    const meta = getSetCategoryMeta(setNum);
    const questions = (rawSet.questions || []).map((q, qIdx) => normalizeSangathitQuestion(q, qIdx));

    return {
      setId: setNum,
      title: `Set ${setNum}: L4 & L5 Pre-Test`,
      nepaliTitle: rawSet.setName || `सङ्गठित संस्था Pre-Test - सेट ${setNum}`,
      description: `१० वटै पाठ्यक्रम खण्डका ५० वस्तुगत प्रश्नहरू • ${meta.bankingExamName} विशेष`,
      targetLevel: 'तह ४ र ५ (Assistant & Officer)',
      timeLimitMinutes: 45,
      questions
    };
  });

  onProgress?.(60, 'बृहत् PDF लेआउट, वाटरमार्क र उत्तरकुञ्जी निर्माण हुँदैछ...');

  const html = buildDocumentHtml(groups, {
    title: 'सङ्गठित संस्था ५० पूर्ण Pre-Test सेटहरू (Complete Master Sets)',
    subtitle: 'नेपाल राष्ट्र बैंक, सार्वजनिक संस्थान तथा लोकसेवा आयोग प्रथम पत्र नमुना परीक्षा ५० सेटहरू (२,५०० MCQs)',
    examLevel: 'तह ४ र तह ५ (Assistant 4th & Officer 5th)',
    scopeDescription: '५० सेट • २,५०० MCQs • १० वटै पाठ्यक्रम खण्ड • पूर्ण व्याख्या सहित',
    mode,
    includeWatermark,
    includeCoverPage: true
  });

  onProgress?.(90, 'प्रिन्ट तथा सेभ-एज-पीडीएफ डायलग खुल्दैछ...');
  triggerPrintDocument(html);
  onProgress?.(100, 'सफलतापूर्वक सम्पन्न भयो!');
}

/**
 * High-Level Method 2: Export a Single Pre-Test Set (50 MCQs)
 */
export function exportSinglePreTestSet(
  setNumber: number,
  mode: 'comprehensive' | 'exam' = 'comprehensive',
  includeWatermark: boolean = true
): void {
  const safeNumber = Math.max(1, Math.min(TOTAL_SETS, setNumber));
  const rawSet = allFiftySets[safeNumber - 1];
  const meta = getSetCategoryMeta(safeNumber);

  const questions = (rawSet.questions || []).map((q, qIdx) => normalizeSangathitQuestion(q, qIdx));

  const group: PdfSetGroup = {
    setId: safeNumber,
    title: `Set ${safeNumber}: Pre-Test`,
    nepaliTitle: rawSet.setName || `सङ्गठित संस्था Pre-Test - सेट ${safeNumber}`,
    description: `१० वटै खण्ड समावेश • ${meta.bankingExamName} • ${meta.loksewaExamName}`,
    targetLevel: 'तह ४ र ५ (Assistant & Officer)',
    timeLimitMinutes: 45,
    questions
  };

  const html = buildDocumentHtml([group], {
    title: `सङ्गठित संस्था Pre-Test - सेट ${safeNumber}`,
    subtitle: `${meta.bankingExamName} तथा लोकसेवा आयोग परीक्षा विशेष नमुना प्रश्नपत्र`,
    examLevel: 'तह ४ र ५',
    mode,
    includeWatermark,
    includeCoverPage: false // Single set starts directly with set header
  });

  triggerPrintDocument(html);
}

/**
 * High-Level Method 3: Export All 10,000+ Question Bank (or selected modules)
 */
export async function exportAllQuestionBank(
  moduleIds: string[] = [], // Empty means all 10 modules
  mode: 'comprehensive' | 'exam' = 'comprehensive',
  includeWatermark: boolean = true,
  onProgress?: (percent: number, msg: string) => void
): Promise<void> {
  onProgress?.(10, '१०,०००+ प्रश्न भण्डार लोड गरिँदैछ...');

  const targetModules = moduleIds.length > 0 
    ? SYLLABUS_MODULES.filter(m => moduleIds.includes(m.id))
    : SYLLABUS_MODULES;

  const groups: PdfSetGroup[] = [];
  let processed = 0;

  for (const mod of targetModules) {
    onProgress?.(
      15 + Math.round((processed / targetModules.length) * 60),
      `मोड्युल तयार हुँदैछ: ${mod.nameNepali}...`
    );

    const questionsRaw = buildModuleRepository(mod.id, 1000);
    const questions = questionsRaw.map((q, idx) => normalizeQuizQuestion(q, idx));

    groups.push({
      title: mod.nameEnglish,
      nepaliTitle: mod.nameNepali,
      description: mod.description,
      targetLevel: mod.level,
      questions
    });

    processed++;
    // Small delay to keep UI reactive
    await new Promise(r => setTimeout(r, 20));
  }

  onProgress?.(80, '१०,०००+ प्रश्नहरूको A4 लेआउट, वाटरमार्क तथा कभर पेज निर्माण हुँदैछ...');

  const html = buildDocumentHtml(groups, {
    title: '१०,०००+ बृहत् वस्तुगत प्रश्न भण्डार (Mega Question Bank)',
    subtitle: 'नेपाल राष्ट्र बैंक, वाणिज्य बैंकहरू तथा लोकसेवा आयोगका लागि १० वटै आधिकारिक पाठ्यक्रम क्षेत्रहरूको बृहत् सङ्ग्रह',
    examLevel: 'तह ४ देखि तह १० (Assistant, Officer, Senior Officer & Managerial)',
    scopeDescription: '१० पाठ्यक्रम मोड्युलहरू • १०,०००+ वस्तुगत प्रश्नोत्तरहरू • पूर्ण व्याख्या सहित',
    mode,
    includeWatermark,
    includeCoverPage: true
  });

  onProgress?.(95, 'प्रिन्ट तथा सेभ-एज-पीडीएफ डायलग खुल्दैछ...');
  triggerPrintDocument(html);
  onProgress?.(100, 'सफलतापूर्वक सम्पन्न भयो!');
}

/**
 * High-Level Method 4: Export Admin CMS Questions
 */
export function exportAdminCmsQuestions(
  questions: Question[],
  filterCategory: string = 'all',
  mode: 'comprehensive' | 'exam' = 'comprehensive',
  includeWatermark: boolean = true
): void {
  const normQuestions = questions.map((q, idx) => normalizeCmsQuestion(q, idx));

  const group: PdfSetGroup = {
    title: `Admin Question Bank (${filterCategory === 'all' ? 'All Categories' : filterCategory})`,
    nepaliTitle: `प्रशासनिक प्रश्न भण्डार (${filterCategory === 'all' ? 'सबै विधा' : filterCategory})`,
    description: `कुल ${questions.length} प्रश्नहरू • व्यवस्थापन तथा परीक्षा तयारी`,
    questions: normQuestions
  };

  const html = buildDocumentHtml([group], {
    title: 'बैंकिङ तयारी नेपाल - प्रश्न भण्डार (Question Bank Export)',
    subtitle: 'प्रशासनिक CMS बाट प्रमाणित तथा सम्पादित आधिकारिक प्रश्नोत्तर सङ्ग्रह',
    examLevel: 'तह ४ - १०',
    mode,
    includeWatermark,
    includeCoverPage: questions.length > 50
  });

  triggerPrintDocument(html);
}
