/**
 * PDF Export Helper for AI Study Notes & Exam Reviews
 * Generates an ultra-clean, beautifully typeset printable study sheet and triggers print/save-as-PDF.
 */

export interface ExportPdfOptions {
  title: string;
  topic?: string;
  content: string;
  examLevel?: string;
  generatedDate?: string;
  mode?: string;
}

/**
 * Strips markdown symbols for plain text conversion where needed
 */
function markdownToCleanHtml(markdown: string): string {
  if (!markdown) return '';

  let html = markdown;

  // Escape HTML tags to prevent XSS (except intended inline tags)
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h3 style="font-size: 16px; font-weight: 800; color: #065f46; margin: 18px 0 8px 0; border-left: 4px solid #059669; padding-left: 10px;">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 style="font-size: 19px; font-weight: 800; color: #0f172a; margin: 22px 0 10px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 style="font-size: 23px; font-weight: 900; color: #0B2046; margin: 24px 0 12px 0;">$1</h1>');

  // Bold & Italics
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #0f172a; font-weight: 700;">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em style="color: #334155;">$1</em>');

  // Markdown tables (simple conversion)
  html = html.replace(/((?:\|[^\n]+\|\r?\n?)+)/g, (tableBlock) => {
    const rows = tableBlock.trim().split('\n');
    let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; border: 1px solid #cbd5e1;">';
    
    rows.forEach((row, idx) => {
      if (row.includes('---')) return; // separator row
      const cols = row.split('|').filter((_, cIdx, arr) => cIdx > 0 && cIdx < arr.length - 1);
      if (cols.length === 0) return;

      const isHeader = idx === 0;
      tableHtml += `<tr style="${isHeader ? 'background-color: #f1f5f9; font-weight: bold;' : idx % 2 === 0 ? 'background-color: #f8fafc;' : ''}">`;
      cols.forEach(col => {
        const tag = isHeader ? 'th' : 'td';
        tableHtml += `<${tag} style="border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left;">${col.trim()}</${tag}>`;
      });
      tableHtml += '</tr>';
    });

    tableHtml += '</table>';
    return tableHtml;
  });

  // Code / Pre blocks (ASCII diagrams)
  html = html.replace(/```(?:text|ascii|code)?\n([\s\S]*?)```/g, '<pre style="background: #0f172a; color: #34d399; padding: 12px 16px; border-radius: 8px; font-family: monospace; font-size: 12px; overflow-x: auto; margin: 14px 0; line-height: 1.4;">$1</pre>');

  // Unordered list items
  html = html.replace(/^[ \t]*[-*][ \t]+(.*$)/gim, '<li style="margin-bottom: 6px; line-height: 1.6; color: #1e293b;">$1</li>');
  html = html.replace(/((?:<li style="[^"]*">.*?<\/li>\s*)+)/g, '<ul style="padding-left: 20px; margin: 10px 0;">$1</ul>');

  // Paragraphs
  html = html.replace(/\n\n+/g, '</p><p style="margin: 10px 0; line-height: 1.7; color: #334155; font-size: 14px;">');
  html = `<p style="margin: 10px 0; line-height: 1.7; color: #334155; font-size: 14px;">${html}</p>`;

  return html;
}

/**
 * Export Study Note to Clean PDF via Browser Print
 */
export function exportStudyNotesToPdf(options: ExportPdfOptions): void {
  const {
    title = 'AI Study Notes',
    topic = 'बैंकिङ तथा लोकसेवा परीक्षा तयारी',
    content,
    examLevel = 'सहायक तथा अधिकृत तह (Level 4-10)',
    generatedDate = new Date().toLocaleDateString('ne-NP')
  } = options;

  const formattedHtml = markdownToCleanHtml(content);

  const printDocument = `
    <!DOCTYPE html>
    <html lang="ne">
      <head>
        <meta charset="utf-8" />
        <title>${title} - Banking Tayari Nepal</title>
        <style>
          @page {
            size: A4;
            margin: 18mm 16mm 18mm 16mm;
          }
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Devanagari', sans-serif;
            color: #1e293b;
            background: #ffffff;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            font-size: 13.5px;
          }
          .header-box {
            border-bottom: 2.5px solid #0B2046;
            padding-bottom: 12px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .brand-title {
            font-size: 22px;
            font-weight: 900;
            color: #0B2046;
            letter-spacing: -0.5px;
            margin: 0;
          }
          .brand-sub {
            font-size: 11px;
            color: #C8102E;
            font-weight: 800;
            letter-spacing: 2px;
            margin-top: 2px;
          }
          .meta-box {
            text-align: right;
            font-size: 11px;
            color: #64748b;
          }
          .topic-banner {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: 5px solid #0B2046;
            padding: 12px 16px;
            border-radius: 6px;
            margin-bottom: 22px;
          }
          .topic-title {
            font-size: 16px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 4px 0;
          }
          .topic-level {
            font-size: 11.5px;
            color: #475569;
            font-weight: 600;
          }
          .content-body {
            margin-top: 10px;
          }
          .footer-box {
            margin-top: 36px;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            font-size: 10.5px;
            color: #94a3b8;
          }
          /* WATERMARK OVERLAY */
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
            opacity: 0.045;
            user-select: none;
          }
          .watermark-row {
            display: flex;
            gap: 50px;
            transform: rotate(-32deg) scale(1.15);
            white-space: nowrap;
          }
          .watermark-text {
            font-size: 24pt;
            font-weight: 900;
            color: #0B2046;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .watermark-layer {
              display: flex !important;
              position: fixed !important;
              opacity: 0.05 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
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
            <span class="watermark-text">OFFICIAL STUDY MATERIAL</span>
          </div>
        </div>

        <div style="position: relative; z-index: 1;">
        <div class="header-box">
          <div style="display: flex; align-items: center; gap: 12px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 340" style="height: 38px; width: auto;">
              <g transform="translate(15, 12)">
                <path d="M 28 8 L 175 8 C 218 8, 252 32, 252 76 C 252 112, 222 136, 182 144 C 226 154, 254 186, 254 228 C 254 246, 246 264, 234 278 C 225 272, 212 266, 196 264 C 224 250, 236 232, 236 212 C 236 178, 210 156, 166 156 L 76 156 L 76 250 L 28 250 Z" fill="#0B2046" />
                <path d="M 76 44 L 165 44 C 188 44, 206 56, 206 76 C 206 96, 188 110, 165 110 L 76 110 Z" fill="#FFFFFF" />
                <path d="M 136 308 C 178 288, 222 266, 260 224 C 260 248, 246 280, 218 300 C 190 316, 160 316, 136 308 Z" fill="#E63946" />
              </g>
            </svg>
            <div>
              <h1 class="brand-title">BANKING TAYARI NEPAL</h1>
              <div class="brand-sub">PREPARE • PRACTICE • PERFORM • OFFICIAL STUDY NOTES</div>
            </div>
          </div>
          <div class="meta-box">
            <div><strong>स्रोत:</strong> आधिकारिक Study Mentor</div>
            <div><strong>मिति:</strong> ${generatedDate}</div>
            <div><strong>तह:</strong> ${examLevel}</div>
          </div>
        </div>

        <div class="topic-banner">
          <div class="topic-title">📌 ${topic}</div>
          <div class="topic-level">नेपाल राष्ट्र बैंक, वाणिज्य बैंकहरू, सार्वजनिक संस्थान तथा लोकसेवा परीक्षा तयारी सामग्री</div>
        </div>

        <div class="content-body">
          ${formattedHtml}
        </div>

        <div class="footer-box">
          <div>बैंकिङ्ग तयारी नेपाल • www.bankingtayari.com.np</div>
          <div>लोकसेवा तथा बैंकिङ परीक्षामा उच्चतम सफलताको लागि आधिकारिक अध्ययन सामग्री</div>
        </div>
        </div>
      </body>
    </html>
  `;

  // Create an invisible iframe to print smoothly without leaving the screen
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
  doc.write(printDocument);
  doc.close();

  setTimeout(() => {
    try {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
    } catch (e) {
      console.warn('Iframe print notice:', e);
    } finally {
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 2000);
    }
  }, 400);
}
