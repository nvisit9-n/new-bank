import React from 'react';
import katex from 'katex';

/**
 * Safely renders a LaTeX formula into HTML using KaTeX.
 * If KaTeX fails to parse, falls back to a clean readable string.
 */
export function renderLatexToHtml(latex: string, displayMode: boolean = true): string {
  if (!latex) return '';

  // Clean $$ or $ wrapping
  const cleaned = latex
    .trim()
    .replace(/^\$\$/, '')
    .replace(/\$\$$/, '')
    .replace(/^\$/, '')
    .replace(/\$$/, '')
    .trim();

  // Ensure fraction numerator and denominator have clean vertical clearance from the horizontal line
  // (Prevents descenders like 'p', 'y', 'g' and ascenders like 'Current Assets' from being cut through)
  let processed = cleaned;
  try {
    processed = processed.replace(
      /\\(?:d)?frac\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}/g,
      (match, num, den) => {
        if (num.includes('\\rule') || den.includes('\\rule')) return match;
        return `\\dfrac{${num}\\rule[-1.0ex]{0pt}{3.0ex}}{\\rule[0pt]{0pt}{2.8ex}${den}}`;
      }
    );
  } catch {
    processed = cleaned;
  }

  try {
    return katex.renderToString(processed, {
      displayMode,
      throwOnError: false,
      output: 'html',
      strict: false,
      minRuleThickness: 0.08
    });
  } catch (err) {
    console.warn('KaTeX render error:', err);
    return `<span class="katex-fallback font-mono font-bold text-blue-800">${cleaned
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
      .replace(/\\times/g, '×')
      .replace(/\\%/g, '%')}</span>`;
  }
}

/**
 * Parses markdown text containing $...$ or $$...$$ and converts them to KaTeX rendered HTML.
 */
export function parseMarkdownLatex(text: string): string {
  if (!text) return '';

  // 1. Block math $$...$$
  let result = text.replace(/\$\$([\s\S]+?)\$\$/g, (_match, formula) => {
    return `<div class="katex-block my-3 overflow-x-auto py-1 text-center">${renderLatexToHtml(formula, true)}</div>`;
  });

  // 2. Inline math $...$
  result = result.replace(/(^|[^\\])\$([^\$\n]+?)\$/g, (_match, prefix, formula) => {
    if (/^\d+(\.\d+)?$/.test(formula.trim())) {
      return `${prefix}$${formula}$`;
    }
    return `${prefix}<span class="katex-inline inline-block px-1 align-middle">${renderLatexToHtml(formula, false)}</span>`;
  });

  return result;
}

/**
 * Recursively inspects React children and replaces any LaTeX math enclosed in $ or $$ with KaTeX rendered nodes.
 */
export function renderContentWithKatex(children: React.ReactNode): React.ReactNode {
  if (typeof children === 'string') {
    if (!children.includes('$')) return children;

    const parts: React.ReactNode[] = [];
    const regex = /(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(children)) !== null) {
      if (match.index > lastIndex) {
        parts.push(children.substring(lastIndex, match.index));
      }
      const rawFormula = match[0];
      const isBlock = rawFormula.startsWith('$$');
      const formula = isBlock ? rawFormula.slice(2, -2) : rawFormula.slice(1, -1);

      // Skip currency ($50, $100)
      if (!isBlock && /^\d+(\.\d+)?$/.test(formula.trim())) {
        parts.push(rawFormula);
      } else {
        const html = renderLatexToHtml(formula, isBlock);
        parts.push(
          React.createElement('span', {
            key: `katex-${match.index}`,
            className: isBlock ? 'katex-block my-2 block overflow-x-auto text-center' : 'katex-inline inline-block px-1 align-middle',
            dangerouslySetInnerHTML: { __html: html }
          })
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < children.length) {
      parts.push(children.substring(lastIndex));
    }
    return parts;
  }

  if (Array.isArray(children)) {
    return React.Children.map(children, child => renderContentWithKatex(child));
  }

  if (React.isValidElement(children) && (children.props as any)?.children) {
    return React.cloneElement(children as React.ReactElement<any>, {
      children: renderContentWithKatex((children.props as any).children)
    });
  }

  return children;
}
