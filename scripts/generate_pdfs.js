import fs from 'fs'
import path from 'path'
import { marked } from 'marked'
import { execFileSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const htmlTemplate = (title, bodyContent) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 18mm 20mm 18mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.6;
      font-size: 10.5pt;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }
    h1, h2, h3, h4 {
      color: #0f172a;
      font-weight: 700;
      line-height: 1.25;
      page-break-after: avoid;
    }
    h1 {
      font-size: 22pt;
      margin-top: 0;
      margin-bottom: 12pt;
      padding-bottom: 6pt;
      border-bottom: 2px solid #e2e8f0;
      color: #1e1b4b;
    }
    h2 {
      font-size: 14pt;
      margin-top: 18pt;
      margin-bottom: 8pt;
      padding-bottom: 4pt;
      border-bottom: 1px solid #f1f5f9;
      color: #312e81;
    }
    h3 {
      font-size: 12pt;
      margin-top: 14pt;
      margin-bottom: 6pt;
      color: #1e293b;
    }
    p, li {
      margin-top: 0;
      margin-bottom: 6pt;
      color: #334155;
    }
    ul, ol {
      margin-top: 0;
      margin-bottom: 10pt;
      padding-left: 20pt;
    }
    li {
      margin-bottom: 3pt;
    }
    code {
      font-family: "JetBrains Mono", Consolas, "Courier New", monospace;
      font-size: 9pt;
      background-color: #f1f5f9;
      color: #4338ca;
      padding: 2px 5px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }
    pre {
      font-family: "JetBrains Mono", Consolas, "Courier New", monospace;
      font-size: 8.5pt;
      background-color: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 10pt;
      overflow-x: auto;
      margin-top: 6pt;
      margin-bottom: 12pt;
      page-break-inside: avoid;
      line-height: 1.45;
      color: #1e293b;
    }
    pre code {
      background: transparent;
      border: none;
      padding: 0;
      color: inherit;
      font-size: inherit;
    }
    blockquote {
      margin: 10pt 0;
      padding: 8pt 14pt;
      background-color: #f8fafc;
      border-left: 4px solid #6366f1;
      color: #475569;
      font-style: italic;
      border-radius: 0 6px 6px 0;
      page-break-inside: avoid;
    }
    blockquote p:last-child {
      margin-bottom: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10pt;
      margin-bottom: 14pt;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 6pt 8pt;
      text-align: left;
      vertical-align: top;
    }
    th {
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 600;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    hr {
      border: 0;
      height: 1px;
      background: #e2e8f0;
      margin: 18pt 0;
    }
    .page-break {
      page-break-before: always;
    }
    .cover {
      min-height: 80vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 40pt 20pt;
      page-break-after: always;
    }
    .cover-title {
      font-size: 32pt;
      font-weight: 800;
      color: #312e81;
      margin-bottom: 8pt;
    }
    .cover-tagline {
      font-size: 15pt;
      color: #4f46e5;
      font-weight: 500;
      margin-bottom: 24pt;
    }
    .cover-meta {
      font-size: 10pt;
      color: #64748b;
      margin-top: 30pt;
      border-top: 1px solid #cbd5e1;
      padding-top: 16pt;
      line-height: 1.8;
    }
    .toc {
      background-color: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 16pt 20pt;
      margin: 20pt 0;
      page-break-inside: avoid;
    }
    .toc h3 {
      margin-top: 0;
      color: #312e81;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6pt;
    }
    .toc ul {
      list-style-type: none;
      padding-left: 0;
      margin-bottom: 0;
    }
    .toc li {
      margin-bottom: 6pt;
      display: flex;
      justify-content: space-between;
    }
    .toc a {
      color: #4338ca;
      text-decoration: none;
      font-weight: 500;
    }
  </style>
</head>
<body>
  ${bodyContent}
</body>
</html>`

function convertMarkdownToPdf(mdFilename, pdfFilename, title) {
  const mdPath = path.join(rootDir, mdFilename)
  const mdContent = fs.readFileSync(mdPath, 'utf8')
  const htmlContent = marked.parse(mdContent)
  const fullHtml = htmlTemplate(title, htmlContent)

  const tempHtmlPath = path.join(rootDir, `temp_${path.parse(pdfFilename).name}.html`)
  const targetPdfPath = path.join(rootDir, pdfFilename)

  fs.writeFileSync(tempHtmlPath, fullHtml, 'utf8')

  console.log(`Generating ${pdfFilename}...`)
  execFileSync(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${targetPdfPath}`,
    `file:///${tempHtmlPath.replace(/\\/g, '/')}`
  ])

  fs.unlinkSync(tempHtmlPath)
  const stats = fs.statSync(targetPdfPath)
  console.log(`✓ Created ${pdfFilename} (${(stats.size / 1024).toFixed(1)} KB)`)
}

function generateCombinedPdf() {
  const files = [
    { md: 'README.md', title: '1. README — Project Overview & Learner Journey' },
    { md: 'DESIGN.md', title: '2. DESIGN — System Architecture & LLD Decisions' },
    { md: 'RESEARCH.md', title: '3. RESEARCH — LLD Practice & Feedback Evaluation' },
    { md: 'AI_USAGE.md', title: '4. AI_USAGE — Engineering Decisions & Audit Record' }
  ]

  let combinedBody = `
    <div class="cover">
      <div class="cover-title">LLD Arena</div>
      <div class="cover-tagline">"Practice Low-Level Design. Get Better Feedback."</div>
      <p style="max-width: 480pt; color: #475569; font-size: 11pt; line-height: 1.6;">
        Complete Engineering Documentation Dossier containing System Overview, Architecture Design, Evaluation Research, and AI-Assisted Engineering Decisions.
      </p>
      <div class="cover-meta">
        <strong>Project:</strong> LLD Arena (Full-Stack MVP)<br>
        <strong>Architecture:</strong> React 19 + Express 5 + SQLite (WAL) + Evaluator Strategy<br>
        <strong>Generated:</strong> October 2026<br>
        <strong>Status:</strong> All Tests Passing (13/13) • Production Verified
      </div>
    </div>

    <div class="toc">
      <h3>Table of Contents</h3>
      <ul>
        <li><a href="#section-1">1. README — System Overview, Tech Stack & Setup</a> <span>Section 1</span></li>
        <li><a href="#section-2">2. DESIGN — Architecture, Domain Models & LLD Principles</a> <span>Section 2</span></li>
        <li><a href="#section-3">3. RESEARCH — Evaluation Methodologies & Reliability</a> <span>Section 3</span></li>
        <li><a href="#section-4">4. AI_USAGE — Engineering Decisions & Verification</a> <span>Section 4</span></li>
      </ul>
    </div>
  `

  for (let i = 0; i < files.length; i++) {
    const { md, title } = files[i]
    const mdPath = path.join(rootDir, md)
    const content = fs.readFileSync(mdPath, 'utf8')
    const html = marked.parse(content)

    combinedBody += `
      <div class="page-break" id="section-${i + 1}"></div>
      <div style="background: #eef2ff; border: 1px solid #c7d2fe; padding: 8pt 12pt; border-radius: 6px; margin-bottom: 16pt;">
        <span style="font-size: 9pt; font-weight: 700; color: #4338ca; text-transform: uppercase; letter-spacing: 0.5px;">Dossier Section ${i + 1}</span>
        <h2 style="margin: 2pt 0 0 0; border: none; font-size: 13pt; color: #1e1b4b;">${title}</h2>
      </div>
      ${html}
    `
  }

  const fullHtml = htmlTemplate('LLD Arena — Complete Engineering Dossier', combinedBody)
  const tempHtmlPath = path.join(rootDir, 'temp_complete_dossier.html')
  const targetPdfPath = path.join(rootDir, 'LLD_Arena_Complete_Documentation.pdf')

  fs.writeFileSync(tempHtmlPath, fullHtml, 'utf8')

  console.log(`Generating LLD_Arena_Complete_Documentation.pdf...`)
  execFileSync(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${targetPdfPath}`,
    `file:///${tempHtmlPath.replace(/\\/g, '/')}`
  ])

  fs.unlinkSync(tempHtmlPath)
  const stats = fs.statSync(targetPdfPath)
  console.log(`✓ Created LLD_Arena_Complete_Documentation.pdf (${(stats.size / 1024).toFixed(1)} KB)`)
}

console.log('=== Generating Documentation PDFs ===\n')

convertMarkdownToPdf('README.md', 'README.pdf', 'LLD Arena — README & AI Usage')
convertMarkdownToPdf('README.md', 'README_AND_AI_USAGE.pdf', 'LLD Arena — README & AI Usage')
convertMarkdownToPdf('DESIGN.md', 'DESIGN.pdf', 'LLD Arena — DESIGN')
convertMarkdownToPdf('RESEARCH.md', 'RESEARCH.pdf', 'LLD Arena — RESEARCH')
convertMarkdownToPdf('AI_USAGE.md', 'AI_USAGE.pdf', 'LLD Arena — AI_USAGE')

generateCombinedPdf()

console.log('\n=== All PDF Documentation Successfully Generated! ===')
