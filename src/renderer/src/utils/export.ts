import JSZip from 'jszip';
import { Project, ManuscriptItem } from '../types';

export function htmlToPlainText(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.innerText || temp.textContent || '';
}

export function htmlToMarkdown(html: string): string {
  let md = html;
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

export function compileManuscript(project: Project, includeMetadata = false): { text: string; markdown: string; html: string } {
  let textOut = `${project.title.toUpperCase()}\nAutore: ${project.author}\nData: ${new Date().toLocaleDateString()}\n\n${'='.repeat(40)}\n\n`;
  let mdOut = `# ${project.title}\n**Autore:** ${project.author}\n\n---\n\n`;
  let htmlOut = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${project.title}</title><style>
    body { font-family: 'Georgia', serif; line-height: 1.8; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; }
    h1 { text-align: center; margin-top: 50px; font-size: 28px; }
    h2 { margin-top: 40px; font-size: 22px; }
    p { text-indent: 1.5em; margin: 0 0 10px 0; }
    blockquote { font-style: italic; margin-left: 2em; border-left: 3px solid #ccc; padding-left: 1em; }
    .title-page { text-align: center; padding: 100px 0; page-break-after: always; }
    .title-page h1 { font-size: 36px; margin-bottom: 10px; }
    .title-page .author { font-size: 20px; color: #555; }
    .chapter-break { page-break-before: always; }
    .footnotes { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #ccc; font-size: 0.85em; }
  </style></head><body>
  <div class="title-page">
    <h1>${project.title}</h1>
    <div class="author">${project.author}</div>
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
      footnotesHtml = `<div class="footnotes">${item.footnotes.map(f => `<p><sup>[${f.number}]</sup> ${f.content}</p>`).join('')}</div>`;
      textOut += `Note a piè di pagina:\n${item.footnotes.map(f => `[${f.number}] ${f.content}`).join('\n')}\n\n`;
      mdOut += `\n**Note:**\n${item.footnotes.map(f => `[^${f.number}]: ${f.content}`).join('\n')}\n\n`;
    }

    htmlOut += `<div class="chapter-break"><h2>${item.title}</h2>${item.content || ''}${footnotesHtml}</div>`;
  });

  if (includeMetadata) {
    if (project.characters.length > 0) {
      textOut += `\n\n${'='.repeat(40)}\nPERSONAGGI\n${'='.repeat(40)}\n\n`;
      mdOut += `\n\n---\n# PERSONAGGI\n\n`;
      htmlOut += `<div class="chapter-break"><h1>PERSONAGGI</h1>`;

      project.characters.forEach(c => {
        textOut += `• ${c.name} (${c.role}) - ${c.goal}\n  ${c.physicalDesc}\n  ${c.psychology}\n\n`;
        mdOut += `### ${c.name} (${c.role})\n- **Obiettivo:** ${c.goal}\n- **Aspetto:** ${c.physicalDesc}\n- **Psicologia:** ${c.psychology}\n\n`;
        htmlOut += `<h3>${c.name} <em>(${c.role})</em></h3><p><strong>Obiettivo:</strong> ${c.goal}</p><p><strong>Aspetto:</strong> ${c.physicalDesc}</p><p><strong>Psicologia:</strong> ${c.psychology}</p>`;
      });
      htmlOut += `</div>`;
    }

    if (project.worldbuilding.length > 0) {
      textOut += `\n\n${'='.repeat(40)}\nAMBIENTAZIONE\n${'='.repeat(40)}\n\n`;
      mdOut += `\n\n---\n# AMBIENTAZIONE\n\n`;
      htmlOut += `<div class="chapter-break"><h1>AMBIENTAZIONE</h1>`;

      project.worldbuilding.forEach(w => {
        textOut += `• ${w.name} (${w.category})\n  ${w.description}\n\n`;
        mdOut += `### ${w.name} (${w.category})\n${w.description}\n\n`;
        htmlOut += `<h3>${w.name} <em>(${w.category})</em></h3><p>${w.description}</p>`;
      });
      htmlOut += `</div>`;
    }
  }

  htmlOut += `</body></html>`;

  return { text: textOut, markdown: mdOut, html: htmlOut };
}

/**
 * Generates an official Microsoft Word HTML Document (MIME compliant) with full Office XML namespaces.
 * When opened in MS Word, renders native page breaks, margins, typography, and footnotes.
 */
export function compileToWordDocument(project: Project, includeMetadata = false): string {
  const { html } = compileManuscript(project, includeMetadata);

  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${project.title}</title>
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
          font-family: 'Times New Roman', serif;
          font-size: 12pt;
          line-height: 1.5;
          color: #000000;
        }
        h1 {
          font-size: 24pt;
          font-weight: bold;
          text-align: center;
          margin-top: 36pt;
          margin-bottom: 18pt;
          page-break-before: always;
        }
        h2 {
          font-size: 18pt;
          font-weight: bold;
          margin-top: 28pt;
          margin-bottom: 14pt;
          page-break-before: always;
          mso-break-type: section-break;
        }
        h3 { font-size: 14pt; font-weight: bold; margin-top: 16pt; margin-bottom: 8pt; }
        p {
          text-indent: 24pt;
          margin-top: 0pt;
          margin-bottom: 6pt;
          line-height: 1.5;
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
        .title-page {
          text-align: center;
          padding-top: 150pt;
          page-break-after: always;
        }
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
        ${html}
      </div>
    </body>
    </html>
  `;
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

  // 6. content.opf
  const bookId = `urn:uuid:${project.id || 'folia-book-' + Date.now()}`;
  const opfContent = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="BookId">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${escapeXml(project.title)}</dc:title>
    <dc:creator>${escapeXml(project.author || 'Autore')}</dc:creator>
    <dc:identifier id="BookId">${bookId}</dc:identifier>
    <dc:language>${project.settings.language || 'it'}</dc:language>
    <meta property="dcterms:modified">${new Date().toISOString().split('.')[0]}Z</meta>
  </metadata>
  <manifest>
    <item id="style" href="stylesheet.css" media-type="text/css"/>
    <item id="title" href="title.xhtml" media-type="application/xhtml+xml"/>
    ${chapterFiles.map((cf, i) => `<item id="ch_${i + 1}" href="${cf}" media-type="application/xhtml+xml"/>`).join('\n    ')}
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="title"/>
    ${chapterFiles.map((_, i) => `<itemref idref="ch_${i + 1}"/>`).join('\n    ')}
  </spine>
</package>`;
  oebps.file('content.opf', opfContent);

  // 7. toc.ncx
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
    <navPoint id="navpoint-1" playOrder="1">
      <navLabel><text>Copertina / Titolo</text></navLabel>
      <content src="title.xhtml"/>
    </navPoint>
    ${sorted.map((item, idx) => `
    <navPoint id="navpoint-${idx + 2}" playOrder="${idx + 2}">
      <navLabel><text>${escapeXml(item.title)}</text></navLabel>
      <content src="${chapterFiles[idx]}"/>
    </navPoint>`).join('')}
  </navMap>
</ncx>`;
  oebps.file('toc.ncx', ncxContent);

  return await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cleanHtmlForEpub(html: string): string {
  // Ensure elements are self-closing for XHTML compliance
  return html
    .replace(/<img([^>]*?)(?<!\/)>/gi, '<img$1 />')
    .replace(/<br([^>]*?)(?<!\/)>/gi, '<br$1 />')
    .replace(/<hr([^>]*?)(?<!\/)>/gi, '<hr$1 />');
}
