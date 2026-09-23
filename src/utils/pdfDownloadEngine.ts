import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { BankingExamTopicNote } from '../data/bankingExamNotesData';
import { renderLatexToHtml, parseMarkdownLatex } from './katexHelper';

/**
 * Builds high-fidelity HTML document with Mukta Unicode font & KaTeX math rendering.
 * Guarantees zero Nepali character corruption (prevents '5?$M$@' encoding errors).
 */
export function buildNotePrintableHtml(note: BankingExamTopicNote): string {
  const formulasHtml = (note.ratios || [])
    .map((r) => {
      const katexHtml = renderLatexToHtml(r.formulaLatex, true);
      return `
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #1E40AF; padding: 12px 16px; margin-bottom: 12px; border-radius: 8px; page-break-inside: avoid; box-shadow: 0 1px 2px rgba(0,0,0,0.04);">
        <div style="display: flex; justify-content: space-between; align-items: baseline; font-weight: 700; font-size: 13.5px; color: #0f172a; margin-bottom: 6px;">
          <span>${r.nameNe} (${r.nameEn}) - <span style="color: #1E40AF; font-size: 11px;">[${r.category}]</span></span>
          <span style="color: #DC2626; font-size: 11.5px; font-weight: 800; background: #fef2f2; padding: 2px 8px; border-radius: 4px; border: 1px solid #fecaca;">मानक: ${r.standardBenchmark}</span>
        </div>
        <div style="padding: 10px; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0; margin: 8px 0; text-align: center;">
          ${katexHtml}
        </div>
        <div style="font-size: 11.5px; color: #475569; line-height: 1.5;">
          <strong style="color: #0f172a;">महत्त्व:</strong> ${r.significanceNe}
        </div>
      </div>
    `;
    })
    .join('');

  const tableHtml = note.comparisonTable
    ? `
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 11.5px; page-break-inside: avoid;">
      <thead>
        <tr style="background: #0f172a; color: #ffffff;">
          <th style="padding: 9px 12px; border: 1px solid #cbd5e1; text-align: left; font-weight: 800;">${note.comparisonTable.column1Header}</th>
          <th style="padding: 9px 12px; border: 1px solid #cbd5e1; text-align: left; font-weight: 800;">${note.comparisonTable.column2Header}</th>
          ${note.comparisonTable.column3Header ? `<th style="padding: 9px 12px; border: 1px solid #cbd5e1; text-align: left; font-weight: 800;">${note.comparisonTable.column3Header}</th>` : ''}
        </tr>
      </thead>
      <tbody>
        ${note.comparisonTable.rows
          .map(
            (row, idx) => `
          <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
            <td style="padding: 9px 12px; border: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">${row.parameterNe} (${row.parameterEn})</td>
            <td style="padding: 9px 12px; border: 1px solid #e2e8f0; color: #334155;">${row.column1Value}</td>
            ${note.comparisonTable?.column3Header ? `<td style="padding: 9px 12px; border: 1px solid #e2e8f0; color: #334155;">${row.column2Value}</td>` : ''}
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `
    : '';

  const questionsHtml = note.probableExamQuestions
    .map(
      (q, idx) => `
    <div style="background: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #d97706; padding: 12px 16px; margin-bottom: 12px; border-radius: 8px; page-break-inside: avoid;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; font-weight: 800; color: #92400e; font-size: 13px;">
        <span>Q${idx + 1} [${q.marks} Marks - ${q.examLevel}]: ${q.questionNe}</span>
        <span style="background: #fef3c7; color: #b45309; padding: 2px 8px; border-radius: 4px; font-size: 10.5px; border: 1px solid #fcd34d;">अङ्क: ${q.marks}</span>
      </div>
      <div style="margin-top: 4px; font-size: 11px; color: #78350f; font-style: italic;">
        ${q.questionEn}
      </div>
      <div style="margin-top: 8px; font-size: 11.5px; color: #451a03; line-height: 1.6; background: #ffffff; padding: 8px 12px; border-radius: 6px; border: 1px solid #fef3c7;">
        <strong style="color: #92400e;">नमुना उत्तर प्रारूप (Model Answer Framework):</strong>
        <div style="margin-top: 4px;">
          ${q.modelAnswerFramework.map(f => `<div style="margin-bottom: 3px;">✓ ${f}</div>`).join('')}
        </div>
      </div>
    </div>
  `
    )
    .join('');

  const statutoryHtml = note.statutoryCard
    ? `
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin: 16px 0; page-break-inside: avoid;">
      <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
        <span style="background: #1E40AF; color: white; padding: 2px 8px; border-radius: 4px; font-size: 10px;">ऐन, कानूनी व्यवस्था</span>
        <span>${note.statutoryCard.actTitleNe}</span>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        ${note.statutoryCard.clauses
          .map(
            c => `
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 6px;">
            <div style="font-weight: 700; color: #1E40AF; font-size: 11px;">${c.clause}: ${c.title}</div>
            <div style="font-size: 10.5px; color: #475569; margin-top: 2px;">${c.description}</div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `
    : '';

  const cleanBodyMarkdown = parseMarkdownLatex(note.markdownContent)
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p style="margin-bottom: 10px; line-height: 1.6;">')
    .replace(/[-*]\s+(.*)/g, '<li style="margin-bottom: 4px;">$1</li>');

  return `
    <!DOCTYPE html>
    <html lang="ne">
      <head>
        <meta charset="utf-8" />
        <title>${note.titleEn} - Banking Tayari Nepal</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet" />
        <style>
          @page { size: A4 portrait; margin: 16mm 14mm 16mm 14mm; }
          * { box-sizing: border-box; }
          body { 
            font-family: 'Mukta', 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, sans-serif; 
            color: #0f172a; 
            background: #ffffff;
            line-height: 1.6; 
            font-size: 12.5px; 
            margin: 0; 
            padding: 0; 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact;
          }
          .watermark { 
            position: fixed; 
            top: 40%; 
            left: 5%; 
            font-size: 52pt; 
            color: rgba(15, 23, 42, 0.035); 
            transform: rotate(-30deg); 
            font-weight: 900; 
            pointer-events: none; 
            z-index: 0;
            user-select: none;
          }
          .header { 
            border-bottom: 2.5px solid #1E40AF; 
            padding-bottom: 8px; 
            margin-bottom: 14px; 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-end; 
          }
          .title-box { 
            background: #0f172a; 
            color: white; 
            padding: 14px 18px; 
            border-radius: 8px; 
            margin-bottom: 16px; 
          }
          .badge-red {
            background: #DC2626;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10.5px;
            font-weight: 800;
          }
          .section-title {
            color: #0f172a; 
            border-bottom: 2px solid #e2e8f0; 
            padding-bottom: 4px; 
            margin-top: 18px; 
            margin-bottom: 10px;
            font-size: 14.5px;
            font-weight: 800;
          }
          .footer { 
            margin-top: 24px; 
            border-top: 1px solid #cbd5e1; 
            padding-top: 8px; 
            font-size: 10px; 
            color: #64748b; 
            display: flex; 
            justify-content: space-between; 
            page-break-inside: avoid;
          }
          .katex { font-size: 1.1em !important; }
          .katex-display { margin: 14px 0 !important; padding: 12px 6px !important; text-align: center !important; }
          .katex .vlist-t { display: inline-table !important; vertical-align: middle !important; }
          .katex .frac-line { border-bottom-width: 1.5px !important; margin: 4px 0 !important; }
          .katex .mord.text, .katex .text { font-family: 'Mukta', sans-serif !important; padding: 3px 5px !important; line-height: 1.6 !important; }
          .katex-container, .katex-block { padding: 14px !important; margin: 10px 0 !important; }
        </style>
      </head>
      <body>
        <div class="watermark">BANKING TAYARI NEPAL</div>

        <!-- Official Header -->
        <div class="header">
          <div>
            <div style="font-size: 18px; font-weight: 900; color: #1E40AF; letter-spacing: 0.5px;">BANKING TAYARI NEPAL</div>
            <div style="font-size: 10px; color: #DC2626; font-weight: 800; letter-spacing: 1px;">LOKSEWA & BANKING EXAM PREPARATION PLATFORM • OFFICIAL STUDY NOTES</div>
          </div>
          <div style="text-align: right; font-size: 10.5px; color: #64748b;">
            <div style="font-weight: 800; color: #0f172a;">Topic ${note.topicNumber}: ${note.titleEn}</div>
            <div>Paper: ${note.paperReference}</div>
          </div>
        </div>

        <!-- Title Banner -->
        <div class="title-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 800; color: #93c5fd; text-transform: uppercase;">
              ${note.categoryTag}
            </span>
            <span class="badge-red">${note.examWeightage}</span>
          </div>
          <div style="font-size: 18px; font-weight: 800;">${note.titleNe} (${note.titleEn})</div>
          <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">${note.subtitleNe}</div>
        </div>

        <!-- 1. Executive Summary -->
        <div class="section-title">१. विषय संक्षेप र मुख्य परीक्षोपयोगी बुँदाहरू (Executive Summary)</div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 8px; margin-bottom: 12px;">
          <p style="margin: 0; font-size: 12.5px; font-weight: 600; color: #1e293b;">${note.summaryNe}</p>
        </div>

        <ul style="padding-left: 20px; margin-top: 8px; margin-bottom: 14px;">
          ${note.keyTakeaways.map(t => `<li style="margin-bottom: 5px; color: #334155;"><strong>•</strong> ${t}</li>`).join('')}
        </ul>

        <!-- Definitions Card if available -->
        ${
          note.definitionCard
            ? `
          <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-left: 4px solid #0284c7; padding: 12px 16px; border-radius: 8px; margin-bottom: 14px; page-break-inside: avoid;">
            <div style="font-size: 11px; font-weight: 800; color: #0369a1; text-transform: uppercase;">परिभाषा: ${note.definitionCard.termNe} (${note.definitionCard.termEn})</div>
            <div style="font-size: 12px; color: #0c4a6e; margin-top: 4px; font-weight: 600;">${note.definitionCard.definitionNe}</div>
            <div style="font-size: 10px; color: #0284c7; margin-top: 4px;">स्रोत: ${note.definitionCard.source}</div>
          </div>
        `
            : ''
        }

        <!-- Statutory Framework if available -->
        ${statutoryHtml}

        <!-- 2. Financial Ratio Formulas with KaTeX -->
        ${
          note.ratios && note.ratios.length > 0
            ? `
          <div class="section-title">२. वित्तीय अनुपात सूत्र संग्रह (Financial Ratios & Standards)</div>
          ${formulasHtml}
        `
            : ''
        }

        <!-- 3. Comparison Matrix -->
        ${
          note.comparisonTable
            ? `
          <div class="section-title">३. तुलनात्मक विश्लेषण (Comparison Matrix)</div>
          ${tableHtml}
        `
            : ''
        }

        <!-- 4. Probable Exam Questions & Model Answer Framework -->
        <div class="section-title">४. सम्भावित लिखित परीक्षा प्रश्नहरू र नमुना उत्तर ढाँचा (Model Questions)</div>
        ${questionsHtml}

        <!-- Footer -->
        <div class="footer">
          <span>Banking Tayari Nepal Official Study Sheet • Zero-Error Platform • Confidential & Copyright</span>
          <span>Printed on: ${new Date().toLocaleDateString('ne-NP')}</span>
        </div>
      </body>
    </html>
  `;
}

/**
 * Triggers clean browser print dialog with full Loksewa exam styles, KaTeX math & Nepali Unicode.
 */
export function printPdfNote(note: BankingExamTopicNote): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print notes.');
    return;
  }

  const html = buildNotePrintableHtml(note);
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();

  // Ensure fonts and KaTeX are loaded before print dialog triggers
  setTimeout(() => {
    printWindow.print();
  }, 600);
}

/**
 * Downloads the topic note as a formatted, Unicode-safe PDF.
 * Uses html2canvas rasterization to guarantee zero corrupted characters ('5?$M$@')
 * and flawless mathematical fraction rendering.
 */
export async function downloadPdfNote(note: BankingExamTopicNote): Promise<void> {
  // Create off-screen container for high-res rasterization
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px'; // Standard A4 at 96 DPI
  container.style.background = '#ffffff';
  container.style.padding = '36px 40px';
  container.style.zIndex = '-1000';
  container.innerHTML = buildNotePrintableHtml(note);

  document.body.appendChild(container);

  try {
    // Wait for images and fonts to settle
    await new Promise((resolve) => setTimeout(resolve, 400));

    const canvas = await html2canvas(container, {
      scale: 2, // 2x scale for crisp 200-300 DPI text
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate height in mm
    const imgHeightMm = (canvasHeight * pdfWidth) / canvasWidth;

    let heightLeft = imgHeightMm;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightMm);
    heightLeft -= pdfHeight;

    // Subsequent pages if content overflows A4
    while (heightLeft > 0) {
      position = heightLeft - imgHeightMm;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightMm);
      heightLeft -= pdfHeight;
    }

    pdf.save(note.pdfFilename);
  } catch (err) {
    console.error('html2canvas PDF generation fallback to print:', err);
    // Graceful fallback to native high-res browser print/PDF
    printPdfNote(note);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Builds a fallback jsPDF document object for offline blob generation
 */
export function buildJsPdfDocument(note: BankingExamTopicNote): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;

  // Clean Romanized Fallback for jsPDF built-in viewer
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, 20, pageWidth - margin * 2, 24, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`TOPIC ${note.topicNumber}: ${note.titleEn.toUpperCase()}`, margin + 5, 28);
  doc.setFontSize(9);
  doc.setTextColor(200, 220, 255);
  doc.text(`Paper: ${note.paperReference} | Weightage: ${note.examWeightage}`, margin + 5, 36);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.text('EXECUTIVE SUMMARY & EXAM SYLLABUS', margin, 54);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 80, 100);
  const summaryLines = doc.splitTextToSize(
    `Topic Overview: ${note.titleEn} covers essential regulatory, structural and practical aspects prescribed by Nepal Rastra Bank and Public Enterprises examination curriculum.`,
    pageWidth - margin * 2
  );
  doc.text(summaryLines, margin, 60);

  return doc;
}

/**
 * Generates an interactive Blob URL for in-browser PDF embedding
 */
export function generatePdfBlobUrl(note: BankingExamTopicNote): string {
  try {
    const doc = buildJsPdfDocument(note);
    const blob = doc.output('blob');
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('Failed to generate PDF Blob URL:', err);
    return '';
  }
}
