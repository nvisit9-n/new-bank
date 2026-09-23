import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, HelpCircle, FileText, CheckCircle, Info } from 'lucide-react';
import { renderContentWithKatex } from '../../utils/katexHelper';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Cleans plain text separators and ensures markdown tables have proper syntax
 * so remark-gfm parses them seamlessly.
 */
function cleanAndNormalizeMarkdown(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Remove long divider lines like ==================== or --------------------
  cleaned = cleaned.replace(/^[ \t]*[=_-]{3,}[ \t]*$/gm, '');

  // 2. Normalize standalone "तालिका X: ..." or "Table X: ..." into markdown heading if needed
  cleaned = cleaned.replace(
    /(?:^|\n)(तालिका\s+[०-९0-9]+[^\n]*)(?=\n)/g,
    '\n\n### $1\n'
  );

  // 3. Normalize "X अङ्कको मोडल उत्तर ..." into markdown heading
  cleaned = cleaned.replace(
    /(?:^|\n)([०-९0-9]+\s*अङ्कको\s+मोडल\s+उत्तर[^\n]*)(?=\n)/g,
    '\n\n### $1\n'
  );

  // 4. Ensure tables have an empty newline before the table header row
  // remark-gfm requires a preceding blank line before a markdown table
  cleaned = cleaned.replace(
    /([^\n])\n(\|[^\n]+\|\n\|[\s:|-]+\|)/g,
    '$1\n\n$2'
  );

  // 5. Ensure an empty newline after a table block
  cleaned = cleaned.replace(
    /(\|[^\n]+\|)\n([^\n|])/g,
    '$1\n\n$2'
  );

  // 6. Reduce excessive consecutive blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}

/**
 * Ultra-High Contrast Markdown Renderer with custom Tailwind styling for
 * effortless readability: pure white (#FFFFFF) / light slate (#F1F5F9) body text in dark mode,
 * crisp bright cyan (#38BDF8) and emerald (#4ADE80) headings and act citations.
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const normalizedContent = cleanAndNormalizeMarkdown(content);

  return (
    <div className={`prose-content max-w-none text-slate-900 dark:text-[#FFFFFF] ${className}`}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Styled table wrapper with horizontal scroll and clean borders
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-4 max-w-full rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm bg-white dark:bg-slate-900 transition-all scrollbar-thin">
              <table {...props} className={`w-full min-w-[320px] text-left border-collapse text-xs sm:text-sm text-slate-900 dark:text-[#F1F5F9] ${props.className || ''}`}>
                {children}
              </table>
            </div>
          ),

          // Header row with subtle neutral background
          thead: ({ children, ...props }) => (
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-[#FFFFFF] font-black border-b border-slate-200 dark:border-slate-700" {...props}>
              {children}
            </thead>
          ),

          // Table header cell with crisp typography and high contrast
          th: ({ children, ...props }) => (
            <th className="p-3.5 sm:p-4 text-xs sm:text-sm font-black text-slate-900 dark:text-[#FFFFFF] uppercase tracking-wide text-left border-r border-slate-200/80 dark:border-slate-700/60 last:border-r-0 whitespace-nowrap bg-slate-100 dark:bg-slate-800" {...props}>
              {children}
            </th>
          ),

          // Table body
          tbody: ({ children, ...props }) => (
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800" {...props}>
              {children}
            </tbody>
          ),

          // Table row with alternating subtle shading and hover effect
          tr: ({ children, ...props }) => (
            <tr className="hover:bg-sky-50/60 dark:hover:bg-slate-800/80 transition-colors even:bg-slate-50/80 dark:even:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800/80 last:border-b-0" {...props}>
              {children}
            </tr>
          ),

          // Table data cell with high contrast
          td: ({ children, ...props }) => (
            <td className="p-3.5 sm:p-4 text-xs sm:text-sm text-slate-900 dark:text-[#FFFFFF] leading-relaxed border-r border-slate-200/60 dark:border-slate-800 last:border-r-0" {...props}>
              {renderContentWithKatex(children)}
            </td>
          ),

          // Headings with crisp brightness (#38BDF8 / #4ADE80)
          h1: ({ children, ...props }) => (
            <h1 className="border-l-4 border-[#38BDF8] pl-3.5 font-black text-xl sm:text-2xl text-slate-900 dark:text-[#FFFFFF] my-5 tracking-tight" {...props}>
              {children}
            </h1>
          ),

          h2: ({ children, ...props }) => (
            <h2 className="border-l-4 border-[#4ADE80] pl-3.5 font-bold text-lg sm:text-xl text-slate-900 dark:text-[#FFFFFF] my-4 tracking-tight" {...props}>
              {children}
            </h2>
          ),

          h3: ({ children, ...props }) => (
            <h3 className="border-l-4 border-[#38BDF8] pl-3 font-bold text-base sm:text-lg text-sky-800 dark:text-[#38BDF8] my-3.5" {...props}>
              {children}
            </h3>
          ),

          h4: ({ children, ...props }) => (
            <h4 className="border-l-4 border-[#4ADE80] pl-3 font-bold text-sm sm:text-base text-emerald-800 dark:text-[#4ADE80] my-2.5" {...props}>
              {children}
            </h4>
          ),

          // Paragraph with automatic Callout / Question / Exam Tip / Formula / Legal Clause detection
          p: ({ children, ...props }) => {
            const textContent = React.Children.toArray(children)
              .map(child => (typeof child === 'string' ? child : ''))
              .join('')
              .trim();

            // NRB IT Guidelines, Legal Clauses, Acts, NAS 1, Golden Rules & Formulas Callout Boxes
            if (
              textContent.startsWith('NRB IT Guidelines') ||
              textContent.startsWith('IT Guidelines') ||
              textContent.startsWith('नेपाल राष्ट्र बैंक IT Guidelines') ||
              textContent.startsWith('कानुनी व्यवस्था') ||
              textContent.startsWith('संवैधानिक आर्थिक व्यवस्थाहरू') ||
              textContent.startsWith('ऐनका मुख्य व्यवस्थाहरू') ||
              textContent.startsWith('कम्पनी ऐन') ||
              textContent.startsWith('बैंक तथा वित्तीय संस्था सम्बन्धी ऐन') ||
              textContent.startsWith('BAFIA') ||
              textContent.startsWith('NAS 1') ||
              textContent.startsWith('NFRS') ||
              textContent.startsWith('गोल्डेन रुल्स') ||
              textContent.startsWith('Golden Rules') ||
              textContent.startsWith('लेखा समीकरण') ||
              textContent.startsWith('सूत्र संग्रह:') ||
              textContent.startsWith('सूत्र:') ||
              textContent.startsWith('Formula:') ||
              textContent.startsWith('Formulas:') ||
              textContent.startsWith('दफा ') ||
              textContent.startsWith('धारा ') ||
              textContent.startsWith('Section ') ||
              textContent.startsWith('Clause ')
            ) {
              return (
                <div className="bg-sky-50/90 border-l-4 border-[#38BDF8] dark:bg-slate-900/95 dark:border-[#38BDF8] p-4 rounded-r-xl my-4 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-black text-sky-800 dark:text-[#38BDF8] pb-1.5 border-b border-sky-200/60 dark:border-slate-800">
                    <FileText className="w-4 h-4 text-sky-600 dark:text-[#38BDF8] shrink-0" />
                    <span className="tracking-wide uppercase">ऐन, कानुनी व्यवस्था तथा दफा (Statutory Provision)</span>
                  </div>
                  <div className="text-sm sm:text-base leading-relaxed font-medium text-slate-900 dark:text-[#FFFFFF] pt-2">
                    {renderContentWithKatex(children)}
                  </div>
                </div>
              );
            }

            // Exam Tip / Note / Alert callout
            if (
              textContent.startsWith('📌') ||
              textContent.startsWith('Exam Tip') ||
              textContent.startsWith('परीक्षा टिप्स:') ||
              textContent.startsWith('मुख्य टिप्स:') ||
              textContent.startsWith('टिप्स:') ||
              textContent.startsWith('नोट:') ||
              textContent.startsWith('Note:')
            ) {
              return (
                <div className="my-4 p-4 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/50 text-slate-900 dark:text-[#FFFFFF] text-xs sm:text-sm leading-relaxed flex items-start gap-3 shadow-xs">
                  <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 font-sans text-slate-900 dark:text-[#FFFFFF] font-medium leading-relaxed">{children}</div>
                </div>
              );
            }

            // Question callout
            if (
              textContent.startsWith('प्रश्न:') ||
              textContent.startsWith('प्रश्न ') ||
              textContent.startsWith('Question:')
            ) {
              return (
                <div className="bg-slate-100 border border-slate-300 dark:bg-slate-900/95 dark:border-slate-700 p-4 rounded-xl my-3 text-slate-900 dark:text-[#FFFFFF] text-xs sm:text-sm leading-relaxed flex items-start gap-3 shadow-xs">
                  <HelpCircle className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
                  <div className="flex-1 font-bold text-slate-900 dark:text-[#FFFFFF] leading-relaxed">{children}</div>
                </div>
              );
            }

            // Answer Sheet Evaluation: Score / Rating Callout
            if (
              textContent.includes('प्राप्ताङ्क') ||
              textContent.includes('प्राप्ताङ्क:') ||
              textContent.includes('Score:') ||
              textContent.includes('अंक:')
            ) {
              return (
                <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent border-2 border-amber-500/50 dark:border-amber-400/40 text-slate-900 dark:text-[#FFFFFF] shadow-sm">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs">
                      📊 उत्तरपुस्तिका मूल्याङ्कन
                    </span>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                      लोकसेवा / बैंकिङ मानक
                    </span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#FFFFFF] leading-relaxed">
                    {children}
                  </div>
                </div>
              );
            }

            // Answer heading/lead callout
            if (
              textContent.startsWith('उत्तर:') ||
              textContent.startsWith('Answer:') ||
              textContent.startsWith('निष्कर्ष:')
            ) {
              return (
                <div className="my-3 p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border-l-4 border-[#4ADE80] text-slate-900 dark:text-[#FFFFFF] text-xs sm:text-sm leading-relaxed">
                  <div className="font-bold text-emerald-800 dark:text-[#4ADE80] mb-0.5">उत्तर तथा निष्कर्ष:</div>
                  <div className="text-slate-900 dark:text-[#FFFFFF] leading-relaxed">{children}</div>
                </div>
              );
            }

            // Strengths / Weaknesses callouts
            if (textContent.startsWith('✅ सबल पक्ष') || textContent.startsWith('सबल पक्षहरू')) {
              return (
                <div className="my-3 p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40 text-slate-900 dark:text-[#FFFFFF] text-xs sm:text-sm leading-relaxed">
                  <div className="font-bold text-emerald-700 dark:text-[#4ADE80] mb-1 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#4ADE80] shrink-0" />
                    <span>सबल पक्षहरू (Strengths):</span>
                  </div>
                  <div className="text-slate-900 dark:text-[#FFFFFF] leading-relaxed">{children}</div>
                </div>
              );
            }

            if (textContent.startsWith('⚠️ कमजोरी') || textContent.startsWith('सुधार गर्नुपर्ने पक्ष')) {
              return (
                <div className="my-3 p-3.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/40 text-slate-900 dark:text-[#FFFFFF] text-xs sm:text-sm leading-relaxed">
                  <div className="font-bold text-rose-700 dark:text-[#FB7185] mb-1">⚠️ कमजोरी वा सुधार गर्नुपर्ने पक्षहरू (Weaknesses):</div>
                  <div className="text-slate-900 dark:text-[#FFFFFF] leading-relaxed">{children}</div>
                </div>
              );
            }

            // Standard paragraph: High contrast pure dark in light mode, pure #FFFFFF in dark mode
            return (
              <p className="text-sm sm:text-base leading-relaxed text-slate-900 dark:text-[#FFFFFF] my-2.5 font-sans" {...props}>
                {renderContentWithKatex(children)}
              </p>
            );
          },

          // Blockquote as light-shaded callout box (NRB IT guidelines, legal clauses, acts, formulas)
          blockquote: ({ children, ...props }) => (
            <blockquote className="bg-slate-100 border-l-4 border-[#38BDF8] dark:bg-slate-900/90 dark:border-[#38BDF8] p-4 rounded-r-xl my-3 text-slate-900 dark:text-[#FFFFFF] text-xs sm:text-sm leading-relaxed shadow-xs" {...props}>
              {renderContentWithKatex(children)}
            </blockquote>
          ),

          // Lists with high contrast bullet points
          ul: ({ children, ...props }) => (
            <ul className="space-y-2.5 my-3 pl-1 text-slate-900 dark:text-[#FFFFFF]" {...props}>
              {children}
            </ul>
          ),

          ol: ({ children, ...props }) => (
            <ol className="list-decimal space-y-2.5 my-3 pl-5 text-sm sm:text-base text-slate-900 dark:text-[#FFFFFF]" {...props}>
              {children}
            </ol>
          ),

          li: ({ children, ...props }) => (
            <li className="text-sm sm:text-base text-slate-900 dark:text-[#FFFFFF] leading-relaxed flex items-start gap-2.5" {...props}>
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] shadow-[0_0_8px_rgba(74,222,128,0.8)] shrink-0 mt-2" />
              <div className="flex-1 text-slate-900 dark:text-[#FFFFFF]">{renderContentWithKatex(children)}</div>
            </li>
          ),

          strong: ({ children, ...props }) => (
            <strong className="font-black text-slate-950 dark:text-[#FFFFFF]" {...props}>
              {children}
            </strong>
          ),

          em: ({ children, ...props }) => (
            <em className="italic text-slate-900 dark:text-[#F8FAFC]" {...props}>
              {children}
            </em>
          ),

          pre: ({ children, ...props }) => {
            const childText = React.Children.toArray(children)
              .map(c => {
                if (typeof c === 'string') return c;
                if (React.isValidElement(c) && (c.props as any)?.children) {
                  const subChildren = (c.props as any).children;
                  return Array.isArray(subChildren) ? subChildren.join('') : String(subChildren || '');
                }
                return '';
              })
              .join('')
              .trim();

            const cleanSvgText = childText.trim();
            const svgMatch = cleanSvgText.match(/<svg[\s\S]*?<\/svg>/i);
            if (svgMatch) {
              const svgHtml = svgMatch[0];
              return (
                <div className="my-5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto flex flex-col items-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 self-start flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#4ADE80]"></span>
                    <span>अर्थशास्त्र रेखाचित्र (SVG Vector Model)</span>
                  </div>
                  <div 
                    className="max-w-full overflow-x-auto flex justify-center py-2"
                    dangerouslySetInnerHTML={{ __html: svgHtml }}
                  />
                </div>
              );
            }

            const isDiagramOrMath = 
              childText.includes('──') || 
              childText.includes('│') || 
              childText.includes('┌') || 
              childText.includes('┼') || 
              childText.includes('-->') || 
              childText.includes('==>') || 
              childText.includes('Demand') || 
              childText.includes('Supply') || 
              childText.includes('Cost') ||
              childText.includes('वक्र');

            return (
              <div className="my-5 rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-900 dark:bg-slate-950 text-[#4ADE80] shadow-md">
                <div className="bg-slate-800 dark:bg-slate-900 px-4 py-2 border-b border-slate-700 flex items-center justify-between text-xs text-slate-300 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                    </span>
                    <span className="font-sans font-bold text-white text-[11px] ml-1">
                      {isDiagramOrMath ? '📈 अर्थशास्त्र रेखाचित्र / हिसाब (Diagram & Formulas)' : 'कोड / रेखाचित्र'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-300 font-sans">
                    Loksewa & Banking Visuals
                  </span>
                </div>
                <pre {...props} className={`p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed whitespace-pre scrollbar-thin text-[#FFFFFF] ${props.className || ''}`}>
                  {children}
                </pre>
              </div>
            );
          },

          code: ({ children, ...props }) => (
            <code className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-[#38BDF8] font-mono text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-700" {...props}>
              {children}
            </code>
          ),

          hr: () => <hr className="my-6 border-slate-200 dark:border-slate-700" />
        }}
      >
        {normalizedContent}
      </Markdown>
    </div>
  );
};
