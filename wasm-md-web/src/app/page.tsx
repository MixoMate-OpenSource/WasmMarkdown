'use client';

import { useState, useEffect, useDeferredValue } from 'react';
import { useWasmLoader } from '@/hooks/useWasmLoader';

const INITIAL_MARKDOWN = `# ⚡ Welcome to WasmMarkdown!

WasmMarkdown is a next-generation, local-first documentation engine. By shifting text parsing from JavaScript to a compiled **Rust binary** running inside a **WebAssembly sandbox**, it delivers instant updates with zero typing lag or main-thread freezing.

---

## 🚀 Key Features

*   **Native Rust Performance** - Streaming Markdown parser powered by \`pulldown-cmark\`.
*   **Offline Privacy** - Your documents are parsed entirely in-browser; zero data is sent to external servers.
*   **Real-time Stats** - Live updates on word count, character count, and parser speed.
*   **GitHub-Flavored Markdown** - Built-in support for tables, strike-through, footnotes, and task-lists.

---

## 📊 Rich Table Support

| Feature | JavaScript Parsers | WebAssembly Parser |
| :--- | :---: | :---: |
| Heavy Documents | 🔴 Laggy / UI Freezes | 🟢 Butter-Smooth (60 FPS) |
| Garbage Collection | 🔴 Frequent Pauses | 🟢 Zero GC Overhead |
| Memory Management | 🔴 Dynamic Allocations | 🟢 Pre-allocated Sandbox |
| Execution Speed | 🟡 JIT Dependent | ⚡ Near-Native Speed |

---

## 📝 Interactive Task Lists

- [x] Integrate Rust \`pulldown-cmark\` parser
- [x] Configure WASM target and bindgen
- [x] Create Next.js 15 asynchronous client workspace
- [ ] Add PDF export capability
- [ ] Add custom themes support

---

## 💻 Code Block Example

\`\`\`rust
// This runs inside the isolated WebAssembly memory sandbox
#[wasm_bindgen]
pub fn render_markdown_to_html(input: &str) -> String {
    let mut options = Options::empty();
    options.insert(Options::ENABLE_TABLES);
    options.insert(Options::ENABLE_TASKLISTS);
    
    let parser = Parser::new_ext(input, options);
    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);
    
    html_output
}
\`\`\`

---

## 💡 Blockquote Accent

> "Performance is not just a feature; it's a fundamental requirement. By offloading computational parsing to WebAssembly, we liberate the browser's UI thread and redefine local-first editor responsiveness."
`;

export default function Home() {
  const { isLoaded, error, renderMarkdown } = useWasmLoader();
  const [markdown, setMarkdown] = useState(INITIAL_MARKDOWN);
  const deferredMarkdown = useDeferredValue(markdown);
  const [renderedHtml, setRenderedHtml] = useState('');
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [renderTime, setRenderTime] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  // Run WASM parsing
  useEffect(() => {
    if (!isLoaded) return;

    const start = performance.now();
    const html = renderMarkdown(deferredMarkdown);
    const end = performance.now();
    
    setRenderedHtml(html);
    setRenderTime(end - start);
  }, [deferredMarkdown, isLoaded]);

  // Statistics calculation
  const charCount = markdown.length;
  const wordCount = markdown.trim() === '' ? 0 : markdown.trim().split(/\s+/).length;
  const lineCount = markdown.split('\n').length;

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(renderedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy HTML:', err);
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rendered WasmMarkdown Document</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
    }
    pre {
      background: #f4f4f4;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
    }
    code {
      font-family: monospace;
      background: #eee;
      padding: 2px 4px;
      border-radius: 3px;
    }
    blockquote {
      border-left: 4px solid #a855f7;
      padding-left: 15px;
      color: #666;
      font-style: italic;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background: #f4f4f4;
    }
  </style>
</head>
<body>
  ${renderedHtml}
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950 text-zinc-100 selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Top Header Navigation */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-600 shadow-lg shadow-purple-500/20 animate-pulse-slow">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              WasmMarkdown
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-purple-400 border border-purple-500/20">v1.0.0</span>
            </h1>
            <p className="text-[10px] text-zinc-400">Rust + WebAssembly Documentation Engine</p>
          </div>
        </div>

        {/* Engine Status & Parsing Speed */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex flex-col items-end">
              <span className="text-zinc-500 uppercase text-[9px] font-semibold tracking-wider">Parser Speed</span>
              <span className="font-mono font-medium text-purple-400 text-sm">
                {isLoaded ? `${renderTime.toFixed(3)} ms` : '--'}
              </span>
            </div>
            <div className="w-[1px] h-8 bg-zinc-800" />
            <div className="flex flex-col items-end">
              <span className="text-zinc-500 uppercase text-[9px] font-semibold tracking-wider">Engine Status</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isLoaded ? 'bg-emerald-500 animate-ping-slow' : error ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'}`} />
                <span className={`font-semibold ${isLoaded ? 'text-emerald-400' : error ? 'text-rose-400' : 'text-amber-400'}`}>
                  {isLoaded ? 'WASM Active' : error ? 'Core Error' : 'Hydrating Engine...'}
                </span>
              </div>
            </div>
          </div>

          {/* View Mode Selectors */}
          <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${viewMode === 'split' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${viewMode === 'editor' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
            >
              Editor
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${viewMode === 'preview' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
            >
              Preview
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/90 z-20 p-6">
            <div className="max-w-md w-full p-6 border border-rose-500/20 bg-rose-500/5 rounded-xl text-center">
              <svg className="w-12 h-12 text-rose-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-bold text-white mb-2">WebAssembly Engine Load Error</h3>
              <p className="text-sm text-zinc-400 mb-4">{error.message}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 transition-colors rounded-lg text-sm font-semibold"
              >
                Retry Loading
              </button>
            </div>
          </div>
        )}

        {/* LEFT COLUMN: Markdown Input */}
        <section 
          className={`flex flex-col h-full border-r border-zinc-800 bg-zinc-900/20 transition-all duration-300 ${
            viewMode === 'split' ? 'w-1/2' : viewMode === 'editor' ? 'w-full' : 'hidden'
          }`}
        >
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-zinc-800 shrink-0 select-none">
            <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              raw_markdown.md
            </span>
            <button
              onClick={() => setMarkdown('')}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors uppercase font-semibold"
              title="Clear all text"
            >
              Clear Workspace
            </button>
          </div>

          {/* Text Editor Container */}
          <div className="flex-1 relative overflow-hidden font-mono text-sm leading-relaxed p-4">
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="# Type your Markdown content here..."
              className="w-full h-full bg-transparent text-zinc-300 resize-none outline-none border-none focus:ring-0 p-0 font-mono scrollbar-thin overflow-y-auto"
              disabled={!isLoaded}
            />
          </div>
        </section>

        {/* RIGHT COLUMN: Live rendered preview */}
        <section 
          className={`flex flex-col h-full bg-zinc-950 transition-all duration-300 ${
            viewMode === 'split' ? 'w-1/2' : viewMode === 'preview' ? 'w-full' : 'hidden'
          }`}
        >
          {/* Preview Header Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-zinc-800 shrink-0 select-none">
            <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              live_preview.html
            </span>
            
            {/* Action Bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyHtml}
                disabled={!isLoaded || renderedHtml === ''}
                className="px-2.5 py-1 text-[10px] font-bold uppercase rounded border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-zinc-300 transition-all active:scale-95 flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied HTML
                  </>
                ) : 'Copy HTML'}
              </button>
              <button
                onClick={handleDownloadMarkdown}
                disabled={markdown === ''}
                className="px-2.5 py-1 text-[10px] font-bold uppercase rounded border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-zinc-300 transition-all active:scale-95"
              >
                Get MD
              </button>
              <button
                onClick={handleDownloadHtml}
                disabled={renderedHtml === ''}
                className="px-2.5 py-1 text-[10px] font-bold uppercase rounded border border-purple-600 bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50 transition-all active:scale-95"
              >
                Get HTML
              </button>
            </div>
          </div>

          {/* HTML Preview Output */}
          <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
            {!isLoaded && renderedHtml === '' ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                <svg className="w-8 h-8 animate-spin text-purple-500 mb-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-xs font-semibold uppercase tracking-wider">Compiling engine...</p>
              </div>
            ) : markdown === '' ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-600 select-none">
                <svg className="w-10 h-10 mb-2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-xs uppercase tracking-wider font-semibold">Document Empty</p>
              </div>
            ) : (
              <div 
                className="markdown-preview"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            )}
          </div>
        </section>
      </div>

      {/* Footer Info / Stats */}
      <footer className="flex items-center justify-between px-6 py-2 border-t border-zinc-900 bg-zinc-950 text-[10px] text-zinc-500 shrink-0 font-mono select-none">
        <div className="flex items-center gap-4">
          <span>LINES: <strong className="text-zinc-400">{lineCount}</strong></span>
          <span>WORDS: <strong className="text-zinc-400">{wordCount}</strong></span>
          <span>CHARS: <strong className="text-zinc-400">{charCount}</strong></span>
        </div>
        <div>
          <span>100% Client-Side Engine • Offline Sandbox Protected</span>
        </div>
      </footer>
    </div>
  );
}
