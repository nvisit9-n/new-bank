import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';
import { BANKING_EXAM_TOPICS_DATA, BankingExamTopicNote } from '../src/data/bankingExamNotesData';

function buildJsPdf(note: BankingExamTopicNote): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const addHeaderAndWatermark = (pageNum: number) => {
    // Watermark
    doc.saveGraphicsState();
    doc.setTextColor(230, 235, 245);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('BANKING TAYARI NEPAL', pageWidth / 2, pageHeight / 2, {
      align: 'center',
      angle: 45
    });
    doc.restoreGraphicsState();

    // Top Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(11, 32, 70);
    doc.text('BANKING TAYARI NEPAL • OFFICIAL STUDY NOTES HUB', margin, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 130, 150);
    doc.text(`Topic ${note.topicNumber}: ${note.titleEn}`, pageWidth - margin, 12, { align: 'right' });

    // Divider
    doc.setDrawColor(200, 210, 230);
    doc.setLineWidth(0.4);
    doc.line(margin, 14, pageWidth - margin, 14);

    // Footer
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFontSize(7.5);
    doc.setTextColor(140, 150, 170);
    doc.text('Confidential & Copyright © Banking Tayari Nepal • Zero-Error Exam Platform', margin, pageHeight - 8);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  };

  let currentPage = 1;
  addHeaderAndWatermark(currentPage);
  cursorY = 22;

  // Title Box
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, cursorY, contentWidth, 24, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`TOPIC ${note.topicNumber}: ${note.titleEn.toUpperCase()}`, margin + 5, cursorY + 8);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 220, 255);
  doc.text(`Paper: ${note.paperReference} | Weightage: ${note.examWeightage}`, margin + 5, cursorY + 15);

  doc.setTextColor(251, 191, 36);
  doc.setFontSize(8.5);
  doc.text(`Nepali Title: ${note.titleNe} (${note.subtitleNe})`, margin + 5, cursorY + 20);

  cursorY += 30;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - 20) {
      doc.addPage();
      currentPage++;
      addHeaderAndWatermark(currentPage);
      cursorY = 22;
    }
  };

  // Section 1
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(11, 32, 70);
  doc.text('1. EXECUTIVE SUMMARY & KEY EXAM TAKEAWAYS', margin, cursorY);
  cursorY += 5;

  doc.setFillColor(245, 248, 255);
  doc.setDrawColor(210, 225, 250);
  doc.roundedRect(margin, cursorY, contentWidth, 20, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 50, 70);
  const summaryLines = doc.splitTextToSize(note.summaryNe, contentWidth - 6);
  doc.text(summaryLines, margin + 3, cursorY + 5);
  cursorY += 24;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('High-Yield Exam Points:', margin, cursorY);
  cursorY += 4;

  note.keyTakeaways.forEach(point => {
    checkPageBreak(12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 60, 80);
    const pointLines = doc.splitTextToSize(`• ${point}`, contentWidth - 4);
    doc.text(pointLines, margin + 2, cursorY);
    cursorY += pointLines.length * 4 + 1;
  });

  cursorY += 4;

  // Section 2: Formulas
  if (note.ratios && note.ratios.length > 0) {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(11, 32, 70);
    doc.text('2. CORE FINANCIAL RATIOS & FORMULAS (NRB / BASEL NORMS)', margin, cursorY);
    cursorY += 6;

    note.ratios.forEach(ratio => {
      checkPageBreak(22);
      doc.setFillColor(250, 250, 252);
      doc.setDrawColor(220, 225, 235);
      doc.roundedRect(margin, cursorY, contentWidth, 18, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(11, 32, 70);
      doc.text(`${ratio.nameEn} (${ratio.nameNe})`, margin + 3, cursorY + 5);

      doc.setFontSize(8);
      doc.setTextColor(180, 83, 9);
      doc.text(`Benchmark: ${ratio.standardBenchmark}`, pageWidth - margin - 3, cursorY + 5, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(40, 50, 70);
      doc.text(`Formula: ${ratio.formulaLatex.replace(/\$\$/g, '')}`, margin + 3, cursorY + 10);
      doc.text(`Significance: ${ratio.significanceNe}`, margin + 3, cursorY + 14);

      cursorY += 21;
    });
  }

  // Section 3: Comparison Table
  if (note.comparisonTable) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(11, 32, 70);
    doc.text(`3. COMPARISON MATRIX: ${note.comparisonTable.titleNe.toUpperCase()}`, margin, cursorY);
    cursorY += 6;

    doc.setFillColor(15, 23, 42);
    doc.rect(margin, cursorY, contentWidth, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');

    const colWidth = contentWidth / (note.comparisonTable.column3Header ? 3 : 2);
    doc.text(note.comparisonTable.column1Header, margin + 2, cursorY + 5);
    doc.text(note.comparisonTable.column2Header, margin + colWidth + 2, cursorY + 5);
    if (note.comparisonTable.column3Header) {
      doc.text(note.comparisonTable.column3Header, margin + colWidth * 2 + 2, cursorY + 5);
    }
    cursorY += 7;

    note.comparisonTable.rows.forEach((row, rIdx) => {
      checkPageBreak(16);
      doc.setFillColor(rIdx % 2 === 0 ? 255 : 248, 250, 253);
      doc.rect(margin, cursorY, contentWidth, 12, 'F');
      doc.setDrawColor(225, 230, 240);
      doc.rect(margin, cursorY, contentWidth, 12, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      const paramText = doc.splitTextToSize(`${row.parameterNe} (${row.parameterEn})`, colWidth - 4);
      doc.text(paramText, margin + 2, cursorY + 4);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(50, 60, 80);
      const col1Lines = doc.splitTextToSize(row.column1Value, colWidth - 4);
      doc.text(col1Lines, margin + colWidth + 2, cursorY + 4);

      if (row.column2Value && note.comparisonTable?.column3Header) {
        const col2Lines = doc.splitTextToSize(row.column2Value, colWidth - 4);
        doc.text(col2Lines, margin + colWidth * 2 + 2, cursorY + 4);
      }
      cursorY += 12;
    });
  }

  // Section 4: Questions
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(11, 32, 70);
  doc.text('4. LOKSEWA / BANKING PROBABLE EXAM QUESTIONS (५ र १० अङ्क)', margin, cursorY);
  cursorY += 6;

  note.probableExamQuestions.forEach((q, qIdx) => {
    checkPageBreak(25);
    doc.setFillColor(254, 249, 195);
    doc.setDrawColor(234, 179, 8);
    doc.roundedRect(margin, cursorY, contentWidth, 10, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(113, 63, 18);
    doc.text(`Q${qIdx + 1} [${q.marks} Marks - ${q.examLevel}]: ${q.questionNe}`, margin + 3, cursorY + 6);
    cursorY += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(60, 70, 90);
    q.modelAnswerFramework.forEach(framework => {
      checkPageBreak(8);
      const lines = doc.splitTextToSize(`✓ ${framework}`, contentWidth - 6);
      doc.text(lines, margin + 4, cursorY);
      cursorY += lines.length * 3.5 + 1;
    });
    cursorY += 3;
  });

  return doc;
}

const outDir = path.resolve(process.cwd(), 'public/notes-pdf');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Generating pre-built PDF assets for 5 topics...');
BANKING_EXAM_TOPICS_DATA.forEach(topic => {
  const doc = buildJsPdf(topic);
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  
  // Write with both standard ID name and human filename
  const idPath = path.join(outDir, `${topic.id}.pdf`);
  const filenamePath = path.join(outDir, topic.pdfFilename);
  
  fs.writeFileSync(idPath, pdfBuffer);
  fs.writeFileSync(filenamePath, pdfBuffer);
  console.log(`Generated: ${idPath} (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);
});

// Also write a metadata manifest for offline notes
const notesManifest = {
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  totalTopics: BANKING_EXAM_TOPICS_DATA.length,
  topics: BANKING_EXAM_TOPICS_DATA.map(t => ({
    id: t.id,
    topicNumber: t.topicNumber,
    titleNe: t.titleNe,
    titleEn: t.titleEn,
    pdfFilename: t.pdfFilename,
    pdfUrl: `/notes-pdf/${t.id}.pdf`,
    readTime: t.readTime,
    examWeightage: t.examWeightage
  }))
};

fs.writeFileSync(
  path.join(process.cwd(), 'public/data/studyNotesManifest.json'),
  JSON.stringify(notesManifest, null, 2)
);
console.log('Successfully generated public/data/studyNotesManifest.json');
