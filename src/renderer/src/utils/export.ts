import JSZip from 'jszip';
import { Project, ManuscriptItem, FontFamily } from '../types';

export function getWordFontName(font?: FontFamily | string): string {
  switch (font) {
    case 'Garamond': return 'Garamond';
    case 'Cormorant Garamond': return 'Cormorant Garamond';
    case 'EB Garamond': return 'EB Garamond';
    case 'Times New Roman': return 'Times New Roman';
    case 'Georgia': return 'Georgia';
    case 'Baskerville': return 'Baskerville';
    case 'Palatino': return 'Palatino Linotype';
    case 'Book Antiqua': return 'Book Antiqua';
    case 'Lora': return 'Lora';
    case 'Merriweather': return 'Merriweather';
    case 'Spectral': return 'Spectral';
    case 'Crimson Pro': return 'Crimson Pro';
    case 'Libre Caslon Text': return 'Libre Caslon Text';
    case 'Cinzel': return 'Cinzel';
    case 'Playfair Display': return 'Playfair Display';
    case 'Plus Jakarta Sans': return 'Plus Jakarta Sans';
    case 'Inter': return 'Inter';
    case 'Outfit': return 'Outfit';
    case 'Montserrat': return 'Montserrat';
    case 'Raleway': return 'Raleway';
    case 'Arial': return 'Arial';
    case 'Verdana': return 'Verdana';
    case 'Calibri': return 'Calibri';
    case 'Courier New': return 'Courier New';
    case 'Courier Prime': return 'Courier Prime';
    case 'JetBrains Mono': return 'JetBrains Mono';
    case 'Consolas': return 'Consolas';
    default: return font || 'Garamond';
  }
}

export function getCssFontStack(font?: FontFamily | string): string {
  switch (font) {
    case 'Garamond': return "'EB Garamond', Garamond, 'Cormorant Garamond', Georgia, serif";
    case 'Cormorant Garamond': return "'Cormorant Garamond', Garamond, Georgia, serif";
    case 'Times New Roman': return "'Times New Roman', Times, 'Liberation Serif', serif";
    case 'Georgia': return "Georgia, 'Times New Roman', serif";
    case 'Baskerville': return "'Libre Baskerville', Baskerville, Georgia, serif";
    case 'Palatino': return "'Palatino Linotype', 'Book Antiqua', Palatino, serif";
    case 'Book Antiqua': return "'Book Antiqua', 'Palatino Linotype', Palatino, serif";
    case 'Lora': return "'Lora', Georgia, serif";
    case 'Merriweather': return "'Merriweather', Georgia, serif";
    case 'Spectral': return "'Spectral', Georgia, serif";
    case 'Crimson Pro': return "'Crimson Pro', 'Crimson Text', Garamond, serif";
    case 'Libre Caslon Text': return "'Libre Caslon Text', Caslon, Georgia, serif";
    case 'Cinzel': return "'Cinzel', Georgia, serif";
    case 'Playfair Display': return "'Playfair Display', Georgia, serif";
    case 'Plus Jakarta Sans': return "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";
    case 'Inter': return "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    case 'Outfit': return "'Outfit', 'Plus Jakarta Sans', sans-serif";
    case 'Montserrat': return "'Montserrat', sans-serif";
    case 'Raleway': return "'Raleway', sans-serif";
    case 'Arial': return "Arial, Helvetica, sans-serif";
    case 'Verdana': return "Verdana, Geneva, sans-serif";
    case 'Calibri': return "Calibri, 'Segoe UI', sans-serif";
    case 'Courier New': return "'Courier New', Courier, monospace";
    case 'Courier Prime': return "'Courier Prime', 'Courier New', monospace";
    case 'JetBrains Mono': return "'JetBrains Mono', Consolas, monospace";
    case 'Consolas': return "Consolas, 'Courier New', monospace";
    default: return font ? `'${font}', serif` : "'EB Garamond', Garamond, serif";
  }
}

export function htmlToPlainText(html: string): string {
  const temp = document.createElement('div');
  // Remove virtual pagination widgets and desk gaps if present
  const clean = html
    .replace(/<div class="folia-virtual-page-break[^"]*">[\s\S]*?<\/div>/gi, '')
    .replace(/<div class="folia-page-desk-gap[^"]*">[\s\S]*?<\/div>/gi, '');
  temp.innerHTML = clean;
  return temp.innerText || temp.textContent || '';
}

export function htmlToMarkdown(html: string): string {
  let md = html
    .replace(/<div class="folia-virtual-page-break[^"]*">[\s\S]*?<\/div>/gi, '')
    .replace(/<div class="folia-page-desk-gap[^"]*">[\s\S]*?<\/div>/gi, '');

  // Convert headers
  md = md.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n');
  md = md.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n');
  md = md.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n');
  // Formatting
  md = md.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b>(.*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i>(.*?)<\/i>/gi, '*$1*');
  md = md.replace(/<s>(.*?)<\/s>/gi, '~~$1~~');
  md = md.replace(/<strike>(.*?)<\/strike>/gi, '~~$1~~');
  // Blockquotes
  md = md.replace(/<blockquote>(.*?)<\/blockquote>/gi, '> $1\n\n');
  // Lists
  md = md.replace(/<li>(.*?)<\/li>/gi, '- $1\n');
  md = md.replace(/<ul>/gi, '\n');
  md = md.replace(/<\/ul>/gi, '\n');
  md = md.replace(/<ol>/gi, '\n');
  md = md.replace(/<\/ol>/gi, '\n');
  // Paragraphs and breaks
  md = md.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');
  md = md.replace(/<br\s*[\/]?>/gi, '\n');
  // Strip any remaining html tags
  md = md.replace(/<[^>]+>/g, '');
  // Unescape html entities
  const parser = new DOMParser();
  const dom = parser.parseFromString(`<!doctype html><body>${md}`, 'text/html');
  return dom.body.textContent || md;
}

export function compileManuscript(project: Project, includeMetadata = false): { text: string; markdown: string; html: string; bodyHtml: string } {
  let textOut = `${project.title.toUpperCase()}\nAutore: ${project.author || 'Autore Sconosciuto'}\nData: ${new Date().toLocaleDateString()}\n\n${'='.repeat(40)}\n\n`;
  let mdOut = `# ${project.title}\n**Autore:** ${project.author || 'Autore Sconosciuto'}\n\n---\n\n`;

  let bodyHtml = `
  <div class="title-page">
    <h1 class="book-title">${escapeXml(project.title)}</h1>
    ${project.author ? `<div class="book-author">${escapeXml(project.author)}</div>` : ''}
  </div>`;

  // Sort manuscript items by order
  const sorted = [...project.manuscript].sort((a, b) => a.order - b.order);

  sorted.forEach((item) => {
    const rawPlain = htmlToPlainText(item.content || '');
    const rawMd = htmlToMarkdown(item.content || '');

    textOut += `\n[ ${item.title} ]\n\n${rawPlain}\n\n`;
    mdOut += `\n## ${item.title}\n\n${rawMd}\n\n`;

    let footnotesHtml = '';
    if (item.footnotes && item.footnotes.length > 0) {
      footnotesHtml = `<div class="footnotes"><h4>Note</h4>${item.footnotes.map(f => `<p><sup>[${f.number}]</sup> ${escapeXml(f.content)}</p>`).join('')}</div>`;
      textOut += `Note a piè di pagina:\n${item.footnotes.map(f => `[${f.number}] ${f.content}`).join('\n')}\n\n`;
      mdOut += `\n**Note:**\n${item.footnotes.map(f => `[^${f.number}]: ${f.content}`).join('\n')}\n\n`;
    }

    // Clean inline virtual breaks from editor content
    const cleanContent = (item.content || '')
      .replace(/<div class="folia-virtual-page-break[^"]*">[\s\S]*?<\/div>/gi, '')
      .replace(/<div class="folia-page-desk-gap[^"]*">[\s\S]*?<\/div>/gi, '');

    const isTopLevelChapter = item.type === 'chapter' || (!item.parentId && item.type !== 'scene');
    const breakClass = isTopLevelChapter ? 'chapter-break' : 'scene-section';

    bodyHtml += `<div class="${breakClass}"><h2 class="chapter-heading">${escapeXml(item.title)}</h2><div class="chapter-content">${cleanContent}</div>${footnotesHtml}</div>`;
  });

  if (includeMetadata) {
    if (project.characters && project.characters.length > 0) {
      textOut += `\n\n${'='.repeat(40)}\nPERSONAGGI\n${'='.repeat(40)}\n\n`;
      mdOut += `\n\n---\n# PERSONAGGI\n\n`;
      bodyHtml += `<div class="chapter-break"><h1 class="meta-section-title">PERSONAGGI</h1>`;

      project.characters.forEach(c => {
        textOut += `• ${c.name} (${c.role}) - ${c.goal}\n  ${c.physicalDesc}\n  ${c.psychology}\n\n`;
        mdOut += `### ${c.name} (${c.role})\n- **Obiettivo:** ${c.goal}\n- **Aspetto:** ${c.physicalDesc}\n- **Psicologia:** ${c.psychology}\n\n`;
        bodyHtml += `<h3>${escapeXml(c.name)} <em>(${escapeXml(c.role || '')})</em></h3><p><strong>Obiettivo:</strong> ${escapeXml(c.goal || '')}</p><p><strong>Aspetto:</strong> ${escapeXml(c.physicalDesc || '')}</p><p><strong>Psicologia:</strong> ${escapeXml(c.psychology || '')}</p>`;
      });
      bodyHtml += `</div>`;
    }

    if (project.worldbuilding && project.worldbuilding.length > 0) {
      textOut += `\n\n${'='.repeat(40)}\nAMBIENTAZIONE\n${'='.repeat(40)}\n\n`;
      mdOut += `\n\n---\n# AMBIENTAZIONE\n\n`;
      bodyHtml += `<div class="chapter-break"><h1 class="meta-section-title">AMBIENTAZIONE</h1>`;

      project.worldbuilding.forEach(w => {
        textOut += `• ${w.name} (${w.category})\n  ${w.description}\n\n`;
        mdOut += `### ${w.name} (${w.category})\n${w.description}\n\n`;
        bodyHtml += `<h3>${escapeXml(w.name)} <em>(${escapeXml(w.category || '')})</em></h3><p>${escapeXml(w.description || '')}</p>`;
      });
      bodyHtml += `</div>`;
    }
  }

  const settings = project.settings || ({} as any);
  const bodyFont = settings.fontFamily || 'Garamond';
  const headingFont = settings.headingFontFamily || bodyFont;
  const cssBodyFont = getCssFontStack(bodyFont);
  const cssHeadingFont = getCssFontStack(headingFont);

  const fontSizePt = settings.fontSize || 12;
  const lineHeightVal = settings.lineHeight || 1.35;
  const indentCm = settings.firstLineIndent ?? 0.8;
  const pSpacing = settings.paragraphSpacing ?? 'none';

  let pMarginBottom = '0';
  if (pSpacing === 'none') {
    pMarginBottom = '0';
  } else if (pSpacing === 'tight') {
    pMarginBottom = '2pt';
  } else if (pSpacing === 'relaxed') {
    pMarginBottom = '8pt';
  } else {
    // 'normal'
    pMarginBottom = indentCm > 0 ? '0' : '4pt';
  }

  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${escapeXml(project.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Raleway:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 25mm 20mm;
      @bottom-right {
        content: counter(page);
        font-family: ${cssBodyFont};
        font-size: 10pt;
      }
    }
    body {
      font-family: ${cssBodyFont};
      font-size: ${fontSizePt}pt;
      line-height: ${lineHeightVal};
      color: #111111;
      margin: 0 auto;
      padding: 0;
      max-width: 100%;
    }
    .title-page {
      text-align: center;
      padding-top: 35vh;
      page-break-after: always;
      break-after: page;
    }
    .book-title {
      font-family: ${cssHeadingFont};
      font-size: 30pt;
      font-weight: bold;
      margin-bottom: 16pt;
    }
    .book-author {
      font-family: ${cssBodyFont};
      font-size: 16pt;
      color: #444444;
      font-style: italic;
    }
    .chapter-break {
      page-break-before: always;
      break-before: page;
      margin-top: 0;
    }
    .scene-section {
      margin-top: 24pt;
    }
    h2.chapter-heading {
      font-family: ${cssHeadingFont};
      font-size: 20pt;
      font-weight: bold;
      text-align: center;
      margin-top: 36pt;
      margin-bottom: 24pt;
    }
    h1.meta-section-title {
      font-family: ${cssHeadingFont};
      font-size: 24pt;
      font-weight: bold;
      text-align: center;
      margin-top: 36pt;
      margin-bottom: 24pt;
    }
    h3 {
      font-family: ${cssHeadingFont};
      font-size: 14pt;
      font-weight: bold;
      margin-top: 18pt;
      margin-bottom: 8pt;
    }
    p {
      text-indent: ${indentCm}cm;
      margin-top: 0;
      margin-bottom: ${pMarginBottom};
      line-height: ${lineHeightVal};
      text-align: justify;
      text-justify: inter-word;
    }
    blockquote {
      font-style: italic;
      margin: 12pt 2em;
      padding-left: 1em;
      border-left: 3px solid #ccc;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 16pt 0;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 6pt 8pt;
      text-align: left;
    }
    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    .footnotes {
      margin-top: 24pt;
      padding-top: 12pt;
      border-top: 1px solid #ddd;
      font-size: 9.5pt;
      color: #333;
    }
    .footnotes h4 {
      margin: 0 0 6pt 0;
      font-size: 10pt;
    }
    .footnotes p {
      text-indent: 0;
      margin-bottom: 4pt;
    }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;

  return { text: textOut, markdown: mdOut, html: fullHtml, bodyHtml };
}

/**
 * Generates an official Microsoft Word HTML Document (MIME compliant) with full Office XML namespaces.
 * When opened in MS Word, renders native page breaks, margins, typography, and footnotes.
 */
export function compileToWordDocument(project: Project, includeMetadata = false): string {
  const { bodyHtml } = compileManuscript(project, includeMetadata);

  const settings = project.settings || ({} as any);
  const bodyFont = settings.fontFamily || 'Garamond';
  const headingFont = settings.headingFontFamily || bodyFont;
  const wordBodyFont = getWordFontName(bodyFont);
  const wordHeadingFont = getWordFontName(headingFont);

  const fontSizePt = settings.fontSize || 12;
  const lineHeightVal = settings.lineHeight || 1.35;
  const indentCm = settings.firstLineIndent ?? 0.8;
  const pSpacing = settings.paragraphSpacing ?? 'none';
  const pMarginBottom = pSpacing === 'none' ? '0pt' : pSpacing === 'tight' ? '2pt' : pSpacing === 'relaxed' ? '8pt' : (indentCm > 0 ? '0pt' : '4pt');

  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${escapeXml(project.title)}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page Section1 {
          size: 595.3pt 841.9pt; /* A4 */
          margin: 70.85pt 70.85pt 70.85pt 70.85pt; /* 2.5 cm */
          mso-header-margin: 35.4pt;
          mso-footer-margin: 35.4pt;
          mso-paper-source: 0;
        }
        div.Section1 { page: Section1; }
        body {
          font-family: '${wordBodyFont}', Garamond, serif;
          font-size: ${fontSizePt}pt;
          line-height: ${lineHeightVal};
          color: #000000;
        }
        .title-page {
          text-align: center;
          padding-top: 150pt;
          page-break-after: always;
        }
        .book-title {
          font-family: '${wordHeadingFont}', sans-serif;
          font-size: 26pt;
          font-weight: bold;
          margin-bottom: 14pt;
        }
        .book-author {
          font-family: '${wordBodyFont}', Garamond, serif;
          font-size: 15pt;
          font-style: italic;
          color: #444444;
        }
        .chapter-break {
          page-break-before: always;
          margin-top: 0pt;
        }
        .scene-section {
          margin-top: 18pt;
        }
        h2.chapter-heading {
          font-family: '${wordHeadingFont}', sans-serif;
          font-size: 18pt;
          font-weight: bold;
          text-align: center;
          margin-top: 24pt;
          margin-bottom: 16pt;
        }
        h1.meta-section-title {
          font-family: '${wordHeadingFont}', sans-serif;
          font-size: 22pt;
          font-weight: bold;
          text-align: center;
          margin-top: 24pt;
          margin-bottom: 16pt;
        }
        h3 {
          font-family: '${wordHeadingFont}', sans-serif;
          font-size: 13pt;
          font-weight: bold;
          margin-top: 14pt;
          margin-bottom: 6pt;
        }
        p {
          text-indent: ${indentCm}cm;
          margin-top: 0pt;
          margin-bottom: ${pMarginBottom};
          line-height: ${lineHeightVal};
          text-align: justify;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 12pt 0;
        }
        th, td {
          border: 1pt solid #999;
          padding: 6pt 8pt;
          text-align: left;
        }
        th { background-color: #f2f2f2; font-weight: bold; }
        .footnotes {
          margin-top: 24pt;
          border-top: 1pt solid #ccc;
          padding-top: 12pt;
          font-size: 10pt;
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        ${bodyHtml}
      </div>
    </body>
    </html>
  `;
}

/**
 * Compiles the project into a true Microsoft Word (.docx) OpenXML package using JSZip.
 * Produces clean native paragraphs, headings, typography and chapter page breaks.
 */
export async function generateDocx(project: Project, includeMetadata = false): Promise<Uint8Array> {
  const zip = new JSZip();

  const settings = project.settings || ({} as any);
  const bodyFont = settings.fontFamily || 'Garamond';
  const headingFont = settings.headingFontFamily || bodyFont;
  const wordBodyFont = getWordFontName(bodyFont);
  const wordHeadingFont = getWordFontName(headingFont);

  const fontSizePt = settings.fontSize || 12;
  const lineHeightVal = settings.lineHeight || 1.35;
  const indentCm = settings.firstLineIndent ?? 0.8;
  const pSpacing = settings.paragraphSpacing ?? 'none';

  const wordLine = Math.round(lineHeightVal * 240);
  const wordIndent = Math.round(indentCm * 567);
  const halfPtSize = Math.round(fontSizePt * 2);

  let wordAfter = 0;
  if (pSpacing === 'none') {
    wordAfter = 0;
  } else if (pSpacing === 'tight') {
    wordAfter = 40; // 2pt
  } else if (pSpacing === 'relaxed') {
    wordAfter = 160; // 8pt
  } else {
    // 'normal': narrative/novel style with indent uses 0 spacing, block style uses 80 (4pt)
    wordAfter = indentCm > 0 ? 0 : 80;
  }

  // 1. [Content_Types].xml
  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/fontTable.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/>
</Types>`);

  // 2. _rels/.rels
  zip.folder('_rels')!.file('.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);

  // 3. word/_rels/document.xml.rels
  const wordFolder = zip.folder('word')!;
  wordFolder.folder('_rels')!.file('document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable" Target="fontTable.xml"/>
</Relationships>`);

  // 4. word/fontTable.xml
  wordFolder.file('fontTable.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:fonts xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:font w:name="${wordBodyFont}">
    <w:family w:val="roman"/>
    <w:pitch w:val="variable"/>
  </w:font>
  ${wordHeadingFont !== wordBodyFont ? `
  <w:font w:name="${wordHeadingFont}">
    <w:family w:val="swiss"/>
    <w:pitch w:val="variable"/>
  </w:font>` : ''}
</w:fonts>`);

  // 5. word/styles.xml
  wordFolder.file('styles.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="${wordBodyFont}" w:hAnsi="${wordBodyFont}" w:cs="${wordBodyFont}"/>
        <w:sz w:val="${halfPtSize}"/>
        <w:szCs w:val="${halfPtSize}"/>
        <w:lang w:val="it-IT"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:line="${wordLine}" w:lineRule="auto" w:after="${wordAfter}"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:pPr>
      <w:spacing w:line="${wordLine}" w:lineRule="auto" w:after="${wordAfter}"/>
      <w:ind w:firstLine="${wordIndent}"/>
      <w:jc w:val="both"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="${wordBodyFont}" w:hAnsi="${wordBodyFont}"/>
      <w:sz w:val="${halfPtSize}"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:next w:val="Normal"/>
    <w:pPr>
      <w:keepNext/>
      <w:spacing w:before="600" w:after="240"/>
      <w:ind w:firstLine="0"/>
      <w:jc w:val="center"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="${wordHeadingFont}" w:hAnsi="${wordHeadingFont}"/>
      <w:b/>
      <w:sz w:val="36"/>
      <w:szCs w:val="36"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:basedOn w:val="Normal"/>
    <w:next w:val="Normal"/>
    <w:pPr>
      <w:keepNext/>
      <w:spacing w:before="360" w:after="180"/>
      <w:ind w:firstLine="0"/>
      <w:jc w:val="left"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="${wordHeadingFont}" w:hAnsi="${wordHeadingFont}"/>
      <w:b/>
      <w:sz w:val="28"/>
      <w:szCs w:val="28"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading3">
    <w:name w:val="heading 3"/>
    <w:basedOn w:val="Normal"/>
    <w:next w:val="Normal"/>
    <w:pPr>
      <w:keepNext/>
      <w:spacing w:before="240" w:after="120"/>
      <w:ind w:firstLine="0"/>
      <w:jc w:val="left"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="${wordHeadingFont}" w:hAnsi="${wordHeadingFont}"/>
      <w:b/>
      <w:i/>
      <w:sz w:val="24"/>
      <w:szCs w:val="24"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr>
      <w:spacing w:before="2800" w:after="300"/>
      <w:ind w:firstLine="0"/>
      <w:jc w:val="center"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="${wordHeadingFont}" w:hAnsi="${wordHeadingFont}"/>
      <w:b/>
      <w:sz w:val="52"/>
      <w:szCs w:val="52"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Subtitle">
    <w:name w:val="Subtitle"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr>
      <w:spacing w:before="120" w:after="1800"/>
      <w:ind w:firstLine="0"/>
      <w:jc w:val="center"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="${wordBodyFont}" w:hAnsi="${wordBodyFont}"/>
      <w:i/>
      <w:sz w:val="28"/>
      <w:szCs w:val="28"/>
      <w:color w:val="555555"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Quote">
    <w:name w:val="Quote"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr>
      <w:spacing w:before="200" w:after="200" w:line="${wordLine}" w:lineRule="auto"/>
      <w:ind w:left="720" w:right="720" w:firstLine="0"/>
      <w:jc w:val="both"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="${wordBodyFont}" w:hAnsi="${wordBodyFont}"/>
      <w:i/>
    </w:rPr>
  </w:style>
</w:styles>`);

  // 5. Build word/document.xml content
  let bodyXml = '';

  // Title page
  bodyXml += `
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Title"/>
      </w:pPr>
      <w:r>
        <w:t xml:space="preserve">${escapeXml(project.title)}</w:t>
      </w:r>
    </w:p>
    ${project.author ? `
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Subtitle"/>
      </w:pPr>
      <w:r>
        <w:t xml:space="preserve">${escapeXml(project.author)}</w:t>
      </w:r>
    </w:p>` : ''}
    <w:p>
      <w:r>
        <w:br w:type="page"/>
      </w:r>
    </w:p>
  `;

  const sorted = [...project.manuscript].sort((a, b) => a.order - b.order);

  sorted.forEach((item, index) => {
    const isTopLevelChapter = item.type === 'chapter' || (!item.parentId && item.type !== 'scene');

    // Add page break only for chapters after the title page
    if (index > 0 && isTopLevelChapter) {
      bodyXml += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
    }

    // Heading
    const styleName = isTopLevelChapter ? 'Heading1' : 'Heading2';
    bodyXml += `
      <w:p>
        <w:pPr>
          <w:pStyle w:val="${styleName}"/>
        </w:pPr>
        <w:r>
          <w:t xml:space="preserve">${escapeXml(item.title)}</w:t>
        </w:r>
      </w:p>
    `;

    // Content paragraphs
    const cleanContent = (item.content || '')
      .replace(/<div class="folia-virtual-page-break[^"]*">[\s\S]*?<\/div>/gi, '')
      .replace(/<div class="folia-page-desk-gap[^"]*">[\s\S]*?<\/div>/gi, '');

    bodyXml += convertHtmlToOpenXml(cleanContent);

    // Footnotes if any
    if (item.footnotes && item.footnotes.length > 0) {
      bodyXml += `
        <w:p>
          <w:pPr>
            <w:spacing w:before="360" w:after="120"/>
            <w:ind w:firstLine="0"/>
          </w:pPr>
          <w:r>
            <w:rPr><w:color w:val="888888"/></w:rPr>
            <w:t xml:space="preserve">────────────────────</w:t>
          </w:r>
        </w:p>
      `;

      item.footnotes.forEach(f => {
        bodyXml += `
          <w:p>
            <w:pPr>
              <w:spacing w:line="280" w:lineRule="auto" w:after="60"/>
              <w:ind w:firstLine="0"/>
            </w:pPr>
            <w:r>
              <w:rPr><w:vertAlign w:val="superscript"/><w:b/></w:rPr>
              <w:t xml:space="preserve">[${f.number}] </w:t>
            </w:r>
            <w:r>
              <w:rPr><w:sz w:val="20"/></w:rPr>
              <w:t xml:space="preserve">${escapeXml(f.content)}</w:t>
            </w:r>
          </w:p>
        `;
      });
    }
  });

  // Include metadata if requested
  if (includeMetadata) {
    if (project.characters && project.characters.length > 0) {
      bodyXml += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
      bodyXml += `
        <w:p>
          <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
          <w:r><w:t xml:space="preserve">PERSONAGGI</w:t></w:r>
        </w:p>
      `;

      project.characters.forEach(c => {
        bodyXml += `
          <w:p>
            <w:pPr><w:pStyle w:val="Heading2"/></w:pPr>
            <w:r><w:t xml:space="preserve">${escapeXml(c.name)} (${escapeXml(c.role || '')})</w:t></w:r>
          </w:p>
          <w:p>
            <w:pPr><w:pStyle w:val="Normal"/><w:ind w:firstLine="0"/></w:pPr>
            <w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">Obiettivo: </w:t></w:r>
            <w:r><w:t xml:space="preserve">${escapeXml(c.goal || '-')}</w:t></w:r>
          </w:p>
          <w:p>
            <w:pPr><w:pStyle w:val="Normal"/><w:ind w:firstLine="0"/></w:pPr>
            <w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">Aspetto: </w:t></w:r>
            <w:r><w:t xml:space="preserve">${escapeXml(c.physicalDesc || '-')}</w:t></w:r>
          </w:p>
          <w:p>
            <w:pPr><w:pStyle w:val="Normal"/><w:ind w:firstLine="0"/></w:pPr>
            <w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">Psicologia: </w:t></w:r>
            <w:r><w:t xml:space="preserve">${escapeXml(c.psychology || '-')}</w:t></w:r>
          </w:p>
        `;
      });
    }

    if (project.worldbuilding && project.worldbuilding.length > 0) {
      bodyXml += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
      bodyXml += `
        <w:p>
          <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
          <w:r><w:t xml:space="preserve">AMBIENTAZIONE</w:t></w:r>
        </w:p>
      `;

      project.worldbuilding.forEach(w => {
        bodyXml += `
          <w:p>
            <w:pPr><w:pStyle w:val="Heading2"/></w:pPr>
            <w:r><w:t xml:space="preserve">${escapeXml(w.name)} (${escapeXml(w.category || '')})</w:t></w:r>
          </w:p>
          <w:p>
            <w:pPr><w:pStyle w:val="Normal"/><w:ind w:firstLine="0"/></w:pPr>
            <w:r><w:t xml:space="preserve">${escapeXml(w.description || '-')}</w:t></w:r>
          </w:p>
        `;
      });
    }
  }

  // Section properties (A4 with 2.5cm margins)
  const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${bodyXml}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1418" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  wordFolder.file('document.xml', docXml);

  return await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
}

function convertHtmlToOpenXml(html: string): string {
  if (!html || !html.trim()) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const container = doc.body.firstElementChild;
  if (!container) return '';

  let xml = '';

  const processBlock = (el: Element) => {
    const tag = el.tagName.toLowerCase();

    if (tag === 'p') {
      const runs = parseInlineXml(el);
      xml += `<w:p><w:pPr><w:pStyle w:val="Normal"/></w:pPr>${runs}</w:p>`;
    } else if (tag === 'h1') {
      const runs = parseInlineXml(el);
      xml += `<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr>${runs}</w:p>`;
    } else if (tag === 'h2') {
      const runs = parseInlineXml(el);
      xml += `<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr>${runs}</w:p>`;
    } else if (tag === 'h3') {
      const runs = parseInlineXml(el);
      xml += `<w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr>${runs}</w:p>`;
    } else if (tag === 'blockquote') {
      const runs = parseInlineXml(el);
      xml += `<w:p><w:pPr><w:pStyle w:val="Quote"/></w:pPr>${runs}</w:p>`;
    } else if (tag === 'ul' || tag === 'ol') {
      Array.from(el.children).forEach((li) => {
        const runs = parseInlineXml(li);
        xml += `<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720" w:hanging="360" w:firstLine="0"/></w:pPr><w:r><w:t xml:space="preserve">• </w:t></w:r>${runs}</w:p>`;
      });
    } else if (tag === 'table') {
      xml += '<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/><w:left w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/><w:right w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/></w:tblBorders></w:tblPr>';
      Array.from(el.querySelectorAll('tr')).forEach(tr => {
        xml += '<w:tr>';
        Array.from(tr.children).forEach(cell => {
          xml += `<w:tc><w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:firstLine="0"/></w:pPr>${parseInlineXml(cell)}</w:p></w:tc>`;
        });
        xml += '</w:tr>';
      });
      xml += '</w:tbl>';
    } else if (tag === 'hr') {
      xml += '<w:p><w:pPr><w:spacing w:before="240" w:after="240"/><w:jc w:val="center"/></w:pPr><w:r><w:t xml:space="preserve">* * *</w:t></w:r></w:p>';
    } else if (tag === 'div') {
      if (el.classList.contains('folia-page-break') || el.getAttribute('data-page-break') === 'true') {
        xml += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
      } else {
        Array.from(el.children).forEach(child => processBlock(child));
      }
    } else {
      const runs = parseInlineXml(el);
      if (runs.trim()) {
        xml += `<w:p><w:pPr><w:pStyle w:val="Normal"/></w:pPr>${runs}</w:p>`;
      }
    }
  };

  Array.from(container.children).forEach(child => {
    processBlock(child);
  });

  return xml;
}

function parseInlineXml(node: Node): string {
  let runs = '';

  const walk = (n: Node, activeFormatting: { bold?: boolean; italic?: boolean; underline?: boolean; strike?: boolean; sup?: boolean; sub?: boolean }) => {
    if (n.nodeType === Node.TEXT_NODE) {
      const text = n.textContent || '';
      if (text) {
        let rPr = '';
        if (activeFormatting.bold) rPr += '<w:b/>';
        if (activeFormatting.italic) rPr += '<w:i/>';
        if (activeFormatting.underline) rPr += '<w:u w:val="single"/>';
        if (activeFormatting.strike) rPr += '<w:strike/>';
        if (activeFormatting.sup) rPr += '<w:vertAlign w:val="superscript"/>';
        if (activeFormatting.sub) rPr += '<w:vertAlign w:val="subscript"/>';

        runs += `<w:r>${rPr ? `<w:rPr>${rPr}</w:rPr>` : ''}<w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>`;
      }
    } else if (n.nodeType === Node.ELEMENT_NODE) {
      const el = n as HTMLElement;
      const tag = el.tagName.toLowerCase();

      if (tag === 'br') {
        runs += '<w:r><w:br/></w:r>';
        return;
      }

      const nextFmt = { ...activeFormatting };
      if (tag === 'b' || tag === 'strong') nextFmt.bold = true;
      if (tag === 'i' || tag === 'em') nextFmt.italic = true;
      if (tag === 'u') nextFmt.underline = true;
      if (tag === 's' || tag === 'strike') nextFmt.strike = true;
      if (tag === 'sup') nextFmt.sup = true;
      if (tag === 'sub') nextFmt.sub = true;

      Array.from(n.childNodes).forEach(child => walk(child, nextFmt));
    }
  };

  Array.from(node.childNodes).forEach(child => walk(child, {}));
  return runs;
}

/**
 * Compiles the project into an EPUB 3 valid e-book container using JSZip.
 */
export async function generateEpub(project: Project, includeMetadata = false): Promise<Uint8Array> {
  const zip = new JSZip();

  // 1. mimetype (must be uncompressed first file)
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

  // 2. META-INF/container.xml
  zip.folder('META-INF')!.file('container.xml', `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

  const oebps = zip.folder('OEBPS')!;

  // 3. Stylesheet
  oebps.file('stylesheet.css', `
    body { font-family: serif; line-height: 1.6; margin: 5%; color: #111; }
    h1 { text-align: center; margin-top: 20%; font-size: 2em; }
    h2 { margin-top: 15%; font-size: 1.5em; text-align: center; }
    p { text-indent: 1.5em; margin: 0 0 0.5em 0; }
    .author { text-align: center; font-style: italic; font-size: 1.2em; }
    .footnotes { margin-top: 2em; border-top: 1px solid #ddd; font-size: 0.85em; }
  `);

  const sorted = [...project.manuscript].sort((a, b) => a.order - b.order);

  // 4. Title page
  oebps.file('title.xhtml', `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${escapeXml(project.title)}</title>
  <link rel="stylesheet" href="stylesheet.css" type="text/css"/>
</head>
<body>
  <h1>${escapeXml(project.title)}</h1>
  <p class="author">${escapeXml(project.author || 'Autore Sconosciuto')}</p>
</body>
</html>`);

  // 5. Chapters
  const chapterFiles: string[] = [];
  sorted.forEach((item, idx) => {
    const filename = `chapter_${idx + 1}.xhtml`;
    chapterFiles.push(filename);

    let footnotesHtml = '';
    if (item.footnotes && item.footnotes.length > 0) {
      footnotesHtml = `<div class="footnotes"><h4>Note</h4>${item.footnotes.map(f => `<p><sup>[${f.number}]</sup> ${escapeXml(f.content)}</p>`).join('')}</div>`;
    }

    oebps.file(filename, `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${escapeXml(item.title)}</title>
  <link rel="stylesheet" href="stylesheet.css" type="text/css"/>
</head>
<body>
  <h2>${escapeXml(item.title)}</h2>
  ${cleanHtmlForEpub(item.content || '')}
  ${footnotesHtml}
</body>
</html>`);
  });

  // Metadata files if included
  const metaFiles: { id: string; filename: string; title: string }[] = [];
  if (includeMetadata) {
    if (project.characters && project.characters.length > 0) {
      const charFilename = 'characters.xhtml';
      metaFiles.push({ id: 'meta_chars', filename: charFilename, title: 'Personaggi' });

      let charsHtml = `<h2>PERSONAGGI</h2>`;
      project.characters.forEach(c => {
        charsHtml += `<h3>${escapeXml(c.name)} <em>(${escapeXml(c.role || '')})</em></h3>
<p><strong>Obiettivo:</strong> ${escapeXml(c.goal || '-')}</p>
<p><strong>Aspetto:</strong> ${escapeXml(c.physicalDesc || '-')}</p>
<p><strong>Psicologia:</strong> ${escapeXml(c.psychology || '-')}</p>`;
      });

      oebps.file(charFilename, `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Personaggi</title>
  <link rel="stylesheet" href="stylesheet.css" type="text/css"/>
</head>
<body>
  ${charsHtml}
</body>
</html>`);
    }

    if (project.worldbuilding && project.worldbuilding.length > 0) {
      const worldFilename = 'world.xhtml';
      metaFiles.push({ id: 'meta_world', filename: worldFilename, title: 'Ambientazione' });

      let worldHtml = `<h2>AMBIENTAZIONE</h2>`;
      project.worldbuilding.forEach(w => {
        worldHtml += `<h3>${escapeXml(w.name)} <em>(${escapeXml(w.category || '')})</em></h3>
<p>${escapeXml(w.description || '-')}</p>`;
      });

      oebps.file(worldFilename, `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Ambientazione</title>
  <link rel="stylesheet" href="stylesheet.css" type="text/css"/>
</head>
<body>
  ${worldHtml}
</body>
</html>`);
    }
  }

  // 6. content.opf
  const bookId = `urn:uuid:${project.id || 'folia-book-' + Date.now()}`;
  const opfContent = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="BookId">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${escapeXml(project.title)}</dc:title>
    <dc:creator>${escapeXml(project.author || 'Autore')}</dc:creator>
    <dc:identifier id="BookId">${bookId}</dc:identifier>
    <dc:language>${project.settings?.language || 'it'}</dc:language>
    <meta property="dcterms:modified">${new Date().toISOString().split('.')[0]}Z</meta>
  </metadata>
  <manifest>
    <item id="style" href="stylesheet.css" media-type="text/css"/>
    <item id="title" href="title.xhtml" media-type="application/xhtml+xml"/>
    ${chapterFiles.map((cf, i) => `<item id="ch_${i + 1}" href="${cf}" media-type="application/xhtml+xml"/>`).join('\n    ')}
    ${metaFiles.map((mf) => `<item id="${mf.id}" href="${mf.filename}" media-type="application/xhtml+xml"/>`).join('\n    ')}
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="title"/>
    ${chapterFiles.map((_, i) => `<itemref idref="ch_${i + 1}"/>`).join('\n    ')}
    ${metaFiles.map((mf) => `<itemref idref="${mf.id}"/>`).join('\n    ')}
  </spine>
</package>`;
  oebps.file('content.opf', opfContent);

  // 7. toc.ncx
  let navIndex = 1;
  const ncxContent = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="${bookId}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${escapeXml(project.title)}</text></docTitle>
  <navMap>
    <navPoint id="navpoint-${navIndex}" playOrder="${navIndex++}">
      <navLabel><text>Copertina / Titolo</text></navLabel>
      <content src="title.xhtml"/>
    </navPoint>
    ${sorted.map((item, idx) => `
    <navPoint id="navpoint-${navIndex}" playOrder="${navIndex++}">
      <navLabel><text>${escapeXml(item.title)}</text></navLabel>
      <content src="${chapterFiles[idx]}"/>
    </navPoint>`).join('')}
    ${metaFiles.map((mf) => `
    <navPoint id="navpoint-${navIndex}" playOrder="${navIndex++}">
      <navLabel><text>${escapeXml(mf.title)}</text></navLabel>
      <content src="${mf.filename}"/>
    </navPoint>`).join('')}
  </navMap>
</ncx>`;
  oebps.file('toc.ncx', ncxContent);

  return await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
}

function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cleanHtmlForEpub(html: string): string {
  // Ensure elements are self-closing for XHTML compliance & replace unescaped non-XML entities
  return html
    .replace(/<div class="folia-virtual-page-break[^"]*">[\s\S]*?<\/div>/gi, '')
    .replace(/<div class="folia-page-desk-gap[^"]*">[\s\S]*?<\/div>/gi, '')
    .replace(/&nbsp;/gi, '&#160;')
    .replace(/<img([^>]*?)(?<!\/)>/gi, '<img$1 />')
    .replace(/<br([^>]*?)(?<!\/)>/gi, '<br$1 />')
    .replace(/<hr([^>]*?)(?<!\/)>/gi, '<hr$1 />');
}

